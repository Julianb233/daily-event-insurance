import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  commissionTiers,
  locationOptions,
  OPT_IN_RATE,
  JULIAN_REVENUE_SHARE,
  getCommissionTier,
  getLocationOption,
  calculateEarnings,
  calculateMonthlyCommission,
  getNextTier,
  formatCurrency,
  generateEarningsChartData,
  getMonthName,
  getCurrentYearMonth,
  getLastNMonths,
} from '@/lib/commission-tiers'

describe('Commission Tiers Module', () => {
  describe('Constants', () => {
    it('should have correct opt-in rate', () => {
      expect(OPT_IN_RATE).toBe(0.65)
    })

    it('should have correct Julian revenue share', () => {
      expect(JULIAN_REVENUE_SHARE).toBe(0.35)
    })

    it('should have 6 commission tiers', () => {
      expect(commissionTiers).toHaveLength(6)
    })

    it('should have 5 location options', () => {
      expect(locationOptions).toHaveLength(5)
    })

    it('should have correct tier structure', () => {
      commissionTiers.forEach((tier) => {
        expect(tier).toHaveProperty('minVolume')
        expect(tier).toHaveProperty('maxVolume')
        expect(tier).toHaveProperty('percentage')
        expect(tier).toHaveProperty('perParticipant')
      })
    })

    it('should have tiers with non-overlapping ranges', () => {
      for (let i = 0; i < commissionTiers.length - 1; i++) {
        const current = commissionTiers[i]
        const next = commissionTiers[i + 1]
        expect(current.maxVolume).toBeLessThan(next.minVolume)
      }
    })
  })

  describe('getCommissionTier', () => {
    it('should return first tier for 0 volume', () => {
      const tier = getCommissionTier(0)
      expect(tier.minVolume).toBe(0)
      expect(tier.maxVolume).toBe(999)
    })

    it('should return correct tier for mid-range volumes', () => {
      const tier1000 = getCommissionTier(1000)
      expect(tier1000.minVolume).toBe(1000)
      expect(tier1000.maxVolume).toBe(2499)

      const tier5000 = getCommissionTier(5000)
      expect(tier5000.minVolume).toBe(5000)
      expect(tier5000.maxVolume).toBe(9999)

      const tier10000 = getCommissionTier(10000)
      expect(tier10000.minVolume).toBe(10000)
      expect(tier10000.maxVolume).toBe(24999)
    })

    it('should return highest tier for very large volumes', () => {
      const tier = getCommissionTier(100000)
      expect(tier.minVolume).toBe(25000)
      expect(tier.maxVolume).toBe(Infinity)
    })

    it('should return first tier as fallback', () => {
      const tier = getCommissionTier(-100)
      expect(tier).toEqual(commissionTiers[0])
    })
  })

  describe('getLocationOption', () => {
    it('should return single location option', () => {
      const option = getLocationOption(1)
      expect(option.label).toBe('1 Location')
      expect(option.bonus).toBe(0)
    })

    it('should return multi-location options with bonus', () => {
      const option3 = getLocationOption(3)
      expect(option3.label).toBe('2-5 Locations')
      expect(option3.bonus).toBe(0.5)

      const option8 = getLocationOption(8)
      expect(option8.label).toBe('6-10 Locations')
      expect(option8.bonus).toBe(1)

      const option18 = getLocationOption(18)
      expect(option18.label).toBe('11-25 Locations')
      expect(option18.bonus).toBe(1.5)

      const option30 = getLocationOption(30)
      expect(option30.label).toBe('25+ Locations')
      expect(option30.bonus).toBe(2)
    })

    it('should return first option as fallback for invalid values', () => {
      const option = getLocationOption(999)
      expect(option).toEqual(locationOptions[0])
    })
  })

  describe('calculateEarnings', () => {
    it('should calculate earnings for single location', () => {
      const result = calculateEarnings(1000, 1)

      expect(result.totalParticipants).toBe(1000)
      expect(result.optedInParticipants).toBe(Math.round(1000 * OPT_IN_RATE))
      expect(result.commissionTier).toBeDefined()
      expect(result.effectivePerParticipant).toBe(14) // No bonus
      expect(result.locationBonus).toBe(0)
      expect(result.monthlyEarnings).toBe(result.optedInParticipants * 14)
      expect(result.annualEarnings).toBe(result.monthlyEarnings * 12)
    })

    it('should calculate earnings with location bonus', () => {
      const result = calculateEarnings(1000, 8)

      expect(result.totalParticipants).toBe(1000 * 8)
      expect(result.locationBonus).toBe(1)
      expect(result.effectivePerParticipant).toBe(15) // 14 + 1 bonus
    })

    it('should handle default location value', () => {
      const result = calculateEarnings(1000)
      expect(result.totalParticipants).toBe(1000)
    })

    it('should correctly calculate opted-in participants', () => {
      const result = calculateEarnings(2000, 1)
      expect(result.optedInParticipants).toBe(Math.round(2000 * 0.65))
    })

    it('should include tier percentage in result', () => {
      const result = calculateEarnings(5000, 1)
      expect(result.tierPercentage).toBe(35)
    })
  })

  describe('calculateMonthlyCommission', () => {
    it('should calculate commission with default opt-in rate', () => {
      const commission = calculateMonthlyCommission(1000)
      const expectedOptedIn = Math.round(1000 * OPT_IN_RATE)
      const tier = getCommissionTier(1000)
      expect(commission).toBe(expectedOptedIn * tier.perParticipant)
    })

    it('should calculate commission with custom opt-in rate', () => {
      const commission = calculateMonthlyCommission(1000, 0.5)
      const expectedOptedIn = Math.round(1000 * 0.5)
      const tier = getCommissionTier(1000)
      expect(commission).toBe(expectedOptedIn * tier.perParticipant)
    })

    it('should add location bonus to commission', () => {
      const withBonus = calculateMonthlyCommission(1000, OPT_IN_RATE, 2)
      const withoutBonus = calculateMonthlyCommission(1000, OPT_IN_RATE, 0)
      const expectedOptedIn = Math.round(1000 * OPT_IN_RATE)
      expect(withBonus - withoutBonus).toBe(expectedOptedIn * 2)
    })
  })

  describe('getNextTier', () => {
    it('should return next tier info for low volume', () => {
      const result = getNextTier(500)

      expect(result.currentTier.minVolume).toBe(0)
      expect(result.nextTier).not.toBeNull()
      expect(result.nextTier?.minVolume).toBe(1000)
      expect(result.participantsToNext).toBe(1000 - 500)
    })

    it('should return null next tier for highest tier', () => {
      const result = getNextTier(30000)

      expect(result.currentTier.minVolume).toBe(25000)
      expect(result.nextTier).toBeNull()
      expect(result.participantsToNext).toBe(0)
      expect(result.percentageIncrease).toBe(0)
    })

    it('should calculate correct participants to next tier', () => {
      const result = getNextTier(1500)
      expect(result.participantsToNext).toBe(2500 - 1500)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(12345)).toBe('$12,345')
      expect(formatCurrency(1000000)).toBe('$1,000,000')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0')
    })

    it('should round decimal values', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(99.49)).toBe('$99')
    })
  })

  describe('generateEarningsChartData', () => {
    it('should generate chart data points', () => {
      const data = generateEarningsChartData()

      expect(data.length).toBeGreaterThan(0)
      data.forEach((point) => {
        expect(point).toHaveProperty('participants')
        expect(point).toHaveProperty('earnings')
        expect(point).toHaveProperty('tier')
      })
    })

    it('should include location bonus in calculations', () => {
      const dataWithBonus = generateEarningsChartData(8)
      const dataWithoutBonus = generateEarningsChartData(1)

      // Find matching participants to compare
      const pointWithBonus = dataWithBonus.find((p) => p.participants === 5000)
      const pointWithoutBonus = dataWithoutBonus.find((p) => p.participants === 5000)

      expect(pointWithBonus!.earnings).toBeGreaterThan(pointWithoutBonus!.earnings)
    })

    it('should have increasing earnings with participants', () => {
      const data = generateEarningsChartData()

      for (let i = 1; i < data.length; i++) {
        if (data[i].participants > data[i - 1].participants) {
          expect(data[i].earnings).toBeGreaterThanOrEqual(data[i - 1].earnings)
        }
      }
    })
  })

  describe('Date Utilities', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-15'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('getMonthName', () => {
      it('should format year-month string correctly', () => {
        expect(getMonthName('2024-01')).toBe('January 2024')
        expect(getMonthName('2024-06')).toBe('June 2024')
        expect(getMonthName('2024-12')).toBe('December 2024')
      })
    })

    describe('getCurrentYearMonth', () => {
      it('should return current year-month', () => {
        const result = getCurrentYearMonth()
        expect(result).toBe('2024-06')
      })

      it('should pad single digit months', () => {
        vi.setSystemTime(new Date('2024-01-15'))
        const result = getCurrentYearMonth()
        expect(result).toBe('2024-01')
      })
    })

    describe('getLastNMonths', () => {
      it('should return last N months in order', () => {
        const months = getLastNMonths(3)
        expect(months).toHaveLength(3)
        expect(months[0]).toBe('2024-04')
        expect(months[1]).toBe('2024-05')
        expect(months[2]).toBe('2024-06')
      })

      it('should handle year boundary', () => {
        vi.setSystemTime(new Date('2024-02-15'))
        const months = getLastNMonths(4)
        expect(months).toContain('2023-11')
        expect(months).toContain('2023-12')
        expect(months).toContain('2024-01')
        expect(months).toContain('2024-02')
      })

      it('should return empty array for 0 months', () => {
        const months = getLastNMonths(0)
        expect(months).toHaveLength(0)
      })

      it('should return 12 months for a year', () => {
        const months = getLastNMonths(12)
        expect(months).toHaveLength(12)
      })
    })
  })
})

