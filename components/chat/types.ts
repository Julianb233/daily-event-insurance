// Chat Widget Types

export type AgentType = 'support' | 'sales' | 'onboarding'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatConfig {
  agentType: AgentType
  agentName: string
  agentTitle: string
  welcomeMessage: string
  placeholderText: string
  primaryColor: string
  accentColor: string
  avatarUrl?: string
  suggestedQuestions?: string[]
  systemPrompt: string
}

export interface ChatWidgetProps {
  config: ChatConfig
  onSendMessage?: (message: string) => Promise<string>
  onClose?: () => void
  isOpen?: boolean
  position?: 'bottom-right' | 'bottom-left' | 'center'
  className?: string
}

export interface ChatBubbleProps {
  config: ChatConfig
  onClick: () => void
  unreadCount?: number
}

// Agent-specific configurations
export const AGENT_CONFIGS: Record<AgentType, ChatConfig> = {
  support: {
    agentType: 'support',
    agentName: 'Alex',
    agentTitle: 'Customer Support',
    welcomeMessage: "Hi there! 👋 I'm Alex from Daily Event Insurance support. How can I help you today?",
    placeholderText: 'Type your question here...',
    primaryColor: '#1E40AF',
    accentColor: '#3B82F6',
    suggestedQuestions: [
      "I didn't receive my certificate",
      "How do I file a claim?",
      "I need a refund",
      "What does my coverage include?"
    ],
    systemPrompt: `You are Alex, a friendly and helpful customer support agent for Daily Event Insurance.
Your role is to help customers with questions about their coverage, claims, refunds, and technical issues.
Be empathetic, professional, and solution-oriented. Never make promises about claim outcomes.
If you can't help with something, offer to escalate to a human agent.`
  },
  sales: {
    agentType: 'sales',
    agentName: 'Jordan',
    agentTitle: 'Partnership Advisor',
    welcomeMessage: "Hey! 👋 I'm Jordan. I help business owners like you add new revenue streams. Interested in learning how you could earn money offering insurance to your customers?",
    placeholderText: 'Ask me anything about partnering...',
    primaryColor: '#059669',
    accentColor: '#10B981',
    suggestedQuestions: [
      "How much can I earn?",
      "What's the catch?",
      "How does it work?",
      "Is there any cost to join?"
    ],
    systemPrompt: `You are Jordan, an enthusiastic but not pushy partnership advisor for Daily Event Insurance.
Your role is to help potential partners understand the opportunity: zero-cost partnership, 15-25% commission, easy setup.
Focus on value, address objections with empathy and facts, and guide prospects toward signing up.
Key message: "Zero risk, all upside - you could be earning by tomorrow."`
  },
  onboarding: {
    agentType: 'onboarding',
    agentName: 'Sam',
    agentTitle: 'Setup Specialist',
    welcomeMessage: "Welcome to the team! 🎉 I'm Sam, your setup specialist. I'll help you get your Daily Event Insurance partnership up and running in just a few minutes. Ready to get started?",
    placeholderText: 'Ask about setup, integration, or next steps...',
    primaryColor: '#7C3AED',
    accentColor: '#8B5CF6',
    suggestedQuestions: [
      "How do I set up my QR codes?",
      "How do I get paid?",
      "What should I tell my staff?",
      "How do I track my earnings?"
    ],
    systemPrompt: `You are Sam, a supportive and patient onboarding specialist for Daily Event Insurance.
Your role is to guide new partners through account setup, integration options (QR codes, website, POS), and launch.
Be encouraging, celebrate progress, and ensure partners feel confident and supported.
Goal: Get partners live and earning as quickly as possible.`
  }
}
