// TypeScript interfaces for Daily Event Insurance Support Hub
// Comprehensive type system for articles, search, FAQs, training, and API docs

import type { FAQCategory, FAQItem } from "../support/faq-data"

// ============================================
// ARTICLE SYSTEM
// ============================================

export type ArticleCategory =
  | "getting-started"
  | "integrations"
  | "api-reference"
  | "pos-systems"
  | "troubleshooting"
  | "faq"
  | "training"
  | "enterprise"

export type ArticleDifficulty = "beginner" | "intermediate" | "advanced"

export type AudienceType = "partner" | "developer" | "support-agent" | "enterprise"

export type ArticleStatus = "draft" | "published" | "archived" | "under-review"

export type ContentFormat = "markdown" | "html" | "interactive" | "video"

export interface SupportArticle {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  contentFormat: ContentFormat
  category: ArticleCategory
  subcategory?: string
  tags: string[]
  difficulty: ArticleDifficulty
  audience: AudienceType[]
  relatedArticles: string[]
  prerequisites?: string[]
  estimatedReadTime: number
  publishedAt: Date
  updatedAt: Date
  author: ArticleAuthor
  status: ArticleStatus
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  bookmarkCount: number
  featured: boolean
  trending: boolean
  lastReviewedAt?: Date
  seo: SEOMetadata
  version: string
}

export interface ArticleAuthor {
  id: string
  name: string
  role: string
  avatarUrl?: string
  bio?: string
}

export interface SEOMetadata {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl?: string
  ogImage?: string
}

// ============================================
// CATEGORY SYSTEM
// ============================================

export interface CategoryDefinition {
  id: ArticleCategory
  label: string
  description: string
  icon: string
  iconColor: string
  backgroundColor: string
  order: number
  articleCount: number
  subcategories?: SubcategoryDefinition[]
  featured: boolean
  parentPath?: string
}

export interface SubcategoryDefinition {
  id: string
  label: string
  description: string
  articleCount: number
  icon?: string
}

// ============================================
// SEARCH SYSTEM
// ============================================

export type SearchFilterType = "category" | "difficulty" | "audience" | "tag" | "date"

