/**
 * RAG (Retrieval Augmented Generation) System
 * Provides context-aware responses for chatbot using knowledge base
 */

export interface KnowledgeBaseEntry {
  id: string
  content: string
  metadata?: {
    source?: string
    category?: string
    tags?: string[]
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

/**
 * Search knowledge base for relevant context
 */
export async function searchKnowledgeBase(
  query: string,
  limit: number = 5
): Promise<KnowledgeBaseEntry[]> {
  // In production, this would use a vector database (Pinecone, Weaviate, etc.)
  // For now, using simple text matching
  
  try {
    // Fetch from knowledge base (stored in database or file system)
    const knowledgeBase = await loadKnowledgeBase()
    
    // Simple keyword matching (replace with semantic search in production)
    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/)
    
    const results = knowledgeBase
      .map(entry => {
        const contentLower = entry.content.toLowerCase()
        const score = queryWords.reduce((acc, word) => {
          return acc + (contentLower.includes(word) ? 1 : 0)
        }, 0)
        return { entry, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ entry }) => entry)
    
    return results
  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return []
  }
}

/**
 * Generate RAG-enhanced response
 */
export async function generateRAGResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  systemPrompt?: string
): Promise<string> {
  // Search knowledge base for relevant context
  const relevantContext = await searchKnowledgeBase(userMessage, 3)

  // Build context string
  const contextText = relevantContext
    .map(entry => entry.content)
    .join('\n\n')

  // Generate response using context
  // In production, this would use an LLM (OpenAI, Anthropic, etc.)
  const response = await generateResponseWithContext(
    userMessage,
    contextText,
    conversationHistory,
    systemPrompt
  )

  return response
}

/**
 * Generate response with context (placeholder - integrate with LLM in production)
 */
async function generateResponseWithContext(
  userMessage: string,
  context: string,
  history: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  // Placeholder implementation
  // In production, call OpenAI/Anthropic API with:
  // - System prompt with context
  // - Conversation history
  // - User message

  // Use agent-aware response generation
  const response = generateAgentResponse(userMessage, systemPrompt)

  if (context && response === null) {
    return `Based on our information: ${context.substring(0, 200)}... I can help you with that. ${generateBasicResponse(userMessage)}`
  }

  return response || generateBasicResponse(userMessage)
}

/**
 * Generate agent-specific response based on system prompt
 */
