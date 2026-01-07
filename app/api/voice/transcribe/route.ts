
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { writeFile } from 'fs/promises'
import path from 'path'
import os from 'os'
import fs from 'fs'

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
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' }, 
        { status: 400 }
      )
    }

    // Convert file to buffer and save temporarily
    // OpenAI SDK requires a file path or ReadStream, sometimes easier with a temp file for FormData
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a temp file path
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.webm`)
    await writeFile(tempFilePath, buffer)

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    })

    // Cleanup temp file
    fs.unlinkSync(tempFilePath)

    return NextResponse.json({ text: transcription.text })

  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing audio' }, 
      { status: 500 }
    )
  }
}
