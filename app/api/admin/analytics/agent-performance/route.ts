import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { eq, gte, sql, and } from "drizzle-orm"
import { successResponse, serverError } from "@/lib/api-responses"
import { isDevMode } from "@/lib/mock-data"

interface AgentDispositions {
  reached_qualified: number
  reached_not_interested: number
  demo_scheduled: number
  left_voicemail: number
  no_answer: number
  busy: number
  callback_requested: number
  dnc: number
}

interface AgentMetrics {
  agentId: string
  totalCalls: number
  avgCallDuration: number
  dispositions: Partial<AgentDispositions>
  conversionRate: number
  avgSentiment: number
}

interface PerformanceSummary {
  totalCalls: number
  avgConversionRate: number
  bestPerformer: string | null
}

/**
 * GET /api/admin/analytics/agent-performance
 * Returns agent performance metrics
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { searchParams } = new URL(request.url)
      const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const endDate = searchParams.get("endDate") || new Date().toISOString()
      const agentIdFilter = searchParams.get("agentId")

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        const mockAgents: AgentMetrics[] = [
          {
            agentId: "sarah-voice-agent",
            totalCalls: 500,
            avgCallDuration: 180,
            dispositions: {
              reached_qualified: 100,
              demo_scheduled: 50,
              left_voicemail: 200,
              no_answer: 100,
              callback_requested: 30,
              reached_not_interested: 15,
              dnc: 5
            },
            conversionRate: 0.20,
            avgSentiment: 0.65
          },
          {
            agentId: "alex-support-agent",
            totalCalls: 150,
            avgCallDuration: 240,
            dispositions: {
              reached_qualified: 40,
              demo_scheduled: 20,
              left_voicemail: 50,
              no_answer: 30,
              callback_requested: 10
            },
            conversionRate: 0.27,
            avgSentiment: 0.72
          }
        ]

        const filtered = agentIdFilter
          ? mockAgents.filter(a => a.agentId === agentIdFilter)
          : mockAgents

        return successResponse({
          agents: filtered,
          summary: {
            totalCalls: filtered.reduce((sum, a) => sum + a.totalCalls, 0),
            avgConversionRate: filtered.reduce((sum, a) => sum + a.conversionRate, 0) / filtered.length,
            bestPerformer: filtered.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.agentId || null
          },
          dateRange: { startDate, endDate }
        })
      }

      // Production - query database
      const baseQuery = db!
        .select({
          agentId: leadCommunications.agentId,
          totalCalls: sql<number>`count(*)::int`,
          avgDuration: sql<number>`coalesce(avg(call_duration), 0)::int`,
          demosScheduled: sql<number>`count(*) filter (where disposition = 'demo_scheduled')::int`,
          reached: sql<number>`count(*) filter (where disposition like 'reached%')::int`,
          voicemails: sql<number>`count(*) filter (where disposition = 'left_voicemail')::int`,
          noAnswers: sql<number>`count(*) filter (where disposition = 'no_answer')::int`
        })
        .from(leadCommunications)
        .where(and(
          eq(leadCommunications.channel, "call"),
          gte(leadCommunications.createdAt, new Date(startDate))
        ))
        .groupBy(leadCommunications.agentId)

      const stats = await baseQuery

      const agents: AgentMetrics[] = stats.map(s => ({
        agentId: s.agentId || "unknown",
        totalCalls: s.totalCalls,
        avgCallDuration: s.avgDuration,
        dispositions: {
          demo_scheduled: s.demosScheduled,
          reached_qualified: s.reached,
          left_voicemail: s.voicemails,
          no_answer: s.noAnswers
        },
        conversionRate: s.reached > 0 ? s.demosScheduled / s.reached : 0,
        avgSentiment: 0.5 // Default, would need sentiment tracking
      }))

      // Filter by agent if specified
      const filtered = agentIdFilter
        ? agents.filter(a => a.agentId === agentIdFilter)
        : agents

      // Sort by total calls
      filtered.sort((a, b) => b.totalCalls - a.totalCalls)

      const summary: PerformanceSummary = {
        totalCalls: filtered.reduce((sum, a) => sum + a.totalCalls, 0),
        avgConversionRate: filtered.length > 0
          ? filtered.reduce((sum, a) => sum + a.conversionRate, 0) / filtered.length
          : 0,
        bestPerformer: filtered.length > 0
          ? [...filtered].sort((a, b) => b.conversionRate - a.conversionRate)[0].agentId
          : null
      }

      return successResponse({
        agents: filtered,
        summary,
        dateRange: { startDate, endDate }
      })

    } catch (error: any) {
      console.error("[Analytics Agent Performance] Error:", error)
      return serverError(error.message || "Failed to fetch agent performance")
    }
  })
}
