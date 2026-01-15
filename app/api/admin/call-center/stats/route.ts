import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { eq, and, gte, count, avg, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, validationError } from "@/lib/api-responses"

// Mock stats for development mode
const mockStats = {
  today: {
    totalCalls: 87,
    completedCalls: 81,
    missedCalls: 6,
    avgDuration: "6:24",
    avgDurationSeconds: 384,
    avgWaitTime: "8s",
    escalationRate: "5.8%",
    answerRate: "93.1%",
    satisfactionScore: 4.7,
    peakHours: "9am - 12pm",
    callsByDisposition: {
      reached: 65,
      voicemail: 12,
      no_answer: 4,
      busy: 2,
      callback_requested: 3,
      not_interested: 1,
    },
    callsByOutcome: {
      positive: 52,
      neutral: 20,
      negative: 6,
      escalate: 3,
    },
  },
  week: {
    totalCalls: 542,
    completedCalls: 507,
    missedCalls: 35,
    avgDuration: "5:48",
    avgDurationSeconds: 348,
    avgWaitTime: "12s",
    escalationRate: "4.2%",
    answerRate: "93.5%",
    satisfactionScore: 4.6,
    peakHours: "10am - 1pm",
    callsByDisposition: {
      reached: 420,
      voicemail: 65,
      no_answer: 28,
      busy: 7,
      callback_requested: 18,
      not_interested: 4,
    },
    callsByOutcome: {
      positive: 380,
      neutral: 95,
      negative: 22,
      escalate: 10,
    },
  },
  month: {
    totalCalls: 2156,
    completedCalls: 2012,
    missedCalls: 144,
    avgDuration: "5:32",
    avgDurationSeconds: 332,
    avgWaitTime: "15s",
    escalationRate: "3.8%",
    answerRate: "93.3%",
    satisfactionScore: 4.5,
    peakHours: "10am - 12pm",
    callsByDisposition: {
      reached: 1680,
      voicemail: 250,
      no_answer: 120,
      busy: 24,
      callback_requested: 62,
      not_interested: 20,
    },
    callsByOutcome: {
      positive: 1520,
      neutral: 380,
      negative: 82,
      escalate: 30,
    },
  },
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function getDateRangeStart(period: string): Date {
  const now = new Date()
  switch (period) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case "week":
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7)
      return weekStart
    case "month":
      const monthStart = new Date(now)
      monthStart.setDate(now.getDate() - 30)
      return monthStart
    default:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
}

/**
 * GET /api/admin/call-center/stats
 * Get aggregated call center statistics
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const period = searchParams.get("period") || "today"

      if (!["today", "week", "month"].includes(period)) {
        return validationError("Invalid period. Must be: today, week, or month")
      }

      // Return mock data in dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse(mockStats[period as keyof typeof mockStats])
      }

      const startDate = getDateRangeStart(period)

      // Get total calls (channel = 'call')
      const [totalResult] = await db!
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate)
          )
        )

      const totalCalls = Number(totalResult?.count || 0)

      // Get completed calls (disposition = 'reached')
      const [completedResult] = await db!
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            eq(leadCommunications.disposition, "reached"),
            gte(leadCommunications.createdAt, startDate)
          )
        )

      const completedCalls = Number(completedResult?.count || 0)

      // Get missed calls (disposition in no_answer, busy)
      const [missedResult] = await db!
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            sql`${leadCommunications.disposition} IN ('no_answer', 'busy')`,
            gte(leadCommunications.createdAt, startDate)
          )
        )

      const missedCalls = Number(missedResult?.count || 0)

      // Get escalated calls
      const [escalatedResult] = await db!
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            eq(leadCommunications.outcome, "escalate"),
            gte(leadCommunications.createdAt, startDate)
          )
        )

      const escalatedCalls = Number(escalatedResult?.count || 0)

      // Get average call duration
      const [avgDurationResult] = await db!
        .select({ avg: avg(leadCommunications.callDuration) })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate),
            sql`${leadCommunications.callDuration} IS NOT NULL`
          )
        )

      const avgDurationSeconds = Math.round(Number(avgDurationResult?.avg || 0))

      // Get disposition breakdown
      const dispositionBreakdown = await db!
        .select({
          disposition: leadCommunications.disposition,
          count: count(),
        })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate)
          )
        )
        .groupBy(leadCommunications.disposition)

      const callsByDisposition: Record<string, number> = {}
      dispositionBreakdown.forEach((row) => {
        if (row.disposition) {
          callsByDisposition[row.disposition] = Number(row.count)
        }
      })

      // Get outcome breakdown
      const outcomeBreakdown = await db!
        .select({
          outcome: leadCommunications.outcome,
          count: count(),
        })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate)
          )
        )
        .groupBy(leadCommunications.outcome)

      const callsByOutcome: Record<string, number> = {}
      outcomeBreakdown.forEach((row) => {
        if (row.outcome) {
          callsByOutcome[row.outcome] = Number(row.count)
        }
      })

      // Calculate rates
      const answerRate = totalCalls > 0
        ? ((completedCalls / totalCalls) * 100).toFixed(1) + "%"
        : "0%"

      const escalationRate = totalCalls > 0
        ? ((escalatedCalls / totalCalls) * 100).toFixed(1) + "%"
        : "0%"

      const stats = {
        totalCalls,
        completedCalls,
        missedCalls,
        avgDuration: formatDuration(avgDurationSeconds),
        avgDurationSeconds,
        avgWaitTime: "~10s", // Placeholder - would need separate tracking
        escalationRate,
        answerRate,
        satisfactionScore: 4.5, // Placeholder - would need separate tracking
        peakHours: "9am - 12pm", // Placeholder - could calculate from data
        callsByDisposition,
        callsByOutcome,
      }

      return successResponse(stats)
    } catch (error: any) {
      console.error("[Call Center Stats] GET Error:", error)
      return serverError(error.message || "Failed to fetch call center stats")
    }
  })
}
