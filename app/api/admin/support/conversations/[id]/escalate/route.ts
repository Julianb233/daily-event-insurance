import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest, notFound } from "@/lib/api-responses"
import type { EscalateConversationRequest, EscalationPriority, EscalationReason } from "@/lib/support/escalation-types"

const VALID_PRIORITIES: EscalationPriority[] = ["low", "normal", "high", "urgent"]
const VALID_REASONS: EscalationReason[] = [
  "technical_issue",
  "billing_dispute",
  "account_problem",
  "integration_failure",
  "security_concern",
  "compliance_issue",
  "custom",
]

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/support/conversations/[id]/escalate
 * Escalate a conversation to the dev team
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id } = await context.params
      const body: EscalateConversationRequest = await request.json()

      const { reason, priority, notes, assignTo } = body

      // Validate required fields
      if (!reason) return badRequest("Escalation reason is required")
      if (!priority) return badRequest("Priority is required")

      // Validate values
      if (!VALID_REASONS.includes(reason)) {
        return badRequest(`Invalid reason. Must be one of: ${VALID_REASONS.join(", ")}`)
      }
      if (!VALID_PRIORITIES.includes(priority)) {
        return badRequest(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`)
      }

      // Build escalation reason text
      let escalationReasonText: string = reason
      if (notes) {
        escalationReasonText = `${reason}: ${notes}`
      }

      if (isDevMode || !isDbConfigured()) {
        // Mock response
        return successResponse({
          id,
          status: "escalated",
          priority,
          escalatedAt: new Date().toISOString(),
          escalatedTo: assignTo || null,
          escalatedToName: assignTo ? "Team Member" : null,
          escalationReason: escalationReasonText,
          updatedAt: new Date().toISOString(),
          message: "Conversation escalated successfully (mock)",
        })
      }

      // Verify conversation exists
      const [conversation] = await db!
        .select()
        .from(supportConversations)
        .where(eq(supportConversations.id, id))
        .limit(1)

      if (!conversation) {
        return notFound("Conversation")
      }

      // Check if already escalated
      if (conversation.status === "escalated") {
        return badRequest("Conversation is already escalated")
      }

      // Verify team member exists if assignTo provided
      let teamMemberName: string | null = null
      if (assignTo) {
        const [teamMember] = await db!
          .select()
          .from(users)
          .where(eq(users.id, assignTo))
          .limit(1)

        if (!teamMember) {
          return badRequest("Team member not found")
        }
        teamMemberName = teamMember.name
      }

      // Update conversation to escalated
      const [updated] = await db!
        .update(supportConversations)
        .set({
          status: "escalated",
          priority,
          escalatedAt: new Date(),
          escalatedTo: assignTo || null,
          escalationReason: escalationReasonText,
          updatedAt: new Date(),
        })
        .where(eq(supportConversations.id, id))
        .returning()

      return successResponse({
        id: updated.id,
        status: updated.status,
        priority: updated.priority,
        escalatedAt: updated.escalatedAt?.toISOString() || null,
        escalatedTo: updated.escalatedTo,
        escalatedToName: teamMemberName,
        escalationReason: updated.escalationReason,
        updatedAt: updated.updatedAt.toISOString(),
        message: "Conversation escalated successfully",
      })
    } catch (error: unknown) {
      console.error("[Admin Support Escalate] POST Error:", error)
      const message = error instanceof Error ? error.message : "Failed to escalate conversation"
      return serverError(message)
    }
  })
}

/**
 * DELETE /api/admin/support/conversations/[id]/escalate
 * De-escalate a conversation (return to active status)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id,
          status: "active",
          priority: "normal",
          escalatedAt: null,
          escalatedTo: null,
          escalationReason: null,
          updatedAt: new Date().toISOString(),
          message: "Conversation de-escalated successfully (mock)",
        })
      }

      // Verify conversation exists and is escalated
      const [conversation] = await db!
        .select()
        .from(supportConversations)
        .where(eq(supportConversations.id, id))
        .limit(1)

      if (!conversation) {
        return notFound("Conversation")
      }

      if (conversation.status !== "escalated") {
        return badRequest("Conversation is not escalated")
      }

      // Update conversation back to active
      const [updated] = await db!
        .update(supportConversations)
        .set({
          status: "active",
          priority: "normal",
          escalatedAt: null,
          escalatedTo: null,
          escalationReason: null,
          updatedAt: new Date(),
        })
        .where(eq(supportConversations.id, id))
        .returning()

      return successResponse({
        id: updated.id,
        status: updated.status,
        priority: updated.priority,
        escalatedAt: null,
        escalatedTo: null,
        escalationReason: null,
        updatedAt: updated.updatedAt.toISOString(),
        message: "Conversation de-escalated successfully",
      })
    } catch (error: unknown) {
      console.error("[Admin Support De-escalate] DELETE Error:", error)
      const message = error instanceof Error ? error.message : "Failed to de-escalate conversation"
      return serverError(message)
    }
  })
}
