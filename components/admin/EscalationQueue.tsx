"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  PhoneForwarded,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Building2,
  Eye,
  UserPlus,
  SortAsc,
  SortDesc,
  Inbox,
  Loader2,
  Code,
  Wrench,
  HelpCircle,
} from "lucide-react"
import type { ConversationTopic, ConversationPriority, TechStack } from "@/lib/support/types"

export interface EscalatedConversation {
  id: string
  partnerId: string | null
  partnerEmail: string | null
  partnerName: string | null
  sessionId: string
  topic: ConversationTopic | string | null
  techStack: TechStack | string | null
  priority: ConversationPriority
  escalatedAt: string | Date
  escalatedTo: string | null
  escalationReason: string | null
  status: string
  createdAt: string | Date
  lastMessage?: string
  lastMessageAt?: string | Date
  messageCount?: number
  // Joined partner data
  partner?: {
    businessName: string
    businessType: string
    contactName: string
    contactEmail: string
  }
}

interface EscalationQueueProps {
  onTakeOver?: (conversationId: string) => void
  initialData?: EscalatedConversation[]
  onRefresh?: () => Promise<void>
  showHeader?: boolean
  maxItems?: number
  onViewDetails?: (id: string) => void
}

// Mock data for development
const mockEscalatedConversations: EscalatedConversation[] = [
  {
    id: "esc-1",
    partnerId: "p-1",
    partnerEmail: "john@peakgym.com",
    partnerName: "John Smith",
    sessionId: "sess-001",
    topic: "api_integration",
    techStack: '{"framework":"react","pos":"mindbody"}',
    priority: "urgent",
    escalatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    escalatedTo: null,
    escalationReason: "Complex API authentication issue requiring developer support",
    status: "escalated",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    partner: {
      businessName: "Peak Performance Gym",
      businessType: "gym",
      contactName: "John Smith",
      contactEmail: "john@peakgym.com",
    },
  },
  {
    id: "esc-2",
    partnerId: "p-2",
    partnerEmail: "sarah@climbhigh.com",
    partnerName: "Sarah Johnson",
    sessionId: "sess-002",
    topic: "widget_install",
    techStack: '{"framework":"wordpress","pos":"none"}',
    priority: "high",
    escalatedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 mins ago
    escalatedTo: null,
    escalationReason: "Widget not loading in WordPress - possibly theme conflict",
    status: "escalated",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    partner: {
      businessName: "Climb High Adventures",
      businessType: "climbing",
      contactName: "Sarah Johnson",
      contactEmail: "sarah@climbhigh.com",
    },
  },
  {
    id: "esc-3",
    partnerId: "p-3",
    partnerEmail: "mike@kayakrentals.com",
    partnerName: "Mike Davis",
    sessionId: "sess-003",
    topic: "pos_setup",
    techStack: '{"framework":"shopify","pos":"square"}',
    priority: "normal",
    escalatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    escalatedTo: null,
    escalationReason: "Square POS sync failing intermittently",
    status: "escalated",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    partner: {
      businessName: "Kayak Rentals Co",
      businessType: "rental",
      contactName: "Mike Davis",
      contactEmail: "mike@kayakrentals.com",
    },
  },
]

function formatTimeSince(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function getPriorityColor(priority: string): { bg: string; text: string; dot: string } {
  switch (priority) {
    case "urgent":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" }
    case "high":
      return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" }
    case "normal":
      return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" }
    case "low":
      return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" }
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" }
  }
}

function getTopicLabel(topic: string | null): string {
  const topics: Record<string, string> = {
    onboarding: "Onboarding",
    widget_install: "Widget Install",
    api_integration: "API Integration",
    pos_setup: "POS Setup",
    troubleshooting: "Troubleshooting",
  }
  return topic ? topics[topic] || topic : "General"
}

type SortOption = "priority" | "time" | "messages"
type SortDirection = "asc" | "desc"

const priorityOrder: Record<ConversationPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
}

