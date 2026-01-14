"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  Clock,
  User,
  MessageSquare,
  ExternalLink,
  UserPlus,
  RefreshCw,
  Zap,
  AlertCircle,
  CheckCircle2,
  Code,
  HelpCircle,
} from "lucide-react"
import {
  PRIORITY_CONFIG,
  type EscalatedConversation,
  type EscalationPriority,
  type EscalationSummary,
  type TeamMember,
} from "@/lib/support/escalation-types"

interface EscalationQueueProps {
  onViewConversation?: (id: string) => void
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return `${diffDays}d ago`
  }
}

function getTopicIcon(topic: string | null) {
  switch (topic) {
    case "widget_install":
      return Code
    case "api_integration":
      return Code
    case "pos_setup":
      return ExternalLink
    case "troubleshooting":
      return AlertCircle
    case "onboarding":
      return HelpCircle
    default:
      return MessageSquare
  }
}

function getTopicLabel(topic: string | null): string {
  switch (topic) {
    case "widget_install":
      return "Widget Install"
    case "api_integration":
      return "API Integration"
    case "pos_setup":
      return "POS Setup"
    case "troubleshooting":
      return "Troubleshooting"
    case "onboarding":
      return "Onboarding"
    default:
      return "General"
  }
}

function getReasonLabel(reason: string | null): string {
  if (!reason) return "Unknown"
  const reasonPart = reason.split(":")[0]
  switch (reasonPart) {
    case "technical_issue":
      return "Technical Issue"
    case "billing_dispute":
      return "Billing Dispute"
    case "account_problem":
      return "Account Problem"
    case "integration_failure":
      return "Integration Failure"
    case "security_concern":
      return "Security Concern"
    case "compliance_issue":
      return "Compliance Issue"
    case "custom":
      return "Other"
    default:
      return reasonPart
  }
}

export function EscalationQueue({ onViewConversation }: EscalationQueueProps) {
  const [escalations, setEscalations] = useState<EscalatedConversation[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [summary, setSummary] = useState<EscalationSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [assignedFilter, setAssignedFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Assignment modal
  const [assigningId, setAssigningId] = useState<string | null>(null)

  const fetchEscalations = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true)
      setError(null)

      const params = new URLSearchParams()
      if (priorityFilter !== "all") params.set("priority", priorityFilter)
      if (assignedFilter !== "all") params.set("assigned", assignedFilter)

      const response = await fetch(`/api/admin/support/escalations?${params}`)
      if (!response.ok) throw new Error("Failed to fetch escalations")

      const result = await response.json()
      setEscalations(result.data?.data || result.data || [])
      setTeamMembers(result.data?.teamMembers || [])
      setSummary(result.data?.summary || null)
    } catch (err) {
      console.error("Error fetching escalations:", err)
      setError("Failed to load escalations")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [priorityFilter, assignedFilter])

  useEffect(() => {
    fetchEscalations()
  }, [fetchEscalations])

  const handleAssign = async (escalationId: string, teamMemberId: string) => {
    try {
      const response = await fetch("/api/admin/support/escalations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: escalationId, assignTo: teamMemberId }),
      })

      if (!response.ok) throw new Error("Failed to assign escalation")

      const result = await response.json()

      // Update local state
      setEscalations(prev =>
        prev.map(e =>
          e.id === escalationId
            ? {
                ...e,
                escalatedTo: teamMemberId,
                escalatedToName: teamMembers.find(m => m.id === teamMemberId)?.name || null,
              }
            : e
        )
      )

      setAssigningId(null)
    } catch (err) {
      console.error("Error assigning escalation:", err)
    }
  }

  // Filter escalations by search
  const filteredEscalations = escalations.filter(e => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      e.partnerName?.toLowerCase().includes(query) ||
      e.partnerEmail?.toLowerCase().includes(query) ||
      e.escalationReason?.toLowerCase().includes(query) ||
      e.topic?.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            Escalation Queue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Support tickets requiring dev team attention
          </p>
        </div>
        <button
          onClick={() => fetchEscalations(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-600 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Urgent</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {summary.byPriority.urgent}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">High</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {summary.byPriority.high}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Unassigned</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.unassigned}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.total}</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by partner, email, or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="appearance-none pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="appearance-none pl-12 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all cursor-pointer"
          >
            <option value="all">All Tickets</option>
            <option value="false">Unassigned</option>
            <option value="true">Assigned</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Escalation List */}
      <div className="space-y-4">
        {filteredEscalations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-100 dark:border-slate-700 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Queue is Clear
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              No escalated tickets at this time. Great job!
            </p>
          </motion.div>
        ) : (
          filteredEscalations.map((escalation, index) => {
            const priorityConfig = PRIORITY_CONFIG[escalation.priority as EscalationPriority]
            const TopicIcon = getTopicIcon(escalation.topic)

            return (
              <motion.div
                key={escalation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.03 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Priority Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.color}`}
                      >
                        {escalation.priority === "urgent" && <Zap className="w-3 h-3" />}
                        {escalation.priority === "high" && <AlertTriangle className="w-3 h-3" />}
                        {priorityConfig.label}
                      </span>

                      {/* Topic Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <TopicIcon className="w-3 h-3" />
                        {getTopicLabel(escalation.topic)}
                      </span>

                      {/* Time Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(escalation.escalatedAt)}
                      </span>
                    </div>

                    {/* Partner Info */}
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                      {escalation.partnerName || "Unknown Partner"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {escalation.partnerEmail}
                    </p>

                    {/* Reason */}
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-medium">Reason:</span>{" "}
                        {getReasonLabel(escalation.escalationReason)}
                      </p>
                      {escalation.escalationReason?.includes(":") && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {escalation.escalationReason.split(":").slice(1).join(":").trim()}
                        </p>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      {escalation.messageCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {escalation.messageCount} messages
                        </span>
                      )}
                      {escalation.pageUrl && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          {escalation.pageUrl}
                        </span>
                      )}
                      {escalation.onboardingStep && (
                        <span className="flex items-center gap-1">
                          Step {escalation.onboardingStep}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[180px]">
                    {/* Assigned To */}
                    {escalation.escalatedTo ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          {escalation.escalatedToName || "Assigned"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <UserPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                          Unassigned
                        </span>
                      </div>
                    )}

                    {/* Assignment Dropdown */}
                    <div className="relative">
                      {assigningId === escalation.id ? (
                        <div className="absolute right-0 top-0 z-10 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 p-2">
                          <p className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                            Assign to
                          </p>
                          {teamMembers.map((member) => (
                            <button
                              key={member.id}
                              onClick={() => handleAssign(escalation.id, member.id)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                            >
                              {member.name}
                            </button>
                          ))}
                          <button
                            onClick={() => setAssigningId(null)}
                            className="w-full px-3 py-2 mt-1 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningId(escalation.id)}
                          className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                        >
                          {escalation.escalatedTo ? "Reassign" : "Assign"}
                        </button>
                      )}
                    </div>

                    {/* View Button */}
                    {onViewConversation && (
                      <button
                        onClick={() => onViewConversation(escalation.id)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
