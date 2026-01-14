"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Bot,
  Building2,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Filter,
  Search,
  UserPlus,
  Shield,
  Tag,
  Code,
  Wifi,
  WifiOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  SupportConversation,
  SupportMessage,
  CustomerContext,
  CannedResponse,
  ConnectionStatus,
  TypingIndicator,
} from "@/lib/support/types"

// Default canned responses for quick replies
const defaultCannedResponses: CannedResponse[] = [
  {
    id: "1",
    title: "Greeting",
    content: "Hi! I'm taking over this conversation. How can I help you today?",
    category: "general",
    tags: ["greeting", "intro"],
    useCount: 0,
  },
  {
    id: "2",
    title: "Widget Installation Help",
    content: "I'd be happy to help with your widget installation. Could you share your website URL and the framework you're using (React, Vue, vanilla JS, etc.)?",
    category: "technical",
    tags: ["widget", "installation"],
    useCount: 0,
  },
  {
    id: "3",
    title: "API Documentation",
    content: "You can find our complete API documentation at docs.example.com/api. The most common endpoints you'll need are:\n\n- POST /api/quotes - Get insurance quotes\n- POST /api/policies - Create a new policy\n- GET /api/policies/:id - Retrieve policy details\n\nWould you like me to walk you through any specific endpoint?",
    category: "technical",
    tags: ["api", "docs"],
    useCount: 0,
  },
  {
    id: "4",
    title: "POS Integration",
    content: "We support integrations with several POS systems including MindBody, Pike13, ClubReady, and Mariana Tek. Which system are you using? I can provide specific setup instructions.",
    category: "technical",
    tags: ["pos", "integration"],
    useCount: 0,
  },
  {
    id: "5",
    title: "Escalation Notice",
    content: "I'm going to escalate this to our development team for a more detailed investigation. They typically respond within 24 hours. In the meantime, is there anything else I can help with?",
    category: "escalation",
    tags: ["escalate", "dev"],
    useCount: 0,
  },
  {
    id: "6",
    title: "Issue Resolution",
    content: "Great news - the issue has been resolved! Please try again and let me know if you encounter any other problems.",
    category: "resolution",
    tags: ["resolved", "fixed"],
    useCount: 0,
  },
]

