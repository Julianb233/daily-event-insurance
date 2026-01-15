// Category definitions for the Support Hub
// Comprehensive categorization system with icons, colors, and navigation structure

import type { ArticleCategory, CategoryDefinition, SubcategoryDefinition } from "./types"

// ============================================
// CATEGORY DEFINITIONS
// ============================================

export const SUPPORT_CATEGORIES: CategoryDefinition[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    description: "New to Daily Event Insurance? Start here for onboarding and basic setup guides.",
    icon: "Rocket",
    iconColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
    order: 1,
    articleCount: 12,
    featured: true,
    subcategories: [
      {
        id: "quick-start",
        label: "Quick Start Guides",
        description: "Get up and running in minutes",
        articleCount: 5,
        icon: "Zap",
      },
      {
        id: "onboarding",
        label: "Partner Onboarding",
        description: "Complete onboarding process",
        articleCount: 4,
        icon: "Users",
      },
      {
        id: "basics",
        label: "Platform Basics",
        description: "Learn the fundamentals",
        articleCount: 3,
        icon: "Book",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Connect Daily Event Insurance with your existing systems and tools.",
    icon: "Plug",
    iconColor: "#8B5CF6",
    backgroundColor: "#F5F3FF",
    order: 2,
    articleCount: 24,
    featured: true,
    subcategories: [
      {
        id: "widget",
        label: "Widget Integration",
        description: "Embed insurance on your website",
        articleCount: 8,
        icon: "Code",
      },
      {
        id: "registration",
        label: "Registration Platforms",
        description: "RunSignup, BikeReg, and more",
        articleCount: 6,
        icon: "FileText",
      },
      {
        id: "webhooks",
        label: "Webhooks & Events",
        description: "Real-time notifications",
        articleCount: 5,
        icon: "Webhook",
      },
      {
        id: "custom",
        label: "Custom Integrations",
        description: "Build your own integration",
        articleCount: 5,
        icon: "Wrench",
      },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    description: "Complete API documentation with endpoints, parameters, and examples.",
    icon: "Code2",
    iconColor: "#10B981",
    backgroundColor: "#ECFDF5",
    order: 3,
    articleCount: 36,
    featured: true,
    subcategories: [
      {
        id: "authentication",
        label: "Authentication",
        description: "API keys and security",
        articleCount: 4,
        icon: "Lock",
      },
      {
        id: "quotes",
        label: "Quotes API",
        description: "Generate insurance quotes",
        articleCount: 6,
        icon: "DollarSign",
      },
      {
        id: "policies",
        label: "Policies API",
        description: "Create and manage policies",
        articleCount: 8,
        icon: "Shield",
      },
      {
        id: "claims",
        label: "Claims API",
        description: "Handle claims processing",
        articleCount: 6,
        icon: "FileCheck",
      },
      {
        id: "webhooks-api",
        label: "Webhooks API",
        description: "Event subscriptions",
        articleCount: 5,
        icon: "Bell",
      },
      {
        id: "reporting",
        label: "Reporting API",
        description: "Analytics and reports",
        articleCount: 7,
        icon: "BarChart",
      },
    ],
  },
  {
    id: "pos-systems",
    label: "POS Systems",
    description: "Point-of-sale integrations for gyms, studios, and event venues.",
    icon: "CreditCard",
    iconColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    order: 4,
    articleCount: 18,
    featured: true,
    subcategories: [
      {
        id: "mindbody",
        label: "Mindbody",
        description: "Connect with Mindbody",
        articleCount: 4,
        icon: "Activity",
      },
      {
        id: "pike13",
        label: "Pike13",
        description: "Pike13 integration guide",
        articleCount: 3,
        icon: "Calendar",
      },
      {
        id: "square",
        label: "Square",
        description: "Square POS setup",
        articleCount: 3,
        icon: "Square",
      },
      {
        id: "clubready",
        label: "ClubReady",
        description: "ClubReady integration",
        articleCount: 3,
        icon: "Dumbbell",
      },
      {
        id: "mariana-tek",
        label: "Mariana Tek",
        description: "Mariana Tek setup",
        articleCount: 2,
        icon: "Waves",
      },
      {
        id: "other-pos",
        label: "Other POS Systems",
        description: "Additional POS platforms",
        articleCount: 3,
        icon: "MoreHorizontal",
      },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    description: "Common issues, error messages, and solutions to get you back on track.",
    icon: "AlertCircle",
    iconColor: "#EF4444",
    backgroundColor: "#FEF2F2",
    order: 5,
    articleCount: 28,
    featured: false,
    subcategories: [
      {
        id: "widget-issues",
        label: "Widget Issues",
        description: "Widget not loading or displaying",
        articleCount: 8,
        icon: "XCircle",
      },
      {
        id: "api-errors",
        label: "API Errors",
        description: "Common API error codes",
        articleCount: 10,
        icon: "AlertTriangle",
      },
      {
        id: "integration-problems",
        label: "Integration Problems",
        description: "Connection and sync issues",
        articleCount: 6,
        icon: "Unplug",
      },
      {
        id: "payment-issues",
        label: "Payment Issues",
        description: "Transaction and billing problems",
        articleCount: 4,
        icon: "CreditCard",
      },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Frequently asked questions about coverage, pricing, claims, and more.",
    icon: "HelpCircle",
    iconColor: "#06B6D4",
    backgroundColor: "#ECFEFF",
    order: 6,
    articleCount: 42,
    featured: false,
    subcategories: [
      {
        id: "general-faq",
        label: "General Questions",
        description: "Coverage basics and pricing",
        articleCount: 12,
        icon: "MessageCircle",
      },
      {
        id: "integration-faq",
        label: "Integration Questions",
        description: "Setup and technical FAQs",
        articleCount: 10,
        icon: "Settings",
      },
      {
        id: "partner-faq",
        label: "Partner Questions",
        description: "Commission and payouts",
        articleCount: 8,
        icon: "Handshake",
      },
      {
        id: "claims-faq",
        label: "Claims Questions",
        description: "Filing and processing claims",
        articleCount: 8,
        icon: "FileText",
      },
      {
        id: "technical-faq",
        label: "Technical Questions",
        description: "Errors and compatibility",
        articleCount: 4,
        icon: "Code",
      },
    ],
  },
  {
    id: "training",
    label: "Training & Certification",
    description: "Courses, tutorials, and certification programs for partners and developers.",
    icon: "GraduationCap",
    iconColor: "#EC4899",
    backgroundColor: "#FDF2F8",
    order: 7,
    articleCount: 16,
    featured: true,
    subcategories: [
      {
        id: "courses",
        label: "Online Courses",
        description: "Self-paced learning paths",
        articleCount: 6,
        icon: "BookOpen",
      },
      {
        id: "workshops",
        label: "Live Workshops",
        description: "Interactive training sessions",
        articleCount: 4,
        icon: "Users",
      },
      {
        id: "certification",
        label: "Certifications",
        description: "Become a certified partner",
        articleCount: 3,
        icon: "Award",
      },
      {
        id: "webinars",
        label: "Webinars",
        description: "Recorded and live webinars",
        articleCount: 3,
        icon: "Video",
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Advanced features, white-labeling, and dedicated support for enterprise partners.",
    icon: "Building",
    iconColor: "#6366F1",
    backgroundColor: "#EEF2FF",
    order: 8,
    articleCount: 14,
    featured: false,
    subcategories: [
      {
        id: "white-label",
        label: "White Labeling",
        description: "Custom branding options",
        articleCount: 5,
        icon: "Palette",
      },
      {
        id: "advanced-api",
        label: "Advanced API Features",
        description: "Enterprise API capabilities",
        articleCount: 4,
        icon: "Zap",
      },
      {
        id: "dedicated-support",
        label: "Dedicated Support",
        description: "Priority support options",
        articleCount: 3,
        icon: "Headphones",
      },
      {
        id: "custom-solutions",
        label: "Custom Solutions",
        description: "Tailored implementations",
        articleCount: 2,
        icon: "Package",
      },
    ],
  },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get category definition by ID
 */
export function getCategoryById(id: ArticleCategory): CategoryDefinition | undefined {
  return SUPPORT_CATEGORIES.find((cat) => cat.id === id)
}

/**
 * Get all featured categories
 */
export function getFeaturedCategories(): CategoryDefinition[] {
  return SUPPORT_CATEGORIES.filter((cat) => cat.featured).sort((a, b) => a.order - b.order)
}

/**
 * Get categories sorted by order
 */
export function getSortedCategories(): CategoryDefinition[] {
  return [...SUPPORT_CATEGORIES].sort((a, b) => a.order - b.order)
}

/**
 * Get subcategory by category and subcategory ID
 */
export function getSubcategoryById(
  categoryId: ArticleCategory,
  subcategoryId: string
): SubcategoryDefinition | undefined {
  const category = getCategoryById(categoryId)
  return category?.subcategories?.find((sub) => sub.id === subcategoryId)
}

/**
 * Get total article count across all categories
 */
export function getTotalArticleCount(): number {
  return SUPPORT_CATEGORIES.reduce((sum, cat) => sum + cat.articleCount, 0)
}

/**
 * Get category statistics
 */
export function getCategoryStats() {
  return {
    totalCategories: SUPPORT_CATEGORIES.length,
    totalArticles: getTotalArticleCount(),
    featuredCategories: SUPPORT_CATEGORIES.filter((cat) => cat.featured).length,
    averageArticlesPerCategory: Math.round(
      getTotalArticleCount() / SUPPORT_CATEGORIES.length
    ),
    categoryBreakdown: SUPPORT_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      articleCount: cat.articleCount,
      percentage: Math.round((cat.articleCount / getTotalArticleCount()) * 100),
    })),
  }
}

/**
 * Search categories by query
 */
export function searchCategories(query: string): CategoryDefinition[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return SUPPORT_CATEGORIES

  return SUPPORT_CATEGORIES.filter((cat) => {
    const matchInMain =
      cat.label.toLowerCase().includes(normalizedQuery) ||
      cat.description.toLowerCase().includes(normalizedQuery)

    const matchInSubs = cat.subcategories?.some(
      (sub) =>
        sub.label.toLowerCase().includes(normalizedQuery) ||
        sub.description.toLowerCase().includes(normalizedQuery)
    )

    return matchInMain || matchInSubs
  })
}

/**
 * Get navigation structure for sidebar
 */
export function getCategoryNavigation(): Array<{
  category: CategoryDefinition
  subcategories: SubcategoryDefinition[]
}> {
  return getSortedCategories().map((category) => ({
    category,
    subcategories: category.subcategories || [],
  }))
}

// ============================================
// CATEGORY ICON MAPPING
// ============================================

export const CATEGORY_ICON_MAP: Record<ArticleCategory, string> = {
  "getting-started": "Rocket",
  integrations: "Plug",
  "api-reference": "Code2",
  "pos-systems": "CreditCard",
  troubleshooting: "AlertCircle",
  faq: "HelpCircle",
  training: "GraduationCap",
  enterprise: "Building",
}

export const CATEGORY_COLOR_MAP: Record<ArticleCategory, string> = {
  "getting-started": "#3B82F6",
  integrations: "#8B5CF6",
  "api-reference": "#10B981",
  "pos-systems": "#F59E0B",
  troubleshooting: "#EF4444",
  faq: "#06B6D4",
  training: "#EC4899",
  enterprise: "#6366F1",
}

// ============================================
// CATEGORY ROUTES
// ============================================

export function getCategoryRoute(categoryId: ArticleCategory): string {
  return `/support/${categoryId}`
}

export function getSubcategoryRoute(categoryId: ArticleCategory, subcategoryId: string): string {
  return `/support/${categoryId}/${subcategoryId}`
}

export function getArticleRoute(categoryId: ArticleCategory, articleSlug: string): string {
  return `/support/${categoryId}/articles/${articleSlug}`
}
