/**
 * Outbound Email Sequences
 * High-conversion sequences using Hormozi-style templates
 */

import { db, isDbConfigured } from '@/lib/db'
import { emailSequences, scheduledEmails } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import {
  getEmailTemplate,
  sequenceTiming,
  type EmailTemplateData
} from './templates/outbound'

export type OutboundSequenceType = 'gym' | 'wellness' | 'ski-resort' | 'fitness'

interface StartOutboundSequenceParams {
  leadId: string
  vertical: OutboundSequenceType
  email: string
  contactName: string
  companyName: string
  estimatedRevenue: number
}

/**
 * Start an outbound email sequence for a prospect
 */
export async function startOutboundSequence(params: StartOutboundSequenceParams): Promise<{
  success: boolean
  sequenceId?: string
  error?: string
}> {
  const { leadId, vertical, email, contactName, companyName, estimatedRevenue } = params

  // Development mode - just log
  if (!isDbConfigured()) {
    console.log('[DEV] Would start outbound sequence:', {
      leadId,
      vertical,
      email,
      estimatedRevenue: `$${estimatedRevenue.toLocaleString()}/year`
    })
    return {
      success: true,
      sequenceId: `dev_seq_${Date.now()}`
    }
  }

  try {
    const templateData: EmailTemplateData = {
      contactName,
      companyName,
      estimatedRevenue,
      vertical,
      landingPageUrl: `https://dailyeventinsurance.com/landing/${vertical}`
    }

    // Create sequence record
    const [sequence] = await db!
      .insert(emailSequences)
      .values({
        leadId,
        sequenceType: `${vertical}-outbound` as any,
        currentStep: 0,
        totalSteps: 3, // initial + 2 follow-ups
        status: 'active',
        metadata: JSON.stringify(templateData),
      })
      .returning()

    // Schedule the 3 emails
    const now = new Date()

    // Email 1: Initial outreach (immediate)
    const initialTemplate = getEmailTemplate(vertical, 'initial')
    await db!.insert(scheduledEmails).values({
      sequenceId: sequence.id,
      leadId,
      to: email,
      subject: initialTemplate.subject(templateData),
      htmlContent: initialTemplate.html(templateData),
      textContent: initialTemplate.text(templateData),
      scheduledFor: now,
      status: 'pending',
      stepNumber: 1,
      metadata: JSON.stringify({ vertical, step: 'initial' }),
    })

    // Email 2: Follow-up 1 (3 days later)
    const followUp1Date = new Date(now)
    followUp1Date.setDate(followUp1Date.getDate() + sequenceTiming.followUp1)
    const followUp1Template = getEmailTemplate(vertical, 'followUp1')

    await db!.insert(scheduledEmails).values({
      sequenceId: sequence.id,
      leadId,
      to: email,
      subject: followUp1Template.subject(templateData),
      htmlContent: followUp1Template.html(templateData),
      textContent: followUp1Template.text(templateData),
      scheduledFor: followUp1Date,
      status: 'pending',
      stepNumber: 2,
      metadata: JSON.stringify({ vertical, step: 'followUp1' }),
    })

    // Email 3: Follow-up 2 (7 days after initial)
    const followUp2Date = new Date(now)
    followUp2Date.setDate(followUp2Date.getDate() + sequenceTiming.followUp2)
    const followUp2Template = getEmailTemplate(vertical, 'followUp2')

    await db!.insert(scheduledEmails).values({
      sequenceId: sequence.id,
      leadId,
      to: email,
      subject: followUp2Template.subject(templateData),
      htmlContent: followUp2Template.html(templateData),
      textContent: followUp2Template.text(templateData),
      scheduledFor: followUp2Date,
      status: 'pending',
      stepNumber: 3,
      metadata: JSON.stringify({ vertical, step: 'followUp2' }),
    })

    console.log(`[Outbound] Started ${vertical} sequence for lead ${leadId}`)
    return {
      success: true,
      sequenceId: sequence.id
    }

  } catch (error) {
    console.error('[Outbound] Error starting sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Stop an outbound sequence (when prospect replies or converts)
 */
export async function stopOutboundSequence(leadId: string): Promise<{
  success: boolean
  error?: string
}> {
  if (!isDbConfigured()) {
    console.log('[DEV] Would stop outbound sequence for lead:', leadId)
    return { success: true }
  }

  try {
    // Mark sequence as completed
    await db!
      .update(emailSequences)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(emailSequences.leadId, leadId))

    // Cancel any pending scheduled emails
    const [sequence] = await db!
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.leadId, leadId))
      .limit(1)

    if (sequence) {
      await db!
        .update(scheduledEmails)
        .set({
          status: 'cancelled',
          updatedAt: new Date()
        })
        .where(eq(scheduledEmails.sequenceId, sequence.id))
    }

    console.log(`[Outbound] Stopped sequence for lead ${leadId}`)
    return { success: true }

  } catch (error) {
    console.error('[Outbound] Error stopping sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get status of an outbound sequence
 */
export async function getOutboundSequenceStatus(leadId: string): Promise<{
  sequence?: any
  scheduledEmails?: any[]
  error?: string
}> {
  if (!isDbConfigured()) {
    return { error: 'Database not configured' }
  }

  try {
    const [sequence] = await db!
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.leadId, leadId))
      .limit(1)

    if (!sequence) {
      return { error: 'Sequence not found' }
    }

    const emails = await db!
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.sequenceId, sequence.id))

    return {
      sequence,
      scheduledEmails: emails,
    }
  } catch (error) {
    console.error('[Outbound] Error getting sequence status:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
