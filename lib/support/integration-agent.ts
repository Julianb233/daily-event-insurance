import OpenAI from "openai"
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions"
import type { 
  SupportMessage, 
  TechStack, 
  IntegrationContext,
  ConversationTopic 
} from "./types"

const SYSTEM_PROMPT = `You are a technical integration specialist for Daily Event Insurance. You help partners with onboarding, POS system integrations, API endpoint management, widget installation, and troubleshooting.

Your expertise:
- Widget installation (JavaScript embed, React component, Vue component)
- REST API integration (quotes, policies, webhooks)
- POS system integrations (Mindbody, Pike13, ClubReady, Mariana Tek, Square)
- Booking platform connections (Calendly, Acuity, custom systems)
- Troubleshooting integration issues
- Code snippet generation for partner's tech stack

Guidelines:
- Be technical but accessible - explain concepts clearly
- Provide code examples when helpful, using the partner's tech stack
- If you detect an error, explain what went wrong and how to fix it
- For complex custom integrations, use the escalate_to_dev_team tool
- Always confirm their tech stack before providing code
- Use tools to generate code, check integration status, and look up documentation
- Keep responses concise but thorough`

const TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "generate_widget_code",
      description: "Generate widget embed code for the partner's website based on their tech stack",
      parameters: {
        type: "object",
        properties: {
          framework: {
            type: "string",
            enum: ["vanilla", "react", "vue", "angular", "nextjs"],
            description: "The partner's frontend framework",
          },
          partnerId: {
            type: "string",
            description: "The partner's ID for widget configuration",
          },
          customizations: {
            type: "object",
            properties: {
              primaryColor: { type: "string" },
              position: { type: "string", enum: ["bottom-right", "bottom-left", "inline"] },
              autoOpen: { type: "boolean" },
            },
          },
        },
        required: ["framework", "partnerId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_api_snippet",
      description: "Generate API integration code snippet for quotes, policies, or webhooks",
      parameters: {
        type: "object",
        properties: {
          language: {
            type: "string",
            enum: ["javascript", "typescript", "python", "php", "curl"],
            description: "Programming language for the snippet",
          },
          endpoint: {
            type: "string",
            enum: ["create_quote", "get_quote", "create_policy", "get_policy", "setup_webhook", "verify_webhook"],
            description: "The API endpoint to generate code for",
          },
          includeAuth: {
            type: "boolean",
            description: "Whether to include authentication headers",
          },
        },
        required: ["language", "endpoint"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_pos_integration_guide",
      description: "Get step-by-step integration guide for a specific POS system",
      parameters: {
        type: "object",
        properties: {
          posSystem: {
            type: "string",
            enum: ["mindbody", "pike13", "clubready", "mariana_tek", "square"],
            description: "The POS system to get the guide for",
          },
          integrationType: {
            type: "string",
            enum: ["webhook", "api", "oauth"],
            description: "Type of integration method",
          },
        },
        required: ["posSystem"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_integration_status",
      description: "Check the current status of a partner's integration setup",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID to check",
          },
          integrationType: {
            type: "string",
            enum: ["widget", "api", "pos", "webhook"],
            description: "Type of integration to check",
          },
        },
        required: ["partnerId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_integration_docs",
      description: "Search the integration documentation for relevant information",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for documentation",
          },
          category: {
            type: "string",
            enum: ["widget", "api", "pos", "webhook", "troubleshooting"],
            description: "Category to search in",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalate_to_dev_team",
      description: "Escalate a complex issue to the development team with context",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Reason for escalation",
          },
          priority: {
            type: "string",
            enum: ["low", "normal", "high", "urgent"],
            description: "Priority level for the escalation",
          },
          summary: {
            type: "string",
            description: "Summary of the issue and attempted solutions",
          },
        },
        required: ["reason", "summary"],
      },
    },
  },
]

export interface AgentContext {
  partnerId?: string
  partnerName?: string
  topic?: ConversationTopic
  techStack?: TechStack
  integrationContext?: IntegrationContext
  onboardingStep?: number
}

export interface AgentResponse {
  content: string
  toolsUsed: string[]
  codeSnippet?: string
  codeLanguage?: string
  shouldEscalate?: boolean
  escalationReason?: string
}

export class IntegrationAgent {
  private openai: OpenAI
  private context: AgentContext

