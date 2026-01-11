/**
 * Onboarding & Integration Agent Core
 *
 * The main agent that orchestrates the onboarding experience.
 * Uses OpenAI function calling with a state machine for predictable behavior.
 */

import OpenAI from "openai"
import { db } from "@/lib/db"
import { eq, desc } from "drizzle-orm"

import type {
  OnboardingState,
  OnboardingSession,
  OnboardingMessage,
  OnboardingCollectedData,
  IntegrationData,
  AgentContext
} from "./schema"
import {
  onboardingSessions,
  onboardingMessages,
  onboardingTasks,
  agentActionLogs
} from "./schema"
import {
  ONBOARDING_STATES,
  getAgentBehavior,
  canTransition,
  getNextRecommendedState,
  calculateProgress,
  shouldEscalate,
  createTransition
} from "./state-machine"
import { onboardingAgentTools, executeOnboardingTool, type ToolResult } from "./tools"

// ================= Agent Configuration =================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

/**
 * System prompt template for the onboarding agent
 */
function buildSystemPrompt(
  state: OnboardingState,
  collectedData: OnboardingCollectedData,
  integrationData: IntegrationData,
  agentContext: AgentContext
): string {
  const stateConfig = ONBOARDING_STATES[state]
  const behavior = stateConfig.agentBehavior

  const businessContext = collectedData.businessName
    ? `\n\nBusiness Context:
- Business Name: ${collectedData.businessName}
- Business Type: ${collectedData.businessType || "Not specified"}
- Contact: ${collectedData.contactName || "Not provided"} (${collectedData.contactEmail || "No email"})
- Monthly Participants: ${collectedData.estimatedMonthlyParticipants || "Unknown"}
- Website: ${collectedData.websiteUrl || "Not provided"}`
    : ""

  const integrationContext = integrationData.selectedMethod
    ? `\n\nIntegration Context:
- Selected Method: ${integrationData.selectedMethod}
- Platform: ${integrationData.platform?.name || "Generic"}
- Verified: ${integrationData.isVerified ? "Yes" : "Not yet"}`
    : ""

  const conversationContext = agentContext.conversationSummary
    ? `\n\nConversation Summary: ${agentContext.conversationSummary}`
    : ""

  const objections = agentContext.objections?.filter(o => !o.addressed).length
    ? `\n\nUnaddressed Concerns: ${agentContext.objections.filter(o => !o.addressed).map(o => o.objection).join(", ")}`
    : ""

  return `You are the Daily Event Insurance Onboarding Agent - a friendly, knowledgeable assistant that helps businesses sign up and integrate with our insurance platform.

## Your Identity
- Name: Sam
- Role: Onboarding & Integration Specialist
- Personality: Friendly, patient, knowledgeable, encouraging
- Communication Style: ${behavior.responseStyle === "conversational" ? "Warm and conversational" : behavior.responseStyle === "instructional" ? "Clear and step-by-step" : behavior.responseStyle === "celebratory" ? "Enthusiastic and congratulatory" : "Supportive and understanding"}

## Current State: ${stateConfig.displayName}
${stateConfig.description}

## Your Primary Goal
${behavior.primaryGoal}

## Suggested Conversation Starters
${behavior.suggestedPrompts.map(p => `- "${p}"`).join("\n")}
${businessContext}
${integrationContext}
${conversationContext}
${objections}

## Important Guidelines
1. ALWAYS use the update_collected_data tool when you learn new information about the business
2. NEVER make up information - ask if you need to know something
3. Be encouraging but not pushy - let the user set the pace
4. If the user seems frustrated or stuck, offer to connect them with human support
5. When providing code snippets, always explain where to put them
6. Celebrate progress and milestones along the way
7. Stay focused on ${stateConfig.displayName} but be flexible if the user needs something else

## Value Proposition (for reference)
- Zero cost to join - no setup fees, no monthly fees
- Earn 50% commission on every policy ($2.50+ per sale)
- Easy setup - 5-30 minutes depending on integration type
- We handle all customer support and claims
- Partners typically see $200-500+ per month

## Available Actions
You can use the following tools to help the user:
${behavior.allowedTools.map(t => `- ${t}`).join("\n")}

Remember: Your goal is to make this process so easy that any business owner can do it, regardless of technical skill level.`
}

