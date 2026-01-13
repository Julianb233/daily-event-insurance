import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, contractTemplates, partnerContractSignatures, partners } from "@/lib/db"
import { eq, desc, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  paginatedResponse,
  serverError,
  notFound,
} from "@/lib/api-responses"

// Mock signature data
function generateMockSignatures(page: number, pageSize: number) {
  const signatures = []

  for (let i = 0; i < 50; i++) {
    signatures.push({
      id: `sig_${i}`,
      partnerId: `p${i + 1}`,
      partnerName: `Partner ${i + 1} LLC`,
      partnerEmail: `partner${i + 1}@example.com`,
      contractVersion: i < 40 ? 3 : i < 48 ? 2 : 1,
      signedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days apart
      ipAddress: `192.168.1.${100 + i}`,
    })
  }

  const start = (page - 1) * pageSize
  return { signatures: signatures.slice(start, start + pageSize), total: signatures.length }
}

/**
 * GET /api/admin/contracts/[id]/signatures
 * List all partners who signed this contract
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params
      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const version = searchParams.get("version") // Filter by specific version

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        let { signatures, total } = generateMockSignatures(page, pageSize)

        if (version) {
          signatures = signatures.filter(s => s.contractVersion === parseInt(version))
          total = signatures.length
        }

        return paginatedResponse(signatures, page, pageSize, total)
      }

      // Check if contract exists
      const [contract] = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, id))
        .limit(1)

      if (!contract) {
        return notFound("Contract")
      }

      // Build conditions
      const conditions = [eq(partnerContractSignatures.contractTemplateId, id)]
      if (version) {
        conditions.push(eq(partnerContractSignatures.contractVersion, parseInt(version)))
      }

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(partnerContractSignatures)
        .where(eq(partnerContractSignatures.contractTemplateId, id))

      // Get signatures with partner info
      const offset = (page - 1) * pageSize

      const signatures = await db!
        .select({
          id: partnerContractSignatures.id,
          partnerId: partnerContractSignatures.partnerId,
          partnerName: partners.businessName,
          partnerEmail: partners.contactEmail,
          contractVersion: partnerContractSignatures.contractVersion,
          signedAt: partnerContractSignatures.signedAt,
          ipAddress: partnerContractSignatures.ipAddress,
        })
        .from(partnerContractSignatures)
        .leftJoin(partners, eq(partnerContractSignatures.partnerId, partners.id))
        .where(eq(partnerContractSignatures.contractTemplateId, id))
        .orderBy(desc(partnerContractSignatures.signedAt))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(signatures, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Contract Signatures] GET Error:", error)
      return serverError(error.message || "Failed to fetch signatures")
    }
  })
}
