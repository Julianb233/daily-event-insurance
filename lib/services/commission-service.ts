/**
 * Commission Service
 *
 * Server-side service for fetching commission tiers from the database.
 * Includes caching, fallback to hardcoded defaults, and partner override support.
 */

import { db, isDbConfigured, commissionTiers as tiersTable, partnerTierOverrides, CommissionTier as DBTier } from "@/lib/db"
import { eq, and, gte, asc, or, isNull } from "drizzle-orm"

// Cache configuration
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
let tiersCache: DBTier[] | null = null
let tiersCacheTime = 0

// Fallback tiers if database is unavailable
// Bronze starts at 500 minimum monthly participants
const FALLBACK_TIERS: DBTier[] = [
  {
    id: "default_1",
    tierName: "Bronze",
    minVolume: 500,
    maxVolume: 999,
    commissionRate: "0.4000",
    flatBonus: "0",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "default_2",
    tierName: "Silver",
    minVolume: 1000,
    maxVolume: 2499,
    commissionRate: "0.4500",
    flatBonus: "10.00",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "default_3",
    tierName: "Gold",
    minVolume: 2500,
    maxVolume: 4999,
    commissionRate: "0.5000",
    flatBonus: "25.00",
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "default_4",
    tierName: "Platinum",
    minVolume: 5000,
    maxVolume: null,
    commissionRate: "0.5500",
    flatBonus: "50.00",
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export interface ResolvedTier {
  id: string
  tierName: string
  minVolume: number
  maxVolume: number | null
  commissionRate: number // Decimal 0-1
  flatBonus: number
  isOverride: boolean
  overrideReason?: string
}

/**
 * Fetch all active commission tiers from database with caching
 */
export async function getCommissionTiers(forceRefresh = false): Promise<DBTier[]> {
  // Check cache
  const now = Date.now()
  if (!forceRefresh && tiersCache && (now - tiersCacheTime) < CACHE_TTL_MS) {
    return tiersCache
  }

  // If database not configured, use fallback
  if (!isDbConfigured() || !db) {
    console.log("[CommissionService] Database not configured, using fallback tiers")
    return FALLBACK_TIERS
  }

  try {
    const tiers = await db
      .select()
      .from(tiersTable)
      .where(eq(tiersTable.isActive, true))
      .orderBy(asc(tiersTable.sortOrder), asc(tiersTable.minVolume))

    // If no tiers in database, seed with defaults
    if (tiers.length === 0) {
      console.log("[CommissionService] No tiers found, using fallback")
      return FALLBACK_TIERS
    }

    // Update cache
    tiersCache = tiers
    tiersCacheTime = now

    return tiers
  } catch (error) {
    console.error("[CommissionService] Error fetching tiers:", error)
    return FALLBACK_TIERS
  }
}

/**
 * Get partner's override tier (if any)
 */
export async function getPartnerTierOverride(partnerId: string): Promise<{
  tier: DBTier
  reason: string | null
  expiresAt: Date | null
} | null> {
  if (!isDbConfigured() || !db) {
    return null
  }

  try {
    const now = new Date()

    const [override] = await db
      .select({
        override: partnerTierOverrides,
        tier: tiersTable,
      })
      .from(partnerTierOverrides)
      .innerJoin(tiersTable, eq(partnerTierOverrides.tierId, tiersTable.id))
      .where(
        and(
          eq(partnerTierOverrides.partnerId, partnerId),
          or(
            isNull(partnerTierOverrides.expiresAt),
            gte(partnerTierOverrides.expiresAt, now)
          )
        )
      )
      .limit(1)

    if (!override) {
      return null
    }

    return {
      tier: override.tier,
      reason: override.override.reason,
      expiresAt: override.override.expiresAt,
    }
  } catch (error) {
    console.error("[CommissionService] Error fetching partner override:", error)
    return null
  }
}

/**
 * Resolve the effective commission tier for a partner based on volume
 * Checks for overrides first, then calculates based on volume
 */
export async function resolvePartnerTier(
  partnerId: string | null,
  monthlyVolume: number
): Promise<ResolvedTier> {
  // Check for partner-specific override first
  if (partnerId) {
    const override = await getPartnerTierOverride(partnerId)
    if (override) {
      return {
        id: override.tier.id,
        tierName: override.tier.tierName,
        minVolume: override.tier.minVolume,
        maxVolume: override.tier.maxVolume,
        commissionRate: Number(override.tier.commissionRate),
        flatBonus: Number(override.tier.flatBonus || 0),
        isOverride: true,
        overrideReason: override.reason || "Manual tier assignment",
      }
    }
  }

  // Get tiers from database
  const tiers = await getCommissionTiers()

  // Find matching tier based on volume
  let matchedTier = tiers.find(tier => {
    const min = tier.minVolume
    const max = tier.maxVolume ?? Infinity
    return monthlyVolume >= min && monthlyVolume <= max
  })

  // Fallback to first tier if no match
  if (!matchedTier) {
    matchedTier = tiers[0] || FALLBACK_TIERS[0]
  }

  return {
    id: matchedTier.id,
    tierName: matchedTier.tierName,
    minVolume: matchedTier.minVolume,
    maxVolume: matchedTier.maxVolume,
    commissionRate: Number(matchedTier.commissionRate),
    flatBonus: Number(matchedTier.flatBonus || 0),
    isOverride: false,
  }
}

/**
 * Calculate commission amount based on premium and tier
 */
export function calculateCommission(
  premium: number,
  tier: ResolvedTier,
  policyCount: number = 1
): {
  commissionAmount: number
  flatBonusAmount: number
  totalCommission: number
  effectiveRate: number
} {
  const commissionAmount = premium * tier.commissionRate
  const flatBonusAmount = tier.flatBonus * policyCount
  const totalCommission = commissionAmount + flatBonusAmount
  const effectiveRate = premium > 0 ? totalCommission / premium : tier.commissionRate

  return {
    commissionAmount: Number(commissionAmount.toFixed(2)),
    flatBonusAmount: Number(flatBonusAmount.toFixed(2)),
    totalCommission: Number(totalCommission.toFixed(2)),
    effectiveRate: Number(effectiveRate.toFixed(4)),
  }
}

/**
 * Get next tier information for progress display
 */
export async function getNextTierInfo(currentVolume: number): Promise<{
  currentTier: ResolvedTier
  nextTier: ResolvedTier | null
  volumeToNext: number
  rateIncrease: number
}> {
  const tiers = await getCommissionTiers()

  // Find current tier
  let currentTierData = tiers.find(tier => {
    const min = tier.minVolume
    const max = tier.maxVolume ?? Infinity
    return currentVolume >= min && currentVolume <= max
  })

  if (!currentTierData) {
    currentTierData = tiers[0] || FALLBACK_TIERS[0]
  }

  const currentTier: ResolvedTier = {
    id: currentTierData.id,
    tierName: currentTierData.tierName,
    minVolume: currentTierData.minVolume,
    maxVolume: currentTierData.maxVolume,
    commissionRate: Number(currentTierData.commissionRate),
    flatBonus: Number(currentTierData.flatBonus || 0),
    isOverride: false,
  }

  // Find next tier
  const currentIndex = tiers.indexOf(currentTierData)
  const nextTierData = currentIndex >= 0 && currentIndex < tiers.length - 1
    ? tiers[currentIndex + 1]
    : null

  if (!nextTierData) {
    return {
      currentTier,
      nextTier: null,
      volumeToNext: 0,
      rateIncrease: 0,
    }
  }

  const nextTier: ResolvedTier = {
    id: nextTierData.id,
    tierName: nextTierData.tierName,
    minVolume: nextTierData.minVolume,
    maxVolume: nextTierData.maxVolume,
    commissionRate: Number(nextTierData.commissionRate),
    flatBonus: Number(nextTierData.flatBonus || 0),
    isOverride: false,
  }

  return {
    currentTier,
    nextTier,
    volumeToNext: Math.max(0, nextTierData.minVolume - currentVolume),
    rateIncrease: nextTier.commissionRate - currentTier.commissionRate,
  }
}

/**
 * Invalidate the tiers cache (call after updates)
 */
export function invalidateTiersCache(): void {
  tiersCache = null
  tiersCacheTime = 0
}

/**
 * Seed default tiers to the database
 */
export async function seedDefaultTiers(): Promise<void> {
  if (!isDbConfigured() || !db) {
    console.log("[CommissionService] Database not configured, cannot seed tiers")
    return
  }

  try {
    // Check if tiers exist
    const existing = await db
      .select()
      .from(tiersTable)
      .limit(1)

    if (existing.length > 0) {
      console.log("[CommissionService] Tiers already exist, skipping seed")
      return
    }

    // Insert default tiers - Bronze starts at 500 minimum
    const defaultTiers = [
      { tierName: "Bronze", minVolume: 500, maxVolume: 999, commissionRate: "0.4000", flatBonus: "0", sortOrder: 1 },
      { tierName: "Silver", minVolume: 1000, maxVolume: 2499, commissionRate: "0.4500", flatBonus: "10.00", sortOrder: 2 },
      { tierName: "Gold", minVolume: 2500, maxVolume: 4999, commissionRate: "0.5000", flatBonus: "25.00", sortOrder: 3 },
      { tierName: "Platinum", minVolume: 5000, maxVolume: null, commissionRate: "0.5500", flatBonus: "50.00", sortOrder: 4 },
    ]

    await db.insert(tiersTable).values(defaultTiers)
    console.log("[CommissionService] Default tiers seeded successfully")

    // Invalidate cache
    invalidateTiersCache()
  } catch (error) {
    console.error("[CommissionService] Error seeding tiers:", error)
  }
}
