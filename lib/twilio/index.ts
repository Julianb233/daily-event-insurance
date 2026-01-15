/**
 * Twilio SMS Service
 * Handles SMS sending, receiving, and conversation management
 */

import twilio from "twilio"

// Environment configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ""
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ""
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ""
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || ""

// Validate configuration
export function isTwilioConfigured(): boolean {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && (TWILIO_PHONE_NUMBER || TWILIO_MESSAGING_SERVICE_SID))
}

// Twilio client singleton
let twilioClient: twilio.Twilio | null = null

function getClient(): twilio.Twilio {
  if (!twilioClient) {
    if (!isTwilioConfigured()) {
      throw new Error("Twilio not configured")
    }
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  }
  return twilioClient
}

// Types
export interface SendSmsParams {
  to: string
  body: string
  mediaUrl?: string[]
  statusCallback?: string
}

export interface SendSmsResult {
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}

export interface InboundSmsMessage {
  messageSid: string
  from: string
  to: string
  body: string
  numMedia: number
  mediaUrls?: string[]
  fromCity?: string
  fromState?: string
  fromZip?: string
  fromCountry?: string
}

export interface SmsConversation {
  leadId: string
  phoneNumber: string
  messages: {
    direction: "inbound" | "outbound"
    body: string
    timestamp: Date
    status?: string
  }[]
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // If already has country code
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }

  // Add US country code if 10 digits
  if (digits.length === 10) {
    return `+1${digits}`
  }

  // Return as-is with + prefix if it looks valid
  if (digits.length >= 10) {
    return `+${digits}`
  }

  throw new Error(`Invalid phone number format: ${phone}`)
}

/**
 * Send an SMS message
 */
export async function sendSms(params: SendSmsParams): Promise<SendSmsResult> {
  if (!isTwilioConfigured()) {
    console.warn("[Twilio] Not configured, SMS not sent")
    return {
      success: false,
      error: "Twilio not configured",
    }
  }

  try {
    const client = getClient()
    const formattedTo = formatPhoneNumber(params.to)

    const messageParams: {
      to: string
      body: string
      from?: string
      messagingServiceSid?: string
      mediaUrl?: string[]
      statusCallback?: string
    } = {
      to: formattedTo,
      body: params.body,
    }

    // Use messaging service if available, otherwise use phone number
    if (TWILIO_MESSAGING_SERVICE_SID) {
      messageParams.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID
    } else {
      messageParams.from = TWILIO_PHONE_NUMBER
    }

    // Add media URLs if provided
    if (params.mediaUrl && params.mediaUrl.length > 0) {
      messageParams.mediaUrl = params.mediaUrl
    }

    // Add status callback if provided
    if (params.statusCallback) {
      messageParams.statusCallback = params.statusCallback
    }

    const message = await client.messages.create(messageParams)

    console.log(`[Twilio] SMS sent: ${message.sid} to ${formattedTo}`)

    return {
      success: true,
      messageSid: message.sid,
      status: message.status,
    }
  } catch (error: any) {
    console.error("[Twilio] SMS send error:", error)
    return {
      success: false,
      error: error.message || "Failed to send SMS",
    }
  }
}

/**
 * Send a templated SMS message
 */
export async function sendTemplatedSms(
  to: string,
  templateName: string,
  variables: Record<string, string>
): Promise<SendSmsResult> {
  // SMS templates
  const templates: Record<string, string> = {
    welcome: `Hi {{name}}! Welcome to Daily Event Insurance. We help businesses like {{business}} offer same-day coverage to members. Reply STOP to opt out.`,

    follow_up: `Hi {{name}}, this is Sarah from Daily Event Insurance. I wanted to follow up on our conversation about offering insurance at {{business}}. Do you have any questions? Reply STOP to opt out.`,

    demo_reminder: `Reminder: Your demo with Daily Event Insurance is scheduled for {{date}} at {{time}}. Looking forward to speaking with you! Reply STOP to opt out.`,

    callback_confirmation: `Got it! I'll call you back on {{date}} at {{time}}. Talk soon! - Sarah, Daily Event Insurance. Reply STOP to opt out.`,

    info_link: `Thanks for your interest! Here's more info about our partner program: https://dailyeventinsurance.com/partners. Reply STOP to opt out.`,

    proposal_sent: `Hi {{name}}, I just sent over the partnership proposal for {{business}}. Let me know if you have any questions! Reply STOP to opt out.`,
  }

  const template = templates[templateName]
  if (!template) {
    return {
      success: false,
      error: `Unknown template: ${templateName}`,
    }
  }

  // Replace variables in template
  let body = template
  for (const [key, value] of Object.entries(variables)) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value)
  }

  return sendSms({ to, body })
}

/**
 * Parse an inbound SMS webhook from Twilio
 */
export function parseInboundSms(body: Record<string, string>): InboundSmsMessage {
  const numMedia = parseInt(body.NumMedia || "0", 10)
  const mediaUrls: string[] = []

  // Collect media URLs
  for (let i = 0; i < numMedia; i++) {
    const url = body[`MediaUrl${i}`]
    if (url) {
      mediaUrls.push(url)
    }
  }

  return {
    messageSid: body.MessageSid || body.SmsSid || "",
    from: body.From || "",
    to: body.To || "",
    body: body.Body || "",
    numMedia,
    mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
    fromCity: body.FromCity,
    fromState: body.FromState,
    fromZip: body.FromZip,
    fromCountry: body.FromCountry,
  }
}

/**
 * Generate TwiML response for SMS
 */
export function generateTwimlResponse(message?: string): string {
  if (!message) {
    // Empty response (just acknowledge)
    return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  }

  // Escape XML special characters
  const escapedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapedMessage}</Message></Response>`
}

/**
 * Validate Twilio webhook signature
 */
export function validateWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  if (!isTwilioConfigured()) {
    console.warn("[Twilio] Cannot validate signature - not configured")
    return false
  }

  try {
    return twilio.validateRequest(
      TWILIO_AUTH_TOKEN,
      signature,
      url,
      params
    )
  } catch (error) {
    console.error("[Twilio] Signature validation error:", error)
    return false
  }
}

/**
 * Check if a message is an opt-out request
 */
export function isOptOutMessage(body: string): boolean {
  const optOutKeywords = ["stop", "unsubscribe", "cancel", "quit", "end"]
  const normalizedBody = body.toLowerCase().trim()
  return optOutKeywords.includes(normalizedBody)
}

/**
 * Check if a message is an opt-in request
 */
export function isOptInMessage(body: string): boolean {
  const optInKeywords = ["start", "yes", "unstop", "subscribe"]
  const normalizedBody = body.toLowerCase().trim()
  return optInKeywords.includes(normalizedBody)
}

/**
 * Get message status description
 */
export function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    queued: "Message queued for delivery",
    sending: "Message is being sent",
    sent: "Message sent to carrier",
    delivered: "Message delivered",
    undelivered: "Message could not be delivered",
    failed: "Message failed to send",
    receiving: "Inbound message being received",
    received: "Inbound message received",
  }
  return descriptions[status] || status
}

// Export configuration
export {
  TWILIO_ACCOUNT_SID,
  TWILIO_PHONE_NUMBER,
  TWILIO_MESSAGING_SERVICE_SID,
}
