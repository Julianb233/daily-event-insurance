// Search functionality for Support Hub
// Advanced search, filtering, sorting, and query building for articles

import type {
  SupportArticle,
  ArticleCategory,
  SearchFilters,
  SearchResult,
  SearchOptions,
  RecentSearch,
} from "./types"
import { getAllArticles, searchArticles as searchArticlesCore } from "./articles"

// ============================================
// CORE SEARCH FUNCTIONS
// ============================================

/**
 * Search articles with query string and optional filters
 * @param query - Search query string
 * @param filters - Optional filters to narrow results
 * @returns Array of search results sorted by relevance
 */
export function searchArticles(query: string, filters?: SearchFilters): SearchResult[] {
  const options: SearchOptions = {
    query: query.trim(),
    filters,
    sortBy: "relevance",
    sortOrder: "desc",
  }

  return searchArticlesCore(options)
}

/**
 * Filter articles by category
 * @param articles - Array of articles to filter
 * @param category - Category to filter by
 * @returns Filtered articles
 */
export function filterByCategory(
  articles: SupportArticle[],
  category: ArticleCategory
): SupportArticle[] {
  return articles.filter((article) => article.category === category)
}

/**
 * Filter articles by multiple categories
 * @param articles - Array of articles to filter
 * @param categories - Categories to filter by
 * @returns Filtered articles
 */
export function filterByCategories(
  articles: SupportArticle[],
  categories: ArticleCategory[]
): SupportArticle[] {
  if (categories.length === 0) return articles
  return articles.filter((article) => categories.includes(article.category))
}

/**
 * Filter articles by tags
 * @param articles - Array of articles to filter
 * @param tags - Tags to filter by (articles must have at least one tag)
 * @returns Filtered articles
 */
export function filterByTags(articles: SupportArticle[], tags: string[]): SupportArticle[] {
  if (tags.length === 0) return articles

  return articles.filter((article) => tags.some((tag) => article.tags.includes(tag)))
}

/**
 * Filter articles by all tags (articles must have ALL specified tags)
 * @param articles - Array of articles to filter
 * @param tags - Tags to filter by
 * @returns Filtered articles
 */
export function filterByAllTags(articles: SupportArticle[], tags: string[]): SupportArticle[] {
  if (tags.length === 0) return articles

  return articles.filter((article) => tags.every((tag) => article.tags.includes(tag)))
}

/**
 * Sort search results by relevance score
 * @param results - Search results to sort
 * @returns Sorted results (highest relevance first)
 */
export function sortByRelevance(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => b.relevanceScore - a.relevanceScore)
}

/**
 * Sort articles by publication date
 * @param articles - Articles to sort
 * @param order - Sort order (asc or desc)
 * @returns Sorted articles
 */
export function sortByDate(
  articles: SupportArticle[],
  order: "asc" | "desc" = "desc"
): SupportArticle[] {
  return [...articles].sort((a, b) => {
    const comparison = a.publishedAt.getTime() - b.publishedAt.getTime()
    return order === "asc" ? comparison : -comparison
  })
}

/**
 * Sort articles by view count (popularity)
 * @param articles - Articles to sort
 * @param order - Sort order (asc or desc)
 * @returns Sorted articles
 */
export function sortByPopularity(
  articles: SupportArticle[],
  order: "asc" | "desc" = "desc"
): SupportArticle[] {
  return [...articles].sort((a, b) => {
    const comparison = a.viewCount - b.viewCount
    return order === "asc" ? comparison : -comparison
  })
}

/**
 * Sort articles by helpfulness rating
 * @param articles - Articles to sort
 * @param order - Sort order (asc or desc)
 * @returns Sorted articles
 */
export function sortByHelpfulness(
  articles: SupportArticle[],
  order: "asc" | "desc" = "desc"
): SupportArticle[] {
  return [...articles].sort((a, b) => {
    const aRating = a.helpfulCount / (a.helpfulCount + a.notHelpfulCount || 1)
    const bRating = b.helpfulCount / (b.helpfulCount + b.notHelpfulCount || 1)
    const comparison = aRating - bRating
    return order === "asc" ? comparison : -comparison
  })
}

