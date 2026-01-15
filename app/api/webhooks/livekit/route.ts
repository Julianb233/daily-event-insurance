import { NextRequest, NextResponse } from "next/server"
import { WebhookReceiver } from "livekit-server-sdk"
import { db, isDbConfigured, leads, leadCommunications, conversionEvents } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { handleInboundCall, createCallRoom } from "@/lib/livekit"

// LiveKit webhook configuration
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || ""
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || ""

// Create webhook receiver for signature verification
const webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)

/**
 * POST /api/webhooks/livekit
 * Handle LiveKit webhook events (room, participant, track, SIP events)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      console.error("[LiveKit Webhook] Missing authorization header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify webhook signature
    let event
    try {
      event = await webhookReceiver.receive(body, authHeader)
    } catch (error) {
      console.error("[LiveKit Webhook] Invalid signature:", error)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log(`[LiveKit Webhook] Received event: ${event.event}`)

    // Handle different event types
    const eventType = event.event as string

    switch (eventType) {
      // Room events
      case "room_started":
        await handleRoomStarted(event)
        break

      case "room_finished":
        await handleRoomFinished(event)
        break

      // Participant events
      case "participant_joined":
        await handleParticipantJoined(event)
        break

      case "participant_left":
        await handleParticipantLeft(event)
        break

      // Track events (for recording/transcription)
      case "track_published":
        console.log(`[LiveKit Webhook] Track published: ${event.track?.type}`)
        break

      default:
        // Handle SIP events and other custom events
        if (eventType.startsWith("sip_")) {
          await handleSipEvent(eventType, event)
        } else {
          console.log(`[LiveKit Webhook] Unhandled event: ${eventType}`)
        }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[LiveKit Webhook] Error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle room started event
 */
async function handleRoomStarted(event: any) {
  const roomName = event.room?.name
  const metadata = parseMetadata(event.room?.metadata)

  console.log(`[LiveKit] Room started: ${roomName}`, metadata)

  if (!isDbConfigured() || !metadata?.lead_id) return

  // Log conversion event
  try {
    await db!.insert(conversionEvents).values({
      leadId: metadata.lead_id,
      eventType: "call_started",
      metadata: JSON.stringify({
        room_name: roomName,
        direction: metadata.direction,
        agent_id: metadata.agent_id,
      }),
    })
  } catch (error) {
    console.error("[LiveKit] Error logging room start:", error)
  }
}

/**
 * Handle room finished event - calculate call duration and update records
 */
async function handleRoomFinished(event: any) {
  const roomName = event.room?.name
  const metadata = parseMetadata(event.room?.metadata)

  console.log(`[LiveKit] Room finished: ${roomName}`)

  if (!isDbConfigured() || !roomName) return

  try {
    // Find the communication record for this room
    const [comm] = await db!
      .select()
      .from(leadCommunications)
      .where(eq(leadCommunications.livekitRoomId, roomName))
      .limit(1)

    if (comm) {
      // Calculate call duration
      const callDuration = Math.floor(
        (new Date().getTime() - new Date(comm.createdAt).getTime()) / 1000
      )

      // Update communication record with duration
      await db!
        .update(leadCommunications)
        .set({
          callDuration,
          // If no disposition was set, mark as completed
          disposition: comm.disposition === "initiated" ? "completed" : comm.disposition,
        })
        .where(eq(leadCommunications.id, comm.id))

      // Log conversion event
      if (metadata?.lead_id) {
        await db!.insert(conversionEvents).values({
          leadId: metadata.lead_id,
          eventType: "call_completed",
          eventValue: callDuration > 60 ? "10.00" : "5.00", // Attribute value based on duration
          metadata: JSON.stringify({
            room_name: roomName,
            duration: callDuration,
            disposition: comm.disposition,
          }),
        })
      }
    }
  } catch (error) {
    console.error("[LiveKit] Error handling room finished:", error)
  }
}

/**
 * Handle participant joined event
 */
