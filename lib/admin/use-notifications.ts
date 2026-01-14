"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type {
  AdminNotification,
  NotificationFilters,
  NotificationStats,
  NotificationType,
  NotificationPriority,
  NotificationPayload,
} from "./notification-types"
import { NOTIFICATION_CONFIG, NOTIFICATION_STYLES, PRIORITY_STYLES } from "./notification-types"

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
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
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
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
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
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    readAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { claimId: "CLM-789", amount: 450, partnerId: "PTR-456" },
  },
]

interface UseNotificationsOptions {
  enableRealtime?: boolean
  enableSounds?: boolean
  enableToasts?: boolean
  pollInterval?: number // Fallback polling in ms (default: 30s)
}

interface UseNotificationsReturn {
  notifications: AdminNotification[]
  unreadCount: number
  stats: NotificationStats | null
  isLoading: boolean
  error: string | null
  isConnected: boolean
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  dismissNotification: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    enableRealtime = true,
    enableSounds = true,
    enableToasts = true,
    pollInterval = 30000,
  } = options

  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate unread count
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  // Play notification sound
  const playSound = useCallback((priority: NotificationPriority) => {
    if (!enableSounds || !NOTIFICATION_CONFIG.autoPlaySound[priority]) return

    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const soundPath = priority === "urgent"
        ? NOTIFICATION_CONFIG.sounds.urgent
        : priority === "high"
          ? NOTIFICATION_CONFIG.sounds.high
          : NOTIFICATION_CONFIG.sounds.default

      audioRef.current.src = soundPath
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {
        // Audio play was prevented - user hasn't interacted with page yet
        console.log("Notification sound blocked - user interaction required")
      })
    } catch {
      // Silently fail for sound errors
    }
  }, [enableSounds])

  // Show toast notification
  const showToast = useCallback((notification: AdminNotification) => {
    if (!enableToasts) return

    const style = NOTIFICATION_STYLES[notification.type]
    const priorityStyle = PRIORITY_STYLES[notification.priority]
    const duration = NOTIFICATION_CONFIG.toastDuration[notification.priority]

    const toastFn = notification.priority === "urgent"
      ? toast.error
      : notification.priority === "high"
        ? toast.warning
        : toast.info

    toastFn(notification.title, {
      description: notification.message,
      duration,
      action: notification.actionUrl
        ? {
            label: notification.actionLabel || "View",
            onClick: () => {
              window.location.href = notification.actionUrl!
            },
          }
        : undefined,
    })
  }, [enableToasts])

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (filters?: NotificationFilters) => {
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.set("type", filters.type)
      if (filters?.priority) params.set("priority", filters.priority)
      if (filters?.status) params.set("status", filters.status)
      if (filters?.limit) params.set("limit", filters.limit.toString())
      if (filters?.offset) params.set("offset", filters.offset.toString())

      const response = await fetch(`/api/admin/notifications?${params}`)
      const result = await response.json()

      if (result.success) {
        setNotifications(result.data.notifications)
        setStats(result.data.stats)
        setError(null)
      } else {
        throw new Error(result.message || "Failed to fetch notifications")
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
      // Fall back to mock data in dev mode
      setNotifications(MOCK_NOTIFICATIONS)
      setStats({
        total: MOCK_NOTIFICATIONS.length,
        unread: MOCK_NOTIFICATIONS.filter((n) => n.status === "unread").length,
        byType: MOCK_NOTIFICATIONS.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1
          return acc
        }, {} as Record<NotificationType, number>),
        byPriority: MOCK_NOTIFICATIONS.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1
          return acc
        }, {} as Record<NotificationPriority, number>),
      })
      setError(null) // Don't show error in dev mode
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, status: "read", readAt: new Date().toISOString() } : n
          )
        )
      }
    } catch (err) {
      // Optimistically update anyway in dev mode
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "read", readAt: new Date().toISOString() } : n
        )
      )
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            status: "read",
            readAt: n.readAt || new Date().toISOString(),
          }))
        )
      }
    } catch (err) {
      // Optimistically update anyway
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          status: "read",
          readAt: n.readAt || new Date().toISOString(),
        }))
      )
    }
  }, [])

  // Dismiss a notification
  const dismissNotification = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "dismissed" }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, status: "dismissed", dismissedAt: new Date().toISOString() }
              : n
          )
        )
      }
    } catch (err) {
      // Optimistically update anyway
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, status: "dismissed", dismissedAt: new Date().toISOString() }
            : n
        )
      )
    }
  }, [])

  // Clear all notifications (mark all as dismissed)
  const clearAll = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/notifications`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotifications([])
      }
    } catch (err) {
      // Optimistically update anyway
      setNotifications([])
    }
  }, [])

  // Handle incoming realtime notification
  const handleRealtimeNotification = useCallback(
    (notification: AdminNotification) => {
      // Add to list
      setNotifications((prev) => [notification, ...prev])

      // Play sound based on priority
      playSound(notification.priority)

      // Show toast
      showToast(notification)
    },
    [playSound, showToast]
  )

  // Setup Supabase realtime subscription
  useEffect(() => {
    if (!enableRealtime) return

    const supabase = createClient()
    if (!supabase) {
      // Supabase not configured - use polling
      return
    }

    // Subscribe to admin_notifications table
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const newNotification = payload.new as AdminNotification
          handleRealtimeNotification(newNotification)
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enableRealtime, handleRealtimeNotification])

  // Setup polling as fallback
  useEffect(() => {
    const poll = () => {
      fetchNotifications()
      pollTimeoutRef.current = setTimeout(poll, pollInterval)
    }

    // Initial fetch
    fetchNotifications()

    // Start polling if realtime is disabled or as fallback
    if (!enableRealtime || !isConnected) {
      pollTimeoutRef.current = setTimeout(poll, pollInterval)
    }

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [enableRealtime, isConnected, pollInterval, fetchNotifications])

  return {
    notifications,
    unreadCount,
    stats,
    isLoading,
    error,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  }
}

// Export type for use in components
export type { UseNotificationsReturn }
