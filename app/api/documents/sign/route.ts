import { NextResponse } from "next/server"
import { completePartnerOnboarding } from "@/lib/onboarding-automation"
import { db } from "@/lib/db"
import { partners, partnerDocuments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { DOCUMENT_TYPES, type DocumentType, getDocumentByType } from "@/lib/demo-documents"
import { requirePartner, withAuth } from "@/lib/api-auth"

/**
 * Trigger the post-signing onboarding automation
 * Calls the /api/partner/onboarding-complete endpoint
 */
// POST /api/documents/sign - Record a document signature
// SECURITY: Requires partner authentication and ownership verification
export async function POST(request: Request) {
  return withAuth(async () => {
    // Require partner authentication
    // SECURITY: This must be outside try-catch to properly return 401/403
    const { userId } = await requirePartner()

    try {
      const body = await request.json()
      const { partnerId, documentType, signature, signedByName, signedByEmail } = body

      if (!partnerId || !documentType || !signature) {
        return NextResponse.json(
          { success: false, error: "Missing required fields: partnerId, documentType, signature" },
          { status: 400 }
        )
      }

      // Validate document type
      const validTypes = Object.values(DOCUMENT_TYPES)
      if (!validTypes.includes(documentType)) {
        // SECURITY: Don't expose valid types in production
        const isProduction = process.env.NODE_ENV === "production"
        return NextResponse.json(
          { success: false, error: isProduction ? "Invalid document type" : `Invalid documentType. Must be one of: ${validTypes.join(", ")}` },
          { status: 400 }
        )
      }

      // Check database connection
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get the partner and verify ownership
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // SECURITY: Verify the authenticated user owns this partner record
      if (partner.userId !== userId) {
        console.warn(`[SECURITY] Document signing attempt by user ${userId} for partner owned by ${partner.userId}`)
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        )
      }

      // Check if document already signed
      const existingDoc = await db
        .select()
        .from(partnerDocuments)
        .where(
          and(
            eq(partnerDocuments.partnerId, partnerId),
            eq(partnerDocuments.documentType, documentType),
            eq(partnerDocuments.status, "signed")
          )
        )
        .limit(1)

      if (existingDoc.length > 0) {
        return NextResponse.json(
          { success: false, error: "Document already signed" },
          { status: 400 }
        )
      }

      // Record the signature in partnerDocuments
      const now = new Date()
      // Generate content snapshot
      const template = getDocumentByType(documentType as any)
      let contentSnapshot = template?.content || ""

      if (contentSnapshot) {
        // Replace placeholders
        contentSnapshot = contentSnapshot
          .replace(/{{BUSINESS_NAME}}/g, partner.businessName)
          .replace(/{{BUSINESS_ADDRESS}}/g, partner.businessAddress || "[Address Not Provided]")
          .replace(/{{CONTACT_NAME}}/g, partner.contactName)
          .replace(/{{DATE}}/g, now.toLocaleDateString())

        // Append signature block
        contentSnapshot += `\n\n---\n\n**Electronically Signed By:** ${signature}\n**Date:** ${now.toISOString()}\n**IP Address:** ${request.headers.get("x-forwarded-for") || "Unknown"}`
      }

      await db.insert(partnerDocuments).values({
        partnerId,
        documentType,
        status: "signed",
        contentSnapshot, // Save the snapshot
        signedAt: now,
        createdAt: now,
        updatedAt: now,
      })

      // Update partner's document tracking fields
      const updateFields: Record<string, unknown> = {
        updatedAt: now,
      }

      if (documentType === DOCUMENT_TYPES.PARTNER_AGREEMENT) {
        updateFields.agreementSigned = true
      } else if (documentType === DOCUMENT_TYPES.W9) {
        updateFields.w9Signed = true
      } else if (documentType === DOCUMENT_TYPES.DIRECT_DEPOSIT) {
        updateFields.directDepositSigned = true
      }

      await db
        .update(partners)
        .set(updateFields)
        .where(eq(partners.id, partnerId))

      // Check if all documents are now signed
      const [updatedPartner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      // Check for other required agreements
      const otherRequiredDocs = await db
        .select()
        .from(partnerDocuments)
        .where(
          and(
            eq(partnerDocuments.partnerId, partnerId),
            eq(partnerDocuments.status, "signed")
          )
        )

      const isJointMarketingSigned = otherRequiredDocs.some(d => d.documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT)
      const isMutualNdaSigned = otherRequiredDocs.some(d => d.documentType === DOCUMENT_TYPES.MUTUAL_NDA)
      const isSponsorshipAgreementSigned = otherRequiredDocs.some(d => d.documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT)

      // New requirement: All 4 agreements are required for "Go Live"
      // W9 and Direct Deposit can be skipped/done later
      const allSigned = updatedPartner.agreementSigned &&
        isJointMarketingSigned &&
        isMutualNdaSigned &&
        isSponsorshipAgreementSigned

      // If all legal agreements signed, update status and trigger automation
      if (allSigned) {
        await db
          .update(partners)
          .set({
            documentsStatus: "completed",
            documentsCompletedAt: now,
            status: "under_review", // Move to review stage
            updatedAt: now,
          })
          .where(eq(partners.id, partnerId))

        // Trigger post-signing automation (FireCrawl, microsite, QR code, Google Sheets)
        // We call it directly to avoid middleware auth issues with loopback fetch
        try {
          // We await it to ensure it completes reliably.
          // In a high-traffic app we might use a queue, but here it's fine.
          await completePartnerOnboarding(partnerId)
        } catch (error) {
          console.error("Error triggering onboarding automation:", error)
          // We don't fail the request because the document IS signed
        }
      } else {
        await db
          .update(partners)
          .set({
            documentsStatus: "pending",
            updatedAt: now,
          })
          .where(eq(partners.id, partnerId))
      }

      return NextResponse.json({
        success: true,
        message: `${documentType} signed successfully`,
        allDocumentsSigned: allSigned,
        automationTriggered: allSigned, // Let client know automation was triggered
        documentStatus: {
          agreementSigned: documentType === DOCUMENT_TYPES.PARTNER_AGREEMENT ? true : updatedPartner.agreementSigned,
          jointMarketingSigned: documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT ? true : isJointMarketingSigned,
          mutualNdaSigned: documentType === DOCUMENT_TYPES.MUTUAL_NDA ? true : isMutualNdaSigned,
          sponsorshipAgreementSigned: documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT ? true : isSponsorshipAgreementSigned,
          w9Signed: documentType === DOCUMENT_TYPES.W9 ? true : updatedPartner.w9Signed,
          directDepositSigned: documentType === DOCUMENT_TYPES.DIRECT_DEPOSIT ? true : updatedPartner.directDepositSigned,
        },
      })
    } catch (error) {
      console.error("Error signing document:", error)
      return NextResponse.json(
        { success: false, error: "Failed to sign document" },
        { status: 500 }
      )
    }
  })
}


// GET /api/documents/sign?partnerId=xxx - Get partner's document signing status
// SECURITY: Requires partner authentication and ownership verification
export async function GET(request: Request) {
  return withAuth(async () => {
    // Require partner authentication
    // SECURITY: This must be outside try-catch to properly return 401/403
    const { userId } = await requirePartner()

    try {
      const { searchParams } = new URL(request.url)
      const partnerId = searchParams.get("partnerId")

      if (!partnerId) {
        return NextResponse.json(
          { success: false, error: "Missing partnerId parameter" },
          { status: 400 }
        )
      }

      // Check database connection
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get partner
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        // SECURITY: Return generic 404 to prevent enumeration
        return NextResponse.json(
          { success: false, error: "Not found" },
          { status: 404 }
        )
      }

      // SECURITY: Verify the authenticated user owns this partner record
      if (partner.userId !== userId) {
        // Return same 404 to prevent enumeration
        return NextResponse.json(
          { success: false, error: "Not found" },
          { status: 404 }
        )
      }

      // Get all signed documents
      const signedDocs = await db
        .select()
        .from(partnerDocuments)
        .where(
          and(
            eq(partnerDocuments.partnerId, partnerId),
            eq(partnerDocuments.status, "signed")
          )
        )

      const isJointMarketingSigned = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT)
      const isMutualNdaSigned = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.MUTUAL_NDA)
      const isSponsorshipAgreementSigned = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT)

      return NextResponse.json({
        success: true,
        partnerId,
        documentsStatus: partner.documentsStatus,
        documents: {
          partner_agreement: {
            signed: partner.agreementSigned || false,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.PARTNER_AGREEMENT)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.PARTNER_AGREEMENT)?.contentSnapshot,
          },
          joint_marketing_agreement: {
            signed: isJointMarketingSigned,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT)?.contentSnapshot,
          },
          mutual_nda: {
            signed: isMutualNdaSigned,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.MUTUAL_NDA)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.MUTUAL_NDA)?.contentSnapshot,
          },
          sponsorship_agreement: {
            signed: isSponsorshipAgreementSigned,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT)?.contentSnapshot,
          },
          w9: {
            signed: partner.w9Signed || false,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.W9)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.W9)?.contentSnapshot,
          },
          direct_deposit: {
            signed: partner.directDepositSigned || false,
            signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.DIRECT_DEPOSIT)?.signedAt,
            contentSnapshot: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.DIRECT_DEPOSIT)?.contentSnapshot,
          },
        },
        // Only require agreements for "allSigned" (which triggers "Go Live")
        allSigned: partner.agreementSigned &&
          isJointMarketingSigned &&
          isMutualNdaSigned &&
          isSponsorshipAgreementSigned,
      })
    } catch (error) {
      console.error("Error fetching document status:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch document status" },
        { status: 500 }
      )
    }
  })
}