// ================= Agent Types =================

export interface AgentResponse {
  message: string
  sessionId: string
  state: OnboardingState
  progress: number
  toolsUsed: string[]
  nextSuggestedActions?: string[]
  codeSnippet?: string
  error?: string
}

export interface AgentInput {
  message: string
  sessionId?: string
  partnerId?: string
  userId?: string
  visitorId?: string
  metadata?: Record<string, unknown>
}

// ================= Main Agent Class =================

export class OnboardingAgent {
  private sessionId: string | null = null
  private session: OnboardingSession | null = null

  /**
   * Process a user message and generate a response
   */
  async processMessage(input: AgentInput): Promise<AgentResponse> {
    const startTime = Date.now()

    try {
      // 1. Get or create session
      await this.loadOrCreateSession(input)

      if (!this.session || !this.sessionId) {
        throw new Error("Failed to create session")
      }

      // 2. Check for escalation triggers
      if (shouldEscalate(this.session.currentState as OnboardingState, input.message)) {
        return await this.handleEscalation(input.message)
      }

      // 3. Log user message
      await this.logMessage("user", input.message)

      // 4. Build conversation history
      const history = await this.getConversationHistory()

      // 5. Build system prompt based on current state
      const systemPrompt = buildSystemPrompt(
        this.session.currentState as OnboardingState,
        this.session.collectedData as OnboardingCollectedData || {},
        this.session.integrationData as IntegrationData || {},
        this.session.agentContext as AgentContext || {}
      )

      // 6. Get allowed tools for current state
      const allowedTools = this.getStateAllowedTools()

      // 7. Call OpenAI with function calling
      const response = await this.callOpenAI(systemPrompt, history, input.message, allowedTools)

      // 8. Process tool calls if any
      const toolsUsed: string[] = []
      let finalResponse = response.message

      if (response.toolCalls && response.toolCalls.length > 0) {
        const toolResults = await this.processToolCalls(response.toolCalls)
        toolsUsed.push(...toolResults.toolNames)

        // Get final response with tool results
        finalResponse = await this.getFinalResponse(systemPrompt, history, input.message, response, toolResults.results)
      }

      // 9. Log assistant message
      await this.logMessage("assistant", finalResponse)

      // 10. Update session metrics
      await this.updateSessionMetrics(startTime, toolsUsed.length)

      // 11. Check for state transition
      await this.checkAndTransitionState()

      // 12. Extract any code snippets from response
      const codeSnippet = this.extractCodeSnippet(finalResponse)

      // 13. Get next suggested actions
      const nextActions = this.getNextSuggestedActions()

      return {
        message: finalResponse,
        sessionId: this.sessionId,
        state: this.session.currentState as OnboardingState,
        progress: calculateProgress(
          this.session.currentState as OnboardingState,
          this.session.collectedData as OnboardingCollectedData || {},
          this.session.integrationData as IntegrationData || {}
        ),
        toolsUsed,
        nextSuggestedActions: nextActions,
        codeSnippet
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("[OnboardingAgent] Error:", message)

      return {
        message: "I apologize, but I encountered an error. Let me connect you with our support team at partners@dailyeventinsurance.com.",
        sessionId: this.sessionId || "unknown",
        state: (this.session?.currentState as OnboardingState) || "welcome",
        progress: 0,
        toolsUsed: [],
        error: message
      }
    }
  }

  /**
   * Load existing session or create new one
   */
  private async loadOrCreateSession(input: AgentInput): Promise<void> {
    if (input.sessionId && db) {
      // Try to load existing session
      const existing = await db
        .select()
        .from(onboardingSessions)
        .where(eq(onboardingSessions.id, input.sessionId))
        .limit(1)

      if (existing.length > 0) {
        this.session = existing[0]
        this.sessionId = existing[0].id
        return
      }
    }

    // Create new session
    if (db) {
      const [newSession] = await db
        .insert(onboardingSessions)
        .values({
          partnerId: input.partnerId,
          userId: input.userId,
          visitorId: input.visitorId,
          currentState: "welcome",
          collectedData: {},
          integrationData: {},
          agentContext: {}
        })
        .returning()

      this.session = newSession
      this.sessionId = newSession.id

      // Create initial tasks
      await this.createInitialTasks()
    } else {
      // Mock session for development
      this.sessionId = `mock_${Date.now()}`
      this.session = {
        id: this.sessionId,
        partnerId: input.partnerId || null,
        userId: input.userId || null,
        visitorId: input.visitorId || null,
        sessionToken: null,
        currentState: "welcome",
        currentSubState: null,
        progressPercent: 0,
        collectedData: {},
        integrationData: {},
        agentContext: {},
        isComplete: false,
        needsHumanReview: false,
        isBlocked: false,
        blockedReason: null,
        totalMessages: 0,
        totalToolCalls: 0,
        avgResponseTimeMs: null,
        lastInteractionAt: new Date(),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }

  /**
   * Create initial onboarding tasks
   */
  private async createInitialTasks(): Promise<void> {
    if (!db || !this.sessionId) return

    const tasks = [
      { key: "business_info", title: "Collect Business Information", category: "signup", order: 1 },
      { key: "create_account", title: "Create Partner Account", category: "signup", order: 2 },
      { key: "sign_agreement", title: "Sign Partnership Agreement", category: "documents", order: 3 },
      { key: "sign_w9", title: "Complete W9 Form", category: "documents", order: 4 },
      { key: "setup_payout", title: "Set Up Direct Deposit", category: "documents", order: 5 },
      { key: "choose_integration", title: "Choose Integration Method", category: "integration", order: 6 },
      { key: "setup_integration", title: "Set Up Integration", category: "integration", order: 7 },
      { key: "verify_integration", title: "Verify Integration Works", category: "integration", order: 8 },
      { key: "staff_training", title: "Review Staff Training", category: "training", order: 9 },
      { key: "go_live", title: "Go Live!", category: "completion", order: 10 }
    ]

    for (const task of tasks) {
      await db.insert(onboardingTasks).values({
        sessionId: this.sessionId,
        taskKey: task.key,
        taskTitle: task.title,
        category: task.category,
        sortOrder: task.order,
        status: "pending"
      })
    }
  }

  /**
   * Get conversation history for context
   */
  private async getConversationHistory(): Promise<Array<{ role: string; content: string }>> {
    if (!db || !this.sessionId) {
      return []
    }

    const messages = await db
      .select()
      .from(onboardingMessages)
      .where(eq(onboardingMessages.sessionId, this.sessionId))
      .orderBy(desc(onboardingMessages.createdAt))
      .limit(20) // Last 20 messages for context

    return messages.reverse().map(m => ({
      role: m.role,
      content: m.content
    }))
  }

  /**
   * Get tools allowed in current state
   */
  private getStateAllowedTools(): typeof onboardingAgentTools {
    if (!this.session) return onboardingAgentTools

    const state = this.session.currentState as OnboardingState
    const behavior = getAgentBehavior(state)
    const allowedToolNames = behavior.allowedTools

    // Always include data collection and state transition tools
    const alwaysAllowed = ["update_collected_data", "transition_state", "escalate_to_human"]

    return onboardingAgentTools.filter(tool => {
      const name = tool.function.name
      return allowedToolNames.includes(name) || alwaysAllowed.includes(name)
    })
  }

  /**
   * Call OpenAI with function calling
   */
  private async callOpenAI(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    userMessage: string,
    tools: typeof onboardingAgentTools
  ): Promise<{ message: string; toolCalls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] }> {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback response for development
      return {
        message: this.getFallbackResponse(userMessage)
      }
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: userMessage }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? "auto" : undefined,
      temperature: 0.7,
      max_tokens: 1000
    })

