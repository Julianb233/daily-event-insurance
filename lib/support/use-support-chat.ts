"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { RealtimeChatService, createChatService } from "./realtime-chat"
import type {
  SupportConversation,
  SupportMessage,
  ConversationTopic,
  TechStack,
  IntegrationContext,
  ConnectionStatus,
  TypingIndicator,
  ReadReceipt,
  FileAttachment,
  QuickReply,
} from "./types"

const CONVERSATION_STORAGE_KEY = "support_conversation_id"
const MESSAGES_CACHE_KEY = "support_messages_cache"

interface UseSupportChatOptions {
  sessionId: string
  partnerId?: string
  partnerEmail?: string
  partnerName?: string
  pageUrl?: string
  onboardingStep?: number
  topic?: ConversationTopic
  techStack?: TechStack
  autoConnect?: boolean
  persistHistory?: boolean
}

interface UseSupportChatReturn {
  conversation: SupportConversation | null
  messages: SupportMessage[]
  isConnected: boolean
  connectionStatus: ConnectionStatus
  isLoading: boolean
  isSending: boolean
  error: string | null
  typingIndicator: TypingIndicator | null
  quickReplies: QuickReply[]
  sendMessage: (content: string, codeSnippet?: string, codeLanguage?: string, attachments?: FileAttachment[]) => Promise<void>
  sendTypingIndicator: (isTyping: boolean) => void
  markMessagesAsRead: () => Promise<void>
  startConversation: () => Promise<void>
  resumeConversation: (conversationId: string) => Promise<void>
  updateContext: (updates: { topic?: ConversationTopic; techStack?: TechStack; integrationContext?: IntegrationContext }) => Promise<void>
  resolveConversation: (resolution: string) => Promise<void>
  escalateConversation: (reason: string) => Promise<void>
  rateConversation: (rating: number, feedback?: string) => Promise<void>
  disconnect: () => void
  clearHistory: () => void
  retryConnection: () => void
}

// Default quick replies for common scenarios
const defaultQuickReplies: QuickReply[] = [
  { id: "1", label: "Widget Setup Help", message: "I need help setting up the insurance widget on my website.", category: "onboarding" },
  { id: "2", label: "API Integration", message: "How do I integrate with your API?", category: "api" },
  { id: "3", label: "POS Connection", message: "I want to connect my POS system.", category: "pos" },
  { id: "4", label: "Troubleshooting", message: "I'm experiencing an issue with my integration.", category: "troubleshooting" },
  { id: "5", label: "Documentation", message: "Where can I find the API documentation?", category: "docs" },
]

