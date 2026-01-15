import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { nanoid } from "nanoid"
import { addHours, format } from "date-fns"

/**
 * Quote Pricing Engine
 *
 * Base rates per coverage type and event type multipliers
 */
const BASE_RATES: Record<string, number> = {
  liability: 15,      // $15 per participant base
  equipment: 25,      // $25 per participant base
  cancellation: 10,   // $10 per participant base
}

const EVENT_MULTIPLIERS: Record<string, number> = {
  "yoga-class": 0.8,
  "fitness-class": 1.0,
  "dance-class": 0.9,
  "martial-arts": 1.5,
  "workshop": 0.7,
  "retreat": 1.2,
  "sports-event": 1.4,
  "other": 1.0,
}

const MIN_PREMIUM = 25
const DEFAULT_COMMISSION_RATE = 0.15

/**
 * POST /api/quotes
 * Create a new insurance quote
 *
 * Request body:
 * - partnerId: string (required)
 * - eventType: string (required)
 * - eventDate: string (required) - ISO date
 * - participants: number (required)
 * - coverageType: string (default: "liability")
 * - location?: string
 * - duration?: number - hours
 * - testMode?: boolean
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      partnerId,
      eventType,
      eventDate,
      participants,
      coverageType = "liability",
      location,
      duration,
      testMode = false,
    } = body

    // Validation
    if (!partnerId) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      )
    }
    if (!eventType) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      )
    }
    if (!eventDate) {
      return NextResponse.json(
        { error: "Event date is required" },
        { status: 400 }
      )
    }
    if (!participants || participants < 1) {
      return NextResponse.json(
        { error: "Number of participants must be at least 1" },
        { status: 400 }
      )
    }

    // Calculate premium
    const baseRate = BASE_RATES[coverageType] || BASE_RATES.liability
    const eventMultiplier = EVENT_MULTIPLIERS[eventType] || 1.0

    // Risk multipliers
    let riskMultiplier = 1.0

    // Higher risk for larger events
    if (participants > 50) riskMultiplier *= 1.1
    if (participants > 100) riskMultiplier *= 1.2
    if (participants > 200) riskMultiplier *= 1.3

    // Duration factor (longer events = higher risk)
    const durationHours = duration || 2
    if (durationHours > 4) riskMultiplier *= 1.1
    if (durationHours > 8) riskMultiplier *= 1.2

    // Calculate premium
    let premium = baseRate * participants * eventMultiplier * riskMultiplier
    premium = Math.max(premium, MIN_PREMIUM)
    premium = Math.round(premium * 100) / 100

    // Calculate commission
    const commission = Math.round(premium * DEFAULT_COMMISSION_RATE * 100) / 100

    // Generate quote number
    const dateStr = format(new Date(), "yyyyMMdd")
    const randomSuffix = nanoid(5).toUpperCase()
    const quoteNumber = `QT-${dateStr}-${randomSuffix}`

    // Expiration (24 hours from now)
    const expiresAt = addHours(new Date(), 24)

    // Coverage details
    const coverageDetails = getCoverageDetails(coverageType, participants)

    // If Supabase is configured, save to database
    if (isSupabaseServerConfigured() && !testMode) {
      const supabase = createAdminClient()

      // Verify partner exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: partner } = await (supabase as any)
        .from("partners")
        .select("id, company_name")
        .eq("id", partnerId)
        .single() as { data: Record<string, unknown> | null; error: unknown }

      if (!partner) {
        return NextResponse.json(
          { error: "Invalid partner ID" },
          { status: 400 }
        )
      }

      // Create quote in database
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: savedQuote, error: dbError } = await (supabase as any)
        .from("quotes")
        .insert({
          partner_id: partnerId,
          quote_number: quoteNumber,
          event_type: eventType,
          event_date: eventDate,
          participants,
          coverage_type: coverageType,
          premium: premium.toString(),
          commission: commission.toString(),
          status: "pending",
          location,
          duration: durationHours.toString(),
          risk_multiplier: riskMultiplier.toString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single() as { data: Record<string, unknown> | null; error: unknown }

      if (dbError) {
        console.error("[Quotes API] Database error:", dbError)
        // Continue with mock response if DB fails
      } else if (savedQuote) {
        return NextResponse.json({
          success: true,
          quote: {
            id: savedQuote.id,
            quoteNumber: savedQuote.quote_number,
            eventType: savedQuote.event_type,
            eventDate: savedQuote.event_date,
            participants: savedQuote.participants,
            coverageType: savedQuote.coverage_type,
            premium: savedQuote.premium,
            currency: "USD",
            expiresAt: savedQuote.expires_at,
            coverageDetails,
            status: savedQuote.status,
          },
        })
      }
    }

    // Return mock/test quote
    const mockQuoteId = `quote_${nanoid(12)}`

    return NextResponse.json({
      success: true,
      quote: {
        id: mockQuoteId,
        quoteNumber,
        eventType,
        eventDate,
        participants,
        coverageType,
        premium: premium.toFixed(2),
        currency: "USD",
        expiresAt: expiresAt.toISOString(),
        coverageDetails,
        status: "pending",
      },
      testMode: testMode || !isSupabaseServerConfigured(),
    })

  } catch (error) {
    console.error("[Quotes API] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/quotes
 * List quotes (for partner dashboard)
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
        quotes: [],
        total: 0,
        message: "Database not configured",
      })
    }

    const supabase = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from("quotes")
      .select("*", { count: "exact" })

    if (partnerId) {
      query = query.eq("partner_id", partnerId)
    }
    if (status) {
      query = query.eq("status", status)
    }

    const { data: quotes, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1) as { data: Record<string, unknown>[] | null; error: unknown; count: number | null }

    if (error) {
      console.error("[Quotes API] Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch quotes" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      quotes: (quotes || []).map(q => ({
        id: q.id,
        quoteNumber: q.quote_number,
        eventType: q.event_type,
        eventDate: q.event_date,
        participants: q.participants,
        coverageType: q.coverage_type,
        premium: q.premium,
        status: q.status,
        expiresAt: q.expires_at,
        createdAt: q.created_at,
      })),
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error) {
    console.error("[Quotes API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    )
  }
}

/**
 * Helper: Get coverage details based on type and participants
 */
function getCoverageDetails(coverageType: string, participants: number) {
  const limits: Record<string, { base: number; perPerson: number }> = {
    liability: { base: 1000000, perPerson: 5000 },
    equipment: { base: 50000, perPerson: 500 },
    cancellation: { base: 100000, perPerson: 1000 },
  }

  const config = limits[coverageType] || limits.liability
  const limit = Math.min(config.base + (participants * config.perPerson), config.base * 2)

  const deductibles: Record<string, number> = {
    liability: 500,
    equipment: 250,
    cancellation: 100,
  }

  const descriptions: Record<string, string> = {
    liability: "General liability coverage for bodily injury and property damage during your event",
    equipment: "Coverage for damage or theft of equipment used during your event",
    cancellation: "Reimbursement for non-refundable expenses if your event is cancelled",
  }

  return {
    limit: `$${(limit / 1000000).toFixed(1)}M`,
    deductible: `$${deductibles[coverageType] || 500}`,
    description: descriptions[coverageType] || descriptions.liability,
  }
}
