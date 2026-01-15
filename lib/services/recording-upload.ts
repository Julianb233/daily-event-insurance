/**
 * Recording Upload Service
 *
 * Handles uploading screen recordings captured by rrweb to Supabase Storage
 * and creating database records for playback and analysis.
 *
 * Features:
 * - Gzip compression for reduced storage/bandwidth
 * - Supabase Storage integration
 * - Database record creation
 * - Signed URL generation for secure playback
 */

import { createAdminClient } from "@/lib/supabase/server"
import { db, isDbConfigured, onboardingRecordings } from "@/lib/db"
import { eq } from "drizzle-orm"

// ============================================================================
// Types
// ============================================================================

/** Recording event from rrweb */
export interface RecordingEvent {
  type: number
  timestamp: number
  data: unknown
  delay?: number
}

/** Metadata for recording upload */
export interface RecordingMetadata {
  partnerId?: string
  conversationId?: string
  onboardingStep?: number
  stepName?: string
  duration: number
}

/** Upload result */
export interface UploadResult {
  success: boolean
  recordingId?: string
  recordingUrl?: string
  error?: string
}

/** Recording record from database */
export interface RecordingRecord {
  id: string
  partnerId: string | null
  conversationId: string | null
  recordingUrl: string
  duration: number | null
  onboardingStep: number | null
  stepName: string | null
  issuesDetected: string | null
  status: string | null
  createdAt: Date
}

/** Recording with decompressed events */
export interface RecordingWithEvents extends RecordingRecord {
  events: RecordingEvent[]
}

/** Recording status enum */
export type RecordingStatus = "processing" | "ready" | "analyzed" | "failed"

// ============================================================================
// Constants
// ============================================================================

const STORAGE_BUCKET = "onboarding-recordings"
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 // 1 hour
const MAX_RECORDING_SIZE_BYTES = 50 * 1024 * 1024 // 50MB max

// ============================================================================
// Compression Utilities
// ============================================================================

/**
 * Compress events using gzip compression
 * Falls back to uncompressed JSON if compression unavailable
 */
export async function compressEvents(events: RecordingEvent[]): Promise<{
  data: Uint8Array
  compressed: boolean
  originalSize: number
  compressedSize: number
}> {
  const jsonString = JSON.stringify(events)
  const originalSize = new TextEncoder().encode(jsonString).length

  // Check size limit before compression
  if (originalSize > MAX_RECORDING_SIZE_BYTES) {
    throw new Error(
      `Recording size (${Math.round(originalSize / 1024 / 1024)}MB) exceeds maximum allowed (${Math.round(MAX_RECORDING_SIZE_BYTES / 1024 / 1024)}MB)`
    )
  }

  // Try to use CompressionStream (modern browsers)
  if (typeof CompressionStream !== "undefined") {
    try {
      const encoder = new TextEncoder()
      const inputBytes = encoder.encode(jsonString)

      const compressionStream = new CompressionStream("gzip")
      const writer = compressionStream.writable.getWriter()
      const reader = compressionStream.readable.getReader()

      // Write data to compression stream
      writer.write(inputBytes)
      writer.close()

      // Read compressed data
      const chunks: Uint8Array[] = []
      let totalLength = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        totalLength += value.length
      }

      // Combine chunks
      const compressedData = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        compressedData.set(chunk, offset)
        offset += chunk.length
      }

      console.log(
        `[RecordingUpload] Compressed ${Math.round(originalSize / 1024)}KB to ${Math.round(compressedData.length / 1024)}KB (${Math.round((1 - compressedData.length / originalSize) * 100)}% reduction)`
      )

      return {
        data: compressedData,
        compressed: true,
        originalSize,
        compressedSize: compressedData.length,
      }
    } catch (compressionError) {
      console.warn("[RecordingUpload] Compression failed, falling back to uncompressed:", compressionError)
    }
  }

  // Fallback: return uncompressed JSON as Uint8Array
  const uncompressedData = new TextEncoder().encode(jsonString)
  return {
    data: uncompressedData,
    compressed: false,
    originalSize,
    compressedSize: uncompressedData.length,
  }
}

/**
 * Decompress gzip-compressed events
 * Handles both compressed and uncompressed data
 */
