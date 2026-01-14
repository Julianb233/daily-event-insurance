/**
 * Admin Notification System Types
 *
 * Defines the structure for real-time admin notifications
 */

export type NotificationType =
  | "escalation"        // Support escalation requiring admin attention
  | "partner_approval"  // New partner application awaiting approval
  | "payout_alert"      // Payout processing needs attention
  | "system_health"     // System health warning or error
  | "claim_filed"       // New claim filed
  | "integration_error" // Integration health issue
  | "general"           // General notification

export type NotificationPriority = "low" | "medium" | "high" | "urgent"

export type NotificationStatus = "unread" | "read" | "dismissed"

export interface AdminNotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, unknown>
  createdAt: string
  readAt?: string
  dismissedAt?: string
}

export interface NotificationPayload {
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, unknown>
}

export interface NotificationFilters {
  type?: NotificationType
  priority?: NotificationPriority
  status?: NotificationStatus
  limit?: number
  offset?: number
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
}

// Configuration for notification sounds and behaviors
export const NOTIFICATION_CONFIG = {
  sounds: {
    urgent: "/sounds/urgent-notification.mp3",
    high: "/sounds/high-notification.mp3",
    default: "/sounds/notification.mp3",
  },
  autoPlaySound: {
    urgent: true,
    high: true,
    medium: false,
    low: false,
  },
  toastDuration: {
    urgent: 10000,  // 10 seconds
    high: 7000,     // 7 seconds
    medium: 5000,   // 5 seconds
    low: 3000,      // 3 seconds
  },
} as const

// Type icons and colors for UI rendering
export const NOTIFICATION_STYLES: Record<NotificationType, { icon: string; color: string; bgColor: string }> = {
  escalation: { icon: "AlertTriangle", color: "text-red-600", bgColor: "bg-red-100" },
  partner_approval: { icon: "UserPlus", color: "text-blue-600", bgColor: "bg-blue-100" },
  payout_alert: { icon: "DollarSign", color: "text-green-600", bgColor: "bg-green-100" },
  system_health: { icon: "AlertCircle", color: "text-amber-600", bgColor: "bg-amber-100" },
  claim_filed: { icon: "FileText", color: "text-purple-600", bgColor: "bg-purple-100" },
  integration_error: { icon: "Plug", color: "text-orange-600", bgColor: "bg-orange-100" },
  general: { icon: "Bell", color: "text-slate-600", bgColor: "bg-slate-100" },
}

export const PRIORITY_STYLES: Record<NotificationPriority, { label: string; color: string; dotColor: string }> = {
  urgent: { label: "Urgent", color: "text-red-700 bg-red-100", dotColor: "bg-red-500" },
  high: { label: "High", color: "text-orange-700 bg-orange-100", dotColor: "bg-orange-500" },
  medium: { label: "Medium", color: "text-amber-700 bg-amber-100", dotColor: "bg-amber-500" },
  low: { label: "Low", color: "text-slate-700 bg-slate-100", dotColor: "bg-slate-400" },
}
