/**
 * ElevenLabs WebSocket client for real-time text-to-speech
 */

export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId?: string
}

export interface ElevenLabsCallbacks {
  onAudioChunk?: (chunk: ArrayBuffer) => void
  onError?: (error: Error) => void
  onClose?: () => void
  onOpen?: () => void
}

export class ElevenLabsWebSocket {
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private audioQueue: AudioBuffer[] = []
  private isPlaying = false
  private config: ElevenLabsConfig
  private callbacks: ElevenLabsCallbacks

  constructor(config: ElevenLabsConfig, callbacks: ElevenLabsCallbacks = {}) {
    this.config = config
    this.callbacks = callbacks
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}/stream-input?model_id=${this.config.modelId || 'eleven_turbo_v2_5'}`

      this.ws = new WebSocket(wsUrl)
      this.ws.binaryType = 'arraybuffer'

      this.ws.onopen = () => {
        // Send initial configuration
        this.ws?.send(
          JSON.stringify({
            text: ' ',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
            xi_api_key: this.config.apiKey,
          })
        )
        this.callbacks.onOpen?.()
        resolve()
      }

      this.ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          // JSON message (metadata)
          try {
            const data = JSON.parse(event.data)
            if (data.audio) {
              // Base64 encoded audio
              const audioData = this.base64ToArrayBuffer(data.audio)
              await this.playAudioChunk(audioData)
              this.callbacks.onAudioChunk?.(audioData)
            }
          } catch {
            // Not JSON, ignore
          }
        } else if (event.data instanceof ArrayBuffer) {
          // Binary audio data
          await this.playAudioChunk(event.data)
          this.callbacks.onAudioChunk?.(event.data)
        }
      }

      this.ws.onerror = (event) => {
        const error = new Error('WebSocket error')
        this.callbacks.onError?.(error)
        reject(error)
      }

      this.ws.onclose = () => {
        this.callbacks.onClose?.()
      }
    })
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  private async playAudioChunk(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0))
      this.audioQueue.push(audioBuffer)

      if (!this.isPlaying) {
        this.playNextInQueue()
      }
    } catch (error) {
      // Audio decode error - might be partial chunk, ignore
      console.debug('Audio decode skipped:', error)
    }
  }

  private playNextInQueue(): void {
    if (this.audioQueue.length === 0 || !this.audioContext) {
      this.isPlaying = false
      return
    }

    this.isPlaying = true
    const audioBuffer = this.audioQueue.shift()!
    const source = this.audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination)
    source.onended = () => this.playNextInQueue()
    source.start()
  }

  sendText(text: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          text: text,
          try_trigger_generation: true,
        })
      )
    }
  }

  endStream(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          text: '',
        })
      )
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.audioQueue = []
    this.isPlaying = false
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

/**
 * Audio recorder for capturing microphone input with volume level detection
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private mediaStream: MediaStream | null = null
  private animationFrame: number | null = null
  private isPaused = false
  private onDataCallback: (data: Blob) => void
  private onVolumeCallback: (volume: number) => void

  constructor(
    onData: (data: Blob) => void,
    onVolume: (volume: number) => void
  ) {
    this.onDataCallback = onData
    this.onVolumeCallback = onVolume
  }

  async start(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Set up audio analysis for volume level
      this.audioContext = new AudioContext()
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      source.connect(this.analyser)

      // Start volume monitoring
      this.monitorVolume()

      // Set up media recorder for data chunks
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && !this.isPaused) {
          this.onDataCallback(event.data)
        }
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
    } catch (error) {
      console.error('Error starting audio recorder:', error)
      throw error
    }
  }

  private monitorVolume(): void {
    if (!this.analyser || this.isPaused) {
      this.animationFrame = requestAnimationFrame(() => this.monitorVolume())
      return
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)

    // Calculate average volume (0-1)
    const sum = dataArray.reduce((a, b) => a + b, 0)
    const average = sum / dataArray.length / 255

    this.onVolumeCallback(average)
    this.animationFrame = requestAnimationFrame(() => this.monitorVolume())
  }

  pause(): void {
    this.isPaused = true
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause()
    }
  }

  resume(): void {
    this.isPaused = false
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume()
    }
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      this.mediaRecorder = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.analyser = null
  }
}
