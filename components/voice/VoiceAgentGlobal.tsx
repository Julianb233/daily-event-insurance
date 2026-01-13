"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, X, MessageCircle, Sparkles } from 'lucide-react'
import { LiveKitVoiceClient } from '@/lib/voice/livekit-client'
import { useVoiceAgent } from '@/lib/voice/voice-context'
import { getContextualQuickActions } from '@/lib/voice/context-prompts'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function VoiceAgentGlobal() {
  const { context, isOpen, openVoiceAgent, closeVoiceAgent } = useVoiceAgent()

  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [inputVolume, setInputVolume] = useState(0)
  const [outputVolume, setOutputVolume] = useState(0)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)

  const liveKitClientRef = useRef<LiveKitVoiceClient | null>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Get context-aware quick actions
  const quickActions = getContextualQuickActions(context)

  // Scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  // Start voice conversation with LiveKit
  const startConversation = async () => {
    setStatus('connecting')

    try {
      // Get LiveKit token from API
      const response = await fetch('/api/voice/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          userId: `user-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get voice session token')
      }

      const { token, url } = await response.json()

      // Initialize LiveKit client
      liveKitClientRef.current = new LiveKitVoiceClient(
        { url, token },
        {
          onConnected: () => {
            setStatus('connected')
            setTranscript(['Connecting to AI Specialist...'])
          },
          onDisconnected: () => {
            setStatus('disconnected')
            setInputVolume(0)
            setOutputVolume(0)
          },
          onError: (error) => {
            console.error('LiveKit error:', error)
            setStatus('error')
          },
          onTranscript: (text, role) => {
            const prefix = role === 'user' ? 'You' : 'Specialist'
            setTranscript(prev => [...prev, `${prefix}: ${text}`])
          },
          onSpeaking: (speaking) => {
            setIsAgentSpeaking(speaking)
            if (speaking) {
              setOutputVolume(0.7)
            } else {
              setOutputVolume(0)
            }
          },
          onAudioLevel: (level) => {
            setInputVolume(level)
          },
        }
      )

      await liveKitClientRef.current.connect()

      // Clear initial connecting message once agent greets
      setTimeout(() => {
        setTranscript(prev => prev.filter(t => t !== 'Connecting to AI Specialist...'))
      }, 2000)

    } catch (error) {
      console.error('Error starting conversation:', error)
      setStatus('error')
    }
  }

  // End voice conversation
  const endConversation = () => {
    if (liveKitClientRef.current) {
      liveKitClientRef.current.disconnect()
      liveKitClientRef.current = null
    }

    setStatus('disconnected')
    setInputVolume(0)
    setOutputVolume(0)
    setIsAgentSpeaking(false)
  }

  // Toggle mute
  const toggleMute = () => {
    if (liveKitClientRef.current) {
      if (isMuted) {
        liveKitClientRef.current.unmute()
      } else {
        liveKitClientRef.current.mute()
      }
    }
    setIsMuted(!isMuted)
  }

  // Handle quick action - send as data message to agent
  const handleQuickAction = async (action: string) => {
    const actionMessages: Record<string, string> = {
      explain_current_step: `Can you help me understand what I need to do on this ${context.currentStepName || 'step'}?`,
      explain_next_steps: "What happens after I complete this step?",
      escalate: "I'd like to speak with a human representative.",
      earning_tips: "How can I increase my earnings?",
      tech_support: "I need technical help with integration.",
      explain_platform: "How does Daily Event Insurance work?",
      explain_commissions: "How much can I earn as a partner?",
      check_eligibility: "Is my business eligible to become a partner?",
      explain_pricing: "Can you explain the pricing and commission structure?",
      explain_integration: "How does the integration process work?",
      share_testimonials: "Can you share some success stories from other partners?",
      begin_onboarding: "I'm ready to start the application process.",
      schedule_call: "I'd like to schedule a call with someone.",
      answer_questions: "I have a few final questions before signing up.",
    }

    const message = actionMessages[action] || "Can you help me with this?"

    // Send the message to the agent via data channel
    if (liveKitClientRef.current?.isConnected()) {
      await liveKitClientRef.current.sendData({
        type: 'user_message',
        text: message,
      })
      setTranscript(prev => [...prev, `You: ${message}`])
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endConversation()
    }
  }, [])

  // Get screen-specific button text
  const getButtonText = () => {
    if (context.screenType.startsWith('onboarding')) {
      return 'Need Help?'
    }
    if (context.screenType.startsWith('partner-')) {
      return 'Get Support'
    }
    return "Let's Talk"
  }

  // Get context indicator
  const getContextIndicator = () => {
    if (context.screenType.startsWith('onboarding') && context.currentStepName) {
      return `Helping with: ${context.currentStepName}`
    }
    if (context.screenName && context.screenName !== 'Unknown Page') {
      return `On: ${context.screenName}`
    }
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 text-white shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all"
        onClick={openVoiceAgent}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: "0 10px 30px rgba(20, 184, 166, 0.3)" }}
      >
        <div className="relative">
          <Phone className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        </div>
        <span className="font-semibold text-lg">{getButtonText()}</span>
      </motion.button>

      {/* Voice Agent Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              if (status === 'disconnected') closeVoiceAgent()
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/support-avatar.jpg"
                          alt="Support specialist"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <MessageCircle className="h-6 w-6 hidden" />
                      </div>
                      {status === 'connected' && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">Let's Talk</h3>
                      <p className="text-sm text-white/80">
                        {status === 'disconnected' && 'AI-powered support ready'}
                        {status === 'connecting' && 'Connecting...'}
                        {status === 'connected' && 'Speaking with AI Specialist'}
                        {status === 'error' && 'Connection error'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      endConversation()
                      closeVoiceAgent()
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Context indicator */}
                {getContextIndicator() && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/70 bg-white/10 rounded-full px-3 py-1 w-fit">
                    <Sparkles className="h-3 w-3" />
                    {getContextIndicator()}
                  </div>
                )}
              </div>

              {/* Conversation Area */}
              <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                {transcript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Phone className="h-12 w-12 mb-3 text-gray-300" />
                    <p className="text-center">
                      Click &quot;Start Call&quot; to speak<br />
                      with our AI Specialist
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Get instant answers about our insurance platform
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transcript.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          line.startsWith('You:')
                            ? 'bg-teal-100 text-teal-900 ml-8'
                            : line.startsWith('System:')
                            ? 'bg-yellow-100 text-yellow-900 mx-4'
                            : 'bg-white text-gray-900 mr-8 shadow-sm'
                        }`}
                      >
                        {line}
                      </motion.div>
                    ))}
                    {isAgentSpeaking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white text-gray-500 mr-8 p-3 rounded-lg shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex gap-1">
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </span>
                          Speaking...
                        </span>
                      </motion.div>
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                )}
              </div>

              {/* Quick Actions - shown when connected */}
              {status === 'connected' && !isAgentSpeaking && (
                <div className="px-4 py-2 bg-white border-t flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Visualization */}
              {status === 'connected' && (
                <div className="px-6 py-3 bg-white border-t">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <Mic className={`h-4 w-4 ${isMuted ? 'text-gray-400' : 'text-teal-500'}`} />
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-teal-500 rounded-full"
                          animate={{ width: isMuted ? '0%' : `${inputVolume * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className={`h-4 w-4 ${isSpeakerMuted ? 'text-gray-400' : 'text-blue-500'}`} />
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500 rounded-full"
                          animate={{ width: isSpeakerMuted ? '0%' : `${outputVolume * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="px-6 py-4 bg-white border-t flex items-center justify-center gap-4">
                {status === 'disconnected' ? (
                  <button
                    onClick={startConversation}
                    className="flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Start Call
                  </button>
                ) : status === 'connecting' ? (
                  <button disabled className="flex items-center justify-center bg-gray-400 text-white px-8 py-4 rounded-full text-lg font-semibold cursor-not-allowed">
                    <span className="animate-spin mr-2">
                      <Phone className="h-5 w-5" />
                    </span>
                    Connecting...
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleMute}
                      className={`flex items-center justify-center rounded-full h-14 w-14 transition-colors ${
                        isMuted
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'border-2 border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={() => {
                        endConversation()
                        setTranscript([])
                      }}
                      className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full h-14 w-14 transition-colors"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                      className={`flex items-center justify-center rounded-full h-14 w-14 transition-colors ${
                        isSpeakerMuted
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'border-2 border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isSpeakerMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </>
                )}
              </div>

              {/* Status Bar */}
              {status === 'error' && (
                <div className="px-6 py-3 bg-red-50 text-red-600 text-sm text-center">
                  Could not connect. Please check your microphone permissions and try again.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
