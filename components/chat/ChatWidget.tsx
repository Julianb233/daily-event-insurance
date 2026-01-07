'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Minimize2, Maximize2, Loader2, Mic, Square, Volume2, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatWidgetProps, Message } from './types'
import { VoiceAssistant } from './VoiceAssistant'

export function ChatWidget({
  config,
  onSendMessage,
  onClose,
  isOpen = true,
  position = 'bottom-right',
  className
}: ChatWidgetProps) {
  // Mode State: 'chat' | 'voice-call'
  const [mode, setMode] = useState<'chat' | 'voice-call'>('chat')

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: config.welcomeMessage,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Voice Note State (Legacy)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  // const audioContextRef = useRef<AudioContext | null>(null) // Removed as per diff

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && !isMinimized && mode === 'chat') {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized, mode])

  // --- Voice Logic Start (Legacy "Push to Talk") ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await handleAudioUpload(audioBlob)
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please allow permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleAudioUpload = async (audioBlob: Blob) => {
    setIsProcessingAudio(true)
    try {
      const formData = new FormData()
      formData.append('file', audioBlob)

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Transcription failed')

      const data = await response.json()
      if (data.text) {
        setInput(data.text)
        // Optional: Auto-send after voice? 
        // For now, let user review text
      }
    } catch (error) {
      console.error('Transcription error:', error)
    } finally {
      setIsProcessingAudio(false)
      inputRef.current?.focus()
    }
  }

  const playResponseAudio = async (text: string) => {
    try {
      setIsPlayingAudio(true)
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error('TTS failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlayingAudio(false)
    }
  }

  // --- Voice Logic End ---

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Access persisted ID
    const storedId = localStorage.getItem('dei_ai_conversation_id')

    try {
      let responseText = ""

      if (onSendMessage) {
        responseText = await onSendMessage(input.trim());
        // ... legacy logic ...
      } else {
        const response = await fetch('/api/chatbot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content, // use the captured content 
            agentType: config.agentType,
            systemPrompt: config.systemPrompt,
            conversationId: storedId, // Send ID
            // conversationHistory is now optional as backend rebuilds it
            conversationHistory: messages.map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        });

        if (!response.ok) throw new Error('Failed to get response');

        const data = await response.json();

        // Save new ID if created
        if (data.conversationId) {
          localStorage.setItem('dei_ai_conversation_id', data.conversationId)
        }

        responseText = data.response || "I'm sorry, I couldn't process your request."
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Auto-play audio response
      // We start this asynchronously so text appears first
      playResponseAudio(responseText)

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment, or contact us at support@dailyeventinsurance.com",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300',
        positionClasses[position],
        isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem] max-h-[80vh]',
        className
      )}
      style={{
        '--chat-primary': config.primaryColor,
        '--chat-accent': config.accentColor
      } as React.CSSProperties}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
              {config.agentName[0]}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="font-semibold">{config.agentName}</div>
            <div className="text-xs text-white/80">{config.agentTitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPlayingAudio ? (
            <Volume2 className="w-4 h-4 animate-pulse text-white/80" />
          ) : null}

          {/* Start Call Button (Only in Chat Mode) */}
          {mode === 'chat' && (
            <button
              onClick={() => setMode('voice-call')}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Start Live Call"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && mode === 'voice-call' && (
        <VoiceAssistant
          onDisconnect={() => setMode('chat')}
          agentName={config.agentName}
        />
      )}

      {!isMinimized && mode === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    message.role === 'user'
                      ? 'bg-gray-800 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    message.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">{config.agentName} is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {isProcessingAudio && (
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-2xl rounded-br-md px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Processing voice...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && config.suggestedQuestions && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {config.suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "p-2.5 rounded-full transition-all flex-shrink-0",
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                )}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                disabled={isLoading || isProcessingAudio}
              >
                {isRecording ? <Square className="w-4 h-4" fill="currentColor" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "Listening..." : config.placeholderText}
                disabled={isLoading || isRecording || isProcessingAudio}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: config.primaryColor }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by Daily Event Insurance
            </p>
          </div>
        </>
      )}
    </div>
  )
}
