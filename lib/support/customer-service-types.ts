// Type definitions for Customer Service Queue functionality

export type QueueSessionStatus = "waiting" | "in_progress" | "completed" | "abandoned"
export type SessionType = "voice" | "screen-share" | "chat"
export type SessionPriority = "low" | "normal" | "high" | "urgent"

// SLA Configuration - thresholds in seconds
export const SLA_CONFIG = {
  // Wait time thresholds before warnings appear
  waitTime: {
    warning: 120,      // 2 minutes - yellow warning
    critical: 300,     // 5 minutes - red critical
    escalate: 600,     // 10 minutes - auto-escalate suggested
  },
  // Session duration targets
  duration: {
    target: 480,       // 8 minutes - target resolution time
    warning: 900,      // 15 minutes - extended session warning
    max: 1800,         // 30 minutes - max recommended session
  },
  // Response time targets
  firstResponse: {
    target: 30,        // 30 seconds - target first response
    warning: 60,       // 1 minute - warning threshold
    critical: 120,     // 2 minutes - critical threshold
  },
} as const

// SLA status types
export type SLAStatus = "good" | "warning" | "critical" | "breached"

export function getSLAStatus(waitTimeSeconds: number): SLAStatus {
  if (waitTimeSeconds >= SLA_CONFIG.waitTime.escalate) return "breached"
  if (waitTimeSeconds >= SLA_CONFIG.waitTime.critical) return "critical"
  if (waitTimeSeconds >= SLA_CONFIG.waitTime.warning) return "warning"
  return "good"
}

export function getSLAColor(status: SLAStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case "breached":
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" }
    case "critical":
      return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
    case "warning":
      return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" }
    case "good":
    default:
      return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" }
  }
}

export const PRIORITY_CONFIG: Record<SessionPriority, {
  label: string
  color: string
  bgColor: string
  sortOrder: number
}> = {
  urgent: {
    label: "Urgent",
    color: "text-red-700",
    bgColor: "bg-red-100",
    sortOrder: 0,
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    sortOrder: 1,
  },
  normal: {
    label: "Normal",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    sortOrder: 2,
  },
  low: {
    label: "Low",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    sortOrder: 3,
  },
}

// Queue item representing a partner waiting for support
export interface QueueItem {
  id: string
  partnerName: string
  contactName: string
  email: string
  businessType: string
  onboardingStep: string | null
  requestReason: string
  priority: SessionPriority
  waitTimeSeconds: number
  waitTimeFormatted: string
  joinedAt: string
  sessionId: string
  pageUrl: string | null
  techStack: {
    framework?: string
    pos?: string
  } | null
  conversationId: string | null
  slaStatus: SLAStatus
}

// Active session with an agent
export interface ActiveSession {
  id: string
  partnerName: string
  contactName: string
  agentId: string
  agentName: string
  sessionType: SessionType
  durationSeconds: number
  durationFormatted: string
  startedAt: string
  conversationId: string | null
  onboardingStep: string | null
  pageUrl: string | null
}

// Completed session history
export interface SessionHistory {
  id: string
  partnerName: string
  contactName: string
  email: string
  agentName: string | null
  sessionType: SessionType
  durationSeconds: number
  durationFormatted: string
  waitTimeSeconds: number
  resolution: string | null
  rating: number | null
  recordingUrl: string | null
  startedAt: string
  completedAt: string
  conversationId: string | null
}

// Dashboard statistics
export interface CustomerServiceStats {
  waiting: number
  inProgress: number
  completedToday: number
  avgWaitTimeSeconds: number
  avgWaitTimeFormatted: string
  avgDurationSeconds: number
  avgDurationFormatted: string
  slaCompliancePercent: number
  avgRating: number | null
  byPriority: Record<SessionPriority, number>
}

// Agent info for assignments
export interface Agent {
  id: string
  name: string
  email: string
  status: "available" | "busy" | "offline"
  currentSessionCount: number
}

// API Response types
export interface QueueResponse {
  queue: QueueItem[]
  stats: CustomerServiceStats
  agents: Agent[]
}

export interface ActiveSessionsResponse {
  sessions: ActiveSession[]
  agents: Agent[]
}

export interface SessionHistoryResponse {
  sessions: SessionHistory[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Realtime event types
export interface QueueUpdateEvent {
  type: "INSERT" | "UPDATE" | "DELETE"
  item: QueueItem | null
  id: string
}

export interface SessionUpdateEvent {
  type: "INSERT" | "UPDATE" | "DELETE"
  session: ActiveSession | null
  id: string
}

export interface StatsUpdateEvent {
  stats: CustomerServiceStats
}

// Helper functions
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function parseWaitTime(waitTimeStr: string): number {
  // Parse "4:23" format to seconds
  const parts = waitTimeStr.split(":")
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }
  return 0
}

export function sortQueueByPriority(queue: QueueItem[]): QueueItem[] {
  return [...queue].sort((a, b) => {
    // First sort by priority (urgent first)
    const priorityDiff = PRIORITY_CONFIG[a.priority].sortOrder - PRIORITY_CONFIG[b.priority].sortOrder
    if (priorityDiff !== 0) return priorityDiff

    // Then by wait time (longest first)
    return b.waitTimeSeconds - a.waitTimeSeconds
  })
}
