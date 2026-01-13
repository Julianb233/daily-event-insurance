import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import type {
  SupportConversation,
  SupportMessage,
  ChatMessagePayload,
  ConversationTopic,
  TechStack,
  IntegrationContext,
} from "./types"

const CHANNEL_PREFIX = "support_chat"

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials not configured")
  }
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

interface DbSupportConversation {
  id: string
  partner_id?: string | null
  partner_email?: string | null
  partner_name?: string | null
  session_id: string
  page_url?: string | null
  onboarding_step?: number | null
  topic?: string | null
  tech_stack?: string | null
  integration_context?: string | null
  status: string
  priority: string
  escalated_at?: string | null
  escalated_to?: string | null
  escalation_reason?: string | null
  resolution?: string | null
  resolved_at?: string | null
  helpful_rating?: number | null
  feedback?: string | null
  created_at: string
  updated_at: string
}

interface DbSupportMessage {
  id: string
  conversation_id: string
  role: string
  content: string
  content_type?: string | null
  code_snippet?: string | null
  code_language?: string | null
  tools_used?: string | null
  created_at: string
}

export class RealtimeChatService {
  private supabase: SupabaseClient
  private channel: RealtimeChannel | null = null
  private conversationId: string | null = null
  private onMessageCallback: ((message: SupportMessage) => void) | null = null
  private onStatusCallback: ((status: string) => void) | null = null

  constructor() {
    this.supabase = getSupabaseClient()
  }

  async startConversation(options: {
    sessionId: string
    partnerId?: string
    partnerEmail?: string
    partnerName?: string
    pageUrl?: string
    onboardingStep?: number
    topic?: ConversationTopic
    techStack?: TechStack
  }): Promise<SupportConversation | null> {
    const { data, error } = await this.supabase
      .from("support_conversations")
      .insert({
        session_id: options.sessionId,
        partner_id: options.partnerId || null,
        partner_email: options.partnerEmail || null,
        partner_name: options.partnerName || null,
        page_url: options.pageUrl || null,
        onboarding_step: options.onboardingStep || null,
        topic: options.topic || null,
        tech_stack: options.techStack ? JSON.stringify(options.techStack) : null,
        status: "active",
        priority: "normal",
      })
      .select()
      .single()

    if (error) {
      console.error("[RealtimeChat] Failed to create conversation:", error)
      return null
    }

    this.conversationId = (data as DbSupportConversation).id
    return this.mapConversation(data as DbSupportConversation)
  }

  async resumeConversation(conversationId: string): Promise<SupportConversation | null> {
    const { data, error } = await this.supabase
      .from("support_conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (error) {
      console.error("[RealtimeChat] Failed to resume conversation:", error)
      return null
    }

    this.conversationId = (data as DbSupportConversation).id
    return this.mapConversation(data as DbSupportConversation)
  }

  async getConversationMessages(conversationId: string): Promise<SupportMessage[]> {
    const { data, error } = await this.supabase
      .from("support_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[RealtimeChat] Failed to get messages:", error)
      return []
    }

