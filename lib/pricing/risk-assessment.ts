/**
 * Risk Assessment Module
 *
 * Evaluates risk levels for insurance quotes and provides
 * underwriting recommendations based on event characteristics
 */

export type RiskLevel = "low" | "medium" | "high" | "very-high"
export type UnderwritingDecision = "auto-approve" | "review-required" | "decline"

export interface RiskAssessment {
  overallRisk: RiskLevel
  riskScore: number // 0-100
  decision: UnderwritingDecision
  factors: RiskFactor[]
  recommendations: string[]
  requiresReview: boolean
  declineReasons?: string[]
}

export interface RiskFactor {
  category: string
  impact: "positive" | "negative" | "neutral"
  severity: number // 0-10
  description: string
}

export interface AssessmentInput {
  eventType: string
  participants: number
  eventDate: Date
  duration?: number
  location?: string
  coverageType: string
  partnerHistory?: {
    totalQuotes: number
    totalPolicies: number
    claimsCount: number
    claimsRate: number
  }
  eventDetails?: {
    hasWaivers?: boolean
    hasInsurance?: boolean
    hasMedicalStaff?: boolean
    hasEmergencyPlan?: boolean
    isFirstTime?: boolean
  }
}

// ============= Risk Thresholds =============

const RISK_THRESHOLDS = {
  low: 30,
  medium: 50,
  high: 70,
  veryHigh: 90,
}

const AUTO_APPROVE_THRESHOLD = 60
const REVIEW_REQUIRED_THRESHOLD = 80
const DECLINE_THRESHOLD = 90

// ============= Event Type Categories =============

const HIGH_RISK_ACTIVITIES = [
  "skydiving",
  "paragliding",
  "bungee jumping",
  "white water rafting",
  "base jumping",
  "hang gliding",
  "cliff diving",
]

const MEDIUM_RISK_ACTIVITIES = [
  "rock climbing",
  "mountain biking",
  "skiing",
  "snowboarding",
  "zip line",
  "obstacle course",
  "trail running",
  "kayaking",
]

const LOW_RISK_ACTIVITIES = [
  "yoga",
  "pilates",
  "gym session",
  "walking",
  "swimming",
  "cycling",
  "spin class",
]

// ============= Assessment Functions =============

/**
 * Perform comprehensive risk assessment
 */
export function assessRisk(input: AssessmentInput): RiskAssessment {
  const factors: RiskFactor[] = []
  let riskScore = 50 // Start at medium risk

  // 1. Activity Type Risk
  const activityRisk = assessActivityType(input.eventType)
  factors.push(activityRisk.factor)
  riskScore += activityRisk.scoreImpact

  // 2. Participant Count Risk
  const participantRisk = assessParticipantCount(input.participants)
  factors.push(participantRisk.factor)
  riskScore += participantRisk.scoreImpact

  // 3. Event Date Risk
  const dateRisk = assessEventDate(input.eventDate)
  factors.push(dateRisk.factor)
  riskScore += dateRisk.scoreImpact

  // 4. Duration Risk
  if (input.duration) {
    const durationRisk = assessDuration(input.duration)
    factors.push(durationRisk.factor)
    riskScore += durationRisk.scoreImpact
  }

  // 5. Location Risk
  if (input.location) {
    const locationRisk = assessLocation(input.location)
    factors.push(locationRisk.factor)
    riskScore += locationRisk.scoreImpact
  }

  // 6. Partner History Risk
  if (input.partnerHistory) {
    const partnerRisk = assessPartnerHistory(input.partnerHistory)
    factors.push(partnerRisk.factor)
    riskScore += partnerRisk.scoreImpact
  }

  // 7. Event Details Risk Mitigation
  if (input.eventDetails) {
    const mitigationRisk = assessRiskMitigation(input.eventDetails)
    factors.push(...mitigationRisk.factors)
    riskScore += mitigationRisk.scoreImpact
  }

  // 8. Coverage Type Risk
  const coverageRisk = assessCoverageType(input.coverageType)
  factors.push(coverageRisk.factor)
  riskScore += coverageRisk.scoreImpact

  // Clamp score to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore))

  // Determine risk level
  const overallRisk = getRiskLevel(riskScore)

  // Make underwriting decision
  const decision = getUnderwritingDecision(riskScore, factors)

  // Generate recommendations
  const recommendations = generateRecommendations(riskScore, factors, input)

  // Check for decline reasons
  const declineReasons = getDeclineReasons(riskScore, factors)

  return {
    overallRisk,
    riskScore,
    decision,
    factors,
    recommendations,
    requiresReview: decision === "review-required",
    declineReasons: declineReasons.length > 0 ? declineReasons : undefined,
  }
}

