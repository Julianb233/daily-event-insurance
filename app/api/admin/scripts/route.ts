import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { agentScripts } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"

/**
 * GET /api/admin/scripts
 * List all agent scripts with optional filters
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const businessType = searchParams.get("businessType")
    const interestLevel = searchParams.get("interestLevel")
    const geographicRegion = searchParams.get("geographicRegion")
    const activeOnly = searchParams.get("activeOnly") === "true"

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const conditions = []

      if (businessType) {
        conditions.push(eq(agentScripts.businessType, businessType))
      }
      if (interestLevel) {
        conditions.push(eq(agentScripts.interestLevel, interestLevel))
      }
      if (geographicRegion) {
        conditions.push(eq(agentScripts.geographicRegion, geographicRegion))
      }
      if (activeOnly) {
        conditions.push(eq(agentScripts.isActive, true))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const scripts = await db
        .select()
        .from(agentScripts)
        .where(whereClause)
        .orderBy(desc(agentScripts.priority), desc(agentScripts.createdAt))

      return NextResponse.json({
        success: true,
        data: scripts,
      })
    } catch (error) {
      console.error("[Scripts] GET Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch scripts" },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/admin/scripts
 * Create a new agent script
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
        name,
        description,
        businessType,
        interestLevel,
        geographicRegion,
        systemPrompt,
        openingScript,
        keyPoints,
        objectionHandlers,
        closingScript,
        maxCallDuration,
        voiceId,
        priority,
      } = body

      if (!name || !systemPrompt || !openingScript) {
        return NextResponse.json(
          { success: false, error: "name, systemPrompt, and openingScript are required" },
          { status: 400 }
        )
      }

      const [script] = await db
        .insert(agentScripts)
        .values({
          name,
          description,
          businessType,
          interestLevel,
          geographicRegion,
          systemPrompt,
          openingScript,
          keyPoints: keyPoints ? JSON.stringify(keyPoints) : null,
          objectionHandlers: objectionHandlers ? JSON.stringify(objectionHandlers) : null,
          closingScript,
          maxCallDuration: maxCallDuration || 300,
          voiceId: voiceId || "alloy",
          priority: priority || 0,
          isActive: true,
        })
        .returning()

      return NextResponse.json({
        success: true,
        data: script,
      })
    } catch (error) {
      console.error("[Scripts] POST Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create script" },
        { status: 500 }
      )
    }
  })
}
