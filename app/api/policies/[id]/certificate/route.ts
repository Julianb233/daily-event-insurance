import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { format } from "date-fns"

/**
 * GET /api/policies/[id]/certificate
 * Generate and download a policy certificate
 *
 * Returns HTML certificate that can be printed to PDF
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Policy ID is required" },
        { status: 400 }
      )
    }

    let policy: {
      policyNumber: string
      eventType: string
      eventDate: string
      participants: number
      coverageType: string
      premium: string
      effectiveDate: string
      expirationDate: string
      customerName: string
      customerEmail: string
      location?: string
    }

    // Get policy from database if configured
    if (isSupabaseServerConfigured()) {
      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: "Policy not found" },
          { status: 404 }
        )
      }

      policy = {
        policyNumber: data.policy_number,
        eventType: data.event_type,
        eventDate: data.event_date,
        participants: data.participants,
        coverageType: data.coverage_type,
        premium: data.premium,
        effectiveDate: data.effective_date,
        expirationDate: data.expiration_date,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        location: data.location,
      }
    } else {
      // Mock policy for demo
      policy = {
        policyNumber: `POL-${format(new Date(), "yyyyMMdd")}-DEMO1`,
        eventType: "Fitness Class",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        participants: 20,
        coverageType: "liability",
        premium: "150.00",
        effectiveDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        customerName: "Demo User",
        customerEmail: "demo@example.com",
        location: "San Francisco, CA",
      }
    }

    // Generate HTML certificate
    const certificateHtml = generateCertificateHtml(policy)

    return new NextResponse(certificateHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="certificate-${policy.policyNumber}.html"`,
      },
    })
  } catch (error) {
    console.error("[Certificate API] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    )
  }
}

/**
 * Generate HTML certificate
 */
function generateCertificateHtml(policy: {
  policyNumber: string
  eventType: string
  eventDate: string
  participants: number
  coverageType: string
  premium: string
  effectiveDate: string
  expirationDate: string
  customerName: string
  customerEmail: string
  location?: string
}): string {
  const coverageLabels: Record<string, string> = {
    liability: "General Liability",
    equipment: "Equipment Coverage",
    cancellation: "Event Cancellation",
  }

  const coverageLimits: Record<string, string> = {
    liability: "$1,000,000",
    equipment: "$50,000",
    cancellation: "$100,000",
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Insurance - ${policy.policyNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: white;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .certificate {
      max-width: 800px;
      margin: 0 auto;
      padding: 60px;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #14b8a6;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #14b8a6;
      letter-spacing: 2px;
    }
    .title {
      font-size: 32px;
      color: #0f172a;
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 4px;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      margin-top: 10px;
    }
    .policy-number {
      font-size: 18px;
      color: #14b8a6;
      margin-top: 15px;
      font-weight: bold;
    }
    .body {
      margin-bottom: 40px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 1px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .info-item {
      margin-bottom: 15px;
    }
    .info-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 16px;
      color: #0f172a;
      font-weight: 500;
    }
    .coverage-box {
      background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
      border: 2px solid #14b8a6;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .coverage-type {
      font-size: 14px;
      color: #0d9488;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .coverage-limit {
      font-size: 42px;
      font-weight: bold;
      color: #0f172a;
      margin: 10px 0;
    }
    .coverage-desc {
      font-size: 14px;
      color: #64748b;
    }
    .declaration {
      background: #f8fafc;
      border-left: 4px solid #14b8a6;
      padding: 20px;
      margin: 30px 0;
      font-size: 14px;
      color: #475569;
    }
    .footer {
      text-align: center;
      border-top: 3px double #14b8a6;
      padding-top: 30px;
      margin-top: 40px;
    }
    .signature-line {
      width: 200px;
      border-bottom: 1px solid #1a1a1a;
      margin: 40px auto 10px;
    }
    .signature-label {
      font-size: 12px;
      color: #64748b;
    }
    .issue-date {
      margin-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      color: rgba(20, 184, 166, 0.05);
      font-weight: bold;
      pointer-events: none;
      z-index: -1;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .certificate {
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">INSURED</div>
  <div class="certificate">
    <div class="header">
      <div class="logo">DAILY EVENT INSURANCE</div>
      <h1 class="title">Certificate of Insurance</h1>
      <p class="subtitle">This certifies that insurance has been issued as described below</p>
      <p class="policy-number">Policy #${policy.policyNumber}</p>
    </div>

    <div class="body">
      <div class="section">
        <h2 class="section-title">Policyholder Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${escapeHtml(policy.customerName)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${escapeHtml(policy.customerEmail)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Event Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Event Type</div>
            <div class="info-value">${formatEventType(policy.eventType)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Event Date</div>
            <div class="info-value">${format(new Date(policy.eventDate), "MMMM d, yyyy")}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Participants</div>
            <div class="info-value">${policy.participants}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Location</div>
            <div class="info-value">${policy.location ? escapeHtml(policy.location) : "As specified"}</div>
          </div>
        </div>
      </div>

      <div class="coverage-box">
        <div class="coverage-type">${coverageLabels[policy.coverageType] || policy.coverageType}</div>
        <div class="coverage-limit">${coverageLimits[policy.coverageType] || "$1,000,000"}</div>
        <div class="coverage-desc">Coverage Limit</div>
      </div>

      <div class="section">
        <h2 class="section-title">Coverage Period</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Effective Date</div>
            <div class="info-value">${format(new Date(policy.effectiveDate), "MMMM d, yyyy")}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Expiration Date</div>
            <div class="info-value">${format(new Date(policy.expirationDate), "MMMM d, yyyy")}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Premium Paid</div>
            <div class="info-value">$${policy.premium}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Policy Status</div>
            <div class="info-value" style="color: #10b981;">ACTIVE</div>
          </div>
        </div>
      </div>

      <div class="declaration">
        <strong>Declaration:</strong> This certificate is issued as a matter of information only and confers no rights upon the certificate holder. This certificate does not amend, extend, or alter the coverage afforded by the policies listed herein.
      </div>
    </div>

    <div class="footer">
      <div class="signature-line"></div>
      <div class="signature-label">Authorized Representative</div>
      <div class="issue-date">
        Certificate issued on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function formatEventType(eventType: string): string {
  return eventType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
