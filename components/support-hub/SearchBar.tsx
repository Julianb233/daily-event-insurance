"use client"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  suggestions?: string[]
}

export function SearchBar({
  onSearch,
  placeholder = "Search documentation, guides, and FAQs...",
  suggestions = []
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className={`
          relative flex items-center
          bg-white/80 backdrop-blur-xl
          border-2 transition-all duration-300
          rounded-2xl overflow-hidden
          shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
          ${isFocused ? "border-teal-500 shadow-teal-500/20" : "border-white/40"}
        `}>
          <div className="pl-6 pr-4 text-slate-400">
            <Search className="w-6 h-6" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="
              flex-1 py-5 pr-6
              bg-transparent
              text-lg text-slate-900 placeholder-slate-400
              outline-none
            "
          />

          {query && (
            <motion.button
              type="submit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                mr-3 px-6 py-2.5
                bg-gradient-to-r from-teal-500 to-blue-500
                text-white font-semibold rounded-xl
                hover:shadow-lg hover:shadow-teal-500/30
                transition-all duration-300
                flex items-center gap-2
              "
            >
              <Sparkles className="w-4 h-4" />
              Search
            </motion.button>
          )}
        </div>
      </motion.form>

      {/* Suggestions */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              absolute top-full mt-2 w-full
              bg-white/90 backdrop-blur-xl
              border border-white/40
              rounded-xl
              shadow-xl
              overflow-hidden
              z-50
            "
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setQuery(suggestion)
                  if (onSearch) onSearch(suggestion)
                }}
                className="
                  w-full px-6 py-3 text-left
                  hover:bg-teal-50/50
                  text-slate-700
                  transition-colors duration-200
                  border-b border-slate-100 last:border-b-0
                "
              >
                <Search className="w-4 h-4 inline mr-3 text-slate-400" />
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