export async function decompressEvents(
  data: ArrayBuffer,
  isCompressed: boolean
): Promise<RecordingEvent[]> {
  if (!isCompressed) {
    const jsonString = new TextDecoder().decode(data)
    return JSON.parse(jsonString) as RecordingEvent[]
  }

  // Decompress using DecompressionStream
  if (typeof DecompressionStream !== "undefined") {
    try {
      const decompressionStream = new DecompressionStream("gzip")
      const writer = decompressionStream.writable.getWriter()
      const reader = decompressionStream.readable.getReader()

      writer.write(new Uint8Array(data))
      writer.close()

      const chunks: Uint8Array[] = []
      let totalLength = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        totalLength += value.length
      }

      const decompressedData = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        decompressedData.set(chunk, offset)
        offset += chunk.length
      }

      const jsonString = new TextDecoder().decode(decompressedData)
      return JSON.parse(jsonString) as RecordingEvent[]
    } catch (error) {
      console.error("[RecordingUpload] Decompression failed:", error)
      throw new Error("Failed to decompress recording data")
    }
  }

  throw new Error("Decompression not supported in this environment")
}

// ============================================================================
// Recording Upload Service
// ============================================================================

export class RecordingUploadService {
  /**
   * Upload a recording to Supabase Storage and create a database record
   */
  async uploadRecording(
    events: RecordingEvent[],
    metadata: RecordingMetadata
  ): Promise<UploadResult> {
    if (!events || events.length === 0) {
      return {
        success: false,
        error: "No recording events provided",
      }
    }

    const supabase = createAdminClient()
    const recordingId = crypto.randomUUID()

    try {
      // 1. Compress events
      const { data: compressedData, compressed, originalSize, compressedSize } = await compressEvents(events)

      // 2. Generate storage path
      const storagePath = this.generateStoragePath(metadata.partnerId, recordingId, compressed)

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, compressedData, {
          contentType: compressed ? "application/gzip" : "application/json",
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("[RecordingUpload] Storage upload failed:", uploadError)
        return {
          success: false,
          error: `Storage upload failed: ${uploadError.message}`,
        }
      }

      // 4. Generate recording URL (signed URL for security)
      const recordingUrl = await this.generateRecordingUrl(storagePath)
      if (!recordingUrl) {
        // Cleanup uploaded file
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
        return {
          success: false,
          error: "Failed to generate recording URL",
        }
      }

      // 5. Create database record
      if (isDbConfigured() && db) {
        try {
          await db.insert(onboardingRecordings).values({
            id: recordingId,
            partnerId: metadata.partnerId || null,
            conversationId: metadata.conversationId || null,
            recordingUrl: storagePath, // Store path, generate signed URL on retrieval
            duration: metadata.duration || null,
            onboardingStep: metadata.onboardingStep || null,
            stepName: metadata.stepName || null,
            status: "ready",
            issuesDetected: null,
          })

          console.log(`[RecordingUpload] Recording ${recordingId} saved (${Math.round(compressedSize / 1024)}KB, ${events.length} events)`)
        } catch (dbError) {
          console.error("[RecordingUpload] Database insert failed:", dbError)
          // Cleanup uploaded file
          await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
          return {
            success: false,
            error: "Failed to save recording metadata",
          }
        }
      } else {
        console.warn("[RecordingUpload] Database not configured, recording saved to storage only")
      }

      return {
        success: true,
        recordingId,
        recordingUrl,
      }
    } catch (error) {
      console.error("[RecordingUpload] Upload failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      }
    }
  }

  /**
   * Generate a signed URL for recording playback
   */
  async generateRecordingUrl(storagePath: string): Promise<string | null> {
    const supabase = createAdminClient()

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS)

    if (error) {
      console.error("[RecordingUpload] Failed to generate signed URL:", error)
      return null
    }

    return data.signedUrl
  }

