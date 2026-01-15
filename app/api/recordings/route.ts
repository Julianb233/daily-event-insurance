import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

interface RecordingRow {
  id: string
  partner_id: string | null
  conversation_id: string | null
  recording_url: string | null
  duration: number
  onboarding_step: number | null
  step_name: string | null
  status: string
  issues_detected: string | Record<string, unknown>[] | null
  created_at: string
}

/**
 * GET /api/recordings
 * List recordings with filtering and pagination
 *
 * Query params:
 * - partnerId?: string - Filter by partner
 * - conversationId?: string - Filter by conversation
 * - status?: string - Filter by status (recording, processing, ready, failed, analyzed)
 * - onboardingStep?: number - Filter by onboarding step
 * - limit?: number - Number of results (default 20, max 100)
 * - offset?: number - Pagination offset (default 0)
 * - orderBy?: string - Sort field (default "created_at")
 * - order?: string - Sort direction (asc/desc, default "desc")
 *
 * Returns:
 * - recordings: array of recording objects
 * - total: number - Total count matching filters
 * - pagination: { limit, offset, hasMore }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const partnerId = searchParams.get("partnerId")
    const conversationId = searchParams.get("conversationId")
    const status = searchParams.get("status")
    const onboardingStep = searchParams.get("onboardingStep")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
    const offset = parseInt(searchParams.get("offset") || "0", 10)
    const orderBy = searchParams.get("orderBy") || "created_at"
    const order = searchParams.get("order") === "asc" ? true : false

    // If Supabase is not configured, return empty response
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        recordings: [],
        total: 0,
        pagination: {
          limit,
          offset,
          hasMore: false,
        },
        message: "Supabase not configured",
      })
    }

    const supabase = createAdminClient()

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from("onboarding_recordings")
      .select("*", { count: "exact" })

    // Apply filters
    if (partnerId) {
      query = query.eq("partner_id", partnerId)
    }
    if (conversationId) {
      query = query.eq("conversation_id", conversationId)
    }
    if (status) {
      query = query.eq("status", status)
    }
    if (onboardingStep) {
      query = query.eq("onboarding_step", parseInt(onboardingStep, 10))
    }

    // Apply ordering and pagination
    query = query
      .order(orderBy, { ascending: order })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query as { data: Record<string, unknown>[] | null; error: unknown; count: number | null }
    const recordings = data

    if (error) {
      console.error("[Recordings List] Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch recordings" },
        { status: 500 }
      )
    }

    // Transform recordings to camelCase for API response
    const transformedRecordings = (recordings || []).map((r) => ({
      id: r.id,
      partnerId: r.partner_id,
      conversationId: r.conversation_id,
      recordingUrl: r.recording_url,
      duration: r.duration,
      onboardingStep: r.onboarding_step,
      stepName: r.step_name,
      status: r.status,
      issuesDetected: r.issues_detected ? JSON.parse(r.issues_detected as string) : null,
      createdAt: r.created_at,
    }))

    const total = count || 0

    return NextResponse.json({
      recordings: transformedRecordings,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("[Recordings List] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    )
  }
}
