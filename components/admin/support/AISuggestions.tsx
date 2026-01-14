"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ArrowRight,
  Code,
  MessageSquare,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { CodeSnippetDisplay } from "@/components/support/CodeSnippetDisplay"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  contentType: "text" | "code" | "error" | "action"
  codeSnippet?: string | null
  codeLanguage?: string | null
  createdAt: string
}

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

interface Suggestion {
  id: string
  type: "response" | "code" | "action"
  content: string
  codeSnippet?: string
  codeLanguage?: string
  confidence: number
  reasoning: string
  category: string
}

interface AISuggestionsProps {
  conversationId: string
  messages: Message[]
  topic?: string | null
  techStack?: TechStack | null
  integrationContext?: IntegrationContext | null
  onInsertSuggestion: (content: string, codeSnippet?: string, codeLanguage?: string) => void
  className?: string
}

export function AISuggestions({
  conversationId,
  messages,
  topic,
  techStack,
  integrationContext,
  onInsertSuggestion,
  className,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  const fetchSuggestions = useCallback(async () => {
    if (messages.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/support/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: messages.slice(-10), // Last 10 messages for context
          topic,
          techStack,
          integrationContext,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }

      const data = await response.json()
      if (data.success) {
        setSuggestions(data.data.suggestions)
      }
    } catch (err: any) {
      console.error("Error fetching suggestions:", err)
      setError(err.message || "Failed to load suggestions")
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, messages, topic, techStack, integrationContext])

  // Fetch suggestions when messages change
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    // Only fetch if last message is from user
    if (lastMessage?.role === "user") {
      fetchSuggestions()
    }
  }, [messages, fetchSuggestions])

  const handleCopy = async (suggestion: Suggestion) => {
    try {
      const textToCopy = suggestion.codeSnippet
        ? `${suggestion.content}\n\n${suggestion.codeSnippet}`
        : suggestion.content
      await navigator.clipboard.writeText(textToCopy)
      setCopiedId(suggestion.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleInsert = (suggestion: Suggestion) => {
    onInsertSuggestion(
      suggestion.content,
      suggestion.codeSnippet,
      suggestion.codeLanguage
    )
  }

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50"
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50"
    return "text-orange-600 bg-orange-50"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="w-4 h-4" />
      case "action":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  if (messages.length === 0) {
    return null
  }

  return (
    <div className={cn("bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Suggestions</h3>
            <p className="text-xs text-slate-500">
              {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              fetchSuggestions()
            }}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-violet-600 transition-colors disabled:opacity-50"
            aria-label="Refresh suggestions"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-violet-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Generating suggestions...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                  <button
                    onClick={fetchSuggestions}
                    className="ml-auto text-red-700 hover:text-red-800 font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Suggestions List */}
              {!isLoading && !error && suggestions.length > 0 && (
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow",
                        selectedSuggestion === suggestion.id && "ring-2 ring-violet-500"
                      )}
                    >
                      {/* Suggestion Header */}
                      <div
                        onClick={() =>
                          setSelectedSuggestion(
                            selectedSuggestion === suggestion.id ? null : suggestion.id
                          )
                        }
                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          {getTypeIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-slate-500 uppercase">
                              {suggestion.category}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded",
                                getConfidenceColor(suggestion.confidence)
                              )}
                            >
                              {Math.round(suggestion.confidence * 100)}% match
                            </span>
                          </div>
                          <p className="text-sm text-slate-900 line-clamp-2">
                            {suggestion.content}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedSuggestion === suggestion.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="border-t border-slate-100"
                          >
                            <div className="p-3 space-y-3">
                              {/* Full Content */}
                              <div className="text-sm text-slate-700 whitespace-pre-wrap">
                                {suggestion.content}
                              </div>

                              {/* Code Snippet */}
                              {suggestion.codeSnippet && suggestion.codeLanguage && (
                                <CodeSnippetDisplay
                                  code={suggestion.codeSnippet}
                                  language={suggestion.codeLanguage}
                                />
                              )}

                              {/* Reasoning */}
                              <div className="text-xs text-slate-500 italic bg-slate-50 px-3 py-2 rounded-lg">
                                {suggestion.reasoning}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleInsert(suggestion)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  Insert
                                </button>
                                <button
                                  onClick={() => handleCopy(suggestion)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  {copiedId === suggestion.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && suggestions.length === 0 && (
                <div className="text-center py-6">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    No suggestions yet. Suggestions will appear when the partner sends a message.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
