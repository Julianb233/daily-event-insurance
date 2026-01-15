import { NextRequest, NextResponse } from "next/server"
import { db, scheduledActions, leads } from "@/lib/db"
import { eq, lte, and } from "drizzle-orm"
import { successResponse, serverError, unauthorizedError } from "@/lib/api-responses"

/**
 * Scheduled Actions Processor Cron Endpoint (E.1)
 *
 * Processes pending scheduled actions (calls, SMS, emails) for lead follow-ups.
 * Uses exponential backoff for retries and tracks processing status.
 *
 * Vercel Cron configuration (vercel.json):
 * @example
 * ```json
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-actions",
 *     "schedule": "0/5 * * * *"
 *   }]
 * }
 * ```
 *
 * Security: Requires CRON_SECRET in Authorization header
 */

interface ProcessingResult {
  actionId: string
  actionType: string
  leadId: string
  status: "completed" | "failed" | "retry_scheduled"
  message: string
  attempts: number
}

interface ProcessingSummary {
  totalProcessed: number
  completed: number
  failed: number
  retryScheduled: number
  results: ProcessingResult[]
  timestamp: string
  durationMs: number
}

/**
 * Calculate exponential backoff delay for retries
 * @param attempts Current attempt count (1-indexed after increment)
 * @param baseDelayMs Base delay in milliseconds (default 5 minutes)
 * @param maxDelayMs Maximum delay cap (default 2 hours)
 */
function calculateBackoffDelay(
  attempts: number,
  baseDelayMs: number = 5 * 60 * 1000,
  maxDelayMs: number = 2 * 60 * 60 * 1000
): number {
  // Exponential backoff: baseDelay * 2^(attempts - 1)
  // With jitter to prevent thundering herd
  const exponentialDelay = baseDelayMs * Math.pow(2, attempts - 1)
  const jitter = Math.random() * 0.1 * exponentialDelay // 10% jitter
  const delayWithJitter = exponentialDelay + jitter
  return Math.min(delayWithJitter, maxDelayMs)
}

/**
 * Process a call action
 * Placeholder for LiveKit integration
 */
async function processCallAction(
  action: typeof scheduledActions.$inferSelect,
  lead: typeof leads.$inferSelect | null
): Promise<{ success: boolean; message: string }> {
  console.log(`[ProcessActions] Processing CALL action ${action.id}`, {
    leadId: action.leadId,
    leadName: lead ? `${lead.firstName} ${lead.lastName}` : "Unknown",
    phone: lead?.phone || "No phone",
    scriptId: action.scriptId,
    reason: action.reason,
  })

  // TODO: Integrate with LiveKit to initiate outbound call
  // This would typically:
  // 1. Create a LiveKit room
  // 2. Connect AI agent with the specified script
  // 3. Initiate outbound call via Twilio/LiveKit SIP
  // 4. Track call in leadCommunications table

  // Placeholder success - in production this would return actual call status
  return {
    success: true,
    message: `Call action queued for lead ${lead?.firstName || action.leadId}. LiveKit integration pending.`,
  }
}

/**
 * Process an SMS action
 * Placeholder for Twilio integration
 */
async function processSmsAction(
  action: typeof scheduledActions.$inferSelect,
  lead: typeof leads.$inferSelect | null
): Promise<{ success: boolean; message: string }> {
  console.log(`[ProcessActions] Processing SMS action ${action.id}`, {
    leadId: action.leadId,
    leadName: lead ? `${lead.firstName} ${lead.lastName}` : "Unknown",
    phone: lead?.phone || "No phone",
    customMessage: action.customMessage,
    reason: action.reason,
  })

  // TODO: Integrate with Twilio to send SMS
  // This would typically:
  // 1. Use Twilio SDK to send message
  // 2. Track in leadCommunications table
  // 3. Handle delivery status webhooks

  if (!lead?.phone) {
    return {
      success: false,
      message: "Cannot send SMS: Lead has no phone number",
    }
  }

  // Placeholder success
  return {
    success: true,
    message: `SMS queued for ${lead.phone}. Twilio integration pending.`,
  }
}

/**
 * Process an email action
 * Placeholder for email service integration
 */
async function processEmailAction(
  action: typeof scheduledActions.$inferSelect,
  lead: typeof leads.$inferSelect | null
): Promise<{ success: boolean; message: string }> {
  console.log(`[ProcessActions] Processing EMAIL action ${action.id}`, {
    leadId: action.leadId,
    leadName: lead ? `${lead.firstName} ${lead.lastName}` : "Unknown",
    email: lead?.email || "No email",
    customMessage: action.customMessage,
    reason: action.reason,
  })

  // TODO: Integrate with email service (SendGrid, Resend, etc.)
  // This would typically:
  // 1. Select appropriate template based on reason
  // 2. Send email via provider
  // 3. Track in leadCommunications table

  if (!lead?.email) {
    return {
      success: false,
      message: "Cannot send email: Lead has no email address",
    }
  }

  // Placeholder success
  return {
    success: true,
    message: `Email queued for ${lead.email}. Email service integration pending.`,
  }
}

/**
 * Process a single scheduled action
 */
