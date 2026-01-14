"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import type { MonthlyEarnings, Partner } from "@/lib/supabase/types"

export type ConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected"

export interface RealtimeNotification {
  id: string
  type: "insert" | "update" | "delete"
  table: string
  message: string
  timestamp: Date
}

export interface DashboardStats {
  monthlyEarnings: number
  yearToDateEarnings: number
  participants: number
  optedInParticipants: number
  commissionRate: number
}

export interface UseRealtimeDashboardOptions {
  partnerId?: string
  onNotification?: (notification: RealtimeNotification) => void
  enabled?: boolean
}

export interface UseRealtimeDashboardReturn {
  stats: DashboardStats | null
  connectionState: ConnectionState
  lastUpdated: Date | null
  notifications: RealtimeNotification[]
  clearNotifications: () => void
  reconnect: () => void
  isSubscribed: boolean
}

export function useRealtimeDashboard({
  partnerId,
  onNotification,
  enabled = true,
}: UseRealtimeDashboardOptions = {}): UseRealtimeDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createClient())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  // Generate unique notification ID
  const generateNotificationId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Add notification
  const addNotification = useCallback(
    (type: "insert" | "update" | "delete", table: string, message: string) => {
      const notification: RealtimeNotification = {
        id: generateNotificationId(),
        type,
        table,
        message,
        timestamp: new Date(),
      }

      setNotifications((prev) => [notification, ...prev].slice(0, 10)) // Keep last 10
      onNotification?.(notification)

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    },
    [generateNotificationId, onNotification]
  )

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Handle earnings changes
  const handleEarningsChange = useCallback(
    (payload: RealtimePostgresChangesPayload<MonthlyEarnings>) => {
      const eventType = payload.eventType
      const newRecord = payload.new as MonthlyEarnings | undefined
      const oldRecord = payload.old as MonthlyEarnings | undefined

      setLastUpdated(new Date())

      if (eventType === "INSERT" && newRecord) {
        addNotification("insert", "monthly_earnings", "New earnings recorded")
        setStats((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            monthlyEarnings: newRecord.partner_commission,
            yearToDateEarnings: prev.yearToDateEarnings + newRecord.partner_commission,
            participants: newRecord.total_participants,
            optedInParticipants: newRecord.opted_in_participants,
          }
        })
      } else if (eventType === "UPDATE" && newRecord && oldRecord) {
        addNotification("update", "monthly_earnings", "Earnings updated")
        setStats((prev) => {
          if (!prev) return prev
          const earningsDiff = newRecord.partner_commission - oldRecord.partner_commission
          return {
            ...prev,
            monthlyEarnings: newRecord.partner_commission,
            yearToDateEarnings: prev.yearToDateEarnings + earningsDiff,
            participants: newRecord.total_participants,
            optedInParticipants: newRecord.opted_in_participants,
          }
        })
      } else if (eventType === "DELETE" && oldRecord) {
        addNotification("delete", "monthly_earnings", "Earnings record removed")
        setStats((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            yearToDateEarnings: Math.max(0, prev.yearToDateEarnings - oldRecord.partner_commission),
          }
        })
      }
    },
    [addNotification]
  )

  // Handle partner changes (for commission rate updates)
  const handlePartnerChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Partner>) => {
      const eventType = payload.eventType
      const newRecord = payload.new as Partner | undefined

      if (eventType === "UPDATE" && newRecord) {
        setLastUpdated(new Date())
        addNotification("update", "partners", "Account settings updated")
      }
    },
    [addNotification]
  )

  // Store subscribe function in ref to avoid circular dependency
  const subscribeRef = useRef<() => void>(() => {})

  // Attempt reconnection with exponential backoff
  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setConnectionState("disconnected")
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
    reconnectAttemptsRef.current += 1

    reconnectTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current)
      }
      subscribeRef.current()
    }, delay)
  }, [])

  // Subscribe to realtime channels
  const subscribe = useCallback(() => {
    if (!enabled) return

    const supabase = supabaseRef.current
    setConnectionState("connecting")

    // Build filter for partner-specific data
    const earningsFilter = partnerId
      ? `partner_id=eq.${partnerId}`
      : undefined

    const partnerFilter = partnerId
      ? `id=eq.${partnerId}`
      : undefined

    // Create channel with subscriptions
    const channel = supabase
      .channel("dashboard-realtime", {
        config: {
          broadcast: { self: true },
          presence: { key: partnerId || "anonymous" },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "monthly_earnings",
          filter: earningsFilter,
        },
        handleEarningsChange
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "partners",
          filter: partnerFilter,
        },
        handlePartnerChange
      )
      .on("system", { event: "*" }, (payload) => {
        // Handle system events for connection state
        if (payload.extension === "postgres_changes") {
          if (payload.status === "ok") {
            setConnectionState("connected")
            setIsSubscribed(true)
            reconnectAttemptsRef.current = 0
          } else if (payload.status === "error") {
            setConnectionState("reconnecting")
          }
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionState("connected")
          setIsSubscribed(true)
          reconnectAttemptsRef.current = 0
        } else if (status === "CHANNEL_ERROR") {
          setConnectionState("reconnecting")
          attemptReconnect()
        } else if (status === "TIMED_OUT") {
          setConnectionState("disconnected")
          attemptReconnect()
        } else if (status === "CLOSED") {
          setConnectionState("disconnected")
          setIsSubscribed(false)
        }
      })

    channelRef.current = channel
  }, [enabled, partnerId, handleEarningsChange, handlePartnerChange, attemptReconnect])

  // Update the ref whenever subscribe changes
  useEffect(() => {
    subscribeRef.current = subscribe
  }, [subscribe])

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    if (channelRef.current) {
      supabaseRef.current.removeChannel(channelRef.current)
    }
    subscribe()
  }, [subscribe])

  // Unsubscribe from channels
  const unsubscribe = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (channelRef.current) {
      supabaseRef.current.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setIsSubscribed(false)
    setConnectionState("disconnected")
  }, [])

  // Subscribe on mount, unsubscribe on unmount
  useEffect(() => {
    if (enabled) {
      subscribe()
    }

    return () => {
      unsubscribe()
    }
  }, [enabled, subscribe, unsubscribe])

  // Handle visibility change - pause/resume subscriptions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && enabled) {
        if (connectionState === "disconnected") {
          reconnect()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [enabled, connectionState, reconnect])

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (enabled && connectionState === "disconnected") {
        reconnect()
      }
    }

    const handleOffline = () => {
      setConnectionState("disconnected")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [enabled, connectionState, reconnect])

  return {
    stats,
    connectionState,
    lastUpdated,
    notifications,
    clearNotifications,
    reconnect,
    isSubscribed,
  }
}

// Connection status indicator component helper
export function getConnectionStatusInfo(state: ConnectionState): {
  color: string
  bgColor: string
  label: string
  pulse: boolean
} {
  switch (state) {
    case "connected":
      return {
        color: "text-green-600",
        bgColor: "bg-green-500",
        label: "Live",
        pulse: true,
      }
    case "connecting":
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
        label: "Connecting...",
        pulse: true,
      }
    case "reconnecting":
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-500",
        label: "Reconnecting...",
        pulse: true,
      }
    case "disconnected":
    default:
      return {
        color: "text-slate-400",
        bgColor: "bg-slate-400",
        label: "Offline",
        pulse: false,
      }
  }
}

export default useRealtimeDashboard
