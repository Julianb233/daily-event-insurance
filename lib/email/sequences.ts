/**
 * Email Automation Sequences
 * Nurture sequences for different verticals
 */

import { db } from '@/lib/db'
import { emailSequences, scheduledEmails } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendEmail } from './resend'

export type SequenceType = 'gym-nurture' | 'wellness-nurture' | 'ski-resort-nurture' | 'fitness-nurture'

export interface SequenceStep {
  stepNumber: number
  delayDays: number
  subject: string
  getHtml: (data: SequenceData) => string
  getText: (data: SequenceData) => string
}

export interface SequenceData {
  contactName: string
  companyName: string
  estimatedRevenue: number
  vertical: string
}

// Email sequence definitions
const sequences: Record<SequenceType, SequenceStep[]> = {
  'gym-nurture': [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: 'Welcome to Daily Event Insurance - Let\'s Protect Your Members',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Thank you for your interest in Daily Event Insurance for ${data.companyName}!</p>
          <p>We understand that protecting your members during classes, events, and activities is crucial. Our specialized insurance coverage is designed specifically for gyms and fitness centers like yours.</p>
          <p><strong>Based on your information, we estimate you could earn approximately $${data.estimatedRevenue.toFixed(2)} per month in additional revenue</strong> while providing valuable protection to your members.</p>
          <h3>What happens next?</h3>
          <ul>
            <li>Review our partnership proposal (attached)</li>
            <li>Schedule a 15-minute call to discuss integration</li>
            <li>Get set up in less than a week</li>
          </ul>
          <p>Ready to get started? Reply to this email or book a call directly: [CALENDAR_LINK]</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nThank you for your interest in Daily Event Insurance for ${data.companyName}!\n\nBased on your information, we estimate you could earn approximately $${data.estimatedRevenue.toFixed(2)} per month in additional revenue.\n\nReply to schedule a call!\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 2,
      delayDays: 2,
      subject: 'Quick Question About Your Gym Insurance Needs',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>I wanted to follow up on our initial conversation about insurance for ${data.companyName}.</p>
          <p>I know you're busy, so I'll keep this brief. Many gym owners have questions about:</p>
          <ul>
            <li>How to seamlessly integrate insurance into existing workflows</li>
            <li>What coverage options work best for their members</li>
            <li>The setup process and timeline</li>
          </ul>
          <p>I'd love to answer any questions you have. What's the best way to connect this week?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nFollowing up on insurance for ${data.companyName}. What questions can I answer for you?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 3,
      delayDays: 5,
      subject: 'Case Study: How CrossFit Momentum Increased Revenue 15%',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>I thought you might find this interesting...</p>
          <p>CrossFit Momentum (similar size to ${data.companyName}) recently partnered with us and saw incredible results:</p>
          <ul>
            <li><strong>15% increase in monthly revenue</strong></li>
            <li><strong>98% member opt-in rate</strong></li>
            <li><strong>Set up in just 3 days</strong></li>
          </ul>
          <blockquote style="border-left: 3px solid #14B8A6; padding-left: 15px; color: #666;">
            "Our members love the peace of mind, and we love the additional revenue. It was one of the easiest decisions we've made." - Owner, CrossFit Momentum
          </blockquote>
          <p>Want to see how this could work for ${data.companyName}? Let's connect.</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nCrossFit Momentum saw 15% revenue increase with our insurance program. Similar to ${data.companyName}.\n\nInterested in learning how?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 4,
      delayDays: 10,
      subject: 'Last Check-In: Still Interested in Protecting Your Members?',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>I wanted to reach out one last time about insurance coverage for ${data.companyName}.</p>
          <p>If now isn't the right time, I completely understand. Just let me know if you'd like me to:</p>
          <ul>
            <li><strong>Check back in a few months</strong> - I'll follow up when it might be more relevant</li>
            <li><strong>Send you resources to review</strong> - No pressure, just helpful information</li>
            <li><strong>Stop emailing</strong> - No hard feelings whatsoever</li>
          </ul>
          <p>Otherwise, I'm here if you have any questions or want to explore this further.</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nLast check-in about insurance for ${data.companyName}. Let me know if you'd like to connect or if I should check back later.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
  ],
  'wellness-nurture': [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: 'Welcome to Daily Event Insurance - Protecting Your Wellness Clients',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Thank you for your interest in Daily Event Insurance for ${data.companyName}!</p>
          <p>Wellness treatments and spa services require specialized coverage. We've designed our insurance specifically for businesses like yours.</p>
          <p><strong>Estimated additional monthly revenue: $${data.estimatedRevenue.toFixed(2)}</strong></p>
          <p>Let's discuss how we can protect your clients and grow your business.</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nThank you for your interest in insurance for ${data.companyName}. Estimated revenue: $${data.estimatedRevenue.toFixed(2)}/month.\n\nLet's connect!\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 2,
      delayDays: 2,
      subject: 'Wellness Insurance: What You Need to Know',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Following up on ${data.companyName}'s insurance needs.</p>
          <p>Common questions from wellness center owners:</p>
          <ul>
            <li>Coverage for various treatment types</li>
            <li>Client communication and enrollment</li>
            <li>Integration with booking systems</li>
          </ul>
          <p>What questions can I answer for you?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nWhat questions do you have about insurance for ${data.companyName}?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 3,
      delayDays: 5,
      subject: 'How Serenity Spa Increased Client Trust & Revenue',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Serenity Spa (similar to ${data.companyName}) saw amazing results:</p>
          <ul>
            <li>95% client opt-in rate</li>
            <li>Increased perceived professionalism</li>
            <li>Additional revenue stream</li>
          </ul>
          <p>Want to see how this works for wellness centers?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nSerenity Spa increased revenue with our program. Similar to ${data.companyName}. Interested?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 4,
      delayDays: 10,
      subject: 'Final Follow-Up: Insurance for ${data.companyName}',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Last check-in about insurance for ${data.companyName}.</p>
          <p>Let me know if you'd like to:</p>
          <ul>
            <li>Schedule a call</li>
            <li>Review information later</li>
            <li>Pause communications</li>
          </ul>
          <p>I'm here to help!</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nFinal follow-up for ${data.companyName}. Still interested?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
  ],
  'ski-resort-nurture': [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: 'Welcome to Daily Event Insurance - Ski Resort Coverage Made Easy',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Thank you for your interest in Daily Event Insurance for ${data.companyName}!</p>
          <p>Ski resorts have unique insurance needs. We specialize in daily coverage for seasonal visitors and events.</p>
          <p><strong>Estimated additional revenue: $${data.estimatedRevenue.toFixed(2)}/month during peak season</strong></p>
          <p>Let's discuss your specific needs.</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nThank you for interest in ${data.companyName} insurance. Est. revenue: $${data.estimatedRevenue.toFixed(2)}/month peak season.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 2,
      delayDays: 2,
      subject: 'Ski Resort Insurance: Common Questions Answered',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Following up on insurance for ${data.companyName}.</p>
          <p>Resort owners typically ask about:</p>
          <ul>
            <li>Seasonal vs year-round coverage</li>
            <li>Ticket system integration</li>
            <li>Multi-day pass handling</li>
          </ul>
          <p>What's most important to you?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nQuestions about ${data.companyName} insurance?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 3,
      delayDays: 5,
      subject: 'Case Study: How Mountain Peak Resort Boosted Revenue',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Mountain Peak Resort (similar to ${data.companyName}) partnered with us:</p>
          <ul>
            <li>85% visitor opt-in rate</li>
            <li>Seamless ticket integration</li>
            <li>Peak season revenue boost</li>
          </ul>
          <p>Interested in learning more?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nMountain Peak boosted revenue with our program. Similar to ${data.companyName}.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 4,
      delayDays: 10,
      subject: 'Last Follow-Up Before Season Starts',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Last check-in for ${data.companyName} before the busy season.</p>
          <p>Options:</p>
          <ul>
            <li>Get set up now</li>
            <li>Revisit next season</li>
            <li>Pause communications</li>
          </ul>
          <p>Let me know!</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nLast check before season. Still interested in ${data.companyName} insurance?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
  ],
  'fitness-nurture': [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: 'Welcome to Daily Event Insurance - Fitness Protection Solutions',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Thank you for your interest in Daily Event Insurance for ${data.companyName}!</p>
          <p>Fitness businesses need reliable, flexible coverage. We make it simple.</p>
          <p><strong>Estimated monthly revenue: $${data.estimatedRevenue.toFixed(2)}</strong></p>
          <p>Let's talk about protecting your clients.</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nThank you for interest in ${data.companyName}. Est. revenue: $${data.estimatedRevenue.toFixed(2)}/month.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 2,
      delayDays: 2,
      subject: 'Fitness Insurance FAQs',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Following up for ${data.companyName}.</p>
          <p>Common fitness business questions:</p>
          <ul>
            <li>Class-by-class coverage</li>
            <li>Personal training sessions</li>
            <li>Group event protection</li>
          </ul>
          <p>What fits your needs best?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nQuestions about ${data.companyName}?\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 3,
      delayDays: 5,
      subject: 'Success Story: FitLife Studios Revenue Growth',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>FitLife Studios (like ${data.companyName}) saw great results:</p>
          <ul>
            <li>92% client opt-in</li>
            <li>Easy integration</li>
            <li>Strong revenue growth</li>
          </ul>
          <p>Want similar results?</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nFitLife grew revenue with us. Like ${data.companyName}.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
    {
      stepNumber: 4,
      delayDays: 10,
      subject: 'Final Check-In for ${data.companyName}',
      getHtml: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.contactName},</h2>
          <p>Last follow-up for ${data.companyName}.</p>
          <p>Your options:</p>
          <ul>
            <li>Schedule a demo</li>
            <li>Get more info</li>
            <li>Pause emails</li>
          </ul>
          <p>Let me know!</p>
          <p>Best regards,<br>The Daily Event Insurance Team</p>
        </div>
      `,
      getText: (data) => `Hi ${data.contactName},\n\nFinal check for ${data.companyName}.\n\nBest regards,\nThe Daily Event Insurance Team`,
    },
  ],
}

/**
 * Start an email sequence for a lead
 */
export async function startSequence(
  leadId: string,
  vertical: SequenceType,
  email: string,
  contactName: string,
  companyName: string,
  estimatedRevenue: number
): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    const sequenceSteps = sequences[vertical]
    if (!sequenceSteps) {
      return { success: false, error: `Unknown sequence type: ${vertical}` }
    }

    const sequenceData: SequenceData = {
      contactName,
      companyName,
      estimatedRevenue,
      vertical,
    }

    // Create sequence record
    const [sequence] = await db.insert(emailSequences).values({
      leadId,
      sequenceType: vertical,
      currentStep: 0,
      totalSteps: sequenceSteps.length,
      status: 'active',
      metadata: JSON.stringify(sequenceData),
    }).returning()

    // Schedule all emails in the sequence
    const now = new Date()
    for (const step of sequenceSteps) {
      const sendAt = new Date(now)
      sendAt.setDate(sendAt.getDate() + step.delayDays)

      await db.insert(scheduledEmails).values({
        sequenceId: sequence.id,
        leadId,
        to: email,
        subject: step.subject,
        htmlContent: step.getHtml(sequenceData),
        textContent: step.getText(sequenceData),
        scheduledFor: sendAt,
        status: 'pending',
        stepNumber: step.stepNumber,
        metadata: JSON.stringify({ vertical, stepNumber: step.stepNumber }),
      })
    }

    console.log(`[Sequences] Started ${vertical} sequence for lead ${leadId}`)
    return { success: true }
  } catch (error) {
    console.error('[Sequences] Error starting sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Pause an active sequence
 */
export async function pauseSequence(leadId: string): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    await db
      .update(emailSequences)
      .set({ status: 'paused', updatedAt: new Date() })
      .where(and(eq(emailSequences.leadId, leadId), eq(emailSequences.status, 'active')))

    console.log(`[Sequences] Paused sequence for lead ${leadId}`)
    return { success: true }
  } catch (error) {
    console.error('[Sequences] Error pausing sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get sequence status for a lead
 */
export async function getSequenceStatus(leadId: string): Promise<{
  sequence?: any
  scheduledEmails?: any[]
  error?: string
}> {
  if (!db) {
    return { error: 'Database not configured' }
  }

  try {
    const [sequence] = await db
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.leadId, leadId))
      .limit(1)

    if (!sequence) {
      return { error: 'Sequence not found' }
    }

    const emails = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.sequenceId, sequence.id))

    return {
      sequence,
      scheduledEmails: emails,
    }
  } catch (error) {
    console.error('[Sequences] Error getting sequence status:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Resume a paused sequence
 */
export async function resumeSequence(leadId: string): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    await db
      .update(emailSequences)
      .set({ status: 'active', updatedAt: new Date() })
      .where(and(eq(emailSequences.leadId, leadId), eq(emailSequences.status, 'paused')))

    console.log(`[Sequences] Resumed sequence for lead ${leadId}`)
    return { success: true }
  } catch (error) {
    console.error('[Sequences] Error resuming sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Complete a sequence
 */
export async function completeSequence(leadId: string): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    await db
      .update(emailSequences)
      .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
      .where(eq(emailSequences.leadId, leadId))

    console.log(`[Sequences] Completed sequence for lead ${leadId}`)
    return { success: true }
  } catch (error) {
    console.error('[Sequences] Error completing sequence:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
