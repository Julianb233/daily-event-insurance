/**
 * OnboardingTour Usage Examples
 *
 * This file shows how to integrate the OnboardingTour component
 * into different portal layouts.
 */

// Extend Window type for Google Analytics
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
  }
}

import {
  OnboardingTour,
  adminTourSteps,
  hiqorTourSteps,
  suresTourSteps,
  useOnboardingTour,
} from './OnboardingTour'

/**
 * Example 1: Admin Portal Layout
 * Add to: /app/(admin)/layout.tsx or /app/(admin)/admin/page.tsx
 */
export function AdminLayoutWithTour({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Tour auto-starts on first visit */}
      <OnboardingTour
        tourId="admin-portal"
        steps={adminTourSteps}
        autoStart={true}
        onComplete={() => {
          console.log('Admin tour completed!')
          // Optional: Track completion analytics
        }}
        onSkip={() => {
          console.log('Admin tour skipped')
        }}
      />

      {/* Add data-tour attributes to elements */}
      <div className="flex h-screen">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r">
          <nav>
            <div data-tour="dashboard">Dashboard</div>
            <div data-tour="earnings">My Earnings</div>
            <div data-tour="microsites">Microsites</div>
            <div data-tour="partners">Partners</div>
            <div data-tour="leads">Leads</div>
          </nav>
        </aside>

        <main className="flex-1">
          <header data-tour="command-palette">
            <button>Open Command Palette (⌘K)</button>
          </header>
          {children}
        </main>
      </div>
    </>
  )
}

/**
 * Example 2: HiQor Portal Layout
 * Add to: /app/(hiqor)/layout.tsx
 */
export function HiqorLayoutWithTour({ children }: { children: React.ReactNode }) {
  const handleTourComplete = () => {
    // Send analytics event
    const win = window as Window & { gtag?: (...args: unknown[]) => void }
    if (typeof window !== 'undefined' && win.gtag) {
      win.gtag('event', 'onboarding_complete', {
        portal: 'hiqor',
      })
    }
  }

  return (
    <>
      <OnboardingTour
        tourId="hiqor-portal"
        steps={hiqorTourSteps}
        autoStart={true}
        onComplete={handleTourComplete}
      />

      <div data-tour="dashboard">
        {/* Dashboard content */}
      </div>
      <div data-tour="policies">
        {/* Policies section */}
      </div>
      <div data-tour="claims">
        {/* Claims section */}
      </div>
      <div data-tour="call-center">
        {/* Call center */}
      </div>
      <div data-tour="sync">
        {/* Sync status */}
      </div>
      <div data-tour="command-palette">
        {/* Command palette trigger */}
      </div>

      {children}
    </>
  )
}

/**
 * Example 3: Sures Portal Layout
 * Add to: /app/(sures)/layout.tsx
 */
export function SuresLayoutWithTour({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnboardingTour
        tourId="sures-portal"
        steps={suresTourSteps}
        autoStart={true}
      />

      {/* Your layout with data-tour attributes */}
      {children}
    </>
  )
}

/**
 * Example 4: Programmatic Tour Control
 * Use the hook to manually control the tour
 */
export function TourControlPanel() {
  const { startTour, skipTour, resetTour, isTourCompleted } = useOnboardingTour('admin-portal')

  return (
    <div className="flex gap-2 p-4">
      <button
        onClick={startTour}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
      >
        Start Tour
      </button>

      <button
        onClick={skipTour}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Skip Tour
      </button>

      <button
        onClick={resetTour}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Reset Tour
      </button>

      <span className="px-4 py-2 text-sm text-gray-600">
        Status: {isTourCompleted() ? 'Completed' : 'Not Started'}
      </span>
    </div>
  )
}

/**
 * Example 5: Settings Page with Tour Reset
 * Add to: /app/(admin)/admin/settings/page.tsx
 */
