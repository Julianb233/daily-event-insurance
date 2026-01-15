/**
 * Conversion Events Logger
 * Tracks lead conversion events through the sales funnel
 */

import { db, isDbConfigured, leadCommunications, leads } from "@/lib/db"
import { eq, gte, lte, and, sql } from "drizzle-orm"

export type ConversionEvent =
  | "page_view"
  | "quote_started"
  | "quote_completed"
  | "call_completed"
  | "demo_scheduled"
  | "proposal_sent"
  | "proposal_viewed"
  | "contract_signed"
  | "first_policy_sold"

// Attributed value for each conversion event
export const EVENT_VALUES: Record<ConversionEvent, number> = {
  page_view: 0,
  quote_started: 10,
  quote_completed: 15,
  call_completed: 20,
  demo_scheduled: 25,
  proposal_sent: 30,
  proposal_viewed: 35,
  contract_signed: 50,
  first_policy_sold: 100
}

export interface ConversionEventLog {
  leadId: string
  event: ConversionEvent
  value: number
  metadata?: Record<string, unknown>
  createdAt: Date
}

/**
 * Log a conversion event for a lead
 */
export async function logConversionEvent(
  leadId: string,
  event: ConversionEvent,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; value: number }> {
  const value = EVENT_VALUES[event]

  console.log(`[Conversion] ${leadId}: ${event} (value: $${value})`, metadata)

  if (!isDbConfigured()) {
    return { success: true, value }
  }

  try {
    await db!.insert(leadCommunications).values({
      leadId,
      channel: "system",
      direction: "outbound",
      disposition: event,
      callSummary: metadata ? JSON.stringify(metadata) : null
    })

    return { success: true, value }
  } catch (error) {
    console.error("[ConversionLogger] Error:", error)
    return { success: false, value: 0 }
  }
}

/**
 * Get all conversion events for a lead
 */
export async function getLeadConversionEvents(
  leadId: string
): Promise<ConversionEventLog[]> {
  if (!isDbConfigured()) {
    return []
  }

  try {
    const events = await db!
      .select()
      .from(leadCommunications)
      .where(and(
        eq(leadCommunications.leadId, leadId),
        eq(leadCommunications.channel, "system")
      ))

    return events.map(e => ({
      leadId: e.leadId,
      event: e.disposition as ConversionEvent,
      value: EVENT_VALUES[e.disposition as ConversionEvent] || 0,
      metadata: e.callSummary ? JSON.parse(e.callSummary) : undefined,
      createdAt: e.createdAt
    }))
  } catch (error) {
    console.error("[ConversionLogger] Error:", error)
    return []
  }
}

/**
 * Calculate funnel metrics for a date range
 */
export async function calculateFunnelMetrics(
  startDate: Date,
  endDate: Date
): Promise<{
  stages: Record<string, number>
  totalValue: number
}> {
  if (!isDbConfigured()) {
    return {
      stages: {
        page_view: 1000,
        quote_started: 500,
        quote_completed: 300,
        demo_scheduled: 100,
        proposal_sent: 75,
        contract_signed: 25
      },
      totalValue: 15000
    }
  }

  try {
    const events = await db!
      .select({
        event: leadCommunications.disposition,
        count: sql<number>`count(*)::int`
      })
      .from(leadCommunications)
      .where(and(
        eq(leadCommunications.channel, "system"),
        gte(leadCommunications.createdAt, startDate),
        lte(leadCommunications.createdAt, endDate)
      ))
      .groupBy(leadCommunications.disposition)

    const stages: Record<string, number> = {}
    let totalValue = 0

    events.forEach(e => {
      stages[e.event || "unknown"] = e.count
      totalValue += (EVENT_VALUES[e.event as ConversionEvent] || 0) * e.count
    })

    return { stages, totalValue }
  } catch (error) {
    console.error("[ConversionLogger] Error:", error)
    return { stages: {}, totalValue: 0 }
  }
}

/**
 * Log a call completion event with details
 */
export async function logCallConversion(
  leadId: string,
  callDuration: number,
  outcome: string,
  agentId?: string
): Promise<{ success: boolean }> {
  return logConversionEvent(leadId, "call_completed", {
    callDuration,
    outcome,
    agentId
  }).then(r => ({ success: r.success }))
}

/**
 * Log a quote conversion event
 */
export async function logQuoteConversion(
  leadId: string,
  stage: "started" | "completed",
  quoteAmount?: number
): Promise<{ success: boolean }> {
  const event = stage === "started" ? "quote_started" : "quote_completed"
  return logConversionEvent(leadId, event, { quoteAmount })
    .then(r => ({ success: r.success }))
}

export const ConversionLogger = {
  logConversionEvent,
  getLeadConversionEvents,
  calculateFunnelMetrics,
  logCallConversion,
  logQuoteConversion,
  EVENT_VALUES
}
