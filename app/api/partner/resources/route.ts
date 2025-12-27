import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { getSupabaseServerClient, type Partner, type PartnerResource, type ResourceDownload } from "@/lib/supabase"

/**
 * GET /api/partner/resources
 * Get all partner resources, optionally filtered by category
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

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    // Get partner ID for tracking downloads
    const { data: partner } = await supabase
      .from("partners")
      .select("id")
      .eq("clerk_user_id", userId)
      .single() as { data: Pick<Partner, "id"> | null; error: unknown }

    // Build query
    let query = supabase
      .from("partner_resources")
      .select("*")
      .order("sort_order", { ascending: true })

    if (category) {
      query = query.eq("category", category)
    }

    const { data: resources, error } = await query as { data: PartnerResource[] | null; error: { message: string } | null }

    if (error) {
      console.error("Error fetching resources:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }

    // Get download counts for this partner
    let downloadCounts: Record<string, number> = {}
    if (partner) {
      const { data: downloads } = await supabase
        .from("resource_downloads")
        .select("resource_id")
        .eq("partner_id", partner.id) as { data: Pick<ResourceDownload, "resource_id">[] | null; error: unknown }

      if (downloads) {
        downloads.forEach((d) => {
          downloadCounts[d.resource_id] = (downloadCounts[d.resource_id] || 0) + 1
        })
      }
    }

    // Enrich resources with download info
    const enrichedResources = resources?.map((resource) => ({
      ...resource,
      downloadCount: downloadCounts[resource.id] || 0,
    }))

    // Group by category for easier frontend consumption
    const grouped = {
      marketing: enrichedResources?.filter((r) => r.category === "marketing") || [],
      training: enrichedResources?.filter((r) => r.category === "training") || [],
      documentation: enrichedResources?.filter((r) => r.category === "documentation") || [],
    }

    return NextResponse.json({
      resources: enrichedResources,
      grouped,
    })
  })
}

/**
 * POST /api/partner/resources
 * Track resource download
 */
export async function POST(request: NextRequest) {
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
    const { resourceId } = body

    if (!resourceId) {
      return NextResponse.json(
        { error: "Validation error", message: "resourceId is required" },
        { status: 400 }
      )
    }

    // Get partner ID
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

    // Record the download
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: downloadError } = await (supabase as any)
      .from("resource_downloads")
      .insert({
        partner_id: partner.id,
        resource_id: resourceId,
      }) as { error: { message: string } | null }

    if (downloadError) {
      console.error("Error recording download:", downloadError)
      // Don't fail the request, just log it
    }

    return NextResponse.json({ success: true })
  })
}
