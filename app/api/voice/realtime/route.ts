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

    // Check for missing configuration
    if (!apiKey || !apiSecret || !wsUrl) {
      const missing = []
      if (!apiKey) missing.push('LIVEKIT_API_KEY')
      if (!apiSecret) missing.push('LIVEKIT_API_SECRET')
      if (!wsUrl) missing.push('NEXT_PUBLIC_LIVEKIT_URL')

      console.error('[Voice API] Missing LiveKit configuration:', missing.join(', '))

      return NextResponse.json(
        {
          error: 'Voice service temporarily unavailable',
          details: 'Voice agent configuration is incomplete. Please try again later or contact support.',
          code: 'CONFIG_MISSING',
          fallbackAvailable: true
        },
        { status: 503 }
      )
    }

    // Generate unique room name for this session
    const roomName = `voice-support-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Create participant identity
    const participantId = userId || `user-${Date.now()}`

    // Create room service client to create the room
    const httpUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    console.log('[Voice API] LiveKit HTTP URL:', httpUrl)
    console.log('[Voice API] API Key prefix:', apiKey?.slice(0, 5) + '...')
    console.log('[Voice API] Creating room:', roomName)

    const roomService = new RoomServiceClient(httpUrl, apiKey, apiSecret)

    // Create the room with timeout protection
    const roomCreationTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Room creation timeout')), 10000)
    )

    try {
      await Promise.race([
        roomService.createRoom({
          name: roomName,
          emptyTimeout: 300, // 5 minutes
          maxParticipants: 2, // user + agent
        }),
        roomCreationTimeout
      ])
      console.log(`[Voice API] Created room successfully: ${roomName}`)
    } catch (roomError: any) {
      console.error('[Voice API] Room creation failed:', roomError?.message)
      throw new Error(`Unable to create voice room: ${roomError?.message || 'Connection timeout'}`)
    }

    // Dispatch the named agent to the room
    let agentDispatched = false
    try {
      const agentDispatch = new AgentDispatchClient(httpUrl, apiKey, apiSecret)
      const dispatchTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Agent dispatch timeout')), 8000)
      )

      await Promise.race([
        agentDispatch.createDispatch(roomName, 'daily-event-insurance', {
          metadata: JSON.stringify({
            ...context,
            direction: 'inbound',
          }),
        }),
        dispatchTimeout
      ])

      agentDispatched = true
      console.log(`[Voice API] Dispatched agent daily-event-insurance to room: ${roomName}`)
    } catch (dispatchError: any) {
      console.warn('[Voice API] Agent dispatch error:', dispatchError?.message)
      // Note: Agent dispatch failing is not fatal - user can still join the room
      // The Python agent service might not be running
      console.warn('[Voice API] Voice agent service may not be running. User can join but agent might not be available.')
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
      agentDispatched, // Let the client know if agent was successfully dispatched
      warning: !agentDispatched ? 'Voice agent may not be available' : undefined
    })
  } catch (error: any) {
    console.error('[Voice API] Voice token generation error:', error)
    console.error('[Voice API] Error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      name: error?.name,
      stack: error?.stack?.slice(0, 500)
    })

    // Determine user-friendly error message
    let userMessage = 'Unable to connect to voice service'
    let errorCode = 'CONNECTION_ERROR'

    if (error?.message?.includes('timeout')) {
      userMessage = 'Voice service is not responding. Please try again.'
      errorCode = 'TIMEOUT'
    } else if (error?.message?.includes('authentication') || error?.message?.includes('unauthorized')) {
      userMessage = 'Voice service authentication failed. Please try again later.'
      errorCode = 'AUTH_ERROR'
    } else if (error?.message?.includes('network') || error?.code === 'ENOTFOUND') {
      userMessage = 'Unable to reach voice service. Please check your connection.'
      errorCode = 'NETWORK_ERROR'
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: error?.message || 'Unknown error occurred',
        code: errorCode,
        fallbackAvailable: true,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
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
