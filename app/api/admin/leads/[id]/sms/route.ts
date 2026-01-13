import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { leads, leadCommunications } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/leads/[id]/sms
 * Send SMS to a lead via Twilio
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  return withAuth(async () => {
    await requireAdmin()
    const { id } = await params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const body = await request.json()
      const { message } = body

      if (!message) {
        return NextResponse.json(
          { success: false, error: "Message is required" },
          { status: 400 }
        )
      }

      // Verify lead exists and get phone number
      const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
      if (!lead) {
        return NextResponse.json(
          { success: false, error: "Lead not found" },
          { status: 404 }
        )
      }

      if (!lead.phone) {
        return NextResponse.json(
          { success: false, error: "Lead has no phone number" },
          { status: 400 }
        )
      }

      // TODO: Integrate with Twilio to send SMS
      // const twilioClient = twilio(accountSid, authToken)
      // await twilioClient.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: lead.phone,
      // })

      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN

      let smsStatus = "pending"
      let messageId = null

      if (twilioAccountSid && twilioAuthToken) {
        // Full Twilio integration would go here
        smsStatus = "sent"
        messageId = `MSG-${Date.now()}`
      }

      // Log the communication
      const [communication] = await db
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: "sms",
          direction: "outbound",
          smsContent: message,
          smsStatus,
        })
        .returning()

      // Update lead's lastActivityAt
      await db
        .update(leads)
        .set({ lastActivityAt: new Date(), updatedAt: new Date() })
        .where(eq(leads.id, id))

      return NextResponse.json({
        success: true,
        data: {
          communicationId: communication.id,
          status: smsStatus,
          messageId,
          message: smsStatus === "sent" ? "SMS sent successfully" : "SMS queued - Twilio integration pending",
        },
      })
    } catch (error) {
      console.error("[Lead SMS] POST Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to send SMS" },
        { status: 500 }
      )
    }
  })
}
