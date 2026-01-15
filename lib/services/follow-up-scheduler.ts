/**
 * Follow-Up Scheduler Service
 *
 * Server-side service for scheduling follow-up actions based on call disposition outcomes.
 * Handles automatic scheduling of calls, SMS, and emails based on disposition results,
 * and manages nurture campaigns for leads at different interest levels.
 */

import {
  db,
  isDbConfigured,
  scheduledActions,
  leads,
  leadCommunications,
  agentScripts,
  type ScheduledAction,
  type NewScheduledAction,
  type Lead,
} from "@/lib/db"
import { eq, and, inArray, lte, gte, sql } from "drizzle-orm"

// ================= Types =================

export type Disposition =
  | "reached"
  | "voicemail"
  | "no_answer"
  | "busy"
  | "callback_requested"
  | "not_interested"
  | "dnc"

export type InterestLevel = "cold" | "warm" | "hot"

export type ActionType = "call" | "sms" | "email"

export type ActionReason =
  | "follow_up"
  | "reminder"
  | "callback_requested"
  | "nurture"
  | "onboarding"
  | "re_engagement"

export type ActionStatus = "pending" | "processing" | "completed" | "failed" | "cancelled"

export interface ScheduleFollowUpOptions {
  interestLevel?: InterestLevel
  scriptId?: string
  customMessage?: string
  maxAttempts?: number
  metadata?: Record<string, unknown>
}

export interface ScheduleCallbackOptions {
  scriptId?: string
  customMessage?: string
  maxAttempts?: number
}

export interface NurtureCampaignStep {
  actionType: ActionType
  delayHours: number
  reason: ActionReason
  customMessage?: string
}

export interface ScheduleResult {
  success: boolean
  scheduledActionId?: string
  scheduledFor?: Date
  error?: string
}

export interface BulkScheduleResult {
  success: boolean
  scheduledCount: number
  failedCount: number
  scheduledActionIds: string[]
  errors: string[]
}

// ================= Follow-Up Timing Rules =================

/**
 * Default follow-up sequences based on disposition
 * Each disposition maps to a sequence of follow-up actions
 */
const FOLLOW_UP_SEQUENCES: Record<Disposition, NurtureCampaignStep[]> = {
  voicemail: [
    { actionType: "call", delayHours: 4, reason: "follow_up" },
    { actionType: "sms", delayHours: 24, reason: "follow_up", customMessage: "Hi! I tried reaching you earlier about daily event insurance. When would be a good time to connect?" },
  ],
  no_answer: [
    { actionType: "call", delayHours: 2, reason: "follow_up" },
    { actionType: "call", delayHours: 24, reason: "follow_up" },
    { actionType: "call", delayHours: 48, reason: "follow_up" },
  ],
  busy: [
    { actionType: "call", delayHours: 1, reason: "follow_up" },
  ],
  callback_requested: [], // Handled separately with specific time
  reached: [
    { actionType: "email", delayHours: 24, reason: "onboarding", customMessage: "Thank you for speaking with us! Here are your next steps to get started with daily event insurance." },
  ],
  not_interested: [
    { actionType: "email", delayHours: 168, reason: "nurture", customMessage: "We wanted to follow up and share some success stories from businesses like yours using daily event insurance." }, // 7 days
  ],
  dnc: [], // No follow-up for do-not-contact
}

/**
 * Interest-level specific nurture campaigns
 * These are multi-step sequences designed to warm up leads
 */
const NURTURE_CAMPAIGNS: Record<InterestLevel, NurtureCampaignStep[]> = {
  cold: [
    { actionType: "email", delayHours: 0, reason: "nurture", customMessage: "Introducing daily event insurance - protect your events affordably." },
    { actionType: "email", delayHours: 72, reason: "nurture", customMessage: "Did you know? Daily event insurance can save you up to 60% compared to annual policies." },
    { actionType: "call", delayHours: 168, reason: "follow_up" },
    { actionType: "email", delayHours: 336, reason: "re_engagement", customMessage: "We have some exciting updates about our coverage options." },
  ],
  warm: [
    { actionType: "call", delayHours: 0, reason: "follow_up" },
    { actionType: "sms", delayHours: 24, reason: "reminder", customMessage: "Quick reminder - I'd love to discuss how we can help protect your events. Reply with a good time to chat!" },
    { actionType: "email", delayHours: 48, reason: "nurture", customMessage: "Here's a quick overview of our coverage options tailored for your business." },
    { actionType: "call", delayHours: 96, reason: "follow_up" },
  ],
  hot: [
    { actionType: "call", delayHours: 0, reason: "follow_up" },
    { actionType: "sms", delayHours: 2, reason: "reminder", customMessage: "Just following up on our conversation. Ready to help you get started!" },
    { actionType: "call", delayHours: 24, reason: "follow_up" },
    { actionType: "email", delayHours: 48, reason: "onboarding", customMessage: "Getting started is easy - here's everything you need to know." },
  ],
}

