import * as React from "react"

// Base email styles for consistent branding across all emails
export const emailStyles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    background-color: #ffffff;
  `,
  header: `
    background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
    padding: 32px 24px;
    text-align: center;
  `,
  logo: `
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: -0.5px;
  `,
  body: `
    padding: 32px 24px;
    background-color: #ffffff;
  `,
  heading: `
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
    line-height: 1.3;
  `,
  paragraph: `
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin: 0 0 16px 0;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 8px;
    margin: 16px 0;
  `,
  secondaryButton: `
    display: inline-block;
    background-color: #F3F4F6;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 6px;
    margin: 8px 0;
  `,
  infoBox: `
    background-color: #F0FDFA;
    border: 1px solid #99F6E4;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  `,
  warningBox: `
    background-color: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  `,
  errorBox: `
    background-color: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  `,
  successBox: `
    background-color: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  `,
  footer: `
    background-color: #F9FAFB;
    padding: 24px;
    text-align: center;
    border-top: 1px solid #E5E7EB;
  `,
  footerText: `
    font-size: 12px;
    color: #6B7280;
    margin: 0 0 8px 0;
  `,
  footerLink: `
    color: #14B8A6;
    text-decoration: none;
  `,
  divider: `
    border: none;
    border-top: 1px solid #E5E7EB;
    margin: 24px 0;
  `,
  label: `
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 4px 0;
  `,
  value: `
    font-size: 16px;
    color: #111827;
    margin: 0 0 16px 0;
  `,
  badge: {
    pending: `
      display: inline-block;
      background-color: #FEF3C7;
      color: #92400E;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
    `,
    approved: `
      display: inline-block;
      background-color: #D1FAE5;
      color: #065F46;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
    `,
    rejected: `
      display: inline-block;
      background-color: #FEE2E2;
      color: #991B1B;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
    `,
    completed: `
      display: inline-block;
      background-color: #CCFBF1;
      color: #0F766E;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
    `,
    in_review: `
      display: inline-block;
      background-color: #DBEAFE;
      color: #1E40AF;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
    `,
  },
}

export interface BaseEmailProps {
  previewText?: string
  children: React.ReactNode
}

export function BaseEmailTemplate({ previewText, children }: BaseEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {previewText && (
          <title>{previewText}</title>
        )}
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#F3F4F6" }}>
        {/* Preview text (hidden) */}
        {previewText && (
          <div style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
            {previewText}
            {/* Prevent Gmail from showing other content as preview */}
            {"\u200C".repeat(150)}
          </div>
        )}

        {/* Email wrapper */}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#F3F4F6", padding: "24px 0" }}
        >
          <tr>
            <td align="center">
              {/* Main container */}
              <table
                role="presentation"
                width="600"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Header */}
                <tr>
                  <td style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", padding: "32px 24px", textAlign: "center" }}>
                    <a
                      href={baseUrl}
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#ffffff",
                        textDecoration: "none",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Daily Event Insurance
                    </a>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
                    {children}
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: "#F9FAFB", padding: "24px", textAlign: "center", borderTop: "1px solid #E5E7EB" }}>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px 0" }}>
                      Daily Event Insurance Partner Portal
                    </p>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px 0" }}>
                      <a href={`${baseUrl}/partner/dashboard`} style={{ color: "#14B8A6", textDecoration: "none" }}>
                        Partner Dashboard
                      </a>
                      {" | "}
                      <a href={`${baseUrl}/partner/settings`} style={{ color: "#14B8A6", textDecoration: "none" }}>
                        Settings
                      </a>
                      {" | "}
                      <a href={`${baseUrl}/support`} style={{ color: "#14B8A6", textDecoration: "none" }}>
                        Support
                      </a>
                    </p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "16px 0 0 0" }}>
                      You received this email because you are a registered partner.
                      <br />
                      <a href={`${baseUrl}/unsubscribe`} style={{ color: "#9CA3AF", textDecoration: "underline" }}>
                        Manage email preferences
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

// Helper function to render email to HTML string
export function renderEmailToHtml(component: React.ReactElement): string {
  // Simple server-side rendering for emails
  const ReactDOMServer = require("react-dom/server")
  return "<!DOCTYPE html>" + ReactDOMServer.renderToStaticMarkup(component)
}

// Helper to generate plain text version from HTML
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
}