// ============================================
// ADVANCED FILTERING
// ============================================

/**
 * Apply comprehensive filters to articles
 * @param articles - Articles to filter
 * @param filters - Filter criteria
 * @returns Filtered articles
 */
export function applyFilters(articles: SupportArticle[], filters: SearchFilters): SupportArticle[] {
  let results = [...articles]

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    results = filterByCategories(results, filters.categories)
  }

  // Difficulty filter
  if (filters.difficulties && filters.difficulties.length > 0) {
    results = results.filter((article) => filters.difficulties!.includes(article.difficulty))
  }

  // Audience filter
  if (filters.audiences && filters.audiences.length > 0) {
    results = results.filter((article) =>
      filters.audiences!.some((aud) => article.audience.includes(aud))
    )
  }

  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    results = filterByTags(results, filters.tags)
  }

  // Date range filter
  if (filters.dateRange) {
    results = results.filter((article) => {
      const publishedTime = article.publishedAt.getTime()
      const startTime = filters.dateRange!.start.getTime()
      const endTime = filters.dateRange!.end.getTime()
      return publishedTime >= startTime && publishedTime <= endTime
    })
  }

  // Read time filter
  if (filters.minReadTime !== undefined) {
    results = results.filter((article) => article.estimatedReadTime >= filters.minReadTime!)
  }

  if (filters.maxReadTime !== undefined) {
    results = results.filter((article) => article.estimatedReadTime <= filters.maxReadTime!)
  }

  // Featured filter
  if (filters.featured !== undefined) {
    results = results.filter((article) => article.featured === filters.featured)
  }

  // Trending filter
  if (filters.trending !== undefined) {
    results = results.filter((article) => article.trending === filters.trending)
  }

  return results
}

// ============================================
// QUERY BUILDING
// ============================================

/**
 * Build search query from filters
 * @param filters - Search filters
 * @returns Query string representation
 */
export function buildSearchQuery(filters: SearchFilters): string {
  const parts: string[] = []

  if (filters.categories && filters.categories.length > 0) {
    parts.push(`category:${filters.categories.join(",")}`)
  }

  if (filters.difficulties && filters.difficulties.length > 0) {
    parts.push(`difficulty:${filters.difficulties.join(",")}`)
  }

  if (filters.audiences && filters.audiences.length > 0) {
    parts.push(`audience:${filters.audiences.join(",")}`)
  }

  if (filters.tags && filters.tags.length > 0) {
    parts.push(`tags:${filters.tags.join(",")}`)
  }

  if (filters.featured) {
    parts.push("featured:true")
  }

  if (filters.trending) {
    parts.push("trending:true")
  }

  return parts.join(" ")
}

/**
 * Parse query string into filters
 * @param query - Query string to parse
 * @returns Search filters
 */
export function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {}
  const parts = query.split(" ").filter(Boolean)

  parts.forEach((part) => {
    const [key, value] = part.split(":")
    if (!value) return

    switch (key) {
      case "category":
        filters.categories = value.split(",") as ArticleCategory[]
        break
      case "difficulty":
        filters.difficulties = value.split(",") as any[]
        break
      case "audience":
        filters.audiences = value.split(",") as any[]
        break
      case "tags":
        filters.tags = value.split(",")
        break
      case "featured":
        filters.featured = value === "true"
        break
      case "trending":
        filters.trending = value === "true"
        break
    }
  })

  return filters
}

// ============================================
// SEARCH HIGHLIGHTING
// ============================================

/**
 * Highlight search terms in text
 * @param text - Text to highlight
 * @param terms - Terms to highlight
 * @param wrapperTag - HTML tag to wrap highlighted terms (default: mark)
 * @returns Text with highlighted terms
 */
