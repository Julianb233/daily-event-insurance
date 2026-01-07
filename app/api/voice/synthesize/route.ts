
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' }, 
      { status: 500 }
    )
  }

  try {
    const { text, voice = 'alloy' } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' }, 
        { status: 400 }
      )
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error: any) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: error.message || 'Error synthesizing speech' }, 
      { status: 500 }
    )
  }
}
