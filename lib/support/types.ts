// Type definitions for the Partner Integration Support Agent

export type ConversationTopic =
  | "onboarding"
  | "widget_install"
  | "api_integration"
  | "pos_setup"
  | "troubleshooting"

export type ConversationStatus = "active" | "resolved" | "escalated" | "abandoned"
export type ConversationPriority = "low" | "normal" | "high" | "urgent"
export type MessageRole = "user" | "assistant" | "system" | "admin"
export type MessageContentType = "text" | "code" | "error" | "action" | "image" | "file"
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed"
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting" | "error"

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

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnailUrl?: string
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  userName?: string
  role: MessageRole
  isTyping: boolean
  timestamp: Date
}

export interface ReadReceipt {
  messageId: string
  conversationId: string
  userId: string
  readAt: Date
}

export interface QuickReply {
  id: string
  label: string
  message: string
  category?: string
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
  assignedAdminId?: string
  assignedAdminName?: string
  isAdminTakeover?: boolean
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
  attachments?: FileAttachment[]
  status?: MessageStatus
  deliveredAt?: Date
  readAt?: Date
  createdAt: Date
}

export interface ChatMessagePayload {
  conversationId: string
  role: MessageRole
  content: string
  contentType?: MessageContentType
  codeSnippet?: string
  codeLanguage?: string
  attachments?: FileAttachment[]
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

export interface RealtimeTypingEvent {
  conversationId: string
  userId: string
  userName?: string
  role: MessageRole
  isTyping: boolean
}

export interface AdminConversationView extends SupportConversation {
  messages: SupportMessage[]
  messageCount: number
  lastMessageAt?: Date
  unreadCount?: number
  isOnline?: boolean
  lastSeenAt?: Date
}

export interface CannedResponse {
  id: string
  title: string
  content: string
  codeSnippet?: string
  codeLanguage?: string
  category: string
  tags: string[]
  useCount: number
}

export interface CustomerContext {
  partnerId?: string
  partnerName?: string
  partnerEmail?: string
  onboardingStep?: number
  integrationStatus?: string
  techStack?: TechStack
  recentIssues?: string[]
  accountAge?: number
  totalConversations?: number
}

// Proactive Chat Types
export type ProactiveTriggerType =
  | "idle"
  | "error"
  | "exit_intent"
  | "page_change"
  | "form_error"
  | "scroll_depth"

export interface ProactiveTrigger {
  type: ProactiveTriggerType
  message: string
  suggestedActions?: string[]
  priority: "low" | "medium" | "high"
  timestamp: number
}

export interface PageContext {
  greeting: string
  helpPrompts: string[]
  idleMessage: string
  exitMessage: string
}

export interface FormErrorContext {
  formId?: string
  fieldName?: string
  errorMessage: string
  formData?: Record<string, unknown>
}

// Screen Capture Types
export type AnnotationTool = "pointer" | "highlight" | "arrow" | "rectangle" | "circle" | "text"

export interface AnnotationData {
  id: string
  type: AnnotationTool
  points: { x: number; y: number }[]
  color: string
  strokeWidth: number
  text?: string
}

export interface ScreenCaptureResult {
  id: string
  dataUrl: string
  blob: Blob
  width: number
  height: number
  timestamp: number
  annotations?: AnnotationData[]
}

// File Upload Types
export type FileUploadStatus = "pending" | "uploading" | "uploaded" | "error"

export interface ChatFileAttachment {
  id: string
  file: File
  preview?: string
  status: FileUploadStatus
  progress: number
  url?: string
  error?: string
}

// Knowledge Base Types
export type ArticleCategory =
  | "getting-started"
  | "widget-integration"
  | "api-reference"
  | "pos-integration"
  | "troubleshooting"
  | "billing"
  | "account"
  | "policies"

export type ArticleDifficulty = "beginner" | "intermediate" | "advanced"

export interface KnowledgeArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: ArticleCategory
  tags: string[]
  relatedTopics: string[]
  difficulty: ArticleDifficulty
  estimatedReadTime: number
  lastUpdated: Date
  helpfulCount: number
  viewCount: number
}

export interface ArticleSearchResult {
  article: KnowledgeArticle
  relevanceScore: number
  matchedTerms: string[]
  snippet: string
}

export interface ArticleSuggestion {
  article: KnowledgeArticle
  reason: string
  confidence: number
}

// Enhanced Chat Widget State
export interface ChatWidgetState {
  isOpen: boolean
  isMinimized: boolean
  showKnowledgeBase: boolean
  showFileUpload: boolean
  hasUnreadMessages: boolean
  unreadCount: number
  proactiveTrigger: ProactiveTrigger | null
  attachments: ChatFileAttachment[]
  screenCapture: ScreenCaptureResult | null
}
