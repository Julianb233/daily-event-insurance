import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import type {
  SupportConversation,
  SupportMessage,
  ChatMessagePayload,
  ConversationTopic,
  TechStack,
  IntegrationContext,
  ConnectionStatus,
  TypingIndicator,
  ReadReceipt,
  FileAttachment,
  MessageStatus,
} from "./types"

const CHANNEL_PREFIX = "support_chat"
const PRESENCE_PREFIX = "presence"
const RECONNECT_DELAY_MS = 1000
const MAX_RECONNECT_ATTEMPTS = 5
const TYPING_TIMEOUT_MS = 3000

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
  assigned_admin_id?: string | null
  assigned_admin_name?: string | null
  is_admin_takeover?: boolean | null
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
  attachments?: string | null
  status?: string | null
  delivered_at?: string | null
  read_at?: string | null
  created_at: string
}

type MessageCallback = (message: SupportMessage) => void
type StatusCallback = (status: string) => void
type ConnectionCallback = (status: ConnectionStatus) => void
type TypingCallback = (indicator: TypingIndicator) => void
type ReadReceiptCallback = (receipt: ReadReceipt) => void

export class RealtimeChatService {
  private supabase: SupabaseClient
  private channel: RealtimeChannel | null = null
  private presenceChannel: RealtimeChannel | null = null
  private conversationId: string | null = null
  private userId: string | null = null
  private userName: string | null = null
  private userRole: "user" | "admin" = "user"

  // Callbacks
  private onMessageCallback: MessageCallback | null = null
  private onStatusCallback: StatusCallback | null = null
  private onConnectionCallback: ConnectionCallback | null = null
  private onTypingCallback: TypingCallback | null = null
  private onReadReceiptCallback: ReadReceiptCallback | null = null

  // Connection state
  private connectionStatus: ConnectionStatus = "disconnected"
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isDestroyed = false

  // Typing state
  private typingTimer: ReturnType<typeof setTimeout> | null = null
  private isCurrentlyTyping = false

