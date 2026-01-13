'use client'

import { useState, useEffect } from 'react'
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
  Minimize2,
  Maximize2,
  X,
} from 'lucide-react'

type CallState = 'idle' | 'connecting' | 'connected' | 'ended'

export default function CallCenterPage() {
  const [callState, setCallState] = useState<CallState>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'agent'; timestamp: Date }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(false)

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartCall = () => {
    setCallState('connecting')
    setTimeout(() => {
      setCallState('connected')
      setMessages([
        {
          id: '1',
          text: 'Hello! I\'m your AI support assistant. How can I help you today?',
          sender: 'agent',
          timestamp: new Date(),
        },
      ])
    }, 2000)
  }

  const handleEndCall = () => {
    setCallState('ended')
    setCallDuration(0)
    setIsScreenSharing(false)
    setTimeout(() => setCallState('idle'), 3000)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newMessage, sender: 'user', timestamp: new Date() },
    ])
    setNewMessage('')

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'I understand your question. Let me help you with that. Our partnership program offers...',
          sender: 'agent',
          timestamp: new Date(),
        },
      ])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
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
            {callState === 'connected' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Call Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              {/* Video/Call Area */}
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
                      onClick={handleStartCall}
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

                {callState === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {isScreenSharing ? (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <div className="text-center">
                          <Monitor className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                          <p className="text-white text-lg">Screen sharing active</p>
                          <p className="text-slate-400 text-sm">Your screen is being shared with support</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <Headphones className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-white text-xl font-semibold">AI Support Assistant</p>
                        <p className="text-green-400 text-sm mt-1">Connected</p>
                      </div>
                    )}
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
              </div>

              {/* Controls */}
              {callState === 'connected' && (
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isVideoOn ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isScreenSharing ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isScreenSharing ? <Monitor className="w-5 h-5" /> : <MonitorOff className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        !isSpeakerOn ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setShowChat(!showChat)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        showChat ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleEndCall}
                      className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 h-[600px] flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat Support
                </h3>
              </div>

              {callState === 'connected' ? (
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
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
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
        </div>

        {/* Help Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: HelpCircle,
              title: 'Common Questions',
              description: 'Get answers to frequently asked questions about partnerships and pricing.',
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
      </div>
    </div>
  )
}
