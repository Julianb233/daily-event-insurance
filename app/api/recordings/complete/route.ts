import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

/**
 * POST /api/recordings/complete
 * Finalize a recording session and process the recording
 *
 * Request body:
 * - sessionId: string - The session ID from /start
 * - duration?: number - Total recording duration in milliseconds
 * - metadata?: object - Additional metadata about the recording
 *
 * Returns:
 * - success: boolean
 * - recordingId: string
 * - recordingUrl: string | null
 * - status: string - ready, processing, or failed
 */

const RECORDINGS_BUCKET = "onboarding-recordings"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, duration, metadata } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      )
    }

    // If Supabase is not configured, return mock response
    if (!isSupabaseServerConfigured()) {
      console.warn("[Recordings Complete] Supabase not configured, returning mock response")
      return NextResponse.json({
        success: true,
        recordingId: sessionId,
        recordingUrl: null,
        status: "ready",
        message: "Recording completed (mock mode)",
      })
    }

    const supabase = createAdminClient()

    // Get the current recording record
    const { data: recording, error: fetchError } = await supabase
      .from("onboarding_recordings")
      .select("*")
      .eq("id", sessionId)
      .single()

    if (fetchError || !recording) {
      console.error("[Recordings Complete] Recording not found:", fetchError)
      return NextResponse.json(
        { error: "Recording session not found" },
        { status: 404 }
      )
    }

    // Check if already completed
    if (recording.status === "ready") {
      return NextResponse.json({
        success: true,
        recordingId: sessionId,
        recordingUrl: recording.recording_url,
        status: "ready",
        message: "Recording already completed",
      })
    }

    // Update the recording record with final data
    const updateData: Record<string, unknown> = {
      status: "ready",
      updated_at: new Date().toISOString(),
    }

    if (duration) {
      updateData.duration = Math.floor(duration / 1000) // Convert to seconds
    }

    if (metadata) {
      updateData.issues_detected = JSON.stringify(metadata.issues || [])
    }

    const { error: updateError } = await supabase
      .from("onboarding_recordings")
      .update(updateData)
      .eq("id", sessionId)

    if (updateError) {
      console.error("[Recordings Complete] Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to finalize recording" },
        { status: 500 }
      )
    }

    // Fetch the updated recording
    const { data: updatedRecording } = await supabase
      .from("onboarding_recordings")
      .select("*")
      .eq("id", sessionId)
      .single()

    return NextResponse.json({
      success: true,
      recordingId: sessionId,
      recordingUrl: updatedRecording?.recording_url || recording.recording_url,
      status: "ready",
      duration: updatedRecording?.duration || duration,
      message: "Recording completed successfully",
    })
  } catch (error) {
    console.error("[Recordings Complete] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to complete recording" },
      { status: 500 }
    )
  }
}
