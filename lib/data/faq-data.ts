// FAQ Data with 25+ questions organized by category
// Categories: Getting Started, Integration, Billing, Claims, Technical

export type FAQCategory =
  | "getting-started"
  | "integration"
  | "billing"
  | "claims"
  | "technical"

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  keywords: string[]
  relatedArticles?: string[]
  helpful?: number
  notHelpful?: number
  viewCount?: number
  lastUpdated?: Date
}

export interface FAQCategoryInfo {
  id: FAQCategory
  label: string
  description: string
  icon: string
}

export const faqCategories: FAQCategoryInfo[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    description: "Basics, setup, and first steps",
    icon: "Rocket",
  },
  {
    id: "integration",
    label: "Integration",
    description: "API, widget, and platform connections",
    icon: "Code",
  },
  {
    id: "billing",
    label: "Billing",
    description: "Pricing, payments, and commissions",
    icon: "CreditCard",
  },
  {
    id: "claims",
    label: "Claims",
    description: "Filing, processing, and documentation",
    icon: "FileCheck",
  },
  {
    id: "technical",
    label: "Technical",
    description: "Troubleshooting and compatibility",
    icon: "Wrench",
  },
]

export const faqData: FAQItem[] = [
  // ============================================
  // GETTING STARTED - Basics, setup, first steps
  // ============================================
  {
    id: "gs-1",
    question: "How quickly can members get coverage?",
    answer:
      "Members can purchase and activate coverage instantly - same day, same moment. No waiting periods. They receive digital proof of coverage immediately via email, which can be shown on their phone at check-in or event registration.",
    category: "getting-started",
    keywords: ["instant", "quick", "activate", "coverage", "same day", "proof", "start"],
    relatedArticles: ["gs-2", "gs-3"],
    viewCount: 1890,
    helpful: 234,
  },
  {
    id: "gs-2",
    question: "What types of businesses can partner with you?",
    answer:
      "We work with Race Directors, Gyms & Fitness Centers, Climbing Facilities, Ski Resorts, Corporate Event Organizers, Sports Leagues, Adventure Tour Operators, and more. Our platform supports virtually any active event type where participants face elevated risk.",
    category: "getting-started",
    keywords: ["partner", "business", "race", "gym", "fitness", "climbing", "ski", "corporate", "event", "eligible"],
    relatedArticles: ["gs-1", "gs-4"],
    viewCount: 1456,
    helpful: 189,
  },
  {
    id: "gs-3",
    question: "What specifically does the insurance cover?",
    answer:
      "Policies are sector-specific but generally cover medical expenses, emergency transport, trip cancellation, equipment damage, and activity-related injuries. We fill the gaps that general liability misses - protecting participants rather than just the venue.",
    category: "getting-started",
    keywords: ["cover", "medical", "emergency", "cancellation", "injuries", "liability", "protection"],
    relatedArticles: ["gs-5", "cl-1"],
    viewCount: 2100,
    helpful: 278,
  },
  {
    id: "gs-4",
    question: "Is there a minimum commitment or contract?",
    answer:
      "No minimums required and no long-term contracts. You pay only for the coverage your members purchase. You can start and stop offering coverage at any time, though consistent offering typically results in higher adoption rates.",
    category: "getting-started",
    keywords: ["minimum", "commitment", "contract", "pay", "start", "stop", "no minimum"],
    relatedArticles: ["bi-1", "bi-2"],
    viewCount: 987,
    helpful: 156,
  },
  {
    id: "gs-5",
    question: "What's the average policy price for participants?",
    answer:
      "Policy prices typically range from $8-25 per day depending on the activity type and coverage level. High-risk activities like mountain biking or rock climbing may be slightly higher, while fitness classes are on the lower end. All pricing is transparent with no hidden fees.",
    category: "getting-started",
    keywords: ["price", "cost", "average", "policy", "fee", "expensive", "cheap", "affordable"],
    relatedArticles: ["bi-3", "gs-3"],
    viewCount: 1567,
    helpful: 201,
  },
  {
    id: "gs-6",
    question: "Can coverage be purchased for multi-day events?",
    answer:
      "Yes, we offer flexible duration options. Single-day, weekend, weekly, and even seasonal passes are available. Multi-day purchases receive a discounted per-day rate. For events lasting more than 7 days, contact us for custom pricing.",
    category: "getting-started",
    keywords: ["multi-day", "duration", "weekend", "weekly", "seasonal", "long", "multiple days"],
    relatedArticles: ["gs-5", "bi-3"],
    viewCount: 876,
    helpful: 134,
  },
  {
    id: "gs-7",
    question: "Who underwrites the insurance policies?",
    answer:
      "Our policies are underwritten by A-rated carriers with extensive experience in sports and event insurance. We work with Lloyd's syndicates and domestic carriers to ensure broad coverage and financial stability.",
    category: "getting-started",
    keywords: ["underwrite", "carrier", "Lloyd's", "insurance company", "backing", "rated"],
    relatedArticles: ["gs-3", "cl-5"],
    viewCount: 654,
    helpful: 98,
  },

  // ============================================
  // INTEGRATION - API, widget, platform connections
  // ============================================
  {
    id: "int-1",
    question: "How do I integrate with my existing registration systems?",
    answer:
      "We offer seamless integration with major platforms like RunSignup, BikeReg, MindBody, Zen Planner, and others. Most partners are live within 24-48 hours using our pre-built connectors. For custom systems, our REST API provides full flexibility.",
    category: "integration",
    keywords: ["integrate", "RunSignup", "BikeReg", "MindBody", "Zen Planner", "API", "registration", "connect"],
    relatedArticles: ["int-2", "int-4"],
    viewCount: 2345,
    helpful: 312,
  },
  {
    id: "int-2",
    question: "Do you have an embeddable widget for my website?",
    answer:
      "Yes, our JavaScript widget can be embedded on any website with just a few lines of code. It's fully customizable to match your branding - colors, fonts, and messaging can all be configured. The widget handles the entire purchase flow without redirecting users away from your site.",
    category: "integration",
    keywords: ["widget", "embed", "website", "JavaScript", "customize", "branding", "code snippet"],
    relatedArticles: ["int-1", "tech-1"],
    viewCount: 1987,
    helpful: 267,
  },
  {
    id: "int-3",
    question: "Can you integrate with my POS system for in-person sales?",
    answer:
      "Absolutely. We integrate with Square, Clover, Toast, and other major POS systems. Your staff can offer coverage during in-person check-in or registration with a simple button press. We also offer tablet kiosk solutions for self-service.",
    category: "integration",
    keywords: ["POS", "Square", "Clover", "Toast", "in-person", "kiosk", "tablet", "point of sale"],
    relatedArticles: ["int-1", "int-5"],
    viewCount: 1234,
    helpful: 178,
  },
  {
    id: "int-4",
    question: "What does your API offer?",
    answer:
      "Our REST API provides endpoints for: generating quotes, creating policies, retrieving coverage certificates, checking policy status, and accessing reporting data. Full documentation with code examples is available in your partner dashboard. We support webhooks for real-time event notifications.",
    category: "integration",
    keywords: ["API", "REST", "endpoints", "quotes", "policies", "webhooks", "documentation", "developer"],
    relatedArticles: ["int-1", "tech-4"],
    viewCount: 1876,
    helpful: 234,
  },
  {
    id: "int-5",
    question: "How long does technical integration typically take?",
    answer:
      "Pre-built integrations (RunSignup, MindBody, etc.) are typically live within 24-48 hours. Custom widget implementations take 1-3 days. Full API integrations vary based on complexity but average 1-2 weeks. Our integration team provides dedicated support throughout.",
    category: "integration",
    keywords: ["integration", "time", "how long", "setup", "implementation", "timeline", "days", "weeks"],
    relatedArticles: ["int-1", "int-2"],
    viewCount: 1123,
    helpful: 167,
  },
  {
    id: "int-6",
    question: "Is a sandbox/test environment available?",
    answer:
      "Yes, we provide a full sandbox environment that mirrors production. You can test the complete purchase flow, API calls, and webhook integrations without creating real policies or charges. Test API keys are available immediately upon partner registration.",
    category: "integration",
    keywords: ["sandbox", "test", "development", "staging", "environment", "testing", "demo"],
    relatedArticles: ["int-4", "tech-6"],
    viewCount: 945,
    helpful: 145,
  },

  // ============================================
  // BILLING - Pricing, payments, commissions
  // ============================================
  {
    id: "bi-1",
    question: "What's the revenue sharing model?",
    answer:
      "Partners earn 20-40% commission on every policy sold. Commission rates are volume-based - the more participants you cover, the higher your rate. Base rate starts at 20%, with automatic tier upgrades as you grow. Top-tier partners at 1000+ policies per month earn 40%.",
    category: "billing",
    keywords: ["revenue", "commission", "sharing", "earn", "percentage", "money", "income", "profit"],
    relatedArticles: ["bi-2", "bi-3"],
    viewCount: 3456,
    helpful: 456,
  },
  {
    id: "bi-2",
    question: "How do I get paid for commissions?",
    answer:
      "Commissions are paid monthly via ACH direct deposit or check, your choice. Payments are issued by the 15th of the following month for the previous month's sales. You can track earnings in real-time through your partner dashboard.",
    category: "billing",
    keywords: ["paid", "payment", "commission", "ACH", "check", "monthly", "deposit", "earnings"],
    relatedArticles: ["bi-1", "bi-4"],
    viewCount: 2345,
    helpful: 312,
  },
  {
    id: "bi-3",
    question: "Are there any setup fees or monthly costs?",
    answer:
      "There are no setup fees, no monthly costs, and no hidden charges. You only pay when your members purchase coverage, and that's simply a deduction from the commission we pay you. It's a completely risk-free revenue stream.",
    category: "billing",
    keywords: ["setup", "fees", "monthly", "cost", "free", "charges", "hidden", "pricing"],
    relatedArticles: ["bi-1", "gs-4"],
    viewCount: 1987,
    helpful: 278,
  },
  {
    id: "bi-4",
    question: "Can I track my earnings in real-time?",
    answer:
      "Yes, your partner dashboard provides real-time analytics including: policies sold, revenue generated, commission earned, conversion rates, and trending data. You can export reports for any date range and filter by event type or location.",
    category: "billing",
    keywords: ["track", "earnings", "dashboard", "analytics", "reports", "real-time", "revenue"],
    relatedArticles: ["bi-2", "bi-1"],
    viewCount: 1234,
    helpful: 189,
  },
  {
    id: "bi-5",
    question: "What payment methods do you accept from customers?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, Apple Pay, Google Pay, and PayPal. For enterprise partners, we also support invoicing for bulk purchases.",
    category: "billing",
    keywords: ["payment", "credit card", "debit", "Apple Pay", "Google Pay", "PayPal", "methods"],
    relatedArticles: ["gs-5", "bi-3"],
    viewCount: 876,
    helpful: 134,
  },

  // ============================================
  // CLAIMS - Filing, processing, documentation
  // ============================================
  {
    id: "cl-1",
    question: "How do participants file a claim?",
    answer:
      "Participants can file claims through our online portal, mobile app, or by calling our 24/7 claims hotline. They'll need their policy number (sent via email at purchase), description of the incident, and any relevant documentation. Most claims can be started in under 5 minutes.",
    category: "claims",
    keywords: ["file", "claim", "submit", "how", "portal", "app", "hotline", "start"],
    relatedArticles: ["cl-2", "cl-3"],
    viewCount: 2876,
    helpful: 389,
  },
  {
    id: "cl-2",
    question: "What documentation is required for a claim?",
    answer:
      "Required documentation varies by claim type but typically includes: incident report or medical records, receipts for expenses, photos if applicable, and police report for theft claims. Our claims team guides participants through exactly what's needed.",
    category: "claims",
    keywords: ["documentation", "required", "paperwork", "records", "receipts", "photos", "proof"],
    relatedArticles: ["cl-1", "cl-3"],
    viewCount: 1987,
    helpful: 267,
  },
  {
    id: "cl-3",
    question: "How long does claim processing take?",
    answer:
      "Simple claims (under $1,000) are typically processed within 5-7 business days. Complex claims may take 2-4 weeks depending on documentation requirements. We provide status updates throughout and prioritize timely resolution.",
    category: "claims",
    keywords: ["processing", "time", "how long", "days", "weeks", "duration", "speed"],
    relatedArticles: ["cl-1", "cl-5"],
    viewCount: 2345,
    helpful: 312,
  },
  {
    id: "cl-4",
    question: "Is there a claims hotline for emergencies?",
    answer:
      "Yes, our 24/7 emergency claims hotline is available for urgent situations requiring immediate assistance. For medical emergencies, participants should always call 911 first, then our hotline can help coordinate coverage and next steps.",
    category: "claims",
    keywords: ["hotline", "emergency", "24/7", "urgent", "phone", "call", "immediate"],
    relatedArticles: ["cl-1", "gs-3"],
    viewCount: 1234,
    helpful: 178,
  },
  {
    id: "cl-5",
    question: "What's the claims approval rate?",
    answer:
      "Our claims approval rate exceeds 95% for properly documented claims within policy coverage. We design our policies to pay claims, not deny them. Clear coverage terms upfront means fewer surprises during the claims process.",
    category: "claims",
    keywords: ["approval", "rate", "denied", "accepted", "percentage", "success"],
    relatedArticles: ["cl-2", "gs-3"],
    viewCount: 1567,
    helpful: 234,
  },
  {
    id: "cl-6",
    question: "Does filing claims affect my partner commission?",
    answer:
      "No, claims do not affect your commission rates or standing as a partner. We handle all claims separately from the partner relationship. High claim rates in specific activities may lead to pricing adjustments, but this never impacts earned commissions.",
    category: "claims",
    keywords: ["commission", "affect", "impact", "partner", "claims", "relationship"],
    relatedArticles: ["bi-1", "cl-5"],
    viewCount: 876,
    helpful: 145,
  },

  // ============================================
  // TECHNICAL - Troubleshooting and compatibility
  // ============================================
  {
    id: "tech-1",
    question: "The widget isn't loading on my website. What should I check?",
    answer:
      "Common causes: 1) Ensure the script tag is placed before the closing </body> tag, 2) Check that your API key is correct and matches your domain, 3) Verify no JavaScript errors in browser console, 4) Confirm Content Security Policy allows our domain. Contact support with your URL for quick diagnosis.",
    category: "technical",
    keywords: ["widget", "loading", "not working", "error", "script", "broken", "display"],
    relatedArticles: ["tech-2", "int-2"],
    viewCount: 2345,
    helpful: 312,
  },
  {
    id: "tech-2",
    question: "I'm getting API authentication errors. How do I fix this?",
    answer:
      "Authentication errors usually indicate: 1) Invalid or expired API key, 2) Missing Authorization header, 3) Using test keys in production or vice versa. Regenerate your API key in the dashboard if needed. Ensure you're using 'Bearer {api_key}' format in the Authorization header.",
    category: "technical",
    keywords: ["API", "authentication", "error", "401", "unauthorized", "key", "auth"],
    relatedArticles: ["tech-1", "int-4"],
    viewCount: 1876,
    helpful: 256,
  },
  {
    id: "tech-3",
    question: "What browsers and devices are supported?",
    answer:
      "We support all modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions). Mobile support includes iOS Safari 14+, Chrome for Android. Internet Explorer is not supported. Our widget is fully responsive and optimized for touch devices.",
    category: "technical",
    keywords: ["browser", "support", "mobile", "device", "Chrome", "Safari", "Firefox", "Edge"],
    relatedArticles: ["int-2", "tech-1"],
    viewCount: 987,
    helpful: 156,
  },
  {
    id: "tech-4",
    question: "How do I troubleshoot webhook delivery issues?",
    answer:
      "Check the webhook logs in your dashboard for delivery attempts and response codes. Common issues: 1) Your endpoint returning non-2xx status, 2) Timeout (webhooks must respond within 30 seconds), 3) SSL certificate issues. Test with our webhook testing tool before going live.",
    category: "technical",
    keywords: ["webhook", "delivery", "troubleshoot", "failed", "not receiving", "endpoint"],
    relatedArticles: ["int-4", "tech-2"],
    viewCount: 1234,
    helpful: 189,
  },
  {
    id: "tech-5",
    question: "Is there rate limiting on the API?",
    answer:
      "Yes, API rate limits are: 100 requests/minute for standard endpoints, 20 requests/minute for quote generation. Rate limit headers are included in all responses. If you need higher limits, contact us about enterprise tier access.",
    category: "technical",
    keywords: ["rate limit", "throttle", "429", "too many requests", "limit", "requests"],
    relatedArticles: ["int-4", "tech-2"],
    viewCount: 876,
    helpful: 134,
  },
  {
    id: "tech-6",
    question: "How do I test the integration without creating real policies?",
    answer:
      "Use our sandbox environment with test API keys. In sandbox mode, use test card number 4242 4242 4242 4242 with any future expiry date. All sandbox transactions are free and don't create real policies. Toggle between sandbox and production in your dashboard.",
    category: "technical",
    keywords: ["test", "sandbox", "development", "fake", "dummy", "staging", "testing"],
    relatedArticles: ["int-6", "tech-2"],
    viewCount: 1567,
    helpful: 234,
  },
]

