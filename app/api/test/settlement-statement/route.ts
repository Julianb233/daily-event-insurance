/**
 * Test Settlement Statement API (DEV ONLY)
 *
 * GET /api/test/settlement-statement
 * Test endpoint that bypasses auth for local development
 */

import { NextRequest, NextResponse } from "next/server"
import {
  generateSettlementStatementHtml,
  generateSettlementStatementCsv,
  generateStatementNumber,
  SettlementStatementData,
  SettlementLineItem,
} from "@/lib/export/settlement-statement"

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get("format") || "html"

  // Generate mock statement data
  const periodStart = new Date(2025, 0, 1) // Jan 1, 2025
  const periodEnd = new Date(2025, 0, 31, 23, 59, 59) // Jan 31, 2025

  const mockPolicies = [
    { date: "2025-01-02", type: "Gym Day Pass", customer: "Alice Smith", policy: "POL-20250102-00001", premium: 12.99 },
    { date: "2025-01-05", type: "Rock Climbing", customer: "Bob Johnson", policy: "POL-20250105-00002", premium: 24.99 },
    { date: "2025-01-08", type: "Equipment Rental", customer: "Carol Lee", policy: "POL-20250108-00003", premium: 18.99 },
    { date: "2025-01-10", type: "Adventure Tour", customer: "David Chen", policy: "POL-20250110-00004", premium: 45.99 },
    { date: "2025-01-12", type: "Gym Day Pass", customer: "Eva Martinez", policy: "POL-20250112-00005", premium: 12.99 },
    { date: "2025-01-14", type: "Trampoline Park", customer: "Frank Kim", policy: "POL-20250114-00006", premium: 15.99 },
    { date: "2025-01-15", type: "Rock Climbing", customer: "Grace Park", policy: "POL-20250115-00007", premium: 24.99 },
  ]

  const commissionRate = 0.45 // Silver tier
  const lineItems: SettlementLineItem[] = mockPolicies.map((p) => ({
    date: p.date,
    description: `${p.type} - ${p.customer}`,
    policyNumber: p.policy,
    premium: p.premium,
    commissionRate,
    commission: p.premium * commissionRate,
  }))

  const totalPremium = lineItems.reduce((sum, item) => sum + item.premium, 0)
  const totalCommission = lineItems.reduce((sum, item) => sum + item.commission, 0)

  const statementData: SettlementStatementData = {
    statementNumber: generateStatementNumber(),
    statementDate: new Date(),
    periodStart,
    periodEnd,
    partner: {
      id: "test-001",
      businessName: "Test Fitness Center",
      contactName: "John Partner",
      email: "john@testfitness.com",
      commissionTier: "Silver",
      commissionRate,
    },
    summary: {
      totalPremium,
      totalCommission,
      totalPolicies: lineItems.length,
      previousBalance: 125.50,
      paymentsReceived: 125.50,
      currentBalance: totalCommission,
    },
    lineItems,
    paymentInfo: {
      method: "Direct Deposit",
      lastFour: "1234",
      scheduledDate: new Date(2025, 1, 15), // Feb 15, 2025
    },
  }

  // Generate output based on format
  if (format === "csv") {
    const csv = generateSettlementStatementCsv(statementData)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="test-settlement.csv"`,
      },
    })
  }

  // Default: HTML format
  const html = generateSettlementStatementHtml(statementData)
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
