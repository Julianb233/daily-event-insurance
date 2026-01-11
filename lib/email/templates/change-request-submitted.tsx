import * as React from "react"
import { BaseEmailTemplate, emailStyles } from "./base"

export interface ChangeRequestSubmittedEmailProps {
  partnerName: string
  partnerEmail: string
  requestNumber: string
  requestType: "branding" | "content" | "both"
  submittedAt: Date
  requestedChanges: {
    branding?: Record<string, string>
    content?: Record<string, string>
  }
  partnerNotes?: string
  dashboardUrl: string
}

export function ChangeRequestSubmittedEmail({
  partnerName,
  requestNumber,
  requestType,
  submittedAt,
  requestedChanges,
  partnerNotes,
  dashboardUrl,
}: ChangeRequestSubmittedEmailProps) {
  const requestTypeLabel = {
    branding: "Branding",
    content: "Content",
    both: "Branding & Content",
  }[requestType]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <BaseEmailTemplate previewText={`Change Request ${requestNumber} Submitted Successfully`}>
      {/* Success icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#D1FAE5",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "32px" }}>✓</span>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0", textAlign: "center" }}>
        Change Request Submitted
      </h1>

      {/* Intro */}
      <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#374151", margin: "0 0 24px 0", textAlign: "center" }}>
        Hi {partnerName}, your change request has been submitted successfully and is now pending review.
      </p>

      {/* Request details box */}
      <div style={{ backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Request Number
              </p>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#0F766E", margin: 0 }}>
                {requestNumber}
              </p>
            </td>
            <td style={{ paddingBottom: "12px", textAlign: "right" }}>
              <span style={{ ...parseStyles(emailStyles.badge.pending) }}>
                Pending Review
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <hr style={{ border: "none", borderTop: "1px solid #99F6E4", margin: "12px 0" }} />
            </td>
          </tr>
          <tr>
            <td>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Request Type
              </p>
              <p style={{ fontSize: "16px", color: "#111827", margin: 0 }}>
                {requestTypeLabel} Changes
              </p>
            </td>
            <td style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Submitted
              </p>
              <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>
                {formatDate(submittedAt)}
              </p>
            </td>
          </tr>
        </table>
      </div>

      {/* Requested changes summary */}
      {(requestedChanges.branding || requestedChanges.content) && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0" }}>
            Requested Changes
          </h2>

          {requestedChanges.branding && Object.keys(requestedChanges.branding).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Branding Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(requestedChanges.branding).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requestedChanges.content && Object.keys(requestedChanges.content).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Content Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(requestedChanges.content).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Partner notes */}
      {partnerNotes && (
        <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "16px", margin: "16px 0" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 8px 0" }}>
            Your Notes
          </p>
          <p style={{ fontSize: "14px", color: "#374151", margin: 0, fontStyle: "italic" }}>
            &quot;{partnerNotes}&quot;
          </p>
        </div>
      )}

      {/* What's next */}
      <div style={{ margin: "24px 0" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 12px 0" }}>
          What Happens Next?
        </h2>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
          <li style={{ marginBottom: "8px" }}>Our team will review your request within 1-2 business days</li>
          <li style={{ marginBottom: "8px" }}>You&apos;ll receive an email when your request is approved or if we need more information</li>
          <li style={{ marginBottom: "8px" }}>Once approved, changes will be applied to your microsite automatically</li>
        </ol>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={dashboardUrl}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600,
            textDecoration: "none",
            padding: "14px 28px",
            borderRadius: "8px",
          }}
        >
          View Request Status
        </a>
      </div>

      {/* Help text */}
      <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center", margin: "24px 0 0 0" }}>
        Have questions? Reply to this email or contact our partner support team.
      </p>
    </BaseEmailTemplate>
  )
}

// Helper to format field names for display
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .replace(/Url$/, "URL")
}

// Helper to parse style strings (for inline styles in email)
function parseStyles(styleString: string): React.CSSProperties {
  const styles: Record<string, string> = {}
  styleString.split(";").forEach(rule => {
    const [property, value] = rule.split(":").map(s => s.trim())
    if (property && value) {
      const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelCase] = value
    }
  })
  return styles as React.CSSProperties
}

export default ChangeRequestSubmittedEmail
