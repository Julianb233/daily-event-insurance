import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, claims, policies, partners } from "@/lib/db"
import { eq, sql, desc, and, gte, lte, count, or, ilike } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest } from "@/lib/api-responses"

/**
 * GET /api/admin/claims
 * List all claims with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const status = searchParams.get("status") // submitted, under_review, approved, denied, paid, closed, all
      const partnerId = searchParams.get("partnerId")
      const claimType = searchParams.get("claimType")
      const search = searchParams.get("search") // search by claim number or claimant name
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "20")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockClaims = [
          { id: "1", claimNumber: "CLM-2024-0042", policyId: "pol1", policyNumber: "POL-2024-1234", partnerId: "p1", partnerName: "Adventure Sports Inc", claimType: "equipment_loss", incidentDate: "2024-12-18", claimantName: "James Wilson", claimantEmail: "james@email.com", claimAmount: 450.00, approvedAmount: null, status: "submitted", submittedAt: "2024-12-20T00:00:00Z", createdAt: "2024-12-20T00:00:00Z" },
          { id: "2", claimNumber: "CLM-2024-0041", policyId: "pol2", policyNumber: "POL-2024-1198", partnerId: "p2", partnerName: "Mountain Climbers Co", claimType: "injury", incidentDate: "2024-12-15", claimantName: "Sarah Martinez", claimantEmail: "sarah@email.com", claimAmount: 1250.00, approvedAmount: null, status: "under_review", submittedAt: "2024-12-16T00:00:00Z", createdAt: "2024-12-16T00:00:00Z" },
          { id: "3", claimNumber: "CLM-2024-0040", policyId: "pol3", policyNumber: "POL-2024-1156", partnerId: "p3", partnerName: "Urban Gym Network", claimType: "property_damage", incidentDate: "2024-12-10", claimantName: "Michael Brown", claimantEmail: "michael@email.com", claimAmount: 320.00, approvedAmount: 320.00, status: "approved", submittedAt: "2024-12-11T00:00:00Z", createdAt: "2024-12-11T00:00:00Z" },
          { id: "4", claimNumber: "CLM-2024-0039", policyId: "pol4", policyNumber: "POL-2024-1089", partnerId: "p4", partnerName: "Summit Fitness", claimType: "injury", incidentDate: "2024-12-05", claimantName: "Emily Chen", claimantEmail: "emily@email.com", claimAmount: 890.00, approvedAmount: 890.00, status: "paid", submittedAt: "2024-12-06T00:00:00Z", createdAt: "2024-12-06T00:00:00Z" },
          { id: "5", claimNumber: "CLM-2024-0038", policyId: "pol5", policyNumber: "POL-2024-1045", partnerId: "p1", partnerName: "Adventure Sports Inc", claimType: "cancellation", incidentDate: "2024-12-01", claimantName: "David Lee", claimantEmail: "david@email.com", claimAmount: 180.00, approvedAmount: 0, status: "denied", submittedAt: "2024-12-02T00:00:00Z", createdAt: "2024-12-02T00:00:00Z" },
        ]

        const filtered = mockClaims.filter(c => {
          if (status && status !== "all" && c.status !== status) return false
          if (partnerId && c.partnerId !== partnerId) return false
          if (claimType && c.claimType !== claimType) return false
          if (search && !c.claimNumber.toLowerCase().includes(search.toLowerCase()) && !c.claimantName.toLowerCase().includes(search.toLowerCase())) return false
          return true
        })

        return successResponse({
          data: filtered.slice(offset, offset + limit),
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
          },
          summary: {
            submitted: { count: 1, amount: 450.00 },
            under_review: { count: 1, amount: 1250.00 },
            approved: { count: 1, amount: 320.00 },
            denied: { count: 1, amount: 180.00 },
            paid: { count: 1, amount: 890.00 },
            closed: { count: 0, amount: 0 },
          },
        })
      }

      // Build where conditions
      const conditions = []
      if (status && status !== "all") {
        conditions.push(eq(claims.status, status))
      }
      if (partnerId) {
        conditions.push(eq(claims.partnerId, partnerId))
      }
      if (claimType) {
        conditions.push(eq(claims.claimType, claimType))
      }
      if (search) {
        conditions.push(
          or(
            ilike(claims.claimNumber, `%${search}%`),
            ilike(claims.claimantName, `%${search}%`)
          )
        )
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get claims with policy and partner info
      const claimsData = await db!
        .select({
          id: claims.id,
          claimNumber: claims.claimNumber,
          policyId: claims.policyId,
          policyNumber: policies.policyNumber,
          partnerId: claims.partnerId,
          partnerName: partners.businessName,
          claimType: claims.claimType,
          incidentDate: claims.incidentDate,
          incidentLocation: claims.incidentLocation,
          incidentDescription: claims.incidentDescription,
          claimantName: claims.claimantName,
          claimantEmail: claims.claimantEmail,
          claimantPhone: claims.claimantPhone,
          claimAmount: claims.claimAmount,
          approvedAmount: claims.approvedAmount,
          payoutAmount: claims.payoutAmount,
          status: claims.status,
          assignedTo: claims.assignedTo,
          reviewNotes: claims.reviewNotes,
          denialReason: claims.denialReason,
          submittedAt: claims.submittedAt,
          reviewedAt: claims.reviewedAt,
          approvedAt: claims.approvedAt,
          deniedAt: claims.deniedAt,
          paidAt: claims.paidAt,
          createdAt: claims.createdAt,
        })
        .from(claims)
        .leftJoin(policies, eq(claims.policyId, policies.id))
        .leftJoin(partners, eq(claims.partnerId, partners.id))
        .where(whereClause)
        .orderBy(desc(claims.createdAt))
        .limit(limit)
        .offset(offset)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(claims)
        .where(whereClause)

      // Get summary by status
      const summaryData = await db!
        .select({
          status: claims.status,
          count: count(),
          amount: sql<number>`COALESCE(SUM(${claims.claimAmount}::numeric), 0)`,
        })
        .from(claims)
        .groupBy(claims.status)

      const summary: Record<string, { count: number; amount: number }> = {
        submitted: { count: 0, amount: 0 },
        under_review: { count: 0, amount: 0 },
        additional_info_requested: { count: 0, amount: 0 },
        approved: { count: 0, amount: 0 },
        denied: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        closed: { count: 0, amount: 0 },
      }
      summaryData.forEach(s => {
        if (s.status && s.status in summary) {
          summary[s.status] = {
            count: Number(s.count),
            amount: Number(s.amount),
          }
        }
      })

      return successResponse({
        data: claimsData.map(c => ({
          ...c,
          claimAmount: c.claimAmount ? Number(c.claimAmount) : null,
          approvedAmount: c.approvedAmount ? Number(c.approvedAmount) : null,
          payoutAmount: c.payoutAmount ? Number(c.payoutAmount) : null,
        })),
        pagination: {
          page,
          limit,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / limit),
        },
        summary,
      })
    } catch (error: any) {
      console.error("[Admin Claims] GET Error:", error)
      return serverError(error.message || "Failed to fetch claims")
    }
  })
}

/**
 * POST /api/admin/claims
 * Create a new claim (admin-initiated)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const body = await request.json()

      const {
        policyId,
        claimType,
        incidentDate,
        incidentLocation,
        incidentDescription,
        claimantName,
        claimantEmail,
        claimantPhone,
        claimAmount,
      } = body

      // Validation
      if (!policyId) return badRequest("Policy ID is required")
      if (!claimType) return badRequest("Claim type is required")
      if (!incidentDate) return badRequest("Incident date is required")
      if (!incidentDescription) return badRequest("Incident description is required")
      if (!claimantName) return badRequest("Claimant name is required")

      if (isDevMode || !isDbConfigured()) {
        const claimNumber = `CLM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`
        return successResponse({
          id: "new-claim-id",
          claimNumber,
          policyId,
          claimType,
          incidentDate,
          claimantName,
          claimAmount: claimAmount || null,
          status: "submitted",
          message: "Claim created successfully (mock)",
        })
      }

      // Get policy and partner info
      const [policy] = await db!
        .select({
          id: policies.id,
          partnerId: policies.partnerId,
        })
        .from(policies)
        .where(eq(policies.id, policyId))

      if (!policy) {
        return badRequest("Policy not found")
      }

      // Generate claim number
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")
      const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, "0")
      const claimNumber = `CLM-${dateStr}-${randomNum}`

      // Create claim
      const [newClaim] = await db!
        .insert(claims)
        .values({
          policyId,
          partnerId: policy.partnerId,
          claimNumber,
          claimType,
          incidentDate: new Date(incidentDate),
          incidentLocation,
          incidentDescription,
          claimantName,
          claimantEmail,
          claimantPhone,
          claimAmount: claimAmount ? String(claimAmount) : null,
          status: "submitted",
          submittedAt: new Date(),
        })
        .returning()

      return successResponse({
        ...newClaim,
        claimAmount: newClaim.claimAmount ? Number(newClaim.claimAmount) : null,
        message: "Claim created successfully",
      })
    } catch (error: any) {
      console.error("[Admin Claims] POST Error:", error)
      return serverError(error.message || "Failed to create claim")
    }
  })
}
