import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, supportMessages, partners, users } from "@/lib/db"
import { eq, desc, and, or, sql, count, gte, lte, isNull, isNotNull } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, validationError } from "@/lib/api-responses"
import { z } from "zod"

// Types for customer service dashboard
export interface QueueRequest {
  id: string
  partnerName: string
  contactName: string
  email: string
  businessType: string
  onboardingStep: string
  waitTime: string
  waitTimeSeconds: number
  requestReason: string
  urgent: boolean
  topic: string
  priority: string
  createdAt: string
}

export interface ActiveSession {
  id: string
  partnerName: string
  contactName: string
  adminName: string
  adminId: string
  duration: string
  durationSeconds: number
  type: "voice" | "screen-share" | "chat"
  topic: string
  startedAt: string
}

export interface SessionHistory {
  id: string
  partnerName: string
  contactName: string
  email: string
  adminName: string
  topic: string
  status: "resolved" | "escalated" | "abandoned"
  duration: string
  durationSeconds: number
  rating: number | null
  feedback: string | null
  resolution: string | null
  startedAt: string
  endedAt: string
}

export interface DashboardStats {
  waiting: number
  inProgress: number
  completedToday: number
  avgWaitTime: string
  avgWaitTimeSeconds: number
  avgDuration: string
  avgDurationSeconds: number
}

export interface AgentStatus {
  id: string
  name: string
  email: string
  status: "available" | "busy" | "away" | "offline"
  currentSession?: string
  sessionsToday: number
  avgRating: number | null
}

