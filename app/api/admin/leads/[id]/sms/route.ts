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

const sendSmsSchema = z.object({
  message: z.string().min(1).max(1600),
  templateId: z.string().optional(),
})

/**
 * POST /api/admin/leads/[id]/sms
 * Send SMS to lead (Twilio integration placeholder)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = sendSmsSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid SMS data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { message, templateId } = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const smsRecord = {
          id: `sms_${Date.now()}`,
          leadId: id,
          channel: "sms",
          direction: "outbound",
          smsContent: message,
          smsStatus: "sent",
          twilioMessageSid: `SM${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        return successResponse(smsRecord, "SMS sent")
      }

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

      // TODO: Integrate with Twilio for actual SMS sending
      // const twilioClient = require('twilio')(accountSid, authToken)
      // const twilioMessage = await twilioClient.messages.create({
      //   body: message,
      //   to: lead.phone,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      // })

      const [communication] = await db!
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: "sms",
          direction: "outbound",
          smsContent: message,
          smsStatus: "sent",
          agentScriptUsed: templateId || null,
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
        message: "SMS sent - Twilio integration pending",
      }, "SMS sent")
    } catch (error: any) {
      console.error("[Admin Lead SMS] POST Error:", error)
      return serverError(error.message || "Failed to send SMS")
    }
  })
}