export interface SearchFilters {
  categories?: ArticleCategory[]
  difficulties?: ArticleDifficulty[]
  audiences?: AudienceType[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  minReadTime?: number
  maxReadTime?: number
  featured?: boolean
  trending?: boolean
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  sortBy?: "relevance" | "date" | "popularity" | "title"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

export interface SearchResult {
  article: SupportArticle
  relevanceScore: number
  matchedTerms: string[]
  snippet: string
  highlights: SearchHighlight[]
  rank: number
}

export interface SearchHighlight {
  field: "title" | "summary" | "content" | "tags"
  text: string
  positions: { start: number; end: number }[]
}

export interface SearchResponse {
  results: SearchResult[]
  totalResults: number
  query: string
  filters: SearchFilters
  executionTime: number
  suggestions?: string[]
  didYouMean?: string
}

export interface RecentSearch {
  id: string
  query: string
  filters?: SearchFilters
  timestamp: Date
  resultCount: number
}

export interface SearchAnalytics {
  popularSearches: Array<{ query: string; count: number }>
  zeroResultSearches: Array<{ query: string; count: number }>
  averageResultsPerSearch: number
  averageSearchTime: number
  clickThroughRate: number
}

// ============================================
// FAQ SYSTEM (extending existing)
// ============================================

export interface ExtendedFAQItem extends FAQItem {
  relatedArticles?: string[]
  difficulty?: ArticleDifficulty
  lastUpdated?: Date
  viewCount?: number
  audience?: AudienceType[]
  videoUrl?: string
  screenshots?: string[]
}

export interface FAQSection {
  id: string
  title: string
  description: string
  category: FAQCategory
  items: ExtendedFAQItem[]
  order: number
  collapsed?: boolean
}

export interface FAQSearchResult {
  faq: ExtendedFAQItem
  relevanceScore: number
  matchedIn: "question" | "answer" | "keywords"
  snippet: string
}

// ============================================
// TRAINING SYSTEM
// ============================================

export type TrainingType = "course" | "tutorial" | "workshop" | "webinar" | "certification"

export type TrainingLevel = "beginner" | "intermediate" | "advanced" | "expert"

export type TrainingStatus = "not-started" | "in-progress" | "completed" | "expired"

export interface TrainingDocument {
  id: string
  title: string
  slug: string
  description: string
  type: TrainingType
  level: TrainingLevel
  duration: number
  estimatedHours: number
  modules: TrainingModule[]
  prerequisites?: string[]
  learningObjectives: string[]
  audience: AudienceType[]
  instructor?: Instructor
  releaseDate: Date
  lastUpdated: Date
  tags: string[]
  thumbnail?: string
  trailerVideoUrl?: string
  certificationOffered: boolean
  certificationName?: string
  enrollmentCount: number
  rating: number
  reviewCount: number
  featured: boolean
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  order: number
  duration: number
  lessons: TrainingLesson[]
  quiz?: ModuleQuiz
  resources?: ResourceLink[]
}

export interface TrainingLesson {
  id: string
  title: string
  description: string
  order: number
  duration: number
  contentType: "video" | "article" | "interactive" | "quiz" | "hands-on"
  content: string
  videoUrl?: string
  articleId?: string
  completed?: boolean
  lastAccessedAt?: Date
}

export interface Instructor {
  id: string
  name: string
  title: string
  bio: string
  avatarUrl?: string
  linkedInUrl?: string
  expertise: string[]
}

export interface ModuleQuiz {
  id: string
  title: string
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number
  attemptsAllowed: number
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "multiple-select" | "fill-blank"
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
}

export interface ResourceLink {
  id: string
  title: string
  description: string
  url: string
  type: "download" | "external" | "article" | "video"
  fileSize?: number
  format?: string
}

export interface TrainingProgress {
  userId: string
  trainingId: string
  status: TrainingStatus
  progress: number
  startedAt: Date
  lastAccessedAt: Date
  completedAt?: Date
  completedModules: string[]
  completedLessons: string[]
  quizScores: Record<string, number>
  certificateIssued: boolean
  certificateUrl?: string
  notes?: string
}

// ============================================
// API DOCUMENTATION SYSTEM
// ============================================

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ParameterType = "path" | "query" | "header" | "body"

export type DataType = "string" | "number" | "boolean" | "array" | "object" | "any"

export interface APIEndpoint {
  id: string
  name: string
  slug: string
  description: string
  method: HTTPMethod
  path: string
  category: string
  authentication: AuthenticationRequirement
  parameters: APIParameter[]
  requestBody?: RequestBodySchema
  responses: APIResponse[]
  examples: APIExample[]
  rateLimits?: RateLimit
  sdkSupport: SDKInfo[]
  changelog: ChangelogEntry[]
  deprecated: boolean
  deprecationNotice?: string
  lastUpdated: Date
  tags: string[]
}

export interface AuthenticationRequirement {
  required: boolean
  type: "bearer" | "api-key" | "oauth2" | "none"
  scopes?: string[]
  description: string
}

export interface APIParameter {
  name: string
  type: ParameterType
  dataType: DataType
  required: boolean
  description: string
  defaultValue?: any
  example?: any
  validation?: ValidationRule
  deprecated?: boolean
}

export interface ValidationRule {
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: any[]
}

export interface RequestBodySchema {
  contentType: string
  schema: JSONSchema
  examples: Record<string, any>
}

export interface JSONSchema {
  type: DataType
  properties?: Record<string, JSONSchema>
  items?: JSONSchema
  required?: string[]
  description?: string
  example?: any
}

export interface APIResponse {
  statusCode: number
  description: string
  schema?: JSONSchema
  headers?: Record<string, string>
  examples?: Record<string, any>
}

export interface APIExample {
  id: string
  title: string
  description: string
  language: string
  code: string
  requestExample?: string
  responseExample?: string
}

export interface RateLimit {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  burstAllowance?: number
}

export interface SDKInfo {
  language: string
  packageName: string
  version: string
  installCommand: string
  documentationUrl: string
  exampleCode: string
}

export interface ChangelogEntry {
  version: string
  date: Date
  changes: string[]
  breakingChanges: string[]
  migrations?: string
}

// ============================================
// NAVIGATION & UI
// ============================================

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  badge?: string | number
  children?: NavigationItem[]
  external?: boolean
  order: number
}

export interface Breadcrumb {
  label: string
  path: string
  icon?: string
}

export interface TableOfContents {
  id: string
  title: string
  level: number
  children?: TableOfContents[]
}

// ============================================
// ANALYTICS & METRICS
// ============================================

export interface ArticleAnalytics {
  articleId: string
  period: "day" | "week" | "month" | "year"
  views: number
  uniqueVisitors: number
  averageReadTime: number
  bounceRate: number
  helpfulVotes: number
  notHelpfulVotes: number
  shares: number
  bookmarks: number
  comments: number
  searchImpressions: number
  clickThroughRate: number
  conversionRate?: number
}

export interface UserEngagement {
  userId: string
  articlesViewed: number
  totalReadTime: number
  searchQueries: number
  helpfulVotes: number
  bookmarks: number
  commentsPosted: number
  trainingCompleted: number
  certificationsEarned: number
  lastActivity: Date
  engagementScore: number
}

// ============================================
// NOTIFICATIONS & UPDATES
// ============================================

export type NotificationType = "new-article" | "updated-article" | "training-release" | "system-update"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  articleId?: string
  trainingId?: string
  actionUrl?: string
  actionLabel?: string
  priority: "low" | "normal" | "high"
  read: boolean
  createdAt: Date
}

// ============================================
// COMMENTS & FEEDBACK
// ============================================

export interface ArticleComment {
  id: string
  articleId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  helpful: number
  replies: ArticleComment[]
  edited: boolean
  editedAt?: Date
  createdAt: Date
  status: "published" | "flagged" | "deleted"
}

export interface ArticleFeedback {
  articleId: string
  helpful: boolean
  reason?: string
  suggestions?: string
  timestamp: Date
  userId?: string
}

// ============================================
// BOOKMARKS & HISTORY
// ============================================

export interface Bookmark {
  id: string
  userId: string
  articleId?: string
  trainingId?: string
  faqId?: string
  notes?: string
  tags?: string[]
  createdAt: Date
  folder?: string
}

export interface ReadingHistory {
  id: string
  userId: string
  articleId?: string
  trainingId?: string
  visitedAt: Date
  duration: number
  scrollProgress: number
  completed: boolean
}

// ============================================
// EXPORT & UTILITIES
// ============================================

export interface ExportOptions {
  format: "pdf" | "markdown" | "html" | "docx"
  includeImages: boolean
  includeTOC: boolean
  includeMetadata: boolean
}

export interface ArticleVersion {
  version: string
  articleId: string
  content: string
  changelog: string
  author: string
  createdAt: Date
}