// Helper to format seconds to MM:SS
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, "0")}`
}

// Helper to calculate time difference in seconds
function getSecondsDiff(start: Date, end: Date = new Date()): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000)
}

// Validation schema for query parameters
const querySchema = z.object({
  include: z.enum(["queue", "active", "history", "stats", "agents", "all"]).default("all"),
  historyLimit: z.coerce.number().int().min(1).max(100).default(20),
  historyOffset: z.coerce.number().int().min(0).default(0),
  historyStatus: z.enum(["resolved", "escalated", "abandoned", "all"]).optional(),
  historySearch: z.string().max(200).optional(),
})

// Mock data generators for development mode
function generateMockQueue(): QueueRequest[] {
  const waitTimes = [
    { seconds: 263, reason: "Need help with API integration" },
    { seconds: 135, reason: "Questions about pricing configuration" },
    { seconds: 62, reason: "Website auto-fill not working" },
    { seconds: 401, reason: "Widget not displaying correctly" },
  ]

  const onboardingSteps = [
    "Business Information",
    "Customize Coverage",
    "Integration Setup",
    "API Configuration",
    "Testing & Launch",
  ]

  const topics = ["api_integration", "widget_install", "onboarding", "pos_setup", "troubleshooting"]
  const businessTypes = ["Gym", "Adventure", "Climbing", "Rental", "Studio"]

  return [
    {
      id: "q1",
      partnerName: "Acme Fitness Center",
      contactName: "John Smith",
      email: "john@acmefitness.com",
      businessType: "Gym",
      onboardingStep: "Integration Setup",
      waitTime: formatDuration(waitTimes[0].seconds),
      waitTimeSeconds: waitTimes[0].seconds,
      requestReason: waitTimes[0].reason,
      urgent: true,
      topic: "api_integration",
      priority: "high",
      createdAt: new Date(Date.now() - waitTimes[0].seconds * 1000).toISOString(),
    },
    {
      id: "q2",
      partnerName: "Adventure Tours LLC",
      contactName: "Sarah Johnson",
      email: "sarah@adventuretours.com",
      businessType: "Adventure",
      onboardingStep: "Customize Coverage",
      waitTime: formatDuration(waitTimes[1].seconds),
      waitTimeSeconds: waitTimes[1].seconds,
      requestReason: waitTimes[1].reason,
      urgent: false,
      topic: "onboarding",
      priority: "normal",
      createdAt: new Date(Date.now() - waitTimes[1].seconds * 1000).toISOString(),
    },
    {
      id: "q3",
      partnerName: "Rock Climbing Co",
      contactName: "Mike Davis",
      email: "mike@rockclimbing.com",
      businessType: "Climbing",
      onboardingStep: "Business Information",
      waitTime: formatDuration(waitTimes[2].seconds),
      waitTimeSeconds: waitTimes[2].seconds,
      requestReason: waitTimes[2].reason,
      urgent: false,
      topic: "troubleshooting",
      priority: "normal",
      createdAt: new Date(Date.now() - waitTimes[2].seconds * 1000).toISOString(),
    },
  ]
}

function generateMockActiveSessions(): ActiveSession[] {
  return [
    {
      id: "s1",
      partnerName: "Yoga Studio Plus",
      contactName: "Emily Chen",
      adminName: "Alex Thompson",
      adminId: "admin-1",
      duration: "12:34",
      durationSeconds: 754,
      type: "voice",
      topic: "widget_install",
      startedAt: new Date(Date.now() - 754000).toISOString(),
    },
    {
      id: "s2",
      partnerName: "Kayak Adventures",
      contactName: "David Wilson",
      adminName: "Maria Garcia",
      adminId: "admin-2",
      duration: "5:22",
      durationSeconds: 322,
      type: "screen-share",
      topic: "api_integration",
      startedAt: new Date(Date.now() - 322000).toISOString(),
    },
  ]
}

function generateMockHistory(): SessionHistory[] {
  const histories: SessionHistory[] = []
  const now = Date.now()

  const partners = [
    { name: "Summit Fitness", contact: "Lisa Park", email: "lisa@summitfitness.com" },
    { name: "Urban Yoga Co", contact: "James Lee", email: "james@urbanyoga.com" },
    { name: "Peak Adventures", contact: "Emma Wilson", email: "emma@peakadv.com" },
    { name: "Coastal Kayaks", contact: "Ryan Chen", email: "ryan@coastalkayaks.com" },
    { name: "Mountain Biking Pro", contact: "Sophie Brown", email: "sophie@mtbpro.com" },
    { name: "CrossFit Downtown", contact: "Marcus Johnson", email: "marcus@cfdowntown.com" },
    { name: "Paddle Sports Inc", contact: "Anna Martinez", email: "anna@paddlesports.com" },
    { name: "Climbing Gym Plus", contact: "Tom Harrison", email: "tom@climbingplus.com" },
    { name: "Fitness First", contact: "Kelly White", email: "kelly@fitnessfirst.com" },
    { name: "Adventure Zone", contact: "Chris Taylor", email: "chris@adventurezone.com" },
  ]

  const admins = ["Alex Thompson", "Maria Garcia", "Jordan Lee", "Sam Wilson"]
  const topics = ["onboarding", "widget_install", "api_integration", "pos_setup", "troubleshooting"]
  const statuses: ("resolved" | "escalated" | "abandoned")[] = ["resolved", "resolved", "resolved", "escalated", "abandoned"]
  const resolutions = [
    "Successfully configured widget integration",
    "Resolved API authentication issues",
    "Completed POS system connection",
    "Fixed CORS configuration problems",
    "Guided through complete onboarding process",
    null,
  ]

  for (let i = 0; i < 25; i++) {
    const partner = partners[i % partners.length]
    const durationSec = Math.floor(Math.random() * 1200) + 180 // 3-20 minutes
    const hoursAgo = Math.floor(Math.random() * 168) // Up to 7 days ago
    const startTime = now - (hoursAgo * 60 * 60 * 1000) - (durationSec * 1000)
    const endTime = startTime + (durationSec * 1000)
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    histories.push({
      id: `hist-${i + 1}`,
      partnerName: partner.name,
      contactName: partner.contact,
      email: partner.email,
      adminName: admins[Math.floor(Math.random() * admins.length)],
      topic: topics[Math.floor(Math.random() * topics.length)],
      status,
      duration: formatDuration(durationSec),
      durationSeconds: durationSec,
      rating: status === "resolved" ? (Math.random() > 0.2 ? Math.floor(Math.random() * 2) + 4 : 3) : null,
      feedback: status === "resolved" && Math.random() > 0.6 ? "Great support, very helpful!" : null,
      resolution: status === "resolved" ? resolutions[Math.floor(Math.random() * (resolutions.length - 1))] : null,
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date(endTime).toISOString(),
    })
  }

  // Sort by endedAt descending
  return histories.sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime())
}

function generateMockStats(queue: QueueRequest[], active: ActiveSession[]): DashboardStats {
  const avgWaitSeconds = queue.length > 0
    ? Math.floor(queue.reduce((sum, q) => sum + q.waitTimeSeconds, 0) / queue.length)
    : 0

  return {
    waiting: queue.length,
    inProgress: active.length,
    completedToday: 24,
    avgWaitTime: formatDuration(avgWaitSeconds),
    avgWaitTimeSeconds: avgWaitSeconds,
    avgDuration: "8:45",
    avgDurationSeconds: 525,
  }
}

function generateMockAgents(): AgentStatus[] {
  return [
    {
      id: "agent-1",
      name: "Alex Thompson",
      email: "alex@company.com",
      status: "busy",
      currentSession: "s1",
      sessionsToday: 8,
      avgRating: 4.8,
    },
    {
      id: "agent-2",
      name: "Maria Garcia",
      email: "maria@company.com",
      status: "busy",
      currentSession: "s2",
      sessionsToday: 12,
      avgRating: 4.9,
    },
    {
      id: "agent-3",
      name: "Jordan Lee",
      email: "jordan@company.com",
      status: "available",
      sessionsToday: 6,
      avgRating: 4.7,
    },
    {
      id: "agent-4",
      name: "Sam Wilson",
      email: "sam@company.com",
      status: "away",
      sessionsToday: 4,
      avgRating: 4.6,
    },
  ]
}

/**
 * GET /api/admin/customer-service
 * Get customer service dashboard data including queue, active sessions, history, and stats
 *
 * Query params:
 * - include: queue | active | history | stats | agents | all (default: all)
 * - historyLimit: number of history results (default 20, max 100)
 * - historyOffset: pagination offset (default 0)
 * - historyStatus: resolved | escalated | abandoned | all
 * - historySearch: search by partner name or email
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      // Validate query parameters
      const validationResult = querySchema.safeParse(params)
      if (!validationResult.success) {
        return validationError(
          "Invalid query parameters",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { include, historyLimit, historyOffset, historyStatus, historySearch } = validationResult.data

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockQueue = generateMockQueue()
        const mockActive = generateMockActiveSessions()
        const mockHistory = generateMockHistory()
        const mockStats = generateMockStats(mockQueue, mockActive)
        const mockAgents = generateMockAgents()

        // Filter history if needed
        let filteredHistory = mockHistory
        if (historyStatus && historyStatus !== "all") {
          filteredHistory = filteredHistory.filter(h => h.status === historyStatus)
        }
        if (historySearch) {
          const search = historySearch.toLowerCase()
          filteredHistory = filteredHistory.filter(h =>
            h.partnerName.toLowerCase().includes(search) ||
            h.email.toLowerCase().includes(search)
          )
        }

        const response: Record<string, unknown> = {}

        if (include === "all" || include === "queue") {
          response.queue = mockQueue
        }
        if (include === "all" || include === "active") {
          response.activeSessions = mockActive
        }
        if (include === "all" || include === "history") {
          const paginatedHistory = filteredHistory.slice(historyOffset, historyOffset + historyLimit)
          response.history = {
            data: paginatedHistory,
            pagination: {
              page: Math.floor(historyOffset / historyLimit) + 1,
              pageSize: historyLimit,
              total: filteredHistory.length,
              totalPages: Math.ceil(filteredHistory.length / historyLimit),
              hasNext: historyOffset + historyLimit < filteredHistory.length,
              hasPrev: historyOffset > 0,
            },
          }
        }
        if (include === "all" || include === "stats") {
          response.stats = mockStats
        }
        if (include === "all" || include === "agents") {
          response.agents = mockAgents
        }

        response.lastUpdated = new Date().toISOString()
        return successResponse(response)
      }

      // Real database queries
      const response: Record<string, unknown> = {}
      const now = new Date()
      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 0, 0)

      // Get queue data - active conversations without an assigned agent
      if (include === "all" || include === "queue") {
        const queueData = await db!
          .select({
            id: supportConversations.id,
            partnerId: supportConversations.partnerId,
            partnerEmail: supportConversations.partnerEmail,
            partnerName: supportConversations.partnerName,
            partnerBusinessName: partners.businessName,
            partnerBusinessType: partners.businessType,
            topic: supportConversations.topic,
            priority: supportConversations.priority,
            onboardingStep: supportConversations.onboardingStep,
            createdAt: supportConversations.createdAt,
          })
          .from(supportConversations)
          .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
          .where(
            and(
              eq(supportConversations.status, "active"),
              isNull(supportConversations.escalatedTo)
            )
          )
          .orderBy(desc(supportConversations.priority), supportConversations.createdAt)
          .limit(50)

        const queue: QueueRequest[] = await Promise.all(queueData.map(async (q) => {
          // Get the first message as the request reason
          const [firstMessage] = await db!
            .select({ content: supportMessages.content })
            .from(supportMessages)
            .where(
              and(
                eq(supportMessages.conversationId, q.id),
                eq(supportMessages.role, "user")
              )
            )
            .orderBy(supportMessages.createdAt)
            .limit(1)

          const waitSeconds = getSecondsDiff(q.createdAt, now)
          const onboardingSteps = [
            "Business Information",
            "Customize Coverage",
            "Integration Setup",
            "API Configuration",
            "Testing & Launch",
          ]

          return {
            id: q.id,
            partnerName: q.partnerBusinessName || q.partnerName || "Unknown Partner",
            contactName: q.partnerName || "Unknown",
            email: q.partnerEmail || "",
            businessType: q.partnerBusinessType || "Unknown",
            onboardingStep: q.onboardingStep ? onboardingSteps[q.onboardingStep - 1] || `Step ${q.onboardingStep}` : "Unknown",
            waitTime: formatDuration(waitSeconds),
            waitTimeSeconds: waitSeconds,
            requestReason: firstMessage?.content || "Support request",
            urgent: q.priority === "urgent" || q.priority === "high",
            topic: q.topic || "general",
            priority: q.priority || "normal",
            createdAt: q.createdAt.toISOString(),
          }
        }))

        response.queue = queue
      }

      // Get active sessions - conversations with an assigned agent
      if (include === "all" || include === "active") {
        const activeData = await db!
          .select({
            id: supportConversations.id,
            partnerName: supportConversations.partnerName,
            partnerBusinessName: partners.businessName,
            topic: supportConversations.topic,
            escalatedAt: supportConversations.escalatedAt,
            escalatedTo: supportConversations.escalatedTo,
            adminName: users.name,
            adminEmail: users.email,
          })
          .from(supportConversations)
          .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
          .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
          .where(
            and(
              eq(supportConversations.status, "active"),
              isNotNull(supportConversations.escalatedTo)
            )
          )
          .orderBy(supportConversations.escalatedAt)
          .limit(50)

        const activeSessions: ActiveSession[] = activeData.map((s) => {
          const durationSeconds = s.escalatedAt ? getSecondsDiff(s.escalatedAt, now) : 0
          return {
            id: s.id,
            partnerName: s.partnerBusinessName || s.partnerName || "Unknown Partner",
            contactName: s.partnerName || "Unknown",
            adminName: s.adminName || "Unknown Agent",
            adminId: s.escalatedTo || "",
            duration: formatDuration(durationSeconds),
            durationSeconds,
            type: "chat" as const, // Default to chat, could be stored in DB
            topic: s.topic || "general",
            startedAt: s.escalatedAt?.toISOString() || new Date().toISOString(),
          }
        })

        response.activeSessions = activeSessions
      }

      // Get session history
      if (include === "all" || include === "history") {
        const historyConditions = [
          or(
            eq(supportConversations.status, "resolved"),
            eq(supportConversations.status, "escalated"),
            eq(supportConversations.status, "abandoned")
          )
        ]

        if (historyStatus && historyStatus !== "all") {
          historyConditions.push(eq(supportConversations.status, historyStatus))
        }

        const historyData = await db!
          .select({
            id: supportConversations.id,
            partnerEmail: supportConversations.partnerEmail,
            partnerName: supportConversations.partnerName,
            partnerBusinessName: partners.businessName,
            topic: supportConversations.topic,
            status: supportConversations.status,
            escalatedTo: supportConversations.escalatedTo,
            adminName: users.name,
            resolution: supportConversations.resolution,
            helpfulRating: supportConversations.helpfulRating,
            feedback: supportConversations.feedback,
            createdAt: supportConversations.createdAt,
            resolvedAt: supportConversations.resolvedAt,
            updatedAt: supportConversations.updatedAt,
          })
          .from(supportConversations)
          .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
          .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
          .where(and(...historyConditions))
          .orderBy(desc(supportConversations.updatedAt))
          .limit(historyLimit)
          .offset(historyOffset)

        // Get total count for pagination
        const [{ total }] = await db!
          .select({ total: count() })
          .from(supportConversations)
          .where(and(...historyConditions))

        const history: SessionHistory[] = historyData.map((h) => {
          const startTime = h.createdAt
          const endTime = h.resolvedAt || h.updatedAt
          const durationSeconds = getSecondsDiff(startTime, endTime)

          return {
            id: h.id,
            partnerName: h.partnerBusinessName || h.partnerName || "Unknown Partner",
            contactName: h.partnerName || "Unknown",
            email: h.partnerEmail || "",
            adminName: h.adminName || "Unassigned",
            topic: h.topic || "general",
            status: h.status as "resolved" | "escalated" | "abandoned",
            duration: formatDuration(durationSeconds),
            durationSeconds,
            rating: h.helpfulRating,
            feedback: h.feedback,
            resolution: h.resolution,
            startedAt: startTime.toISOString(),
            endedAt: endTime.toISOString(),
          }
        })

        response.history = {
          data: history,
          pagination: {
            page: Math.floor(historyOffset / historyLimit) + 1,
            pageSize: historyLimit,
            total: Number(total),
            totalPages: Math.ceil(Number(total) / historyLimit),
            hasNext: historyOffset + historyLimit < Number(total),
            hasPrev: historyOffset > 0,
          },
        }
      }

      // Get stats
      if (include === "all" || include === "stats") {
        // Count waiting (active without agent)
        const [waitingCount] = await db!
          .select({ count: count() })
          .from(supportConversations)
          .where(
            and(
              eq(supportConversations.status, "active"),
              isNull(supportConversations.escalatedTo)
            )
          )

        // Count in progress (active with agent)
        const [inProgressCount] = await db!
          .select({ count: count() })
          .from(supportConversations)
          .where(
            and(
              eq(supportConversations.status, "active"),
              isNotNull(supportConversations.escalatedTo)
            )
          )

        // Count completed today
        const [completedTodayCount] = await db!
          .select({ count: count() })
          .from(supportConversations)
          .where(
            and(
              eq(supportConversations.status, "resolved"),
              gte(supportConversations.resolvedAt, todayStart)
            )
          )

        // Calculate average wait time (for conversations resolved today)
        const avgWaitResult = await db!
          .select({
            avgWait: sql<number>`AVG(EXTRACT(EPOCH FROM (${supportConversations.escalatedAt} - ${supportConversations.createdAt})))`,
          })
          .from(supportConversations)
          .where(
            and(
              isNotNull(supportConversations.escalatedAt),
              gte(supportConversations.createdAt, todayStart)
            )
          )

        // Calculate average duration (for resolved conversations today)
        const avgDurationResult = await db!
          .select({
            avgDuration: sql<number>`AVG(EXTRACT(EPOCH FROM (${supportConversations.resolvedAt} - ${supportConversations.createdAt})))`,
          })
          .from(supportConversations)
          .where(
            and(
              eq(supportConversations.status, "resolved"),
              gte(supportConversations.resolvedAt, todayStart)
            )
          )

        const avgWaitSeconds = Math.floor(avgWaitResult[0]?.avgWait || 154)
        const avgDurationSeconds = Math.floor(avgDurationResult[0]?.avgDuration || 525)

        response.stats = {
          waiting: Number(waitingCount.count),
          inProgress: Number(inProgressCount.count),
          completedToday: Number(completedTodayCount.count),
          avgWaitTime: formatDuration(avgWaitSeconds),
          avgWaitTimeSeconds: avgWaitSeconds,
          avgDuration: formatDuration(avgDurationSeconds),
          avgDurationSeconds: avgDurationSeconds,
        }
      }

      // Get agent statuses
      if (include === "all" || include === "agents") {
        // For now, return mock agents since we don't have a proper agent status table
        response.agents = generateMockAgents()
      }

      response.lastUpdated = new Date().toISOString()
      return successResponse(response)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch customer service data"
      console.error("[Admin Customer Service] GET Error:", error)
      return serverError(errorMessage)
    }
  })
}

/**
 * POST /api/admin/customer-service
 * Perform actions like joining a session, updating agent status, etc.
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()

      const body = await request.json()
      const { action, conversationId, status, notes } = body

      if (!action) {
        return validationError("Action is required")
      }

      // Dev mode mock responses
      if (isDevMode || !isDbConfigured()) {
        switch (action) {
          case "join_session":
            return successResponse({
              success: true,
              sessionId: conversationId,
              message: "Successfully joined session",
              roomUrl: `https://meet.example.com/session/${conversationId}`,
            })

          case "update_agent_status":
            return successResponse({
              success: true,
              status,
              message: `Agent status updated to ${status}`,
            })

          case "resolve_session":
            return successResponse({
              success: true,
              conversationId,
              message: "Session resolved successfully",
            })

          case "escalate_session":
            return successResponse({
              success: true,
              conversationId,
              message: "Session escalated successfully",
            })

          default:
            return validationError(`Unknown action: ${action}`)
        }
      }

      // Real database operations
      switch (action) {
        case "join_session":
          if (!conversationId) {
            return validationError("conversationId is required for join_session")
          }

          await db!
            .update(supportConversations)
            .set({
              escalatedTo: userId,
              escalatedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(supportConversations.id, conversationId))

          return successResponse({
            success: true,
            sessionId: conversationId,
            message: "Successfully joined session",
          })

        case "resolve_session":
          if (!conversationId) {
            return validationError("conversationId is required for resolve_session")
          }

          await db!
            .update(supportConversations)
            .set({
              status: "resolved",
              resolution: notes || "Session resolved by agent",
              resolvedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(supportConversations.id, conversationId))

          return successResponse({
            success: true,
            conversationId,
            message: "Session resolved successfully",
          })

        case "escalate_session":
          if (!conversationId) {
            return validationError("conversationId is required for escalate_session")
          }

          await db!
            .update(supportConversations)
            .set({
              status: "escalated",
              escalationReason: notes || "Escalated by agent",
              updatedAt: new Date(),
            })
            .where(eq(supportConversations.id, conversationId))

          return successResponse({
            success: true,
            conversationId,
            message: "Session escalated successfully",
          })

        default:
          return validationError(`Unknown action: ${action}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to perform action"
      console.error("[Admin Customer Service] POST Error:", error)
      return serverError(errorMessage)
    }
  })
}
