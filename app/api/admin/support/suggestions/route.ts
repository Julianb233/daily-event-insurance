import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { successResponse, serverError, validationError } from "@/lib/api-responses"
import { z } from "zod"
import OpenAI from "openai"

// Validation schema for request body
const suggestionsRequestSchema = z.object({
  conversationId: z.string(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      contentType: z.enum(["text", "code", "error", "action"]),
      codeSnippet: z.string().nullable().optional(),
      codeLanguage: z.string().nullable().optional(),
      createdAt: z.string(),
    })
  ),
  topic: z.string().nullable().optional(),
  techStack: z
    .object({
      framework: z.string().optional(),
      language: z.string().optional(),
      pos: z.string().optional(),
      cms: z.string().optional(),
    })
    .nullable()
    .optional(),
  integrationContext: z
    .object({
      widgetInstalled: z.boolean().optional(),
      apiKeyGenerated: z.boolean().optional(),
      webhookConfigured: z.boolean().optional(),
      posConnected: z.boolean().optional(),
      lastError: z.string().optional(),
      currentStep: z.string().optional(),
    })
    .nullable()
    .optional(),
})

interface Suggestion {
  id: string
  type: "response" | "code" | "action"
  content: string
  codeSnippet?: string
  codeLanguage?: string
  confidence: number
  reasoning: string
  category: string
}

// Topic-specific context for better suggestions
const TOPIC_CONTEXT: Record<string, string> = {
  onboarding: `The partner is going through the onboarding process. Focus on:
- Guiding them through each step
- Explaining requirements clearly
- Providing encouragement and next steps`,
  widget_install: `The partner is installing the insurance widget. Focus on:
- Framework-specific installation instructions
- Configuration options and theming
- Troubleshooting common installation issues`,
  api_integration: `The partner is implementing the API. Focus on:
- Authentication and API key usage
- Endpoint documentation and examples
- Error handling and best practices`,
  pos_setup: `The partner is setting up POS integration. Focus on:
- POS-specific configuration steps
- Data synchronization setup
- Testing the integration`,
  troubleshooting: `The partner is experiencing issues. Focus on:
- Identifying the root cause
- Providing step-by-step fixes
- Offering to escalate if needed`,
}

// Framework-specific code examples
const FRAMEWORK_EXAMPLES: Record<string, { install: string; usage: string; language: string }> = {
  react: {
    install: "npm install @daily-event-insurance/widget-react",
    usage: `import { InsuranceWidget } from '@daily-event-insurance/widget-react';

function Checkout() {
  return (
    <InsuranceWidget
      partnerId={process.env.REACT_APP_DEI_PARTNER_ID}
      eventType="fitness_class"
      onPurchase={(policy) => console.log('Purchased:', policy)}
    />
  );
}`,
    language: "jsx",
  },
  nextjs: {
    install: "npm install @daily-event-insurance/widget-react",
    usage: `'use client';

import { InsuranceWidget } from '@daily-event-insurance/widget-react';

export default function CheckoutPage() {
  return (
    <InsuranceWidget
      partnerId={process.env.NEXT_PUBLIC_DEI_PARTNER_ID}
      eventType="fitness_class"
      onPurchase={(policy) => {
        // Handle successful purchase
        console.log('Policy purchased:', policy.id);
      }}
    />
  );
}`,
    language: "tsx",
  },
  vue: {
    install: "npm install @daily-event-insurance/widget-vue",
    usage: `<template>
  <InsuranceWidget
    :partner-id="partnerId"
    event-type="fitness_class"
    @purchase="handlePurchase"
  />
</template>

<script setup>
import { InsuranceWidget } from '@daily-event-insurance/widget-vue';

const partnerId = import.meta.env.VITE_DEI_PARTNER_ID;

function handlePurchase(policy) {
  console.log('Purchased:', policy);
}
</script>`,
    language: "vue",
  },
  vanilla: {
    install: '<script src="https://widget.dailyeventinsurance.com/v1/embed.js"></script>',
    usage: `<div id="dei-widget"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    DEIWidget.init({
      container: '#dei-widget',
      partnerId: 'YOUR_PARTNER_ID',
      eventType: 'fitness_class',
      onPurchase: function(policy) {
        console.log('Purchased:', policy);
      }
    });
  });
</script>`,
    language: "html",
  },
}

/**
 * Generate suggestions using OpenAI
 */
