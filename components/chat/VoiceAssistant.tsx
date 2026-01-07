'use client'

import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    useLocalParticipant,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Track, RoomEvent, LocalTrackPublication, LocalAudioTrack } from 'livekit-client'
import { useEffect, useState, useRef } from 'react'
import { Loader2, PhoneOff, Mic, MicOff } from 'lucide-react'
import hark from 'hark'

interface VoiceAssistantProps {
    onDisconnect: () => void
    agentName: string
}

function InnerVoiceAssistant({ onDisconnect, agentName }: VoiceAssistantProps) {
    const { localParticipant } = useLocalParticipant()
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [agentState, setAgentState] = useState<'listening' | 'thinking' | 'speaking'>('listening')

    // Audio handling refs
    const audioContextRef = useRef<AudioContext | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)

    // Set up Hark for VAD (Voice Activity Detection)
    useEffect(() => {
        let speechEvents: any = null

        const setupVAD = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                mediaStreamRef.current = stream
                speechEvents = hark(stream, { threshold: -50, interval: 100 })

                speechEvents.on('speaking', () => {
                    console.log('User speaking...')
                    setIsSpeaking(true)
                })

                speechEvents.on('stopped_speaking', () => {
                    console.log('User stopped speaking')
                    setIsSpeaking(false)
                    // handleSpeechStopped(stream) // This is now handled by MediaRecorder's onstop
                })
            } catch (e) {
                console.error("Failed to init VAD", e)
            }
        }

        setupVAD()

        return () => {
            if (speechEvents) speechEvents.stop()
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(t => t.stop())
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // --- REVISED ARCHITECTURE FOR SERVERLESS ---
    // Since we can't reliably "stream" to a nonexistent worker:
    // We will run the "Agent" loop HERE in the component.

    const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
    const [chunks, setChunks] = useState<Blob[]>([])
    // Persistence ID
    const [conversationId, setConversationId] = useState<string | null>(null)

    useEffect(() => {
        // Load ID from localStorage on mount
        const storedId = localStorage.getItem('dei_ai_conversation_id')
        if (storedId) setConversationId(storedId)

        if (!mediaStreamRef.current) return

        const rec = new MediaRecorder(mediaStreamRef.current)

        rec.ondataavailable = (e) => {
            if (e.data.size > 0) setChunks(prev => [...prev, e.data])
        }

        rec.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/webm' })
            setChunks([]) // clear
            await processAudio(blob)
        }

        setRecorder(rec)
    }, [mediaStreamRef.current]) // eslint-disable-line

    useEffect(() => {
        if (!recorder) return

        if (isSpeaking && recorder.state === 'inactive') {
            recorder.start()
        } else if (!isSpeaking && recorder.state === 'recording') {
            recorder.stop()
        }
    }, [isSpeaking, recorder])

    const processAudio = async (blob: Blob) => {
        if (agentState !== 'listening') return

        // Ignore tiny blips
        if (blob.size < 1000) return

        setAgentState('thinking')
        try {
            // 1. Transcribe
            const formData = new FormData()
            formData.append('file', blob)
            const tRes = await fetch('/api/voice/transcribe', { method: 'POST', body: formData })
            const tData = await tRes.json()

            if (!tData.text || tData.text.length < 2) {
                setAgentState('listening')
                return
            }

            // 2. Chat Response
            const cRes = await fetch('/api/chatbot/chat', {
                method: 'POST',
                // Pass conversationId to maintain context
                body: JSON.stringify({
                    message: tData.text,
                    agentType: 'support',
                    conversationId: conversationId
                })
            })
            const cData = await cRes.json()
            const reply = cData.response

            // Save new conversation ID if created
            if (cData.conversationId && cData.conversationId !== conversationId) {
                setConversationId(cData.conversationId)
                localStorage.setItem('dei_ai_conversation_id', cData.conversationId)
            }

            // 3. Synthesize
            setAgentState('speaking')
            const sRes = await fetch('/api/voice/synthesize', {
                method: 'POST',
                body: JSON.stringify({ text: reply })
            })
            const audioBlob = await sRes.blob()
            const audio = new Audio(URL.createObjectURL(audioBlob))

            audio.onended = () => {
                setAgentState('listening')
            }
            await audio.play()

        } catch (e) {
            console.error(e)
            setAgentState('listening')
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white">
            {/* Visualizer */}
            <div className="relative mb-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${agentState === 'listening' ? 'bg-blue-100' :
                    agentState === 'thinking' ? 'bg-purple-100 animate-pulse' :
                        'bg-green-100 shadow-[0_0_40px_rgba(34,197,94,0.4)]'
                    }`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${agentState === 'listening' ? 'bg-blue-500' :
                        agentState === 'thinking' ? 'bg-purple-500' : 'bg-green-500'
                        }`}>
                        {agentState === 'thinking' ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                            <span className="text-3xl font-bold text-white">{agentName[0]}</span>
                        )}
                    </div>
                </div>

                {/* State Label */}
                <div className="absolute -bottom-10 left-0 right-0 text-center">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                        {agentState}
                    </span>
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                {isSpeaking && (
                    <div className="text-green-600 flex items-center justify-center gap-2">
                        <Mic className="w-4 h-4 animate-bounce" /> Listening to you...
                    </div>
                )}
            </div>
        </div>
    )
}

// Wrapper needed for Context?
// Actually for this "Serverless" mode, we don't strictly need the LiveKitRoom 
// IF we are just capturing local audio. 
// BUT, using LiveKitRoom gives us the nice "Connection" UI and potential for future expansion.
// However, to make the VAD component simpler, let's just use the LiveKitRoom to establish
// "Presence" but perform the AI loop in the component above.

export function VoiceAssistant({ onDisconnect, agentName }: VoiceAssistantProps) {
    const [token, setToken] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch('/api/livekit/token')
                const data = await resp.json()
                setToken(data.token)
            } catch (e) { console.error(e) }
        })()
    }, [])

    if (token === '') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500">Establishing secure connection...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            className="h-full flex flex-col"
            onDisconnected={onDisconnect}
        >
            <InnerVoiceAssistant onDisconnect={onDisconnect} agentName={agentName} />

            <div className="p-4 border-t bg-white flex justify-center gap-4">
                <button
                    onClick={onDisconnect}
                    className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm"
                    title="End Call"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </LiveKitRoom>
    )
}
