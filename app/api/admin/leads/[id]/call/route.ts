import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/leads/[id]/call
 * Initiate an outbound call via LiveKit
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
      const { scriptId } = body

      // Verify lead exists and get phone number
      const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
      if (!lead) {
        return NextResponse.json(
          { success: false, error: "Lead not found" },
          { status: 404 }
        )
      }

      if (!lead.phone) {
        return NextResponse.json(
          { success: false, error: "Lead has no phone number" },
          { status: 400 }
        )
      }

      // TODO: Integrate with LiveKit SIP to make outbound call
      // This would:
      // 1. Create a LiveKit room with lead metadata
      // 2. Dispatch the agent to the room
      // 3. Create SIP participant to dial out

      const livekitUrl = process.env.LIVEKIT_URL || "ws://localhost:7880"
      const livekitApiKey = process.env.LIVEKIT_API_KEY
      const livekitApiSecret = process.env.LIVEKIT_API_SECRET

      if (!livekitApiKey || !livekitApiSecret) {
        return NextResponse.json(
          { success: false, error: "LiveKit not configured" },
          { status: 500 }
        )
      }

      // Generate room name
      const roomName = `call-${id}-${Date.now()}`

      // For now, return the call setup info
      // Full implementation would use @livekit/server-sdk
      return NextResponse.json({
        success: true,
        data: {
          roomName,
          leadId: id,
          phone: lead.phone,
          scriptId,
          status: "pending",
          message: "Call initiated - LiveKit integration pending full setup",
        },
      })
    } catch (error) {
      console.error("[Lead Call] POST Error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to initiate call" },
        { status: 500 }
      )
    }
  })
}
