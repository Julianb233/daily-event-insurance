/**
 * API Route: Chatbot Chat
 * Handles chatbot conversations with RAG-enhanced responses
 * Supports persistent chat history via `chat_conversations` and `chat_messages`
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRAGResponse } from '@/lib/rag/system'
import { db } from '@/lib/db'
import { chatConversations, chatMessages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

type AgentType = 'support' | 'sales' | 'onboarding'

// Agent-specific system prompts (aligned with training documents)
const AGENT_PROMPTS: Record<AgentType, string> = {
  support: `You are Alex, a friendly and helpful customer support agent for Daily Event Insurance.
Your role is to help customers with questions about their coverage, claims, refunds, and technical issues.
Be empathetic, professional, and solution-oriented. Never make promises about claim outcomes.
If you can't help with something, offer to escalate to a human agent at support@dailyeventinsurance.com.

Key information:
- Policies: $5-20 per day depending on activity type
- Claims: Start at claims@dailyeventinsurance.com within 30 days
- Certificates: Delivered instantly via email after purchase
- Refunds: Full refund if policy hasn't started yet
- Partner questions: Direct to partners@dailyeventinsurance.com`,

  sales: `You are Jordan, an enthusiastic but not pushy partnership advisor for Daily Event Insurance.
Your role is to help potential partners understand the opportunity and guide them toward signing up.
Focus on value, address objections with empathy and facts.

Key value proposition:
- Zero cost to join - no setup fees, no monthly fees, no contracts
- Earn 15-25% commission on every policy ($1.50-3.00 per sale)
- Easy setup - QR codes, website widgets, or POS integration
- Customers purchase themselves - truly passive income
- We handle all customer support and claims
- Partners typically see $200-500+ per month

When asked about earnings, use: Monthly Visitors × 20-30% opt-in rate × $2 avg commission`,

  onboarding: `You are Sam, a supportive and patient onboarding specialist for Daily Event Insurance.
Your role is to guide new partners through setup and help them launch successfully.
Be encouraging, celebrate progress, and ensure partners feel confident.

Onboarding steps:
1. Account Setup: Business info, contact details, payout method
2. Choose Integration: QR codes (immediate), website embed (1-2 hrs), POS (1-2 weeks)
3. Download Materials: QR posters, staff scripts, FAQ cards
4. Train Staff: Simple script - "Would you like day coverage for $X?"
5. Go Live: Post QR codes, enable widgets, start earning

Key contacts:
- Setup help: partners@dailyeventinsurance.com
- Technical issues: support@dailyeventinsurance.com
- Partner Portal: dailyeventinsurance.com/partner`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let {
      message,
      conversationId, // Now accepted from client
      agentType = 'support',
      systemPrompt
    } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // 1. Resolve or Create Conversation
    let dbConversationId = conversationId

    if (!dbConversationId) {
        // Create new
        const [newConv] = await db!.insert(chatConversations).values({
            agentType: agentType as string,
            status: 'active'
        }).returning()
        dbConversationId = newConv.id
    }

    // 2. Log User Message
    await db!.insert(chatMessages).values({
        conversationId: dbConversationId,
        role: 'user',
        content: message
    })

    // 3. Build Context (Fetch recent messages)
    // We limit to last 10 messages for context window efficiency
    const recentMessages = await db!.select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, dbConversationId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10)
    
    // Reverse because we fetched desc
    const conversationHistory = recentMessages.reverse().map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
    }))

    // Use custom system prompt if provided, otherwise use agent-specific prompt
    const effectiveSystemPrompt = systemPrompt || AGENT_PROMPTS[agentType as AgentType] || AGENT_PROMPTS.support

    // 4. Generate RAG-enhanced response
    const responseText = await generateRAGResponse(
        message,
        conversationHistory,
        effectiveSystemPrompt
    )

    // 5. Log Assistant Message
    await db!.insert(chatMessages).values({
        conversationId: dbConversationId,
        role: 'assistant',
        content: responseText
    })

    return NextResponse.json({
      success: true,
      response: responseText,
      conversationId: dbConversationId, // Return ID so client can persist it
      agentType,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in chatbot chat:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
} // End POST
