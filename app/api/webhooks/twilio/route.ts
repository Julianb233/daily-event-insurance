import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq } from "drizzle-orm"
import {
  parseInboundSms,
  generateTwimlResponse,
  validateWebhookSignature,
  isOptOutMessage,
  isOptInMessage,
  isTwilioConfigured,
} from "@/lib/twilio"

/**
 * POST /api/webhooks/twilio
 * Handle inbound SMS messages from Twilio
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data (Twilio sends form-encoded)
    const formData = await request.formData()
    const params: Record<string, string> = {}
    formData.forEach((value, key) => {
      params[key] = value.toString()
    })

    // Validate webhook signature (optional but recommended)
    const signature = request.headers.get("x-twilio-signature") || ""
    const url = request.url

    if (isTwilioConfigured() && signature) {
      const isValid = validateWebhookSignature(signature, url, params)
      if (!isValid) {
        console.error("[Twilio Webhook] Invalid signature")
        return new NextResponse("Invalid signature", { status: 401 })
      }
    }

    // Parse the inbound SMS
    const sms = parseInboundSms(params)
    console.log(`[Twilio Webhook] Inbound SMS from ${sms.from}: ${sms.body.substring(0, 50)}...`)

    // Handle opt-out messages
    if (isOptOutMessage(sms.body)) {
      await handleOptOut(sms.from)
      return new NextResponse(
        generateTwimlResponse("You have been unsubscribed. Reply START to re-subscribe."),
        { headers: { "Content-Type": "text/xml" } }
      )
    }

    // Handle opt-in messages
    if (isOptInMessage(sms.body)) {
      await handleOptIn(sms.from)
      return new NextResponse(
        generateTwimlResponse("Welcome back! You are now subscribed to messages from Daily Event Insurance."),
        { headers: { "Content-Type": "text/xml" } }
      )
    }

    // Find or create lead based on phone number
    const lead = await findOrCreateLeadByPhone(sms.from, sms)

    if (lead && isDbConfigured()) {
      // Log the inbound communication
      await db!.insert(leadCommunications).values({
        leadId: lead.id,
        channel: "sms",
        direction: "inbound",
        smsContent: sms.body,
        smsStatus: "received",
      })

      // Update lead activity
      await db!
        .update(leads)
        .set({
          lastActivityAt: new Date(),
          interestLevel: lead.interestLevel === "cold" ? "warm" : lead.interestLevel,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, lead.id))
    }

    // Generate auto-response based on message content
    const autoResponse = generateAutoResponse(sms.body, lead)

    return new NextResponse(
      generateTwimlResponse(autoResponse),
      { headers: { "Content-Type": "text/xml" } }
    )
  } catch (error: any) {
    console.error("[Twilio Webhook] Error:", error)
    return new NextResponse(
      generateTwimlResponse(),
      { headers: { "Content-Type": "text/xml" } }
    )
  }
}

/**
 * Handle opt-out request
 */
async function handleOptOut(phone: string): Promise<void> {
  if (!isDbConfigured()) return

  const normalizedPhone = phone.replace(/\D/g, "")

  try {
    // Find lead by phone
    const [lead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.phone, normalizedPhone))
      .limit(1)

    if (lead) {
      // Mark as DNC
      await db!
        .update(leads)
        .set({
          status: "dnc",
          statusReason: "SMS opt-out received",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, lead.id))

      console.log(`[Twilio Webhook] Lead ${lead.id} opted out`)
    }
  } catch (error) {
    console.error("[Twilio Webhook] Opt-out error:", error)
  }
}

/**
 * Handle opt-in request
 */
async function handleOptIn(phone: string): Promise<void> {
  if (!isDbConfigured()) return

  const normalizedPhone = phone.replace(/\D/g, "")

  try {
    // Find lead by phone
    const [lead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.phone, normalizedPhone))
      .limit(1)

    if (lead && lead.status === "dnc") {
      // Remove DNC status
      await db!
        .update(leads)
        .set({
          status: "new",
          statusReason: "SMS opt-in received",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, lead.id))

      console.log(`[Twilio Webhook] Lead ${lead.id} opted in`)
    }
  } catch (error) {
    console.error("[Twilio Webhook] Opt-in error:", error)
  }
}

/**
 * Find or create a lead based on phone number
 */
async function findOrCreateLeadByPhone(
  phone: string,
  sms: { from: string; body: string; fromCity?: string; fromState?: string }
): Promise<{ id: string; interestLevel: string | null } | null> {
  if (!isDbConfigured()) return null

  const normalizedPhone = phone.replace(/\D/g, "")

  try {
    // Try to find existing lead
    const [existingLead] = await db!
      .select({ id: leads.id, interestLevel: leads.interestLevel })
      .from(leads)
      .where(eq(leads.phone, normalizedPhone))
      .limit(1)

    if (existingLead) {
      return existingLead
    }

    // Create new lead from inbound SMS
    const [newLead] = await db!
      .insert(leads)
      .values({
        source: "inbound_sms",
        firstName: "SMS",
        lastName: "Contact",
        email: `sms-${Date.now()}@unknown.com`,
        phone: normalizedPhone,
        city: sms.fromCity || undefined,
        state: sms.fromState || undefined,
        status: "new",
        interestLevel: "warm", // Inbound SMS indicates interest
      })
      .returning({ id: leads.id, interestLevel: leads.interestLevel })

    console.log(`[Twilio Webhook] Created new lead ${newLead.id} from inbound SMS`)
    return newLead
  } catch (error) {
    console.error("[Twilio Webhook] Find/create lead error:", error)
    return null
  }
}

/**
 * Generate an automatic response based on message content
 */
function generateAutoResponse(
  message: string,
  lead: { id: string; interestLevel: string | null } | null
): string | undefined {
  const lowerMessage = message.toLowerCase().trim()

  // Greeting responses
  if (["hi", "hello", "hey"].some((g) => lowerMessage.startsWith(g))) {
    return "Hi there! Thanks for reaching out to Daily Event Insurance. How can I help you today? Reply INFO for more details about our partner program."
  }

  // Info request
  if (lowerMessage.includes("info") || lowerMessage.includes("information")) {
    return "Daily Event Insurance helps gyms & fitness businesses offer same-day coverage to members. Partners earn 15-25% commission! Want to learn more? Reply DEMO to schedule a call."
  }

  // Demo request
  if (lowerMessage.includes("demo") || lowerMessage.includes("call")) {
    return "Great! One of our partnership specialists will call you within 24 hours. You can also book directly at: https://dailyeventinsurance.com/demo"
  }

  // Pricing question
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
    return "There's no cost to partners! Members pay $5-15 per day for coverage, and you earn 15-25% commission on each policy. Reply DEMO to learn more!"
  }

  // Help request
  if (lowerMessage.includes("help") || lowerMessage === "?") {
    return "Reply with:\nINFO - Learn about our program\nDEMO - Schedule a call\nSTOP - Unsubscribe"
  }

  // Default response for unknown messages
  return "Thanks for your message! A team member will respond shortly. Reply HELP for options."
}

/**
 * GET /api/webhooks/twilio
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "twilio-webhook",
    timestamp: new Date().toISOString(),
  })
}
