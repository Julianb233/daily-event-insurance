import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, policies, partners } from "@/lib/db"
import { eq, and, or, like, desc, sql, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
} from "@/lib/api-responses"

/**
 * GET /api/admin/policies
 * List all policies with filtering
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 100)
      const status = searchParams.get("status")
      const partnerId = searchParams.get("partnerId")
      const search = searchParams.get("search")

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockPolicies = generateMockPolicies()
        let filtered = mockPolicies

        if (status && status !== "all") {
          filtered = filtered.filter(p => p.status === status)
        }
        if (partnerId && partnerId !== "all") {
          filtered = filtered.filter(p => p.partnerId === partnerId)
        }
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = filtered.filter(p =>
            p.policyNumber.toLowerCase().includes(searchLower) ||
            p.partnerName.toLowerCase().includes(searchLower) ||
            p.customerName?.toLowerCase().includes(searchLower) ||
            p.customerEmail?.toLowerCase().includes(searchLower)
          )
        }

        return paginatedResponse(filtered, page, pageSize, filtered.length)
      }

      // Build where clause
      const conditions = []
      if (status && status !== "all") {
        conditions.push(eq(policies.status, status))
      }
      if (partnerId && partnerId !== "all") {
        conditions.push(eq(policies.partnerId, partnerId))
      }
      if (search) {
        conditions.push(
          or(
            like(policies.policyNumber, `%${search}%`),
            like(policies.customerName, `%${search}%`),
            like(policies.customerEmail, `%${search}%`)
          )
        )
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(policies)
        .where(whereClause)

      // Get policies with partner info
      const offset = (page - 1) * pageSize
      const policiesList = await db!
        .select({
          id: policies.id,
          policyNumber: policies.policyNumber,
          partnerId: policies.partnerId,
          partnerName: partners.businessName,
          customerName: policies.customerName,
          customerEmail: policies.customerEmail,
          eventType: policies.eventType,
          eventDate: policies.eventDate,
          participants: policies.participants,
          coverageType: policies.coverageType,
          premium: policies.premium,
          commission: policies.commission,
          status: policies.status,
          createdAt: policies.createdAt,
        })
        .from(policies)
        .leftJoin(partners, eq(policies.partnerId, partners.id))
        .where(whereClause)
        .orderBy(desc(policies.createdAt))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(policiesList, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Policies] GET Error:", error)
      return serverError(error.message || "Failed to fetch policies")
    }
  })
}

function generateMockPolicies() {
  const mockData = []
  const eventTypes = ["Gym Class", "Rock Climbing", "Outdoor Adventure", "Team Building", "Fitness Bootcamp"]
  const coverageTypes = ["liability", "equipment", "cancellation"]
  const statuses = ["active", "pending", "expired", "claimed"]
  const partners = [
    { id: "1", name: "Adventure Sports Inc" },
    { id: "2", name: "Peak Performance Gym" },
    { id: "3", name: "Urban Gym Network" },
    { id: "4", name: "Summit Fitness" },
  ]

  for (let i = 0; i < 50; i++) {
    const partner = partners[Math.floor(Math.random() * partners.length)]
    const eventDate = new Date()
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 90) - 30)

    mockData.push({
      id: `policy_${i + 1}`,
      policyNumber: `POL-${new Date().getFullYear()}${String(i + 1).padStart(5, "0")}`,
      partnerId: partner.id,
      partnerName: partner.name,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      eventDate: eventDate.toISOString(),
      participants: Math.floor(Math.random() * 50) + 5,
      coverageType: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
      premium: (Math.random() * 200 + 50).toFixed(2),
      commission: (Math.random() * 100 + 20).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return mockData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
