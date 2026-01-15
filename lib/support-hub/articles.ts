// Article data and query functions for Support Hub
// Sample articles, search/filter logic, related articles, reading time calculation

import type {
  SupportArticle,
  ArticleCategory,
  ArticleDifficulty,
  AudienceType,
  SearchOptions,
  SearchResult,
  SearchHighlight,
  ArticleAnalytics,
} from "./types"

// ============================================
// SAMPLE ARTICLES
// ============================================

const SAMPLE_ARTICLES: SupportArticle[] = [
  // Getting Started
  {
    id: "art-001",
    slug: "quick-start-guide",
    title: "Quick Start Guide: Get Live in 15 Minutes",
    summary:
      "Step-by-step guide to integrate Daily Event Insurance into your platform in just 15 minutes.",
    content: `
# Quick Start Guide: Get Live in 15 Minutes

This guide will have you up and running with Daily Event Insurance in under 15 minutes.

## Prerequisites
- Active partner account
- Basic knowledge of HTML/JavaScript
- Access to your website's codebase

## Step 1: Get Your API Keys (2 minutes)
1. Log into your partner dashboard at [partners.dailyeventinsurance.com](https://partners.dailyeventinsurance.com)
2. Navigate to Settings > API Keys
3. Generate your production API key
4. Copy your Widget Key

## Step 2: Install the Widget (5 minutes)
Add this code snippet to your website before the closing \`</body>\` tag:

\`\`\`html
<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-key="YOUR_WIDGET_KEY"></div>
\`\`\`

## Step 3: Customize (5 minutes)
Customize the widget to match your branding:

\`\`\`javascript
DeiWidget.init({
  partnerKey: 'YOUR_KEY',
  theme: 'light',
  primaryColor: '#3B82F6',
  position: 'inline'
});
\`\`\`

## Step 4: Test (3 minutes)
1. Open your website in a browser
2. Use test card: 4242 4242 4242 4242
3. Verify purchase flow completes successfully

## You're Live!
Start offering insurance to your customers immediately. Commission tracking is automatic.

## Next Steps
- [Set up webhooks](/support/integrations/webhook-setup)
- [Customize widget appearance](/support/integrations/widget-customization)
- [Review API documentation](/support/api-reference/overview)
    `,
    contentFormat: "markdown",
    category: "getting-started",
    subcategory: "quick-start",
    tags: ["setup", "quick-start", "widget", "beginner", "15-minutes"],
    difficulty: "beginner",
    audience: ["partner", "developer"],
    relatedArticles: ["art-002", "art-005", "art-012"],
    prerequisites: [],
    estimatedReadTime: 5,
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    author: {
      id: "auth-001",
      name: "Sarah Chen",
      role: "Integration Specialist",
      avatarUrl: "https://avatar.vercel.sh/sarah",
    },
    status: "published",
    viewCount: 3456,
    helpfulCount: 312,
    notHelpfulCount: 8,
    bookmarkCount: 156,
    featured: true,
    trending: true,
    seo: {
      metaTitle: "Quick Start Guide - Daily Event Insurance Integration in 15 Minutes",
      metaDescription:
        "Get Daily Event Insurance integrated into your platform in just 15 minutes with this step-by-step quick start guide.",
      keywords: ["quick start", "integration", "setup", "widget", "tutorial"],
    },
    version: "2.1.0",
  },
  {
    id: "art-002",
    slug: "widget-installation-complete",
    title: "Complete Widget Installation Guide",
    summary: "Comprehensive guide covering all widget installation methods and configurations.",
    content: `
# Complete Widget Installation Guide

## Installation Methods

### Method 1: CDN Script Tag (Recommended)
The simplest method for most users:

\`\`\`html
<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-key="YOUR_KEY"></div>
\`\`\`

### Method 2: NPM Package
For modern JavaScript frameworks:

\`\`\`bash
npm install @dailyeventinsurance/widget
# or
yarn add @dailyeventinsurance/widget
\`\`\`

\`\`\`javascript
import { DeiWidget } from '@dailyeventinsurance/widget';

DeiWidget.init({
  partnerKey: 'YOUR_KEY',
  containerId: 'insurance-widget'
});
\`\`\`

### Method 3: React Component
Native React integration:

\`\`\`jsx
import { InsuranceWidget } from '@dailyeventinsurance/react';

function App() {
  return (
    <InsuranceWidget
      partnerKey="YOUR_KEY"
      theme="auto"
      onPurchaseComplete={(policy) => console.log(policy)}
    />
  );
}
\`\`\`

### Method 4: Vue Component
For Vue.js applications:

\`\`\`vue
<template>
  <insurance-widget
    :partner-key="apiKey"
    theme="light"
    @purchase-complete="handlePurchase"
  />
</template>

<script>
import { InsuranceWidget } from '@dailyeventinsurance/vue';

export default {
  components: { InsuranceWidget },
  data() {
    return { apiKey: 'YOUR_KEY' }
  },
  methods: {
    handlePurchase(policy) {
      console.log('Policy purchased:', policy);
    }
  }
}
</script>
\`\`\`

## Configuration Options

### Basic Configuration
\`\`\`javascript
{
  partnerKey: 'YOUR_KEY',        // Required
  theme: 'light' | 'dark' | 'auto',
  language: 'en' | 'es' | 'fr',
  position: 'inline' | 'modal' | 'sidebar'
}
\`\`\`

### Advanced Configuration
\`\`\`javascript
{
  primaryColor: '#3B82F6',
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif',
  eventDefaults: {
    type: 'fitness_class',
    duration: 60
  },
  callbacks: {
    onLoad: () => console.log('Widget loaded'),
    onQuoteGenerated: (quote) => console.log(quote),
    onPurchaseComplete: (policy) => console.log(policy),
    onError: (error) => console.error(error)
  }
}
\`\`\`

## Troubleshooting

### Widget Not Appearing
1. Check browser console for errors
2. Verify API key is correct
3. Ensure script loads before initialization
4. Check Content Security Policy allows our domain

### Styling Issues
Isolate widget styles:
\`\`\`css
#dei-widget {
  all: initial;
  display: block;
}
\`\`\`

### Performance Optimization
Load widget asynchronously:
\`\`\`html
<script async src="https://cdn.dailyeventinsurance.com/widget.js"></script>
\`\`\`
    `,
    contentFormat: "markdown",
    category: "integrations",
    subcategory: "widget",
    tags: ["widget", "installation", "react", "vue", "npm", "cdn"],
    difficulty: "intermediate",
    audience: ["developer"],
    relatedArticles: ["art-001", "art-003", "art-015"],
    prerequisites: ["art-001"],
    estimatedReadTime: 8,
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-20"),
    author: {
      id: "auth-002",
      name: "Marcus Rodriguez",
      role: "Senior Developer",
      avatarUrl: "https://avatar.vercel.sh/marcus",
    },
    status: "published",
    viewCount: 2890,
    helpfulCount: 267,
    notHelpfulCount: 12,
    bookmarkCount: 134,
    featured: true,
    trending: false,
    seo: {
      metaTitle: "Complete Widget Installation Guide - All Methods",
      metaDescription:
        "Learn all methods to install the Daily Event Insurance widget including CDN, NPM, React, and Vue implementations.",
      keywords: ["widget", "installation", "react", "vue", "npm", "integration"],
    },
    version: "2.0.0",
  },
  {
    id: "art-005",
    slug: "api-authentication",
    title: "API Authentication Best Practices",
    summary: "Learn how to securely authenticate API requests and protect your credentials.",
    content: `
# API Authentication Best Practices

## Authentication Methods

### Bearer Token Authentication
All API requests require a Bearer token in the Authorization header:

\`\`\`http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

### Example Request
\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'marathon',
    eventDate: '2024-06-15',
    attendees: 500
  })
});

const data = await response.json();
\`\`\`

## Security Best Practices

### 1. Never Expose Keys in Client-Side Code
❌ Bad:
\`\`\`javascript
// Don't do this!
const apiKey = 'sk_live_abc123';
fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  headers: { 'Authorization': \`Bearer \${apiKey}\` }
});
\`\`\`

✅ Good:
\`\`\`javascript
// Make requests from your backend
app.post('/api/get-quote', async (req, res) => {
  const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
    headers: { 'Authorization': \`Bearer \${process.env.DEI_API_KEY}\` },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});
\`\`\`

### 2. Use Environment Variables
\`\`\`bash
# .env file
DEI_API_KEY=sk_live_abc123
DEI_API_SECRET=sk_secret_xyz789
\`\`\`

### 3. Separate Development and Production Keys
- Development: \`sk_test_...\`
- Production: \`sk_live_...\`

### 4. Rotate Keys Regularly
Rotate API keys every 90 days or immediately if compromised.

### 5. Monitor API Usage
Watch for unusual patterns in your dashboard.

## Error Handling

### 401 Unauthorized
\`\`\`json
{
  "error": "unauthorized",
  "message": "Invalid API key"
}
\`\`\`

**Solution**: Verify your API key and ensure it's active.

### 403 Forbidden
\`\`\`json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
\`\`\`

**Solution**: Check your API key has the required scopes.

## Rate Limiting
- Standard: 100 requests/minute
- Quote Generation: 20 requests/minute
- Increase limits available for Enterprise partners

## Key Management
1. Generate keys in Partner Dashboard
2. Use separate keys for each environment
3. Revoke compromised keys immediately
4. Document key usage in your team
    `,
    contentFormat: "markdown",
    category: "api-reference",
    subcategory: "authentication",
    tags: ["api", "authentication", "security", "best-practices", "bearer-token"],
    difficulty: "intermediate",
    audience: ["developer"],
    relatedArticles: ["art-006", "art-007", "art-020"],
    prerequisites: [],
    estimatedReadTime: 6,
    publishedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
    author: {
      id: "auth-003",
      name: "Diana Park",
      role: "Security Engineer",
      avatarUrl: "https://avatar.vercel.sh/diana",
    },
    status: "published",
    viewCount: 2345,
    helpfulCount: 198,
    notHelpfulCount: 5,
    bookmarkCount: 89,
    featured: true,
    trending: false,
    seo: {
      metaTitle: "API Authentication Best Practices - Daily Event Insurance",
      metaDescription:
        "Learn how to securely authenticate with the Daily Event Insurance API using Bearer tokens and best security practices.",
      keywords: ["api", "authentication", "security", "bearer token", "api key"],
    },
    version: "1.5.0",
  },
]

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Calculate reading time based on content length
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Get all articles
 */
