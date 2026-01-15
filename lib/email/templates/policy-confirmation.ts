/**
 * Policy Confirmation Email Template
 *
 * Sent to customers after successful policy purchase
 */

export interface PolicyConfirmationData {
  customerName: string
  customerEmail: string
  policyNumber: string
  quoteNumber: string
  eventType: string
  eventDate: string
  eventLocation?: string
  participants: number
  coverageType: string
  premium: string
  effectiveDate: string
  expirationDate: string
  receiptUrl?: string
  supportEmail?: string
  supportPhone?: string
}

/**
 * Generate HTML email content
 */
export function generatePolicyConfirmationHtml(data: PolicyConfirmationData): string {
  const formattedEventDate = new Date(data.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedEffectiveDate = new Date(data.effectiveDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedExpirationDate = new Date(data.expirationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Policy Confirmation - ${data.policyNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .success-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      margin: 0 auto 20px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success-icon svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .policy-box {
      background-color: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .policy-number {
      font-size: 24px;
      font-weight: 700;
      color: #0d9488;
      margin: 0;
      font-family: 'Monaco', 'Menlo', monospace;
    }
    .policy-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .details-grid {
      display: table;
      width: 100%;
      margin: 20px 0;
    }
    .detail-row {
      display: table-row;
    }
    .detail-label {
      display: table-cell;
      padding: 10px 0;
      color: #64748b;
      font-size: 14px;
      width: 40%;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-value {
      display: table-cell;
      padding: 10px 0;
      font-weight: 500;
      font-size: 14px;
      text-align: right;
      border-bottom: 1px solid #e2e8f0;
    }
    .premium-row .detail-label,
    .premium-row .detail-value {
      color: #0d9488;
      font-size: 16px;
      font-weight: 600;
      border-bottom: none;
    }
    .cta-section {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #14b8a6;
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .info-box {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #1e293b;
    }
    .info-box ul {
      margin: 0;
      padding: 0 0 0 20px;
      color: #64748b;
    }
    .info-box li {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #14b8a6;
      text-decoration: none;
    }
    .support-info {
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <h1>You're Covered!</h1>
        <p>Your insurance policy is now active</p>
      </div>

      <div class="content">
        <p class="greeting">Hi ${data.customerName},</p>
        <p>Thank you for choosing Daily Event Insurance! Your policy has been successfully purchased and is now active.</p>

        <div class="policy-box">
          <div class="policy-label">Policy Number</div>
          <p class="policy-number">${data.policyNumber}</p>
        </div>

        <div class="details-grid">
          <div class="detail-row">
            <span class="detail-label">Event Type</span>
            <span class="detail-value">${data.eventType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Date</span>
            <span class="detail-value">${formattedEventDate}</span>
          </div>
          ${
            data.eventLocation
              ? `
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${data.eventLocation}</span>
          </div>
          `
              : ""
          }
          <div class="detail-row">
            <span class="detail-label">Participants</span>
            <span class="detail-value">${data.participants}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Coverage Type</span>
            <span class="detail-value">${data.coverageType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Coverage Period</span>
            <span class="detail-value">${formattedEffectiveDate} - ${formattedExpirationDate}</span>
          </div>
          <div class="detail-row premium-row">
            <span class="detail-label">Total Premium</span>
            <span class="detail-value">$${data.premium}</span>
          </div>
        </div>

        ${
          data.receiptUrl
            ? `
        <div class="cta-section">
          <a href="${data.receiptUrl}" class="cta-button">View Payment Receipt</a>
        </div>
        `
            : ""
        }

        <div class="info-box">
          <h3>What's Next?</h3>
          <ul>
            <li>Save this email for your records</li>
            <li>Your policy documents will be available in your account</li>
            <li>Present your policy number if needed at your event</li>
            <li>Contact us if you need to make any changes</li>
          </ul>
        </div>

        <div class="info-box">
          <h3>Need to File a Claim?</h3>
          <ul>
            <li>Report any incident within 24 hours</li>
            <li>Visit dailyeventinsurance.com/claims</li>
            <li>Have your policy number ready</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>This is an automated confirmation. Please do not reply to this email.</p>
        <div class="support-info">
          <p>
            Need help? Contact us at<br>
            <a href="mailto:${data.supportEmail || "support@dailyeventinsurance.com"}">${data.supportEmail || "support@dailyeventinsurance.com"}</a>
            ${data.supportPhone ? ` | ${data.supportPhone}` : ""}
          </p>
        </div>
        <p style="margin-top: 15px;">
          &copy; ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text email content
 */
export function generatePolicyConfirmationText(data: PolicyConfirmationData): string {
  const formattedEventDate = new Date(data.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
POLICY CONFIRMATION
===================

Hi ${data.customerName},

Thank you for choosing Daily Event Insurance! Your policy has been successfully purchased and is now active.

POLICY DETAILS
--------------
Policy Number: ${data.policyNumber}
Event Type: ${data.eventType}
Event Date: ${formattedEventDate}
${data.eventLocation ? `Location: ${data.eventLocation}` : ""}
Participants: ${data.participants}
Coverage Type: ${data.coverageType}
Total Premium: $${data.premium}

WHAT'S NEXT
-----------
- Save this email for your records
- Your policy documents will be available in your account
- Present your policy number if needed at your event
- Contact us if you need to make any changes

NEED TO FILE A CLAIM?
---------------------
- Report any incident within 24 hours
- Visit dailyeventinsurance.com/claims
- Have your policy number ready

${data.receiptUrl ? `View Payment Receipt: ${data.receiptUrl}` : ""}

SUPPORT
-------
Email: ${data.supportEmail || "support@dailyeventinsurance.com"}
${data.supportPhone ? `Phone: ${data.supportPhone}` : ""}

---
This is an automated confirmation. Please do not reply to this email.
(c) ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.
  `.trim()
}
