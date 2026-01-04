/**
 * AI Integration Assistant
 *
 * System prompts and context for the AI-powered integration helper.
 * This assistant guides partners through complex integrations.
 */

import {
  integrationTemplates,
  detectPlatformFromText,
  getIntegrationTemplate,
  categoryLabels
} from "./templates"

// System prompt for the AI assistant
export const INTEGRATION_ASSISTANT_SYSTEM_PROMPT = `You are a friendly, knowledgeable integration specialist for Daily Event Insurance. Your role is to help business owners integrate our insurance offering into their existing systems.

## Your Personality
- Friendly and approachable - like a helpful tech-savvy friend
- Patient with non-technical users
- Proactive in offering solutions
- Clear and concise in explanations
- Always assume the user might not be technical

## What You Know
You're an expert on integrating Daily Event Insurance with:
- **POS Systems**: Mindbody, Zen Planner, ClubReady
- **E-commerce**: Shopify, WooCommerce, Squarespace, BigCommerce
- **Payment Processing**: Square, Stripe, PayPal
- **Booking Systems**: Acuity, Calendly, SimplyBook
- **Custom Integrations**: REST APIs, webhooks, embeddable widgets

## Your Goals
1. Understand what system(s) the partner uses
2. Recommend the best integration approach
3. Provide step-by-step guidance
4. Generate custom code snippets when needed
5. Troubleshoot any issues

## Conversation Flow
1. **Greeting**: Welcome them and ask what system they use
2. **Discovery**: Learn about their tech stack and needs
3. **Recommendation**: Suggest the best integration method
4. **Guidance**: Walk through setup step-by-step
5. **Code Generation**: Provide customized code when applicable
6. **Testing**: Help them verify the integration works
7. **Support**: Offer to help with any issues

## Rules
- Never assume what platform they use - always ask
- Provide specific, actionable steps
- Include code snippets when helpful
- Offer alternatives if their platform isn't directly supported
- Be encouraging when they complete steps
- If something is outside your knowledge, say so and offer to connect them with support

## Code Formatting
When providing code, always:
- Use proper syntax highlighting markers
- Include comments explaining each section
- Provide copy-ready snippets
- Mention which file to put the code in

## Available Integration Methods
1. **Webhook Integration** - Automated notifications when events happen in their system
2. **Widget Embed** - Iframe or JavaScript snippet for their website
3. **API Integration** - Direct API calls for custom implementations
4. **Email Integration** - Automated insurance offers via transactional emails
5. **QR Code** - Physical or digital QR codes linking to insurance purchase

Remember: Your ultimate goal is to make insurance integration so easy that any business owner can do it, regardless of technical skill level.`

