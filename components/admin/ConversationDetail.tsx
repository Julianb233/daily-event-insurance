"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Bot,
  Shield,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Globe,
  Code,
  Layers,
  ExternalLink,
  RefreshCw,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminReplyForm } from "./AdminReplyForm"
import { CodeSnippetDisplay } from "@/components/support/CodeSnippetDisplay"
import { updateConversationStatus, getConversation } from "@/lib/actions/admin-support"
import type { ConversationDetail, ConversationMessage } from "@/lib/actions/admin-support"
import { cn } from "@/lib/utils"

interface ConversationDetailProps {
  conversation: ConversationDetail
}

// Status configuration
const statusConfig = {
  active: {
    label: "Active",
    icon: MessageSquare,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  escalated: {
    label: "Escalated",
    icon: AlertTriangle,
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  abandoned: {
    label: "Abandoned",
    icon: XCircle,
    bgColor: "bg-slate-100 dark:bg-slate-800",
    textColor: "text-slate-600 dark:text-slate-400",
    borderColor: "border-slate-200 dark:border-slate-700",
  },
}

// Priority configuration
const priorityConfig = {
  low: { label: "Low", color: "text-slate-500 dark:text-slate-400", bgColor: "bg-slate-100 dark:bg-slate-800" },
  normal: { label: "Normal", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  high: { label: "High", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  urgent: { label: "Urgent", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
}

// Topic labels
const topicLabels: Record<string, string> = {
  onboarding: "Onboarding",
  widget_install: "Widget Install",
  api_integration: "API Integration",
  pos_setup: "POS Setup",
  troubleshooting: "Troubleshooting",
}

// Integration status labels
const integrationStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-slate-500" },
  configured: { label: "Configured", color: "text-blue-500" },
  testing: { label: "Testing", color: "text-amber-500" },
  live: { label: "Live", color: "text-emerald-500" },
  failed: { label: "Failed", color: "text-red-500" },
}

function formatTime(timestamp: string | Date): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

function formatTimeAgo(timestamp: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isAssistant = message.role === "assistant"

  const getRoleIcon = () => {
    if (isUser) return <User className="w-4 h-4" />
    if (isSystem) return <Shield className="w-4 h-4" />
    return <Bot className="w-4 h-4" />
  }

  const getRoleLabel = () => {
    if (isUser) return "Partner"
    if (isSystem) return "Admin"
    return "AI Assistant"
  }

  const getBubbleStyles = () => {
    if (isUser) {
      return "bg-teal-600 text-white ml-auto"
    }
    if (isSystem) {
      return "bg-violet-600 text-white ml-auto"
    }
    return "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
  }

  return (
    <div className={cn("flex flex-col max-w-[80%]", isUser || isSystem ? "ml-auto items-end" : "items-start")}>
      {/* Role Label */}
      <div className={cn("flex items-center gap-1.5 mb-1 text-xs", isUser || isSystem ? "flex-row-reverse" : "")}>
        <span className={cn(
          "flex items-center justify-center w-5 h-5 rounded-full",
          isUser ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" : "",
          isSystem ? "bg-violet-500/20 text-violet-600 dark:text-violet-400" : "",
          isAssistant ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400" : ""
        )}>
          {getRoleIcon()}
        </span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">{getRoleLabel()}</span>
        <span className="text-slate-400 dark:text-slate-500">{formatTime(message.createdAt)}</span>
      </div>

      {/* Message Content */}
      <div className={cn("rounded-2xl px-4 py-3", getBubbleStyles())}>
        {/* Error indicator for error content type */}
        {message.contentType === "error" && (
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Error Reported</span>
          </div>
        )}

        {/* Action indicator */}
        {message.contentType === "action" && (
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Action Completed</span>
          </div>
        )}

        {/* Message text */}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {/* Code snippet if present */}
        {message.codeSnippet && message.codeLanguage && (
          <div className="mt-3">
            <CodeSnippetDisplay
              code={message.codeSnippet}
              language={message.codeLanguage}
            />
          </div>
        )}

        {/* Code snippet without language (error messages) */}
        {message.codeSnippet && !message.codeLanguage && (
          <div className="mt-2 p-2 bg-red-900/30 rounded-lg font-mono text-xs text-red-300 overflow-x-auto">
            {message.codeSnippet}
          </div>
        )}

        {/* Tools used indicator */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
            {message.toolsUsed.map((tool, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/70"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConversationDetail({ conversation: initialConversation }: ConversationDetailProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversation, setConversation] = useState(initialConversation)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [resolutionNote, setResolutionNote] = useState("")
  const [escalationReason, setEscalationReason] = useState("")
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)

  const status = statusConfig[conversation.status]
  const StatusIcon = status.icon
  const priority = priorityConfig[conversation.priority]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  // Refresh conversation data
  const handleRefresh = async () => {
    const result = await getConversation(conversation.id)
    if (result.success && result.data) {
      setConversation(result.data)
    }
  }

  // Handle status update
  const handleStatusUpdate = async (newStatus: "active" | "resolved" | "escalated" | "abandoned") => {
    if (newStatus === "resolved") {
      setShowResolveModal(true)
      setShowStatusMenu(false)
      return
    }

    if (newStatus === "escalated") {
      setShowEscalateModal(true)
      setShowStatusMenu(false)
      return
    }

    setIsUpdating(true)
    try {
      const result = await updateConversationStatus(conversation.id, newStatus)
      if (result.success) {
        await handleRefresh()
      }
    } finally {
      setIsUpdating(false)
      setShowStatusMenu(false)
    }
  }

  // Handle resolve with note
  const handleResolve = async () => {
    setIsUpdating(true)
    try {
      const result = await updateConversationStatus(conversation.id, "resolved", {
        resolution: resolutionNote || undefined,
      })
      if (result.success) {
        await handleRefresh()
        setShowResolveModal(false)
        setResolutionNote("")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle escalate with reason
  const handleEscalate = async () => {
    setIsUpdating(true)
    try {
      const result = await updateConversationStatus(conversation.id, "escalated", {
        escalationReason: escalationReason || undefined,
      })
      if (result.success) {
        await handleRefresh()
        setShowEscalateModal(false)
        setEscalationReason("")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] lg:h-screen">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/support"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {conversation.partnerName || conversation.partnerEmail || "Anonymous User"}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {conversation.topic && (
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.bgColor, status.textColor)}>
                      {topicLabels[conversation.topic] || conversation.topic}
                    </span>
                  )}
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Started {formatTimeAgo(conversation.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Priority Badge */}
              <span className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", priority.bgColor, priority.color)}>
                {priority.label} Priority
              </span>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={isUpdating}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                    status.bgColor,
                    status.textColor,
                    status.borderColor,
                    isUpdating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showStatusMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handleStatusUpdate(key as any)}
                        disabled={conversation.status === key}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors",
                          conversation.status === key
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
          {/* Date separator */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
              {formatDate(conversation.createdAt)}
            </span>
          </div>

          {/* Messages */}
          {conversation.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}

          {/* Resolution Note */}
          {conversation.status === "resolved" && conversation.resolution && (
            <div className="flex justify-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-4 py-3 max-w-md text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Resolved</span>
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">{conversation.resolution}</p>
              </div>
            </div>
          )}

          {/* Escalation Note */}
          {conversation.status === "escalated" && conversation.escalationReason && (
            <div className="flex justify-center">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 max-w-md text-center">
                <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Escalated</span>
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-300">{conversation.escalationReason}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reply Form */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 lg:p-6">
          <AdminReplyForm
            conversationId={conversation.id}
            onMessageSent={handleRefresh}
            disabled={conversation.status === "resolved" || conversation.status === "abandoned"}
          />
        </div>
      </div>

      {/* Sidebar - Partner Info */}
      <div className="w-full lg:w-80 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Partner Info Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Partner Information</h3>
            <div className="space-y-3">
              {conversation.partnerBusinessName && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {conversation.partnerBusinessName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Business Name</p>
                  </div>
                </div>
              )}

              {conversation.partnerEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {conversation.partnerEmail}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                  </div>
                </div>
              )}

              {conversation.partnerInfo?.integrationStatus && (
                <div className="flex items-start gap-3">
                  <Layers className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      integrationStatusLabels[conversation.partnerInfo.integrationStatus]?.color || "text-slate-900 dark:text-white"
                    )}>
                      {integrationStatusLabels[conversation.partnerInfo.integrationStatus]?.label || conversation.partnerInfo.integrationStatus}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Integration Status</p>
                  </div>
                </div>
              )}

              {conversation.onboardingStep && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Step {conversation.onboardingStep}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Onboarding Progress</p>
                  </div>
                </div>
              )}

              {conversation.pageUrl && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                      {conversation.pageUrl}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Current Page</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Section */}
          {conversation.techStack && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Tech Stack</h3>
              <div className="space-y-2">
                {conversation.techStack.framework && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Framework</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {conversation.techStack.framework}
                    </span>
                  </div>
                )}
                {conversation.techStack.pos && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">POS System</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {conversation.techStack.pos}
                    </span>
                  </div>
                )}
                {conversation.techStack.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Language</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {conversation.techStack.language}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversation Stats */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Conversation Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {conversation.messages.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Messages</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {conversation.messages.filter(m => m.role === "user").length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">User Msgs</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          {conversation.helpfulRating && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">User Rating</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn(
                      "text-lg",
                      star <= conversation.helpfulRating! ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
                    )}
                  >
                    *
                  </span>
                ))}
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                  {conversation.helpfulRating}/5
                </span>
              </div>
              {conversation.feedback && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  &ldquo;{conversation.feedback}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* View Partner Profile Link */}
          {conversation.partnerId && (
            <Link
              href={`/admin/partners/${conversation.partnerId}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              View Full Partner Profile
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resolve Conversation</h3>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add a resolution note (optional)..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                {isUpdating ? "Resolving..." : "Mark as Resolved"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Escalate Conversation</h3>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Reason for escalation (optional)..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                {isUpdating ? "Escalating..." : "Escalate"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
