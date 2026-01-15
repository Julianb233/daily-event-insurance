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
import { FallbackSupportCard } from './FallbackSupportCard'
import Image from 'next/image'

type ErrorType = 'microphone' | 'connection' | 'network' | 'service-unavailable' | 'timeout' | 'unknown'

const SERVER_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL
const CONNECTION_TIMEOUT_MS = 15000 // 15 seconds to connect

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
  const [errorCode, setErrorCode] = useState<string>('')
  const [showFallback, setShowFallback] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [agentWarning, setAgentWarning] = useState<string>('')

  // Fetch token when the agent is opened
  useEffect(() => {
    if (isOpen && !token && !errorType) {
      const fetchToken = async () => {
        setIsConnecting(true)
        setErrorType(null)
        setErrorMessage('')
        setShowFallback(false)

        // Set a timeout for the entire connection process
        const timeoutId = setTimeout(() => {
          if (!token) {
            console.error('[Voice Agent] Connection timeout after', CONNECTION_TIMEOUT_MS, 'ms')
            setErrorType('timeout')
            setErrorMessage('Connection is taking too long. Please try again.')
            setErrorCode('TIMEOUT')
            setShowFallback(true)
            setIsConnecting(false)
          }
        }, CONNECTION_TIMEOUT_MS)

        try {
          const response = await fetch('/api/voice/realtime', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context }),
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            console.error('[Voice Agent] Token fetch failed:', response.status, data)

            // Service is unavailable - show fallback immediately
            if (response.status === 503 || data.code === 'CONFIG_MISSING') {
              setErrorType('service-unavailable')
              setErrorMessage(data.error || 'Voice service is temporarily unavailable')
              setErrorCode(data.code || 'SERVICE_UNAVAILABLE')
              setShowFallback(true)
            } else {
              setErrorType('connection')
              setErrorMessage(data.error || data.details || 'Failed to connect to voice service')
              setErrorCode(data.code || 'CONNECTION_ERROR')
            }
            clearTimeout(timeoutId)
            setIsConnecting(false)
            return
          }

          // Successfully got token
          clearTimeout(timeoutId)
          setToken(data.token)
          setErrorType(null)
          setShowFallback(false)

          // Check if agent was dispatched
          if (data.warning) {
            setAgentWarning(data.warning)
            console.warn('[Voice Agent]', data.warning)
          }

          setIsConnecting(false)
        } catch (err: any) {
          console.error("[Voice Agent] Token fetch error:", err)
          clearTimeout(timeoutId)
          setErrorType('connection')
          setErrorMessage(err.message || 'Failed to connect to voice service')
          setErrorCode('FETCH_ERROR')
          setIsConnecting(false)
        }
      }
      fetchToken()
    } else if (!isOpen) {
      // Reset everything on close
      setToken('')
      setErrorType(null)
      setErrorMessage('')
      setErrorCode('')
      setShowFallback(false)
      setIsConnecting(false)
      setAgentWarning('')
    }
  }, [isOpen, context, token, errorType])

  const handleDisconnect = () => {
    setToken('')
    setErrorType(null)
    setErrorMessage('')
    setErrorCode('')
    setShowFallback(false)
    setAgentWarning('')
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
        {isOpen && showFallback && (
          <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm">
            <FallbackSupportCard
              onClose={handleDisconnect}
              errorMessage={errorMessage}
              errorCode={errorCode}
            />
          </div>
        )}

        {isOpen && token && SERVER_URL && !showFallback && (
          <LiveKitRoom
            token={token}
            serverUrl={SERVER_URL}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleDisconnect}
            onError={(err) => {
              console.error("[Voice Agent] LiveKit connection error:", err)
              setErrorType('connection')
              setErrorMessage('Lost connection to voice service')
              // Show fallback after connection error
              setTimeout(() => setShowFallback(true), 2000)
            }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <AgentContent
              onClose={handleDisconnect}
              context={context}
              errorType={errorType}
              errorMessage={errorMessage}
              agentWarning={agentWarning}
              isConnecting={isConnecting}
            />
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </AnimatePresence>
    </>
  )
}

function AgentContent({
  onClose,
  context,
  errorType,
  errorMessage,
  agentWarning,
  isConnecting
}: {
  onClose: () => void
  context: any
  errorType: ErrorType | null
  errorMessage?: string
  agentWarning?: string
  isConnecting?: boolean
}) {
  const connectionState = useConnectionState()
  const { state, audioTrack } = useVoiceAssistant()
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant()
  const pathname = usePathname()

  // Don't show on microsites
  if (pathname?.startsWith("/events")) {
    return null
  }
  const [transcript, setTranscript] = useState<string[]>([])
  const [connectionTimeout, setConnectionTimeout] = useState(false)

  // Set timeout for connection
  useEffect(() => {
    if (connectionState === ConnectionState.Connecting) {
      const timer = setTimeout(() => {
        setConnectionTimeout(true)
      }, 10000) // 10 seconds
      return () => clearTimeout(timer)
    } else if (connectionState === ConnectionState.Connected) {
      setConnectionTimeout(false)
    }
  }, [connectionState])

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
            {connectionTimeout ? (
              <>
                <div className="text-amber-500 mb-3">
                  <svg className="w-12 h-12 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-center font-medium">Connection taking longer than expected...</span>
                <button
                  onClick={onClose}
                  className="mt-3 px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Try alternative support options
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-3" />
                <span className="animate-pulse mb-2">Connecting to Sarah...</span>
                {isConnecting && (
                  <span className="text-xs text-gray-400">This may take a few seconds</span>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Warning if agent wasn't dispatched */}
            {agentWarning && (
              <div className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 text-center">{agentWarning}</p>
              </div>
            )}

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
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-400">Waiting for agent to join...</div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-gray-500 text-sm">
              {isAgentSpeaking ? "Sarah is explaining..." : audioTrack ? "Go ahead, I'm listening." : "Preparing voice assistant..."}
            </p>
          </div>
        )}

        {errorType && (
          <div className="mt-4 px-4 py-2 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            <p className="font-semibold">{errorType === 'connection' ? 'Connection Error' : 'Error occurred'}</p>
            {errorMessage && <p className="text-xs mt-1 opacity-90">{errorMessage}</p>}
            <button
              onClick={onClose}
              className="mt-2 text-xs underline hover:no-underline"
            >
              View alternative support options
            </button>
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
