import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, supportMessages, users } from "@/lib/db"
import { eq, sql, desc, count, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest, notFound } from "@/lib/api-responses"
import type { EscalatedConversation, EscalationSummary, EscalationPriority } from "@/lib/support/escalation-types"

// Mock data for development
const mockEscalations: EscalatedConversation[] = [
  {
    id: "esc-001",
    partnerId: "partner-001",
    partnerEmail: "john@adventuresports.com",
    partnerName: "Adventure Sports Inc",
    sessionId: "sess-abc-123",
    pageUrl: "/onboarding/step-3",
    onboardingStep: 3,
    topic: "widget_install",
    techStack: JSON.stringify({ framework: "react", pos: "mindbody" }),
    integrationContext: JSON.stringify({ widgetInstalled: false, lastError: "CORS error" }),
    status: "escalated",
    priority: "urgent",
    escalatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    escalatedTo: null,
    escalatedToName: null,
    escalationReason: "technical_issue",
    resolution: null,
    resolvedAt: null,
    helpfulRating: null,
    feedback: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messageCount: 12,
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "esc-002",
    partnerId: "partner-002",
    partnerEmail: "sarah@summitgym.com",
    partnerName: "Summit Fitness Center",
    sessionId: "sess-def-456",
    pageUrl: "/onboarding/step-5",
    onboardingStep: 5,
    topic: "api_integration",
    techStack: JSON.stringify({ framework: "nextjs", language: "typescript" }),
    integrationContext: JSON.stringify({ apiKeyGenerated: true, webhookConfigured: false }),
    status: "escalated",
    priority: "high",
    escalatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    escalatedTo: "user-001",
    escalatedToName: "Mike Johnson",
    escalationReason: "integration_failure",
    resolution: null,
    resolvedAt: null,
    helpfulRating: null,
    feedback: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    messageCount: 8,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "esc-003",
    partnerId: "partner-003",
    partnerEmail: "mike@urbanclimbing.com",
    partnerName: "Urban Climbing Co",
    sessionId: "sess-ghi-789",
    pageUrl: "/settings/billing",
    onboardingStep: null,
    topic: "troubleshooting",
    techStack: JSON.stringify({ pos: "pike13" }),
    integrationContext: JSON.stringify({ posConnected: true, lastError: "Payment sync failed" }),
    status: "escalated",
    priority: "normal",
    escalatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    escalatedTo: null,
    escalatedToName: null,
    escalationReason: "billing_dispute",
    resolution: null,
    resolvedAt: null,
    helpfulRating: null,
    feedback: null,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messageCount: 5,
    lastMessageAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "esc-004",
    partnerId: null,
    partnerEmail: "guest@example.com",
    partnerName: "Guest User",
    sessionId: "sess-jkl-012",
    pageUrl: "/onboarding/step-1",
    onboardingStep: 1,
    topic: "onboarding",
    techStack: null,
    integrationContext: null,
    status: "escalated",
    priority: "low",
    escalatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    escalatedTo: "user-002",
    escalatedToName: "Emily Davis",
    escalationReason: "account_problem",
    resolution: null,
    resolvedAt: null,
    helpfulRating: null,
    feedback: null,
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    messageCount: 3,
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockTeamMembers = [
  { id: "user-001", name: "Mike Johnson", email: "mike@dailyevent.io", role: "admin" },
  { id: "user-002", name: "Emily Davis", email: "emily@dailyevent.io", role: "admin" },
  { id: "user-003", name: "Alex Chen", email: "alex@dailyevent.io", role: "admin" },
]

/**
 * GET /api/admin/support/escalations
 * List all escalated conversations with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const priority = searchParams.get("priority") // urgent, high, normal, low, all
      const assigned = searchParams.get("assigned") // true, false, all
      const assignedTo = searchParams.get("assignedTo") // specific user id
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "20")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockEscalations]

        // Apply filters
        if (priority && priority !== "all") {
          filtered = filtered.filter(e => e.priority === priority)
        }
        if (assigned === "true") {
          filtered = filtered.filter(e => e.escalatedTo !== null)
        } else if (assigned === "false") {
          filtered = filtered.filter(e => e.escalatedTo === null)
        }
        if (assignedTo) {
          filtered = filtered.filter(e => e.escalatedTo === assignedTo)
        }

        // Sort by priority (urgent first) then by escalatedAt (oldest first)
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
        filtered.sort((a, b) => {
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
          if (priorityDiff !== 0) return priorityDiff
          return new Date(a.escalatedAt).getTime() - new Date(b.escalatedAt).getTime()
        })

        // Calculate summary
        const summary: EscalationSummary = {
          total: mockEscalations.length,
          byPriority: {
            urgent: mockEscalations.filter(e => e.priority === "urgent").length,
            high: mockEscalations.filter(e => e.priority === "high").length,
            normal: mockEscalations.filter(e => e.priority === "normal").length,
            low: mockEscalations.filter(e => e.priority === "low").length,
          },
          unassigned: mockEscalations.filter(e => e.escalatedTo === null).length,
          avgTimeToAssign: 45, // minutes
        }

        return successResponse({
          data: filtered.slice(offset, offset + limit),
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
          },
          summary,
          teamMembers: mockTeamMembers,
        })
      }

      // Build where conditions
      const conditions = [eq(supportConversations.status, "escalated")]

      if (priority && priority !== "all") {
        conditions.push(eq(supportConversations.priority, priority))
      }
      if (assigned === "true") {
        conditions.push(sql`${supportConversations.escalatedTo} IS NOT NULL`)
      } else if (assigned === "false") {
        conditions.push(sql`${supportConversations.escalatedTo} IS NULL`)
      }
      if (assignedTo) {
        conditions.push(eq(supportConversations.escalatedTo, assignedTo))
      }

      const whereClause = and(...conditions)

      // Get escalated conversations with message count
      const escalationsData = await db!
        .select({
          id: supportConversations.id,
          partnerId: supportConversations.partnerId,
          partnerEmail: supportConversations.partnerEmail,
          partnerName: supportConversations.partnerName,
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
          escalatedToName: users.name,
          messageCount: sql<number>`(SELECT COUNT(*) FROM support_messages WHERE conversation_id = ${supportConversations.id})`,
          lastMessageAt: sql<string>`(SELECT MAX(created_at) FROM support_messages WHERE conversation_id = ${supportConversations.id})`,
        })
        .from(supportConversations)
        .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
        .where(whereClause)
        .orderBy(
          sql`CASE ${supportConversations.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 WHEN 'low' THEN 3 END`,
          supportConversations.escalatedAt
        )
        .limit(limit)
        .offset(offset)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(supportConversations)
        .where(whereClause)

      // Get summary stats
      const summaryData = await db!
        .select({
          priority: supportConversations.priority,
          count: count(),
        })
        .from(supportConversations)
        .where(eq(supportConversations.status, "escalated"))
        .groupBy(supportConversations.priority)

      const [unassignedCount] = await db!
        .select({ count: count() })
        .from(supportConversations)
        .where(and(
          eq(supportConversations.status, "escalated"),
          sql`${supportConversations.escalatedTo} IS NULL`
        ))

      // Build summary
      const summary: EscalationSummary = {
        total: Number(total),
        byPriority: {
          urgent: 0,
          high: 0,
          normal: 0,
          low: 0,
        },
        unassigned: Number(unassignedCount.count),
        avgTimeToAssign: null,
      }

      summaryData.forEach(s => {
        if (s.priority && s.priority in summary.byPriority) {
          summary.byPriority[s.priority as EscalationPriority] = Number(s.count)
        }
      })

      // Get team members (admins)
      const teamMembers = await db!
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.role, "admin"))

      return successResponse({
        data: escalationsData.map(e => ({
          ...e,
          escalatedAt: e.escalatedAt?.toISOString() || null,
          resolvedAt: e.resolvedAt?.toISOString() || null,
          createdAt: e.createdAt.toISOString(),
          updatedAt: e.updatedAt.toISOString(),
        })),
        pagination: {
          page,
          limit,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / limit),
        },
        summary,
        teamMembers,
      })
    } catch (error: unknown) {
      console.error("[Admin Support Escalations] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch escalations"
      return serverError(message)
    }
  })
}

/**
 * PATCH /api/admin/support/escalations
 * Assign escalation to team member (when id is provided in body)
 */
export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const body = await request.json()

      const { id, assignTo } = body

      if (!id) return badRequest("Escalation ID is required")
      if (!assignTo) return badRequest("Team member ID is required")

      if (isDevMode || !isDbConfigured()) {
        const escalation = mockEscalations.find(e => e.id === id)
        if (!escalation) return notFound("Escalation")

        const teamMember = mockTeamMembers.find(m => m.id === assignTo)

        return successResponse({
          ...escalation,
          escalatedTo: assignTo,
          escalatedToName: teamMember?.name || null,
          updatedAt: new Date().toISOString(),
          message: "Escalation assigned successfully (mock)",
        })
      }

      // Verify escalation exists
      const [existingEscalation] = await db!
        .select()
        .from(supportConversations)
        .where(and(
          eq(supportConversations.id, id),
          eq(supportConversations.status, "escalated")
        ))
        .limit(1)

      if (!existingEscalation) {
        return notFound("Escalation")
      }

      // Verify team member exists
      const [teamMember] = await db!
        .select()
        .from(users)
        .where(eq(users.id, assignTo))
        .limit(1)

      if (!teamMember) {
        return badRequest("Team member not found")
      }

      // Update escalation
      const [updated] = await db!
        .update(supportConversations)
        .set({
          escalatedTo: assignTo,
          updatedAt: new Date(),
        })
        .where(eq(supportConversations.id, id))
        .returning()

      return successResponse({
        ...updated,
        escalatedToName: teamMember.name,
        escalatedAt: updated.escalatedAt?.toISOString() || null,
        resolvedAt: updated.resolvedAt?.toISOString() || null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        message: "Escalation assigned successfully",
      })
    } catch (error: unknown) {
      console.error("[Admin Support Escalations] PATCH Error:", error)
      const message = error instanceof Error ? error.message : "Failed to assign escalation"
      return serverError(message)
    }
  })
}