// ================= Helper Functions =================

/**
 * Calculate the scheduled time based on delay hours from now
 */
function calculateScheduledTime(delayHours: number, baseTime: Date = new Date()): Date {
  const scheduledTime = new Date(baseTime)
  scheduledTime.setTime(scheduledTime.getTime() + delayHours * 60 * 60 * 1000)
  return scheduledTime
}

/**
 * Get a suitable script for the action based on interest level and business type
 */
async function findSuitableScript(
  interestLevel: InterestLevel,
  businessType?: string | null
): Promise<string | null> {
  if (!isDbConfigured() || !db) {
    return null
  }

  try {
    const scripts = await db
      .select()
      .from(agentScripts)
      .where(
        and(
          eq(agentScripts.isActive, true),
          eq(agentScripts.interestLevel, interestLevel)
        )
      )
      .orderBy(sql`${agentScripts.priority} DESC`)
      .limit(10)

    // Try to find a script matching the business type
    if (businessType) {
      const matchingScript = scripts.find(
        (s) => s.businessType === businessType || s.businessType === null
      )
      if (matchingScript) {
        return matchingScript.id
      }
    }

    // Fall back to first available script
    return scripts[0]?.id ?? null
  } catch (error) {
    console.error("[FollowUpScheduler] Error finding script:", error)
    return null
  }
}

/**
 * Get lead information by ID
 */
async function getLeadById(leadId: string): Promise<Lead | null> {
  if (!isDbConfigured() || !db) {
    return null
  }

  try {
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1)

    return lead ?? null
  } catch (error) {
    console.error("[FollowUpScheduler] Error fetching lead:", error)
    return null
  }
}

// ================= Core Scheduling Functions =================

/**
 * Schedule a single follow-up action
 */
