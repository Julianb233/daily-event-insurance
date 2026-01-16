/**
 * Twilio Service
 *
 * Handles SMS sending, receiving, and status tracking via Twilio API.
 */

import twilio from "twilio"

// Environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ""
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ""
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ""
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || ""

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured(): boolean {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && (TWILIO_PHONE_NUMBER || TWILIO_MESSAGING_SERVICE_SID))
}

/**
 * Get the Twilio client
 */
function getTwilioClient() {
  if (!isTwilioConfigured()) {
    throw new Error("Twilio is not configured")
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
}

/**
 * SMS Templates for common messages
 */
export const SMS_TEMPLATES: Record<string, string> = {
  // Lead follow-up templates
  follow_up_initial: `Hi {{name}}, this is Sarah from Daily Event Insurance. I just tried calling about offering insurance coverage at {{business}}. When's a good time to connect?`,

  follow_up_voicemail: `Hi {{name}}, I left you a voicemail about Daily Event Insurance. We help businesses like {{business}} offer same-day coverage to members. Reply with a good time to chat!`,

  follow_up_demo: `Hi {{name}}, looking forward to our demo call! I'll show you how {{business}} can start earning from insurance sales. Any questions before we connect?`,

  // After-call templates
  post_call_positive: `Great chatting today, {{name}}! As discussed, I'm sending over the partner info for {{business}}. Let me know if you have any questions!`,

  post_call_proposal: `Hi {{name}}, thanks for your time today! I've sent the proposal to your email. Partners like {{business}} typically earn $500-2000/month. Let me know your thoughts!`,

  // Reminder templates
  reminder_callback: `Hi {{name}}, just a reminder about our scheduled call today. Looking forward to discussing how {{business}} can offer insurance to members!`,

  reminder_proposal: `Hi {{name}}, following up on the proposal I sent for {{business}}. Have you had a chance to review it? Happy to answer any questions!`,
}

/**
 * Send an SMS message
 */
export async function sendSms(options: {
  to: string
  body: string
  mediaUrl?: string[]
  statusCallback?: string
}): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  try {
    if (!isTwilioConfigured()) {
      return { success: false, error: "Twilio is not configured" }
    }

    const client = getTwilioClient()

    // Format phone number
    const formattedPhone = formatPhoneNumber(options.to)

    const messageOptions: any = {
      to: formattedPhone,
      body: options.body,
    }

    // Use messaging service if available, otherwise use phone number
    if (TWILIO_MESSAGING_SERVICE_SID) {
      messageOptions.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID
    } else {
      messageOptions.from = TWILIO_PHONE_NUMBER
    }

    // Add media if provided
    if (options.mediaUrl && options.mediaUrl.length > 0) {
      messageOptions.mediaUrl = options.mediaUrl
    }

    // Add status callback if provided
    if (options.statusCallback) {
      messageOptions.statusCallback = options.statusCallback
    }

    const message = await client.messages.create(messageOptions)

    return {
      success: true,
      messageSid: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error("[Twilio] Send SMS error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS",
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
): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  const template = SMS_TEMPLATES[templateName]

  if (!template) {
    return { success: false, error: `Template '${templateName}' not found` }
  }

  // Replace variables in template
  let body = template
  for (const [key, value] of Object.entries(variables)) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value)
  }

  return sendSms({ to, body })
}

/**
 * Get message status
 */
export async function getMessageStatus(messageSid: string): Promise<{
  success: boolean
  status?: string
  errorCode?: number
  errorMessage?: string
  error?: string
}> {
  try {
    if (!isTwilioConfigured()) {
      return { success: false, error: "Twilio is not configured" }
    }

    const client = getTwilioClient()
    const message = await client.messages(messageSid).fetch()

    return {
      success: true,
      status: message.status,
      errorCode: message.errorCode ?? undefined,
      errorMessage: message.errorMessage ?? undefined,
    }
  } catch (error) {
    console.error("[Twilio] Get message status error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get message status",
    }
  }
}

/**
 * Fetch message history for a phone number
 */