async function processAction(
  action: typeof scheduledActions.$inferSelect
): Promise<ProcessingResult> {
  const currentAttempts = (action.attempts || 0) + 1
  const maxAttempts = action.maxAttempts || 3

  try {
    // Mark as processing
    await db!.update(scheduledActions)
      .set({
        status: "processing",
        attempts: currentAttempts,
      })
      .where(eq(scheduledActions.id, action.id))

    // Fetch lead details for processing
    const leadResult = await db!.select()
      .from(leads)
      .where(eq(leads.id, action.leadId))
      .limit(1)

    const lead = leadResult[0] || null

    // Process based on action type
    let result: { success: boolean; message: string }

    switch (action.actionType) {
      case "call":
        result = await processCallAction(action, lead)
        break
      case "sms":
        result = await processSmsAction(action, lead)
        break
      case "email":
        result = await processEmailAction(action, lead)
        break
      default:
        result = {
          success: false,
          message: `Unknown action type: ${action.actionType}`,
        }
    }

    if (result.success) {
      // Mark as completed
      await db!.update(scheduledActions)
        .set({
          status: "completed",
          processedAt: new Date(),
          error: null,
        })
        .where(eq(scheduledActions.id, action.id))

      return {
        actionId: action.id,
        actionType: action.actionType,
        leadId: action.leadId,
        status: "completed",
        message: result.message,
        attempts: currentAttempts,
      }
    } else {
      // Handle failure with retry logic
      if (currentAttempts >= maxAttempts) {
        // Max attempts reached - mark as failed
        await db!.update(scheduledActions)
          .set({
            status: "failed",
            processedAt: new Date(),
            error: result.message,
          })
          .where(eq(scheduledActions.id, action.id))

        return {
          actionId: action.id,
          actionType: action.actionType,
          leadId: action.leadId,
          status: "failed",
          message: `Max attempts (${maxAttempts}) reached. ${result.message}`,
          attempts: currentAttempts,
        }
      } else {
        // Schedule retry with exponential backoff
        const backoffMs = calculateBackoffDelay(currentAttempts)
        const nextAttemptTime = new Date(Date.now() + backoffMs)

        await db!.update(scheduledActions)
          .set({
            status: "pending",
            scheduledFor: nextAttemptTime,
            error: result.message,
          })
          .where(eq(scheduledActions.id, action.id))

        return {
          actionId: action.id,
          actionType: action.actionType,
          leadId: action.leadId,
          status: "retry_scheduled",
          message: `Retry ${currentAttempts}/${maxAttempts} scheduled for ${nextAttemptTime.toISOString()}. ${result.message}`,
          attempts: currentAttempts,
        }
      }
    }
  } catch (error: any) {
    console.error(`[ProcessActions] Error processing action ${action.id}:`, error)

    // Handle unexpected errors with retry logic
    if (currentAttempts >= maxAttempts) {
      await db!.update(scheduledActions)
        .set({
          status: "failed",
          processedAt: new Date(),
          error: error.message || "Unknown error occurred",
        })
        .where(eq(scheduledActions.id, action.id))

      return {
        actionId: action.id,
        actionType: action.actionType,
        leadId: action.leadId,
        status: "failed",
        message: `Max attempts reached. Error: ${error.message}`,
        attempts: currentAttempts,
      }
    } else {
      const backoffMs = calculateBackoffDelay(currentAttempts)
      const nextAttemptTime = new Date(Date.now() + backoffMs)

      await db!.update(scheduledActions)
        .set({
          status: "pending",
          scheduledFor: nextAttemptTime,
          error: error.message || "Unknown error occurred",
        })
        .where(eq(scheduledActions.id, action.id))

      return {
        actionId: action.id,
        actionType: action.actionType,
        leadId: action.leadId,
        status: "retry_scheduled",
        message: `Retry ${currentAttempts}/${maxAttempts} scheduled. Error: ${error.message}`,
        attempts: currentAttempts,
      }
    }
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[ProcessActions] Unauthorized cron request attempted")
      return unauthorizedError("Invalid or missing CRON_SECRET")
    }

    // Check if database is configured
    if (!db) {
      console.error("[ProcessActions] Database not configured")
      return serverError("Database not configured")
    }

    console.log("[ProcessActions] Starting scheduled actions processing...")

    const now = new Date()

    // Query for pending actions where scheduledFor <= now
    const pendingActions = await db.select()
      .from(scheduledActions)
      .where(
        and(
          eq(scheduledActions.status, "pending"),
          lte(scheduledActions.scheduledFor, now)
        )
      )
      .limit(100) // Process in batches to avoid timeout

    console.log(`[ProcessActions] Found ${pendingActions.length} pending actions to process`)

    if (pendingActions.length === 0) {
      return successResponse(
        {
          totalProcessed: 0,
          completed: 0,
          failed: 0,
          retryScheduled: 0,
          results: [],
          timestamp: now.toISOString(),
          durationMs: Date.now() - startTime,
        } as ProcessingSummary,
        "No pending actions to process"
      )
    }

    // Process each action
    const results: ProcessingResult[] = []
    for (const action of pendingActions) {
      const result = await processAction(action)
      results.push(result)
    }

    // Calculate summary
    const summary: ProcessingSummary = {
      totalProcessed: results.length,
      completed: results.filter(r => r.status === "completed").length,
      failed: results.filter(r => r.status === "failed").length,
      retryScheduled: results.filter(r => r.status === "retry_scheduled").length,
      results,
      timestamp: now.toISOString(),
      durationMs: Date.now() - startTime,
    }

    console.log(
      `[ProcessActions] Processing complete: ${summary.completed} completed, ${summary.failed} failed, ${summary.retryScheduled} retries scheduled`
    )

    return successResponse(summary, "Scheduled actions processing completed")
  } catch (error: any) {
    console.error("[ProcessActions] Cron job error:", error)
    return serverError(error.message || "Failed to process scheduled actions")
  }
}

// Support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
