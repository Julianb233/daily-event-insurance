/**
 * OnboardingTour Type Definitions
 *
 * Shared types for the OnboardingTour component.
 * Import these for type safety in your implementations.
 */

/**
 * Position of the tour popover relative to the highlighted element
 */
export type TourPopoverSide = 'top' | 'bottom' | 'left' | 'right'

/**
 * Individual step in the onboarding tour
 */
export interface TourStep {
  /**
   * CSS selector for the element to highlight
   * @example '[data-tour="dashboard"]'
   * @example '#my-element'
   * @example '.my-class'
   */
  element: string

  /**
   * Title of the tour step
   * @example '📊 Dashboard Overview'
   */
  title: string

  /**
   * Description text for the tour step
   * @example 'View your earnings and key metrics at a glance.'
   */
  description: string

  /**
   * Position of the popover relative to the element
   * @default 'bottom'
   */
  side?: TourPopoverSide
}

/**
 * Props for the OnboardingTour component
 */
export interface OnboardingTourProps {
  /**
   * Unique identifier for the tour
   * Used for localStorage persistence
   * @example 'admin-portal'
   * @example 'hiqor-portal'
   * @example 'custom-feature-v1'
   */
  tourId: string

  /**
   * Array of tour steps to display
   * @example adminTourSteps
   * @example customSteps
   */
  steps: TourStep[]

  /**
   * Automatically start the tour if not completed
   * @default false
   */
  autoStart?: boolean

  /**
   * Callback when tour is completed
   * Fires when user clicks "Done" on last step
   */
  onComplete?: () => void

  /**
   * Callback when tour is skipped
   * Fires when user closes tour before completion
   */
  onSkip?: () => void
}

/**
 * Return type for useOnboardingTour hook
 */
export interface UseOnboardingTourReturn {
  /**
   * Manually start the tour
   */
  startTour: () => void

  /**
   * Skip the tour and mark as completed
   */
  skipTour: () => void

  /**
   * Reset tour completion status
   * Tour will show again on next visit
   */
  resetTour: () => void

  /**
   * Check if tour has been completed
   * @returns true if completed, false otherwise
   */
  isTourCompleted: () => boolean
}

/**
 * Portal types for pre-built tours
 */
export type PortalType = 'admin' | 'hiqor' | 'sures'

/**
 * Tour configuration for each portal
 */
export interface PortalTourConfig {
  tourId: string
  steps: TourStep[]
}

/**
 * Map of portal types to their tour configurations
 */
export type PortalTourMap = {
  [K in PortalType]: PortalTourConfig
}

/**
 * Storage key format for localStorage
 */
export type TourStorageKey = `onboarding-tour-${string}`

/**
 * Tour status
 */
export type TourStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped'

/**
 * Analytics event for tour completion
 */
export interface TourAnalyticsEvent {
  eventName: 'onboarding_complete' | 'onboarding_skip' | 'onboarding_start'
  portal: PortalType
  tourId: string
  timestamp: number
}

/**
 * Type guard to check if a string is a valid portal type
 */
export function isPortalType(value: string): value is PortalType {
  return ['admin', 'hiqor', 'sures'].includes(value)
}

/**
 * Type guard to check if a string is a valid popover side
 */
export function isTourPopoverSide(value: string): value is TourPopoverSide {
  return ['top', 'bottom', 'left', 'right'].includes(value)
}

/**
 * Helper to create a tour storage key
 */
export function createTourStorageKey(tourId: string): TourStorageKey {
  return `onboarding-tour-${tourId}`
}

/**
 * Helper to validate tour step
 */
export function isValidTourStep(step: unknown): step is TourStep {
  if (typeof step !== 'object' || step === null) return false

  const s = step as Record<string, unknown>

  return (
    typeof s.element === 'string' &&
    typeof s.title === 'string' &&
    typeof s.description === 'string' &&
    (!s.side || isTourPopoverSide(s.side as string))
  )
}

/**
 * Helper to validate tour steps array
 */
export function areValidTourSteps(steps: unknown): steps is TourStep[] {
  if (!Array.isArray(steps)) return false
  if (steps.length === 0) return false

  return steps.every(isValidTourStep)
}
