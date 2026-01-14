/**
 * Shared Components Index
 * Central export file for all shared/reusable components
 */

export { AnimatedNumber } from './AnimatedNumber'
export { CommandPalette } from './CommandPalette'
export { EmptyState } from './EmptyState'
export { KeyboardShortcutsProvider, ShortcutsHelpModal, useCommandPalette } from './KeyboardShortcuts'
export { Skeleton } from './Skeleton'
export { ThemeToggle } from './ThemeToggle'
export {
  ToastProvider,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  dismissToast,
  showPromise,
} from './Toast'
export { BulkActionBar } from './BulkActionBar'
export type { BulkAction, BulkActionBarProps } from './BulkActionBar'

// OnboardingTour - User onboarding with driver.js
export {
  OnboardingTour,
  adminTourSteps,
  hiqorTourSteps,
  suresTourSteps,
  useOnboardingTour,
} from './OnboardingTour'
export type {
  TourStep,
  OnboardingTourProps,
  UseOnboardingTourReturn,
  TourPopoverSide,
  PortalType,
  TourStatus,
  TourAnalyticsEvent,
} from './OnboardingTour.types'

// DateRangePicker - Date range selection with presets
export { default as DateRangePicker, DEFAULT_PRESETS as DATE_RANGE_PRESETS } from './DateRangePicker'
export type { DateRange, DateRangePreset, DateRangePickerProps } from './DateRangePicker'

// ExportButton - Data export with format selection
export { default as ExportButton } from './ExportButton'
export type { ExportFormat, ExportOption, ExportButtonProps } from './ExportButton'

// DashboardHeader - Unified dashboard header with controls
export { default as DashboardHeader } from './DashboardHeader'
export type { BreadcrumbItem, DashboardHeaderProps } from './DashboardHeader'
