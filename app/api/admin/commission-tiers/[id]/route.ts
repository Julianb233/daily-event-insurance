import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, commissionTiers } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

const updateTierSchema = z.object({
  tierName: z.string().min(1).max(50).optional(),
  minVolume: z.number().int().min(0).optional(),
  maxVolume: z.number().int().min(0).nullable().optional(),
  commissionRate: z.number().min(0).max(1).optional(),
  flatBonus: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/commission-tiers/[id]
 * Get a single commission tier
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const mockTier = {
          id,
          tierName: "Gold",
          minVolume: 500,
          maxVolume: 999,
          commissionRate: "0.5000",
          flatBonus: "25.00",
          isActive: true,
          sortOrder: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return successResponse(mockTier)
      }

      const [tier] = await db!
        .select()
        .from(commissionTiers)
        .where(eq(commissionTiers.id, id))
        .limit(1)

      if (!tier) {
        return notFoundError("Commission tier")
      }

      return successResponse(tier)
    } catch (error: any) {
      console.error("[Admin Commission Tier] GET Error:", error)
      return serverError(error.message || "Failed to fetch commission tier")
    }
  })
}

/**
 * PATCH /api/admin/commission-tiers/[id]
 * Update a commission tier
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      const body = await request.json()
      const validationResult = updateTierSchema.safeParse(body)

      if (!validationResult.success) {
        return validationError(
          "Invalid tier data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const mockTier = {
          id,
          tierName: data.tierName || "Updated Tier",
          minVolume: data.minVolume ?? 0,
          maxVolume: data.maxVolume ?? null,
          commissionRate: data.commissionRate?.toFixed(4) || "0.5000",
          flatBonus: data.flatBonus?.toFixed(2) || "0.00",
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? 0,
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
        }
        return successResponse(mockTier, "Commission tier updated")
      }

      // Build update object
      const updateData: Partial<typeof commissionTiers.$inferInsert> = {
        updatedAt: new Date(),
      }

      if (data.tierName !== undefined) updateData.tierName = data.tierName
      if (data.minVolume !== undefined) updateData.minVolume = data.minVolume
      if (data.maxVolume !== undefined) updateData.maxVolume = data.maxVolume
      if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate.toFixed(4)
      if (data.flatBonus !== undefined) updateData.flatBonus = data.flatBonus.toFixed(2)
      if (data.isActive !== undefined) updateData.isActive = data.isActive
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

      const [tier] = await db!
        .update(commissionTiers)
        .set(updateData)
        .where(eq(commissionTiers.id, id))
        .returning()

      if (!tier) {
        return notFoundError("Commission tier")
      }

      return successResponse(tier, "Commission tier updated")
    } catch (error: any) {
      console.error("[Admin Commission Tier] PATCH Error:", error)
      return serverError(error.message || "Failed to update commission tier")
    }
  })
}

/**
 * DELETE /api/admin/commission-tiers/[id]
 * Delete a commission tier (soft delete by setting isActive = false)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      const searchParams = request.nextUrl.searchParams
      const hardDelete = searchParams.get("hard") === "true"

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse(
          { id, deleted: true, hardDelete },
          hardDelete ? "Commission tier permanently deleted" : "Commission tier deactivated"
        )
      }

      if (hardDelete) {
        // Hard delete
        const result = await db!
          .delete(commissionTiers)
          .where(eq(commissionTiers.id, id))
          .returning()

        if (result.length === 0) {
          return notFoundError("Commission tier")
        }

        return successResponse(
          { id, deleted: true },
          "Commission tier permanently deleted"
        )
      } else {
        // Soft delete (deactivate)
        const [tier] = await db!
          .update(commissionTiers)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(commissionTiers.id, id))
          .returning()

        if (!tier) {
          return notFoundError("Commission tier")
        }

        return successResponse(tier, "Commission tier deactivated")
      }
    } catch (error: any) {
      console.error("[Admin Commission Tier] DELETE Error:", error)
      return serverError(error.message || "Failed to delete commission tier")
    }
  })
}
