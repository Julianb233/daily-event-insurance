import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations } from "@/lib/db"
import { eq, sql, count, avg, gte } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError } from "@/lib/api-responses"

/**
 * GET /api/admin/support/stats
 * Get dashboard statistics for support conversations
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const period = searchParams.get("period") || "7d" // 24h, 7d, 30d, all

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          total: 156,
          active: 12,
          resolved: 128,
          escalated: 8,
          abandoned: 8,
          avgRating: 4.6,
          avgResponseTime: 45, // seconds
          resolutionRate: 82.1, // percentage
          byTopic: {
            onboarding: { total: 42, resolved: 38, escalated: 2 },
            widget_install: { total: 35, resolved: 30, escalated: 3 },
            api_integration: { total: 28, resolved: 22, escalated: 4 },
            pos_setup: { total: 31, resolved: 27, escalated: 1 },
            troubleshooting: { total: 20, resolved: 11, escalated: 6 },
          },
          byPriority: {
            low: 25,
            normal: 89,
            high: 32,
            urgent: 10,
          },
          recentTrend: {
            today: 8,
            yesterday: 12,
            lastWeek: 45,
            weekOverWeek: 15.4, // percentage change
          },
          topIssues: [
            { issue: "CORS configuration", count: 18 },
            { issue: "Widget not loading", count: 14 },
            { issue: "API key issues", count: 11 },
            { issue: "POS integration errors", count: 9 },
            { issue: "Webhook setup", count: 7 },
          ],
        })
      }

      // Calculate date range based on period
      let dateFilter: Date | null = null
      const now = new Date()
      switch (period) {
        case "24h":
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case "7d":
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          dateFilter = null
      }

      // Get total counts by status
      const statusCounts = await db!
        .select({
          status: supportConversations.status,
          count: count(),
        })
        .from(supportConversations)
        .where(dateFilter ? gte(supportConversations.createdAt, dateFilter) : undefined)
        .groupBy(supportConversations.status)

      const statusMap: Record<string, number> = {
        active: 0,
        resolved: 0,
        escalated: 0,
        abandoned: 0,
      }
      let total = 0
      statusCounts.forEach((s) => {
        if (s.status && s.status in statusMap) {
          statusMap[s.status] = Number(s.count)
        }
        total += Number(s.count)
      })

      // Get average rating
      const [ratingResult] = await db!
        .select({
          avgRating: avg(supportConversations.helpfulRating),
        })
        .from(supportConversations)
        .where(dateFilter ? gte(supportConversations.createdAt, dateFilter) : undefined)

      const avgRating = ratingResult.avgRating ? Number(ratingResult.avgRating).toFixed(1) : null

      // Get counts by topic
      const topicCounts = await db!
        .select({
          topic: supportConversations.topic,
          status: supportConversations.status,
          count: count(),
        })
        .from(supportConversations)
        .where(dateFilter ? gte(supportConversations.createdAt, dateFilter) : undefined)
        .groupBy(supportConversations.topic, supportConversations.status)

      const byTopic: Record<string, { total: number; resolved: number; escalated: number }> = {}
      topicCounts.forEach((tc) => {
        const topic = tc.topic || "other"
        if (!byTopic[topic]) {
          byTopic[topic] = { total: 0, resolved: 0, escalated: 0 }
        }
        byTopic[topic].total += Number(tc.count)
        if (tc.status === "resolved") {
          byTopic[topic].resolved += Number(tc.count)
        }
        if (tc.status === "escalated") {
          byTopic[topic].escalated += Number(tc.count)
        }
      })

      // Get counts by priority
      const priorityCounts = await db!
        .select({
          priority: supportConversations.priority,
          count: count(),
        })
        .from(supportConversations)
        .where(dateFilter ? gte(supportConversations.createdAt, dateFilter) : undefined)
        .groupBy(supportConversations.priority)

      const byPriority: Record<string, number> = {
        low: 0,
        normal: 0,
        high: 0,
        urgent: 0,
      }
      priorityCounts.forEach((pc) => {
        if (pc.priority && pc.priority in byPriority) {
          byPriority[pc.priority] = Number(pc.count)
        }
      })

      // Calculate resolution rate
      const resolved = statusMap.resolved || 0
      const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0

      // Get recent trend data
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const yesterdayStart = new Date(todayStart)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)

      const lastWeekStart = new Date(todayStart)
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)

      const twoWeeksAgoStart = new Date(todayStart)
      twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14)

      const [todayCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(gte(supportConversations.createdAt, todayStart))

      const [yesterdayCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(
          sql`${supportConversations.createdAt} >= ${yesterdayStart} AND ${supportConversations.createdAt} < ${todayStart}`
        )

      const [lastWeekCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(gte(supportConversations.createdAt, lastWeekStart))

      const [previousWeekCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(
          sql`${supportConversations.createdAt} >= ${twoWeeksAgoStart} AND ${supportConversations.createdAt} < ${lastWeekStart}`
        )

      const lastWeekNum = Number(lastWeekCount.count)
      const prevWeekNum = Number(previousWeekCount.count)
      const weekOverWeek =
        prevWeekNum > 0 ? (((lastWeekNum - prevWeekNum) / prevWeekNum) * 100).toFixed(1) : 0

      return successResponse({
        total,
        active: statusMap.active,
        resolved: statusMap.resolved,
        escalated: statusMap.escalated,
        abandoned: statusMap.abandoned,
        avgRating: avgRating ? parseFloat(avgRating) : null,
        resolutionRate: parseFloat(resolutionRate as string),
        byTopic,
        byPriority,
        recentTrend: {
          today: Number(todayCount.count),
          yesterday: Number(yesterdayCount.count),
          lastWeek: lastWeekNum,
          weekOverWeek: parseFloat(weekOverWeek as string),
        },
      })
    } catch (error: any) {
      console.error("[Admin Support Stats] GET Error:", error)
      return serverError(error.message || "Failed to fetch support stats")
    }
  })
}
