import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, leads, leadCommunications, webhookEvents } from "@/lib/db"
import { eq } from "drizzle-orm"
import { validateWebhookSignature, parseIncomingSms } from "@/lib/twilio"

/**
 * Twilio SMS Webhook Handler
 *
 * Handles incoming SMS messages and status updates from Twilio.
 * - Incoming SMS: Log to lead communications
 * - Status updates: Update message delivery status
 */

/**
 * POST /api/webhooks/twilio/sms
 * Handle incoming SMS or status callback
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data (Twilio sends as application/x-www-form-urlencoded)
    const formData = await request.formData()
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    console.log("[Twilio SMS Webhook] Received:", {
      from: body.From,
      to: body.To,
      status: body.MessageStatus,
      messageSid: body.MessageSid,
    })

    // Optional: Validate webhook signature in production
    // const signature = request.headers.get("x-twilio-signature") || ""
    // const url = request.url
    // const isValid = validateWebhookSignature(signature, url, body)
    // if (!isValid) {
    //   return new Response("Invalid signature", { status: 403 })
    // }

    // Log webhook event
    if (isDbConfigured() && db) {
      try {
        await db.insert(webhookEvents).values({
          source: "twilio",
          eventType: body.MessageStatus ? "status_callback" : "incoming_sms",
          payload: JSON.stringify(body),
          processed: false,
        })
      } catch (err) {
        console.error("[Twilio SMS Webhook] Failed to log event:", err)
      }
    }

    // Handle status callback (delivery receipt)
    if (body.MessageStatus) {
      await handleStatusCallback(body)
      return twimlResponse()
    }

    // Handle incoming SMS
    if (body.Body && body.From) {
      await handleIncomingSms(body)
      return twimlResponse("Thank you for your message. Our team will respond shortly.")
    }

    return twimlResponse()
  } catch (error) {
    console.error("[Twilio SMS Webhook] Error:", error)
    return twimlResponse()
  }
}

/**
 * Handle incoming SMS message
 */
async function handleIncomingSms(body: Record<string, string>) {
  const sms = parseIncomingSms(body)

  console.log("[Twilio SMS Webhook] Incoming SMS:", {
    from: sms.from,
    body: sms.body.substring(0, 50),
    hasMedia: sms.numMedia > 0,
  })

  if (!isDbConfigured() || !db) {
    console.log("[Twilio SMS Webhook] Database not configured, skipping lead lookup")
    return
  }

  // Find lead by phone number
  const formattedPhone = formatPhoneForLookup(sms.from)

  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.phone, formattedPhone))
    .limit(1)

  if (!lead) {
    // Try without formatting
    const [lead2] = await db
      .select()
      .from(leads)
      .where(eq(leads.phone, sms.from.replace(/^\+1/, "")))
      .limit(1)

    if (!lead2) {
      console.log("[Twilio SMS Webhook] No lead found for phone:", sms.from)
      // Could create a new lead or log to a general inbox
      return
    }
  }

  const targetLead = lead

  // Log the communication
  await db.insert(leadCommunications).values({
    leadId: targetLead.id,
    channel: "sms",
    direction: "inbound",
    smsContent: sms.body,
    smsStatus: "received",
    outcome: analyzeMessageSentiment(sms.body),
  })

  // Update lead activity
  await db
    .update(leads)
    .set({
      lastActivityAt: new Date(),
      updatedAt: new Date(),
      // Increase interest if they're responding
      interestLevel: targetLead.interestLevel === "cold" ? "warm" : targetLead.interestLevel,
    })
    .where(eq(leads.id, targetLead.id))

  // Check for opt-out keywords
  const optOutKeywords = ["stop", "unsubscribe", "opt out", "cancel", "quit"]
  const isOptOut = optOutKeywords.some(keyword =>
    sms.body.toLowerCase().includes(keyword)
  )

  if (isOptOut) {
    console.log("[Twilio SMS Webhook] Opt-out detected for lead:", targetLead.id)
    await db
      .update(leads)
      .set({
        status: "dnc",
        statusReason: "SMS opt-out",
        updatedAt: new Date(),
      })
      .where(eq(leads.id, targetLead.id))
  }
}

/**
 * Handle status callback (delivery receipts)
 */
async function handleStatusCallback(body: Record<string, string>) {
  const messageSid = body.MessageSid
  const status = body.MessageStatus // sent, delivered, failed, undelivered

  console.log("[Twilio SMS Webhook] Status update:", { messageSid, status })

  if (!isDbConfigured() || !db) return

  // Find and update the communication record
  // Note: We'd need to store the messageSid when sending to update here
  // For now, just log the status

  // Could implement by adding a twilioMessageSid column to leadCommunications
  // await db
  //   .update(leadCommunications)
  //   .set({ smsStatus: status })
  //   .where(eq(leadCommunications.twilioMessageSid, messageSid))
}

/**
 * Analyze message sentiment
 */
function analyzeMessageSentiment(message: string): "positive" | "neutral" | "negative" {
  const lower = message.toLowerCase()

  // Negative keywords
  const negativeKeywords = [
    "not interested", "stop", "no thanks", "remove", "unsubscribe",
    "don't call", "don't contact", "leave me alone", "spam"
  ]
  if (negativeKeywords.some(k => lower.includes(k))) {
    return "negative"
  }

  // Positive keywords
  const positiveKeywords = [
    "interested", "yes", "tell me more", "sounds good", "call me",
    "schedule", "demo", "sign up", "let's talk", "how much"
  ]
  if (positiveKeywords.some(k => lower.includes(k))) {
    return "positive"
  }

  return "neutral"
}

/**
 * Format phone for database lookup
 */
function formatPhoneForLookup(phone: string): string {
  // Remove +1 prefix and non-digits
  return phone.replace(/^\+1/, "").replace(/\D/g, "")
}

/**
 * Generate TwiML response
 */
function twimlResponse(message?: string): Response {
  const twiml = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`

  return new Response(twiml, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}

/**
 * GET /api/webhooks/twilio/sms
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "twilio-sms-webhook" })
}
