/**
 * Email Integration - Usage Examples
 * Copy these examples to your application code
 */

import { sendEmail, startSequence, scheduleEmail, pauseSequence } from '@/lib/email'

// ============================================================================
// EXAMPLE 1: Send a Simple Email
// ============================================================================

export async function sendWelcomeEmail(email: string, name: string) {
  const result = await sendEmail({
    to: email,
    subject: 'Welcome to Daily Event Insurance!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining Daily Event Insurance.</p>
        <p>We're excited to help protect your business and customers.</p>
      </div>
    `,
    text: `Welcome, ${name}! Thank you for joining Daily Event Insurance.`,
  })

  if (result.success) {
    console.log('Welcome email sent:', result.id)
  } else {
    console.error('Failed to send welcome email:', result.error)
  }

  return result
}

// ============================================================================
// EXAMPLE 2: Start Nurture Sequence for New Lead
// ============================================================================

export async function handleNewLeadFromForm(formData: {
  id: string
  email: string
  contactName: string
  businessName: string
  vertical: string
  estimatedRevenue: number
}) {
  // Map vertical to sequence type
  const sequenceMap: Record<string, 'gym-nurture' | 'wellness-nurture' | 'ski-resort-nurture' | 'fitness-nurture'> = {
    'gym': 'gym-nurture',
    'wellness': 'wellness-nurture',
    'ski-resort': 'ski-resort-nurture',
    'fitness': 'fitness-nurture',
  }

  const sequenceType = sequenceMap[formData.vertical]

  if (!sequenceType) {
    console.warn(`Unknown vertical: ${formData.vertical}`)
    return { success: false, error: 'Unknown vertical' }
  }

  // Start the sequence
  const result = await startSequence(
    formData.id,
    sequenceType,
    formData.email,
    formData.contactName,
    formData.businessName,
    formData.estimatedRevenue
  )

  if (result.success) {
    console.log(`Started ${sequenceType} sequence for lead ${formData.id}`)
  } else {
    console.error('Failed to start sequence:', result.error)
  }

  return result
}

// ============================================================================
// EXAMPLE 3: Schedule Follow-Up Email
// ============================================================================

export async function scheduleFollowUpEmail(
  leadId: string,
  email: string,
  contactName: string,
  daysFromNow: number = 3
) {
  const followUpDate = new Date()
  followUpDate.setDate(followUpDate.getDate() + daysFromNow)

  const result = await scheduleEmail({
    to: email,
    subject: 'Quick follow-up on your insurance quote',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${contactName},</h2>
        <p>I wanted to quickly follow up on the insurance quote we sent you.</p>
        <p>Do you have any questions? I'm here to help!</p>
        <p>Best regards,<br>The Daily Event Insurance Team</p>
      </div>
    `,
    text: `Hi ${contactName}, I wanted to quickly follow up on the insurance quote we sent you. Do you have any questions?`,
    sendAt: followUpDate,
    leadId,
    metadata: {
      type: 'manual-follow-up',
      daysDelay: daysFromNow,
    },
  })

  if (result.success) {
    console.log(`Follow-up email scheduled for ${followUpDate.toISOString()}`)
  } else {
    console.error('Failed to schedule follow-up:', result.error)
  }

  return result
}

// ============================================================================
// EXAMPLE 4: Stop Sequence When Lead Converts
// ============================================================================

