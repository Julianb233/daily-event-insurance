import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  formatForVoice,
  shouldEscalateToHuman,
  detectQuickReplyIntent,
  quickReplies,
  type Message,
} from '@/lib/voice/openai-conversation'
import { buildContextAwarePrompt } from '@/lib/voice/context-prompts'
import type { VoiceContextData } from '@/lib/voice/voice-context'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages,
      context,
      conversationId,
    }: {
      messages: Message[]
      context: VoiceContextData
      conversationId?: string
    } = body

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]

    // Check for escalation triggers
    if (lastMessage.role === 'user' && shouldEscalateToHuman(lastMessage.content)) {
      return NextResponse.json({
        response: "I understand you'd like to speak with someone directly. Let me connect you with our team. You can reach us at support@dailyeventinsurance.com or schedule a call on our website. Would you like me to help with anything else in the meantime?",
        shouldEscalate: true,
        conversationId: conversationId || generateConversationId(),
      })
    }

    // Check for quick reply intent
    if (lastMessage.role === 'user') {
      const quickReplyIntent = detectQuickReplyIntent(lastMessage.content)
      if (quickReplyIntent) {
        return NextResponse.json({
          response: quickReplies[quickReplyIntent],
          quickReply: true,
          intent: quickReplyIntent,
          conversationId: conversationId || generateConversationId(),
        })
      }
    }

    // Build conversation with context-aware system prompt
    const systemPrompt = buildContextAwarePrompt(context)
    const conversationMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationMessages,
      max_tokens: 150, // Keep responses short for voice
      temperature: 0.7,
    })

    const rawResponse = completion.choices[0]?.message?.content || ''
    const voiceResponse = formatForVoice(rawResponse)

    // Log conversation for analytics
    console.log('[Voice Conversation]', {
      conversationId: conversationId || 'new',
      userMessage: lastMessage.content,
      response: voiceResponse,
      screenType: context.screenType,
      journeyStage: context.journeyStage,
      screenName: context.screenName,
    })

    return NextResponse.json({
      response: voiceResponse,
      rawResponse,
      conversationId: conversationId || generateConversationId(),
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      },
    })
  } catch (error) {
    console.error('[Voice Conversation Error]', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'voice-conversation',
    features: {
      contextAware: true,
      screenTypes: ['home', 'sales', 'onboarding', 'partner-dashboard', 'help', 'integration'],
      journeyStages: ['discovery', 'consideration', 'decision', 'onboarding', 'active-partner', 'support'],
    },
    models: {
      conversation: 'gpt-4o-mini',
      tts: 'elevenlabs',
    },
  })
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