export function highlightSearchTerms(
  text: string,
  terms: string[],
  wrapperTag: string = "mark"
): string {
  if (terms.length === 0) return text

  let result = text
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length) // Longer terms first

  sortedTerms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi")
    result = result.replace(regex, `<${wrapperTag}>$1</${wrapperTag}>`)
  })

  return result
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ============================================
// SEARCH SUGGESTIONS
// ============================================

/**
 * Generate search suggestions based on query
 * @param query - Partial query string
 * @param limit - Maximum number of suggestions
 * @returns Array of suggested queries
 */
export function generateSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim()) return []

  const articles = getAllArticles()
  const queryLower = query.toLowerCase()
  const suggestions = new Set<string>()

  // Collect suggestions from titles
  articles.forEach((article) => {
    if (article.title.toLowerCase().includes(queryLower)) {
      suggestions.add(article.title)
    }
  })

  // Collect suggestions from tags
  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
  })

  // Collect suggestions from categories
  articles.forEach((article) => {
    const categoryLabel = article.category.replace(/-/g, " ")
    if (categoryLabel.toLowerCase().includes(queryLower)) {
      suggestions.add(categoryLabel)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}

/**
 * Get popular search terms
 * @param limit - Maximum number of terms to return
 * @returns Array of popular search terms
 */
export function getPopularSearchTerms(limit: number = 10): string[] {
  // This would typically come from analytics
  // For now, return common terms based on article tags
  const articles = getAllArticles()
  const tagCounts = new Map<string, number>()

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

// ============================================
// SEARCH HISTORY
// ============================================

const SEARCH_HISTORY_KEY = "dei-support-search-history"
const MAX_HISTORY_ITEMS = 20

/**
 * Get search history from localStorage
 * @returns Array of recent searches
 */
export function getSearchHistory(): RecentSearch[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (!stored) return []

    const history = JSON.parse(stored)
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }))
  } catch (error) {
    console.error("Error reading search history:", error)
    return []
  }
}

/**
 * Save search to history
 * @param query - Search query
 * @param filters - Search filters
 * @param resultCount - Number of results
 */
export function saveSearchHistory(
  query: string,
  filters: SearchFilters | undefined,
  resultCount: number
): void {
  if (typeof window === "undefined") return
  if (!query.trim()) return

  try {
    const history = getSearchHistory()

    const newSearch: RecentSearch = {
      id: `search-${Date.now()}`,
      query,
      filters,
      timestamp: new Date(),
      resultCount,
    }

    // Remove duplicate queries
    const filtered = history.filter((item) => item.query !== query)

    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving search history:", error)
  }
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch (error) {
    console.error("Error clearing search history:", error)
  }
}

/**
 * Remove specific search from history
 * @param searchId - ID of search to remove
 */
export function removeSearchFromHistory(searchId: string): void {
  if (typeof window === "undefined") return

  try {
    const history = getSearchHistory()
    const updated = history.filter((item) => item.id !== searchId)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error removing search from history:", error)
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate search result statistics
 * @param results - Search results
 * @returns Statistics object
 */
export function calculateSearchStats(results: SearchResult[]) {
  if (results.length === 0) {
    return {
      totalResults: 0,
      averageRelevance: 0,
      categoryBreakdown: {},
      difficultyBreakdown: {},
    }
  }

  const categoryBreakdown: Record<string, number> = {}
  const difficultyBreakdown: Record<string, number> = {}
  let totalRelevance = 0

  results.forEach((result) => {
    totalRelevance += result.relevanceScore
    categoryBreakdown[result.article.category] =
      (categoryBreakdown[result.article.category] || 0) + 1
    difficultyBreakdown[result.article.difficulty] =
      (difficultyBreakdown[result.article.difficulty] || 0) + 1
  })

  return {
    totalResults: results.length,
    averageRelevance: totalRelevance / results.length,
    categoryBreakdown,
    difficultyBreakdown,
  }
}

/**
 * Get "Did you mean" suggestion for misspelled queries
 * @param query - Search query
 * @returns Suggested query or null
 */
export function getDidYouMeanSuggestion(query: string): string | null {
  // This would typically use a spell-checking library or API
  // For now, return null (no suggestion)
  return null
}
