import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, adminEarnings, microsites, leads, partners } from "@/lib/db"
import { eq, sql, desc, and, gte, lte } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
} from "@/lib/api-responses"

// Helper to get date ranges
function getDateRange(period: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case "7d":
      return { start: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), end: now }
    case "30d":
      return { start: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000), end: now }
    case "90d":
      return { start: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000), end: now }
    case "1y":
      return { start: new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000), end: now }
    default:
      return { start: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000), end: now }
  }
}

// Mock data for development
function generateMockData(period: string) {
  const { start, end } = getDateRange(period)
  const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))

  // Generate chart data
  const chartData = []
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    const leadFees = Math.floor(Math.random() * 250) + 50 // $50-300/day from leads
    const micrositeSetup = Math.random() > 0.9 ? 550 : 0 // ~10% chance of new microsite
    chartData.push({
      date: date.toISOString().split('T')[0],
      leadFees,
      micrositeSetup,
      total: leadFees + micrositeSetup,
    })
  }

  // Calculate totals from chart data
  const totalLeadFees = chartData.reduce((sum, d) => sum + d.leadFees, 0)
  const totalMicrositeSetup = chartData.reduce((sum, d) => sum + d.micrositeSetup, 0)
  const totalEarned = totalLeadFees + totalMicrositeSetup

  // Mock recent earnings
  const recentEarnings = [
    { id: "e1", earningType: "lead_fee", baseAmount: "100.00", earnedAmount: "25.00", status: "pending", createdAt: new Date().toISOString(), partnerName: "Adventure Sports Inc", leadEmail: "john@example.com" },
    { id: "e2", earningType: "lead_fee", baseAmount: "40.00", earnedAmount: "10.00", status: "pending", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), partnerName: "Mountain Climbers Co", leadEmail: "sarah@example.com" },
    { id: "e3", earningType: "microsite_setup", baseAmount: "550.00", earnedAmount: "550.00", status: "pending", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), partnerName: "Urban Gym Network", leadEmail: null },
    { id: "e4", earningType: "lead_fee", baseAmount: "100.00", earnedAmount: "25.00", status: "paid", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), partnerName: "Summit Fitness", leadEmail: "mike@example.com" },
    { id: "e5", earningType: "lead_fee", baseAmount: "40.00", earnedAmount: "10.00", status: "paid", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), partnerName: "Adventure Sports Inc", leadEmail: "lisa@example.com" },
  ]

  // Today's numbers
  const todayData = chartData[chartData.length - 1] || { leadFees: 0, micrositeSetup: 0, total: 0 }
  const yesterdayData = chartData[chartData.length - 2] || { total: 1 }
  const todayChange = yesterdayData.total > 0
    ? Math.round((todayData.total - yesterdayData.total) / yesterdayData.total * 100)
    : 0

  // Week totals (last 7 days)
  const weekData = chartData.slice(-7)
  const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0)
  const weekLeads = weekData.reduce((sum, d) => sum + (d.leadFees > 0 ? Math.ceil(d.leadFees / 17.5) : 0), 0) // ~$17.5 avg per lead
  const weekMicrosites = weekData.reduce((sum, d) => sum + (d.micrositeSetup > 0 ? 1 : 0), 0)

  // Previous week for comparison
  const prevWeekData = chartData.slice(-14, -7)
  const prevWeekTotal = prevWeekData.reduce((sum, d) => sum + d.total, 0)
  const weekChange = prevWeekTotal > 0 ? Math.round((weekTotal - prevWeekTotal) / prevWeekTotal * 100) : 0

  // Month totals (last 30 days)
  const monthData = chartData.slice(-30)
  const monthTotal = monthData.reduce((sum, d) => sum + d.total, 0)
  const monthLeads = monthData.reduce((sum, d) => sum + (d.leadFees > 0 ? Math.ceil(d.leadFees / 17.5) : 0), 0)
  const monthMicrosites = monthData.reduce((sum, d) => sum + (d.micrositeSetup > 0 ? 1 : 0), 0)

  return {
    summary: {
      totalEarned: totalEarned + 45000, // Add some historical earnings
      pendingPayout: 2850,
      paidOut: totalEarned + 45000 - 2850,
    },
    today: {
      amount: todayData.total,
      change: todayChange,
      leads: Math.ceil(todayData.leadFees / 17.5),
      microsites: todayData.micrositeSetup > 0 ? 1 : 0,
    },
    week: {
      amount: weekTotal,
      change: weekChange,
      leads: weekLeads,
      microsites: weekMicrosites,
    },
    month: {
      amount: monthTotal,
      change: 12, // Mock 12% growth
      leads: monthLeads,
      microsites: monthMicrosites,
    },
    ytd: {
      amount: totalEarned + 45000,
      change: 24, // Mock 24% YoY growth
    },
    byType: {
      leadFees: { amount: totalLeadFees + 38000, count: 2432 },
      micrositeSetup: { amount: totalMicrositeSetup + 7000, count: Math.ceil((totalMicrositeSetup + 7000) / 550) },
    },
    chartData,
    recent: recentEarnings,
  }
}

