import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, policies, partners, claims, commissionPayouts } from "@/lib/db"
import { sql, and, gte, lte, eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest } from "@/lib/api-responses"

// Report types
type ReportType = "revenue" | "commission" | "policy" | "claims" | "partner-performance"

interface ReportParams {
  type: ReportType
  startDate: string
  endDate: string
  format?: "json" | "csv"
}

// Mock data generators for dev mode
function generateMockRevenueReport(startDate: string, endDate: string) {
  const days = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    const premium = Math.floor(Math.random() * 5000) + 1000
    const policies = Math.floor(Math.random() * 50) + 10
    days.push({
      date: dateStr,
      premium,
      policies,
      participants: policies * Math.floor(Math.random() * 20) + 5,
    })
  }

  return {
    type: "revenue",
    period: { startDate, endDate },
    summary: {
      totalPremium: days.reduce((s, d) => s + d.premium, 0),
      totalPolicies: days.reduce((s, d) => s + d.policies, 0),
      totalParticipants: days.reduce((s, d) => s + d.participants, 0),
      avgPremiumPerPolicy: days.length > 0
        ? days.reduce((s, d) => s + d.premium, 0) / days.reduce((s, d) => s + d.policies, 0)
        : 0,
    },
    daily: days,
  }
}

function generateMockCommissionReport(startDate: string, endDate: string) {
  const partners = [
    { partnerId: "p1", partnerName: "Adventure Sports Inc", tier: "Gold" },
    { partnerId: "p2", partnerName: "Mountain Climbers Co", tier: "Silver" },
    { partnerId: "p3", partnerName: "Urban Gym Network", tier: "Silver" },
    { partnerId: "p4", partnerName: "Outdoor Adventures LLC", tier: "Bronze" },
    { partnerId: "p5", partnerName: "Summit Fitness", tier: "Gold" },
  ]

  const data = partners.map(p => ({
    ...p,
    policies: Math.floor(Math.random() * 100) + 20,
    grossRevenue: Math.floor(Math.random() * 20000) + 5000,
    commissionRate: p.tier === "Gold" ? 0.50 : p.tier === "Silver" ? 0.45 : 0.40,
    commissionAmount: 0,
  }))

  data.forEach(d => {
    d.commissionAmount = d.grossRevenue * d.commissionRate
  })

  return {
    type: "commission",
    period: { startDate, endDate },
    summary: {
      totalGrossRevenue: data.reduce((s, d) => s + d.grossRevenue, 0),
      totalCommission: data.reduce((s, d) => s + d.commissionAmount, 0),
      avgCommissionRate: data.length > 0
        ? data.reduce((s, d) => s + d.commissionRate, 0) / data.length
        : 0,
    },
    byPartner: data,
  }
}

function generateMockPolicyReport(startDate: string, endDate: string) {
  const coverageTypes = ["liability", "equipment", "cancellation", "comprehensive"]
  const eventTypes = ["Guided Tour", "Gym Session", "Equipment Rental", "Climbing Session", "Adventure Activity"]

  const byCoverage = coverageTypes.map(type => ({
    coverageType: type,
    count: Math.floor(Math.random() * 200) + 50,
    premium: Math.floor(Math.random() * 30000) + 5000,
  }))

  const byEventType = eventTypes.map(type => ({
    eventType: type,
    count: Math.floor(Math.random() * 150) + 30,
    premium: Math.floor(Math.random() * 25000) + 3000,
  }))

  return {
    type: "policy",
    period: { startDate, endDate },
    summary: {
      totalPolicies: byCoverage.reduce((s, d) => s + d.count, 0),
      totalPremium: byCoverage.reduce((s, d) => s + d.premium, 0),
      activePolicies: Math.floor(byCoverage.reduce((s, d) => s + d.count, 0) * 0.8),
      expiredPolicies: Math.floor(byCoverage.reduce((s, d) => s + d.count, 0) * 0.15),
      cancelledPolicies: Math.floor(byCoverage.reduce((s, d) => s + d.count, 0) * 0.05),
    },
    byCoverageType: byCoverage,
    byEventType: byEventType,
  }
}

