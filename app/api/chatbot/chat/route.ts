/**
 * API Route: Chatbot Chat
 * Handles chatbot conversations with RAG-enhanced responses
 * Supports multiple agent types: support, sales, onboarding
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRAGResponse, type ChatMessage } from '@/lib/rag/system'

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
    const {
      message,
      conversationHistory = [],
      agentType = 'support',
      systemPrompt
    } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Use custom system prompt if provided, otherwise use agent-specific prompt
    const effectiveSystemPrompt = systemPrompt || AGENT_PROMPTS[agentType as AgentType] || AGENT_PROMPTS.support

    // Generate RAG-enhanced response with agent context
    const response = await generateRAGResponse(
      message,
      conversationHistory,
      effectiveSystemPrompt
    )

    return NextResponse.json({
      success: true,
      response,
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
}

