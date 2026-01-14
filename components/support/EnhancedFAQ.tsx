"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Search,
  HelpCircle,
  Code,
  Handshake,
  FileCheck,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  X,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  faqData,
  faqCategories,
  searchFAQs,
  type FAQCategory,
  type FAQItem,
  type FAQCategoryInfo,
} from "@/lib/support/faq-data"

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  HelpCircle,
  Code,
  Handshake,
  FileCheck,
  Wrench,
}

interface EnhancedFAQProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showCategories?: boolean
  showFeedback?: boolean
  initialCategory?: FAQCategory | null
  maxItems?: number
  className?: string
}

export function EnhancedFAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about partnering with Daily Event Insurance",
  showSearch = true,
  showCategories = true,
  showFeedback = true,
  initialCategory = null,
  maxItems,
  className,
}: EnhancedFAQProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(initialCategory)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "helpful" | "not-helpful">>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let results = searchFAQs(searchQuery, selectedCategory || undefined)
    if (maxItems) {
      results = results.slice(0, maxItems)
    }
    return results
  }, [searchQuery, selectedCategory, maxItems])

  // Group FAQs by category for display
  const groupedFAQs = useMemo(() => {
    if (selectedCategory || searchQuery) {
      return { [selectedCategory || "search"]: filteredFAQs }
    }

    const groups: Record<string, FAQItem[]> = {}
    filteredFAQs.forEach((faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = []
      }
      groups[faq.category].push(faq)
    })
    return groups
  }, [filteredFAQs, selectedCategory, searchQuery])

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleFeedback = useCallback(async (faqId: string, isHelpful: boolean) => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [faqId]: isHelpful ? "helpful" : "not-helpful",
    }))

    // In production, you would send this to your analytics/backend
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

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedCategory(null)
    setShowMobileFilters(false)
  }, [])

  const hasActiveFilters = searchQuery || selectedCategory

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
            {title.includes("Questions") ? (
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

        {/* Search and Filters */}
        {(showSearch || showCategories) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            {/* Search Bar */}
            {showSearch && (
              <div className="relative max-w-2xl mx-auto mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-12 pr-12 py-3 md:py-4 text-base md:text-lg rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* Category Filters - Desktop */}
            {showCategories && (
              <>
                <div className="hidden md:flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      !selectedCategory
                        ? "bg-teal-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    All Categories
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

                {/* Category Filters - Mobile */}
                <div className="md:hidden">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <span className="flex items-center gap-2 text-gray-700">
                      <Filter className="w-4 h-4" />
                      {selectedCategory
                        ? faqCategories.find((c) => c.id === selectedCategory)?.label
                        : "All Categories"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        showMobileFilters && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {showMobileFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <button
                            onClick={() => {
                              setSelectedCategory(null)
                              setShowMobileFilters(false)
                            }}
                            className={cn(
                              "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors",
                              !selectedCategory
                                ? "bg-teal-50 text-teal-600"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <HelpCircle className="w-5 h-5" />
                            All Categories
                          </button>
                          {faqCategories.map((category) => {
                            const IconComponent = categoryIcons[category.icon]
                            return (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setSelectedCategory(category.id)
                                  setShowMobileFilters(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-t border-gray-100",
                                  selectedCategory === category.id
                                    ? "bg-teal-50 text-teal-600"
                                    : "text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                {IconComponent && <IconComponent className="w-5 h-5" />}
                                <div>
                                  <span className="font-medium">{category.label}</span>
                                  <p className="text-xs text-gray-500">{category.description}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6 px-4 py-2 bg-teal-50 rounded-lg"
          >
            <span className="text-sm text-teal-700">
              Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in ${faqCategories.find((c) => c.id === selectedCategory)?.label}`}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 hover:text-teal-800 font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* FAQ Content */}
        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFAQs).map(([categoryKey, faqs]) => {
              const categoryInfo = faqCategories.find((c) => c.id === categoryKey)
              const showCategoryHeader = !selectedCategory && !searchQuery && categoryInfo

              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {showCategoryHeader && (
                    <CategoryHeader category={categoryInfo} />
                  )}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    {faqs.map((faq, index) => (
                      <FAQAccordionItem
                        key={faq.id}
                        faq={faq}
                        index={index}
                        isOpen={openItems.has(faq.id)}
                        onToggle={() => toggleItem(faq.id)}
                        showFeedback={showFeedback}
                        feedbackStatus={feedbackGiven[faq.id]}
                        onFeedback={handleFeedback}
                        isLast={index === faqs.length - 1}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-base md:text-lg">
            Still have questions?{" "}
            <a
              href="/contact"
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-4"
            >
              Contact our team
            </a>{" "}
            or use our{" "}
            <button
              onClick={() => {
                // Trigger chat widget if available
                const chatButton = document.querySelector('[aria-label="Open support chat"]') as HTMLButtonElement
                chatButton?.click()
              }}
              className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-4"
            >
              live chat
            </button>
            .
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Category Header Component
function CategoryHeader({ category }: { category: FAQCategoryInfo }) {
  const IconComponent = categoryIcons[category.icon]

  return (
    <div className="flex items-center gap-3 mb-4 px-2">
      <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
        {IconComponent && <IconComponent className="w-5 h-5 text-teal-600" />}
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{category.label}</h3>
        <p className="text-sm text-gray-500">{category.description}</p>
      </div>
    </div>
  )
}

// FAQ Accordion Item Component
interface FAQAccordionItemProps {
  faq: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
  showFeedback: boolean
  feedbackStatus?: "helpful" | "not-helpful"
  onFeedback: (faqId: string, isHelpful: boolean) => void
  isLast: boolean
}

function FAQAccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
  showFeedback,
  feedbackStatus,
  onFeedback,
  isLast,
}: FAQAccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={cn(!isLast && "border-b border-gray-200")}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 md:py-6 px-4 md:px-6 flex items-start justify-between gap-4 text-left group hover:bg-teal-50/50 transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 pr-2">
          {faq.question}
        </span>
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 md:pb-6 px-4 md:px-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </p>

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
}

// Export for use in pages
export default EnhancedFAQ