async function generateAISuggestions(
  messages: z.infer<typeof suggestionsRequestSchema>["messages"],
  topic: string | null | undefined,
  techStack: z.infer<typeof suggestionsRequestSchema>["techStack"],
  integrationContext: z.infer<typeof suggestionsRequestSchema>["integrationContext"]
): Promise<Suggestion[]> {
  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    // Return fallback suggestions if OpenAI is not configured
    return generateFallbackSuggestions(messages, topic, techStack, integrationContext)
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // Build context from conversation
  const conversationContext = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n")

  const topicContext = topic ? TOPIC_CONTEXT[topic] || "" : ""
  const frameworkInfo = techStack?.framework
    ? FRAMEWORK_EXAMPLES[techStack.framework.toLowerCase()]
    : null

  const systemPrompt = `You are an expert support agent for Daily Event Insurance, a B2B platform that helps fitness studios, adventure companies, and event venues offer day-of event insurance to their customers.

Your role is to suggest helpful responses for admin support staff to send to partners (businesses integrating our product).

Context about this conversation:
- Topic: ${topic || "General support"}
${topicContext}
- Tech Stack: ${techStack ? JSON.stringify(techStack) : "Not specified"}
- Integration Status: ${integrationContext ? JSON.stringify(integrationContext) : "Not specified"}
${frameworkInfo ? `- Framework-specific example available for ${techStack?.framework}` : ""}

Generate 3-4 helpful response suggestions. For each suggestion:
1. Provide a clear, professional response
2. Include code snippets when relevant (especially for technical questions)
3. Rate your confidence (0-1) based on how well the response addresses the question
4. Explain your reasoning briefly
5. Categorize as: greeting, technical, troubleshooting, billing, or general

Response format (JSON array):
[
  {
    "type": "response" | "code" | "action",
    "content": "The main text response",
    "codeSnippet": "Optional code example",
    "codeLanguage": "javascript|typescript|python|etc",
    "confidence": 0.85,
    "reasoning": "Why this response is relevant",
    "category": "technical|troubleshooting|billing|general|greeting"
  }
]`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the conversation so far:\n\n${conversationContext}\n\nGenerate helpful response suggestions for the admin to send.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response from OpenAI")
    }

    const parsed = JSON.parse(responseContent)
    const suggestions = parsed.suggestions || parsed

    // Validate and format suggestions
    return (Array.isArray(suggestions) ? suggestions : [suggestions]).map(
      (s: any, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        type: s.type || "response",
        content: s.content || "",
        codeSnippet: s.codeSnippet,
        codeLanguage: s.codeLanguage,
        confidence: Math.min(1, Math.max(0, s.confidence || 0.7)),
        reasoning: s.reasoning || "AI-generated suggestion",
        category: s.category || "general",
      })
    )
  } catch (error) {
    console.error("OpenAI error:", error)
    // Fall back to rule-based suggestions
    return generateFallbackSuggestions(messages, topic, techStack, integrationContext)
  }
}

/**
 * Generate fallback suggestions when OpenAI is not available
 */