/**
 * Assess activity type risk
 */
function assessActivityType(eventType: string): {
  factor: RiskFactor
  scoreImpact: number
} {
  const normalized = eventType.toLowerCase()

  // Check high risk
  for (const activity of HIGH_RISK_ACTIVITIES) {
    if (normalized.includes(activity)) {
      return {
        factor: {
          category: "Activity Type",
          impact: "negative",
          severity: 8,
          description: `${eventType} is classified as a high-risk activity`,
        },
        scoreImpact: 25,
      }
    }
  }

  // Check medium risk
  for (const activity of MEDIUM_RISK_ACTIVITIES) {
    if (normalized.includes(activity)) {
      return {
        factor: {
          category: "Activity Type",
          impact: "neutral",
          severity: 5,
          description: `${eventType} has moderate risk characteristics`,
        },
        scoreImpact: 10,
      }
    }
  }

  // Check low risk
  for (const activity of LOW_RISK_ACTIVITIES) {
    if (normalized.includes(activity)) {
      return {
        factor: {
          category: "Activity Type",
          impact: "positive",
          severity: 3,
          description: `${eventType} is a low-risk activity`,
        },
        scoreImpact: -10,
      }
    }
  }

  // Unknown - assume medium risk
  return {
    factor: {
      category: "Activity Type",
      impact: "neutral",
      severity: 5,
      description: `${eventType} has unclassified risk level`,
    },
    scoreImpact: 5,
  }
}

/**
 * Assess participant count risk
 */
function assessParticipantCount(participants: number): {
  factor: RiskFactor
  scoreImpact: number
} {
  if (participants > 1000) {
    return {
      factor: {
        category: "Participant Count",
        impact: "negative",
        severity: 6,
        description: `Large event with ${participants} participants increases complexity`,
      },
      scoreImpact: 10,
    }
  }

  if (participants > 500) {
    return {
      factor: {
        category: "Participant Count",
        impact: "neutral",
        severity: 4,
        description: `${participants} participants - medium-scale event`,
      },
      scoreImpact: 5,
    }
  }

  if (participants < 10) {
    return {
      factor: {
        category: "Participant Count",
        impact: "positive",
        severity: 2,
        description: `Small group (${participants}) allows better supervision`,
      },
      scoreImpact: -5,
    }
  }

  return {
    factor: {
      category: "Participant Count",
      impact: "neutral",
      severity: 3,
      description: `${participants} participants - standard event size`,
    },
    scoreImpact: 0,
  }
}

/**
 * Assess event date risk
 */
function assessEventDate(eventDate: Date): {
  factor: RiskFactor
  scoreImpact: number
} {
  const now = new Date()
  const daysUntilEvent = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilEvent < 0) {
    return {
      factor: {
        category: "Event Date",
        impact: "negative",
        severity: 10,
        description: "Event date is in the past",
      },
      scoreImpact: 50, // Major risk - should decline
    }
  }

  if (daysUntilEvent < 1) {
    return {
      factor: {
        category: "Event Date",
        impact: "negative",
        severity: 7,
        description: "Event is within 24 hours - limited underwriting time",
      },
      scoreImpact: 15,
    }
  }

  if (daysUntilEvent < 7) {
    return {
      factor: {
        category: "Event Date",
        impact: "neutral",
        severity: 4,
        description: "Event is within one week",
      },
      scoreImpact: 5,
    }
  }

  return {
    factor: {
      category: "Event Date",
      impact: "positive",
      severity: 2,
      description: `Event is ${daysUntilEvent} days away - adequate preparation time`,
    },
    scoreImpact: -5,
  }
}

/**
 * Assess duration risk
 */
