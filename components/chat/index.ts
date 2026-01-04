// Chat Widget Components
// Export all chat-related components for easy importing

// Base components
export { ChatWidget } from './ChatWidget'
export { ChatBubble, ChatBubbleCompact } from './ChatBubble'

// Agent-specific widgets (pre-configured)
export { SupportChatWidget } from './SupportChatWidget'
export { SalesChatWidget } from './SalesChatWidget'
export { OnboardingChatWidget } from './OnboardingChatWidget'

// Types and configurations
export type {
  AgentType,
  Message,
  ChatConfig,
  ChatWidgetProps,
  ChatBubbleProps
} from './types'

export { AGENT_CONFIGS } from './types'
