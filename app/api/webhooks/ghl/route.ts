import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, partners, partnerDocuments, webhookEvents } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { createHmac, timingSafeEqual } from "crypto"
import { z } from "zod"

// Environment variable for webhook secret
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET

// Zod schemas for payload validation
const basePayloadSchema = z.object({
  event: z.string().optional(),
  type: z.string().optional(),
}).passthrough()

const documentPayloadSchema = z.object({
  documentId: z.string().uuid().optional(),
  documentType: z.enum(["partner_agreement", "w9", "direct_deposit"]).optional(),
  contactId: z.string().optional(),
  partnerId: z.string().uuid().optional(),
  signedAt: z.string().datetime().optional(),
  viewedAt: z.string().datetime().optional(),
  reason: z.string().optional(),
})

const contactPayloadSchema = z.object({
  contactId: z.string().optional(),
  customFields: z.record(z.string()).optional(),
})

const opportunityPayloadSchema = z.object({
  opportunityId: z.string().optional(),
  contactId: z.string().optional(),
  stageId: z.string().optional(),
  stageName: z.string().optional(),
})

const partnerPayloadSchema = z.object({
  partnerId: z.string().uuid().optional(),
  contactId: z.string().optional(),
  approvedBy: z.string().optional(),
  reason: z.string().optional(),
})

/**
 * Verify HMAC-SHA256 signature from GoHighLevel
 */
function verifyGHLSignature(payload: string, signature: string): boolean {
  if (!GHL_WEBHOOK_SECRET) {
    console.error("[GHL Webhook] GHL_WEBHOOK_SECRET not configured")
    return false
  }

  try {
    const expectedSignature = createHmac("sha256", GHL_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex")

    // Use timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, "hex")
    const expectedBuffer = Buffer.from(expectedSignature, "hex")

    if (sigBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(sigBuffer, expectedBuffer)
  } catch {
    console.error("[GHL Webhook] Signature verification error")
    return false
  }
}

/**
 * POST /api/webhooks/ghl
 *
 * Webhook endpoint for GoHighLevel events:
 * - Document signed
 * - Document viewed
 * - Document declined
 * - Contact updated
 * - Opportunity stage changed
 * - Partner approved (custom workflow action)
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify webhook signature (required in production)
    const signature = request.headers.get("x-ghl-signature")
    const isDevMode = process.env.NODE_ENV === "development"

    if (!isDevMode) {
      if (!GHL_WEBHOOK_SECRET) {
        console.error("[GHL Webhook] GHL_WEBHOOK_SECRET not configured - rejecting request")
        return NextResponse.json(
          { error: "Webhook secret not configured" },
          { status: 500 }
        )
      }

      if (!signature) {
        console.error("[GHL Webhook] Missing x-ghl-signature header")
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        )
      }

      if (!verifyGHLSignature(rawBody, signature)) {
        console.error("[GHL Webhook] Invalid signature")
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    } else if (!signature) {
      console.warn("[GHL Webhook] DEV MODE: Skipping signature verification")
    }

    // Parse and validate payload
    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      )
    }

    // Validate base payload structure
    const baseResult = basePayloadSchema.safeParse(payload)
    if (!baseResult.success) {
      console.error("[GHL Webhook] Invalid payload structure:", baseResult.error)
      return NextResponse.json(
        { error: "Invalid payload structure", details: baseResult.error.flatten() },
        { status: 400 }
      )
    }
    // Use validated payload data
    const validatedPayload = baseResult.data


    // Log the webhook event
    console.log("[GHL Webhook] Received event:", JSON.stringify(validatedPayload, null, 2))

    // Store the webhook event for audit purposes
    if (isDbConfigured() && db) {
      try {
        await db.insert(webhookEvents).values({
          source: "ghl",
          eventType: validatedPayload.event || validatedPayload.type || "unknown",
          payload: JSON.stringify(validatedPayload),
          processed: false,
        })
      } catch (logError) {
        console.error("[GHL Webhook] Failed to log event:", logError)
      }
    }

    // Route to appropriate handler based on event type
    const eventType = validatedPayload.event || validatedPayload.type

    switch (eventType) {
      case "document.signed":
        await handleDocumentSigned(payload)
        break

      case "document.viewed":
        await handleDocumentViewed(payload)
        break

      case "document.declined":
        await handleDocumentDeclined(payload)
        break

      case "document.expired":
        await handleDocumentExpired(payload)
        break

      case "contact.updated":
        await handleContactUpdated(payload)
        break

      case "opportunity.stage_changed":
        await handleOpportunityStageChanged(payload)
        break

      case "partner.approved":
        await handlePartnerApproved(payload)
        break

      case "partner.rejected":
        await handlePartnerRejected(payload)
        break

      default:
        console.log(`[GHL Webhook] Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true, event: eventType })
  } catch (error) {
    console.error("[GHL Webhook] Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle document signed event
 */
async function handleDocumentSigned(payload: unknown) {
  // Validate payload with Zod
  const result = documentPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid document.signed payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Document signed:", validatedPayload)

  if (!isDbConfigured() || !db) {
    console.log("[GHL Webhook] Database not configured, skipping")
    return
  }

  const { documentType, contactId, partnerId, signedAt } = validatedPayload

  // Find partner by GHL contact ID or partner ID
  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) {
    console.log("[GHL Webhook] Partner not found for document signed event")
    return
  }

  // Update document status
  if (documentType && validatedPayload.documentId) {
    await db
      .update(partnerDocuments)
      .set({
        status: "signed",
        signedAt: signedAt ? new Date(signedAt) : new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(partnerDocuments.partnerId, partner.id),
          eq(partnerDocuments.documentType, documentType)
        )
      )
  }

  // Update partner document flags based on document type
  const updateData: Record<string, boolean | Date | string> = {
    updatedAt: new Date(),
  }

  switch (documentType) {
    case "partner_agreement":
      updateData.agreementSigned = true
      break
    case "w9":
      updateData.w9Signed = true
      break
    case "direct_deposit":
      updateData.directDepositSigned = true
      break
  }

  await db
    .update(partners)
    .set(updateData)
    .where(eq(partners.id, partner.id))

  // Check if all documents are signed
  const updatedPartner = await db
    .select()
    .from(partners)
    .where(eq(partners.id, partner.id))
    .limit(1)

  if (
    updatedPartner[0]?.agreementSigned &&
    updatedPartner[0]?.w9Signed &&
    updatedPartner[0]?.directDepositSigned
  ) {
    // All documents signed - update status
    await db
      .update(partners)
      .set({
        documentsStatus: "completed",
        documentsCompletedAt: new Date(),
        status: "under_review",
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partner.id))

    console.log(`[GHL Webhook] All documents signed for partner ${partner.id}`)
  }
}

/**
 * Handle document viewed event
 */
async function handleDocumentViewed(payload: unknown) {
  const result = documentPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid document.viewed payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Document viewed:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId, viewedAt } = validatedPayload

  // Find partner
  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) return

  // Update document status to viewed
  if (documentType) {
    await db
      .update(partnerDocuments)
      .set({
        status: "viewed",
        viewedAt: viewedAt ? new Date(viewedAt) : new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(partnerDocuments.partnerId, partner.id),
          eq(partnerDocuments.documentType, documentType)
        )
      )
  }

  // Update partner documents status to pending if not already completed
  if (partner.documentsStatus !== "completed") {
    await db
      .update(partners)
      .set({
        documentsStatus: "pending",
        status: "documents_pending",
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partner.id))
  }
}

