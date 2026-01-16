import { NextRequest } from "next/server"
import { db, isDbConfigured, leads } from "@/lib/db"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import crypto from "crypto"

const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET || ""

function verifySignature(payload: string, signature: string): boolean {
  if (!GHL_WEBHOOK_SECRET) return true // Skip in dev
  const expected = crypto.createHmac("sha256", GHL_WEBHOOK_SECRET).update(payload).digest("hex")
  // Cast to any to avoid "Type 'Buffer' is not assignable to type 'ArrayBufferView'" error in some environments
  return crypto.timingSafeEqual(Buffer.from(signature) as any, Buffer.from(expected) as any)
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const signature = headersList.get("x-ghl-signature") || ""
    const body = await request.text()

    if (GHL_WEBHOOK_SECRET && !verifySignature(body, signature)) {
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    console.log("[GHL Webhook] Received:", payload.type)

    // Handle different event types
    switch (payload.type) {
      case "contact.created":
      case "contact.updated":
        await handleContactEvent(payload)
        break
      case "opportunity.created":
      case "opportunity.updated":
        await handleOpportunityEvent(payload)
        break
      case "form.submitted":
        await handleFormSubmission(payload)
        break
      default:
        console.log("[GHL Webhook] Unhandled event type:", payload.type)
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("[GHL Webhook] Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

async function handleContactEvent(payload: any) {
  if (!isDbConfigured()) return

  const contact = payload.contact || payload.data
  const ghlContactId = contact.id

  // Find existing lead by email (ghlContactId field not yet in schema)
  const [existing] = await db!.select().from(leads)
    .where(eq(leads.email, contact.email || "")).limit(1)

  if (existing) {
    await db!.update(leads).set({
      firstName: contact.firstName || existing.firstName,
      lastName: contact.lastName || existing.lastName,
      phone: contact.phone || existing.phone,
      updatedAt: new Date()
    }).where(eq(leads.id, existing.id))
    console.log("[GHL] Updated lead:", existing.id)
  } else if (payload.type === "contact.created") {
    await db!.insert(leads).values({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      source: "ghl_sync",
      // ghlContactId: ghlContactId, // TODO: Add this field to schema
      status: "new"
    })
    console.log("[GHL] Created lead from contact:", ghlContactId)
  }
}

async function handleOpportunityEvent(payload: any) {
  const opp = payload.opportunity || payload.data
  console.log("[GHL] Opportunity event:", opp.id, opp.status)
  // Map opportunity stages to lead status if needed
}

async function handleFormSubmission(payload: any) {
  const form = payload.data
  console.log("[GHL] Form submission:", form.formId)
  // Create lead from form submission
}