export function getAllArticles(): SupportArticle[] {
  return [...SAMPLE_ARTICLES]
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): SupportArticle | undefined {
  return SAMPLE_ARTICLES.find((article) => article.id === id)
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): SupportArticle | undefined {
  return SAMPLE_ARTICLES.find((article) => article.slug === slug)
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: ArticleCategory): SupportArticle[] {
  return SAMPLE_ARTICLES.filter((article) => article.category === category)
}

/**
 * Get articles by subcategory
 */
export function getArticlesBySubcategory(
  category: ArticleCategory,
  subcategory: string
): SupportArticle[] {
  return SAMPLE_ARTICLES.filter(
    (article) => article.category === category && article.subcategory === subcategory
  )
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(limit: number = 6): SupportArticle[] {
  return SAMPLE_ARTICLES.filter((article) => article.featured).slice(0, limit)
}

/**
 * Get trending articles
 */
export function getTrendingArticles(limit: number = 5): SupportArticle[] {
  return SAMPLE_ARTICLES.filter((article) => article.trending).slice(0, limit)
}

/**
 * Get popular articles sorted by view count
 */
export function getPopularArticles(limit: number = 10): SupportArticle[] {
  return [...SAMPLE_ARTICLES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

/**
 * Get recently updated articles
 */
export function getRecentlyUpdatedArticles(limit: number = 5): SupportArticle[] {
  return [...SAMPLE_ARTICLES]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit)
}

/**
 * Get related articles based on tags and category
 */
export function getRelatedArticles(articleId: string, limit: number = 3): SupportArticle[] {
  const article = getArticleById(articleId)
  if (!article) return []

  // Score articles based on relevance
  const scored = SAMPLE_ARTICLES.filter((a) => a.id !== articleId).map((a) => {
    let score = 0

    // Same category: +10 points
    if (a.category === article.category) score += 10

    // Same subcategory: +15 points
    if (a.subcategory === article.subcategory) score += 15

    // Shared tags: +5 points per tag
    const sharedTags = a.tags.filter((tag) => article.tags.includes(tag))
    score += sharedTags.length * 5

    // Similar difficulty: +5 points
    if (a.difficulty === article.difficulty) score += 5

    // Shared audience: +3 points per audience
    const sharedAudience = a.audience.filter((aud) => article.audience.includes(aud))
    score += sharedAudience.length * 3

    // Explicitly related: +20 points
    if (article.relatedArticles.includes(a.id)) score += 20

    return { article: a, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article)
}

/**
 * Search articles with advanced options
 */
export function searchArticles(options: SearchOptions): SearchResult[] {
  const { query, filters, sortBy = "relevance", sortOrder = "desc", limit = 20 } = options

  let results = [...SAMPLE_ARTICLES]

  // Apply filters
  if (filters) {
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter((article) => filters.categories!.includes(article.category))
    }

    if (filters.difficulties && filters.difficulties.length > 0) {
      results = results.filter((article) => filters.difficulties!.includes(article.difficulty))
    }

    if (filters.audiences && filters.audiences.length > 0) {
      results = results.filter((article) =>
        filters.audiences!.some((aud) => article.audience.includes(aud))
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((article) =>
        filters.tags!.some((tag) => article.tags.includes(tag))
      )
    }

    if (filters.featured !== undefined) {
      results = results.filter((article) => article.featured === filters.featured)
    }

    if (filters.trending !== undefined) {
      results = results.filter((article) => article.trending === filters.trending)
    }

    if (filters.minReadTime !== undefined) {
      results = results.filter((article) => article.estimatedReadTime >= filters.minReadTime!)
    }

    if (filters.maxReadTime !== undefined) {
      results = results.filter((article) => article.estimatedReadTime <= filters.maxReadTime!)
    }
  }

  // Search query
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const searchResults: SearchResult[] = results
    .map((article) => {
      const searchableText = [
        article.title,
        article.summary,
        article.content,
        ...article.tags,
      ].join(" ")

      const searchableLower = searchableText.toLowerCase()
      const matchedTerms = queryTerms.filter((term) => searchableLower.includes(term))

      if (matchedTerms.length === 0 && queryTerms.length > 0) {
        return null
      }

      // Calculate relevance score
      let score = 0

      // Title matches (highest weight)
      const titleLower = article.title.toLowerCase()
      matchedTerms.forEach((term) => {
        if (titleLower === term) score += 50 // Exact title match
        else if (titleLower.includes(term)) score += 20
      })

      // Summary matches
      const summaryLower = article.summary.toLowerCase()
      matchedTerms.forEach((term) => {
        if (summaryLower.includes(term)) score += 10
      })

      // Tag matches
      article.tags.forEach((tag) => {
        matchedTerms.forEach((term) => {
          if (tag.toLowerCase() === term) score += 15
          else if (tag.toLowerCase().includes(term)) score += 8
        })
      })

      // Content matches (lower weight due to volume)
      const contentLower = article.content.toLowerCase()
      matchedTerms.forEach((term) => {
        const matches = (contentLower.match(new RegExp(term, "g")) || []).length
        score += Math.min(matches * 2, 20) // Cap at 20 to prevent gaming
      })

      // Boost by engagement
      score += article.helpfulCount / 50
      score += article.viewCount / 500
      if (article.featured) score += 10
      if (article.trending) score += 15

      // Generate snippet
      const snippet = generateSnippet(article.content, matchedTerms[0] || "")

      // Generate highlights
      const highlights = generateHighlights(article, matchedTerms)

      return {
        article,
        relevanceScore: score,
        matchedTerms,
        snippet,
        highlights,
        rank: 0, // Will be set after sorting
      }
    })
    .filter((result): result is SearchResult => result !== null)

  // Sort results
  searchResults.sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return sortOrder === "asc"
          ? a.relevanceScore - b.relevanceScore
          : b.relevanceScore - a.relevanceScore
      case "date":
        return sortOrder === "asc"
          ? a.article.updatedAt.getTime() - b.article.updatedAt.getTime()
          : b.article.updatedAt.getTime() - a.article.updatedAt.getTime()
      case "popularity":
        return sortOrder === "asc"
          ? a.article.viewCount - b.article.viewCount
          : b.article.viewCount - a.article.viewCount
      case "title":
        return sortOrder === "asc"
          ? a.article.title.localeCompare(b.article.title)
          : b.article.title.localeCompare(a.article.title)
      default:
        return 0
    }
  })

  // Set ranks
  searchResults.forEach((result, index) => {
    result.rank = index + 1
  })

  return searchResults.slice(0, limit)
}

/**
 * Generate snippet around matched term
 */
function generateSnippet(content: string, term: string, contextLength: number = 150): string {
  const plainText = content
    .replace(/[#*`\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!term) {
    return plainText.slice(0, contextLength * 2) + "..."
  }

  const index = plainText.toLowerCase().indexOf(term.toLowerCase())

  if (index === -1) {
    return plainText.slice(0, contextLength * 2) + "..."
  }

  const start = Math.max(0, index - contextLength)
  const end = Math.min(plainText.length, index + term.length + contextLength)

  let snippet = plainText.slice(start, end)
  if (start > 0) snippet = "..." + snippet
  if (end < plainText.length) snippet = snippet + "..."

  return snippet
}

/**
 * Generate highlights for search results
 */
function generateHighlights(article: SupportArticle, terms: string[]): SearchHighlight[] {
  const highlights: SearchHighlight[] = []

  terms.forEach((term) => {
    // Title highlights
    const titleLower = article.title.toLowerCase()
    if (titleLower.includes(term)) {
      const index = titleLower.indexOf(term)
      highlights.push({
        field: "title",
        text: article.title,
        positions: [{ start: index, end: index + term.length }],
      })
    }

    // Summary highlights
    const summaryLower = article.summary.toLowerCase()
    if (summaryLower.includes(term)) {
      const index = summaryLower.indexOf(term)
      highlights.push({
        field: "summary",
        text: article.summary,
        positions: [{ start: index, end: index + term.length }],
      })
    }
  })

  return highlights
}

/**
 * Get article analytics
 */
export function getArticleAnalytics(articleId: string): ArticleAnalytics | null {
  const article = getArticleById(articleId)
  if (!article) return null

  // Mock analytics data
  return {
    articleId,
    period: "month",
    views: article.viewCount,
    uniqueVisitors: Math.floor(article.viewCount * 0.7),
    averageReadTime: article.estimatedReadTime * 60,
    bounceRate: 0.35,
    helpfulVotes: article.helpfulCount,
    notHelpfulVotes: article.notHelpfulCount,
    shares: Math.floor(article.viewCount * 0.05),
    bookmarks: article.bookmarkCount,
    comments: 12,
    searchImpressions: Math.floor(article.viewCount * 2.5),
    clickThroughRate: 0.42,
  }
}

/**
 * Filter articles by difficulty
 */
export function getArticlesByDifficulty(difficulty: ArticleDifficulty): SupportArticle[] {
  return SAMPLE_ARTICLES.filter((article) => article.difficulty === difficulty)
}

/**
 * Filter articles by audience
 */
export function getArticlesByAudience(audience: AudienceType): SupportArticle[] {
  return SAMPLE_ARTICLES.filter((article) => article.audience.includes(audience))
}
