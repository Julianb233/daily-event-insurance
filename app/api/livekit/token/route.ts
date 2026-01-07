
import { AccessToken } from 'livekit-server-sdk'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const room = "daily-event-insurance-room"
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  
  // Simple random identity for the user
  const identity = `user_${Math.random().toString(36).substring(7)}`
  const participantName = `Partner_${Math.floor(Math.random() * 1000)}`

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Server misconfigured: Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET' },
      { status: 500 }
    )
  }

  // Generate Token
  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    name: participantName,
    ttl: '10m', // 10 minutes session for demo
  })

  // Grant permissions
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  })

  return NextResponse.json({ 
    token: await at.toJwt(),
    room,
    identity 
  })
}
