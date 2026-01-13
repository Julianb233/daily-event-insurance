import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { agentScripts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/scripts/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withAuth(async () => {
    await requireAdmin()
    const { id } = await params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const [script] = await db
        .select()
        .from(agentScripts)
        .where(eq(agentScripts.id, id))
        .limit(1)

      if (!script) {
        return NextResponse.json(
          { success: false, error: "Script not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: script,
      })
    } catch (error) {
      console.error("[Script] GET Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch script" },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/admin/scripts/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return withAuth(async () => {
    await requireAdmin()
    const { id } = await params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const body = await request.json()

      const [existing] = await db
        .select()
        .from(agentScripts)
        .where(eq(agentScripts.id, id))
        .limit(1)

      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Script not found" },
          { status: 404 }
        )
      }

      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      const allowedFields = [
        "name",
        "description",
        "businessType",
        "interestLevel",
        "geographicRegion",
        "systemPrompt",
        "openingScript",
        "closingScript",
        "maxCallDuration",
        "voiceId",
        "isActive",
        "priority",
      ]

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      // Handle JSON fields
      if (body.keyPoints !== undefined) {
        updateData.keyPoints = JSON.stringify(body.keyPoints)
      }
      if (body.objectionHandlers !== undefined) {
        updateData.objectionHandlers = JSON.stringify(body.objectionHandlers)
      }

      const [updated] = await db
        .update(agentScripts)
        .set(updateData)
        .where(eq(agentScripts.id, id))
        .returning()

      return NextResponse.json({
        success: true,
        data: updated,
      })
    } catch (error) {
      console.error("[Script] PATCH Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update script" },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE /api/admin/scripts/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAuth(async () => {
    await requireAdmin()
    const { id } = await params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const [deleted] = await db
        .delete(agentScripts)
        .where(eq(agentScripts.id, id))
        .returning()

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Script not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Script deleted successfully",
      })
    } catch (error) {
      console.error("[Script] DELETE Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to delete script" },
        { status: 500 }
      )
    }
  })
}
