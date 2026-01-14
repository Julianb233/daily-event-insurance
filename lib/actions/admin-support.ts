"use server"

import { db, isDbConfigured, supportMessages, supportConversations } from "@/lib/db"
import { partnerIntegrations, partners } from "@/lib/db/schema"
import { eq, sql, and, desc, or, ilike } from "drizzle-orm"
import { nanoid } from "nanoid"
import { isDevMode } from "@/lib/mock-data"

// Types for integration statistics
export interface IntegrationStats {
  total: number
  byStatus: {
    pending: number
    configured: number
    testing: number
    live: number
    failed: number
  }
  byType: {
    widget: number
    api: number
    pos: number
  }
  recentActivity: {
    lastWeek: number
    lastMonth: number
  }
}

export interface PartnerIntegrationWithDetails {
  id: string
  partnerId: string
  partnerName: string
  partnerBusinessName: string
  partnerEmail: string
  integrationType: string
  posSystem: string | null
  status: string
  configuration: string | null
  apiKeyGenerated: boolean
  webhookConfigured: boolean
  lastTestedAt: string | null
  testResult: string | null
  testErrors: string | null
  wentLiveAt: string | null
  createdAt: string
  updatedAt: string
}

export interface IntegrationFilters {
  status?: string
  integrationType?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface PaginatedIntegrations {
  data: PartnerIntegrationWithDetails[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Get integration statistics for the dashboard
 */
export async function getIntegrationStats(): Promise<IntegrationStats> {
  try {
    if (!db || !isDbConfigured()) {
      // Return mock data if DB not available
      return {
        total: 0,
        byStatus: { pending: 0, configured: 0, testing: 0, live: 0, failed: 0 },
        byType: { widget: 0, api: 0, pos: 0 },
        recentActivity: { lastWeek: 0, lastMonth: 0 },
      }
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(partnerIntegrations)

    // Get counts by status
    const statusCounts = await db
      .select({
        status: partnerIntegrations.status,
        count: sql<number>`count(*)::int`,
      })
      .from(partnerIntegrations)
      .groupBy(partnerIntegrations.status)

    // Get counts by integration type
    const typeCounts = await db
      .select({
        integrationType: partnerIntegrations.integrationType,
        count: sql<number>`count(*)::int`,
      })
      .from(partnerIntegrations)
      .groupBy(partnerIntegrations.integrationType)

    // Get recent activity counts
    const lastWeekResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(partnerIntegrations)
      .where(
        sql`${partnerIntegrations.updatedAt} > now() - interval '7 days'`
      )

    const lastMonthResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(partnerIntegrations)
      .where(
        sql`${partnerIntegrations.updatedAt} > now() - interval '30 days'`
      )

    // Build the status counts object
    const byStatus = {
      pending: 0,
      configured: 0,
      testing: 0,
      live: 0,
      failed: 0,
    }

    for (const row of statusCounts) {
      const status = row.status as keyof typeof byStatus
      if (status in byStatus) {
        byStatus[status] = row.count
      }
    }

    // Build the type counts object
    const byType = {
      widget: 0,
      api: 0,
      pos: 0,
    }

    for (const row of typeCounts) {
      const type = row.integrationType as keyof typeof byType
      if (type in byType) {
        byType[type] = row.count
      }
    }

    return {
      total: totalResult[0]?.count || 0,
      byStatus,
      byType,
      recentActivity: {
        lastWeek: lastWeekResult[0]?.count || 0,
        lastMonth: lastMonthResult[0]?.count || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching integration stats:", error)
    // Return empty stats on error
    return {
      total: 0,
      byStatus: { pending: 0, configured: 0, testing: 0, live: 0, failed: 0 },
      byType: { widget: 0, api: 0, pos: 0 },
      recentActivity: { lastWeek: 0, lastMonth: 0 },
    }
  }
}

/**
 * Get paginated list of partner integrations with filters
 */
export async function getPartnerIntegrations(
  filters: IntegrationFilters = {}
): Promise<PaginatedIntegrations> {
  try {
    if (!db || !isDbConfigured()) {
      return {
        data: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      }
    }

    const { status, integrationType, search, page = 1, pageSize = 20 } = filters
    const offset = (page - 1) * pageSize

    // Build where conditions
    const conditions = []

    if (status) {
      conditions.push(eq(partnerIntegrations.status, status))
    }

    if (integrationType) {
      conditions.push(eq(partnerIntegrations.integrationType, integrationType))
    }

    // Get data with partner details using a join
    const baseQuery = db
      .select({
        id: partnerIntegrations.id,
        partnerId: partnerIntegrations.partnerId,
        partnerName: partners.contactName,
        partnerBusinessName: partners.businessName,
        partnerEmail: partners.contactEmail,
        integrationType: partnerIntegrations.integrationType,
        posSystem: partnerIntegrations.posSystem,
        status: partnerIntegrations.status,
        configuration: partnerIntegrations.configuration,
        apiKeyGenerated: partnerIntegrations.apiKeyGenerated,
        webhookConfigured: partnerIntegrations.webhookConfigured,
        lastTestedAt: partnerIntegrations.lastTestedAt,
        testResult: partnerIntegrations.testResult,
        testErrors: partnerIntegrations.testErrors,
        wentLiveAt: partnerIntegrations.wentLiveAt,
        createdAt: partnerIntegrations.createdAt,
        updatedAt: partnerIntegrations.updatedAt,
      })
      .from(partnerIntegrations)
      .leftJoin(partners, eq(partnerIntegrations.partnerId, partners.id))

    // Add search filter for partner name, business name, or email
    if (search) {
      conditions.push(
        or(
          ilike(partners.contactName, `%${search}%`),
          ilike(partners.businessName, `%${search}%`),
          ilike(partners.contactEmail, `%${search}%`)
        )!
      )
    }

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)::int` })
      .from(partnerIntegrations)
      .leftJoin(partners, eq(partnerIntegrations.partnerId, partners.id))

    let countResult
    let dataResult

    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions)
      countResult = await countQuery.where(whereClause)
      dataResult = await baseQuery
        .where(whereClause)
        .orderBy(desc(partnerIntegrations.updatedAt))
        .limit(pageSize)
        .offset(offset)
    } else {
      countResult = await countQuery
      dataResult = await baseQuery
        .orderBy(desc(partnerIntegrations.updatedAt))
        .limit(pageSize)
        .offset(offset)
    }

    const total = countResult[0]?.count || 0
    const totalPages = Math.ceil(total / pageSize)

    // Transform the data to match the expected interface
    const transformedData: PartnerIntegrationWithDetails[] = dataResult.map((row) => ({
      id: row.id,
      partnerId: row.partnerId,
      partnerName: row.partnerName || "Unknown",
      partnerBusinessName: row.partnerBusinessName || "Unknown Business",
      partnerEmail: row.partnerEmail || "",
      integrationType: row.integrationType,
      posSystem: row.posSystem,
      status: row.status || "pending",
      configuration: row.configuration,
      apiKeyGenerated: row.apiKeyGenerated || false,
      webhookConfigured: row.webhookConfigured || false,
      lastTestedAt: row.lastTestedAt?.toISOString() || null,
      testResult: row.testResult,
      testErrors: row.testErrors,
      wentLiveAt: row.wentLiveAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }))

    return {
      data: transformedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error("Error fetching partner integrations:", error)
    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
}

/**
 * Get a single partner integration by ID
 */
export async function getPartnerIntegrationById(
  integrationId: string
): Promise<PartnerIntegrationWithDetails | null> {
  try {
    if (!db || !isDbConfigured()) {
      return null
    }

    const result = await db
      .select({
        id: partnerIntegrations.id,
        partnerId: partnerIntegrations.partnerId,
        partnerName: partners.contactName,
        partnerBusinessName: partners.businessName,
        partnerEmail: partners.contactEmail,
        integrationType: partnerIntegrations.integrationType,
        posSystem: partnerIntegrations.posSystem,
        status: partnerIntegrations.status,
        configuration: partnerIntegrations.configuration,
        apiKeyGenerated: partnerIntegrations.apiKeyGenerated,
        webhookConfigured: partnerIntegrations.webhookConfigured,
        lastTestedAt: partnerIntegrations.lastTestedAt,
        testResult: partnerIntegrations.testResult,
        testErrors: partnerIntegrations.testErrors,
        wentLiveAt: partnerIntegrations.wentLiveAt,
        createdAt: partnerIntegrations.createdAt,
        updatedAt: partnerIntegrations.updatedAt,
      })
      .from(partnerIntegrations)
      .leftJoin(partners, eq(partnerIntegrations.partnerId, partners.id))
      .where(eq(partnerIntegrations.id, integrationId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return {
      id: row.id,
      partnerId: row.partnerId,
      partnerName: row.partnerName || "Unknown",
      partnerBusinessName: row.partnerBusinessName || "Unknown Business",
      partnerEmail: row.partnerEmail || "",
      integrationType: row.integrationType,
      posSystem: row.posSystem,
      status: row.status || "pending",
      configuration: row.configuration,
      apiKeyGenerated: row.apiKeyGenerated || false,
      webhookConfigured: row.webhookConfigured || false,
      lastTestedAt: row.lastTestedAt?.toISOString() || null,
      testResult: row.testResult,
      testErrors: row.testErrors,
      wentLiveAt: row.wentLiveAt?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching partner integration:", error)
    return null
  }
}

/**
 * Get integration health summary (percentage of live vs failed)
 */
export async function getIntegrationHealthSummary(): Promise<{
  healthScore: number
  liveCount: number
  failedCount: number
  totalActive: number
}> {
  try {
    const stats = await getIntegrationStats()

    const liveCount = stats.byStatus.live
    const failedCount = stats.byStatus.failed
    const totalActive = liveCount + stats.byStatus.testing + stats.byStatus.configured

    // Health score: percentage of non-failed integrations out of all active ones
    const healthScore = totalActive > 0
      ? Math.round(((totalActive - failedCount) / totalActive) * 100)
      : 100

    return {
      healthScore,
      liveCount,
      failedCount,
      totalActive,
    }
  } catch (error) {
    console.error("Error fetching integration health summary:", error)
    return {
      healthScore: 100,
      liveCount: 0,
      failedCount: 0,
      totalActive: 0,
    }
  }
}

// Types for conversation management
export interface ConversationMessage {
  id: string
  role: "user" | "assistant" | "admin" | "system"
  content: string
  contentType?: "text" | "code" | "error" | "action"
  createdAt: string
  codeSnippet?: string
  codeLanguage?: string
  toolsUsed?: string[]
}

export interface ConversationDetail {
  id: string
  partnerId: string | null
  partnerEmail: string | null
  partnerName: string | null
  partnerBusinessName?: string | null
  status: "active" | "resolved" | "escalated" | "abandoned"
  priority: "low" | "normal" | "high" | "urgent"
  topic: string | null
  messages: ConversationMessage[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string | null
  escalatedAt?: string | null
  resolution?: string | null
  escalationReason?: string | null
  onboardingStep?: string | null
  pageUrl?: string | null
  techStack?: {
    framework?: string
    pos?: string
    language?: string
  } | null
  partnerInfo?: {
    integrationStatus?: string
  } | null
  helpfulRating?: number | null
  feedback?: string | null
}

/**
 * Get a conversation with its messages
 */
export async function getConversation(
  conversationId: string
): Promise<{ success: boolean; data?: ConversationDetail; error?: string }> {
  try {
    if (!conversationId) {
      return { success: false, error: "Conversation ID is required" }
    }

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      return {
        success: true,
        data: {
          id: conversationId,
          partnerId: "mock-partner",
          partnerEmail: "partner@example.com",
          partnerName: "John Doe",
          status: "active",
          priority: "normal",
          topic: "troubleshooting",
          messages: [
            {
              id: "msg-1",
              role: "user",
              content: "Hi, I need help with integration",
              contentType: "text",
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }

    // Fetch conversation
    const [conversation] = await db!
      .select()
      .from(supportConversations)
      .where(eq(supportConversations.id, conversationId))
      .limit(1)

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // Fetch messages
    const messages = await db!
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.conversationId, conversationId))
      .orderBy(supportMessages.createdAt)

    return {
      success: true,
      data: {
        id: conversation.id,
        partnerId: conversation.partnerId,
        partnerEmail: conversation.partnerEmail,
        partnerName: conversation.partnerName,
        status: conversation.status as ConversationDetail["status"],
        priority: (conversation.priority || "normal") as ConversationDetail["priority"],
        topic: conversation.topic,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role as ConversationMessage["role"],
          content: m.content,
          contentType: m.contentType as ConversationMessage["contentType"],
          createdAt: m.createdAt.toISOString(),
        })),
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        resolvedAt: conversation.resolvedAt?.toISOString() || null,
        escalatedAt: conversation.escalatedAt?.toISOString() || null,
      },
    }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch conversation",
    }
  }
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(
  conversationId: string,
  status: "active" | "resolved" | "escalated" | "abandoned",
  options?: { resolution?: string; escalationReason?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!conversationId || !status) {
      return { success: false, error: "Conversation ID and status are required" }
    }

    // Dev mode - return mock success
    if (isDevMode || !isDbConfigured()) {
      return { success: true }
    }

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    }

    if (status === "resolved") {
      updateData.resolvedAt = new Date()
      if (options?.resolution) {
        updateData.resolution = options.resolution
      }
    } else if (status === "escalated") {
      updateData.escalatedAt = new Date()
      if (options?.escalationReason) {
        updateData.escalationReason = options.escalationReason
      }
    }

    await db!
      .update(supportConversations)
      .set(updateData)
      .where(eq(supportConversations.id, conversationId))

    return { success: true }
  } catch (error) {
    console.error("Error updating conversation status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    }
  }
}

/**
 * Send an admin reply to a support conversation
 */
export async function sendAdminReply(
  conversationId: string,
  message: string,
  codeSnippet?: string,
  codeLanguage?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!conversationId || !message) {
      return { success: false, error: "Conversation ID and message are required" }
    }

    // Dev mode - return mock success
    if (isDevMode || !isDbConfigured()) {
      return {
        success: true,
        messageId: `msg-${nanoid(8)}`,
      }
    }

    // Build message content
    let content = message
    if (codeSnippet) {
      content += `\n\n\`\`\`${codeLanguage || "javascript"}\n${codeSnippet}\n\`\`\``
    }

    // Insert the message
    const [insertedMessage] = await db!.insert(supportMessages).values({
      conversationId,
      role: "admin",
      content,
      contentType: codeSnippet ? "code" : "text",
    }).returning()

    // Update conversation's updatedAt
    await db!
      .update(supportConversations)
      .set({ updatedAt: new Date() })
      .where(eq(supportConversations.id, conversationId))

    return {
      success: true,
      messageId: insertedMessage?.id,
    }
  } catch (error) {
    console.error("Error sending admin reply:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send reply",
    }
  }
}
