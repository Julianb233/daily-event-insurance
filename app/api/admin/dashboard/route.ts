import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies, quotes, commissionPayouts, commissionTiers } from "@/lib/db"
import { eq, sql, gte, lte, and, count, sum, desc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError } from "@/lib/api-responses"

/**
 * GET /api/admin/dashboard
 * Get comprehensive admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const period = searchParams.get("period") || "30d" // 7d, 30d, 90d, 1y, all

      // Calculate date range
      const now = new Date()
      let startDate: Date | null = null
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
        case "1y":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        case "all":
        default:
          startDate = null
      }

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockDashboard = {
          overview: {
            totalPartners: 47,
            activePartners: 38,
            pendingPartners: 9,
            totalPolicies: 1247,
            activePolicies: 892,
            totalQuotes: 2156,
            conversionRate: 57.8,
          },
          revenue: {
            totalPremium: 156789.50,
            totalCommissions: 78394.75,
            avgPremiumPerPolicy: 125.72,
            avgCommissionRate: 0.50,
          },
          commissionTiers: {
            bronze: { partners: 15, revenue: 23450.00, commissions: 9380.00 },
            silver: { partners: 12, revenue: 45670.00, commissions: 20551.50 },
            gold: { partners: 8, revenue: 52340.00, commissions: 26170.00 },
            platinum: { partners: 3, revenue: 35329.50, commissions: 19431.22 },
          },
          trends: {
            policiesThisMonth: 156,
            policiesLastMonth: 142,
            growthRate: 9.86,
            topPartners: [
              { name: "Peak Performance Gym", policies: 89, commission: 4450.00 },
              { name: "Summit Climbing Center", policies: 67, commission: 3350.00 },
              { name: "Adventure Sports Co", policies: 54, commission: 2970.00 },
            ],
          },
          pendingPayouts: {
            count: 12,
            totalAmount: 15670.50,
          },
          period,
          generatedAt: new Date().toISOString(),
        }
        return successResponse(mockDashboard)
      }

      // Build date filter
      const dateFilter = startDate
        ? gte(policies.createdAt, startDate)
        : undefined

      // Get partner counts
      const [partnerStats] = await db!
        .select({
          total: count(),
          active: sql<number>`COUNT(CASE WHEN ${partners.status} = 'active' THEN 1 END)`,
          pending: sql<number>`COUNT(CASE WHEN ${partners.status} IN ('pending', 'documents_sent', 'documents_pending', 'under_review') THEN 1 END)`,
        })
        .from(partners)

      // Get policy stats (with date filter)
      const [policyStats] = await db!
        .select({
          total: count(),
          active: sql<number>`COUNT(CASE WHEN ${policies.status} = 'active' THEN 1 END)`,
          totalPremium: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
          totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`,
          totalParticipants: sql<number>`COALESCE(SUM(${policies.participants}), 0)`,
        })
        .from(policies)
        .where(dateFilter)

      // Get quote stats
      const quoteFilter = startDate
        ? gte(quotes.createdAt, startDate)
        : undefined
      const [quoteStats] = await db!
        .select({
          total: count(),
          accepted: sql<number>`COUNT(CASE WHEN ${quotes.status} = 'accepted' THEN 1 END)`,
          pending: sql<number>`COUNT(CASE WHEN ${quotes.status} = 'pending' THEN 1 END)`,
        })
        .from(quotes)
        .where(quoteFilter)

      // Get commission tier distribution
      const tierStats = await db!
        .select({
          tierName: commissionTiers.tierName,
          tierRate: commissionTiers.commissionRate,
        })
        .from(commissionTiers)
        .where(eq(commissionTiers.isActive, true))
        .orderBy(commissionTiers.sortOrder)

      // Get top partners by revenue
      const topPartners = await db!
        .select({
          id: partners.id,
          businessName: partners.businessName,
          policyCount: count(policies.id),
          totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
          totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`,
        })
        .from(partners)
        .leftJoin(policies, and(
          eq(policies.partnerId, partners.id),
          dateFilter ? dateFilter : sql`TRUE`
        ))
        .where(eq(partners.status, "active"))
        .groupBy(partners.id, partners.businessName)
        .orderBy(desc(sql`COALESCE(SUM(${policies.premium}::numeric), 0)`))
        .limit(10)

      // Get pending payouts
      const [payoutStats] = await db!
        .select({
          count: count(),
          totalAmount: sql<number>`COALESCE(SUM(${commissionPayouts.commissionAmount}::numeric), 0)`,
        })
        .from(commissionPayouts)
        .where(eq(commissionPayouts.status, "pending"))

      // Calculate conversion rate
      const conversionRate = quoteStats.total > 0
        ? (Number(quoteStats.accepted) / Number(quoteStats.total) * 100)
        : 0

      // Calculate average premium
      const avgPremium = policyStats.total > 0
        ? Number(policyStats.totalPremium) / Number(policyStats.total)
        : 0

      // Calculate average commission rate
      const avgCommissionRate = Number(policyStats.totalPremium) > 0
        ? Number(policyStats.totalCommission) / Number(policyStats.totalPremium)
        : 0

      const dashboard = {
        overview: {
          totalPartners: Number(partnerStats.total),
          activePartners: Number(partnerStats.active),
          pendingPartners: Number(partnerStats.pending),
          totalPolicies: Number(policyStats.total),
          activePolicies: Number(policyStats.active),
          totalQuotes: Number(quoteStats.total),
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
        revenue: {
          totalPremium: Number(policyStats.totalPremium),
          totalCommissions: Number(policyStats.totalCommission),
          totalParticipants: Number(policyStats.totalParticipants),
          avgPremiumPerPolicy: Math.round(avgPremium * 100) / 100,
          avgCommissionRate: Math.round(avgCommissionRate * 10000) / 10000,
        },
        commissionTiers: tierStats.map(t => ({
          name: t.tierName,
          rate: Number(t.tierRate),
        })),
        topPartners: topPartners.map(p => ({
          id: p.id,
          name: p.businessName,
          policies: Number(p.policyCount),
          revenue: Number(p.totalRevenue),
          commission: Number(p.totalCommission),
        })),
        pendingPayouts: {
          count: Number(payoutStats.count),
          totalAmount: Number(payoutStats.totalAmount),
        },
        period,
        generatedAt: new Date().toISOString(),
      }

      return successResponse(dashboard)
    } catch (error: any) {
      console.error("[Admin Dashboard] GET Error:", error)
      return serverError(error.message || "Failed to fetch dashboard data")
    }
  })
}
