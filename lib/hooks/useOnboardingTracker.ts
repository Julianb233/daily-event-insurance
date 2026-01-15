"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import {
  useScreenRecording,
  type RecordingMetadata,
  type UseScreenRecordingReturn,
} from "./useScreenRecording"

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Issue severity levels for detected onboarding problems
 */
export type IssueSeverity = "low" | "medium" | "high" | "critical"

/**
 * Types of issues that can be detected during onboarding
 */
export type IssueType =
  | "stuck_too_long"
  | "multiple_validation_errors"
  | "excessive_back_navigation"
  | "browser_error"
  | "help_requested"
  | "abandonment_risk"

/**
 * Represents a detected issue during the onboarding process
 */
export interface OnboardingIssue {
  id: string
  type: IssueType
  severity: IssueSeverity
  step: number
  stepName: string
  message: string
  timestamp: number
  metadata?: Record<string, unknown>
}

/**
 * Metrics collected for each onboarding step
 */
export interface StepMetrics {
  stepIndex: number
  stepName: string
  timeSpentMs: number
  visitCount: number
  validationErrors: number
  helpInteractions: number
  backNavigationCount: number
  firstVisitAt: number | null
  lastVisitAt: number | null
  completedAt: number | null
  isComplete: boolean
}

/**
 * Historical entry for step navigation tracking
 */
export interface StepHistoryEntry {
  step: number
  stepName: string
  action: "enter" | "leave" | "complete" | "error"
  timestamp: number
  timeSpentMs?: number
  metadata?: Record<string, unknown>
}

/**
 * Persisted state for localStorage
 */
interface PersistedOnboardingState {
  partnerId?: string
  currentStep: number
  stepMetrics: Record<number, StepMetrics>
  stepHistory: StepHistoryEntry[]
  startedAt: number
  lastUpdatedAt: number
  completedSteps: number[]
}

/**
 * Configuration options for the onboarding tracker
 */
export interface OnboardingTrackerOptions {
  /** Total number of steps in the onboarding flow */
  totalSteps: number
  /** Names for each step (array length should match totalSteps) */
  stepNames: string[]
  /** Partner ID for tracking and recording association */
  partnerId?: string
  /** Enable automatic screen recording integration */
  enableRecording?: boolean
  /** Callback when step changes */
  onStepChange?: (step: number, stepName: string) => void
  /** Callback when an issue is detected */
  onIssueDetected?: (issue: OnboardingIssue) => void
  /** Persist progress to server API */
  persistToServer?: boolean
  /** Server API endpoint for persistence (default: /api/onboarding/progress) */
  serverEndpoint?: string
  /** LocalStorage key for persistence */
  storageKey?: string
  /** Time threshold (ms) before marking as "stuck" (default: 5 minutes) */
  stuckThresholdMs?: number
  /** Validation error count before flagging (default: 3) */
  validationErrorThreshold?: number
  /** Back navigation count before flagging (default: 3) */
  backNavigationThreshold?: number
  /** Auto-save interval to localStorage (ms, default: 10000) */
  autoSaveIntervalMs?: number
}

/**
 * Return type for the useOnboardingTracker hook
 */
export interface UseOnboardingTrackerReturn {
  // Navigation
  currentStep: number
  stepHistory: StepHistoryEntry[]
  totalSteps: number
  progress: number
  timeOnCurrentStep: number

  // Navigation Actions
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  markStepComplete: (step?: number) => void

  // Metrics
  getStepMetrics: (step?: number) => StepMetrics | null
  getAllMetrics: () => StepMetrics[]

  // Recording Integration
  startRecordingForStep: (step?: number) => Promise<boolean>
  stopRecordingForStep: (step?: number) => Promise<void>
  isRecordingActive: boolean

  // Issue Detection
  issues: OnboardingIssue[]
  clearIssues: () => void

  // Tracking Actions
  trackValidationError: (errorMessage?: string) => void
  trackHelpInteraction: (interactionType?: string) => void
  trackBrowserError: (error: Error) => void