export async function handleLeadConversion(
  leadId: string,
  partner: {
    contactEmail: string
    contactName: string
    businessName: string
  }
) {
  // First, pause the nurture sequence
  const pauseResult = await pauseSequence(leadId)

  if (pauseResult.success) {
    console.log(`Paused nurture sequence for lead ${leadId}`)
  } else {
    console.error('Failed to pause sequence:', pauseResult.error)
  }

  // Send partner welcome email
  const welcomeResult = await sendEmail({
    to: partner.contactEmail,
    subject: 'Welcome to the Daily Event Insurance Partnership!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Congratulations, ${partner.contactName}!</h1>
        <p>Welcome to Daily Event Insurance! We're thrilled to have ${partner.businessName} as a partner.</p>
        <h3>Next Steps:</h3>
        <ol>
          <li>Review and sign partnership documents</li>
          <li>Complete integration setup</li>
          <li>Start offering insurance to your customers</li>
        </ol>
        <p>Our team will reach out shortly to guide you through the onboarding process.</p>
        <p>Best regards,<br>The Daily Event Insurance Team</p>
      </div>
    `,
    text: `Congratulations, ${partner.contactName}! Welcome to Daily Event Insurance partnership. Our team will reach out shortly to help you get started.`,
  })

  return {
    sequencePaused: pauseResult.success,
    welcomeSent: welcomeResult.success,
  }
}

// ============================================================================
// EXAMPLE 5: Send Quote Details Email
// ============================================================================

export async function sendQuoteEmail(quote: {
  customerEmail: string
  customerName: string
  quoteNumber: string
  premium: number
  coverageType: string
  eventDate: Date
  eventType: string
}) {
  const result = await sendEmail({
    to: quote.customerEmail,
    subject: `Your Insurance Quote #${quote.quoteNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Insurance Quote for ${quote.customerName}</h2>
        <p>Thank you for requesting a quote from Daily Event Insurance!</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Quote Details</h3>
          <p><strong>Quote Number:</strong> ${quote.quoteNumber}</p>
          <p><strong>Coverage Type:</strong> ${quote.coverageType}</p>
          <p><strong>Event Type:</strong> ${quote.eventType}</p>
          <p><strong>Event Date:</strong> ${quote.eventDate.toLocaleDateString()}</p>
          <p><strong>Premium:</strong> $${quote.premium.toFixed(2)}</p>
        </div>

        <p>This quote is valid for 30 days. To accept this quote and purchase coverage, click the link below:</p>
        <a href="https://dailyeventinsurance.com/quotes/${quote.quoteNumber}"
           style="display: inline-block; background: #14B8A6; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Accept Quote
        </a>

        <p>Questions? Reply to this email or call us at (555) 123-4567.</p>
        <p>Best regards,<br>The Daily Event Insurance Team</p>
      </div>
    `,
    text: `
Insurance Quote #${quote.quoteNumber}

Coverage Type: ${quote.coverageType}
Event Type: ${quote.eventType}
Event Date: ${quote.eventDate.toLocaleDateString()}
Premium: $${quote.premium.toFixed(2)}

This quote is valid for 30 days.
Visit https://dailyeventinsurance.com/quotes/${quote.quoteNumber} to accept.

Questions? Call (555) 123-4567
    `.trim(),
  })

  return result
}

// ============================================================================
// EXAMPLE 6: Send Policy Confirmation Email
// ============================================================================

export async function sendPolicyConfirmation(policy: {
  customerEmail: string
  customerName: string
  policyNumber: string
  coverageType: string
  effectiveDate: Date
  expirationDate: Date
  policyDocument?: string
}) {
  const attachments = policy.policyDocument
    ? [{
        filename: `policy-${policy.policyNumber}.pdf`,
        content: policy.policyDocument, // Base64 or Buffer
        contentType: 'application/pdf',
      }]
    : []

  const result = await sendEmail({
    to: policy.customerEmail,
    subject: `Your Insurance Policy #${policy.policyNumber} is Active`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Policy Confirmation</h2>
        <p>Dear ${policy.customerName},</p>
        <p>Your insurance policy is now active! Below are your policy details:</p>

        <div style="background: #e0f7f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Policy Information</h3>
          <p><strong>Policy Number:</strong> ${policy.policyNumber}</p>
          <p><strong>Coverage Type:</strong> ${policy.coverageType}</p>
          <p><strong>Effective Date:</strong> ${policy.effectiveDate.toLocaleDateString()}</p>
          <p><strong>Expiration Date:</strong> ${policy.expirationDate.toLocaleDateString()}</p>
        </div>

        ${policy.policyDocument ? '<p>Your policy document is attached to this email.</p>' : ''}

        <p>Keep this email and your policy document for your records.</p>
        <p>To file a claim, visit https://dailyeventinsurance.com/claims or call us at (555) 123-4567.</p>

        <p>Best regards,<br>The Daily Event Insurance Team</p>
      </div>
    `,
    text: `
Policy Confirmation - #${policy.policyNumber}

Dear ${policy.customerName},

Your insurance policy is now active!

Policy Number: ${policy.policyNumber}
Coverage Type: ${policy.coverageType}
Effective: ${policy.effectiveDate.toLocaleDateString()}
Expires: ${policy.expirationDate.toLocaleDateString()}

${policy.policyDocument ? 'Your policy document is attached.' : ''}

To file a claim: https://dailyeventinsurance.com/claims
Questions? Call (555) 123-4567
    `.trim(),
    attachments,
  })

  return result
}

// ============================================================================
// EXAMPLE 7: Batch Email Sending (with rate limiting)
// ============================================================================

export async function sendBatchEmails(
  recipients: Array<{ email: string; name: string; data: any }>,
  template: (name: string, data: any) => { subject: string; html: string; text: string }
) {
  const results = []

  for (const recipient of recipients) {
    const { subject, html, text } = template(recipient.name, recipient.data)

    const result = await sendEmail({
      to: recipient.email,
      subject,
      html,
      text,
    })

    results.push({
      email: recipient.email,
      success: result.success,
      error: result.error,
    })

    // Rate limiting is handled automatically by the resend client
    // No need to manually throttle here
  }

  return results
}

// ============================================================================
// EXAMPLE 8: Custom Error Handling
// ============================================================================

export async function sendEmailWithRetry(
  emailOptions: Parameters<typeof sendEmail>[0],
  maxRetries: number = 3
) {
  let lastError: string | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendEmail(emailOptions)

    if (result.success) {
      return result
    }

    lastError = result.error
    console.warn(`Email attempt ${attempt}/${maxRetries} failed:`, result.error)

    if (attempt < maxRetries) {
      // Wait before retrying (exponential backoff is already in resend.ts)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  }
}

// ============================================================================
// INTEGRATION WITH API ROUTES
// ============================================================================

/*
// Example: /app/api/leads/route.ts

import { handleNewLeadFromForm } from '@/lib/email/examples'

export async function POST(request: Request) {
  const data = await request.json()

  // Save lead to database
  const lead = await db.insert(leads).values({
    email: data.email,
    contactName: data.contactName,
    businessName: data.businessName,
    vertical: data.vertical,
    estimatedRevenue: data.estimatedRevenue,
  }).returning()

  // Start email sequence
  await handleNewLeadFromForm({
    id: lead[0].id,
    email: data.email,
    contactName: data.contactName,
    businessName: data.businessName,
    vertical: data.vertical,
    estimatedRevenue: data.estimatedRevenue,
  })

  return Response.json({ success: true, lead: lead[0] })
}
*/

// ============================================================================
// TESTING
// ============================================================================

/*
// Create a test file: scripts/test-email.ts

import { sendWelcomeEmail } from '@/lib/email/examples'

async function testEmail() {
  const result = await sendWelcomeEmail(
    'your-email@example.com',
    'Test User'
  )

  console.log('Test result:', result)
}

testEmail()

// Run with: npx tsx scripts/test-email.ts
*/
