import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, partnerDocuments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/demo-documents"

/**
 * Trigger the post-signing onboarding automation
 * Calls the /api/partner/onboarding-complete endpoint
 */
async function triggerOnboardingAutomation(partnerId: string): Promise<void> {
  try {
    // Get the base URL from environment or construct it
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    console.log(`Triggering onboarding automation for partner: ${partnerId}`)

    const response = await fetch(`${baseUrl}/api/partner/onboarding-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partnerId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Automation failed: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    console.log(`Onboarding automation completed:`, result)
  } catch (error) {
    console.error('Error in onboarding automation:', error)
    // Re-throw to be caught by the caller
    throw error
  }
}

// POST /api/documents/sign - Record a document signature
export async function POST(request: Request) {
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
      return NextResponse.json(
        { success: false, error: `Invalid documentType. Must be one of: ${validTypes.join(", ")}` },
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
    await db.insert(partnerDocuments).values({
      partnerId,
      documentType,
      status: "signed",
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

    const allSigned =
      updatedPartner.agreementSigned &&
      updatedPartner.w9Signed &&
      updatedPartner.directDepositSigned

    // If all documents signed, update status and trigger automation
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
      // Run asynchronously so we don't block the response
      triggerOnboardingAutomation(partnerId).catch((error) => {
        console.error("Error triggering onboarding automation:", error)
      })
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
}

// GET /api/documents/sign?partnerId=xxx - Get partner's document signing status
export async function GET(request: Request) {
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
      return NextResponse.json(
        { success: false, error: "Partner not found" },
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

    return NextResponse.json({
      success: true,
      partnerId,
      documentsStatus: partner.documentsStatus,
      documents: {
        partner_agreement: {
          signed: partner.agreementSigned || false,
          signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.PARTNER_AGREEMENT)?.signedAt,
        },
        w9: {
          signed: partner.w9Signed || false,
          signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.W9)?.signedAt,
        },
        direct_deposit: {
          signed: partner.directDepositSigned || false,
          signedAt: signedDocs.find((d) => d.documentType === DOCUMENT_TYPES.DIRECT_DEPOSIT)?.signedAt,
        },
      },
      allSigned: partner.agreementSigned && partner.w9Signed && partner.directDepositSigned,
    })
  } catch (error) {
    console.error("Error fetching document status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch document status" },
      { status: 500 }
    )
  }
}