  // State Management
  resetProgress: () => void
  saveProgress: () => Promise<void>
  isLoading: boolean
  error: Error | null
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_STUCK_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
const DEFAULT_VALIDATION_ERROR_THRESHOLD = 3
const DEFAULT_BACK_NAVIGATION_THRESHOLD = 3
const DEFAULT_AUTO_SAVE_INTERVAL_MS = 10000 // 10 seconds
const DEFAULT_STORAGE_KEY = "onboarding_progress"
const DEFAULT_SERVER_ENDPOINT = "/api/onboarding/progress"

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique ID for issues
 */
function generateIssueId(): string {
  return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * SSR-safe localStorage access
 */
function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

/**
 * SSR-safe localStorage write
 */
function setToLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Create initial metrics for a step
 */
function createInitialStepMetrics(stepIndex: number, stepName: string): StepMetrics {
  return {
    stepIndex,
    stepName,
    timeSpentMs: 0,
    visitCount: 0,
    validationErrors: 0,
    helpInteractions: 0,
    backNavigationCount: 0,
    firstVisitAt: null,
    lastVisitAt: null,
    completedAt: null,
    isComplete: false,
  }
}

/**
 * Determine issue severity based on type and context
 */
function determineIssueSeverity(
  type: IssueType,
  metrics: StepMetrics
): IssueSeverity {
  switch (type) {
    case "browser_error":
      return "high"
    case "abandonment_risk":
      return "critical"
    case "stuck_too_long":
      return metrics.timeSpentMs > 10 * 60 * 1000 ? "high" : "medium"
    case "multiple_validation_errors":
      return metrics.validationErrors > 5 ? "high" : "medium"
    case "excessive_back_navigation":
      return metrics.backNavigationCount > 5 ? "high" : "medium"
    case "help_requested":
      return "low"
    default:
      return "medium"
  }
}

// ============================================================================
// Main Hook
// ============================================================================

export function useOnboardingTracker(
  options: OnboardingTrackerOptions
): UseOnboardingTrackerReturn {
  const {
    totalSteps,
    stepNames,
    partnerId,
    enableRecording = false,
    onStepChange,
    onIssueDetected,
    persistToServer = false,
    serverEndpoint = DEFAULT_SERVER_ENDPOINT,
    storageKey = DEFAULT_STORAGE_KEY,
    stuckThresholdMs = DEFAULT_STUCK_THRESHOLD_MS,
    validationErrorThreshold = DEFAULT_VALIDATION_ERROR_THRESHOLD,
    backNavigationThreshold = DEFAULT_BACK_NAVIGATION_THRESHOLD,
    autoSaveIntervalMs = DEFAULT_AUTO_SAVE_INTERVAL_MS,
  } = options

  // Validate options
  if (stepNames.length !== totalSteps) {
    console.warn(
      `[useOnboardingTracker] stepNames length (${stepNames.length}) does not match totalSteps (${totalSteps})`
    )
  }

  // ============================================================================
  // State
  // ============================================================================

  const [currentStep, setCurrentStep] = useState(0)
  const [stepHistory, setStepHistory] = useState<StepHistoryEntry[]>([])
  const [stepMetrics, setStepMetrics] = useState<Record<number, StepMetrics>>({})
  const [issues, setIssues] = useState<OnboardingIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // ============================================================================
  // Refs
  // ============================================================================

  const stepStartTimeRef = useRef<number>(Date.now())
  const isMountedRef = useRef(true)
  const stuckCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const initializedRef = useRef(false)
  const recordingStepRef = useRef<number | null>(null)

  // ============================================================================
  // Screen Recording Integration
  // ============================================================================

  const screenRecording: UseScreenRecordingReturn = useScreenRecording({
    maxDurationSeconds: 300,
    maskAllInputs: true,
    onError: (recordingError) => {
      console.error("[useOnboardingTracker] Recording error:", recordingError)
    },
  })

  // ============================================================================
  // Computed Values
  // ============================================================================

  const progress = useMemo(() => {
    if (totalSteps === 0) return 0
    return Math.round((completedSteps.length / totalSteps) * 100)
  }, [completedSteps.length, totalSteps])

  const timeOnCurrentStep = useMemo(() => {
    return Date.now() - stepStartTimeRef.current
  }, [currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const isRecordingActive = screenRecording.isRecording

  // ============================================================================
  // Issue Detection
  // ============================================================================

  const detectAndReportIssue = useCallback(
    (type: IssueType, message: string, metadata?: Record<string, unknown>) => {
      const currentMetrics = stepMetrics[currentStep] || createInitialStepMetrics(
        currentStep,
        stepNames[currentStep] || `Step ${currentStep + 1}`
      )

      const severity = determineIssueSeverity(type, currentMetrics)

      const issue: OnboardingIssue = {
        id: generateIssueId(),
        type,
        severity,
        step: currentStep,
        stepName: stepNames[currentStep] || `Step ${currentStep + 1}`,
        message,
        timestamp: Date.now(),
        metadata,
      }

      setIssues((prev) => [...prev, issue])
      onIssueDetected?.(issue)
    },
    [currentStep, stepMetrics, stepNames, onIssueDetected]
  )

  // ============================================================================
  // Metrics Management
  // ============================================================================

  const updateStepMetrics = useCallback(
    (
      step: number,
      updates: Partial<StepMetrics>
    ) => {
      setStepMetrics((prev) => {
        const existing = prev[step] || createInitialStepMetrics(
          step,
          stepNames[step] || `Step ${step + 1}`
        )

        return {
          ...prev,
          [step]: {
            ...existing,
            ...updates,
          },
        }
      })
    },
    [stepNames]
  )

  const getStepMetrics = useCallback(
    (step?: number): StepMetrics | null => {
      const targetStep = step ?? currentStep
      return stepMetrics[targetStep] || null
    },
    [currentStep, stepMetrics]
  )

  const getAllMetrics = useCallback((): StepMetrics[] => {
    return Array.from({ length: totalSteps }, (_, i) => {
      return stepMetrics[i] || createInitialStepMetrics(
        i,
        stepNames[i] || `Step ${i + 1}`
      )
    })
  }, [totalSteps, stepMetrics, stepNames])

  // ============================================================================
  // History Management
  // ============================================================================

  const addHistoryEntry = useCallback(
    (
      step: number,
      action: StepHistoryEntry["action"],
      metadata?: Record<string, unknown>
    ) => {
      const entry: StepHistoryEntry = {
        step,
        stepName: stepNames[step] || `Step ${step + 1}`,
        action,
        timestamp: Date.now(),
        metadata,
      }

      if (action === "leave") {
        entry.timeSpentMs = Date.now() - stepStartTimeRef.current
      }

      setStepHistory((prev) => [...prev, entry])
    },
    [stepNames]
  )

  // ============================================================================
  // Navigation
  // ============================================================================

  const goToStep = useCallback(
    (step: number) => {
      // Validate step range
      if (step < 0 || step >= totalSteps) {
        console.warn(`[useOnboardingTracker] Invalid step: ${step}`)
        return
      }

      const previousStep = currentStep
      const isBackNavigation = step < previousStep

      // Update time spent on current step
      const timeSpent = Date.now() - stepStartTimeRef.current
      updateStepMetrics(previousStep, {
        timeSpentMs: (stepMetrics[previousStep]?.timeSpentMs || 0) + timeSpent,
        lastVisitAt: Date.now(),
      })

      // Add leave history entry
      addHistoryEntry(previousStep, "leave", {
        nextStep: step,
        isBackNavigation,
      })

      // Track back navigation
      if (isBackNavigation) {
        const newBackCount = (stepMetrics[step]?.backNavigationCount || 0) + 1
        updateStepMetrics(step, { backNavigationCount: newBackCount })

        // Check for excessive back navigation
        if (newBackCount >= backNavigationThreshold) {
          detectAndReportIssue(
            "excessive_back_navigation",
            `User has navigated back to step "${stepNames[step]}" ${newBackCount} times`,
            { backCount: newBackCount }
          )
        }
      }

      // Update current step
      setCurrentStep(step)
      stepStartTimeRef.current = Date.now()

      // Update metrics for new step
      const existingMetrics = stepMetrics[step]
      updateStepMetrics(step, {
        visitCount: (existingMetrics?.visitCount || 0) + 1,
        firstVisitAt: existingMetrics?.firstVisitAt || Date.now(),
        lastVisitAt: Date.now(),
      })

      // Add enter history entry
      addHistoryEntry(step, "enter", {
        fromStep: previousStep,
        isBackNavigation,
      })

      // Notify callback
      onStepChange?.(step, stepNames[step] || `Step ${step + 1}`)
    },
    [
      currentStep,
      totalSteps,
      stepMetrics,
      stepNames,
      backNavigationThreshold,
      updateStepMetrics,
      addHistoryEntry,
      detectAndReportIssue,
      onStepChange,
    ]
  )

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1)
    }
  }, [currentStep, totalSteps, goToStep])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const markStepComplete = useCallback(
    (step?: number) => {
      const targetStep = step ?? currentStep

      if (completedSteps.includes(targetStep)) {
        return
      }

      setCompletedSteps((prev) => [...prev, targetStep])
      updateStepMetrics(targetStep, {
        isComplete: true,
        completedAt: Date.now(),
      })
      addHistoryEntry(targetStep, "complete")
    },
    [currentStep, completedSteps, updateStepMetrics, addHistoryEntry]
  )

