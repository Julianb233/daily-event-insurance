import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requirePartner, withAuth } from "@/lib/api-auth"
import { getSupabaseServerClient, type Partner, type PartnerProduct } from "@/lib/supabase"

/**
 * GET /api/partner
 * Get current partner's profile
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

    const { data: partner, error } = await supabase
      .from("partners")
      .select("*")
      .eq("clerk_user_id", userId)
      .single() as { data: Partner | null; error: { code?: string; message: string } | null }

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json(
          { error: "Partner not found", message: "Partner profile not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching partner:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ partner })
  })
}

/**
 * POST /api/partner
 * Create a new partner profile (called from onboarding)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requireAuth()
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

    // Check if partner already exists
    const { data: existing } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single() as { data: Pick<Partner, "id"> | null; error: unknown }

    if (existing) {
      return NextResponse.json(
        { error: "Partner exists", message: "Partner profile already exists" },
        { status: 409 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      // Support both camelCase and snake_case
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
    const { data: partner, error } = await (supabase as any)
      .from("partners")
      .insert({
        clerk_user_id: userId,
        business_name: finalBusinessName,
        business_type: finalBusinessType,
        contact_name: finalContactName,
        contact_email: finalContactEmail,
        contact_phone: finalContactPhone || null,
        integration_type: finalIntegrationType || "widget",
        primary_color: finalPrimaryColor || "#14B8A6",
        logo_url: finalLogoUrl || null,
        status: "pending",
      })
      .select()
      .single() as { data: Partner | null; error: { message: string } | null }

    if (error || !partner) {
      console.error("Error creating partner:", error)
      return NextResponse.json(
        { error: "Database error", message: error?.message || "Failed to create partner" },
        { status: 500 }
      )
    }

    // Create product configurations from provided products or defaults
    const productConfigs = products && Array.isArray(products) && products.length > 0
      ? products.map((p: { product_type: string; is_enabled: boolean; customer_price: number }) => ({
          partner_id: partner.id,
          product_type: p.product_type,
          is_enabled: p.is_enabled ?? true,
          customer_price: p.customer_price ?? 4.99,
        }))
      : [
          { partner_id: partner.id, product_type: "liability", is_enabled: true, customer_price: 4.99 },
          { partner_id: partner.id, product_type: "equipment", is_enabled: false, customer_price: 9.99 },
          { partner_id: partner.id, product_type: "cancellation", is_enabled: false, customer_price: 14.99 },
        ]

    const { error: productError } = await (supabase as any)
      .from("partner_products")
      .insert(productConfigs) as { error: { message: string } | null }

    if (productError) {
      console.error("Error creating products:", productError)
      // Don't fail the whole request, just log it
    }

    return NextResponse.json({ partner }, { status: 201 })
  })
}