export function EscalationQueue({
  onTakeOver,
  initialData,
  onRefresh,
  showHeader = true,
  maxItems,
  onViewDetails,
}: EscalationQueueProps) {
  const [conversations, setConversations] = useState<EscalatedConversation[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [takingOver, setTakingOver] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("priority")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setConversations(initialData)
    } else {
      fetchEscalatedConversations()
    }
  }, [initialData])

  async function fetchEscalatedConversations() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/support/escalations")

      if (!res.ok) {
        // Use mock data if API fails
        setConversations(mockEscalatedConversations)
        return
      }

      const json = await res.json()
      if (json.success && json.data) {
        setConversations(json.data)
      } else {
        setConversations(mockEscalatedConversations)
      }
    } catch (error) {
      console.error("Failed to fetch escalated conversations:", error)
      setConversations(mockEscalatedConversations)
    } finally {
      setLoading(false)
    }
  }

  async function handleTakeOver(conversationId: string) {
    try {
      setTakingOver(conversationId)

      // Call API to assign conversation
      const res = await fetch(`/api/admin/support/escalations/${conversationId}/take-over`, {
        method: "POST",
      })

      if (res.ok) {
        // Remove from queue or update status
        setConversations((prev) =>
          prev.filter((c) => c.id !== conversationId)
        )
        onTakeOver?.(conversationId)
      }
    } catch (error) {
      console.error("Failed to take over conversation:", error)
    } finally {
      setTakingOver(null)
    }
  }

  const handleResolve = useCallback(async (id: string, resolution: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))
    try {
      const response = await fetch(`/api/support/escalations/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      })

      if (!response.ok) throw new Error("Failed to resolve escalation")

      // Remove from list
      setConversations((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve escalation")
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [])

  const handleReassign = useCallback(async (id: string, assignee: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))
    try {
      const response = await fetch(`/api/support/escalations/${id}/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignee }),
      })

      if (!response.ok) throw new Error("Failed to reassign escalation")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reassign escalation")
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [])

  const handleViewDetails = useCallback((id: string) => {
    if (onViewDetails) {
      onViewDetails(id)
    } else {
      window.location.href = `/hiqor/support/conversations/${id}`
    }
  }, [onViewDetails])

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(option)
      setSortDirection("asc")
    }
  }

  // Sort by priority (urgent first) then by time
  const sortedConversations = [...conversations]
    .filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.partner?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.escalationReason?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter
      const matchesTopic = topicFilter === "all" || c.topic === topicFilter
      return matchesSearch && matchesPriority && matchesTopic
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "priority":
          comparison = (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
          // Secondary sort by escalatedAt if same priority
          if (comparison === 0) {
            const aTime = a.escalatedAt instanceof Date ? a.escalatedAt.getTime() : new Date(a.escalatedAt).getTime()
            const bTime = b.escalatedAt instanceof Date ? b.escalatedAt.getTime() : new Date(b.escalatedAt).getTime()
            comparison = aTime - bTime
          }
          break
        case "time":
          const aTimeSort = a.escalatedAt instanceof Date ? a.escalatedAt.getTime() : new Date(a.escalatedAt).getTime()
          const bTimeSort = b.escalatedAt instanceof Date ? b.escalatedAt.getTime() : new Date(b.escalatedAt).getTime()
          comparison = aTimeSort - bTimeSort
          break
        case "messages":
          comparison = (b.messageCount || 0) - (a.messageCount || 0)
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  // Apply max items limit if specified
  const displayConversations = maxItems ? sortedConversations.slice(0, maxItems) : sortedConversations

  const urgentCount = conversations.filter((c) => c.priority === "urgent").length
  const highCount = conversations.filter((c) => c.priority === "high").length

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-600 rounded w-64" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <PhoneForwarded className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Escalation Queue
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {conversations.length} conversations awaiting human support
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchEscalatedConversations()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Alert badges */}
        {(urgentCount > 0 || highCount > 0) && (
          <div className="flex items-center gap-3 mb-4">
            {urgentCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {urgentCount} Urgent
              </div>
            )}
            {highCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                {highCount} High Priority
              </div>
            )}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by partner or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">All Topics</option>
            <option value="onboarding">Onboarding</option>
            <option value="widget_install">Widget Install</option>
            <option value="api_integration">API Integration</option>
            <option value="pos_setup">POS Setup</option>
            <option value="troubleshooting">Troubleshooting</option>
          </select>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
            <button
              onClick={() => toggleSort("priority")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                sortBy === "priority"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Priority
              {sortBy === "priority" && (sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
            </button>
            <button
              onClick={() => toggleSort("time")}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                sortBy === "time"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Time
              {sortBy === "time" && (sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Queue List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        <AnimatePresence>
          {sortedConversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                All caught up!
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                No escalated conversations at the moment
              </p>
            </div>
          ) : (
            sortedConversations.map((conversation, index) => {
              const priorityColors = getPriorityColor(conversation.priority)
              const rawTechStack = conversation.techStack
              const techStack = rawTechStack
                ? typeof rawTechStack === "string"
                  ? JSON.parse(rawTechStack as string)
                  : rawTechStack
                : null

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    conversation.priority === "urgent"
                      ? "bg-red-50/50 dark:bg-red-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Partner Avatar */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          conversation.priority === "urgent"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-violet-100 dark:bg-violet-900/30"
                        }`}
                      >
                        <Building2
                          className={`w-6 h-6 ${
                            conversation.priority === "urgent"
                              ? "text-red-600 dark:text-red-400"
                              : "text-violet-600 dark:text-violet-400"
                          }`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                            {conversation.partner?.businessName ||
                              conversation.partnerName ||
                              "Unknown Partner"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityColors.dot}`} />
                            {conversation.priority.charAt(0).toUpperCase() +
                              conversation.priority.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {conversation.partner?.contactName || conversation.partnerName} -{" "}
                          {conversation.partner?.contactEmail || conversation.partnerEmail}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded">
                            {getTopicLabel(conversation.topic)}
                          </span>
                          {techStack?.framework && (
                            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs rounded">
                              {techStack.framework}
                            </span>
                          )}
                          {techStack?.pos && techStack.pos !== "none" && (
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded">
                              {techStack.pos}
                            </span>
                          )}
                        </div>

                        {/* Escalation Reason */}
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800 dark:text-amber-300">
                            {conversation.escalationReason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time and Action */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatTimeSince(typeof conversation.escalatedAt === 'string' ? conversation.escalatedAt : conversation.escalatedAt?.toISOString() || '')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Escalated
                        </p>
                      </div>

                      <button
                        onClick={() => handleTakeOver(conversation.id)}
                        disabled={takingOver === conversation.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {takingOver === conversation.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        Take Over
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
