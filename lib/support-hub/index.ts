// Support Hub Library - Barrel Export
// Type definitions, category data, article data, and search functionality

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  // Article Types
  ArticleCategory,
  ArticleDifficulty,
  AudienceType,
  ArticleStatus,
  ContentFormat,
  SupportArticle,
  ArticleAuthor,
  SEOMetadata,

  // Category Types
  CategoryDefinition,
  SubcategoryDefinition,

  // Search Types
  SearchFilterType,
  SearchFilters,
  SearchOptions,
  SearchResult,
  SearchHighlight,
  SearchResponse,
  RecentSearch,
  SearchAnalytics,

  // FAQ Types
  ExtendedFAQItem,
  FAQSection,
  FAQSearchResult,

  // Training Types
  TrainingType,
  TrainingLevel,
  TrainingStatus,
  TrainingDocument,
  TrainingModule,
  TrainingLesson,
  Instructor,
  ModuleQuiz,
  QuizQuestion,
  ResourceLink,
  TrainingProgress,

  // API Documentation Types
  HTTPMethod,
  ParameterType,
  DataType,
  APIEndpoint,
  AuthenticationRequirement,
  APIParameter,
  ValidationRule,
  RequestBodySchema,
  JSONSchema,
  APIResponse,
  APIExample,
  RateLimit,
  SDKInfo,
  ChangelogEntry,

  // Navigation & UI Types
  NavigationItem,
  Breadcrumb,
  TableOfContents,

  // Analytics Types
  ArticleAnalytics,
  UserEngagement,

  // Notification Types
  NotificationType,
  Notification,

  // Comment & Feedback Types
  ArticleComment,
  ArticleFeedback,

  // Bookmark & History Types
  Bookmark,
  ReadingHistory,

  // Export & Utility Types
  ExportOptions,
  ArticleVersion,
} from "./types"

// ============================================
// CATEGORY EXPORTS
// ============================================

export {
  SUPPORT_CATEGORIES,
  CATEGORY_ICON_MAP,
  CATEGORY_COLOR_MAP,
  getCategoryById,
  getFeaturedCategories,
  getSortedCategories,
  getSubcategoryById,
  getTotalArticleCount,
  getCategoryStats,
  searchCategories,
  getCategoryNavigation,
  getCategoryRoute,
  getSubcategoryRoute,
  getArticleRoute,
} from "./categories"

// ============================================
// ARTICLE EXPORTS
// ============================================

export {
  calculateReadingTime,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesBySubcategory,
  getFeaturedArticles,
  getTrendingArticles,
  getPopularArticles,
  getRecentlyUpdatedArticles,
  getRelatedArticles,
  searchArticles,
  getArticleAnalytics,
  getArticlesByDifficulty,
  getArticlesByAudience,
} from "./articles"

// ============================================
// SEARCH EXPORTS
// ============================================

export {
  searchArticles as search,
  filterByCategory,
  filterByTags,
  sortByRelevance,
  buildSearchQuery,
  highlightSearchTerms,
  generateSearchSuggestions,
  getSearchHistory,
  saveSearchHistory,
  clearSearchHistory,
} from "./search"
