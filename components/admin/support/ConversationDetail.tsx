"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Send,
  Loader2,
  User,
  Bot,
  Building2,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  Code,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  contentType: "text" | "code" | "error" | "action"
  codeSnippet?: string | null
  codeLanguage?: string | null
  createdAt: string
}

export interface ConversationDetailData {
  id: string
  partnerId: string | null
  partnerName: string | null
  partnerEmail: string | null
  sessionId: string
  pageUrl: string | null
  onboardingStep: number | null
  topic: string | null
  techStack: string | null
  integrationContext: string | null
  status: "active" | "resolved" | "escalated" | "abandoned"
  priority: "low" | "normal" | "high" | "urgent"
  escalatedAt: string | null
  escalationReason: string | null
  resolution: string | null
  resolvedAt: string | null
  helpfulRating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface PartnerIntegrationStatus {
  integrationType: string
  status: string
  posSystem: string | null
  apiKeyGenerated: boolean
  webhookConfigured: boolean
  lastTestedAt: string | null
  testResult: string | null
}

interface ConversationDetailProps {
  conversation: ConversationDetailData
  partnerIntegration?: PartnerIntegrationStatus | null
  onSendMessage: (message: string) => Promise<void>
  onResolve: () => Promise<void>
  onEscalate: (reason: string) => Promise<void>
  onUpdatePriority: (priority: string) => Promise<void>
  isSending?: boolean
}

const statusConfig = {
  active: { label: "Active", color: "bg-blue-100 text-blue-700", icon: MessageSquare },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  escalated: { label: "Escalated", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  abandoned: { label: "Abandoned", color: "bg-slate-100 text-slate-700", icon: Clock },
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

export function ConversationDetail({
  conversation,
  partnerIntegration,
  onSendMessage,
  onResolve,
  onEscalate,
  onUpdatePriority,
  isSending = false,
}: ConversationDetailProps) {
  const [inputValue, setInputValue] = useState("")
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  const [escalationReason, setEscalationReason] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return
    const message = inputValue.trim()
    setInputValue("")
    await onSendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEscalate = async () => {
    if (!escalationReason.trim()) return
    await onEscalate(escalationReason)
    setShowEscalateModal(false)
    setEscalationReason("")
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const status = statusConfig[conversation.status]
  const StatusIcon = status.icon
  const techStackData = conversation.techStack ? JSON.parse(conversation.techStack) : null

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                {conversation.partnerName ? (
                  <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                ) : (
                  <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  {conversation.partnerName || conversation.partnerEmail || `Session ${conversation.sessionId.slice(0, 8)}`}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                  {conversation.topic && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {conversation.topic.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Priority Selector */}
              <select
                value={conversation.priority}
                onChange={(e) => onUpdatePriority(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Action Buttons */}
              {conversation.status === "active" && (
                <>
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={onResolve}
                    className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Resolve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
          {/* Date Separator */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 text-xs text-slate-500 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              {formatDate(conversation.createdAt)}
            </span>
          </div>

          {conversation.messages.map((message, index) => {
            const isUser = message.role === "user"
            const isSystem = message.role === "system"

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <span className="px-3 py-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {message.content}
                  </span>
                </div>
              )
            }

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <div className={cn("flex gap-2 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isUser ? "bg-teal-100 dark:bg-teal-900/30" : "bg-violet-100 dark:bg-violet-900/30"
                  )}>
                    {isUser ? (
                      <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    )}
                  </div>

                  <div className={cn(
                    "rounded-2xl px-4 py-2",
                    isUser
                      ? "bg-teal-600 text-white rounded-br-md"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md shadow-sm border border-slate-200 dark:border-slate-700"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Code Snippet */}
                    {message.codeSnippet && (
                      <div className="mt-2 relative">
                        <div className="flex items-center justify-between bg-slate-800 dark:bg-slate-950 px-3 py-1 rounded-t-lg">
                          <span className="text-xs text-slate-400">{message.codeLanguage || "code"}</span>
                          <button
                            onClick={() => copyToClipboard(message.codeSnippet!, message.id)}
                            className="text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <pre className="bg-slate-900 dark:bg-slate-950 p-3 rounded-b-lg overflow-x-auto">
                          <code className="text-xs text-slate-300 font-mono">{message.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <p className={cn("text-xs mt-1", isUser ? "text-white/70" : "text-slate-400")}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {conversation.status === "active" && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 placeholder:text-slate-400"
                rows={1}
                disabled={isSending}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                className="p-3 rounded-xl bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-700 transition-colors"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Partner Info */}
      <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto hidden lg:block">
        <div className="p-4 space-y-6">
          {/* Partner Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Partner Information</h3>
            <div className="space-y-2 text-sm">
              {conversation.partnerName && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">{conversation.partnerName}</span>
                </div>
              )}
              {conversation.partnerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">{conversation.partnerEmail}</span>
                </div>
              )}
              {conversation.pageUrl && (
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-slate-400 mt-0.5" />
                  <a
                    href={conversation.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 dark:text-violet-400 hover:underline break-all"
                  >
                    {conversation.pageUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          {techStackData && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(techStackData).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Integration Status */}
          {partnerIntegration && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Integration Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Type</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                    {partnerIntegration.integrationType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                  <span className={cn(
                    "text-sm font-medium capitalize",
                    partnerIntegration.status === "live" ? "text-green-600" :
                    partnerIntegration.status === "failed" ? "text-red-600" :
                    "text-amber-600"
                  )}>
                    {partnerIntegration.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">API Key</span>
                  <span className={cn(
                    "text-sm",
                    partnerIntegration.apiKeyGenerated ? "text-green-600" : "text-slate-400"
                  )}>
                    {partnerIntegration.apiKeyGenerated ? "Generated" : "Not generated"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Webhook</span>
                  <span className={cn(
                    "text-sm",
                    partnerIntegration.webhookConfigured ? "text-green-600" : "text-slate-400"
                  )}>
                    {partnerIntegration.webhookConfigured ? "Configured" : "Not configured"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Session Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Session Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Session ID</span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  {conversation.sessionId.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Started</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {formatDate(conversation.createdAt)}
                </span>
              </div>
              {conversation.onboardingStep && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Onboarding Step</span>
                  <span className="text-slate-700 dark:text-slate-300">{conversation.onboardingStep}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Messages</span>
                <span className="text-slate-700 dark:text-slate-300">{conversation.messages.length}</span>
              </div>
            </div>
          </div>

          {/* Resolution/Escalation Info */}
          {conversation.status === "resolved" && conversation.resolution && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Resolution</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{conversation.resolution}</p>
              {conversation.resolvedAt && (
                <p className="text-xs text-slate-500 mt-2">
                  Resolved on {formatDate(conversation.resolvedAt)}
                </p>
              )}
            </div>
          )}

          {conversation.status === "escalated" && conversation.escalationReason && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Escalation Reason</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{conversation.escalationReason}</p>
              {conversation.escalatedAt && (
                <p className="text-xs text-slate-500 mt-2">
                  Escalated on {formatDate(conversation.escalatedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Escalate Conversation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              This will escalate the conversation to the development team for further assistance.
            </p>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Reason for escalation..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-100 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={!escalationReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Escalate
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
