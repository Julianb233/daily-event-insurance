import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerProducts, partnerDocuments } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode, MOCK_PARTNER, MOCK_PRODUCTS } from "@/lib/mock-data"
import { getGHLClient, isGHLConfigured } from "@/lib/ghl"

/**
 * GET /api/partner
 * Get current partner's profile
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode or no database - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock partner data")
      return NextResponse.json({ partner: MOCK_PARTNER })
    }

    const result = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ partner: result[0] })
  })
}

/**
 * POST /api/partner
 * Create a new partner profile (called from onboarding)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requireAuth()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

    // Check if partner already exists
    const existing = await db!
      .select({ id: partners.id })
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Partner exists", message: "Partner profile already exists" },
        { status: 409 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      businessName, business_name,
      businessType, business_type,
      contactName, contact_name,
      contactEmail, contact_email,
      contactPhone, contact_phone,
      integrationType, integration_type,
      primaryColor, primary_color,
      logoUrl, logo_url,
      products,
    } = body

    // Use the value (supporting both formats)
    const finalBusinessName = business_name || businessName
    const finalBusinessType = business_type || businessType
    const finalContactName = contact_name || contactName
    const finalContactEmail = contact_email || contactEmail
    const finalContactPhone = contact_phone || contactPhone
    const finalIntegrationType = integration_type || integrationType
    const finalPrimaryColor = primary_color || primaryColor
    const finalLogoUrl = logo_url || logoUrl

    // Validate required fields
    if (!finalBusinessName || !finalBusinessType || !finalContactName || !finalContactEmail) {
      return NextResponse.json(
        { error: "Validation error", message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create partner record
    const [partner] = await db!
      .insert(partners)
      .values({
        userId: userId,
        businessName: finalBusinessName,
        businessType: finalBusinessType,
        contactName: finalContactName,
        contactEmail: finalContactEmail,
        contactPhone: finalContactPhone || null,
        integrationType: finalIntegrationType || "widget",
        primaryColor: finalPrimaryColor || "#14B8A6",
        logoUrl: finalLogoUrl || null,
        status: "pending",
      })
      .returning()

    if (!partner) {
      return NextResponse.json(
        { error: "Database error", message: "Failed to create partner" },
        { status: 500 }
      )
    }

    // Create product configurations
    const productConfigs = products && Array.isArray(products) && products.length > 0
      ? products.map((p: { product_type: string; is_enabled?: boolean; customer_price?: number }) => ({
          partnerId: partner.id,
          productType: p.product_type,
          isEnabled: p.is_enabled ?? true,
          customerPrice: String(p.customer_price ?? 4.99),
        }))
      : [
          { partnerId: partner.id, productType: "liability", isEnabled: true, customerPrice: "4.99" },
          { partnerId: partner.id, productType: "equipment", isEnabled: false, customerPrice: "9.99" },
          { partnerId: partner.id, productType: "cancellation", isEnabled: false, customerPrice: "14.99" },
        ]

    try {
      await db!.insert(partnerProducts).values(productConfigs)
    } catch (productError) {
      console.error("Error creating products:", productError)
      // Don't fail the whole request, just log it
    }

    // Initiate GHL onboarding (create contact and send documents)
    if (isGHLConfigured()) {
      try {
        const ghl = getGHLClient()
        const ghlResult = await ghl.initiatePartnerOnboarding({
          partnerId: partner.id,
          businessName: finalBusinessName,
          businessType: finalBusinessType,
          contactName: finalContactName,
          contactEmail: finalContactEmail,
          contactPhone: finalContactPhone || undefined,
          integrationType: finalIntegrationType || "widget",
        })

        // Update partner with GHL IDs
        if (ghlResult.contactId || ghlResult.opportunityId) {
          await db!
            .update(partners)
            .set({
              ghlContactId: ghlResult.contactId,
              ghlOpportunityId: ghlResult.opportunityId,
              documentsStatus: "sent",
              documentsSentAt: new Date(),
              status: "documents_sent",
              updatedAt: new Date(),
            })
            .where(eq(partners.id, partner.id))

          // Create document records
          const documentTypes = ["partner_agreement", "w9", "direct_deposit"]
          await db!.insert(partnerDocuments).values(
            documentTypes.map((docType) => ({
              partnerId: partner.id,
              documentType: docType,
              status: "sent",
              sentAt: new Date(),
            }))
          )
        }

        console.log(`[Partner] GHL onboarding initiated for partner ${partner.id}`)
      } catch (ghlError) {
        console.error("[Partner] GHL onboarding error:", ghlError)
        // Don't fail partner creation if GHL fails - admin can trigger manually
      }
    } else {
      console.log("[Partner] GHL not configured, skipping document sending")
    }

    return NextResponse.json({ partner }, { status: 201 })
  })
}
