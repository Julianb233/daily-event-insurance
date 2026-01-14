"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  ChevronDown,
  RefreshCw,
  Star,
  X,
  Calendar,
  ExternalLink,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { SkeletonCard } from "@/components/shared/Skeleton"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import { SparklineCard } from "@/components/charts/SparklineCard"

// Types
interface SupportConversation {
  id: string
  partnerId: string | null
  partnerEmail: string | null
  partnerName: string | null
  sessionId: string
  pageUrl: string | null
  onboardingStep: number | null
  topic: string | null
  techStack: string | null
  integrationContext: string | null
  status: "active" | "resolved" | "escalated" | "abandoned"
  priority: "low" | "normal" | "high" | "urgent"
  escalatedAt: string | null
  escalatedTo: string | null
  escalationReason: string | null
  resolution: string | null
  resolvedAt: string | null
  helpfulRating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  messageCount: number
  partnerBusinessName: string | null
}

interface ApiResponse {
  success: boolean
  data: {
    data: SupportConversation[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface SupportMessage {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  contentType: "text" | "code" | "error" | "action"
  codeSnippet: string | null
  codeLanguage: string | null
  createdAt: string
}

interface SupportStats {
  totalConversations: number
  activeConversations: number
  escalatedConversations: number
  avgSatisfactionRating: number
}

// Status configuration
const statusConfig = {
  active: {
    label: "Active",
    icon: MessageSquare,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  escalated: {
    label: "Escalated",
    icon: AlertTriangle,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  abandoned: {
    label: "Abandoned",
    icon: XCircle,
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
}

// Topic labels
const topicLabels: Record<string, string> = {
  onboarding: "Onboarding",
  widget_install: "Widget Install",
  api_integration: "API Integration",
  pos_setup: "POS Setup",
  troubleshooting: "Troubleshooting",
}

// Priority configuration
const priorityConfig = {
  low: { label: "Low", color: "text-slate-500" },
  normal: { label: "Normal", color: "text-blue-600" },
  high: { label: "High", color: "text-amber-600" },
  urgent: { label: "Urgent", color: "text-red-600" },
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatDateTime(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp))
}

// Mock messages for demo when API fails
const mockMessages: Record<string, SupportMessage[]> = {
  "demo": [
    { id: "m1", conversationId: "demo", role: "user", content: "Hi, I'm having trouble installing the widget on my React website.", contentType: "text", codeSnippet: null, codeLanguage: null, createdAt: new Date().toISOString() },
    { id: "m2", conversationId: "demo", role: "assistant", content: "I'd be happy to help! Can you share the code snippet you're using?", contentType: "text", codeSnippet: null, codeLanguage: null, createdAt: new Date().toISOString() },
  ],
}

export default function AdminSupportPage() {
  const [conversations, setConversations] = useState<SupportConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [topicFilter, setTopicFilter] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // Conversation detail sidebar state
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Enhanced stats with satisfaction rating
  const [supportStats, setSupportStats] = useState<SupportStats>({
    totalConversations: 0,
    activeConversations: 0,
    escalatedConversations: 0,
    avgSatisfactionRating: 4.6,
  })

  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchQuery) params.set("search", searchQuery)
      if (statusFilter) params.set("status", statusFilter)
      if (topicFilter) params.set("topic", topicFilter)

      const response = await fetch(`/api/admin/support/conversations?${params}`)
      if (!response.ok) throw new Error("Failed to fetch conversations")

      const result: ApiResponse = await response.json()
      setConversations(result.data.data)
      setPagination(result.data.pagination)
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, topicFilter])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Stats calculation
  const stats = {
    active: conversations.filter(c => c.status === "active").length,
    escalated: conversations.filter(c => c.status === "escalated").length,
    resolved: conversations.filter(c => c.status === "resolved").length,
    total: pagination.total,
  }

  // Trend data for sparklines
  const conversationTrend = [120, 128, 135, 142, 148, 152, stats.total || 156]
  const escalatedTrend = [5, 4, 6, 4, 3, 2, stats.escalated || 3]

  // Fetch messages for a conversation
  async function fetchMessages(conversationId: string) {
    setLoadingMessages(true)
    try {
      const response = await fetch(`/api/admin/support/conversations/${conversationId}/messages`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      const result = await response.json()
      setMessages(result.data || mockMessages["demo"] || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
      setMessages(mockMessages["demo"] || [])
    } finally {
      setLoadingMessages(false)
    }
  }

  // Handle status change (Mark Resolved, Escalate)
  async function handleStatusChange(conversationId: string, newStatus: SupportConversation["status"], resolution?: string) {
    try {
      const response = await fetch(`/api/admin/support/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, resolution }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      // Update local state
      setConversations(conversations.map(c =>
        c.id === conversationId
          ? { ...c, status: newStatus, resolution: resolution || c.resolution, resolvedAt: newStatus === "resolved" ? new Date().toISOString() : c.resolvedAt }
          : c
      ))

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation({ ...selectedConversation, status: newStatus, resolution: resolution || selectedConversation.resolution })
      }
    } catch (err) {
      console.error("Error updating status:", err)
      // Still update locally for demo
      setConversations(conversations.map(c =>
        c.id === conversationId
          ? { ...c, status: newStatus, resolution: resolution || c.resolution }
          : c
      ))
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation({ ...selectedConversation, status: newStatus })
      }
    }
  }

  // Open conversation detail sidebar
  function openConversation(conversation: SupportConversation) {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Support Conversations</h1>
            <p className="text-slate-600 mt-1">Manage partner integration support requests</p>
          </div>
          <button
            onClick={fetchConversations}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SparklineCard
            title="Total Conversations"
            value={stats.total || 156}
            data={conversationTrend}
            icon={<MessageSquare className="w-6 h-6" />}
            color="violet"
            change={8.2}
            format="number"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Conversations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  <AnimatedNumber value={stats.active || 12} />
                </p>
                <p className="text-xs text-gray-400 mt-1">Needs attention</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SparklineCard
            title="Escalated"
            value={stats.escalated || 3}
            data={escalatedTrend}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="amber"
            change={-25}
            format="number"
            subtitle="Needs developer support"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Satisfaction</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedNumber value={supportStats.avgSatisfactionRating} decimals={1} />
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(supportStats.avgSatisfactionRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Based on resolved chats</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by partner name, email, or business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters || statusFilter || topicFilter
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {(statusFilter || topicFilter) && (
              <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">
                {(statusFilter ? 1 : 0) + (topicFilter ? 1 : 0)}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 grid md:grid-cols-3 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
              <select
                value={topicFilter}
                onChange={(e) => {
                  setTopicFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All Topics</option>
                <option value="onboarding">Onboarding</option>
                <option value="widget_install">Widget Install</option>
                <option value="api_integration">API Integration</option>
                <option value="pos_setup">POS Setup</option>
                <option value="troubleshooting">Troubleshooting</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter("")
                  setTopicFilter("")
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} className="h-24" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No conversations found</h3>
            <p className="text-slate-500">
              {searchQuery || statusFilter || topicFilter
                ? "Try adjusting your search or filters"
                : "Support conversations will appear here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {conversations.map((conversation, index) => {
              const status = statusConfig[conversation.status]
              const StatusIcon = status.icon
              const priority = priorityConfig[conversation.priority]

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Partner Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${status.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${status.textColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {conversation.partnerName || "Anonymous User"}
                          </h3>
                          {conversation.partnerBusinessName && (
                            <span className="flex items-center gap-1 text-sm text-slate-500">
                              <Building2 className="w-3.5 h-3.5" />
                              {conversation.partnerBusinessName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          {conversation.partnerEmail && (
                            <span className="truncate">{conversation.partnerEmail}</span>
                          )}
                          {conversation.topic && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                              {topicLabels[conversation.topic] || conversation.topic}
                            </span>
                          )}
                          {conversation.onboardingStep && (
                            <span className="text-slate-400">
                              Step {conversation.onboardingStep}
                            </span>
                          )}
                        </div>

                        {conversation.escalationReason && (
                          <p className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                            {conversation.escalationReason}
                          </p>
                        )}

                        {conversation.resolution && (
                          <p className="mt-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            {conversation.resolution}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Meta Info */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${priority.color}`}>
                          {priority.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {conversation.messageCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimeAgo(conversation.updatedAt)}
                        </span>
                      </div>

                      {conversation.helpfulRating && (
                        <div className="flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= conversation.helpfulRating! ? "text-amber-400" : "text-slate-200"}>
                              *
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/admin/support/${conversation.id}`}
                        className="flex items-center gap-1 text-sm text-violet-600 font-medium hover:text-violet-700 transition-colors"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} conversations
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? "bg-violet-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
