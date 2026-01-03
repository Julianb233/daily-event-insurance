/**
 * Lead Scoring Module
 * Calculates lead quality score based on volume, engagement, and fit
 */

export interface LeadScoringInput {
  vertical: string
  estimatedRevenue: number
  email?: string
  phone?: string
  monthlyGuests?: string
  monthlyClients?: string
  dailyVisitors?: string
  expectedParticipants?: string
  eventsPerYear?: string
  currentCoverage?: string
  message?: string
}

export interface LeadScore {
  score: number // 0-100
  tier: 'cold' | 'warm' | 'hot' | 'priority'
  factors: {
    revenue: number
    completeness: number
    engagement: number
    fit: number
  }
}

/**
 * Calculate comprehensive lead score
 * Scoring breakdown:
 * - Revenue potential: 40 points (based on estimated annual commission)
 * - Data completeness: 30 points (how much info they provided)
 * - Engagement signals: 20 points (phone, message, current coverage)
 * - Vertical fit: 10 points (how well we serve this vertical)
 */
export function calculateLeadScore(input: LeadScoringInput): LeadScore {
  const factors = {
    revenue: calculateRevenueScore(input.estimatedRevenue),
    completeness: calculateCompletenessScore(input),
    engagement: calculateEngagementScore(input),
    fit: calculateVerticalFitScore(input.vertical)
  }

  const totalScore = Math.min(100, Math.round(
    factors.revenue +
    factors.completeness +
    factors.engagement +
    factors.fit
  ))

  return {
    score: totalScore,
    tier: getScoreTier(totalScore),
    factors
  }
}

/**
 * Revenue Score (0-40 points)
 * Based on estimated annual commission
 */
function calculateRevenueScore(estimatedRevenue: number): number {
  if (estimatedRevenue >= 100000) return 40 // $100k+ annual
  if (estimatedRevenue >= 50000) return 35  // $50k-100k annual
  if (estimatedRevenue >= 25000) return 30  // $25k-50k annual
  if (estimatedRevenue >= 10000) return 25  // $10k-25k annual
  if (estimatedRevenue >= 5000) return 20   // $5k-10k annual
  if (estimatedRevenue >= 1000) return 15   // $1k-5k annual
  return 10 // < $1k annual (still worth following up)
}

/**
 * Completeness Score (0-30 points)
 * Based on how much information the lead provided
 */
function calculateCompletenessScore(input: LeadScoringInput): number {
  let score = 0
  const fields = [
    input.email,
    input.phone,
    input.monthlyGuests,
    input.monthlyClients,
    input.dailyVisitors,
    input.expectedParticipants,
    input.eventsPerYear,
    input.currentCoverage,
    input.message
  ]

  // Email is required, so start at 10
  score = 10

  // Add points for each additional field provided (2.5 points per field)
  const additionalFieldsProvided = fields.filter(f => f && f.trim()).length - 1
  score += Math.min(20, additionalFieldsProvided * 2.5)

  return Math.round(score)
}

/**
 * Engagement Score (0-20 points)
 * High intent signals
 */
function calculateEngagementScore(input: LeadScoringInput): number {
  let score = 0

  // Phone number provided (willing to talk) = 8 points
  if (input.phone && input.phone.trim()) {
    score += 8
  }

  // Custom message (took time to explain needs) = 7 points
  if (input.message && input.message.trim().length > 20) {
    score += 7
  }

  // Already has coverage (knows they need insurance) = 5 points
  if (input.currentCoverage && input.currentCoverage.toLowerCase() !== 'none') {
    score += 5
  }

  return score
}

/**
 * Vertical Fit Score (0-10 points)
 * How well do we serve this vertical
 */
function calculateVerticalFitScore(vertical: string): number {
  // Prioritize verticals with proven sequences and high conversion
  const verticalScores: Record<string, number> = {
    'gym': 10,           // Best fit - established sequence
    'wellness': 10,      // Best fit - established sequence
    'ski-resort': 9,     // High value but seasonal
    'fitness': 9,        // Good fit - event-based
    'race': 7,           // Event-based, good volume
    'other': 5           // Unknown vertical
  }

  return verticalScores[vertical] || 5
}

/**
 * Convert numeric score to tier
 */
function getScoreTier(score: number): 'cold' | 'warm' | 'hot' | 'priority' {
  if (score >= 80) return 'priority' // Immediate attention
  if (score >= 60) return 'hot'      // High priority
  if (score >= 40) return 'warm'     // Medium priority
  return 'cold'                       // Low priority (still follow up)
}

/**
 * Get recommended next actions based on score
 */
export function getRecommendedActions(leadScore: LeadScore): string[] {
  const actions: string[] = []

  switch (leadScore.tier) {
    case 'priority':
      actions.push('Call within 1 hour')
      actions.push('Send personalized video')
      actions.push('Prepare custom proposal')
      break
    case 'hot':
      actions.push('Call within 4 hours')
      actions.push('Send detailed case study')
      break
    case 'warm':
      actions.push('Call within 24 hours')
      actions.push('Send standard follow-up')
      break
    case 'cold':
      actions.push('Email follow-up in 48 hours')
      actions.push('Add to nurture sequence')
      break
  }

  return actions
}
