"use client"

import { useState, useRef, useCallback, useEffect } from "react"

// rrweb event type (inline to avoid dependency on rrweb types)
interface eventWithTime {
  type: number
  data: unknown
  timestamp: number
  delay?: number
}

// rrweb types
type RecordFn = (options: {
  emit: (event: eventWithTime, isCheckout?: boolean) => void
  checkoutEveryNms?: number
  checkoutEveryNth?: number
  blockClass?: string | RegExp
  blockSelector?: string
  ignoreClass?: string
  maskTextClass?: string | RegExp
  maskTextSelector?: string
  maskAllInputs?: boolean
  maskInputOptions?: Record<string, boolean>
  slimDOMOptions?: boolean | Record<string, boolean>
  sampling?: {
    scroll?: number
    media?: number
    input?: "last" | "all"
  }
}) => () => void

interface UseOnboardingRecordingOptions {
  partnerId?: string
  conversationId?: string
  onboardingStep?: string
  maxDurationMs?: number
  checkoutIntervalMs?: number
  maskInputs?: boolean
  blockSelector?: string
}

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  recordingDuration: number
  hasConsent: boolean
  error: string | null
}

interface UseOnboardingRecordingReturn extends RecordingState {
  startRecording: () => Promise<void>
  stopRecording: () => Promise<eventWithTime[]>
  pauseRecording: () => void
  resumeRecording: () => void
  uploadRecording: (events: eventWithTime[]) => Promise<string | null>
  checkConsent: () => boolean
  setConsent: (consent: boolean) => void
  clearConsent: () => void
}

const CONSENT_STORAGE_KEY = "dei_recording_consent"
const MAX_RECORDING_DURATION_MS = 30 * 60 * 1000 // 30 minutes

export function useOnboardingRecording(
  options: UseOnboardingRecordingOptions = {}
): UseOnboardingRecordingReturn {
  const {
    partnerId,
    conversationId,
    onboardingStep,
    maxDurationMs = MAX_RECORDING_DURATION_MS,
    checkoutIntervalMs = 10000,
    maskInputs = true,
    blockSelector = ".no-record, [data-no-record]",
  } = options

  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingDuration: 0,
    hasConsent: false,
    error: null,
  })

  const eventsRef = useRef<eventWithTime[]>([])
  const stopFnRef = useRef<(() => void) | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pausedEventsLengthRef = useRef<number>(0)

  // Check consent on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY)
      setState((prev) => ({ ...prev, hasConsent: consent === "true" }))
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopFnRef.current) {
        stopFnRef.current()
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  const checkConsent = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true"
  }, [])

  const setConsent = useCallback((consent: boolean) => {
    if (typeof window === "undefined") return
    localStorage.setItem(CONSENT_STORAGE_KEY, consent ? "true" : "false")
    setState((prev) => ({ ...prev, hasConsent: consent }))
  }, [])

  const clearConsent = useCallback(() => {
    if (typeof window === "undefined") return
    localStorage.removeItem(CONSENT_STORAGE_KEY)
    setState((prev) => ({ ...prev, hasConsent: false }))
  }, [])

  const updateDuration = useCallback(() => {
    if (startTimeRef.current && !state.isPaused) {
      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current
      setState((prev) => ({ ...prev, recordingDuration: elapsed }))

      // Auto-stop if max duration reached
      if (elapsed >= maxDurationMs) {
        stopRecordingInternal()
      }
    }
  }, [maxDurationMs, state.isPaused])

  const stopRecordingInternal = useCallback(() => {
    if (stopFnRef.current) {
      stopFnRef.current()
      stopFnRef.current = null
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
    setState((prev) => ({ ...prev, isRecording: false, isPaused: false }))
  }, [])

  const startRecording = useCallback(async (): Promise<void> => {
    if (state.isRecording) {
      return
    }

    if (!checkConsent()) {
      setState((prev) => ({
        ...prev,
        error: "Recording consent not granted",
      }))
      return
    }

    try {
      // Dynamic import rrweb to avoid SSR issues
      const rrweb = await import("rrweb")
      const record = rrweb.record as unknown as RecordFn

      eventsRef.current = []
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0

      stopFnRef.current = record({
        emit(event: eventWithTime) {
          eventsRef.current.push(event)
        },
        checkoutEveryNms: checkoutIntervalMs,
        maskAllInputs: maskInputs,
        blockSelector,
        maskInputOptions: {
          password: true,
          email: true,
          tel: true,
        },
        slimDOMOptions: {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaVerification: true,
          headMetaAuthorship: true,
        },
        sampling: {
          scroll: 150,
          media: 800,
          input: "last",
        },
      })

      durationIntervalRef.current = setInterval(updateDuration, 1000)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        recordingDuration: 0,
        error: null,
      }))
    } catch (error) {
      console.error("[Recording] Failed to start:", error)
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to start recording",
      }))
    }
  }, [state.isRecording, checkConsent, checkoutIntervalMs, maskInputs, blockSelector, updateDuration])

  const stopRecording = useCallback(async (): Promise<eventWithTime[]> => {
    stopRecordingInternal()
    const events = [...eventsRef.current]
    eventsRef.current = []
    startTimeRef.current = null
    pausedTimeRef.current = 0
    return events
  }, [stopRecordingInternal])

  const pauseRecording = useCallback(() => {
    if (!state.isRecording || state.isPaused) return

    pausedEventsLengthRef.current = eventsRef.current.length
    setState((prev) => ({ ...prev, isPaused: true }))

    // Track pause start time
    if (startTimeRef.current) {
      pausedTimeRef.current = Date.now()
    }
  }, [state.isRecording, state.isPaused])

  const resumeRecording = useCallback(() => {
    if (!state.isRecording || !state.isPaused) return

    // Calculate paused duration
    if (pausedTimeRef.current > 0) {
      const pausedDuration = Date.now() - pausedTimeRef.current
      pausedTimeRef.current = pausedDuration
    }

    setState((prev) => ({ ...prev, isPaused: false }))
  }, [state.isRecording, state.isPaused])

  const uploadRecording = useCallback(
    async (events: eventWithTime[]): Promise<string | null> => {
      if (events.length === 0) {
        setState((prev) => ({ ...prev, error: "No events to upload" }))
        return null
      }

      try {
        const response = await fetch("/api/support/recordings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events,
            partnerId,
            conversationId,
            onboardingStep,
            duration: state.recordingDuration,
            metadata: {
              userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
              screenWidth: typeof window !== "undefined" ? window.innerWidth : undefined,
              screenHeight: typeof window !== "undefined" ? window.innerHeight : undefined,
              timestamp: new Date().toISOString(),
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to upload recording")
        }

        const data = await response.json()
        return data.recordingUrl || null
      } catch (error) {
        console.error("[Recording] Upload failed:", error)
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to upload recording",
        }))
        return null
      }
    },
    [partnerId, conversationId, onboardingStep, state.recordingDuration]
  )

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    uploadRecording,
    checkConsent,
    setConsent,
    clearConsent,
  }
}

// Utility function to format duration for display
export function formatRecordingDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// Utility to compress events for smaller payloads
export function compressRecordingEvents(events: eventWithTime[]): string {
  return JSON.stringify(events)
}
