/**
 * RAG (Retrieval Augmented Generation) System
 * Provides context-aware responses for chatbot using knowledge base
 */

import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

// Initialize OpenAI client
// Note: This relies on OPENAI_API_KEY environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy', // Prevent crash if missing, handle in call
  dangerouslyAllowBrowser: true // Only if used in client, but this is usually server-side
})

export interface KnowledgeBaseEntry {
  id: string
  content: string
  metadata?: {
    source?: string
    category?: string
    tags?: string[]
    type?: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

const KB_PATH = path.join(process.cwd(), 'lib/rag/knowledge-base.json')

/**
 * Search knowledge base for relevant context
 */
export async function searchKnowledgeBase(
  query: string,
  limit: number = 5
): Promise<KnowledgeBaseEntry[]> {
  try {
    const knowledgeBase = await loadKnowledgeBase()

    if (knowledgeBase.length === 0) {
      console.warn('Knowledge base is empty.')
      return []
    }

    // Simple keyword matching (TF-IDF style scoring could be better, or vector search)
    // For now, we count keyword overlaps
    const queryLower = query.toLowerCase()
    // Remove common stop words for better matching
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'to', 'for', 'with', 'about', 'can', 'i', 'you', 'my']
    const queryWords = queryLower.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopWords.includes(w))

    if (queryWords.length === 0) {
      return [] // No searchable terms
    }

    const results = knowledgeBase
      .map(entry => {
        const contentLower = entry.content.toLowerCase()
        let score = 0

        // Boost for title/id matches
        if (entry.id.toLowerCase().includes(queryLower)) score += 10

        // Count keyword occurrences
        for (const word of queryWords) {
          const regex = new RegExp(`\\b${word}\\b`, 'g')
          const matches = (contentLower.match(regex) || []).length
          score += matches
        }

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
    .map(entry => `Source: ${entry.metadata?.source || entry.id}\n${entry.content}`)
    .join('\n\n---\n\n')

  // Generate response using context
  const response = await generateResponseWithContext(
    userMessage,
    contextText,
    conversationHistory,
    systemPrompt
  )

  return response
}

/**
 * Generate response with context using OpenAI
 */
import { tools, executeTool } from './tools'

/**
 * Generate response with context using OpenAI
 */
async function generateResponseWithContext(
  userMessage: string,
  context: string,
  history: ChatMessage[],
  systemPrompt?: string
): Promise<string> {

  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is missing.')
    // Fallback to basic response if no API key
    return generateAgentResponse(userMessage, systemPrompt) ||
      `I currently lack the API key to generate a full intelligent response, but based on my internal documents, here is some relevant info:\n\n${context.substring(0, 300)}...`
  }

  try {
    const messages: any[] = [
      {
        role: 'system',
        content: `${systemPrompt || 'You are a helpful assistant.'}\n\nUse the following context to answer the user's question. If the answer is not in the context, say you don't know, but try to be helpful based on general knowledge if appropriate, while prioritizing the context.\n\nContext:\n${context}`
      },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: userMessage }
    ]

    // First call: Agent decides if it needs tools
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: tools,
      tool_choice: 'auto', 
      temperature: 0.7,
    })

    const responseMessage = completion.choices[0].message

    // If no tool calls, return content
    if (!responseMessage.tool_calls) {
      return responseMessage.content || "I apologize, I couldn't generate a response."
    }

    // Process tool calls
    messages.push(responseMessage) // Add the assistant's request to history

    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)
      
      const functionResponse = await executeTool(functionName, functionArgs)

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: functionName,
        content: functionResponse,
      })
    }

    // Second call: Agent generates final response with tool outputs
    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
    })

    return finalResponse.choices[0].message.content || "I verified the information but couldn't generate a final response."

  } catch (error) {
    console.error('Error generating AI response:', error)
    return generateAgentResponse(userMessage, systemPrompt) || "I'm having trouble connecting to my brain right now. Please try again later."
  }
}

/**
 * Generate agent-specific response based on system prompt (Fallback)
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
  }

  return null
}

/**
 * Load knowledge base from JSON file
 */
async function loadKnowledgeBase(): Promise<KnowledgeBaseEntry[]> {
  try {
    if (fs.existsSync(KB_PATH)) {
      const data = fs.readFileSync(KB_PATH, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error loading knowledge base:', error)
    return []
  }
}

/**
 * Add entry to knowledge base
 */
export async function addToKnowledgeBase(
  content: string,
  metadata?: KnowledgeBaseEntry['metadata']
): Promise<void> {
  // Placeholder
  console.log('Adding to knowledge base:', { content, metadata })
}
