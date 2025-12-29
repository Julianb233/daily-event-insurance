import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies, partnerTierOverrides, commissionTiers } from "@/lib/db"
import { eq, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// Validation schema for partner updates
const updatePartnerSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  contactName: z.string().min(1).max(100).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional().nullable(),
  businessType: z.string().max(50).optional(),
  status: z.enum(["pending", "documents_sent", "documents_pending", "under_review", "active", "suspended"]).optional(),
  primaryColor: z.string().max(20).optional(),
  logoUrl: z.string().url().optional().nullable(),
})

// Mock partner for dev mode
const mockPartner = {
  id: "p1",
  businessName: "Adventure Sports Inc",
  contactName: "John Smith",
  contactEmail: "john@adventuresports.com",
  contactPhone: "(555) 123-4567",
  businessType: "adventure",
  integrationType: "widget",
  primaryColor: "#14B8A6",
  logoUrl: null,
  status: "active",
  documentsStatus: "completed",
  agreementSigned: true,
  w9Signed: true,
  directDepositSigned: true,
  documentsSentAt: "2024-03-10T00:00:00Z",
  documentsCompletedAt: "2024-03-12T00:00:00Z",
  approvedAt: "2024-03-15T00:00:00Z",
  createdAt: "2024-03-01T00:00:00Z",
  updatedAt: "2024-12-20T00:00:00Z",
  policyCount: 512,
  totalRevenue: 45200,
  totalCommission: 22600,
  monthlyVolume: 3200,
  currentTier: "Gold",
  tierOverride: false,
}

/**
 * GET /api/admin/partners/[id]
 * Get a single partner with full details
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({ ...mockPartner, id })
      }

      // Get partner with stats
      const [partner] = await db!
        .select({
          id: partners.id,
          businessName: partners.businessName,
          contactName: partners.contactName,
          contactEmail: partners.contactEmail,
          contactPhone: partners.contactPhone,
          businessType: partners.businessType,
          integrationType: partners.integrationType,
          primaryColor: partners.primaryColor,
          logoUrl: partners.logoUrl,
          status: partners.status,
          documentsStatus: partners.documentsStatus,
          agreementSigned: partners.agreementSigned,
          w9Signed: partners.w9Signed,
          directDepositSigned: partners.directDepositSigned,
          documentsSentAt: partners.documentsSentAt,
          documentsCompletedAt: partners.documentsCompletedAt,
          approvedAt: partners.approvedAt,
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
        .where(eq(partners.id, id))
        .limit(1)

      if (!partner) {
        return notFoundError("Partner not found")
      }

      // Check for tier override
      const [override] = await db!
        .select({
          tierName: commissionTiers.tierName,
          reason: partnerTierOverrides.reason,
          expiresAt: partnerTierOverrides.expiresAt,
        })
        .from(partnerTierOverrides)
        .innerJoin(commissionTiers, eq(partnerTierOverrides.tierId, commissionTiers.id))
        .where(eq(partnerTierOverrides.partnerId, id))
        .limit(1)

      return successResponse({
        ...partner,
        currentTier: override?.tierName || null,
        tierOverride: !!override,
        tierOverrideReason: override?.reason || null,
        tierOverrideExpires: override?.expiresAt || null,
      })
    } catch (error: any) {
      console.error("[Admin Partner] GET Error:", error)
      return serverError(error.message || "Failed to fetch partner")
    }
  })
}

/**
 * PATCH /api/admin/partners/[id]
 * Update a partner
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = updatePartnerSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid partner data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          ...mockPartner,
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        }, "Partner updated")
      }

      // Build update object
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      if (data.businessName !== undefined) updateData.businessName = data.businessName
      if (data.contactName !== undefined) updateData.contactName = data.contactName
      if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail
      if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone
      if (data.businessType !== undefined) updateData.businessType = data.businessType
      if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor
      if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl

      // Handle status change
      if (data.status !== undefined) {
        updateData.status = data.status

        // If approving, set approval timestamp
        if (data.status === "active") {
          updateData.approvedAt = new Date()
          updateData.approvedBy = userId
        }
      }

      const [updated] = await db!
        .update(partners)
        .set(updateData)
        .where(eq(partners.id, id))
        .returning()

      if (!updated) {
        return notFoundError("Partner not found")
      }

      return successResponse(updated, "Partner updated")
    } catch (error: any) {
      console.error("[Admin Partner] PATCH Error:", error)
      return serverError(error.message || "Failed to update partner")
    }
  })
}

/**
 * DELETE /api/admin/partners/[id]
 * Delete a partner (soft delete by setting status to suspended)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({ id }, "Partner deleted")
      }

      // Soft delete - set status to suspended
      const [deleted] = await db!
        .update(partners)
        .set({
          status: "suspended",
          updatedAt: new Date(),
        })
        .where(eq(partners.id, id))
        .returning()

      if (!deleted) {
        return notFoundError("Partner not found")
      }

      return successResponse({ id }, "Partner deleted")
    } catch (error: any) {
      console.error("[Admin Partner] DELETE Error:", error)
      return serverError(error.message || "Failed to delete partner")
    }
  })
}
