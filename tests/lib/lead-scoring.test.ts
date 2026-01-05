import { describe, it, expect } from 'vitest'
import {
  calculateLeadScore,
  getRecommendedActions,
  type LeadScoringInput,
  type LeadScore,
} from '@/lib/lead-scoring'

describe('Lead Scoring Module', () => {
  describe('calculateLeadScore', () => {
    describe('Revenue Score (0-40 points)', () => {
      it('should give 40 points for $100k+ annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 100000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(40)
      })

      it('should give 35 points for $50k-100k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 50000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(35)
      })

      it('should give 30 points for $25k-50k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 25000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(30)
      })

      it('should give 25 points for $10k-25k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 10000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(25)
      })

      it('should give 20 points for $5k-10k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 5000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(20)
      })

      it('should give 15 points for $1k-5k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 1000,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(15)
      })

      it('should give 10 points for less than $1k annual revenue', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 500,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.revenue).toBe(10)
      })
    })

    describe('Completeness Score (0-30 points)', () => {
      it('should give base 10 points for email only', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 1000,
          email: 'test@example.com',
        }
        const result = calculateLeadScore(input)
        expect(result.factors.completeness).toBe(10)
      })

      it('should add points for additional fields provided', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 1000,
          email: 'test@example.com',
          phone: '+12025551234',
          monthlyGuests: '500',
          message: 'Interested in coverage',
        }
        const result = calculateLeadScore(input)
        expect(result.factors.completeness).toBeGreaterThan(10)
      })

      it('should cap completeness at 30 points', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 1000,
          email: 'test@example.com',
          phone: '+12025551234',
          monthlyGuests: '500',
          monthlyClients: '200',
          dailyVisitors: '50',
          expectedParticipants: '100',
          eventsPerYear: '12',
          currentCoverage: 'basic',
          message: 'Looking for comprehensive coverage',
        }
        const result = calculateLeadScore(input)
        expect(result.factors.completeness).toBeLessThanOrEqual(30)
      })

      it('should ignore empty strings', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 1000,
          email: 'test@example.com',
          phone: '',
          message: '   ', // whitespace only
        }
        const result = calculateLeadScore(input)
        expect(result.factors.completeness).toBe(10)
      })
    })

    describe('Engagement Score (0-20 points)', () => {
      it('should give 8 points for providing phone number', () => {
        const inputWithPhone: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          phone: '+12025551234',
        }
        const inputWithoutPhone: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
        }

        const withPhone = calculateLeadScore(inputWithPhone)
        const withoutPhone = calculateLeadScore(inputWithoutPhone)

        expect(withPhone.factors.engagement - withoutPhone.factors.engagement).toBe(8)
      })

      it('should give 7 points for substantial message (>20 chars)', () => {
        const inputWithMessage: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          message: 'I am interested in getting coverage for my gym members',
        }
        const inputWithoutMessage: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
        }

        const withMessage = calculateLeadScore(inputWithMessage)
        const withoutMessage = calculateLeadScore(inputWithoutMessage)

        expect(withMessage.factors.engagement - withoutMessage.factors.engagement).toBe(7)
      })

      it('should not give message points for short messages', () => {
        const input: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          message: 'Help',
        }
        const result = calculateLeadScore(input)
        expect(result.factors.engagement).toBe(0)
      })

      it('should give 5 points for existing coverage', () => {
        const inputWithCoverage: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          currentCoverage: 'basic plan',
        }
        const inputNoCoverage: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          currentCoverage: 'none',
        }

        const withCoverage = calculateLeadScore(inputWithCoverage)
        const noCoverage = calculateLeadScore(inputNoCoverage)

        expect(withCoverage.factors.engagement - noCoverage.factors.engagement).toBe(5)
      })

      it('should max out at 20 points for all engagement signals', () => {
        const input: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
          phone: '+12025551234',
          message: 'I am interested in comprehensive coverage for my business',
          currentCoverage: 'basic plan',
        }
        const result = calculateLeadScore(input)
        expect(result.factors.engagement).toBe(20)
      })
    })

    describe('Vertical Fit Score (0-10 points)', () => {
      it('should give 10 points for gym vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(10)
      })

      it('should give 10 points for wellness vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'wellness',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(10)
      })

      it('should give 9 points for ski-resort vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'ski-resort',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(9)
      })

      it('should give 9 points for fitness vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'fitness',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(9)
      })

      it('should give 7 points for race vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'race',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(7)
      })

      it('should give 5 points for other/unknown vertical', () => {
        const input: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(5)
      })

      it('should give 5 points for unknown verticals', () => {
        const input: LeadScoringInput = {
          vertical: 'unknown-category',
          estimatedRevenue: 0,
        }
        const result = calculateLeadScore(input)
        expect(result.factors.fit).toBe(5)
      })
    })

    describe('Tier Classification', () => {
      it('should classify as priority tier for score >= 80', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 100000,
          email: 'test@example.com',
          phone: '+12025551234',
          message: 'Looking for comprehensive coverage for our gym',
          currentCoverage: 'basic',
        }
        const result = calculateLeadScore(input)
        expect(result.tier).toBe('priority')
        expect(result.score).toBeGreaterThanOrEqual(80)
      })

      it('should classify as hot tier for score 60-79', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 25000,
          email: 'test@example.com',
          phone: '+12025551234',
        }
        const result = calculateLeadScore(input)
        expect(result.tier).toBe('hot')
        expect(result.score).toBeGreaterThanOrEqual(60)
        expect(result.score).toBeLessThan(80)
      })

      it('should classify as warm tier for score 40-59', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 5000,
          email: 'test@example.com',
        }
        const result = calculateLeadScore(input)
        expect(result.tier).toBe('warm')
        expect(result.score).toBeGreaterThanOrEqual(40)
        expect(result.score).toBeLessThan(60)
      })

      it('should classify as cold tier for score < 40', () => {
        const input: LeadScoringInput = {
          vertical: 'other',
          estimatedRevenue: 500,
        }
        const result = calculateLeadScore(input)
        expect(result.tier).toBe('cold')
        expect(result.score).toBeLessThan(40)
      })
    })

    describe('Total Score Calculation', () => {
      it('should not exceed 100 points', () => {
        const maxInput: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 150000,
          email: 'test@example.com',
          phone: '+12025551234',
          monthlyGuests: '1000',
          monthlyClients: '500',
          dailyVisitors: '200',
          expectedParticipants: '100',
          eventsPerYear: '12',
          currentCoverage: 'premium',
          message: 'We have a large fitness facility and need comprehensive coverage',
        }
        const result = calculateLeadScore(maxInput)
        expect(result.score).toBeLessThanOrEqual(100)
      })

      it('should correctly sum all factors', () => {
        const input: LeadScoringInput = {
          vertical: 'gym',
          estimatedRevenue: 50000,
          email: 'test@example.com',
        }
        const result = calculateLeadScore(input)
        const expectedSum = result.factors.revenue +
          result.factors.completeness +
          result.factors.engagement +
          result.factors.fit
        expect(result.score).toBe(Math.min(100, Math.round(expectedSum)))
      })
    })
  })

  describe('getRecommendedActions', () => {
    it('should return priority actions for priority tier', () => {
      const leadScore: LeadScore = {
        score: 85,
        tier: 'priority',
        factors: { revenue: 40, completeness: 25, engagement: 10, fit: 10 },
      }
      const actions = getRecommendedActions(leadScore)
      expect(actions).toContain('Call within 1 hour')
      expect(actions).toContain('Send personalized video')
      expect(actions).toContain('Prepare custom proposal')
    })

    it('should return hot actions for hot tier', () => {
      const leadScore: LeadScore = {
        score: 70,
        tier: 'hot',
        factors: { revenue: 30, completeness: 20, engagement: 10, fit: 10 },
      }
      const actions = getRecommendedActions(leadScore)
      expect(actions).toContain('Call within 4 hours')
      expect(actions).toContain('Send detailed case study')
    })

    it('should return warm actions for warm tier', () => {
      const leadScore: LeadScore = {
        score: 50,
        tier: 'warm',
        factors: { revenue: 20, completeness: 15, engagement: 5, fit: 10 },
      }
      const actions = getRecommendedActions(leadScore)
      expect(actions).toContain('Call within 24 hours')
      expect(actions).toContain('Send standard follow-up')
    })

    it('should return cold actions for cold tier', () => {
      const leadScore: LeadScore = {
        score: 25,
        tier: 'cold',
        factors: { revenue: 10, completeness: 10, engagement: 0, fit: 5 },
      }
      const actions = getRecommendedActions(leadScore)
      expect(actions).toContain('Email follow-up in 48 hours')
      expect(actions).toContain('Add to nurture sequence')
    })
  })
})
