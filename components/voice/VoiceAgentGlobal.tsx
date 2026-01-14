"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, X, Sparkles } from 'lucide-react'
import { usePathname } from "next/navigation"
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipant,
  useVoiceAssistant,
  BarVisualizer,
} from '@livekit/components-react'
import { ConnectionState, RoomEvent, Participant, Track } from 'livekit-client'
import { useVoiceAgent } from '@/lib/voice/voice-context'
import { getContextualQuickActions } from '@/lib/voice/context-prompts'
import Image from 'next/image'

type ErrorType = 'microphone' | 'connection' | 'network' | 'unknown'

const SERVER_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL

export function VoiceAgentGlobal() {
  const { context, isOpen, openVoiceAgent, closeVoiceAgent } = useVoiceAgent()
  const pathname = usePathname()

  // Don't show on microsites
  if (pathname?.startsWith("/events")) {
    return null
  }

  const [token, setToken] = useState<string>('')
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Fetch token when the agent is opened
  useEffect(() => {
    if (isOpen && !token) {
      const fetchToken = async () => {
        try {
          const response = await fetch('/api/voice/realtime', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Voice token fetch failed:', response.status, errorData)
            throw new Error(errorData.details || errorData.error || 'Failed to fetch token')
          }

          const data = await response.json()
          setToken(data.token)
          setErrorType(null)
        } catch (err: any) {
          console.error("Token fetch error details:", err)
          setErrorType('connection')
          setErrorMessage(err.message || 'Failed to connect')
        }
      }
      fetchToken()
    } else if (!isOpen) {
      setToken('') // Reset token on close to ensure fresh session next time
    }
  }, [isOpen, context, token])

  const handleDisconnect = () => {
    setToken('')
    closeVoiceAgent()
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-white shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all"
          onClick={openVoiceAgent}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          style={{ boxShadow: "0 10px 30px rgba(20, 184, 166, 0.3)" }}
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/40">
              <Image
                src="/images/avatars/voice-agent.jpg"
                alt="Sarah - Insurance Specialist"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
            </span>
          </div>
          <span className="font-semibold text-lg">Let's Talk</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && token && SERVER_URL && (
          <LiveKitRoom
            token={token}
            serverUrl={SERVER_URL}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleDisconnect}
            onError={(err) => {
              console.error("LiveKit Error", err)
              setErrorType('connection')
            }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <AgentContent
              onClose={handleDisconnect}
              context={context}
              errorType={errorType}
              errorMessage={errorMessage}
            />
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </AnimatePresence>
    </>
  )
}

function AgentContent({ onClose, context, errorType, errorMessage }: { onClose: () => void, context: any, errorType: ErrorType | null, errorMessage?: string }) {
  const connectionState = useConnectionState()
  const { state, audioTrack } = useVoiceAssistant()
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant()
  const { isAgentActive, connect, disconnect } = useVoiceAgent()
  const pathname = usePathname()

  // Don't show on microsites
  if (pathname?.startsWith("/events")) {
    return null
  }

  // Auto-connect in dev mode functionality logic...alParticipant } = useLocalParticipant()
  const [transcript, setTranscript] = useState<string[]>([])

  // Basic transcript handling - typically you'd listen to room events for data messages or transcription
  // For now, we'll keep it simple or hook into future transcription events.

  const isAgentSpeaking = state === 'speaking'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/40">
                <Image
                  src="/images/avatars/voice-agent.jpg"
                  alt="Sarah - Insurance Specialist"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              {connectionState === ConnectionState.Connected && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Let's Talk</h3>
              <p className="text-sm text-white/80">
                {connectionState === ConnectionState.Disconnected && 'Disconnected'}
                {connectionState === ConnectionState.Connecting && 'Connecting to Sarah...'}
                {connectionState === ConnectionState.Connected && (isAgentSpeaking ? 'Sarah is speaking...' : 'Listening...')}
                {connectionState === ConnectionState.Reconnecting && 'Reconnecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visualizer Area / Content */}
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 p-6">
        {connectionState !== ConnectionState.Connected ? (
          <div className="text-gray-500 flex flex-col items-center">
            <span className="animate-pulse mb-2">Initialize connection...</span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Agent Audio Visualizer */}
            <div className="w-full h-24 flex items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              {audioTrack ? (
                <BarVisualizer
                  state={state}
                  barCount={7}
                  trackRef={audioTrack}
                  className="h-full w-full"
                  options={{ minHeight: 20 }}
                />
              ) : (
                <div className="text-sm text-gray-400">Waiting for audio...</div>
              )}
            </div>

            <p className="text-center text-gray-500 text-sm">
              {isAgentSpeaking ? "Sarah is explaining..." : "Go ahead, I'm listening."}
            </p>
          </div>
        )}

        {errorType && (
          <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            <p className="font-semibold">{errorType === 'connection' ? 'Connection Error' : 'Error occurred'}</p>
            {errorMessage && <p className="text-xs mt-1 opacity-90">{errorMessage}</p>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-white border-t flex items-center justify-center gap-4">
        <button
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          className={`flex items-center justify-center rounded-full h-14 w-14 transition-colors ${!isMicrophoneEnabled
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'border-2 border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
        >
          {!isMicrophoneEnabled ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <button
          onClick={onClose}
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full h-14 w-14 transition-colors"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}
