"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  Minimize2,
  Maximize2
} from "lucide-react"

// ================= Types =================

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  codeSnippet?: string
  toolsUsed?: string[]
}

interface OnboardingTask {
  key: string
  title: string
  status: "pending" | "in_progress" | "completed" | "skipped"
}

interface OnboardingAgentWidgetProps {
  partnerId?: string
  partnerName?: string
  businessType?: string
  userId?: string
  onStateChange?: (state: string, progress: number) => void
  onComplete?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showProgress?: boolean
  variant?: "floating" | "inline" | "fullscreen"
}

// ================= Constants =================

const SUGGESTED_PROMPTS = [
  "Tell me about the partnership program",
  "What are the integration options?",
  "How much can I earn?",
  "Get me started with setup"
]

const TASK_CATEGORIES = {
  signup: { label: "Account Setup", icon: "📝" },
  documents: { label: "Documents", icon: "📄" },
  integration: { label: "Integration", icon: "🔌" },
  training: { label: "Training", icon: "📚" },
  completion: { label: "Go Live", icon: "🚀" }
}

// ================= Component =================

export function OnboardingAgentWidget({
  partnerId,
  partnerName,
  businessType,
  userId,
  onStateChange,
  onComplete,
  isOpen: controlledOpen,
  onOpenChange,
  showProgress = true,
  variant = "floating"
}: OnboardingAgentWidgetProps) {
  // State
  const [internalOpen, setInternalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentState, setCurrentState] = useState("welcome")
  const [progress, setProgress] = useState(0)
  const [tasks, setTasks] = useState<Record<string, OnboardingTask[]>>({})
  const [showTasks, setShowTasks] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [visitorId] = useState(() => `visitor_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Controlled vs uncontrolled open state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: partnerName
          ? `Hi ${partnerName}! 👋 I'm Sam, your onboarding specialist. I'm here to help you get set up with Daily Event Insurance.\n\nI'll guide you through the entire process - from signing up to going live. It usually takes about 30-60 minutes total.\n\nWhat would you like to start with?`
          : `Hi there! 👋 I'm Sam, your onboarding specialist at Daily Event Insurance.\n\nI'm here to help you become a partner and start earning commission. Whether you run a gym, climbing wall, rental shop, or any activity business - I'll guide you through the entire setup.\n\nWhat's your business name?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, partnerName])

  // Copy code to clipboard
  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/agents/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          sessionId,
          partnerId,
          userId,
          visitorId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update session
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId)
        }

        // Update state and progress
        if (data.state !== currentState) {
          setCurrentState(data.state)
          onStateChange?.(data.state, data.progress)
        }
        setProgress(data.progress)

        // Check for completion
        if (data.state === "complete") {
          onComplete?.()
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: `msg_${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          codeSnippet: data.codeSnippet,
          toolsUsed: data.toolsUsed
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Agent error:", error)
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again, or contact partners@dailyeventinsurance.com for immediate help.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, sessionId, partnerId, userId, visitorId, currentState, onStateChange, onComplete])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  // Render message content with code highlighting
  const renderMessageContent = (message: Message) => {
    const content = message.content
    const parts = content.split(/(```[\s\S]*?```)/g)

    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (part.startsWith("```")) {
            const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/)
            const language = codeMatch?.[1] || ""
            const code = codeMatch?.[2]?.trim() || part.replace(/```/g, "").trim()

            return (
              <div key={index} className="my-3 relative">
                <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-3 py-1.5 rounded-t-lg text-xs">
                  <span>{language || "code"}</span>
                  <button
                    onClick={() => copyCode(code)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedCode === code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-b-lg overflow-x-auto text-sm">
                  <code>{code}</code>
                </pre>
              </div>
            )
          }

          // Regular text with simple formatting
          return (
            <div key={index} className="whitespace-pre-wrap">
              {part.split("\n").map((line, lineIndex) => {
                // Handle bold
                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')

                return (
                  <p
                    key={lineIndex}
                    className={lineIndex > 0 && line ? "mt-2" : ""}
                    dangerouslySetInnerHTML={{ __html: formattedLine || "&nbsp;" }}
                  />
                )
              })}
            </div>
          )
        })}

        {/* Tools used indicator */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.toolsUsed.map((tool, i) => (
              <span
                key={i}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-teal-50 text-teal-700 border border-teal-200"
              >
                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                {tool.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Progress bar component
  const ProgressBar = () => (
    <div className="bg-gray-50 border-b px-4 py-2">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )

  // Task sidebar component
  const TaskSidebar = () => (
    <div className="w-64 border-l bg-gray-50 flex flex-col">
      <div className="p-3 border-b bg-white">
        <h3 className="font-semibold text-sm text-gray-900">Onboarding Checklist</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(TASK_CATEGORIES).map(([category, { label, icon }]) => {
          const categoryTasks = tasks[category] || []
          const completed = categoryTasks.filter(t => t.status === "completed").length
          const total = categoryTasks.length

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span>{icon}</span>
                <span className="text-xs font-medium text-gray-700">{label}</span>
                {total > 0 && (
                  <span className="text-[10px] text-gray-500">
                    {completed}/{total}
                  </span>
                )}
              </div>
              <div className="space-y-1 ml-6">
                {categoryTasks.map(task => (
                  <div
                    key={task.key}
                    className="flex items-center gap-2 text-xs"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    ) : task.status === "in_progress" ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-300" />
                    )}
                    <span className={task.status === "completed" ? "text-gray-500 line-through" : "text-gray-700"}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Floating button when closed
  if (!isOpen && variant === "floating") {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50 group"
        aria-label="Open onboarding assistant"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-amber-900" />
        </span>
      </button>
    )
  }

  // Container classes based on variant
  const containerClasses = {
    floating: "fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] rounded-2xl shadow-2xl z-50",
    inline: "w-full h-[500px] rounded-xl shadow-lg",
    fullscreen: "fixed inset-0 z-50"
  }

  return (
    <div className={`${containerClasses[variant]} bg-white flex flex-col overflow-hidden border border-gray-200`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Sam - Onboarding Specialist</h3>
            <p className="text-xs text-teal-100">
              {currentState === "complete" ? "Onboarding Complete!" : "Here to help you get started"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {variant === "floating" && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
          {variant !== "inline" && (
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && !isMinimized && <ProgressBar />}

      {/* Main content */}
      {!isMinimized && (
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-teal-100 text-teal-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-white border border-gray-200 text-gray-700 shadow-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      {renderMessageContent(message)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sam is thinking...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-teal-300 rounded-full text-xs text-gray-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                    >
                      {prompt}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setShowTasks(!showTasks)}
                  className="text-[10px] text-gray-500 hover:text-teal-600 flex items-center gap-1"
                >
                  <ChevronRight className={`w-3 h-3 transition-transform ${showTasks ? "rotate-90" : ""}`} />
                  {showTasks ? "Hide checklist" : "View checklist"}
                </button>
                <a
                  href="mailto:partners@dailyeventinsurance.com"
                  className="text-[10px] text-gray-500 hover:text-teal-600 flex items-center gap-1"
                >
                  Need help?
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          </div>

          {/* Task sidebar */}
          {showTasks && variant !== "floating" && <TaskSidebar />}
        </div>
      )}
    </div>
  )
}

// Export a provider for global access
export function OnboardingAgentProvider({
  children,
  ...props
}: OnboardingAgentWidgetProps & { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OnboardingAgentWidget {...props} />
    </>
  )
}

export default OnboardingAgentWidget
