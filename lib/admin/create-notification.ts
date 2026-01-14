/**
 * Server-side utility for creating admin notifications
 *
 * Use this function from API routes, server actions, or webhooks
 * to trigger notifications that appear in the admin dashboard.
 */

import { createAdminClient } from "@/lib/supabase/server"
import { isDevMode } from "@/lib/mock-data"
import { nanoid } from "nanoid"
import type {
  NotificationPayload,
  NotificationType,
  NotificationPriority,
} from "./notification-types"

interface CreateNotificationResult {
  success: boolean
  id?: string
  error?: string
}

/**
 * Create a new admin notification
 *
 * @example
 * // From an API route or server action
 * await createAdminNotification({
 *   type: "escalation",
 *   priority: "urgent",
 *   title: "Customer Escalation",
 *   message: "High-priority ticket requires attention",
 *   actionUrl: "/admin/support/escalations",
 *   actionLabel: "View Escalation",
 *   metadata: { ticketId: "123" }
 * })
 */
export async function createAdminNotification(
  payload: NotificationPayload
): Promise<CreateNotificationResult> {
  const id = nanoid()
  const createdAt = new Date().toISOString()

  // In dev mode, just return success (mock store is managed client-side)
  if (isDevMode) {
    console.log("[Admin Notification] Created (dev mode):", { id, ...payload })
    return { success: true, id }
  }

  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection not available" }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("admin_notifications").insert({
      id,
      type: payload.type,
      priority: payload.priority || "medium",
      status: "unread",
      title: payload.title,
      message: payload.message,
      action_url: payload.actionUrl,
      action_label: payload.actionLabel,
      metadata: payload.metadata,
      created_at: createdAt,
    })

    if (error) {
      console.error("[Admin Notification] Create error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id }
  } catch (error) {
    console.error("[Admin Notification] Create error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: message }
  }
}

/**
 * Helper functions for common notification types
 */

export async function notifyEscalation(options: {
  title: string
  message: string
  ticketId: string
  customerName?: string
  priority?: NotificationPriority
}) {
  return createAdminNotification({
    type: "escalation",
    priority: options.priority || "urgent",
    title: options.title,
    message: options.message,
    actionUrl: "/admin/support/escalations",
    actionLabel: "View Escalation",
    metadata: {
      ticketId: options.ticketId,
      customerName: options.customerName,
    },
  })
}

export async function notifyPartnerApplication(options: {
  partnerId: string
  businessName: string
}) {
  return createAdminNotification({
    type: "partner_approval",
    priority: "high",
    title: "New Partner Application",
    message: `${options.businessName} has submitted a partner application for review.`,
    actionUrl: "/admin/partners?status=pending",
    actionLabel: "Review Application",
    metadata: {
      partnerId: options.partnerId,
      businessName: options.businessName,
    },
  })
}

export async function notifyPayoutReady(options: {
  payoutCount: number
  totalAmount: number
}) {
  return createAdminNotification({
    type: "payout_alert",
    priority: "medium",
    title: "Payout Processing Due",
    message: `${options.payoutCount} partner payouts totaling $${options.totalAmount.toFixed(2)} are ready for processing.`,
    actionUrl: "/admin/payouts",
    actionLabel: "Process Payouts",
    metadata: {
      payoutCount: options.payoutCount,
      totalAmount: options.totalAmount,
    },
  })
}

export async function notifySystemHealth(options: {
  title: string
  message: string
  severity: "warning" | "error"
  component?: string
  details?: Record<string, unknown>
}) {
  return createAdminNotification({
    type: "system_health",
    priority: options.severity === "error" ? "urgent" : "high",
    title: options.title,
    message: options.message,
    actionUrl: options.component ? `/admin/integrations/${options.component}` : "/admin/integrations",
    actionLabel: "View Details",
    metadata: {
      severity: options.severity,
      component: options.component,
      ...options.details,
    },
  })
}

export async function notifyNewClaim(options: {
  claimId: string
  amount: number
  partnerId: string
  partnerName?: string
  claimType?: string
}) {
  return createAdminNotification({
    type: "claim_filed",
    priority: "medium",
    title: "New Claim Filed",
    message: `${options.claimType || "Insurance"} claim ($${options.amount.toFixed(2)}) submitted${options.partnerName ? ` by ${options.partnerName} customer` : ""}.`,
    actionUrl: "/admin/claims",
    actionLabel: "Review Claim",
    metadata: {
      claimId: options.claimId,
      amount: options.amount,
      partnerId: options.partnerId,
      partnerName: options.partnerName,
      claimType: options.claimType,
    },
  })
}

export async function notifyIntegrationError(options: {
  integration: string
  errorRate?: number
  message: string
  details?: Record<string, unknown>
}) {
  return createAdminNotification({
    type: "integration_error",
    priority: options.errorRate && options.errorRate > 10 ? "urgent" : "high",
    title: `Integration Issue: ${options.integration}`,
    message: options.message,
    actionUrl: `/admin/integrations/${options.integration.toLowerCase().replace(/\s+/g, "-")}`,
    actionLabel: "View Details",
    metadata: {
      integration: options.integration,
      errorRate: options.errorRate,
      ...options.details,
    },
  })
}
