/**
 * API Route: Chatbot Chat
 * Handles chatbot conversations with RAG-enhanced responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRAGResponse, type ChatMessage } from '@/lib/rag/system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate RAG-enhanced response
    const response = await generateRAGResponse(message, conversationHistory)

    return NextResponse.json({
      success: true,
      response,
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

