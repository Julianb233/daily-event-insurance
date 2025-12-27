import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerResources, resourceDownloads } from "@/lib/db"
import { eq, asc } from "drizzle-orm"
import { isDevMode, MOCK_RESOURCES } from "@/lib/mock-data"

/**
 * GET /api/partner/resources
 * Get all partner resources, optionally filtered by category
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock resources data")
      const searchParams = request.nextUrl.searchParams
      const category = searchParams.get("category")

      let resources = MOCK_RESOURCES
      if (category) {
        resources = resources.filter(r => r.category === category)
      }

      const enrichedResources = resources.map(r => ({ ...r, downloadCount: 0 }))

      return NextResponse.json({
        resources: enrichedResources,
        grouped: {
          marketing: enrichedResources.filter(r => r.category === "marketing"),
          training: enrichedResources.filter(r => r.category === "training"),
          documentation: enrichedResources.filter(r => r.category === "documentation"),
        },
      })
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    // Get partner ID for tracking downloads
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.clerkUserId, userId))
      .limit(1)

    const partner = partnerResult[0]

    // Get resources
    let resources = await db!
      .select()
      .from(partnerResources)
      .orderBy(asc(partnerResources.sortOrder))

    if (category) {
      resources = resources.filter(r => r.category === category)
    }

    // Get download counts for this partner
    let downloadCounts: Record<string, number> = {}
    if (partner) {
      const downloads = await db!
        .select({ resourceId: resourceDownloads.resourceId })
        .from(resourceDownloads)
        .where(eq(resourceDownloads.partnerId, partner.id))

      downloads.forEach((d) => {
        downloadCounts[d.resourceId] = (downloadCounts[d.resourceId] || 0) + 1
      })
    }

    // Enrich resources with download info
    const enrichedResources = resources.map((resource) => ({
      ...resource,
      downloadCount: downloadCounts[resource.id] || 0,
    }))

    // Group by category for easier frontend consumption
    const grouped = {
      marketing: enrichedResources.filter((r) => r.category === "marketing"),
      training: enrichedResources.filter((r) => r.category === "training"),
      documentation: enrichedResources.filter((r) => r.category === "documentation"),
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

    if (!isDbConfigured()) {
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
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.clerkUserId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Record the download
    try {
      await db!.insert(resourceDownloads).values({
        partnerId: partner.id,
        resourceId: resourceId,
      })
    } catch (downloadError) {
      console.error("Error recording download:", downloadError)
      // Don't fail the request, just log it
    }

    return NextResponse.json({ success: true })
  })
}
