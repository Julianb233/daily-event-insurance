import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, partners, users, onboardingRecordings } from "@/lib/db"
import { eq, sql, and, desc, or, ilike } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { serverError, paginatedResponse } from "@/lib/api-responses"
import {
  type SessionHistory,
  type SessionType,
  formatDuration,
} from "@/lib/support/customer-service-types"

// Mock session history with recordings
function getMockSessionHistory(): SessionHistory[] {
  return [
    {
      id: "h1",
      partnerName: "Mountain Fitness",
      contactName: "Jake Mitchell",
      email: "jake@mountainfitness.com",
      agentName: "Emily Chen",
      sessionType: "voice",
      durationSeconds: 420,
      durationFormatted: "7:00",
      waitTimeSeconds: 95,
      resolution: "Helped configure webhook endpoints",
      rating: 5,
      recordingUrl: "https://storage.dailyevent.io/recordings/h1-session.mp3",
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3180000).toISOString(),
      conversationId: "conv-h1",
    },
    {
      id: "h2",
      partnerName: "Urban Gym Network",
      contactName: "Sarah Lee",
      email: "sarah@urbangym.com",
      agentName: "David Wilson",
      sessionType: "screen-share",
      durationSeconds: 850,
      durationFormatted: "14:10",
      waitTimeSeconds: 180,
      resolution: "Fixed CORS configuration and whitelisted domain",
      rating: 5,
      recordingUrl: "https://storage.dailyevent.io/recordings/h2-session.webm",
      startedAt: new Date(Date.now() - 7200000).toISOString(),
      completedAt: new Date(Date.now() - 6350000).toISOString(),
      conversationId: "conv-h2",
    },
    {
      id: "h3",
      partnerName: "Summit Climbing",
      contactName: "Mike Turner",
      email: "mike@summitclimbing.com",
      agentName: "Alex Thompson",
      sessionType: "chat",
      durationSeconds: 300,
      durationFormatted: "5:00",
      waitTimeSeconds: 45,
      resolution: "Answered questions about pricing tiers",
      rating: 4,
      recordingUrl: null,
      startedAt: new Date(Date.now() - 10800000).toISOString(),
      completedAt: new Date(Date.now() - 10500000).toISOString(),
      conversationId: "conv-h3",
    },
    {
      id: "h4",
      partnerName: "Zen Yoga Studio",
      contactName: "Lisa Park",
      email: "lisa@zenyoga.com",
      agentName: "Emily Chen",
      sessionType: "voice",
      durationSeconds: 600,
      durationFormatted: "10:00",
      waitTimeSeconds: 120,
      resolution: "Guided through API key generation and widget installation",
      rating: 5,
      recordingUrl: "https://storage.dailyevent.io/recordings/h4-session.mp3",
      startedAt: new Date(Date.now() - 14400000).toISOString(),
      completedAt: new Date(Date.now() - 13800000).toISOString(),
      conversationId: "conv-h4",
    },
    {
      id: "h5",
      partnerName: "Active Adventures",
      contactName: "Chris Brown",
      email: "chris@activeadventures.com",
      agentName: null,
      sessionType: "chat",
      durationSeconds: 180,
      durationFormatted: "3:00",
      waitTimeSeconds: 300,
      resolution: "Customer abandoned - sent follow-up email",
      rating: null,
      recordingUrl: null,
      startedAt: new Date(Date.now() - 18000000).toISOString(),
      completedAt: new Date(Date.now() - 17820000).toISOString(),
      conversationId: "conv-h5",
    },
    {
      id: "h6",
      partnerName: "Peak Performance Gym",
      contactName: "Amanda Torres",
      email: "amanda@peakperformance.com",
      agentName: "David Wilson",
      sessionType: "screen-share",
      durationSeconds: 720,
      durationFormatted: "12:00",
      waitTimeSeconds: 60,
      resolution: "Completed full widget integration walkthrough",
      rating: 5,
      recordingUrl: "https://storage.dailyevent.io/recordings/h6-session.webm",
      startedAt: new Date(Date.now() - 21600000).toISOString(),
      completedAt: new Date(Date.now() - 20880000).toISOString(),
      conversationId: "conv-h6",
    },
    {
      id: "h7",
      partnerName: "River Rafting Co",
      contactName: "Dan Mitchell",
      email: "dan@riverrafting.com",
      agentName: "Emily Chen",
      sessionType: "voice",
      durationSeconds: 540,
      durationFormatted: "9:00",
      waitTimeSeconds: 150,
      resolution: "Explained coverage options for water activities",
      rating: 4,
      recordingUrl: "https://storage.dailyevent.io/recordings/h7-session.mp3",
      startedAt: new Date(Date.now() - 25200000).toISOString(),
      completedAt: new Date(Date.now() - 24660000).toISOString(),
      conversationId: "conv-h7",
    },
    {
      id: "h8",
      partnerName: "CrossFit Central",
      contactName: "Kim Johnson",
      email: "kim@crossfitcentral.com",
      agentName: "Alex Thompson",
      sessionType: "chat",
      durationSeconds: 240,
      durationFormatted: "4:00",
      waitTimeSeconds: 30,
      resolution: "Quick API key reset and verification",
      rating: 5,
      recordingUrl: null,
      startedAt: new Date(Date.now() - 28800000).toISOString(),
      completedAt: new Date(Date.now() - 28560000).toISOString(),
      conversationId: "conv-h8",
    },
  ]
}

