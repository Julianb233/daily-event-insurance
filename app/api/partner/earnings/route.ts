import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, monthlyEarnings } from "@/lib/db"
import { eq, and, like } from "drizzle-orm"
import {
  calculateMonthlyCommission,
  OPT_IN_RATE,
  getLastNMonths,
} from "@/lib/commission-tiers"
import { isDevMode, MOCK_EARNINGS } from "@/lib/mock-data"

/**
 * GET /api/partner/earnings
 * Get partner earnings summary and history
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock earnings data")
      const year = new Date().getFullYear().toString()
      const yearEarnings = MOCK_EARNINGS.filter(e => e.year_month.startsWith(year))
      const totalParticipants = yearEarnings.reduce((sum, e) => sum + e.total_participants, 0)
      const totalOptedIn = yearEarnings.reduce((sum, e) => sum + e.opted_in_participants, 0)
      const totalCommission = yearEarnings.reduce((sum, e) => sum + Number(e.partner_commission), 0)

      const last12Months = getLastNMonths(12)
      const monthlyData = last12Months.map((month) => {
        const monthEarning = MOCK_EARNINGS.find((e) => e.year_month === month)
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
          averageMonthlyCommission: yearEarnings.length ? totalCommission / yearEarnings.length : 0,
        },
        earnings: yearEarnings,
        chartData: monthlyData,
      })
    }

    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    // Get partner ID
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Get earnings for the specified year
    const earnings = await db!
      .select()
      .from(monthlyEarnings)
      .where(
        and(
          eq(monthlyEarnings.partnerId, partner.id),
          like(monthlyEarnings.yearMonth, `${year}-%`)
        )
      )

    // Calculate summary stats
    const totalParticipants = earnings.reduce((sum, e) => sum + (e.totalParticipants || 0), 0)
    const totalOptedIn = earnings.reduce((sum, e) => sum + (e.optedInParticipants || 0), 0)
    const totalCommission = earnings.reduce((sum, e) => sum + Number(e.partnerCommission || 0), 0)

    // Get last 12 months for chart display
    const last12Months = getLastNMonths(12)
    const monthlyData = last12Months.map((month) => {
      const monthEarning = earnings.find((e) => e.yearMonth === month)
      return {
        month,
        participants: monthEarning?.totalParticipants || 0,
        optedIn: monthEarning?.optedInParticipants || 0,
        earnings: Number(monthEarning?.partnerCommission) || 0,
      }
    })

    return NextResponse.json({
      summary: {
        year,
        totalParticipants,
        totalOptedIn,
        totalCommission,
        averageMonthlyCommission: earnings.length ? totalCommission / earnings.length : 0,
      },
      earnings,
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

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

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
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Calculate earnings (100% coverage is now required)
    const coveredParticipants = totalParticipants
    const partnerCommission = calculateMonthlyCommission(totalParticipants, locationBonus)

    // Check if record exists
    const existing = await db!
      .select()
      .from(monthlyEarnings)
      .where(
        and(
          eq(monthlyEarnings.partnerId, partner.id),
          eq(monthlyEarnings.yearMonth, yearMonth)
        )
      )
      .limit(1)

    let result
    if (existing.length > 0) {
      // Update
      const updated = await db!
        .update(monthlyEarnings)
        .set({
          totalParticipants,
          optedInParticipants: coveredParticipants,
          partnerCommission: String(partnerCommission),
        })
        .where(eq(monthlyEarnings.id, existing[0].id))
        .returning()
      result = updated[0]
    } else {
      // Insert
      const inserted = await db!
        .insert(monthlyEarnings)
        .values({
          partnerId: partner.id,
          yearMonth,
          totalParticipants,
          optedInParticipants: coveredParticipants,
          partnerCommission: String(partnerCommission),
        })
        .returning()
      result = inserted[0]
    }

    return NextResponse.json({ earnings: result })
  })
}
