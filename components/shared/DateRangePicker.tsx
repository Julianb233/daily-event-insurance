"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfDay,
  subDays,
  startOfYear,
} from "date-fns"

// ============================================================================
// Types
// ============================================================================

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePreset {
  label: string
  getValue: () => DateRange
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: DateRangePreset[]
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  className?: string
  disabled?: boolean
}

// ============================================================================
// Default Presets
// ============================================================================

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = startOfDay(new Date())
      return { start: today, end: today }
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const end = startOfDay(new Date())
      const start = subDays(end, 6)
      return { start, end }
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const end = startOfDay(new Date())
      const start = subDays(end, 29)
      return { start, end }
    },
  },
  {
    label: "Last 90 days",
    getValue: () => {
      const end = startOfDay(new Date())
      const start = subDays(end, 89)
      return { start, end }
    },
  },
  {
    label: "This Year",
    getValue: () => {
      const now = new Date()
      const start = startOfYear(now)
      const end = startOfDay(now)
      return { start, end }
    },
  },
  {
    label: "Custom",
    getValue: () => ({ start: null, end: null }),
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let current = calendarStart

  while (isBefore(current, calendarEnd) || isSameDay(current, calendarEnd)) {
    days.push(current)
    current = addDays(current, 1)
  }

  return days
}

function formatDateRange(range: DateRange): string {
  if (!range.start && !range.end) return ""
  if (range.start && !range.end) return format(range.start, "MMM d, yyyy")
  if (!range.start && range.end) return format(range.end, "MMM d, yyyy")

  if (range.start && range.end) {
    if (isSameDay(range.start, range.end)) {
      return format(range.start, "MMM d, yyyy")
    }
    return `${format(range.start, "MMM d")} - ${format(range.end, "MMM d, yyyy")}`
  }

  return ""
}

// ============================================================================
// Calendar Month Component
// ============================================================================

interface CalendarMonthProps {
  month: Date
  range: DateRange
  hoverDate: Date | null
  onDateClick: (date: Date) => void
  onDateHover: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
}

