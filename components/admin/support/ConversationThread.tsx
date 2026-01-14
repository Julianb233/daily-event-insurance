"use client"

import { useRef, useEffect } from "react"
import { User, Bot, Clock, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeSnippetDisplay } from "@/components/support/CodeSnippetDisplay"

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

interface ConversationThreadProps {
  messages: Message[]
  isLoading?: boolean
  className?: string
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
          isUser ? "bg-violet-100" : "bg-teal-100"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-violet-600" />
        ) : (
          <Bot className="w-5 h-5 text-teal-600" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-600">
            {isUser ? "Partner" : "AI Assistant"}
          </span>
          <span className="text-xs text-slate-400">{formatTime(message.createdAt)}</span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-violet-600 text-white rounded-br-md"
              : "bg-white border border-slate-200 text-slate-900 rounded-bl-md shadow-sm"
          )}
        >
          {message.contentType === "error" && (
            <div className="flex items-center gap-2 text-red-500 mb-2 text-sm">
              <span className="font-medium">Error:</span>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

          {message.codeSnippet && message.codeLanguage && (
            <div className="mt-3">
              <CodeSnippetDisplay
                code={message.codeSnippet}
                language={message.codeLanguage}
              />
            </div>
          )}
        </div>

        {/* Tools used indicator */}
        {message.toolsUsed && message.toolsUsed.length > 0 && !isUser && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Wrench className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">
              Used: {message.toolsUsed.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-medium text-slate-400">{formatDate(date)}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

export function ConversationThread({ messages, isLoading, className }: ConversationThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ""

  messages.forEach((message) => {
    const messageDate = formatDate(message.createdAt)
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groupedMessages.push({ date: messageDate, messages: [message] })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin" />
          <span>Loading messages...</span>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <Clock className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm">No messages in this conversation</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {groupedMessages.map((group) => (
        <div key={group.date}>
          <DateSeparator date={group.date} />
          {group.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