  constructor() {
    this.supabase = getSupabaseClient()
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus
  }

  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status
    this.onConnectionCallback?.(status)
    console.log(`[RealtimeChat] Connection status: ${status}`)
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
    this.userId = options.sessionId
    this.userName = options.partnerName || null

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
    callbacks: {
      onMessage?: MessageCallback
      onStatus?: StatusCallback
      onConnection?: ConnectionCallback
      onTyping?: TypingCallback
      onReadReceipt?: ReadReceiptCallback
    }
  ): void {
    this.conversationId = conversationId
    this.onMessageCallback = callbacks.onMessage || null
    this.onStatusCallback = callbacks.onStatus || null
    this.onConnectionCallback = callbacks.onConnection || null
    this.onTypingCallback = callbacks.onTyping || null
    this.onReadReceiptCallback = callbacks.onReadReceipt || null

    this.connect()
  }

  private connect(): void {
    if (this.isDestroyed || !this.conversationId) return

    this.setConnectionStatus("connecting")

    // Main channel for database changes
    this.channel = this.supabase
      .channel(`${CHANNEL_PREFIX}:${this.conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${this.conversationId}`,
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
          table: "support_messages",
          filter: `conversation_id=eq.${this.conversationId}`,
        },
        (payload) => {
          if (this.onMessageCallback && payload.new) {
            const row = payload.new as DbSupportMessage
            // Handle read receipt updates
            if (row.read_at && this.onReadReceiptCallback) {
              this.onReadReceiptCallback({
                messageId: row.id,
                conversationId: row.conversation_id,
                userId: this.userId || "",
                readAt: new Date(row.read_at),
              })
            }
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
          filter: `id=eq.${this.conversationId}`,
        },
        (payload) => {
          if (this.onStatusCallback && payload.new) {
            const row = payload.new as { status: string }
            this.onStatusCallback(row.status)
          }
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (this.onTypingCallback && payload.payload) {
          const typingData = payload.payload as {
            userId: string
            userName?: string
            role: string
            isTyping: boolean
          }
          // Don't show our own typing indicator
          if (typingData.userId !== this.userId) {
            this.onTypingCallback({
              conversationId: this.conversationId!,
              userId: typingData.userId,
              userName: typingData.userName,
              role: typingData.role as TypingIndicator["role"],
              isTyping: typingData.isTyping,
              timestamp: new Date(),
            })
          }
        }
      })
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          this.setConnectionStatus("connected")
          this.reconnectAttempts = 0
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(`[RealtimeChat] Channel error:`, err)
          this.handleDisconnect()
        } else if (status === "CLOSED") {
          this.handleDisconnect()
        }
      })

    // Presence channel for online status
    this.setupPresenceChannel()
  }

  private setupPresenceChannel(): void {
    if (!this.conversationId) return

    this.presenceChannel = this.supabase
      .channel(`${PRESENCE_PREFIX}:${this.conversationId}`)
      .on("presence", { event: "sync" }, () => {
        const state = this.presenceChannel?.presenceState() || {}
        console.log("[RealtimeChat] Presence sync:", state)
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("[RealtimeChat] User joined:", key, newPresences)
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("[RealtimeChat] User left:", key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && this.userId) {
          await this.presenceChannel?.track({
            id: this.userId,
            name: this.userName,
            role: this.userRole,
            online_at: new Date().toISOString(),
          })
        }
      })
  }

  private handleDisconnect(): void {
    if (this.isDestroyed) return

    this.setConnectionStatus("disconnected")
    this.scheduleReconnect()
  }

  private scheduleReconnect(): void {
    if (this.isDestroyed || this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        this.setConnectionStatus("error")
        console.error("[RealtimeChat] Max reconnection attempts reached")
      }
      return
    }

    this.setConnectionStatus("reconnecting")
    this.reconnectAttempts++

    const delay = RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1)
    console.log(`[RealtimeChat] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.cleanup()
      this.connect()
    }, delay)
  }

  private cleanup(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
    if (this.presenceChannel) {
      this.supabase.removeChannel(this.presenceChannel)
      this.presenceChannel = null
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
      this.typingTimer = null
    }
  }

  unsubscribe(): void {
    this.isDestroyed = true
    this.cleanup()
    this.onMessageCallback = null
    this.onStatusCallback = null
    this.onConnectionCallback = null
    this.onTypingCallback = null
    this.onReadReceiptCallback = null
    this.setConnectionStatus("disconnected")
  }

  // Typing indicators
  async sendTypingIndicator(isTyping: boolean): Promise<void> {
    if (!this.channel || !this.conversationId) return

    // Debounce typing indicator
    if (isTyping && this.isCurrentlyTyping) return

    this.isCurrentlyTyping = isTyping

    await this.channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId: this.userId,
        userName: this.userName,
        role: this.userRole,
        isTyping,
      },
    })

    // Auto-stop typing after timeout
    if (isTyping) {
      if (this.typingTimer) clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.sendTypingIndicator(false)
      }, TYPING_TIMEOUT_MS)
    }
  }

  // Read receipts
  async markMessageAsRead(messageId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)
      .is("read_at", null)

    if (error) {
      console.error("[RealtimeChat] Failed to mark message as read:", error)
      return false
    }

    return true
  }

  async markAllMessagesAsRead(conversationId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .is("read_at", null)
      .neq("role", this.userRole === "admin" ? "admin" : "user")

    if (error) {
      console.error("[RealtimeChat] Failed to mark all messages as read:", error)
      return false
    }

    return true
  }

  async sendMessage(payload: ChatMessagePayload): Promise<SupportMessage | null> {
    // Stop typing indicator when sending
    this.sendTypingIndicator(false)

    const { data, error } = await this.supabase
      .from("support_messages")
      .insert({
        conversation_id: payload.conversationId,
        role: payload.role,
        content: payload.content,
        content_type: payload.contentType || "text",
        code_snippet: payload.codeSnippet || null,
        code_language: payload.codeLanguage || null,
        attachments: payload.attachments ? JSON.stringify(payload.attachments) : null,
        status: "sent",
      })
      .select()
      .single()

    if (error) {
      console.error("[RealtimeChat] Failed to send message:", error)
      return null
    }

    // Update the message status to delivered
    await this.updateMessageStatus(data.id, "delivered")

    return this.mapMessage(data as DbSupportMessage)
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<boolean> {
    const updates: Record<string, string | null> = { status }
    if (status === "delivered") {
      updates.delivered_at = new Date().toISOString()
    } else if (status === "read") {
      updates.read_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from("support_messages")
      .update(updates)
      .eq("id", messageId)

    if (error) {
      console.error("[RealtimeChat] Failed to update message status:", error)
      return false
    }

    return true
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

  async assignAdmin(
    conversationId: string,
    adminId: string,
    adminName: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_conversations")
      .update({
        assigned_admin_id: adminId,
        assigned_admin_name: adminName,
        is_admin_takeover: true,
      })
      .eq("id", conversationId)

    if (error) {
      console.error("[RealtimeChat] Failed to assign admin:", error)
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

  // Admin methods
  async getAllActiveConversations(): Promise<SupportConversation[]> {
    const { data, error } = await this.supabase
      .from("support_conversations")
      .select("*")
      .in("status", ["active", "escalated"])
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[RealtimeChat] Failed to get active conversations:", error)
      return []
    }

    return (data as DbSupportConversation[]).map((row) => this.mapConversation(row))
  }

  setUserContext(userId: string, userName?: string, role: "user" | "admin" = "user"): void {
    this.userId = userId
    this.userName = userName || null
    this.userRole = role
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
      assignedAdminId: data.assigned_admin_id || undefined,
      assignedAdminName: data.assigned_admin_name || undefined,
      isAdminTakeover: data.is_admin_takeover || undefined,
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
      attachments: data.attachments ? JSON.parse(data.attachments) : undefined,
      status: (data.status || "sent") as SupportMessage["status"],
      deliveredAt: data.delivered_at ? new Date(data.delivered_at) : undefined,
      readAt: data.read_at ? new Date(data.read_at) : undefined,
      createdAt: new Date(data.created_at),
    }
  }
}

export function createChatService(): RealtimeChatService {
  return new RealtimeChatService()
}
