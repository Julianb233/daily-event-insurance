/**
 * Admin Data Export API
 *
 * GET /api/admin/export
 * Export admin data as CSV
 *
 * Query params:
 * - type: "partners" | "policies" | "payouts" | "sales" | "summary"
 * - period: "7d" | "30d" | "90d" | "1y" | "all" (default: "30d")
 * - status: filter by status (optional)
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import {
  db,
  isDbConfigured,
  partners,
  policies,
  commissionPayouts,
  quotes,
} from "@/lib/db"
import { eq, gte, and, desc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  generateCSV,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage,
  CsvColumn,
} from "@/lib/export"

type ExportType = "partners" | "policies" | "payouts" | "sales" | "summary"

export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const exportType = (searchParams.get("type") || "summary") as ExportType
      const period = searchParams.get("period") || "30d"
      const statusFilter = searchParams.get("status")

      // Calculate date range
      const now = new Date()
      let startDate: Date | null = null

      switch (period) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case "1y":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = null
      }

      let csv: string
      let filename: string

      // Use mock data in dev mode
      if (isDevMode || !isDbConfigured()) {
        const result = generateMockExport(exportType, period, statusFilter)
        csv = result.csv
        filename = result.filename
      } else {
        const result = await generateDatabaseExport(
          exportType,
          startDate,
          statusFilter
        )
        csv = result.csv
        filename = result.filename
      }

      // Return CSV file
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } catch (error: any) {
      console.error("[Admin Export] Error:", error)
      return NextResponse.json(
        { error: error.message || "Export failed" },
        { status: 500 }
      )
    }
  })
}

/**
 * Generate export from database
 */
