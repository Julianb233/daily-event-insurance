import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, commissionPayouts, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFoundError, badRequest } from "@/lib/api-responses"

type RouteContext = {
  params: Promise<{ id: string }>
}

// Mock payout for dev mode
const mockPayout = {
  id: "1",
  partnerId: "p1",
  partnerName: "Adventure Sports Inc",
  yearMonth: "2024-12",
  tierAtPayout: "Gold",
  commissionRate: "0.5000",
  totalPolicies: 87,
  totalParticipants: 2450,
  grossRevenue: "9040.00",
  commissionAmount: "4520.00",
  bonusAmount: "0",
  status: "pending",
  paidAt: null,
  paymentReference: null,
  paymentMethod: null,
  notes: null,
  createdAt: "2024-12-16T00:00:00Z",
  updatedAt: "2024-12-16T00:00:00Z",
}

/**
 * GET /api/admin/payouts/[id]
 * Get a specific payout with full details
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({ ...mockPayout, id })
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
        })
        .from(commissionPayouts)
        .leftJoin(partners, eq(commissionPayouts.partnerId, partners.id))
        .where(eq(commissionPayouts.id, id))
        .limit(1)

      if (!payout) {
        return notFoundError("Payout not found")
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
 * PATCH /api/admin/payouts/[id]
 * Update payout status, mark as processing/paid, etc.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const { status, paymentReference, notes } = body

      const validStatuses = ["pending", "processing", "paid", "failed"]
      if (status && !validStatuses.includes(status)) {
        return badRequest(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
      }

      if (isDevMode || !isDbConfigured()) {
        const now = new Date().toISOString()
        return successResponse({
          ...mockPayout,
          id,
          status: status || mockPayout.status,
          paymentReference: paymentReference || mockPayout.paymentReference,
          paidAt: status === "paid" ? now : mockPayout.paidAt,
          updatedAt: now,
          message: "Payout updated successfully (mock)",
        })
      }

      // Check payout exists
      const [existing] = await db!
        .select({ id: commissionPayouts.id, status: commissionPayouts.status })
        .from(commissionPayouts)
        .where(eq(commissionPayouts.id, id))

      if (!existing) {
        return notFoundError("Payout not found")
      }

      // Build update object
      const updateData: Record<string, any> = {}

      if (status) {
        updateData.status = status

        // Set payment timestamp when marking as paid
        if (status === "paid" && existing.status !== "paid") {
          updateData.paidAt = new Date()
          // Generate payment reference if not provided
          if (!paymentReference) {
            const dateStr = new Date().toISOString().slice(0, 7).replace("-", "")
            const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
            updateData.paymentReference = `ACH-${dateStr}-${randomNum}`
          }
        }
      }

      if (paymentReference !== undefined) {
        updateData.paymentReference = paymentReference
      }

      // Update payout
      const [updated] = await db!
        .update(commissionPayouts)
        .set(updateData)
        .where(eq(commissionPayouts.id, id))
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
