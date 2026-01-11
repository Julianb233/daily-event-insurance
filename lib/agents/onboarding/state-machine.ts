/**
 * Onboarding Agent State Machine
 *
 * Defines the states, transitions, and guards for the onboarding flow.
 * Implements a finite state machine pattern for predictable agent behavior.
 */

import type {
  OnboardingState,
  OnboardingCollectedData,
  IntegrationData,
  StateTransition
} from "./schema"

// ================= State Definitions =================

/**
 * State configuration with metadata
 */
export interface StateConfig {
  name: OnboardingState
  displayName: string
  description: string
  category: "signup" | "documents" | "integration" | "training" | "completion"
  progressPercent: number
  requiredFields?: (keyof OnboardingCollectedData)[]
  allowedTransitions: OnboardingState[]
  agentBehavior: AgentBehavior
}

/**
 * How the agent should behave in each state
 */
export interface AgentBehavior {
  primaryGoal: string
  suggestedPrompts: string[]
  allowedTools: string[]
  responseStyle: "conversational" | "instructional" | "celebratory" | "supportive"
  escalationTriggers?: string[]
}

/**
 * Complete state machine definition
 */
export const ONBOARDING_STATES: Record<OnboardingState, StateConfig> = {
  welcome: {
    name: "welcome",
    displayName: "Welcome",
    description: "Initial greeting and introduction to the onboarding process",
    category: "signup",
    progressPercent: 0,
    allowedTransitions: ["business_discovery", "account_creation"],
    agentBehavior: {
      primaryGoal: "Warmly welcome the user and explain the value proposition",
      suggestedPrompts: [
        "Tell me about your business",
        "What type of facility do you run?",
        "How did you hear about us?"
      ],
      allowedTools: ["lookup_partner_status"],
      responseStyle: "conversational"
    }
  },

  business_discovery: {
    name: "business_discovery",
    displayName: "Understanding Your Business",
    description: "Learning about the business to customize the experience",
    category: "signup",
    progressPercent: 10,
    allowedTransitions: ["business_info_collection", "welcome"],
    agentBehavior: {
      primaryGoal: "Understand the business type, size, and needs to recommend the best integration",
      suggestedPrompts: [
        "How many customers do you serve monthly?",
        "What software do you currently use?",
        "Do you have multiple locations?"
      ],
      allowedTools: ["detect_platform", "estimate_revenue"],
      responseStyle: "conversational"
    }
  },

  business_info_collection: {
    name: "business_info_collection",
    displayName: "Business Information",
    description: "Collecting essential business details",
    category: "signup",
    progressPercent: 20,
    requiredFields: ["businessName", "contactName", "contactEmail"],
    allowedTransitions: ["account_creation", "business_discovery"],
    agentBehavior: {
      primaryGoal: "Collect business name, contact details, and location information",
      suggestedPrompts: [
        "What's your business name?",
        "Who should be the primary contact?",
        "What's the best email to reach you?"
      ],
      allowedTools: ["validate_email", "lookup_business", "scrape_website"],
      responseStyle: "conversational"
    }
  },

  account_creation: {
    name: "account_creation",
    displayName: "Create Account",
    description: "Setting up partner account credentials",
    category: "signup",
    progressPercent: 30,
    requiredFields: ["contactEmail"],
    allowedTransitions: ["document_signing", "business_info_collection"],
    agentBehavior: {
      primaryGoal: "Help user create their partner account or link existing account",
      suggestedPrompts: [
        "Would you like to set up your account now?",
        "I can send you a magic link to your email",
        "Already have an account? I can help you log in"
      ],
      allowedTools: ["create_partner_account", "send_magic_link", "check_existing_account"],
      responseStyle: "instructional"
    }
  },

  document_signing: {
    name: "document_signing",
    displayName: "Sign Documents",
    description: "Reviewing and signing partnership agreement, W9, and direct deposit forms",
    category: "documents",
    progressPercent: 40,
    allowedTransitions: ["integration_selection", "account_creation", "human_handoff"],
    agentBehavior: {
      primaryGoal: "Guide through document review and signing process",
      suggestedPrompts: [
        "Ready to review the partnership agreement?",
        "I can answer any questions about the terms",
        "Once signed, we'll move to integration setup"
      ],
      allowedTools: ["send_documents", "check_document_status", "generate_document_preview"],
      responseStyle: "supportive",
      escalationTriggers: ["lawyer", "legal review", "negotiate terms"]
    }
  },

  integration_selection: {
    name: "integration_selection",
    displayName: "Choose Integration",
    description: "Helping partner choose the best integration method",
    category: "integration",
    progressPercent: 50,
    allowedTransitions: ["integration_setup", "document_signing"],
    agentBehavior: {
      primaryGoal: "Recommend and help select the best integration method based on their tech stack",
      suggestedPrompts: [
        "What software do you use to manage bookings?",
        "Do you have a website where customers book?",
        "Want me to explain the different integration options?"
      ],
      allowedTools: ["detect_platform", "recommend_integration", "compare_integrations"],
      responseStyle: "instructional"
    }
  },

  integration_setup: {
    name: "integration_setup",
    displayName: "Set Up Integration",
    description: "Guiding through the technical integration setup",
    category: "integration",
    progressPercent: 65,
    allowedTransitions: ["integration_verification", "integration_selection", "human_handoff"],
    agentBehavior: {
      primaryGoal: "Provide step-by-step guidance for setting up the chosen integration",
      suggestedPrompts: [
        "Let me generate your widget code",
        "Here's how to add this to your site",
        "Need help with a specific step?"
      ],
      allowedTools: [
        "generate_widget_code",
        "generate_qr_code",
        "generate_api_credentials",
        "create_webhook_endpoint",
        "get_platform_instructions"
      ],
      responseStyle: "instructional",
      escalationTriggers: ["not working", "error", "stuck", "can't figure out"]
    }
  },

  integration_verification: {
    name: "integration_verification",
    displayName: "Verify Integration",
    description: "Testing and verifying the integration is working correctly",
    category: "integration",
    progressPercent: 80,
    allowedTransitions: ["training_materials", "integration_setup", "human_handoff"],
    agentBehavior: {
      primaryGoal: "Test the integration and confirm it's working properly",
      suggestedPrompts: [
        "Let me test your integration now",
        "Try making a test purchase",
        "I'll verify everything is connected"
      ],
      allowedTools: [
        "test_widget_embed",
        "test_qr_code",
        "test_api_connection",
        "test_webhook",
        "send_test_notification"
      ],
      responseStyle: "supportive"
    }
  },

  training_materials: {
    name: "training_materials",
    displayName: "Staff Training",
    description: "Providing training resources and staff scripts",
    category: "training",
    progressPercent: 90,
    allowedTransitions: ["go_live_checklist", "integration_verification"],
    agentBehavior: {
      primaryGoal: "Share training materials and help prepare staff",
      suggestedPrompts: [
        "Here are your staff training materials",
        "Want me to explain the customer scripts?",
        "Ready to download your marketing materials?"
      ],
      allowedTools: [
        "generate_training_materials",
        "generate_staff_scripts",
        "download_marketing_kit",
        "schedule_training_call"
      ],
      responseStyle: "instructional"
    }
  },

  go_live_checklist: {
    name: "go_live_checklist",
    displayName: "Go Live",
    description: "Final checklist before launching",
    category: "completion",
    progressPercent: 95,
    allowedTransitions: ["complete", "training_materials", "human_handoff"],
    agentBehavior: {
      primaryGoal: "Run through final checklist and celebrate the launch",
      suggestedPrompts: [
        "Let's run through the final checklist",
        "Everything looks great! Ready to go live?",
        "Any last questions before we launch?"
      ],
      allowedTools: [
        "run_go_live_checklist",
        "activate_partner",
        "send_welcome_email",
        "schedule_followup"
      ],
      responseStyle: "celebratory"
    }
  },

  complete: {
    name: "complete",
    displayName: "Complete!",
    description: "Onboarding successfully completed",
    category: "completion",
    progressPercent: 100,
    allowedTransitions: [],
    agentBehavior: {
      primaryGoal: "Celebrate success and provide ongoing support information",
      suggestedPrompts: [
        "Congratulations! You're all set up!",
        "Here's how to access your partner dashboard",
        "Any questions? I'm always here to help"
      ],
      allowedTools: ["get_partner_dashboard_link", "schedule_check_in"],
      responseStyle: "celebratory"
    }
  },

  blocked: {
    name: "blocked",
    displayName: "Needs Attention",
    description: "Onboarding is blocked and needs resolution",
    category: "completion",
    progressPercent: -1,
    allowedTransitions: ["human_handoff"],
    agentBehavior: {
      primaryGoal: "Acknowledge the issue and arrange human support",
      suggestedPrompts: [
        "I understand there's an issue we need to resolve",
        "Let me connect you with our team",
        "A specialist will reach out shortly"
      ],
      allowedTools: ["escalate_to_human", "create_support_ticket"],
      responseStyle: "supportive"
    }
  },

  human_handoff: {
    name: "human_handoff",
    displayName: "Human Support",
    description: "Transferring to human support team",
    category: "completion",
    progressPercent: -1,
    allowedTransitions: ["welcome", "document_signing", "integration_setup"],
    agentBehavior: {
      primaryGoal: "Smoothly transfer to human support with full context",
      suggestedPrompts: [
        "I'm connecting you with a specialist",
        "They'll have all our conversation history",
        "You should hear from them within the hour"
      ],
      allowedTools: ["handoff_to_human", "send_context_to_agent"],
      responseStyle: "supportive"
    }
  }
}

