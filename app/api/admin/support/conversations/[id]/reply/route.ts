import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, supportMessages } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

const replySchema = z.object({
  content: z.string().min(1).max(10000),
  codeSnippet: z.string().max(50000).optional(),
  codeLanguage: z.enum([
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "html",
    "css",
    "json",
    "bash",
    "python",
    "ruby",
    "php",
    "go",
    "java",
    "csharp",
    "sql",
    "yaml",
    "markdown",
    "plaintext",
  ]).optional(),
  contentType: z.enum(["text", "code", "error", "action"]).default("text"),
})

/**
 * POST /api/admin/support/conversations/[id]/reply
 * Admin sends a reply to a support conversation
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id: conversationId } = await context.params
      const body = await request.json()

      const validationResult = replySchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid reply data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { content, codeSnippet, codeLanguage, contentType } = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          role: "assistant",
          content,
          contentType,
          codeSnippet: codeSnippet || null,
          codeLanguage: codeLanguage || null,
          toolsUsed: null,
          createdAt: new Date().toISOString(),
        }

        return successResponse(newMessage, "Reply sent", 201)
      }

      // First, verify the conversation exists
      const [conversation] = await db!
        .select()
        .from(supportConversations)
        .where(eq(supportConversations.id, conversationId))
        .limit(1)

      if (!conversation) {
        return notFoundError("Conversation")
      }

      // Create the message
      const [newMessage] = await db!
        .insert(supportMessages)
        .values({
          conversationId,
          role: "assistant",
          content,
          contentType,
          codeSnippet: codeSnippet || null,
          codeLanguage: codeLanguage || null,
          toolsUsed: null,
        })
        .returning()

      // Update the conversation's updatedAt timestamp
      await db!
        .update(supportConversations)
        .set({
          updatedAt: new Date(),
          // If conversation was escalated, keep it escalated; otherwise set to active
          status: conversation.status === "escalated" ? "escalated" : "active",
        })
        .where(eq(supportConversations.id, conversationId))

      return successResponse(newMessage, "Reply sent", 201)
    } catch (error: any) {
      console.error("[Admin Support Reply] POST Error:", error)
      return serverError(error.message || "Failed to send reply")
    }
  })
}
