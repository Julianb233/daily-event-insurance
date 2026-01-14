"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  User,
  Building2,
  Code,
  Wrench,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Conversation {
  id: string
  partnerName: string | null
  partnerEmail: string | null
  partnerId: string | null
  sessionId: string
  topic: string | null
  status: "active" | "resolved" | "escalated" | "abandoned"
  priority: "low" | "normal" | "high" | "urgent"
  messageCount: number
  lastMessageAt: string
  createdAt: string
  onboardingStep: number | null
  techStack: string | null
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect?: (conversation: Conversation) => void
  isLoading?: boolean
}

const statusConfig = {
  active: { label: "Active", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: MessageSquare },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  escalated: { label: "Escalated", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
  abandoned: { label: "Abandoned", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", icon: XCircle },
}

const priorityConfig = {
  low: { label: "Low", color: "text-slate-500" },
  normal: { label: "Normal", color: "text-blue-500" },
  high: { label: "High", color: "text-orange-500" },
  urgent: { label: "Urgent", color: "text-red-500" },
}

const topicConfig: Record<string, { label: string; icon: typeof Code }> = {
  onboarding: { label: "Onboarding", icon: HelpCircle },
  widget_install: { label: "Widget Install", icon: Code },
  api_integration: { label: "API Integration", icon: Code },
  pos_setup: { label: "POS Setup", icon: Wrench },
  troubleshooting: { label: "Troubleshooting", icon: Wrench },
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      (conv.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (conv.partnerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      conv.sessionId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    const matchesPriority = priorityFilter === "all" || conv.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="abandoned">Abandoned</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filteredConversations.length} conversation{filteredConversations.length !== 1 ? "s" : ""}
      </p>

      {/* Conversation Cards */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">No conversations found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => {
            const status = statusConfig[conv.status]
            const priority = priorityConfig[conv.priority]
            const topic = conv.topic ? topicConfig[conv.topic] : null
            const StatusIcon = status.icon
            const TopicIcon = topic?.icon || HelpCircle

            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <Link
                  href={`/admin/support/${conv.id}`}
                  className={cn(
                    "block p-4 rounded-xl border transition-all",
                    selectedId === conv.id
                      ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md"
                  )}
                  onClick={() => onSelect?.(conv)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {conv.priority !== "normal" && (
                          <span className={`text-xs font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                        )}
                      </div>

                      {/* Partner Info */}
                      <div className="flex items-center gap-2 mb-1">
                        {conv.partnerName ? (
                          <>
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {conv.partnerName}
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {conv.partnerEmail || `Session ${conv.sessionId.slice(0, 8)}...`}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Topic and Step */}
                      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        {topic && (
                          <span className="flex items-center gap-1">
                            <TopicIcon className="w-3.5 h-3.5" />
                            {topic.label}
                          </span>
                        )}
                        {conv.onboardingStep && (
                          <span>Step {conv.onboardingStep}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {conv.messageCount}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(conv.lastMessageAt || conv.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
