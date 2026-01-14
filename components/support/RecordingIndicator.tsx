"use client"

import { useState, useCallback } from "react"
import { Circle, Pause, Play, Square, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRecordingDuration } from "@/lib/support/use-onboarding-recording"

interface RecordingIndicatorProps {
  isRecording: boolean
  isPaused: boolean
  duration: number
  onPause: () => void
  onResume: () => void
  onStop: () => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  minimizable?: boolean
}

export function RecordingIndicator({
  isRecording,
  isPaused,
  duration,
  onPause,
  onResume,
  onStop,
  position = "top-right",
  minimizable = true,
}: RecordingIndicatorProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  if (!isRecording) return null

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-200",
        positionClasses[position]
      )}
    >
      {isMinimized ? (
        // Minimized state - just the red dot
        <button
          onClick={toggleMinimize}
          className="group flex items-center gap-2 px-3 py-2 bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-zinc-800/90 dark:hover:bg-zinc-700/90 transition-colors"
          aria-label="Expand recording controls"
        >
          <RecordingDot isPaused={isPaused} />
          <span className="text-xs font-mono text-zinc-300">
            {formatRecordingDuration(duration)}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        </button>
      ) : (
        // Expanded state - full controls
        <div className="bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <RecordingDot isPaused={isPaused} />
              <span className="text-xs font-medium text-zinc-200">
                {isPaused ? "Paused" : "Recording"}
              </span>
            </div>
            {minimizable && (
              <button
                onClick={toggleMinimize}
                className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label="Minimize recording controls"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Duration */}
          <div className="px-4 py-3 flex items-center justify-center">
            <span className="text-2xl font-mono text-white tracking-wider">
              {formatRecordingDuration(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 px-3 pb-3">
            {isPaused ? (
              <button
                onClick={onResume}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                aria-label="Resume recording"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors"
                aria-label="Pause recording"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              aria-label="Stop recording"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Animated recording dot
function RecordingDot({ isPaused }: { isPaused: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse ring - only when actively recording */}
      {!isPaused && (
        <span
          className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75"
          aria-hidden="true"
        />
      )}
      {/* Inner solid dot */}
      <Circle
        className={cn(
          "w-3 h-3 fill-current relative z-10",
          isPaused ? "text-yellow-500" : "text-red-500"
        )}
      />
    </div>
  )
}

// Compact inline recording indicator for embedding in other components
export function InlineRecordingIndicator({
  isRecording,
  isPaused,
  duration,
}: {
  isRecording: boolean
  isPaused: boolean
  duration: number
}) {
  if (!isRecording) return null

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
      <RecordingDot isPaused={isPaused} />
      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
        {formatRecordingDuration(duration)}
      </span>
    </div>
  )
}

// Recording status badge for chat widgets
export function RecordingBadge({
  isRecording,
  onClick,
}: {
  isRecording: boolean
  onClick?: () => void
}) {
  if (!isRecording) return null

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      aria-label="Recording in progress"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      REC
    </button>
  )
}
