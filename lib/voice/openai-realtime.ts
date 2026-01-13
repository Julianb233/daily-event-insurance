/**
 * OpenAI Realtime WebSocket Client
 * Provides real-time voice conversation similar to ChatGPT voice mode
 */

export interface RealtimeConfig {
  ephemeralToken: string
  model?: string
  voice?: 'alloy' | 'echo' | 'shimmer' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse'
  systemPrompt?: string
}

export interface RealtimeCallbacks {
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Error) => void
  onTranscript?: (text: string, role: 'user' | 'assistant') => void
  onAudioStart?: () => void
  onAudioEnd?: () => void
  onSpeaking?: (isSpeaking: boolean) => void
}

type RealtimeEvent = {
  type: string
  [key: string]: unknown
}

export class OpenAIRealtimeClient {
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private mediaStream: MediaStream | null = null
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private audioQueue: Float32Array[] = []
  private isPlaying = false
  private config: RealtimeConfig
  private callbacks: RealtimeCallbacks

  constructor(config: RealtimeConfig, callbacks: RealtimeCallbacks = {}) {
    this.config = config
    this.callbacks = callbacks
  }

  async connect(): Promise<void> {
    const model = this.config.model || 'gpt-4o-realtime-preview-2024-12-17'
    const wsUrl = `wss://api.openai.com/v1/realtime?model=${model}`

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl, [
        'realtime',
        `openai-insecure-api-key.${this.config.ephemeralToken}`,
        'openai-beta.realtime-v1',
      ])

      this.ws.onopen = async () => {
        // Configure the session
        this.sendEvent({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: this.config.systemPrompt || 'You are a helpful insurance specialist assistant for Daily Event Insurance. Help users understand our insurance products and services.',
            voice: this.config.voice || 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1',
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        })

        // Initialize audio
        await this.initializeAudio()

        this.callbacks.onConnected?.()
        resolve()
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as RealtimeEvent
        this.handleEvent(data)
      }

      this.ws.onerror = () => {
        const error = new Error('WebSocket connection error')
        this.callbacks.onError?.(error)
        reject(error)
      }

      this.ws.onclose = () => {
        this.callbacks.onDisconnected?.()
        this.cleanup()
      }
    })
  }

  private async initializeAudio(): Promise<void> {
    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000,
        },
      })

      // Create audio context
      this.audioContext = new AudioContext({ sampleRate: 24000 })

      // Connect microphone to processor
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream)

      // Use ScriptProcessor for audio capture (deprecated but widely supported)
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1)

      this.scriptProcessor.onaudioprocess = (event) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0)
          const pcm16 = this.float32ToPcm16(inputData)
          const base64Audio = this.arrayBufferToBase64(pcm16.buffer as ArrayBuffer)

          this.sendEvent({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
          })
        }
      }

      this.mediaStreamSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      throw error
    }
  }

  private handleEvent(event: RealtimeEvent): void {
    switch (event.type) {
      case 'session.created':
      case 'session.updated':
        console.log('Session configured:', event.type)
        break

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          this.callbacks.onTranscript?.(event.transcript as string, 'user')
        }
        break

      case 'response.audio_transcript.delta':
        // Streaming assistant transcript
        break

      case 'response.audio_transcript.done':
        if (event.transcript) {
          this.callbacks.onTranscript?.(event.transcript as string, 'assistant')
        }
        break

      case 'response.audio.delta':
        // Receive audio chunk
        if (event.delta) {
          const audioData = this.base64ToPcm16(event.delta as string)
          this.audioQueue.push(audioData)
          if (!this.isPlaying) {
            this.playAudioQueue()
          }
        }
        break

      case 'response.audio.done':
        this.callbacks.onSpeaking?.(false)
        break

      case 'input_audio_buffer.speech_started':
        this.callbacks.onSpeaking?.(true)
        this.callbacks.onAudioStart?.()
        break

      case 'input_audio_buffer.speech_stopped':
        this.callbacks.onAudioEnd?.()
        break

      case 'error':
        console.error('Realtime API error:', event)
        this.callbacks.onError?.(new Error((event.error as { message?: string })?.message || 'Unknown error'))
        break

      default:
        // console.log('Unhandled event:', event.type)
        break
    }
  }

  private async playAudioQueue(): Promise<void> {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = false
      return
    }

    this.isPlaying = true
    this.callbacks.onSpeaking?.(true)

    const audioData = this.audioQueue.shift()!
    const audioBuffer = this.audioContext.createBuffer(1, audioData.length, 24000)
    audioBuffer.getChannelData(0).set(audioData)

    const source = this.audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination)
    source.onended = () => this.playAudioQueue()
    source.start()
  }

  sendTextMessage(text: string): void {
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }],
      },
    })
    this.sendEvent({ type: 'response.create' })
  }

  sendScreenshot(base64Image: string): void {
    // Send image for vision analysis
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_image',
            image: base64Image,
          },
          {
            type: 'input_text',
            text: 'I\'m sharing my screen. Can you see what\'s displayed and help me with it?',
          },
        ],
      },
    })
    this.sendEvent({ type: 'response.create' })
  }

  mute(): void {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = false
      })
    }
  }

  unmute(): void {
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = true
      })
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.cleanup()
  }

  private cleanup(): void {
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect()
      this.mediaStreamSource = null
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.audioQueue = []
    this.isPlaying = false
  }

  private sendEvent(event: RealtimeEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event))
    }
  }

  private float32ToPcm16(float32Array: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return pcm16
  }

  private base64ToPcm16(base64: string): Float32Array {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const pcm16 = new Int16Array(bytes.buffer)
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff)
    }
    return float32
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