export function useSupportChat(options: UseSupportChatOptions): UseSupportChatReturn {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typingIndicator, setTypingIndicator] = useState<TypingIndicator | null>(null)
  const [quickReplies] = useState<QuickReply[]>(defaultQuickReplies)

  const chatServiceRef = useRef<RealtimeChatService | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load persisted conversation on mount
  useEffect(() => {
    if (options.persistHistory && typeof window !== "undefined") {
      const storedConversationId = localStorage.getItem(CONVERSATION_STORAGE_KEY)
      const cachedMessages = localStorage.getItem(MESSAGES_CACHE_KEY)

      if (cachedMessages) {
        try {
          const parsed = JSON.parse(cachedMessages)
          setMessages(parsed.map((m: SupportMessage & { createdAt: string }) => ({
            ...m,
            createdAt: new Date(m.createdAt),
            deliveredAt: m.deliveredAt ? new Date(m.deliveredAt) : undefined,
            readAt: m.readAt ? new Date(m.readAt) : undefined,
          })))
        } catch (e) {
          console.error("[useSupportChat] Failed to parse cached messages:", e)
        }
      }

      if (storedConversationId && chatServiceRef.current) {
        resumeConversation(storedConversationId)
      }
    }
  }, [options.persistHistory])

  // Persist messages when they change
  useEffect(() => {
    if (options.persistHistory && typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(messages))
    }
  }, [messages, options.persistHistory])

  // Persist conversation ID
  useEffect(() => {
    if (options.persistHistory && typeof window !== "undefined" && conversation?.id) {
      localStorage.setItem(CONVERSATION_STORAGE_KEY, conversation.id)
    }
  }, [conversation?.id, options.persistHistory])

  useEffect(() => {
    chatServiceRef.current = createChatService()

    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.unsubscribe()
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleNewMessage = useCallback((message: SupportMessage) => {
    setMessages((prev) => {
      // Check for optimistic update
      const existingIndex = prev.findIndex((m) => m.id === message.id)
      if (existingIndex !== -1) {
        // Update the existing message with server data
        const updated = [...prev]
        updated[existingIndex] = message
        return updated
      }
      // Check for duplicates
      if (prev.some((m) => m.id === message.id)) return prev
      return [...prev, message]
    })
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setConversation((prev) => prev ? { ...prev, status: status as SupportConversation["status"] } : null)
  }, [])

  const handleConnectionChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status)
    setIsConnected(status === "connected")

    if (status === "error") {
      setError("Connection error. Please try again.")
    } else if (status === "connected") {
      setError(null)
    }
  }, [])

  const handleTypingIndicator = useCallback((indicator: TypingIndicator) => {
    if (indicator.isTyping) {
      setTypingIndicator(indicator)
      // Clear typing indicator after 3 seconds if no update
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypingIndicator(null)
      }, 3000)
    } else {
      setTypingIndicator(null)
    }
  }, [])

  const handleReadReceipt = useCallback((receipt: ReadReceipt) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === receipt.messageId
          ? { ...m, status: "read" as const, readAt: receipt.readAt }
          : m
      )
    )
  }, [])

  const startConversation = useCallback(async () => {
    if (!chatServiceRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const conv = await chatServiceRef.current.startConversation({
        sessionId: options.sessionId,
        partnerId: options.partnerId,
        partnerEmail: options.partnerEmail,
        partnerName: options.partnerName,
        pageUrl: options.pageUrl,
        onboardingStep: options.onboardingStep,
        topic: options.topic,
        techStack: options.techStack,
      })

      if (conv) {
        setConversation(conv)
        chatServiceRef.current.subscribeToMessages(conv.id, {
          onMessage: handleNewMessage,
          onStatus: handleStatusChange,
          onConnection: handleConnectionChange,
          onTyping: handleTypingIndicator,
          onReadReceipt: handleReadReceipt,
        })
        setIsConnected(true)
      } else {
        setError("Failed to start conversation")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [options, handleNewMessage, handleStatusChange, handleConnectionChange, handleTypingIndicator, handleReadReceipt])

  const resumeConversation = useCallback(async (conversationId: string) => {
    if (!chatServiceRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const conv = await chatServiceRef.current.resumeConversation(conversationId)
      if (conv) {
        setConversation(conv)
        const existingMessages = await chatServiceRef.current.getConversationMessages(conversationId)
        setMessages(existingMessages)
        chatServiceRef.current.subscribeToMessages(conversationId, {
          onMessage: handleNewMessage,
          onStatus: handleStatusChange,
          onConnection: handleConnectionChange,
          onTyping: handleTypingIndicator,
          onReadReceipt: handleReadReceipt,
        })
        setIsConnected(true)
      } else {
        setError("Failed to resume conversation")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [handleNewMessage, handleStatusChange, handleConnectionChange, handleTypingIndicator, handleReadReceipt])

  const sendMessage = useCallback(async (
    content: string,
    codeSnippet?: string,
    codeLanguage?: string,
    attachments?: FileAttachment[]
  ) => {
    if (!chatServiceRef.current || !conversation) return

    setIsSending(true)
    setError(null)

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: SupportMessage = {
      id: tempId,
      conversationId: conversation.id,
      role: "user",
      content,
      contentType: codeSnippet ? "code" : attachments?.length ? "file" : "text",
      codeSnippet,
      codeLanguage,
      attachments,
      status: "sending",
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const message = await chatServiceRef.current.sendMessage({
        conversationId: conversation.id,
        role: "user",
        content,
        contentType: codeSnippet ? "code" : attachments?.length ? "file" : "text",
        codeSnippet,
        codeLanguage,
        attachments,
      })

      if (message) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? message : m))
        )
      } else {
        // Mark as failed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, status: "failed" as const } : m
          )
        )
        setError("Failed to send message")
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: "failed" as const } : m
        )
      )
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSending(false)
    }
  }, [conversation])

  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (chatServiceRef.current) {
      chatServiceRef.current.sendTypingIndicator(isTyping)
    }
  }, [])

  const markMessagesAsRead = useCallback(async () => {
    if (!chatServiceRef.current || !conversation) return
    await chatServiceRef.current.markAllMessagesAsRead(conversation.id)
  }, [conversation])

  const updateContext = useCallback(async (updates: {
    topic?: ConversationTopic
    techStack?: TechStack
    integrationContext?: IntegrationContext
  }) => {
    if (!chatServiceRef.current || !conversation) return

    const success = await chatServiceRef.current.updateConversationContext(
      conversation.id,
      updates
    )

    if (success) {
      setConversation((prev) => prev ? {
        ...prev,
        ...updates,
      } : null)
    }
  }, [conversation])

  const resolveConversation = useCallback(async (resolution: string) => {
    if (!chatServiceRef.current || !conversation) return

    const success = await chatServiceRef.current.resolveConversation(
      conversation.id,
      resolution
    )

    if (success) {
      setConversation((prev) => prev ? {
        ...prev,
        status: "resolved",
        resolution,
        resolvedAt: new Date(),
      } : null)
    }
  }, [conversation])

  const escalateConversation = useCallback(async (reason: string) => {
    if (!chatServiceRef.current || !conversation) return

    const success = await chatServiceRef.current.escalateConversation(
      conversation.id,
      reason
    )

    if (success) {
      setConversation((prev) => prev ? {
        ...prev,
        status: "escalated",
        escalationReason: reason,
        escalatedAt: new Date(),
      } : null)
    }
  }, [conversation])

  const rateConversation = useCallback(async (rating: number, feedback?: string) => {
    if (!chatServiceRef.current || !conversation) return

    const success = await chatServiceRef.current.rateConversation(
      conversation.id,
      rating,
      feedback
    )

    if (success) {
      setConversation((prev) => prev ? {
        ...prev,
        helpfulRating: rating,
        feedback,
      } : null)
    }
  }, [conversation])

  const disconnect = useCallback(() => {
    if (chatServiceRef.current) {
      chatServiceRef.current.unsubscribe()
      setIsConnected(false)
      setConnectionStatus("disconnected")
    }
  }, [])

  const clearHistory = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY)
      localStorage.removeItem(MESSAGES_CACHE_KEY)
    }
    setMessages([])
    setConversation(null)
  }, [])

  const retryConnection = useCallback(() => {
    if (conversation?.id && chatServiceRef.current) {
      chatServiceRef.current.subscribeToMessages(conversation.id, {
        onMessage: handleNewMessage,
        onStatus: handleStatusChange,
        onConnection: handleConnectionChange,
        onTyping: handleTypingIndicator,
        onReadReceipt: handleReadReceipt,
      })
    }
  }, [conversation?.id, handleNewMessage, handleStatusChange, handleConnectionChange, handleTypingIndicator, handleReadReceipt])

  useEffect(() => {
    if (options.autoConnect && !conversation && !isLoading) {
      startConversation()
    }
  }, [options.autoConnect, conversation, isLoading, startConversation])

  return {
    conversation,
    messages,
    isConnected,
    connectionStatus,
    isLoading,
    isSending,
    error,
    typingIndicator,
    quickReplies,
    sendMessage,
    sendTypingIndicator,
    markMessagesAsRead,
    startConversation,
    resumeConversation,
    updateContext,
    resolveConversation,
    escalateConversation,
    rateConversation,
    disconnect,
    clearHistory,
    retryConnection,
  }
}