// Context about specific platforms
export const PLATFORM_CONTEXTS: Record<string, string> = {
  mindbody: `
## Mindbody Integration Context

Mindbody is a popular platform for fitness studios, gyms, spas, and wellness centers. Key integration points:

- **Webhooks**: Subscribe to class bookings, appointments, and new client events
- **API Access**: Requires a Mindbody API account and Site ID
- **Common Use Cases**:
  - Send insurance offer after class is booked
  - Add insurance option during online checkout
  - Trigger post-visit follow-up emails

**Setup Complexity**: Medium (requires API key setup)
**Time to Integrate**: 15-30 minutes
**Technical Skill**: Basic (copy-paste webhook URL)`,

  "zen-planner": `
## Zen Planner Integration Context

Zen Planner is gym management software popular with CrossFit boxes and martial arts studios.

- **Webhooks**: Support for reservation and check-in events
- **API Access**: Bearer token authentication
- **Common Use Cases**:
  - Insurance offer after class reservation
  - QR code display at check-in kiosk
  - Email automation for drop-in visitors

**Setup Complexity**: Low to Medium
**Time to Integrate**: 10-20 minutes
**Technical Skill**: Basic`,

  shopify: `
## Shopify Integration Context

Shopify is the leading e-commerce platform for online stores.

- **App Integration**: Can create a Shopify app or use code injection
- **Checkout Extensions**: Add insurance as checkout upsell
- **Theme Integration**: Custom Liquid snippets for product pages
- **Common Use Cases**:
  - Add insurance to cart/checkout
  - Post-purchase insurance offer email
  - Product page insurance widget

**Setup Complexity**: Low (code injection) to Medium (app)
**Time to Integrate**: 5-15 minutes for basic, 30+ for custom app
**Technical Skill**: Basic for injection, moderate for custom`,

  woocommerce: `
## WooCommerce Integration Context

WooCommerce is the most popular WordPress e-commerce plugin.

- **Plugin Integration**: Can create a WordPress plugin or use functions.php
- **Hooks**: Extensive action/filter hooks for customization
- **Shortcodes**: Can create shortcodes for easy placement
- **Common Use Cases**:
  - Checkout page insurance upsell
  - Cart add-on widget
  - Order confirmation insurance offer

**Setup Complexity**: Low to Medium
**Time to Integrate**: 10-20 minutes
**Technical Skill**: Basic (plugin) to Moderate (custom)`,

  square: `
## Square Integration Context

Square is a popular POS and payment processing platform.

- **Webhooks**: Payment, customer, and booking events
- **OAuth**: For customer data sync
- **Square Online**: Widget integration for online stores
- **Terminal Display**: Can show QR codes on Square Terminal
- **Common Use Cases**:
  - Post-payment insurance offer
  - Terminal QR code display
  - Customer sync for targeted emails

**Setup Complexity**: Medium
**Time to Integrate**: 20-30 minutes
**Technical Skill**: Basic to Moderate`,

  stripe: `
## Stripe Integration Context

Stripe is the leading payment infrastructure for internet businesses.

- **Checkout Sessions**: Add insurance as line item in Checkout
- **Payment Links**: Create shareable insurance purchase links
- **Webhooks**: Payment and customer events
- **Elements**: Custom payment forms with insurance upsell
- **Common Use Cases**:
  - Checkout upsell
  - Standalone insurance purchase
  - Post-payment follow-up

**Setup Complexity**: Low to High (depends on integration depth)
**Time to Integrate**: 10-45 minutes
**Technical Skill**: Basic (Payment Links) to Advanced (Elements)`,

  "generic-widget": `
## Generic Website Widget Context

For any website platform not specifically supported, we offer universal embed options:

- **Iframe Embed**: Works everywhere, fully isolated
- **JavaScript Widget**: More control, dynamic loading
- **Popup/Modal**: Opens overlay, great for checkout flows
- **Simple Link**: Just a styled button linking to insurance

**Works With**: Any HTML website, WordPress, Squarespace, Wix, custom sites
**Setup Complexity**: Very Low
**Time to Integrate**: 2-5 minutes
**Technical Skill**: Minimal (copy-paste)`
}

// Generate context for the AI based on detected platform
export function generatePlatformContext(platformSlug: string | null): string {
  if (!platformSlug) {
    return `
The user hasn't specified their platform yet. Ask them what system they use for:
- Managing bookings/appointments
- Processing payments
- Running their online store (if applicable)

Common platforms include: Mindbody, Zen Planner, Shopify, WooCommerce, Square, Stripe`
  }

  const platformContext = PLATFORM_CONTEXTS[platformSlug]
  const template = getIntegrationTemplate(platformSlug)

  if (!template) {
    return `
The user mentioned "${platformSlug}" but we don't have a specific template for it.
Suggest using our generic widget embed which works with any platform.
Also ask if they use any of our supported platforms for payments or bookings.`
  }

  let context = platformContext || ""
  context += `

## Available Template: ${template.name}
Category: ${categoryLabels[template.category]}

### Supported Features:
${template.supportedFeatures.map(f => `- ${f}`).join("\n")}

### Setup Steps:
${template.setupSteps.map(s => `${s.step}. ${s.title}`).join("\n")}

### Troubleshooting Tips:
${template.troubleshooting.map(t => `- **${t.issue}**: ${t.solution}`).join("\n")}
`

  return context
}

// Conversation starters based on integration type
export const CONVERSATION_STARTERS: Record<string, string> = {
  pos: "I see you're looking to integrate with a point-of-sale or booking system. Great choice! This lets you automatically offer insurance when customers book or check in. What system do you currently use?",

  ecommerce: "E-commerce integration is perfect for adding insurance as a checkout upsell. This can really boost your conversion rates! What platform is your online store built on?",

  payments: "Integrating with your payment processor means we can offer insurance right at the point of purchase - maximum visibility! What payment system do you use?",

  general: "I'm here to help you integrate Daily Event Insurance with your business systems. This could be your booking software, website, payment processor, or all of the above! What tools do you currently use to run your business?",

  widget: "If you just want a simple way to offer insurance on your website, we have an easy embed widget that works anywhere. Want me to generate the code for you?"
}

