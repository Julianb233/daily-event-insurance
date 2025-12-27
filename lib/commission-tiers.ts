/**
 * Commission Tiers Configuration
 *
 * Centralized configuration for partner commission calculations.
 * Extracted from revenue-calculator.tsx for reuse across the application.
 */

export interface CommissionTier {
  minVolume: number
  maxVolume: number
  percentage: number
  perParticipant: number
}

export interface LocationOption {
  label: string
  value: number
  bonus: number
}

export interface EarningsCalculation {
  totalParticipants: number
  optedInParticipants: number
  commissionTier: CommissionTier
  effectivePerParticipant: number
  locationBonus: number
  monthlyEarnings: number
  annualEarnings: number
  tierPercentage: number
}

/**
 * Tiered commission structure
 * Base policy price: ~$40, commission tiers from 25% to 37.5%
 */
export const commissionTiers: CommissionTier[] = [
  { minVolume: 0, maxVolume: 999, percentage: 25, perParticipant: 10 },
  { minVolume: 1000, maxVolume: 2499, percentage: 27.5, perParticipant: 11 },
  { minVolume: 2500, maxVolume: 4999, percentage: 30, perParticipant: 12 },
  { minVolume: 5000, maxVolume: 9999, percentage: 32.5, perParticipant: 13 },
  { minVolume: 10000, maxVolume: 24999, percentage: 35, perParticipant: 14 },
  { minVolume: 25000, maxVolume: Infinity, percentage: 37.5, perParticipant: 15 },
]

/**
 * Location bonus options
 * Multi-location partners earn additional per-participant bonus
 */
export const locationOptions: LocationOption[] = [
  { label: "1 Location", value: 1, bonus: 0 },
  { label: "2-5 Locations", value: 3, bonus: 0.5 },
  { label: "6-10 Locations", value: 8, bonus: 1 },
  { label: "11-25 Locations", value: 18, bonus: 1.5 },
  { label: "25+ Locations", value: 30, bonus: 2 },
]

/**
 * Expected opt-in rate for coverage
 * Based on historical data across partner network
 */
export const OPT_IN_RATE = 0.65

/**
 * Volume tier options for UI selectors
 */
export const volumeTiers = [
  { label: "1,000", value: 1000 },
  { label: "2,500", value: 2500 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "25,000", value: 25000 },
  { label: "50,000+", value: 50000 },
]

/**
 * Get commission tier based on total volume
 */
export function getCommissionTier(totalVolume: number): CommissionTier {
  return commissionTiers.find(
    tier => totalVolume >= tier.minVolume && totalVolume <= tier.maxVolume
  ) || commissionTiers[0]
}

/**
 * Get location option by value
 */
export function getLocationOption(locations: number): LocationOption {
  return locationOptions.find(o => o.value === locations) || locationOptions[0]
}

/**
 * Calculate earnings based on participants and locations
 */
export function calculateEarnings(
  monthlyParticipants: number,
  locations: number = 1
): EarningsCalculation {
  const totalParticipants = monthlyParticipants * (locations > 1 ? locations : 1)
  const optedInParticipants = Math.round(totalParticipants * OPT_IN_RATE)
  const commissionTier = getCommissionTier(totalParticipants)
  const locationOption = getLocationOption(locations)
  const effectivePerParticipant = commissionTier.perParticipant + locationOption.bonus
  const monthlyEarnings = optedInParticipants * effectivePerParticipant
  const annualEarnings = monthlyEarnings * 12

  return {
    totalParticipants,
    optedInParticipants,
    commissionTier,
    effectivePerParticipant,
    locationBonus: locationOption.bonus,
    monthlyEarnings,
    annualEarnings,
    tierPercentage: commissionTier.percentage,
  }
}

/**
 * Calculate projected earnings for a specific year-month
 */
export function calculateMonthlyCommission(
  totalParticipants: number,
  optInRate: number = OPT_IN_RATE,
  locationBonus: number = 0
): number {
  const optedIn = Math.round(totalParticipants * optInRate)
  const tier = getCommissionTier(totalParticipants)
  const effectiveRate = tier.perParticipant + locationBonus
  return optedIn * effectiveRate
}

/**
 * Get the next tier information for progress display
 */
export function getNextTier(currentVolume: number): {
  currentTier: CommissionTier
  nextTier: CommissionTier | null
  participantsToNext: number
  percentageIncrease: number
} {
  const currentTier = getCommissionTier(currentVolume)
  const currentIndex = commissionTiers.indexOf(currentTier)
  const nextTier = currentIndex < commissionTiers.length - 1
    ? commissionTiers[currentIndex + 1]
    : null

  return {
    currentTier,
    nextTier,
    participantsToNext: nextTier ? nextTier.minVolume - currentVolume : 0,
    percentageIncrease: nextTier ? nextTier.percentage - currentTier.percentage : 0,
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Generate chart data for earnings visualization
 */
export function generateEarningsChartData(locations: number = 1): Array<{
  participants: number
  earnings: number
  tier: string
}> {
  const locationOption = getLocationOption(locations)
  const dataPoints = [
    0, 500, 999, 1000, 1500, 2000, 2499, 2500, 3000, 4000, 4999,
    5000, 6000, 8000, 9999, 10000, 15000, 20000, 24999, 25000, 35000, 50000
  ]

  return dataPoints.map(participants => {
    const optedIn = Math.round(participants * OPT_IN_RATE)
    const tier = getCommissionTier(participants)
    const effectiveRate = tier.perParticipant + locationOption.bonus
    const monthlyEarnings = Math.round(optedIn * effectiveRate)

    return {
      participants,
      earnings: monthlyEarnings,
      tier: `${tier.percentage}% tier ($${tier.perParticipant}/participant)`,
    }
  })
}

/**
 * Get month display name from year-month string
 */
export function getMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * Get current year-month in "YYYY-MM" format
 */
export function getCurrentYearMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Generate last N months in "YYYY-MM" format
 */
export function getLastNMonths(n: number): string[] {
  const months: string[] = []
  const now = new Date()

  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    months.push(`${year}-${month}`)
  }

  return months.reverse()
}