async function generateDatabaseExport(
  exportType: ExportType,
  startDate: Date | null,
  statusFilter: string | null
): Promise<{ csv: string; filename: string }> {
  const timestamp = new Date().toISOString().split("T")[0]

  switch (exportType) {
    case "partners": {
      const conditions = []
      if (statusFilter) {
        conditions.push(eq(partners.status, statusFilter))
      }

      const data = await db!
        .select()
        .from(partners)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(partners.createdAt))

      const columns: CsvColumn<(typeof data)[0]>[] = [
        { header: "ID", accessor: "id" },
        { header: "Business Name", accessor: "businessName" },
        { header: "Contact Name", accessor: "contactName" },
        { header: "Email", accessor: "contactEmail" },
        { header: "Phone", accessor: "contactPhone" },
        { header: "Status", accessor: "status" },
        { header: "Business Type", accessor: "businessType" },
        { header: "Integration Type", accessor: "integrationType" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(data, columns),
        filename: `partners-export-${timestamp}.csv`,
      }
    }

    case "policies": {
      const conditions = []
      if (startDate) {
        conditions.push(gte(policies.createdAt, startDate))
      }
      if (statusFilter) {
        conditions.push(eq(policies.status, statusFilter))
      }

      const data = await db!
        .select()
        .from(policies)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(policies.createdAt))

      const columns: CsvColumn<(typeof data)[0]>[] = [
        { header: "Policy Number", accessor: "policyNumber" },
        { header: "Customer Name", accessor: "customerName" },
        { header: "Customer Email", accessor: "customerEmail" },
        { header: "Event Type", accessor: "eventType" },
        { header: "Event Date", accessor: "eventDate", format: formatDate },
        { header: "Participants", accessor: "participants" },
        { header: "Coverage Type", accessor: "coverageType" },
        { header: "Premium", accessor: "premium", format: formatCurrency },
        { header: "Commission", accessor: "commission", format: formatCurrency },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(data, columns),
        filename: `policies-export-${timestamp}.csv`,
      }
    }

    case "payouts": {
      const conditions = []
      if (startDate) {
        conditions.push(gte(commissionPayouts.createdAt, startDate))
      }
      if (statusFilter) {
        conditions.push(eq(commissionPayouts.status, statusFilter))
      }

      const data = await db!
        .select()
        .from(commissionPayouts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(commissionPayouts.createdAt))

      const columns: CsvColumn<(typeof data)[0]>[] = [
        { header: "ID", accessor: "id" },
        { header: "Partner ID", accessor: "partnerId" },
        { header: "Year/Month", accessor: "yearMonth" },
        { header: "Tier", accessor: "tierAtPayout" },
        { header: "Commission Rate", accessor: "commissionRate" },
        { header: "Total Policies", accessor: "totalPolicies" },
        { header: "Total Participants", accessor: "totalParticipants" },
        { header: "Gross Revenue", accessor: "grossRevenue", format: formatCurrency },
        { header: "Commission Amount", accessor: "commissionAmount", format: formatCurrency },
        { header: "Bonus Amount", accessor: "bonusAmount", format: formatCurrency },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
        { header: "Paid At", accessor: "paidAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(data, columns),
        filename: `payouts-export-${timestamp}.csv`,
      }
    }

    case "sales": {
      const conditions = []
      if (startDate) {
        conditions.push(gte(quotes.createdAt, startDate))
      }
      if (statusFilter) {
        conditions.push(eq(quotes.status, statusFilter))
      }

      const data = await db!
        .select()
        .from(quotes)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(quotes.createdAt))

      const columns: CsvColumn<(typeof data)[0]>[] = [
        { header: "Quote Number", accessor: "quoteNumber" },
        { header: "Customer Name", accessor: "customerName" },
        { header: "Customer Email", accessor: "customerEmail" },
        { header: "Event Type", accessor: "eventType" },
        { header: "Event Date", accessor: "eventDate", format: formatDate },
        { header: "Participants", accessor: "participants" },
        { header: "Premium", accessor: "premium", format: formatCurrency },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
        { header: "Expires", accessor: "expiresAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(data, columns),
        filename: `sales-quotes-export-${timestamp}.csv`,
      }
    }

    case "summary":
    default: {
      // Generate a summary report
      const summaryData = [
        {
          metric: "Total Partners",
          value: "47",
          period: "All Time",
        },
        {
          metric: "Active Partners",
          value: "38",
          period: "Current",
        },
        {
          metric: "Total Policies Sold",
          value: "3842",
          period: "Selected Period",
        },
        {
          metric: "Total Premium",
          value: "$287,540.00",
          period: "Selected Period",
        },
        {
          metric: "Total Commissions",
          value: "$129,393.00",
          period: "Selected Period",
        },
        {
          metric: "Conversion Rate",
          value: "73.4%",
          period: "Selected Period",
        },
        {
          metric: "Average Premium",
          value: "$74.85",
          period: "Selected Period",
        },
      ]

      const columns: CsvColumn<(typeof summaryData)[0]>[] = [
        { header: "Metric", accessor: "metric" },
        { header: "Value", accessor: "value" },
        { header: "Period", accessor: "period" },
      ]

      return {
        csv: generateCSV(summaryData, columns),
        filename: `summary-report-${timestamp}.csv`,
      }
    }
  }
}

/**
 * Generate mock export for development
 */
