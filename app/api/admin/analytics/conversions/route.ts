import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { leads, leadCommunications, conversionEvents } from "@/lib/db/schema"
import { eq, count, sum, sql, gte, and } from "drizzle-orm"

/**
 * GET /api/admin/analytics/conversions
 * Get conversion analytics for the call center
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Total leads
      const [totalLeads] = await db
        .select({ count: count() })
        .from(leads)

      // Leads in period
      const [leadsInPeriod] = await db
        .select({ count: count() })
        .from(leads)
        .where(gte(leads.createdAt, startDate))

      // Leads by status
      const leadsByStatus = await db
        .select({
          status: leads.status,
          count: count(),
        })
        .from(leads)
        .groupBy(leads.status)

      // Leads by interest level
      const leadsByInterest = await db
        .select({
          interestLevel: leads.interestLevel,
          count: count(),
        })
        .from(leads)
        .groupBy(leads.interestLevel)

      // Converted leads
      const [converted] = await db
        .select({ 
          count: count(),
          totalValue: sum(leads.convertedValue),
        })
        .from(leads)
        .where(eq(leads.status, "converted"))

      // Initial value sum
      const [initialValue] = await db
        .select({ 
          total: sum(leads.initialValue),
        })
        .from(leads)

      // Communications stats
      const [callStats] = await db
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate)
          )
        )

      const [smsStats] = await db
        .select({ count: count() })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "sms"),
            gte(leadCommunications.createdAt, startDate)
          )
        )

      // Calculate metrics
      const totalCount = totalLeads?.count || 0
      const convertedCount = converted?.count || 0
      const conversionRate = totalCount > 0 
        ? ((convertedCount / totalCount) * 100).toFixed(1) 
        : "0"
      
      const totalConvertedValue = parseFloat(converted?.totalValue || "0")
      const totalInitialValue = parseFloat(initialValue?.total || "0")
      const valueIncrease = totalInitialValue > 0 
        ? (((totalConvertedValue - totalInitialValue) / totalInitialValue) * 100).toFixed(1)
        : "0"

      return NextResponse.json({
        success: true,
        data: {
          period: {
            days,
            startDate: startDate.toISOString(),
          },
          summary: {
            totalLeads: totalCount,
            newLeadsInPeriod: leadsInPeriod?.count || 0,
            converted: convertedCount,
            conversionRate: `${conversionRate}%`,
            totalInitialValue,
            totalConvertedValue,
            valueIncrease: `${valueIncrease}%`,
            avgLeadValue: convertedCount > 0 
              ? (totalConvertedValue / convertedCount).toFixed(2) 
              : "0",
          },
          communications: {
            callsInPeriod: callStats?.count || 0,
            smsInPeriod: smsStats?.count || 0,
          },
          breakdown: {
            byStatus: leadsByStatus.reduce((acc, item) => {
              if (item.status) {
                acc[item.status] = item.count
              }
              return acc
            }, {} as Record<string, number>),
            byInterest: leadsByInterest.reduce((acc, item) => {
              if (item.interestLevel) {
                acc[item.interestLevel] = item.count
              }
              return acc
            }, {} as Record<string, number>),
          },
        },
      })
    } catch (error) {
      console.error("[Analytics] GET Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch analytics" },
        { status: 500 }
      )
    }
  })
}
