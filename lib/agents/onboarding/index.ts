/**
 * Onboarding & Integration Agent
 *
 * Main entry point for the onboarding agent module.
 * Exports all public APIs for use throughout the application.
 */

// Core Agent
export {
  OnboardingAgent,
  createOnboardingAgent,
  processOnboardingMessage,
  type AgentResponse,
  type AgentInput
} from "./agent"

// State Machine
export {
  ONBOARDING_STATES,
  canTransition,
  getNextRecommendedState,
  calculateProgress,
  getAgentBehavior,
  shouldEscalate,
  getStateCategory,
  getStatesInCategory,
  isToolAllowed,
  createTransition,
  type StateConfig,
  type AgentBehavior
} from "./state-machine"

// Tools
export {
  onboardingAgentTools,
  executeOnboardingTool,
  type ToolResult
} from "./tools"

// Schema & Types
export {
  // Tables
  onboardingSessions,
  onboardingMessages,
  onboardingTasks,
  integrationVerifications,
  agentActionLogs,

  // Types
  type OnboardingSession,
  type NewOnboardingSession,
  type OnboardingMessage,
  type NewOnboardingMessage,
  type OnboardingTask,
  type NewOnboardingTask,
  type IntegrationVerification,
  type NewIntegrationVerification,
  type AgentActionLog,
  type NewAgentActionLog,
  type OnboardingState,
  type OnboardingCollectedData,
  type IntegrationData,
  type AgentContext,
  type MessageMetadata,
  type StateTransition
} from "./schema"

// Knowledge Base
export { ONBOARDING_KNOWLEDGE_BASE } from "./knowledge-base"