function generateFallbackSuggestions(
  messages: z.infer<typeof suggestionsRequestSchema>["messages"],
  topic: string | null | undefined,
  techStack: z.infer<typeof suggestionsRequestSchema>["techStack"],
  integrationContext: z.infer<typeof suggestionsRequestSchema>["integrationContext"]
): Suggestion[] {
  const suggestions: Suggestion[] = []
  const lastMessage = messages[messages.length - 1]
  const content = lastMessage?.content?.toLowerCase() || ""

  // Check for common patterns and generate appropriate suggestions

  // CORS errors
  if (content.includes("cors") || content.includes("blocked") || content.includes("cross-origin")) {
    suggestions.push({
      id: `fallback-cors-${Date.now()}`,
      type: "response",
      content: `I see you're experiencing a CORS error. This typically happens when your domain isn't whitelisted yet.

To fix this:
1. Go to Settings > Allowed Domains in your partner dashboard
2. Add your domain (include the full URL like https://yourdomain.com)
3. For local development, add http://localhost:3000
4. Changes take effect within 5 minutes

Would you like me to add your domain for you? Just share the URL and I'll configure it.`,
      confidence: 0.9,
      reasoning: "User mentioned CORS or cross-origin issues",
      category: "troubleshooting",
    })
  }

  // Installation help
  if (content.includes("install") || content.includes("setup") || content.includes("getting started")) {
    const framework = techStack?.framework?.toLowerCase() || "react"
    const example = FRAMEWORK_EXAMPLES[framework] || FRAMEWORK_EXAMPLES.react

    suggestions.push({
      id: `fallback-install-${Date.now()}`,
      type: "code",
      content: `Here's how to install the widget for your ${framework || "React"} application:

First, install the package:`,
      codeSnippet: `${example.install}\n\n// Then use it in your component:\n${example.usage}`,
      codeLanguage: example.language,
      confidence: 0.85,
      reasoning: "User is asking about installation or setup",
      category: "technical",
    })
  }

  // API key questions
  if (content.includes("api key") || content.includes("authenticate") || content.includes("401")) {
    suggestions.push({
      id: `fallback-apikey-${Date.now()}`,
      type: "code",
      content: `For API authentication, make sure you're using the correct header format:`,
      codeSnippet: `// Correct format
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};

// Common mistakes:
// 'Authorization': 'YOUR_API_KEY'  // Missing 'Bearer'
// 'API-Key': 'YOUR_API_KEY'        // Wrong header name`,
      codeLanguage: "javascript",
      confidence: 0.85,
      reasoning: "User asking about API keys or authentication",
      category: "technical",
    })
  }

  // Webhook questions
  if (content.includes("webhook") || content.includes("notification") || content.includes("events")) {
    suggestions.push({
      id: `fallback-webhook-${Date.now()}`,
      type: "code",
      content: `To configure webhooks for receiving real-time updates:

1. Go to Settings > Webhooks in your dashboard
2. Add your endpoint URL (must be HTTPS)
3. Select which events to receive
4. Copy the signing secret for verification

Here's how to verify webhook signatures:`,
      codeSnippet: `import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from('sha256=' + expected)
  );
}`,
      codeLanguage: "typescript",
      confidence: 0.8,
      reasoning: "User asking about webhooks or event notifications",
      category: "technical",
    })
  }

  // Error handling
  if (content.includes("error") || content.includes("not working") || content.includes("broken")) {
    suggestions.push({
      id: `fallback-error-${Date.now()}`,
      type: "response",
      content: `I'm sorry to hear you're experiencing issues. Let me help troubleshoot:

Could you please provide:
1. The exact error message you're seeing
2. The browser/environment you're using
3. The steps to reproduce the issue

In the meantime, here are some common solutions:
- Clear your browser cache and cookies
- Check the browser console for JavaScript errors
- Verify your API keys are correct and active
- Ensure your domain is whitelisted in Settings

I'm here to help resolve this as quickly as possible!`,
      confidence: 0.75,
      reasoning: "User reporting an error or issue",
      category: "troubleshooting",
    })
  }

  // Billing/commission questions
  if (content.includes("commission") || content.includes("payout") || content.includes("billing") || content.includes("payment")) {
    suggestions.push({
      id: `fallback-billing-${Date.now()}`,
      type: "response",
      content: `Regarding billing and commissions:

Commission Structure:
- Starter: 15% of premium
- Growth: 18% (50+ policies/month)
- Pro: 20% (200+ policies/month)

Payout Schedule:
- Payouts on the 1st and 15th of each month
- Minimum threshold: $50
- Processing: 2-3 business days (ACH)

You can view your earnings and next payout in Partner Dashboard > My Earnings. Would you like more specific information about your account?`,
      confidence: 0.8,
      reasoning: "User asking about billing, commissions, or payouts",
      category: "billing",
    })
  }

  // General greeting response
  if (content.includes("hello") || content.includes("hi") || content.includes("help")) {
    suggestions.push({
      id: `fallback-greeting-${Date.now()}`,
      type: "response",
      content: `Hello! Thank you for reaching out. I'm here to help with:

- Widget installation and configuration
- API integration and authentication
- POS system setup
- Troubleshooting any issues
- Billing and commission questions

What can I assist you with today?`,
      confidence: 0.7,
      reasoning: "User greeting or general help request",
      category: "greeting",
    })
  }

  // If no specific pattern matched, add a generic helpful response
  if (suggestions.length === 0) {
    suggestions.push({
      id: `fallback-generic-${Date.now()}`,
      type: "response",
      content: `Thank you for your message. I want to make sure I understand your question correctly.

Could you provide a bit more detail about what you're trying to accomplish? For example:
- Are you setting up the integration for the first time?
- Is there a specific error you're encountering?
- Do you need help with a particular feature?

I'm here to help and will do my best to assist you!`,
      confidence: 0.6,
      reasoning: "Generic response for unclear questions",
      category: "general",
    })
  }

  return suggestions.slice(0, 4) // Return max 4 suggestions
}

/**
 * POST /api/admin/support/suggestions
 * Generate AI-powered response suggestions for a conversation
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const body = await request.json()

      // Validate request
      const validationResult = suggestionsRequestSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid request data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const { messages, topic, techStack, integrationContext } = validationResult.data

      // Generate suggestions
      const suggestions = await generateAISuggestions(
        messages,
        topic,
        techStack,
        integrationContext
      )

      return successResponse({
        suggestions,
        generatedAt: new Date().toISOString(),
        model: process.env.OPENAI_API_KEY ? "gpt-4-turbo-preview" : "rule-based-fallback",
      })
    } catch (error: any) {
      console.error("[Admin Support Suggestions] Error:", error)
      return serverError(error.message || "Failed to generate suggestions")
    }
  })
}
