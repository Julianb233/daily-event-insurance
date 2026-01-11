/**
 * Onboarding & Integration Agent Schema
 *
 * Database schema extensions for the intelligent onboarding agent
 * that guides businesses through signup and integration.
 */

import { pgTable, uuid, text, boolean, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core"
import { users, partners } from "@/lib/db/schema"

// ================= Onboarding Agent Tables =================

/**
 * Onboarding sessions - tracks each business's journey through the onboarding process
 */
export const onboardingSessions = pgTable("onboarding_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Link to partner (may be null for leads/prospects)
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }),

  // Link to user if they've created an account
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

  // Anonymous tracking for pre-signup
  visitorId: text("visitor_id"),

  // Session identification
  sessionToken: text("session_token").unique(),

  // Current state in the onboarding state machine
  currentState: text("current_state").notNull().default("welcome"),

  // Sub-state for complex states (e.g., integration_setup -> platform_selection)
  currentSubState: text("current_sub_state"),

  // Overall progress percentage (0-100)
  progressPercent: integer("progress_percent").default(0),

  // Collected data throughout the onboarding process
  collectedData: jsonb("collected_data").$type<OnboardingCollectedData>().default({}),

  // Integration-specific data
  integrationData: jsonb("integration_data").$type<IntegrationData>().default({}),

  // Agent context (for AI continuity)
  agentContext: jsonb("agent_context").$type<AgentContext>().default({}),

  // Flags
  isComplete: boolean("is_complete").default(false),
  needsHumanReview: boolean("needs_human_review").default(false),
  isBlocked: boolean("is_blocked").default(false),
  blockedReason: text("blocked_reason"),

  // Engagement metrics
  totalMessages: integer("total_messages").default(0),
  totalToolCalls: integer("total_tool_calls").default(0),
  avgResponseTimeMs: integer("avg_response_time_ms"),

  // Timestamps
  lastInteractionAt: timestamp("last_interaction_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_onboarding_sessions_partner_id").on(table.partnerId),
  userIdIdx: index("idx_onboarding_sessions_user_id").on(table.userId),
  visitorIdIdx: index("idx_onboarding_sessions_visitor_id").on(table.visitorId),
  currentStateIdx: index("idx_onboarding_sessions_current_state").on(table.currentState),
  isCompleteIdx: index("idx_onboarding_sessions_is_complete").on(table.isComplete),
  createdAtIdx: index("idx_onboarding_sessions_created_at").on(table.createdAt),
}))

/**
 * Onboarding messages - conversation history with the agent
 */
export const onboardingMessages = pgTable("onboarding_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => onboardingSessions.id, { onDelete: "cascade" }).notNull(),

  // Message content
  role: text("role").notNull(), // user, assistant, system, tool
  content: text("content").notNull(),

  // Tool-related fields (for function calling)
  toolName: text("tool_name"),
  toolArgs: jsonb("tool_args"),
  toolResult: jsonb("tool_result"),

  // State at time of message
  stateAtMessage: text("state_at_message"),

  // Metadata
  metadata: jsonb("metadata").$type<MessageMetadata>(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("idx_onboarding_messages_session_id").on(table.sessionId),
  roleIdx: index("idx_onboarding_messages_role").on(table.role),
  createdAtIdx: index("idx_onboarding_messages_created_at").on(table.createdAt),
}))

/**
 * Onboarding tasks - checklist items the agent guides the user through
 */
export const onboardingTasks = pgTable("onboarding_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => onboardingSessions.id, { onDelete: "cascade" }).notNull(),

  // Task identification
  taskKey: text("task_key").notNull(), // e.g., "business_info", "documents", "integration"
  taskTitle: text("task_title").notNull(),
  taskDescription: text("task_description"),

  // Task category
  category: text("category").notNull(), // signup, documents, integration, training, go_live

  // Order within category
  sortOrder: integer("sort_order").default(0),

  // Status
  status: text("status").default("pending").notNull(), // pending, in_progress, completed, skipped, blocked

  // Completion tracking
  completedAt: timestamp("completed_at"),
  completedBy: text("completed_by"), // "user" | "agent" | "system"

  // Verification
  requiresVerification: boolean("requires_verification").default(false),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: uuid("verified_by").references(() => users.id),

  // Task-specific data
  taskData: jsonb("task_data"),

  // Error tracking
  lastError: text("last_error"),
  retryCount: integer("retry_count").default(0),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("idx_onboarding_tasks_session_id").on(table.sessionId),
  taskKeyIdx: index("idx_onboarding_tasks_task_key").on(table.taskKey),
  categoryIdx: index("idx_onboarding_tasks_category").on(table.category),
  statusIdx: index("idx_onboarding_tasks_status").on(table.status),
}))

/**
 * Integration verifications - tracks verified integrations
 */
export const integrationVerifications = pgTable("integration_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => onboardingSessions.id, { onDelete: "cascade" }).notNull(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }),

  // Integration identification
  integrationType: text("integration_type").notNull(), // widget, qr_code, api, webhook, pos, ecommerce
  platformSlug: text("platform_slug"), // mindbody, shopify, etc.

  // Verification status
  status: text("status").default("pending").notNull(), // pending, testing, verified, failed

  // Verification details
  verificationMethod: text("verification_method"), // auto_test, manual_confirm, webhook_received
  testUrl: text("test_url"),
  testResult: jsonb("test_result"),

  // Configuration
  configData: jsonb("config_data"), // Platform-specific config
  credentials: jsonb("credentials"), // Encrypted credentials/API keys

  // Verification timestamps
  lastTestAt: timestamp("last_test_at"),
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at"), // For credential expiry

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("idx_integration_verifications_session_id").on(table.sessionId),
  partnerIdIdx: index("idx_integration_verifications_partner_id").on(table.partnerId),
  integrationTypeIdx: index("idx_integration_verifications_type").on(table.integrationType),
  statusIdx: index("idx_integration_verifications_status").on(table.status),
}))

