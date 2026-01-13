import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, contractTemplates, partnerContractSignatures } from "@/lib/db"
import { eq, sql, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
  notFound,
  badRequest,
} from "@/lib/api-responses"

// Mock contract data
const mockContracts: Record<string, any> = {
  ct1: {
    id: "ct1",
    name: "partnership_agreement",
    displayName: "Partnership Agreement",
    description: "Main partnership terms and conditions",
    content: `# Partnership Agreement

This Partnership Agreement ("Agreement") is entered into by and between Daily Event Insurance ("Company") and the Partner ("Partner").

## 1. Services

The Partner agrees to promote and distribute insurance products through the Company's platform.

## 2. Obligations

- Partner shall maintain accurate records
- Partner shall comply with all applicable laws
- Partner shall not misrepresent coverage terms

## 3. Term

This Agreement shall remain in effect until terminated by either party with 30 days written notice.

## 4. Confidentiality

Partner agrees to maintain the confidentiality of all proprietary information.`,
    version: 3,
    isActive: true,
    isRequired: true,
    sortOrder: 1,
    signatureCount: 247,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
    publishedAt: "2024-11-20T00:00:00Z",
  },
}

/**
 * GET /api/admin/contracts/[id]
 * Get a specific contract template with full content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const contract = mockContracts[id]
        if (!contract) {
          // Return a generic mock for any ID
          return successResponse({
            id,
            name: "sample_contract",
            displayName: "Sample Contract",
            description: "A sample contract template",
            content: "# Sample Contract\n\nThis is sample contract content.",
            version: 1,
            isActive: true,
            isRequired: true,
            sortOrder: 1,
            signatureCount: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
          })
        }
        return successResponse(contract)
      }

      const [contract] = await db!
        .select({
          id: contractTemplates.id,
          name: contractTemplates.name,
          displayName: contractTemplates.displayName,
          description: contractTemplates.description,
          content: contractTemplates.content,
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
        .where(eq(contractTemplates.id, id))
        .limit(1)

      if (!contract) {
        return notFound("Contract")
      }

      return successResponse(contract)
    } catch (error: any) {
      console.error("[Admin Contracts] GET by ID Error:", error)
      return serverError(error.message || "Failed to fetch contract")
    }
  })
}

/**
 * PATCH /api/admin/contracts/[id]
 * Update a contract (creates new version if content changes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params
      const body = await request.json()

      const {
        displayName,
        description,
        content,
        isActive,
        isRequired,
        sortOrder,
      } = body

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const contract = mockContracts[id] || {
          id,
          name: "sample_contract",
          version: 1,
          content: "Original content",
        }

        const contentChanged = content && content !== contract.content
        const newVersion = contentChanged ? contract.version + 1 : contract.version

        const updated = {
          ...contract,
          ...(displayName !== undefined && { displayName }),
          ...(description !== undefined && { description }),
          ...(content !== undefined && { content }),
          ...(isActive !== undefined && { isActive }),
          ...(isRequired !== undefined && { isRequired }),
          ...(sortOrder !== undefined && { sortOrder }),
          version: newVersion,
          updatedAt: new Date().toISOString(),
          ...(isActive && !contract.isActive && { publishedAt: new Date().toISOString() }),
        }

        const message = contentChanged
          ? `Contract updated to version ${newVersion}`
          : "Contract updated successfully"

        return successResponse(updated, message)
      }

      // Get existing contract
      const [existing] = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, id))
        .limit(1)

      if (!existing) {
        return notFound("Contract")
      }

      // Determine if content changed (requires version bump)
      const contentChanged = content && content !== existing.content
      const newVersion = contentChanged ? existing.version + 1 : existing.version

      // Build update object
      const updateData: any = {
        updatedAt: new Date(),
        version: newVersion,
      }

      if (displayName !== undefined) updateData.displayName = displayName
      if (description !== undefined) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (isRequired !== undefined) updateData.isRequired = isRequired
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder

      // Handle activation (publishing)
      if (isActive !== undefined) {
        updateData.isActive = isActive
        if (isActive && !existing.isActive) {
          updateData.publishedAt = new Date()
        }
      }

      const [updated] = await db!
        .update(contractTemplates)
        .set(updateData)
        .where(eq(contractTemplates.id, id))
        .returning()

      const message = contentChanged
        ? `Contract updated to version ${newVersion}`
        : "Contract updated successfully"

      return successResponse(updated, message)
    } catch (error: any) {
      console.error("[Admin Contracts] PATCH Error:", error)
      return serverError(error.message || "Failed to update contract")
    }
  })
}

/**
 * DELETE /api/admin/contracts/[id]
 * Deactivate a contract (soft delete for legal compliance)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({ id, isActive: false }, "Contract deactivated successfully")
      }

      // Get existing contract
      const [existing] = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, id))
        .limit(1)

      if (!existing) {
        return notFound("Contract")
      }

      // Check if contract is required and has signatures
      if (existing.isRequired) {
        const [{ signatureCount }] = await db!
          .select({ signatureCount: count() })
          .from(partnerContractSignatures)
          .where(eq(partnerContractSignatures.contractTemplateId, id))

        if (Number(signatureCount) > 0) {
          return badRequest(
            "Cannot deactivate a required contract that has been signed. " +
            "Create a new version instead or unmark it as required first."
          )
        }
      }

      // Soft delete - deactivate
      const [updated] = await db!
        .update(contractTemplates)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(contractTemplates.id, id))
        .returning()

      return successResponse(updated, "Contract deactivated successfully")
    } catch (error: any) {
      console.error("[Admin Contracts] DELETE Error:", error)
      return serverError(error.message || "Failed to deactivate contract")
    }
  })
}
