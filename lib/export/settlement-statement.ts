/**
 * Partner Settlement Statement Generator
 *
 * Generates formal settlement statements for partner commissions
 */

export interface SettlementLineItem {
  date: string
  description: string
  policyNumber?: string
  premium: number
  commissionRate: number
  commission: number
}

export interface SettlementStatementData {
  statementNumber: string
  statementDate: Date
  periodStart: Date
  periodEnd: Date
  partner: {
    id: string
    businessName: string
    contactName: string
    email: string
    commissionTier: string
    commissionRate: number
  }
  summary: {
    totalPremium: number
    totalCommission: number
    totalPolicies: number
    previousBalance: number
    paymentsReceived: number
    currentBalance: number
  }
  lineItems: SettlementLineItem[]
  paymentInfo?: {
    method: string
    lastFour?: string
    scheduledDate?: Date
  }
}

/**
 * Generate a statement number
 * Format: STM-YYYYMMDD-XXXXX
 */
export function generateStatementNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  return `STM-${dateStr}-${random}`
}

/**
 * Format currency for statement
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date for statement
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

/**
 * Format short date for line items
 */
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/**
 * Generate HTML settlement statement for printing/PDF
 */
export function generateSettlementStatementHtml(data: SettlementStatementData): string {
  const periodStr = `${formatDate(data.periodStart)} - ${formatDate(data.periodEnd)}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Settlement Statement - ${data.statementNumber}</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1e293b;
      background: white;
    }

    .statement {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.25in;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 15px;
      border-bottom: 2px solid #14b8a6;
      margin-bottom: 20px;
    }

    .company-name {
      font-size: 18pt;
      font-weight: 700;
      color: #14b8a6;
    }

    .company-tagline {
      font-size: 9pt;
      color: #64748b;
    }

    .statement-title {
      text-align: right;
    }

    .statement-title h1 {
      font-size: 14pt;
      color: #1e293b;
    }

    .statement-number {
      font-family: monospace;
      font-size: 10pt;
      color: #0d9488;
      font-weight: 600;
    }

    /* Info sections */
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .info-box {
      width: 48%;
    }

    .info-box h3 {
      font-size: 9pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    .info-box p {
      font-size: 10pt;
      margin-bottom: 3px;
    }

    .info-box .highlight {
      color: #0d9488;
      font-weight: 600;
    }

    /* Summary box */
    .summary-box {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .summary-item {
      text-align: center;
    }

    .summary-label {
      font-size: 8pt;
      color: #64748b;
      text-transform: uppercase;
    }

    .summary-value {
      font-size: 14pt;
      font-weight: 700;
      color: #0d9488;
    }

    /* Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .items-table th {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px;
      text-align: left;
      font-size: 8pt;
      text-transform: uppercase;
      color: #64748b;
    }

    .items-table td {
      border: 1px solid #e2e8f0;
      padding: 8px;
      font-size: 9pt;
    }

    .items-table td.number {
      text-align: right;
      font-family: monospace;
    }

    .items-table tfoot td {
      font-weight: 600;
      background: #f8fafc;
    }

    /* Totals */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .totals-box {
      width: 280px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .totals-row.final {
      border-bottom: 2px solid #0d9488;
      font-weight: 700;
      font-size: 12pt;
      padding: 10px 0;
    }

    .totals-row.final .amount {
      color: #0d9488;
    }

    /* Payment info */
    .payment-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .payment-info h3 {
      font-size: 10pt;
      color: #1e293b;
      margin-bottom: 8px;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }

    .footer-contact {
      text-align: right;
    }

    /* Print styles */
    @media print {
      .statement {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="statement">
    <!-- Header -->
    <header class="header">
      <div>
        <div class="company-name">Daily Event Insurance</div>
        <div class="company-tagline">Partner Commission Statement</div>
      </div>
      <div class="statement-title">
        <h1>Settlement Statement</h1>
        <div class="statement-number">${data.statementNumber}</div>
      </div>
    </header>

    <!-- Info Row -->
    <div class="info-row">
      <div class="info-box">
        <h3>Partner Information</h3>
        <p><strong>${data.partner.businessName}</strong></p>
        <p>${data.partner.contactName}</p>
        <p>${data.partner.email}</p>
        <p>Partner ID: <span class="highlight">${data.partner.id.slice(0, 8)}...</span></p>
      </div>
      <div class="info-box">
        <h3>Statement Details</h3>
        <p>Statement Date: <strong>${formatDate(data.statementDate)}</strong></p>
        <p>Period: <strong>${periodStr}</strong></p>
        <p>Commission Tier: <span class="highlight">${data.partner.commissionTier}</span></p>
        <p>Commission Rate: <span class="highlight">${(data.partner.commissionRate * 100).toFixed(1)}%</span></p>
      </div>
    </div>

    <!-- Summary Box -->
    <div class="summary-box">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Total Policies</div>
          <div class="summary-value">${data.summary.totalPolicies}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Total Premium</div>
          <div class="summary-value">${formatCurrency(data.summary.totalPremium)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Commission Earned</div>
          <div class="summary-value">${formatCurrency(data.summary.totalCommission)}</div>
        </div>
      </div>
    </div>

    <!-- Line Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Policy #</th>
          <th>Premium</th>
          <th>Rate</th>
          <th>Commission</th>
        </tr>
      </thead>
      <tbody>
        ${data.lineItems
          .map(
            (item) => `
        <tr>
          <td>${formatShortDate(item.date)}</td>
          <td>${item.description}</td>
          <td>${item.policyNumber || "-"}</td>
          <td class="number">${formatCurrency(item.premium)}</td>
          <td class="number">${(item.commissionRate * 100).toFixed(1)}%</td>
          <td class="number">${formatCurrency(item.commission)}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3"><strong>Period Totals</strong></td>
          <td class="number">${formatCurrency(data.summary.totalPremium)}</td>
          <td></td>
          <td class="number">${formatCurrency(data.summary.totalCommission)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Totals Section -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="totals-row">
          <span>Previous Balance</span>
          <span class="amount">${formatCurrency(data.summary.previousBalance)}</span>
        </div>
        <div class="totals-row">
          <span>Commission This Period</span>
          <span class="amount">${formatCurrency(data.summary.totalCommission)}</span>
        </div>
        <div class="totals-row">
          <span>Payments Received</span>
          <span class="amount">(${formatCurrency(data.summary.paymentsReceived)})</span>
        </div>
        <div class="totals-row final">
          <span>Current Balance Due</span>
          <span class="amount">${formatCurrency(data.summary.currentBalance)}</span>
        </div>
      </div>
    </div>

    ${
      data.paymentInfo
        ? `
    <!-- Payment Info -->
    <div class="payment-info">
      <h3>Payment Information</h3>
      <p>Payment Method: ${data.paymentInfo.method}${data.paymentInfo.lastFour ? ` (****${data.paymentInfo.lastFour})` : ""}</p>
      ${data.paymentInfo.scheduledDate ? `<p>Scheduled Payment Date: ${formatDate(data.paymentInfo.scheduledDate)}</p>` : ""}
    </div>
    `
        : ""
    }

    <!-- Footer -->
    <footer class="footer">
      <div>
        <p>This statement is for informational purposes only.</p>
        <p>&copy; ${new Date().getFullYear()} Daily Event Insurance - A HiQOR Company</p>
      </div>
      <div class="footer-contact">
        <p>Questions? Contact partner-support@dailyeventinsurance.com</p>
        <p>Statement ID: ${data.statementNumber}</p>
      </div>
    </footer>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate CSV version of settlement statement
 */
export function generateSettlementStatementCsv(data: SettlementStatementData): string {
  const lines: string[] = []

  // Header info
  lines.push("SETTLEMENT STATEMENT")
  lines.push(`Statement Number,${data.statementNumber}`)
  lines.push(`Statement Date,${formatDate(data.statementDate)}`)
  lines.push(`Period,${formatDate(data.periodStart)} - ${formatDate(data.periodEnd)}`)
  lines.push("")
  lines.push("PARTNER INFORMATION")
  lines.push(`Business Name,${data.partner.businessName}`)
  lines.push(`Contact,${data.partner.contactName}`)
  lines.push(`Email,${data.partner.email}`)
  lines.push(`Commission Tier,${data.partner.commissionTier}`)
  lines.push(`Commission Rate,${(data.partner.commissionRate * 100).toFixed(1)}%`)
  lines.push("")
  lines.push("LINE ITEMS")
  lines.push("Date,Description,Policy Number,Premium,Commission Rate,Commission")

  // Line items
  for (const item of data.lineItems) {
    lines.push(
      `${formatShortDate(item.date)},${item.description},${item.policyNumber || ""},${item.premium.toFixed(2)},${(item.commissionRate * 100).toFixed(1)}%,${item.commission.toFixed(2)}`
    )
  }

  lines.push("")
  lines.push("SUMMARY")
  lines.push(`Total Policies,${data.summary.totalPolicies}`)
  lines.push(`Total Premium,${data.summary.totalPremium.toFixed(2)}`)
  lines.push(`Total Commission,${data.summary.totalCommission.toFixed(2)}`)
  lines.push(`Previous Balance,${data.summary.previousBalance.toFixed(2)}`)
  lines.push(`Payments Received,${data.summary.paymentsReceived.toFixed(2)}`)
  lines.push(`Current Balance Due,${data.summary.currentBalance.toFixed(2)}`)

  return lines.join("\n")
}
