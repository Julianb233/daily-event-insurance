import { db } from "@/lib/db"
import { scheduledActions, leads, leadCommunications } from "@/lib/db/schema"
import { eq, lte, and } from "drizzle-orm"

/**
 * Process pending scheduled actions (calls, SMS, emails)
 * Called by Vercel cron every minute
 */
export async function processScheduledActions(): Promise<{
  processed: number
  failed: number
  errors: string[]
}> {
  const now = new Date()
  const results = {
    processed: 0,
    failed: 0,
    errors: [] as string[],
  }

  try {
    if (!db) {
      throw new Error("Database not configured")
    }

    // Get all pending actions that are due
    const pendingActions = await db
      .select()
      .from(scheduledActions)
      .where(
        and(
          eq(scheduledActions.status, "pending"),
          lte(scheduledActions.scheduledFor, now)
        )
      )
      .limit(50) // Process max 50 per run to avoid timeout

    for (const action of pendingActions) {
      try {
        // Mark as processing
        await db
          .update(scheduledActions)
          .set({ status: "processing", attempts: (action.attempts || 0) + 1 })
          .where(eq(scheduledActions.id, action.id))

        // Get lead info
        const [lead] = await db
          .select()
          .from(leads)
          .where(eq(leads.id, action.leadId))
          .limit(1)

        if (!lead) {
          throw new Error(`Lead not found: ${action.leadId}`)
        }

        // Execute action based on type
        let success = false
        switch (action.actionType) {
          case "call":
            success = await initiateCall(lead, action)
            break
          case "sms":
            success = await sendSms(lead, action)
            break
          case "email":
            success = await sendEmail(lead, action)
            break
          default:
            throw new Error(`Unknown action type: ${action.actionType}`)
        }

        if (success) {
          await db
            .update(scheduledActions)
            .set({ 
              status: "completed", 
              processedAt: new Date() 
            })
            .where(eq(scheduledActions.id, action.id))
          results.processed++
        } else {
          throw new Error("Action execution failed")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        results.errors.push(`Action ${action.id}: ${errorMessage}`)

        // Check if max attempts reached
        if ((action.attempts || 0) >= (action.maxAttempts || 3)) {
          await db
            .update(scheduledActions)
            .set({ 
              status: "failed", 
              error: errorMessage,
              processedAt: new Date() 
            })
            .where(eq(scheduledActions.id, action.id))
          results.failed++
        } else {
          // Reset to pending for retry
          await db
            .update(scheduledActions)
            .set({ 
              status: "pending",
              error: errorMessage 
            })
            .where(eq(scheduledActions.id, action.id))
        }
      }
    }
  } catch (error) {
    console.error("Error processing scheduled actions:", error)
    results.errors.push(error instanceof Error ? error.message : "Unknown error")
  }

  return results
}

/**
 * Initiate an outbound call via LiveKit
 */
async function initiateCall(
  lead: typeof leads.$inferSelect,
  action: typeof scheduledActions.$inferSelect
): Promise<boolean> {
  if (!db) throw new Error("Database not configured")

  // TODO: Implement LiveKit SIP call initiation
  // For now, just log the communication
  
  console.log(`[CRON] Would initiate call to ${lead.phone} for lead ${lead.id}`)
  
  // Log as pending communication
  await db.insert(leadCommunications).values({
    leadId: lead.id,
    channel: "call",
    direction: "outbound",
    disposition: "scheduled",
    agentScriptUsed: action.scriptId || undefined,
  })

  // In production, this would:
  // 1. Create a LiveKit room with lead metadata
  // 2. Dispatch the agent
  // 3. Create SIP participant to dial out
  
  return true
}

/**
 * Send an SMS via Twilio
 */
async function sendSms(
  lead: typeof leads.$inferSelect,
  action: typeof scheduledActions.$inferSelect
): Promise<boolean> {
  if (!db) throw new Error("Database not configured")

  const message = action.customMessage || getDefaultSmsMessage(lead, action.reason || "follow_up")
  
  console.log(`[CRON] Would send SMS to ${lead.phone}: ${message}`)
  
  // TODO: Implement Twilio SMS sending
  // const twilioClient = twilio(accountSid, authToken)
  // await twilioClient.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: lead.phone,
  // })
  
  // Log the communication
  await db.insert(leadCommunications).values({
    leadId: lead.id,
    channel: "sms",
    direction: "outbound",
    smsContent: message,
    smsStatus: "sent",
  })
  
  // Update lead activity
  await db
    .update(leads)
    .set({ lastActivityAt: new Date(), updatedAt: new Date() })
    .where(eq(leads.id, lead.id))
  
  return true
}

/**
 * Send an email
 */
async function sendEmail(
  lead: typeof leads.$inferSelect,
  action: typeof scheduledActions.$inferSelect
): Promise<boolean> {
  if (!db) throw new Error("Database not configured")

  console.log(`[CRON] Would send email to ${lead.email}`)
  
  // TODO: Implement email sending (Resend, SendGrid, etc.)
  
  // Log the communication
  await db.insert(leadCommunications).values({
    leadId: lead.id,
    channel: "email",
    direction: "outbound",
  })
  
  return true
}

/**
 * Generate default SMS message based on reason
 */
function getDefaultSmsMessage(
  lead: typeof leads.$inferSelect,
  reason: string
): string {
  const firstName = lead.firstName
  
  switch (reason) {
    case "follow_up":
      return `Hi ${firstName}, it's Alex from Daily Event Insurance. Just following up on our conversation about partnering with ${lead.businessName || "your business"}. Let me know if you have any questions!`
    case "reminder":
      return `Hi ${firstName}, friendly reminder about our upcoming call. Looking forward to speaking with you!`
    case "callback_requested":
      return `Hi ${firstName}, calling you back as requested. Feel free to reply to this text if now isn't a good time.`
    default:
      return `Hi ${firstName}, this is Alex from Daily Event Insurance. I'd love to chat about how we can help ${lead.businessName || "your business"}. Reply to schedule a call!`
  }
}
