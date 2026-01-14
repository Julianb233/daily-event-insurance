import { NextRequest } from "next/server"
import { requireAdmin, withAuth, getAuthenticatedUser } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, users } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFound, badRequest } from "@/lib/api-responses"

/**
 * POST /api/admin/support/escalations/[id]/take-over
 * Take over an escalated conversation (assign to current user)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await params
      const currentUser = await getAuthenticatedUser()

      if (!currentUser) {
        return badRequest("Unable to identify current user")
      }

      // Dev mode mock response
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id,
          escalatedTo: currentUser.userId,
          escalatedToName: currentUser.user?.name || currentUser.user?.email || "Admin",
          status: "in_progress",
          updatedAt: new Date().toISOString(),
          message: "Conversation taken over successfully",
        })
      }

      // Verify the escalation exists and is still escalated
      const [existingEscalation] = await db!
        .select()
        .from(supportConversations)
        .where(and(
          eq(supportConversations.id, id),
          eq(supportConversations.status, "escalated")
        ))
        .limit(1)

      if (!existingEscalation) {
        return notFound("Escalated conversation not found or already resolved")
      }

      // Update the conversation to assign it to current user
      const [updated] = await db!
        .update(supportConversations)
        .set({
          escalatedTo: currentUser.userId,
          status: "active", // Change status to active since human is taking over
          updatedAt: new Date(),
        })
        .where(eq(supportConversations.id, id))
        .returning()

      return successResponse({
        id: updated.id,
        escalatedTo: currentUser.userId,
        escalatedToName: currentUser.user?.name || currentUser.user?.email || "Admin",
        status: updated.status,
        escalatedAt: updated.escalatedAt?.toISOString() || null,
        updatedAt: updated.updatedAt.toISOString(),
        message: "Conversation taken over successfully",
      })
    } catch (error: unknown) {
      console.error("[Admin Support Escalation Take-Over] POST Error:", error)
      const message = error instanceof Error ? error.message : "Failed to take over conversation"
      return serverError(message)
    }
  })
}
