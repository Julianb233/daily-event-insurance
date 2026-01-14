import { NextRequest } from "next/server"
import { withAuth } from "@/lib/api-auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  badRequest,
  serverError,
  notFoundError,
} from "@/lib/api-responses"
import type {
  AdminNotification,
  NotificationPayload,
  NotificationType,
  NotificationPriority,
  NotificationStats,
} from "@/lib/admin/notification-types"
import { nanoid } from "nanoid"

// Helper to get typed supabase client for admin_notifications table
// This table is not in the auto-generated types yet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNotificationsTable = (supabase: ReturnType<typeof createAdminClient>) =>
  (supabase as any).from("admin_notifications")

// Mock notifications for development mode
const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "mock-1",
    type: "escalation",
    priority: "urgent",
    status: "unread",
    title: "Customer Escalation",
    message: "High-priority support ticket requires immediate attention from claims team.",
    actionUrl: "/admin/support/escalations",
    actionLabel: "View Escalation",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    metadata: { ticketId: "ESC-001", customerName: "John Smith" },
  },
  {
    id: "mock-2",
    type: "partner_approval",
    priority: "high",
    status: "unread",
    title: "New Partner Application",
    message: "Summit Climbing Co has submitted a partner application for review.",
    actionUrl: "/admin/partners?status=pending",
    actionLabel: "Review Application",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: { partnerId: "PTR-123", businessName: "Summit Climbing Co" },
  },
  {
    id: "mock-3",
    type: "payout_alert",
    priority: "medium",
    status: "unread",
    title: "Payout Processing Due",
    message: "12 partner payouts totaling $15,670.50 are ready for processing.",
    actionUrl: "/admin/payouts",
    actionLabel: "Process Payouts",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { payoutCount: 12, totalAmount: 15670.50 },
  },
  {
    id: "mock-4",
    type: "system_health",
    priority: "high",
    status: "read",
    title: "Integration Warning",
    message: "Lightspeed POS integration showing elevated error rate (5.2%).",
    actionUrl: "/admin/integrations/lightspeed",
    actionLabel: "View Details",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    metadata: { integration: "lightspeed", errorRate: 5.2 },
  },
  {
    id: "mock-5",
    type: "claim_filed",
    priority: "medium",
    status: "read",
    title: "New Claim Filed",
    message: "Equipment damage claim ($450) submitted by Adventure Sports Inc customer.",
    actionUrl: "/admin/claims",
    actionLabel: "Review Claim",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { claimId: "CLM-789", amount: 450, partnerId: "PTR-456" },
  },
]

// In-memory store for mock notifications (dev mode)
let mockNotificationStore = [...MOCK_NOTIFICATIONS]

/**
 * Calculate notification stats
 */
function calculateStats(notifications: AdminNotification[]): NotificationStats {
  const stats: NotificationStats = {
    total: notifications.filter((n) => n.status !== "dismissed").length,
    unread: notifications.filter((n) => n.status === "unread").length,
    byType: {} as Record<NotificationType, number>,
    byPriority: {} as Record<NotificationPriority, number>,
  }

  for (const notification of notifications) {
    if (notification.status === "dismissed") continue

    // Count by type
    stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1

    // Count by priority
    stats.byPriority[notification.priority] =
      (stats.byPriority[notification.priority] || 0) + 1
  }

  return stats
}

/**
 * GET /api/admin/notifications
 * Fetch notifications for the admin user
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const searchParams = request.nextUrl.searchParams
      const type = searchParams.get("type") as NotificationType | null
      const priority = searchParams.get("priority") as NotificationPriority | null
      const status = searchParams.get("status") as "unread" | "read" | "dismissed" | null
      const limit = parseInt(searchParams.get("limit") || "50")
      const offset = parseInt(searchParams.get("offset") || "0")

      // Dev mode - return mock data
      if (isDevMode) {
        let filtered = mockNotificationStore

        if (type) {
          filtered = filtered.filter((n) => n.type === type)
        }
        if (priority) {
          filtered = filtered.filter((n) => n.priority === priority)
        }
        if (status) {
          filtered = filtered.filter((n) => n.status === status)
        }

        // Sort by createdAt descending
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        const paginated = filtered.slice(offset, offset + limit)
        const stats = calculateStats(mockNotificationStore)

        return successResponse({
          notifications: paginated,
          stats,
          pagination: {
            total: filtered.length,
            limit,
            offset,
            hasMore: offset + limit < filtered.length,
          },
        })
      }

      // Production - fetch from Supabase
      const supabase = createAdminClient()
      if (!supabase) {
        return serverError("Database connection not available")
      }

      let query = getNotificationsTable(supabase)
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (type) {
        query = query.eq("type", type)
      }
      if (priority) {
        query = query.eq("priority", priority)
      }
      if (status) {
        query = query.eq("status", status)
      }

      const { data: notifications, error, count } = await query

      if (error) {
        console.error("[Notifications] GET Error:", error)
        return serverError("Failed to fetch notifications")
      }

      // Get stats
      const { data: allNotifications } = await getNotificationsTable(supabase)
        .select("type, priority, status")

      const stats = calculateStats((allNotifications || []) as AdminNotification[])

      return successResponse({
        notifications: notifications || [],
        stats,
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: offset + limit < (count || 0),
        },
      })
    } catch (error: unknown) {
      console.error("[Notifications] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch notifications"
      return serverError(message)
    }
  })
}

/**
 * POST /api/admin/notifications
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      const body = (await request.json()) as NotificationPayload

      // Validate required fields
      if (!body.type || !body.title || !body.message) {
        return badRequest("Missing required fields: type, title, message")
      }

      const newNotification: AdminNotification = {
        id: nanoid(),
        type: body.type,
        priority: body.priority || "medium",
        status: "unread",
        title: body.title,
        message: body.message,
        actionUrl: body.actionUrl,
        actionLabel: body.actionLabel,
        metadata: body.metadata,
        createdAt: new Date().toISOString(),
      }

      // Dev mode - add to mock store
      if (isDevMode) {
        mockNotificationStore.unshift(newNotification)
        return successResponse(newNotification, "Notification created", 201)
      }

      // Production - insert into Supabase
      const supabase = createAdminClient()
      if (!supabase) {
        return serverError("Database connection not available")
      }

      const { data, error } = await getNotificationsTable(supabase)
        .insert({
          id: newNotification.id,
          type: newNotification.type,
          priority: newNotification.priority,
          status: newNotification.status,
          title: newNotification.title,
          message: newNotification.message,
          action_url: newNotification.actionUrl,
          action_label: newNotification.actionLabel,
          metadata: newNotification.metadata,
          created_at: newNotification.createdAt,
        })
        .select()
        .single()

      if (error) {
        console.error("[Notifications] POST Error:", error)
        return serverError("Failed to create notification")
      }

      return successResponse(data, "Notification created", 201)
    } catch (error: unknown) {
      console.error("[Notifications] POST Error:", error)
      const message = error instanceof Error ? error.message : "Failed to create notification"
      return serverError(message)
    }
  })
}

/**
 * PATCH /api/admin/notifications
 * Update notification status (mark as read, dismiss, etc.)
 */
