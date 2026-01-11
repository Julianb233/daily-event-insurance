import * as React from "react"
import { BaseEmailTemplate } from "./base"

export interface ChangeRequestApprovedEmailProps {
  partnerName: string
  partnerEmail: string
  requestNumber: string
  requestType: "branding" | "content" | "both"
  approvedAt: Date
  approvedChanges: {
    branding?: Record<string, string>
    content?: Record<string, string>
  }
  reviewNotes?: string
  dashboardUrl: string
  micrositeUrl?: string
}

export function ChangeRequestApprovedEmail({
  partnerName,
  requestNumber,
  requestType,
  approvedAt,
  approvedChanges,
  reviewNotes,
  dashboardUrl,
  micrositeUrl,
}: ChangeRequestApprovedEmailProps) {
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
    <BaseEmailTemplate previewText={`Great news! Your change request ${requestNumber} has been approved`}>
      {/* Success icon */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#D1FAE5",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "40px" }}>🎉</span>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#065F46", margin: "0 0 16px 0", textAlign: "center" }}>
        Your Request is Approved!
      </h1>

      {/* Intro */}
      <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#374151", margin: "0 0 24px 0", textAlign: "center" }}>
        Hi {partnerName}, great news! Your {requestTypeLabel.toLowerCase()} change request has been approved and is ready to be applied.
      </p>

      {/* Request details box */}
      <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Request Number
              </p>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#065F46", margin: 0 }}>
                {requestNumber}
              </p>
            </td>
            <td style={{ paddingBottom: "12px", textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#D1FAE5",
                  color: "#065F46",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "9999px",
                }}
              >
                Approved
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <hr style={{ border: "none", borderTop: "1px solid #BBF7D0", margin: "12px 0" }} />
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
                Approved On
              </p>
              <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>
                {formatDate(approvedAt)}
              </p>
            </td>
          </tr>
        </table>
      </div>

      {/* Approved changes summary */}
      {(approvedChanges.branding || approvedChanges.content) && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0" }}>
            Approved Changes
          </h2>

          {approvedChanges.branding && Object.keys(approvedChanges.branding).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Branding Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(approvedChanges.branding).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {approvedChanges.content && Object.keys(approvedChanges.content).length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
                Content Updates:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151" }}>
                {Object.entries(approvedChanges.content).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "4px" }}>
                    <strong>{formatFieldName(key)}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review notes */}
      {reviewNotes && (
        <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "16px", margin: "16px 0" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#1E40AF", textTransform: "uppercase", margin: "0 0 8px 0" }}>
            Note from Review Team
          </p>
          <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
            {reviewNotes}
          </p>
        </div>
      )}

      {/* What's next */}
      <div style={{ backgroundColor: "#F0FDFA", borderRadius: "8px", padding: "20px", margin: "24px 0" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#0F766E", margin: "0 0 12px 0" }}>
          What Happens Next?
        </h2>
        <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
          Your approved changes will be applied to your microsite automatically. This usually takes just a few minutes.
          Once complete, you&apos;ll receive a confirmation email with a link to view your updated site.
        </p>
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
          View Dashboard
        </a>
        {micrositeUrl && (
          <a
            href={micrositeUrl}
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
            Preview Microsite
          </a>
        )}
      </div>

      {/* Help text */}
      <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center", margin: "24px 0 0 0" }}>
        Thank you for being a Daily Event Insurance partner!
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

export default ChangeRequestApprovedEmail
