"use client"

import { useEffect, useState, use, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  User,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code,
  Layers,
  Link as LinkIcon,
  Flag,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { ConversationThread } from "@/components/admin/support/ConversationThread"
import { AdminMessageReply } from "@/components/admin/support/AdminMessageReply"
import { AISuggestions } from "@/components/admin/support/AISuggestions"
import { CannedResponses } from "@/components/admin/support/CannedResponses"

interface TechStack {
  framework?: string
  language?: string
  pos?: string
  cms?: string
}

interface IntegrationContext {
  widgetInstalled?: boolean
  apiKeyGenerated?: boolean
  webhookConfigured?: boolean
  posConnected?: boolean
  lastError?: string
  currentStep?: string
}

interface Partner {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  businessType: string
  status: string
  integrationType: string
}

interface Conversation {
  id: string
  partnerId: string | null
  partnerEmail: string | null
  partnerName: string | null
  sessionId: string
  pageUrl: string | null
  onboardingStep: number | null
  topic: string | null
  techStack: TechStack | null
  integrationContext: IntegrationContext | null
  status: string
  priority: string
  escalatedAt: string | null
  escalatedTo: string | null
  escalatedToUser?: { id: string; name: string; email: string } | null
  escalationReason: string | null
  resolution: string | null
  resolvedAt: string | null
  helpfulRating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  partner: Partner | null
}

interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  contentType: "text" | "code" | "error" | "action"
  codeSnippet?: string | null
  codeLanguage?: string | null
  toolsUsed?: string[] | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  active: { label: "Active", color: "text-blue-700", bgColor: "bg-blue-100", icon: MessageCircle },
  resolved: { label: "Resolved", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 },
  escalated: { label: "Escalated", color: "text-orange-700", bgColor: "bg-orange-100", icon: AlertTriangle },
  abandoned: { label: "Abandoned", color: "text-slate-700", bgColor: "bg-slate-100", icon: XCircle },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-slate-100 text-slate-600" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" },
}

const topicLabels: Record<string, string> = {
  onboarding: "Onboarding Help",
  widget_install: "Widget Installation",
  api_integration: "API Integration",
  pos_setup: "POS Setup",
  troubleshooting: "Troubleshooting",
}

