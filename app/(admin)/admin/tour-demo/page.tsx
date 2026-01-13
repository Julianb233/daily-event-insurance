"use client"

import { useState } from 'react'
import { OnboardingTour, useOnboardingTour, type TourStep } from '@/components/shared/OnboardingTour'
import { LayoutDashboard, DollarSign, Globe, Users, TrendingUp, Command } from 'lucide-react'

export default function TourDemoPage() {
  const [showTour, setShowTour] = useState(false)
  const { startTour, skipTour, resetTour, isTourCompleted } = useOnboardingTour('demo-tour')

  const demoSteps: TourStep[] = [
    {
      element: '[data-tour="demo-dashboard"]',
      title: '📊 Dashboard',
      description: 'This is your main dashboard where you can see all your key metrics at a glance.',
      side: 'bottom',
    },
    {
      element: '[data-tour="demo-earnings"]',
      title: '💰 Earnings',
      description: 'Track your commission from leads and microsites here. Real-time updates!',
      side: 'bottom',
    },
    {
      element: '[data-tour="demo-microsites"]',
      title: '🌐 Microsites',
      description: 'Manage partner microsites, setup fees, and customizations from this section.',
      side: 'bottom',
    },
    {
      element: '[data-tour="demo-partners"]',
      title: '👥 Partners',
      description: 'View and manage all your insurance partners and their contracts.',
      side: 'bottom',
    },
    {
      element: '[data-tour="demo-leads"]',
      title: '📈 Leads',
      description: 'Monitor incoming leads and track them through your sales funnel.',
      side: 'bottom',
    },
    {
      element: '[data-tour="demo-command"]',
      title: '⚡ Quick Access',
      description: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to access quick navigation anywhere!',
      side: 'left',
    },
  ]

  const handleStartTour = () => {
    if (isTourCompleted()) {
      resetTour()
      setTimeout(() => {
        setShowTour(true)
      }, 100)
    } else {
      setShowTour(true)
    }
  }

  const handleCompleteTour = () => {
    console.log('Tour completed!')
    setShowTour(false)
  }

  const handleSkipTour = () => {
    console.log('Tour skipped')
    setShowTour(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      {/* Tour Component */}
      {showTour && (
        <OnboardingTour
          tourId="demo-tour"
          steps={demoSteps}
          autoStart={true}
          onComplete={handleCompleteTour}
          onSkip={handleSkipTour}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Onboarding Tour Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test the onboarding tour component with this interactive demo.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
            Tour Controls
          </h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleStartTour}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {isTourCompleted() ? 'Restart Tour' : 'Start Tour'}
            </button>
            <button
              onClick={() => {
                skipTour()
                setShowTour(false)
              }}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Mark as Complete
            </button>
            <button
              onClick={() => {
                resetTour()
                setShowTour(false)
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Tour
            </button>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Status:</strong>{' '}
            {isTourCompleted() ? (
              <span className="text-teal-600 dark:text-teal-400">✓ Completed</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">○ Not Started</span>
            )}
          </div>
        </div>

        {/* Demo Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Dashboard */}
          <div
            data-tour="demo-dashboard"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Dashboard
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              View your earnings and key metrics at a glance.
            </p>
          </div>

          {/* Earnings */}
          <div
            data-tour="demo-earnings"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                My Earnings
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your commission from leads and microsites.
            </p>
          </div>

          {/* Microsites */}
          <div
            data-tour="demo-microsites"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-lg">
                <Globe className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Microsites
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage partner microsites and setup fees.
            </p>
          </div>

          {/* Partners */}
          <div
            data-tour="demo-partners"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
                <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Partners
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              View and manage all your insurance partners.
            </p>
          </div>

          {/* Leads */}
          <div
            data-tour="demo-leads"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Leads
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor incoming leads and conversion rates.
            </p>
          </div>

          {/* Command Palette */}
          <div
            data-tour="demo-command"
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium hover:shadow-premium-hover transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Command className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Quick Navigation
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Press ⌘K to quickly navigate anywhere.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-3">
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-teal-800 dark:text-teal-200">
            <li>Click "Start Tour" to begin the onboarding experience</li>
            <li>Use "Next" and "Back" buttons to navigate through steps</li>
            <li>Press ESC or click "Done" to complete the tour</li>
            <li>The tour will remember your completion status</li>
            <li>Use "Reset Tour" to clear completion and try again</li>
            <li>Open browser DevTools to see console logs</li>
          </ol>
        </div>

        {/* Implementation Notes */}
        <div className="mt-8 bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Implementation Notes
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>✓ Component uses driver.js library for tour functionality</li>
            <li>✓ Completion status is saved to localStorage</li>
            <li>✓ Tour is fully responsive and mobile-friendly</li>
            <li>✓ Supports dark mode automatically</li>
            <li>✓ Keyboard accessible (ESC, arrows, Enter)</li>
            <li>✓ Custom styling matches HiQor B2B theme</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
