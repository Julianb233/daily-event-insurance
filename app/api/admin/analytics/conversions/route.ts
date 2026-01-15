import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads } from "@/lib/db"
import { gte, lte, sql } from "drizzle-orm"
import { successResponse, serverError, validationError } from "@/lib/api-responses"
import { isDevMode } from "@/lib/mock-data"

interface ConversionFunnel {
  leads: number
  contacted: number
  qualified: number
  demo_scheduled: number
  proposal_sent: number
  converted: number
}

interface ConversionRates {
  lead_to_contacted: number
  contacted_to_qualified: number
  qualified_to_demo: number
  demo_to_proposal: number
  proposal_to_converted: number
}

/**
 * GET /api/admin/analytics/conversions
 * Returns conversion funnel metrics
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { searchParams } = new URL(request.url)
      const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const endDate = searchParams.get("endDate") || new Date().toISOString()
      const groupBy = searchParams.get("groupBy") || "day"

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        const mockFunnel: ConversionFunnel = {
          leads: 1000,
          contacted: 800,
          qualified: 400,
          demo_scheduled: 200,
          proposal_sent: 150,
          converted: 50
        }

        const mockRates: ConversionRates = {
          lead_to_contacted: 0.80,
          contacted_to_qualified: 0.50,
          qualified_to_demo: 0.50,
          demo_to_proposal: 0.75,
          proposal_to_converted: 0.33
        }

        return successResponse({
          funnel: mockFunnel,
          conversionRates: mockRates,
          bySource: {
            website_quote: { leads: 600, contacted: 500, qualified: 250, converted: 35 },
            partner_referral: { leads: 200, contacted: 180, qualified: 100, converted: 10 },
            cold_list: { leads: 150, contacted: 90, qualified: 40, converted: 4 },
            ad_campaign: { leads: 50, contacted: 30, qualified: 10, converted: 1 }
          },
          byBusinessType: {
            gym: { leads: 400, contacted: 320, qualified: 160, converted: 20 },
            climbing: { leads: 300, contacted: 250, qualified: 140, converted: 18 },
            adventure: { leads: 200, contacted: 150, qualified: 70, converted: 8 },
            rental: { leads: 100, contacted: 80, qualified: 30, converted: 4 }
          },
          trend: generateMockTrend(startDate, endDate, groupBy),
          dateRange: { startDate, endDate }
        })
      }

      // Production - query database
      const stats = await db!
        .select({
          status: leads.status,
          count: sql<number>`count(*)::int`
        })
        .from(leads)
        .where(gte(leads.createdAt, new Date(startDate)))
        .groupBy(leads.status)

      const funnel: ConversionFunnel = {
        leads: 0,
        contacted: 0,
        qualified: 0,
        demo_scheduled: 0,
        proposal_sent: 0,
        converted: 0
      }

      stats.forEach(s => {
        const status = s.status as keyof ConversionFunnel
        if (status in funnel) {
          funnel[status] = s.count
        }
      })

      // Calculate total leads
      funnel.leads = Object.values(funnel).reduce((a, b) => a + b, 0)

      // Calculate conversion rates
      const rates: ConversionRates = {
        lead_to_contacted: funnel.leads > 0 ? funnel.contacted / funnel.leads : 0,
        contacted_to_qualified: funnel.contacted > 0 ? funnel.qualified / funnel.contacted : 0,
        qualified_to_demo: funnel.qualified > 0 ? funnel.demo_scheduled / funnel.qualified : 0,
        demo_to_proposal: funnel.demo_scheduled > 0 ? funnel.proposal_sent / funnel.demo_scheduled : 0,
        proposal_to_converted: funnel.proposal_sent > 0 ? funnel.converted / funnel.proposal_sent : 0
      }

      return successResponse({
        funnel,
        conversionRates: rates,
        dateRange: { startDate, endDate }
      })

    } catch (error: any) {
      console.error("[Analytics Conversions] Error:", error)
      return serverError(error.message || "Failed to fetch conversion analytics")
    }
  })
}

function generateMockTrend(startDate: string, endDate: string, groupBy: string) {
  const trend = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)

  while (current <= end) {
    trend.push({
      date: current.toISOString().split("T")[0],
      leads: Math.floor(Math.random() * 50) + 20,
      conversions: Math.floor(Math.random() * 5) + 1
    })

    if (groupBy === "week") {
      current.setDate(current.getDate() + 7)
    } else if (groupBy === "month") {
      current.setMonth(current.getMonth() + 1)
    } else {
      current.setDate(current.getDate() + 1)
    }
  }

  return trend
}