function generateAgentResponse(message: string, systemPrompt?: string): string | null {
  if (!systemPrompt) return null

  const lowerMessage = message.toLowerCase()
  const isSupport = systemPrompt.includes('Alex') && systemPrompt.includes('support')
  const isSales = systemPrompt.includes('Jordan') && systemPrompt.includes('partnership')
  const isOnboarding = systemPrompt.includes('Sam') && systemPrompt.includes('onboarding')

  // Support agent responses
  if (isSupport) {
    if (lowerMessage.includes('certificate') || lowerMessage.includes('didn\'t receive')) {
      return 'I\'m sorry you haven\'t received your certificate! Certificates are sent instantly via email after purchase. Please check your spam folder first. If you still can\'t find it, I can look up your policy and resend it. What email did you use when purchasing?'
    }
    if (lowerMessage.includes('claim') || lowerMessage.includes('file')) {
      return 'I can help you understand the claims process. To file a claim, you\'ll need to email claims@dailyeventinsurance.com within 30 days of the incident with your policy number and a description of what happened. Our claims team will guide you through the next steps. What happened at your event?'
    }
    if (lowerMessage.includes('refund')) {
      return 'I can help with your refund request. If your coverage period hasn\'t started yet, you\'re eligible for a full refund. If coverage has begun, refunds are prorated. Can you share your policy number so I can check the status?'
    }
    if (lowerMessage.includes('coverage') || lowerMessage.includes('include') || lowerMessage.includes('covered')) {
      return 'Our daily coverage typically includes accident medical expense coverage, general liability, and personal liability protection. The specific coverage depends on your activity type and policy. Would you like me to explain the coverage for your specific activity?'
    }
  }

  // Sales agent responses
  if (isSales) {
    if (lowerMessage.includes('how much') || lowerMessage.includes('earn') || lowerMessage.includes('money')) {
      return 'Great question! You\'ll earn 15-25% commission on every policy sold - that\'s typically $1.50-3.00 per sale. If you have 500 drop-ins per month and 25% opt for coverage, that\'s about $250/month in passive income. Want me to calculate based on your specific visitor numbers?'
    }
    if (lowerMessage.includes('catch') || lowerMessage.includes('cost') || lowerMessage.includes('risk')) {
      return 'There\'s no catch! We make money when customers buy coverage, and we share that with you because you\'re making the connection. There are zero upfront costs, no monthly fees, and no contracts. If your customers don\'t buy, neither of us makes money - but you haven\'t lost anything. It\'s aligned incentives.'
    }
    if (lowerMessage.includes('how does it work') || lowerMessage.includes('work')) {
      return 'It\'s simple: You put up a QR code at your front desk. Customers scan it, purchase coverage in 2 minutes on their phone, and get their certificate instantly. You don\'t handle any money or paperwork - we do everything. You just earn commission on every sale. Want me to show you the customer experience?'
    }
    if (lowerMessage.includes('join') || lowerMessage.includes('sign up') || lowerMessage.includes('get started')) {
      return 'Awesome! Getting started takes about 5 minutes. You\'ll enter your business info, set up your payout method, and then you can download QR codes immediately. You could literally be earning by tomorrow. Ready to sign up? I can walk you through it.'
    }
  }

  // Onboarding agent responses
  if (isOnboarding) {
    if (lowerMessage.includes('qr') || lowerMessage.includes('code')) {
      return 'Great question! To set up your QR codes: Go to your Partner Portal at dailyeventinsurance.com/partner, click "Marketing Materials", and you\'ll see downloadable QR code posters. Print them and put them at your front desk, near waivers, or in your check-in area. Customers scan and purchase right on their phones!'
    }
    if (lowerMessage.includes('paid') || lowerMessage.includes('payment') || lowerMessage.includes('payout')) {
      return 'You\'ll get paid monthly by the 15th for the previous month\'s sales. Set up your payout method in your Partner Portal under "Account Settings" > "Payout Info". You can choose direct deposit or PayPal. Once it\'s set up, payments are automatic!'
    }
    if (lowerMessage.includes('staff') || lowerMessage.includes('train') || lowerMessage.includes('tell')) {
      return 'Keep it simple for your staff! Just train them to mention: "Would you like day coverage for $8?" when customers check in. We have a quick reference card you can print. The QR code does the rest - customers purchase themselves. Your team doesn\'t need to handle money or paperwork.'
    }
    if (lowerMessage.includes('track') || lowerMessage.includes('earning') || lowerMessage.includes('dashboard')) {
      return 'Your Partner Dashboard shows everything in real-time: total sales, commission earned, conversion rates, and pending payouts. Log in at dailyeventinsurance.com/partner to see your stats. You can also download reports for your records!'
    }
  }

  return null
}

/**
 * Generate basic response (fallback)
 */
function generateBasicResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage')) {
    return 'We offer same-day event insurance coverage starting at $4.99. Would you like to learn more about our insurance options?'
  }
  
  if (lowerMessage.includes('partner') || lowerMessage.includes('partnership')) {
    return 'Our partner program allows businesses to offer insurance to their customers and earn commission. Would you like to become a partner?'
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return 'Our insurance coverage starts at $4.99 per participant. Pricing varies based on coverage type and event details. Would you like a custom quote?'
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'You can reach us at partnerships@hiqor.com or schedule a call through our website. How can I help you today?'
  }
  
  return 'I\'m here to help with questions about Daily Event Insurance, our partner program, and insurance coverage. What would you like to know?'
}

/**
 * Load knowledge base from storage
 */
async function loadKnowledgeBase(): Promise<KnowledgeBaseEntry[]> {
  // In production, load from database or vector store
  // For now, return empty array - will be populated by populate-knowledge-base script
  return []
}

/**
 * Add entry to knowledge base
 */
export async function addToKnowledgeBase(
  content: string,
  metadata?: KnowledgeBaseEntry['metadata']
): Promise<void> {
  // In production, add to vector database
  // For now, this is a placeholder
  console.log('Adding to knowledge base:', { content, metadata })
}

