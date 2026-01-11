import { Resend } from "resend"

// Singleton Resend client
let resendClient: Resend | null = null

/**
 * Get the Resend client instance
 * Lazily initializes the client on first use
 */
export function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY environment variable is not set. " +
        "Please add it to your .env.local file."
      )
    }

    resendClient = new Resend(apiKey)
  }

  return resendClient
}

/**
 * Email configuration
 */
export const emailConfig = {
  // From addresses
  from: {
    noreply: "Daily Event Insurance <noreply@dailyeventinsurance.com>",
    notifications: "Daily Event Insurance <notifications@dailyeventinsurance.com>",
    support: "Daily Event Insurance Support <support@dailyeventinsurance.com>",
  },

  // Reply-to addresses
  replyTo: {
    support: "support@dailyeventinsurance.com",
    partners: "partners@dailyeventinsurance.com",
  },

  // Email categories for analytics
  categories: {
    changeRequest: "change-request",
    onboarding: "onboarding",
    documents: "documents",
    system: "system",
  },
}

/**
 * Email sending result
 */
export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Email sending options
 */
export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  tags?: Array<{ name: string; value: string }>
  scheduledAt?: Date
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const client = getResendClient()

    const result = await client.emails.send({
      from: options.from || emailConfig.from.notifications,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || emailConfig.replyTo.support,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
      tags: options.tags,
      scheduledAt: options.scheduledAt?.toISOString(),
    })

    if (result.error) {
      console.error("[Email] Send failed:", result.error)
      return {
        success: false,
        error: result.error.message,
      }
    }

    console.log("[Email] Sent successfully:", result.data?.id)
    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    console.error("[Email] Unexpected error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send a batch of emails
 */
export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<SendEmailResult[]> {
  const results: SendEmailResult[] = []

  // Send in batches to avoid rate limits
  const batchSize = 10
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(sendEmail))
    results.push(...batchResults)

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return results
}

/**
 * Validate an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
