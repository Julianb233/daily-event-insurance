import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, contractTemplates, partnerContractSignatures } from "@/lib/db"
import { eq, sql, count, desc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
  badRequest,
} from "@/lib/api-responses"

// Mock data for development
const mockContracts = [
  {
    id: "ct1",
    name: "partnership_agreement",
    displayName: "Partnership Agreement",
    description: "Main partnership terms and conditions",
    version: 3,
    isActive: true,
    isRequired: true,
    sortOrder: 1,
    signatureCount: 247,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
    publishedAt: "2024-11-20T00:00:00Z",
  },
  {
    id: "ct2",
    name: "revenue_share",
    displayName: "Revenue Share Agreement",
    description: "Commission and payout terms",
    version: 2,
    isActive: true,
    isRequired: true,
    sortOrder: 2,
    signatureCount: 245,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-09-10T00:00:00Z",
    publishedAt: "2024-09-10T00:00:00Z",
  },
  {
    id: "ct3",
    name: "data_processing",
    displayName: "Data Processing Agreement",
    description: "GDPR/privacy compliance terms",
    version: 1,
    isActive: true,
    isRequired: true,
    sortOrder: 3,
    signatureCount: 243,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    publishedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "ct4",
    name: "microsite_terms",
    displayName: "Microsite Terms of Use",
    description: "Terms for branded microsite usage",
    version: 1,
    isActive: true,
    isRequired: false,
    sortOrder: 4,
    signatureCount: 156,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
    publishedAt: "2024-06-01T00:00:00Z",
  },
]

/**
 * GET /api/admin/contracts
 * List all contract templates with signature counts
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const activeOnly = searchParams.get("activeOnly") === "true"

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockContracts]

        if (activeOnly) {
          filtered = filtered.filter(c => c.isActive)
        }

        // Sort by sortOrder
        filtered.sort((a, b) => a.sortOrder - b.sortOrder)

        // Paginate
        const start = (page - 1) * pageSize
        const paginatedData = filtered.slice(start, start + pageSize)

        return paginatedResponse(paginatedData, page, pageSize, filtered.length)
      }

      // Build conditions
      const conditions = []
      if (activeOnly) {
        conditions.push(eq(contractTemplates.isActive, true))
      }

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(contractTemplates)

      // Get contracts with signature counts
      const offset = (page - 1) * pageSize

      const contracts = await db!
        .select({
          id: contractTemplates.id,
          name: contractTemplates.name,
          displayName: contractTemplates.displayName,
          description: contractTemplates.description,
          version: contractTemplates.version,
          isActive: contractTemplates.isActive,
          isRequired: contractTemplates.isRequired,
          sortOrder: contractTemplates.sortOrder,
          createdAt: contractTemplates.createdAt,
          updatedAt: contractTemplates.updatedAt,
          publishedAt: contractTemplates.publishedAt,
          signatureCount: sql<number>`(
            SELECT COUNT(*) FROM ${partnerContractSignatures}
            WHERE ${partnerContractSignatures.contractTemplateId} = ${contractTemplates.id}
          )`,
        })
        .from(contractTemplates)
        .orderBy(contractTemplates.sortOrder)
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(contracts, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Contracts] GET Error:", error)
      return serverError(error.message || "Failed to fetch contracts")
    }
  })
}

/**
 * POST /api/admin/contracts
 * Create a new contract template
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const body = await request.json()
      const { name, displayName, description, content, isRequired, sortOrder } = body

      if (!name) {
        return badRequest("Contract name is required")
      }

      if (!displayName) {
        return badRequest("Display name is required")
      }

      if (!content) {
        return badRequest("Contract content is required")
      }

      // Validate name format (lowercase, alphanumeric, underscores only)
      const nameRegex = /^[a-z0-9_]+$/
      if (!nameRegex.test(name)) {
        return badRequest("Name must be lowercase alphanumeric with underscores only")
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const newContract = {
          id: `ct${Date.now()}`,
          name,
          displayName,
          description: description || null,
          content,
          version: 1,
          isActive: false, // Start as draft
          isRequired: isRequired ?? true,
          sortOrder: sortOrder ?? 99,
          signatureCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: null,
        }

        return successResponse(newContract, "Contract created successfully", 201)
      }

      // Check if name already exists
      const [existing] = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.name, name))
        .limit(1)

      if (existing) {
        return badRequest("A contract with this name already exists")
      }

      // Create contract
      const [newContract] = await db!
        .insert(contractTemplates)
        .values({
          name,
          displayName,
          description: description || null,
          content,
          version: 1,
          isActive: false, // Start as draft
          isRequired: isRequired ?? true,
          sortOrder: sortOrder ?? 99,
        })
        .returning()

      return successResponse(newContract, "Contract created successfully", 201)
    } catch (error: any) {
      console.error("[Admin Contracts] POST Error:", error)
      return serverError(error.message || "Failed to create contract")
    }
  })
}
