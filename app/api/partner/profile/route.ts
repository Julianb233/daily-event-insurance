import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerProducts } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode, MOCK_PARTNER, MOCK_PRODUCTS } from "@/lib/mock-data"

/**
 * GET /api/partner/profile
 * Get partner profile with products
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock profile data")
      return NextResponse.json({
        partner: MOCK_PARTNER,
        products: MOCK_PRODUCTS,
      })
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Get products
    const products = await db!
      .select()
      .from(partnerProducts)
      .where(eq(partnerProducts.partnerId, partner.id))

    return NextResponse.json({
      partner,
      products,
    })
  })
}

/**
 * PATCH /api/partner/profile
 * Update partner profile
 */
export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Parse request body
    const body = await request.json()
    const {
      businessName,
      businessType,
      contactName,
      contactEmail,
      contactPhone,
      integrationType,
      primaryColor,
      logoUrl,
      products: productUpdates,
    } = body

    // Build update object with only provided fields
    const updateData: Partial<typeof partners.$inferInsert> = {}
    if (businessName !== undefined) updateData.businessName = businessName
    if (businessType !== undefined) updateData.businessType = businessType
    if (contactName !== undefined) updateData.contactName = contactName
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone
    if (integrationType !== undefined) updateData.integrationType = integrationType
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl

    // Update partner if there are changes
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date()
      await db!
        .update(partners)
        .set(updateData)
        .where(eq(partners.id, partner.id))
    }

    // Update products if provided
    if (productUpdates && Array.isArray(productUpdates)) {
      for (const product of productUpdates) {
        const { productType, isEnabled, customerPrice } = product
        if (!productType) continue

        // Check if product exists
        const existingProduct = await db!
          .select()
          .from(partnerProducts)
          .where(eq(partnerProducts.partnerId, partner.id))
          .limit(1)

        if (existingProduct.length > 0) {
          await db!
            .update(partnerProducts)
            .set({
              isEnabled: isEnabled ?? true,
              customerPrice: String(customerPrice ?? 4.99),
            })
            .where(eq(partnerProducts.id, existingProduct[0].id))
        } else {
          await db!.insert(partnerProducts).values({
            partnerId: partner.id,
            productType,
            isEnabled: isEnabled ?? true,
            customerPrice: String(customerPrice ?? 4.99),
          })
        }
      }
    }

    // Fetch and return updated profile
    const updatedPartner = await db!
      .select()
      .from(partners)
      .where(eq(partners.id, partner.id))
      .limit(1)

    const updatedProducts = await db!
      .select()
      .from(partnerProducts)
      .where(eq(partnerProducts.partnerId, partner.id))

    return NextResponse.json({
      partner: updatedPartner[0],
      products: updatedProducts,
    })
  })
}