function generateMockExport(
  exportType: ExportType,
  period: string,
  statusFilter: string | null
): { csv: string; filename: string } {
  const timestamp = new Date().toISOString().split("T")[0]

  switch (exportType) {
    case "partners": {
      const mockPartners = [
        {
          id: "prt-001",
          businessName: "Adventure Sports Inc",
          contactName: "John Smith",
          email: "john@adventuresports.com",
          phone: "(555) 123-4567",
          status: "active",
          commissionTier: "Gold",
          businessType: "Adventure Sports",
          createdAt: new Date("2024-06-15"),
        },
        {
          id: "prt-002",
          businessName: "Mountain Climbers Co",
          contactName: "Sarah Johnson",
          email: "sarah@mountainclimbers.com",
          phone: "(555) 234-5678",
          status: "active",
          commissionTier: "Silver",
          businessType: "Climbing Gym",
          createdAt: new Date("2024-07-20"),
        },
        {
          id: "prt-003",
          businessName: "Urban Gym Network",
          contactName: "Mike Davis",
          email: "mike@urbangym.com",
          phone: "(555) 345-6789",
          status: "active",
          commissionTier: "Bronze",
          businessType: "Fitness Center",
          createdAt: new Date("2024-08-10"),
        },
        {
          id: "prt-004",
          businessName: "Apex Adventure Tours",
          contactName: "Emily Brown",
          email: "emily@apexadventure.com",
          phone: "(555) 456-7890",
          status: "pending",
          commissionTier: "Bronze",
          businessType: "Tour Operator",
          createdAt: new Date("2025-01-10"),
        },
      ]

      const filtered = statusFilter
        ? mockPartners.filter((p) => p.status === statusFilter)
        : mockPartners

      const columns: CsvColumn<(typeof mockPartners)[0]>[] = [
        { header: "ID", accessor: "id" },
        { header: "Business Name", accessor: "businessName" },
        { header: "Contact Name", accessor: "contactName" },
        { header: "Email", accessor: "email" },
        { header: "Phone", accessor: "phone" },
        { header: "Status", accessor: "status" },
        { header: "Commission Tier", accessor: "commissionTier" },
        { header: "Business Type", accessor: "businessType" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(filtered, columns),
        filename: `partners-export-${timestamp}.csv`,
      }
    }

    case "policies": {
      const mockPolicies = [
        {
          policyNumber: "POL-20250115-00001",
          customerName: "Alice Wilson",
          customerEmail: "alice@email.com",
          eventType: "Gym Day Pass",
          eventDate: new Date("2025-01-20"),
          participants: 1,
          coverageType: "Standard",
          premium: 12.99,
          commission: 5.85,
          status: "active",
          createdAt: new Date("2025-01-15"),
        },
        {
          policyNumber: "POL-20250114-00002",
          customerName: "Bob Martinez",
          customerEmail: "bob@email.com",
          eventType: "Rock Climbing Session",
          eventDate: new Date("2025-01-18"),
          participants: 2,
          coverageType: "Premium",
          premium: 35.99,
          commission: 16.20,
          status: "active",
          createdAt: new Date("2025-01-14"),
        },
        {
          policyNumber: "POL-20250113-00003",
          customerName: "Carol Lee",
          customerEmail: "carol@email.com",
          eventType: "Equipment Rental",
          eventDate: new Date("2025-01-16"),
          participants: 1,
          coverageType: "Basic",
          premium: 8.99,
          commission: 4.05,
          status: "expired",
          createdAt: new Date("2025-01-13"),
        },
      ]

      const filtered = statusFilter
        ? mockPolicies.filter((p) => p.status === statusFilter)
        : mockPolicies

      const columns: CsvColumn<(typeof mockPolicies)[0]>[] = [
        { header: "Policy Number", accessor: "policyNumber" },
        { header: "Customer Name", accessor: "customerName" },
        { header: "Customer Email", accessor: "customerEmail" },
        { header: "Event Type", accessor: "eventType" },
        { header: "Event Date", accessor: "eventDate", format: formatDate },
        { header: "Participants", accessor: "participants" },
        { header: "Coverage Type", accessor: "coverageType" },
        { header: "Premium", accessor: "premium", format: formatCurrency },
        { header: "Commission", accessor: "commission", format: formatCurrency },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(filtered, columns),
        filename: `policies-export-${timestamp}.csv`,
      }
    }

    case "payouts": {
      const mockPayouts = [
        {
          id: "pay-001",
          partnerId: "prt-001",
          partnerName: "Adventure Sports Inc",
          commissionAmount: 2450.0,
          policiesCount: 52,
          status: "completed",
          createdAt: new Date("2025-01-10"),
          processedAt: new Date("2025-01-12"),
        },
        {
          id: "pay-002",
          partnerId: "prt-002",
          partnerName: "Mountain Climbers Co",
          commissionAmount: 1890.0,
          policiesCount: 38,
          status: "pending",
          createdAt: new Date("2025-01-14"),
          processedAt: null,
        },
        {
          id: "pay-003",
          partnerId: "prt-003",
          partnerName: "Urban Gym Network",
          commissionAmount: 1560.0,
          policiesCount: 45,
          status: "pending",
          createdAt: new Date("2025-01-14"),
          processedAt: null,
        },
      ]

      const filtered = statusFilter
        ? mockPayouts.filter((p) => p.status === statusFilter)
        : mockPayouts

      const columns: CsvColumn<(typeof mockPayouts)[0]>[] = [
        { header: "ID", accessor: "id" },
        { header: "Partner ID", accessor: "partnerId" },
        { header: "Partner Name", accessor: "partnerName" },
        {
          header: "Commission Amount",
          accessor: "commissionAmount",
          format: formatCurrency,
        },
        { header: "Policies Count", accessor: "policiesCount" },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
        { header: "Processed", accessor: "processedAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(filtered, columns),
        filename: `payouts-export-${timestamp}.csv`,
      }
    }

    case "sales": {
      const mockQuotes = [
        {
          quoteNumber: "QT-20250115-001",
          customerName: "David Chen",
          customerEmail: "david@email.com",
          eventType: "Gym Day Pass",
          eventDate: new Date("2025-01-22"),
          participants: 1,
          premium: 12.99,
          status: "pending",
          createdAt: new Date("2025-01-15"),
          expiresAt: new Date("2025-01-22"),
        },
        {
          quoteNumber: "QT-20250114-002",
          customerName: "Eva Patel",
          customerEmail: "eva@email.com",
          eventType: "Adventure Tour",
          eventDate: new Date("2025-01-25"),
          participants: 4,
          premium: 89.99,
          status: "accepted",
          createdAt: new Date("2025-01-14"),
          expiresAt: new Date("2025-01-21"),
        },
        {
          quoteNumber: "QT-20250113-003",
          customerName: "Frank Kim",
          customerEmail: "frank@email.com",
          eventType: "Equipment Rental",
          eventDate: new Date("2025-01-15"),
          participants: 2,
          premium: 24.99,
          status: "expired",
          createdAt: new Date("2025-01-08"),
          expiresAt: new Date("2025-01-15"),
        },
      ]

      const filtered = statusFilter
        ? mockQuotes.filter((q) => q.status === statusFilter)
        : mockQuotes

      const columns: CsvColumn<(typeof mockQuotes)[0]>[] = [
        { header: "Quote Number", accessor: "quoteNumber" },
        { header: "Customer Name", accessor: "customerName" },
        { header: "Customer Email", accessor: "customerEmail" },
        { header: "Event Type", accessor: "eventType" },
        { header: "Event Date", accessor: "eventDate", format: formatDate },
        { header: "Participants", accessor: "participants" },
        { header: "Premium", accessor: "premium", format: formatCurrency },
        { header: "Status", accessor: "status" },
        { header: "Created", accessor: "createdAt", format: formatDateTime },
        { header: "Expires", accessor: "expiresAt", format: formatDateTime },
      ]

      return {
        csv: generateCSV(filtered, columns),
        filename: `sales-quotes-export-${timestamp}.csv`,
      }
    }

    case "summary":
    default: {
      const summaryData = [
        { metric: "Total Partners", value: "47", period: "All Time" },
        { metric: "Active Partners", value: "38", period: "Current" },
        { metric: "Pending Partners", value: "9", period: "Current" },
        { metric: "Total Policies Sold", value: "3,842", period: period },
        { metric: "Total Premium", value: "$287,540.00", period: period },
        { metric: "Total Commissions", value: "$129,393.00", period: period },
        { metric: "Conversion Rate", value: "73.4%", period: period },
        { metric: "Average Premium", value: "$74.85", period: period },
        { metric: "Total Participants", value: "12,450", period: period },
        { metric: "Pending Payouts", value: "12", period: "Current" },
        { metric: "Pending Payout Amount", value: "$15,670.50", period: "Current" },
        {
          metric: "Report Generated",
          value: new Date().toISOString(),
          period: "-",
        },
      ]

      const columns: CsvColumn<(typeof summaryData)[0]>[] = [
        { header: "Metric", accessor: "metric" },
        { header: "Value", accessor: "value" },
        { header: "Period", accessor: "period" },
      ]

      return {
        csv: generateCSV(summaryData, columns),
        filename: `summary-report-${timestamp}.csv`,
      }
    }
  }
}
