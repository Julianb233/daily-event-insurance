import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, commissionPayouts, partners } from "@/lib/db"
import { eq, sql, desc, and, gte, lte, inArray, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest } from "@/lib/api-responses"

/**
 * GET /api/admin/payouts
 * List all commission payouts with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const status = searchParams.get("status") // pending, processing, paid, failed, all
      const partnerId = searchParams.get("partnerId")
      const yearMonth = searchParams.get("yearMonth") // "2025-01" format
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "20")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockPayouts = [
          { id: "1", partnerId: "p1", partnerName: "Adventure Sports Inc", yearMonth: "2024-12", tierAtPayout: "Gold", commissionRate: "0.5000", totalPolicies: 89, totalParticipants: 2450, grossRevenue: "8900.00", commissionAmount: "4450.00", bonusAmount: "0", status: "pending", paidAt: null, paymentReference: null, createdAt: "2025-01-01T00:00:00Z" },
          { id: "2", partnerId: "p2", partnerName: "Mountain Climbers Co", yearMonth: "2024-12", tierAtPayout: "Gold", commissionRate: "0.5000", totalPolicies: 67, totalParticipants: 1890, grossRevenue: "6700.00", commissionAmount: "3350.00", bonusAmount: "0", status: "pending", paidAt: null, paymentReference: null, createdAt: "2025-01-01T00:00:00Z" },
          { id: "3", partnerId: "p3", partnerName: "Urban Gym Network", yearMonth: "2024-12", tierAtPayout: "Silver", commissionRate: "0.4500", totalPolicies: 54, totalParticipants: 1620, grossRevenue: "5400.00", commissionAmount: "2430.00", bonusAmount: "0", status: "processing", paidAt: null, paymentReference: null, createdAt: "2025-01-01T00:00:00Z" },
          { id: "4", partnerId: "p4", partnerName: "Summit Fitness", yearMonth: "2024-11", tierAtPayout: "Silver", commissionRate: "0.4500", totalPolicies: 45, totalParticipants: 1350, grossRevenue: "4500.00", commissionAmount: "2025.00", bonusAmount: "50.00", status: "paid", paidAt: "2024-12-15T00:00:00Z", paymentReference: "ACH-2024-12-001", createdAt: "2024-12-01T00:00:00Z" },
          { id: "5", partnerId: "p5", partnerName: "Peak Performance Gym", yearMonth: "2024-11", tierAtPayout: "Bronze", commissionRate: "0.4000", totalPolicies: 32, totalParticipants: 960, grossRevenue: "3200.00", commissionAmount: "1280.00", bonusAmount: "0", status: "paid", paidAt: "2024-12-15T00:00:00Z", paymentReference: "ACH-2024-12-002", createdAt: "2024-12-01T00:00:00Z" },
        ]

        const filtered = mockPayouts.filter(p => {
          if (status && status !== "all" && p.status !== status) return false
          if (partnerId && p.partnerId !== partnerId) return false
          if (yearMonth && p.yearMonth !== yearMonth) return false
          return true
        })

        return successResponse({
          data: filtered.slice(offset, offset + limit),
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
          },
          summary: {
            pending: { count: 2, amount: 7800.00 },
            processing: { count: 1, amount: 2430.00 },
            paid: { count: 2, amount: 3305.00 },
            failed: { count: 0, amount: 0 },
          },
        })
      }

      // Build where conditions
      const conditions = []
      if (status && status !== "all") {
        conditions.push(eq(commissionPayouts.status, status))
      }
      if (partnerId) {
        conditions.push(eq(commissionPayouts.partnerId, partnerId))
      }
      if (yearMonth) {
        conditions.push(eq(commissionPayouts.yearMonth, yearMonth))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get payouts with partner info
      const payoutsData = await db!
        .select({
          id: commissionPayouts.id,
          partnerId: commissionPayouts.partnerId,
          partnerName: partners.businessName,
          yearMonth: commissionPayouts.yearMonth,
          tierAtPayout: commissionPayouts.tierAtPayout,
          commissionRate: commissionPayouts.commissionRate,
          totalPolicies: commissionPayouts.totalPolicies,
          totalParticipants: commissionPayouts.totalParticipants,
          grossRevenue: commissionPayouts.grossRevenue,
          commissionAmount: commissionPayouts.commissionAmount,
          bonusAmount: commissionPayouts.bonusAmount,
          status: commissionPayouts.status,
          paidAt: commissionPayouts.paidAt,
          paymentReference: commissionPayouts.paymentReference,
          createdAt: commissionPayouts.createdAt,
        })
        .from(commissionPayouts)
        .leftJoin(partners, eq(commissionPayouts.partnerId, partners.id))
        .where(whereClause)
        .orderBy(desc(commissionPayouts.createdAt))
        .limit(limit)
        .offset(offset)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(commissionPayouts)
        .where(whereClause)

      // Get summary by status
      const summaryData = await db!
        .select({
          status: commissionPayouts.status,
          count: count(),
          amount: sql<number>`COALESCE(SUM(${commissionPayouts.commissionAmount}::numeric), 0)`,
        })
        .from(commissionPayouts)
        .groupBy(commissionPayouts.status)

      const summary = {
        pending: { count: 0, amount: 0 },
        processing: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        failed: { count: 0, amount: 0 },
      }
      summaryData.forEach(s => {
        if (s.status && s.status in summary) {
          summary[s.status as keyof typeof summary] = {
            count: Number(s.count),
            amount: Number(s.amount),
          }
        }
      })

      return successResponse({
        data: payoutsData.map(p => ({
          ...p,
          commissionRate: Number(p.commissionRate),
          grossRevenue: Number(p.grossRevenue),
          commissionAmount: Number(p.commissionAmount),
          bonusAmount: Number(p.bonusAmount),
        })),
        pagination: {
          page,
          limit,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / limit),
        },
        summary,
      })
    } catch (error: any) {
      console.error("[Admin Payouts] GET Error:", error)
      return serverError(error.message || "Failed to fetch payouts")
    }
  })
}

/**
 * POST /api/admin/payouts
 * Create payouts for a specific month (batch generation)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const body = await request.json()
      const { yearMonth } = body

      if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
        return badRequest("Invalid yearMonth format. Use YYYY-MM")
      }

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          message: "Payouts generated successfully (mock)",
          payoutsCreated: 5,
          totalAmount: 15670.50,
        })
      }

      // TODO: Implement actual payout generation logic
      // 1. Get all active partners
      // 2. Calculate their commission for the month based on policies
      // 3. Determine their tier and commission rate
      // 4. Create payout records

      return successResponse({
        message: "Payout generation not yet implemented for production",
        yearMonth,
      })
    } catch (error: any) {
      console.error("[Admin Payouts] POST Error:", error)
      return serverError(error.message || "Failed to generate payouts")
    }
  })
}