  // ============================================================================
  // Tracking Actions
  // ============================================================================

  const trackValidationError = useCallback(
    (errorMessage?: string) => {
      const newErrorCount = (stepMetrics[currentStep]?.validationErrors || 0) + 1
      updateStepMetrics(currentStep, { validationErrors: newErrorCount })
      addHistoryEntry(currentStep, "error", { errorMessage })

      // Check threshold
      if (newErrorCount >= validationErrorThreshold) {
        detectAndReportIssue(
          "multiple_validation_errors",
          `User encountered ${newErrorCount} validation errors on step "${stepNames[currentStep]}"`,
          { errorCount: newErrorCount, lastError: errorMessage }
        )
      }
    },
    [
      currentStep,
      stepMetrics,
      stepNames,
      validationErrorThreshold,
      updateStepMetrics,
      addHistoryEntry,
      detectAndReportIssue,
    ]
  )

  const trackHelpInteraction = useCallback(
    (interactionType?: string) => {
      const newHelpCount = (stepMetrics[currentStep]?.helpInteractions || 0) + 1
      updateStepMetrics(currentStep, { helpInteractions: newHelpCount })

      // First help request might indicate confusion
      if (newHelpCount === 1) {
        detectAndReportIssue(
          "help_requested",
          `User requested help on step "${stepNames[currentStep]}"`,
          { interactionType }
        )
      }
    },
    [currentStep, stepMetrics, stepNames, updateStepMetrics, detectAndReportIssue]
  )

