import { NextRequest, NextResponse } from "next/server"
import { createIntegrationAgent, type AgentContext } from "@/lib/support/integration-agent"
import type { SupportMessage, TechStack, IntegrationContext, ConversationTopic } from "@/lib/support/types"
import { db, supportMessages, supportConversations } from "@/lib/db"
import { eq } from "drizzle-orm"

interface ChatRequest {
  conversationId: string
  message: string
  context?: {
    partnerId?: string
    partnerName?: string
    topic?: ConversationTopic
    techStack?: TechStack
    integrationContext?: IntegrationContext
    onboardingStep?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { conversationId, message, context } = body

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "conversationId and message are required" },
        { status: 400 }
      )
    }

    let existingMessages: SupportMessage[] = []
    if (db) {
      const dbMessages = await db
        .select()
        .from(supportMessages)
        .where(eq(supportMessages.conversationId, conversationId))
        .orderBy(supportMessages.createdAt)

      existingMessages = dbMessages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        role: m.role as SupportMessage["role"],
        content: m.content,
        contentType: (m.contentType || "text") as SupportMessage["contentType"],
        codeSnippet: m.codeSnippet || undefined,
        codeLanguage: m.codeLanguage || undefined,
        toolsUsed: m.toolsUsed ? JSON.parse(m.toolsUsed) : undefined,
        createdAt: m.createdAt,
      }))
    }

    const agentContext: AgentContext = {
      partnerId: context?.partnerId,
      partnerName: context?.partnerName,
      topic: context?.topic,
      techStack: context?.techStack,
      integrationContext: context?.integrationContext,
      onboardingStep: context?.onboardingStep,
    }

    const agent = createIntegrationAgent(agentContext)
    const response = await agent.chat(existingMessages, message)

    if (db) {
      await db.insert(supportMessages).values({
        conversationId,
        role: "user",
        content: message,
        contentType: "text",
      })

      await db.insert(supportMessages).values({
        conversationId,
        role: "assistant",
        content: response.content,
        contentType: response.codeSnippet ? "code" : "text",
        codeSnippet: response.codeSnippet,
        codeLanguage: response.codeLanguage,
        toolsUsed: response.toolsUsed.length > 0 ? JSON.stringify(response.toolsUsed) : null,
      })

      if (response.shouldEscalate && response.escalationReason) {
        await db
          .update(supportConversations)
          .set({
            status: "escalated",
            escalationReason: response.escalationReason,
            escalatedAt: new Date(),
            priority: "high",
            updatedAt: new Date(),
          })
          .where(eq(supportConversations.id, conversationId))
      }
    }

    return NextResponse.json({
      response: response.content,
      toolsUsed: response.toolsUsed,
      codeSnippet: response.codeSnippet,
      codeLanguage: response.codeLanguage,
      escalated: response.shouldEscalate,
    })
  } catch (error) {
    console.error("[Support Chat API] Error:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("OPENAI")) {
        return NextResponse.json(
          { error: "AI service configuration error" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
