import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, microsites, partners, adminEarnings } from "@/lib/db"
import { eq, sql, count, desc, asc, ilike, or, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
  badRequest,
} from "@/lib/api-responses"

// Mock data for development
const mockMicrosites = [
  {
    id: "ms1",
    partnerId: "p1",
    slug: "adventure-sports-inc",
    customDomain: null,
    isActive: true,
    logoUrl: null,
    primaryColor: "#14B8A6",
    businessName: "Adventure Sports Inc",
    setupFee: "550.00",
    feeCollected: true,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
    partnerName: "John Smith",
    partnerEmail: "john@adventuresports.com",
  },
  {
    id: "ms2",
    partnerId: "p2",
    slug: "mountain-climbers-co",
    customDomain: "insurance.mountainclimbers.co",
    isActive: true,
    logoUrl: "/uploads/mountain-logo.png",
    primaryColor: "#2563EB",
    businessName: "Mountain Climbers Co",
    setupFee: "550.00",
    feeCollected: true,
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-06-15T00:00:00Z",
    partnerName: "Sarah Johnson",
    partnerEmail: "sarah@mountainclimbers.co",
  },
  {
    id: "ms3",
    partnerId: "p3",
    slug: "urban-gym-network",
    customDomain: null,
    isActive: true,
    logoUrl: null,
    primaryColor: "#14B8A6",
    businessName: "Urban Gym Network",
    setupFee: "550.00",
    feeCollected: false,
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2024-05-15T00:00:00Z",
    partnerName: "Mike Davis",
    partnerEmail: "mike@urbangym.net",
  },
  {
    id: "ms4",
    partnerId: "p5",
    slug: "summit-fitness",
    customDomain: null,
    isActive: false,
    logoUrl: null,
    primaryColor: "#DC2626",
    businessName: "Summit Fitness",
    setupFee: "550.00",
    feeCollected: true,
    createdAt: "2024-06-20T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
    partnerName: "Chris Wilson",
    partnerEmail: "chris@summitfit.com",
  },
]