async function scheduleAction(
  leadId: string,
  actionType: ActionType,
  scheduledFor: Date,
  reason: ActionReason,
  options: {
    scriptId?: string | null
    customMessage?: string
    maxAttempts?: number
  } = {}
): Promise<ScheduleResult> {
  if (!isDbConfigured() || !db) {
    return {
      success: false,
      error: "Database not configured",
    }
  }

  try {
    const newAction: NewScheduledAction = {
      leadId,
      actionType,
      scheduledFor,
      reason,
      scriptId: options.scriptId ?? undefined,
      customMessage: options.customMessage,
      status: "pending",
      attempts: 0,
      maxAttempts: options.maxAttempts ?? 3,
    }

    const [inserted] = await db
      .insert(scheduledActions)
      .values(newAction)
      .returning()

    console.log(`[FollowUpScheduler] Scheduled ${actionType} for lead ${leadId} at ${scheduledFor.toISOString()}`)

    return {
      success: true,
      scheduledActionId: inserted.id,
      scheduledFor: inserted.scheduledFor,
    }
  } catch (error) {
    console.error("[FollowUpScheduler] Error scheduling action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Schedule follow-up actions based on call disposition outcome
 * This is the main entry point for post-call follow-up scheduling
 */
export async function scheduleFollowUp(
  leadId: string,
  disposition: Disposition,
  options: ScheduleFollowUpOptions = {}
): Promise<BulkScheduleResult> {
  const result: BulkScheduleResult = {
    success: true,
    scheduledCount: 0,
    failedCount: 0,
    scheduledActionIds: [],
    errors: [],
  }

  if (!isDbConfigured() || !db) {
    return {
      ...result,
      success: false,
      errors: ["Database not configured"],
    }
  }

  // Don't schedule follow-ups for DNC leads
  if (disposition === "dnc") {
    console.log(`[FollowUpScheduler] Lead ${leadId} marked as DNC, no follow-ups scheduled`)
    return result
  }

  try {
    // Get the follow-up sequence for this disposition
    const sequence = FOLLOW_UP_SEQUENCES[disposition]

    if (!sequence || sequence.length === 0) {
      console.log(`[FollowUpScheduler] No follow-up sequence for disposition: ${disposition}`)
      return result
    }

    // Get lead info for script matching
    const lead = await getLeadById(leadId)
    const interestLevel = options.interestLevel ?? (lead?.interestLevel as InterestLevel) ?? "cold"

    // Find a suitable script if not provided
    const scriptId = options.scriptId ?? await findSuitableScript(interestLevel, lead?.businessType)

    // Schedule each action in the sequence
    const baseTime = new Date()
    for (const step of sequence) {
      const scheduledFor = calculateScheduledTime(step.delayHours, baseTime)
      const scheduleResult = await scheduleAction(
        leadId,
        step.actionType,
        scheduledFor,
        step.reason,
        {
          scriptId: step.actionType === "call" ? scriptId : null,
          customMessage: options.customMessage ?? step.customMessage,
          maxAttempts: options.maxAttempts,
        }
      )

      if (scheduleResult.success && scheduleResult.scheduledActionId) {
        result.scheduledCount++
        result.scheduledActionIds.push(scheduleResult.scheduledActionId)
      } else {
        result.failedCount++
        if (scheduleResult.error) {
          result.errors.push(scheduleResult.error)
        }
      }
    }

    // Update lead's next follow-up timestamp
    if (result.scheduledCount > 0) {
      const firstScheduledTime = calculateScheduledTime(sequence[0].delayHours, baseTime)
      await updateLeadNextFollowUp(leadId, firstScheduledTime)
    }

    result.success = result.failedCount === 0
    return result
  } catch (error) {
    console.error("[FollowUpScheduler] Error in scheduleFollowUp:", error)
    return {
      ...result,
      success: false,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    }
  }
}

/**
 * Schedule a callback at a specific time requested by the lead
 */
export async function scheduleCallback(
  leadId: string,
  callbackTime: Date,
  options: ScheduleCallbackOptions = {}
): Promise<ScheduleResult> {
  if (!isDbConfigured() || !db) {
    return {
      success: false,
      error: "Database not configured",
    }
  }

  // Validate callback time is in the future
  if (callbackTime <= new Date()) {
    return {
      success: false,
      error: "Callback time must be in the future",
    }
  }

  try {
    // Get lead info for script matching
    const lead = await getLeadById(leadId)
    const interestLevel = (lead?.interestLevel as InterestLevel) ?? "warm"

    // Find a suitable script if not provided
    const scriptId = options.scriptId ?? await findSuitableScript(interestLevel, lead?.businessType)

    const result = await scheduleAction(
      leadId,
      "call",
      callbackTime,
      "callback_requested",
      {
        scriptId,
        customMessage: options.customMessage ?? "Callback requested by lead",
        maxAttempts: options.maxAttempts ?? 1, // Only one attempt for requested callbacks
      }
    )

    // Update lead's next follow-up timestamp
    if (result.success) {
      await updateLeadNextFollowUp(leadId, callbackTime)
    }

    return result
  } catch (error) {
    console.error("[FollowUpScheduler] Error scheduling callback:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Schedule a multi-step nurture campaign for a lead
 * Used for systematic lead warming based on interest level
 */
export async function scheduleNurtureCampaign(
  leadId: string,
  campaignType: InterestLevel
): Promise<BulkScheduleResult> {
  const result: BulkScheduleResult = {
    success: true,
    scheduledCount: 0,
    failedCount: 0,
    scheduledActionIds: [],
    errors: [],
  }

  if (!isDbConfigured() || !db) {
    return {
      ...result,
      success: false,
      errors: ["Database not configured"],
    }
  }

  try {
    // Get the campaign steps for this interest level
    const campaignSteps = NURTURE_CAMPAIGNS[campaignType]

    if (!campaignSteps || campaignSteps.length === 0) {
      console.log(`[FollowUpScheduler] No nurture campaign for type: ${campaignType}`)
      return result
    }

    // Get lead info for script matching
    const lead = await getLeadById(leadId)

    // Find a suitable script for calls
    const scriptId = await findSuitableScript(campaignType, lead?.businessType)

    // Cancel any existing pending actions before starting new campaign
    await cancelPendingActions(leadId)

    // Schedule each step in the campaign
    const baseTime = new Date()
    for (const step of campaignSteps) {
      const scheduledFor = calculateScheduledTime(step.delayHours, baseTime)
      const scheduleResult = await scheduleAction(
        leadId,
        step.actionType,
        scheduledFor,
        step.reason,
        {
          scriptId: step.actionType === "call" ? scriptId : null,
          customMessage: step.customMessage,
          maxAttempts: 3,
        }
      )

      if (scheduleResult.success && scheduleResult.scheduledActionId) {
        result.scheduledCount++
        result.scheduledActionIds.push(scheduleResult.scheduledActionId)
      } else {
        result.failedCount++
        if (scheduleResult.error) {
          result.errors.push(scheduleResult.error)
        }
      }
    }

    // Update lead's next follow-up timestamp
    if (result.scheduledCount > 0 && campaignSteps[0].delayHours === 0) {
      const firstScheduledTime = calculateScheduledTime(campaignSteps[0].delayHours, baseTime)
      await updateLeadNextFollowUp(leadId, firstScheduledTime)
    }

    console.log(`[FollowUpScheduler] Scheduled ${result.scheduledCount} actions for ${campaignType} nurture campaign`)

    result.success = result.failedCount === 0
    return result
  } catch (error) {
    console.error("[FollowUpScheduler] Error scheduling nurture campaign:", error)
    return {
      ...result,
      success: false,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    }
  }
}

/**
 * Cancel all pending scheduled actions for a lead
 * Used when a lead converts, marks DNC, or when starting a new campaign
 */
export async function cancelPendingActions(leadId: string): Promise<{
  success: boolean
  cancelledCount: number
  error?: string
}> {
  if (!isDbConfigured() || !db) {
    return {
      success: false,
      cancelledCount: 0,
      error: "Database not configured",
    }
  }

  try {
    const result = await db
      .update(scheduledActions)
      .set({
        status: "cancelled",
        processedAt: new Date(),
      })
      .where(
        and(
          eq(scheduledActions.leadId, leadId),
          eq(scheduledActions.status, "pending")
        )
      )
      .returning()

    console.log(`[FollowUpScheduler] Cancelled ${result.length} pending actions for lead ${leadId}`)

    return {
      success: true,
      cancelledCount: result.length,
    }
  } catch (error) {
    console.error("[FollowUpScheduler] Error cancelling actions:", error)
    return {
      success: false,
      cancelledCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Reschedule a failed action with exponential backoff
 */
export async function rescheduleFailedAction(actionId: string): Promise<ScheduleResult> {
  if (!isDbConfigured() || !db) {
    return {
      success: false,
      error: "Database not configured",
    }
  }

  try {
    // Get the failed action
    const [action] = await db
      .select()
      .from(scheduledActions)
      .where(eq(scheduledActions.id, actionId))
      .limit(1)

    if (!action) {
      return {
        success: false,
        error: "Action not found",
      }
    }

    if (action.status !== "failed") {
      return {
        success: false,
        error: `Cannot reschedule action with status: ${action.status}`,
      }
    }

    // Check if max attempts reached
    const attempts = action.attempts ?? 0
    const maxAttempts = action.maxAttempts ?? 3

    if (attempts >= maxAttempts) {
      return {
        success: false,
        error: `Max attempts (${maxAttempts}) reached for action`,
      }
    }

    // Calculate new scheduled time with exponential backoff
    // Attempt 1: 1 hour, Attempt 2: 2 hours, Attempt 3: 4 hours, etc.
    const backoffHours = Math.pow(2, attempts)
    const newScheduledTime = calculateScheduledTime(backoffHours)

    // Update the action
    const [updated] = await db
      .update(scheduledActions)
      .set({
        status: "pending",
        scheduledFor: newScheduledTime,
        error: null,
        processedAt: null,
      })
      .where(eq(scheduledActions.id, actionId))
      .returning()

    console.log(`[FollowUpScheduler] Rescheduled action ${actionId} for ${newScheduledTime.toISOString()} (attempt ${attempts + 1})`)

    return {
      success: true,
      scheduledActionId: updated.id,
      scheduledFor: updated.scheduledFor,
    }
  } catch (error) {
    console.error("[FollowUpScheduler] Error rescheduling action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Update the lead's next follow-up timestamp
 */
async function updateLeadNextFollowUp(leadId: string, nextFollowUpAt: Date): Promise<void> {
  if (!isDbConfigured() || !db) {
    return
  }

  try {
    await db
      .update(leads)
      .set({
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId))

    // Note: nextFollowUpAt is stored in leadCommunications table
    // We'll update the most recent communication record or create context for the next one
    console.log(`[FollowUpScheduler] Updated lead ${leadId} activity timestamp`)
  } catch (error) {
    console.error("[FollowUpScheduler] Error updating lead:", error)
  }
}

// ================= Query Functions =================

/**
 * Get all pending actions that are due for processing
 */
export async function getDueActions(limit: number = 100): Promise<ScheduledAction[]> {
  if (!isDbConfigured() || !db) {
    return []
  }

  try {
    const now = new Date()
    const actions = await db
      .select()
      .from(scheduledActions)
      .where(
        and(
          eq(scheduledActions.status, "pending"),
          lte(scheduledActions.scheduledFor, now)
        )
      )
      .orderBy(scheduledActions.scheduledFor)
      .limit(limit)

    return actions
  } catch (error) {
    console.error("[FollowUpScheduler] Error fetching due actions:", error)
    return []
  }
}

/**
 * Get all scheduled actions for a specific lead
 */
export async function getLeadScheduledActions(
  leadId: string,
  status?: ActionStatus
): Promise<ScheduledAction[]> {
  if (!isDbConfigured() || !db) {
    return []
  }

  try {
    const conditions = [eq(scheduledActions.leadId, leadId)]
    if (status) {
      conditions.push(eq(scheduledActions.status, status))
    }

    const actions = await db
      .select()
      .from(scheduledActions)
      .where(and(...conditions))
      .orderBy(scheduledActions.scheduledFor)

    return actions
  } catch (error) {
    console.error("[FollowUpScheduler] Error fetching lead actions:", error)
    return []
  }
}

/**
 * Mark an action as processing (used by cron job before execution)
 */
export async function markActionProcessing(actionId: string): Promise<boolean> {
  if (!isDbConfigured() || !db) {
    return false
  }

  try {
    const [updated] = await db
      .update(scheduledActions)
      .set({
        status: "processing",
      })
      .where(
        and(
          eq(scheduledActions.id, actionId),
          eq(scheduledActions.status, "pending")
        )
      )
      .returning()

    return !!updated
  } catch (error) {
    console.error("[FollowUpScheduler] Error marking action as processing:", error)
    return false
  }
}

/**
 * Mark an action as completed
 */
export async function markActionCompleted(actionId: string): Promise<boolean> {
  if (!isDbConfigured() || !db) {
    return false
  }

  try {
    const [updated] = await db
      .update(scheduledActions)
      .set({
        status: "completed",
        processedAt: new Date(),
      })
      .where(eq(scheduledActions.id, actionId))
      .returning()

    return !!updated
  } catch (error) {
    console.error("[FollowUpScheduler] Error marking action as completed:", error)
    return false
  }
}

/**
 * Mark an action as failed with error message
 */
export async function markActionFailed(
  actionId: string,
  error: string
): Promise<boolean> {
  if (!isDbConfigured() || !db) {
    return false
  }

  try {
    const [updated] = await db
      .update(scheduledActions)
      .set({
        status: "failed",
        error,
        processedAt: new Date(),
        attempts: sql`${scheduledActions.attempts} + 1`,
      })
      .where(eq(scheduledActions.id, actionId))
      .returning()

    return !!updated
  } catch (error) {
    console.error("[FollowUpScheduler] Error marking action as failed:", error)
    return false
  }
}

/**
 * Get action statistics for monitoring
 */
export async function getActionStats(): Promise<{
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
  dueNow: number
}> {
  if (!isDbConfigured() || !db) {
    return {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      dueNow: 0,
    }
  }

  try {
    const now = new Date()

    const stats = await db
      .select({
        status: scheduledActions.status,
        count: sql<number>`count(*)::int`,
      })
      .from(scheduledActions)
      .groupBy(scheduledActions.status)

    const dueNowResult = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(scheduledActions)
      .where(
        and(
          eq(scheduledActions.status, "pending"),
          lte(scheduledActions.scheduledFor, now)
        )
      )

    const statusCounts = stats.reduce(
      (acc, row) => {
        acc[row.status as ActionStatus] = row.count
        return acc
      },
      {} as Record<ActionStatus, number>
    )

    return {
      pending: statusCounts.pending ?? 0,
      processing: statusCounts.processing ?? 0,
      completed: statusCounts.completed ?? 0,
      failed: statusCounts.failed ?? 0,
      cancelled: statusCounts.cancelled ?? 0,
      dueNow: dueNowResult[0]?.count ?? 0,
    }
  } catch (error) {
    console.error("[FollowUpScheduler] Error fetching action stats:", error)
    return {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      dueNow: 0,
    }
  }
}

// ================= Exports =================

export const FollowUpScheduler = {
  // Core scheduling
  scheduleFollowUp,
  scheduleCallback,
  scheduleNurtureCampaign,
  cancelPendingActions,
  rescheduleFailedAction,

  // Query functions
  getDueActions,
  getLeadScheduledActions,

  // Status updates
  markActionProcessing,
  markActionCompleted,
  markActionFailed,

  // Monitoring
  getActionStats,
}

export default FollowUpScheduler
