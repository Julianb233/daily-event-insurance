import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { getSupabaseServerClient, type Partner, type PartnerProduct } from "@/lib/supabase"

/**
 * GET /api/partner/profile
 * Get partner profile with products
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner with products
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("*")
      .eq("clerk_user_id", userId)
      .single() as { data: Partner | null; error: unknown }

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    // Get products
    const { data: products, error: productsError } = await supabase
      .from("partner_products")
      .select("*")
      .eq("partner_id", partner.id) as { data: PartnerProduct[] | null; error: unknown }

    if (productsError) {
      console.error("Error fetching products:", productsError)
    }

    return NextResponse.json({
      partner,
      products: products || [],
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
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

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
      products,
    } = body

    // Get partner
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single() as { data: Pick<Partner, "id"> | null; error: unknown }

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    // Build update object with only provided fields
    const updateData: Partial<Partner> = {}
    if (businessName !== undefined) updateData.business_name = businessName
    if (businessType !== undefined) updateData.business_type = businessType
    if (contactName !== undefined) updateData.contact_name = contactName
    if (contactEmail !== undefined) updateData.contact_email = contactEmail
    if (contactPhone !== undefined) updateData.contact_phone = contactPhone
    if (integrationType !== undefined) updateData.integration_type = integrationType
    if (primaryColor !== undefined) updateData.primary_color = primaryColor
    if (logoUrl !== undefined) updateData.logo_url = logoUrl

    // Update partner if there are changes
    if (Object.keys(updateData).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from("partners")
        .update(updateData)
        .eq("id", partner.id) as { error: { message: string } | null }

      if (updateError) {
        console.error("Error updating partner:", updateError)
        return NextResponse.json(
          { error: "Database error", message: updateError.message },
          { status: 500 }
        )
      }
    }

    // Update products if provided
    if (products && Array.isArray(products)) {
      for (const product of products) {
        const { productType, isEnabled, customerPrice } = product

        if (!productType) continue

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: productError } = await (supabase as any)
          .from("partner_products")
          .upsert(
            {
              partner_id: partner.id,
              product_type: productType,
              is_enabled: isEnabled ?? true,
              customer_price: customerPrice ?? 4.99,
            },
            {
              onConflict: "partner_id,product_type",
            }
          ) as { error: { message: string } | null }

        if (productError) {
          console.error("Error updating product:", productError)
        }
      }
    }

    // Fetch and return updated profile
    const { data: updatedPartner } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partner.id)
      .single() as { data: Partner | null; error: unknown }

    const { data: updatedProducts } = await supabase
      .from("partner_products")
      .select("*")
      .eq("partner_id", partner.id) as { data: PartnerProduct[] | null; error: unknown }

    return NextResponse.json({
      partner: updatedPartner,
      products: updatedProducts || [],
    })
  })
}