interface LiveChatPanelProps {
  conversations: SupportConversation[]
  onSelectConversation?: (conversation: SupportConversation) => void
  onSendMessage?: (conversationId: string, message: string) => Promise<void>
  onTakeOver?: (conversationId: string) => Promise<void>
  onResolve?: (conversationId: string, resolution: string) => Promise<void>
  onEscalate?: (conversationId: string, reason: string) => Promise<void>
  onUpdatePriority?: (conversationId: string, priority: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function LiveChatPanel({
  conversations: initialConversations,
  onSelectConversation,
  onSendMessage,
  onTakeOver,
  onResolve,
  onEscalate,
  onUpdatePriority,
  isLoading = false,
  className,
}: LiveChatPanelProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null)
  const [selectedMessages, setSelectedMessages] = useState<SupportMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showCannedResponses, setShowCannedResponses] = useState(false)
  const [cannedResponses] = useState<CannedResponse[]>(defaultCannedResponses)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [customerContext, setCustomerContext] = useState<CustomerContext | null>(null)
  const [typingIndicators, setTypingIndicators] = useState<Record<string, TypingIndicator>>({})
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Update conversations when prop changes
  useEffect(() => {
    setConversations(initialConversations)
  }, [initialConversations])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedMessages])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages(selectedConversation.id)
      loadCustomerContext(selectedConversation)
    }
  }, [selectedConversation?.id])

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/admin/support/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const loadCustomerContext = async (conversation: SupportConversation) => {
    // Build customer context from conversation data
    setCustomerContext({
      partnerId: conversation.partnerId,
      partnerName: conversation.partnerName,
      partnerEmail: conversation.partnerEmail,
      onboardingStep: conversation.onboardingStep,
      integrationStatus: conversation.status,
      techStack: conversation.techStack,
    })
  }

  const handleSelectConversation = (conversation: SupportConversation) => {
    setSelectedConversation(conversation)
    onSelectConversation?.(conversation)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedConversation || isSending) return

    const message = inputValue.trim()
    setInputValue("")
    setIsSending(true)

    try {
      await onSendMessage?.(selectedConversation.id, message)

      // Optimistically add message to the list
      const newMessage: SupportMessage = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversation.id,
        role: "admin",
        content: message,
        contentType: "text",
        status: "sent",
        createdAt: new Date(),
      }
      setSelectedMessages((prev) => [...prev, newMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTakeOver = async () => {
    if (!selectedConversation) return
    await onTakeOver?.(selectedConversation.id)
  }

  const handleResolve = async () => {
    if (!selectedConversation) return
    const resolution = prompt("Enter resolution notes:")
    if (resolution) {
      await onResolve?.(selectedConversation.id, resolution)
    }
  }

  const handleEscalate = async () => {
    if (!selectedConversation) return
    const reason = prompt("Enter escalation reason:")
    if (reason) {
      await onEscalate?.(selectedConversation.id, reason)
    }
  }

  const handleCannedResponse = (response: CannedResponse) => {
    setInputValue(response.content)
    setShowCannedResponses(false)
    inputRef.current?.focus()
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      (conv.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (conv.partnerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort by priority and recency
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className={cn("flex h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden", className)}>
      {/* Conversation List Sidebar */}
      <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Live Conversations</h2>
            <div className="flex items-center gap-1">
              <ConnectionStatusBadge status={connectionStatus} />
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "active", "escalated"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full transition-colors",
                  statusFilter === status
                    ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No active conversations</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {sortedConversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  isTyping={!!typingIndicators[conv.id]}
                  onClick={() => handleSelectConversation(conv)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  {selectedConversation.partnerName ? (
                    <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedConversation.partnerName || selectedConversation.partnerEmail || "Anonymous User"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <StatusBadge status={selectedConversation.status} />
                    <PriorityBadge priority={selectedConversation.priority} />
                    {selectedConversation.topic && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {selectedConversation.topic.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!selectedConversation.isAdminTakeover && (
                  <button
                    onClick={handleTakeOver}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Take Over
                  </button>
                )}
                {selectedConversation.status === "active" && (
                  <>
                    <button
                      onClick={handleEscalate}
                      className="px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      Escalate
                    </button>
                    <button
                      onClick={handleResolve}
                      className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
              {selectedMessages.map((msg) => (
                <AdminChatMessage key={msg.id} message={msg} />
              ))}
              {typingIndicators[selectedConversation.id] && (
                <TypingIndicatorBubble userName={typingIndicators[selectedConversation.id].userName} />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Canned Responses */}
            <AnimatePresence>
              {showCannedResponses && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quick Responses</h4>
                      <button
                        onClick={() => setShowCannedResponses(false)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cannedResponses.map((response) => (
                        <button
                          key={response.id}
                          onClick={() => handleCannedResponse(response)}
                          className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          {response.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setShowCannedResponses(!showCannedResponses)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showCannedResponses
                      ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                  title="Quick responses"
                >
                  <Zap className="w-5 h-5" />
                </button>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 resize-none px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-zinc-100 placeholder:text-zinc-400 min-h-[44px] max-h-[120px]"
                  rows={1}
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className="p-2.5 rounded-xl bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
              <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Select a Conversation</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Choose a conversation from the list to view and respond
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Context Sidebar */}
      {selectedConversation && customerContext && (
        <CustomerContextSidebar
          conversation={selectedConversation}
          context={customerContext}
        />
      )}
    </div>
  )
}

// Conversation List Item Component
function ConversationListItem({
  conversation,
  isSelected,
  isTyping,
  onClick,
}: {
  conversation: SupportConversation
  isSelected: boolean
  isTyping: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 text-left transition-colors",
        isSelected
          ? "bg-teal-50 dark:bg-teal-900/20"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          conversation.priority === "urgent" ? "bg-red-100 dark:bg-red-900/30" :
          conversation.priority === "high" ? "bg-orange-100 dark:bg-orange-900/30" :
          "bg-zinc-100 dark:bg-zinc-800"
        )}>
          {conversation.partnerName ? (
            <Building2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {conversation.partnerName || conversation.partnerEmail || "Anonymous"}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
              {formatTimeAgo(conversation.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={conversation.status} size="sm" />
            {conversation.isAdminTakeover && (
              <span className="text-xs text-violet-600 dark:text-violet-400">
                <Shield className="w-3 h-3 inline" />
              </span>
            )}
          </div>
          {isTyping && (
            <div className="flex items-center gap-1 mt-1">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              <span className="text-xs text-zinc-400">typing...</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// Admin Chat Message Component
function AdminChatMessage({ message }: { message: SupportMessage }) {
  const isUser = message.role === "user"
  const isAdmin = message.role === "admin"
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex gap-3", isUser ? "justify-start" : "justify-start")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-teal-100 dark:bg-teal-900/30" :
        isAdmin ? "bg-violet-100 dark:bg-violet-900/30" :
        "bg-zinc-100 dark:bg-zinc-800"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        ) : isAdmin ? (
          <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        ) : (
          <Bot className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        )}
      </div>
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2",
        isUser ? "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" :
        isAdmin ? "bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800" :
        "bg-zinc-100 dark:bg-zinc-800"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-xs font-medium",
            isUser ? "text-teal-600 dark:text-teal-400" :
            isAdmin ? "text-violet-600 dark:text-violet-400" :
            "text-zinc-500 dark:text-zinc-400"
          )}>
            {isUser ? "Customer" : isAdmin ? "You" : "AI Agent"}
          </span>
          <span className="text-xs text-zinc-400">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}

// Customer Context Sidebar Component
function CustomerContextSidebar({
  conversation,
  context,
}: {
  conversation: SupportConversation
  context: CustomerContext
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Partner Info */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Customer Info
          </h4>
          <div className="space-y-3">
            {context.partnerName && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{context.partnerName}</span>
              </div>
            )}
            {context.partnerEmail && (
              <div className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1 truncate">{context.partnerEmail}</span>
                <button
                  onClick={() => copyToClipboard(context.partnerEmail!, "email")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === "email" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Onboarding Progress */}
        {context.onboardingStep && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Onboarding Progress
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(context.onboardingStep / 7) * 100}%` }}
                />
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Step {context.onboardingStep}/7
              </span>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {context.techStack && Object.keys(context.techStack).length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(context.techStack).map(([key, value]) => value && (
                <span
                  key={key}
                  className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Page URL */}
        {conversation.pageUrl && (
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Current Page
            </h4>
            <a
              href={conversation.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="truncate">{conversation.pageUrl}</span>
            </a>
          </div>
        )}

        {/* Session Info */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Session
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Started</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {new Date(conversation.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Session ID</span>
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {conversation.sessionId.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const config: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    resolved: { label: "Resolved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    escalated: { label: "Escalated", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    abandoned: { label: "Abandoned", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" },
  }

  const { label, color } = config[status] || config.active

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      color,
      size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
    )}>
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { color: string }> = {
    low: { color: "text-zinc-500" },
    normal: { color: "text-blue-500" },
    high: { color: "text-orange-500" },
    urgent: { color: "text-red-500" },
  }

  if (priority === "normal") return null

  return (
    <span className={cn("text-xs font-medium", config[priority]?.color)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
      status === "connected" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
      status === "connecting" || status === "reconnecting" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    )}>
      {status === "connected" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span className="capitalize">{status}</span>
    </div>
  )
}

function TypingIndicatorBubble({ userName }: { userName?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
        <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-2 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1.4s" }} />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "200ms", animationDuration: "1.4s" }} />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "400ms", animationDuration: "1.4s" }} />
          </div>
          <span className="text-xs text-zinc-400">
            {userName ? `${userName} is typing...` : "Customer is typing..."}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}
