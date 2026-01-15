"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Phone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Building2,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
  Play,
  Pause,
  Volume2,
  Download,
  ChevronDown,
  Check,
  X,
  Send,
  Mic,
  MicOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Voicemail,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  MessageCircle,
  Edit,
  MoreVertical,
  RefreshCw,
} from "lucide-react"
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react"
import { ConnectionState } from "livekit-client"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string | null
  businessType: string | null
  estimatedParticipants: number | null
  status: string
  statusReason: string | null
  interestLevel: string
  interestScore: number
  source: string
  initialValue: string
  convertedValue: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  timezone: string | null
  assignedAgentId: string | null
  lastActivityAt: string | null
  convertedAt: string | null
  createdAt: string
  updatedAt: string
  communications: Communication[]
}

interface Communication {
  id: string
  leadId: string
  channel: "call" | "sms" | "email"
  direction: "inbound" | "outbound"
  callDuration: number | null
  callRecordingUrl: string | null
  callTranscript: string | null
  callSummary: string | null
  smsContent: string | null
  smsStatus: string | null
  disposition: string | null
  nextFollowUpAt: string | null
  agentId: string | null
  agentScriptUsed: string | null
  outcome: string | null
  livekitRoomId: string | null
  createdAt: string
}

interface AgentScript {
  id: string
  name: string
  businessType: string | null
  interestLevel: string | null
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: "New", color: "text-blue-700", bgColor: "bg-blue-100" },
  contacted: { label: "Contacted", color: "text-purple-700", bgColor: "bg-purple-100" },
  qualified: { label: "Qualified", color: "text-teal-700", bgColor: "bg-teal-100" },
  demo_scheduled: { label: "Demo Scheduled", color: "text-amber-700", bgColor: "bg-amber-100" },
  proposal_sent: { label: "Proposal Sent", color: "text-orange-700", bgColor: "bg-orange-100" },
  converted: { label: "Converted", color: "text-green-700", bgColor: "bg-green-100" },
  lost: { label: "Lost", color: "text-slate-700", bgColor: "bg-slate-100" },
  dnc: { label: "Do Not Contact", color: "text-red-700", bgColor: "bg-red-100" },
}

const interestConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Flame }> = {
  hot: { label: "Hot", color: "text-red-700", bgColor: "bg-red-100", icon: Flame },
  warm: { label: "Warm", color: "text-amber-700", bgColor: "bg-amber-100", icon: Thermometer },
  cold: { label: "Cold", color: "text-blue-700", bgColor: "bg-blue-100", icon: Snowflake },
}

const dispositionConfig: Record<string, { label: string; icon: typeof Phone }> = {
  reached: { label: "Reached", icon: PhoneCall },
  voicemail: { label: "Voicemail", icon: Voicemail },
  no_answer: { label: "No Answer", icon: PhoneMissed },
  busy: { label: "Busy", icon: Phone },
  callback_requested: { label: "Callback Requested", icon: PhoneIncoming },
  not_interested: { label: "Not Interested", icon: X },
  dnc: { label: "Do Not Call", icon: PhoneOff },
  initiated: { label: "Initiated", icon: PhoneOutgoing },
}

function formatCurrency(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Audio Player Component
function AudioPlayer({ src, duration }: { src: string; duration: number | null }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration || 0)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setAudioDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const changePlaybackRate = () => {
    const rates = [1, 1.5, 2, 0.5]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    setPlaybackRate(nextRate)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center hover:bg-violet-600 transition-colors"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={audioDuration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(audioDuration))}</span>
        </div>
      </div>

      <button
        onClick={changePlaybackRate}
        className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
      >
        {playbackRate}x
      </button>

      <a
        href={src}
        download
        className="p-1.5 text-slate-500 hover:text-violet-600 transition-colors"
        title="Download recording"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  )
}

