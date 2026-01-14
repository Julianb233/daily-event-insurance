"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  ChevronDown,
  Loader2,
  Check,
} from "lucide-react"

// ============================================================================
// Types
// ============================================================================

export type ExportFormat = "csv" | "pdf" | "excel"

export interface ExportOption {
  format: ExportFormat
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>
  formats?: ExportFormat[]
  disabled?: boolean
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

// ============================================================================
// Default Export Options
// ============================================================================

const EXPORT_OPTIONS: Record<ExportFormat, ExportOption> = {
  csv: {
    format: "csv",
    label: "CSV",
    description: "Comma-separated values",
    icon: FileText,
  },
  pdf: {
    format: "pdf",
    label: "PDF",
    description: "Portable document format",
    icon: File,
  },
  excel: {
    format: "excel",
    label: "Excel",
    description: "Microsoft Excel spreadsheet",
    icon: FileSpreadsheet,
  },
}

// ============================================================================
// ExportButton Component
// ============================================================================

export default function ExportButton({
  onExport,
  formats = ["csv", "pdf", "excel"],
  disabled = false,
  className = "",
  variant = "default",
  size = "md",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        buttonRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset success state after delay
  useEffect(() => {
    if (exportSuccess) {
      const timer = setTimeout(() => setExportSuccess(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [exportSuccess])

  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return

    setIsExporting(true)
    setExportingFormat(format)
    setExportSuccess(null)

    try {
      await onExport(format)
      setExportSuccess(format)
      setIsOpen(false)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
      setExportingFormat(null)
    }
  }

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5",
  }

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  // Variant classes
  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-gray-100
      hover:bg-gray-50 dark:hover:bg-gray-700
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    outline: `
      bg-transparent
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
    `,
    ghost: `
      bg-transparent
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
    `,
  }

  const availableOptions = formats.map((format) => EXPORT_OPTIONS[format])

  // If only one format, show single button
  if (formats.length === 1) {
    const option = availableOptions[0]
    const Icon = option.icon

    return (
      <button
        type="button"
        disabled={disabled || isExporting}
        onClick={() => handleExport(option.format)}
        className={`
          flex items-center ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-xl font-medium
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isExporting ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : exportSuccess === option.format ? (
          <Check className={`${iconSizes[size]} text-green-500`} />
        ) : (
          <Icon className={iconSizes[size]} />
        )}
        <span>Export {option.label}</span>
      </button>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled || isExporting}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-xl font-medium
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? "ring-2 ring-teal-500" : ""}
        `}
      >
        {isExporting ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : exportSuccess ? (
          <Check className={`${iconSizes[size]} text-green-500`} />
        ) : (
          <Download className={iconSizes[size]} />
        )}
        <span>Export</span>
        <ChevronDown
          className={`${iconSizes[size]} transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                Export As
              </div>
              <div className="space-y-1">
                {availableOptions.map((option) => {
                  const Icon = option.icon
                  const isCurrentlyExporting = exportingFormat === option.format
                  const isSuccess = exportSuccess === option.format

                  return (
                    <button
                      key={option.format}
                      type="button"
                      disabled={isExporting}
                      onClick={() => handleExport(option.format)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-left text-sm
                        transition-colors
                        ${
                          isCurrentlyExporting
                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {isCurrentlyExporting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                        ) : isSuccess ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
