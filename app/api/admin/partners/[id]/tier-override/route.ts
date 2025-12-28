import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerTierOverrides, commissionTiers, users } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

const createOverrideSchema = z.object({
  tierId: z.string().uuid(),
  reason: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/partners/[id]/tier-override
 * Get partner's current tier override (if any)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id: partnerId } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          partnerId,
          override: {
            id: "override_1",
            tierId: "tier_3",
            tierName: "Gold",
            commissionRate: "0.5000",
            reason: "VIP partner agreement",
            appliedBy: "admin@example.com",
            expiresAt: null,
            createdAt: new Date().toISOString(),
          },
          calculatedTier: {
            tierName: "Silver",
            commissionRate: "0.4500",
            reason: "Based on volume (350 participants)",
          },
        })
      }

      // Get partner
      const [partner] = await db!
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return notFoundError("Partner")
      }

      // Get current override with tier details
      const [override] = await db!
        .select({
          override: partnerTierOverrides,
          tier: commissionTiers,
          appliedByUser: users,
        })
        .from(partnerTierOverrides)
        .leftJoin(commissionTiers, eq(partnerTierOverrides.tierId, commissionTiers.id))
        .leftJoin(users, eq(partnerTierOverrides.appliedBy, users.id))
        .where(eq(partnerTierOverrides.partnerId, partnerId))
        .limit(1)

      // Get all active tiers to calculate what they would be without override
      const activeTiers = await db!
        .select()
        .from(commissionTiers)
        .where(eq(commissionTiers.isActive, true))
        .orderBy(commissionTiers.sortOrder)

      return successResponse({
        partnerId,
        partnerName: partner.businessName,
        override: override ? {
          id: override.override.id,
          tierId: override.override.tierId,
          tierName: override.tier?.tierName,
          commissionRate: override.tier?.commissionRate,
          flatBonus: override.tier?.flatBonus,
          reason: override.override.reason,
          appliedBy: override.appliedByUser?.email,
          expiresAt: override.override.expiresAt,
          createdAt: override.override.createdAt,
        } : null,
        availableTiers: activeTiers.map(t => ({
          id: t.id,
          name: t.tierName,
          minVolume: t.minVolume,
          maxVolume: t.maxVolume,
          commissionRate: t.commissionRate,
          flatBonus: t.flatBonus,
        })),
      })
    } catch (error: any) {
      console.error("[Partner Tier Override] GET Error:", error)
      return serverError(error.message || "Failed to fetch tier override")
    }
  })
}

/**
 * POST /api/admin/partners/[id]/tier-override
 * Create or update a partner's tier override
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id: partnerId } = await context.params

      const body = await request.json()
      const validationResult = createOverrideSchema.safeParse(body)

      if (!validationResult.success) {
        return validationError(
          "Invalid override data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: `override_${Date.now()}`,
          partnerId,
          tierId: data.tierId,
          reason: data.reason,
          appliedBy: userId,
          expiresAt: data.expiresAt,
          createdAt: new Date().toISOString(),
        }, "Tier override created")
      }

      // Verify partner exists
      const [partner] = await db!
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return notFoundError("Partner")
      }

      // Verify tier exists
      const [tier] = await db!
        .select()
        .from(commissionTiers)
        .where(eq(commissionTiers.id, data.tierId))
        .limit(1)

      if (!tier) {
        return notFoundError("Commission tier")
      }

      // Check if override already exists (upsert)
      const [existingOverride] = await db!
        .select()
        .from(partnerTierOverrides)
        .where(eq(partnerTierOverrides.partnerId, partnerId))
        .limit(1)

      let result
      if (existingOverride) {
        // Update existing
        [result] = await db!
          .update(partnerTierOverrides)
          .set({
            tierId: data.tierId,
            reason: data.reason,
            appliedBy: userId,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            updatedAt: new Date(),
          })
          .where(eq(partnerTierOverrides.partnerId, partnerId))
          .returning()
      } else {
        // Create new
        [result] = await db!
          .insert(partnerTierOverrides)
          .values({
            partnerId,
            tierId: data.tierId,
            reason: data.reason,
            appliedBy: userId,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          })
          .returning()
      }

      return successResponse({
        ...result,
        tierName: tier.tierName,
        commissionRate: tier.commissionRate,
      }, existingOverride ? "Tier override updated" : "Tier override created")
    } catch (error: any) {
      console.error("[Partner Tier Override] POST Error:", error)
      return serverError(error.message || "Failed to create tier override")
    }
  })
}

/**
 * DELETE /api/admin/partners/[id]/tier-override
 * Remove a partner's tier override (revert to calculated tier)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id: partnerId } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse(
          { partnerId, deleted: true },
          "Tier override removed - partner will use calculated tier"
        )
      }

      const result = await db!
        .delete(partnerTierOverrides)
        .where(eq(partnerTierOverrides.partnerId, partnerId))
        .returning()

      if (result.length === 0) {
        return notFoundError("Tier override")
      }

      return successResponse(
        { partnerId, deleted: true },
        "Tier override removed - partner will use calculated tier"
      )
    } catch (error: any) {
      console.error("[Partner Tier Override] DELETE Error:", error)
      return serverError(error.message || "Failed to delete tier override")
    }
  })
}
