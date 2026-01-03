/**
 * Notification Module
 * Handles sending notifications to sales team via email (Slack webhook optional)
 */

import { Resend } from 'resend'

// Lazy initialize Resend to avoid build-time errors when API key is missing
let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export interface NewLeadNotification {
  leadId: string
  vertical: string
  contactName: string
  email: string
  businessName: string
  estimatedRevenue: number
  leadScore: {
    score: number
    tier: string
  }
  formData: any
}

/**
 * Send notification to sales team about new lead
 * Uses Resend for email (fast and reliable)
 */
export async function notifySalesTeam(notification: NewLeadNotification): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { leadId, vertical, contactName, email, businessName, estimatedRevenue, leadScore, formData } = notification

    // Sales team email - configure this in env or hardcode for now
    const salesEmail = process.env.SALES_NOTIFICATION_EMAIL || 'julian@dailyeventinsurance.com'

    // Build email content
    const subject = `🔥 New ${leadScore.tier.toUpperCase()} Lead: ${businessName} - $${estimatedRevenue.toLocaleString()}/yr`

    const htmlContent = buildEmailHTML(notification)
    const textContent = buildEmailText(notification)

    // Send email via Resend
    const emailResult = await getResend().emails.send({
      from: 'leads@dailyeventinsurance.com',
      to: salesEmail,
      subject,
      html: htmlContent,
      text: textContent,
    })

    if (emailResult.error) {
      console.error('[Notifications] Email send failed:', emailResult.error)
      return {
        success: false,
        error: emailResult.error.message
      }
    }

    console.log(`[Notifications] Sales team notified about lead ${leadId} via email (${emailResult.data.id})`)

    // Optional: Send Slack notification if webhook is configured
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(notification).catch(err => {
        console.error('[Notifications] Slack notification failed:', err)
        // Don't fail the whole operation if Slack fails
      })
    }

    return { success: true }
  } catch (error) {
    console.error('[Notifications] Failed to notify sales team:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Build HTML email for sales notification
 */
function buildEmailHTML(notification: NewLeadNotification): string {
  const { leadId, vertical, contactName, email, businessName, estimatedRevenue, leadScore, formData } = notification

  const tierColors: Record<string, string> = {
    priority: '#ef4444',
    hot: '#f97316',
    warm: '#eab308',
    cold: '#3b82f6'
  }

  const tierColor = tierColors[leadScore.tier] || '#6b7280'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .score-badge { display: inline-block; background: ${tierColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .info-row { margin: 15px 0; padding: 12px; background: #f9fafb; border-radius: 6px; }
    .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 16px; color: #111827; }
    .revenue { font-size: 24px; font-weight: 700; color: #14B8A6; }
    .button { display: inline-block; background: #14B8A6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0 0 10px 0; font-size: 24px;">New Lead Submitted</h1>
      <div class="score-badge">${leadScore.tier} Lead - Score: ${leadScore.score}/100</div>
    </div>

    <div class="content">
      <div class="info-row">
        <div class="label">Business Name</div>
        <div class="value">${businessName || 'Not provided'}</div>
      </div>

      <div class="info-row">
        <div class="label">Contact Name</div>
        <div class="value">${contactName}</div>
      </div>

      <div class="info-row">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>

      ${formData.phone ? `
      <div class="info-row">
        <div class="label">Phone</div>
        <div class="value"><a href="tel:${formData.phone}">${formData.phone}</a></div>
      </div>
      ` : ''}

      <div class="info-row">
        <div class="label">Vertical</div>
        <div class="value">${vertical.charAt(0).toUpperCase() + vertical.slice(1)}</div>
      </div>

      <div class="info-row">
        <div class="label">Estimated Annual Revenue</div>
        <div class="revenue">$${estimatedRevenue.toLocaleString()}</div>
      </div>

      ${formData.message ? `
      <div class="info-row">
        <div class="label">Message</div>
        <div class="value">${formData.message}</div>
      </div>
      ` : ''}

      ${formData.currentCoverage ? `
      <div class="info-row">
        <div class="label">Current Coverage</div>
        <div class="value">${formData.currentCoverage}</div>
      </div>
      ` : ''}

      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads/${leadId}" class="button">
        View Lead Details →
      </a>
    </div>

    <div class="footer">
      Lead ID: ${leadId}<br>
      Daily Event Insurance CRM
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Build plain text email for sales notification
 */
function buildEmailText(notification: NewLeadNotification): string {
  const { leadId, vertical, contactName, email, businessName, estimatedRevenue, leadScore, formData } = notification

  return `
NEW ${leadScore.tier.toUpperCase()} LEAD SUBMITTED
Score: ${leadScore.score}/100

CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business: ${businessName || 'Not provided'}
Contact: ${contactName}
Email: ${email}
${formData.phone ? `Phone: ${formData.phone}\n` : ''}
Vertical: ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}

REVENUE POTENTIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estimated Annual: $${estimatedRevenue.toLocaleString()}

${formData.message ? `MESSAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${formData.message}\n\n` : ''}
${formData.currentCoverage ? `Current Coverage: ${formData.currentCoverage}\n\n` : ''}
View lead details: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads/${leadId}

Lead ID: ${leadId}
Daily Event Insurance CRM
  `.trim()
}

/**
 * Send Slack notification (optional)
 */
async function sendSlackNotification(notification: NewLeadNotification): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const { vertical, contactName, businessName, estimatedRevenue, leadScore } = notification

  const tierEmojis: Record<string, string> = {
    priority: '🔥',
    hot: '⚡',
    warm: '🌟',
    cold: '📋'
  }

  const emoji = tierEmojis[leadScore.tier] || '📋'

  const slackPayload = {
    text: `${emoji} New ${leadScore.tier.toUpperCase()} Lead`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} New ${leadScore.tier.toUpperCase()} Lead - $${estimatedRevenue.toLocaleString()}/yr`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Business:*\n${businessName || 'Not provided'}`
          },
          {
            type: 'mrkdwn',
            text: `*Contact:*\n${contactName}`
          },
          {
            type: 'mrkdwn',
            text: `*Vertical:*\n${vertical}`
          },
          {
            type: 'mrkdwn',
            text: `*Score:*\n${leadScore.score}/100`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Lead'
            },
            url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads/${notification.leadId}`,
            style: 'primary'
          }
        ]
      }
    ]
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackPayload)
  })

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`)
  }

  console.log(`[Notifications] Slack notification sent for lead ${notification.leadId}`)
}
