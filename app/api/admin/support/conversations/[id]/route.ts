import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, supportConversations, supportMessages, partners, users } from "@/lib/db"
import { eq, asc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFound, validationError } from "@/lib/api-responses"
import { z } from "zod"

// Validation schema for PATCH request body
const updateConversationSchema = z.object({
  status: z.enum(["active", "resolved", "escalated", "abandoned"]).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  resolution: z.string().max(2000).optional(),
  escalate: z.boolean().optional(),
  escalationReason: z.string().max(500).optional(),
  helpfulRating: z.number().int().min(1).max(5).optional(),
  feedback: z.string().max(1000).optional(),
  topic: z.enum(["onboarding", "widget_install", "api_integration", "pos_setup", "troubleshooting"]).optional(),
})

/**
 * GET /api/admin/support/conversations/[id]
 * Get a single conversation with all messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id: conversationId } = await params

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        const mockConversation = {
          id: conversationId,
          partnerId: "p1",
          partnerEmail: "john@adventuresports.com",
          partnerName: "Adventure Sports Inc",
          sessionId: "sess-abc123",
          pageUrl: "/partner/onboarding/step-3",
          onboardingStep: 3,
          topic: "widget_install",
          techStack: { framework: "react", pos: "mindbody" },
          integrationContext: { widgetId: "w-123", apiKeyGenerated: true },
          status: "active",
          priority: "high",
          escalatedAt: null,
          escalatedTo: null,
          escalationReason: null,
          resolution: null,
          resolvedAt: null,
          helpfulRating: null,
          feedback: null,
          createdAt: "2024-12-20T14:00:00Z",
          updatedAt: "2024-12-20T14:30:00Z",
          messages: [
            {
              id: "msg-1",
              conversationId,
              role: "user",
              content: "Hi, I need help installing the widget on my React site",
              contentType: "text",
              codeSnippet: null,
              codeLanguage: null,
              toolsUsed: null,
              createdAt: "2024-12-20T14:00:00Z",
            },
            {
              id: "msg-2",
              conversationId,
              role: "assistant",
              content: "Hello! I'd be happy to help you integrate our widget into your React application. Let me guide you through the process step by step.\n\nFirst, you'll need to install our npm package.",
              contentType: "text",
              codeSnippet: "npm install @daily-event-insurance/widget-react",
              codeLanguage: "bash",
              toolsUsed: null,
              createdAt: "2024-12-20T14:01:00Z",
            },
            {
              id: "msg-3",
              conversationId,
              role: "user",
              content: "I installed it. What's next?",
              contentType: "text",
              codeSnippet: null,
              codeLanguage: null,
              toolsUsed: null,
              createdAt: "2024-12-20T14:05:00Z",
            },
            {
              id: "msg-4",
              conversationId,
              role: "assistant",
              content: "Great! Now you need to import and configure the widget in your component. Here's an example:",
              contentType: "code",
              codeSnippet: `import { InsuranceWidget } from '@daily-event-insurance/widget-react';

function CheckoutPage() {
  return (
    <InsuranceWidget
      partnerId="your-partner-id"
      eventType="fitness_class"
      onPurchase={(policy) => console.log('Policy:', policy)}
    />
  );
}`,
              codeLanguage: "jsx",
              toolsUsed: JSON.stringify(["code_generation"]),
              createdAt: "2024-12-20T14:06:00Z",
            },
            {
              id: "msg-5",
              conversationId,
              role: "user",
              content: "I'm getting a CORS error when the widget tries to load",
              contentType: "error",
              codeSnippet: "Access to fetch at 'https://api.dailyeventinsurance.com' has been blocked by CORS policy",
              codeLanguage: null,
              toolsUsed: null,
              createdAt: "2024-12-20T14:15:00Z",
            },
            {
              id: "msg-6",
              conversationId,
              role: "assistant",
              content: "I see the CORS issue. This usually happens when your domain isn't whitelisted yet. Let me check your integration settings and add your development domain.",
              contentType: "text",
              codeSnippet: null,
              codeLanguage: null,
              toolsUsed: JSON.stringify(["integration_lookup", "domain_whitelist"]),
              createdAt: "2024-12-20T14:16:00Z",
            },
            {
              id: "msg-7",
              conversationId,
              role: "system",
              content: "Domain localhost:3000 added to whitelist for partner Adventure Sports Inc",
              contentType: "action",
              codeSnippet: null,
              codeLanguage: null,
              toolsUsed: null,
              createdAt: "2024-12-20T14:16:30Z",
            },
            {
              id: "msg-8",
              conversationId,
              role: "assistant",
              content: "I've added localhost:3000 to your allowed domains. Please refresh your page and try again. The CORS error should be resolved now.",
              contentType: "text",
              codeSnippet: null,
              codeLanguage: null,
              toolsUsed: null,
              createdAt: "2024-12-20T14:17:00Z",
            },
          ],
        }

        return successResponse(mockConversation)
      }

      // Get conversation with partner info
      const [conversation] = await db!
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
          escalatedToName: users.name,
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
        .leftJoin(users, eq(supportConversations.escalatedTo, users.id))
        .where(eq(supportConversations.id, conversationId))

      if (!conversation) {
        return notFound("Conversation not found")
      }

      // Get all messages for this conversation
      const messages = await db!
        .select({
          id: supportMessages.id,
          conversationId: supportMessages.conversationId,
          role: supportMessages.role,
          content: supportMessages.content,
          contentType: supportMessages.contentType,
          codeSnippet: supportMessages.codeSnippet,
          codeLanguage: supportMessages.codeLanguage,
          toolsUsed: supportMessages.toolsUsed,
          createdAt: supportMessages.createdAt,
        })
        .from(supportMessages)
        .where(eq(supportMessages.conversationId, conversationId))
        .orderBy(asc(supportMessages.createdAt))

      return successResponse({
        ...conversation,
        partnerName: conversation.partnerBusinessName || conversation.partnerName,
        techStack: conversation.techStack ? JSON.parse(conversation.techStack) : null,
        integrationContext: conversation.integrationContext
          ? JSON.parse(conversation.integrationContext)
          : null,
        messages: messages.map((msg) => ({
          ...msg,
          toolsUsed: msg.toolsUsed ? JSON.parse(msg.toolsUsed) : null,
        })),
      })
    } catch (error: any) {
      console.error("[Admin Support Conversation] GET Error:", error)
      return serverError(error.message || "Failed to fetch conversation")
    }
  })
}

/**
 * PATCH /api/admin/support/conversations/[id]
 * Update conversation (status, resolution, escalation, priority)
 *
 * Body:
 * - status: active | resolved | escalated | abandoned
 * - priority: low | normal | high | urgent
 * - resolution: string (max 2000 chars)
 * - escalate: boolean - set to true to escalate
 * - escalationReason: string (max 500 chars)
 * - helpfulRating: 1-5
 * - feedback: string (max 1000 chars)
 * - topic: onboarding | widget_install | api_integration | pos_setup | troubleshooting
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id: conversationId } = await params
      const body = await request.json()

      // Validate request body using Zod
      const validationResult = updateConversationSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid conversation update data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const {
        status,
        priority,
        resolution,
        escalate,
        escalationReason,
        helpfulRating,
        feedback,
        topic,
      } = validationResult.data

      // Dev mode mock response
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          id: conversationId,
          status: status || "active",
          priority: priority || "normal",
          topic: topic || "widget_install",
          resolution: resolution || null,
          escalatedAt: escalate ? new Date().toISOString() : null,
          escalationReason: escalationReason || null,
          resolvedAt: status === "resolved" ? new Date().toISOString() : null,
          helpfulRating: helpfulRating || null,
          feedback: feedback || null,
          updatedAt: new Date().toISOString(),
        }, "Conversation updated successfully")
      }

      // Check conversation exists
      const [existing] = await db!
        .select({ id: supportConversations.id, status: supportConversations.status })
        .from(supportConversations)
        .where(eq(supportConversations.id, conversationId))

      if (!existing) {
        return notFound("Conversation not found")
      }

      // Build update object
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      if (status) {
        updateData.status = status

        // Set resolved timestamp if resolving
        if (status === "resolved" && existing.status !== "resolved") {
          updateData.resolvedAt = new Date()
        }
      }

      if (priority) {
        updateData.priority = priority
      }

      if (resolution !== undefined) {
        updateData.resolution = resolution
      }

      // Handle escalation
      if (escalate === true) {
        updateData.status = "escalated"
        updateData.escalatedAt = new Date()
        updateData.escalatedTo = userId
        if (escalationReason) {
          updateData.escalationReason = escalationReason
        }
      }

      if (helpfulRating !== undefined) {
        updateData.helpfulRating = helpfulRating
      }

      if (feedback !== undefined) {
        updateData.feedback = feedback
      }

      if (topic !== undefined) {
        updateData.topic = topic
      }

      // Update conversation
      const [updated] = await db!
        .update(supportConversations)
        .set(updateData)
        .where(eq(supportConversations.id, conversationId))
        .returning()

      return successResponse({
        ...updated,
        techStack: updated.techStack ? JSON.parse(updated.techStack) : null,
        integrationContext: updated.integrationContext
          ? JSON.parse(updated.integrationContext)
          : null,
        message: "Conversation updated successfully",
      })
    } catch (error: any) {
      console.error("[Admin Support Conversation] PATCH Error:", error)
      return serverError(error.message || "Failed to update conversation")
    }
  })
}
