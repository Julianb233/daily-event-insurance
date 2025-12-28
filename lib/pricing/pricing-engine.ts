/**
 * Comprehensive Pricing Engine for Daily Event Insurance
 *
 * Calculates premiums based on:
 * - Coverage type (liability, equipment, cancellation)
 * - Risk factors (event type, participants, location, duration)
 * - Partner tier and commission structure
 * - Volume discounts and location bonuses
 * - Market rates from carrier data
 */

import { getCommissionTier, OPT_IN_RATE } from "@/lib/commission-tiers"
import type { CommissionTier } from "@/lib/commission-tiers"

// ============= Types =============

export interface PricingInput {
  eventType: string
  coverageType: "liability" | "equipment" | "cancellation"
  participants: number
  eventDate: Date
  duration?: number // hours
  location?: string
  eventDetails?: {
    location?: string
    duration?: number
    description?: string
  }
  partnerVolume?: number // for tier-based pricing
}

export interface RiskFactors {
  baseRisk: number // 0.0 - 2.0 multiplier
  eventTypeRisk: number
  participantRisk: number
  durationRisk: number
  dateRisk: number
  locationRisk: number
  coverageRisk: number
}

export interface PricingResult {
  premium: number // Total premium
  basePrice: number // Base price before risk adjustments
  riskMultiplier: number // Combined risk multiplier
  riskFactors: RiskFactors
  commission: number // Partner commission
  commissionTier: CommissionTier
  commissionRate: number // Percentage
  perParticipant: number // Price per participant
  breakdown: {
    basePremium: number
    riskAdjustment: number
    volumeDiscount: number
    finalPremium: number
  }
}

// ============= Base Pricing Configuration =============

/**
 * Base prices per coverage type (per participant per day)
 * These are market rates derived from carrier data
 */
const BASE_PRICES: Record<string, number> = {
  liability: 4.99, // General liability coverage
  equipment: 9.99, // Equipment damage/loss
  cancellation: 14.99, // Event cancellation/postponement
}

/**
 * Event type risk categories
 * Based on historical claims data and industry standards
 */
const EVENT_TYPE_RISK_MAP: Record<string, number> = {
  // Low risk (0.8-1.0)
  "gym session": 0.85,
  "yoga class": 0.8,
  "pilates": 0.8,
  "spin class": 0.9,
  "swimming": 0.9,
  "walking group": 0.8,

  // Medium risk (1.0-1.3)
  "crossfit": 1.2,
  "boot camp": 1.15,
  "running": 1.0,
  "cycling": 1.1,
  "5k race": 1.1,
  "10k race": 1.15,
  "half marathon": 1.2,
  "marathon": 1.3,

  // High risk (1.3-1.6)
  "rock climbing": 1.4,
  "bouldering": 1.35,
  "kayaking": 1.3,
  "paddle boarding": 1.25,
  "obstacle course": 1.45,
  "trail running": 1.35,
  "mountain biking": 1.5,

  // Very high risk (1.6-2.0)
  "zip line": 1.7,
  "white water rafting": 1.8,
  "skiing": 1.75,
  "snowboarding": 1.75,
  "skydiving": 2.0,
  "paragliding": 1.9,

  // Default for unknown
  "other": 1.0,
}

/**
 * Coverage type risk multipliers
 */
const COVERAGE_RISK_MAP: Record<string, number> = {
  liability: 1.0, // Base risk
  equipment: 1.15, // Equipment has higher loss frequency
  cancellation: 1.3, // Cancellation is most complex
}

// ============= Risk Assessment Functions =============

/**
 * Calculate event type risk based on activity
 */
export function calculateEventTypeRisk(eventType: string): number {
  const normalized = eventType.toLowerCase().trim()

  // Check for exact match
  if (EVENT_TYPE_RISK_MAP[normalized]) {
    return EVENT_TYPE_RISK_MAP[normalized]
  }

  // Check for partial matches
  for (const [key, risk] of Object.entries(EVENT_TYPE_RISK_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return risk
    }
  }

  // Default to medium risk
  return 1.0
}

/**
 * Calculate participant-based risk
 * Larger groups have economies of scale but higher complexity
 */