function generateMockClaimsReport(startDate: string, endDate: string) {
  const claimTypes = ["Equipment Damage", "Personal Injury", "Property Damage", "Cancellation", "Other"]

  const byType = claimTypes.map(type => ({
    claimType: type,
    count: Math.floor(Math.random() * 20) + 5,
    totalAmount: Math.floor(Math.random() * 15000) + 2000,
    approvedCount: 0,
    deniedCount: 0,
    pendingCount: 0,
  }))

  byType.forEach(d => {
    d.approvedCount = Math.floor(d.count * 0.6)
    d.deniedCount = Math.floor(d.count * 0.2)
    d.pendingCount = d.count - d.approvedCount - d.deniedCount
  })

  return {
    type: "claims",
    period: { startDate, endDate },
    summary: {
      totalClaims: byType.reduce((s, d) => s + d.count, 0),
      totalClaimAmount: byType.reduce((s, d) => s + d.totalAmount, 0),
      approvedClaims: byType.reduce((s, d) => s + d.approvedCount, 0),
      deniedClaims: byType.reduce((s, d) => s + d.deniedCount, 0),
      pendingClaims: byType.reduce((s, d) => s + d.pendingCount, 0),
      approvalRate: byType.reduce((s, d) => s + d.count, 0) > 0
        ? byType.reduce((s, d) => s + d.approvedCount, 0) / byType.reduce((s, d) => s + d.count, 0)
        : 0,
    },
    byClaimType: byType,
  }
}

function generateMockPartnerPerformanceReport(startDate: string, endDate: string) {
  const partners = [
    { partnerId: "p1", partnerName: "Adventure Sports Inc", tier: "Gold", status: "active" },
    { partnerId: "p2", partnerName: "Mountain Climbers Co", tier: "Silver", status: "active" },
    { partnerId: "p3", partnerName: "Urban Gym Network", tier: "Silver", status: "active" },
    { partnerId: "p4", partnerName: "Outdoor Adventures LLC", tier: "Bronze", status: "active" },
    { partnerId: "p5", partnerName: "Summit Fitness", tier: "Gold", status: "active" },
  ]

  const data = partners.map((p, i) => ({
    ...p,
    rank: i + 1,
    policies: Math.floor(Math.random() * 150) + 50,
    participants: Math.floor(Math.random() * 3000) + 500,
    revenue: Math.floor(Math.random() * 30000) + 8000,
    commission: 0,
    claimsCount: Math.floor(Math.random() * 10),
    claimsAmount: Math.floor(Math.random() * 5000),
    conversionRate: (Math.random() * 0.3 + 0.5).toFixed(2),
  }))

  data.forEach(d => {
    d.commission = d.revenue * (d.tier === "Gold" ? 0.50 : d.tier === "Silver" ? 0.45 : 0.40)
  })

  // Sort by revenue
  data.sort((a, b) => b.revenue - a.revenue)
  data.forEach((d, i) => d.rank = i + 1)

  return {
    type: "partner-performance",
    period: { startDate, endDate },
    summary: {
      totalPartners: data.length,
      activePartners: data.filter(d => d.status === "active").length,
      totalRevenue: data.reduce((s, d) => s + d.revenue, 0),
      totalCommission: data.reduce((s, d) => s + d.commission, 0),
      avgRevenuePerPartner: data.length > 0
        ? data.reduce((s, d) => s + d.revenue, 0) / data.length
        : 0,
    },
    rankings: data,
  }
}

function convertToCSV(data: any): string {
  const type = data.type
  let csv = ""

  switch (type) {
    case "revenue":
      csv = "Date,Premium,Policies,Participants\n"
      csv += data.daily.map((d: any) =>
        `${d.date},${d.premium},${d.policies},${d.participants}`
      ).join("\n")
      break
    case "commission":
      csv = "Partner ID,Partner Name,Tier,Policies,Gross Revenue,Commission Rate,Commission Amount\n"
      csv += data.byPartner.map((d: any) =>
        `${d.partnerId},"${d.partnerName}",${d.tier},${d.policies},${d.grossRevenue},${d.commissionRate},${d.commissionAmount}`
      ).join("\n")
      break
    case "policy":
      csv = "Coverage Type,Count,Premium\n"
      csv += data.byCoverageType.map((d: any) =>
        `${d.coverageType},${d.count},${d.premium}`
      ).join("\n")
      break
    case "claims":
      csv = "Claim Type,Count,Total Amount,Approved,Denied,Pending\n"
      csv += data.byClaimType.map((d: any) =>
        `${d.claimType},${d.count},${d.totalAmount},${d.approvedCount},${d.deniedCount},${d.pendingCount}`
      ).join("\n")
      break
    case "partner-performance":
      csv = "Rank,Partner Name,Tier,Policies,Participants,Revenue,Commission,Claims Count,Conversion Rate\n"
      csv += data.rankings.map((d: any) =>
        `${d.rank},"${d.partnerName}",${d.tier},${d.policies},${d.participants},${d.revenue},${d.commission},${d.claimsCount},${d.conversionRate}`
      ).join("\n")
      break
  }

  return csv
}

