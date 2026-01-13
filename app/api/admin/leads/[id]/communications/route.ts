import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { leadCommunications, leads } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/leads/[id]/communications
 * Get all communications for a lead
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

      const communications = await db
        .select()
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(desc(leadCommunications.createdAt))

      return NextResponse.json({
        success: true,
        data: communications,
      })
    } catch (error) {
      console.error("[Lead Communications] GET Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch communications" },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/admin/leads/[id]/communications
 * Log a new communication
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

      // Verify lead exists
      const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
      if (!lead) {
        return NextResponse.json(
          { success: false, error: "Lead not found" },
          { status: 404 }
        )
      }

      const [communication] = await db
        .insert(leadCommunications)
        .values({
          leadId: id,
          channel: body.channel,
          direction: body.direction,
          callDuration: body.callDuration,
          callRecordingUrl: body.callRecordingUrl,
          callTranscript: body.callTranscript ? JSON.stringify(body.callTranscript) : null,
          callSummary: body.callSummary,
          smsContent: body.smsContent,
          smsStatus: body.smsStatus,
          disposition: body.disposition,
          nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null,
          agentId: body.agentId,
          agentScriptUsed: body.agentScriptUsed,
          agentConfidenceScore: body.agentConfidenceScore,
          sentimentScore: body.sentimentScore,
          outcome: body.outcome,
          livekitRoomId: body.livekitRoomId,
          livekitSessionId: body.livekitSessionId,
        })
        .returning()

      // Update lead's lastActivityAt
      await db
        .update(leads)
        .set({ lastActivityAt: new Date(), updatedAt: new Date() })
        .where(eq(leads.id, id))

      return NextResponse.json({
        success: true,
        data: communication,
      })
    } catch (error) {
      console.error("[Lead Communications] POST Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to log communication" },
        { status: 500 }
      )
    }
  })
}