export async function getMessageHistory(
  phoneNumber: string,
  options: {
    limit?: number
    dateSentAfter?: Date
    dateSentBefore?: Date
  } = {}
): Promise<{
  success: boolean
  messages?: Array<{
    sid: string
    to: string
    from: string
    body: string
    status: string
    direction: string
    dateSent: Date | null
  }>
  error?: string
}> {
  try {
    if (!isTwilioConfigured()) {
      return { success: false, error: "Twilio is not configured" }
    }

    const client = getTwilioClient()
    const formattedPhone = formatPhoneNumber(phoneNumber)

    const fetchOptions: any = {
      to: formattedPhone,
    }

    if (options.limit) {
      fetchOptions.limit = options.limit
    }
    if (options.dateSentAfter) {
      fetchOptions.dateSentAfter = options.dateSentAfter
    }
    if (options.dateSentBefore) {
      fetchOptions.dateSentBefore = options.dateSentBefore
    }

    const messages = await client.messages.list(fetchOptions)

    return {
      success: true,
      messages: messages.map((m) => ({
        sid: m.sid,
        to: m.to,
        from: m.from,
        body: m.body,
        status: m.status,
        direction: m.direction,
        dateSent: m.dateSent,
      })),
    }
  } catch (error) {
    console.error("[Twilio] Get message history error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get message history",
    }
  }
}

/**
 * Validate Twilio webhook signature
 */
export function validateWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  try {
    return twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, params)
  } catch (error) {
    console.error("[Twilio] Signature validation error:", error)
    return false
  }
}

/**
 * Parse incoming SMS webhook
 */
export function parseIncomingSms(body: Record<string, string>): {
  messageSid: string
  from: string
  to: string
  body: string
  numMedia: number
  mediaUrls: string[]
} {
  const numMedia = parseInt(body.NumMedia || "0", 10)
  const mediaUrls: string[] = []

  for (let i = 0; i < numMedia; i++) {
    const url = body[`MediaUrl${i}`]
    if (url) {
      mediaUrls.push(url)
    }
  }

  return {
    messageSid: body.MessageSid || "",
    from: body.From || "",
    to: body.To || "",
    body: body.Body || "",
    numMedia,
    mediaUrls,
  }
}

/**
 * Format phone number to E.164
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Add country code if not present (assume US)
  if (digits.length === 10) {
    return `+1${digits}`
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  } else if (digits.startsWith("+")) {
    return phone // Already formatted
  }

  return `+${digits}`
}

/**
 * Look up phone number information
 */
export async function lookupPhoneNumber(phoneNumber: string): Promise<{
  success: boolean
  phoneNumber?: string
  countryCode?: string
  carrier?: {
    name: string
    type: string
  }
  error?: string
}> {
  try {
    if (!isTwilioConfigured()) {
      return { success: false, error: "Twilio is not configured" }
    }

    const client = getTwilioClient()
    const formattedPhone = formatPhoneNumber(phoneNumber)

    const lookup = await client.lookups.v2.phoneNumbers(formattedPhone).fetch()

    return {
      success: true,
      phoneNumber: lookup.phoneNumber,
      countryCode: lookup.countryCode,
    }
  } catch (error) {
    console.error("[Twilio] Phone lookup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to lookup phone number",
    }
  }
}

/**
 * Alias for parseIncomingSms (for backward compatibility)
 */
export function parseInboundSms(body: Record<string, string>) {
  return parseIncomingSms(body)
}

/**
 * Generate TwiML response
 */
export function generateTwimlResponse(message?: string): string {
  if (!message) {
    return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  }

  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

/**
 * Check if message is an opt-out request
 */
export function isOptOutMessage(message: string): boolean {
  const normalized = message.toLowerCase().trim()
  const optOutKeywords = ['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit']
  return optOutKeywords.includes(normalized)
}

/**
 * Check if message is an opt-in request
 */
export function isOptInMessage(message: string): boolean {
  const normalized = message.toLowerCase().trim()
  const optInKeywords = ['start', 'yes', 'unstop', 'subscribe']
  return optInKeywords.includes(normalized)
}

