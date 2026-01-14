"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smile, Search, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  position?: "top" | "bottom"
}

interface EmojiCategory {
  id: string
  label: string
  emojis: string[]
}

const emojiCategories: EmojiCategory[] = [
  {
    id: "frequent",
    label: "Frequently Used",
    emojis: ["👍", "👋", "😊", "🙏", "✅", "❤️", "🎉", "🔥"]
  },
  {
    id: "smileys",
    label: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮", "😯", "😲", "😳", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "😈", "👿", "💀"]
  },
  {
    id: "gestures",
    label: "Gestures",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🙏", "✍️", "💪"]
  },
  {
    id: "objects",
    label: "Objects",
    emojis: ["💡", "📱", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "📷", "📸", "📹", "🎥", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💾", "💿", "📀"]
  },
  {
    id: "symbols",
    label: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "✅", "❌", "⭕", "❗", "❓", "💯", "🔔", "🔕", "📢", "📣", "💬", "💭", "🗯️", "⚡", "🔥", "✨", "🎉", "🎊", "🏆", "🥇", "🥈", "🥉"]
  }
]

const RECENT_EMOJIS_KEY = "chat_recent_emojis"
const MAX_RECENT = 16

export function EmojiPicker({
  onSelect,
  isOpen,
  onOpenChange,
  className,
  position = "top"
}: EmojiPickerProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("frequent")
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent emojis from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY)
      if (stored) {
        try {
          setRecentEmojis(JSON.parse(stored))
        } catch {
          setRecentEmojis([])
        }
      }
    }
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onOpenChange])

  const handleSelect = useCallback((emoji: string) => {
    onSelect(emoji)

    // Update recent emojis
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji)
      const updated = [emoji, ...filtered].slice(0, MAX_RECENT)
      if (typeof window !== "undefined") {
        localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(updated))
      }
      return updated
    })

    onOpenChange(false)
  }, [onSelect, onOpenChange])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) {
      // Show recent emojis as first category if available
      if (recentEmojis.length > 0) {
        return [
          { id: "recent", label: "Recent", emojis: recentEmojis },
          ...emojiCategories
        ]
      }
      return emojiCategories
    }

    const searchLower = search.toLowerCase()
    const allEmojis = emojiCategories.flatMap(c => c.emojis)
    const matched = allEmojis.filter(emoji => {
      // Simple search - in production, use emoji names/keywords
      return emoji.includes(searchLower)
    })

    return [{ id: "search", label: "Search Results", emojis: matched }]
  }, [search, recentEmojis])

  const displayCategories = search.trim()
    ? filteredCategories
    : filteredCategories.filter(c => c.id === activeCategory || c.id === "recent")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 10 : -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute z-50 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden",
            position === "top" ? "bottom-full mb-2" : "top-full mt-2",
            className
          )}
        >
          {/* Header */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emojis..."
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          {!search.trim() && (
            <div className="flex gap-1 p-1.5 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
              {recentEmojis.length > 0 && (
                <button
                  onClick={() => setActiveCategory("recent")}
                  className={cn(
                    "flex-shrink-0 p-1.5 rounded-md transition-colors",
                    activeCategory === "recent"
                      ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                  title="Recent"
                >
                  <Clock className="w-4 h-4" />
                </button>
              )}
              {emojiCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex-shrink-0 p-1.5 rounded-md text-base transition-colors",
                    activeCategory === category.id
                      ? "bg-teal-100 dark:bg-teal-900/30"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                  title={category.label}
                >
                  {category.emojis[0]}
                </button>
              ))}
            </div>
          )}

          {/* Emoji Grid */}
          <div className="max-h-48 overflow-y-auto p-2">
            {displayCategories.map((category) => (
              <div key={category.id} className="mb-2 last:mb-0">
                <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1 px-1">
                  {category.label}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {category.emojis.map((emoji, index) => (
                    <motion.button
                      key={`${category.id}-${emoji}-${index}`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelect(emoji)}
                      className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            {displayCategories.length === 0 && (
              <div className="py-8 text-center text-sm text-zinc-500">
                No emojis found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Trigger button component
export function EmojiPickerTrigger({
  onClick,
  isActive,
  disabled,
  className,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        isActive
          ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="Add emoji"
    >
      <Smile className="w-5 h-5" />
    </motion.button>
  )
}
