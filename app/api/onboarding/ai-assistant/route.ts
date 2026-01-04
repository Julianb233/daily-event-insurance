import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  INTEGRATION_ASSISTANT_SYSTEM_PROMPT,
  generatePlatformContext,
  parseUserMessage,
  CONVERSATION_STARTERS,
  QUICK_RESPONSES,
} from "@/lib/integrations/assistant"
import {
  getIntegrationTemplate,
  detectPlatformFromText,
  generateEmbedCode
} from "@/lib/integrations/templates"

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AssistantRequest {
  messages: Message[]
  partnerId?: string
  partnerName?: string
  businessType?: string
  detectedPlatform?: string
}

/**
 * POST /api/onboarding/ai-assistant
 * Chat with the AI integration assistant
 */
export async function POST(request: NextRequest) {
  try {
    const body: AssistantRequest = await request.json()
    const { messages, partnerId, partnerName, businessType, detectedPlatform } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Messages array is required" },
        { status: 400 }
      )
    }

    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1]
    if (latestUserMessage.role !== "user") {
      return NextResponse.json(
        { success: false, error: "Last message must be from user" },
        { status: 400 }
      )
    }

    // Parse the user message for context
    const parsed = parseUserMessage(latestUserMessage.content)
    const platformSlug = detectedPlatform || parsed.detectedPlatform

    // Build dynamic context based on conversation state
    let dynamicContext = ""

    // Add partner context if available
    if (partnerId || partnerName) {
      dynamicContext += `\n## Partner Context\n`
      if (partnerName) dynamicContext += `- Partner Business: ${partnerName}\n`
      if (businessType) dynamicContext += `- Business Type: ${businessType}\n`
      if (partnerId) dynamicContext += `- Partner ID: ${partnerId}\n`
    }

    // Add platform-specific context
    if (platformSlug) {
      dynamicContext += generatePlatformContext(platformSlug)

      // Add relevant code snippets
      const template = getIntegrationTemplate(platformSlug)
      if (template && partnerId) {
        dynamicContext += `\n## Webhook URL for this Partner\n`
        dynamicContext += `\`${template.webhookEndpoint(partnerId)}\`\n`
      }
    }

    // Build the full system prompt
    const fullSystemPrompt = `${INTEGRATION_ASSISTANT_SYSTEM_PROMPT}

${dynamicContext}

## Quick Response References
You can use these for common questions:
- Time to integrate: ${QUICK_RESPONSES.how_long}
- Technical skill needed: ${QUICK_RESPONSES.technical_skill}
- Cost: ${QUICK_RESPONSES.cost}
- Support: ${QUICK_RESPONSES.support}
- Testing: ${QUICK_RESPONSES.testing}
- Multiple platforms: ${QUICK_RESPONSES.multiple_platforms}

## Current Conversation State
- Detected Platform: ${platformSlug || "Not yet determined"}
- User Sentiment: ${parsed.sentiment}
- Is Question: ${parsed.isQuestion}
- Mentioned Features: ${parsed.mentionedFeatures.join(", ") || "None"}
- Suggested Next Step: ${parsed.nextStep}`

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a mock response for development
      const mockResponse = generateMockResponse(latestUserMessage.content, platformSlug, partnerId)
      return NextResponse.json({
        success: true,
        message: mockResponse.content,
        detectedPlatform: platformSlug || mockResponse.detectedPlatform,
        codeSnippet: mockResponse.codeSnippet,
        currentStep: mockResponse.currentStep
      })
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: fullSystemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    // Extract the assistant's response
    const assistantMessage = response.content[0].type === "text"
      ? response.content[0].text
      : ""

    // Check if the response contains code that should be highlighted
    let codeSnippet: string | undefined
    const codeMatch = assistantMessage.match(/```[\s\S]*?```/)
    if (codeMatch) {
      codeSnippet = codeMatch[0]
    }

    // Detect if platform was mentioned in the response
    const responseDetectedPlatform = detectPlatformFromText(assistantMessage)

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      detectedPlatform: platformSlug || responseDetectedPlatform,
      codeSnippet,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    })
  } catch (error) {
    console.error("[AI Assistant] Error:", error)

    // Return helpful error message
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get response from assistant",
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or reach out to our support team at support@dailyeventinsurance.com for immediate assistance."
      },
      { status: 500 }
    )
  }
}

/**
 * Generate a mock response for development/demo mode
 */
