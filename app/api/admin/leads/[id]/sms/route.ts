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
import { sendSms, sendTemplatedSms, isTwilioConfigured } from "@/lib/twilio"

type RouteContext = {
  params: Promise<{ id: string }>
}

const sendSmsSchema = z.object({
  message: z.string().min(1).max(1600).optional(),
  templateName: z.string().optional(),
  templateVariables: z.record(z.string()).optional(),
  mediaUrl: z.array(z.string().url()).optional(),
})

/**
 * POST /api/admin/leads/[id]/sms
 * Send SMS to lead via Twilio
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

      const { message, templateName, templateVariables, mediaUrl } = validationResult.data

      // Must provide either message or template
      if (!message && !templateName) {
        return validationError("Either message or templateName is required")
      }

      // Dev mode - return mock response
      if (isDevMode || !isDbConfigured()) {
        const smsRecord = {
          id: `sms_${Date.now()}`,
          leadId: id,
          channel: "sms",
          direction: "outbound",
          smsContent: message || `[Template: ${templateName}]`,
          smsStatus: "sent",
          twilioMessageSid: `SM${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        return successResponse(smsRecord, "SMS sent (dev mode)")
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

      let smsResult
      let finalMessage: string

      // Check if Twilio is configured
      if (!isTwilioConfigured()) {
        console.warn("[SMS API] Twilio not configured, creating placeholder")

        finalMessage = message || `[Template: ${templateName}]`

        // Create communication record without actual sending
        const [communication] = await db!
          .insert(leadCommunications)
          .values({
            leadId: id,
            channel: "sms",
            direction: "outbound",
            smsContent: finalMessage,
            smsStatus: "pending",
            agentScriptUsed: templateName || null,
          })
          .returning()

        return successResponse(
          {
            ...communication,
            status: "pending",
            message: "Twilio not configured - SMS queued for manual processing",
          },
          "SMS queued"
        )
      }

      // Send via Twilio
      if (templateName && templateVariables) {
        // Use templated SMS
        smsResult = await sendTemplatedSms(
          lead.phone,
          templateName,
          {
            name: `${lead.firstName}`,
            business: lead.businessName || "your business",
            ...templateVariables,
          }
        )
        finalMessage = `[Template: ${templateName}]`
      } else if (message) {
        // Send direct message
        smsResult = await sendSms({
          to: lead.phone,
          body: message,
          mediaUrl,
        })
        finalMessage = message
      } else {
        return validationError("Message content required")
      }

      if (!smsResult.success) {
        return serverError(smsResult.error || "Failed to send SMS")
      }

      // Create communication record
      const [communication] = await db!
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: "sms",
          direction: "outbound",
          smsContent: finalMessage,
          smsStatus: smsResult.status || "sent",
          agentScriptUsed: templateName || null,
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
          messageSid: smsResult.messageSid,
          status: smsResult.status,
        },
        "SMS sent successfully"
      )
    } catch (error: any) {
      console.error("[Admin Lead SMS] POST Error:", error)
      return serverError(error.message || "Failed to send SMS")
    }
  })
}

/**
 * GET /api/admin/leads/[id]/sms
 * Get SMS history for a lead
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse([], "SMS history retrieved (dev mode)")
      }

      // Verify lead exists
      const [lead] = await db!
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      // Get SMS communications
      const smsHistory = await db!
        .select()
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(leadCommunications.createdAt)

      // Filter to SMS only
      const smsMessages = smsHistory.filter((c) => c.channel === "sms")

      return successResponse(smsMessages, "SMS history retrieved")
    } catch (error: any) {
      console.error("[Admin Lead SMS] GET Error:", error)
      return serverError(error.message || "Failed to get SMS history")
    }
  })
}