export function calculateParticipantRisk(participants: number): number {
  if (participants <= 10) return 1.0 // Small groups - base risk
  if (participants <= 50) return 0.95 // Medium groups - slight discount
  if (participants <= 100) return 0.9 // Large groups - better discount
  if (participants <= 500) return 0.85 // Very large - significant discount
  return 0.8 // Massive events - best discount
}

/**
 * Calculate duration-based risk
 * Longer events have more exposure
 */
export function calculateDurationRisk(duration: number): number {
  if (duration <= 1) return 0.9 // Very short - less than 1 hour
  if (duration <= 2) return 1.0 // Short - 1-2 hours
  if (duration <= 4) return 1.1 // Medium - 2-4 hours
  if (duration <= 8) return 1.2 // Long - 4-8 hours (full day)
  return 1.3 // Very long - over 8 hours
}

/**
 * Calculate date-based risk
 * Events on weekends, holidays, or in adverse weather months
 */
export function calculateDateRisk(eventDate: Date): number {
  const dayOfWeek = eventDate.getDay()
  const month = eventDate.getMonth()

  let risk = 1.0

  // Weekend events typically have more participants (slight increase)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    risk += 0.05
  }

  // Winter months (Dec-Feb) have higher risk for outdoor activities
  if (month === 11 || month === 0 || month === 1) {
    risk += 0.1
  }

  // Summer months (Jun-Aug) have high heat risk
  if (month === 5 || month === 6 || month === 7) {
    risk += 0.05
  }

  return risk
}

/**
 * Calculate location-based risk
 * Indoor vs outdoor, urban vs remote
 */
export function calculateLocationRisk(location?: string): number {
  if (!location) return 1.0

  const normalized = location.toLowerCase()

  // Indoor facilities - lower risk
  if (normalized.includes("gym") ||
      normalized.includes("studio") ||
      normalized.includes("facility") ||
      normalized.includes("indoor")) {
    return 0.9
  }

  // Outdoor but controlled - medium risk
  if (normalized.includes("park") ||
      normalized.includes("field") ||
      normalized.includes("track")) {
    return 1.0
  }

  // Remote outdoor - higher risk
  if (normalized.includes("trail") ||
      normalized.includes("mountain") ||
      normalized.includes("wilderness") ||
      normalized.includes("backcountry")) {
    return 1.2
  }

  return 1.0 // Default
}

// ============= Main Pricing Engine =============

/**
 * Calculate comprehensive pricing for an insurance quote
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const {
    eventType,
    coverageType,
    participants,
    eventDate,
    duration,
    location,
    eventDetails,
    partnerVolume = 0,
  } = input

  // 1. Get base price
  const basePrice = BASE_PRICES[coverageType] || BASE_PRICES.liability

  // 2. Calculate all risk factors
  const eventTypeRisk = calculateEventTypeRisk(eventType)
  const participantRisk = calculateParticipantRisk(participants)
  const durationRisk = calculateDurationRisk(
    duration || eventDetails?.duration || 2 // default 2 hours
  )
  const dateRisk = calculateDateRisk(eventDate)
  const locationRisk = calculateLocationRisk(
    location || eventDetails?.location
  )
  const coverageRisk = COVERAGE_RISK_MAP[coverageType] || 1.0

  // 3. Combine risk factors
  const baseRisk = eventTypeRisk * coverageRisk
  const riskMultiplier = baseRisk * participantRisk * durationRisk * dateRisk * locationRisk

  const riskFactors: RiskFactors = {
    baseRisk,
    eventTypeRisk,
    participantRisk,
    durationRisk,
    dateRisk,
    locationRisk,
    coverageRisk,
  }

  // 4. Calculate premium
  const basePremium = basePrice * participants
  const riskAdjustedPremium = basePremium * riskMultiplier

  // 5. Apply volume discounts if partner volume is provided
  let volumeDiscount = 0
  if (partnerVolume > 0) {
    const tier = getCommissionTier(partnerVolume)
    // Volume discount: 2-10% based on tier
    const discountRate = (tier.percentage - 25) / 100 // 0-12.5% range, scaled to 0-10%
    volumeDiscount = riskAdjustedPremium * (discountRate * 0.8)
  }

  const finalPremium = Math.max(
    riskAdjustedPremium - volumeDiscount,
    basePrice * participants * 0.5 // Minimum 50% of base price
  )

  // 6. Calculate commission (50% of premium as per business model)
  const commissionRate = 0.5
  const commission = finalPremium * commissionRate

  // 7. Get commission tier for display
  const commissionTier = getCommissionTier(partnerVolume)

  // 8. Round to 2 decimal places
  const premium = Number(finalPremium.toFixed(2))
  const commissionAmount = Number(commission.toFixed(2))
  const perParticipant = Number((premium / participants).toFixed(2))

  return {
    premium,
    basePrice,
    riskMultiplier: Number(riskMultiplier.toFixed(2)),
    riskFactors,
    commission: commissionAmount,
    commissionTier,
    commissionRate,
    perParticipant,
    breakdown: {
      basePremium: Number(basePremium.toFixed(2)),
      riskAdjustment: Number((riskAdjustedPremium - basePremium).toFixed(2)),
      volumeDiscount: Number(volumeDiscount.toFixed(2)),
      finalPremium: premium,
    },
  }
}

/**
 * Calculate pricing for multiple coverage types at once
 */
