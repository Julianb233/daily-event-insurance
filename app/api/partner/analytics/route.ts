import { NextRequest } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies, quotes } from "@/lib/db"
import { eq, and, gte, lte, sql, count, sum } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFoundError } from "@/lib/api-responses"

interface TrendPoint {
  date: string
  amount?: number
  count?: number
}

interface CoverageBreakdown {
  type: string
  count: number
  revenue: number
}

interface MonthBreakdown {
  month: string
  policies: number
  revenue: number
}

interface AnalyticsResponse {
  summary: {
    totalPolicies: number
    totalRevenue: number
    totalCommission: number
    averagePolicyValue: number
    conversionRate: number
  }
  trends: {
    revenue: TrendPoint[]
    policies: TrendPoint[]
  }
  breakdown: {
    byCoverage: CoverageBreakdown[]
    byMonth: MonthBreakdown[]
  }
  comparison: {
    previousPeriod: {
      policies: number
      revenue: number
      policyChange: number
      revenueChange: number
    }
  }
}

function getDateRange(
  period: string,
  startDateParam?: string,
  endDateParam?: string
): { startDate: Date; endDate: Date } {
  const now = new Date()
  let endDate = endDateParam ? new Date(endDateParam) : now
  let startDate: Date

  if (startDateParam) {
    startDate = new Date(startDateParam)
  } else {
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "ytd":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "all":
        startDate = new Date(2020, 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }

  return { startDate, endDate }
}

function getPreviousPeriodRange(
  startDate: Date,
  endDate: Date
): { prevStartDate: Date; prevEndDate: Date } {
  const periodMs = endDate.getTime() - startDate.getTime()
  return {
    prevStartDate: new Date(startDate.getTime() - periodMs),
    prevEndDate: new Date(startDate.getTime() - 1),
  }
}

function generateMockAnalytics(period: string): AnalyticsResponse {
  const mockRevenue: TrendPoint[] = []
  const mockPolicies: TrendPoint[] = []
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    mockRevenue.push({ date: dateStr, amount: Math.floor(Math.random() * 500) + 100 })
    mockPolicies.push({ date: dateStr, count: Math.floor(Math.random() * 5) + 1 })
  }

  return {
    summary: {
      totalPolicies: 127,
      totalRevenue: 15890.5,
      totalCommission: 3178.1,
      averagePolicyValue: 125.12,
      conversionRate: 68.5,
    },
    trends: {
      revenue: mockRevenue,
      policies: mockPolicies,
    },
    breakdown: {
      byCoverage: [
        { type: "liability", count: 78, revenue: 9750.0 },
        { type: "equipment", count: 32, revenue: 4000.0 },
        { type: "cancellation", count: 17, revenue: 2140.5 },
      ],
      byMonth: [
        { month: "2024-01", policies: 42, revenue: 5250.0 },
        { month: "2024-02", policies: 45, revenue: 5625.0 },
        { month: "2024-03", policies: 40, revenue: 5015.5 },
      ],
    },
    comparison: {
      previousPeriod: {
        policies: 112,
        revenue: 14000.0,
        policyChange: 13.39,
        revenueChange: 13.5,
      },
    },
  }
}

