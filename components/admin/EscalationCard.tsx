"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  UserPlus,
  Eye,
  Code,
  Wrench,
  HelpCircle,
  Loader2,
} from "lucide-react"
import type { ConversationTopic, ConversationPriority, TechStack } from "@/lib/support/types"

export interface EscalatedConversation {
  id: string
  partnerId?: string
  partnerEmail?: string
  partnerName?: string
  sessionId: string
  topic?: ConversationTopic
  techStack?: TechStack
  priority: ConversationPriority
  escalatedAt: Date
  escalatedTo?: string
  escalationReason?: string
  lastMessage?: string
  lastMessageAt?: Date
  messageCount: number
  createdAt: Date
}

interface EscalationCardProps {
  conversation: EscalatedConversation
  onResolve: (id: string, resolution: string) => Promise<void>
  onReassign: (id: string, assignee: string) => Promise<void>
  onViewDetails: (id: string) => void
  isProcessing?: boolean
}

const priorityConfig: Record<ConversationPriority, {
  label: string
  bgColor: string
  textColor: string
  borderColor: string
  icon: typeof AlertTriangle
}> = {
  urgent: {
    label: "Urgent",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
    icon: AlertTriangle,
  },
  high: {
    label: "High",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800",
    icon: AlertTriangle,
  },
  normal: {
    label: "Medium",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    icon: Clock,
  },
  low: {
    label: "Low",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: HelpCircle,
  },
}

const topicConfig: Record<ConversationTopic, { label: string; icon: typeof Code }> = {
  onboarding: { label: "Onboarding", icon: User },
  widget_install: { label: "Widget Install", icon: Code },
  api_integration: { label: "API Integration", icon: Code },
  pos_setup: { label: "POS Setup", icon: Wrench },
  troubleshooting: { label: "Troubleshooting", icon: Wrench },
}

function getTimeSinceEscalation(escalatedAt: Date): { text: string; isOverdue: boolean; isCritical: boolean } {
  const now = new Date()
  const diffMs = now.getTime() - escalatedAt.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  let text: string
  if (diffMinutes < 60) {
    text = `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    text = `${Math.floor(diffHours)}h ago`
  } else {
    const days = Math.floor(diffHours / 24)
    text = `${days}d ago`
  }

  return {
    text,
    isOverdue: diffHours >= 24,
    isCritical: diffHours >= 48,
  }
}

export function EscalationCard({
  conversation,
  onResolve,
  onReassign,
  onViewDetails,
  isProcessing = false,
}: EscalationCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [resolution, setResolution] = useState("")

  const priorityInfo = priorityConfig[conversation.priority]
  const topicInfo = conversation.topic ? topicConfig[conversation.topic] : null
  const timeInfo = getTimeSinceEscalation(conversation.escalatedAt)
  const PriorityIcon = priorityInfo.icon
  const TopicIcon = topicInfo?.icon || HelpCircle

  const handleResolve = async () => {
    if (!resolution.trim()) return
    setIsResolving(true)
    try {
      await onResolve(conversation.id, resolution)
      setResolution("")
      setShowActions(false)
    } finally {
      setIsResolving(false)
    }
  }

  const displayName = conversation.partnerName || conversation.partnerEmail?.split("@")[0] || "Unknown Partner"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-800 rounded-xl border ${
        timeInfo.isCritical
          ? "border-red-300 dark:border-red-700 ring-2 ring-red-100 dark:ring-red-900/30"
          : timeInfo.isOverdue
          ? "border-orange-200 dark:border-orange-800"
          : "border-slate-200 dark:border-slate-700"
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {displayName[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {displayName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {conversation.partnerEmail || conversation.sessionId.slice(0, 8)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.textColor}`}
            >
              <PriorityIcon className="w-3 h-3" />
              {priorityInfo.label}
            </span>

            {/* Time Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                timeInfo.isCritical
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : timeInfo.isOverdue
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Clock className="w-3 h-3" />
              {timeInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Topic */}
        {topicInfo && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <TopicIcon className="w-4 h-4" />
            <span>{topicInfo.label}</span>
            {conversation.techStack?.framework && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <Code className="w-4 h-4" />
                <span className="capitalize">{conversation.techStack.framework}</span>
              </>
            )}
          </div>
        )}

        {/* Escalation Reason */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Escalation Reason
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {conversation.escalationReason || "No reason provided"}
          </p>
        </div>

        {/* Last Message Preview */}
        {conversation.lastMessage && (
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {conversation.lastMessage}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {conversation.messageCount} messages
          </span>
          {conversation.escalatedTo && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Assigned to: {conversation.escalatedTo}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        {!showActions ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(conversation.id)}
              disabled={isProcessing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => setShowActions(true)}
              disabled={isProcessing}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Quick Actions
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Resolution Note
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowActions(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onReassign(conversation.id, "")}
                disabled={isProcessing || isResolving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                Reassign
              </button>
              <button
                onClick={handleResolve}
                disabled={isProcessing || isResolving || !resolution.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