// Search ranking weights
const SEARCH_WEIGHTS = {
  titleExact: 100,
  titlePartial: 50,
  questionWord: 30,
  keywordExact: 20,
  keywordPartial: 10,
  answerMatch: 5,
}

// Helper function to search FAQs with ranking
export function searchFAQsRanked(
  query: string,
  category?: FAQCategory
): { faq: FAQItem; score: number; matchType: string }[] {
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) {
    const results = category
      ? faqData.filter((faq) => faq.category === category)
      : faqData
    return results.map((faq) => ({ faq, score: 0, matchType: "all" }))
  }

  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2)

  const results: { faq: FAQItem; score: number; matchType: string }[] = []

  for (const faq of faqData) {
    // Category filter
    if (category && faq.category !== category) {
      continue
    }

    let score = 0
    let matchType = ""

    const questionLower = faq.question.toLowerCase()
    const answerLower = faq.answer.toLowerCase()
    const keywordsLower = faq.keywords.map((k) => k.toLowerCase())

    // Exact title match (highest priority)
    if (questionLower.includes(normalizedQuery)) {
      score += SEARCH_WEIGHTS.titleExact
      matchType = "title"
    }

    // Question word matches
    for (const word of queryWords) {
      if (questionLower.includes(word)) {
        score += SEARCH_WEIGHTS.titlePartial
        if (!matchType) matchType = "title"
      }

      // Exact keyword match
      if (keywordsLower.includes(word)) {
        score += SEARCH_WEIGHTS.keywordExact
        if (!matchType) matchType = "keyword"
      }

      // Partial keyword match
      if (keywordsLower.some((k) => k.includes(word))) {
        score += SEARCH_WEIGHTS.keywordPartial
        if (!matchType) matchType = "keyword"
      }

      // Answer match
      if (answerLower.includes(word)) {
        score += SEARCH_WEIGHTS.answerMatch
        if (!matchType) matchType = "content"
      }
    }

    // Boost by popularity
    if (faq.viewCount) {
      score += Math.min(faq.viewCount / 500, 10)
    }
    if (faq.helpful) {
      score += Math.min(faq.helpful / 50, 10)
    }

    if (score > 0) {
      results.push({ faq, score, matchType })
    }
  }

  return results.sort((a, b) => b.score - a.score)
}

