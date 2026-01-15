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
import {
  initiateOutboundCall,
  isLiveKitConfigured,
  generateRoomName,
} from "@/lib/livekit"

type RouteContext = {
  params: Promise<{ id: string }>
}

const initiateCallSchema = z.object({
  scriptId: z.string().uuid().optional(),
  agentId: z.string().optional(),
})

/**
 * POST /api/admin/leads/[id]/call
 * Initiate an outbound call via LiveKit SIP
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

      // Dev mode - return mock response
      if (isDevMode || !isDbConfigured()) {
        const callRecord = {
          id: `call_${Date.now()}`,
          leadId: id,
          channel: "call",
          direction: "outbound",
          status: "initiated",
          livekitRoomId: `room_${Date.now()}`,
          livekitSessionId: `session_${Date.now()}`,
          agentId: agentId || "sarah-voice-agent",
          agentScriptUsed: scriptId || null,
          createdAt: new Date().toISOString(),
        }
        return successResponse(callRecord, "Call initiated (dev mode)")
      }

      // Fetch lead data
      const [lead] = await db!
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      if (!lead.phone) {
        return validationError("Lead does not have a phone number")
      }

      // Check LiveKit configuration
      if (!isLiveKitConfigured()) {
        // Fallback: Create placeholder record without actual call
        console.warn("[Call API] LiveKit not configured, creating placeholder")

        const [communication] = await db!
          .insert(leadCommunications)
          .values({
            leadId: id,
            channel: "call",
            direction: "outbound",
            disposition: "initiated",
            agentId: agentId || "sarah-voice-agent",
            agentScriptUsed: scriptId || null,
            livekitRoomId: generateRoomName(id),
            livekitSessionId: `placeholder_${Date.now()}`,
          })
          .returning()

        return successResponse(
          {
            ...communication,
            status: "pending",
            message: "LiveKit not configured - call queued for manual processing",
          },
          "Call queued"
        )
      }

      // Initiate actual outbound call via LiveKit
      const callResult = await initiateOutboundCall({
        leadId: id,
        leadName: `${lead.firstName} ${lead.lastName}`,
        businessName: lead.businessName || undefined,
        phone: lead.phone,
        direction: "outbound",
        scriptId,
        agentId,
      })

      if (!callResult.success) {
        return serverError(callResult.error || "Failed to initiate call")
      }

      // Create communication record
      const [communication] = await db!
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: "call",
          direction: "outbound",
          disposition: "initiated",
          agentId: agentId || "sarah-voice-agent",
          agentScriptUsed: scriptId || null,
          livekitRoomId: callResult.roomName,
          livekitSessionId: callResult.sipParticipantId || callResult.roomSid,
        })
        .returning()

      // Update lead activity
      await db!
        .update(leads)
        .set({
          lastActivityAt: new Date(),
          status: lead.status === "new" ? "contacted" : lead.status,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))

      return successResponse(
        {
          ...communication,
          roomName: callResult.roomName,
          roomSid: callResult.roomSid,
          sipParticipantId: callResult.sipParticipantId,
          status: "calling",
        },
        "Call initiated successfully"
      )
    } catch (error: any) {
      console.error("[Admin Lead Call] POST Error:", error)
      return serverError(error.message || "Failed to initiate call")
    }
  })
}