    const responseMessage = completion.choices[0].message

    return {
      message: responseMessage.content || "",
      toolCalls: responseMessage.tool_calls
    }
  }

  /**
   * Process tool calls from OpenAI response
   */
  private async processToolCalls(
    toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
  ): Promise<{ toolNames: string[]; results: Array<{ id: string; name: string; result: ToolResult }> }> {
    const toolNames: string[] = []
    const results: Array<{ id: string; name: string; result: ToolResult }> = []

    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") continue

      const name = toolCall.function.name
      const args = JSON.parse(toolCall.function.arguments)

      toolNames.push(name)

      // Log tool call
      await this.logToolCall(name, args)

      // Execute tool
      const result = await executeOnboardingTool(name, args, {
        sessionId: this.sessionId || undefined,
        partnerId: this.session?.partnerId || undefined,
        collectedData: this.session?.collectedData as OnboardingCollectedData,
        integrationData: this.session?.integrationData as IntegrationData
      })

      results.push({
        id: toolCall.id,
        name,
        result
      })

      // Update session data based on tool results
      await this.processToolResult(name, args, result)
    }

    return { toolNames, results }
  }

  /**
   * Get final response after tool execution
   */
  private async getFinalResponse(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    userMessage: string,
    initialResponse: { message: string; toolCalls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] },
    toolResults: Array<{ id: string; name: string; result: ToolResult }>
  ): Promise<string> {
    if (!process.env.OPENAI_API_KEY || !initialResponse.toolCalls) {
      return initialResponse.message || this.getFallbackResponse(userMessage)
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: initialResponse.message,
        tool_calls: initialResponse.toolCalls
      },
      ...toolResults.map(tr => ({
        role: "tool" as const,
        tool_call_id: tr.id,
        content: JSON.stringify(tr.result)
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0].message.content || this.getFallbackResponse(userMessage)
  }

  /**
   * Process tool result and update session
   */
  private async processToolResult(name: string, args: Record<string, unknown>, result: ToolResult): Promise<void> {
    if (!this.session || !result.success) return

    // Update collected data based on tool
    if (name === "update_collected_data" && args.data) {
      const currentData = this.session.collectedData as OnboardingCollectedData || {}
      this.session.collectedData = {
        ...currentData,
        ...(args.data as Partial<OnboardingCollectedData>)
      }
    }

    // Update integration data based on tool
    if (name === "generate_widget_code" && result.data) {
      const currentData = this.session.integrationData as IntegrationData || {}
      this.session.integrationData = {
        ...currentData,
        widgetCode: (result.data as { code?: string }).code,
        selectedMethod: "widget"
      }
    }

    if (name === "generate_qr_code" && result.data) {
      const currentData = this.session.integrationData as IntegrationData || {}
      this.session.integrationData = {
        ...currentData,
        qrCodeUrl: (result.data as { qrCodeUrl?: string }).qrCodeUrl,
        selectedMethod: "qr_code"
      }
    }

    if (name === "create_partner_account" && result.data) {
      const data = result.data as { partnerId?: string }
      if (data.partnerId) {
        this.session.partnerId = data.partnerId
      }
    }

    // Persist updates
    if (db && this.sessionId) {
      await db
        .update(onboardingSessions)
        .set({
          collectedData: this.session.collectedData,
          integrationData: this.session.integrationData,
          partnerId: this.session.partnerId,
          updatedAt: new Date()
        })
        .where(eq(onboardingSessions.id, this.sessionId))
    }
  }

  /**
   * Check if we should transition to a new state
   */
  private async checkAndTransitionState(): Promise<void> {
    if (!this.session) return

    const currentState = this.session.currentState as OnboardingState
    const collectedData = this.session.collectedData as OnboardingCollectedData || {}
    const integrationData = this.session.integrationData as IntegrationData || {}

    const nextState = getNextRecommendedState(currentState, collectedData, integrationData)

    if (nextState && canTransition(currentState, nextState)) {
      await this.transitionToState(nextState, "Requirements met for next step")
    }
  }

  /**
   * Transition to a new state
   */
  private async transitionToState(newState: OnboardingState, reason: string): Promise<void> {
    if (!this.session) return

    const oldState = this.session.currentState as OnboardingState
    this.session.currentState = newState

    // Calculate new progress
    const progress = calculateProgress(
      newState,
      this.session.collectedData as OnboardingCollectedData || {},
      this.session.integrationData as IntegrationData || {}
    )
    this.session.progressPercent = progress

    // Update completion status
    if (newState === "complete") {
      this.session.isComplete = true
      this.session.completedAt = new Date()
    }

    // Persist changes
    if (db && this.sessionId) {
      await db
        .update(onboardingSessions)
        .set({
          currentState: newState,
          progressPercent: progress,
          isComplete: this.session.isComplete,
          completedAt: this.session.completedAt,
          updatedAt: new Date()
        })
        .where(eq(onboardingSessions.id, this.sessionId))

      // Log the transition
      await db.insert(agentActionLogs).values({
        sessionId: this.sessionId,
        actionType: "state_transition",
        actionName: `${oldState} -> ${newState}`,
        inputData: { oldState, reason },
        outputData: { newState, progress },
        success: true
      })
    }
  }

  /**
   * Handle escalation to human
   */
  private async handleEscalation(message: string): Promise<AgentResponse> {
    if (this.session) {
      this.session.needsHumanReview = true

      if (db && this.sessionId) {
        await db
          .update(onboardingSessions)
          .set({
            needsHumanReview: true,
            updatedAt: new Date()
          })
          .where(eq(onboardingSessions.id, this.sessionId))
      }
    }

    return {
      message: "I understand you'd like to speak with someone from our team. I'm connecting you with a specialist who can help. They'll reach out within the hour. In the meantime, you can also email partners@dailyeventinsurance.com or call us at 1-800-XXX-XXXX.",
      sessionId: this.sessionId || "unknown",
      state: "human_handoff",
      progress: this.session?.progressPercent || 0,
      toolsUsed: ["escalate_to_human"]
    }
  }

  /**
   * Log a message to the database
   */
  private async logMessage(role: string, content: string): Promise<void> {
    if (!db || !this.sessionId) return

    await db.insert(onboardingMessages).values({
      sessionId: this.sessionId,
      role,
      content,
      stateAtMessage: this.session?.currentState || "unknown"
    })
  }

  /**
   * Log a tool call
   */
  private async logToolCall(name: string, args: Record<string, unknown>): Promise<void> {
    if (!db || !this.sessionId) return

    await db.insert(agentActionLogs).values({
      sessionId: this.sessionId,
      actionType: "tool_call",
      actionName: name,
      inputData: args,
      success: true // Will be updated if it fails
    })
  }

  /**
   * Update session metrics
   */
  private async updateSessionMetrics(startTime: number, toolCallCount: number): Promise<void> {
    if (!db || !this.sessionId || !this.session) return

    const responseTime = Date.now() - startTime
    const currentTotal = this.session.totalMessages || 0
    const currentAvg = this.session.avgResponseTimeMs || responseTime

    const newAvg = Math.round((currentAvg * currentTotal + responseTime) / (currentTotal + 1))

    await db
      .update(onboardingSessions)
      .set({
        totalMessages: currentTotal + 1,
        totalToolCalls: (this.session.totalToolCalls || 0) + toolCallCount,
        avgResponseTimeMs: newAvg,
        lastInteractionAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(onboardingSessions.id, this.sessionId))
  }

  /**
   * Extract code snippets from response
   */
  private extractCodeSnippet(response: string): string | undefined {
    const codeMatch = response.match(/```[\s\S]*?```/)
    return codeMatch ? codeMatch[0] : undefined
  }

  /**
   * Get next suggested actions based on state
   */
  private getNextSuggestedActions(): string[] {
    if (!this.session) return []

    const state = this.session.currentState as OnboardingState
    return ONBOARDING_STATES[state].agentBehavior.suggestedPrompts.slice(0, 3)
  }

  /**
   * Fallback response when OpenAI is unavailable
   */
  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hi there! I'm Sam, your onboarding specialist. I'm here to help you get set up with Daily Event Insurance. What's your business name?"
    }

    if (lowerMessage.includes("gym") || lowerMessage.includes("fitness") || lowerMessage.includes("climbing")) {
      return "Great! We work with many fitness facilities like yours. Our partners typically earn $200-500+ per month by offering day insurance to their members. Would you like me to calculate your potential earnings?"
    }

    if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
      return "It's simple! You offer $5 day insurance to your customers, and you earn 50% commission on every sale. There are no costs to you - we handle all the admin and claims. Would you like to get started?"
    }

    return "Thanks for that information! I'm gathering what I need to get you set up. Could you tell me a bit more about your business?"
  }
}

// ================= Factory Function =================

/**
 * Create a new onboarding agent instance
 */
export function createOnboardingAgent(): OnboardingAgent {
  return new OnboardingAgent()
}

/**
 * Process a message with the onboarding agent
 */
export async function processOnboardingMessage(input: AgentInput): Promise<AgentResponse> {
  const agent = createOnboardingAgent()
  return agent.processMessage(input)
}
