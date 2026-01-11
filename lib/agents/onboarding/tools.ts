/**
 * Onboarding Agent Tools
 *
 * Tools available to the onboarding agent for taking actions,
 * collecting data, and interacting with external systems.
 */

import { type ChatCompletionTool } from "openai/resources/chat/completions"
import { db } from "@/lib/db"
import { partners, partnerLocations, partnerDocuments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { detectPlatformFromText, getIntegrationTemplate } from "@/lib/integrations/templates"
import type { OnboardingCollectedData, IntegrationData } from "./schema"

// ================= Tool Definitions =================

/**
 * All tools available to the onboarding agent
 */
export const onboardingAgentTools: ChatCompletionTool[] = [
  // ===== Business Discovery Tools =====
  {
    type: "function",
    function: {
      name: "detect_platform",
      description: "Detect what software/platform the business uses from their message or website URL. Call this when the user mentions their tech stack.",
      parameters: {
        type: "object",
        properties: {
          textOrUrl: {
            type: "string",
            description: "The user's message mentioning platforms, or their website URL"
          }
        },
        required: ["textOrUrl"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "estimate_revenue",
      description: "Calculate estimated monthly commission based on participant volume",
      parameters: {
        type: "object",
        properties: {
          monthlyParticipants: {
            type: "number",
            description: "Estimated number of monthly participants/customers"
          },
          optInRate: {
            type: "number",
            description: "Expected opt-in rate (0.15 to 0.35, default 0.25)"
          },
          avgPremium: {
            type: "number",
            description: "Average premium per policy (default $5)"
          }
        },
        required: ["monthlyParticipants"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "scrape_website",
      description: "Analyze a business website to extract information like business name, type, contact info, and detect integrations. Only call when user provides a URL.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The website URL to analyze"
          }
        },
        required: ["url"]
      }
    }
  },

  // ===== Account Management Tools =====
  {
    type: "function",
    function: {
      name: "check_existing_account",
      description: "Check if an account already exists for this email address",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address to check"
          }
        },
        required: ["email"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_partner_account",
      description: "Create a new partner account with the collected information. Only call after collecting required business info.",
      parameters: {
        type: "object",
        properties: {
          businessName: { type: "string" },
          businessType: { type: "string" },
          contactName: { type: "string" },
          contactEmail: { type: "string" },
          contactPhone: { type: "string" },
          websiteUrl: { type: "string" },
          estimatedMonthlyParticipants: { type: "number" }
        },
        required: ["businessName", "businessType", "contactName", "contactEmail"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "send_magic_link",
      description: "Send a passwordless login link to the user's email",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address to send the magic link to"
          }
        },
        required: ["email"]
      }
    }
  },

  // ===== Document Tools =====
  {
    type: "function",
    function: {
      name: "send_documents",
      description: "Send the partnership agreement, W9, and direct deposit forms to the partner",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          documentTypes: {
            type: "array",
            items: { type: "string" },
            description: "Types of documents to send: partner_agreement, w9, direct_deposit"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_document_status",
      description: "Check the signing status of partner documents",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          }
        },
        required: ["partnerId"]
      }
    }
  },

  // ===== Integration Tools =====
  {
    type: "function",
    function: {
      name: "recommend_integration",
      description: "Recommend the best integration method based on the business type and tech stack",
      parameters: {
        type: "object",
        properties: {
          businessType: {
            type: "string",
            description: "Type of business (gym, climbing, rental, etc.)"
          },
          platforms: {
            type: "array",
            items: { type: "string" },
            description: "Platforms/software the business uses"
          },
          hasWebsite: {
            type: "boolean",
            description: "Whether the business has a website"
          },
          technicalLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Technical comfort level of the user"
          }
        },
        required: ["businessType"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_widget_code",
      description: "Generate embeddable widget code for a partner's website",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          widgetType: {
            type: "string",
            enum: ["iframe", "popup", "inline", "floating"],
            description: "Type of widget to generate"
          },
          primaryColor: {
            type: "string",
            description: "Hex color code for branding"
          },
          position: {
            type: "string",
            enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
            description: "Widget position for floating type"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_qr_code",
      description: "Generate a QR code for physical or digital display",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          locationId: {
            type: "string",
            description: "Optional location ID for multi-location businesses"
          },
          size: {
            type: "string",
            enum: ["small", "medium", "large"],
            description: "QR code size"
          },
          includeFrame: {
            type: "boolean",
            description: "Include a branded frame around the QR code"
          },
          customText: {
            type: "string",
            description: "Custom text to display with QR code"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_api_credentials",
      description: "Generate API key and secret for programmatic integration",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          permissionLevel: {
            type: "string",
            enum: ["read", "write", "full"],
            description: "API permission level"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_webhook_endpoint",
      description: "Create a webhook endpoint for the partner to receive events",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          webhookUrl: {
            type: "string",
            description: "The URL to send webhook events to"
          },
          events: {
            type: "array",
            items: { type: "string" },
            description: "Events to subscribe to: policy.created, policy.updated, commission.earned"
          }
        },
        required: ["partnerId", "webhookUrl"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_platform_instructions",
      description: "Get step-by-step integration instructions for a specific platform",
      parameters: {
        type: "object",
        properties: {
          platformSlug: {
            type: "string",
            description: "Platform identifier: mindbody, zen-planner, shopify, woocommerce, square, stripe"
          },
          integrationType: {
            type: "string",
            enum: ["widget", "webhook", "api"],
            description: "Type of integration"
          }
        },
        required: ["platformSlug"]
      }
    }
  },

  // ===== Verification Tools =====
  {
    type: "function",
    function: {
      name: "test_widget_embed",
      description: "Test if the widget is properly embedded on the partner's website",
      parameters: {
        type: "object",
        properties: {
          websiteUrl: {
            type: "string",
            description: "The partner's website URL to test"
          },
          partnerId: {
            type: "string",
            description: "The partner's ID to verify correct widget"
          }
        },
        required: ["websiteUrl", "partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "test_qr_code",
      description: "Test if the QR code links to the correct insurance page",
      parameters: {
        type: "object",
        properties: {
          qrCodeUrl: {
            type: "string",
            description: "URL encoded in the QR code"
          },
          partnerId: {
            type: "string",
            description: "The partner's ID to verify"
          }
        },
        required: ["qrCodeUrl", "partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "test_webhook",
      description: "Send a test webhook event to verify the endpoint is working",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          eventType: {
            type: "string",
            description: "Type of test event to send"
          }
        },
        required: ["partnerId"]
      }
    }
  },

  // ===== Training & Materials Tools =====
  {
    type: "function",
    function: {
      name: "generate_training_materials",
      description: "Generate customized training materials for the partner",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          businessType: {
            type: "string",
            description: "Type of business for customization"
          },
          format: {
            type: "string",
            enum: ["pdf", "video_links", "interactive"],
            description: "Format of training materials"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_staff_scripts",
      description: "Generate customized scripts for staff to offer insurance",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          businessType: {
            type: "string",
            description: "Type of business for customization"
          },
          scenarios: {
            type: "array",
            items: { type: "string" },
            description: "Specific scenarios to create scripts for: checkin, checkout, booking, phone"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "download_marketing_kit",
      description: "Generate download links for marketing materials",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          materials: {
            type: "array",
            items: { type: "string" },
            description: "Materials to include: posters, flyers, social_media, email_templates"
          }
        },
        required: ["partnerId"]
      }
    }
  },

  // ===== Go-Live & Support Tools =====
  {
    type: "function",
    function: {
      name: "run_go_live_checklist",
      description: "Run through the final go-live checklist and return status of each item",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "activate_partner",
      description: "Activate the partner account and make them live",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          }
        },
        required: ["partnerId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "escalate_to_human",
      description: "Escalate the conversation to a human agent with full context",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "The onboarding session ID"
          },
          reason: {
            type: "string",
            description: "Reason for escalation"
          },
          urgency: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Urgency level"
          }
        },
        required: ["sessionId", "reason"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "schedule_followup",
      description: "Schedule a follow-up call or email with the partner",
      parameters: {
        type: "object",
        properties: {
          partnerId: {
            type: "string",
            description: "The partner's ID"
          },
          type: {
            type: "string",
            enum: ["call", "email", "video"],
            description: "Type of follow-up"
          },
          preferredTime: {
            type: "string",
            description: "Preferred date/time for follow-up"
          },
          topic: {
            type: "string",
            description: "Topic/purpose of the follow-up"
          }
        },
        required: ["partnerId", "type"]
      }
    }
  },

  // ===== Data Collection Tools =====
  {
    type: "function",
    function: {
      name: "update_collected_data",
      description: "Update the session with newly collected business information. Call this whenever you learn new information about the business.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "The onboarding session ID"
          },
          data: {
            type: "object",
            description: "The data to update",
            properties: {
              businessName: { type: "string" },
              businessType: { type: "string" },
              businessAddress: { type: "string" },
              websiteUrl: { type: "string" },
              contactName: { type: "string" },
              contactEmail: { type: "string" },
              contactPhone: { type: "string" },
              estimatedMonthlyParticipants: { type: "number" },
              preferredIntegrationType: { type: "string" },
              howDidYouHear: { type: "string" }
            }
          }
        },
        required: ["sessionId", "data"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "transition_state",
      description: "Move to a new state in the onboarding flow. Only call when ready to move forward.",
      parameters: {
        type: "object",
        properties: {
          sessionId: {
            type: "string",
            description: "The onboarding session ID"
          },
          targetState: {
            type: "string",
            enum: [
              "welcome",
              "business_discovery",
              "business_info_collection",
              "account_creation",
              "document_signing",
              "integration_selection",
              "integration_setup",
              "integration_verification",
              "training_materials",
              "go_live_checklist",
              "complete",
              "human_handoff"
            ],
            description: "The state to transition to"
          },
          reason: {
            type: "string",
            description: "Reason for the transition"
          }
        },
        required: ["sessionId", "targetState"]
      }
    }
  }
]

// ================= Tool Execution =================

/**
 * Execute an onboarding agent tool
 */
export async function executeOnboardingTool(
  name: string,
  args: Record<string, unknown>,
  context: {
    sessionId?: string
    partnerId?: string
    collectedData?: OnboardingCollectedData
    integrationData?: IntegrationData
  }
): Promise<ToolResult> {
  console.log(`[OnboardingAgent] Executing tool: ${name}`, args)

  try {
    switch (name) {
      // Business Discovery
      case "detect_platform":
        return await detectPlatform(args.textOrUrl as string)

      case "estimate_revenue":
        return estimateRevenue(
          args.monthlyParticipants as number,
          args.optInRate as number | undefined,
          args.avgPremium as number | undefined
        )

      case "scrape_website":
        return await scrapeWebsite(args.url as string)

      // Account Management
      case "check_existing_account":
        return await checkExistingAccount(args.email as string)

      case "create_partner_account":
        return await createPartnerAccount(args as CreatePartnerArgs)

      case "send_magic_link":
        return await sendMagicLink(args.email as string)

      // Documents
      case "send_documents":
        return await sendDocuments(args.partnerId as string, args.documentTypes as string[] | undefined)

      case "check_document_status":
        return await checkDocumentStatus(args.partnerId as string)

      // Integration
      case "recommend_integration":
        return recommendIntegration(args as RecommendIntegrationArgs)

      case "generate_widget_code":
        return await generateWidgetCode(args as GenerateWidgetArgs)

      case "generate_qr_code":
        return await generateQrCode(args as GenerateQrArgs)

      case "generate_api_credentials":
        return await generateApiCredentials(args.partnerId as string, args.permissionLevel as string)

      case "create_webhook_endpoint":
        return await createWebhookEndpoint(args as CreateWebhookArgs)

      case "get_platform_instructions":
        return getPlatformInstructions(args.platformSlug as string, args.integrationType as string)

      // Verification
      case "test_widget_embed":
        return await testWidgetEmbed(args.websiteUrl as string, args.partnerId as string)

      case "test_qr_code":
        return testQrCode(args.qrCodeUrl as string, args.partnerId as string)

      case "test_webhook":
        return await testWebhook(args.partnerId as string, args.eventType as string)

      // Training
      case "generate_training_materials":
        return await generateTrainingMaterials(args.partnerId as string, args.businessType as string)

      case "generate_staff_scripts":
        return generateStaffScripts(args.businessType as string, args.scenarios as string[])

      case "download_marketing_kit":
        return downloadMarketingKit(args.partnerId as string, args.materials as string[])

      // Go-Live
      case "run_go_live_checklist":
        return await runGoLiveChecklist(args.partnerId as string)

      case "activate_partner":
        return await activatePartner(args.partnerId as string)

      case "escalate_to_human":
        return await escalateToHuman(args.sessionId as string, args.reason as string, args.urgency as string)

      case "schedule_followup":
        return await scheduleFollowup(args as ScheduleFollowupArgs)

      // Data Management
      case "update_collected_data":
        return await updateCollectedData(args.sessionId as string, args.data as Partial<OnboardingCollectedData>)

      case "transition_state":
        return await transitionState(args.sessionId as string, args.targetState as string, args.reason as string)

      default:
        return {
          success: false,
          error: `Unknown tool: ${name}`
        }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error(`[OnboardingAgent] Tool error (${name}):`, message)
    return {
      success: false,
      error: message
    }
  }
}

// ================= Tool Result Type =================

export interface ToolResult {
  success: boolean
  data?: unknown
  error?: string
  nextAction?: string
}

// ================= Tool Implementations =================

// Type definitions for tool arguments
interface CreatePartnerArgs {
  businessName: string
  businessType: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  websiteUrl?: string
  estimatedMonthlyParticipants?: number
}

interface RecommendIntegrationArgs {
  businessType: string
  platforms?: string[]
  hasWebsite?: boolean
  technicalLevel?: "low" | "medium" | "high"
}

interface GenerateWidgetArgs {
  partnerId: string
  widgetType?: "iframe" | "popup" | "inline" | "floating"
  primaryColor?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

interface GenerateQrArgs {
  partnerId: string
  locationId?: string
  size?: "small" | "medium" | "large"
  includeFrame?: boolean
  customText?: string
}

interface CreateWebhookArgs {
  partnerId: string
  webhookUrl: string
  events?: string[]
}

interface ScheduleFollowupArgs {
  partnerId: string
  type: "call" | "email" | "video"
  preferredTime?: string
  topic?: string
}

// --- Platform Detection ---
async function detectPlatform(textOrUrl: string): Promise<ToolResult> {
  const platform = detectPlatformFromText(textOrUrl)

  if (platform) {
    const template = getIntegrationTemplate(platform)
    return {
      success: true,
      data: {
        detected: true,
        platform: platform,
        platformName: template?.name || platform,
        category: template?.category,
        supportedFeatures: template?.supportedFeatures || []
      }
    }
  }

  return {
    success: true,
    data: {
      detected: false,
      message: "No specific platform detected. Recommending generic widget or QR code integration."
    }
  }
}

// --- Revenue Estimation ---
function estimateRevenue(
  monthlyParticipants: number,
  optInRate = 0.25,
  avgPremium = 5
): ToolResult {
  const optIns = Math.round(monthlyParticipants * optInRate)
  const commissionRate = 0.50 // 50% commission
  const monthlyRevenue = optIns * avgPremium * commissionRate
  const yearlyRevenue = monthlyRevenue * 12

  return {
    success: true,
    data: {
      monthlyParticipants,
      estimatedOptIns: optIns,
      optInRate: `${(optInRate * 100).toFixed(0)}%`,
      averagePremium: `$${avgPremium}`,
      monthlyCommission: `$${monthlyRevenue.toFixed(2)}`,
      yearlyCommission: `$${yearlyRevenue.toFixed(2)}`,
      explanation: `With ${monthlyParticipants} monthly visitors and a ${(optInRate * 100).toFixed(0)}% opt-in rate, you could earn approximately $${monthlyRevenue.toFixed(2)}/month.`
    }
  }
}

// --- Website Scraping ---
async function scrapeWebsite(url: string): Promise<ToolResult> {
  // In production, this would call the actual scrape API
  // For now, return a structured placeholder
  return {
    success: true,
    data: {
      url,
      status: "scraping_initiated",
      message: "Website analysis has been started. Results will be available shortly.",
      detectedInfo: {
        // This would be populated by actual scraping
        platformHints: [],
        contactInfo: null,
        businessType: null
      }
    },
    nextAction: "Ask the user about their business while we analyze their website"
  }
}

// --- Account Management ---
async function checkExistingAccount(email: string): Promise<ToolResult> {
  if (!db) {
    return { success: true, data: { exists: false, mock: true } }
  }

  try {
    const existing = await db
      .select()
      .from(partners)
      .where(eq(partners.contactEmail, email))
      .limit(1)

    return {
      success: true,
      data: {
        exists: existing.length > 0,
        partnerId: existing[0]?.id,
        status: existing[0]?.status,
        businessName: existing[0]?.businessName
      }
    }
  } catch {
    return { success: true, data: { exists: false } }
  }
}

async function createPartnerAccount(args: CreatePartnerArgs): Promise<ToolResult> {
  if (!db) {
    return {
      success: true,
      data: {
        mock: true,
        partnerId: `mock_${Date.now()}`,
        message: "Partner account created (mock mode)"
      }
    }
  }

  try {
    const [newPartner] = await db
      .insert(partners)
      .values({
        businessName: args.businessName,
        businessType: args.businessType,
        contactName: args.contactName,
        contactEmail: args.contactEmail,
        contactPhone: args.contactPhone,
        websiteUrl: args.websiteUrl,
        estimatedMonthlyParticipants: args.estimatedMonthlyParticipants,
        status: "pending"
      })
      .returning()

    return {
      success: true,
      data: {
        partnerId: newPartner.id,
        businessName: newPartner.businessName,
        status: newPartner.status,
        message: "Partner account created successfully!"
      },
      nextAction: "Proceed to document signing"
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: message }
  }
}

async function sendMagicLink(email: string): Promise<ToolResult> {
  // In production, this would send an actual magic link
  return {
    success: true,
    data: {
      email,
      sent: true,
      message: `A login link has been sent to ${email}. It will expire in 15 minutes.`
    }
  }
}

// --- Documents ---
async function sendDocuments(partnerId: string, documentTypes?: string[]): Promise<ToolResult> {
  const types = documentTypes || ["partner_agreement", "w9", "direct_deposit"]

  return {
    success: true,
    data: {
      partnerId,
      documentsSent: types,
      message: `We've sent the following documents to your email: ${types.join(", ")}. Please review and sign them to continue.`,
      estimatedTime: "5-10 minutes"
    }
  }
}

async function checkDocumentStatus(partnerId: string): Promise<ToolResult> {
  if (!db) {
    return {
      success: true,
      data: {
        mock: true,
        documents: [
          { type: "partner_agreement", status: "pending" },
          { type: "w9", status: "pending" },
          { type: "direct_deposit", status: "pending" }
        ]
      }
    }
  }

  try {
    const docs = await db
      .select()
      .from(partnerDocuments)
      .where(eq(partnerDocuments.partnerId, partnerId))

    const status = {
      partner_agreement: docs.find(d => d.documentType === "partner_agreement")?.status || "not_sent",
      w9: docs.find(d => d.documentType === "w9")?.status || "not_sent",
      direct_deposit: docs.find(d => d.documentType === "direct_deposit")?.status || "not_sent"
    }

    const allSigned = Object.values(status).every(s => s === "signed")

    return {
      success: true,
      data: {
        partnerId,
        documents: status,
        allComplete: allSigned,
        message: allSigned
          ? "All documents have been signed!"
          : "Some documents are still pending signature."
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: message }
  }
}

// --- Integration ---
function recommendIntegration(args: RecommendIntegrationArgs): ToolResult {
  const recommendations = []

  // QR code is always an option
  recommendations.push({
    method: "qr_code",
    name: "QR Code",
    description: "Physical or digital QR codes that customers scan to purchase insurance",
    setupTime: "5 minutes",
    technicalLevel: "None",
    bestFor: "In-person businesses with physical locations"
  })

  // Widget if they have a website
  if (args.hasWebsite !== false) {
    recommendations.push({
      method: "widget",
      name: "Website Widget",
      description: "Embed a purchase widget directly on your website",
      setupTime: "15-30 minutes",
      technicalLevel: "Basic (copy-paste)",
      bestFor: "Businesses with online booking or checkout"
    })
  }

  // Platform-specific if detected
  if (args.platforms && args.platforms.length > 0) {
    for (const platform of args.platforms) {
      const template = getIntegrationTemplate(platform)
      if (template) {
        recommendations.push({
          method: "platform",
          platform: platform,
          name: `${template.name} Integration`,
          description: `Direct integration with your ${template.name} system`,
          setupTime: template.setupSteps.length > 3 ? "30-60 minutes" : "15-30 minutes",
          technicalLevel: template.technicalComplexity || "Medium",
          bestFor: `${template.name} users`
        })
      }
    }
  }

  // API for technical users
  if (args.technicalLevel === "high") {
    recommendations.push({
      method: "api",
      name: "API Integration",
      description: "Full API access for custom integrations",
      setupTime: "1-2 hours+",
      technicalLevel: "Advanced",
      bestFor: "Custom workflows and automation"
    })
  }

  return {
    success: true,
    data: {
      recommendations: recommendations.slice(0, 3), // Top 3
      primaryRecommendation: recommendations[0],
      message: `Based on your business type, I recommend starting with ${recommendations[0].name}.`
    }
  }
}

async function generateWidgetCode(args: GenerateWidgetArgs): Promise<ToolResult> {
  const widgetType = args.widgetType || "floating"
  const color = args.primaryColor || "#14B8A6"
  const position = args.position || "bottom-right"

  const widgetId = `dei_${args.partnerId.slice(0, 8)}`

  let code = ""
  if (widgetType === "iframe") {
    code = `<!-- Daily Event Insurance Widget -->
<iframe
  src="https://dailyeventinsurance.com/widget/${args.partnerId}"
  width="100%"
  height="400"
  frameborder="0"
  title="Daily Event Insurance"
></iframe>`
  } else if (widgetType === "floating") {
    code = `<!-- Daily Event Insurance Widget -->
<script>
  (function(d,e,i){
    var s=d.createElement('script');
    s.src='https://dailyeventinsurance.com/widget.js';
    s.async=true;
    s.onload=function(){
      DEI.init({
        partnerId:'${args.partnerId}',
        position:'${position}',
        color:'${color}'
      });
    };
    d.head.appendChild(s);
  })(document);
</script>`
  } else {
    code = `<!-- Daily Event Insurance Widget -->
<div id="${widgetId}"></div>
<script src="https://dailyeventinsurance.com/widget.js"></script>
<script>
  DEI.render('${widgetId}', {
    partnerId: '${args.partnerId}',
    type: '${widgetType}',
    color: '${color}'
  });
</script>`
  }

  return {
    success: true,
    data: {
      partnerId: args.partnerId,
      widgetType,
      code,
      instructions: [
        "Copy the code above",
        widgetType === "floating"
          ? "Paste it just before the closing </body> tag on your website"
          : "Paste it where you want the widget to appear",
        "Save and publish your changes",
        "The widget should appear immediately"
      ],
      testUrl: `https://dailyeventinsurance.com/widget/preview/${args.partnerId}`
    }
  }
}

async function generateQrCode(args: GenerateQrArgs): Promise<ToolResult> {
  const size = args.size || "medium"
  const sizePixels = { small: 150, medium: 300, large: 500 }[size]

  const purchaseUrl = args.locationId
    ? `https://dailyeventinsurance.com/buy/${args.partnerId}/${args.locationId}`
    : `https://dailyeventinsurance.com/buy/${args.partnerId}`

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${sizePixels}x${sizePixels}&data=${encodeURIComponent(purchaseUrl)}`

  return {
    success: true,
    data: {
      partnerId: args.partnerId,
      locationId: args.locationId,
      purchaseUrl,
      qrCodeUrl,
      size: sizePixels,
      instructions: [
        "Download or print the QR code",
        "Display it at your front desk, check-in area, or near equipment",
        "Customers scan with their phone camera to purchase insurance",
        "You can also share the direct link digitally"
      ],
      downloadLinks: {
        png: qrCodeUrl,
        svg: qrCodeUrl.replace("create-qr-code", "create-qr-code-svg")
      }
    }
  }
}

async function generateApiCredentials(partnerId: string, permissionLevel: string): Promise<ToolResult> {
  // In production, this would generate real credentials
  const apiKey = `dei_live_${partnerId.slice(0, 8)}_${Date.now().toString(36)}`
  const apiSecret = `sk_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`

  return {
    success: true,
    data: {
      partnerId,
      apiKey,
      apiSecret: `${apiSecret.slice(0, 8)}...${apiSecret.slice(-4)}`, // Masked
      permissionLevel,
      warning: "Store your API secret securely. It will only be shown once.",
      documentation: "https://dailyeventinsurance.com/docs/api",
      endpoints: {
        base: "https://api.dailyeventinsurance.com/v1",
        quotes: "/quotes",
        policies: "/policies",
        webhooks: "/webhooks"
      }
    }
  }
}

async function createWebhookEndpoint(args: CreateWebhookArgs): Promise<ToolResult> {
  const events = args.events || ["policy.created", "policy.updated", "commission.earned"]
  const webhookSecret = `whsec_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`

  return {
    success: true,
    data: {
      partnerId: args.partnerId,
      webhookUrl: args.webhookUrl,
      webhookSecret,
      subscribedEvents: events,
      instructions: [
        "Store the webhook secret securely",
        "Use it to verify incoming webhook signatures",
        "Events will be sent as POST requests with JSON body"
      ],
      samplePayload: {
        event: "policy.created",
        timestamp: new Date().toISOString(),
        data: {
          policyId: "pol_example",
          premium: 5.00,
          commission: 2.50
        }
      }
    }
  }
}

function getPlatformInstructions(platformSlug: string, integrationType?: string): ToolResult {
  const template = getIntegrationTemplate(platformSlug)

  if (!template) {
    return {
      success: true,
      data: {
        platform: platformSlug,
        found: false,
        message: "No specific integration template found. Recommending generic widget or QR code.",
        alternatives: ["widget", "qr_code"]
      }
    }
  }

  return {
    success: true,
    data: {
      platform: platformSlug,
      name: template.name,
      found: true,
      steps: template.setupSteps,
      supportedFeatures: template.supportedFeatures,
      troubleshooting: template.troubleshooting
    }
  }
}

// --- Verification ---
async function testWidgetEmbed(websiteUrl: string, partnerId: string): Promise<ToolResult> {
  // In production, this would actually test the embed
  return {
    success: true,
    data: {
      websiteUrl,
      partnerId,
      status: "testing",
      message: "Widget test initiated. This may take a few moments.",
      checkUrl: `https://dailyeventinsurance.com/verify/widget/${partnerId}`
    }
  }
}

function testQrCode(qrCodeUrl: string, partnerId: string): ToolResult {
  const expectedUrl = `https://dailyeventinsurance.com/buy/${partnerId}`
  const isValid = qrCodeUrl.includes(partnerId)

  return {
    success: true,
    data: {
      qrCodeUrl,
      partnerId,
      isValid,
      expectedUrl,
      message: isValid
        ? "QR code is correctly configured and links to your insurance page."
        : "QR code URL doesn't match expected format. Please regenerate."
    }
  }
}

async function testWebhook(partnerId: string, eventType?: string): Promise<ToolResult> {
  const event = eventType || "test.ping"

  return {
    success: true,
    data: {
      partnerId,
      eventType: event,
      sent: true,
      message: `Test ${event} event has been sent. Check your endpoint for the incoming webhook.`,
      expectedPayload: {
        event,
        timestamp: new Date().toISOString(),
        test: true,
        data: { message: "This is a test webhook" }
      }
    }
  }
}

// --- Training ---
async function generateTrainingMaterials(partnerId: string, businessType?: string): Promise<ToolResult> {
  const type = businessType || "general"

  return {
    success: true,
    data: {
      partnerId,
      businessType: type,
      materials: [
        {
          title: "Partner Quick Start Guide",
          type: "pdf",
          url: `https://dailyeventinsurance.com/resources/quickstart-${type}.pdf`
        },
        {
          title: "Staff Training Video",
          type: "video",
          url: "https://dailyeventinsurance.com/training/video/staff-intro",
          duration: "5 minutes"
        },
        {
          title: "FAQ Reference Card",
          type: "pdf",
          url: "https://dailyeventinsurance.com/resources/faq-card.pdf"
        }
      ],
      message: "Your training materials are ready! Share these with your staff before going live."
    }
  }
}

function generateStaffScripts(businessType?: string, scenarios?: string[]): ToolResult {
  const type = businessType || "general"
  const requestedScenarios = scenarios || ["checkin", "checkout"]

  const scripts: Record<string, string> = {
    checkin: `"Would you like same-day injury insurance for just $5? It covers any injuries during your visit today."`,
    checkout: `"Before you go - we offer affordable event insurance. Would you like coverage for your next visit?"`,
    booking: `"I see you're booking for [date]. Would you like to add $5 injury coverage for that day?"`,
    phone: `"We also offer same-day insurance. I can add it to your booking for just $5 - covers any injuries during your visit."`
  }

  const selectedScripts = requestedScenarios.map(s => ({
    scenario: s,
    script: scripts[s] || scripts.checkin
  }))

  return {
    success: true,
    data: {
      businessType: type,
      scripts: selectedScripts,
      tips: [
        "Keep it brief and natural",
        "Mention the low price ($5)",
        "Explain what's covered simply",
        "Don't pressure - just offer"
      ]
    }
  }
}

function downloadMarketingKit(partnerId: string, materials?: string[]): ToolResult {
  const requested = materials || ["posters", "flyers"]

  const kit = {
    posters: {
      name: "QR Code Posters",
      files: [
        { name: "8.5x11 Poster", url: `https://dailyeventinsurance.com/assets/${partnerId}/poster-letter.pdf` },
        { name: "11x17 Poster", url: `https://dailyeventinsurance.com/assets/${partnerId}/poster-tabloid.pdf` }
      ]
    },
    flyers: {
      name: "Customer Flyers",
      files: [
        { name: "Info Flyer", url: `https://dailyeventinsurance.com/assets/${partnerId}/flyer.pdf` }
      ]
    },
    social_media: {
      name: "Social Media Graphics",
      files: [
        { name: "Instagram Post", url: `https://dailyeventinsurance.com/assets/${partnerId}/social-ig.png` },
        { name: "Facebook Post", url: `https://dailyeventinsurance.com/assets/${partnerId}/social-fb.png` }
      ]
    },
    email_templates: {
      name: "Email Templates",
      files: [
        { name: "Customer Announcement", url: `https://dailyeventinsurance.com/assets/${partnerId}/email-announce.html` }
      ]
    }
  }

  const selectedMaterials = requested
    .filter(m => kit[m as keyof typeof kit])
    .map(m => kit[m as keyof typeof kit])

  return {
    success: true,
    data: {
      partnerId,
      materials: selectedMaterials,
      allKitUrl: `https://dailyeventinsurance.com/assets/${partnerId}/marketing-kit.zip`
    }
  }
}

// --- Go-Live ---
async function runGoLiveChecklist(partnerId: string): Promise<ToolResult> {
  // In production, this would check actual status
  const checklist = [
    { item: "Account created", status: "complete" },
    { item: "Documents signed", status: "complete" },
    { item: "Integration configured", status: "complete" },
    { item: "Integration verified", status: "complete" },
    { item: "Staff trained", status: "pending" },
    { item: "Marketing materials downloaded", status: "pending" }
  ]

  const allComplete = checklist.every(c => c.status === "complete")

  return {
    success: true,
    data: {
      partnerId,
      checklist,
      allComplete,
      message: allComplete
        ? "All items complete! You're ready to go live!"
        : "A few items still need attention before launch."
    }
  }
}

async function activatePartner(partnerId: string): Promise<ToolResult> {
  if (!db) {
    return {
      success: true,
      data: {
        mock: true,
        partnerId,
        status: "active",
        message: "Partner activated (mock mode)"
      }
    }
  }

  try {
    await db
      .update(partners)
      .set({
        status: "active",
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(partners.id, partnerId))

    return {
      success: true,
      data: {
        partnerId,
        status: "active",
        message: "Congratulations! Your partner account is now live!",
        dashboardUrl: `https://dailyeventinsurance.com/partner/dashboard`
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: message }
  }
}

async function escalateToHuman(sessionId: string, reason: string, urgency: string): Promise<ToolResult> {
  return {
    success: true,
    data: {
      sessionId,
      reason,
      urgency,
      ticketId: `ESC-${Date.now().toString(36).toUpperCase()}`,
      message: "I've connected you with our support team. They'll reach out within the hour.",
      contactInfo: {
        email: "partners@dailyeventinsurance.com",
        phone: "1-800-XXX-XXXX"
      }
    }
  }
}

async function scheduleFollowup(args: ScheduleFollowupArgs): Promise<ToolResult> {
  return {
    success: true,
    data: {
      partnerId: args.partnerId,
      type: args.type,
      scheduledFor: args.preferredTime || "Within 24 hours",
      topic: args.topic || "General follow-up",
      message: `A ${args.type} has been scheduled. We'll reach out ${args.preferredTime || "soon"}.`
    }
  }
}

// --- Data Management ---
async function updateCollectedData(
  sessionId: string,
  data: Partial<OnboardingCollectedData>
): Promise<ToolResult> {
  // This would update the database in production
  return {
    success: true,
    data: {
      sessionId,
      updatedFields: Object.keys(data),
      message: "Session data updated successfully"
    }
  }
}

async function transitionState(
  sessionId: string,
  targetState: string,
  reason: string
): Promise<ToolResult> {
  // This would update the database in production
  return {
    success: true,
    data: {
      sessionId,
      newState: targetState,
      reason,
      message: `Transitioned to ${targetState}`
    }
  }
}