function assessDuration(duration: number): {
  factor: RiskFactor
  scoreImpact: number
} {
  if (duration > 12) {
    return {
      factor: {
        category: "Duration",
        impact: "negative",
        severity: 6,
        description: `Extended duration (${duration} hours) increases exposure`,
      },
      scoreImpact: 10,
    }
  }

  if (duration > 6) {
    return {
      factor: {
        category: "Duration",
        impact: "neutral",
        severity: 4,
        description: `Full-day event (${duration} hours)`,
      },
      scoreImpact: 5,
    }
  }

  return {
    factor: {
      category: "Duration",
      impact: "positive",
      severity: 2,
      description: `Short duration (${duration} hours) limits exposure`,
    },
    scoreImpact: -3,
  }
}

/**
 * Assess location risk
 */
function assessLocation(location: string): {
  factor: RiskFactor
  scoreImpact: number
} {
  const normalized = location.toLowerCase()

  if (normalized.includes("indoor") || normalized.includes("facility") || normalized.includes("gym")) {
    return {
      factor: {
        category: "Location",
        impact: "positive",
        severity: 3,
        description: "Controlled indoor environment",
      },
      scoreImpact: -8,
    }
  }

  if (normalized.includes("wilderness") || normalized.includes("remote") || normalized.includes("backcountry")) {
    return {
      factor: {
        category: "Location",
        impact: "negative",
        severity: 7,
        description: "Remote location with limited emergency access",
      },
      scoreImpact: 15,
    }
  }

  return {
    factor: {
      category: "Location",
      impact: "neutral",
      severity: 4,
      description: "Outdoor location",
    },
    scoreImpact: 3,
  }
}

/**
 * Assess partner history
 */
function assessPartnerHistory(history: NonNullable<AssessmentInput["partnerHistory"]>): {
  factor: RiskFactor
  scoreImpact: number
} {
  const { totalPolicies, claimsCount, claimsRate } = history

  if (totalPolicies === 0) {
    return {
      factor: {
        category: "Partner History",
        impact: "neutral",
        severity: 5,
        description: "New partner with no claims history",
      },
      scoreImpact: 5,
    }
  }

  if (claimsRate > 0.05) {
    return {
      factor: {
        category: "Partner History",
        impact: "negative",
        severity: 8,
        description: `High claims rate (${(claimsRate * 100).toFixed(1)}%)`,
      },
      scoreImpact: 20,
    }
  }

  if (claimsRate > 0.02) {
    return {
      factor: {
        category: "Partner History",
        impact: "neutral",
        severity: 5,
        description: `Moderate claims rate (${(claimsRate * 100).toFixed(1)}%)`,
      },
      scoreImpact: 5,
    }
  }

  return {
    factor: {
      category: "Partner History",
      impact: "positive",
      severity: 3,
      description: `Excellent claims record (${(claimsRate * 100).toFixed(1)}%)`,
    },
    scoreImpact: -10,
  }
}

/**
 * Assess risk mitigation measures
 */
function assessRiskMitigation(details: NonNullable<AssessmentInput["eventDetails"]>): {
  factors: RiskFactor[]
  scoreImpact: number
} {
  const factors: RiskFactor[] = []
  let scoreImpact = 0

  if (details.hasWaivers) {
    factors.push({
      category: "Risk Mitigation",
      impact: "positive",
      severity: 3,
      description: "Liability waivers in place",
    })
    scoreImpact -= 5
  }

  if (details.hasMedicalStaff) {
    factors.push({
      category: "Risk Mitigation",
      impact: "positive",
      severity: 4,
      description: "Medical staff on-site",
    })
    scoreImpact -= 8
  }

  if (details.hasEmergencyPlan) {
    factors.push({
      category: "Risk Mitigation",
      impact: "positive",
      severity: 3,
      description: "Emergency response plan documented",
    })
    scoreImpact -= 5
  }

  if (details.isFirstTime) {
    factors.push({
      category: "Risk Factor",
      impact: "negative",
      severity: 5,
      description: "First-time event organizer",
    })
    scoreImpact += 10
  }

  return { factors, scoreImpact }
}

/**
 * Assess coverage type
 */