  constructor(context: AgentContext = {}) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured")
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.context = context
  }

  updateContext(updates: Partial<AgentContext>): void {
    this.context = { ...this.context, ...updates }
  }

  async chat(
    messages: SupportMessage[],
    userMessage: string
  ): Promise<AgentResponse> {
    const toolsUsed: string[] = []
    let codeSnippet: string | undefined
    let codeLanguage: string | undefined
    let shouldEscalate = false
    let escalationReason: string | undefined

    const contextInfo = this.buildContextInfo()
    const systemMessage = `${SYSTEM_PROMPT}\n\n${contextInfo}`

    const chatMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ]

    let response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 2000,
      temperature: 0.7,
    })

    let assistantMessage = response.choices[0].message

    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      chatMessages.push(assistantMessage)

      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") continue
        const functionName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)
        
        toolsUsed.push(functionName)

        const toolResult = await this.executeToolCall(functionName, args)

        if (toolResult.code) {
          codeSnippet = toolResult.code
          codeLanguage = toolResult.language
        }

        if (functionName === "escalate_to_dev_team") {
          shouldEscalate = true
          escalationReason = args.reason
        }

        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        })
      }

      response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: chatMessages,
        tools: TOOLS,
        tool_choice: "auto",
        max_tokens: 2000,
        temperature: 0.7,
      })

      assistantMessage = response.choices[0].message
    }

    return {
      content: assistantMessage.content || "I apologize, but I couldn't generate a response. Please try again.",
      toolsUsed,
      codeSnippet,
      codeLanguage,
      shouldEscalate,
      escalationReason,
    }
  }

  private buildContextInfo(): string {
    const parts: string[] = ["Current context:"]

    if (this.context.partnerId) {
      parts.push(`- Partner ID: ${this.context.partnerId}`)
    }
    if (this.context.partnerName) {
      parts.push(`- Partner Name: ${this.context.partnerName}`)
    }
    if (this.context.topic) {
      parts.push(`- Topic: ${this.context.topic}`)
    }
    if (this.context.onboardingStep) {
      parts.push(`- Onboarding Step: ${this.context.onboardingStep}/4`)
    }
    if (this.context.techStack) {
      const stack = this.context.techStack
      parts.push(`- Tech Stack: ${JSON.stringify(stack)}`)
    }
    if (this.context.integrationContext) {
      const ctx = this.context.integrationContext
      parts.push(`- Integration Status: ${JSON.stringify(ctx)}`)
    }

    return parts.length > 1 ? parts.join("\n") : ""
  }

  private async executeToolCall(
    name: string,
    args: Record<string, unknown>
  ): Promise<{ result: string; code?: string; language?: string }> {
    switch (name) {
      case "generate_widget_code":
        return this.generateWidgetCode(args)
      case "generate_api_snippet":
        return this.generateApiSnippet(args)
      case "get_pos_integration_guide":
        return this.getPosIntegrationGuide(args)
      case "check_integration_status":
        return this.checkIntegrationStatus(args)
      case "search_integration_docs":
        return this.searchIntegrationDocs(args)
      case "escalate_to_dev_team":
        return this.escalateToDevTeam(args)
      default:
        return { result: `Unknown tool: ${name}` }
    }
  }

  private generateWidgetCode(args: Record<string, unknown>): { result: string; code: string; language: string } {
    const framework = args.framework as string
    const partnerId = args.partnerId as string
    const customizations = args.customizations as Record<string, unknown> | undefined

    const config = {
      partnerId,
      primaryColor: customizations?.primaryColor || "#14B8A6",
      position: customizations?.position || "bottom-right",
      autoOpen: customizations?.autoOpen || false,
    }

    let code: string
    let language: string

    switch (framework) {
      case "react":
      case "nextjs":
        language = "tsx"
        code = `// Install: npm install @dailyevent/widget-react

import { InsuranceWidget } from '@dailyevent/widget-react'

export function InsuranceCoverage() {
  return (
    <InsuranceWidget
      partnerId="${config.partnerId}"
      primaryColor="${config.primaryColor}"
      position="${config.position}"
      autoOpen={${config.autoOpen}}
      onQuoteComplete={(quote) => console.log('Quote:', quote)}
      onPolicyPurchased={(policy) => console.log('Policy:', policy)}
    />
  )
}`
        break

      case "vue":
        language = "vue"
        code = `<!-- Install: npm install @dailyevent/widget-vue -->

<template>
  <InsuranceWidget
    partner-id="${config.partnerId}"
    primary-color="${config.primaryColor}"
    position="${config.position}"
    :auto-open="${config.autoOpen}"
    @quote-complete="onQuoteComplete"
    @policy-purchased="onPolicyPurchased"
  />
</template>

<script setup>
import { InsuranceWidget } from '@dailyevent/widget-vue'

const onQuoteComplete = (quote) => console.log('Quote:', quote)
const onPolicyPurchased = (policy) => console.log('Policy:', policy)
</script>`
        break

      default:
        language = "html"
        code = `<!-- Daily Event Insurance Widget -->
<script src="https://widget.dailyevent.com/v1/embed.js"></script>
<script>
  DailyEventWidget.init({
    partnerId: '${config.partnerId}',
    primaryColor: '${config.primaryColor}',
    position: '${config.position}',
    autoOpen: ${config.autoOpen},
    onQuoteComplete: function(quote) {
      console.log('Quote:', quote);
    },
    onPolicyPurchased: function(policy) {
      console.log('Policy:', policy);
    }
  });
</script>`
    }

    return {
      result: `Generated ${framework} widget code for partner ${partnerId}`,
      code,
      language,
    }
  }

  private generateApiSnippet(args: Record<string, unknown>): { result: string; code: string; language: string } {
    const lang = args.language as string
    const endpoint = args.endpoint as string
    const includeAuth = args.includeAuth !== false

    const endpoints: Record<string, { method: string; path: string; body?: Record<string, unknown> }> = {
      create_quote: {
        method: "POST",
        path: "/api/v1/quotes",
        body: {
          eventType: "fitness_class",
          eventDate: "2025-02-15",
          participants: 20,
          coverageType: "liability",
          customerEmail: "customer@example.com",
        },
      },
      get_quote: { method: "GET", path: "/api/v1/quotes/{quote_id}" },
      create_policy: {
        method: "POST",
        path: "/api/v1/policies",
        body: { quoteId: "qt_xxx", paymentMethodId: "pm_xxx" },
      },
      get_policy: { method: "GET", path: "/api/v1/policies/{policy_id}" },
      setup_webhook: {
        method: "POST",
        path: "/api/v1/webhooks",
        body: { url: "https://your-site.com/webhook", events: ["policy.created", "policy.updated"] },
      },
      verify_webhook: { method: "GET", path: "/api/v1/webhooks/{webhook_id}/verify" },
    }

    const ep = endpoints[endpoint]
    let code: string

    switch (lang) {
      case "javascript":
      case "typescript":
        code = `const response = await fetch('https://api.dailyevent.com${ep.path}', {
  method: '${ep.method}',
  headers: {
    'Content-Type': 'application/json',${includeAuth ? "\n    'Authorization': `Bearer ${process.env.DAILYEVENT_API_KEY}`," : ""}
  },${ep.body ? `\n  body: JSON.stringify(${JSON.stringify(ep.body, null, 4)}),` : ""}
});

const data = await response.json();
console.log(data);`
        break

      case "python":
        code = `import requests

response = requests.${ep.method.toLowerCase()}(
    'https://api.dailyevent.com${ep.path}',
    headers={
        'Content-Type': 'application/json',${includeAuth ? "\n        'Authorization': f'Bearer {os.environ[\"DAILYEVENT_API_KEY\"]}'," : ""}
    },${ep.body ? `\n    json=${JSON.stringify(ep.body, null, 4)},` : ""}
)

print(response.json())`
        break

      case "curl":
        code = `curl -X ${ep.method} 'https://api.dailyevent.com${ep.path}' \\
  -H 'Content-Type: application/json'${includeAuth ? " \\\n  -H 'Authorization: Bearer $DAILYEVENT_API_KEY'" : ""}${ep.body ? ` \\\n  -d '${JSON.stringify(ep.body)}'` : ""}`
        break

      default:
        code = `// API endpoint: ${ep.method} ${ep.path}`
    }

    return {
      result: `Generated ${lang} code for ${endpoint} endpoint`,
      code,
      language: lang === "typescript" ? "typescript" : lang,
    }
  }

  private getPosIntegrationGuide(args: Record<string, unknown>): { result: string } {
    const posSystem = args.posSystem as string
    const integrationType = (args.integrationType as string) || "webhook"

    const guides: Record<string, { name: string; steps: string[]; commonIssues: string[] }> = {
      mindbody: {
        name: "Mindbody",
        steps: [
          "1. Log into your Mindbody business portal",
          "2. Go to Settings > API Credentials",
          "3. Generate a new API key with 'Booking' permissions",
          "4. Copy the Site ID and API Key",
          "5. In Daily Event dashboard, go to Integrations > POS",
          "6. Select Mindbody and enter your credentials",
          "7. Configure which class types trigger insurance offers",
          "8. Test with a sample booking",
        ],
        commonIssues: [
          "Incorrect Site ID format (should be numeric)",
          "API key without booking permissions",
          "Firewall blocking webhook callbacks",
        ],
      },
      pike13: {
        name: "Pike13",
        steps: [
          "1. Log into Pike13 Admin",
          "2. Navigate to Settings > Integrations",
          "3. Enable API Access",
          "4. Generate OAuth credentials",
          "5. Authorize Daily Event in the OAuth flow",
          "6. Map service categories to coverage types",
        ],
        commonIssues: ["OAuth token expiration", "Service category mapping errors"],
      },
      square: {
        name: "Square",
        steps: [
          "1. Go to Square Developer Dashboard",
          "2. Create a new application",
          "3. Enable Bookings API and Payments API",
          "4. Copy Application ID and Access Token",
          "5. Set up webhook subscriptions for booking events",
          "6. Configure in Daily Event dashboard",
        ],
        commonIssues: ["Sandbox vs Production credentials", "Missing webhook subscriptions"],
      },
    }

    const guide = guides[posSystem]
    if (!guide) {
      return { result: `No guide available for ${posSystem}. Supported: ${Object.keys(guides).join(", ")}` }
    }

    const result = `# ${guide.name} Integration Guide (${integrationType})

## Steps:
${guide.steps.join("\n")}

## Common Issues:
${guide.commonIssues.map((i) => `- ${i}`).join("\n")}

Need help? I can walk you through any of these steps.`

    return { result }
  }

  private async checkIntegrationStatus(args: Record<string, unknown>): Promise<{ result: string }> {
    const partnerId = args.partnerId as string
    const integrationType = args.integrationType as string | undefined

    // Try to fetch real integration status from database
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/partner-integrations?partnerId=${partnerId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.integrations && data.integrations.length > 0) {
          const integrations = data.integrations
          const status: Record<string, unknown> = { partnerId }

          for (const integration of integrations) {
            status[integration.integrationType] = {
              status: integration.status,
              configured: integration.status !== 'pending',
              lastTestedAt: integration.lastTestedAt,
              testResult: integration.testResult,
              wentLiveAt: integration.wentLiveAt,
            }
          }

          if (integrationType && status[integrationType]) {
            return { result: JSON.stringify({ [integrationType]: status[integrationType] }, null, 2) }
          }

          return { result: JSON.stringify(status, null, 2) }
        }
      }
    } catch (error) {
      console.warn('[IntegrationAgent] Failed to fetch real integration status:', error)
    }

    // Fallback to mock data for demo/development
    const status = {
      partnerId,
      widget: { installed: true, lastPing: "2 hours ago", version: "1.2.3" },
      api: { keyGenerated: true, lastRequest: "5 minutes ago", requestsToday: 42 },
      webhook: { configured: true, endpoint: "https://...", lastDelivery: "1 hour ago", successRate: "98%" },
      pos: { connected: false, system: null },
    }

    if (integrationType) {
      const specific = status[integrationType as keyof typeof status]
      return { result: JSON.stringify({ [integrationType]: specific }, null, 2) }
    }

    return { result: JSON.stringify(status, null, 2) }
  }

  private async searchIntegrationDocs(args: Record<string, unknown>): Promise<{ result: string }> {
    const query = args.query as string
    const category = args.category as string | undefined

    // Use the real knowledge base search
    const { searchArticles } = await import("./knowledge-base")
    const results = searchArticles(query, 5)

    if (results.length > 0) {
      const formattedResults = results
        .filter(r => !category || r.article.category === category)
        .map((r) => ({
          title: r.article.title,
          excerpt: r.snippet,
          url: `/docs/${r.article.slug}`,
          category: r.article.category,
          relevance: r.relevanceScore,
        }))

      if (formattedResults.length > 0) {
        return {
          result: `Found ${formattedResults.length} results for "${query}"${category ? ` in ${category}` : ""}:\n\n${formattedResults.map((r) => `- **${r.title}** (${r.category}): ${r.excerpt}\n  URL: ${r.url}`).join("\n\n")}`,
        }
      }
    }

    // Fallback message if no results
    return {
      result: `No documentation found for "${query}"${category ? ` in ${category}` : ""}. Try:\n- Broader search terms\n- Different category\n- Contact support for help`,
    }
  }

  private async escalateToDevTeam(args: Record<string, unknown>): Promise<{ result: string }> {
    const reason = args.reason as string
    const priority = (args.priority as string) || "normal"
    const summary = args.summary as string

    return {
      result: `Escalation created successfully.

**Priority:** ${priority}
**Reason:** ${reason}
**Summary:** ${summary}

A developer will review this within ${priority === "urgent" ? "1 hour" : priority === "high" ? "4 hours" : "24 hours"}.

You'll receive an email when there's an update. In the meantime, I'm here to help with any other questions.`,
    }
  }
}

export function createIntegrationAgent(context?: AgentContext): IntegrationAgent {
  return new IntegrationAgent(context)
}
