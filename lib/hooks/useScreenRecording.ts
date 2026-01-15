"use client"

import { useState, useCallback, useRef, useEffect } from "react"

// Types for rrweb - using simplified versions for SSR compatibility
// The actual rrweb module is dynamically imported client-side only
type ListenerHandler = () => void

// Recording event with minimal typing for storage
export interface RecordingEvent {
  type: number
  timestamp: number
  data: unknown
}

// Recording metadata for upload
export interface RecordingMetadata {
  partnerId?: string
  conversationId?: string
  onboardingStep?: number
  stepName?: string
}

// Upload response from API
export interface UploadResponse {
  success: boolean
  recordingId?: string
  recordingUrl?: string
  error?: string
}

// Recording state
export type RecordingState = "idle" | "recording" | "stopped" | "uploading" | "error"

// Error types for better error handling
export type RecordingErrorType =
  | "browser_not_supported"
  | "rrweb_load_failed"
  | "recording_failed"
  | "size_limit_exceeded"
  | "duration_limit_exceeded"
  | "upload_failed"
  | "unknown"

export interface RecordingError {
  type: RecordingErrorType
  message: string
  originalError?: Error
}

// Hook options
export interface UseScreenRecordingOptions {
  maxDurationSeconds?: number // Default: 300 (5 minutes)
  maxSizeBytes?: number // Default: 10 * 1024 * 1024 (10MB)
  onError?: (error: RecordingError) => void
  onSizeWarning?: (currentSize: number, maxSize: number) => void
  sizeWarningThreshold?: number // Percentage (0-1) to trigger warning. Default: 0.8
  samplingOptions?: {
    mousemove?: boolean | number
    mouseInteraction?: boolean | Record<string, boolean>
    scroll?: number
    media?: number
    input?: "all" | "last"
    canvas?: number
  }
  maskAllInputs?: boolean // Default: true for privacy
  blockSelector?: string // CSS selector for elements to block
}

// Hook return type
export interface UseScreenRecordingReturn {
  // Actions
  startRecording: () => Promise<boolean>
  stopRecording: () => RecordingEvent[]
  uploadRecording: (metadata: RecordingMetadata) => Promise<UploadResponse>
  clearRecording: () => void

  // State
  isRecording: boolean
  state: RecordingState
  events: RecordingEvent[]
  duration: number // Duration in seconds
  eventCount: number
  estimatedSize: number // Estimated size in bytes
  error: RecordingError | null

  // Browser support
  isSupported: boolean
}

// Constants
const DEFAULT_MAX_DURATION_SECONDS = 300 // 5 minutes
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const DEFAULT_SIZE_WARNING_THRESHOLD = 0.8 // 80%

// Check browser support
function checkBrowserSupport(): boolean {
  if (typeof window === "undefined") return false

  // Check for MutationObserver (required by rrweb)
  if (!("MutationObserver" in window)) return false

  // Check for WeakMap (required by rrweb)
  if (!("WeakMap" in window)) return false

  // Check for basic DOM APIs
  if (!document.querySelector || !document.querySelectorAll) return false

  return true
}

// Estimate JSON size without full stringify for performance
function estimateEventSize(events: RecordingEvent[]): number {
  if (events.length === 0) return 0

  // Sample approach: stringify last few events and extrapolate
  const sampleSize = Math.min(10, events.length)
  const sampleEvents = events.slice(-sampleSize)
  const sampleStr = JSON.stringify(sampleEvents)
  const avgEventSize = sampleStr.length / sampleSize

  return Math.ceil(avgEventSize * events.length)
}

