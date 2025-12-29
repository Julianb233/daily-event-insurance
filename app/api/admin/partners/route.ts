import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies, partnerTierOverrides, commissionTiers } from "@/lib/db"
import { eq, sql, count, desc, asc, ilike, or, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
} from "@/lib/api-responses"

// Mock data for development
const mockPartners = [
  { id: "p1", businessName: "Adventure Sports Inc", contactName: "John Smith", contactEmail: "john@adventuresports.com", contactPhone: "(555) 123-4567", businessType: "adventure", status: "active", currentTier: "Gold", tierOverride: false, monthlyVolume: 3200, totalRevenue: 45200, policyCount: 512, createdAt: "2024-03-15T00:00:00Z", updatedAt: "2024-12-20T00:00:00Z" },
  { id: "p2", businessName: "Mountain Climbers Co", contactName: "Sarah Johnson", contactEmail: "sarah@mountainclimbers.co", contactPhone: "(555) 234-5678", businessType: "climbing", status: "active", currentTier: "Gold", tierOverride: true, monthlyVolume: 2100, totalRevenue: 38900, policyCount: 423, createdAt: "2024-04-02T00:00:00Z", updatedAt: "2024-12-18T00:00:00Z" },
  { id: "p3", businessName: "Urban Gym Network", contactName: "Mike Davis", contactEmail: "mike@urbangym.net", contactPhone: "(555) 345-6789", businessType: "gym", status: "active", currentTier: "Silver", tierOverride: false, monthlyVolume: 1450, totalRevenue: 32100, policyCount: 378, createdAt: "2024-05-10T00:00:00Z", updatedAt: "2024-12-15T00:00:00Z" },
  { id: "p4", businessName: "Outdoor Adventures LLC", contactName: "Emily Brown", contactEmail: "emily@outdooradv.com", contactPhone: null, businessType: "adventure", status: "pending", currentTier: null, tierOverride: false, monthlyVolume: 0, totalRevenue: 0, policyCount: 0, createdAt: "2024-12-20T00:00:00Z", updatedAt: "2024-12-20T00:00:00Z" },
  { id: "p5", businessName: "Summit Fitness", contactName: "Chris Wilson", contactEmail: "chris@summitfit.com", contactPhone: "(555) 456-7890", businessType: "gym", status: "active", currentTier: "Bronze", tierOverride: false, monthlyVolume: 680, totalRevenue: 24500, policyCount: 289, createdAt: "2024-06-18T00:00:00Z", updatedAt: "2024-12-10T00:00:00Z" },
  { id: "p6", businessName: "Peak Performance Gym", contactName: "Lisa Chen", contactEmail: "lisa@peakgym.com", contactPhone: "(555) 567-8901", businessType: "gym", status: "documents_sent", currentTier: null, tierOverride: false, monthlyVolume: 0, totalRevenue: 0, policyCount: 0, createdAt: "2024-12-22T00:00:00Z", updatedAt: "2024-12-22T00:00:00Z" },
  { id: "p7", businessName: "Extreme Events", contactName: "Tom Anderson", contactEmail: "tom@extremeevents.io", contactPhone: "(555) 678-9012", businessType: "adventure", status: "suspended", currentTier: "Silver", tierOverride: false, monthlyVolume: 1200, totalRevenue: 18700, policyCount: 156, createdAt: "2024-02-28T00:00:00Z", updatedAt: "2024-11-15T00:00:00Z" },
]

/**
 * GET /api/admin/partners
 * List all partners with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const search = searchParams.get("search") || ""
      const status = searchParams.get("status") || ""
      const sortBy = searchParams.get("sortBy") || "createdAt"
      const sortOrder = searchParams.get("sortOrder") || "desc"

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockPartners]

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = filtered.filter(p =>
            p.businessName.toLowerCase().includes(searchLower) ||
            p.contactEmail.toLowerCase().includes(searchLower) ||
            p.contactName.toLowerCase().includes(searchLower)
          )
        }

        // Apply status filter
        if (status && status !== "all") {
          filtered = filtered.filter(p => p.status === status)
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof typeof a]
          const bVal = b[sortBy as keyof typeof b]
          if (sortOrder === "asc") {
            return aVal > bVal ? 1 : -1
          }
          return aVal < bVal ? 1 : -1
        })

        // Paginate
        const start = (page - 1) * pageSize
        const paginatedData = filtered.slice(start, start + pageSize)

        return paginatedResponse(paginatedData, page, pageSize, filtered.length)
      }

      // Build where conditions
      const conditions = []

      if (search) {
        conditions.push(
          or(
            ilike(partners.businessName, `%${search}%`),
            ilike(partners.contactEmail, `%${search}%`),
            ilike(partners.contactName, `%${search}%`)
          )
        )
      }

      if (status && status !== "all") {
        conditions.push(eq(partners.status, status))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(partners)
        .where(whereClause)

      // Get partners with stats
      const offset = (page - 1) * pageSize

      const partnersData = await db!
        .select({
          id: partners.id,
          businessName: partners.businessName,
          contactName: partners.contactName,
          contactEmail: partners.contactEmail,
          contactPhone: partners.contactPhone,
          businessType: partners.businessType,
          status: partners.status,
          createdAt: partners.createdAt,
          updatedAt: partners.updatedAt,
          policyCount: sql<number>`COALESCE((
            SELECT COUNT(*) FROM policies WHERE policies.partner_id = ${partners.id}
          ), 0)`,
          totalRevenue: sql<number>`COALESCE((
            SELECT SUM(premium::numeric) FROM policies WHERE policies.partner_id = ${partners.id}
          ), 0)`,
          totalCommission: sql<number>`COALESCE((
            SELECT SUM(commission::numeric) FROM policies WHERE policies.partner_id = ${partners.id}
          ), 0)`,
        })
        .from(partners)
        .where(whereClause)
        .orderBy(sortOrder === "desc" ? desc(partners.createdAt) : asc(partners.createdAt))
        .limit(pageSize)
        .offset(offset)

      // Check for tier overrides
      const partnerIds = partnersData.map(p => p.id)
      let overrides: Record<string, any> = {}

      if (partnerIds.length > 0) {
        const overrideResults = await db!
          .select({
            partnerId: partnerTierOverrides.partnerId,
            tierName: commissionTiers.tierName,
          })
          .from(partnerTierOverrides)
          .innerJoin(commissionTiers, eq(partnerTierOverrides.tierId, commissionTiers.id))
          .where(sql`${partnerTierOverrides.partnerId} IN ${partnerIds}`)

        overrides = overrideResults.reduce((acc, o) => {
          acc[o.partnerId] = o.tierName
          return acc
        }, {} as Record<string, string>)
      }

      // Add tier info to partners
      const enrichedPartners = partnersData.map(p => ({
        ...p,
        tierOverride: !!overrides[p.id],
        currentTier: overrides[p.id] || null,
      }))

      return paginatedResponse(enrichedPartners, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Partners] GET Error:", error)
      return serverError(error.message || "Failed to fetch partners")
    }
  })
}