describe('Commission Calculation Scenarios', () => {
  it('should calculate realistic small partner scenario', () => {
    // Small gym with 500 daily visitors
    const result = calculateEarnings(500, 1)

    // 500 visitors * 0.65 opt-in = 325 opted in
    // 325 * $14 = $4,550/month
    expect(result.monthlyEarnings).toBe(Math.round(500 * 0.65) * 14)
    expect(result.annualEarnings).toBe(result.monthlyEarnings * 12)
  })

  it('should calculate realistic medium partner scenario', () => {
    // Medium fitness chain with 3 locations, 1000 visitors each
    const result = calculateEarnings(1000, 3)

    // 3000 total * 0.65 = 1950 opted in
    // 1950 * ($14 + $0.50 bonus) = $28,275/month
    const expectedOptedIn = Math.round(3000 * 0.65)
    const expectedMonthly = expectedOptedIn * 14.5
    expect(result.monthlyEarnings).toBe(expectedMonthly)
  })

  it('should calculate realistic large partner scenario', () => {
    // Large ski resort chain with 8 locations, 2000 visitors each
    const result = calculateEarnings(2000, 8)

    // 16000 total * 0.65 = 10,400 opted in
    // 10,400 * ($14 + $1 bonus) = $156,000/month
    const totalParticipants = 2000 * 8
    const expectedOptedIn = Math.round(totalParticipants * 0.65)
    const expectedMonthly = expectedOptedIn * 15
    expect(result.monthlyEarnings).toBe(expectedMonthly)
    expect(result.annualEarnings).toBe(expectedMonthly * 12)
  })
})