/**
 * GET /api/admin/my-earnings
 * Get Julian's personal earnings summary and details
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const period = searchParams.get("period") || "30d"

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        return successResponse(generateMockData(period))
      }

      const { start, end } = getDateRange(period)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const weekStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
      const prevWeekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthStart = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
      const prevMonthStart = new Date(monthStart.getTime() - 30 * 24 * 60 * 60 * 1000)
      const yearStart = new Date(today.getFullYear(), 0, 1)

      // Get summary totals
      const [summary] = await db!
        .select({
          totalEarned: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
          pendingPayout: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.status} = 'pending' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
          paidOut: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.status} = 'paid' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
        })
        .from(adminEarnings)

      // Today's earnings
      const [todayStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
          leads: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN 1 END)`,
          microsites: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN 1 END)`,
        })
        .from(adminEarnings)
        .where(gte(adminEarnings.createdAt, today))

      // Yesterday's earnings for comparison
      const [yesterdayStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
        })
        .from(adminEarnings)
        .where(and(gte(adminEarnings.createdAt, yesterday), lte(adminEarnings.createdAt, today)))

      // Week earnings
      const [weekStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
          leads: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN 1 END)`,
          microsites: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN 1 END)`,
        })
        .from(adminEarnings)
        .where(gte(adminEarnings.createdAt, weekStart))

      // Previous week for comparison
      const [prevWeekStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
        })
        .from(adminEarnings)
        .where(and(gte(adminEarnings.createdAt, prevWeekStart), lte(adminEarnings.createdAt, weekStart)))

      // Month earnings
      const [monthStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
          leads: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN 1 END)`,
          microsites: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN 1 END)`,
        })
        .from(adminEarnings)
        .where(gte(adminEarnings.createdAt, monthStart))

      // Previous month for comparison
      const [prevMonthStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
        })
        .from(adminEarnings)
        .where(and(gte(adminEarnings.createdAt, prevMonthStart), lte(adminEarnings.createdAt, monthStart)))

      // YTD earnings
      const [ytdStats] = await db!
        .select({
          amount: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
        })
        .from(adminEarnings)
        .where(gte(adminEarnings.createdAt, yearStart))

      // By type breakdown
      const [byType] = await db!
        .select({
          leadFeesAmount: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
          leadFeesCount: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN 1 END)`,
          micrositeAmount: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
          micrositeCount: sql<number>`COUNT(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN 1 END)`,
        })
        .from(adminEarnings)

      // Chart data - daily aggregates
      const chartData = await db!
        .select({
          date: sql<string>`DATE(${adminEarnings.createdAt})::text`,
          leadFees: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.earningType} = 'lead_fee' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
          micrositeSetup: sql<number>`COALESCE(SUM(CASE WHEN ${adminEarnings.earningType} = 'microsite_setup' THEN ${adminEarnings.earnedAmount}::numeric ELSE 0 END), 0)`,
          total: sql<number>`COALESCE(SUM(${adminEarnings.earnedAmount}::numeric), 0)`,
        })
        .from(adminEarnings)
        .where(and(gte(adminEarnings.createdAt, start), lte(adminEarnings.createdAt, end)))
        .groupBy(sql`DATE(${adminEarnings.createdAt})`)
        .orderBy(sql`DATE(${adminEarnings.createdAt})`)

      // Recent earnings with partner info
      const recent = await db!
        .select({
          id: adminEarnings.id,
          earningType: adminEarnings.earningType,
          baseAmount: adminEarnings.baseAmount,
          earnedAmount: adminEarnings.earnedAmount,
          status: adminEarnings.status,
          createdAt: adminEarnings.createdAt,
          partnerName: partners.businessName,
          leadEmail: leads.email,
        })
        .from(adminEarnings)
        .leftJoin(partners, eq(adminEarnings.partnerId, partners.id))
        .leftJoin(leads, eq(adminEarnings.leadId, leads.id))
        .orderBy(desc(adminEarnings.createdAt))
        .limit(20)

      // Calculate percentage changes
      const todayChange = yesterdayStats.amount > 0
        ? Math.round((todayStats.amount - yesterdayStats.amount) / yesterdayStats.amount * 100)
        : 0
      const weekChange = prevWeekStats.amount > 0
        ? Math.round((weekStats.amount - prevWeekStats.amount) / prevWeekStats.amount * 100)
        : 0
      const monthChange = prevMonthStats.amount > 0
        ? Math.round((monthStats.amount - prevMonthStats.amount) / prevMonthStats.amount * 100)
        : 0

      return successResponse({
        summary: {
          totalEarned: Number(summary.totalEarned),
          pendingPayout: Number(summary.pendingPayout),
          paidOut: Number(summary.paidOut),
        },
        today: {
          amount: Number(todayStats.amount),
          change: todayChange,
          leads: Number(todayStats.leads),
          microsites: Number(todayStats.microsites),
        },
        week: {
          amount: Number(weekStats.amount),
          change: weekChange,
          leads: Number(weekStats.leads),
          microsites: Number(weekStats.microsites),
        },
        month: {
          amount: Number(monthStats.amount),
          change: monthChange,
          leads: Number(monthStats.leads),
          microsites: Number(monthStats.microsites),
        },
        ytd: {
          amount: Number(ytdStats.amount),
          change: 0, // Would need previous year data for comparison
        },
        byType: {
          leadFees: { amount: Number(byType.leadFeesAmount), count: Number(byType.leadFeesCount) },
          micrositeSetup: { amount: Number(byType.micrositeAmount), count: Number(byType.micrositeCount) },
        },
        chartData,
        recent,
      })
    } catch (error: any) {
      console.error("[Admin My Earnings] GET Error:", error)
      return serverError(error.message || "Failed to fetch earnings")
    }
  })
}
