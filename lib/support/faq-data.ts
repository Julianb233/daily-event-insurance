// FAQ Data with 25+ questions organized by category

export type FAQCategory =
  | "general"
  | "integration"
  | "partners"
  | "claims"
  | "technical"

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  keywords: string[]
  helpful?: number
  notHelpful?: number
}

export interface FAQCategoryInfo {
  id: FAQCategory
  label: string
  description: string
  icon: string
}

export const faqCategories: FAQCategoryInfo[] = [
  {
    id: "general",
    label: "General",
    description: "Coverage basics, pricing, and eligibility",
    icon: "HelpCircle",
  },
  {
    id: "integration",
    label: "Integration",
    description: "API, widget, and POS systems",
    icon: "Code",
  },
  {
    id: "partners",
    label: "Partners",
    description: "Commission, onboarding, and payouts",
    icon: "Handshake",
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
    description: "Troubleshooting, errors, and compatibility",
    icon: "Wrench",
  },
]

export const faqData: FAQItem[] = [
  // ============================================
  // GENERAL - Coverage basics, pricing, eligibility
  // ============================================
  {
    id: "gen-1",
    question: "How quickly can members get coverage?",
    answer: "Members can purchase and activate coverage instantly - same day, same moment. No waiting periods. They receive digital proof of coverage immediately via email, which can be shown on their phone at check-in or event registration.",
    category: "general",
    keywords: ["instant", "quick", "activate", "coverage", "same day", "proof"],
  },
  {
    id: "gen-2",
    question: "What types of businesses can partner with you?",
    answer: "We work with Race Directors, Gyms & Fitness Centers, Climbing Facilities, Ski Resorts, Corporate Event Organizers, Sports Leagues, Adventure Tour Operators, and more. Our platform supports virtually any active event type where participants face elevated risk.",
    category: "general",
    keywords: ["partner", "business", "race", "gym", "fitness", "climbing", "ski", "corporate", "event"],
  },
  {
    id: "gen-3",
    question: "What specifically does the insurance cover?",
    answer: "Policies are sector-specific but generally cover medical expenses, emergency transport, trip cancellation, equipment damage, and activity-related injuries. We fill the gaps that general liability misses - protecting participants rather than just the venue.",
    category: "general",
    keywords: ["cover", "medical", "emergency", "cancellation", "injuries", "liability"],
  },
  {
    id: "gen-4",
    question: "Is there a minimum commitment or contract?",
    answer: "No minimums required and no long-term contracts. You pay only for the coverage your members purchase. You can start and stop offering coverage at any time, though consistent offering typically results in higher adoption rates.",
    category: "general",
    keywords: ["minimum", "commitment", "contract", "pay", "start", "stop"],
  },
  {
    id: "gen-5",
    question: "What's the average policy price for participants?",
    answer: "Policy prices typically range from $8-25 per day depending on the activity type and coverage level. High-risk activities like mountain biking or rock climbing may be slightly higher, while fitness classes are on the lower end. All pricing is transparent with no hidden fees.",
    category: "general",
    keywords: ["price", "cost", "average", "policy", "fee", "expensive"],
  },
  {
    id: "gen-6",
    question: "Can coverage be purchased for multi-day events?",
    answer: "Yes, we offer flexible duration options. Single-day, weekend, weekly, and even seasonal passes are available. Multi-day purchases receive a discounted per-day rate. For events lasting more than 7 days, contact us for custom pricing.",
    category: "general",
    keywords: ["multi-day", "duration", "weekend", "weekly", "seasonal", "long"],
  },
  {
    id: "gen-7",
    question: "Who underwrites the insurance policies?",
    answer: "Our policies are underwritten by A-rated carriers with extensive experience in sports and event insurance. We work with Lloyd's syndicates and domestic carriers to ensure broad coverage and financial stability.",
    category: "general",
    keywords: ["underwrite", "carrier", "Lloyd's", "insurance company", "backing"],
  },

  // ============================================
  // INTEGRATION - API, widget, POS systems
  // ============================================
  {
    id: "int-1",
    question: "How do I integrate with my existing registration systems?",
    answer: "We offer seamless integration with major platforms like RunSignup, BikeReg, MindBody, Zen Planner, and others. Most partners are live within 24-48 hours using our pre-built connectors. For custom systems, our REST API provides full flexibility.",
    category: "integration",
    keywords: ["integrate", "RunSignup", "BikeReg", "MindBody", "Zen Planner", "API", "registration"],
  },
  {
    id: "int-2",
    question: "Do you have an embeddable widget for my website?",
    answer: "Yes, our JavaScript widget can be embedded on any website with just a few lines of code. It's fully customizable to match your branding - colors, fonts, and messaging can all be configured. The widget handles the entire purchase flow without redirecting users away from your site.",
    category: "integration",
    keywords: ["widget", "embed", "website", "JavaScript", "customize", "branding"],
  },
  {
    id: "int-3",
    question: "Can you integrate with my POS system for in-person sales?",
    answer: "Absolutely. We integrate with Square, Clover, Toast, and other major POS systems. Your staff can offer coverage during in-person check-in or registration with a simple button press. We also offer tablet kiosk solutions for self-service.",
    category: "integration",
    keywords: ["POS", "Square", "Clover", "Toast", "in-person", "kiosk", "tablet"],
  },
  {
    id: "int-4",
    question: "What does your API offer?",
    answer: "Our REST API provides endpoints for: generating quotes, creating policies, retrieving coverage certificates, checking policy status, and accessing reporting data. Full documentation with code examples is available in your partner dashboard. We support webhooks for real-time event notifications.",
    category: "integration",
    keywords: ["API", "REST", "endpoints", "quotes", "policies", "webhooks", "documentation"],
  },
  {
    id: "int-5",
    question: "How long does technical integration typically take?",
    answer: "Pre-built integrations (RunSignup, MindBody, etc.) are typically live within 24-48 hours. Custom widget implementations take 1-3 days. Full API integrations vary based on complexity but average 1-2 weeks. Our integration team provides dedicated support throughout.",
    category: "integration",
    keywords: ["integration", "time", "how long", "setup", "implementation", "timeline"],
  },
  {
    id: "int-6",
    question: "Is sandbox/test environment available?",
    answer: "Yes, we provide a full sandbox environment that mirrors production. You can test the complete purchase flow, API calls, and webhook integrations without creating real policies or charges. Test API keys are available immediately upon partner registration.",
    category: "integration",
    keywords: ["sandbox", "test", "development", "staging", "environment", "testing"],
  },

  // ============================================
  // PARTNERS - Commission, onboarding, payouts
  // ============================================
  {
    id: "par-1",
    question: "What's the revenue sharing model?",
    answer: "Partners earn 20-40% commission on every policy sold. Commission rates are volume-based - the more participants you cover, the higher your rate. Base rate starts at 20%, with automatic tier upgrades as you grow. Top-tier partners at 1000+ policies per month earn 40%.",
    category: "partners",
    keywords: ["revenue", "commission", "sharing", "earn", "percentage", "money"],
  },
  {
    id: "par-2",
    question: "How do I get paid for commissions?",
    answer: "Commissions are paid monthly via ACH direct deposit or check, your choice. Payments are issued by the 15th of the following month for the previous month's sales. You can track earnings in real-time through your partner dashboard.",
    category: "partners",
    keywords: ["paid", "payment", "commission", "ACH", "check", "monthly", "deposit"],
  },
  {
    id: "par-3",
    question: "What does the partner onboarding process look like?",
    answer: "Onboarding is straightforward: 1) Complete partner application (5 minutes), 2) Receive approval (typically same day), 3) Integration setup call with our team, 4) Technical implementation (24 hours - 2 weeks depending on method), 5) Go live and start earning.",
    category: "partners",
    keywords: ["onboarding", "process", "start", "begin", "application", "approval"],
  },
  {
    id: "par-4",
    question: "Do you provide marketing materials?",
    answer: "Yes, we provide a complete marketing toolkit including: email templates, social media graphics, print flyers, website banners, staff training guides, and participant FAQ sheets. All materials are customizable with your branding. High-performing partners also get access to co-marketing opportunities.",
    category: "partners",
    keywords: ["marketing", "materials", "assets", "graphics", "templates", "flyers", "promotion"],
  },
  {
    id: "par-5",
    question: "Can I white-label the insurance offering?",
    answer: "Yes, white-label options are available for partners at higher volume tiers. This includes custom branding on the purchase flow, certificates, and communications. White-label partners maintain their brand experience while we handle all the insurance infrastructure.",
    category: "partners",
    keywords: ["white-label", "branding", "custom", "logo", "brand"],
  },
  {
    id: "par-6",
    question: "Is there a dedicated account manager?",
    answer: "Partners with 100+ monthly policies receive a dedicated account manager. All partners have access to our support team via chat, email, and phone. We also offer quarterly business reviews to help optimize your coverage offerings and conversion rates.",
    category: "partners",
    keywords: ["account manager", "support", "dedicated", "contact", "help"],
  },

  // ============================================
  // CLAIMS - Filing, processing, documentation
  // ============================================
  {
    id: "clm-1",
    question: "How do participants file a claim?",
    answer: "Participants can file claims through our online portal, mobile app, or by calling our claims hotline. They'll need their policy number (sent via email at purchase), description of the incident, and any relevant documentation. Most claims can be started in under 5 minutes.",
    category: "claims",
    keywords: ["file", "claim", "submit", "how", "portal", "app", "hotline"],
  },
  {
    id: "clm-2",
    question: "What documentation is required for a claim?",
    answer: "Required documentation varies by claim type but typically includes: incident report or medical records, receipts for expenses, photos if applicable, and police report for theft claims. Our claims team guides participants through exactly what's needed.",
    category: "claims",
    keywords: ["documentation", "required", "paperwork", "records", "receipts", "photos"],
  },
  {
    id: "clm-3",
    question: "How long does claim processing take?",
    answer: "Simple claims (under $1,000) are typically processed within 5-7 business days. Complex claims may take 2-4 weeks depending on documentation requirements. We provide status updates throughout and prioritize timely resolution.",
    category: "claims",
    keywords: ["processing", "time", "how long", "days", "weeks", "duration"],
  },
  {
    id: "clm-4",
    question: "Is there a claims hotline for emergencies?",
    answer: "Yes, our 24/7 emergency claims hotline is available for urgent situations requiring immediate assistance. For medical emergencies, participants should always call 911 first, then our hotline can help coordinate coverage and next steps.",
    category: "claims",
    keywords: ["hotline", "emergency", "24/7", "urgent", "phone", "call"],
  },
  {
    id: "clm-5",
    question: "What's the claims approval rate?",
    answer: "Our claims approval rate exceeds 95% for properly documented claims within policy coverage. We design our policies to pay claims, not deny them. Clear coverage terms upfront means fewer surprises during the claims process.",
    category: "claims",
    keywords: ["approval", "rate", "denied", "accepted", "percentage"],
  },
  {
    id: "clm-6",
    question: "Does filing claims affect my partner commission?",
    answer: "No, claims do not affect your commission rates or standing as a partner. We handle all claims separately from the partner relationship. High claim rates in specific activities may lead to pricing adjustments, but this never impacts earned commissions.",
    category: "claims",
    keywords: ["commission", "affect", "impact", "partner", "claims"],
  },

  // ============================================
  // TECHNICAL - Troubleshooting, errors, compatibility
  // ============================================
  {
    id: "tech-1",
    question: "The widget isn't loading on my website. What should I check?",
    answer: "Common causes: 1) Ensure the script tag is placed before the closing </body> tag, 2) Check that your API key is correct and matches your domain, 3) Verify no JavaScript errors in browser console, 4) Confirm Content Security Policy allows our domain. Contact support with your URL for quick diagnosis.",
    category: "technical",
    keywords: ["widget", "loading", "not working", "error", "script", "broken"],
  },
  {
    id: "tech-2",
    question: "I'm getting API authentication errors. How do I fix this?",
    answer: "Authentication errors usually indicate: 1) Invalid or expired API key, 2) Missing Authorization header, 3) Using test keys in production or vice versa. Regenerate your API key in the dashboard if needed. Ensure you're using 'Bearer {api_key}' format in the Authorization header.",
    category: "technical",
    keywords: ["API", "authentication", "error", "401", "unauthorized", "key"],
  },
  {
    id: "tech-3",
    question: "What browsers and devices are supported?",
    answer: "We support all modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions). Mobile support includes iOS Safari 14+, Chrome for Android. Internet Explorer is not supported. Our widget is fully responsive and optimized for touch devices.",
    category: "technical",
    keywords: ["browser", "support", "mobile", "device", "Chrome", "Safari", "Firefox"],
  },
  {
    id: "tech-4",
    question: "How do I troubleshoot webhook delivery issues?",
    answer: "Check the webhook logs in your dashboard for delivery attempts and response codes. Common issues: 1) Your endpoint returning non-2xx status, 2) Timeout (webhooks must respond within 30 seconds), 3) SSL certificate issues. Test with our webhook testing tool before going live.",
    category: "technical",
    keywords: ["webhook", "delivery", "troubleshoot", "failed", "not receiving"],
  },
  {
    id: "tech-5",
    question: "Is there rate limiting on the API?",
    answer: "Yes, API rate limits are: 100 requests/minute for standard endpoints, 20 requests/minute for quote generation. Rate limit headers are included in all responses. If you need higher limits, contact us about enterprise tier access.",
    category: "technical",
    keywords: ["rate limit", "throttle", "429", "too many requests", "limit"],
  },
  {
    id: "tech-6",
    question: "How do I test the integration without creating real policies?",
    answer: "Use our sandbox environment with test API keys. In sandbox mode, use test card number 4242 4242 4242 4242 with any future expiry date. All sandbox transactions are free and don't create real policies. Toggle between sandbox and production in your dashboard.",
    category: "technical",
    keywords: ["test", "sandbox", "development", "fake", "dummy", "staging"],
  },
]

// Helper function to search FAQs
export function searchFAQs(query: string, category?: FAQCategory): FAQItem[] {
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery && !category) {
    return faqData
  }

  return faqData.filter((faq) => {
    // Category filter
    if (category && faq.category !== category) {
      return false
    }

    // If no search query, return all in category
    if (!normalizedQuery) {
      return true
    }

    // Search in question, answer, and keywords
    const questionMatch = faq.question.toLowerCase().includes(normalizedQuery)
    const answerMatch = faq.answer.toLowerCase().includes(normalizedQuery)
    const keywordMatch = faq.keywords.some((kw) =>
      kw.toLowerCase().includes(normalizedQuery)
    )

    return questionMatch || answerMatch || keywordMatch
  })
}

// Helper function to get FAQs by category
export function getFAQsByCategory(category: FAQCategory): FAQItem[] {
  return faqData.filter((faq) => faq.category === category)
}

// Helper function to get category info
export function getCategoryInfo(category: FAQCategory): FAQCategoryInfo | undefined {
  return faqCategories.find((cat) => cat.id === category)
}
