import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, quotes, NewQuote, policies } from "@/lib/db"
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import {
  validateBody,
  validateQuery,
  createQuoteSchema,
  quotesListSchema,
  formatZodErrors,
} from "@/lib/api-validation"
import {
  calculatePricing as calculatePricingEngine,
  assessRisk,
  validateQuote,
  requiresManualReview,
  type PricingInput,
} from "@/lib/pricing"
import { quoteRateLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit"

/**
 * Generate unique quote number
 * Format: QT-YYYYMMDD-XXXXX
 */
function generateQuoteNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0")
  return `QT-${dateStr}-${random}`
}

/**
 * Calculate premium and commission using comprehensive pricing engine
 */
async function calculateQuotePricing(
  input: {
    eventType: string
    coverageType: "liability" | "equipment" | "cancellation"
    participants: number
    eventDate: Date
    duration?: number
    location?: string
    eventDetails?: any
  },
  partnerId?: string
) {
  // Get partner volume for tier-based pricing if available
  let partnerVolume = 0
  if (partnerId && db && isDbConfigured()) {
    try {
      // Get total participants from partner's policies (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const volumeResult = await db
        .select({ total: sql<number>`SUM(${policies.participants})` })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, thirtyDaysAgo)
          )
        )

      if (volumeResult[0]?.total) {
        partnerVolume = Number(volumeResult[0].total)
      }
    } catch (error) {
      console.warn("[Quote Pricing] Could not fetch partner volume:", error)
    }
  }

  // Calculate pricing with risk assessment
  const pricingInput: PricingInput = {
    eventType: input.eventType,
    coverageType: input.coverageType,
    participants: input.participants,
    eventDate: input.eventDate,
    duration: input.duration || input.eventDetails?.duration,
    location: input.location || input.eventDetails?.location,
    eventDetails: input.eventDetails,
    partnerVolume,
  }

  const pricing = calculatePricingEngine(pricingInput)

  return {
    premium: pricing.premium,
    commission: pricing.commission,
    riskMultiplier: pricing.riskMultiplier,
    riskFactors: pricing.riskFactors,
  }
}

/**
 * POST /api/partner/quotes
 * Create a new insurance quote
 *
 * Body:
 * - eventType: string (required)
 * - eventDate: Date (required)
 * - participants: number (required)
 * - coverageType: "liability" | "equipment" | "cancellation" (required)
 * - eventDetails: object (optional)
 * - customerEmail: string (optional)
 * - customerName: string (optional)
 * - metadata: object (optional)
 */
export async function POST(request: NextRequest) {
  // Rate limiting - 10 quotes per minute per IP
  const clientIP = getClientIP(request)
  const { success: withinLimit, remaining, resetTime } = await quoteRateLimiter.check(clientIP)

  if (!withinLimit) {
    return rateLimitResponse(resetTime - Date.now())
  }

  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      // Parse and validate request body
      const body = await request.json()
      const validatedData = validateBody(createQuoteSchema, body)

      // Additional business logic validation
      const businessValidation = validateQuote({
        eventType: validatedData.eventType,
        eventDate: validatedData.eventDate,
        participants: validatedData.participants,
        coverageType: validatedData.coverageType,
        duration: validatedData.eventDetails?.duration,
        location: validatedData.eventDetails?.location,
        customerEmail: validatedData.customerEmail,
        customerName: validatedData.customerName,
        eventDetails: validatedData.eventDetails,
        metadata: validatedData.metadata,
      })

      if (!businessValidation.valid) {
        return validationError(
          "Quote validation failed",
          businessValidation.errors.reduce((acc, err) => {
            acc[err.field] = [err.message]
            return acc
          }, {} as Record<string, string[]>)
        )
      }

      // Check if manual review is required
      const reviewCheck = requiresManualReview({
        eventType: validatedData.eventType,
        eventDate: validatedData.eventDate,
        participants: validatedData.participants,
        coverageType: validatedData.coverageType,
        duration: validatedData.eventDetails?.duration,
        location: validatedData.eventDetails?.location,
        eventDetails: validatedData.eventDetails,
      })

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Would create quote with data:", validatedData)

        const pricingResult = await calculateQuotePricing(
          {
            eventType: validatedData.eventType,
            coverageType: validatedData.coverageType,
            participants: validatedData.participants,
            eventDate: validatedData.eventDate,
            eventDetails: validatedData.eventDetails,
          }
        )

        const mockQuote = {
          id: `quote_${Date.now()}`,
          quote_number: generateQuoteNumber(),
          event_type: validatedData.eventType,
          event_date: validatedData.eventDate,
          participants: validatedData.participants,
          coverage_type: validatedData.coverageType,
          premium: pricingResult.premium,
          commission: pricingResult.commission,
          status: reviewCheck.required ? "review" : "pending",
          customer_email: validatedData.customerEmail || null,
          customer_name: validatedData.customerName || null,
          event_details: validatedData.eventDetails ? JSON.stringify(validatedData.eventDetails) : null,
          metadata: validatedData.metadata ? JSON.stringify({
            ...validatedData.metadata,
            riskMultiplier: pricingResult.riskMultiplier,
            requiresReview: reviewCheck.required,
            reviewReasons: reviewCheck.reasons,
            validationWarnings: businessValidation.warnings,
          }) : JSON.stringify({
            riskMultiplier: pricingResult.riskMultiplier,
            requiresReview: reviewCheck.required,
            reviewReasons: reviewCheck.reasons,
            validationWarnings: businessValidation.warnings,
          }),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          created_at: new Date(),
        }

        return successResponse(
          {
            quote: mockQuote,
            warnings: businessValidation.warnings,
            requiresReview: reviewCheck.required,
            reviewReasons: reviewCheck.reasons,
          },
          "Quote created successfully",
          201
        )
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Calculate pricing with risk assessment
      const pricingResult = await calculateQuotePricing(
        {
          eventType: validatedData.eventType,
          coverageType: validatedData.coverageType,
          participants: validatedData.participants,
          eventDate: validatedData.eventDate,
          eventDetails: validatedData.eventDetails,
        },
        partner.id
      )

      // Create quote
      const quoteData: NewQuote = {
        partnerId: partner.id,
        quoteNumber: generateQuoteNumber(),
        eventType: validatedData.eventType,
        eventDate: validatedData.eventDate,
        participants: validatedData.participants,
        coverageType: validatedData.coverageType,
        premium: pricingResult.premium.toString(),
        commission: pricingResult.commission.toString(),
        status: reviewCheck.required ? "review" : "pending",
        customerEmail: validatedData.customerEmail || null,
        customerName: validatedData.customerName || null,
        eventDetails: validatedData.eventDetails ? JSON.stringify(validatedData.eventDetails) : null,
        metadata: validatedData.metadata ? JSON.stringify({
          ...validatedData.metadata,
          riskMultiplier: pricingResult.riskMultiplier,
          riskFactors: pricingResult.riskFactors,
          requiresReview: reviewCheck.required,
          reviewReasons: reviewCheck.reasons,
          validationWarnings: businessValidation.warnings,
        }) : JSON.stringify({
          riskMultiplier: pricingResult.riskMultiplier,
          riskFactors: pricingResult.riskFactors,
          requiresReview: reviewCheck.required,
          reviewReasons: reviewCheck.reasons,
          validationWarnings: businessValidation.warnings,
        }),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }

      const [quote] = await db!.insert(quotes).values(quoteData).returning()

      if (!quote) {
        return serverError("Failed to create quote")
      }

      return successResponse(
        {
          quote,
          warnings: businessValidation.warnings,
          requiresReview: reviewCheck.required,
          reviewReasons: reviewCheck.reasons,
        },
        "Quote created successfully",
        201
      )
    } catch (error: any) {
      console.error("[Partner Quotes] POST Error:", error)

      if (error.name === "ZodError") {
        return validationError("Invalid quote data", formatZodErrors(error))
      }

      return serverError(error.message || "Failed to create quote")
    }
  })
}

