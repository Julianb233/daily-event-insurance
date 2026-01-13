"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { RealtimeChatService, createChatService } from "./realtime-chat"
import type {
  SupportConversation,
  SupportMessage,
  ConversationTopic,
  TechStack,
  IntegrationContext,
} from "./types"

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
}

interface UseSupportChatReturn {
  conversation: SupportConversation | null
  messages: SupportMessage[]
  isConnected: boolean
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string, codeSnippet?: string, codeLanguage?: string) => Promise<void>
  startConversation: () => Promise<void>
  resumeConversation: (conversationId: string) => Promise<void>
  updateContext: (updates: { topic?: ConversationTopic; techStack?: TechStack; integrationContext?: IntegrationContext }) => Promise<void>
  resolveConversation: (resolution: string) => Promise<void>
  escalateConversation: (reason: string) => Promise<void>
  rateConversation: (rating: number, feedback?: string) => Promise<void>
  disconnect: () => void
}

export function useSupportChat(options: UseSupportChatOptions): UseSupportChatReturn {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const chatServiceRef = useRef<RealtimeChatService | null>(null)

  useEffect(() => {
    chatServiceRef.current = createChatService()
    
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.unsubscribe()
      }
    }
  }, [])

  const handleNewMessage = useCallback((message: SupportMessage) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id)
      if (exists) return prev
      return [...prev, message]
    })
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setConversation((prev) => prev ? { ...prev, status: status as SupportConversation["status"] } : null)
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
        chatServiceRef.current.subscribeToMessages(conv.id, handleNewMessage, handleStatusChange)
        setIsConnected(true)
      } else {
        setError("Failed to start conversation")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [options, handleNewMessage, handleStatusChange])

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
        chatServiceRef.current.subscribeToMessages(conversationId, handleNewMessage, handleStatusChange)
        setIsConnected(true)
      } else {
        setError("Failed to resume conversation")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [handleNewMessage, handleStatusChange])

  const sendMessage = useCallback(async (
    content: string,
    codeSnippet?: string,
    codeLanguage?: string
  ) => {
    if (!chatServiceRef.current || !conversation) return

    setIsSending(true)
    setError(null)

    try {
      const message = await chatServiceRef.current.sendMessage({
        conversationId: conversation.id,
        role: "user",
        content,
        contentType: codeSnippet ? "code" : "text",
        codeSnippet,
        codeLanguage,
      })

      if (!message) {
        setError("Failed to send message")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSending(false)
    }
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
    }
  }, [])

  useEffect(() => {
    if (options.autoConnect && !conversation && !isLoading) {
      startConversation()
    }
  }, [options.autoConnect, conversation, isLoading, startConversation])

  return {
    conversation,
    messages,
    isConnected,
    isLoading,
    isSending,
    error,
    sendMessage,
    startConversation,
    resumeConversation,
    updateContext,
    resolveConversation,
    escalateConversation,
    rateConversation,
    disconnect,
  }
}
