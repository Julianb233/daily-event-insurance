import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

/**
 * GET /api/recordings/[id]
 * Get details for a specific recording
 *
 * Returns:
 * - id: string
 * - partnerId: string | null
 * - conversationId: string | null
 * - recordingUrl: string | null
 * - duration: number - Duration in seconds
 * - onboardingStep: number | null
 * - stepName: string | null
 * - status: string - recording, processing, ready, failed, analyzed
 * - issuesDetected: array | null
 * - createdAt: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      )
    }

    // If Supabase is not configured, return mock response
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        id,
        partnerId: null,
        conversationId: null,
        recordingUrl: null,
        duration: 0,
        onboardingStep: null,
        stepName: null,
        status: "not_found",
        issuesDetected: null,
        createdAt: null,
        message: "Supabase not configured",
      })
    }

    const supabase = createAdminClient()

    const { data: recording, error } = await supabase
      .from("onboarding_recordings")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      )
    }

    // Parse issues_detected if it's a JSON string
    let issuesDetected = null
    if (recording.issues_detected) {
      try {
        issuesDetected = typeof recording.issues_detected === "string"
          ? JSON.parse(recording.issues_detected)
          : recording.issues_detected
      } catch {
        issuesDetected = recording.issues_detected
      }
    }

    return NextResponse.json({
      id: recording.id,
      partnerId: recording.partner_id,
      conversationId: recording.conversation_id,
      recordingUrl: recording.recording_url,
      duration: recording.duration,
      onboardingStep: recording.onboarding_step,
      stepName: recording.step_name,
      status: recording.status,
      issuesDetected,
      createdAt: recording.created_at,
    })
  } catch (error) {
    console.error("[Recordings GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch recording" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/recordings/[id]
 * Delete a recording
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Recording deleted (mock mode)",
      })
    }

    const supabase = createAdminClient()

    // Get the recording to find the storage path
    const { data: recording } = await supabase
      .from("onboarding_recordings")
      .select("recording_url")
      .eq("id", id)
      .single()

    // Delete from storage if URL exists
    if (recording?.recording_url) {
      try {
        // Extract file path from URL
        const url = new URL(recording.recording_url)
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/onboarding-recordings\/(.+)/)
        if (pathMatch) {
          await supabase.storage
            .from("onboarding-recordings")
            .remove([pathMatch[1]])
        }
      } catch (storageError) {
        console.warn("[Recordings DELETE] Storage deletion failed:", storageError)
      }
    }

    // Delete the database record
    const { error } = await supabase
      .from("onboarding_recordings")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("[Recordings DELETE] Error:", error)
      return NextResponse.json(
        { error: "Failed to delete recording" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Recording deleted successfully",
    })
  } catch (error) {
    console.error("[Recordings DELETE] Error:", error)
    return NextResponse.json(
      { error: "Failed to delete recording" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/recordings/[id]
 * Update recording metadata (e.g., mark as analyzed, add issues)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Recording updated (mock mode)",
      })
    }

    const supabase = createAdminClient()

    // Build update object from allowed fields
    const allowedFields = ["status", "issues_detected", "step_name", "onboarding_step"]
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert camelCase to snake_case for database
        const dbField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
        updateData[dbField] = field === "issues_detected" && typeof body[field] !== "string"
          ? JSON.stringify(body[field])
          : body[field]
      }
    }

    const { data: updated, error } = await supabase
      .from("onboarding_recordings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[Recordings PATCH] Error:", error)
      return NextResponse.json(
        { error: "Failed to update recording" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      recording: updated,
      message: "Recording updated successfully",
    })
  } catch (error) {
    console.error("[Recordings PATCH] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update recording" },
      { status: 500 }
    )
  }
}