  const trackBrowserError = useCallback(
    (browserError: Error) => {
      detectAndReportIssue(
        "browser_error",
        `Browser error on step "${stepNames[currentStep]}": ${browserError.message}`,
        {
          errorName: browserError.name,
          errorMessage: browserError.message,
          errorStack: browserError.stack,
        }
      )
    },
    [currentStep, stepNames, detectAndReportIssue]
  )

  const clearIssues = useCallback(() => {
    setIssues([])
  }, [])

  // ============================================================================
  // Recording Integration
  // ============================================================================

  const startRecordingForStep = useCallback(
    async (step?: number): Promise<boolean> => {
      if (!enableRecording) {
        console.warn("[useOnboardingTracker] Recording is not enabled")
        return false
      }

      const targetStep = step ?? currentStep

      // Stop existing recording if any
      if (screenRecording.isRecording) {
        screenRecording.stopRecording()
      }

      recordingStepRef.current = targetStep
      return screenRecording.startRecording()
    },
    [enableRecording, currentStep, screenRecording]
  )

  const stopRecordingForStep = useCallback(
    async (step?: number): Promise<void> => {
      if (!screenRecording.isRecording) {
        return
      }

      const targetStep = step ?? recordingStepRef.current ?? currentStep
      const events = screenRecording.stopRecording()

      if (events.length > 0) {
        const metadata: RecordingMetadata = {
          partnerId,
          onboardingStep: targetStep,
          stepName: stepNames[targetStep] || `Step ${targetStep + 1}`,
        }

        try {
          await screenRecording.uploadRecording(metadata)
        } catch (uploadError) {
          console.error("[useOnboardingTracker] Failed to upload recording:", uploadError)
        }
      }

      recordingStepRef.current = null
    },
    [currentStep, partnerId, stepNames, screenRecording]
  )

