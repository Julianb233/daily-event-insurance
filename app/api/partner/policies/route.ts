import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies } from "@/lib/db"
import { eq, desc, and, gte, lte, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  paginatedResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import {
  validateQuery,
  policiesListSchema,
  formatZodErrors,
} from "@/lib/api-validation"

/**
 * GET /api/partner/policies
 * List partner's active policies with pagination and filters
 *
 * Query params:
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 * - status: "active" | "expired" | "cancelled" | "pending" (optional)
 * - coverageType: "liability" | "equipment" | "cancellation" (optional)
 * - startDate: Date (optional)
 * - endDate: Date (optional)
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      // Validate query parameters
      const query = validateQuery(policiesListSchema, request.nextUrl.searchParams)

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock policies data")
        const mockPolicies = Array.from({ length: 25 }, (_, i) => ({
          id: `policy_${i + 1}`,
          policy_number: `POL-20250101-${String(i + 1).padStart(5, "0")}`,
          event_type: ["Gym Session", "Rock Climbing", "Equipment Rental"][i % 3],
          event_date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
          participants: 15 + i * 3,
          coverage_type: ["liability", "equipment", "cancellation"][i % 3],
          premium: (4.99 + i * 3) * (15 + i * 3),
          commission: (4.99 + i * 3) * (15 + i * 3) * 0.5,
          status: ["active", "expired", "cancelled"][i % 3],
          effective_date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
          expiration_date: new Date(Date.now() + (i + 30) * 24 * 60 * 60 * 1000),
          customer_email: `policyholder${i}@example.com`,
          customer_name: `Policyholder ${i + 1}`,
          customer_phone: `+1555000${String(i).padStart(4, "0")}`,
          certificate_issued: i % 2 === 0,
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        }))

        const start = (query.page - 1) * query.pageSize
        const paginatedPolicies = mockPolicies.slice(start, start + query.pageSize)

        return paginatedResponse(paginatedPolicies, query.page, query.pageSize, mockPolicies.length)
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Build where conditions
      const conditions = [eq(policies.partnerId, partner.id)]

      if (query.status) {
        conditions.push(eq(policies.status, query.status))
      }

      if (query.coverageType) {
        conditions.push(eq(policies.coverageType, query.coverageType))
      }

      if (query.startDate) {
        conditions.push(gte(policies.eventDate, query.startDate))
      }

      if (query.endDate) {
        conditions.push(lte(policies.eventDate, query.endDate))
      }

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(policies)
        .where(whereClause)

      // Get paginated policies
      const offset = (query.page - 1) * query.pageSize
      const policiesList = await db!
        .select()
        .from(policies)
        .where(whereClause)
        .orderBy(desc(policies.createdAt))
        .limit(query.pageSize)
        .offset(offset)

      return paginatedResponse(policiesList, query.page, query.pageSize, Number(total))
    } catch (error: any) {
      console.error("[Partner Policies] GET Error:", error)

      if (error.name === "ZodError") {
        return validationError("Invalid query parameters", formatZodErrors(error))
      }

      return serverError(error.message || "Failed to fetch policies")
    }
  })
}
