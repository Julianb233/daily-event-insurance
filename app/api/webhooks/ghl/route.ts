import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, partners, partnerDocuments, webhookEvents } from "@/lib/db"
import { eq, and } from "drizzle-orm"

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
    const payload = await request.json()

    // Log the webhook event
    console.log("[GHL Webhook] Received event:", JSON.stringify(payload, null, 2))

    // Verify webhook authenticity (optional - add secret verification)
    const webhookSecret = request.headers.get("x-ghl-signature")
    // TODO: Implement signature verification if GHL provides it

    // Store the webhook event for audit purposes
    if (isDbConfigured() && db) {
      try {
        await db.insert(webhookEvents).values({
          source: "ghl",
          eventType: payload.event || payload.type || "unknown",
          payload: JSON.stringify(payload),
          processed: false,
        })
      } catch (logError) {
        console.error("[GHL Webhook] Failed to log event:", logError)
      }
    }

    // Route to appropriate handler based on event type
    const eventType = payload.event || payload.type

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
async function handleDocumentSigned(payload: {
  documentId?: string;
  documentType?: string;
  contactId?: string;
  partnerId?: string;
  signedAt?: string;
}) {
  console.log("[GHL Webhook] Document signed:", payload)

  if (!isDbConfigured() || !db) {
    console.log("[GHL Webhook] Database not configured, skipping")
    return
  }

  const { documentType, contactId, partnerId, signedAt } = payload

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
  if (documentType && payload.documentId) {
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
async function handleDocumentViewed(payload: {
  documentId?: string;
  documentType?: string;
  contactId?: string;
  partnerId?: string;
  viewedAt?: string;
}) {
  console.log("[GHL Webhook] Document viewed:", payload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId, viewedAt } = payload

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
async function handleDocumentDeclined(payload: {
  documentId?: string;
  documentType?: string;
  contactId?: string;
  partnerId?: string;
  reason?: string;
}) {
  console.log("[GHL Webhook] Document declined:", payload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId } = payload

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
async function handleDocumentExpired(payload: {
  documentId?: string;
  documentType?: string;
  contactId?: string;
  partnerId?: string;
}) {
  console.log("[GHL Webhook] Document expired:", payload)

  if (!isDbConfigured() || !db) return

  const { documentType, contactId, partnerId } = payload

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
async function handleContactUpdated(payload: {
  contactId?: string;
  customFields?: Record<string, string>;
}) {
  console.log("[GHL Webhook] Contact updated:", payload)
  // Sync any relevant fields from GHL to our database if needed
}

/**
 * Handle opportunity stage changed event
 */
async function handleOpportunityStageChanged(payload: {
  opportunityId?: string;
  contactId?: string;
  stageId?: string;
  stageName?: string;
}) {
  console.log("[GHL Webhook] Opportunity stage changed:", payload)

  if (!isDbConfigured() || !db) return

  const { contactId, stageName } = payload

  if (!contactId || !stageName) return

  const result = await db
    .select()
    .from(partners)
    .where(eq(partners.ghlContactId, contactId))
    .limit(1)

  if (result.length === 0) return

  const partner = result[0]

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
async function handlePartnerApproved(payload: {
  partnerId?: string;
  contactId?: string;
  approvedBy?: string;
}) {
  console.log("[GHL Webhook] Partner approved:", payload)

  if (!isDbConfigured() || !db) return

  const { partnerId, contactId } = payload

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
async function handlePartnerRejected(payload: {
  partnerId?: string;
  contactId?: string;
  reason?: string;
}) {
  console.log("[GHL Webhook] Partner rejected:", payload)

  if (!isDbConfigured() || !db) return

  const { partnerId, contactId } = payload

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
