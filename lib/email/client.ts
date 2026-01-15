/**
 * Email Service Client
 *
 * Provider-agnostic email service that can be configured to use
 * Resend, SendGrid, or other email providers.
 */

export interface EmailConfig {
  provider: "resend" | "sendgrid" | "console"
  apiKey?: string
  fromEmail: string
  fromName: string
}

export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType?: string
}

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

// Email configuration
export const emailConfig: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailConfig["provider"]) || "console",
  apiKey: process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY,
  fromEmail: process.env.EMAIL_FROM || "noreply@dailyeventinsurance.com",
  fromName: process.env.EMAIL_FROM_NAME || "Daily Event Insurance",
}

/**
 * Send email via Resend
 */
async function sendViaResend(message: EmailMessage): Promise<SendResult> {
  if (!emailConfig.apiKey) {
    throw new Error("RESEND_API_KEY is not configured")
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
        attachments: message.attachments?.map((a) => ({
          filename: a.filename,
          content: typeof a.content === "string" ? a.content : a.content.toString("base64"),
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      }
    }

    const result = await response.json()
    return {
      success: true,
      messageId: result.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send email via SendGrid
 */
async function sendViaSendGrid(message: EmailMessage): Promise<SendResult> {
  if (!emailConfig.apiKey) {
    throw new Error("SENDGRID_API_KEY is not configured")
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: (Array.isArray(message.to) ? message.to : [message.to]).map((email) => ({ email })),
          },
        ],
        from: {
          email: emailConfig.fromEmail,
          name: emailConfig.fromName,
        },
        subject: message.subject,
        content: [
          { type: "text/plain", value: message.text || "" },
          { type: "text/html", value: message.html },
        ],
        reply_to: message.replyTo ? { email: message.replyTo } : undefined,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        error: error || `HTTP ${response.status}`,
      }
    }

    return {
      success: true,
      messageId: response.headers.get("x-message-id") || undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Console-based email (for development/testing)
 */
async function sendViaConsole(message: EmailMessage): Promise<SendResult> {
  console.log("\n========== EMAIL ==========")
  console.log(`To: ${Array.isArray(message.to) ? message.to.join(", ") : message.to}`)
  console.log(`From: ${emailConfig.fromName} <${emailConfig.fromEmail}>`)
  console.log(`Subject: ${message.subject}`)
  console.log("---")
  console.log(message.text || "No text content")
  console.log("===========================\n")

  return {
    success: true,
    messageId: `console-${Date.now()}`,
  }
}

/**
 * Send an email using the configured provider
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  console.log(`[Email] Sending via ${emailConfig.provider} to: ${message.to}`)

  switch (emailConfig.provider) {
    case "resend":
      return sendViaResend(message)
    case "sendgrid":
      return sendViaSendGrid(message)
    case "console":
    default:
      return sendViaConsole(message)
  }
}
