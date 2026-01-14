// Knowledge Base Service for Support Chat
// Provides article search, suggestions, and content management

import type { ArticleCategory, ArticleSuggestion, KnowledgeArticle } from "./types"

export interface SearchResult {
  article: KnowledgeArticle
  relevanceScore: number
  matchedTerms: string[]
  snippet: string
}

// Sample knowledge base articles
const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: "kb-001",
    title: "Getting Started with Daily Event Insurance Integration",
    slug: "getting-started",
    summary: "A complete guide to integrating Daily Event Insurance into your platform.",
    content: `
# Getting Started with Daily Event Insurance Integration

Welcome! This guide will walk you through the complete process of integrating Daily Event Insurance into your platform.

## Prerequisites
- A partner account (sign up at partners.dailyeventinsurance.com)
- API credentials (available in your partner dashboard)
- Basic knowledge of JavaScript/TypeScript

## Step 1: Generate API Keys
Navigate to your partner dashboard and generate your API keys. You'll receive:
- **API Key**: For authenticating requests
- **Widget Key**: For embedding the insurance widget

## Step 2: Install the Widget
Add the following script to your website:
\`\`\`html
<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-key="YOUR_WIDGET_KEY"></div>
\`\`\`

## Step 3: Configure Webhooks
Set up webhooks to receive real-time updates about policies and claims.

## Next Steps
- [Customize widget appearance](/docs/widget-customization)
- [Set up webhooks](/docs/webhooks)
- [Review API documentation](/docs/api-reference)
    `,
    category: "getting-started",
    tags: ["setup", "integration", "quick-start", "api", "widget"],
    relatedTopics: ["widget-installation", "api-authentication", "webhooks"],
    difficulty: "beginner",
    estimatedReadTime: 5,
    lastUpdated: new Date("2024-01-15"),
    helpfulCount: 234,
    viewCount: 1890,
  },
  {
    id: "kb-002",
    title: "Widget Installation Guide",
    slug: "widget-installation",
    summary: "Step-by-step instructions for installing the insurance widget on your website.",
    content: `
# Widget Installation Guide

The Daily Event Insurance widget makes it easy to offer event insurance directly on your website.

## Installation Methods

### Method 1: Script Tag (Recommended)
\`\`\`html
<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-key="YOUR_KEY"></div>
\`\`\`

### Method 2: NPM Package
\`\`\`bash
npm install @dailyeventinsurance/widget
\`\`\`

\`\`\`javascript
import { DeiWidget } from '@dailyeventinsurance/widget';

DeiWidget.init({
  partnerKey: 'YOUR_KEY',
  containerId: 'insurance-widget'
});
\`\`\`

### Method 3: React Component
\`\`\`jsx
import { InsuranceWidget } from '@dailyeventinsurance/react';

function App() {
  return <InsuranceWidget partnerKey="YOUR_KEY" />;
}
\`\`\`

## Customization Options
- \`theme\`: 'light' | 'dark' | 'auto'
- \`primaryColor\`: Hex color code
- \`language\`: 'en' | 'es' | 'fr'
- \`position\`: 'inline' | 'modal' | 'sidebar'
    `,
    category: "widget-integration",
    tags: ["widget", "installation", "react", "npm", "customization"],
    relatedTopics: ["getting-started", "widget-customization", "react-integration"],
    difficulty: "beginner",
    estimatedReadTime: 4,
    lastUpdated: new Date("2024-01-20"),
    helpfulCount: 189,
    viewCount: 1456,
  },
  {
    id: "kb-003",
    title: "API Authentication",
    slug: "api-authentication",
    summary: "Learn how to authenticate API requests with your partner credentials.",
    content: `
# API Authentication

All API requests require authentication using your partner API key.

## Authentication Header
Include your API key in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Example Request
\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'birthday_party',
    eventDate: '2024-06-15',
    attendees: 50
  })
});
\`\`\`

## API Key Security
- Never expose API keys in client-side code
- Use environment variables
- Rotate keys periodically
- Use separate keys for development and production
    `,
    category: "api-reference",
    tags: ["api", "authentication", "security", "authorization"],
    relatedTopics: ["getting-started", "api-endpoints", "security-best-practices"],
    difficulty: "intermediate",
    estimatedReadTime: 3,
    lastUpdated: new Date("2024-01-18"),
    helpfulCount: 156,
    viewCount: 1234,
  },
  {
    id: "kb-004",
    title: "Connecting Mindbody POS",
    slug: "mindbody-integration",
    summary: "Complete guide to integrating with Mindbody point-of-sale system.",
    content: `
# Connecting Mindbody POS

Integrate Daily Event Insurance with your Mindbody account for seamless booking and insurance sales.

## Prerequisites
- Active Mindbody subscription
- API access enabled in Mindbody
- Partner API credentials from Daily Event Insurance

## Step 1: Enable API Access
In Mindbody:
1. Go to Setup > API Access
2. Enable third-party API access
3. Note your Site ID and API Key

## Step 2: Connect in Partner Dashboard
1. Navigate to Integrations > POS Systems
2. Select Mindbody
3. Enter your Site ID and API Key
4. Test the connection

## Step 3: Configure Event Types
Map your Mindbody class types to insurance event types for automatic suggestions.

## Troubleshooting
- **Connection failed**: Verify API credentials
- **No events showing**: Check class type mapping
- **Sync errors**: Ensure webhooks are configured
    `,
    category: "pos-integration",
    tags: ["mindbody", "pos", "integration", "booking", "sync"],
    relatedTopics: ["pos-overview", "pike13-integration", "webhook-setup"],
    difficulty: "intermediate",
    estimatedReadTime: 6,
    lastUpdated: new Date("2024-01-22"),
    helpfulCount: 98,
    viewCount: 876,
  },
  {
    id: "kb-005",
    title: "Troubleshooting Widget Issues",
    slug: "widget-troubleshooting",
    summary: "Common widget issues and their solutions.",
    content: `
# Troubleshooting Widget Issues

## Widget Not Appearing

**Check Script Loading**
\`\`\`javascript
// Verify script is loaded
if (window.DeiWidget) {
  console.log('Widget loaded successfully');
} else {
  console.log('Widget not loaded - check script tag');
}
\`\`\`

**Common Causes**
1. Script blocked by ad blocker
2. Content Security Policy restrictions
3. Invalid partner key
4. Container element missing

## Widget Styling Issues

**CSS Conflicts**
Add isolation to prevent CSS conflicts:
\`\`\`css
#dei-widget {
  all: initial;
}
\`\`\`

## Quote Not Loading

**Check Network Requests**
1. Open browser DevTools
2. Go to Network tab
3. Look for failed requests to dailyeventinsurance.com

**API Rate Limits**
If you see 429 errors, you've hit rate limits. Contact support for increased limits.

## Mobile Display Issues
Ensure viewport meta tag is set:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`
    `,
    category: "troubleshooting",
    tags: ["troubleshooting", "widget", "debugging", "errors", "css"],
    relatedTopics: ["widget-installation", "widget-customization", "support-contact"],
    difficulty: "intermediate",
    estimatedReadTime: 5,
    lastUpdated: new Date("2024-01-25"),
    helpfulCount: 145,
    viewCount: 1123,
  },
  {
    id: "kb-006",
    title: "Webhook Configuration",
    slug: "webhook-setup",
    summary: "Set up webhooks to receive real-time updates about policies and events.",
    content: `
# Webhook Configuration

Webhooks allow you to receive real-time notifications about policy events.

## Available Events
- \`policy.created\`: New policy purchased
- \`policy.updated\`: Policy modified
- \`policy.cancelled\`: Policy cancelled
- \`claim.submitted\`: New claim filed
- \`claim.resolved\`: Claim processed

## Setting Up Webhooks

1. Go to Partner Dashboard > Webhooks
2. Add your endpoint URL
3. Select events to subscribe to
4. Save and test

## Webhook Payload
\`\`\`json
{
  "event": "policy.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "policyId": "pol_abc123",
    "partnerId": "prt_xyz789",
    "eventDate": "2024-06-15",
    "coverage": {
      "type": "comprehensive",
      "amount": 50000
    }
  },
  "signature": "sha256=..."
}
\`\`\`

## Verifying Signatures
Always verify webhook signatures to ensure authenticity.
    `,
    category: "api-reference",
    tags: ["webhooks", "api", "events", "notifications", "security"],
    relatedTopics: ["api-authentication", "security-best-practices", "event-handling"],
    difficulty: "advanced",
    estimatedReadTime: 7,
    lastUpdated: new Date("2024-01-24"),
    helpfulCount: 112,
    viewCount: 945,
  },
]