/**
 * GET /api/partner/analytics
 * Get partner analytics data with optional date filtering
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      const searchParams = request.nextUrl.searchParams
      const period = searchParams.get("period") || "30d"
      const startDateParam = searchParams.get("startDate") || undefined
      const endDateParam = searchParams.get("endDate") || undefined

      const { startDate, endDate } = getDateRange(period, startDateParam, endDateParam)
      const { prevStartDate, prevEndDate } = getPreviousPeriodRange(startDate, endDate)

      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock analytics data")
        return successResponse(generateMockAnalytics(period))
      }

      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]
      const partnerId = partner.id

      const [policyStats] = await db!
        .select({
          totalPolicies: count(),
          totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
          totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, startDate),
            lte(policies.createdAt, endDate)
          )
        )

      const [quoteStats] = await db!
        .select({
          totalQuotes: count(),
          accepted: sql<number>`COUNT(CASE WHEN ${quotes.status} = 'accepted' THEN 1 END)`,
        })
        .from(quotes)
        .where(
          and(
            eq(quotes.partnerId, partnerId),
            gte(quotes.createdAt, startDate),
            lte(quotes.createdAt, endDate)
          )
        )

      const totalPolicies = Number(policyStats.totalPolicies) || 0
      const totalRevenue = Number(policyStats.totalRevenue) || 0
      const totalCommission = Number(policyStats.totalCommission) || 0
      const averagePolicyValue = totalPolicies > 0 ? totalRevenue / totalPolicies : 0
      const totalQuotes = Number(quoteStats.totalQuotes) || 0
      const conversionRate = totalQuotes > 0 ? (totalPolicies / totalQuotes) * 100 : 0

      const revenueTrends = await db!
        .select({
          date: sql<string>`DATE(${policies.createdAt})::text`,
          amount: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, startDate),
            lte(policies.createdAt, endDate)
          )
        )
        .groupBy(sql`DATE(${policies.createdAt})`)
        .orderBy(sql`DATE(${policies.createdAt})`)

      const policyTrends = await db!
        .select({
          date: sql<string>`DATE(${policies.createdAt})::text`,
          count: count(),
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, startDate),
            lte(policies.createdAt, endDate)
          )
        )
        .groupBy(sql`DATE(${policies.createdAt})`)
        .orderBy(sql`DATE(${policies.createdAt})`)

      const coverageBreakdown = await db!
        .select({
          type: policies.coverageType,
          count: count(),
          revenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, startDate),
            lte(policies.createdAt, endDate)
          )
        )
        .groupBy(policies.coverageType)

      const monthBreakdown = await db!
        .select({
          month: sql<string>`TO_CHAR(${policies.createdAt}, 'YYYY-MM')`,
          policies: count(),
          revenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, startDate),
            lte(policies.createdAt, endDate)
          )
        )
        .groupBy(sql`TO_CHAR(${policies.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${policies.createdAt}, 'YYYY-MM')`)

      const [prevPolicyStats] = await db!
        .select({
          totalPolicies: count(),
          totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, partnerId),
            gte(policies.createdAt, prevStartDate),
            lte(policies.createdAt, prevEndDate)
          )
        )

      const prevPolicies = Number(prevPolicyStats.totalPolicies) || 0
      const prevRevenue = Number(prevPolicyStats.totalRevenue) || 0
      const policyChange = prevPolicies > 0 ? ((totalPolicies - prevPolicies) / prevPolicies) * 100 : 0
      const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

      const analytics: AnalyticsResponse = {
        summary: {
          totalPolicies,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCommission: Math.round(totalCommission * 100) / 100,
          averagePolicyValue: Math.round(averagePolicyValue * 100) / 100,
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
        trends: {
          revenue: revenueTrends.map((r) => ({
            date: r.date,
            amount: Number(r.amount),
          })),
          policies: policyTrends.map((p) => ({
            date: p.date,
            count: Number(p.count),
          })),
        },
        breakdown: {
          byCoverage: coverageBreakdown.map((c) => ({
            type: c.type,
            count: Number(c.count),
            revenue: Number(c.revenue),
          })),
          byMonth: monthBreakdown.map((m) => ({
            month: m.month,
            policies: Number(m.policies),
            revenue: Number(m.revenue),
          })),
        },
        comparison: {
          previousPeriod: {
            policies: prevPolicies,
            revenue: Math.round(prevRevenue * 100) / 100,
            policyChange: Math.round(policyChange * 100) / 100,
            revenueChange: Math.round(revenueChange * 100) / 100,
          },
        },
      }

      return successResponse(analytics)
    } catch (error: any) {
      console.error("[Partner Analytics] GET Error:", error)
      return serverError(error.message || "Failed to fetch analytics data")
    }
  })
}
