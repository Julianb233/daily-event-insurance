"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useVoiceAssistant,
  BarVisualizer,
} from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'

const SERVER_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL

export default function TalkPage() {
  const [token, setToken] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCall = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch('/api/voice/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            screenType: 'sales',
            screenName: 'Talk to Sarah',
            journeyStage: 'consideration',
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to start call')
      }

      const data = await response.json()
      setToken(data.token)
      setIsConnected(true)
    } catch (err: any) {
      console.error('Call start error:', err)
      setError(err.message || 'Failed to connect')
    } finally {
      setIsConnecting(false)
    }
  }

  const endCall = () => {
    setToken('')
    setIsConnected(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
      {/* Header */}
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-lg"
            >
              {/* Agent Avatar */}
              <motion.div
                className="relative mx-auto mb-8 w-40 h-40"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-40" />
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    src="/images/avatars/voice-agent.jpg"
                    alt="Sarah - Insurance Specialist"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <span className="w-3 h-3 bg-green-300 rounded-full animate-ping absolute" />
                  <span className="w-2 h-2 bg-white rounded-full relative" />
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Talk to Sarah
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Our AI insurance specialist is ready to answer your questions about Daily Event Insurance.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                  {error}
                </div>
              )}

              <motion.button
                onClick={startCall}
                disabled={isConnecting}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-xl font-semibold shadow-xl hover:shadow-teal-500/25 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3">
                  {isConnecting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-6 h-6" />
                      Start Conversation
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
              </motion.button>

              {/* Features */}
              <div className="mt-12 grid grid-cols-3 gap-4 text-sm text-white/60">
                <div className="flex flex-col items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <span>AI Powered</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Mic className="w-5 h-5 text-teal-400" />
                  <span>Voice Chat</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Volume2 className="w-5 h-5 text-teal-400" />
                  <span>Real-time</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="call"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              {token && SERVER_URL && (
                <LiveKitRoom
                  token={token}
                  serverUrl={SERVER_URL}
                  connect={true}
                  audio={true}
                  video={false}
                  onDisconnected={endCall}
                  onError={(err) => {
                    console.error('LiveKit Error:', err)
                    setError('Connection lost')
                  }}
                >
                  <ActiveCall onEnd={endCall} />
                  <RoomAudioRenderer />
                </LiveKitRoom>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-sm">
        Powered by Daily Event Insurance &bull; LiveKit &bull; OpenAI
      </footer>
    </div>
  )
}

function ActiveCall({ onEnd }: { onEnd: () => void }) {
  const connectionState = useConnectionState()
  const { state, audioTrack } = useVoiceAssistant()
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  // Call timer
  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      const interval = setInterval(() => {
        setCallDuration(d => d + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [connectionState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMute = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(isMuted)
      setIsMuted(!isMuted)
    }
  }, [localParticipant, isMuted])

  const isAgentSpeaking = state === 'speaking'
  const isListening = state === 'listening'

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      {/* Connection Status */}
      {connectionState !== ConnectionState.Connected && (
        <div className="text-center mb-6">
          <div className="w-8 h-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-white/70">Connecting to Sarah...</p>
        </div>
      )}

      {connectionState === ConnectionState.Connected && (
        <>
          {/* Agent Avatar with Speaking Indicator */}
          <div className="relative mx-auto mb-6 w-32 h-32">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
              animate={{
                scale: isAgentSpeaking ? [1, 1.15, 1] : 1,
                opacity: isAgentSpeaking ? [0.3, 0.6, 0.3] : 0.2,
              }}
              transition={{
                duration: 0.8,
                repeat: isAgentSpeaking ? Infinity : 0,
              }}
            />
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/30">
              <Image
                src="/images/avatars/voice-agent.jpg"
                alt="Sarah"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">Sarah</h2>
            <p className="text-white/60 text-sm mb-2">Insurance Specialist</p>
            <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAgentSpeaking ? 'bg-teal-400 animate-pulse' : isListening ? 'bg-green-400' : 'bg-white/40'}`} />
              <span className="text-white/70 text-sm">
                {isAgentSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Connected'}
              </span>
            </div>
          </div>

          {/* Audio Visualizer */}
          {audioTrack && (
            <div className="h-16 mb-6 flex items-center justify-center">
              <BarVisualizer
                state={state}
                barCount={5}
                trackRef={audioTrack}
                className="h-full"
                options={{ minHeight: 4 }}
              />
            </div>
          )}

          {/* Call Duration */}
          <div className="text-center mb-6">
            <span className="text-3xl font-mono text-white/90">{formatDuration(callDuration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={toggleMute}
              className={`p-4 rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'} hover:bg-white/20 transition-colors`}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            <motion.button
              onClick={onEnd}
              className="p-5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-7 h-7" />
            </motion.button>

            <motion.button
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="w-6 h-6" />
            </motion.button>
          </div>
        </>
      )}
    </div>
  )
}