export function calculateMultiCoveragePricing(
  input: Omit<PricingInput, "coverageType">
): Record<string, PricingResult> {
  return {
    liability: calculatePricing({ ...input, coverageType: "liability" }),
    equipment: calculatePricing({ ...input, coverageType: "equipment" }),
    cancellation: calculatePricing({ ...input, coverageType: "cancellation" }),
  }
}

/**
 * Validate pricing input
 */
export function validatePricingInput(input: PricingInput): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!input.eventType || input.eventType.trim().length < 2) {
    errors.push("Event type must be at least 2 characters")
  }

  if (!["liability", "equipment", "cancellation"].includes(input.coverageType)) {
    errors.push("Coverage type must be liability, equipment, or cancellation")
  }

  if (input.participants < 1 || input.participants > 10000) {
    errors.push("Participants must be between 1 and 10,000")
  }

  if (input.eventDate < new Date()) {
    errors.push("Event date cannot be in the past")
  }

  if (input.duration && (input.duration < 0.5 || input.duration > 24)) {
    errors.push("Duration must be between 0.5 and 24 hours")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get pricing estimate ranges for a given event type
 */
export function getPricingEstimates(
  eventType: string,
  participants: number = 100
): {
  coverageType: string
  minPrice: number
  maxPrice: number
  typical: number
}[] {
  const baseDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  const coverageTypes: Array<"liability" | "equipment" | "cancellation"> = [
    "liability",
    "equipment",
    "cancellation",
  ]

  return coverageTypes.map(coverageType => {
    // Calculate with minimum risk
    const minInput: PricingInput = {
      eventType,
      coverageType,
      participants,
      eventDate: baseDate,
      duration: 1,
      location: "indoor facility",
    }
    const minResult = calculatePricing(minInput)

    // Calculate with maximum risk
    const maxInput: PricingInput = {
      eventType,
      coverageType,
      participants,
      eventDate: new Date(baseDate.getFullYear(), 11, 25), // Christmas
      duration: 8,
      location: "remote wilderness",
    }
    const maxResult = calculatePricing(maxInput)

    // Calculate typical
    const typicalInput: PricingInput = {
      eventType,
      coverageType,
      participants,
      eventDate: baseDate,
      duration: 2,
    }
    const typicalResult = calculatePricing(typicalInput)

    return {
      coverageType,
      minPrice: minResult.premium,
      maxPrice: maxResult.premium,
      typical: typicalResult.premium,
    }
  })
}

/**
 * Format pricing for display
 */
export function formatPricingDisplay(result: PricingResult): {
  total: string
  perParticipant: string
  commission: string
  commissionRate: string
} {
  return {
    total: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(result.premium),
    perParticipant: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(result.perParticipant),
    commission: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(result.commission),
    commissionRate: `${(result.commissionRate * 100).toFixed(0)}%`,
  }
}
