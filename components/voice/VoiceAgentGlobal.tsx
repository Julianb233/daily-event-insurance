"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, X, MessageCircle, Sparkles } from 'lucide-react'
import { ElevenLabsWebSocket, AudioRecorder } from '@/lib/voice/elevenlabs-websocket'
import { useVoiceAgent } from '@/lib/voice/voice-context'
import { getContextualStarters, getContextualQuickActions } from '@/lib/voice/context-prompts'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
type ErrorType = 'microphone' | 'speech_recognition' | 'network' | 'unknown'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function VoiceAgentGlobal() {
  const { context, isOpen, openVoiceAgent, closeVoiceAgent } = useVoiceAgent()

  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [inputVolume, setInputVolume] = useState(0)
  const [outputVolume, setOutputVolume] = useState(0)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const elevenLabsRef = useRef<ElevenLabsWebSocket | null>(null)
  const recorderRef = useRef<AudioRecorder | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Get context-aware quick actions
  const quickActions = getContextualQuickActions(context)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (status === 'disconnected') {
          closeVoiceAgent()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, status, closeVoiceAgent])

  // Scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported')
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = async (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcriptText = result[0].transcript

      if (result.isFinal && transcriptText.trim()) {
        setTranscript(prev => [...prev, `You: ${transcriptText}`])
        await handleUserMessage(transcriptText)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setErrorType('microphone')
        setStatus('error')
      } else if (event.error === 'no-speech') {
        // Ignore no-speech errors, just continue listening
      } else if (event.error === 'network') {
        setErrorType('network')
        setStatus('error')
      } else {
        setErrorType('speech_recognition')
        setStatus('error')
      }
    }

    return recognition
  }, [])

  // Handle user message and get AI response
  const handleUserMessage = async (userMessage: string) => {
    setIsProcessing(true)

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ]
    setMessages(newMessages)

    try {
      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context, // Send full context to API
          conversationId,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      setConversationId(data.conversationId)
      setMessages([...newMessages, { role: 'assistant', content: data.response }])
      setTranscript(prev => [...prev, `Specialist: ${data.response}`])

      // Speak the response
      if (elevenLabsRef.current?.isConnected() && !isSpeakerMuted) {
        elevenLabsRef.current.sendText(data.response)
        elevenLabsRef.current.endStream()
      }
    } catch (error) {
      console.error('Error getting response:', error)
      setTranscript(prev => [...prev, 'System: Sorry, I had trouble processing that. Please try again.'])
    } finally {
      setIsProcessing(false)
    }
  }

  // Start voice conversation
  const startConversation = async () => {
    setStatus('connecting')

    try {
      // Initialize ElevenLabs WebSocket
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
      const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'

      if (apiKey) {
        elevenLabsRef.current = new ElevenLabsWebSocket(
          {
            apiKey,
            voiceId,
            modelId: 'eleven_turbo_v2_5',
          },
          {
            onAudioChunk: () => {
              setOutputVolume(Math.random() * 0.5 + 0.5)
              setTimeout(() => setOutputVolume(0), 100)
            },
            onError: (error) => console.error('ElevenLabs error:', error),
            onClose: () => console.log('ElevenLabs connection closed'),
            onOpen: () => console.log('ElevenLabs connected'),
          }
        )
        await elevenLabsRef.current.connect()
      }

      // Initialize speech recognition
      recognitionRef.current = initSpeechRecognition()
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }

      // Initialize audio recorder for volume visualization
      recorderRef.current = new AudioRecorder(
        () => {},
        (volume) => setInputVolume(volume)
      )
      await recorderRef.current.start()

      setStatus('connected')

      // Send context-aware greeting
      const starters = getContextualStarters(context)
      const greeting = starters[Math.floor(Math.random() * starters.length)]
      setMessages([{ role: 'assistant', content: greeting }])
      setTranscript([`Specialist: ${greeting}`])

      if (elevenLabsRef.current?.isConnected() && apiKey) {
        elevenLabsRef.current.sendText(greeting)
        elevenLabsRef.current.endStream()
      }
    } catch (error: any) {
      console.error('Error starting conversation:', error)
      // Determine error type based on error message or name
      if (error?.name === 'NotAllowedError' || error?.message?.includes('Permission denied')) {
        setErrorType('microphone')
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        setErrorType('network')
      } else {
        setErrorType('unknown')
      }
      setStatus('error')
    }
  }

  // End voice conversation
  const endConversation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (recorderRef.current) {
      recorderRef.current.stop()
      recorderRef.current = null
    }
    if (elevenLabsRef.current) {
      elevenLabsRef.current.disconnect()
      elevenLabsRef.current = null
    }

    setStatus('disconnected')
    setInputVolume(0)
    setOutputVolume(0)
  }

  // Toggle mute
  const toggleMute = () => {
    if (recognitionRef.current) {
      if (isMuted) {
        recognitionRef.current.start()
        recorderRef.current?.resume()
      } else {
        recognitionRef.current.stop()
        recorderRef.current?.pause()
      }
    }
    setIsMuted(!isMuted)
  }

  // Handle quick action click
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
    setTranscript(prev => [...prev, `You: ${message}`])
    await handleUserMessage(message)
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-white shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all"
        onClick={openVoiceAgent}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: "0 10px 30px rgba(20, 184, 166, 0.3)" }}
      >
        <div className="relative">
          {/* Woman avatar icon */}
          <div className="h-10 w-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border-2 border-white/40">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              <circle cx="18" cy="18" r="18" fill="#FDB797"/>
              <path d="M18 28c-4.418 0-8-1.79-8-4v-2c0-2.21 3.582-4 8-4s8 1.79 8 4v2c0 2.21-3.582 4-8 4z" fill="#5C913B"/>
              <circle cx="18" cy="12" r="7" fill="#FDB797"/>
              <path d="M12 8c0-3 2-6 6-6s6 3 6 6c0 1-0.5 2-1 2.5C22 9 20 8 18 8s-4 1-5 2.5c-0.5-0.5-1-1.5-1-2.5z" fill="#3A2415"/>
              <ellipse cx="14.5" cy="12" rx="1" ry="1.5" fill="#1A1A1A"/>
              <ellipse cx="21.5" cy="12" rx="1" ry="1.5" fill="#1A1A1A"/>
              <path d="M16 15c0.5 0.5 1.5 0.5 2 0.5s1.5 0 2-0.5" stroke="#1A1A1A" strokeWidth="0.5" fill="none"/>
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
          </span>
        </div>
        <span className="font-semibold text-lg">{getButtonText()}</span>
      </motion.button>

      {/* Voice Agent Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/40">
                        <svg viewBox="0 0 36 36" className="h-full w-full">
                          <circle cx="18" cy="18" r="18" fill="#FDB797"/>
                          <path d="M18 28c-4.418 0-8-1.79-8-4v-2c0-2.21 3.582-4 8-4s8 1.79 8 4v2c0 2.21-3.582 4-8 4z" fill="#5C913B"/>
                          <circle cx="18" cy="12" r="7" fill="#FDB797"/>
                          <path d="M12 8c0-3 2-6 6-6s6 3 6 6c0 1-0.5 2-1 2.5C22 9 20 8 18 8s-4 1-5 2.5c-0.5-0.5-1-1.5-1-2.5z" fill="#3A2415"/>
                          <ellipse cx="14.5" cy="12" rx="1" ry="1.5" fill="#1A1A1A"/>
                          <ellipse cx="21.5" cy="12" rx="1" ry="1.5" fill="#1A1A1A"/>
                          <path d="M16 15c0.5 0.5 1.5 0.5 2 0.5s1.5 0 2-0.5" stroke="#1A1A1A" strokeWidth="0.5" fill="none"/>
                        </svg>
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
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white text-gray-500 mr-8 p-3 rounded-lg shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex gap-1">
                            <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                          Thinking...
                        </span>
                      </motion.div>
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                )}
              </div>

              {/* Quick Actions - shown when connected */}
              {status === 'connected' && !isProcessing && (
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
                        setMessages([])
                        setConversationId(null)
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
                <div className="px-6 py-4 bg-red-50 text-red-700 text-sm">
                  <div className="font-medium mb-1">
                    {errorType === 'microphone' && 'Microphone Access Required'}
                    {errorType === 'speech_recognition' && 'Speech Recognition Error'}
                    {errorType === 'network' && 'Network Connection Error'}
                    {errorType === 'unknown' && 'Connection Error'}
                    {!errorType && 'Connection Error'}
                  </div>
                  <div className="text-red-600">
                    {errorType === 'microphone' && (
                      <>
                        Please allow microphone access to use voice chat.
                        <button
                          onClick={() => {
                            setStatus('disconnected')
                            setErrorType(null)
                            startConversation()
                          }}
                          className="ml-2 underline hover:no-underline"
                        >
                          Try again
                        </button>
                      </>
                    )}
                    {errorType === 'speech_recognition' && 'Your browser may not support speech recognition. Try Chrome or Edge.'}
                    {errorType === 'network' && 'Please check your internet connection and try again.'}
                    {errorType === 'unknown' && 'Something went wrong. Please refresh the page and try again.'}
                    {!errorType && 'Could not connect. Please try again.'}
                  </div>
                </div>
              )}
            </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
