/**
 * LiveKit Integration Library
 * Handles voice calls via LiveKit SIP and voice agents
 */

import { AccessToken, RoomServiceClient, SipClient } from "livekit-server-sdk"

// Configuration check
export function isLiveKitConfigured(): boolean {
  return Boolean(
    process.env.LIVEKIT_API_KEY &&
    process.env.LIVEKIT_API_SECRET &&
    process.env.NEXT_PUBLIC_LIVEKIT_URL
  )
}

// Get LiveKit config
function getConfig() {
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
  const sipTrunkId = process.env.LIVEKIT_SIP_TRUNK_ID

  if (!apiKey || !apiSecret || !wsUrl) {
    throw new Error("LiveKit configuration incomplete")
  }

  const httpUrl = wsUrl.replace("wss://", "https://").replace("ws://", "http://")

  return { apiKey, apiSecret, wsUrl, httpUrl, sipTrunkId }
}

// Generate unique room name
export function generateRoomName(prefix: string = "call"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Create a room and return access token
export async function createVoiceRoom(options: {
  roomName?: string
  participantId: string
  participantName?: string
  metadata?: Record<string, any>
}): Promise<{
  success: boolean
  token?: string
  roomName?: string
  url?: string
  error?: string
}> {
  try {
    const config = getConfig()
    const roomName = options.roomName || generateRoomName()

    // Create room service client
    const roomService = new RoomServiceClient(config.httpUrl, config.apiKey, config.apiSecret)

    // Create the room
    await roomService.createRoom({
      name: roomName,
      emptyTimeout: 300, // 5 minutes
      maxParticipants: 3, // user + agent + possible observer
      metadata: options.metadata ? JSON.stringify(options.metadata) : undefined,
    })

    console.log(`[LiveKit] Created room: ${roomName}`)

    // Create access token
    const at = new AccessToken(config.apiKey, config.apiSecret, {
      identity: options.participantId,
      name: options.participantName || "Admin User",
    })

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const token = await at.toJwt()

    return {
      success: true,
      token,
      roomName,
      url: config.wsUrl,
    }
  } catch (error: any) {
    console.error("[LiveKit] Room creation failed:", error)
    return {
      success: false,
      error: error.message || "Failed to create voice room",
    }
  }
}

// Initiate outbound call via SIP
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
    const config = getConfig()
    const roomName = generateRoomName(`lead-${options.leadId}`)

    // Create room service client
    const roomService = new RoomServiceClient(config.httpUrl, config.apiKey, config.apiSecret)

    // Create the room with metadata
    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 600, // 10 minutes for calls
      maxParticipants: 4,
      metadata: JSON.stringify({
        type: "lead-call",
        leadId: options.leadId,
        leadName: options.leadName,
        businessName: options.businessName,
        direction: options.direction,
        scriptId: options.scriptId,
        agentId: options.agentId,
      }),
    })

    console.log(`[LiveKit] Created call room: ${roomName}`)

    // If SIP trunk is configured, initiate outbound call
    if (config.sipTrunkId) {
      try {
        const sipClient = new SipClient(config.httpUrl, config.apiKey, config.apiSecret)

        // Format phone number for SIP (E.164 format)
        const formattedPhone = formatPhoneForSip(options.phone)

        // Create outbound SIP participant
        const sipParticipant = await sipClient.createSipParticipant(
          config.sipTrunkId,
          formattedPhone,
          roomName,
          {
            participantIdentity: `sip-${options.leadId}`,
            participantName: options.leadName,
            playDialtone: true,
          }
        )

        console.log(`[LiveKit] SIP participant created: ${sipParticipant.sipCallId}`)

        return {
          success: true,
          roomName,
          roomSid: room.sid,
          sipParticipantId: sipParticipant.sipCallId,
        }
      } catch (sipError: any) {
        console.error("[LiveKit] SIP call failed:", sipError)
        // Room was created, but SIP failed - still return room for web-based calling
        return {
          success: true,
          roomName,
          roomSid: room.sid,
          error: `SIP unavailable: ${sipError.message}`,
        }
      }
    }

    // No SIP trunk - just return room for web-based calling
    return {
      success: true,
      roomName,
      roomSid: room.sid,
    }
  } catch (error: any) {
    console.error("[LiveKit] Outbound call failed:", error)
    return {
      success: false,
      error: error.message || "Failed to initiate call",
    }
  }
}

// End a call by closing the room
export async function endCall(roomName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getConfig()
    const roomService = new RoomServiceClient(config.httpUrl, config.apiKey, config.apiSecret)

    await roomService.deleteRoom(roomName)
    console.log(`[LiveKit] Room deleted: ${roomName}`)

    return { success: true }
  } catch (error: any) {
    console.error("[LiveKit] End call failed:", error)
    return {
      success: false,
      error: error.message || "Failed to end call",
    }
  }
}

// Get room recording URL (if recording was enabled)
export async function getRecordingUrl(roomName: string): Promise<string | null> {
  try {
    const config = getConfig()
    const roomService = new RoomServiceClient(config.httpUrl, config.apiKey, config.apiSecret)

    // List recordings for the room
    // Note: This requires LiveKit Cloud or Egress configured
    // For self-hosted, recordings would be stored in configured S3/GCS bucket

    // Placeholder - actual implementation depends on LiveKit setup
    console.log(`[LiveKit] Recording URL requested for: ${roomName}`)
    return null
  } catch (error: any) {
    console.error("[LiveKit] Get recording failed:", error)
    return null
  }
}

// Format phone number for SIP (E.164)
function formatPhoneForSip(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // If starts with 1 (US country code), add +
  if (digits.startsWith("1") && digits.length === 11) {
    return `+${digits}`
  }

  // If 10 digits (US without country code), add +1
  if (digits.length === 10) {
    return `+1${digits}`
  }

  // Otherwise assume it's already properly formatted
  return digits.startsWith("+") ? phone : `+${digits}`
}

// Create agent token for Python agent to join
export async function createAgentToken(
  roomName: string,
  agentId: string = "sarah-voice-agent"
): Promise<string> {
  const config = getConfig()

  const at = new AccessToken(config.apiKey, config.apiSecret, {
    identity: agentId,
    name: "Sarah - AI Voice Agent",
  })

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    agent: true,
  })

  return at.toJwt()
}

// Handle inbound SIP call - creates room and returns room info
export async function handleInboundCall(
  sipCallId: string,
  callerPhone: string,
  calledNumber: string
): Promise<{ roomName: string } | null> {
  try {
    const roomName = generateRoomName("inbound")
    const result = await createVoiceRoom({
      roomName,
      participantId: `inbound-${sipCallId}`,
      participantName: callerPhone,
      metadata: {
        type: "inbound-call",
        callDirection: "inbound",
        callerPhone,
        calledNumber,
        sipCallId,
      },
    })

    if (result.success) {
      return { roomName: result.roomName || roomName }
    }
    return null
  } catch (error) {
    console.error("[LiveKit] Error handling inbound call:", error)
    return null
  }
}

// Alias for createVoiceRoom for backwards compatibility
export const createCallRoom = createVoiceRoom