// SMS Modal Component
function SMSModal({
  isOpen,
  onClose,
  leadId,
  leadPhone,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  leadId: string
  leadPhone: string
  onSuccess: () => void
}) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  const templates = [
    { id: "outreach", label: "Initial Outreach", text: "Hi! This is Daily Event Insurance. We'd love to discuss how our partnership program can help grow your business. When's a good time to chat?" },
    { id: "followup", label: "Follow-up", text: "Hi! Just following up on our conversation about Daily Event Insurance. Do you have any questions I can answer?" },
    { id: "demo", label: "Demo Confirmation", text: "Looking forward to showing you our platform! Please confirm you're available for our scheduled demo." },
    { id: "thanks", label: "Thank You", text: "Thank you for your interest in Daily Event Insurance! We're excited to have you as a partner." },
  ]

  const handleSend = async () => {
    if (!message.trim()) return
    setIsSending(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to send SMS")
      }

      onSuccess()
      onClose()
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send SMS")
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Send SMS</h2>
          <p className="text-sm text-slate-500 mt-1">To: {leadPhone}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setMessage(template.text)}
                  className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-violet-100 hover:text-violet-700 transition-colors"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              maxLength={1600}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none resize-none"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{message.length}/1600 characters</span>
              <span>{Math.ceil(message.length / 160)} segment(s)</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send SMS
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Call Modal Component
function CallModal({
  isOpen,
  onClose,
  leadId,
  leadName,
  leadPhone,
  scripts,
  onCallEnd,
}: {
  isOpen: boolean
  onClose: () => void
  leadId: string
  leadName: string
  leadPhone: string
  scripts: AgentScript[]
  onCallEnd: () => void
}) {
  const [selectedScript, setSelectedScript] = useState<string>("")
  const [callState, setCallState] = useState<"idle" | "connecting" | "connected" | "ended" | "error">("idle")
  const [token, setToken] = useState("")
  const [roomUrl, setRoomUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [callState])

  const startCall = async () => {
    setCallState("connecting")
    setErrorMessage("")

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptId: selectedScript || undefined }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to initiate call")
      }

      const data = await response.json()

      // Get LiveKit token
      const tokenResponse = await fetch("/api/voice/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
            screenType: "lead-call",
            leadId,
            leadName,
            scriptId: selectedScript,
          },
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error("Failed to connect to voice service")
      }

      const tokenData = await tokenResponse.json()
      setToken(tokenData.token)
      setRoomUrl(tokenData.url)
    } catch (err) {
      setCallState("error")
      setErrorMessage(err instanceof Error ? err.message : "Failed to start call")
    }
  }

  const endCall = () => {
    setCallState("ended")
    setToken("")
    onCallEnd()
    setTimeout(() => {
      onClose()
      setCallState("idle")
      setCallDuration(0)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={callState === "idle" ? onClose : undefined} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        {callState === "idle" && (
          <>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Call {leadName}</h2>
              <p className="text-sm text-slate-400 mt-1">{leadPhone}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Script (Optional)
                </label>
                <select
                  value={selectedScript}
                  onChange={(e) => setSelectedScript(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                >
                  <option value="">No script (freeform)</option>
                  {scripts.map((script) => (
                    <option key={script.id} value={script.id}>
                      {script.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startCall}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Start Call
              </button>
            </div>
          </>
        )}

        {callState !== "idle" && (
          <div className="p-8">
            {token && roomUrl ? (
              <LiveKitRoom
                token={token}
                serverUrl={roomUrl}
                connect={true}
                audio={true}
                video={false}
                onConnected={() => setCallState("connected")}
                onDisconnected={endCall}
                onError={(err) => {
                  setCallState("error")
                  setErrorMessage(err.message)
                }}
              >
                <CallContent
                  callState={callState}
                  callDuration={callDuration}
                  leadName={leadName}
                  onEndCall={endCall}
                  errorMessage={errorMessage}
                />
                <RoomAudioRenderer />
              </LiveKitRoom>
            ) : (
              <CallContent
                callState={callState}
                callDuration={callDuration}
                leadName={leadName}
                onEndCall={endCall}
                errorMessage={errorMessage}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function CallContent({
  callState,
  callDuration,
  leadName,
  onEndCall,
  errorMessage,
}: {
  callState: string
  callDuration: number
  leadName: string
  onEndCall: () => void
  errorMessage: string
}) {
  const connectionState = useConnectionState()
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const { state: agentState, audioTrack } = useVoiceAssistant()

  const toggleMicrophone = () => {
    localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled)
  }

  return (
    <div className="text-center">
      {callState === "connecting" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Connecting to {leadName}...</p>
        </motion.div>
      )}

      {callState === "connected" && connectionState === ConnectionState.Connected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center relative">
              <Phone className="w-12 h-12 text-white" />
              {agentState === "speaking" && (
                <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-50" />
              )}
            </div>
            <p className="text-white text-xl font-semibold">{leadName}</p>
            <p className="text-green-400 text-sm mt-1">
              {agentState === "speaking" ? "Speaking..." : agentState === "listening" ? "Listening..." : "Connected"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-2xl font-mono text-white">
            <Clock className="w-5 h-5" />
            {formatDuration(callDuration)}
          </div>

          {audioTrack && (
            <div className="w-full max-w-md mx-auto h-16 bg-slate-800/50 rounded-xl p-4 flex items-center justify-center">
              <BarVisualizer
                state={agentState}
                barCount={7}
                trackRef={audioTrack}
                className="h-full w-full"
                options={{ minHeight: 10 }}
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={toggleMicrophone}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                !isMicrophoneEnabled ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {!isMicrophoneEnabled ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={onEndCall}
              className="w-16 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      )}

      {callState === "ended" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-white text-lg">Call Ended</p>
          <p className="text-slate-400 text-sm">Duration: {formatDuration(callDuration)}</p>
        </motion.div>
      )}

      {callState === "error" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-white text-lg">Connection Failed</p>
          <p className="text-slate-400 text-sm">{errorMessage}</p>
          <button
            onClick={onEndCall}
            className="mt-4 px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Communication Timeline Item
function TimelineItem({ communication }: { communication: Communication }) {
  const [expanded, setExpanded] = useState(false)

  const getChannelIcon = () => {
    switch (communication.channel) {
      case "call":
        return communication.direction === "inbound" ? PhoneIncoming : PhoneOutgoing
      case "sms":
        return MessageCircle
      case "email":
        return Mail
      default:
        return MessageSquare
    }
  }

  const getChannelColor = () => {
    switch (communication.channel) {
      case "call":
        return "bg-green-100 text-green-700"
      case "sms":
        return "bg-blue-100 text-blue-700"
      case "email":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const Icon = getChannelIcon()
  const dispositionInfo = communication.disposition ? dispositionConfig[communication.disposition] : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-8 pb-6 border-l-2 border-slate-200 last:border-transparent"
    >
      <div className={`absolute -left-3 w-6 h-6 rounded-full ${getChannelColor()} flex items-center justify-center`}>
        <Icon className="w-3 h-3" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-900 capitalize">
                {communication.direction} {communication.channel}
              </span>
              {dispositionInfo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
                  <dispositionInfo.icon className="w-3 h-3" />
                  {dispositionInfo.label}
                </span>
              )}
              {communication.outcome && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    communication.outcome === "positive"
                      ? "bg-green-100 text-green-700"
                      : communication.outcome === "negative"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {communication.outcome}
                </span>
              )}
            </div>

            {communication.channel === "call" && communication.callDuration && (
              <p className="text-sm text-slate-500 mt-1">
                Duration: {formatDuration(communication.callDuration)}
              </p>
            )}

            {communication.channel === "sms" && communication.smsContent && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{communication.smsContent}</p>
            )}

            {communication.callSummary && (
              <p className="text-sm text-slate-600 mt-2">{communication.callSummary}</p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-sm text-slate-500">{getRelativeTime(communication.createdAt)}</p>
            <p className="text-xs text-slate-400">{formatDateTime(communication.createdAt)}</p>
          </div>
        </div>

        {communication.callRecordingUrl && (
          <div className="mt-4">
            <AudioPlayer src={communication.callRecordingUrl} duration={communication.callDuration} />
          </div>
        )}

        {(communication.callTranscript || communication.agentScriptUsed) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            {expanded ? "Hide details" : "Show details"}
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                {communication.agentScriptUsed && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Script:</span> {communication.agentScriptUsed}
                  </p>
                )}
                {communication.callTranscript && (
                  <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {communication.callTranscript}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Status Dropdown
function StatusDropdown({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: string
  onStatusChange: (status: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const current = statusConfig[currentStatus] || { label: currentStatus, color: "text-slate-700", bgColor: "bg-slate-100" }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${current.bgColor} ${current.color}`}
      >
        {current.label}
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 min-w-[180px]"
            >
              {Object.entries(statusConfig).map(([value, config]) => (
                <button
                  key={value}
                  onClick={() => {
                    onStatusChange(value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between ${
                    value === currentStatus ? "bg-slate-50" : ""
                  }`}
                >
                  <span className={`inline-flex items-center gap-2 ${config.color}`}>
                    {config.label}
                  </span>
                  {value === currentStatus && <Check className="w-4 h-4 text-violet-500" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Page Component
export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [scripts, setScripts] = useState<AgentScript[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCallModal, setShowCallModal] = useState(false)
  const [showSMSModal, setShowSMSModal] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`)
      if (!response.ok) throw new Error("Failed to fetch lead")
      const result = await response.json()
      setLead(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead")
    } finally {
      setIsLoading(false)
    }
  }, [leadId])

  const fetchScripts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/scripts")
      if (response.ok) {
        const result = await response.json()
        setScripts(result.data || [])
      }
    } catch {
      // Scripts are optional
    }
  }, [])

  useEffect(() => {
    fetchLead()
    fetchScripts()
  }, [fetchLead, fetchScripts])

  const updateStatus = async (newStatus: string) => {
    if (!lead) return

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setLead({ ...lead, status: newStatus })
      }
    } catch {
      // Handle error silently
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-48 bg-slate-200 rounded-xl" />
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lead Not Found</h2>
          <p className="text-slate-600 mb-4">{error || "The requested lead could not be found."}</p>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </Link>
        </div>
      </div>
    )
  }

  const interestInfo = interestConfig[lead.interestLevel] || interestConfig.warm
  const InterestIcon = interestInfo.icon

  const stats = {
    totalCalls: lead.communications.filter((c) => c.channel === "call").length,
    totalSMS: lead.communications.filter((c) => c.channel === "sms").length,
    totalEmails: lead.communications.filter((c) => c.channel === "email").length,
    daysSinceCreated: Math.floor(
      (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin/leads"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-slate-600">{lead.businessName || lead.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSMSModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Send SMS
          </button>
          <button
            onClick={() => setShowCallModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Status & Interest */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Status
            </h3>
            <div className="flex items-center gap-3">
              <StatusDropdown currentStatus={lead.status} onStatusChange={updateStatus} />
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${interestInfo.bgColor} ${interestInfo.color}`}
              >
                <InterestIcon className="w-4 h-4" />
                {interestInfo.label}
              </span>
            </div>
            {lead.interestScore > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Interest Score</span>
                  <span className="font-medium">{lead.interestScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                    style={{ width: `${lead.interestScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-sm text-violet-600 hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <a href={`tel:${lead.phone}`} className="text-sm text-violet-600 hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>
              {lead.businessName && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Business</p>
                    <p className="text-sm text-slate-900">{lead.businessName}</p>
                    {lead.businessType && (
                      <p className="text-xs text-slate-500 capitalize">{lead.businessType}</p>
                    )}
                  </div>
                </div>
              )}
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm text-slate-900">
                      {[lead.city, lead.state, lead.zipCode].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Value */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Lead Value
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(lead.convertedValue || lead.initialValue)}
                </p>
                {lead.convertedValue && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Converted from {formatCurrency(lead.initialValue)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Activity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.totalCalls}</p>
                <p className="text-xs text-slate-500">Calls</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.totalSMS}</p>
                <p className="text-xs text-slate-500">SMS</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.totalEmails}</p>
                <p className="text-xs text-slate-500">Emails</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{stats.daysSinceCreated}</p>
                <p className="text-xs text-slate-500">Days</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-900">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-500">Last Activity</span>
                <span className="text-slate-900">{formatDate(lead.lastActivityAt)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Communication Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Communication History</h3>
              <button
                onClick={fetchLead}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {lead.communications.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No communications yet</p>
                <p className="text-sm text-slate-500">Start by calling or sending an SMS to this lead</p>
              </div>
            ) : (
              <div className="space-y-0">
                {lead.communications
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((communication, index) => (
                    <TimelineItem key={communication.id} communication={communication} />
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCallModal && (
          <CallModal
            isOpen={showCallModal}
            onClose={() => setShowCallModal(false)}
            leadId={leadId}
            leadName={`${lead.firstName} ${lead.lastName}`}
            leadPhone={lead.phone}
            scripts={scripts}
            onCallEnd={fetchLead}
          />
        )}
        {showSMSModal && (
          <SMSModal
            isOpen={showSMSModal}
            onClose={() => setShowSMSModal(false)}
            leadId={leadId}
            leadPhone={lead.phone}
            onSuccess={fetchLead}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
