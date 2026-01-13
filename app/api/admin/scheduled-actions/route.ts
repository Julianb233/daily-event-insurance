import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { scheduledActions, leads } from "@/lib/db/schema"
import { eq, desc, and, gte } from "drizzle-orm"

/**
 * GET /api/admin/scheduled-actions
 * List scheduled actions
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const leadId = searchParams.get("leadId")
    const upcoming = searchParams.get("upcoming") === "true"

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const conditions = []

      if (status) {
        conditions.push(eq(scheduledActions.status, status))
      }
      if (leadId) {
        conditions.push(eq(scheduledActions.leadId, leadId))
      }
      if (upcoming) {
        conditions.push(gte(scheduledActions.scheduledFor, new Date()))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const actions = await db
        .select({
          action: scheduledActions,
          lead: {
            id: leads.id,
            firstName: leads.firstName,
            lastName: leads.lastName,
            phone: leads.phone,
            businessName: leads.businessName,
          },
        })
        .from(scheduledActions)
        .leftJoin(leads, eq(scheduledActions.leadId, leads.id))
        .where(whereClause)
        .orderBy(desc(scheduledActions.scheduledFor))
        .limit(100)

      return NextResponse.json({
        success: true,
        data: actions.map((a) => ({
          ...a.action,
          lead: a.lead,
        })),
      })
    } catch (error) {
      console.error("[Scheduled Actions] GET Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch actions" },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/admin/scheduled-actions
 * Create a new scheduled action
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const body = await request.json()

      const {
        leadId,
        actionType,
        scheduledFor,
        reason,
        scriptId,
        customMessage,
        maxAttempts,
      } = body

      if (!leadId || !actionType || !scheduledFor) {
        return NextResponse.json(
          { success: false, error: "leadId, actionType, and scheduledFor are required" },
          { status: 400 }
        )
      }

      // Verify lead exists
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1)

      if (!lead) {
        return NextResponse.json(
          { success: false, error: "Lead not found" },
          { status: 404 }
        )
      }

      const [action] = await db
        .insert(scheduledActions)
        .values({
          leadId,
          actionType,
          scheduledFor: new Date(scheduledFor),
          reason,
          scriptId,
          customMessage,
          maxAttempts: maxAttempts || 3,
          status: "pending",
        })
        .returning()

      return NextResponse.json({
        success: true,
        data: action,
      })
    } catch (error) {
      console.error("[Scheduled Actions] POST Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create action" },
        { status: 500 }
      )
    }
  })
}
