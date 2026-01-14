import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, partners, users } from "@/lib/db"
import { eq, sql, and, isNull, count, avg, gte, desc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest } from "@/lib/api-responses"
import {
  type QueueItem,
  type CustomerServiceStats,
  type Agent,
  type SessionPriority,
  formatDuration,
  getSLAStatus,
  sortQueueByPriority,
  PRIORITY_CONFIG,
  SLA_CONFIG,
} from "@/lib/support/customer-service-types"

// Mock data for development
function getMockQueue(): QueueItem[] {
  const now = Date.now()
  return [
    {
      id: "q1",
      partnerName: "Acme Fitness Center",
      contactName: "John Smith",
      email: "john@acmefitness.com",
      businessType: "Gym",
      onboardingStep: "Integration Setup",
      requestReason: "Need help with API integration",
      priority: "urgent",
      waitTimeSeconds: 423,
      waitTimeFormatted: "7:03",
      joinedAt: new Date(now - 423000).toISOString(),
      sessionId: "sess-001",
      pageUrl: "/partner/onboarding/step-4",
      techStack: { framework: "react", pos: "mindbody" },
      conversationId: "conv-001",
      slaStatus: getSLAStatus(423),
    },
    {
      id: "q2",
      partnerName: "Adventure Tours LLC",
      contactName: "Sarah Johnson",
      email: "sarah@adventuretours.com",
      businessType: "Adventure",
      onboardingStep: "Customize Coverage",
      requestReason: "Questions about pricing configuration",
      priority: "high",
      waitTimeSeconds: 195,
      waitTimeFormatted: "3:15",
      joinedAt: new Date(now - 195000).toISOString(),
      sessionId: "sess-002",
      pageUrl: "/partner/onboarding/step-3",
      techStack: { framework: "vue", pos: undefined },
      conversationId: "conv-002",
      slaStatus: getSLAStatus(195),
    },
    {
      id: "q3",
      partnerName: "Rock Climbing Co",
      contactName: "Mike Davis",
      email: "mike@rockclimbing.com",
      businessType: "Climbing",
      onboardingStep: "Business Information",
      requestReason: "Website auto-fill not working",
      priority: "normal",
      waitTimeSeconds: 62,
      waitTimeFormatted: "1:02",
      joinedAt: new Date(now - 62000).toISOString(),
      sessionId: "sess-003",
      pageUrl: "/partner/onboarding/step-1",
      techStack: null,
      conversationId: "conv-003",
      slaStatus: getSLAStatus(62),
    },
    {
      id: "q4",
      partnerName: "Sunset Yoga Studio",
      contactName: "Lisa Chen",
      email: "lisa@sunsetyoga.com",
      businessType: "Wellness",
      onboardingStep: "Widget Installation",
      requestReason: "CORS error on widget load",
      priority: "high",
      waitTimeSeconds: 380,
      waitTimeFormatted: "6:20",
      joinedAt: new Date(now - 380000).toISOString(),
      sessionId: "sess-004",
      pageUrl: "/partner/onboarding/step-5",
      techStack: { framework: "wordpress" },
      conversationId: "conv-004",
      slaStatus: getSLAStatus(380),
    },
  ]
}

function getMockStats(): CustomerServiceStats {
  return {
    waiting: 4,
    inProgress: 2,
    completedToday: 24,
    avgWaitTimeSeconds: 154,
    avgWaitTimeFormatted: "2:34",
    avgDurationSeconds: 525,
    avgDurationFormatted: "8:45",
    slaCompliancePercent: 87.5,
    avgRating: 4.6,
    byPriority: {
      urgent: 1,
      high: 2,
      normal: 1,
      low: 0,
    },
  }
}

function getMockAgents(): Agent[] {
  return [
    { id: "agent-1", name: "Emily Chen", email: "emily@dailyevent.io", status: "busy", currentSessionCount: 1 },
    { id: "agent-2", name: "David Wilson", email: "david@dailyevent.io", status: "busy", currentSessionCount: 1 },
    { id: "agent-3", name: "Alex Thompson", email: "alex@dailyevent.io", status: "available", currentSessionCount: 0 },
  ]
}

