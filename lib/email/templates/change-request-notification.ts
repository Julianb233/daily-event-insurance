/**
 * Email templates for change request notifications
 */

export interface ChangeRequestEmailData {
  partnerName: string
  contactName: string
  requestNumber: string
  requestType: 'branding' | 'content' | 'both'
  status: 'approved' | 'rejected'
  reviewNotes?: string
  rejectionReason?: string
  dashboardUrl?: string
}

/**
 * Generate HTML email for change request status update
 */
export function getChangeRequestStatusEmail(data: ChangeRequestEmailData): string {
  const isApproved = data.status === 'approved'
  const statusColor = isApproved ? '#059669' : '#dc2626'
  const statusBg = isApproved ? '#ecfdf5' : '#fef2f2'
  const statusText = isApproved ? 'Approved' : 'Rejected'
  const statusIcon = isApproved ? '✓' : '✗'

  const dashboardUrl = data.dashboardUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://dailyeventinsurance.com'

  const requestTypeLabel = {
    branding: 'Branding',
    content: 'Content',
    both: 'Branding & Content',
  }[data.requestType] || 'Change'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Change Request ${statusText}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">

  <!-- Header -->
  <div style="background: linear-gradient(to right, #14b8a6, #0d9488); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Change Request Update</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Request #${data.requestNumber}</p>
  </div>

  <!-- Content -->
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">

    <p style="margin-top: 0;">Hi ${data.contactName},</p>

    <p>Your ${requestTypeLabel.toLowerCase()} change request for <strong>${data.partnerName}</strong> has been reviewed.</p>

    <!-- Status Badge -->
    <div style="text-align: center; margin: 25px 0;">
      <div style="display: inline-block; background: ${statusBg}; border: 2px solid ${statusColor}; border-radius: 12px; padding: 20px 40px;">
        <span style="font-size: 32px; color: ${statusColor};">${statusIcon}</span>
        <p style="color: ${statusColor}; font-size: 20px; font-weight: 600; margin: 10px 0 0 0;">${statusText}</p>
      </div>
    </div>

    <!-- Request Details -->
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">Request Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Request Number:</td>
          <td style="padding: 8px 0; color: #111827; font-weight: 500;">#${data.requestNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Request Type:</td>
          <td style="padding: 8px 0; color: #111827; font-weight: 500;">${requestTypeLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Status:</td>
          <td style="padding: 8px 0;">
            <span style="background: ${statusBg}; color: ${statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">
              ${statusText}
            </span>
          </td>
        </tr>
      </table>
    </div>

    ${isApproved ? `
    <!-- Approved Message -->
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #065f46;">
        <strong>Great news!</strong> Your requested changes have been approved and will be applied to your microsite shortly.
      </p>
    </div>
    ${data.reviewNotes ? `
    <div style="margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #374151;">Admin Notes:</h4>
      <p style="margin: 0; color: #6b7280; font-style: italic;">"${data.reviewNotes}"</p>
    </div>
    ` : ''}
    ` : `
    <!-- Rejected Message -->
    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #991b1b;">
        <strong>Unfortunately</strong>, we were unable to approve your change request at this time.
      </p>
    </div>
    ${data.rejectionReason ? `
    <div style="margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #374151;">Reason:</h4>
      <p style="margin: 0; color: #6b7280;">${data.rejectionReason}</p>
    </div>
    ` : ''}
    ${data.reviewNotes ? `
    <div style="margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #374151;">Additional Notes:</h4>
      <p style="margin: 0; color: #6b7280; font-style: italic;">"${data.reviewNotes}"</p>
    </div>
    ` : ''}
    <p style="color: #6b7280;">
      If you have questions about this decision or would like to submit a revised request, please contact our support team.
    </p>
    `}

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardUrl}/partner/dashboard"
         style="display: inline-block; padding: 14px 28px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
        View in Dashboard
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
      If you have any questions, please contact our support team at
      <a href="mailto:support@dailyeventinsurance.com" style="color: #0d9488;">support@dailyeventinsurance.com</a>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.</p>
    <p style="margin: 5px 0 0 0;">
      <a href="${dashboardUrl}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a>
      &nbsp;|&nbsp;
      <a href="${dashboardUrl}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
    </p>
  </div>
</body>
</html>
`
}

/**
 * Generate plain text email for change request status update
 */
export function getChangeRequestStatusText(data: ChangeRequestEmailData): string {
  const isApproved = data.status === 'approved'
  const statusText = isApproved ? 'APPROVED' : 'REJECTED'
  const dashboardUrl = data.dashboardUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://dailyeventinsurance.com'

  const requestTypeLabel = {
    branding: 'Branding',
    content: 'Content',
    both: 'Branding & Content',
  }[data.requestType] || 'Change'

  let text = `
Change Request Update - Daily Event Insurance
============================================

Hi ${data.contactName},

Your ${requestTypeLabel.toLowerCase()} change request for ${data.partnerName} has been reviewed.

STATUS: ${statusText}

Request Details:
- Request Number: #${data.requestNumber}
- Request Type: ${requestTypeLabel}
`

  if (isApproved) {
    text += `
Great news! Your requested changes have been approved and will be applied to your microsite shortly.
`
    if (data.reviewNotes) {
      text += `
Admin Notes: "${data.reviewNotes}"
`
    }
  } else {
    text += `
Unfortunately, we were unable to approve your change request at this time.
`
    if (data.rejectionReason) {
      text += `
Reason: ${data.rejectionReason}
`
    }
    if (data.reviewNotes) {
      text += `
Additional Notes: "${data.reviewNotes}"
`
    }
    text += `
If you have questions about this decision or would like to submit a revised request, please contact our support team.
`
  }

  text += `
View in Dashboard: ${dashboardUrl}/partner/dashboard

---
If you have any questions, please contact our support team at support@dailyeventinsurance.com

© ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.
`

  return text.trim()
}

/**
 * Get email subject for change request notification
 */
export function getChangeRequestSubject(data: ChangeRequestEmailData): string {
  const statusText = data.status === 'approved' ? 'Approved' : 'Rejected'
  return `Change Request #${data.requestNumber} ${statusText} - Daily Event Insurance`
}
