/**
 * LiveKit Service
 *
 * Handles LiveKit room creation, SIP outbound calls, and agent dispatch
 * for the AI voice call center.
 */

import { AccessToken, RoomServiceClient, SIPClient } from "livekit-server-sdk"

// Environment variables
const LIVEKIT_URL = process.env.LIVEKIT_URL || ""
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || ""
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || ""
const SIP_TRUNK_ID = process.env.LIVEKIT_SIP_TRUNK_ID || ""
const LIVEKIT_AGENT_URL = process.env.LIVEKIT_AGENT_URL || "http://localhost:8080"

/**
 * Check if LiveKit is configured
 */
export function isLiveKitConfigured(): boolean {
  return !!(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET)
}

/**
 * Generate a unique room name for a lead call
 */
export function generateRoomName(leadId: string): string {
  const timestamp = Date.now()
  return `call-${leadId}-${timestamp}`
}

/**
 * Create a LiveKit access token
 */
export function createAccessToken(
  identity: string,
  roomName: string,
  options: {
    canPublish?: boolean
    canSubscribe?: boolean
    canPublishData?: boolean
    metadata?: string
  } = {}
): string {
  if (!isLiveKitConfigured()) {
    throw new Error("LiveKit is not configured")
  }

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    metadata: options.metadata,
  })

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: options.canPublish ?? true,
    canSubscribe: options.canSubscribe ?? true,
    canPublishData: options.canPublishData ?? true,
  })

  return token.toJwt()
}

/**
 * Get the Room Service client
 */
function getRoomService(): RoomServiceClient {
  if (!isLiveKitConfigured()) {
    throw new Error("LiveKit is not configured")
  }

  return new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
}

/**
 * Get the SIP client for outbound calls
 */
function getSipClient(): SIPClient {
  if (!isLiveKitConfigured()) {
    throw new Error("LiveKit is not configured")
  }

  return new SIPClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
}

/**
 * Create a new LiveKit room
 */
export async function createRoom(
  roomName: string,
  options: {
    emptyTimeout?: number
    maxParticipants?: number
    metadata?: string
  } = {}
): Promise<{ success: boolean; room?: unknown; error?: string }> {
  try {
    const roomService = getRoomService()

    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: options.emptyTimeout ?? 300, // 5 minutes
      maxParticipants: options.maxParticipants ?? 10,
      metadata: options.metadata,
    })

    return { success: true, room }
  } catch (error) {
    console.error("[LiveKit] Create room error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create room",
    }
  }
}

/**
 * Delete a LiveKit room
 */
export async function deleteRoom(roomName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const roomService = getRoomService()
    await roomService.deleteRoom(roomName)
    return { success: true }
  } catch (error) {
    console.error("[LiveKit] Delete room error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete room",
    }
  }
}

/**
 * List all active rooms
 */
export async function listRooms(): Promise<{ success: boolean; rooms?: unknown[]; error?: string }> {
  try {
    const roomService = getRoomService()
    const rooms = await roomService.listRooms()
    return { success: true, rooms }
  } catch (error) {
    console.error("[LiveKit] List rooms error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list rooms",
    }
  }
}

/**
 * Initiate an outbound call via LiveKit SIP
 */
export async function initiateOutboundCall(options: {
  leadId: string
  leadName: string
  businessName?: string
  phone: string
  direction: "outbound" | "inbound"
  scriptId?: string
  agentId?: string
}): Promise<{
  success: boolean
  roomName?: string
  roomSid?: string
  sipParticipantId?: string
  error?: string
}> {
  try {
    if (!isLiveKitConfigured()) {
      return { success: false, error: "LiveKit is not configured" }
    }

    // Generate room name
    const roomName = generateRoomName(options.leadId)

    // Create room with metadata for the agent
    const roomMetadata = JSON.stringify({
      lead_id: options.leadId,
      lead_name: options.leadName,
      business_name: options.businessName,
      direction: options.direction,
      script_id: options.scriptId,
      agent_id: options.agentId,
    })

    const roomResult = await createRoom(roomName, {
      emptyTimeout: 600, // 10 minutes
      maxParticipants: 3, // Lead, Agent, possible supervisor
      metadata: roomMetadata,
    })

    if (!roomResult.success) {
      return { success: false, error: roomResult.error }
    }

    // Format phone number for SIP (E.164)
    const formattedPhone = formatPhoneForSip(options.phone)

    // If SIP trunk is configured, initiate the call
    if (SIP_TRUNK_ID) {
      try {
        const sipClient = getSipClient()

        // Create SIP participant (outbound call)
        const sipParticipant = await sipClient.createSIPParticipant(
          SIP_TRUNK_ID,
          `sip:${formattedPhone}@sip.twilio.com`, // Adjust based on your SIP provider
          roomName,
          {
            participantIdentity: `phone-${options.leadId}`,
            participantName: options.leadName,
            participantMetadata: JSON.stringify({
              type: "phone",
              lead_id: options.leadId,
            }),
          }
        )

        return {
          success: true,
          roomName,
          roomSid: (roomResult.room as { sid?: string })?.sid,
          sipParticipantId: sipParticipant.sipParticipantId,
        }
      } catch (sipError) {
        console.error("[LiveKit] SIP call error:", sipError)
        // Continue without SIP - agent can still join the room
      }
    }

    // Dispatch agent to the room (even if SIP fails)
    await dispatchAgentToRoom(roomName, options)

    return {
      success: true,
      roomName,
      roomSid: (roomResult.room as { sid?: string })?.sid,
    }
  } catch (error) {
    console.error("[LiveKit] Outbound call error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate call",
    }
  }
}