export function useScreenRecording(
  options: UseScreenRecordingOptions = {}
): UseScreenRecordingReturn {
  const {
    maxDurationSeconds = DEFAULT_MAX_DURATION_SECONDS,
    maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
    onError,
    onSizeWarning,
    sizeWarningThreshold = DEFAULT_SIZE_WARNING_THRESHOLD,
    samplingOptions,
    maskAllInputs = true,
    blockSelector,
  } = options

  // State
  const [state, setState] = useState<RecordingState>("idle")
  const [events, setEvents] = useState<RecordingEvent[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<RecordingError | null>(null)
  const [isSupported] = useState(() => checkBrowserSupport())

  // Refs
  const stopFnRef = useRef<ListenerHandler | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const eventsRef = useRef<RecordingEvent[]>([])
  const sizeWarningTriggeredRef = useRef(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rrwebModuleRef = useRef<{ record: (options: any) => ListenerHandler | undefined } | null>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
    if (stopFnRef.current) {
      stopFnRef.current()
      stopFnRef.current = null
    }
    sizeWarningTriggeredRef.current = false
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  // Handle recording error
  const handleError = useCallback(
    (type: RecordingErrorType, message: string, originalError?: Error) => {
      const recordingError: RecordingError = {
        type,
        message,
        originalError,
      }
      setError(recordingError)
      setState("error")
      onError?.(recordingError)
      cleanup()
    },
    [cleanup, onError]
  )

  // Load rrweb dynamically (client-side only)
  const loadRrweb = useCallback(async () => {
    if (rrwebModuleRef.current) return rrwebModuleRef.current

    try {
      // Dynamic import for SSR safety
      const rrweb = await import("rrweb")
      rrwebModuleRef.current = rrweb
      return rrweb
    } catch (err) {
      handleError(
        "rrweb_load_failed",
        "Failed to load recording library",
        err instanceof Error ? err : new Error(String(err))
      )
      return null
    }
  }, [handleError])

  // Start recording
  const startRecording = useCallback(async (): Promise<boolean> => {
    // Check browser support
    if (!isSupported) {
      handleError(
        "browser_not_supported",
        "Your browser does not support screen recording. Please use a modern browser."
      )
      return false
    }

    // Don't start if already recording
    if (state === "recording") {
      return true
    }

    // Reset state
    setError(null)
    setEvents([])
    setDuration(0)
    eventsRef.current = []
    sizeWarningTriggeredRef.current = false

    // Load rrweb
    const rrweb = await loadRrweb()
    if (!rrweb) {
      return false
    }

    try {
      setState("recording")
      startTimeRef.current = Date.now()

      // Start recording
      const stopFn = rrweb.record({
        emit: (event: RecordingEvent) => {
          const recordingEvent = event
          eventsRef.current.push(recordingEvent)

          // Update events state periodically (not on every event for performance)
          if (eventsRef.current.length % 50 === 0) {
            setEvents([...eventsRef.current])
          }

          // Check size limit
          const estimatedSize = estimateEventSize(eventsRef.current)
          if (estimatedSize >= maxSizeBytes) {
            handleError(
              "size_limit_exceeded",
              `Recording size limit (${Math.round(maxSizeBytes / 1024 / 1024)}MB) exceeded`
            )
            return
          }

          // Size warning
          if (
            !sizeWarningTriggeredRef.current &&
            estimatedSize >= maxSizeBytes * sizeWarningThreshold
          ) {
            sizeWarningTriggeredRef.current = true
            onSizeWarning?.(estimatedSize, maxSizeBytes)
          }
        },
        checkoutEveryNms: 30000, // Full snapshot every 30 seconds for recovery
        maskAllInputs,
        blockSelector,
        sampling: samplingOptions || {
          mousemove: 50, // Sample mouse movements (not every pixel)
          mouseInteraction: true,
          scroll: 150, // Throttle scroll events
          input: "last", // Only capture final input value
        },
        slimDOMOptions: {
          script: true, // Remove script content
          comment: true, // Remove comments
          headFavicon: true,
          headWhitespace: true,
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaVerification: true,
          headMetaAuthorship: true,
        },
        errorHandler: (err: Error) => {
          console.error("[rrweb] Recording error:", err)
        },
      })

      stopFnRef.current = stopFn

      // Start duration tracking
      durationIntervalRef.current = setInterval(() => {
        const currentDuration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(currentDuration)

        // Check duration limit
        if (currentDuration >= maxDurationSeconds) {
          handleError(
            "duration_limit_exceeded",
            `Recording duration limit (${maxDurationSeconds} seconds) exceeded`
          )
        }
      }, 1000)

      return true
    } catch (err) {
      handleError(
        "recording_failed",
        "Failed to start recording",
        err instanceof Error ? err : new Error(String(err))
      )
      return false
    }
  }, [
    isSupported,
    state,
    loadRrweb,
    maxSizeBytes,
    maxDurationSeconds,
    sizeWarningThreshold,
    maskAllInputs,
    blockSelector,
    samplingOptions,
    onSizeWarning,
    handleError,
  ])

  // Stop recording
  const stopRecording = useCallback((): RecordingEvent[] => {
    if (stopFnRef.current) {
      stopFnRef.current()
      stopFnRef.current = null
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    // Calculate final duration
    if (startTimeRef.current > 0) {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }

    // Final events sync
    const finalEvents = [...eventsRef.current]
    setEvents(finalEvents)
    setState("stopped")

    return finalEvents
  }, [])

  // Upload recording
  const uploadRecording = useCallback(
    async (metadata: RecordingMetadata): Promise<UploadResponse> => {
      const recordingEvents = eventsRef.current.length > 0 ? eventsRef.current : events

      if (recordingEvents.length === 0) {
        return {
          success: false,
          error: "No recording data to upload",
        }
      }

      setState("uploading")
      setError(null)

      try {
        const payload = {
          events: recordingEvents,
          duration: duration,
          metadata: {
            ...metadata,
            eventCount: recordingEvents.length,
            estimatedSize: estimateEventSize(recordingEvents),
            recordedAt: new Date().toISOString(),
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          },
        }

        const response = await fetch("/api/support/recordings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Upload failed" }))
          throw new Error(errorData.error || `Upload failed with status ${response.status}`)
        }

        const result = await response.json()
        setState("idle")

        return {
          success: true,
          recordingId: result.id,
          recordingUrl: result.recordingUrl,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed"
        handleError(
          "upload_failed",
          errorMessage,
          err instanceof Error ? err : new Error(String(err))
        )

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [events, duration, handleError]
  )

  // Clear recording data
  const clearRecording = useCallback(() => {
    cleanup()
    setEvents([])
    eventsRef.current = []
    setDuration(0)
    setError(null)
    setState("idle")
  }, [cleanup])

  // Computed values
  const isRecording = state === "recording"
  const eventCount = events.length || eventsRef.current.length
  const estimatedSize = estimateEventSize(events.length > 0 ? events : eventsRef.current)

  return {
    // Actions
    startRecording,
    stopRecording,
    uploadRecording,
    clearRecording,

    // State
    isRecording,
    state,
    events,
    duration,
    eventCount,
    estimatedSize,
    error,

    // Browser support
    isSupported,
  }
}

// Helper function to format recording duration
export function formatRecordingDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Helper function to format file size
export function formatRecordingSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// Re-export types for convenience
export type { RecordingMetadata as ScreenRecordingMetadata }

export default useScreenRecording
