/**
 * API Route: Onboarding Agent Chat
 *
 * Main endpoint for interacting with the onboarding and integration agent.
 * Handles messages, maintains session state, and returns agent responses.
 */

import { NextRequest, NextResponse } from "next/server"
import { processOnboardingMessage, type AgentInput, type AgentResponse } from "@/lib/agents/onboarding/agent"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      message,
      sessionId,
      partnerId,
      userId,
      visitorId,
      metadata
    } = body as {
      message: string
      sessionId?: string
      partnerId?: string
      userId?: string
      visitorId?: string
      metadata?: Record<string, unknown>
    }

    // Validate message
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Build agent input
    const input: AgentInput = {
      message: message.trim(),
      sessionId,
      partnerId,
      userId,
      visitorId: visitorId || generateVisitorId(),
      metadata
    }

    // Process message with agent
    const response = await processOnboardingMessage(input)

    // Return response
    return NextResponse.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent API] Error:", message)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process message",
        details: process.env.NODE_ENV === "development" ? message : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for session status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      )
    }

    // In production, this would fetch session from database
    // For now, return a placeholder
    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        state: "welcome",
        progress: 0,
        isComplete: false
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent API] GET Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to get session" },
      { status: 500 }
    )
  }
}

/**
 * Generate a visitor ID for anonymous tracking
 */
function generateVisitorId(): string {
  return `visitor_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
