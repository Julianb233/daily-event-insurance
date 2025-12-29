import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, claims, policies, partners, claimDocuments } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFound, badRequest } from "@/lib/api-responses"

/**
 * GET /api/admin/claims/[claimId]
 * Get a specific claim with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { claimId } = await params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: claimId,
          claimNumber: "CLM-2024-0042",
          policyId: "pol1",
          policyNumber: "POL-2024-1234",
          partnerId: "p1",
          partnerName: "Adventure Sports Inc",
          claimType: "equipment_loss",
          incidentDate: "2024-12-18T00:00:00Z",
          incidentLocation: "Mountain Trail, Colorado",
          incidentDescription: "Rental kayak was damaged during guided tour due to submerged rocks.",
          claimantName: "James Wilson",
          claimantEmail: "james@email.com",
          claimantPhone: "(555) 123-4567",
          claimAmount: 450.00,
          approvedAmount: null,
          payoutAmount: 0,
          deductibleAmount: 0,
          status: "submitted",
          assignedTo: null,
          reviewNotes: null,
          denialReason: null,
          submittedAt: "2024-12-20T00:00:00Z",
          reviewedAt: null,
          approvedAt: null,
          deniedAt: null,
          paidAt: null,
          closedAt: null,
          createdAt: "2024-12-20T00:00:00Z",
          documents: [
            { id: "doc1", documentType: "photo", fileName: "damage-photo-1.jpg", description: "Front view of damage" },
            { id: "doc2", documentType: "receipt", fileName: "purchase-receipt.pdf", description: "Original equipment receipt" },
          ],
        })
      }

      // Get claim with full details
      const [claim] = await db!
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
          deductibleAmount: claims.deductibleAmount,
          status: claims.status,
          assignedTo: claims.assignedTo,
          reviewNotes: claims.reviewNotes,
          denialReason: claims.denialReason,
          submittedAt: claims.submittedAt,
          reviewedAt: claims.reviewedAt,
          approvedAt: claims.approvedAt,
          deniedAt: claims.deniedAt,
          paidAt: claims.paidAt,
          closedAt: claims.closedAt,
          createdAt: claims.createdAt,
          updatedAt: claims.updatedAt,
        })
        .from(claims)
        .leftJoin(policies, eq(claims.policyId, policies.id))
        .leftJoin(partners, eq(claims.partnerId, partners.id))
        .where(eq(claims.id, claimId))

      if (!claim) {
        return notFound("Claim not found")
      }

      // Get claim documents
      const documents = await db!
        .select({
          id: claimDocuments.id,
          documentType: claimDocuments.documentType,
          fileName: claimDocuments.fileName,
          fileUrl: claimDocuments.fileUrl,
          fileSize: claimDocuments.fileSize,
          mimeType: claimDocuments.mimeType,
          description: claimDocuments.description,
          uploadedBy: claimDocuments.uploadedBy,
          createdAt: claimDocuments.createdAt,
        })
        .from(claimDocuments)
        .where(eq(claimDocuments.claimId, claimId))

      return successResponse({
        ...claim,
        claimAmount: claim.claimAmount ? Number(claim.claimAmount) : null,
        approvedAmount: claim.approvedAmount ? Number(claim.approvedAmount) : null,
        payoutAmount: claim.payoutAmount ? Number(claim.payoutAmount) : null,
        deductibleAmount: claim.deductibleAmount ? Number(claim.deductibleAmount) : null,
        documents,
      })
    } catch (error: any) {
      console.error("[Admin Claim] GET Error:", error)
      return serverError(error.message || "Failed to fetch claim")
    }
  })
}

/**
 * PATCH /api/admin/claims/[claimId]
 * Update claim (status, review notes, amounts, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { claimId } = await params
      const body = await request.json()

      const {
        status,
        approvedAmount,
        payoutAmount,
        deductibleAmount,
        assignedTo,
        reviewNotes,
        denialReason,
      } = body

      const validStatuses = ["submitted", "under_review", "additional_info_requested", "approved", "denied", "paid", "closed", "disputed"]
      if (status && !validStatuses.includes(status)) {
        return badRequest(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
      }

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: claimId,
          status: status || "submitted",
          approvedAmount: approvedAmount || null,
          reviewNotes: reviewNotes || null,
          message: "Claim updated successfully (mock)",
        })
      }

      // Check claim exists
      const [existing] = await db!
        .select({ id: claims.id, status: claims.status })
        .from(claims)
        .where(eq(claims.id, claimId))

      if (!existing) {
        return notFound("Claim not found")
      }

      // Build update object
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      if (status) {
        updateData.status = status

        // Set timestamps based on status transitions
        if (status === "under_review" && existing.status === "submitted") {
          updateData.reviewedAt = new Date()
        }
        if (status === "approved") {
          updateData.approvedAt = new Date()
        }
        if (status === "denied") {
          updateData.deniedAt = new Date()
        }
        if (status === "paid") {
          updateData.paidAt = new Date()
        }
        if (status === "closed") {
          updateData.closedAt = new Date()
        }
      }

      if (approvedAmount !== undefined) {
        updateData.approvedAmount = String(approvedAmount)
      }
      if (payoutAmount !== undefined) {
        updateData.payoutAmount = String(payoutAmount)
      }
      if (deductibleAmount !== undefined) {
        updateData.deductibleAmount = String(deductibleAmount)
      }
      if (assignedTo !== undefined) {
        updateData.assignedTo = assignedTo
      }
      if (reviewNotes !== undefined) {
        updateData.reviewNotes = reviewNotes
      }
      if (denialReason !== undefined) {
        updateData.denialReason = denialReason
      }

      // Update claim
      const [updated] = await db!
        .update(claims)
        .set(updateData)
        .where(eq(claims.id, claimId))
        .returning()

      return successResponse({
        ...updated,
        claimAmount: updated.claimAmount ? Number(updated.claimAmount) : null,
        approvedAmount: updated.approvedAmount ? Number(updated.approvedAmount) : null,
        payoutAmount: updated.payoutAmount ? Number(updated.payoutAmount) : null,
        deductibleAmount: updated.deductibleAmount ? Number(updated.deductibleAmount) : null,
        message: "Claim updated successfully",
      })
    } catch (error: any) {
      console.error("[Admin Claim] PATCH Error:", error)
      return serverError(error.message || "Failed to update claim")
    }
  })
}
