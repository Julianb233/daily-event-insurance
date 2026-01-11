import * as React from "react"
import { BaseEmailTemplate } from "./base"

export interface ChangeRequestCompletedEmailProps {
  partnerName: string
  partnerEmail: string
  requestNumber: string
  requestType: "branding" | "content" | "both"
  completedAt: Date
  appliedChanges: {
    branding?: Record<string, string>
    content?: Record<string, string>
  }
  micrositeUrl: string
  dashboardUrl: string
}

export function ChangeRequestCompletedEmail({
  partnerName,
  requestNumber,
  requestType,
  completedAt,
  appliedChanges,
  micrositeUrl,
  dashboardUrl,
}: ChangeRequestCompletedEmailProps) {
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
    <BaseEmailTemplate previewText={`Your microsite has been updated! (${requestNumber})`}>
      {/* Celebration icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#CCFBF1",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "40px" }}>✨</span>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0F766E", margin: "0 0 16px 0", textAlign: "center" }}>
        Your Changes Are Live!
      </h1>

      {/* Intro */}
      <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#374151", margin: "0 0 24px 0", textAlign: "center" }}>
        Hi {partnerName}, your {requestTypeLabel.toLowerCase()} changes have been successfully applied to your microsite.
      </p>

      {/* Request completion box */}
      <div style={{ backgroundColor: "#CCFBF1", border: "1px solid #5EEAD4", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#0F766E", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Request Number
              </p>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#0F766E", margin: 0 }}>
                {requestNumber}
              </p>
            </td>
            <td style={{ paddingBottom: "12px", textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#0F766E",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "9999px",
                }}
              >
                Completed
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <hr style={{ border: "none", borderTop: "1px solid #5EEAD4", margin: "12px 0" }} />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#0F766E", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Changes Applied On
              </p>
              <p style={{ fontSize: "16px", color: "#0F766E", margin: 0 }}>
                {formatDate(completedAt)}
              </p>
            </td>
          </tr>
        </table>
      </div>

      {/* Applied changes summary */}
      {(appliedChanges.branding || appliedChanges.content) && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0" }}>
            Changes Applied
          </h2>

          {appliedChanges.branding && Object.keys(appliedChanges.branding).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Branding Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(appliedChanges.branding).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {appliedChanges.content && Object.keys(appliedChanges.content).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Content Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(appliedChanges.content).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* View your site CTA */}
      <div style={{ backgroundColor: "#F0FDFA", borderRadius: "12px", padding: "24px", margin: "24px 0", textAlign: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#0F766E", margin: "0 0 12px 0" }}>
          Check Out Your Updated Microsite
        </h2>
        <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 20px 0" }}>
          Your changes are now live and visible to your customers.
        </p>
        <a
          href={micrositeUrl}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 600,
            textDecoration: "none",
            padding: "16px 36px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          View Your Microsite →
        </a>
      </div>

      {/* Additional actions */}
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 12px 0" }}>
          Need to make more changes?
        </p>
        <a
          href={dashboardUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#F3F4F6",
            color: "#374151",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "6px",
          }}
        >
          Go to Partner Dashboard
        </a>
      </div>

      {/* Thank you note */}
      <div style={{ textAlign: "center", margin: "32px 0 0 0", padding: "20px 0", borderTop: "1px solid #E5E7EB" }}>
        <p style={{ fontSize: "16px", color: "#374151", margin: 0 }}>
          Thank you for being a valued Daily Event Insurance partner! 🤝
        </p>
      </div>
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

export default ChangeRequestCompletedEmail
