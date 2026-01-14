"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Search,
  Book,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
  ArrowLeft,
  Loader2,
  X,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  searchArticles,
  getSuggestedArticles,
  getArticleById,
  trackArticleView,
  trackArticleHelpful,
} from "@/lib/support/knowledge-base"
import type { KnowledgeArticle, ArticleSuggestion } from "@/lib/support/types"
import type { SearchResult } from "@/lib/support"

interface KnowledgeBasePanelProps {
  isOpen: boolean
  onClose: () => void
  onArticleSelect?: (article: KnowledgeArticle) => void
  topic?: string
  recentMessages?: string[]
  className?: string
}

export function KnowledgeBasePanel({
  isOpen,
  onClose,
  onArticleSelect,
  topic,
  recentMessages,
  className,
}: KnowledgeBasePanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>([])
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load suggestions on mount or when context changes
  useEffect(() => {
    if (isOpen && !selectedArticle) {
      const contextSuggestions = getSuggestedArticles({
        topic,
        recentMessages,
      })
      setSuggestions(contextSuggestions)
    }
  }, [isOpen, topic, recentMessages, selectedArticle])

  // Focus search input when panel opens
  useEffect(() => {
    if (isOpen && !selectedArticle) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen, selectedArticle])

  // Debounced search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    debounceRef.current = setTimeout(() => {
      const results = searchArticles(query, 5)
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
  }, [])

  // Handle article selection
  const handleArticleClick = useCallback(
    (article: KnowledgeArticle) => {
      trackArticleView(article.id)
      setSelectedArticle(article)
      onArticleSelect?.(article)
    },
    [onArticleSelect]
  )

  // Handle back to list
  const handleBack = useCallback(() => {
    setSelectedArticle(null)
  }, [])

  // Handle helpfulness feedback
  const handleHelpful = useCallback(
    (isHelpful: boolean) => {
      if (selectedArticle) {
        trackArticleHelpful(selectedArticle.id, isHelpful)
      }
    },
    [selectedArticle]
  )

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 rounded-t-2xl shadow-lg z-10",
        "max-h-[60%] flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {selectedArticle ? (
            <button
              onClick={handleBack}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-500" />
            </button>
          ) : (
            <Book className="w-4 h-4 text-teal-600" />
          )}
          <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
            {selectedArticle ? selectedArticle.title : "Help Center"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {selectedArticle ? (
        <ArticleView article={selectedArticle} onHelpful={handleHelpful} />
      ) : (
        <>
          {/* Search */}
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery && searchResults.length > 0 ? (
              <div className="p-2">
                <p className="px-2 py-1 text-xs text-zinc-500">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <ArticleListItem
                      key={result.article.id}
                      article={result.article}
                      snippet={result.snippet}
                      onClick={() => handleArticleClick(result.article)}
                    />
                  ))}
                </div>
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-sm text-zinc-500">No articles found</p>
                <p className="text-xs text-zinc-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="p-2">
                {suggestions.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      <p className="text-xs text-zinc-500">Suggested for you</p>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion) => (
                        <ArticleListItem
                          key={suggestion.article.id}
                          article={suggestion.article}
                          reason={suggestion.reason}
                          onClick={() => handleArticleClick(suggestion.article)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface ArticleListItemProps {
  article: KnowledgeArticle
  snippet?: string
  reason?: string
  onClick: () => void
}

function ArticleListItem({ article, snippet, reason, onClick }: ArticleListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
        <Book className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
          {article.title}
        </h4>
        <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
          {snippet || article.summary}
        </p>
        {reason && (
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">{reason}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded",
              article.difficulty === "beginner" &&
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              article.difficulty === "intermediate" &&
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              article.difficulty === "advanced" &&
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {article.difficulty}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.estimatedReadTime} min
          </span>
        </div>
      </div>
      <ChevronRight className="flex-shrink-0 w-4 h-4 text-zinc-400" />
    </button>
  )
}

interface ArticleViewProps {
  article: KnowledgeArticle
  onHelpful: (isHelpful: boolean) => void
}

function ArticleView({ article, onHelpful }: ArticleViewProps) {
  const [hasRated, setHasRated] = useState(false)

  const handleRate = (isHelpful: boolean) => {
    if (!hasRated) {
      onHelpful(isHelpful)
      setHasRated(true)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Article meta */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              article.difficulty === "beginner" &&
                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              article.difficulty === "intermediate" &&
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              article.difficulty === "advanced" &&
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {article.difficulty}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.estimatedReadTime} min read
          </span>
          <span className="text-xs text-zinc-400">
            Updated {article.lastUpdated.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Article content */}
      <div className="px-4 py-4">
        <ArticleContent content={article.content} />
      </div>

      {/* Helpfulness feedback */}
      <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          Was this article helpful?
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRate(true)}
            disabled={hasRated}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors",
              hasRated
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            Yes
          </button>
          <button
            onClick={() => handleRate(false)}
            disabled={hasRated}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors",
              hasRated
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
            )}
          >
            <ThumbsDown className="w-4 h-4" />
            No
          </button>
        </div>
        {hasRated && (
          <p className="text-xs text-zinc-500 mt-2">Thanks for your feedback!</p>
        )}
      </div>
    </div>
  )
}

function ArticleContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.trim().split("\n")

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {lines.map((line, index) => {
        const trimmed = line.trim()

        // Heading
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
              {trimmed.slice(2)}
            </h1>
          )
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
              {trimmed.slice(3)}
            </h2>
          )
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1">
              {trimmed.slice(4)}
            </h3>
          )
        }

        // Code block start
        if (trimmed.startsWith("```")) {
          return null // Handle code blocks specially
        }

        // List item
        if (trimmed.startsWith("- ") || trimmed.match(/^\d+\.\s/)) {
          const isOrdered = trimmed.match(/^\d+\.\s/)
          const text = isOrdered ? trimmed.replace(/^\d+\.\s/, "") : trimmed.slice(2)
          return (
            <li key={index} className="text-sm text-zinc-700 dark:text-zinc-300 ml-4">
              {text}
            </li>
          )
        }

        // Bold text
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <p key={index} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 my-1">
              {trimmed.slice(2, -2)}
            </p>
          )
        }

        // Regular paragraph
        if (trimmed) {
          // Handle inline code
          const parts = trimmed.split(/(`[^`]+`)/)
          return (
            <p key={index} className="text-sm text-zinc-700 dark:text-zinc-300 my-2">
              {parts.map((part, i) => {
                if (part.startsWith("`") && part.endsWith("`")) {
                  return (
                    <code
                      key={i}
                      className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono"
                    >
                      {part.slice(1, -1)}
                    </code>
                  )
                }
                return part
              })}
            </p>
          )
        }

        return null
      })}
    </div>
  )
}

// Quick search button component for embedding in chat
export function QuickSearchButton({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
        "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
        "text-zinc-700 dark:text-zinc-300",
        className
      )}
    >
      <Book className="w-4 h-4" />
      <span>Search Help</span>
    </button>
  )
}

// Inline article suggestion for chat messages
export function InlineArticleSuggestion({
  article,
  onClick,
}: {
  article: KnowledgeArticle
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-2 p-2 mt-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors text-left w-full"
    >
      <Book className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300 line-clamp-1">
          {article.title}
        </p>
        <p className="text-xs text-teal-600 dark:text-teal-400 line-clamp-1">
          {article.summary}
        </p>
      </div>
      <ExternalLink className="w-3 h-3 text-teal-500 flex-shrink-0" />
    </button>
  )
}
