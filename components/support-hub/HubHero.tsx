"use client"

import { motion } from "framer-motion"
import { Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface HubHeroProps {
  title?: string
  subtitle?: string
  popularSearches?: string[]
  onSearch?: (query: string) => void
  onTagClick?: (tag: string) => void
}

export function HubHero({
  title = "How can we help you?",
  subtitle = "Search our knowledge base or browse categories below",
  popularSearches = [
    "API Integration",
    "Widget Setup",
    "POS Connection",
    "Troubleshooting",
    "Webhooks",
    "Authentication",
  ],
  onSearch,
  onTagClick,
}: HubHeroProps) {
  const [searchValue, setSearchValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim())
    }
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-sky-50 to-white" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-teal-200/50 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Support Hub</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative mb-8"
        >
          <div className="relative group">
            <motion.div
              animate={{
                scale: isFocused ? 1.02 : 1,
                boxShadow: isFocused
                  ? "0 20px 60px -15px rgba(20, 184, 166, 0.3)"
                  : "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-sky-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-premium overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-5">
                  <Search className={cn(
                    "w-6 h-6 transition-colors flex-shrink-0",
                    isFocused ? "text-teal-600" : "text-slate-400"
                  )} />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search for help articles, guides, or API docs..."
                    className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-lg"
                  />
                  {searchValue && (
                    <motion.button
                      type="submit"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-premium-teal transition-all"
                    >
                      Search
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Keyboard shortcut hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 0 : 1 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-400 pointer-events-none"
            >
              <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200 font-mono">⌘</kbd>
              <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200 font-mono">K</kbd>
            </motion.div>
          </div>
        </motion.form>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-sm text-slate-500 mr-2">Popular searches:</span>
          {popularSearches.map((tag, index) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick?.(tag)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white border border-slate-200/50 hover:border-teal-300 rounded-full text-sm text-slate-700 hover:text-teal-700 transition-all shadow-sm hover:shadow-md"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
