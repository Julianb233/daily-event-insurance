/**
 * Twilio SMS Service
 * Send and receive SMS messages via Twilio
 */

import twilio from "twilio"

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ""
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ""
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ""

const client = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null

export function isTwilioConfigured(): boolean {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER)
}

export interface SendSMSResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendSMS(to: string, body: string): Promise<SendSMSResult> {
  if (!client) {
    console.warn("[Twilio] Not configured, logging SMS instead")
    console.log(`[SMS] To: ${to}, Body: ${body}`)
    return { success: true, messageId: `mock_${Date.now()}` }
  }

  try {
    // Format phone number to E.164
    const formattedTo = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`

    const message = await client.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to: formattedTo
    })

    console.log("[Twilio] SMS sent:", message.sid)
    return { success: true, messageId: message.sid }
  } catch (error: any) {
    console.error("[Twilio] Send SMS error:", error)
    return { success: false, error: error.message }
  }
}

export async function sendTemplateSMS(
  to: string,
  template: "welcome" | "follow_up" | "reminder" | "confirmation",
  vars: Record<string, string>
): Promise<SendSMSResult> {
  const templates: Record<string, string> = {
    welcome: `Hi {{name}}! Thanks for your interest in Daily Event Insurance. We'll be in touch soon to discuss how we can help {{business}} offer coverage to your members.`,
    follow_up: `Hi {{name}}, this is Sarah from Daily Event Insurance following up on our conversation. Let me know if you have any questions!`,
    reminder: `Hi {{name}}, just a reminder about your demo scheduled for {{time}}. Looking forward to speaking with you!`,
    confirmation: `Thanks {{name}}! Your demo is confirmed for {{time}}. You'll receive a calendar invite shortly.`
  }

  let body = templates[template] || templates.welcome

  // Replace variables
  Object.entries(vars).forEach(([key, value]) => {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), value)
  })

  return sendSMS(to, body)
}

export async function lookupPhoneNumber(phone: string): Promise<{
  valid: boolean
  type?: string
  carrier?: string
}> {
  if (!client) {
    return { valid: true }
  }

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`
    const lookup = await client.lookups.v2.phoneNumbers(formattedPhone).fetch()

    return {
      valid: lookup.valid,
      type: lookup.lineTypeIntelligence?.type,
      carrier: lookup.lineTypeIntelligence?.carrierName
    }
  } catch (error) {
    console.error("[Twilio] Lookup error:", error)
    return { valid: false }
  }
}

export const TwilioSMS = {
  send: sendSMS,
  sendTemplate: sendTemplateSMS,
  lookup: lookupPhoneNumber,
  isConfigured: isTwilioConfigured
}
