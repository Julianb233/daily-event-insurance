import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, commissionTiers, NewCommissionTier } from "@/lib/db"
import { eq, asc, desc, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

// Validation schemas
const createTierSchema = z.object({
  tierName: z.string().min(1).max(50),
  minVolume: z.number().int().min(0),
  maxVolume: z.number().int().min(0).nullable().optional(),
  commissionRate: z.number().min(0).max(1), // 0-1 (0% to 100%)
  flatBonus: z.number().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
})

const updateTierSchema = createTierSchema.partial()

/**
 * GET /api/admin/commission-tiers
 * List all commission tiers
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const activeOnly = searchParams.get("activeOnly") === "true"

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockTiers = [
          { id: "tier_1", tierName: "Bronze", minVolume: 0, maxVolume: 99, commissionRate: "0.4000", flatBonus: "0", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
          { id: "tier_2", tierName: "Silver", minVolume: 100, maxVolume: 499, commissionRate: "0.4500", flatBonus: "0", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
          { id: "tier_3", tierName: "Gold", minVolume: 500, maxVolume: 999, commissionRate: "0.5000", flatBonus: "25.00", isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
          { id: "tier_4", tierName: "Platinum", minVolume: 1000, maxVolume: null, commissionRate: "0.5500", flatBonus: "50.00", isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
        ]
        return paginatedResponse(mockTiers, page, pageSize, mockTiers.length)
      }

      // Get total count
      const whereClause = activeOnly ? eq(commissionTiers.isActive, true) : undefined
      const [{ total }] = await db!
        .select({ total: count() })
        .from(commissionTiers)
        .where(whereClause)

      // Get tiers
      const offset = (page - 1) * pageSize
      const tiers = await db!
        .select()
        .from(commissionTiers)
        .where(whereClause)
        .orderBy(asc(commissionTiers.sortOrder), asc(commissionTiers.minVolume))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(tiers, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Commission Tiers] GET Error:", error)
      return serverError(error.message || "Failed to fetch commission tiers")
    }
  })
}

/**
 * POST /api/admin/commission-tiers
 * Create a new commission tier
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const body = await request.json()
      const validationResult = createTierSchema.safeParse(body)

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
          id: `tier_${Date.now()}`,
          tierName: data.tierName,
          minVolume: data.minVolume,
          maxVolume: data.maxVolume ?? null,
          commissionRate: data.commissionRate.toFixed(4),
          flatBonus: (data.flatBonus || 0).toFixed(2),
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return successResponse(mockTier, "Commission tier created", 201)
      }

      // Create tier
      const tierData: NewCommissionTier = {
        tierName: data.tierName,
        minVolume: data.minVolume,
        maxVolume: data.maxVolume ?? null,
        commissionRate: data.commissionRate.toFixed(4),
        flatBonus: (data.flatBonus || 0).toFixed(2),
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      }

      const [tier] = await db!.insert(commissionTiers).values(tierData).returning()

      if (!tier) {
        return serverError("Failed to create commission tier")
      }

      return successResponse(tier, "Commission tier created", 201)
    } catch (error: any) {
      console.error("[Admin Commission Tiers] POST Error:", error)
      return serverError(error.message || "Failed to create commission tier")
    }
  })
}
