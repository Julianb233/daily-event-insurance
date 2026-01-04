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
  ChevronDown,
  Loader2,
  Sparkles,
  ExternalLink,
  Code,
  Zap
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  codeSnippet?: string
}

interface IntegrationAssistantProps {
  partnerId?: string
  partnerName?: string
  businessType?: string
  onPlatformDetected?: (platform: string) => void
  onIntegrationComplete?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

// Platform quick select options
const PLATFORM_OPTIONS = [
  { slug: "mindbody", name: "Mindbody", icon: "🏋️" },
  { slug: "zen-planner", name: "Zen Planner", icon: "💪" },
  { slug: "shopify", name: "Shopify", icon: "🛒" },
  { slug: "woocommerce", name: "WooCommerce", icon: "🔌" },
  { slug: "square", name: "Square", icon: "💳" },
  { slug: "stripe", name: "Stripe", icon: "💰" },
  { slug: "generic-widget", name: "Website Widget", icon: "🌐" },
]

// Suggested prompts
const SUGGESTED_PROMPTS = [
  "I want to add insurance to my checkout",
  "How do I set up webhooks?",
  "Generate embed code for my website",
  "Help me integrate with my POS system",
]

export function IntegrationAssistant({
  partnerId,
  partnerName,
  businessType,
  onPlatformDetected,
  onIntegrationComplete,
  isOpen: controlledOpen,
  onOpenChange
}: IntegrationAssistantProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle controlled vs uncontrolled state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Send welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: partnerName
          ? `Hi ${partnerName}! 👋 I'm here to help you integrate Daily Event Insurance with your business systems.\n\nWhat software do you use to manage your business? Or if you'd like, just tell me what you're trying to accomplish and I'll guide you through the best integration option.`
          : `Hi there! 👋 I'm your integration assistant. I'll help you set up Daily Event Insurance with your existing systems.\n\nWhat software do you currently use to manage bookings, payments, or your online store?`,
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
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("/api/onboarding/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          partnerId,
          partnerName,
          businessType,
          detectedPlatform
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          codeSnippet: data.codeSnippet
        }
        setMessages(prev => [...prev, assistantMessage])

        // Update detected platform
        if (data.detectedPlatform && data.detectedPlatform !== detectedPlatform) {
          setDetectedPlatform(data.detectedPlatform)
          onPlatformDetected?.(data.detectedPlatform)
        }
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Assistant error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again, or contact support@dailyeventinsurance.com for immediate help.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, partnerId, partnerName, businessType, detectedPlatform, onPlatformDetected])

  // Handle platform quick select
  const selectPlatform = useCallback((platform: typeof PLATFORM_OPTIONS[0]) => {
    sendMessage(`I use ${platform.name} for my business`)
  }, [sendMessage])

  // Handle suggested prompt click
  const handleSuggestedPrompt = useCallback((prompt: string) => {
    sendMessage(prompt)
  }, [sendMessage])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Render message content with code highlighting
  const renderMessageContent = (message: Message) => {
    const content = message.content
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Code block
        const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/)
        const language = codeMatch?.[1] || ""
        const code = codeMatch?.[2]?.trim() || part.replace(/```/g, "").trim()

        return (
          <div key={index} className="my-3 relative group">
            <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-3 py-1.5 rounded-t-lg text-xs">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                {language || "code"}
              </span>
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

      // Regular text - handle markdown-like formatting
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part.split("\n").map((line, lineIndex) => {
            // Handle bold text
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

            // Handle inline code
            line = line.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

            return (
              <p
                key={lineIndex}
                className={lineIndex > 0 ? "mt-2" : ""}
                dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
              />
            )
          })}
        </div>
      )
    })
  }

  if (!isOpen) {
    // Floating button
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50 group"
        aria-label="Open integration assistant"
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-900">
          AI
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Integration Assistant</h3>
            <p className="text-xs text-teal-100 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Powered by AI
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Platform detected banner */}
      {detectedPlatform && (
        <div className="bg-teal-50 border-b border-teal-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <Check className="w-4 h-4" />
            <span>Detected: <strong className="capitalize">{detectedPlatform.replace("-", " ")}</strong></span>
          </div>
          <button
            onClick={() => setDetectedPlatform(null)}
            className="text-xs text-teal-600 hover:text-teal-800"
          >
            Change
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
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
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-4 pb-2 space-y-3">
          {/* Platform quick select */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick select your platform:</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(platform => (
                <button
                  key={platform.slug}
                  onClick={() => selectPlatform(platform)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 rounded-full text-xs text-gray-700 hover:text-teal-700 transition-colors flex items-center gap-1.5"
                >
                  <span>{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested prompts */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Or try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:border-teal-300 rounded-lg text-xs text-gray-600 hover:text-teal-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
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
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about integration..."
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
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          AI assistant may make mistakes. Verify important information.
        </p>
      </form>
    </div>
  )
}

// Export a provider component for global access
export function IntegrationAssistantProvider({
  children,
  ...props
}: IntegrationAssistantProps & { children: React.ReactNode }) {
  return (
    <>
      {children}
      <IntegrationAssistant {...props} />
    </>
  )
}