function formatDate(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateTime(date: string | null): string {
  if (!date) return "-"
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function ConversationDetailPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const resolvedParams = use(params)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [resolution, setResolution] = useState("")
  const [escalationReason, setEscalationReason] = useState("")
  const [showAIPanel, setShowAIPanel] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [replyCodeSnippet, setReplyCodeSnippet] = useState("")
  const [replyCodeLanguage, setReplyCodeLanguage] = useState("typescript")
  const replyRef = useRef<{ setContent: (content: string, code?: string, lang?: string) => void } | null>(null)

  // Handler for inserting AI suggestions or canned responses
  const handleInsertSuggestion = useCallback((content: string, codeSnippet?: string, codeLanguage?: string) => {
    setReplyContent(content)
    if (codeSnippet) {
      setReplyCodeSnippet(codeSnippet)
      setReplyCodeLanguage(codeLanguage || "typescript")
    }
    // Scroll to reply section
    document.getElementById("reply-section")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const fetchConversation = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/support/conversations/${resolvedParams.conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data.data.conversation)
        setMessages(data.data.messages)
        if (data.data.conversation.resolution) {
          setResolution(data.data.conversation.resolution)
        }
        if (data.data.conversation.escalationReason) {
          setEscalationReason(data.data.conversation.escalationReason)
        }
      }
    } catch (err) {
      console.error("Error fetching conversation:", err)
    } finally {
      setIsLoading(false)
    }
  }, [resolvedParams.conversationId])

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  async function handleStatusChange(newStatus: string, additionalData?: Record<string, any>) {
    if (!conversation) return
    setIsUpdating(true)

    try {
      const payload: Record<string, any> = { status: newStatus, ...additionalData }

      if (newStatus === "resolved" && resolution) {
        payload.resolution = resolution
      }

      if (newStatus === "escalated" && escalationReason) {
        payload.escalationReason = escalationReason
      }

      const response = await fetch(`/api/admin/support/conversations/${conversation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setConversation({ ...conversation, ...data.data })
      }
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl" />
            <div className="h-96 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Conversation not found</p>
          <Link
            href="/admin/support"
            className="inline-flex items-center gap-2 mt-4 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to support
          </Link>
        </div>
      </div>
    )
  }

  const status = statusConfig[conversation.status] || statusConfig.active
  const StatusIcon = status.icon
  const priority = priorityConfig[conversation.priority] || priorityConfig.normal

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to support conversations
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {conversation.partnerName || conversation.partnerEmail || "Anonymous User"}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.color}`}>
                {priority.label}
              </span>
            </div>
            <p className="text-slate-600 mt-1">
              {topicLabels[conversation.topic || ""] || conversation.topic || "General Support"} • Started {formatDateTime(conversation.createdAt)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Conversation</h2>
            <div className="max-h-[500px] overflow-y-auto pr-2">
              <ConversationThread messages={messages} />
            </div>
          </div>

          {/* AI Suggestions & Canned Responses Panel */}
          {conversation.status === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="space-y-4"
            >
              {/* Toggle Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <h2 className="text-lg font-bold text-slate-900">Response Assistance</h2>
                </div>
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {showAIPanel ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show
                    </>
                  )}
                </button>
              </div>

              {showAIPanel && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* AI Suggestions */}
                  <AISuggestions
                    conversationId={conversation.id}
                    messages={messages}
                    topic={conversation.topic}
                    techStack={conversation.techStack}
                    integrationContext={conversation.integrationContext}
                    onInsertSuggestion={handleInsertSuggestion}
                  />

                  {/* Canned Responses */}
                  <CannedResponses
                    onInsertResponse={handleInsertSuggestion}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Reply Section */}
          {conversation.status === "active" && (
            <motion.div
              id="reply-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">Reply</h2>
              <AdminMessageReply
                conversationId={conversation.id}
                onMessageSent={() => {
                  setReplyContent("")
                  setReplyCodeSnippet("")
                  fetchConversation()
                }}
                initialContent={replyContent}
                initialCodeSnippet={replyCodeSnippet}
                initialCodeLanguage={replyCodeLanguage}
                onContentChange={setReplyContent}
                onCodeChange={(code, lang) => {
                  setReplyCodeSnippet(code)
                  if (lang) setReplyCodeLanguage(lang)
                }}
              />
            </motion.div>
          )}

          {/* Resolution/Escalation Display */}
          {conversation.status === "resolved" && conversation.resolution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Resolution</h3>
              </div>
              <p className="text-green-700">{conversation.resolution}</p>
              <p className="text-sm text-green-600 mt-2">
                Resolved on {formatDateTime(conversation.resolvedAt)}
              </p>
            </motion.div>
          )}

          {conversation.status === "escalated" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-orange-50 border border-orange-100 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Escalation</h3>
              </div>
              {conversation.escalationReason && (
                <p className="text-orange-700 mb-2">{conversation.escalationReason}</p>
              )}
              <p className="text-sm text-orange-600">
                Escalated on {formatDateTime(conversation.escalatedAt)}
                {conversation.escalatedToUser && (
                  <> to {conversation.escalatedToUser.name || conversation.escalatedToUser.email}</>
                )}
              </p>
            </motion.div>
          )}

          {/* Feedback Display */}
          {conversation.helpfulRating !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-slate-800 mb-3">Partner Feedback</h3>
              <div className="flex items-center gap-2">
                {conversation.helpfulRating >= 4 ? (
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                )}
                <span className="text-slate-700">
                  {conversation.helpfulRating >= 4 ? "Helpful" : "Not Helpful"}
                </span>
              </div>
              {conversation.feedback && (
                <p className="text-slate-600 mt-2 text-sm">{conversation.feedback}</p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partner Information */}
          {conversation.partner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">Partner Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Business</p>
                    <Link
                      href={`/admin/partners/${conversation.partner.id}`}
                      className="font-medium text-violet-600 hover:text-violet-700"
                    >
                      {conversation.partner.businessName}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="font-medium text-slate-900">{conversation.partner.contactName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a
                      href={`mailto:${conversation.partner.contactEmail}`}
                      className="font-medium text-violet-600 hover:text-violet-700"
                    >
                      {conversation.partner.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Technical Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Technical Context</h2>
            <div className="space-y-3">
              {conversation.techStack && (
                <>
                  {conversation.techStack.framework && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Framework</span>
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {conversation.techStack.framework}
                      </span>
                    </div>
                  )}
                  {conversation.techStack.language && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Language</span>
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {conversation.techStack.language}
                      </span>
                    </div>
                  )}
                  {conversation.techStack.pos && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">POS System</span>
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {conversation.techStack.pos.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </>
              )}
              {conversation.onboardingStep !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Onboarding Step</span>
                  <span className="text-sm font-medium text-slate-900">
                    Step {conversation.onboardingStep}
                  </span>
                </div>
              )}
              {conversation.pageUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Page URL</p>
                  <p className="text-xs font-mono text-slate-600 break-all bg-slate-50 px-2 py-1 rounded">
                    {conversation.pageUrl}
                  </p>
                </div>
              )}
            </div>

            {/* Integration Status */}
            {conversation.integrationContext && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-3">Integration Status</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {conversation.integrationContext.apiKeyGenerated ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-sm text-slate-600">API Key Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conversation.integrationContext.widgetInstalled ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-sm text-slate-600">Widget Installed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conversation.integrationContext.webhookConfigured ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-sm text-slate-600">Webhook Configured</span>
                  </div>
                  {conversation.integrationContext.posConnected !== undefined && (
                    <div className="flex items-center gap-2">
                      {conversation.integrationContext.posConnected ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300" />
                      )}
                      <span className="text-sm text-slate-600">POS Connected</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Actions</h2>

            {conversation.status === "active" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how the issue was resolved..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                  />
                </div>
                <button
                  onClick={() => handleStatusChange("resolved")}
                  disabled={isUpdating || !resolution.trim()}
                  className="w-full px-4 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Resolved
                </button>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Escalation Reason
                  </label>
                  <textarea
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    placeholder="Why does this need human attention?"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                  />
                  <button
                    onClick={() => handleStatusChange("escalated")}
                    disabled={isUpdating || !escalationReason.trim()}
                    className="w-full mt-2 px-4 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Flag className="w-4 h-4 inline mr-2" />
                    Escalate
                  </button>
                </div>
              </div>
            )}

            {conversation.status === "escalated" && (
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Reopen Conversation
                </button>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how the issue was resolved..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                  />
                </div>
                <button
                  onClick={() => handleStatusChange("resolved")}
                  disabled={isUpdating || !resolution.trim()}
                  className="w-full px-4 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Resolved
                </button>
              </div>
            )}

            {conversation.status === "resolved" && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600">This conversation has been resolved</p>
                <button
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                  className="mt-4 px-4 py-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Reopen if needed
                </button>
              </div>
            )}

            {conversation.status === "abandoned" && (
              <div className="text-center py-4">
                <XCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600">This conversation was abandoned</p>
                <button
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                  className="mt-4 px-4 py-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Reopen conversation
                </button>
              </div>
            )}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Conversation Started</p>
                  <p className="text-xs text-slate-500">{formatDateTime(conversation.createdAt)}</p>
                </div>
              </div>
              {conversation.escalatedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Escalated</p>
                    <p className="text-xs text-slate-500">{formatDateTime(conversation.escalatedAt)}</p>
                  </div>
                </div>
              )}
              {conversation.resolvedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Resolved</p>
                    <p className="text-xs text-slate-500">{formatDateTime(conversation.resolvedAt)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Last Updated</p>
                  <p className="text-xs text-slate-500">{formatDateTime(conversation.updatedAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
