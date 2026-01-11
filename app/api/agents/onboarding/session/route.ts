/**
 * API Route: Onboarding Agent Session Management
 *
 * Endpoints for managing onboarding sessions - create, retrieve, update, complete.
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import {
  onboardingSessions,
  onboardingMessages,
  onboardingTasks
} from "@/lib/agents/onboarding/schema"

/**
 * GET - Retrieve session details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("id")
    const partnerId = searchParams.get("partnerId")

    if (!sessionId && !partnerId) {
      return NextResponse.json(
        { error: "Either id or partnerId is required" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        session: createMockSession(sessionId || "mock"),
        mock: true
      })
    }

    let session

    if (sessionId) {
      const result = await db
        .select()
        .from(onboardingSessions)
        .where(eq(onboardingSessions.id, sessionId))
        .limit(1)
      session = result[0]
    } else if (partnerId) {
      const result = await db
        .select()
        .from(onboardingSessions)
        .where(eq(onboardingSessions.partnerId, partnerId))
        .limit(1)
      session = result[0]
    }

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Get tasks for this session
    const tasks = await db
      .select()
      .from(onboardingTasks)
      .where(eq(onboardingTasks.sessionId, session.id))

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        partnerId: session.partnerId,
        currentState: session.currentState,
        currentSubState: session.currentSubState,
        progressPercent: session.progressPercent,
        collectedData: session.collectedData,
        integrationData: session.integrationData,
        isComplete: session.isComplete,
        needsHumanReview: session.needsHumanReview,
        isBlocked: session.isBlocked,
        blockedReason: session.blockedReason,
        totalMessages: session.totalMessages,
        lastInteractionAt: session.lastInteractionAt,
        createdAt: session.createdAt
      },
      tasks: tasks.map(t => ({
        key: t.taskKey,
        title: t.taskTitle,
        category: t.category,
        status: t.status,
        completedAt: t.completedAt
      }))
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent Session API] GET Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to retrieve session" },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { partnerId, userId, visitorId, initialData } = body

    if (!db) {
      const mockSession = createMockSession(`mock_${Date.now()}`)
      return NextResponse.json({
        success: true,
        session: mockSession,
        mock: true
      })
    }

    // Create session
    const [newSession] = await db
      .insert(onboardingSessions)
      .values({
        partnerId,
        userId,
        visitorId: visitorId || `visitor_${Date.now().toString(36)}`,
        currentState: "welcome",
        collectedData: initialData || {},
        integrationData: {},
        agentContext: {}
      })
      .returning()

    // Create initial tasks
    const taskDefinitions = [
      { key: "business_info", title: "Collect Business Information", category: "signup", order: 1 },
      { key: "create_account", title: "Create Partner Account", category: "signup", order: 2 },
      { key: "sign_agreement", title: "Sign Partnership Agreement", category: "documents", order: 3 },
      { key: "sign_w9", title: "Complete W9 Form", category: "documents", order: 4 },
      { key: "setup_payout", title: "Set Up Direct Deposit", category: "documents", order: 5 },
      { key: "choose_integration", title: "Choose Integration Method", category: "integration", order: 6 },
      { key: "setup_integration", title: "Set Up Integration", category: "integration", order: 7 },
      { key: "verify_integration", title: "Verify Integration Works", category: "integration", order: 8 },
      { key: "staff_training", title: "Review Staff Training", category: "training", order: 9 },
      { key: "go_live", title: "Go Live!", category: "completion", order: 10 }
    ]

    for (const task of taskDefinitions) {
      await db.insert(onboardingTasks).values({
        sessionId: newSession.id,
        taskKey: task.key,
        taskTitle: task.title,
        category: task.category,
        sortOrder: task.order,
        status: "pending"
      })
    }

    return NextResponse.json({
      success: true,
      session: {
        id: newSession.id,
        partnerId: newSession.partnerId,
        currentState: newSession.currentState,
        progressPercent: newSession.progressPercent,
        createdAt: newSession.createdAt
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent Session API] POST Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Update session
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, updates } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Session updated (mock)",
        mock: true
      })
    }

    // Build update object
    const allowedFields = [
      "currentState",
      "currentSubState",
      "progressPercent",
      "collectedData",
      "integrationData",
      "agentContext",
      "isBlocked",
      "blockedReason",
      "needsHumanReview"
    ]

    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    }

    await db
      .update(onboardingSessions)
      .set(updateData)
      .where(eq(onboardingSessions.id, sessionId))

    return NextResponse.json({
      success: true,
      message: "Session updated"
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent Session API] PATCH Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 }
    )
  }
}

/**
 * Create a mock session for development
 */
function createMockSession(id: string) {
  return {
    id,
    partnerId: null,
    currentState: "welcome",
    currentSubState: null,
    progressPercent: 0,
    collectedData: {},
    integrationData: {},
    isComplete: false,
    needsHumanReview: false,
    isBlocked: false,
    blockedReason: null,
    totalMessages: 0,
    lastInteractionAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
}
