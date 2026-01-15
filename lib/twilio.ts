/**
 * Twilio SMS Integration Library
 * Handles sending and receiving SMS messages
 */

import twilio from "twilio"

// Configuration check
export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  )
}

// Get Twilio client
function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !phoneNumber) {
    throw new Error("Twilio configuration incomplete")
  }

  const client = twilio(accountSid, authToken)

  return { client, phoneNumber }
}

// Send SMS message (lowercase export alias)
export async function sendSms(options: {
  to: string
  body: string
  mediaUrl?: string[]
  statusCallbackUrl?: string
}): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  return sendSMS({
    to: options.to,
    message: options.body,
    statusCallbackUrl: options.statusCallbackUrl,
  })
}

// Send templated SMS
export async function sendTemplatedSms(
  to: string,
  templateName: string,
  variables: Record<string, string>
): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  const template = SMS_TEMPLATES[templateName as keyof typeof SMS_TEMPLATES]
  if (!template) {
    return {
      success: false,
      error: `Template "${templateName}" not found`,
    }
  }

  // Replace variables in template
  let message = template.content
  for (const [key, value] of Object.entries(variables)) {
    message = message.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  }

  return sendSMS({ to, message })
}

// Send SMS message (main function)
export async function sendSMS(options: {
  to: string
  message: string
  leadId?: string
  statusCallbackUrl?: string
}): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  try {
    // Check configuration
    if (!isTwilioConfigured()) {
      console.warn("[Twilio] Not configured, returning mock response")
      return {
        success: true,
        messageSid: `mock_${Date.now()}`,
        status: "sent",
      }
    }

    const { client, phoneNumber } = getClient()

    // Format phone number
    const formattedTo = formatPhoneNumber(options.to)

    // Build message options
    const messageOptions: any = {
      body: options.message,
      to: formattedTo,
      from: phoneNumber,
    }

    // Add status callback if provided
    if (options.statusCallbackUrl) {
      messageOptions.statusCallback = options.statusCallbackUrl
    }

    // Send the message
    const message = await client.messages.create(messageOptions)

    console.log(`[Twilio] SMS sent: ${message.sid} to ${formattedTo}`)

    return {
      success: true,
      messageSid: message.sid,
      status: message.status,
    }
  } catch (error: any) {
    console.error("[Twilio] Send SMS failed:", error)

    // Parse Twilio error
    let errorMessage = error.message || "Failed to send SMS"
    if (error.code === 21211) {
      errorMessage = "Invalid phone number format"
    } else if (error.code === 21608) {
      errorMessage = "Phone number is not a valid SMS destination"
    } else if (error.code === 21610) {
      errorMessage = "Recipient has unsubscribed from SMS"
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) return false

  return twilio.validateRequest(authToken, signature, url, params)
}

// Parse incoming SMS webhook
export function parseIncomingSMS(body: Record<string, string>): {
  from: string
  to: string
  message: string
  messageSid: string
  numMedia: number
  mediaUrls: string[]
} {
  const mediaUrls: string[] = []
  const numMedia = parseInt(body.NumMedia || "0", 10)

  for (let i = 0; i < numMedia; i++) {
    const mediaUrl = body[`MediaUrl${i}`]
    if (mediaUrl) {
      mediaUrls.push(mediaUrl)
    }
  }

  return {
    from: body.From || "",
    to: body.To || "",
    message: body.Body || "",
    messageSid: body.MessageSid || "",
    numMedia,
    mediaUrls,
  }
}

// Alias for parseIncomingSMS
export function parseInboundSms(params: Record<string, string>): {
  from: string
  to: string
  body: string
  messageSid: string
  fromCity?: string
  fromState?: string
  fromCountry?: string
} {
  return {
    from: params.From || "",
    to: params.To || "",
    body: params.Body || "",
    messageSid: params.MessageSid || "",
    fromCity: params.FromCity,
    fromState: params.FromState,
    fromCountry: params.FromCountry,
  }
}

// Validate webhook signature
export function validateWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  return verifyWebhookSignature(signature, url, params)
}

// Check if message is an opt-out request
export function isOptOutMessage(message: string): boolean {
  const optOutKeywords = ["stop", "unsubscribe", "cancel", "end", "quit"]
  const lowerMessage = message.toLowerCase().trim()
  return optOutKeywords.includes(lowerMessage)
}

// Check if message is an opt-in request
export function isOptInMessage(message: string): boolean {
  const optInKeywords = ["start", "subscribe", "yes", "unstop"]
  const lowerMessage = message.toLowerCase().trim()
  return optInKeywords.includes(lowerMessage)
}

// Parse delivery status webhook
export function parseDeliveryStatus(body: Record<string, string>): {
  messageSid: string
  status: string
  errorCode?: string
  errorMessage?: string
} {
  return {
    messageSid: body.MessageSid || "",
    status: body.MessageStatus || body.SmsStatus || "",
    errorCode: body.ErrorCode,
    errorMessage: body.ErrorMessage,
  }
}

// Format phone number to E.164
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, "")

  // If already in E.164 format
  if (cleaned.startsWith("+")) {
    return cleaned
  }

  // Remove leading 1 if present and re-add with +
  const digits = cleaned.replace(/^1/, "")

  // US number (10 digits)
  if (digits.length === 10) {
    return `+1${digits}`
  }

  // Already has country code
  if (digits.length > 10) {
    return `+${digits}`
  }

  // Return as-is for international
  return `+${digits}`
}

// Generate TwiML response for incoming SMS
export function generateTwimlResponse(message?: string): string {
  if (!message) {
    return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  }

  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
}

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// SMS templates
export const SMS_TEMPLATES = {
  initial_outreach: {
    id: "initial_outreach",
    name: "Initial Outreach",
    content:
      "Hi! This is Daily Event Insurance. We'd love to discuss how our partnership program can help grow your business. When's a good time to chat?",
  },
  follow_up: {
    id: "follow_up",
    name: "Follow-up",
    content:
      "Hi! Just following up on our conversation about Daily Event Insurance. Do you have any questions I can answer?",
  },
  demo_confirmation: {
    id: "demo_confirmation",
    name: "Demo Confirmation",
    content:
      "Looking forward to showing you our platform! Please confirm you're available for our scheduled demo.",
  },
  thank_you: {
    id: "thank_you",
    name: "Thank You",
    content:
      "Thank you for your interest in Daily Event Insurance! We're excited to have you as a partner.",
  },
  callback_reminder: {
    id: "callback_reminder",
    name: "Callback Reminder",
    content:
      "Hi! Just a friendly reminder about our scheduled call. Looking forward to speaking with you soon!",
  },
}
