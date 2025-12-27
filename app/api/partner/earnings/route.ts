import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { getSupabaseServerClient } from "@/lib/supabase"
import {
  calculateMonthlyCommission,
  OPT_IN_RATE,
  getCurrentYearMonth,
  getLastNMonths,
} from "@/lib/commission-tiers"

/**
 * GET /api/partner/earnings
 * Get partner earnings summary and history
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const supabase = getSupabaseServerClient()
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    // Get partner ID
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    // Get earnings for the specified year
    const { data: earnings, error: earningsError } = await supabase
      .from("monthly_earnings")
      .select("*")
      .eq("partner_id", partner.id)
      .like("year_month", `${year}-%`)
      .order("year_month", { ascending: true })

    if (earningsError) {
      console.error("Error fetching earnings:", earningsError)
      return NextResponse.json(
        { error: "Database error", message: earningsError.message },
        { status: 500 }
      )
    }

    // Calculate summary stats
    const totalParticipants = earnings?.reduce((sum, e) => sum + e.total_participants, 0) || 0
    const totalOptedIn = earnings?.reduce((sum, e) => sum + e.opted_in_participants, 0) || 0
    const totalCommission = earnings?.reduce((sum, e) => sum + Number(e.partner_commission), 0) || 0

    // Get last 12 months for chart display
    const last12Months = getLastNMonths(12)
    const monthlyData = last12Months.map((month) => {
      const monthEarning = earnings?.find((e) => e.year_month === month)
      return {
        month,
        participants: monthEarning?.total_participants || 0,
        optedIn: monthEarning?.opted_in_participants || 0,
        earnings: Number(monthEarning?.partner_commission) || 0,
      }
    })

    return NextResponse.json({
      summary: {
        year,
        totalParticipants,
        totalOptedIn,
        totalCommission,
        averageMonthlyCommission: earnings?.length ? totalCommission / earnings.length : 0,
      },
      earnings: earnings || [],
      chartData: monthlyData,
    })
  })
}

/**
 * POST /api/partner/earnings
 * Report monthly participant numbers
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const supabase = getSupabaseServerClient()

    // Parse request body
    const body = await request.json()
    const { yearMonth, totalParticipants, locationBonus = 0 } = body

    // Validate
    if (!yearMonth || typeof totalParticipants !== "number") {
      return NextResponse.json(
        { error: "Validation error", message: "yearMonth and totalParticipants are required" },
        { status: 400 }
      )
    }

    // Validate yearMonth format
    const yearMonthRegex = /^\d{4}-\d{2}$/
    if (!yearMonthRegex.test(yearMonth)) {
      return NextResponse.json(
        { error: "Validation error", message: "yearMonth must be in YYYY-MM format" },
        { status: 400 }
      )
    }

    // Get partner ID
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    // Calculate earnings
    const optedInParticipants = Math.round(totalParticipants * OPT_IN_RATE)
    const partnerCommission = calculateMonthlyCommission(totalParticipants, OPT_IN_RATE, locationBonus)

    // Upsert earnings record
    const { data: earnings, error: earningsError } = await supabase
      .from("monthly_earnings")
      .upsert(
        {
          partner_id: partner.id,
          year_month: yearMonth,
          total_participants: totalParticipants,
          opted_in_participants: optedInParticipants,
          partner_commission: partnerCommission,
        },
        {
          onConflict: "partner_id,year_month",
        }
      )
      .select()
      .single()

    if (earningsError) {
      console.error("Error saving earnings:", earningsError)
      return NextResponse.json(
        { error: "Database error", message: earningsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ earnings })
  })
}