// Search articles by query
export function searchArticles(query: string, limit: number = 5): SearchResult[] {
  if (!query.trim()) return []

  const queryTerms = query.toLowerCase().split(/\s+/)
  const results: SearchResult[] = []

  for (const article of KNOWLEDGE_BASE) {
    const searchableText = [
      article.title,
      article.summary,
      article.content,
      ...article.tags,
      ...article.relatedTopics,
    ]
      .join(" ")
      .toLowerCase()

    const matchedTerms = queryTerms.filter((term) => searchableText.includes(term))
    if (matchedTerms.length === 0) continue

    // Calculate relevance score
    let score = 0

    // Title matches are weighted heavily
    const titleLower = article.title.toLowerCase()
    matchedTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 10
    })

    // Tag matches
    const tagsLower = article.tags.map((t) => t.toLowerCase())
    matchedTerms.forEach((term) => {
      if (tagsLower.some((tag) => tag.includes(term))) score += 5
    })

    // Summary matches
    const summaryLower = article.summary.toLowerCase()
    matchedTerms.forEach((term) => {
      if (summaryLower.includes(term)) score += 3
    })

    // Content matches
    const contentLower = article.content.toLowerCase()
    matchedTerms.forEach((term) => {
      const count = (contentLower.match(new RegExp(term, "g")) || []).length
      score += Math.min(count, 5) // Cap at 5 to prevent gaming
    })

    // Boost by helpfulness and views
    score += (article.helpfulCount / 100) + (article.viewCount / 1000)

    // Generate snippet
    const snippet = generateSnippet(article.content, matchedTerms[0])

    results.push({
      article,
      relevanceScore: score,
      matchedTerms,
      snippet,
    })
  }

  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

