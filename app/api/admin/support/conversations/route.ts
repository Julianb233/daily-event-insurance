import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, supportMessages, partners } from "@/lib/db"
import { eq, desc, and, or, ilike, count, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, validationError, paginatedResponse } from "@/lib/api-responses"
import { z } from "zod"

// Validation schema for query parameters
const listConversationsSchema = z.object({
  status: z.enum(["active", "resolved", "escalated", "abandoned", "all"]).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  topic: z.enum(["onboarding", "widget_install", "api_integration", "pos_setup", "troubleshooting"]).optional(),
  search: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

/**
 * GET /api/admin/support/conversations
 * List all support conversations with filters
 *
 * Query params:
 * - status: active | resolved | escalated | abandoned | all
 * - priority: low | normal | high | urgent
 * - topic: onboarding | widget_install | api_integration | pos_setup | troubleshooting
 * - search: search by partner name or email
 * - limit: number of results (default 20, max 100)
 * - offset: pagination offset (default 0)
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
      const validationResult = listConversationsSchema.safeParse(params)
      if (!validationResult.success) {
        return validationError(
          "Invalid query parameters",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { status, topic, search, priority, limit, offset } = validationResult.data
      const page = Math.floor(offset / limit) + 1

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockConversations = [
          {
            id: "conv-1",
            partnerId: "p1",
            partnerEmail: "john@adventuresports.com",
            partnerName: "Adventure Sports Inc",
            sessionId: "sess-abc123",
            pageUrl: "/partner/onboarding/step-3",
            onboardingStep: 3,
            topic: "widget_install",
            techStack: JSON.stringify({ framework: "react", pos: "mindbody" }),
            status: "active",
            priority: "high",
            messageCount: 8,
            lastMessageAt: "2024-12-20T14:30:00Z",
            createdAt: "2024-12-20T14:00:00Z",
            updatedAt: "2024-12-20T14:30:00Z",
          },
          {
            id: "conv-2",
            partnerId: "p2",
            partnerEmail: "sarah@climbersco.com",
            partnerName: "Mountain Climbers Co",
            sessionId: "sess-def456",
            pageUrl: "/partner/onboarding/step-5",
            onboardingStep: 5,
            topic: "api_integration",
            techStack: JSON.stringify({ framework: "vue", pos: "none" }),
            status: "escalated",
            priority: "urgent",
            escalatedAt: "2024-12-19T16:00:00Z",
            escalationReason: "Complex custom integration request",
            messageCount: 15,
            lastMessageAt: "2024-12-19T16:00:00Z",
            createdAt: "2024-12-19T10:00:00Z",
            updatedAt: "2024-12-19T16:00:00Z",
          },
          {
            id: "conv-3",
            partnerId: "p3",
            partnerEmail: "mike@urbangym.com",
            partnerName: "Urban Gym Network",
            sessionId: "sess-ghi789",
            pageUrl: "/partner/dashboard",
            onboardingStep: null,
            topic: "troubleshooting",
            techStack: JSON.stringify({ framework: "wordpress", pos: "zen_planner" }),
            status: "resolved",
            priority: "normal",
            resolution: "Helped configure webhook endpoints correctly",
            resolvedAt: "2024-12-18T11:30:00Z",
            helpfulRating: 5,
            feedback: "Very helpful support!",
            messageCount: 6,
            lastMessageAt: "2024-12-18T11:30:00Z",
            createdAt: "2024-12-18T09:00:00Z",
            updatedAt: "2024-12-18T11:30:00Z",
          },
          {
            id: "conv-4",
            partnerId: null,
            partnerEmail: "newpartner@example.com",
            partnerName: "New Partner LLC",
            sessionId: "sess-jkl012",
            pageUrl: "/partner/onboarding/step-1",
            onboardingStep: 1,
            topic: "onboarding",
            techStack: null,
            status: "active",
            priority: "normal",
            messageCount: 3,
            lastMessageAt: "2024-12-20T15:45:00Z",
            createdAt: "2024-12-20T15:30:00Z",
            updatedAt: "2024-12-20T15:45:00Z",
          },
          {
            id: "conv-5",
            partnerId: "p4",
            partnerEmail: "lisa@summitfitness.com",
            partnerName: "Summit Fitness",
            sessionId: "sess-mno345",
            pageUrl: "/partner/integration",
            onboardingStep: null,
            topic: "pos_setup",
            techStack: JSON.stringify({ framework: "shopify", pos: "square" }),
            status: "abandoned",
            priority: "low",
            messageCount: 2,
            lastMessageAt: "2024-12-17T08:15:00Z",
            createdAt: "2024-12-17T08:00:00Z",
            updatedAt: "2024-12-17T08:15:00Z",
          },
        ]

        // Sort by updatedAt desc first
        mockConversations.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )

        const filtered = mockConversations.filter((c) => {
          if (status && status !== "all" && c.status !== status) return false
          if (topic && c.topic !== topic) return false
          if (priority && c.priority !== priority) return false
          if (search) {
            const searchLower = search.toLowerCase()
            const matchesName = c.partnerName?.toLowerCase().includes(searchLower)
            const matchesEmail = c.partnerEmail?.toLowerCase().includes(searchLower)
            // Also search in last message content if available
            if (!matchesName && !matchesEmail) return false
          }
          return true
        })

        return paginatedResponse(
          filtered.slice(offset, offset + limit),
          page,
          limit,
          filtered.length
        )
      }

      // Build where conditions
      const conditions = []
      if (status && status !== "all") {
        conditions.push(eq(supportConversations.status, status))
      }
      if (topic) {
        conditions.push(eq(supportConversations.topic, topic))
      }
      if (priority) {
        conditions.push(eq(supportConversations.priority, priority))
      }
      if (search) {
        conditions.push(
          or(
            ilike(supportConversations.partnerName, `%${search}%`),
            ilike(supportConversations.partnerEmail, `%${search}%`)
          )
        )
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get conversations with partner info and message count
      const conversationsData = await db!
        .select({
          id: supportConversations.id,
          partnerId: supportConversations.partnerId,
          partnerEmail: supportConversations.partnerEmail,
          partnerName: supportConversations.partnerName,
          partnerBusinessName: partners.businessName,
          sessionId: supportConversations.sessionId,
          pageUrl: supportConversations.pageUrl,
          onboardingStep: supportConversations.onboardingStep,
          topic: supportConversations.topic,
          techStack: supportConversations.techStack,
          integrationContext: supportConversations.integrationContext,
          status: supportConversations.status,
          priority: supportConversations.priority,
          escalatedAt: supportConversations.escalatedAt,
          escalatedTo: supportConversations.escalatedTo,
          escalationReason: supportConversations.escalationReason,
          resolution: supportConversations.resolution,
          resolvedAt: supportConversations.resolvedAt,
          helpfulRating: supportConversations.helpfulRating,
          feedback: supportConversations.feedback,
          createdAt: supportConversations.createdAt,
          updatedAt: supportConversations.updatedAt,
        })
        .from(supportConversations)
        .leftJoin(partners, eq(supportConversations.partnerId, partners.id))
        .where(whereClause)
        .orderBy(desc(supportConversations.updatedAt))
        .limit(limit)
        .offset(offset)

      // Get message counts for each conversation
      const conversationIds = conversationsData.map((c) => c.id)

      let messageCounts: Record<string, number> = {}
      let lastMessages: Record<string, Date | null> = {}

      if (conversationIds.length > 0) {
        const messageStats = await db!
          .select({
            conversationId: supportMessages.conversationId,
            messageCount: count(),
            lastMessageAt: sql<Date>`MAX(${supportMessages.createdAt})`,
          })
          .from(supportMessages)
          .where(sql`${supportMessages.conversationId} = ANY(${conversationIds})`)
          .groupBy(supportMessages.conversationId)

        messageStats.forEach((stat) => {
          messageCounts[stat.conversationId] = Number(stat.messageCount)
          lastMessages[stat.conversationId] = stat.lastMessageAt
        })
      }

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(supportConversations)
        .where(whereClause)

      // Combine data with last message preview
      const enrichedConversations = conversationsData.map((conv) => ({
        ...conv,
        partnerName: conv.partnerBusinessName || conv.partnerName,
        techStack: conv.techStack ? JSON.parse(conv.techStack) : null,
        integrationContext: conv.integrationContext ? JSON.parse(conv.integrationContext) : null,
        messageCount: messageCounts[conv.id] || 0,
        lastMessageAt: lastMessages[conv.id] || conv.updatedAt,
      }))

      return paginatedResponse(
        enrichedConversations,
        page,
        limit,
        Number(total)
      )
    } catch (error: any) {
      console.error("[Admin Support Conversations] GET Error:", error)
      return serverError(error.message || "Failed to fetch conversations")
    }
  })
}
