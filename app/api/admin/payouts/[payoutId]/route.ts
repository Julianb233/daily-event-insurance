import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, commissionPayouts, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFound, badRequest } from "@/lib/api-responses"

/**
 * GET /api/admin/payouts/[payoutId]
 * Get a specific payout by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { payoutId } = await params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: payoutId,
          partnerId: "p1",
          partnerName: "Adventure Sports Inc",
          yearMonth: "2024-12",
          tierAtPayout: "Gold",
          commissionRate: 0.50,
          totalPolicies: 89,
          totalParticipants: 2450,
          grossRevenue: 8900.00,
          commissionAmount: 4450.00,
          bonusAmount: 0,
          status: "pending",
          paidAt: null,
          paymentReference: null,
          createdAt: "2025-01-01T00:00:00Z",
        })
      }

      const [payout] = await db!
        .select({
          id: commissionPayouts.id,
          partnerId: commissionPayouts.partnerId,
          partnerName: partners.businessName,
          yearMonth: commissionPayouts.yearMonth,
          tierAtPayout: commissionPayouts.tierAtPayout,
          commissionRate: commissionPayouts.commissionRate,
          totalPolicies: commissionPayouts.totalPolicies,
          totalParticipants: commissionPayouts.totalParticipants,
          grossRevenue: commissionPayouts.grossRevenue,
          commissionAmount: commissionPayouts.commissionAmount,
          bonusAmount: commissionPayouts.bonusAmount,
          status: commissionPayouts.status,
          paidAt: commissionPayouts.paidAt,
          paymentReference: commissionPayouts.paymentReference,
          createdAt: commissionPayouts.createdAt,
          updatedAt: commissionPayouts.updatedAt,
        })
        .from(commissionPayouts)
        .leftJoin(partners, eq(commissionPayouts.partnerId, partners.id))
        .where(eq(commissionPayouts.id, payoutId))

      if (!payout) {
        return notFound("Payout not found")
      }

      return successResponse({
        ...payout,
        commissionRate: Number(payout.commissionRate),
        grossRevenue: Number(payout.grossRevenue),
        commissionAmount: Number(payout.commissionAmount),
        bonusAmount: Number(payout.bonusAmount),
      })
    } catch (error: any) {
      console.error("[Admin Payout] GET Error:", error)
      return serverError(error.message || "Failed to fetch payout")
    }
  })
}

/**
 * PATCH /api/admin/payouts/[payoutId]
 * Update payout status (e.g., mark as processing, paid, failed)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { payoutId } = await params
      const body = await request.json()

      const { status, paymentReference } = body
      const validStatuses = ["pending", "processing", "paid", "failed"]

      if (status && !validStatuses.includes(status)) {
        return badRequest(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
      }

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: payoutId,
          status: status || "pending",
          paymentReference: paymentReference || null,
          paidAt: status === "paid" ? new Date().toISOString() : null,
          message: "Payout updated successfully (mock)",
        })
      }

      // Check payout exists
      const [existing] = await db!
        .select({ id: commissionPayouts.id, status: commissionPayouts.status })
        .from(commissionPayouts)
        .where(eq(commissionPayouts.id, payoutId))

      if (!existing) {
        return notFound("Payout not found")
      }

      // Build update object
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      if (status) {
        updateData.status = status
        if (status === "paid") {
          updateData.paidAt = new Date()
        }
      }

      if (paymentReference !== undefined) {
        updateData.paymentReference = paymentReference
      }

      // Update payout
      const [updated] = await db!
        .update(commissionPayouts)
        .set(updateData)
        .where(eq(commissionPayouts.id, payoutId))
        .returning()

      return successResponse({
        ...updated,
        commissionRate: Number(updated.commissionRate),
        grossRevenue: Number(updated.grossRevenue),
        commissionAmount: Number(updated.commissionAmount),
        bonusAmount: Number(updated.bonusAmount),
        message: "Payout updated successfully",
      })
    } catch (error: any) {
      console.error("[Admin Payout] PATCH Error:", error)
      return serverError(error.message || "Failed to update payout")
    }
  })
}
