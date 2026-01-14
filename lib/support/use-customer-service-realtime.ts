"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import {
  type QueueItem,
  type ActiveSession,
  type CustomerServiceStats,
  type Agent,
  type SessionPriority,
  formatDuration,
  getSLAStatus,
  sortQueueByPriority,
} from "./customer-service-types"

interface UseCustomerServiceRealtimeOptions {
  onQueueUpdate?: (queue: QueueItem[]) => void
  onSessionUpdate?: (sessions: ActiveSession[]) => void
  onStatsUpdate?: (stats: CustomerServiceStats) => void
  onError?: (error: Error) => void
}

interface UseCustomerServiceRealtimeReturn {
  queue: QueueItem[]
  activeSessions: ActiveSession[]
  stats: CustomerServiceStats | null
  agents: Agent[]
  isLoading: boolean
  isConnected: boolean
  error: Error | null
  refresh: () => Promise<void>
  assignAgent: (queueItemId: string, agentId?: string) => Promise<boolean>
  endSession: (sessionId: string, resolution?: string) => Promise<boolean>
}

const CHANNEL_NAME = "customer-service-queue"

export function useCustomerServiceRealtime(
  options: UseCustomerServiceRealtimeOptions = {}
): UseCustomerServiceRealtimeReturn {
  const { onQueueUpdate, onSessionUpdate, onStatsUpdate, onError } = options

  const [queue, setQueue] = useState<QueueItem[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [stats, setStats] = useState<CustomerServiceStats | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createClient())
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch initial data and refresh
  const fetchData = useCallback(async () => {
    try {
      const [queueRes, sessionsRes] = await Promise.all([
        fetch("/api/admin/customer-service/queue"),
        fetch("/api/admin/customer-service/sessions"),
      ])

      if (!queueRes.ok) throw new Error("Failed to fetch queue")

      const queueData = await queueRes.json()

      if (queueData.success) {
        const sortedQueue = sortQueueByPriority(queueData.data.queue || [])
        setQueue(sortedQueue)
        setStats(queueData.data.stats || null)
        setAgents(queueData.data.agents || [])
        onQueueUpdate?.(sortedQueue)
        if (queueData.data.stats) {
          onStatsUpdate?.(queueData.data.stats)
        }
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        if (sessionsData.success) {
          setActiveSessions(sessionsData.data.sessions || [])
          onSessionUpdate?.(sessionsData.data.sessions || [])
        }
      }

      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error")
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [onQueueUpdate, onSessionUpdate, onStatsUpdate, onError])

  // Update wait times locally (every second for smooth UX)
  const updateWaitTimes = useCallback(() => {
    setQueue((prevQueue) => {
      const now = Date.now()
      return prevQueue.map((item) => {
        const waitTimeSeconds = Math.floor((now - new Date(item.joinedAt).getTime()) / 1000)
        return {
          ...item,
          waitTimeSeconds,
          waitTimeFormatted: formatDuration(waitTimeSeconds),
          slaStatus: getSLAStatus(waitTimeSeconds),
        }
      })
    })

    setActiveSessions((prevSessions) => {
      const now = Date.now()
      return prevSessions.map((session) => {
        const durationSeconds = Math.floor((now - new Date(session.startedAt).getTime()) / 1000)
        return {
          ...session,
          durationSeconds,
          durationFormatted: formatDuration(durationSeconds),
        }
      })
    })
  }, [])

  // Subscribe to realtime changes
  useEffect(() => {
    const supabase = supabaseRef.current

    // Initial fetch
    fetchData()

    // Set up realtime subscription
    channelRef.current = supabase
      .channel(CHANNEL_NAME)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_conversations",
        },
        (payload) => {
          console.log("[CustomerService] Realtime update:", payload.eventType)

          // Refresh data on any change
          fetchData()
        }
      )
      .subscribe((status) => {
        console.log("[CustomerService] Channel status:", status)
        setIsConnected(status === "SUBSCRIBED")
      })

    // Update wait times every second
    const waitTimeInterval = setInterval(updateWaitTimes, 1000)

    // Refresh full data every 30 seconds as backup
    refreshIntervalRef.current = setInterval(fetchData, 30000)

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      clearInterval(waitTimeInterval)
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [fetchData, updateWaitTimes])

  // Assign agent to queue item
  const assignAgent = useCallback(async (queueItemId: string, agentId?: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/customer-service/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueItemId, agentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign agent")
      }

      const data = await response.json()

      if (data.success) {
        // Optimistic update: remove from queue
        setQueue((prev) => prev.filter((item) => item.id !== queueItemId))
        // Refresh to get accurate state
        await fetchData()
        return true
      }

      return false
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to assign agent")
      setError(error)
      onError?.(error)
      return false
    }
  }, [fetchData, onError])

  // End a session
  const endSession = useCallback(async (sessionId: string, resolution?: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/support/conversations/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "resolved",
          resolution: resolution || "Session completed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to end session")
      }

      const data = await response.json()

      if (data.success) {
        // Optimistic update
        setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId))
        // Refresh to get accurate state
        await fetchData()
        return true
      }

      return false
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to end session")
      setError(error)
      onError?.(error)
      return false
    }
  }, [fetchData, onError])

  return {
    queue,
    activeSessions,
    stats,
    agents,
    isLoading,
    isConnected,
    error,
    refresh: fetchData,
    assignAgent,
    endSession,
  }
}

// Hook for just listening to queue count updates (for header badges etc)
export function useQueueCount(): { count: number; isLoading: boolean } {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel | null = null

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/customer-service/queue")
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setCount(data.data.stats?.waiting || 0)
          }
        }
      } catch {
        // Silently fail for count updates
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()

    channel = supabase
      .channel("queue-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_conversations",
          filter: "status=eq.active",
        },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    const interval = setInterval(fetchCount, 60000)

    return () => {
      if (channel) supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  return { count, isLoading }
}