// Quick response templates for common questions
export const QUICK_RESPONSES: Record<string, string> = {
  how_long: "Integration typically takes 5-30 minutes depending on the platform. Simple widget embeds are under 5 minutes, while webhook setups take 15-30 minutes.",

  technical_skill: "Most integrations require minimal technical skill - just copying and pasting code or URLs. I'll guide you through every step!",

  cost: "There's no additional cost for integration. Daily Event Insurance is free for partners to offer - you earn commission on each policy sold.",

  support: "If you run into any issues, you can always reach our technical support team at support@dailyeventinsurance.com, or I can try to help troubleshoot right here.",

  testing: "After setup, you can test by creating a dummy booking or transaction. We have a sandbox mode for testing without affecting real customers.",

  multiple_platforms: "You can absolutely integrate with multiple platforms! Many partners use both a POS system and a website widget. I can help you set up each one."
}

// Extract structured data from user message
export interface ParsedUserMessage {
  detectedPlatform: string | null
  mentionedFeatures: string[]
  isQuestion: boolean
  sentiment: "positive" | "neutral" | "confused" | "frustrated"
  nextStep: string
}

export function parseUserMessage(message: string): ParsedUserMessage {
  const normalizedMessage = message.toLowerCase()

  // Detect platform
  const detectedPlatform = detectPlatformFromText(message)

  // Detect mentioned features
  const featureKeywords = ["webhook", "api", "widget", "embed", "email", "qr code", "checkout", "upsell"]
  const mentionedFeatures = featureKeywords.filter(k => normalizedMessage.includes(k))

  // Detect if it's a question
  const isQuestion = message.includes("?") ||
    normalizedMessage.startsWith("how") ||
    normalizedMessage.startsWith("what") ||
    normalizedMessage.startsWith("can") ||
    normalizedMessage.startsWith("does") ||
    normalizedMessage.startsWith("is")

  // Detect sentiment
  let sentiment: ParsedUserMessage["sentiment"] = "neutral"
  if (normalizedMessage.includes("not working") ||
      normalizedMessage.includes("error") ||
      normalizedMessage.includes("doesn't work") ||
      normalizedMessage.includes("frustrated")) {
    sentiment = "frustrated"
  } else if (normalizedMessage.includes("confused") ||
             normalizedMessage.includes("don't understand") ||
             normalizedMessage.includes("lost")) {
    sentiment = "confused"
  } else if (normalizedMessage.includes("thanks") ||
             normalizedMessage.includes("great") ||
             normalizedMessage.includes("perfect") ||
             normalizedMessage.includes("working")) {
    sentiment = "positive"
  }

  // Determine next step
  let nextStep = "ask_platform"
  if (detectedPlatform) {
    nextStep = "provide_instructions"
  }
  if (sentiment === "frustrated" || sentiment === "confused") {
    nextStep = "offer_support"
  }
  if (mentionedFeatures.length > 0) {
    nextStep = "discuss_feature"
  }

  return {
    detectedPlatform,
    mentionedFeatures,
    isQuestion,
    sentiment,
    nextStep
  }
}

// Format code snippet for display
export function formatCodeSnippet(code: string, language: string): string {
  return `\`\`\`${language}\n${code.trim()}\n\`\`\``
}

// Generate webhook URL for partner
export function generateWebhookUrl(partnerId: string, platform: string): string {
  return `https://dailyeventinsurance.com/api/webhooks/${platform}/${partnerId}`
}

// Export types
export interface AssistantMessage {
  role: "assistant" | "user"
  content: string
  timestamp: Date
  metadata?: {
    platform?: string
    codeSnippet?: string
    stepNumber?: number
  }
}

export interface AssistantConversation {
  id: string
  partnerId: string
  messages: AssistantMessage[]
  detectedPlatform: string | null
  currentStep: number
  completedSteps: number[]
  createdAt: Date
  updatedAt: Date
}
