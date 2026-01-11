import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, partnerDocuments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { DOCUMENT_TYPES, getDocumentByType } from "@/lib/demo-documents"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { completePartnerOnboarding } from "@/lib/onboarding-automation"

/**
 * Admin endpoint to sign documents on behalf of partners
 * POST /api/admin/documents/sign
 *
 * This allows admins to sign pending documents for partners
 */
export async function POST(request: Request) {
  return withAuth(async () => {
    // Require admin authentication
    const { user } = await requireAdmin()

    try {
      const body = await request.json()
      const { partnerId, documentType, signature } = body

      if (!partnerId || !documentType || !signature) {
        return NextResponse.json(
          { success: false, error: "Missing required fields: partnerId, documentType, signature" },
          { status: 400 }
        )
      }

      // Validate document type
      const validTypes = Object.values(DOCUMENT_TYPES)
      if (!validTypes.includes(documentType)) {
        return NextResponse.json(
          { success: false, error: "Invalid document type" },
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

      // Get the partner
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

        // Append signature block with admin notation
        contentSnapshot += `\n\n---\n\n**Electronically Signed By:** ${signature}\n**Signed By Admin:** ${user.email}\n**Date:** ${now.toISOString()}\n**IP Address:** ${request.headers.get("x-forwarded-for") || "Unknown"}`
      }

      await db.insert(partnerDocuments).values({
        partnerId,
        documentType,
        status: "signed",
        contentSnapshot,
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
            status: "under_review",
            updatedAt: now,
          })
          .where(eq(partners.id, partnerId))

        try {
          await completePartnerOnboarding(partnerId)
        } catch (error) {
          console.error("Error triggering onboarding automation:", error)
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
        message: `${documentType} signed successfully by admin`,
        signedBy: user.email,
        allDocumentsSigned: allSigned,
        automationTriggered: allSigned,
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