/**
 * GET /api/admin/customer-service/history
 * Get session history with recording playback links
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 * - search: string (search partner name/email)
 * - agentId: string (filter by agent)
 * - hasRecording: "true" | "false" (filter by recording availability)
 * - dateFrom: ISO date string
 * - dateTo: ISO date string
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
      const search = searchParams.get("search")
      const agentId = searchParams.get("agentId")
      const hasRecording = searchParams.get("hasRecording")
      const dateFrom = searchParams.get("dateFrom")
      const dateTo = searchParams.get("dateTo")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        let history = getMockSessionHistory()

        // Apply filters
        if (search) {
          const searchLower = search.toLowerCase()
          history = history.filter(
            (s) =>
              s.partnerName.toLowerCase().includes(searchLower) ||
              s.email.toLowerCase().includes(searchLower) ||
              s.contactName.toLowerCase().includes(searchLower)
          )
        }

        if (hasRecording === "true") {
          history = history.filter((s) => s.recordingUrl !== null)
        } else if (hasRecording === "false") {
          history = history.filter((s) => s.recordingUrl === null)
        }

        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          history = history.filter((s) => new Date(s.completedAt) >= fromDate)
        }

        if (dateTo) {
          const toDate = new Date(dateTo)
          history = history.filter((s) => new Date(s.completedAt) <= toDate)
        }

        return paginatedResponse(
          history.slice(offset, offset + limit),
          page,
          limit,
          history.length
        )
      }

      const now = new Date()

      // Build where conditions
      const conditions = [eq(supportConversations.status, "resolved")]

      if (agentId) {
        conditions.push(eq(supportConversations.escalatedTo, agentId))
      }

      if (search) {
        conditions.push(
          or(
            ilike(supportConversations.partnerName, `%${search}%`),
            ilike(supportConversations.partnerEmail, `%${search}%`),
            ilike(partners.businessName, `%${search}%`),
            ilike(partners.contactName, `%${search}%`)
          )!
        )
      }

      if (dateFrom) {
        conditions.push(sql`${supportConversations.resolvedAt} >= ${new Date(dateFrom)}`)
      }

      if (dateTo) {
        conditions.push(sql`${supportConversations.resolvedAt} <= ${new Date(dateTo)}`)
      }

      const whereClause = and(...conditions)

      // Get completed sessions with recordings
      const historyData = await db!
        .select({
          id: supportConversations.id,
          partnerId: supportConversations.partnerId,
          partnerEmail: supportConversations.partnerEmail,
          partnerName: supportConversations.partnerName,
          partnerBusinessName: partners.businessName,
          partnerContactName: partners.contactName,
          agentId: supportConversations.escalatedTo,
          agentName: users.name,
          createdAt: supportConversations.createdAt,
          escalatedAt: supportConversations.escalatedAt,
          resolvedAt: supportConversations.resolvedAt,
          resolution: supportConversations.resolution,
          helpfulRating: supportConversations.helpfulRating,
          topic: supportConversations.topic,
          recordingUrl: onboardingRecordings.recordingUrl,
          recordingDuration: onboardingRecordings.duration,
        })
        .from(supportConversations)
        .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
        .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
        .leftJoin(onboardingRecordings, eq(supportConversations.id, onboardingRecordings.conversationId))
        .where(whereClause)
        .orderBy(desc(supportConversations.resolvedAt))
        .limit(limit)
        .offset(offset)

      // Apply hasRecording filter after join
      let filteredData = historyData
      if (hasRecording === "true") {
        filteredData = historyData.filter((h) => h.recordingUrl !== null)
      } else if (hasRecording === "false") {
        filteredData = historyData.filter((h) => h.recordingUrl === null)
      }

      // Get total count
      const [{ total }] = await db!
        .select({ total: sql<number>`count(*)::int` })
        .from(supportConversations)
        .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
        .where(whereClause)

      // Transform to SessionHistory
      const sessions: SessionHistory[] = filteredData.map((conv) => {
        const createdAt = new Date(conv.createdAt)
        const escalatedAt = conv.escalatedAt ? new Date(conv.escalatedAt) : createdAt
        const resolvedAt = conv.resolvedAt ? new Date(conv.resolvedAt) : now

        const waitTimeSeconds = Math.floor((escalatedAt.getTime() - createdAt.getTime()) / 1000)
        const durationSeconds = Math.floor((resolvedAt.getTime() - escalatedAt.getTime()) / 1000)

        // Determine session type based on recording or topic
        let sessionType: SessionType = "chat"
        if (conv.recordingUrl) {
          if (conv.recordingUrl.endsWith(".mp3") || conv.recordingUrl.endsWith(".wav")) {
            sessionType = "voice"
          } else if (conv.recordingUrl.endsWith(".webm") || conv.recordingUrl.endsWith(".mp4")) {
            sessionType = "screen-share"
          }
        }

        return {
          id: conv.id,
          partnerName: conv.partnerBusinessName || conv.partnerName || "Unknown",
          contactName: conv.partnerContactName || conv.partnerName || "Unknown",
          email: conv.partnerEmail || "",
          agentName: conv.agentName,
          sessionType,
          durationSeconds,
          durationFormatted: formatDuration(durationSeconds),
          waitTimeSeconds,
          resolution: conv.resolution,
          rating: conv.helpfulRating,
          recordingUrl: conv.recordingUrl,
          startedAt: escalatedAt.toISOString(),
          completedAt: resolvedAt.toISOString(),
          conversationId: conv.id,
        }
      })

      return paginatedResponse(sessions, page, limit, Number(total))
    } catch (error: unknown) {
      console.error("[Customer Service History] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch session history"
      return serverError(message)
    }
  })
}