/**
 * Agent action logs - audit trail of all agent actions
 */
export const agentActionLogs = pgTable("agent_action_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => onboardingSessions.id, { onDelete: "cascade" }).notNull(),

  // Action details
  actionType: text("action_type").notNull(), // state_transition, tool_call, data_collection, document_generation, etc.
  actionName: text("action_name").notNull(),

  // Action data
  inputData: jsonb("input_data"),
  outputData: jsonb("output_data"),

  // Result
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),

  // Performance
  durationMs: integer("duration_ms"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("idx_agent_action_logs_session_id").on(table.sessionId),
  actionTypeIdx: index("idx_agent_action_logs_action_type").on(table.actionType),
  successIdx: index("idx_agent_action_logs_success").on(table.success),
  createdAtIdx: index("idx_agent_action_logs_created_at").on(table.createdAt),
}))

// ================= Type Definitions =================

/**
 * Data collected during onboarding
 */
export interface OnboardingCollectedData {
  // Business information
  businessName?: string
  businessType?: string
  businessAddress?: string
  websiteUrl?: string

  // Contact information
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  contactRole?: string

  // Business metrics
  estimatedMonthlyParticipants?: number
  estimatedAnnualRevenue?: number
  currentInsuranceProvider?: string

  // Location information
  locations?: Array<{
    name: string
    address: string
    city: string
    state: string
    zipCode: string
  }>

  // Preferences
  preferredIntegrationType?: "widget" | "qr_code" | "api" | "pos" | "ecommerce"
  preferredPayoutMethod?: "ach" | "check" | "paypal"

  // Additional context
  howDidYouHear?: string
  specificNeeds?: string[]
  competitorProducts?: string[]
}

/**
 * Integration-specific data
 */
export interface IntegrationData {
  // Selected integration method
  selectedMethod?: "widget" | "qr_code" | "api" | "webhook" | "pos" | "ecommerce"

  // Platform information
  platform?: {
    slug: string
    name: string
    category: string
  }

  // Generated assets
  widgetCode?: string
  qrCodeUrl?: string
  apiKey?: string
  webhookUrl?: string
  webhookSecret?: string

  // Platform-specific config
  platformConfig?: Record<string, unknown>

  // Verification status
  isVerified?: boolean
  verificationDetails?: {
    method: string
    timestamp: string
    result: unknown
  }
}

/**
 * Agent context for AI continuity
 */
export interface AgentContext {
  // Conversation summary
  conversationSummary?: string

  // Key topics discussed
  topicsDiscussed?: string[]

  // User preferences/style
  communicationStyle?: "technical" | "simple" | "mixed"
  responseLength?: "brief" | "detailed" | "balanced"

  // Pain points identified
  painPoints?: string[]

  // Objections raised
  objections?: Array<{
    objection: string
    addressed: boolean
    response?: string
  }>

  // Next recommended actions
  nextActions?: string[]

  // Sentiment tracking
  overallSentiment?: "positive" | "neutral" | "frustrated" | "confused"
  sentimentHistory?: Array<{
    timestamp: string
    sentiment: string
    reason?: string
  }>
}

/**
 * Message metadata
 */
export interface MessageMetadata {
  // Message source
  source?: "chat" | "voice" | "email" | "api"

  // Processing info
  processingTimeMs?: number
  modelUsed?: string
  tokensUsed?: number

  // Content flags
  containsCode?: boolean
  containsLink?: boolean
  containsAction?: boolean

  // Attachments
  attachments?: Array<{
    type: string
    url: string
    name: string
  }>

  // Voice-specific
  voiceTranscription?: {
    confidence: number
    duration: number
  }
}

// ================= State Machine Types =================

/**
 * Onboarding states in the state machine
 */
export type OnboardingState =
  | "welcome"
  | "business_discovery"
  | "business_info_collection"
  | "account_creation"
  | "document_signing"
  | "integration_selection"
  | "integration_setup"
  | "integration_verification"
  | "training_materials"
  | "go_live_checklist"
  | "complete"
  | "blocked"
  | "human_handoff"

/**
 * Sub-states for complex states
 */
export type IntegrationSubState =
  | "platform_selection"
  | "code_generation"
  | "installation_guidance"
  | "testing"
  | "verification"

export type DocumentSubState =
  | "agreement_review"
  | "agreement_signing"
  | "w9_collection"
  | "direct_deposit_setup"

/**
 * State transition event
 */
export interface StateTransition {
  fromState: OnboardingState
  toState: OnboardingState
  event: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// ================= Type Exports =================

export type OnboardingSession = typeof onboardingSessions.$inferSelect
export type NewOnboardingSession = typeof onboardingSessions.$inferInsert
export type OnboardingMessage = typeof onboardingMessages.$inferSelect
export type NewOnboardingMessage = typeof onboardingMessages.$inferInsert
export type OnboardingTask = typeof onboardingTasks.$inferSelect
export type NewOnboardingTask = typeof onboardingTasks.$inferInsert
export type IntegrationVerification = typeof integrationVerifications.$inferSelect
export type NewIntegrationVerification = typeof integrationVerifications.$inferInsert
export type AgentActionLog = typeof agentActionLogs.$inferSelect
export type NewAgentActionLog = typeof agentActionLogs.$inferInsert
