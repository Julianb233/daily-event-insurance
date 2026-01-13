import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

const initiateCallSchema = z.object({
  scriptId: z.string().uuid().optional(),
  agentId: z.string().optional(),
})

/**
 * POST /api/admin/leads/[id]/call
 * Initiate an outbound call via LiveKit (placeholder)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json().catch(() => ({}))

      const validationResult = initiateCallSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid call parameters",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { scriptId, agentId } = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const callRecord = {
          id: `call_${Date.now()}`,
          leadId: id,
          channel: "call",
          direction: "outbound",
          status: "initiated",
          livekitRoomId: `room_${Date.now()}`,
          livekitSessionId: `session_${Date.now()}`,
          agentId: agentId || "ai_agent_default",
          agentScriptUsed: scriptId || null,
          createdAt: new Date().toISOString(),
        }
        return successResponse(callRecord, "Call initiated")
      }

      const [lead] = await db!
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      // TODO: Integrate with LiveKit for actual call initiation
      // For now, create a communication record as placeholder
      const livekitRoomId = `room_${Date.now()}`
      const livekitSessionId = `session_${Date.now()}`

      const [communication] = await db!
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: "call",
          direction: "outbound",
          disposition: "initiated",
          agentId: agentId || "ai_agent_default",
          agentScriptUsed: scriptId || null,
          livekitRoomId,
          livekitSessionId,
        })
        .returning()

      await db!
        .update(leads)
        .set({
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))

      return successResponse({
        ...communication,
        status: "initiated",
        message: "Call initiated - LiveKit integration pending",
      }, "Call initiated")
    } catch (error: any) {
      console.error("[Admin Lead Call] POST Error:", error)
      return serverError(error.message || "Failed to initiate call")
    }
  })
}