function CalendarMonth({
  month,
  range,
  hoverDate,
  onDateClick,
  onDateHover,
  minDate,
  maxDate,
}: CalendarMonthProps) {
  const days = getCalendarDays(month)
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true
    if (maxDate && isAfter(date, startOfDay(maxDate))) return true
    return false
  }

  const isDateInRange = (date: Date): boolean => {
    if (!range.start) return false

    const rangeEnd = range.end || hoverDate

    if (!rangeEnd) return isSameDay(date, range.start)

    const effectiveStart = isBefore(range.start, rangeEnd) ? range.start : rangeEnd
    const effectiveEnd = isBefore(range.start, rangeEnd) ? rangeEnd : range.start

    return isWithinInterval(date, { start: effectiveStart, end: effectiveEnd })
  }

  const isRangeStart = (date: Date): boolean => {
    if (!range.start) return false
    return isSameDay(date, range.start)
  }

  const isRangeEnd = (date: Date): boolean => {
    if (!range.end && !hoverDate) return false
    const end = range.end || hoverDate
    return end ? isSameDay(date, end) : false
  }

  return (
    <div className="p-4">
      {/* Month Header */}
      <div className="text-center font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {format(month, "MMMM yyyy")}
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, month)
          const isDisabled = isDateDisabled(date)
          const inRange = isDateInRange(date)
          const isStart = isRangeStart(date)
          const isEnd = isRangeEnd(date)
          const isToday = isSameDay(date, new Date())

          return (
            <button
              key={index}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onDateClick(date)}
              onMouseEnter={() => !isDisabled && onDateHover(date)}
              onMouseLeave={() => onDateHover(null)}
              className={`
                relative h-9 text-sm rounded-lg transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
                ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600" : ""}
                ${isDisabled ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "cursor-pointer"}
                ${inRange && !isStart && !isEnd ? "bg-teal-100 dark:bg-teal-900/30" : ""}
                ${isStart || isEnd ? "bg-teal-500 text-white font-semibold" : ""}
                ${!inRange && isCurrentMonth && !isDisabled ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
                ${isToday && !isStart && !isEnd ? "ring-1 ring-teal-500" : ""}
              `}
            >
              {format(date, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Main DateRangePicker Component
// ============================================================================

export default function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  minDate,
  maxDate,
  placeholder = "Select date range",
  className = "",
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [leftMonth, setLeftMonth] = useState(() => value.start || new Date())
  const [rightMonth, setRightMonth] = useState(() =>
    addMonths(value.start || new Date(), 1)
  )
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [tempRange, setTempRange] = useState<DateRange>(value)
  const [activePreset, setActivePreset] = useState<string | null>(null)

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
        setTempRange(value)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [value])

  // Sync temp range with value
  useEffect(() => {
    setTempRange(value)
  }, [value])

  const handleDateClick = useCallback((date: Date) => {
    setTempRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        // Start new selection
        return { start: date, end: null }
      } else {
        // Complete the selection
        if (isBefore(date, prev.start)) {
          return { start: date, end: prev.start }
        }
        return { start: prev.start, end: date }
      }
    })
    setActivePreset(null)
  }, [])

  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      if (preset.label === "Custom") {
        setActivePreset("Custom")
        return
      }

      const range = preset.getValue()
      setTempRange(range)
      setActivePreset(preset.label)

      if (range.start) {
        setLeftMonth(range.start)
        setRightMonth(addMonths(range.start, 1))
      }
    },
    []
  )

  const handleApply = () => {
    onChange(tempRange)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempRange(value)
    setIsOpen(false)
  }

  const handleClear = () => {
    const emptyRange = { start: null, end: null }
    setTempRange(emptyRange)
    onChange(emptyRange)
    setActivePreset(null)
  }

  const navigateLeft = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLeftMonth((prev) => subMonths(prev, 1))
      setRightMonth((prev) => subMonths(prev, 1))
    } else {
      setLeftMonth((prev) => addMonths(prev, 1))
      setRightMonth((prev) => addMonths(prev, 1))
    }
  }

  const displayValue = formatDateRange(value)

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-xl
          text-sm font-medium
          text-gray-900 dark:text-gray-100
          hover:border-gray-400 dark:hover:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "ring-2 ring-teal-500 border-transparent" : ""}
        `}
      >
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className={displayValue ? "" : "text-gray-400 dark:text-gray-500"}>
          {displayValue || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex">
              {/* Presets Panel */}
              <div className="w-40 border-r border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Quick Select
                </div>
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`
                        w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                        ${
                          activePreset === preset.label
                            ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Panel */}
              <div>
                {/* Navigation Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => navigateLeft("prev")}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  <div className="flex-1" />

                  <button
                    type="button"
                    onClick={() => navigateLeft("next")}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Calendars */}
                <div className="flex">
                  <CalendarMonth
                    month={leftMonth}
                    range={tempRange}
                    hoverDate={hoverDate}
                    onDateClick={handleDateClick}
                    onDateHover={setHoverDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                  <div className="w-px bg-gray-200 dark:bg-gray-700" />
                  <CalendarMonth
                    month={rightMonth}
                    range={tempRange}
                    hoverDate={hoverDate}
                    onDateClick={handleDateClick}
                    onDateHover={setHoverDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tempRange.start && tempRange.end ? (
                      <span>
                        {format(tempRange.start, "MMM d, yyyy")} -{" "}
                        {format(tempRange.end, "MMM d, yyyy")}
                      </span>
                    ) : tempRange.start ? (
                      <span>Select end date</span>
                    ) : (
                      <span>Select start date</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(value.start || value.end) && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={!tempRange.start}
                      className="px-4 py-1.5 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export presets for external use (DateRangePreset is already exported above)
export { DEFAULT_PRESETS }
