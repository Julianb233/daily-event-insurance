/**
 * Lead Value Calculator
 * Estimates lead quality scores and potential lifetime value
 */

import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq, count } from "drizzle-orm"

// Business type multipliers based on typical opt-in rates
export const BUSINESS_MULTIPLIERS: Record<string, number> = {
  climbing: 1.4,    // 35% opt-in rate - highest risk perception
  adventure: 1.3,   // 30% opt-in rate
  gym: 1.0,         // 22% opt-in rate - baseline
  wellness: 0.9,    // 18% opt-in rate
  rental: 0.85,     // 15% opt-in rate
  other: 0.7        // 12% opt-in rate - conservative estimate
}

// Interest level scoring
const INTEREST_SCORES: Record<string, number> = {
  hot: 25,
  warm: 15,
  cold: 5
}

export interface LeadScore {
  score: number       // 0-100
  grade: string       // A, B, C, D, F
  breakdown: {
    businessFit: number
    engagement: number
    interest: number
    completeness: number
  }
}

export interface LeadValue {
  monthlyValue: number
  annualValue: number
  lifetimeValue: number
  confidence: "low" | "medium" | "high"
}

/**
 * Calculate a lead's quality score (0-100)
 */
export async function calculateLeadScore(leadId: string): Promise<LeadScore> {
  // Default score for dev mode
  if (!isDbConfigured()) {
    return {
      score: 50,
      grade: "C",
      breakdown: { businessFit: 15, engagement: 10, interest: 15, completeness: 10 }
    }
  }

  try {
    const [lead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1)

    if (!lead) {
      return { score: 0, grade: "F", breakdown: { businessFit: 0, engagement: 0, interest: 0, completeness: 0 } }
    }

    // Calculate breakdown scores (each max 25 points)
    let businessFit = 0
    let engagement = 0
    let interest = 0
    let completeness = 0

    // Business Fit (25 points max)
    const multiplier = BUSINESS_MULTIPLIERS[lead.businessType || "other"] || 0.7
    businessFit += multiplier * 15
    if (lead.estimatedParticipants && lead.estimatedParticipants > 50) businessFit += 5
    if (lead.estimatedParticipants && lead.estimatedParticipants > 200) businessFit += 5

    // Engagement (25 points max) - based on communications
    const [commCount] = await db!
      .select({ count: count() })
      .from(leadCommunications)
      .where(eq(leadCommunications.leadId, leadId))

    engagement = Math.min(25, (commCount?.count || 0) * 5)

    // Interest Level (25 points max)
    interest = INTEREST_SCORES[lead.interestLevel || "cold"] || 5
    if (lead.interestScore) interest = Math.min(25, lead.interestScore / 4)

    // Data Completeness (25 points max)
    if (lead.email) completeness += 8
    if (lead.phone) completeness += 8
    if (lead.businessName) completeness += 5
    if (lead.city && lead.state) completeness += 4

    const score = Math.round(businessFit + engagement + interest + completeness)
    const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : score >= 20 ? "D" : "F"

    return {
      score: Math.min(100, score),
      grade,
      breakdown: {
        businessFit: Math.round(businessFit),
        engagement: Math.round(engagement),
        interest: Math.round(interest),
        completeness: Math.round(completeness)
      }
    }
  } catch (error) {
    console.error("[LeadValue] Score calculation error:", error)
    return { score: 0, grade: "F", breakdown: { businessFit: 0, engagement: 0, interest: 0, completeness: 0 } }
  }
}

/**
 * Calculate estimated lead value (monthly and annual)
 */
export async function calculateLeadValue(leadId: string): Promise<LeadValue> {
  // Default for dev mode
  if (!isDbConfigured()) {
    return {
      monthlyValue: 500,
      annualValue: 6000,
      lifetimeValue: 18000,
      confidence: "medium"
    }
  }

  try {
    const [lead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1)

    if (!lead) {
      return { monthlyValue: 0, annualValue: 0, lifetimeValue: 0, confidence: "low" }
    }

    // Value calculation factors
    const participants = lead.estimatedParticipants || 50
    const businessMultiplier = BUSINESS_MULTIPLIERS[lead.businessType || "other"] || 0.7
    const baseOptInRate = 0.22  // 22% baseline
    const optInRate = baseOptInRate * businessMultiplier
    const avgPremium = 12       // $12 average premium
    const commissionRate = 0.20 // 20% commission
    const daysPerMonth = 30

    // Monthly value = participants × days × opt-in × premium × commission
    const monthlyValue = Math.round(
      participants * daysPerMonth * optInRate * avgPremium * commissionRate
    )

    const annualValue = monthlyValue * 12
    const lifetimeValue = annualValue * 3  // Assume 3-year average partnership

    // Confidence based on data completeness
    let confidence: "low" | "medium" | "high" = "low"
    if (lead.estimatedParticipants && lead.businessType) confidence = "medium"
    if (lead.estimatedParticipants && lead.businessType && lead.phone && lead.email) confidence = "high"

    return { monthlyValue, annualValue, lifetimeValue, confidence }
  } catch (error) {
    console.error("[LeadValue] Value calculation error:", error)
    return { monthlyValue: 0, annualValue: 0, lifetimeValue: 0, confidence: "low" }
  }
}

/**
 * Batch calculate scores for multiple leads
 */
export async function batchCalculateLeadScores(
  leadIds: string[]
): Promise<Map<string, LeadScore>> {
  const results = new Map<string, LeadScore>()

  for (const leadId of leadIds) {
    results.set(leadId, await calculateLeadScore(leadId))
  }

  return results
}

export const LeadValueCalculator = {
  calculateLeadScore,
  calculateLeadValue,
  batchCalculateLeadScores,
  BUSINESS_MULTIPLIERS
}
