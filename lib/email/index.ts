/**
 * Email Service
 *
 * Centralized email functionality for Daily Event Insurance
 */

export { sendEmail, emailConfig } from "./client"
export type { EmailConfig, EmailMessage, EmailAttachment, SendResult } from "./client"

export {
  generatePolicyConfirmationHtml,
  generatePolicyConfirmationText,
} from "./templates/policy-confirmation"
export type { PolicyConfirmationData } from "./templates/policy-confirmation"

import { sendEmail } from "./client"
import {
  generatePolicyConfirmationHtml,
  generatePolicyConfirmationText,
  PolicyConfirmationData,
} from "./templates/policy-confirmation"

/**
 * Send policy confirmation email to customer
 */
export async function sendPolicyConfirmationEmail(data: PolicyConfirmationData) {
  const result = await sendEmail({
    to: data.customerEmail,
    subject: `Policy Confirmation - ${data.policyNumber} | Daily Event Insurance`,
    html: generatePolicyConfirmationHtml(data),
    text: generatePolicyConfirmationText(data),
  })

  if (result.success) {
    console.log(`[Email] Policy confirmation sent to ${data.customerEmail}`, result.messageId)
  } else {
    console.error(`[Email] Failed to send policy confirmation to ${data.customerEmail}:`, result.error)
  }

  return result
}
