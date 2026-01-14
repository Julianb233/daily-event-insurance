import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, partners, users } from "@/lib/db"
import { eq, sql, and, desc, gte } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest, paginatedResponse } from "@/lib/api-responses"
import {
  type ActiveSession,
  type SessionHistory,
  type SessionType,
  formatDuration,
} from "@/lib/support/customer-service-types"

// Mock active sessions
function getMockActiveSessions(): ActiveSession[] {
  const now = Date.now()
  return [
    {
      id: "s1",
      partnerName: "Yoga Studio Plus",
      contactName: "Emma Roberts",
      agentId: "agent-1",
      agentName: "Emily Chen",
      sessionType: "voice",
      durationSeconds: 754,
      durationFormatted: "12:34",
      startedAt: new Date(now - 754000).toISOString(),
      conversationId: "conv-s1",
      onboardingStep: "Step 4",
      pageUrl: "/partner/onboarding/step-4",
    },
    {
      id: "s2",
      partnerName: "Kayak Adventures",
      contactName: "Tom Williams",
      agentId: "agent-2",
      agentName: "David Wilson",
      sessionType: "screen-share",
      durationSeconds: 322,
      durationFormatted: "5:22",
      startedAt: new Date(now - 322000).toISOString(),
      conversationId: "conv-s2",
      onboardingStep: "Step 5",
      pageUrl: "/partner/onboarding/step-5",
    },
  ]
}

// Mock session history
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
      recordingUrl: "https://recordings.example.com/h1.mp3",
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
      recordingUrl: "https://recordings.example.com/h2.mp4",
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
      recordingUrl: "https://recordings.example.com/h4.mp3",
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
  ]
}

/**
 * GET /api/admin/customer-service/sessions
 * Get active sessions and optionally session history
 *
 * Query params:
 * - type: "active" | "history" | "all" (default: "active")
 * - page: number (for history pagination)
 * - limit: number (for history pagination)
 * - search: string (search partner name/email in history)
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const type = searchParams.get("type") || "active"
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "20")
      const search = searchParams.get("search")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        if (type === "history") {
          let history = getMockSessionHistory()

          if (search) {
            const searchLower = search.toLowerCase()
            history = history.filter(
              (s) =>
                s.partnerName.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower) ||
                s.contactName.toLowerCase().includes(searchLower)
            )
          }

          return paginatedResponse(
            history.slice(offset, offset + limit),
            page,
            limit,
            history.length
          )
        }

        return successResponse({
          sessions: getMockActiveSessions(),
        })
      }

      const now = new Date()
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      if (type === "history") {
        // Get completed sessions
        const conditions = [eq(supportConversations.status, "resolved")]

        // Build query for history
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
          })
          .from(supportConversations)
          .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
          .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
          .where(and(...conditions))
          .orderBy(desc(supportConversations.resolvedAt))
          .limit(limit)
          .offset(offset)

        // Get total count
        const [{ total }] = await db!
          .select({ total: sql<number>`count(*)::int` })
          .from(supportConversations)
          .where(and(...conditions))

        // Transform to SessionHistory
        const sessions: SessionHistory[] = historyData.map((conv) => {
          const createdAt = new Date(conv.createdAt)
          const escalatedAt = conv.escalatedAt ? new Date(conv.escalatedAt) : createdAt
          const resolvedAt = conv.resolvedAt ? new Date(conv.resolvedAt) : now

          const waitTimeSeconds = Math.floor((escalatedAt.getTime() - createdAt.getTime()) / 1000)
          const durationSeconds = Math.floor((resolvedAt.getTime() - escalatedAt.getTime()) / 1000)

          return {
            id: conv.id,
            partnerName: conv.partnerBusinessName || conv.partnerName || "Unknown",
            contactName: conv.partnerContactName || conv.partnerName || "Unknown",
            email: conv.partnerEmail || "",
            agentName: conv.agentName,
            sessionType: "chat" as SessionType, // Default, could be stored in DB
            durationSeconds,
            durationFormatted: formatDuration(durationSeconds),
            waitTimeSeconds,
            resolution: conv.resolution,
            rating: conv.helpfulRating,
            recordingUrl: null, // Would come from onboarding_recordings table
            startedAt: escalatedAt.toISOString(),
            completedAt: resolvedAt.toISOString(),
            conversationId: conv.id,
          }
        })

        return paginatedResponse(sessions, page, limit, Number(total))
      }

      // Get active sessions (in progress with agent assigned)
      const activeData = await db!
        .select({
          id: supportConversations.id,
          partnerId: supportConversations.partnerId,
          partnerEmail: supportConversations.partnerEmail,
          partnerName: supportConversations.partnerName,
          partnerBusinessName: partners.businessName,
          partnerContactName: partners.contactName,
          agentId: supportConversations.escalatedTo,
          agentName: users.name,
          escalatedAt: supportConversations.escalatedAt,
          pageUrl: supportConversations.pageUrl,
          onboardingStep: supportConversations.onboardingStep,
          topic: supportConversations.topic,
        })
        .from(supportConversations)
        .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
        .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
        .where(
          and(
            eq(supportConversations.status, "active"),
            sql`${supportConversations.escalatedTo} IS NOT NULL`
          )
        )
        .orderBy(supportConversations.escalatedAt)

      // Transform to ActiveSession
      const sessions: ActiveSession[] = activeData.map((conv) => {
        const startedAt = conv.escalatedAt || new Date()
        const durationSeconds = Math.floor((now.getTime() - new Date(startedAt).getTime()) / 1000)

        return {
          id: conv.id,
          partnerName: conv.partnerBusinessName || conv.partnerName || "Unknown",
          contactName: conv.partnerContactName || conv.partnerName || "Unknown",
          agentId: conv.agentId || "",
          agentName: conv.agentName || "Unknown",
          sessionType: "chat" as SessionType,
          durationSeconds,
          durationFormatted: formatDuration(durationSeconds),
          startedAt: new Date(startedAt).toISOString(),
          conversationId: conv.id,
          onboardingStep: conv.onboardingStep ? `Step ${conv.onboardingStep}` : null,
          pageUrl: conv.pageUrl,
        }
      })

      return successResponse({ sessions })
    } catch (error: unknown) {
      console.error("[Customer Service Sessions] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch sessions"
      return serverError(message)
    }
  })
}