// Generate a snippet around the first match
function generateSnippet(content: string, term: string, contextLength: number = 100): string {
  const plainText = content.replace(/[#*`\n]/g, " ").replace(/\s+/g, " ").trim()
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

// Get suggested articles based on context
export function getSuggestedArticles(context: {
  topic?: string
  currentPage?: string
  recentMessages?: string[]
  errorType?: string
}): ArticleSuggestion[] {
  const suggestions: ArticleSuggestion[] = []

  // Map topics to relevant categories
  const topicCategoryMap: Record<string, ArticleCategory[]> = {
    onboarding: ["getting-started", "widget-integration"],
    widget_install: ["widget-integration", "troubleshooting"],
    api_integration: ["api-reference", "getting-started"],
    pos_setup: ["pos-integration", "troubleshooting"],
    troubleshooting: ["troubleshooting", "widget-integration"],
  }

  // Get relevant categories
  const relevantCategories = context.topic
    ? topicCategoryMap[context.topic] || ["getting-started"]
    : ["getting-started"]

  // Filter articles by category
  const categoryArticles = KNOWLEDGE_BASE.filter((article) =>
    relevantCategories.includes(article.category)
  )

  // Add category-based suggestions
  categoryArticles.forEach((article) => {
    suggestions.push({
      article,
      reason: `Relevant to ${context.topic || "your current task"}`,
      confidence: 0.7,
    })
  })

  // If there are error-related terms in recent messages, suggest troubleshooting
  if (context.recentMessages) {
    const errorTerms = ["error", "not working", "failed", "issue", "problem", "help"]
    const hasErrorContext = context.recentMessages.some((msg) =>
      errorTerms.some((term) => msg.toLowerCase().includes(term))
    )

    if (hasErrorContext) {
      const troubleshootingArticles = KNOWLEDGE_BASE.filter(
        (article) => article.category === "troubleshooting"
      )
      troubleshootingArticles.forEach((article) => {
        const existingIndex = suggestions.findIndex((s) => s.article.id === article.id)
        if (existingIndex >= 0) {
          suggestions[existingIndex].confidence = 0.9
          suggestions[existingIndex].reason = "Based on your issue description"
        } else {
          suggestions.push({
            article,
            reason: "May help with your issue",
            confidence: 0.8,
          })
        }
      })
    }
  }

  // Sort by confidence and limit
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}

// Get article by ID
export function getArticleById(id: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_BASE.find((article) => article.id === id)
}

// Get article by slug
export function getArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_BASE.find((article) => article.slug === slug)
}

// Get articles by category
export function getArticlesByCategory(category: ArticleCategory): KnowledgeArticle[] {
  return KNOWLEDGE_BASE.filter((article) => article.category === category)
}

// Get popular articles
export function getPopularArticles(limit: number = 5): KnowledgeArticle[] {
  return [...KNOWLEDGE_BASE]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

// Get related articles
export function getRelatedArticles(articleId: string, limit: number = 3): KnowledgeArticle[] {
  const article = getArticleById(articleId)
  if (!article) return []

  return KNOWLEDGE_BASE.filter(
    (a) =>
      a.id !== articleId &&
      (a.category === article.category ||
        a.tags.some((tag) => article.tags.includes(tag)) ||
        article.relatedTopics.includes(a.slug))
  ).slice(0, limit)
}

// Track article view (would typically update database)
export function trackArticleView(articleId: string): void {
  console.log(`[KnowledgeBase] Tracking view for article: ${articleId}`)
  // In production, this would update the viewCount in the database
}

// Track article helpfulness (would typically update database)
export function trackArticleHelpful(articleId: string, isHelpful: boolean): void {
  console.log(
    `[KnowledgeBase] Tracking helpfulness for article: ${articleId}, helpful: ${isHelpful}`
  )
  // In production, this would update the helpfulCount in the database
}