async function handleParticipantJoined(event: any) {
  const roomName = event.room?.name
  const participant = event.participant
  const metadata = parseMetadata(participant?.metadata)

  console.log(
    `[LiveKit] Participant joined: ${participant?.identity} in ${roomName}`
  )

  // Track when the actual caller joins (not the agent)
  if (participant?.identity?.startsWith("caller-") && isDbConfigured()) {
    try {
      // Update lead status
      const leadId = metadata?.lead_id
      if (leadId) {
        await db!
          .update(leads)
          .set({
            status: "contacted",
            lastActivityAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(leads.id, leadId))
      }
    } catch (error) {
      console.error("[LiveKit] Error updating participant join:", error)
    }
  }
}

/**
 * Handle participant left event
 */
async function handleParticipantLeft(event: any) {
  const roomName = event.room?.name
  const participant = event.participant

  console.log(
    `[LiveKit] Participant left: ${participant?.identity} from ${roomName}`
  )
}

/**
 * Handle all SIP events
 */
async function handleSipEvent(eventType: string, event: any) {
  switch (eventType) {
    case "sip_inbound_call":
      await handleSipInboundCall(event)
      break
    case "sip_call_started":
      await handleSipCallStarted(event)
      break
    case "sip_call_ended":
      await handleSipCallEnded(event)
      break
    default:
      console.log(`[LiveKit] Unhandled SIP event: ${eventType}`)
  }
}

/**
 * Handle inbound SIP call - create room and route to agent
 */
async function handleSipInboundCall(event: any) {
  const callerPhone = event.sipCall?.fromNumber || "unknown"
  const calledNumber = event.sipCall?.toNumber || "unknown"
  const sipCallId = event.sipCall?.sipCallId

  console.log(`[LiveKit] Inbound SIP call from ${callerPhone} to ${calledNumber}`)

  if (!isDbConfigured()) {
    console.log("[LiveKit] DB not configured, skipping inbound call handling")
    return
  }

  try {
    // Try to match caller to existing lead
    const [existingLead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.phone, callerPhone.replace(/\D/g, "")))
      .limit(1)

    let leadId: string

    if (existingLead) {
      leadId = existingLead.id
      console.log(`[LiveKit] Matched inbound call to lead: ${leadId}`)
    } else {
      // Create a new lead for unknown caller
      const [newLead] = await db!
        .insert(leads)
        .values({
          source: "inbound_call",
          firstName: "Inbound",
          lastName: "Caller",
          email: `inbound-${Date.now()}@unknown.com`,
          phone: callerPhone,
          status: "new",
          interestLevel: "warm", // Inbound callers are generally warm leads
        })
        .returning()

      leadId = newLead.id
      console.log(`[LiveKit] Created new lead for inbound call: ${leadId}`)
    }

    // Create room for the call
    const roomResult = await handleInboundCall(sipCallId, callerPhone, calledNumber)

    if (roomResult) {
      // Create communication record
      await db!.insert(leadCommunications).values({
        leadId,
        channel: "call",
        direction: "inbound",
        disposition: "initiated",
        agentId: "sarah-voice-agent",
        livekitRoomId: roomResult.roomName,
        livekitSessionId: sipCallId,
      })

      // Update lead activity
      await db!
        .update(leads)
        .set({
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId))
    }
  } catch (error) {
    console.error("[LiveKit] Error handling inbound call:", error)
  }
}

/**
 * Handle SIP call started (connection established)
 */
async function handleSipCallStarted(event: any) {
  const sipCallId = event.sipCall?.sipCallId
  const roomName = event.room?.name

  console.log(`[LiveKit] SIP call started: ${sipCallId} in room ${roomName}`)

  if (!isDbConfigured() || !roomName) return

  try {
    // Update disposition to "reached" when call connects
    await db!
      .update(leadCommunications)
      .set({
        disposition: "reached",
      })
      .where(eq(leadCommunications.livekitRoomId, roomName))
  } catch (error) {
    console.error("[LiveKit] Error handling SIP call started:", error)
  }
}

/**
 * Handle SIP call ended
 */
async function handleSipCallEnded(event: any) {
  const sipCallId = event.sipCall?.sipCallId
  const duration = event.sipCall?.duration
  const disconnectReason = event.sipCall?.disconnectReason

  console.log(
    `[LiveKit] SIP call ended: ${sipCallId}, duration: ${duration}s, reason: ${disconnectReason}`
  )

  // Additional cleanup if needed
  // The room_finished event will handle most of the record updates
}

/**
 * Parse JSON metadata safely
 */
function parseMetadata(metadata: string | undefined): Record<string, any> | null {
  if (!metadata) return null
  try {
    return JSON.parse(metadata)
  } catch {
    return null
  }
}

/**
 * GET /api/webhooks/livekit
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "livekit-webhook",
    timestamp: new Date().toISOString(),
  })
}
