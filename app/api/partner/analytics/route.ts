import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, quotes, policies } from "@/lib/db"
import { eq, and, gte, lte, count, sum, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import {
  validateQuery,
  analyticsSchema,
  formatZodErrors,
} from "@/lib/api-validation"

/**
 * Get date range based on period
 */
function getDateRange(period: string): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case "7d":
      startDate.setDate(endDate.getDate() - 7)
      break
    case "30d":
      startDate.setDate(endDate.getDate() - 30)
      break
    case "90d":
      startDate.setDate(endDate.getDate() - 90)
      break
    case "12m":
      startDate.setMonth(endDate.getMonth() - 12)
      break
    case "ytd":
      startDate.setMonth(0, 1) // January 1st of current year
      break
    case "all":
      startDate.setFullYear(2020, 0, 1) // Start from 2020
      break
    default:
      startDate.setDate(endDate.getDate() - 30)
  }

  return { startDate, endDate }
}

/**
 * GET /api/partner/analytics
 * Get partner analytics and metrics
 *
 * Query params:
 * - period: "7d" | "30d" | "90d" | "12m" | "ytd" | "all" (default: "30d")
 * - groupBy: "day" | "week" | "month" (default: "day")
 * - metrics: array of "quotes" | "policies" | "revenue" | "conversion" | "participants" | "opt_in_rate"
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      // Validate query parameters
      const query = validateQuery(analyticsSchema, request.nextUrl.searchParams)

      const { startDate, endDate } = getDateRange(query.period)

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock analytics data")

        // Generate mock time series data
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const timeSeriesData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          return {
            date: date.toISOString().split("T")[0],
            quotes: Math.floor(Math.random() * 10) + 5,
            policies: Math.floor(Math.random() * 8) + 3,
            revenue: (Math.random() * 500 + 200).toFixed(2),
            participants: Math.floor(Math.random() * 100) + 50,
          }
        })

        const totalQuotes = timeSeriesData.reduce((sum, d) => sum + d.quotes, 0)
        const totalPolicies = timeSeriesData.reduce((sum, d) => sum + d.policies, 0)
        const totalRevenue = timeSeriesData.reduce((sum, d) => sum + parseFloat(d.revenue), 0)
        const totalParticipants = timeSeriesData.reduce((sum, d) => sum + d.participants, 0)

        return successResponse({
          period: query.period,
          dateRange: { startDate, endDate },
          summary: {
            totalQuotes,
            totalPolicies,
            totalRevenue: totalRevenue.toFixed(2),
            totalParticipants,
            conversionRate: totalQuotes > 0 ? ((totalPolicies / totalQuotes) * 100).toFixed(2) : "0.00",
            averageQuoteValue: totalQuotes > 0 ? (totalRevenue / totalQuotes).toFixed(2) : "0.00",
          },
          timeSeries: timeSeriesData,
          byProduct: {
            liability: {
              quotes: Math.floor(totalQuotes * 0.6),
              policies: Math.floor(totalPolicies * 0.6),
              revenue: (totalRevenue * 0.6).toFixed(2),
            },
            equipment: {
              quotes: Math.floor(totalQuotes * 0.25),
              policies: Math.floor(totalPolicies * 0.25),
              revenue: (totalRevenue * 0.25).toFixed(2),
            },
            cancellation: {
              quotes: Math.floor(totalQuotes * 0.15),
              policies: Math.floor(totalPolicies * 0.15),
              revenue: (totalRevenue * 0.15).toFixed(2),
            },
          },
          topMetrics: {
            mostPopularCoverage: "liability",
            averageParticipantsPerEvent: Math.floor(totalParticipants / (totalPolicies || 1)),
            peakDay: timeSeriesData.sort((a, b) => b.policies - a.policies)[0]?.date,
          },
        })
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

      // Build date filter
      const dateFilter = and(
        eq(quotes.partnerId, partner.id),
        gte(quotes.createdAt, startDate),
        lte(quotes.createdAt, endDate)
      )

      const policyDateFilter = and(
        eq(policies.partnerId, partner.id),
        gte(policies.createdAt, startDate),
        lte(policies.createdAt, endDate)
      )

      // Get summary metrics
      const [quoteStats] = await db!
        .select({
          totalQuotes: count(),
          totalParticipants: sum(quotes.participants),
        })
        .from(quotes)
        .where(dateFilter)

      const [policyStats] = await db!
        .select({
          totalPolicies: count(),
          totalRevenue: sum(policies.commission),
        })
        .from(policies)
        .where(policyDateFilter)

      const totalQuotes = Number(quoteStats?.totalQuotes || 0)
      const totalPolicies = Number(policyStats?.totalPolicies || 0)
      const totalRevenue = Number(policyStats?.totalRevenue || 0)
      const totalParticipants = Number(quoteStats?.totalParticipants || 0)
      const conversionRate = totalQuotes > 0 ? ((totalPolicies / totalQuotes) * 100).toFixed(2) : "0.00"
      const averageQuoteValue = totalQuotes > 0 ? (totalRevenue / totalQuotes).toFixed(2) : "0.00"

      // Get breakdown by product type
      const quotesByProduct = await db!
        .select({
          coverageType: quotes.coverageType,
          count: count(),
        })
        .from(quotes)
        .where(dateFilter)
        .groupBy(quotes.coverageType)

      const policiesByProduct = await db!
        .select({
          coverageType: policies.coverageType,
          count: count(),
          revenue: sum(policies.commission),
        })
        .from(policies)
        .where(policyDateFilter)
        .groupBy(policies.coverageType)

      // Combine product data
      const byProduct: Record<string, any> = {}
      const productTypes = ["liability", "equipment", "cancellation"]

      productTypes.forEach(type => {
        const quoteData = quotesByProduct.find(q => q.coverageType === type)
        const policyData = policiesByProduct.find(p => p.coverageType === type)

        byProduct[type] = {
          quotes: Number(quoteData?.count || 0),
          policies: Number(policyData?.count || 0),
          revenue: Number(policyData?.revenue || 0).toFixed(2),
        }
      })

      // Find most popular coverage type
      const mostPopular = Object.entries(byProduct).sort(
        ([, a]: any, [, b]: any) => b.policies - a.policies
      )[0]

      return successResponse({
        period: query.period,
        dateRange: { startDate, endDate },
        summary: {
          totalQuotes,
          totalPolicies,
          totalRevenue: totalRevenue.toFixed(2),
          totalParticipants,
          conversionRate,
          averageQuoteValue,
        },
        byProduct,
        topMetrics: {
          mostPopularCoverage: mostPopular ? mostPopular[0] : "liability",
          averageParticipantsPerEvent: totalPolicies > 0 ? Math.floor(totalParticipants / totalPolicies) : 0,
        },
      })
    } catch (error: any) {
      console.error("[Partner Analytics] GET Error:", error)

      if (error.name === "ZodError") {
        return validationError("Invalid query parameters", formatZodErrors(error))
      }

      return serverError(error.message || "Failed to fetch analytics")
    }
  })
}
