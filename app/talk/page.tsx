"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Volume2, ArrowLeft, Sparkles, Waves } from 'lucide-react'
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950" />

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Header */}
        <header className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 rounded-full px-4 py-2 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-[75vh]">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center max-w-lg"
              >
                {/* Glassmorphism card */}
                <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] shadow-2xl">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10 pointer-events-none" />

                  {/* Agent Avatar */}
                  <motion.div
                    className="relative mx-auto mb-6 w-32 h-32"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-50" />
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl ring-4 ring-white/10">
                      <Image
                        src="/images/avatars/voice-agent.jpg"
                        alt="Sarah - Insurance Specialist"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                      <span className="w-3 h-3 bg-green-300 rounded-full animate-ping absolute" />
                      <span className="w-2 h-2 bg-white rounded-full relative" />
                    </div>
                  </motion.div>

                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-teal-100 to-cyan-100 bg-clip-text text-transparent">
                    Talk to Sarah
                  </h1>
                  <p className="text-white/60 mb-6 text-sm">
                    AI Insurance Specialist • Available 24/7
                  </p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <motion.button
                    onClick={startCall}
                    disabled={isConnecting}
                    className="group relative w-full px-6 py-4 rounded-2xl text-lg font-semibold transition-all disabled:opacity-50 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />

                    <span className="relative flex items-center justify-center gap-3">
                      {isConnecting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Phone className="w-5 h-5" />
                          Start Conversation
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Features */}
                  <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>AI Powered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-teal-400" />
                      <span>Voice Chat</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-teal-400" />
                      <span>Real-time</span>
                    </div>
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
        <footer className="p-6 text-center text-white/30 text-xs">
          Powered by Daily Event Insurance • LiveKit • OpenAI
        </footer>
      </div>
    </div>
  )
}

function ActiveCall({ onEnd }: { onEnd: () => void }) {
  const connectionState = useConnectionState()
  const { state, audioTrack } = useVoiceAssistant()
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

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
    <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] shadow-2xl">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10 pointer-events-none" />

      {/* Connection Status */}
      {connectionState !== ConnectionState.Connected && (
        <div className="text-center mb-6 relative">
          <div className="w-10 h-10 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/60 text-sm">Connecting to Sarah...</p>
        </div>
      )}

      {connectionState === ConnectionState.Connected && (
        <div className="relative">
          {/* Agent Avatar with Speaking Indicator */}
          <div className="relative mx-auto mb-6 w-28 h-28">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
              animate={{
                scale: isAgentSpeaking ? [1, 1.2, 1] : 1,
                opacity: isAgentSpeaking ? [0.3, 0.6, 0.3] : 0.2,
              }}
              transition={{
                duration: 0.8,
                repeat: isAgentSpeaking ? Infinity : 0,
              }}
            />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/30 ring-4 ring-white/10">
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
            <h2 className="text-xl font-bold mb-1">Sarah</h2>
            <p className="text-white/50 text-xs mb-2">Insurance Specialist</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${isAgentSpeaking ? 'bg-teal-400 animate-pulse' : isListening ? 'bg-green-400' : 'bg-white/40'}`} />
              <span className="text-white/60 text-xs">
                {isAgentSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Connected'}
              </span>
            </div>
          </div>

          {/* Audio Visualizer */}
          {audioTrack && (
            <div className="h-16 mb-6 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
              <BarVisualizer
                state={state}
                barCount={5}
                trackRef={audioTrack}
                className="h-12 w-full px-4"
                options={{ minHeight: 4 }}
              />
            </div>
          )}

          {/* Call Duration */}
          <div className="text-center mb-6">
            <span className="text-2xl font-mono text-white/80 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              {formatDuration(callDuration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={toggleMute}
              className={`p-4 rounded-2xl backdrop-blur-sm border transition-all ${
                isMuted
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={onEnd}
              className="p-5 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-6 h-6" />
            </motion.button>

            <motion.button
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
