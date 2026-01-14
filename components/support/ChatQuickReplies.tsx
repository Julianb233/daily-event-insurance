"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, HelpCircle, Settings, AlertTriangle, Zap, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConversationTopic } from "@/lib/support/types"

export interface QuickReply {
  id: string
  label: string
  message: string
  category: QuickReplyCategory
  icon?: React.ReactNode
}

export type QuickReplyCategory =
  | "getting_started"
  | "integration"
  | "troubleshooting"
  | "pricing"
  | "general"

interface ChatQuickRepliesProps {
  onSelect: (message: string) => void
  topic?: ConversationTopic
  currentPage?: string
  isExpanded?: boolean
  className?: string
}

const categoryConfig: Record<QuickReplyCategory, { label: string; icon: React.ReactNode; color: string }> = {
  getting_started: {
    label: "Getting Started",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800"
  },
  integration: {
    label: "Integration",
    icon: <Settings className="w-3.5 h-3.5" />,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
  },
  troubleshooting: {
    label: "Troubleshooting",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
  },
  pricing: {
    label: "Pricing",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
  },
  general: {
    label: "General",
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
  }
}

const defaultQuickReplies: QuickReply[] = [
  // Getting Started
  { id: "gs-1", label: "How do I get started?", message: "How do I get started with the integration?", category: "getting_started" },
  { id: "gs-2", label: "Setup requirements", message: "What are the requirements to set up the widget?", category: "getting_started" },
  { id: "gs-3", label: "Time to integrate", message: "How long does the integration typically take?", category: "getting_started" },

  // Integration
  { id: "int-1", label: "Widget installation", message: "How do I install the widget on my website?", category: "integration" },
  { id: "int-2", label: "API documentation", message: "Where can I find the API documentation?", category: "integration" },
  { id: "int-3", label: "Connect my POS", message: "How do I connect my POS system?", category: "integration" },
  { id: "int-4", label: "Webhook setup", message: "How do I configure webhooks for real-time updates?", category: "integration" },

  // Troubleshooting
  { id: "ts-1", label: "Widget not showing", message: "My widget is not showing up on my site. Can you help?", category: "troubleshooting" },
  { id: "ts-2", label: "API errors", message: "I'm getting errors when calling the API. What should I check?", category: "troubleshooting" },
  { id: "ts-3", label: "Payment issues", message: "Payments are not going through. How can I debug this?", category: "troubleshooting" },

  // Pricing
  { id: "pr-1", label: "Pricing plans", message: "What are your pricing plans?", category: "pricing" },
  { id: "pr-2", label: "Commission rates", message: "What are the commission rates for partners?", category: "pricing" },

  // General
  { id: "gen-1", label: "Talk to a human", message: "I would like to speak with a human support agent.", category: "general" },
  { id: "gen-2", label: "Schedule a demo", message: "Can I schedule a demo with your team?", category: "general" },
]

// Contextual suggestions based on current page
const pageContextSuggestions: Record<string, string[]> = {
  "/pricing": ["pr-1", "pr-2", "gs-1"],
  "/docs": ["int-2", "int-4", "ts-2"],
  "/partner": ["gs-1", "int-1", "pr-2"],
  "/faq": ["gen-1", "gen-2", "gs-1"],
}

// Topic-based priority
const topicPriority: Record<ConversationTopic, QuickReplyCategory[]> = {
  onboarding: ["getting_started", "integration", "general"],
  widget_install: ["integration", "troubleshooting", "getting_started"],
  api_integration: ["integration", "troubleshooting", "getting_started"],
  pos_setup: ["integration", "troubleshooting", "getting_started"],
  troubleshooting: ["troubleshooting", "integration", "general"],
}

export function ChatQuickReplies({
  onSelect,
  topic = "onboarding",
  currentPage,
  isExpanded = true,
  className,
}: ChatQuickRepliesProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuickReplyCategory | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const prioritizedReplies = useMemo(() => {
    // Get page-specific suggestions if available
    const pageSuggestionIds = currentPage
      ? pageContextSuggestions[currentPage] || []
      : []

    const priority = topicPriority[topic] || topicPriority.onboarding

    // Sort replies by category priority and page context
    return [...defaultQuickReplies].sort((a, b) => {
      // Page context suggestions come first
      const aPagePriority = pageSuggestionIds.indexOf(a.id)
      const bPagePriority = pageSuggestionIds.indexOf(b.id)

      if (aPagePriority !== -1 && bPagePriority !== -1) {
        return aPagePriority - bPagePriority
      }
      if (aPagePriority !== -1) return -1
      if (bPagePriority !== -1) return 1

      // Then sort by category priority
      const aCatPriority = priority.indexOf(a.category)
      const bCatPriority = priority.indexOf(b.category)

      return (aCatPriority === -1 ? 999 : aCatPriority) - (bCatPriority === -1 ? 999 : bCatPriority)
    })
  }, [topic, currentPage])

  const categories = useMemo(() => {
    const cats = new Set<QuickReplyCategory>()
    prioritizedReplies.forEach(r => cats.add(r.category))
    return Array.from(cats)
  }, [prioritizedReplies])

  const filteredReplies = useMemo(() => {
    if (!selectedCategory) {
      // Show top 4 when no category selected
      return prioritizedReplies.slice(0, 4)
    }
    return prioritizedReplies.filter(r => r.category === selectedCategory)
  }, [prioritizedReplies, selectedCategory])

  if (!isExpanded) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("space-y-3", className)}
    >
      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-200",
            !selectedCategory
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
          )}
        >
          Suggested
        </motion.button>

        {(showAllCategories ? categories : categories.slice(0, 3)).map((category) => {
          const config = categoryConfig[category]
          return (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-200",
                selectedCategory === category
                  ? config.color
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
              )}
            >
              {config.icon}
              {config.label}
            </motion.button>
          )
        })}

        {categories.length > 3 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center gap-0.5 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <ChevronDown className={cn("w-3 h-3 transition-transform", showAllCategories && "rotate-180")} />
            {showAllCategories ? "Less" : `+${categories.length - 3}`}
          </motion.button>
        )}
      </div>

      {/* Quick Reply Buttons */}
      <AnimatePresence mode="popLayout">
        <div className="flex flex-wrap gap-2">
          {filteredReplies.map((reply, index) => (
            <motion.button
              key={reply.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(reply.message)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200",
                "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
                "border-zinc-200 dark:border-zinc-700",
                "hover:border-teal-300 dark:hover:border-teal-700",
                "hover:bg-teal-50 dark:hover:bg-teal-900/20",
                "hover:text-teal-700 dark:hover:text-teal-400",
                "shadow-sm hover:shadow"
              )}
            >
              {reply.label}
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}

// Compact version for inline suggestions
export function ChatQuickRepliesInline({
  onSelect,
  suggestions,
  className,
}: {
  onSelect: (message: string) => void
  suggestions: Array<{ id: string; label: string; message: string }>
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion.message)}
          className="px-2 py-1 text-[10px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {suggestion.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
