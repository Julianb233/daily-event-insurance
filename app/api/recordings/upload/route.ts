import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

/**
 * POST /api/recordings/upload
 * Upload a chunk of recording events to an existing session
 *
 * Query params:
 * - sessionId: string - The session ID from /start
 *
 * Request body:
 * - events: array - Array of rrweb events
 * - chunkIndex: number - Index of this chunk (for ordering)
 * - isLast?: boolean - Whether this is the last chunk
 *
 * Returns:
 * - success: boolean
 * - eventsReceived: number
 * - totalEvents: number - Running total of events received
 */

const RECORDINGS_BUCKET = "onboarding-recordings"
const MAX_CHUNK_SIZE = 5 * 1024 * 1024 // 5MB per chunk

// In-memory storage for chunks during upload (in production, use Redis)
const chunkStorage = new Map<string, { events: unknown[]; chunkCount: number; lastUpdate: number }>()

// Cleanup old sessions every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

// Periodic cleanup of abandoned sessions
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [sessionId, data] of chunkStorage.entries()) {
      if (now - data.lastUpdate > SESSION_TIMEOUT) {
        chunkStorage.delete(sessionId)
        console.log(`[Recordings Upload] Cleaned up abandoned session: ${sessionId}`)
      }
    }
  }, CLEANUP_INTERVAL)
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId parameter" },
        { status: 400 }
      )
    }

    // Parse request body
    const contentLength = request.headers.get("content-length")
    if (contentLength && parseInt(contentLength, 10) > MAX_CHUNK_SIZE) {
      return NextResponse.json(
        { error: `Chunk too large. Maximum size is ${MAX_CHUNK_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      )
    }

    const body = await request.json()
    const { events, chunkIndex = 0, isLast = false } = body

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid events data" },
        { status: 400 }
      )
    }

    // Get or create session storage
    let sessionData = chunkStorage.get(sessionId)
    if (!sessionData) {
      sessionData = { events: [], chunkCount: 0, lastUpdate: Date.now() }
      chunkStorage.set(sessionId, sessionData)
    }

    // Append events and update tracking
    sessionData.events.push(...events)
    sessionData.chunkCount++
    sessionData.lastUpdate = Date.now()

    const response = {
      success: true,
      sessionId,
      chunkIndex,
      eventsReceived: events.length,
      totalEvents: sessionData.events.length,
      totalChunks: sessionData.chunkCount,
    }

    // If this is the last chunk, optionally trigger processing
    if (isLast) {
      // Store to Supabase if configured
      if (isSupabaseServerConfigured()) {
        try {
          const supabase = createAdminClient()
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
          const fileName = `chunks/${sessionId}/${timestamp}_complete.json`

          const recordingData = JSON.stringify({
            version: 1,
            events: sessionData.events,
            metadata: {
              sessionId,
              totalChunks: sessionData.chunkCount,
              uploadedAt: new Date().toISOString(),
            },
          })

          const { error: uploadError } = await supabase.storage
            .from(RECORDINGS_BUCKET)
            .upload(fileName, recordingData, {
              contentType: "application/json",
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            console.error("[Recordings Upload] Storage error:", uploadError)
          } else {
            // Get URL and update database
            const { data: urlData } = supabase.storage
              .from(RECORDINGS_BUCKET)
              .getPublicUrl(fileName)

            await supabase
              .from("onboarding_recordings")
              .update({
                recording_url: urlData?.publicUrl || null,
                status: "processing",
                updated_at: new Date().toISOString(),
              })
              .eq("id", sessionId)
          }
        } catch (storageError) {
          console.error("[Recordings Upload] Storage/DB error:", storageError)
        }
      }

      // Clean up in-memory storage
      chunkStorage.delete(sessionId)

      return NextResponse.json({
        ...response,
        isComplete: true,
        message: "All chunks received. Call /api/recordings/complete to finalize.",
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Recordings Upload] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to upload recording chunk" },
      { status: 500 }
    )
  }
}

// GET endpoint to check upload status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing sessionId parameter" },
      { status: 400 }
    )
  }

  const sessionData = chunkStorage.get(sessionId)

  if (!sessionData) {
    return NextResponse.json({
      sessionId,
      status: "not_found",
      message: "Session not found or already completed",
    })
  }

  return NextResponse.json({
    sessionId,
    status: "uploading",
    totalEvents: sessionData.events.length,
    totalChunks: sessionData.chunkCount,
    lastUpdate: new Date(sessionData.lastUpdate).toISOString(),
  })
}