// ================= State Machine Logic =================

/**
 * Check if a transition is valid
 */
export function canTransition(
  currentState: OnboardingState,
  targetState: OnboardingState
): boolean {
  const config = ONBOARDING_STATES[currentState]
  return config.allowedTransitions.includes(targetState)
}

/**
 * Get the next recommended state based on collected data
 */
export function getNextRecommendedState(
  currentState: OnboardingState,
  collectedData: OnboardingCollectedData,
  integrationData: IntegrationData
): OnboardingState | null {
  const config = ONBOARDING_STATES[currentState]

  // Check if current state requirements are met
  if (config.requiredFields) {
    const hasAllRequired = config.requiredFields.every(
      field => collectedData[field] !== undefined && collectedData[field] !== ""
    )
    if (!hasAllRequired) {
      return null // Stay in current state
    }
  }

  // State-specific logic
  switch (currentState) {
    case "welcome":
      return "business_discovery"

    case "business_discovery":
      if (collectedData.businessName && collectedData.businessType) {
        return "business_info_collection"
      }
      return null

    case "business_info_collection":
      if (collectedData.contactEmail && collectedData.contactName) {
        return "account_creation"
      }
      return null

    case "account_creation":
      return "document_signing"

    case "document_signing":
      return "integration_selection"

    case "integration_selection":
      if (integrationData.selectedMethod) {
        return "integration_setup"
      }
      return null

    case "integration_setup":
      if (integrationData.widgetCode || integrationData.qrCodeUrl || integrationData.apiKey) {
        return "integration_verification"
      }
      return null

    case "integration_verification":
      if (integrationData.isVerified) {
        return "training_materials"
      }
      return null

    case "training_materials":
      return "go_live_checklist"

    case "go_live_checklist":
      return "complete"

    default:
      return null
  }
}

