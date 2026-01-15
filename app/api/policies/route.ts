import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

/**
 * GET /api/policies
 * List policies (for partner dashboard)
 *
 * Query params:
 * - partnerId?: string - Filter by partner
 * - status?: string - Filter by status (active, expired, cancelled)
 * - limit?: number - Max results (default 20, max 100)
 * - offset?: number - Pagination offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")
    const status = searchParams.get("status")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        policies: [],
        total: 0,
        message: "Database not configured",
      })
    }

    const supabase = createAdminClient()

    let query = supabase
      .from("policies")
      .select("*", { count: "exact" })

    if (partnerId) {
      query = query.eq("partner_id", partnerId)
    }
    if (status) {
      query = query.eq("status", status)
    }

    const { data: policies, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("[Policies API] Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch policies" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      policies: (policies || []).map(p => ({
        id: p.id,
        policyNumber: p.policy_number,
        eventType: p.event_type,
        eventDate: p.event_date,
        participants: p.participants,
        coverageType: p.coverage_type,
        premium: p.premium,
        status: p.status,
        effectiveDate: p.effective_date,
        expirationDate: p.expiration_date,
        customerEmail: p.customer_email,
        customerName: p.customer_name,
        certificateIssued: p.certificate_issued,
        createdAt: p.created_at,
      })),
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error) {
    console.error("[Policies API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    )
  }
}
