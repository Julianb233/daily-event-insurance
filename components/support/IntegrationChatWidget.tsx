"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Code,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Minimize2,
  Maximize2,
  Sparkles,
  Book,
  Camera
} from "lucide-react"
import { useSupportChat } from "@/lib/support/use-support-chat"
import { useProactiveChat } from "@/lib/support/use-proactive-chat"
import type { ConversationTopic, TechStack, SupportMessage, FileAttachment } from "@/lib/support/types"
import { cn } from "@/lib/utils"
import { CodeSnippetDisplay } from "./CodeSnippetDisplay"
import { ChatQuickReplies } from "./ChatQuickReplies"
import { EmojiPicker, EmojiPickerTrigger } from "./EmojiPicker"
import { FileAttachmentUI, FileAttachmentTrigger, AttachmentMenu } from "./FileAttachment"
import { AgentTypingIndicator } from "./TypingIndicator"
import { MessageTimestamp } from "./MessageStatus"
import { ScreenCaptureButton, ScreenshotPreview, type ScreenCaptureResult } from "./ScreenCapture"
import { KnowledgeBasePanel, InlineArticleSuggestion } from "./KnowledgeBasePanel"
import { getSuggestedArticles } from "@/lib/support/knowledge-base"
import type { KnowledgeArticle } from "@/lib/support/types"

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
  defaultOpen?: boolean
  onClose?: () => void
  proactiveEnabled?: boolean
  enableScreenCapture?: boolean
  enableKnowledgeBase?: boolean
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
  defaultOpen = false,
  onClose,
  proactiveEnabled = true,
  enableScreenCapture = true,
  enableKnowledgeBase = true,
}: IntegrationChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [proactiveMessage, setProactiveMessage] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [screenCapture, setScreenCapture] = useState<ScreenCaptureResult | null>(null)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [suggestedArticle, setSuggestedArticle] = useState<KnowledgeArticle | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Proactive chat triggers
  const {
    activeTrigger,
    dismissTrigger,
    getContextualGreeting,
  } = useProactiveChat({
    enabled: proactiveEnabled && !isOpen,
    idleTimeout: 60000,
    exitIntentEnabled: true,
    onTrigger: (trigger) => {
      setProactiveMessage(trigger.message)
      setUnreadCount(prev => prev + 1)
    }
  })

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Hide quick replies after first message
  useEffect(() => {
    if (messages.length > 0) {
      setShowQuickReplies(false)
    }
  }, [messages.length])

  // Reset unread count when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      setProactiveMessage(null)
    }
  }, [isOpen])

  // Get suggested articles based on conversation
  useEffect(() => {
    if (messages.length > 0 && enableKnowledgeBase) {
      const recentMessages = messages.slice(-3).map((m) => m.content)
      const suggestions = getSuggestedArticles({
        topic,
        recentMessages,
      })
      if (suggestions.length > 0) {
        setSuggestedArticle(suggestions[0].article)
      }
    }
  }, [messages, topic, enableKnowledgeBase])

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    setIsMinimized(false)
    dismissTrigger()
    if (!conversation) {
      await startConversation()
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [conversation, startConversation, dismissTrigger])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setShowEmojiPicker(false)
    setShowAttachmentMenu(false)
    onClose?.()
  }, [onClose])

  const handleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev)
  }, [])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isSending) return

    const message = inputValue.trim()
    setInputValue("")
    setIsTyping(true)
    setShowQuickReplies(false)

    try {
      // Build message with attachment info
      const screenshotInfo = screenCapture ? "\n\n[Screenshot attached]" : ""
      const fullMessage = message + screenshotInfo

      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation?.id,
          message: fullMessage,
          attachments: attachments.length > 0 ? attachments : undefined,
          hasScreenshot: !!screenCapture,
          context: { partnerId, partnerName, topic, techStack, onboardingStep },
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      await sendMessage(message)
      setAttachments([])
      setScreenCapture(null)
    } catch (err) {
      console.error("Chat error:", err)
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, isSending, conversation, partnerId, partnerName, topic, techStack, onboardingStep, sendMessage, attachments, screenCapture])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickReply = useCallback((message: string) => {
    setInputValue(message)
    setTimeout(() => {
      handleSend()
    }, 100)
  }, [handleSend])

  const handleEmojiSelect = useCallback((emoji: string) => {
    setInputValue(prev => prev + emoji)
    inputRef.current?.focus()
  }, [])

  const handleFilesSelect = useCallback(async (files: File[]) => {
    setIsUploading(true)
    try {
      // Simulate file upload - in production, upload to storage
      const newAttachments: FileAttachment[] = files.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      }))
      setAttachments(prev => [...prev, ...newAttachments])
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }, [])

  const handleScreenCapture = useCallback((result: ScreenCaptureResult) => {
    setScreenCapture(result)
    setShowAttachmentMenu(false)
  }, [])

  const handleScreenshot = useCallback(async () => {
    // Trigger screen capture via the ScreenCaptureButton component
    // This is a fallback for the attachment menu
    setShowAttachmentMenu(false)
  }, [])

  const handleRate = async (rating: number) => {
    await rateConversation(rating)
  }

  return (
    <>
      {/* Floating Button with Badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "fixed z-50",
              position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
            )}
          >
            {/* Proactive Message Bubble */}
            <AnimatePresence>
              {proactiveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className={cn(
                    "absolute bottom-16 mb-2 w-72 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800",
                    position === "bottom-right" ? "right-0" : "left-0"
                  )}
                >
                  <button
                    onClick={() => {
                      setProactiveMessage(null)
                      dismissTrigger()
                    }}
                    className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">{proactiveMessage}</p>
                      <button
                        onClick={handleOpen}
                        className="text-sm font-medium transition-colors"
                        style={{ color: primaryColor }}
                      >
                        Chat with us
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all"
              style={{ backgroundColor: primaryColor }}
              aria-label="Open support chat"
            >
              <MessageCircle className="w-6 h-6 text-white" />

              {/* Unread Badge */}
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Pulse Animation */}
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: primaryColor }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed z-50 w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800",
              position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
            )}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between px-4 py-3 text-white cursor-pointer"
              style={{ backgroundColor: primaryColor }}
              onClick={handleMinimize}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{ rotate: isConnected ? 0 : 360 }}
                  transition={{ duration: 2, repeat: isConnected ? 0 : Infinity, ease: "linear" }}
                >
                  <Code className="w-4 h-4" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-sm">Integration Support</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1.5">
                    <motion.span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isConnected ? "bg-green-400" : "bg-yellow-400"
                      )}
                      animate={isConnected ? {} : { opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {isConnected ? "Online" : "Connecting..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMinimize()
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-8"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                      </motion.div>
                    )}

                    {!isLoading && messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-6"
                      >
                        <motion.div
                          className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <MessageCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        </motion.div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                          {getContextualGreeting()}
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                          I&apos;m here to help with your integration. Ask me about widget setup, API endpoints, POS connections, or troubleshooting.
                        </p>

                        {/* Quick Replies */}
                        {showQuickReplies && (
                          <ChatQuickReplies
                            onSelect={handleQuickReply}
                            topic={topic}
                            currentPage={pageUrl}
                            className="mt-4"
                          />
                        )}
                      </motion.div>
                    )}

                    {/* Message List */}
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ChatMessage
                            message={msg}
                            primaryColor={primaryColor}
                          />
                          {/* Show article suggestion after last assistant message */}
                          {msg.role === "assistant" &&
                            index === messages.length - 1 &&
                            suggestedArticle &&
                            enableKnowledgeBase && (
                              <InlineArticleSuggestion
                                article={suggestedArticle}
                                onClick={() => setShowKnowledgeBase(true)}
                              />
                            )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <AgentTypingIndicator
                          agentName="Support Agent"
                        />
                      )}
                    </AnimatePresence>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Rating Section */}
                  <AnimatePresence>
                    {conversation?.status === "resolved" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                      >
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          Was this helpful?
                        </p>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRate(5)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Yes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRate(1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            No
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* File Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="px-4 pt-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <FileAttachmentUI
                        onFilesSelect={handleFilesSelect}
                        attachments={attachments}
                        onRemoveAttachment={handleRemoveAttachment}
                        isUploading={isUploading}
                      />
                    </div>
                  )}

                  {/* Screenshot Preview */}
                  {screenCapture && (
                    <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500">Screenshot attached</span>
                        <button
                          onClick={() => setScreenCapture(null)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <ScreenshotPreview
                        src={screenCapture.dataUrl}
                        onRemove={() => setScreenCapture(null)}
                        className="h-20 w-auto rounded-lg"
                      />
                    </div>
                  )}

                  {/* Knowledge Base Panel */}
                  {enableKnowledgeBase && (
                    <KnowledgeBasePanel
                      isOpen={showKnowledgeBase}
                      onClose={() => setShowKnowledgeBase(false)}
                      topic={topic}
                      recentMessages={messages.slice(-5).map((m) => m.content)}
                      onArticleSelect={(article) => {
                        setInputValue(`I have a question about: ${article.title}`)
                        setShowKnowledgeBase(false)
                        inputRef.current?.focus()
                      }}
                    />
                  )}

                  {/* Input Area */}
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="relative">
                      {/* Emoji Picker */}
                      <EmojiPicker
                        isOpen={showEmojiPicker}
                        onOpenChange={setShowEmojiPicker}
                        onSelect={handleEmojiSelect}
                        position="top"
                      />

                      {/* Attachment Menu */}
                      <AttachmentMenu
                        isOpen={showAttachmentMenu}
                        onOpenChange={setShowAttachmentMenu}
                        onFileClick={() => fileInputRef.current?.click()}
                        onScreenshotClick={handleScreenshot}
                      />

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFilesSelect(Array.from(e.target.files))
                          }
                          e.target.value = ""
                        }}
                      />

                      <div className="flex items-end gap-2">
                        {/* Toolbar */}
                        <div className="flex items-center gap-0.5">
                          <EmojiPickerTrigger
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            isActive={showEmojiPicker}
                            disabled={isSending || isTyping}
                          />
                          <FileAttachmentTrigger
                            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                            disabled={isSending || isTyping}
                          />
                          {enableScreenCapture && (
                            <ScreenCaptureButton
                              onCapture={handleScreenCapture}
                              disabled={isSending || isTyping}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            />
                          )}
                          {enableKnowledgeBase && (
                            <button
                              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
                              disabled={isSending || isTyping}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                showKnowledgeBase
                                  ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600"
                                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                (isSending || isTyping) && "opacity-50 cursor-not-allowed"
                              )}
                              title="Search help articles"
                            >
                              <Book className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Text Input */}
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask about integrations..."
                          className="flex-1 resize-none px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-zinc-100 placeholder:text-zinc-400 min-h-[40px] max-h-[120px]"
                          rows={1}
                          disabled={isSending || isTyping}
                        />

                        {/* Send Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isSending || isTyping}
                          className="p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          style={{ backgroundColor: primaryColor }}
                          aria-label="Send message"
                        >
                          {isSending || isTyping ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <Send className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ChatMessage({
  message,
  primaryColor
}: {
  message: SupportMessage
  primaryColor: string
}) {
  const isUser = message.role === "user"

  return (
    <motion.div
      layout
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5",
          isUser
            ? "text-white rounded-br-md"
            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md shadow-sm border border-zinc-200 dark:border-zinc-700"
        )}
        style={isUser ? { backgroundColor: primaryColor } : undefined}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {/* Code Snippet */}
        {message.codeSnippet && message.codeLanguage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <CodeSnippetDisplay
              code={message.codeSnippet}
              language={message.codeLanguage}
            />
          </motion.div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1 text-xs bg-white/10 rounded-md hover:bg-white/20 transition-colors"
              >
                {attachment.type.startsWith("image/") && attachment.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attachment.thumbnailUrl}
                    alt={attachment.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <span className="truncate max-w-[100px]">{attachment.name}</span>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Timestamp and Status */}
        <MessageTimestamp
          timestamp={message.createdAt}
          status={message.status}
          isUser={isUser}
        />
      </motion.div>
    </motion.div>
  )
}
