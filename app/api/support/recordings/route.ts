import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

interface RecordingRequest {
  events: unknown[]
  partnerId?: string
  conversationId?: string
  onboardingStep?: string
  duration?: number
  metadata?: {
    userAgent?: string
    screenWidth?: number
    screenHeight?: number
    timestamp?: string
  }
}

// Supabase Storage bucket for recordings
const RECORDINGS_BUCKET = "onboarding-recordings"

export async function POST(request: NextRequest) {
  try {
    const body: RecordingRequest = await request.json()
    const { events, partnerId, conversationId, onboardingStep, duration, metadata } = body

    // Validate events
    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "No recording events provided" },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseServerConfigured()) {
      console.warn("[Recordings API] Supabase not configured, returning mock response")
      return NextResponse.json({
        success: true,
        recordingId: `mock_${nanoid()}`,
        recordingUrl: null,
        message: "Recording saved (mock mode)",
      })
    }

    const supabase = createAdminClient()

    // Generate unique recording ID
    const recordingId = nanoid()
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `${partnerId || "anonymous"}/${timestamp}_${recordingId}.json`

    // Compress events by converting to JSON string
    const recordingData = JSON.stringify({
      version: 1,
      events,
      metadata: {
        ...metadata,
        partnerId,
        conversationId,
        onboardingStep,
        duration,
        recordedAt: new Date().toISOString(),
      },
    })

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(RECORDINGS_BUCKET)
      .upload(fileName, recordingData, {
        contentType: "application/json",
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      // Check if bucket doesn't exist
      if (uploadError.message?.includes("Bucket not found")) {
        console.warn(`[Recordings API] Bucket "${RECORDINGS_BUCKET}" not found. Please create it in Supabase Storage.`)
        return NextResponse.json(
          { error: "Storage bucket not configured. Please contact support." },
          { status: 500 }
        )
      }
      console.error("[Recordings API] Upload error:", uploadError)
      return NextResponse.json(
        { error: "Failed to upload recording" },
        { status: 500 }
      )
    }

    // Get public URL for the recording
    const { data: urlData } = supabase.storage
      .from(RECORDINGS_BUCKET)
      .getPublicUrl(fileName)

    const recordingUrl = urlData?.publicUrl || null

    // Insert record into database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from("onboarding_recordings")
      .insert({
        id: recordingId,
        partner_id: partnerId || null,
        conversation_id: conversationId || null,
        recording_url: recordingUrl,
        duration: duration || 0,
        onboarding_step: onboardingStep || null,
        file_size: Buffer.byteLength(recordingData, "utf8"),
        event_count: events.length,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error("[Recordings API] Database error:", dbError)
      // Still return success if upload worked but DB insert failed
      // The recording is still saved in storage
      return NextResponse.json({
        success: true,
        recordingId,
        recordingUrl,
        message: "Recording uploaded but metadata not saved",
        warning: "Database insert failed",
      })
    }

    return NextResponse.json({
      success: true,
      recordingId,
      recordingUrl,
      message: "Recording saved successfully",
    })
  } catch (error) {
    console.error("[Recordings API] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process recording" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve recordings for a partner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")
    const conversationId = searchParams.get("conversationId")
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        recordings: [],
        total: 0,
        message: "Supabase not configured",
      })
    }

    const supabase = createAdminClient()

    let query = supabase
      .from("onboarding_recordings")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (partnerId) {
      query = query.eq("partner_id", partnerId)
    }

    if (conversationId) {
      query = query.eq("conversation_id", conversationId)
    }

    const { data: recordings, error, count } = await query

    if (error) {
      console.error("[Recordings API] Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch recordings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      recordings: recordings || [],
      total: count || 0,
    })
  } catch (error) {
    console.error("[Recordings API] GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    )
  }
}