// Simple search (backward compatibility)
export function searchFAQs(query: string, category?: FAQCategory): FAQItem[] {
  return searchFAQsRanked(query, category).map((r) => r.faq)
}

// Helper function to get FAQs by category
export function getFAQsByCategory(category: FAQCategory): FAQItem[] {
  return faqData.filter((faq) => faq.category === category)
}

// Helper function to get category info
export function getCategoryInfo(category: FAQCategory): FAQCategoryInfo | undefined {
  return faqCategories.find((cat) => cat.id === category)
}

// Get popular FAQs
export function getPopularFAQs(limit: number = 5): FAQItem[] {
  return [...faqData]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit)
}

// Get recently viewed FAQs (stored in localStorage)
export function getRecentlyViewedFAQs(): FAQItem[] {
  if (typeof window === "undefined") return []

  try {
    const viewed = localStorage.getItem("dei_recently_viewed_faqs")
    if (!viewed) return []

    const viewedIds: string[] = JSON.parse(viewed)
    return viewedIds
      .map((id) => faqData.find((faq) => faq.id === id))
      .filter((faq): faq is FAQItem => faq !== undefined)
  } catch {
    return []
  }
}

// Track FAQ view
export function trackFAQView(faqId: string): void {
  if (typeof window === "undefined") return

  try {
    const viewed = localStorage.getItem("dei_recently_viewed_faqs")
    const viewedIds: string[] = viewed ? JSON.parse(viewed) : []

    // Remove if exists, add to front
    const filtered = viewedIds.filter((id) => id !== faqId)
    filtered.unshift(faqId)

    // Keep only last 10
    localStorage.setItem(
      "dei_recently_viewed_faqs",
      JSON.stringify(filtered.slice(0, 10))
    )
  } catch {
    // Ignore localStorage errors
  }
}