/**
 * Handle document declined event
 */
async function handleDocumentDeclined(payload: unknown) {
  const result = documentPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid document.declined payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Document declined:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId } = validatedPayload

  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) return

  // Update document status
  if (documentType) {
    await db
      .update(partnerDocuments)
      .set({
        status: "declined",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(partnerDocuments.partnerId, partner.id),
          eq(partnerDocuments.documentType, documentType)
        )
      )
  }

  // Update partner status
  await db
    .update(partners)
    .set({
      status: "suspended",
      updatedAt: new Date(),
    })
    .where(eq(partners.id, partner.id))
}

/**
 * Handle document expired event
 */
async function handleDocumentExpired(payload: unknown) {
  const result = documentPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid document.expired payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Document expired:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId } = validatedPayload

  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) return

  // Update document status
  if (documentType) {
    await db
      .update(partnerDocuments)
      .set({
        status: "expired",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(partnerDocuments.partnerId, partner.id),
          eq(partnerDocuments.documentType, documentType)
        )
      )
  }
}

/**
 * Handle contact updated event
 */
async function handleContactUpdated(payload: unknown) {
  const result = contactPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid contact.updated payload:", result.error.flatten())
    return
  }

  console.log("[GHL Webhook] Contact updated:", result.data)
  // Sync any relevant fields from GHL to our database if needed
}

/**
 * Handle opportunity stage changed event
 */
async function handleOpportunityStageChanged(payload: unknown) {
  const result = opportunityPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid opportunity.stage_changed payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Opportunity stage changed:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { contactId, stageName } = validatedPayload

  if (!contactId || !stageName) return

  const partnerResult = await db
    .select()
    .from(partners)
    .where(eq(partners.ghlContactId, contactId))
    .limit(1)

  if (partnerResult.length === 0) return

  const partner = partnerResult[0]

  // Map GHL stage names to our status
  let newStatus: string | null = null
  switch (stageName.toLowerCase()) {
    case "new lead":
      newStatus = "pending"
      break
    case "documents sent":
      newStatus = "documents_sent"
      break
    case "documents pending":
      newStatus = "documents_pending"
      break
    case "review":
      newStatus = "under_review"
      break
    case "active partner":
      newStatus = "active"
      break
    case "declined":
    case "issues":
      newStatus = "suspended"
      break
  }

  if (newStatus) {
    await db
      .update(partners)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partner.id))
  }
}

/**
 * Handle partner approved event (custom workflow trigger)
 */
async function handlePartnerApproved(payload: unknown) {
  const result = partnerPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid partner.approved payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Partner approved:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { partnerId, contactId } = validatedPayload

  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) {
    console.log("[GHL Webhook] Partner not found for approval")
    return
  }

  // Activate the partner
  await db
    .update(partners)
    .set({
      status: "active",
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(partners.id, partner.id))

  console.log(`[GHL Webhook] Partner ${partner.id} activated`)
}

/**
 * Handle partner rejected event
 */
async function handlePartnerRejected(payload: unknown) {
  const result = partnerPayloadSchema.safeParse(payload)
  if (!result.success) {
    console.error("[GHL Webhook] Invalid partner.rejected payload:", result.error.flatten())
    return
  }

  const validatedPayload = result.data
  console.log("[GHL Webhook] Partner rejected:", validatedPayload)

  if (!isDbConfigured() || !db) return

  const { partnerId, contactId } = validatedPayload

  let partner
  if (partnerId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)
    partner = result[0]
  } else if (contactId) {
    const result = await db
      .select()
      .from(partners)
      .where(eq(partners.ghlContactId, contactId))
      .limit(1)
    partner = result[0]
  }

  if (!partner) return

  await db
    .update(partners)
    .set({
      status: "suspended",
      updatedAt: new Date(),
    })
    .where(eq(partners.id, partner.id))
}

/**
 * GET /api/webhooks/ghl
 *
 * Health check endpoint for webhook verification
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    webhook: "ghl",
    timestamp: new Date().toISOString(),
  })
}