  // ============================================================================
  // Persistence
  // ============================================================================

  const getPersistedState = useCallback((): PersistedOnboardingState => {
    return {
      partnerId,
      currentStep,
      stepMetrics,
      stepHistory,
      startedAt: stepHistory[0]?.timestamp || Date.now(),
      lastUpdatedAt: Date.now(),
      completedSteps,
    }
  }, [partnerId, currentStep, stepMetrics, stepHistory, completedSteps])

  const saveToLocalStorage = useCallback(() => {
    const state = getPersistedState()
    const key = partnerId ? `${storageKey}_${partnerId}` : storageKey
    setToLocalStorage(key, state)
  }, [getPersistedState, storageKey, partnerId])

  const saveToServer = useCallback(async () => {
    if (!persistToServer) return

    setIsLoading(true)
    setError(null)

    try {
      const state = getPersistedState()
      const response = await fetch(serverEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }
    } catch (err) {
      const saveError = err instanceof Error ? err : new Error("Failed to save progress")
      setError(saveError)
      console.error("[useOnboardingTracker] Failed to save to server:", saveError)
    } finally {
      setIsLoading(false)
    }
  }, [persistToServer, serverEndpoint, getPersistedState])

  const saveProgress = useCallback(async () => {
    saveToLocalStorage()
    if (persistToServer) {
      await saveToServer()
    }
  }, [saveToLocalStorage, saveToServer, persistToServer])

  const loadFromLocalStorage = useCallback(() => {
    const key = partnerId ? `${storageKey}_${partnerId}` : storageKey
    const state = getFromLocalStorage<PersistedOnboardingState>(key)

    if (state) {
      setCurrentStep(state.currentStep)
      setStepMetrics(state.stepMetrics)
      setStepHistory(state.stepHistory)
      setCompletedSteps(state.completedSteps)
      stepStartTimeRef.current = Date.now()
    }
  }, [storageKey, partnerId])

  const resetProgress = useCallback(() => {
    setCurrentStep(0)
    setStepHistory([])
    setStepMetrics({})
    setIssues([])
    setCompletedSteps([])
    stepStartTimeRef.current = Date.now()

    // Clear localStorage
    const key = partnerId ? `${storageKey}_${partnerId}` : storageKey
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  }, [partnerId, storageKey])

  // ============================================================================
  // Effects
  // ============================================================================

  // Initialize on mount
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    isMountedRef.current = true

    // Load persisted state
    loadFromLocalStorage()

    // Initialize first step metrics if not loaded
    if (!stepMetrics[0]) {
      updateStepMetrics(0, {
        visitCount: 1,
        firstVisitAt: Date.now(),
        lastVisitAt: Date.now(),
      })
      addHistoryEntry(0, "enter", { initial: true })
    }