  /**
   * Get a recording by ID with events
   */
  async getRecording(recordingId: string): Promise<RecordingWithEvents | null> {
    if (!isDbConfigured() || !db) {
      console.warn("[RecordingUpload] Database not configured")
      return null
    }

    try {
      // 1. Fetch recording metadata
      const [recording] = await db
        .select()
        .from(onboardingRecordings)
        .where(eq(onboardingRecordings.id, recordingId))
        .limit(1)

      if (!recording) {
        return null
      }

      // 2. Download recording data from storage
      const supabase = createAdminClient()
      const storagePath = recording.recordingUrl

      const { data: fileData, error: downloadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(storagePath)

      if (downloadError) {
        console.error("[RecordingUpload] Failed to download recording:", downloadError)
        return null
      }

      // 3. Determine if compressed based on file extension
      const isCompressed = storagePath.endsWith(".gz")
      const arrayBuffer = await fileData.arrayBuffer()

      // 4. Decompress events
      const events = await decompressEvents(arrayBuffer, isCompressed)

      return {
        id: recording.id,
        partnerId: recording.partnerId,
        conversationId: recording.conversationId,
        recordingUrl: recording.recordingUrl,
        duration: recording.duration,
        onboardingStep: recording.onboardingStep,
        stepName: recording.stepName,
        issuesDetected: recording.issuesDetected,
        status: recording.status,
        createdAt: recording.createdAt,
        events,
      }
    } catch (error) {
      console.error("[RecordingUpload] Failed to get recording:", error)
      return null
    }
  }

  /**
   * Delete a recording and its storage file
   */
  async deleteRecording(recordingId: string): Promise<boolean> {
    if (!isDbConfigured() || !db) {
      console.warn("[RecordingUpload] Database not configured")
      return false
    }

    try {
      // 1. Get recording to find storage path
      const [recording] = await db
        .select()
        .from(onboardingRecordings)
        .where(eq(onboardingRecordings.id, recordingId))
        .limit(1)

      if (!recording) {
        console.warn(`[RecordingUpload] Recording ${recordingId} not found`)
        return false
      }

      const supabase = createAdminClient()

      // 2. Delete from storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([recording.recordingUrl])

      if (storageError) {
        console.error("[RecordingUpload] Failed to delete from storage:", storageError)
        // Continue to delete database record anyway
      }

      // 3. Delete database record
      await db
        .delete(onboardingRecordings)
        .where(eq(onboardingRecordings.id, recordingId))

      console.log(`[RecordingUpload] Recording ${recordingId} deleted`)
      return true
    } catch (error) {
      console.error("[RecordingUpload] Failed to delete recording:", error)
      return false
    }
  }

  /**
   * Update recording status
   */
  async updateRecordingStatus(
    recordingId: string,
    status: RecordingStatus,
    issuesDetected?: string[]
  ): Promise<boolean> {
    if (!isDbConfigured() || !db) {
      console.warn("[RecordingUpload] Database not configured")
      return false
    }

    try {
      await db
        .update(onboardingRecordings)
        .set({
          status,
          issuesDetected: issuesDetected ? JSON.stringify(issuesDetected) : null,
        })
        .where(eq(onboardingRecordings.id, recordingId))

      return true
    } catch (error) {
      console.error("[RecordingUpload] Failed to update status:", error)
      return false
    }
  }

  /**
   * List recordings for a partner
   */
  async listPartnerRecordings(
    partnerId: string,
    limit = 50
  ): Promise<RecordingRecord[]> {
    if (!isDbConfigured() || !db) {
      console.warn("[RecordingUpload] Database not configured")
      return []
    }

    try {
      const recordings = await db
        .select()
        .from(onboardingRecordings)
        .where(eq(onboardingRecordings.partnerId, partnerId))
        .orderBy(onboardingRecordings.createdAt)
        .limit(limit)

      return recordings as RecordingRecord[]
    } catch (error) {
      console.error("[RecordingUpload] Failed to list recordings:", error)
      return []
    }
  }

  /**
   * Generate storage path for a recording
   */
  private generateStoragePath(
    partnerId: string | undefined,
    recordingId: string,
    compressed: boolean
  ): string {
    const directory = partnerId || "anonymous"
    const extension = compressed ? ".json.gz" : ".json"
    return `${directory}/${recordingId}${extension}`
  }
}

// ============================================================================
// Singleton Instance & Convenience Functions
// ============================================================================

/** Singleton instance of the recording upload service */
const recordingUploadService = new RecordingUploadService()

/** Upload a recording (convenience function) */
export async function uploadRecording(
  events: RecordingEvent[],
  metadata: RecordingMetadata
): Promise<UploadResult> {
  return recordingUploadService.uploadRecording(events, metadata)
}

/** Generate a signed URL for playback (convenience function) */
export async function generateRecordingUrl(storagePath: string): Promise<string | null> {
  return recordingUploadService.generateRecordingUrl(storagePath)
}

/** Get a recording with events (convenience function) */
export async function getRecording(recordingId: string): Promise<RecordingWithEvents | null> {
  return recordingUploadService.getRecording(recordingId)
}

/** Delete a recording (convenience function) */
export async function deleteRecording(recordingId: string): Promise<boolean> {
  return recordingUploadService.deleteRecording(recordingId)
}

/** Export the service class and singleton */
export { recordingUploadService }
export default RecordingUploadService
