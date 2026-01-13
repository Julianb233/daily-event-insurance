/**
 * LiveKit Voice Client
 * Provides real-time voice conversation using LiveKit WebRTC infrastructure
 */

import {
  Room,
  RoomEvent,
  Track,
  LocalAudioTrack,
  RemoteTrack,
  RemoteParticipant,
  Participant,
  ConnectionState,
} from 'livekit-client'

export interface LiveKitConfig {
  url: string
  token: string
}

export interface LiveKitCallbacks {
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Error) => void
  onTranscript?: (text: string, role: 'user' | 'assistant') => void
  onSpeaking?: (isSpeaking: boolean) => void
  onAudioLevel?: (level: number) => void
}

export class LiveKitVoiceClient {
  private room: Room | null = null
  private config: LiveKitConfig
  private callbacks: LiveKitCallbacks
  private localAudioTrack: LocalAudioTrack | null = null

  constructor(config: LiveKitConfig, callbacks: LiveKitCallbacks = {}) {
    this.config = config
    this.callbacks = callbacks
  }

  async connect(): Promise<void> {
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })

    // Set up event handlers
    this.room.on(RoomEvent.Connected, () => {
      console.log('[LiveKit] Connected to room')
      this.callbacks.onConnected?.()
    })

    this.room.on(RoomEvent.Disconnected, () => {
      console.log('[LiveKit] Disconnected from room')
      this.callbacks.onDisconnected?.()
    })

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`[LiveKit] Participant connected: ${participant.identity}`)
    })

    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant: RemoteParticipant) => {
      console.log(`[LiveKit] Track subscribed: ${track.kind} from ${participant.identity}`)
      if (track.kind === Track.Kind.Audio) {
        // Agent is speaking
        this.callbacks.onSpeaking?.(true)

        // Attach audio to play it - MUST append to DOM for audio to play
        const audioElement = track.attach()
        audioElement.autoplay = true
        audioElement.style.display = 'none'
        document.body.appendChild(audioElement)
        console.log('[LiveKit] Audio element attached to DOM')
      }
    })

    this.room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Audio) {
        this.callbacks.onSpeaking?.(false)
        track.detach()
      }
    })

    this.room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: Participant) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload))

        // Handle transcript messages from the agent
        if (message.type === 'transcript') {
          this.callbacks.onTranscript?.(message.text, message.role || 'assistant')
        }
      } catch {
        // Not JSON, ignore
      }
    })

    this.room.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
      const agentSpeaking = speakers.some(s => s.identity?.startsWith('agent'))
      this.callbacks.onSpeaking?.(agentSpeaking)
    })

    this.room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      if (state === ConnectionState.Disconnected) {
        this.callbacks.onDisconnected?.()
      }
    })

    try {
      console.log('[LiveKit] Connecting to:', this.config.url)
      // Connect to the room
      await this.room.connect(this.config.url, this.config.token)
      console.log('[LiveKit] Room connection established')

      // Enable local microphone
      console.log('[LiveKit] Enabling microphone...')
      await this.room.localParticipant.setMicrophoneEnabled(true)
      console.log('[LiveKit] Microphone enabled')

      // Get local audio track for volume visualization
      const audioTracks = this.room.localParticipant.getTrackPublications()
      audioTracks.forEach(pub => {
        if (pub.track?.kind === Track.Kind.Audio) {
          this.localAudioTrack = pub.track as LocalAudioTrack
        }
      })
    } catch (error) {
      this.callbacks.onError?.(error instanceof Error ? error : new Error('Connection failed'))
      throw error
    }
  }

  mute(): void {
    this.room?.localParticipant.setMicrophoneEnabled(false)
  }

  unmute(): void {
    this.room?.localParticipant.setMicrophoneEnabled(true)
  }

  async sendData(data: Record<string, unknown>): Promise<void> {
    if (this.room?.state === ConnectionState.Connected) {
      const payload = new TextEncoder().encode(JSON.stringify(data))
      await this.room.localParticipant.publishData(payload, { reliable: true })
    }
  }

  async sendScreenshot(base64Image: string): Promise<void> {
    await this.sendData({
      type: 'screenshot',
      image: base64Image,
      timestamp: Date.now(),
    })
  }

  disconnect(): void {
    this.room?.disconnect()
    this.room = null
    this.localAudioTrack = null
  }

  isConnected(): boolean {
    return this.room?.state === ConnectionState.Connected
  }

  getAudioLevel(): number {
    // This would need WebAudio API integration for real-time levels
    return 0
  }
}