    return (data as DbSupportMessage[]).map((row) => this.mapMessage(row))
  }

  subscribeToMessages(
    conversationId: string,
    onMessage: (message: SupportMessage) => void,
    onStatus?: (status: string) => void
  ): void {
    this.conversationId = conversationId
    this.onMessageCallback = onMessage
    this.onStatusCallback = onStatus || null

    this.channel = this.supabase
      .channel(`${CHANNEL_PREFIX}:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (this.onMessageCallback && payload.new) {
            const row = payload.new as DbSupportMessage
            this.onMessageCallback(this.mapMessage(row))
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          if (this.onStatusCallback && payload.new) {
            const row = payload.new as { status: string }
            this.onStatusCallback(row.status)
          }
        }
      )
      .subscribe((status) => {
        console.log(`[RealtimeChat] Channel status: ${status}`)
      })
  }

  unsubscribe(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
    this.onMessageCallback = null
    this.onStatusCallback = null
  }

  async sendMessage(payload: ChatMessagePayload): Promise<SupportMessage | null> {
    const { data, error } = await this.supabase
      .from("support_messages")
      .insert({
        conversation_id: payload.conversationId,
        role: payload.role,
        content: payload.content,
        content_type: payload.contentType || "text",
        code_snippet: payload.codeSnippet || null,
        code_language: payload.codeLanguage || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[RealtimeChat] Failed to send message:", error)
      return null
    }

    return this.mapMessage(data as DbSupportMessage)
  }

  async updateConversationContext(
    conversationId: string,
    updates: {
      topic?: ConversationTopic
      techStack?: TechStack
      integrationContext?: IntegrationContext
      priority?: string
    }
  ): Promise<boolean> {
    const updateData: Record<string, string | null> = {}

    if (updates.topic) updateData.topic = updates.topic
    if (updates.techStack) updateData.tech_stack = JSON.stringify(updates.techStack)
    if (updates.integrationContext) updateData.integration_context = JSON.stringify(updates.integrationContext)
    if (updates.priority) updateData.priority = updates.priority

    const { error } = await this.supabase
      .from("support_conversations")
      .update(updateData)
      .eq("id", conversationId)

    if (error) {
      console.error("[RealtimeChat] Failed to update conversation:", error)
      return false
    }

    return true
  }

  async resolveConversation(
    conversationId: string,
    resolution: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_conversations")
      .update({
        status: "resolved",
        resolution,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", conversationId)

    if (error) {
      console.error("[RealtimeChat] Failed to resolve conversation:", error)
      return false
    }

    return true
  }

  async escalateConversation(
    conversationId: string,
    reason: string,
    escalateTo?: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_conversations")
      .update({
        status: "escalated",
        escalation_reason: reason,
        escalated_to: escalateTo || null,
        escalated_at: new Date().toISOString(),
        priority: "high",
      })
      .eq("id", conversationId)

    if (error) {
      console.error("[RealtimeChat] Failed to escalate conversation:", error)
      return false
    }

    return true
  }

  async rateConversation(
    conversationId: string,
    rating: number,
    feedback?: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_conversations")
      .update({
        helpful_rating: rating,
        feedback: feedback || null,
      })
      .eq("id", conversationId)

    if (error) {
      console.error("[RealtimeChat] Failed to rate conversation:", error)
      return false
    }

    return true
  }

  private mapConversation(data: DbSupportConversation): SupportConversation {
    return {
      id: data.id,
      partnerId: data.partner_id || undefined,
      partnerEmail: data.partner_email || undefined,
      partnerName: data.partner_name || undefined,
      sessionId: data.session_id,
      pageUrl: data.page_url || undefined,
      onboardingStep: data.onboarding_step || undefined,
      topic: data.topic as SupportConversation["topic"],
      techStack: data.tech_stack ? JSON.parse(data.tech_stack) : undefined,
      integrationContext: data.integration_context ? JSON.parse(data.integration_context) : undefined,
      status: data.status as SupportConversation["status"],
      priority: data.priority as SupportConversation["priority"],
      escalatedAt: data.escalated_at ? new Date(data.escalated_at) : undefined,
      escalatedTo: data.escalated_to || undefined,
      escalationReason: data.escalation_reason || undefined,
      resolution: data.resolution || undefined,
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
      helpfulRating: data.helpful_rating || undefined,
      feedback: data.feedback || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  private mapMessage(data: DbSupportMessage): SupportMessage {
    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role as SupportMessage["role"],
      content: data.content,
      contentType: (data.content_type || "text") as SupportMessage["contentType"],
      codeSnippet: data.code_snippet || undefined,
      codeLanguage: data.code_language || undefined,
      toolsUsed: data.tools_used ? JSON.parse(data.tools_used) : undefined,
      createdAt: new Date(data.created_at),
    }
  }
}

export function createChatService(): RealtimeChatService {
  return new RealtimeChatService()
}
