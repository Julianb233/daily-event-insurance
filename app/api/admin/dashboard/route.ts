import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies, quotes, commissionPayouts, commissionTiers, supportConversations } from "@/lib/db"
import { eq, sql, gte, lte, and, count, sum, desc, asc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError } from "@/lib/api-responses"

/**
 * GET /api/admin/dashboard
 * Get comprehensive admin dashboard statistics with period comparison
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
      let previousStartDate: Date | null = null
      let previousEndDate: Date | null = null
      let periodDays = 30

      switch (period) {
        case "7d":
          periodDays = 7
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
          previousEndDate = startDate
          break
        case "30d":
          periodDays = 30
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
          previousEndDate = startDate
          break
        case "90d":
          periodDays = 90
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
          previousEndDate = startDate
          break
        case "1y":
          periodDays = 365
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)
          previousEndDate = startDate
          break
        case "all":
        default:
          startDate = null
          previousStartDate = null
          previousEndDate = null
      }

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockDashboard = generateMockDashboard(period, periodDays)
        return successResponse(mockDashboard)
      }

      // Build date filter for current period
      const dateFilter = startDate
        ? gte(policies.createdAt, startDate)
        : undefined

      // Build date filter for previous period
      const previousDateFilter = previousStartDate && previousEndDate
        ? and(gte(policies.createdAt, previousStartDate), lte(policies.createdAt, previousEndDate))
        : undefined

      // Get partner counts
      const [partnerStats] = await db!
        .select({
          total: count(),
          active: sql<number>`COUNT(CASE WHEN ${partners.status} = 'active' THEN 1 END)`,
          pending: sql<number>`COUNT(CASE WHEN ${partners.status} IN ('pending', 'documents_sent', 'documents_pending', 'under_review') THEN 1 END)`,
        })
        .from(partners)

      // Get policy stats (with date filter) - current period
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

      // Get policy stats - previous period for comparison
      let previousPolicyStats = { totalPremium: 0, total: 0 }
      if (previousDateFilter) {
        const [prevStats] = await db!
          .select({
            total: count(),
            totalPremium: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
          })
          .from(policies)
          .where(previousDateFilter)
        previousPolicyStats = {
          totalPremium: Number(prevStats.totalPremium),
          total: Number(prevStats.total),
        }
      }

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

      // Get recent activity (latest policies, partners, payouts)
      const recentPolicies = await db!
        .select({
          id: policies.id,
          policyNumber: policies.policyNumber,
          premium: policies.premium,
          createdAt: policies.createdAt,
          status: policies.status,
          partnerName: partners.businessName,
        })
        .from(policies)
        .leftJoin(partners, eq(policies.partnerId, partners.id))
        .orderBy(desc(policies.createdAt))
        .limit(5)

      const recentPartners = await db!
        .select({
          id: partners.id,
          businessName: partners.businessName,
          createdAt: partners.createdAt,
          status: partners.status,
        })
        .from(partners)
        .orderBy(desc(partners.createdAt))
        .limit(5)

      const recentPayouts = await db!
        .select({
          id: commissionPayouts.id,
          commissionAmount: commissionPayouts.commissionAmount,
          createdAt: commissionPayouts.createdAt,
          status: commissionPayouts.status,
          partnerId: commissionPayouts.partnerId,
        })
        .from(commissionPayouts)
        .orderBy(desc(commissionPayouts.createdAt))
        .limit(5)

      // Get support conversation stats
      const [supportStats] = await db!
        .select({
          total: count(),
          active: sql<number>`COUNT(CASE WHEN ${supportConversations.status} = 'active' THEN 1 END)`,
          escalated: sql<number>`COUNT(CASE WHEN ${supportConversations.status} = 'escalated' THEN 1 END)`,
          resolved: sql<number>`COUNT(CASE WHEN ${supportConversations.status} = 'resolved' THEN 1 END)`,
        })
        .from(supportConversations)
        .where(startDate ? gte(supportConversations.createdAt, startDate) : undefined)

      // Get pending actions counts
      const pendingActions = {
        pendingPartners: Number(partnerStats.pending),
        pendingPayouts: Number(payoutStats.count),
        activeSupport: Number(supportStats?.active || 0),
        escalatedSupport: Number(supportStats?.escalated || 0),
      }

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

      // Calculate comparison stats
      const premiumChange = previousPolicyStats.totalPremium > 0
        ? ((Number(policyStats.totalPremium) - previousPolicyStats.totalPremium) / previousPolicyStats.totalPremium * 100)
        : 0
      const policyChange = previousPolicyStats.total > 0
        ? ((Number(policyStats.total) - previousPolicyStats.total) / previousPolicyStats.total * 100)
        : 0

      // Generate sparkline data points
      const sparklineData = await generateSparklineData(db!, startDate, periodDays)

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
        comparison: {
          premiumChange: Math.round(premiumChange * 100) / 100,
          policyChange: Math.round(policyChange * 100) / 100,
          previousPremium: previousPolicyStats.totalPremium,
          previousPolicies: previousPolicyStats.total,
        },
        sparklines: sparklineData,
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
        pendingActions,
        recentActivity: {
          policies: recentPolicies.map(p => ({
            id: p.id,
            type: "policy" as const,
            title: `Policy ${p.policyNumber}`,
            description: p.partnerName || "Unknown Partner",
            amount: Number(p.premium),
            status: p.status,
            timestamp: p.createdAt?.toISOString() || new Date().toISOString(),
          })),
          partners: recentPartners.map(p => ({
            id: p.id,
            type: "partner" as const,
            title: p.businessName,
            description: p.status === "pending" ? "Awaiting approval" : "Active partner",
            status: p.status,
            timestamp: p.createdAt?.toISOString() || new Date().toISOString(),
          })),
          payouts: recentPayouts.map(p => ({
            id: p.id,
            type: "payout" as const,
            title: "Commission Payout",
            description: `Partner ${p.partnerId?.slice(0, 8)}...`,
            amount: Number(p.commissionAmount),
            status: p.status,
            timestamp: p.createdAt?.toISOString() || new Date().toISOString(),
          })),
        },
        supportStats: {
          active: Number(supportStats?.active || 0),
          escalated: Number(supportStats?.escalated || 0),
          resolved: Number(supportStats?.resolved || 0),
          total: Number(supportStats?.total || 0),
        },
        period,
        generatedAt: new Date().toISOString(),
        // Insurance KPIs (using mock data until claims table exists)
        insuranceKPIs: generateInsuranceKPIs(
          Number(policyStats.totalPremium),
          Number(policyStats.total),
          periodDays
        ),
      }

      return successResponse(dashboard)
    } catch (error: any) {
      console.error("[Admin Dashboard] GET Error:", error)
      return serverError(error.message || "Failed to fetch dashboard data")
    }
  })
}

// Insurance KPI calculation helper
interface InsuranceKPIs {
  lossRatio: number
  expenseRatio: number
  combinedRatio: number
  claimsFrequency: number
  averageClaimCost: number
  trends: {
    lossRatioTrend: number[]
    expenseRatioTrend: number[]
    combinedRatioTrend: number[]
    claimsFrequencyTrend: number[]
  }
}

function generateInsuranceKPIs(
  earnedPremium: number,
  totalPolicies: number,
  periodDays: number
): InsuranceKPIs {
  // For daily event insurance, claims are relatively rare
  // Using realistic mock data until claims table is implemented
  const baseClaimsPaid = earnedPremium * 0.35 // 35% loss ratio target
  const baseOperatingExpenses = earnedPremium * 0.25 // 25% expense ratio
  const numberOfClaims = Math.floor(totalPolicies * 0.02) // 2% claims frequency

  // Add some variance for realism
  const variance = 0.9 + Math.random() * 0.2 // 90-110% variance
  const claimsPaid = baseClaimsPaid * variance
  const operatingExpenses = baseOperatingExpenses * (0.95 + Math.random() * 0.1)

  // Calculate KPIs
  const lossRatio = earnedPremium > 0 ? (claimsPaid / earnedPremium) * 100 : 0
  const expenseRatio = earnedPremium > 0 ? (operatingExpenses / earnedPremium) * 100 : 0
  const combinedRatio = lossRatio + expenseRatio
  const claimsFrequency = totalPolicies > 0 ? (numberOfClaims / totalPolicies) * 100 : 0
  const averageClaimCost = numberOfClaims > 0 ? claimsPaid / numberOfClaims : 0

  // Generate trend data (last N periods)
  const dataPoints = Math.min(periodDays, 12)
  const lossRatioTrend = Array.from({ length: dataPoints }, (_, i) => {
    const base = 32 + Math.sin(i * 0.5) * 5
    return Math.round((base + Math.random() * 6) * 10) / 10
  })
  const expenseRatioTrend = Array.from({ length: dataPoints }, (_, i) => {
    const base = 24 + Math.cos(i * 0.3) * 2
    return Math.round((base + Math.random() * 3) * 10) / 10
  })
  const combinedRatioTrend = lossRatioTrend.map((loss, i) =>
    Math.round((loss + expenseRatioTrend[i]) * 10) / 10
  )
  const claimsFrequencyTrend = Array.from({ length: dataPoints }, (_, i) => {
    const base = 1.8 + Math.sin(i * 0.4) * 0.3
    return Math.round((base + Math.random() * 0.4) * 100) / 100
  })

  return {
    lossRatio: Math.round(lossRatio * 10) / 10,
    expenseRatio: Math.round(expenseRatio * 10) / 10,
    combinedRatio: Math.round(combinedRatio * 10) / 10,
    claimsFrequency: Math.round(claimsFrequency * 100) / 100,
    averageClaimCost: Math.round(averageClaimCost),
    trends: {
      lossRatioTrend,
      expenseRatioTrend,
      combinedRatioTrend,
      claimsFrequencyTrend,
    },
  }
}

// Helper function to generate sparkline data
async function generateSparklineData(database: any, startDate: Date | null, periodDays: number) {
  // For now, return mock sparkline data
  // In production, this would query daily aggregates
  const dataPoints = Math.min(periodDays, 30)
  const premiumTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(200000 + Math.random() * 100000 + i * 3000)
  )
  const partnerTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(30 + Math.random() * 10 + i * 0.5)
  )
  const policyTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(3000 + Math.random() * 500 + i * 30)
  )
  const payoutTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(20000 - Math.random() * 5000 - i * 100)
  )

  return { premiumTrend, partnerTrend, policyTrend, payoutTrend }
}

// Mock data generator for development
function generateMockDashboard(period: string, periodDays: number) {
  const now = new Date()

  // Generate recent activity mock data
  const recentPolicies = [
    { id: "pol-1", type: "policy" as const, title: "Policy DEI-2024-001234", description: "Adventure Sports Inc", amount: 89.50, status: "active", timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
    { id: "pol-2", type: "policy" as const, title: "Policy DEI-2024-001233", description: "Mountain Climbers Co", amount: 125.00, status: "active", timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
    { id: "pol-3", type: "policy" as const, title: "Policy DEI-2024-001232", description: "Urban Gym Network", amount: 67.25, status: "active", timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() },
    { id: "pol-4", type: "policy" as const, title: "Policy DEI-2024-001231", description: "Outdoor Adventures LLC", amount: 145.00, status: "pending", timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() },
    { id: "pol-5", type: "policy" as const, title: "Policy DEI-2024-001230", description: "Summit Fitness", amount: 78.50, status: "active", timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() },
  ]

  const recentPartners = [
    { id: "prt-1", type: "partner" as const, title: "Apex Adventure Tours", description: "Awaiting approval", status: "pending", timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "prt-2", type: "partner" as const, title: "Elite Fitness Center", description: "Active partner", status: "active", timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() },
    { id: "prt-3", type: "partner" as const, title: "Trail Runners Association", description: "Awaiting approval", status: "pending", timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString() },
  ]

  const recentPayouts = [
    { id: "pay-1", type: "payout" as const, title: "Commission Payout", description: "Adventure Sports Inc", amount: 2450.00, status: "completed", timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() },
    { id: "pay-2", type: "payout" as const, title: "Commission Payout", description: "Mountain Climbers Co", amount: 1890.00, status: "pending", timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() },
    { id: "pay-3", type: "payout" as const, title: "Commission Payout", description: "Urban Gym Network", amount: 1560.00, status: "pending", timestamp: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString() },
  ]

  // Generate sparkline data
  const dataPoints = Math.min(periodDays, 30)
  const premiumTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(245000 + Math.random() * 20000 + i * 1500)
  )
  const partnerTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(32 + Math.random() * 3 + i * 0.2)
  )
  const policyTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(3200 + Math.random() * 200 + i * 25)
  )
  const payoutTrend = Array.from({ length: dataPoints }, (_, i) =>
    Math.floor(18500 - Math.random() * 2000 - i * 100)
  )

  return {
    overview: {
      totalPartners: 47,
      activePartners: 38,
      pendingPartners: 9,
      totalPolicies: 3842,
      activePolicies: 3241,
      totalQuotes: 5234,
      conversionRate: 73.4,
    },
    revenue: {
      totalPremium: 287540.00,
      totalCommissions: 129393.00,
      totalParticipants: 12450,
      avgPremiumPerPolicy: 74.85,
      avgCommissionRate: 0.45,
    },
    comparison: {
      premiumChange: 12.5,
      policyChange: 8.3,
      previousPremium: 255590.00,
      previousPolicies: 3548,
    },
    sparklines: {
      premiumTrend,
      partnerTrend,
      policyTrend,
      payoutTrend,
    },
    topPartners: [
      { id: "1", name: "Adventure Sports Inc", revenue: 45200, commission: 22600, policies: 512 },
      { id: "2", name: "Mountain Climbers Co", revenue: 38900, commission: 19450, policies: 423 },
      { id: "3", name: "Urban Gym Network", revenue: 32100, commission: 16050, policies: 378 },
      { id: "4", name: "Outdoor Adventures LLC", revenue: 28700, commission: 14350, policies: 312 },
      { id: "5", name: "Summit Fitness", revenue: 24500, commission: 12250, policies: 289 },
    ],
    commissionTiers: [
      { name: "Bronze", rate: 0.40 },
      { name: "Silver", rate: 0.45 },
      { name: "Gold", rate: 0.50 },
      { name: "Platinum", rate: 0.55 },
    ],
    pendingPayouts: {
      count: 12,
      totalAmount: 15670.50,
    },
    pendingActions: {
      pendingPartners: 9,
      pendingPayouts: 12,
      activeSupport: 8,
      escalatedSupport: 3,
    },
    recentActivity: {
      policies: recentPolicies,
      partners: recentPartners,
      payouts: recentPayouts,
    },
    supportStats: {
      active: 8,
      escalated: 3,
      resolved: 145,
      total: 156,
    },
    period,
    generatedAt: new Date().toISOString(),
    // Insurance KPIs for mock data
    insuranceKPIs: generateInsuranceKPIs(287540.00, 3842, periodDays),
  }
}
