import { NextRequest } from "next/server"
import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq } from "drizzle-orm"
import twilio from "twilio"

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const body = Object.fromEntries(formData.entries())

    // Verify Twilio signature in production
    if (TWILIO_AUTH_TOKEN && process.env.NODE_ENV === "production") {
      const signature = request.headers.get("x-twilio-signature") || ""
      const url = request.url
      const valid = twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, body as Record<string, string>)

      if (!valid) {
        console.error("[Twilio Webhook] Invalid signature")
        return new Response("Forbidden", { status: 403 })
      }
    }

    const { From, To, Body, MessageSid, NumMedia } = body as Record<string, string>

    console.log("[Twilio Webhook] Inbound SMS:", { from: From, body: Body?.substring(0, 50) })

    // Find lead by phone number
    if (isDbConfigured() && From) {
      const phoneDigits = String(From).replace(/\D/g, "").slice(-10)

      const [lead] = await db!.select().from(leads)
        .where(eq(leads.phone, phoneDigits))
        .limit(1)

      if (lead) {
        // Log the inbound message
        await db!.insert(leadCommunications).values({
          leadId: lead.id,
          channel: "sms",
          direction: "inbound",
          disposition: "received",
          callSummary: Body as string,
          twilioMessageId: MessageSid as string
        })

        console.log("[Twilio] Logged SMS from lead:", lead.id)

        // Update lead activity
        await db!.update(leads).set({
          lastActivityAt: new Date(),
          updatedAt: new Date()
        }).where(eq(leads.id, lead.id))
      }
    }

    // Return TwiML response (empty = no auto-reply)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" }
    })
  } catch (error: any) {
    console.error("[Twilio Webhook] Error:", error)
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
      headers: { "Content-Type": "text/xml" }
    })
  }
}
