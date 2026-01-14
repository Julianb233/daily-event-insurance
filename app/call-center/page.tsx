'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Headphones,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  Send,
  Wifi,
  WifiOff,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
} from 'lucide-react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipants,
  useVoiceAssistant,
  useTracks,
  useRoomContext,
  BarVisualizer,
} from '@livekit/components-react'
import { ConnectionState, Track, ConnectionQuality, RoomEvent } from 'livekit-client'

type CallState = 'idle' | 'connecting' | 'connected' | 'ended' | 'error'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

interface TokenResponse {
  token: string
  url: string
  roomName: string
  participantId: string
}

const SERVER_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL

export default function CallCenterPage() {
  const [callState, setCallState] = useState<CallState>('idle')
  const [token, setToken] = useState<string>('')
  const [roomUrl, setRoomUrl] = useState<string>(SERVER_URL || '')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(true)

  const handleStartCall = async () => {
    setCallState('connecting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/voice/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            screenType: 'call-center',
            screenName: 'Support Call Center',
            journeyStage: 'support',
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to connect')
      }

      const data: TokenResponse = await response.json()
      setToken(data.token)
      setRoomUrl(data.url)
      // State will be updated by LiveKitRoom onConnected callback
    } catch (err: unknown) {
      console.error('Failed to start call:', err)
      setCallState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to connect to support')
    }
  }

  const handleDisconnect = useCallback(() => {
    setCallState('ended')
    setToken('')
    setMessages([])
    setTimeout(() => setCallState('idle'), 3000)
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('LiveKit error:', error)
    setCallState('error')
    setErrorMessage(error.message || 'Connection error occurred')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <CallCenterHeader callState={callState} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {callState !== 'idle' && callState !== 'ended' && token && roomUrl ? (
          <LiveKitRoom
            token={token}
            serverUrl={roomUrl}
            connect={true}
            audio={true}
            video={false}
            onConnected={() => setCallState('connected')}
            onDisconnected={handleDisconnect}
            onError={handleError}
            className="w-full"
          >
            <CallCenterContent
              callState={callState}
              messages={messages}
              setMessages={setMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              showChat={showChat}
              setShowChat={setShowChat}
              onEndCall={handleDisconnect}
              errorMessage={errorMessage}
            />
            <RoomAudioRenderer />
          </LiveKitRoom>
        ) : (
          <CallCenterIdle
            callState={callState}
            errorMessage={errorMessage}
            onStartCall={handleStartCall}
            showChat={showChat}
          />
        )}

        {/* Help Cards */}
        <HelpCards />
      </div>
    </div>
  )
}

function CallCenterHeader({ callState }: { callState: CallState }) {
  return (
    <div className="bg-slate-800/50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Support Call Center</h1>
              <p className="text-sm text-slate-400">Daily Event Insurance</p>
            </div>
          </div>
          {callState === 'connected' && <CallDurationTimer />}
        </div>
      </div>
    </div>
  )
}

function CallDurationTimer() {
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <Clock className="w-4 h-4" />
      <span className="font-medium font-mono">{formatDuration(duration)}</span>
    </div>
  )
}

