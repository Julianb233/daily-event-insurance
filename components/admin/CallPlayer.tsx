"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TranscriptEntry {
  time: number
  speaker: "agent" | "caller" | "system"
  text: string
}

interface CallPlayerProps {
  recordingUrl: string
  duration?: number
  transcript?: string
  callSummary?: string
  callerName?: string
  callDate?: string
  sentiment?: "positive" | "neutral" | "negative"
  className?: string
}

const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const
type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number]

const sentimentConfig = {
  positive: {
    label: "Positive",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  neutral: {
    label: "Neutral",
    bgColor: "bg-slate-100 dark:bg-slate-700",
    textColor: "text-slate-700 dark:text-slate-300",
    dotColor: "bg-slate-400",
  },
  negative: {
    label: "Negative",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-400",
    dotColor: "bg-red-500",
  },
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function CallPlayer({
  recordingUrl,
  duration: initialDuration,
  transcript,
  callSummary,
  callerName,
  callDate,
  sentiment,
  className,
}: CallPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showTranscript, setShowTranscript] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Parse transcript
  const transcriptEntries: TranscriptEntry[] = transcript
    ? (() => {
        try {
          return JSON.parse(transcript) as TranscriptEntry[]
        } catch {
          return []
        }
      })()
    : []

  // Audio event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      setIsLoading(false)
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [isDragging])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    setErrorMessage("Failed to load audio recording")
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Playback controls
  const togglePlay = useCallback(() => {
    if (!audioRef.current || hasError) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        setHasError(true)
        setErrorMessage("Unable to play audio")
      })
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, hasError])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !audioRef.current || hasError) return

      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, clickX / rect.width))
      const newTime = percentage * duration

      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration, hasError]
  )

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      handleSeek(e)
    },
    [handleSeek]
  )

  const handleProgressMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !progressRef.current || !audioRef.current) return

      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, clickX / rect.width))
      const newTime = percentage * duration

      setCurrentTime(newTime)
    },
    [isDragging, duration]
  )

  const handleProgressMouseUp = useCallback(() => {
    if (isDragging && audioRef.current) {
      audioRef.current.currentTime = currentTime
    }
    setIsDragging(false)
  }, [isDragging, currentTime])

  // Skip controls
  const skipForward = useCallback(() => {
    if (!audioRef.current) return
    const newTime = Math.min(audioRef.current.currentTime + 10, duration)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [duration])

  const skipBackward = useCallback(() => {
    if (!audioRef.current) return
    const newTime = Math.max(audioRef.current.currentTime - 10, 0)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  // Volume controls
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    const newMuted = !isMuted
    audioRef.current.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const newVolume = parseFloat(e.target.value)
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
      audioRef.current.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }, [isMuted])

  // Playback speed
  const cyclePlaybackSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length
    const newSpeed = PLAYBACK_SPEEDS[nextIndex]
    setPlaybackSpeed(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed
    }
  }, [playbackSpeed])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipBackward()
          break
        case "ArrowRight":
          e.preventDefault()
          skipForward()
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [togglePlay, skipForward, skipBackward, toggleMute])

  // Mouse drag handling
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleProgressMouseMove)
      document.addEventListener("mouseup", handleProgressMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleProgressMouseMove)
        document.removeEventListener("mouseup", handleProgressMouseUp)
      }
    }
  }, [isDragging, handleProgressMouseMove, handleProgressMouseUp])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const sentimentInfo = sentiment ? sentimentConfig[sentiment] : null

  // Find current transcript entry
  const currentTranscriptIndex = transcriptEntries.findIndex(
    (entry, index) => {
      const nextEntry = transcriptEntries[index + 1]
      return (
        currentTime >= entry.time &&
        (!nextEntry || currentTime < nextEntry.time)
      )
    }
  )

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden",
        className
      )}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={recordingUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={handleCanPlay}
        preload="metadata"
      />

      {/* Caller Info Header */}
      {(callerName || callDate || sentimentInfo) && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {callerName && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {callerName[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {callerName}
                    </p>
                    {callDate && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(callDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!callerName && callDate && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(callDate)}
                </div>
              )}
            </div>

            {sentimentInfo && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  sentimentInfo.bgColor,
                  sentimentInfo.textColor
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", sentimentInfo.dotColor)} />
                {sentimentInfo.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            <span className="ml-3 text-sm text-slate-600 dark:text-slate-400">
              Loading audio...
            </span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Unable to load recording
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Player Controls */}
        {!isLoading && !hasError && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div
                ref={progressRef}
                onClick={handleSeek}
                onMouseDown={handleProgressMouseDown}
                className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer group"
                role="slider"
                aria-label="Audio progress"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                tabIndex={0}
              >
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-200 rounded-full shadow-md border-2 border-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              {/* Left: Volume */}
              <div className="flex items-center gap-2 w-32">
                <button
                  onClick={toggleMute}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={skipBackward}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/25 transition-all"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Right: Playback Speed */}
              <div className="flex items-center justify-end w-32">
                <button
                  onClick={cyclePlaybackSpeed}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  aria-label={`Playback speed: ${playbackSpeed}x`}
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Sections */}
      {(callSummary || transcriptEntries.length > 0) && !hasError && (
        <div className="border-t border-slate-100 dark:border-slate-700">
          {/* Call Summary Toggle */}
          {callSummary && (
            <div>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-expanded={showSummary}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-500" />
                  Call Summary
                </span>
                {showSummary ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {showSummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {callSummary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Transcript Toggle */}
          {transcriptEntries.length > 0 && (
            <div className={callSummary ? "border-t border-slate-100 dark:border-slate-700" : ""}>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-expanded={showTranscript}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-500" />
                  Transcript
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({transcriptEntries.length} messages)
                  </span>
                </span>
                {showTranscript ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                      <div className="space-y-3">
                        {transcriptEntries.map((entry, index) => {
                          const isAgent = entry.speaker === "agent"
                          const isCurrent = index === currentTranscriptIndex

                          return (
                            <div
                              key={index}
                              className={cn(
                                "flex gap-3 p-2 rounded-lg transition-colors",
                                isCurrent && "bg-teal-50 dark:bg-teal-900/20"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                  isAgent
                                    ? "bg-teal-100 dark:bg-teal-900/30"
                                    : "bg-slate-100 dark:bg-slate-700"
                                )}
                              >
                                {isAgent ? (
                                  <MessageSquare className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                ) : (
                                  <User className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                                    {entry.speaker}
                                  </span>
                                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                                    {formatTime(entry.time)}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {entry.text}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <span className="font-medium">Keyboard shortcuts:</span> Space to play/pause, Arrow keys to seek, M to mute
        </p>
      </div>
    </div>
  )
}
