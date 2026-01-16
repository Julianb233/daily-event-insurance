/**
 * Partner Settlement Statement API
 *
 * GET /api/partner/settlement-statement
 * Generate a settlement statement for the authenticated partner
 *
 * Query params:
 * - period: "current" | "YYYY-MM" (default: current month)
 * - format: "html" | "csv" (default: html)
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, isDbConfigured, partners, policies, commissionPayouts } from "@/lib/db"
import { eq, and, gte, lte, desc } from "drizzle-orm"
import {
  generateSettlementStatementHtml,
  generateSettlementStatementCsv,
  generateStatementNumber,
  SettlementStatementData,
  SettlementLineItem,
} from "@/lib/export/settlement-statement"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "current"
    const format = searchParams.get("format") || "html"

    // Calculate period dates
    const now = new Date()
    let periodStart: Date
    let periodEnd: Date

    if (period === "current") {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    } else {
      // Parse YYYY-MM format
      const [year, month] = period.split("-").map(Number)
      periodStart = new Date(year, month - 1, 1)
      periodEnd = new Date(year, month, 0, 23, 59, 59)
    }

    let statementData: SettlementStatementData

    // Use mock data in dev mode or if DB not configured
    if (!isDbConfigured() || !db) {
      statementData = generateMockStatement((session as any).user, periodStart, periodEnd)
    } else {
      statementData = await generateDatabaseStatement(
        (session as any).user.id,
        periodStart,
        periodEnd
      )
    }

    // Generate output based on format
    if (format === "csv") {
      const csv = generateSettlementStatementCsv(statementData)
      const filename = `settlement-${statementData.statementNumber}.csv`

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }

    // Default: HTML format
    const html = generateSettlementStatementHtml(statementData)
    const filename = `settlement-${statementData.statementNumber}.html`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition":
          searchParams.get("download") === "true"
            ? `attachment; filename="${filename}"`
            : "inline",
      },
    })
  } catch (error) {
    console.error("[Settlement Statement] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate settlement statement" },
      { status: 500 }
    )
  }
}

/**
 * Generate statement from database
 */
async function generateDatabaseStatement(
  userId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<SettlementStatementData> {
  // Get partner info
  const [partner] = await db!
    .select()
    .from(partners)
    .where(eq(partners.userId, userId))
    .limit(1)

  if (!partner) {
    throw new Error("Partner not found")
  }

  // Get policies for the period
  const periodPolicies = await db!
    .select()
    .from(policies)
    .where(
      and(
        eq(policies.partnerId, partner.id),
        gte(policies.createdAt, periodStart),
        lte(policies.createdAt, periodEnd)
      )
    )
    .orderBy(desc(policies.createdAt))

  // Get previous payouts to calculate balance
  const previousPayouts = await db!
    .select()
    .from(commissionPayouts)
    .where(
      and(
        eq(commissionPayouts.partnerId, partner.id),
        eq(commissionPayouts.status, "completed")
      )
    )

  // Calculate totals
  const totalPremium = periodPolicies.reduce(
    (sum, p) => sum + parseFloat(p.premium || "0"),
    0
  )
  const totalCommission = periodPolicies.reduce(
    (sum, p) => sum + parseFloat(p.commission || "0"),
    0
  )
  const paymentsReceived = previousPayouts.reduce(
    (sum, p) => sum + parseFloat(p.commissionAmount || "0"),
    0
  )

  // Build line items
  const lineItems: SettlementLineItem[] = periodPolicies.map((policy) => ({
    date: policy.createdAt.toISOString(),
    description: `${policy.eventType} - ${policy.customerName}`,
    policyNumber: policy.policyNumber,
    premium: parseFloat(policy.premium || "0"),
    commissionRate: parseFloat(policy.commission || "0") / parseFloat(policy.premium || "1"),
    commission: parseFloat(policy.commission || "0"),
  }))

  // Commission rate based on tier (default to Bronze for now)
  // TODO: Implement tier lookup from partnerTierOverrides table
  const tierRates: Record<string, number> = {
    Bronze: 0.4,
    Silver: 0.45,
    Gold: 0.5,
    Platinum: 0.55,
  }
  const currentTier = "Bronze" // Default tier - would be looked up from partnerTierOverrides
  const commissionRate = tierRates[currentTier] || 0.4

  return {
    statementNumber: generateStatementNumber(),
    statementDate: new Date(),
    periodStart,
    periodEnd,
    partner: {
      id: partner.id,
      businessName: partner.businessName,
      contactName: partner.contactName || "",
      email: partner.contactEmail,
      commissionTier: currentTier,
      commissionRate,
    },
    summary: {
      totalPremium,
      totalCommission,
      totalPolicies: periodPolicies.length,
      previousBalance: 0, // Would calculate from previous periods
      paymentsReceived,
      currentBalance: totalCommission, // Simplified - would be calculated properly
    },
    lineItems,
    paymentInfo: {
      method: "Direct Deposit",
      scheduledDate: new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1, 15),
    },
  }
}

/**
 * Generate mock statement for development
 */
function generateMockStatement(
  user: { id: string; email?: string | null; name?: string | null },
  periodStart: Date,
  periodEnd: Date
): SettlementStatementData {
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

  return {
    statementNumber: generateStatementNumber(),
    statementDate: new Date(),
    periodStart,
    periodEnd,
    partner: {
      id: user.id.slice(0, 8),
      businessName: "Demo Partner Business",
      contactName: user.name || "Partner User",
      email: user.email || "partner@example.com",
      commissionTier: "Silver",
      commissionRate,
    },
    summary: {
      totalPremium,
      totalCommission,
      totalPolicies: lineItems.length,
      previousBalance: 125.5,
      paymentsReceived: 125.5,
      currentBalance: totalCommission,
    },
    lineItems,
    paymentInfo: {
      method: "Direct Deposit",
      lastFour: "1234",
      scheduledDate: new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1, 15),
    },
  }
}