function generateMockResponse(
  userMessage: string,
  platformSlug: string | null,
  partnerId?: string
): {
  content: string
  detectedPlatform: string | null
  codeSnippet?: string
  currentStep?: number
} {
  const normalizedMessage = userMessage.toLowerCase()

  // Detect platform from message
  const detectedPlatform = platformSlug || detectPlatformFromText(userMessage)

  // Handle initial greeting
  if (normalizedMessage.includes("hello") ||
      normalizedMessage.includes("hi") ||
      normalizedMessage.includes("help") ||
      normalizedMessage.includes("get started")) {
    return {
      content: `Hi there! 👋 I'm your integration assistant, here to help you set up Daily Event Insurance with your business systems.

To get started, could you tell me what software you use to:
- **Manage bookings/appointments** (e.g., Mindbody, Zen Planner)
- **Run your online store** (e.g., Shopify, WooCommerce)
- **Process payments** (e.g., Square, Stripe)

Or if you just want a simple widget for your website, I can generate that right away!`,
      detectedPlatform: null
    }
  }

  // Handle platform-specific responses
  if (detectedPlatform) {
    const template = getIntegrationTemplate(detectedPlatform)
    if (template) {
      const webhookUrl = partnerId
        ? template.webhookEndpoint(partnerId)
        : template.webhookEndpoint("YOUR_PARTNER_ID")

      return {
        content: `Great choice! **${template.name}** is a popular platform, and we have a great integration for it.

Here's how to set it up:

**Step 1: ${template.setupSteps[0].title}**
${template.setupSteps[0].instructions}

**Your Webhook URL:**
\`\`\`
${webhookUrl}
\`\`\`

Copy this URL - you'll need it in the next step.

Would you like me to walk you through the complete setup, or do you have any questions?`,
        detectedPlatform,
        codeSnippet: webhookUrl,
        currentStep: 1
      }
    }
  }

  // Handle widget/embed requests
  if (normalizedMessage.includes("widget") ||
      normalizedMessage.includes("embed") ||
      normalizedMessage.includes("website")) {
    const embedCode = generateEmbedCode(partnerId || "YOUR_PARTNER_ID", "iframe")

    return {
      content: `Sure! Here's a simple widget you can embed on any website:

${embedCode}

**To use this:**
1. Copy the code above
2. Paste it into your website where you want the insurance widget to appear
3. Common locations: checkout page, booking confirmation, footer

The widget is fully responsive and will adapt to your site's design.

Would you like me to show you other embed options (JavaScript widget, popup, or styled button)?`,
      detectedPlatform: "generic-widget",
      codeSnippet: embedCode
    }
  }

  // Handle questions about the service
  if (normalizedMessage.includes("how long") || normalizedMessage.includes("time")) {
    return {
      content: QUICK_RESPONSES.how_long + "\n\nWhat platform are you looking to integrate with?",
      detectedPlatform: null
    }
  }

  if (normalizedMessage.includes("cost") || normalizedMessage.includes("price") || normalizedMessage.includes("free")) {
    return {
      content: QUICK_RESPONSES.cost + "\n\nShall I help you get set up?",
      detectedPlatform: null
    }
  }

  // Default response
  return {
    content: `I'd be happy to help! To give you the best guidance, could you tell me:

1. **What system do you use** for managing your business? (bookings, payments, etc.)
2. **What's your goal** - automatic insurance offers, website widget, or something else?

Common integrations I can help with:
- 🏋️ **Fitness POS**: Mindbody, Zen Planner
- 🛒 **E-commerce**: Shopify, WooCommerce
- 💳 **Payments**: Square, Stripe
- 🌐 **Any Website**: Simple embed widget`,
    detectedPlatform: null
  }
}

/**
 * GET /api/onboarding/ai-assistant
 * Get available platforms and templates
 */
export async function GET() {
  const platforms = [
    {
      slug: "mindbody",
      name: "Mindbody",
      category: "pos",
      description: "Fitness and wellness business management"
    },
    {
      slug: "zen-planner",
      name: "Zen Planner",
      category: "pos",
      description: "Gym management software"
    },
    {
      slug: "shopify",
      name: "Shopify",
      category: "ecommerce",
      description: "E-commerce platform"
    },
    {
      slug: "woocommerce",
      name: "WooCommerce",
      category: "ecommerce",
      description: "WordPress e-commerce plugin"
    },
    {
      slug: "square",
      name: "Square",
      category: "payments",
      description: "Payment processing and POS"
    },
    {
      slug: "stripe",
      name: "Stripe",
      category: "payments",
      description: "Payment infrastructure"
    },
    {
      slug: "generic-widget",
      name: "Website Widget",
      category: "embed",
      description: "Universal embed for any website"
    }
  ]

  const categories = [
    { slug: "pos", name: "Point of Sale / Booking" },
    { slug: "ecommerce", name: "E-Commerce" },
    { slug: "payments", name: "Payment Processing" },
    { slug: "embed", name: "Website Embed" }
  ]

  return NextResponse.json({
    success: true,
    platforms,
    categories,
    conversationStarters: CONVERSATION_STARTERS
  })
}
