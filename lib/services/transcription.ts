/**
 * Transcription Service
 * Transcribes call recordings using OpenAI Whisper or Deepgram
 */

import OpenAI from "openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || ""

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null

export interface TranscriptionResult {
  success: boolean
  text?: string
  segments?: TranscriptionSegment[]
  duration?: number
  error?: string
}

export interface TranscriptionSegment {
  start: number
  end: number
  text: string
  speaker?: string
}

export async function transcribeAudio(
  audioData: Buffer | Uint8Array,
  options: {
    language?: string
    format?: "webm" | "mp3" | "wav"
    diarize?: boolean
  } = {}
): Promise<TranscriptionResult> {
  const { language = "en", format = "webm", diarize = false } = options

  // Try OpenAI Whisper first
  if (openai) {
    try {
      const file = new File([audioData], `recording.${format}`, {
        type: `audio/${format}`
      })

      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file,
        language,
        response_format: "verbose_json"
      })

      console.log("[Transcription] OpenAI Whisper completed")

      return {
        success: true,
        text: response.text,
        segments: response.segments?.map(s => ({
          start: s.start,
          end: s.end,
          text: s.text
        })),
        duration: response.duration
      }
    } catch (error: any) {
      console.error("[Transcription] OpenAI error:", error)
    }
  }

  // Fallback to Deepgram if configured
  if (DEEPGRAM_API_KEY) {
    try {
      const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&diarize=" + diarize, {
        method: "POST",
        headers: {
          "Authorization": `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": `audio/${format}`
        },
        body: audioData
      })

      const data = await response.json()
      const result = data.results?.channels?.[0]?.alternatives?.[0]

      console.log("[Transcription] Deepgram completed")

      return {
        success: true,
        text: result?.transcript || "",
        segments: result?.words?.map((w: any) => ({
          start: w.start,
          end: w.end,
          text: w.punctuated_word || w.word,
          speaker: w.speaker ? `Speaker ${w.speaker}` : undefined
        })),
        duration: data.metadata?.duration
      }
    } catch (error: any) {
      console.error("[Transcription] Deepgram error:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: false, error: "No transcription service configured" }
}

export async function transcribeFromUrl(
  url: string,
  options: Parameters<typeof transcribeAudio>[1] = {}
): Promise<TranscriptionResult> {
  try {
    const response = await fetch(url)
    const buffer = Buffer.from(await response.arrayBuffer())
    return transcribeAudio(buffer, options)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function generateCallSummary(transcript: string): Promise<string> {
  if (!openai) {
    return transcript.slice(0, 500) + "..."
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize this sales call transcript in 2-3 sentences. Focus on: outcome, key points discussed, and next steps."
        },
        { role: "user", content: transcript }
      ],
      max_tokens: 150
    })

    return response.choices[0]?.message?.content || transcript.slice(0, 500)
  } catch (error) {
    console.error("[Transcription] Summary error:", error)
    return transcript.slice(0, 500) + "..."
  }
}

export const TranscriptionService = {
  transcribe: transcribeAudio,
  transcribeFromUrl,
  generateSummary: generateCallSummary
}
