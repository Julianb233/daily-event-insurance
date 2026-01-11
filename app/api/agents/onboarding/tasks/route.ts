/**
 * API Route: Onboarding Agent Tasks
 *
 * Endpoints for managing onboarding tasks/checklist items.
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { onboardingTasks } from "@/lib/agents/onboarding/schema"

/**
 * GET - Retrieve tasks for a session
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

    if (!db) {
      return NextResponse.json({
        success: true,
        tasks: getMockTasks(),
        mock: true
      })
    }

    const tasks = await db
      .select()
      .from(onboardingTasks)
      .where(eq(onboardingTasks.sessionId, sessionId))

    // Group by category
    const tasksByCategory = tasks.reduce((acc, task) => {
      const category = task.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        id: task.id,
        key: task.taskKey,
        title: task.taskTitle,
        description: task.taskDescription,
        status: task.status,
        completedAt: task.completedAt,
        lastError: task.lastError
      })
      return acc
    }, {} as Record<string, Array<{
      id: string
      key: string
      title: string
      description: string | null
      status: string
      completedAt: Date | null
      lastError: string | null
    }>>)

    // Calculate completion stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === "completed").length
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").length

    return NextResponse.json({
      success: true,
      tasks: tasksByCategory,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: totalTasks - completedTasks - inProgressTasks,
        percentComplete: Math.round((completedTasks / totalTasks) * 100)
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent Tasks API] GET Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to retrieve tasks" },
      { status: 500 }
    )
  }
}

/**
 * PATCH - Update task status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, taskKey, status, completedBy } = body

    if (!sessionId || !taskKey) {
      return NextResponse.json(
        { error: "sessionId and taskKey are required" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Task updated (mock)",
        mock: true
      })
    }

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date()
    }

    if (status === "completed") {
      updateData.completedAt = new Date()
      updateData.completedBy = completedBy || "agent"
    }

    await db
      .update(onboardingTasks)
      .set(updateData)
      .where(
        and(
          eq(onboardingTasks.sessionId, sessionId),
          eq(onboardingTasks.taskKey, taskKey)
        )
      )

    return NextResponse.json({
      success: true,
      message: "Task updated"
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[OnboardingAgent Tasks API] PATCH Error:", message)

    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    )
  }
}

/**
 * Get mock tasks for development
 */
function getMockTasks() {
  return {
    signup: [
      { key: "business_info", title: "Collect Business Information", status: "completed" },
      { key: "create_account", title: "Create Partner Account", status: "in_progress" }
    ],
    documents: [
      { key: "sign_agreement", title: "Sign Partnership Agreement", status: "pending" },
      { key: "sign_w9", title: "Complete W9 Form", status: "pending" },
      { key: "setup_payout", title: "Set Up Direct Deposit", status: "pending" }
    ],
    integration: [
      { key: "choose_integration", title: "Choose Integration Method", status: "pending" },
      { key: "setup_integration", title: "Set Up Integration", status: "pending" },
      { key: "verify_integration", title: "Verify Integration Works", status: "pending" }
    ],
    training: [
      { key: "staff_training", title: "Review Staff Training", status: "pending" }
    ],
    completion: [
      { key: "go_live", title: "Go Live!", status: "pending" }
    ]
  }
}