export async function PATCH(request: NextRequest) {
  return withAuth(async () => {
    try {
      const body = await request.json()

      // Handle mark all as read
      if (body.markAllRead) {
        if (isDevMode) {
          mockNotificationStore = mockNotificationStore.map((n) => ({
            ...n,
            status: n.status === "unread" ? "read" : n.status,
            readAt: n.status === "unread" ? new Date().toISOString() : n.readAt,
          }))
          return successResponse({ updated: true }, "All notifications marked as read")
        }

        const supabase = createAdminClient()
        if (!supabase) {
          return serverError("Database connection not available")
        }

        const { error } = await getNotificationsTable(supabase)
          .update({ status: "read", read_at: new Date().toISOString() })
          .eq("status", "unread")

        if (error) {
          console.error("[Notifications] PATCH Error:", error)
          return serverError("Failed to update notifications")
        }

        return successResponse({ updated: true }, "All notifications marked as read")
      }

      // Handle single notification update
      const { id, status } = body

      if (!id) {
        return badRequest("Missing notification ID")
      }

      if (!status || !["read", "dismissed"].includes(status)) {
        return badRequest("Invalid status. Must be 'read' or 'dismissed'")
      }

      // Dev mode - update mock store
      if (isDevMode) {
        const index = mockNotificationStore.findIndex((n) => n.id === id)
        if (index === -1) {
          return notFoundError("Notification")
        }

        mockNotificationStore[index] = {
          ...mockNotificationStore[index],
          status,
          readAt: status === "read" ? new Date().toISOString() : mockNotificationStore[index].readAt,
          dismissedAt: status === "dismissed" ? new Date().toISOString() : undefined,
        }

        return successResponse(mockNotificationStore[index], "Notification updated")
      }

      // Production - update in Supabase
      const supabase = createAdminClient()
      if (!supabase) {
        return serverError("Database connection not available")
      }

      const updateData: Record<string, unknown> = { status }
      if (status === "read") {
        updateData.read_at = new Date().toISOString()
      } else if (status === "dismissed") {
        updateData.dismissed_at = new Date().toISOString()
      }

      const { data, error } = await getNotificationsTable(supabase)
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[Notifications] PATCH Error:", error)
        return serverError("Failed to update notification")
      }

      return successResponse(data, "Notification updated")
    } catch (error: unknown) {
      console.error("[Notifications] PATCH Error:", error)
      const message = error instanceof Error ? error.message : "Failed to update notification"
      return serverError(message)
    }
  })
}

/**
 * DELETE /api/admin/notifications
 * Clear all notifications (mark as dismissed)
 */
export async function DELETE() {
  return withAuth(async () => {
    try {
      // Dev mode - clear mock store
      if (isDevMode) {
        mockNotificationStore = mockNotificationStore.map((n) => ({
          ...n,
          status: "dismissed",
          dismissedAt: new Date().toISOString(),
        }))
        return successResponse({ cleared: true }, "All notifications cleared")
      }

      // Production - mark all as dismissed in Supabase
      const supabase = createAdminClient()
      if (!supabase) {
        return serverError("Database connection not available")
      }

      const { error } = await getNotificationsTable(supabase)
        .update({ status: "dismissed", dismissed_at: new Date().toISOString() })
        .neq("status", "dismissed")

      if (error) {
        console.error("[Notifications] DELETE Error:", error)
        return serverError("Failed to clear notifications")
      }

      return successResponse({ cleared: true }, "All notifications cleared")
    } catch (error: unknown) {
      console.error("[Notifications] DELETE Error:", error)
      const message = error instanceof Error ? error.message : "Failed to clear notifications"
      return serverError(message)
    }
  })
}
