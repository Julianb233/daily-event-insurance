import { sendEmail, emailConfig, type SendEmailResult } from "./client"
import { renderEmailToHtml, htmlToPlainText } from "./templates/base"
import { ChangeRequestSubmittedEmail } from "./templates/change-request-submitted"
import { ChangeRequestApprovedEmail } from "./templates/change-request-approved"
import { ChangeRequestRejectedEmail } from "./templates/change-request-rejected"
import { ChangeRequestCompletedEmail } from "./templates/change-request-completed"
import { db } from "@/lib/db"
import { partners } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"

/**
 * Notification preference types
 */
interface NotificationPreferences {
  changeRequests: {
    submitted: boolean
    approved: boolean
    rejected: boolean
    completed: boolean
  }
  marketing: boolean
  reports: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  changeRequests: { submitted: true, approved: true, rejected: true, completed: true },
  marketing: true,
  reports: true,
}

/**
 * Get partner notification preferences
 */
async function getPartnerPreferences(partnerId: string): Promise<NotificationPreferences> {
  try {
    if (!db) return DEFAULT_PREFERENCES

    const [partner] = await db
      .select({ notificationPreferences: partners.notificationPreferences })
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)

    if (!partner?.notificationPreferences) return DEFAULT_PREFERENCES

    return {
      ...DEFAULT_PREFERENCES,
      ...(partner.notificationPreferences as Partial<NotificationPreferences>),
    }
  } catch (error) {
    console.error("[Email] Error fetching notification preferences:", error)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Check if a specific notification type is enabled
 */
async function isNotificationEnabled(
  partnerId: string,
  type: "submitted" | "approved" | "rejected" | "completed"
): Promise<boolean> {
  const prefs = await getPartnerPreferences(partnerId)
  return prefs.changeRequests[type] ?? true
}

/**
 * Change request data for notifications
 */
export interface ChangeRequestNotificationData {
  partnerId: string
  partnerName: string
  partnerEmail: string
  requestId: string
  requestNumber: string
  requestType: "branding" | "content" | "both"
  requestedBranding?: Record<string, string> | null
  requestedContent?: Record<string, string> | null
  partnerNotes?: string | null
  reviewNotes?: string | null
  rejectionReason?: string | null
  micrositeSubdomain?: string | null
}

/**
 * Send notification when a change request is submitted
 */
export async function sendChangeRequestSubmittedEmail(
  data: ChangeRequestNotificationData
): Promise<SendEmailResult> {
  const html = renderEmailToHtml(
    ChangeRequestSubmittedEmail({
      partnerName: data.partnerName,
      partnerEmail: data.partnerEmail,
      requestNumber: data.requestNumber,
      requestType: data.requestType,
      submittedAt: new Date(),
      requestedChanges: {
        branding: data.requestedBranding || undefined,
        content: data.requestedContent || undefined,
      },
      partnerNotes: data.partnerNotes || undefined,
      dashboardUrl: `${baseUrl}/partner/dashboard`,
    })
  )

  return sendEmail({
    to: data.partnerEmail,
    subject: `Change Request ${data.requestNumber} Submitted Successfully`,
    html,
    text: htmlToPlainText(html),
    from: emailConfig.from.notifications,
    tags: [
      { name: "category", value: emailConfig.categories.changeRequest },
      { name: "type", value: "submitted" },
      { name: "request_id", value: data.requestId },
    ],
  })
}

/**
 * Send notification when a change request is approved
 */
export async function sendChangeRequestApprovedEmail(
  data: ChangeRequestNotificationData
): Promise<SendEmailResult> {
  const micrositeUrl = data.micrositeSubdomain
    ? `https://${data.micrositeSubdomain}.dailyeventinsurance.com`
    : undefined

  const html = renderEmailToHtml(
    ChangeRequestApprovedEmail({
      partnerName: data.partnerName,
      partnerEmail: data.partnerEmail,
      requestNumber: data.requestNumber,
      requestType: data.requestType,
      approvedAt: new Date(),
      approvedChanges: {
        branding: data.requestedBranding || undefined,
        content: data.requestedContent || undefined,
      },
      reviewNotes: data.reviewNotes || undefined,
      dashboardUrl: `${baseUrl}/partner/dashboard`,
      micrositeUrl,
    })
  )

  return sendEmail({
    to: data.partnerEmail,
    subject: `Great News! Change Request ${data.requestNumber} Approved`,
    html,
    text: htmlToPlainText(html),
    from: emailConfig.from.notifications,
    tags: [
      { name: "category", value: emailConfig.categories.changeRequest },
      { name: "type", value: "approved" },
      { name: "request_id", value: data.requestId },
    ],
  })
}

/**
 * Send notification when a change request is rejected
 */
export async function sendChangeRequestRejectedEmail(
  data: ChangeRequestNotificationData
): Promise<SendEmailResult> {
  if (!data.rejectionReason) {
    console.warn("[Email] No rejection reason provided for rejected change request")
  }

  const html = renderEmailToHtml(
    ChangeRequestRejectedEmail({
      partnerName: data.partnerName,
      partnerEmail: data.partnerEmail,
      requestNumber: data.requestNumber,
      requestType: data.requestType,
      rejectedAt: new Date(),
      rejectionReason: data.rejectionReason || "Please contact support for more information.",
      requestedChanges: {
        branding: data.requestedBranding || undefined,
        content: data.requestedContent || undefined,
      },
      dashboardUrl: `${baseUrl}/partner/dashboard`,
    })
  )

  return sendEmail({
    to: data.partnerEmail,
    subject: `Update on Change Request ${data.requestNumber}`,
    html,
    text: htmlToPlainText(html),
    from: emailConfig.from.notifications,
    tags: [
      { name: "category", value: emailConfig.categories.changeRequest },
      { name: "type", value: "rejected" },
      { name: "request_id", value: data.requestId },
    ],
  })
}

/**
 * Send notification when changes are applied to the microsite
 */
export async function sendChangeRequestCompletedEmail(
  data: ChangeRequestNotificationData
): Promise<SendEmailResult> {
  const micrositeUrl = data.micrositeSubdomain
    ? `https://${data.micrositeSubdomain}.dailyeventinsurance.com`
    : `${baseUrl}/partner/microsite`

  const html = renderEmailToHtml(
    ChangeRequestCompletedEmail({
      partnerName: data.partnerName,
      partnerEmail: data.partnerEmail,
      requestNumber: data.requestNumber,
      requestType: data.requestType,
      completedAt: new Date(),
      appliedChanges: {
        branding: data.requestedBranding || undefined,
        content: data.requestedContent || undefined,
      },
      micrositeUrl,
      dashboardUrl: `${baseUrl}/partner/dashboard`,
    })
  )

  return sendEmail({
    to: data.partnerEmail,
    subject: `Your Changes Are Live! (${data.requestNumber})`,
    html,
    text: htmlToPlainText(html),
    from: emailConfig.from.notifications,
    tags: [
      { name: "category", value: emailConfig.categories.changeRequest },
      { name: "type", value: "completed" },
      { name: "request_id", value: data.requestId },
    ],
  })
}

/**
 * Send notification to admin when a new change request is submitted
 */
export async function sendAdminNewRequestNotification(
  data: ChangeRequestNotificationData,
  adminEmail: string
): Promise<SendEmailResult> {
  const adminUrl = `${baseUrl}/admin/change-requests?id=${data.requestId}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Change Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #14B8A6, #0D9488); padding: 24px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">New Change Request</h1>
    </div>
    <div style="padding: 24px;">
      <p style="color: #374151; margin: 0 0 16px;">A new change request has been submitted and requires review.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Request Number:</td>
          <td style="padding: 8px 0; color: #111827; font-weight: 600;">${data.requestNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Partner:</td>
          <td style="padding: 8px 0; color: #111827;">${data.partnerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type:</td>
          <td style="padding: 8px 0; color: #111827;">${data.requestType.charAt(0).toUpperCase() + data.requestType.slice(1)} Changes</td>
        </tr>
      </table>

      ${data.partnerNotes ? `
      <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px; text-transform: uppercase;">Partner Notes</p>
        <p style="color: #374151; margin: 0; font-style: italic;">"${data.partnerNotes}"</p>
      </div>
      ` : ""}

      <div style="text-align: center; margin: 24px 0;">
        <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6, #0D9488); color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Review Request
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`

  return sendEmail({
    to: adminEmail,
    subject: `[Action Required] New Change Request from ${data.partnerName}`,
    html,
    text: `New change request ${data.requestNumber} from ${data.partnerName} requires review. View at: ${adminUrl}`,
    from: emailConfig.from.notifications,
    tags: [
      { name: "category", value: emailConfig.categories.changeRequest },
      { name: "type", value: "admin_notification" },
      { name: "request_id", value: data.requestId },
    ],
  })
}

/**
 * Helper to send the appropriate notification based on status change
 */
export async function sendChangeRequestStatusNotification(
  status: "submitted" | "approved" | "rejected" | "completed",
  data: ChangeRequestNotificationData
): Promise<SendEmailResult> {
  switch (status) {
    case "submitted":
      return sendChangeRequestSubmittedEmail(data)
    case "approved":
      return sendChangeRequestApprovedEmail(data)
    case "rejected":
      return sendChangeRequestRejectedEmail(data)
    case "completed":
      return sendChangeRequestCompletedEmail(data)
    default:
      throw new Error(`Unknown status: ${status}`)
  }
}