/**
 * GET /api/partner/quotes
 * List partner's quotes with pagination and filters
 *
 * Query params:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - status: "pending" | "accepted" | "declined" | "expired" (optional)
 * - coverageType: "liability" | "equipment" | "cancellation" (optional)
 * - startDate: Date (optional)
 * - endDate: Date (optional)
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      // Validate query parameters
      const query = validateQuery(quotesListSchema, request.nextUrl.searchParams)

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock quotes data")
        const mockQuotes = Array.from({ length: 15 }, (_, i) => ({
          id: `quote_${i + 1}`,
          quote_number: `QT-20250101-${String(i + 1).padStart(5, "0")}`,
          event_type: ["Gym Session", "Rock Climbing", "Equipment Rental"][i % 3],
          event_date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
          participants: 10 + i * 5,
          coverage_type: ["liability", "equipment", "cancellation"][i % 3],
          premium: (4.99 + i * 5) * (10 + i * 5),
          commission: (4.99 + i * 5) * (10 + i * 5) * 0.5,
          status: ["pending", "accepted", "declined"][i % 3],
          customer_email: `customer${i}@example.com`,
          customer_name: `Customer ${i + 1}`,
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        }))

        const start = (query.page - 1) * query.pageSize
        const paginatedQuotes = mockQuotes.slice(start, start + query.pageSize)

        return paginatedResponse(paginatedQuotes, query.page, query.pageSize, mockQuotes.length)
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Build where conditions
      const conditions = [eq(quotes.partnerId, partner.id)]

      if (query.status) {
        conditions.push(eq(quotes.status, query.status))
      }

      if (query.coverageType) {
        conditions.push(eq(quotes.coverageType, query.coverageType))
      }

      if (query.startDate) {
        conditions.push(gte(quotes.eventDate, query.startDate))
      }

      if (query.endDate) {
        conditions.push(lte(quotes.eventDate, query.endDate))
      }

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(quotes)
        .where(whereClause)

      // Get paginated quotes
      const offset = (query.page - 1) * query.pageSize
      const quotesList = await db!
        .select()
        .from(quotes)
        .where(whereClause)
        .orderBy(desc(quotes.createdAt))
        .limit(query.pageSize)
        .offset(offset)

      return paginatedResponse(quotesList, query.page, query.pageSize, Number(total))
    } catch (error: any) {
      console.error("[Partner Quotes] GET Error:", error)

      if (error.name === "ZodError") {
        return validationError("Invalid query parameters", formatZodErrors(error))
      }

      return serverError(error.message || "Failed to fetch quotes")
    }
  })
}
