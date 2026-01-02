/**
 * Email Scheduler
 * Handles scheduling and processing of emails
 */

import { db } from '@/lib/db'
import { scheduledEmails, emailSequences } from '@/lib/db/schema'
import { eq, lte, and } from 'drizzle-orm'
import { sendEmail } from './resend'

export interface ScheduleEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  sendAt: Date
  sequenceId?: string
  leadId?: string
  metadata?: Record<string, any>
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

/**
 * Schedule an email to be sent at a specific time
 */
export async function scheduleEmail(options: ScheduleEmailOptions): Promise<{
  success: boolean
  emailId?: string
  error?: string
}> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  // Validate inputs
  if (!options.to || !options.subject) {
    return { success: false, error: 'Missing required fields: to, subject' }
  }

  if (!options.html && !options.text) {
    return { success: false, error: 'Either html or text content is required' }
  }

  if (options.sendAt < new Date()) {
    return { success: false, error: 'sendAt must be in the future' }
  }

  try {
    const [email] = await db.insert(scheduledEmails).values({
      sequenceId: options.sequenceId,
      leadId: options.leadId,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
      scheduledFor: options.sendAt,
      status: 'pending',
      metadata: options.metadata ? JSON.stringify(options.metadata) : null,
    }).returning()

    console.log('[Scheduler] Email scheduled:', email.id, 'for', options.sendAt)
    return {
      success: true,
      emailId: email.id,
    }
  } catch (error) {
    console.error('[Scheduler] Error scheduling email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Process scheduled emails that are due to be sent
 * This should be called by a cron job
 */
export async function processScheduledEmails(): Promise<{
  processed: number
  sent: number
  failed: number
  errors: string[]
}> {
  if (!db) {
    console.error('[Scheduler] Database not configured')
    return { processed: 0, sent: 0, failed: 0, errors: ['Database not configured'] }
  }

  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[],
  }

  try {
    // Get all pending emails that are due
    const now = new Date()
    const dueEmails = await db
      .select()
      .from(scheduledEmails)
      .where(
        and(
          eq(scheduledEmails.status, 'pending'),
          lte(scheduledEmails.scheduledFor, now)
        )
      )
      .limit(100) // Process in batches

    console.log(`[Scheduler] Processing ${dueEmails.length} scheduled emails`)

    for (const email of dueEmails) {
      results.processed++

      try {
        // Mark as processing
        await db
          .update(scheduledEmails)
          .set({ status: 'processing' })
          .where(eq(scheduledEmails.id, email.id))

        // Send the email
        const result = await sendEmail({
          to: email.to.split(','),
          subject: email.subject,
          html: email.htmlContent || undefined,
          text: email.textContent || undefined,
        })

        if (result.success) {
          // Mark as sent
          await db
            .update(scheduledEmails)
            .set({
              status: 'sent',
              sentAt: new Date(),
              resendId: result.id,
            })
            .where(eq(scheduledEmails.id, email.id))

          // Update sequence progress if applicable
          if (email.sequenceId && email.stepNumber) {
            await db
              .update(emailSequences)
              .set({
                currentStep: email.stepNumber,
                lastEmailSentAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(emailSequences.id, email.sequenceId))
          }

          results.sent++
          console.log(`[Scheduler] Sent email ${email.id}`)
        } else {
          // Mark as failed
          await db
            .update(scheduledEmails)
            .set({
              status: 'failed',
              error: result.error,
              attemptedAt: new Date(),
            })
            .where(eq(scheduledEmails.id, email.id))

          results.failed++
          results.errors.push(`Email ${email.id}: ${result.error}`)
          console.error(`[Scheduler] Failed to send email ${email.id}:`, result.error)
        }
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Email ${email.id}: ${errorMessage}`)
        console.error(`[Scheduler] Error processing email ${email.id}:`, error)

        // Mark as failed
        try {
          await db
            .update(scheduledEmails)
            .set({
              status: 'failed',
              error: errorMessage,
              attemptedAt: new Date(),
            })
            .where(eq(scheduledEmails.id, email.id))
        } catch (updateError) {
          console.error(`[Scheduler] Failed to update email status:`, updateError)
        }
      }
    }

    console.log('[Scheduler] Processing complete:', results)
    return results
  } catch (error) {
    console.error('[Scheduler] Error in processScheduledEmails:', error)
    results.errors.push(error instanceof Error ? error.message : 'Unknown error')
    return results
  }
}

/**
 * Cancel a scheduled email
 */
export async function cancelScheduledEmail(emailId: string): Promise<{
  success: boolean
  error?: string
}> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    const result = await db
      .update(scheduledEmails)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(
        and(
          eq(scheduledEmails.id, emailId),
          eq(scheduledEmails.status, 'pending')
        )
      )
      .returning()

    if (result.length === 0) {
      return { success: false, error: 'Email not found or already processed' }
    }

    console.log('[Scheduler] Cancelled email:', emailId)
    return { success: true }
  } catch (error) {
    console.error('[Scheduler] Error cancelling email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get scheduled email status
 */
export async function getScheduledEmailStatus(emailId: string): Promise<{
  email?: any
  error?: string
}> {
  if (!db) {
    return { error: 'Database not configured' }
  }

  try {
    const [email] = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.id, emailId))
      .limit(1)

    if (!email) {
      return { error: 'Email not found' }
    }

    return { email }
  } catch (error) {
    console.error('[Scheduler] Error getting email status:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Retry a failed email
 */
export async function retryFailedEmail(emailId: string): Promise<{
  success: boolean
  error?: string
}> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    // Get the failed email
    const [email] = await db
      .select()
      .from(scheduledEmails)
      .where(
        and(
          eq(scheduledEmails.id, emailId),
          eq(scheduledEmails.status, 'failed')
        )
      )
      .limit(1)

    if (!email) {
      return { success: false, error: 'Email not found or not in failed status' }
    }

    // Reset to pending and reschedule for now
    await db
      .update(scheduledEmails)
      .set({
        status: 'pending',
        scheduledFor: new Date(),
        error: null,
        updatedAt: new Date(),
      })
      .where(eq(scheduledEmails.id, emailId))

    console.log('[Scheduler] Retrying failed email:', emailId)
    return { success: true }
  } catch (error) {
    console.error('[Scheduler] Error retrying email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get statistics for scheduled emails
 */
export async function getSchedulerStats(): Promise<{
  pending: number
  sent: number
  failed: number
  cancelled: number
  error?: string
}> {
  if (!db) {
    return {
      pending: 0,
      sent: 0,
      failed: 0,
      cancelled: 0,
      error: 'Database not configured',
    }
  }

  try {
    const allEmails = await db.select().from(scheduledEmails)

    const stats = {
      pending: allEmails.filter(e => e.status === 'pending').length,
      sent: allEmails.filter(e => e.status === 'sent').length,
      failed: allEmails.filter(e => e.status === 'failed').length,
      cancelled: allEmails.filter(e => e.status === 'cancelled').length,
    }

    return stats
  } catch (error) {
    console.error('[Scheduler] Error getting stats:', error)
    return {
      pending: 0,
      sent: 0,
      failed: 0,
      cancelled: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
