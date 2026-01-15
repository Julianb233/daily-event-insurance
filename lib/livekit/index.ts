/**
 * LiveKit Service - Room management and agent dispatch
 * Handles outbound/inbound calls via LiveKit SIP integration
 */

import { AccessToken, RoomServiceClient, SipClient } from "livekit-server-sdk"

// Environment configuration
const LIVEKIT_URL = process.env.LIVEKIT_URL || "ws://localhost:7880"
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || ""
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || ""
const LIVEKIT_HTTP_URL = process.env.LIVEKIT_HTTP_URL || "http://localhost:7880"

// Validate configuration
export function isLiveKitConfigured(): boolean {
  return !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET)
}

// Room Service Client
let roomService: RoomServiceClient | null = null

function getRoomService(): RoomServiceClient {
  if (!roomService) {
    roomService = new RoomServiceClient(LIVEKIT_HTTP_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
  }
  return roomService
}

// SIP Client for telephony
let sipClient: SipClient | null = null

function getSipClient(): SipClient {
  if (!sipClient) {
    sipClient = new SipClient(LIVEKIT_HTTP_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
  }
  return sipClient
}

// Types
export interface CallMetadata {
  leadId: string
  leadName?: string
  businessName?: string
  phone: string
  direction: "outbound" | "inbound"
  scriptId?: string
  agentId?: string
}

export interface CreateRoomResult {
  roomName: string
  roomSid: string
  token: string
  sipParticipantId?: string
}

export interface OutboundCallResult {
  success: boolean
  roomName: string
  roomSid: string
  sipParticipantId?: string
  error?: string
}

/**
 * Generate a unique room name for a call
 */
export function generateRoomName(leadId: string): string {
  const timestamp = Date.now()
  return `call-${leadId}-${timestamp}`
}

/**
 * Generate an access token for a participant
 */
export async function generateToken(
  roomName: string,
  participantIdentity: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantIdentity,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  })

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  })

  return await token.toJwt()
}

/**
 * Create a LiveKit room for a call
 */
export async function createCallRoom(metadata: CallMetadata): Promise<CreateRoomResult> {
  const roomService = getRoomService()
  const roomName = generateRoomName(metadata.leadId)

  // Create the room with metadata for the agent
  const room = await roomService.createRoom({
    name: roomName,
    emptyTimeout: 300, // 5 minutes
    maxParticipants: 3, // Agent, caller, optional supervisor
    metadata: JSON.stringify({
      lead_id: metadata.leadId,
      lead_name: metadata.leadName || "Unknown",
      business_name: metadata.businessName || "Unknown",
      direction: metadata.direction,
      script_id: metadata.scriptId,
      agent_id: metadata.agentId || "sarah-voice-agent",
      created_at: new Date().toISOString(),
    }),
  })

  // Generate token for the AI agent
  const agentToken = await generateToken(roomName, "ai-agent", {
    role: "agent",
    lead_id: metadata.leadId,
  })

  return {
    roomName: room.name,
    roomSid: room.sid,
    token: agentToken,
  }
}

/**
 * Initiate an outbound call via SIP
 * Creates a room and dials the phone number
 */
export async function initiateOutboundCall(
  metadata: CallMetadata
): Promise<OutboundCallResult> {
  if (!isLiveKitConfigured()) {
    return {
      success: false,
      roomName: "",
      roomSid: "",
      error: "LiveKit not configured",
    }
  }

  try {
    // Create the room first
    const { roomName, roomSid, token } = await createCallRoom(metadata)

    // Format phone number for SIP (E.164 format)
    const phoneNumber = metadata.phone.replace(/\D/g, "")
    const sipUri = `sip:+${phoneNumber}@sip.twilio.com`

    // Create SIP participant (dial out)
    const sipClient = getSipClient()

    const sipParticipant = await sipClient.createSipParticipant(
      // SIP trunk ID from environment
      process.env.SIP_TRUNK_ID || "default-trunk",
      sipUri,
      roomName,
      {
        participantIdentity: `caller-${metadata.leadId}`,
        participantMetadata: JSON.stringify({
          lead_id: metadata.leadId,
          phone: metadata.phone,
          direction: "outbound",
        }),
        // Play hold music while connecting
        playRingtone: true,
      }
    )

    return {
      success: true,
      roomName,
      roomSid,
      sipParticipantId: sipParticipant.sipCallId,
    }
  } catch (error: any) {
    console.error("[LiveKit] Outbound call error:", error)
    return {
      success: false,
      roomName: "",
      roomSid: "",
      error: error.message || "Failed to initiate call",
    }
  }
}

/**
 * Handle an inbound SIP call
 * Creates a room and routes the call to the AI agent
 */
export async function handleInboundCall(
  sipCallId: string,
  callerPhone: string,
  calledNumber: string
): Promise<CreateRoomResult | null> {
  if (!isLiveKitConfigured()) {
    console.error("[LiveKit] Not configured for inbound calls")
    return null
  }

  try {
    // Generate a lead ID for tracking (will be matched/created later)
    const tempLeadId = `inbound-${Date.now()}`

    const result = await createCallRoom({
      leadId: tempLeadId,
      phone: callerPhone,
      direction: "inbound",
    })

    return result
  } catch (error: any) {
    console.error("[LiveKit] Inbound call error:", error)
    return null
  }
}

/**
 * End a call by removing all participants
 */
export async function endCall(roomName: string): Promise<boolean> {
  if (!isLiveKitConfigured()) return false

  try {
    const roomService = getRoomService()

    // List participants
    const participants = await roomService.listParticipants(roomName)

    // Remove each participant
    for (const participant of participants) {
      await roomService.removeParticipant(roomName, participant.identity)
    }

    // Delete the room
    await roomService.deleteRoom(roomName)

    return true
  } catch (error) {
    console.error("[LiveKit] End call error:", error)
    return false
  }
}

/**
 * Get call status from a room
 */
export async function getCallStatus(roomName: string): Promise<{
  active: boolean
  participants: number
  duration?: number
} | null> {
  if (!isLiveKitConfigured()) return null

  try {
    const roomService = getRoomService()
    const rooms = await roomService.listRooms([roomName])

    if (rooms.length === 0) {
      return { active: false, participants: 0 }
    }

    const room = rooms[0]
    const participants = await roomService.listParticipants(roomName)

    return {
      active: room.numParticipants > 0,
      participants: participants.length,
      duration: room.creationTime
        ? Math.floor((Date.now() - Number(room.creationTime) * 1000) / 1000)
        : undefined,
    }
  } catch (error) {
    console.error("[LiveKit] Get status error:", error)
    return null
  }
}

// Export types and utilities
export {
  LIVEKIT_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_HTTP_URL,
}
