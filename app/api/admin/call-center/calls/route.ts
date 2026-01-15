import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { eq, and, gte, desc, count, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { paginatedResponse, serverError, validationError } from "@/lib/api-responses"

// Mock recent calls for development mode
const mockRecentCalls = [
  {
    id: "call-1",
    leadId: "l1",
    callerName: "Michael Torres",
    callerPhone: "(555) 123-4567",
    callerEmail: "michael@fitlifegym.com",
    callerType: "Partner",
    businessType: "gym",
    businessName: "FitLife Gym",
    duration: 525, // 8:45
    durationFormatted: "8:45",
    status: "completed",
    disposition: "reached",
    sentiment: "positive",
    sentimentScore: 0.85,
    outcome: "positive",
    topics: ["policy quote", "event coverage"],
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 min ago
    location: "Austin, TX",
    agentId: "ai_sarah",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "call-2",
    leadId: "l2",
    callerName: "Sarah Mitchell",
    callerPhone: "(555) 234-5678",
    callerEmail: "sarah@peakclimbers.com",
    callerType: "Lead",
    businessType: "climbing",
    businessName: "Peak Climbers",
    duration: 263, // 4:23
    durationFormatted: "4:23",
    status: "completed",
    disposition: "reached",
    sentiment: "neutral",
    sentimentScore: 0.2,
    outcome: "neutral",
    topics: ["policy inquiry", "coverage limits"],
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 min ago
    location: "Denver, CO",
    agentId: "ai_sarah",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "call-3",
    leadId: "l3",
    callerName: "James Anderson",
    callerPhone: "(555) 345-6789",
    callerEmail: "james@wildadventures.io",
    callerType: "Partner",
    businessType: "adventure",
    businessName: "Wild Adventures",
    duration: 692, // 11:32
    durationFormatted: "11:32",
    status: "escalated",
    disposition: "reached",
    sentiment: "negative",
    sentimentScore: -0.4,
    outcome: "escalate",
    topics: ["claim processing", "technical issue"],
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 min ago
    location: "Seattle, WA",
    agentId: "ai_sarah",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "call-4",
    leadId: "l4",
    callerName: "Emily Rodriguez",
    callerPhone: "(555) 456-7890",
    callerEmail: "emily@sunriserentals.com",
    callerType: "Lead",
    businessType: "rental",
    businessName: "Sunrise Rentals",
    duration: 317, // 5:17
    durationFormatted: "5:17",
    status: "completed",
    disposition: "reached",
    sentiment: "positive",
    sentimentScore: 0.72,
    outcome: "positive",
    topics: ["partnership", "integration"],
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 min ago
    location: "Miami, FL",
    agentId: "ai_sarah",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "call-5",
    leadId: "l5",
    callerName: "Unknown Caller",
    callerPhone: "(555) 567-8901",
    callerEmail: null,
    callerType: "Unknown",
    businessType: null,
    businessName: null,
    duration: 0,
    durationFormatted: "0:00",
    status: "missed",
    disposition: "no_answer",
    sentiment: "neutral",
    sentimentScore: 0,
    outcome: null,
    topics: [],
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    location: "Unknown",
    agentId: null,
    hasRecording: false,
    hasTranscript: false,
  },
  {
    id: "call-6",
    leadId: "l6",
    callerName: "David Chen",
    callerPhone: "(555) 678-9012",
    callerEmail: "david@yogastudio.com",
    callerType: "Lead",
    businessType: "gym",
    businessName: "Zen Yoga Studio",
    duration: 225, // 3:45
    durationFormatted: "3:45",
    status: "voicemail",
    disposition: "voicemail",
    sentiment: "neutral",
    sentimentScore: 0,
    outcome: null,
    topics: ["policy renewal"],
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // 1 hour ago
    location: "San Francisco, CA",
    agentId: "ai_sarah",
    hasRecording: true,
    hasTranscript: false,
  },
]

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function mapDispositionToStatus(disposition: string | null): string {
  switch (disposition) {
    case "reached":
      return "completed"
    case "voicemail":
      return "voicemail"
    case "no_answer":
    case "busy":
      return "missed"
    case "callback_requested":
      return "callback"
    case "not_interested":
    case "dnc":
      return "completed"
    default:
      return "unknown"
  }
}

function mapOutcomeToSentiment(outcome: string | null, sentimentScore: number | null): string {
  if (outcome === "escalate") return "negative"
  if (sentimentScore !== null) {
    if (sentimentScore > 0.3) return "positive"
    if (sentimentScore < -0.3) return "negative"
  }
  return "neutral"
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
 * GET /api/admin/call-center/calls
 * List recent calls with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const status = searchParams.get("status") || "" // completed, missed, escalated, voicemail
      const period = searchParams.get("period") || "today"

      // Return mock data in dev mode
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockRecentCalls]

        if (status && status !== "all") {
          filtered = filtered.filter((call) => call.status === status)
        }

        const start = (page - 1) * pageSize
        return paginatedResponse(
          filtered.slice(start, start + pageSize),
          page,
          pageSize,
          filtered.length
        )
      }

      const startDate = getDateRangeStart(period)

      // Build conditions
      const conditions = [
        eq(leadCommunications.channel, "call"),
        gte(leadCommunications.createdAt, startDate),
      ]

      // Filter by status (map to disposition/outcome)
      if (status && status !== "all") {
        switch (status) {
          case "completed":
            conditions.push(eq(leadCommunications.disposition, "reached"))
            break
          case "missed":
            conditions.push(
              sql`${leadCommunications.disposition} IN ('no_answer', 'busy')`
            )
            break
          case "escalated":
            conditions.push(eq(leadCommunications.outcome, "escalate"))
            break
          case "voicemail":
            conditions.push(eq(leadCommunications.disposition, "voicemail"))
            break
        }
      }

      const whereClause = and(...conditions)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(leadCommunications)
        .where(whereClause)

      // Get calls (without leads JOIN due to schema mismatch - lead info will show as Unknown)
      const offset = (page - 1) * pageSize
      const callsData = await db!
        .select({
          id: leadCommunications.id,
          leadId: leadCommunications.leadId,
          channel: leadCommunications.channel,
          direction: leadCommunications.direction,
          callDuration: leadCommunications.callDuration,
          callRecordingUrl: leadCommunications.callRecordingUrl,
          callTranscript: leadCommunications.callTranscript,
          callSummary: leadCommunications.callSummary,
          disposition: leadCommunications.disposition,
          sentimentScore: leadCommunications.sentimentScore,
          outcome: leadCommunications.outcome,
          agentId: leadCommunications.agentId,
          createdAt: leadCommunications.createdAt,
        })
        .from(leadCommunications)
        .where(whereClause)
        .orderBy(desc(leadCommunications.createdAt))
        .limit(pageSize)
        .offset(offset)

      // Transform to frontend format
      const calls = callsData.map((call) => {
        const duration = call.callDuration || 0
        const sentimentScore = call.sentimentScore
          ? parseFloat(call.sentimentScore)
          : 0

        return {
          id: call.id,
          leadId: call.leadId,
          callerName: "Unknown Caller", // Lead info not available due to schema mismatch
          callerPhone: "Unknown",
          callerEmail: null,
          callerType: "Lead",
          businessType: null,
          businessName: null,
          duration,
          durationFormatted: formatDuration(duration),
          status: call.outcome === "escalate"
            ? "escalated"
            : mapDispositionToStatus(call.disposition),
          disposition: call.disposition,
          sentiment: mapOutcomeToSentiment(call.outcome, sentimentScore),
          sentimentScore,
          outcome: call.outcome,
          topics: [], // Would need to parse from transcript/summary
          timestamp: call.createdAt?.toISOString() || new Date().toISOString(),
          location: "Unknown",
          agentId: call.agentId,
          hasRecording: !!call.callRecordingUrl,
          hasTranscript: !!call.callTranscript,
        }
      })

      return paginatedResponse(calls, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Call Center Calls] GET Error:", error)
      return serverError(error.message || "Failed to fetch calls")
    }
  })
}
