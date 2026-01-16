/**
 * Recording Storage Service
 * Stores and retrieves call recordings from Supabase Storage
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null

const BUCKET_NAME = "call-recordings"

export interface RecordingMetadata {
  leadId: string
  communicationId?: string
  duration: number
  roomName: string
  agentId?: string
}

export interface StoredRecording {
  id: string
  url: string
  path: string
  metadata: RecordingMetadata
  createdAt: Date
}

export async function storeRecording(
  recordingData: Buffer | Uint8Array,
  metadata: RecordingMetadata
): Promise<StoredRecording | null> {
  if (!supabase) {
    console.warn("[RecordingStorage] Supabase not configured")
    return null
  }

  try {
    const recordingId = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const path = `${metadata.leadId}/${recordingId}.webm`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, recordingData, {
        contentType: "audio/webm",
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get signed URL (valid for 1 hour)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, 3600)

    console.log("[RecordingStorage] Stored recording:", recordingId)

    return {
      id: recordingId,
      url: urlData?.signedUrl || "",
      path,
      metadata,
      createdAt: new Date()
    }
  } catch (error) {
    console.error("[RecordingStorage] Store error:", error)
    return null
  }
}

export async function getRecordingUrl(path: string, expiresIn = 3600): Promise<string | null> {
  if (!supabase) return null

  try {
    const { data } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn)

    return data?.signedUrl || null
  } catch (error) {
    console.error("[RecordingStorage] Get URL error:", error)
    return null
  }
}

export async function deleteRecording(path: string): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    return !error
  } catch (error) {
    console.error("[RecordingStorage] Delete error:", error)
    return false
  }
}

export async function listRecordings(leadId: string): Promise<string[]> {
  if (!supabase) return []

  try {
    const { data } = await supabase.storage
      .from(BUCKET_NAME)
      .list(leadId)

    return data?.map(f => `${leadId}/${f.name}`) || []
  } catch (error) {
    console.error("[RecordingStorage] List error:", error)
    return []
  }
}

export const RecordingStorage = {
  store: storeRecording,
  getUrl: getRecordingUrl,
  delete: deleteRecording,
  list: listRecordings
}