/**
 * Dispatch an AI agent to a room
 */
async function dispatchAgentToRoom(
  roomName: string,
  options: {
    leadId: string
    leadName: string
    businessName?: string
    direction: string
    scriptId?: string
    agentId?: string
  }
): Promise<void> {
  try {
    // Option 1: Send HTTP request to agent dispatcher
    const response = await fetch(`${LIVEKIT_AGENT_URL}/dispatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LIVEKIT_API_SECRET}`,
      },
      body: JSON.stringify({
        room_name: roomName,
        lead_id: options.leadId,
        lead_name: options.leadName,
        business_name: options.businessName,
        direction: options.direction,
        script_id: options.scriptId,
        agent_id: options.agentId || "sarah-voice-agent",
      }),
    })

    if (!response.ok) {
      console.warn(`[LiveKit] Agent dispatch returned ${response.status}`)
    }
  } catch (error) {
    // Agent dispatcher might not be running - that's OK
    // The agent will pick up the room via the job queue
    console.log("[LiveKit] Agent dispatch skipped:", error instanceof Error ? error.message : "Unknown error")
  }
}

/**
 * Format phone number for SIP (E.164 format)
 */
function formatPhoneForSip(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Add country code if not present (assume US)
  if (digits.length === 10) {
    return `+1${digits}`
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }

  return `+${digits}`
}

/**
 * Get room participants
 */
export async function getRoomParticipants(roomName: string): Promise<{
  success: boolean
  participants?: unknown[]
  error?: string
}> {
  try {
    const roomService = getRoomService()
    const participants = await roomService.listParticipants(roomName)
    return { success: true, participants }
  } catch (error) {
    console.error("[LiveKit] Get participants error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get participants",
    }
  }
}

/**
 * Remove a participant from a room
 */
export async function removeParticipant(
  roomName: string,
  identity: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const roomService = getRoomService()
    await roomService.removeParticipant(roomName, identity)
    return { success: true }
  } catch (error) {
    console.error("[LiveKit] Remove participant error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove participant",
    }
  }
}

/**
 * Handle inbound SIP call - create room and dispatch agent
 */
export async function handleInboundCall(
  sipCallId: string,
  callerPhone: string,
  calledNumber: string
): Promise<{ roomName: string; success: boolean } | null> {
  try {
    if (!isLiveKitConfigured()) {
      console.warn("[LiveKit] Not configured for inbound call handling")
      return null
    }

    // Generate unique room name for inbound call
    const roomName = `inbound-${Date.now()}-${sipCallId.substring(0, 8)}`

    // Create room with metadata
    const roomMetadata = JSON.stringify({
      direction: "inbound",
      caller_phone: callerPhone,
      called_number: calledNumber,
      sip_call_id: sipCallId,
    })

    const roomResult = await createRoom(roomName, {
      emptyTimeout: 600,
      maxParticipants: 3,
      metadata: roomMetadata,
    })

    if (!roomResult.success) {
      console.error("[LiveKit] Failed to create room for inbound call:", roomResult.error)
      return null
    }

    // Dispatch agent to handle the call
    await dispatchAgentToRoom(roomName, {
      leadId: `inbound-${sipCallId}`,
      leadName: callerPhone,
      direction: "inbound",
    })

    return { roomName, success: true }
  } catch (error) {
    console.error("[LiveKit] Error handling inbound call:", error)
    return null
  }
}

/**
 * Create a call room for a specific lead
 */
export async function createCallRoom(
  leadId: string,
  metadata: Record<string, unknown> = {}
): Promise<{ roomName: string; token: string } | null> {
  try {
    if (!isLiveKitConfigured()) {
      return null
    }

    const roomName = generateRoomName(leadId)

    const roomResult = await createRoom(roomName, {
      emptyTimeout: 600,
      maxParticipants: 3,
      metadata: JSON.stringify({
        lead_id: leadId,
        ...metadata,
      }),
    })

    if (!roomResult.success) {
      return null
    }

    // Generate agent token
    const token = createAccessToken(`agent-${leadId}`, roomName, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    return { roomName, token }
  } catch (error) {
    console.error("[LiveKit] Error creating call room:", error)
    return null
  }
}

/**
 * Send data message to room
 */
export async function sendDataToRoom(
  roomName: string,
  data: string | Uint8Array,
  options: {
    destinationIdentities?: string[]
    topic?: string
  } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const roomService = getRoomService()
    await roomService.sendData(roomName, data, {
      destinationIdentities: options.destinationIdentities,
      topic: options.topic,
    })
    return { success: true }
  } catch (error) {
    console.error("[LiveKit] Send data error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send data",
    }
  }
}
