import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildContextAwarePrompt } from '@/lib/voice/context-prompts'
import type { VoiceContextData } from '@/lib/voice/voice-context'
import { nanoid } from 'nanoid'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ConversationRequest {
  messages: ConversationMessage[]
  context: VoiceContextData
  conversationId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ConversationRequest = await request.json()
    const { messages, context, conversationId } = body

    // Build context-aware system prompt
    const systemPrompt = buildContextAwarePrompt(context)

    // Prepare messages for OpenAI
    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openAIMessages,
      max_tokens: 300, // Keep responses concise for voice
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({
      response,
      conversationId: conversationId || nanoid(),
      context: {
        screenType: context.screenType,
        journeyStage: context.journeyStage,
      },
    })
  } catch (error) {
    console.error('Voice conversation error:', error)

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}