function assessCoverageType(coverageType: string): {
  factor: RiskFactor
  scoreImpact: number
} {
  if (coverageType === "cancellation") {
    return {
      factor: {
        category: "Coverage Type",
        impact: "neutral",
        severity: 6,
        description: "Cancellation coverage has complex claim scenarios",
      },
      scoreImpact: 8,
    }
  }

  if (coverageType === "equipment") {
    return {
      factor: {
        category: "Coverage Type",
        impact: "neutral",
        severity: 4,
        description: "Equipment coverage - moderate complexity",
      },
      scoreImpact: 3,
    }
  }

  return {
    factor: {
      category: "Coverage Type",
      impact: "neutral",
      severity: 3,
      description: "General liability coverage",
    },
    scoreImpact: 0,
  }
}

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.veryHigh) return "very-high"
  if (score >= RISK_THRESHOLDS.high) return "high"
  if (score >= RISK_THRESHOLDS.medium) return "medium"
  return "low"
}

/**
 * Make underwriting decision
 */
function getUnderwritingDecision(score: number, factors: RiskFactor[]): UnderwritingDecision {
  // Check for automatic decline conditions
  const hasCriticalFactors = factors.some(f => f.severity >= 9 && f.impact === "negative")

  if (score >= DECLINE_THRESHOLD || hasCriticalFactors) {
    return "decline"
  }

  if (score >= REVIEW_REQUIRED_THRESHOLD) {
    return "review-required"
  }

  if (score <= AUTO_APPROVE_THRESHOLD) {
    return "auto-approve"
  }

  return "review-required"
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  score: number,
  factors: RiskFactor[],
  input: AssessmentInput
): string[] {
  const recommendations: string[] = []

  // High-risk activity recommendations
  const highRiskActivity = factors.find(f =>
    f.category === "Activity Type" && f.severity >= 7
  )
  if (highRiskActivity) {
    recommendations.push("Require additional safety documentation and emergency protocols")
    recommendations.push("Verify organizer has appropriate permits and certifications")
  }

  // Large event recommendations
  if (input.participants > 500) {
    recommendations.push("Verify adequate medical staff and emergency response capacity")
    recommendations.push("Require detailed safety plan and crowd management procedures")
  }

  // Short notice recommendations
  const eventDate = input.eventDate
  const daysUntil = Math.floor((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (daysUntil < 7) {
    recommendations.push("Expedited underwriting review required")
    recommendations.push("Verify all safety measures are already in place")
  }

  // Remote location recommendations
  if (input.location?.toLowerCase().includes("remote")) {
    recommendations.push("Confirm emergency evacuation plan and communication systems")
    recommendations.push("Verify satellite phone or emergency beacon availability")
  }

  // First-time organizer recommendations
  if (input.eventDetails?.isFirstTime) {
    recommendations.push("Require proof of event insurance and liability coverage")
    recommendations.push("Consider requiring co-organizer with experience")
  }

  return recommendations
}

/**
 * Get decline reasons
 */
function getDeclineReasons(score: number, factors: RiskFactor[]): string[] {
  const reasons: string[] = []

  // Check for critical factors
  factors.forEach(factor => {
    if (factor.severity >= 9 && factor.impact === "negative") {
      reasons.push(factor.description)
    }
  })

  // Overall score too high
  if (score >= DECLINE_THRESHOLD && reasons.length === 0) {
    reasons.push("Overall risk score exceeds acceptable threshold")
  }

  return reasons
}

/**
 * Quick risk check for API usage
 */
export function quickRiskCheck(
  eventType: string,
  participants: number,
  eventDate: Date
): { acceptable: boolean; reason?: string } {
  // Check for obvious declines
  if (eventDate < new Date()) {
    return { acceptable: false, reason: "Event date is in the past" }
  }

  const normalized = eventType.toLowerCase()
  for (const activity of HIGH_RISK_ACTIVITIES) {
    if (normalized.includes(activity) && participants > 100) {
      return { acceptable: false, reason: "High-risk activity with large participant count requires manual review" }
    }
  }

  if (participants > 5000) {
    return { acceptable: false, reason: "Events over 5,000 participants require manual underwriting" }
  }

  return { acceptable: true }
}
