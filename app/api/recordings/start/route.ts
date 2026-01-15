import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

/**
 * POST /api/recordings/start
 * Initialize a new recording session
 *
 * Request body:
 * - partnerId?: string - Partner ID for association
 * - conversationId?: string - Support conversation ID
 * - onboardingStep?: number - Current onboarding step (1-4)
 * - stepName?: string - Name of the onboarding step
 *
 * Returns:
 * - sessionId: string - Unique session ID for subsequent uploads
 * - uploadUrl: string - URL to upload chunks to
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { partnerId, conversationId, onboardingStep, stepName } = body

    // Generate unique session ID
    const sessionId = `rec_${nanoid(16)}`
    const timestamp = new Date().toISOString()

    // If Supabase is not configured, return mock response
    if (!isSupabaseServerConfigured()) {
      console.warn("[Recordings API] Supabase not configured, returning mock session")
      return NextResponse.json({
        success: true,
        sessionId,
        uploadUrl: `/api/recordings/upload?sessionId=${sessionId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
        message: "Recording session initialized (mock mode)",
      })
    }

    const supabase = createAdminClient()

    // Create a pending recording record in the database
    const { error: dbError } = await supabase
      .from("onboarding_recordings")
      .insert({
        id: sessionId,
        partner_id: partnerId || null,
        conversation_id: conversationId || null,
        onboarding_step: onboardingStep || null,
        step_name: stepName || null,
        status: "recording", // recording -> processing -> ready/failed
        recording_url: null, // Will be set on complete
        duration: 0,
        created_at: timestamp,
      })

    if (dbError) {
      console.error("[Recordings Start] Database error:", dbError)
      return NextResponse.json(
        { error: "Failed to initialize recording session" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId,
      uploadUrl: `/api/recordings/upload?sessionId=${sessionId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min session timeout
      message: "Recording session initialized",
    })
  } catch (error) {
    console.error("[Recordings Start] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to start recording session" },
      { status: 500 }
    )
  }
}
