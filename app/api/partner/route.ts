import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requirePartner, withAuth } from "@/lib/api-auth"
import { getSupabaseServerClient, type Partner } from "@/lib/supabase"

/**
 * GET /api/partner
 * Get current partner's profile
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const supabase = getSupabaseServerClient()

    const { data: partner, error } = await supabase
      .from("partners")
      .select("*")
      .eq("clerk_user_id", userId)
      .single()

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

    // Check if partner already exists
    const { data: existing } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Partner exists", message: "Partner profile already exists" },
        { status: 409 }
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
    } = body

    // Validate required fields
    if (!businessName || !businessType || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Validation error", message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create partner record
    const { data: partner, error } = await supabase
      .from("partners")
      .insert({
        clerk_user_id: userId,
        business_name: businessName,
        business_type: businessType,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        integration_type: integrationType || "widget",
        primary_color: primaryColor || "#14B8A6",
        logo_url: logoUrl || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating partner:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }

    // Also create default product configurations
    const defaultProducts = [
      { partner_id: partner.id, product_type: "liability", is_enabled: true, customer_price: 4.99 },
      { partner_id: partner.id, product_type: "equipment", is_enabled: false, customer_price: 9.99 },
      { partner_id: partner.id, product_type: "cancellation", is_enabled: false, customer_price: 14.99 },
    ]

    const { error: productError } = await supabase
      .from("partner_products")
      .insert(defaultProducts)

    if (productError) {
      console.error("Error creating default products:", productError)
      // Don't fail the whole request, just log it
    }

    return NextResponse.json({ partner }, { status: 201 })
  })
}
