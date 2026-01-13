"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Loader2, Code, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react"
import { useSupportChat } from "@/lib/support/use-support-chat"
import type { ConversationTopic, TechStack, SupportMessage } from "@/lib/support/types"
import { cn } from "@/lib/utils"
import { CodeSnippetDisplay } from "./CodeSnippetDisplay"

interface IntegrationChatWidgetProps {
  partnerId?: string
  partnerEmail?: string
  partnerName?: string
  pageUrl?: string
  onboardingStep?: number
  topic?: ConversationTopic
  techStack?: TechStack
  position?: "bottom-right" | "bottom-left"
  primaryColor?: string
}

export function IntegrationChatWidget({
  partnerId,
  partnerEmail,
  partnerName,
  pageUrl,
  onboardingStep,
  topic = "onboarding",
  techStack,
  position = "bottom-right",
  primaryColor = "#14B8A6",
}: IntegrationChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sessionId = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("support_session_id") || crypto.randomUUID()
      : crypto.randomUUID()
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("support_session_id", sessionId.current)
    }
  }, [])

  const {
    conversation,
    messages,
    isConnected,
    isLoading,
    isSending,
    error,
    sendMessage,
    startConversation,
    rateConversation,
  } = useSupportChat({
    sessionId: sessionId.current,
    partnerId,
    partnerEmail,
    partnerName,
    pageUrl: pageUrl || (typeof window !== "undefined" ? window.location.href : undefined),
    onboardingStep,
    topic,
    techStack,
    autoConnect: false,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    if (!conversation) {
      await startConversation()
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [conversation, startConversation])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isSending) return

    const message = inputValue.trim()
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation?.id,
          message,
          context: { partnerId, partnerName, topic, techStack, onboardingStep },
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      await sendMessage(message)
    } catch (err) {
      console.error("Chat error:", err)
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, isSending, conversation, partnerId, partnerName, topic, techStack, onboardingStep, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRate = async (rating: number) => {
    await rateConversation(rating)
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={cn(
            "fixed z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all hover:scale-110",
            position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
          )}
          style={{ backgroundColor: primaryColor }}
          aria-label="Open support chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed z-50 w-96 h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800",
            position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
          )}
        >
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Integration Support</h3>
                <p className="text-xs opacity-80">
                  {isConnected ? "Online" : "Connecting..."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Hi{partnerName ? `, ${partnerName}` : ""}! 👋
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  I&apos;m here to help with your integration. Ask me about widget setup, API endpoints, POS connections, or troubleshooting.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} primaryColor={primaryColor} />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs">Typing...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {conversation?.status === "resolved" && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                Was this helpful?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRate(5)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </button>
                <button
                  onClick={() => handleRate(1)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  No
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about integrations..."
                className="flex-1 resize-none px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-zinc-100 placeholder:text-zinc-400"
                rows={1}
                disabled={isSending || isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending || isTyping}
                className="p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: primaryColor }}
                aria-label="Send message"
              >
                {isSending || isTyping ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ChatMessage({ message, primaryColor }: { message: SupportMessage; primaryColor: string }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2",
          isUser
            ? "bg-teal-600 text-white rounded-br-md"
            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md shadow-sm border border-zinc-200 dark:border-zinc-700"
        )}
        style={isUser ? { backgroundColor: primaryColor } : undefined}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {message.codeSnippet && message.codeLanguage && (
          <div className="mt-3">
            <CodeSnippetDisplay
              code={message.codeSnippet}
              language={message.codeLanguage}
            />
          </div>
        )}

        <p className={cn("text-xs mt-1", isUser ? "text-white/70" : "text-zinc-400")}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
