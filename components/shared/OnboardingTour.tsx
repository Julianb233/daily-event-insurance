"use client"

import { useEffect, useRef, useState } from 'react'
import { driver, type DriveStep, type Driver, type Config } from 'driver.js'
import 'driver.js/dist/driver.css'

// Export types
export type { TourStep, OnboardingTourProps, UseOnboardingTourReturn } from './OnboardingTour.types'
export type { TourPopoverSide, PortalType, TourStatus, TourAnalyticsEvent } from './OnboardingTour.types'

// Re-import for local use
import type { TourStep, OnboardingTourProps } from './OnboardingTour.types'

export function OnboardingTour({
  tourId,
  steps,
  onComplete,
  onSkip,
  autoStart = false,
}: OnboardingTourProps) {
  const driverRef = useRef<Driver | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Check if tour has been completed
    if (typeof window === 'undefined') return

    const storageKey = `onboarding-tour-${tourId}`
    const completed = localStorage.getItem(storageKey)

    if (completed === 'true') {
      setIsCompleted(true)
      return
    }

    // Wait for elements to be in the DOM
    const initTimer = setTimeout(() => {
      // Check if all tour elements exist
      const allElementsExist = steps.every((step) => {
        const element = document.querySelector(step.element)
        return element !== null
      })

      if (!allElementsExist) {
        console.warn('Some tour elements are not yet in the DOM')
        return
      }

      // Initialize driver.js
      const driverSteps: DriveStep[] = steps.map((step, index) => ({
        element: step.element,
        popover: {
          title: step.title,
          description: step.description,
          side: step.side || 'bottom',
          align: 'start',
        },
      }))

      const driverConfig: Config = {
        showProgress: true,
        steps: driverSteps,
        progressText: '{{current}} of {{total}}',
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        doneBtnText: 'Done',
        onDestroyed: () => {
          // Check if tour was completed (not just closed)
          const currentStep = driverRef.current?.getActiveIndex() ?? 0
          const isLastStep = currentStep === steps.length - 1

          if (isLastStep) {
            localStorage.setItem(storageKey, 'true')
            setIsCompleted(true)
            onComplete?.()
          }
        },
        onDestroyStarted: () => {
          // Allow destruction
          driverRef.current?.destroy()
        },
      }

      driverRef.current = driver(driverConfig)

      // Auto-start if enabled
      if (autoStart) {
        // Small delay to ensure smooth rendering
        setTimeout(() => {
          driverRef.current?.drive()
        }, 300)
      }
    }, 500) // Wait for DOM to settle

    return () => {
      clearTimeout(initTimer)
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [tourId, steps, autoStart, onComplete])

  // Method to manually start the tour
  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.drive()
    }
  }

  // Method to skip the tour
  const skipTour = () => {
    const storageKey = `onboarding-tour-${tourId}`
    localStorage.setItem(storageKey, 'true')
    setIsCompleted(true)
    onSkip?.()
    if (driverRef.current) {
      driverRef.current.destroy()
    }
  }

  // Expose methods for parent components
  useEffect(() => {
    // Attach methods to window for external access if needed
    if (typeof window !== 'undefined') {
      ;(window as any)[`startTour_${tourId}`] = startTour
      ;(window as any)[`skipTour_${tourId}`] = skipTour
    }
  }, [tourId])

  // Don't render anything - driver.js handles the UI
  return null
}

// Pre-built tours for each portal

export const adminTourSteps: TourStep[] = [
  {
    element: '[data-tour="dashboard"]',
    title: '📊 Dashboard Overview',
    description: 'View your earnings, commissions, and key metrics at a glance. This is your central hub for all activity.',
    side: 'bottom',
  },
  {
    element: '[data-tour="earnings"]',
    title: '💰 My Earnings',
    description: 'Track your commission from leads and microsites. See real-time updates on your earnings and payouts.',
    side: 'bottom',
  },
  {
    element: '[data-tour="microsites"]',
    title: '🌐 Microsites Management',
    description: 'Manage partner microsites, setup fees, and customizations. Each microsite can be branded for your partners.',
    side: 'bottom',
  },
  {
    element: '[data-tour="partners"]',
    title: '👥 Partner Management',
    description: 'View and manage all your insurance partners, their contracts, and commission structures.',
    side: 'bottom',
  },
  {
    element: '[data-tour="leads"]',
    title: '📈 Lead Pipeline',
    description: 'Monitor incoming leads, conversion rates, and track them through the sales funnel.',
    side: 'bottom',
  },
  {
    element: '[data-tour="command-palette"]',
    title: '⚡ Quick Navigation',
    description: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to quickly navigate anywhere in the portal. Your productivity superpower!',
    side: 'bottom',
  },
]