/**
 * GET /api/admin/microsites
 * List all microsites with partner info
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const search = searchParams.get("search") || ""
      const status = searchParams.get("status") || "" // 'active' | 'inactive' | ''
      const feeStatus = searchParams.get("feeStatus") || "" // 'collected' | 'pending' | ''

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockMicrosites]

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = filtered.filter(m =>
            m.businessName.toLowerCase().includes(searchLower) ||
            m.slug.toLowerCase().includes(searchLower) ||
            m.partnerEmail.toLowerCase().includes(searchLower)
          )
        }

        // Apply status filter
        if (status === "active") {
          filtered = filtered.filter(m => m.isActive)
        } else if (status === "inactive") {
          filtered = filtered.filter(m => !m.isActive)
        }

        // Apply fee status filter
        if (feeStatus === "collected") {
          filtered = filtered.filter(m => m.feeCollected)
        } else if (feeStatus === "pending") {
          filtered = filtered.filter(m => !m.feeCollected)
        }

        // Sort by created date desc
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        // Paginate
        const start = (page - 1) * pageSize
        const paginatedData = filtered.slice(start, start + pageSize)

        // Calculate stats
        const stats = {
          total: mockMicrosites.length,
          active: mockMicrosites.filter(m => m.isActive).length,
          totalSetupFees: mockMicrosites.filter(m => m.feeCollected).length * 550,
          pendingFees: mockMicrosites.filter(m => !m.feeCollected).length * 550,
        }

        return paginatedResponse({ microsites: paginatedData, stats }, page, pageSize, filtered.length)
      }

      // Build where conditions
      const conditions = []

      if (search) {
        conditions.push(
          or(
            ilike(microsites.businessName, `%${search}%`),
            ilike(microsites.slug, `%${search}%`),
            ilike(partners.contactEmail, `%${search}%`)
          )
        )
      }

      if (status === "active") {
        conditions.push(eq(microsites.isActive, true))
      } else if (status === "inactive") {
        conditions.push(eq(microsites.isActive, false))
      }

      if (feeStatus === "collected") {
        conditions.push(eq(microsites.feeCollected, true))
      } else if (feeStatus === "pending") {
        conditions.push(eq(microsites.feeCollected, false))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(microsites)
        .leftJoin(partners, eq(microsites.partnerId, partners.id))
        .where(whereClause)

      // Get microsites with partner info
      const offset = (page - 1) * pageSize

      const micrositesData = await db!
        .select({
          id: microsites.id,
          partnerId: microsites.partnerId,
          slug: microsites.slug,
          customDomain: microsites.customDomain,
          isActive: microsites.isActive,
          logoUrl: microsites.logoUrl,
          primaryColor: microsites.primaryColor,
          businessName: microsites.businessName,
          setupFee: microsites.setupFee,
          feeCollected: microsites.feeCollected,
          createdAt: microsites.createdAt,
          updatedAt: microsites.updatedAt,
          partnerName: partners.contactName,
          partnerEmail: partners.contactEmail,
        })
        .from(microsites)
        .leftJoin(partners, eq(microsites.partnerId, partners.id))
        .where(whereClause)
        .orderBy(desc(microsites.createdAt))
        .limit(pageSize)
        .offset(offset)

      // Get stats
      const [stats] = await db!
        .select({
          total: count(),
          active: sql<number>`SUM(CASE WHEN ${microsites.isActive} = true THEN 1 ELSE 0 END)`,
          totalSetupFees: sql<number>`SUM(CASE WHEN ${microsites.feeCollected} = true THEN ${microsites.setupFee}::numeric ELSE 0 END)`,
          pendingFees: sql<number>`SUM(CASE WHEN ${microsites.feeCollected} = false THEN ${microsites.setupFee}::numeric ELSE 0 END)`,
        })
        .from(microsites)

      return paginatedResponse(
        { microsites: micrositesData, stats },
        page,
        pageSize,
        Number(total)
      )
    } catch (error: any) {
      console.error("[Admin Microsites] GET Error:", error)
      return serverError(error.message || "Failed to fetch microsites")
    }
  })
}

/**
 * POST /api/admin/microsites
 * Create a new microsite for a partner
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const body = await request.json()
      const { partnerId, slug, customDomain, logoUrl, primaryColor, businessName } = body

      if (!partnerId) {
        return badRequest("Partner ID is required")
      }

      if (!slug) {
        return badRequest("Slug is required")
      }

      // Validate slug format (lowercase, alphanumeric, hyphens only)
      const slugRegex = /^[a-z0-9-]+$/
      if (!slugRegex.test(slug)) {
        return badRequest("Slug must be lowercase alphanumeric with hyphens only")
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const newMicrosite = {
          id: `ms${Date.now()}`,
          partnerId,
          slug,
          customDomain: customDomain || null,
          isActive: true,
          logoUrl: logoUrl || null,
          primaryColor: primaryColor || "#14B8A6",
          businessName: businessName || "New Partner",
          setupFee: "550.00",
          feeCollected: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return successResponse(newMicrosite, "Microsite created successfully", 201)
      }

      // Check if partner exists
      const [partner] = await db!
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return badRequest("Partner not found")
      }

      // Check if slug already exists
      const [existingSlug] = await db!
        .select()
        .from(microsites)
        .where(eq(microsites.slug, slug))
        .limit(1)

      if (existingSlug) {
        return badRequest("Slug already exists")
      }

      // Create microsite
      const [newMicrosite] = await db!
        .insert(microsites)
        .values({
          partnerId,
          slug,
          customDomain: customDomain || null,
          isActive: true,
          logoUrl: logoUrl || null,
          primaryColor: primaryColor || "#14B8A6",
          businessName: businessName || partner.businessName,
          setupFee: "550.00",
          feeCollected: false,
        })
        .returning()

      // Create admin earnings record for $550 setup fee
      await db!
        .insert(adminEarnings)
        .values({
          earningType: "microsite_setup",
          micrositeId: newMicrosite.id,
          partnerId,
          baseAmount: "550.00",
          commissionRate: "1.0000", // 100% for microsite setup
          earnedAmount: "550.00",
          status: "pending",
        })

      return successResponse(newMicrosite, "Microsite created successfully", 201)
    } catch (error: any) {
      console.error("[Admin Microsites] POST Error:", error)
      return serverError(error.message || "Failed to create microsite")
    }
  })
}
