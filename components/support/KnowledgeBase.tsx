"use client"

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  type KeyboardEvent,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Search,
  Rocket,
  Code,
  CreditCard,
  FileCheck,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  X,
  MessageCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  faqData,
  faqCategories,
  searchFAQsRanked,
  getPopularFAQs,
  getRecentlyViewedFAQs,
  trackFAQView,
  type FAQCategory,
  type FAQItem,
  type FAQCategoryInfo,
} from "@/lib/data/faq-data"

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Code,
  CreditCard,
  FileCheck,
  Wrench,
}

interface KnowledgeBaseProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showCategories?: boolean
  showFeedback?: boolean
  showPopular?: boolean
  showRecentlyViewed?: boolean
  showContactCTA?: boolean
  initialCategory?: FAQCategory | null
  maxItems?: number
  className?: string
  onContactSupport?: () => void
}

export function KnowledgeBase({
  title = "Knowledge Base",
  subtitle = "Find answers to common questions about Daily Event Insurance",
  showSearch = true,
  showCategories = true,
  showFeedback = true,
  showPopular = true,
  showRecentlyViewed = true,
  showContactCTA = true,
  initialCategory = null,
  maxItems,
  className,
  onContactSupport,
}: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(initialCategory)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "helpful" | "not-helpful">>({})
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [recentlyViewed, setRecentlyViewed] = useState<FAQItem[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Load recently viewed on mount
  useEffect(() => {
    setRecentlyViewed(getRecentlyViewedFAQs())
  }, [])

  // Filter and rank FAQs based on search and category
  const searchResults = useMemo(() => {
    const results = searchFAQsRanked(searchQuery, selectedCategory || undefined)
    if (maxItems) {
      return results.slice(0, maxItems)
    }
    return results
  }, [searchQuery, selectedCategory, maxItems])

  const filteredFAQs = useMemo(() => {
    return searchResults.map((r) => r.faq)
  }, [searchResults])

  // Popular FAQs
  const popularFAQs = useMemo(() => getPopularFAQs(5), [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const itemCount = filteredFAQs.length

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 1, itemCount - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 1, -1))
          break
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < itemCount) {
            toggleItem(filteredFAQs[focusedIndex].id)
          }
          break
        case "Escape":
          e.preventDefault()
          setFocusedIndex(-1)
          searchInputRef.current?.blur()
          break
      }
    },
    [filteredFAQs, focusedIndex]
  )

  // Focus on item when focusedIndex changes
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
        // Track view when opening
        trackFAQView(id)
        setRecentlyViewed(getRecentlyViewedFAQs())
      }
      return newSet
    })
  }, [])

  const handleFeedback = useCallback(async (faqId: string, isHelpful: boolean) => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [faqId]: isHelpful ? "helpful" : "not-helpful",
    }))

    // Send feedback to API
    try {
      await fetch("/api/support/faq-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqId, isHelpful }),
      }).catch(() => {
        // Silently fail - feedback is non-critical
      })
    } catch {
      // Ignore errors for feedback
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setFocusedIndex(-1)
    searchInputRef.current?.focus()
  }, [])

  const handleContactSupport = useCallback(() => {
    if (onContactSupport) {
      onContactSupport()
    } else {
      // Default: try to open chat widget
      const chatButton = document.querySelector(
        '[aria-label="Open support chat"]'
      ) as HTMLButtonElement
      chatButton?.click()
    }
  }, [onContactSupport])

  const hasSearchQuery = searchQuery.trim().length > 0
  const noResults = hasSearchQuery && filteredFAQs.length === 0

  return (
    <section className={cn("relative bg-gray-50 py-16 md:py-24 overflow-hidden", className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {title.includes("Knowledge") ? (
              <>
                Knowledge <span className="text-teal-500">Base</span>
              </>
            ) : title.includes("FAQ") ? (
              <>
                Frequently Asked <span className="text-teal-500">Questions</span>
              </>
            ) : (
              title
            )}
          </h2>
          {subtitle && (
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setFocusedIndex(-1)
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setFocusedIndex(0)
                  }
                }}
                placeholder="Search for answers... (use arrow keys to navigate)"
                className="w-full pl-12 pr-12 py-3 md:py-4 text-base md:text-lg rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                aria-label="Search knowledge base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            {hasSearchQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-500 mt-2"
              >
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Category Tabs */}
        {showCategories && !hasSearchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  !selectedCategory
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                All Topics
              </button>
              {faqCategories.map((category) => {
                const IconComponent = categoryIcons[category.icon]
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                      selectedCategory === category.id
                        ? "bg-teal-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {category.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Recently Viewed Section */}
        {showRecentlyViewed && recentlyViewed.length > 0 && !hasSearchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500">Recently Viewed</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentlyViewed.slice(0, 5).map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => {
                    setOpenItems(new Set([faq.id]))
                    // Scroll to the item
                    setTimeout(() => {
                      document.getElementById(`faq-${faq.id}`)?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                    }, 100)
                  }}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors truncate max-w-[200px]"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular Articles Section */}
        {showPopular && !hasSearchQuery && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <h3 className="text-sm font-medium text-gray-500">Popular Articles</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popularFAQs.map((faq) => {
                const categoryInfo = faqCategories.find((c) => c.id === faq.category)
                const IconComponent = categoryInfo ? categoryIcons[categoryInfo.icon] : null
                return (
                  <button
                    key={faq.id}
                    onClick={() => {
                      setOpenItems(new Set([faq.id]))
                      setTimeout(() => {
                        document.getElementById(`faq-${faq.id}`)?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                      }, 100)
                    }}
                    className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                      {IconComponent && <IconComponent className="w-4 h-4 text-teal-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {faq.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {categoryInfo?.label}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Main FAQ Content */}
        <div
          ref={listRef}
          onKeyDown={handleKeyDown}
          role="list"
          aria-label="FAQ list"
        >
          {noResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;. Try different
                keywords or browse by category.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear search
                </button>
                {showContactCTA && (
                  <button
                    onClick={handleContactSupport}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Category Header for filtered view */}
              {selectedCategory && !hasSearchQuery && (
                <CategoryHeader
                  category={faqCategories.find((c) => c.id === selectedCategory)!}
                />
              )}

              {/* FAQ Accordion */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {filteredFAQs.map((faq, index) => (
                  <FAQAccordionItem
                    key={faq.id}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    faq={faq}
                    index={index}
                    isOpen={openItems.has(faq.id)}
                    isFocused={focusedIndex === index}
                    onToggle={() => toggleItem(faq.id)}
                    showFeedback={showFeedback}
                    feedbackStatus={feedbackGiven[faq.id]}
                    onFeedback={handleFeedback}
                    isLast={index === filteredFAQs.length - 1}
                    searchQuery={searchQuery}
                    matchType={searchResults[index]?.matchType}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contact Support CTA */}
        {showContactCTA && !noResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 md:p-8 text-center text-white">
              <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-teal-100 mb-6 max-w-md mx-auto">
                Our support team is here to help. Get in touch and we&apos;ll respond
                within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleContactSupport}
                  className="px-6 py-3 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Support
                </button>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-teal-400/20 text-white rounded-lg hover:bg-teal-400/30 transition-colors font-medium"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Category Header Component
function CategoryHeader({ category }: { category: FAQCategoryInfo }) {
  const IconComponent = categoryIcons[category.icon]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 mb-4 px-2"
    >
      <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
        {IconComponent && <IconComponent className="w-5 h-5 text-teal-600" />}
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{category.label}</h3>
        <p className="text-sm text-gray-500">{category.description}</p>
      </div>
    </motion.div>
  )
}

// FAQ Accordion Item Component
interface FAQAccordionItemProps {
  faq: FAQItem
  index: number
  isOpen: boolean
  isFocused: boolean
  onToggle: () => void
  showFeedback: boolean
  feedbackStatus?: "helpful" | "not-helpful"
  onFeedback: (faqId: string, isHelpful: boolean) => void
  isLast: boolean
  searchQuery?: string
  matchType?: string
}

const FAQAccordionItem = forwardRef<HTMLButtonElement, FAQAccordionItemProps>(
  function FAQAccordionItem(
    {
      faq,
      index,
      isOpen,
      isFocused,
      onToggle,
      showFeedback,
      feedbackStatus,
      onFeedback,
      isLast,
      searchQuery,
      matchType,
    },
    ref
  ) {

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
    if (words.length === 0) return text

    const regex = new RegExp(`(${words.join("|")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, i) => {
      if (words.some((w) => part.toLowerCase() === w)) {
        return (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <motion.div
      id={`faq-${faq.id}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      viewport={{ once: true }}
      className={cn(!isLast && "border-b border-gray-200")}
      role="listitem"
    >
      <button
        ref={ref}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle()
          }
        }}
        className={cn(
          "w-full py-5 md:py-6 px-4 md:px-6 flex items-start justify-between gap-4 text-left group transition-colors duration-300",
          isFocused
            ? "bg-teal-50 ring-2 ring-inset ring-teal-500"
            : "hover:bg-teal-50/50"
        )}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
      >
        <div className="flex-1">
          <span className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
            {searchQuery ? highlightText(faq.question, searchQuery) : faq.question}
          </span>
          {matchType && searchQuery && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">
              {matchType === "title" ? "Title match" : matchType === "keyword" ? "Keyword match" : "Content match"}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-teal-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
            role="region"
            aria-labelledby={`faq-${faq.id}`}
          >
            <div className="pb-5 md:pb-6 px-4 md:px-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {searchQuery ? highlightText(faq.answer, searchQuery) : faq.answer}
              </p>

              {/* Related Articles */}
              {faq.relatedArticles && faq.relatedArticles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Related articles:</p>
                  <div className="flex flex-wrap gap-2">
                    {faq.relatedArticles.map((relatedId) => {
                      const related = faqData.find((f) => f.id === relatedId)
                      if (!related) return null
                      return (
                        <button
                          key={relatedId}
                          onClick={(e) => {
                            e.stopPropagation()
                            document.getElementById(`faq-${relatedId}`)?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                          }}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-teal-100 hover:text-teal-700 transition-colors"
                        >
                          {related.question.slice(0, 50)}...
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {showFeedback && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {feedbackStatus ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      {feedbackStatus === "helpful" ? (
                        <>
                          <ThumbsUp className="w-4 h-4 text-green-500" />
                          <span>Thanks for your feedback!</span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="w-4 h-4 text-red-500" />
                          <span>
                            Thanks for letting us know.{" "}
                            <a
                              href="/contact"
                              className="text-teal-600 hover:underline"
                            >
                              Contact support
                            </a>{" "}
                            for more help.
                          </span>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Was this helpful?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onFeedback(faq.id, true)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                          aria-label="Yes, this was helpful"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="hidden sm:inline">Yes</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onFeedback(faq.id, false)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
                          aria-label="No, this was not helpful"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="hidden sm:inline">No</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// Export for use in pages
export default KnowledgeBase