    return () => {
      isMountedRef.current = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // "Stuck" detection timer
  useEffect(() => {
    if (stuckCheckIntervalRef.current) {
      clearInterval(stuckCheckIntervalRef.current)
    }

    stuckCheckIntervalRef.current = setInterval(() => {
      const timeOnStep = Date.now() - stepStartTimeRef.current

      if (timeOnStep >= stuckThresholdMs) {
        // Check if we already reported this
        const alreadyReported = issues.some(
          (issue) =>
            issue.type === "stuck_too_long" &&
            issue.step === currentStep &&
            Date.now() - issue.timestamp < stuckThresholdMs
        )

        if (!alreadyReported) {
          detectAndReportIssue(
            "stuck_too_long",
            `User has been on step "${stepNames[currentStep]}" for ${Math.round(
              timeOnStep / 1000 / 60
            )} minutes`,
            { timeOnStepMs: timeOnStep }
          )
        }
      }
    }, 30000) // Check every 30 seconds

    return () => {
      if (stuckCheckIntervalRef.current) {
        clearInterval(stuckCheckIntervalRef.current)
      }
    }
  }, [currentStep, stepNames, stuckThresholdMs, issues, detectAndReportIssue])

  // Auto-save timer
  useEffect(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current)
    }

    autoSaveIntervalRef.current = setInterval(() => {
      saveToLocalStorage()
    }, autoSaveIntervalMs)

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [autoSaveIntervalMs, saveToLocalStorage])

  // Save on unmount
  useEffect(() => {
    return () => {
      saveToLocalStorage()
    }
  }, [saveToLocalStorage])

  // Global error handler for browser errors
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleError = (event: ErrorEvent) => {
      trackBrowserError(new Error(event.message))
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
      trackBrowserError(reason)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [trackBrowserError])

  // Auto-start recording if enabled
  useEffect(() => {
    if (enableRecording && !screenRecording.isRecording) {
      startRecordingForStep(currentStep)
    }

    return () => {
      if (enableRecording && screenRecording.isRecording) {
        stopRecordingForStep(currentStep)
      }
    }
  }, [currentStep, enableRecording]) // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // Navigation
    currentStep,
    stepHistory,
    totalSteps,
    progress,
    timeOnCurrentStep,

    // Navigation Actions
    goToStep,
    nextStep,
    previousStep,
    markStepComplete,

    // Metrics
    getStepMetrics,
    getAllMetrics,

    // Recording Integration
    startRecordingForStep,
    stopRecordingForStep,
    isRecordingActive,

    // Issue Detection
    issues,
    clearIssues,

    // Tracking Actions
    trackValidationError,
    trackHelpInteraction,
    trackBrowserError,

    // State Management
    resetProgress,
    saveProgress,
    isLoading,
    error,
  }
}

// ============================================================================
// Helper Exports
// ============================================================================

/**
 * Default onboarding step names for partner onboarding
 */
export const DEFAULT_PARTNER_ONBOARDING_STEPS = [
  "Business Information",
  "Contact Details",
  "Integration Type Selection",
  "Branding Configuration",
  "Document Signing",
  "Review & Submit",
] as const

/**
 * Create default options for partner onboarding
 */
export function createPartnerOnboardingOptions(
  partnerId?: string,
  overrides?: Partial<OnboardingTrackerOptions>
): OnboardingTrackerOptions {
  return {
    totalSteps: DEFAULT_PARTNER_ONBOARDING_STEPS.length,
    stepNames: [...DEFAULT_PARTNER_ONBOARDING_STEPS],
    partnerId,
    enableRecording: true,
    persistToServer: true,
    ...overrides,
  }
}

/**
 * Format time duration for display
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

/**
 * Get issue severity color for UI
 */
export function getIssueSeverityColor(severity: IssueSeverity): string {
  switch (severity) {
    case "critical":
      return "red"
    case "high":
      return "orange"
    case "medium":
      return "yellow"
    case "low":
      return "blue"
    default:
      return "gray"
  }
}

export default useOnboardingTracker
