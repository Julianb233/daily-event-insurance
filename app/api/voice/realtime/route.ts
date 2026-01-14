import { NextRequest, NextResponse } from 'next/server'
import { AccessToken, RoomServiceClient, AgentDispatchClient } from 'livekit-server-sdk'

/**
 * Generate LiveKit access token for voice agent room
 * Also creates the room and dispatches an agent to join
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { context, userId } = body

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

    if (!apiKey || !apiSecret || !wsUrl) {
      const missing = []
      if (!apiKey) missing.push('LIVEKIT_API_KEY')
      if (!apiSecret) missing.push('LIVEKIT_API_SECRET')
      if (!wsUrl) missing.push('NEXT_PUBLIC_LIVEKIT_URL')

      console.error('Missing LiveKit configuration:', missing.join(', '))

      return NextResponse.json(
        { error: 'Voice service configuration error', details: `Missing: ${missing.join(', ')}` },
        { status: 500 }
      )
    }

    // Generate unique room name for this session
    const roomName = `voice-support-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Create participant identity
    const participantId = userId || `user-${Date.now()}`

    // Create room service client to create the room
    const httpUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    console.log('LiveKit HTTP URL:', httpUrl)
    console.log('API Key prefix:', apiKey?.slice(0, 5) + '...')

    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret)

    // Create the room first
    console.log('Creating room:', roomName)
    await roomService.createRoom({
      name: roomName,
      emptyTimeout: 300, // 5 minutes
      maxParticipants: 2, // user + agent
    })

    console.log(`Created room successfully: ${roomName}`)

    // Dispatch the named agent to the room
    try {
      const agentDispatch = new AgentDispatchClient(httpUrl, apiKey, apiSecret)
      await agentDispatch.createDispatch(roomName, 'daily-event-insurance', {
        metadata: JSON.stringify({ context }),
      })
      console.log(`Dispatched agent Quinn-521 to room: ${roomName}`)
    } catch (dispatchError) {
      console.warn('Agent dispatch error:', dispatchError)
    }

    // Create access token for the user
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantId,
      name: 'Website Visitor',
    })

    // Grant permissions
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    // Set token expiry (1 hour)
    const token = await at.toJwt()

    // Build system prompt based on context
    const systemPrompt = buildSystemPrompt(context)

    return NextResponse.json({
      token,
      url: wsUrl,
      roomName,
      participantId,
      systemPrompt,
    })
  } catch (error: any) {
    console.error('Voice token generation error:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      stack: error?.stack?.slice(0, 500)
    })
    return NextResponse.json(
      {
        error: 'Failed to initialize voice session',
        details: error?.message || 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    )
  }
}

function buildSystemPrompt(context?: {
  screenType?: string
  screenName?: string
  currentStepName?: string
  journeyStage?: string
}): string {
  let prompt = `You are Sarah, a friendly and knowledgeable insurance specialist for Daily Event Insurance.
You help partners and potential partners understand our event insurance platform.
Always introduce yourself as Sarah when greeting users.

Key facts about Daily Event Insurance:
- We provide liability insurance for event operators, gyms, climbing facilities, and adventure businesses
- Partners earn commissions by offering our insurance to their customers
- Our platform offers instant quotes and same-day coverage
- We handle all claims and customer support

Communication style:
- Be conversational, warm, and professional
- Keep responses concise (2-3 sentences) since this is a voice conversation
- Ask clarifying questions when needed
- Be helpful and solution-oriented`

  if (context?.screenType?.startsWith('onboarding')) {
    prompt += `

Current context: The user is going through the partner onboarding process.
${context.currentStepName ? `They are currently on the "${context.currentStepName}" step.` : ''}
Help them complete the onboarding smoothly. Answer questions about the process and reassure them.`
  } else if (context?.screenType?.startsWith('partner-')) {
    prompt += `

Current context: The user is an existing partner using their dashboard.
${context.screenName ? `They are on the "${context.screenName}" page.` : ''}
Help them with partner-specific questions about earnings, policies, or platform features.`
  } else if (context?.journeyStage === 'consideration') {
    prompt += `

Current context: The user is exploring our platform and considering becoming a partner.
Focus on explaining the benefits of partnership and answering their questions about how it works.`
  }

  return prompt
}
