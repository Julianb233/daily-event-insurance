"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Check, ChevronDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type RefreshInterval = 30 | 60 | 300 | 0 // seconds, 0 = off

interface RefreshIndicatorProps {
  lastUpdated: Date | null
  isRefreshing?: boolean
  onRefresh: () => void | Promise<void>
  autoRefreshInterval?: RefreshInterval
  onAutoRefreshChange?: (interval: RefreshInterval) => void
  className?: string
  showIntervalSelector?: boolean
}

const intervalOptions: { value: RefreshInterval; label: string }[] = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 300, label: '5 minutes' },
  { value: 0, label: 'Off' },
]

export function RefreshIndicator({
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  autoRefreshInterval = 0,
  onAutoRefreshChange,
  className = '',
  showIntervalSelector = true,
}: RefreshIndicatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [timeAgo, setTimeAgo] = useState<string>('')
  const [justRefreshed, setJustRefreshed] = useState(false)

  // Update "time ago" display
  useEffect(() => {
    if (!lastUpdated) {
      setTimeAgo('')
      return
    }

    const updateTimeAgo = () => {
      setTimeAgo(formatDistanceToNow(lastUpdated, { addSuffix: false }))
    }

    updateTimeAgo()
    const timer = setInterval(updateTimeAgo, 10000) // Update every 10 seconds

    return () => clearInterval(timer)
  }, [lastUpdated])

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefreshInterval === 0) return

    const timer = setInterval(() => {
      onRefresh()
    }, autoRefreshInterval * 1000)

    return () => clearInterval(timer)
  }, [autoRefreshInterval, onRefresh])

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    await onRefresh()
    setJustRefreshed(true)
    setTimeout(() => setJustRefreshed(false), 2000)
  }, [onRefresh])

  // Handle interval change
  const handleIntervalChange = (interval: RefreshInterval) => {
    onAutoRefreshChange?.(interval)
    setIsDropdownOpen(false)
  }

  const currentIntervalLabel = intervalOptions.find(
    (opt) => opt.value === autoRefreshInterval
  )?.label || 'Off'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Last Updated Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <AnimatePresence mode="wait">
          {justRefreshed ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-green-500"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-2 h-2 rounded-full ${
                isRefreshing
                  ? 'bg-blue-500 animate-pulse'
                  : autoRefreshInterval > 0
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`}
            />
          )}
        </AnimatePresence>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isRefreshing ? (
            'Updating...'
          ) : lastUpdated ? (
            <>
              Updated <span className="font-medium text-gray-900 dark:text-gray-100">{timeAgo}</span> ago
            </>
          ) : (
            'Not synced'
          )}
        </span>
      </div>

      {/* Refresh Button */}
      <motion.button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`
          p-2 rounded-lg border shadow-sm transition-colors
          ${isRefreshing
            ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
        whileTap={{ scale: 0.95 }}
        title="Refresh now"
      >
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
        </motion.div>
      </motion.button>

      {/* Auto-Refresh Interval Selector */}
      {showIntervalSelector && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Auto: <span className="font-medium text-gray-900 dark:text-gray-100">{currentIntervalLabel}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />

                {/* Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-20"
                >
                  {intervalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleIntervalChange(option.value)}
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors
                        ${autoRefreshInterval === option.value
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default RefreshIndicator