function CallCenterContent({
  callState,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  showChat,
  setShowChat,
  onEndCall,
  errorMessage,
}: {
  callState: CallState
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  newMessage: string
  setNewMessage: (value: string) => void
  showChat: boolean
  setShowChat: (value: boolean) => void
  onEndCall: () => void
  errorMessage: string
}) {
  const connectionState = useConnectionState()
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const remoteParticipants = useRemoteParticipants()
  const { state: agentState, audioTrack } = useVoiceAssistant()
  const room = useRoomContext()

  // Handle incoming data channel messages for chat
  const onDataReceived = useCallback(
    (payload: Uint8Array) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload))
        if (message.type === 'transcript' || message.type === 'chat') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: message.text,
              sender: message.role === 'user' ? 'user' : 'agent',
              timestamp: new Date(),
            },
          ])
        }
      } catch {
        // Not JSON, ignore
      }
    },
    [setMessages]
  )

  // Listen for data messages
  useEffect(() => {
    if (room) {
      room.on(RoomEvent.DataReceived, onDataReceived)
      return () => {
        room.off(RoomEvent.DataReceived, onDataReceived)
      }
    }
  }, [room, onDataReceived])

  // Add initial greeting when connected
  useEffect(() => {
    if (connectionState === ConnectionState.Connected && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm Sarah, your AI support assistant. How can I help you today?",
          sender: 'agent',
          timestamp: new Date(),
        },
      ])
    }
  }, [connectionState, messages.length, setMessages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !room) return

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newMessage, sender: 'user', timestamp: new Date() },
    ])

    // Send via data channel
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({
          type: 'chat',
          text: newMessage,
          role: 'user',
          timestamp: Date.now(),
        })
      )
      await room.localParticipant.publishData(payload, { reliable: true })
    } catch (error) {
      console.error('Failed to send message:', error)
    }

    setNewMessage('')
  }

  const toggleMicrophone = () => {
    localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Call Area */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          {/* Video/Call Area */}
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
            {connectionState === ConnectionState.Connecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-lg">Connecting to support...</p>
              </motion.div>
            )}

            {connectionState === ConnectionState.Connected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                {/* Agent Avatar and Visualizer */}
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center relative">
                    <Headphones className="w-16 h-16 text-white" />
                    {agentState === 'speaking' && (
                      <div className="absolute inset-0 rounded-full border-4 border-teal-400 animate-ping opacity-50" />
                    )}
                  </div>
                  <p className="text-white text-xl font-semibold">Sarah - AI Support Assistant</p>
                  <p className="text-sm mt-1">
                    {agentState === 'speaking' ? (
                      <span className="text-teal-400">Speaking...</span>
                    ) : agentState === 'listening' ? (
                      <span className="text-green-400">Listening...</span>
                    ) : (
                      <span className="text-slate-400">Connected</span>
                    )}
                  </p>
                </div>

                {/* Audio Visualizer */}
                {audioTrack && (
                  <div className="w-full max-w-md h-24 bg-slate-800/50 rounded-xl p-4 flex items-center justify-center">
                    <BarVisualizer
                      state={agentState}
                      barCount={7}
                      trackRef={audioTrack}
                      className="h-full w-full"
                      options={{ minHeight: 20 }}
                    />
                  </div>
                )}

                {/* Participants */}
                <ParticipantIndicators participants={remoteParticipants} />

                {/* Connection Quality */}
                <ConnectionQualityIndicator />
              </motion.div>
            )}

            {connectionState === ConnectionState.Reconnecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <p className="text-white text-lg">Reconnecting...</p>
                <p className="text-slate-400 text-sm">Please wait while we restore your connection</p>
              </motion.div>
            )}

            {callState === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-white text-lg">Connection Error</p>
                <p className="text-slate-400 text-sm">{errorMessage}</p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          {connectionState === ConnectionState.Connected && (
            <CallControls
              isMicrophoneEnabled={isMicrophoneEnabled}
              onToggleMicrophone={toggleMicrophone}
              showChat={showChat}
              onToggleChat={() => setShowChat(!showChat)}
              onEndCall={onEndCall}
            />
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        connectionState={connectionState}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

function ParticipantIndicators({ participants }: { participants: any[] }) {
  if (participants.length === 0) return null

  return (
    <div className="mt-6 flex items-center gap-2">
      <Users className="w-4 h-4 text-slate-400" />
      <span className="text-slate-400 text-sm">
        {participants.length + 1} participant{participants.length > 0 ? 's' : ''} in call
      </span>
      <div className="flex -space-x-2 ml-2">
        {participants.slice(0, 3).map((p, i) => (
          <div
            key={p.identity || i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 border-2 border-slate-800 flex items-center justify-center text-white text-xs font-semibold"
          >
            {(p.name || p.identity || 'A').charAt(0).toUpperCase()}
          </div>
        ))}
        {participants.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-white text-xs">
            +{participants.length - 3}
          </div>
        )}
      </div>
    </div>
  )
}

function ConnectionQualityIndicator() {
  const { localParticipant } = useLocalParticipant()
  const connectionQuality = localParticipant.connectionQuality

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case ConnectionQuality.Excellent:
        return <Signal className="w-4 h-4 text-green-500" />
      case ConnectionQuality.Good:
        return <SignalHigh className="w-4 h-4 text-green-400" />
      case ConnectionQuality.Poor:
        return <SignalMedium className="w-4 h-4 text-yellow-500" />
      case ConnectionQuality.Lost:
        return <SignalLow className="w-4 h-4 text-red-500" />
      default:
        return <Wifi className="w-4 h-4 text-slate-400" />
    }
  }

  const getQualityText = () => {
    switch (connectionQuality) {
      case ConnectionQuality.Excellent:
        return 'Excellent'
      case ConnectionQuality.Good:
        return 'Good'
      case ConnectionQuality.Poor:
        return 'Poor'
      case ConnectionQuality.Lost:
        return 'Lost'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      {getQualityIcon()}
      <span className="text-slate-400">Connection: {getQualityText()}</span>
    </div>
  )
}

function CallControls({
  isMicrophoneEnabled,
  onToggleMicrophone,
  showChat,
  onToggleChat,
  onEndCall,
}: {
  isMicrophoneEnabled: boolean
  onToggleMicrophone: () => void
  showChat: boolean
  onToggleChat: () => void
  onEndCall: () => void
}) {
  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onToggleMicrophone}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            !isMicrophoneEnabled
              ? 'bg-red-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          title={isMicrophoneEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {!isMicrophoneEnabled ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={onToggleChat}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            showChat
              ? 'bg-teal-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          title="Toggle chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          onClick={onEndCall}
          className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          title="End call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function ChatSidebar({
  connectionState,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
}: {
  connectionState: ConnectionState
  messages: Message[]
  newMessage: string
  setNewMessage: (value: string) => void
  onSendMessage: () => void
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="lg:col-span-1">
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 h-[600px] flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat Support
          </h3>
        </div>

        {connectionState === ConnectionState.Connected ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  onClick={onSendMessage}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a call to chat with support</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CallCenterIdle({
  callState,
  errorMessage,
  onStartCall,
  showChat,
}: {
  callState: CallState
  errorMessage: string
  onStartCall: () => void
  showChat: boolean
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Call Area */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
            {callState === 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Phone className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Connect</h2>
                <p className="text-slate-400 mb-6 max-w-md">
                  Start a call with our AI support assistant for instant help with your questions.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStartCall}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-shadow"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    Start Support Call
                  </span>
                </motion.button>
              </motion.div>
            )}

            {callState === 'connecting' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-lg">Connecting to support...</p>
              </motion.div>
            )}

            {callState === 'ended' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-white text-lg">Call Ended</p>
                <p className="text-slate-400 text-sm">Thank you for contacting support</p>
              </motion.div>
            )}

            {callState === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-white text-lg">Connection Failed</p>
                <p className="text-slate-400 text-sm mb-4">{errorMessage}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStartCall}
                  className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar - Empty state */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat Support
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a call to chat with support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HelpCards() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: HelpCircle,
          title: 'Common Questions',
          description:
            'Get answers to frequently asked questions about partnerships and pricing.',
        },
        {
          icon: Monitor,
          title: 'Screen Sharing',
          description: 'Share your screen for technical help with integration or setup.',
        },
        {
          icon: Users,
          title: 'Human Support',
          description: 'Request to speak with a human agent for complex issues.',
        },
      ].map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
            <card.icon className="w-5 h-5 text-teal-500" />
          </div>
          <h3 className="font-semibold text-white mb-2">{card.title}</h3>
          <p className="text-sm text-slate-400">{card.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