export function SettingsPageWithTourReset() {
  const { resetTour, startTour, isTourCompleted } = useOnboardingTour('admin-portal')

  const handleResetAndStart = () => {
    resetTour()
    // Small delay to ensure state updates
    setTimeout(() => {
      startTour()
    }, 100)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h2 className="text-lg font-semibold mb-2">Onboarding Tour</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isTourCompleted()
            ? 'You have completed the onboarding tour.'
            : 'The onboarding tour has not been completed yet.'}
        </p>
        <button
          onClick={handleResetAndStart}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          {isTourCompleted() ? 'Restart Tour' : 'Start Tour'}
        </button>
      </div>
    </div>
  )
}

/**
 * Example 6: Custom Tour Steps
 * Create your own tour for specific features
 */
export function CustomFeatureTour() {
  const customSteps = [
    {
      element: '[data-tour="new-feature-1"]',
      title: '🎉 New Feature Alert!',
      description: 'Check out our latest addition to help you work faster.',
      side: 'bottom' as const,
    },
    {
      element: '[data-tour="new-feature-2"]',
      title: '⚡ Power User Tip',
      description: 'Use keyboard shortcuts to access this feature quickly.',
      side: 'right' as const,
    },
    {
      element: '[data-tour="new-feature-3"]',
      title: '📊 Track Your Progress',
      description: 'Monitor your usage and see the impact on your workflow.',
      side: 'left' as const,
    },
  ]

  return (
    <OnboardingTour
      tourId="custom-feature-tour-v1"
      steps={customSteps}
      autoStart={true}
      onComplete={() => {
        console.log('Feature tour completed!')
      }}
    />
  )
}

/**
 * Example 7: Conditional Tour (for returning users)
 * Only show tour if user hasn't seen it before
 */
export function ConditionalTour({ children }: { children: React.ReactNode }) {
  const { isTourCompleted } = useOnboardingTour('admin-portal')

  return (
    <>
      {/* Only render tour component if not completed */}
      {!isTourCompleted() && (
        <OnboardingTour
          tourId="admin-portal"
          steps={adminTourSteps}
          autoStart={true}
        />
      )}
      {children}
    </>
  )
}

/**
 * Example 8: Multi-Portal Detection
 * Automatically show the correct tour based on current route
 */
'use client'
import { usePathname } from 'next/navigation'

export function AutoDetectPortalTour() {
  const pathname = usePathname()

  // Determine which portal we're in
  const portalConfig = (() => {
    if (pathname.startsWith('/admin')) {
      return { tourId: 'admin-portal', steps: adminTourSteps }
    }
    if (pathname.startsWith('/hiqor')) {
      return { tourId: 'hiqor-portal', steps: hiqorTourSteps }
    }
    if (pathname.startsWith('/sures')) {
      return { tourId: 'sures-portal', steps: suresTourSteps }
    }
    return null
  })()

  if (!portalConfig) return null

  return (
    <OnboardingTour
      tourId={portalConfig.tourId}
      steps={portalConfig.steps}
      autoStart={true}
    />
  )
}

/**
 * INTEGRATION CHECKLIST:
 *
 * 1. ✅ Add OnboardingTour component to your layout
 * 2. ✅ Add data-tour attributes to elements you want to highlight:
 *    - data-tour="dashboard"
 *    - data-tour="earnings"
 *    - data-tour="command-palette"
 *    - etc.
 * 3. ✅ Import pre-built tour steps or create custom ones
 * 4. ✅ Set autoStart={true} for first-time users
 * 5. ✅ Add tour reset button in settings (optional)
 * 6. ✅ Track completion with analytics (optional)
 *
 * IMPORTANT NOTES:
 * - Tour automatically saves completion to localStorage
 * - Each tour needs a unique tourId
 * - Elements must exist in DOM before tour starts (500ms delay built-in)
 * - Use data-tour attributes for reliable element targeting
 * - Tour is fully responsive and mobile-friendly
 * - Supports dark mode automatically
 * - Keyboard accessible (ESC to close, arrow keys to navigate)
 */