/**
 * Calculate overall progress
 */
export function calculateProgress(
  currentState: OnboardingState,
  collectedData: OnboardingCollectedData,
  integrationData: IntegrationData
): number {
  const baseProgress = ONBOARDING_STATES[currentState].progressPercent

  if (baseProgress < 0) return 0 // Blocked/handoff states

  // Add partial progress based on collected data
  let partialProgress = 0
  const config = ONBOARDING_STATES[currentState]

  if (config.requiredFields) {
    const filledFields = config.requiredFields.filter(
      field => collectedData[field] !== undefined && collectedData[field] !== ""
    )
    const fieldProgress = (filledFields.length / config.requiredFields.length) * 10
    partialProgress = Math.min(fieldProgress, 9) // Cap at 9% to not overlap with next state
  }

  return Math.min(baseProgress + partialProgress, 100)
}

/**
 * Get state transition history helper
 */
export function createTransition(
  fromState: OnboardingState,
  toState: OnboardingState,
  event: string,
  metadata?: Record<string, unknown>
): StateTransition {
  return {
    fromState,
    toState,
    event,
    timestamp: new Date(),
    metadata
  }
}

/**
 * Get agent behavior for current state
 */
export function getAgentBehavior(state: OnboardingState): AgentBehavior {
  return ONBOARDING_STATES[state].agentBehavior
}

/**
 * Check if escalation is needed based on message content
 */
export function shouldEscalate(
  state: OnboardingState,
  messageContent: string
): boolean {
  const triggers = ONBOARDING_STATES[state].agentBehavior.escalationTriggers
  if (!triggers) return false

  const lowerContent = messageContent.toLowerCase()
  return triggers.some(trigger => lowerContent.includes(trigger.toLowerCase()))
}

/**
 * Get the category of a state
 */
export function getStateCategory(state: OnboardingState): string {
  return ONBOARDING_STATES[state].category
}

/**
 * Get all states in a category
 */
export function getStatesInCategory(
  category: "signup" | "documents" | "integration" | "training" | "completion"
): OnboardingState[] {
  return Object.values(ONBOARDING_STATES)
    .filter(config => config.category === category)
    .map(config => config.name)
}

/**
 * Check if current state allows a specific tool
 */
export function isToolAllowed(state: OnboardingState, toolName: string): boolean {
  const allowedTools = ONBOARDING_STATES[state].agentBehavior.allowedTools
  return allowedTools.includes(toolName)
}
