// Type definitions for the Partner Integration Support Agent

export type ConversationTopic = 
  | "onboarding"
  | "widget_install"
  | "api_integration"
  | "pos_setup"
  | "troubleshooting"

export type ConversationStatus = "active" | "resolved" | "escalated" | "abandoned"
export type ConversationPriority = "low" | "normal" | "high" | "urgent"
export type MessageRole = "user" | "assistant" | "system"
export type MessageContentType = "text" | "code" | "error" | "action"

export interface TechStack {
  framework?: "react" | "vue" | "angular" | "vanilla" | "nextjs" | "nuxt"
  language?: "javascript" | "typescript" | "python" | "php"
  pos?: "mindbody" | "pike13" | "clubready" | "mariana_tek" | "square"
  cms?: "wordpress" | "shopify" | "squarespace" | "custom"
}

export interface IntegrationContext {
  widgetInstalled?: boolean
  apiKeyGenerated?: boolean
  webhookConfigured?: boolean
  posConnected?: boolean
  lastError?: string
  currentStep?: string
}

export interface SupportConversation {
  id: string
  partnerId?: string
  partnerEmail?: string
  partnerName?: string
  sessionId: string
  pageUrl?: string
  onboardingStep?: number
  topic?: ConversationTopic
  techStack?: TechStack
  integrationContext?: IntegrationContext
  status: ConversationStatus
  priority: ConversationPriority
  escalatedAt?: Date
  escalatedTo?: string
  escalationReason?: string
  resolution?: string
  resolvedAt?: Date
  helpfulRating?: number
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

export interface SupportMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  contentType: MessageContentType
  codeSnippet?: string
  codeLanguage?: string
  toolsUsed?: string[]
  createdAt: Date
}

export interface ChatMessagePayload {
  conversationId: string
  role: MessageRole
  content: string
  contentType?: MessageContentType
  codeSnippet?: string
  codeLanguage?: string
}

export interface RealtimeMessageEvent {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  schema: string
  record: SupportMessage
  old_record?: SupportMessage
}

export interface RealtimeConversationEvent {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  schema: string
  record: SupportConversation
  old_record?: SupportConversation
}
