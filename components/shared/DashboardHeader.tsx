"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import DateRangePicker, { DateRange, DateRangePreset } from "./DateRangePicker"
import ExportButton, { ExportFormat } from "./ExportButton"

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface DashboardHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  showDateRangePicker?: boolean
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange) => void
  dateRangePresets?: DateRangePreset[]
  showExport?: boolean
  exportFormats?: ExportFormat[]
  onExport?: (format: ExportFormat) => Promise<void>
  showRefresh?: boolean
  onRefresh?: () => Promise<void>
  isLoading?: boolean
  className?: string
  actions?: React.ReactNode
}

// ============================================================================
// Breadcrumb Component
// ============================================================================

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-2">
      <Link
        href="/"
        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// RefreshButton Component
// ============================================================================

interface RefreshButtonProps {
  onClick: () => Promise<void>
  isLoading: boolean
  disabled?: boolean
}

function RefreshButton({ onClick, isLoading, disabled }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleClick = async () => {
    if (isRefreshing || isLoading) return
    setIsRefreshing(true)
    try {
      await onClick()
    } finally {
      setIsRefreshing(false)
    }
  }

  const showSpinner = isRefreshing || isLoading

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || showSpinner}
      className={`
        flex items-center justify-center
        w-10 h-10
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-600
        rounded-xl
        text-gray-600 dark:text-gray-400
        hover:bg-gray-50 dark:hover:bg-gray-700
        hover:border-gray-400 dark:hover:border-gray-500
        hover:text-gray-900 dark:hover:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title="Refresh data"
    >
      <RefreshCw
        className={`w-4 h-4 ${showSpinner ? "animate-spin" : ""}`}
      />
    </button>
  )
}

// ============================================================================
// DashboardHeader Component
// ============================================================================

export default function DashboardHeader({
  title,
  subtitle,
  breadcrumbs,
  showDateRangePicker = false,
  dateRange = { start: null, end: null },
  onDateRangeChange,
  dateRangePresets,
  showExport = false,
  exportFormats = ["csv", "pdf", "excel"],
  onExport,
  showRefresh = false,
  onRefresh,
  isLoading = false,
  className = "",
  actions,
}: DashboardHeaderProps) {
  const handleDateRangeChange = useCallback(
    (range: DateRange) => {
      onDateRangeChange?.(range)
    },
    [onDateRangeChange]
  )

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (onExport) {
        await onExport(format)
      }
    },
    [onExport]
  )

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh()
    }
  }, [onRefresh])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mb-8 ${className}`}
    >
      {/* Top Section: Breadcrumb + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Title Section */}
        <div className="flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} />
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          {showDateRangePicker && onDateRangeChange && (
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              presets={dateRangePresets}
              maxDate={new Date()}
            />
          )}

          {/* Export Button */}
          {showExport && onExport && (
            <ExportButton
              onExport={handleExport}
              formats={exportFormats}
              disabled={isLoading}
            />
          )}

          {/* Refresh Button */}
          {showRefresh && onRefresh && (
            <RefreshButton
              onClick={handleRefresh}
              isLoading={isLoading}
            />
          )}

          {/* Custom Actions */}
          {actions}
        </div>
      </div>
    </motion.div>
  )
}

// Export types
export type { DateRange, DateRangePreset, ExportFormat }
