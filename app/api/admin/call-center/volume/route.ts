import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { eq, and, gte, lte, count, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, validationError } from "@/lib/api-responses"

// Mock weekly data for development mode
function generateMockWeeklyData(days: number) {
  const data = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Generate realistic call volumes
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseVolume = isWeekend ? 25 : 85
    const variance = Math.floor(Math.random() * 20) - 10

    const totalCalls = Math.max(10, baseVolume + variance)
    const completedCalls = Math.floor(totalCalls * (0.88 + Math.random() * 0.1))
    const missedCalls = totalCalls - completedCalls

    data.push({
      date: date.toISOString().split("T")[0],
      day: dayNames[dayOfWeek],
      dayOfWeek,
      totalCalls,
      completedCalls,
      missedCalls,
      answerRate: ((completedCalls / totalCalls) * 100).toFixed(1) + "%",
    })
  }

  return data
}

/**
 * GET /api/admin/call-center/volume
 * Get call volume time series data for charts
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const days = parseInt(searchParams.get("days") || "7")

      if (days < 1 || days > 90) {
        return validationError("Days must be between 1 and 90")
      }

      // Return mock data in dev mode
      if (isDevMode || !isDbConfigured()) {
        const mockData = generateMockWeeklyData(days)
        return successResponse({
          data: mockData,
          period: {
            startDate: mockData[0]?.date,
            endDate: mockData[mockData.length - 1]?.date,
            totalDays: days,
          },
          totals: {
            totalCalls: mockData.reduce((sum, d) => sum + d.totalCalls, 0),
            completedCalls: mockData.reduce((sum, d) => sum + d.completedCalls, 0),
            missedCalls: mockData.reduce((sum, d) => sum + d.missedCalls, 0),
          },
        })
      }

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days + 1)
      startDate.setHours(0, 0, 0, 0)

      // Query calls grouped by date
      const volumeData = await db!
        .select({
          date: sql<string>`DATE(${leadCommunications.createdAt})`.as("date"),
          totalCalls: count(),
          completedCalls: sql<number>`
            COUNT(CASE WHEN ${leadCommunications.disposition} = 'reached' THEN 1 END)
          `.as("completed_calls"),
          missedCalls: sql<number>`
            COUNT(CASE WHEN ${leadCommunications.disposition} IN ('no_answer', 'busy') THEN 1 END)
          `.as("missed_calls"),
        })
        .from(leadCommunications)
        .where(
          and(
            eq(leadCommunications.channel, "call"),
            gte(leadCommunications.createdAt, startDate),
            lte(leadCommunications.createdAt, endDate)
          )
        )
        .groupBy(sql`DATE(${leadCommunications.createdAt})`)
        .orderBy(sql`DATE(${leadCommunications.createdAt})`)

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

      // Fill in missing days with zero values
      const volumeMap = new Map<string, any>()
      volumeData.forEach((row) => {
        volumeMap.set(row.date, {
          totalCalls: Number(row.totalCalls),
          completedCalls: Number(row.completedCalls),
          missedCalls: Number(row.missedCalls),
        })
      })

      const result = []
      let totalCalls = 0
      let totalCompleted = 0
      let totalMissed = 0

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        const dateStr = currentDate.toISOString().split("T")[0]
        const dayOfWeek = currentDate.getDay()

        const dayData = volumeMap.get(dateStr) || {
          totalCalls: 0,
          completedCalls: 0,
          missedCalls: 0,
        }

        const answerRate = dayData.totalCalls > 0
          ? ((dayData.completedCalls / dayData.totalCalls) * 100).toFixed(1) + "%"
          : "0%"

        result.push({
          date: dateStr,
          day: dayNames[dayOfWeek],
          dayOfWeek,
          ...dayData,
          answerRate,
        })

        totalCalls += dayData.totalCalls
        totalCompleted += dayData.completedCalls
        totalMissed += dayData.missedCalls
      }

      return successResponse({
        data: result,
        period: {
          startDate: result[0]?.date,
          endDate: result[result.length - 1]?.date,
          totalDays: days,
        },
        totals: {
          totalCalls,
          completedCalls: totalCompleted,
          missedCalls: totalMissed,
          answerRate: totalCalls > 0
            ? ((totalCompleted / totalCalls) * 100).toFixed(1) + "%"
            : "0%",
        },
      })
    } catch (error: any) {
      console.error("[Call Center Volume] GET Error:", error)
      return serverError(error.message || "Failed to fetch call volume data")
    }
  })
}
