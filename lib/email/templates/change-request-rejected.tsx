import * as React from "react"
import { BaseEmailTemplate } from "./base"

export interface ChangeRequestRejectedEmailProps {
  partnerName: string
  partnerEmail: string
  requestNumber: string
  requestType: "branding" | "content" | "both"
  rejectedAt: Date
  rejectionReason: string
  requestedChanges: {
    branding?: Record<string, string>
    content?: Record<string, string>
  }
  dashboardUrl: string
  supportEmail?: string
}

export function ChangeRequestRejectedEmail({
  partnerName,
  requestNumber,
  requestType,
  rejectedAt,
  rejectionReason,
  requestedChanges,
  dashboardUrl,
  supportEmail = "support@dailyeventinsurance.com",
}: ChangeRequestRejectedEmailProps) {
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
    })
  }

  return (
    <BaseEmailTemplate previewText={`Update on your change request ${requestNumber}`}>
      {/* Icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#FEE2E2",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "32px" }}>⚠️</span>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0", textAlign: "center" }}>
        Changes Requested
      </h1>

      {/* Intro */}
      <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#374151", margin: "0 0 24px 0", textAlign: "center" }}>
        Hi {partnerName}, we&apos;ve reviewed your change request and need some adjustments before we can proceed.
      </p>

      {/* Request details box */}
      <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Request Number
              </p>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#991B1B", margin: 0 }}>
                {requestNumber}
              </p>
            </td>
            <td style={{ paddingBottom: "12px", textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#FEE2E2",
                  color: "#991B1B",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "9999px",
                }}
              >
                Changes Needed
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <hr style={{ border: "none", borderTop: "1px solid #FECACA", margin: "12px 0" }} />
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
                Reviewed On
              </p>
              <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>
                {formatDate(rejectedAt)}
              </p>
            </td>
          </tr>
        </table>
      </div>

      {/* Rejection reason */}
      <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#92400E", margin: "0 0 12px 0" }}>
          Reason for Changes Needed
        </h2>
        <p style={{ fontSize: "15px", color: "#374151", margin: 0, lineHeight: 1.6 }}>
          {rejectionReason}
        </p>
      </div>

      {/* Original request summary */}
      {(requestedChanges.branding || requestedChanges.content) && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#6B7280", margin: "0 0 16px 0" }}>
            Your Original Request
          </h2>

          {requestedChanges.branding && Object.keys(requestedChanges.branding).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Branding Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#6B7280" }}>
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
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#6B7280" }}>
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

      {/* What to do next */}
      <div style={{ backgroundColor: "#F0FDFA", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#0F766E", margin: "0 0 12px 0" }}>
          What You Can Do
        </h2>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
          <li style={{ marginBottom: "8px" }}>Review the feedback above to understand what changes are needed</li>
          <li style={{ marginBottom: "8px" }}>Submit a new change request with the updated information</li>
          <li style={{ marginBottom: "8px" }}>If you have questions, contact our support team</li>
        </ol>
      </div>

      {/* CTA Buttons */}
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
            marginRight: "12px",
          }}
        >
          Submit New Request
        </a>
        <a
          href={`mailto:${supportEmail}?subject=Question about ${requestNumber}`}
          style={{
            display: "inline-block",
            backgroundColor: "#F3F4F6",
            color: "#374151",
            fontSize: "16px",
            fontWeight: 500,
            textDecoration: "none",
            padding: "14px 28px",
            borderRadius: "8px",
          }}
        >
          Contact Support
        </a>
      </div>

      {/* Reassurance */}
      <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center", margin: "24px 0 0 0" }}>
        Don&apos;t worry – this is part of our quality assurance process to ensure your microsite looks perfect.
        We&apos;re here to help!
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

export default ChangeRequestRejectedEmail