/**
 * GET /api/admin/reports
 * Generate reports with specified type and date range
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const type = searchParams.get("type") as ReportType
      const startDate = searchParams.get("startDate")
      const endDate = searchParams.get("endDate")
      const format = searchParams.get("format") || "json"

      if (!type) {
        return badRequest("Report type is required")
      }

      const validTypes: ReportType[] = ["revenue", "commission", "policy", "claims", "partner-performance"]
      if (!validTypes.includes(type)) {
        return badRequest(`Invalid report type. Must be one of: ${validTypes.join(", ")}`)
      }

      // Default to last 30 days if no dates provided
      const end = endDate ? new Date(endDate) : new Date()
      const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

      const startStr = start.toISOString().split("T")[0]
      const endStr = end.toISOString().split("T")[0]

      let reportData: any

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        switch (type) {
          case "revenue":
            reportData = generateMockRevenueReport(startStr, endStr)
            break
          case "commission":
            reportData = generateMockCommissionReport(startStr, endStr)
            break
          case "policy":
            reportData = generateMockPolicyReport(startStr, endStr)
            break
          case "claims":
            reportData = generateMockClaimsReport(startStr, endStr)
            break
          case "partner-performance":
            reportData = generateMockPartnerPerformanceReport(startStr, endStr)
            break
        }
      } else {
        // Database queries for production
        switch (type) {
          case "revenue":
            reportData = await generateRevenueReport(startStr, endStr)
            break
          case "commission":
            reportData = await generateCommissionReport(startStr, endStr)
            break
          case "policy":
            reportData = await generatePolicyReport(startStr, endStr)
            break
          case "claims":
            reportData = await generateClaimsReport(startStr, endStr)
            break
          case "partner-performance":
            reportData = await generatePartnerPerformanceReport(startStr, endStr)
            break
        }
      }

      // Return CSV if requested
      if (format === "csv") {
        const csv = convertToCSV(reportData)
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${type}-report-${startStr}-to-${endStr}.csv"`,
          },
        })
      }

      return successResponse({
        ...reportData,
        generatedAt: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("[Admin Reports] GET Error:", error)
      return serverError(error.message || "Failed to generate report")
    }
  })
}

// Database query functions for production
async function generateRevenueReport(startDate: string, endDate: string) {
  const daily = await db!
    .select({
      date: sql<string>`DATE(${policies.createdAt})`,
      premium: sql<number>`SUM(${policies.premium}::numeric)`,
      policies: sql<number>`COUNT(*)`,
      participants: sql<number>`SUM(${policies.participants})`,
    })
    .from(policies)
    .where(
      and(
        gte(policies.createdAt, new Date(startDate)),
        lte(policies.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(sql`DATE(${policies.createdAt})`)
    .orderBy(sql`DATE(${policies.createdAt})`)

  const totalPremium = daily.reduce((s, d) => s + Number(d.premium || 0), 0)
  const totalPolicies = daily.reduce((s, d) => s + Number(d.policies || 0), 0)

  return {
    type: "revenue",
    period: { startDate, endDate },
    summary: {
      totalPremium,
      totalPolicies,
      totalParticipants: daily.reduce((s, d) => s + Number(d.participants || 0), 0),
      avgPremiumPerPolicy: totalPolicies > 0 ? totalPremium / totalPolicies : 0,
    },
    daily: daily.map(d => ({
      date: d.date,
      premium: Number(d.premium || 0),
      policies: Number(d.policies || 0),
      participants: Number(d.participants || 0),
    })),
  }
}

async function generateCommissionReport(startDate: string, endDate: string) {
  const byPartner = await db!
    .select({
      partnerId: policies.partnerId,
      partnerName: partners.businessName,
      policies: sql<number>`COUNT(*)`,
      grossRevenue: sql<number>`SUM(${policies.premium}::numeric)`,
      commissionAmount: sql<number>`SUM(${policies.commission}::numeric)`,
    })
    .from(policies)
    .leftJoin(partners, eq(policies.partnerId, partners.id))
    .where(
      and(
        gte(policies.createdAt, new Date(startDate)),
        lte(policies.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(policies.partnerId, partners.businessName)
    .orderBy(sql`SUM(${policies.premium}::numeric) DESC`)

  const totalGrossRevenue = byPartner.reduce((s, d) => s + Number(d.grossRevenue || 0), 0)
  const totalCommission = byPartner.reduce((s, d) => s + Number(d.commissionAmount || 0), 0)

  return {
    type: "commission",
    period: { startDate, endDate },
    summary: {
      totalGrossRevenue,
      totalCommission,
      avgCommissionRate: totalGrossRevenue > 0 ? totalCommission / totalGrossRevenue : 0,
    },
    byPartner: byPartner.map(d => ({
      partnerId: d.partnerId,
      partnerName: d.partnerName,
      policies: Number(d.policies || 0),
      grossRevenue: Number(d.grossRevenue || 0),
      commissionRate: Number(d.grossRevenue || 0) > 0
        ? Number(d.commissionAmount || 0) / Number(d.grossRevenue || 0)
        : 0,
      commissionAmount: Number(d.commissionAmount || 0),
    })),
  }
}

async function generatePolicyReport(startDate: string, endDate: string) {
  const byCoverage = await db!
    .select({
      coverageType: policies.coverageType,
      count: sql<number>`COUNT(*)`,
      premium: sql<number>`SUM(${policies.premium}::numeric)`,
    })
    .from(policies)
    .where(
      and(
        gte(policies.createdAt, new Date(startDate)),
        lte(policies.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(policies.coverageType)

  const byEventType = await db!
    .select({
      eventType: policies.eventType,
      count: sql<number>`COUNT(*)`,
      premium: sql<number>`SUM(${policies.premium}::numeric)`,
    })
    .from(policies)
    .where(
      and(
        gte(policies.createdAt, new Date(startDate)),
        lte(policies.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(policies.eventType)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(10)

  const statusCounts = await db!
    .select({
      status: policies.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(policies)
    .where(
      and(
        gte(policies.createdAt, new Date(startDate)),
        lte(policies.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(policies.status)

  const statusMap: Record<string, number> = {}
  statusCounts.forEach(s => {
    statusMap[s.status || "unknown"] = Number(s.count || 0)
  })

  const totalPolicies = byCoverage.reduce((s, d) => s + Number(d.count || 0), 0)
  const totalPremium = byCoverage.reduce((s, d) => s + Number(d.premium || 0), 0)

  return {
    type: "policy",
    period: { startDate, endDate },
    summary: {
      totalPolicies,
      totalPremium,
      activePolicies: statusMap.active || 0,
      expiredPolicies: statusMap.expired || 0,
      cancelledPolicies: statusMap.cancelled || 0,
    },
    byCoverageType: byCoverage.map(d => ({
      coverageType: d.coverageType,
      count: Number(d.count || 0),
      premium: Number(d.premium || 0),
    })),
    byEventType: byEventType.map(d => ({
      eventType: d.eventType,
      count: Number(d.count || 0),
      premium: Number(d.premium || 0),
    })),
  }
}

async function generateClaimsReport(startDate: string, endDate: string) {
  const byType = await db!
    .select({
      claimType: claims.claimType,
      count: sql<number>`COUNT(*)`,
      totalAmount: sql<number>`SUM(${claims.claimAmount}::numeric)`,
      approvedCount: sql<number>`SUM(CASE WHEN ${claims.status} = 'approved' OR ${claims.status} = 'paid' THEN 1 ELSE 0 END)`,
      deniedCount: sql<number>`SUM(CASE WHEN ${claims.status} = 'denied' THEN 1 ELSE 0 END)`,
      pendingCount: sql<number>`SUM(CASE WHEN ${claims.status} IN ('submitted', 'under_review') THEN 1 ELSE 0 END)`,
    })
    .from(claims)
    .where(
      and(
        gte(claims.createdAt, new Date(startDate)),
        lte(claims.createdAt, new Date(endDate + "T23:59:59Z"))
      )
    )
    .groupBy(claims.claimType)

  const totalClaims = byType.reduce((s, d) => s + Number(d.count || 0), 0)
  const approvedClaims = byType.reduce((s, d) => s + Number(d.approvedCount || 0), 0)

  return {
    type: "claims",
    period: { startDate, endDate },
    summary: {
      totalClaims,
      totalClaimAmount: byType.reduce((s, d) => s + Number(d.totalAmount || 0), 0),
      approvedClaims,
      deniedClaims: byType.reduce((s, d) => s + Number(d.deniedCount || 0), 0),
      pendingClaims: byType.reduce((s, d) => s + Number(d.pendingCount || 0), 0),
      approvalRate: totalClaims > 0 ? approvedClaims / totalClaims : 0,
    },
    byClaimType: byType.map(d => ({
      claimType: d.claimType,
      count: Number(d.count || 0),
      totalAmount: Number(d.totalAmount || 0),
      approvedCount: Number(d.approvedCount || 0),
      deniedCount: Number(d.deniedCount || 0),
      pendingCount: Number(d.pendingCount || 0),
    })),
  }
}

async function generatePartnerPerformanceReport(startDate: string, endDate: string) {
  const rankings = await db!
    .select({
      partnerId: partners.id,
      partnerName: partners.businessName,
      status: partners.status,
      policies: sql<number>`COALESCE((
        SELECT COUNT(*) FROM policies
        WHERE policies.partner_id = ${partners.id}
        AND policies.created_at >= ${new Date(startDate)}
        AND policies.created_at <= ${new Date(endDate + "T23:59:59Z")}
      ), 0)`,
      participants: sql<number>`COALESCE((
        SELECT SUM(participants) FROM policies
        WHERE policies.partner_id = ${partners.id}
        AND policies.created_at >= ${new Date(startDate)}
        AND policies.created_at <= ${new Date(endDate + "T23:59:59Z")}
      ), 0)`,
      revenue: sql<number>`COALESCE((
        SELECT SUM(premium::numeric) FROM policies
        WHERE policies.partner_id = ${partners.id}
        AND policies.created_at >= ${new Date(startDate)}
        AND policies.created_at <= ${new Date(endDate + "T23:59:59Z")}
      ), 0)`,
      commission: sql<number>`COALESCE((
        SELECT SUM(commission::numeric) FROM policies
        WHERE policies.partner_id = ${partners.id}
        AND policies.created_at >= ${new Date(startDate)}
        AND policies.created_at <= ${new Date(endDate + "T23:59:59Z")}
      ), 0)`,
      claimsCount: sql<number>`COALESCE((
        SELECT COUNT(*) FROM claims
        JOIN policies ON claims.policy_id = policies.id
        WHERE policies.partner_id = ${partners.id}
        AND claims.created_at >= ${new Date(startDate)}
        AND claims.created_at <= ${new Date(endDate + "T23:59:59Z")}
      ), 0)`,
    })
    .from(partners)
    .orderBy(sql`(
      SELECT SUM(premium::numeric) FROM policies
      WHERE policies.partner_id = ${partners.id}
      AND policies.created_at >= ${new Date(startDate)}
      AND policies.created_at <= ${new Date(endDate + "T23:59:59Z")}
    ) DESC`)

  const totalRevenue = rankings.reduce((s, d) => s + Number(d.revenue || 0), 0)
  const totalCommission = rankings.reduce((s, d) => s + Number(d.commission || 0), 0)

  return {
    type: "partner-performance",
    period: { startDate, endDate },
    summary: {
      totalPartners: rankings.length,
      activePartners: rankings.filter(d => d.status === "active").length,
      totalRevenue,
      totalCommission,
      avgRevenuePerPartner: rankings.length > 0 ? totalRevenue / rankings.length : 0,
    },
    rankings: rankings.map((d, i) => ({
      rank: i + 1,
      partnerId: d.partnerId,
      partnerName: d.partnerName,
      status: d.status,
      policies: Number(d.policies || 0),
      participants: Number(d.participants || 0),
      revenue: Number(d.revenue || 0),
      commission: Number(d.commission || 0),
      claimsCount: Number(d.claimsCount || 0),
    })),
  }
}