export const hiqorTourSteps: TourStep[] = [
  {
    element: '[data-tour="dashboard"]',
    title: '📊 Dashboard',
    description: 'Welcome to your HiQor dashboard. Monitor policy performance, claims, and key metrics.',
    side: 'bottom',
  },
  {
    element: '[data-tour="policies"]',
    title: '📄 Policy Management',
    description: 'View, search, and manage all active and expired policies. Export reports and track renewals.',
    side: 'bottom',
  },
  {
    element: '[data-tour="claims"]',
    title: '🚨 Claims Processing',
    description: 'Handle incoming claims, track their status, and manage approvals or rejections.',
    side: 'bottom',
  },
  {
    element: '[data-tour="call-center"]',
    title: '📞 Call Center',
    description: 'AI-powered call center with real-time transcription and automated claim intake.',
    side: 'bottom',
  },
  {
    element: '[data-tour="sync"]',
    title: '🔄 Sync Status',
    description: 'Monitor data synchronization with the admin portal. View sync logs and resolve conflicts.',
    side: 'bottom',
  },
  {
    element: '[data-tour="command-palette"]',
    title: '⚡ Quick Access',
    description: 'Use Cmd+K or Ctrl+K for instant navigation and quick actions.',
    side: 'bottom',
  },
]

export const suresTourSteps: TourStep[] = [
  {
    element: '[data-tour="dashboard"]',
    title: '📊 Dashboard',
    description: 'Your Sures Insurance dashboard. Track policies, claims, and business metrics.',
    side: 'bottom',
  },
  {
    element: '[data-tour="policies"]',
    title: '📄 Policies',
    description: 'Manage all insurance policies, track renewals, and generate policy documents.',
    side: 'bottom',
  },
  {
    element: '[data-tour="claims"]',
    title: '🚨 Claims',
    description: 'Process and manage insurance claims. View claim history and settlement status.',
    side: 'bottom',
  },
  {
    element: '[data-tour="reports"]',
    title: '📈 Reports & Analytics',
    description: 'Generate comprehensive reports on policies, claims, and financial performance.',
    side: 'bottom',
  },
  {
    element: '[data-tour="sync"]',
    title: '🔄 Data Sync',
    description: 'Keep your data synchronized with the central admin portal. Monitor sync health.',
    side: 'bottom',
  },
  {
    element: '[data-tour="command-palette"]',
    title: '⚡ Keyboard Shortcuts',
    description: 'Press Cmd+K or Ctrl+K to access the command palette for fast navigation.',
    side: 'bottom',
  },
]

// Utility hook to programmatically start a tour
export function useOnboardingTour(tourId: string) {
  const startTour = () => {
    if (typeof window !== 'undefined') {
      const startFn = (window as any)[`startTour_${tourId}`]
      if (startFn) startFn()
    }
  }

  const skipTour = () => {
    if (typeof window !== 'undefined') {
      const skipFn = (window as any)[`skipTour_${tourId}`]
      if (skipFn) skipFn()
    }
  }

  const resetTour = () => {
    if (typeof window !== 'undefined') {
      const storageKey = `onboarding-tour-${tourId}`
      localStorage.removeItem(storageKey)
    }
  }

  const isTourCompleted = () => {
    if (typeof window !== 'undefined') {
      const storageKey = `onboarding-tour-${tourId}`
      return localStorage.getItem(storageKey) === 'true'
    }
    return false
  }

  return {
    startTour,
    skipTour,
    resetTour,
    isTourCompleted,
  }
}