/**
 * GET /api/admin/customer-service/queue
 * Get the current support queue with waiting partners, stats, and available agents
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const queue = sortQueueByPriority(getMockQueue())
        const stats = getMockStats()
        const agents = getMockAgents()

        return successResponse({
          queue,
          stats,
          agents,
        })
      }

      const now = new Date()
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      // Get waiting conversations (active but no agent assigned yet)
      // Using status = 'active' and a custom field or marker to indicate waiting state
      const waitingConversations = await db!
        .select({
          id: supportConversations.id,
          partnerId: supportConversations.partnerId,
          partnerEmail: supportConversations.partnerEmail,
          partnerName: supportConversations.partnerName,
          partnerBusinessName: partners.businessName,
          partnerBusinessType: partners.businessType,
          partnerContactName: partners.contactName,
          sessionId: supportConversations.sessionId,
          pageUrl: supportConversations.pageUrl,
          onboardingStep: supportConversations.onboardingStep,
          topic: supportConversations.topic,
          techStack: supportConversations.techStack,
          priority: supportConversations.priority,
          createdAt: supportConversations.createdAt,
          escalationReason: supportConversations.escalationReason,
        })
        .from(supportConversations)
        .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
        .where(
          and(
            eq(supportConversations.status, "active"),
            isNull(supportConversations.escalatedTo) // Not yet assigned to anyone
          )
        )
        .orderBy(
          sql`CASE ${supportConversations.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 WHEN 'low' THEN 3 END`,
          supportConversations.createdAt
        )

      // Transform to queue items
      const queue: QueueItem[] = waitingConversations.map((conv) => {
        const waitTimeSeconds = Math.floor((now.getTime() - new Date(conv.createdAt).getTime()) / 1000)
        const priority = (conv.priority || "normal") as SessionPriority
        const techStack = conv.techStack ? JSON.parse(conv.techStack) : null

        return {
          id: conv.id,
          partnerName: conv.partnerBusinessName || conv.partnerName || "Unknown",
          contactName: conv.partnerContactName || conv.partnerName || "Unknown",
          email: conv.partnerEmail || "",
          businessType: conv.partnerBusinessType || "Other",
          onboardingStep: conv.onboardingStep ? `Step ${conv.onboardingStep}` : null,
          requestReason: conv.escalationReason || conv.topic || "General support request",
          priority,
          waitTimeSeconds,
          waitTimeFormatted: formatDuration(waitTimeSeconds),
          joinedAt: conv.createdAt.toISOString(),
          sessionId: conv.sessionId,
          pageUrl: conv.pageUrl,
          techStack,
          conversationId: conv.id,
          slaStatus: getSLAStatus(waitTimeSeconds),
        }
      })

      // Get stats
      // Count waiting
      const [waitingCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "active"),
            isNull(supportConversations.escalatedTo)
          )
        )

      // Count in progress (active with agent assigned)
      const [inProgressCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "active"),
            sql`${supportConversations.escalatedTo} IS NOT NULL`
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

      // Get average rating
      const [avgRatingResult] = await db!
        .select({ avg: avg(supportConversations.helpfulRating) })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "resolved"),
            gte(supportConversations.resolvedAt, todayStart)
          )
        )

      // Calculate average wait time from resolved conversations today
      const resolvedToday = await db!
        .select({
          createdAt: supportConversations.createdAt,
          escalatedAt: supportConversations.escalatedAt,
        })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "resolved"),
            gte(supportConversations.resolvedAt, todayStart)
          )
        )

      let avgWaitTimeSeconds = 0
      let avgDurationSeconds = 0
      let slaCompliant = 0

      if (resolvedToday.length > 0) {
        let totalWait = 0
        resolvedToday.forEach((conv) => {
          if (conv.escalatedAt) {
            const waitTime = Math.floor(
              (new Date(conv.escalatedAt).getTime() - new Date(conv.createdAt).getTime()) / 1000
            )
            totalWait += waitTime
            if (waitTime <= SLA_CONFIG.waitTime.critical) {
              slaCompliant++
            }
          }
        })
        avgWaitTimeSeconds = Math.floor(totalWait / resolvedToday.length)
      }

      // Get priority counts
      const priorityCounts = await db!
        .select({
          priority: supportConversations.priority,
          count: count(),
        })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "active"),
            isNull(supportConversations.escalatedTo)
          )
        )
        .groupBy(supportConversations.priority)

      const byPriority: Record<SessionPriority, number> = {
        urgent: 0,
        high: 0,
        normal: 0,
        low: 0,
      }

      priorityCounts.forEach((pc) => {
        if (pc.priority && pc.priority in byPriority) {
          byPriority[pc.priority as SessionPriority] = Number(pc.count)
        }
      })

      const stats: CustomerServiceStats = {
        waiting: Number(waitingCount.count),
        inProgress: Number(inProgressCount.count),
        completedToday: Number(completedTodayCount.count),
        avgWaitTimeSeconds,
        avgWaitTimeFormatted: formatDuration(avgWaitTimeSeconds),
        avgDurationSeconds,
        avgDurationFormatted: formatDuration(avgDurationSeconds),
        slaCompliancePercent: resolvedToday.length > 0
          ? Math.round((slaCompliant / resolvedToday.length) * 100)
          : 100,
        avgRating: avgRatingResult.avg ? Number(avgRatingResult.avg) : null,
        byPriority,
      }

      // Get available agents (admin users)
      const agentsData = await db!
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.role, "admin"))

      // Count active sessions per agent
      const agentSessionCounts = await db!
        .select({
          agentId: supportConversations.escalatedTo,
          count: count(),
        })
        .from(supportConversations)
        .where(
          and(
            eq(supportConversations.status, "active"),
            sql`${supportConversations.escalatedTo} IS NOT NULL`
          )
        )
        .groupBy(supportConversations.escalatedTo)

      const sessionCountMap: Record<string, number> = {}
      agentSessionCounts.forEach((ac) => {
        if (ac.agentId) {
          sessionCountMap[ac.agentId] = Number(ac.count)
        }
      })

      const agents: Agent[] = agentsData.map((agent) => {
        const sessionCount = sessionCountMap[agent.id] || 0
        return {
          id: agent.id,
          name: agent.name || "Unknown",
          email: agent.email,
          status: sessionCount > 0 ? "busy" : "available",
          currentSessionCount: sessionCount,
        }
      })

      return successResponse({
        queue: sortQueueByPriority(queue),
        stats,
        agents,
      })
    } catch (error: unknown) {
      console.error("[Customer Service Queue] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch queue"
      return serverError(message)
    }
  })
}

/**
 * POST /api/admin/customer-service/queue
 * Assign an agent to a queue item (start session)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const body = await request.json()

      const { queueItemId, agentId } = body

      if (!queueItemId) return badRequest("Queue item ID is required")

      // Use the current admin user if no specific agent provided
      const assignToId = agentId || userId

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: queueItemId,
          assignedTo: assignToId,
          status: "in_progress",
          assignedAt: new Date().toISOString(),
          message: "Agent assigned successfully (mock)",
        })
      }

      // Update the conversation to assign the agent
      const [updated] = await db!
        .update(supportConversations)
        .set({
          escalatedTo: assignToId,
          escalatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(supportConversations.id, queueItemId))
        .returning()

      if (!updated) {
        return badRequest("Queue item not found")
      }

      return successResponse({
        id: updated.id,
        assignedTo: assignToId,
        status: "in_progress",
        assignedAt: updated.escalatedAt?.toISOString(),
        message: "Agent assigned successfully",
      })
    } catch (error: unknown) {
      console.error("[Customer Service Queue] POST Error:", error)
      const message = error instanceof Error ? error.message : "Failed to assign agent"
      return serverError(message)
    }
  })
}
