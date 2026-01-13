import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq, desc, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

const logCommunicationSchema = z.object({
  channel: z.enum(["call", "sms", "email"]),
  direction: z.enum(["inbound", "outbound"]),
  callDuration: z.number().int().positive().optional(),
  callRecordingUrl: z.string().url().optional(),
  callTranscript: z.string().optional(),
  callSummary: z.string().max(2000).optional(),
  smsContent: z.string().max(1600).optional(),
  smsStatus: z.enum(["sent", "delivered", "failed", "received"]).optional(),
  disposition: z.enum(["reached", "voicemail", "no_answer", "busy", "callback_requested", "not_interested", "dnc"]).optional(),
  nextFollowUpAt: z.string().datetime().optional(),
  agentId: z.string().optional(),
  agentScriptUsed: z.string().optional(),
  agentConfidenceScore: z.number().min(0).max(1).optional(),
  sentimentScore: z.number().min(-1).max(1).optional(),
  outcome: z.enum(["positive", "neutral", "negative", "escalate"]).optional(),
  livekitRoomId: z.string().optional(),
  livekitSessionId: z.string().optional(),
})

const mockCommunications = [
  { id: "c1", leadId: "l1", channel: "call", direction: "outbound", callDuration: 180, disposition: "reached", outcome: "positive", agentId: "ai_agent_1", createdAt: "2024-12-20T14:00:00Z" },
  { id: "c2", leadId: "l1", channel: "sms", direction: "outbound", smsContent: "Thanks for your interest in Daily Event Insurance!", smsStatus: "delivered", createdAt: "2024-12-20T15:00:00Z" },
  { id: "c3", leadId: "l1", channel: "email", direction: "outbound", callSummary: "Sent proposal document", outcome: "neutral", createdAt: "2024-12-21T09:00:00Z" },
]

/**
 * GET /api/admin/leads/[id]/communications
 * Get all communications for a lead
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const channel = searchParams.get("channel") || ""

      if (isDevMode || !isDbConfigured()) {
        let filtered = mockCommunications.filter(c => c.leadId === id)
        if (channel) {
          filtered = filtered.filter(c => c.channel === channel)
        }
        const start = (page - 1) * pageSize
        return paginatedResponse(filtered.slice(start, start + pageSize), page, pageSize, filtered.length)
      }

      const [lead] = await db!
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      const [{ total }] = await db!
        .select({ total: count() })
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))

      const offset = (page - 1) * pageSize
      const communications = await db!
        .select()
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(desc(leadCommunications.createdAt))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(communications, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Lead Communications] GET Error:", error)
      return serverError(error.message || "Failed to fetch communications")
    }
  })
}

/**
 * POST /api/admin/leads/[id]/communications
 * Log a new communication for a lead
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = logCommunicationSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid communication data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const newComm = {
          id: `c${Date.now()}`,
          leadId: id,
          ...data,
          createdAt: new Date().toISOString(),
        }
        return successResponse(newComm, "Communication logged", 201)
      }

      const [lead] = await db!
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      const [communication] = await db!
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: data.channel,
          direction: data.direction,
          callDuration: data.callDuration,
          callRecordingUrl: data.callRecordingUrl,
          callTranscript: data.callTranscript,
          callSummary: data.callSummary,
          smsContent: data.smsContent,
          smsStatus: data.smsStatus,
          disposition: data.disposition,
          nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : undefined,
          agentId: data.agentId,
          agentScriptUsed: data.agentScriptUsed,
          agentConfidenceScore: data.agentConfidenceScore?.toString(),
          sentimentScore: data.sentimentScore?.toString(),
          outcome: data.outcome,
          livekitRoomId: data.livekitRoomId,
          livekitSessionId: data.livekitSessionId,
        })
        .returning()

      await db!
        .update(leads)
        .set({
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))

      return successResponse(communication, "Communication logged", 201)
    } catch (error: any) {
      console.error("[Admin Lead Communications] POST Error:", error)
      return serverError(error.message || "Failed to log communication")
    }
  })
}
