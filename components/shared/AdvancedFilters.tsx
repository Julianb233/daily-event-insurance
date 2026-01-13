"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Save,
  Calendar,
  Check,
  Loader2,
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

// ============================================================================
// Types
// ============================================================================

export interface FilterConfig {
  id: string
  label: string
  type: "text" | "select" | "multiselect" | "daterange" | "numberrange"
  options?: { value: string; label: string }[] // For select/multiselect
  placeholder?: string
}

export interface FilterValues {
  [key: string]:
    | string
    | string[]
    | { start: Date | null; end: Date | null }
    | { min: number | null; max: number | null }
    | undefined
}

export interface FilterPreset {
  id: string
  name: string
  values: FilterValues
}

export interface AdvancedFiltersProps {
  filters: FilterConfig[]
  values: FilterValues
  onChange: (values: FilterValues) => void
  onClear: () => void
  savedPresets?: FilterPreset[]
  onSavePreset?: (name: string, values: FilterValues) => void
  onLoadPreset?: (preset: FilterPreset) => void
  syncWithUrl?: boolean // Enable URL synchronization
  className?: string
}

// ============================================================================
// Date Range Presets
// ============================================================================

const DATE_PRESETS = [
  { label: "Today", getValue: () => ({ start: new Date(), end: new Date() }) },
  {
    label: "Last 7 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return { start, end }
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return { start, end }
    },
  },
  {
    label: "Last 90 days",
    getValue: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 90)
      return { start, end }
    },
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start, end }
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start, end }
    },
  },
]

// ============================================================================
// Utility Functions
// ============================================================================

function formatDate(date: Date | null): string {
  if (!date) return ""
  return date.toISOString().split("T")[0]
}

function parseDate(dateString: string): Date | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

function serializeFilterValues(values: FilterValues): string {
  const serialized: Record<string, string> = {}

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return

    if (Array.isArray(value)) {
      if (value.length > 0) {
        serialized[key] = value.join(",")
      }
    } else if (typeof value === "object") {
      if ("start" in value && "end" in value) {
        // Date range
        const start = value.start ? formatDate(value.start) : ""
        const end = value.end ? formatDate(value.end) : ""
        if (start || end) {
          serialized[key] = `${start}:${end}`
        }
      } else if ("min" in value && "max" in value) {
        // Number range
        const min = value.min !== null ? String(value.min) : ""
        const max = value.max !== null ? String(value.max) : ""
        if (min || max) {
          serialized[key] = `${min}:${max}`
        }
      }
    } else {
      serialized[key] = String(value)
    }
  })

  return new URLSearchParams(serialized).toString()
}

function deserializeFilterValues(
  searchParams: URLSearchParams,
  filters: FilterConfig[]
): FilterValues {
  const values: FilterValues = {}

  filters.forEach((filter) => {
    const param = searchParams.get(filter.id)
    if (!param) return

    switch (filter.type) {
      case "text":
        values[filter.id] = param
        break
      case "select":
        values[filter.id] = param
        break
      case "multiselect":
        values[filter.id] = param.split(",").filter(Boolean)
        break
      case "daterange": {
        const [start, end] = param.split(":")
        values[filter.id] = {
          start: parseDate(start),
          end: parseDate(end),
        }
        break
      }
      case "numberrange": {
        const [min, max] = param.split(":")
        values[filter.id] = {
          min: min ? Number(min) : null,
          max: max ? Number(max) : null,
        }
        break
      }
    }
  })

  return values
}

function countActiveFilters(values: FilterValues): number {
  let count = 0

  Object.values(values).forEach((value) => {
    if (value === undefined || value === null || value === "") return

    if (Array.isArray(value)) {
      if (value.length > 0) count++
    } else if (typeof value === "object" && value !== null) {
      if ("start" in value && "end" in value) {
        const dateRange = value as { start: Date | null; end: Date | null }
        if (dateRange.start || dateRange.end) count++
      } else if ("min" in value && "max" in value) {
        const numRange = value as { min: number | null; max: number | null }
        if (numRange.min !== null || numRange.max !== null) count++
      }
    } else {
      count++
    }
  })

  return count
}

// ============================================================================
// Sub-Components
// ============================================================================

function FilterText({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {config.label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder || "Search..."}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedLabel = config.options?.find((opt) => opt.value === value)?.label

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {config.label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <span className={!selectedLabel ? "text-gray-400" : ""}>
            {selectedLabel || config.placeholder || "Select..."}
          </span>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
              {config.options?.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FilterMultiSelect({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedCount = value?.length || 0

  const toggleValue = (optionValue: string) => {
    const current = value || []
    if (current.includes(optionValue)) {
      onChange(current.filter((v) => v !== optionValue))
    } else {
      onChange([...current, optionValue])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {config.label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <span className={selectedCount === 0 ? "text-gray-400" : ""}>
            {selectedCount === 0
              ? config.placeholder || "Select..."
              : `${selectedCount} selected`}
          </span>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
              {config.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value?.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FilterDateRange({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: { start: Date | null; end: Date | null }
  onChange: (value: { start: Date | null; end: Date | null }) => void
}) {
  const currentValue = value || { start: null, end: null }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {config.label}
      </label>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={currentValue.start ? formatDate(currentValue.start) : ""}
              onChange={(e) =>
                onChange({
                  ...currentValue,
                  start: parseDate(e.target.value),
                })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={currentValue.end ? formatDate(currentValue.end) : ""}
              onChange={(e) =>
                onChange({
                  ...currentValue,
                  end: parseDate(e.target.value),
                })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.getValue())}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterNumberRange({
  config,
  value,
  onChange,
}: {
  config: FilterConfig
  value: { min: number | null; max: number | null }
  onChange: (value: { min: number | null; max: number | null }) => void
}) {
  const currentValue = value || { min: null, max: null }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {config.label}
      </label>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={currentValue.min !== null ? currentValue.min : ""}
          onChange={(e) =>
            onChange({
              ...currentValue,
              min: e.target.value ? Number(e.target.value) : null,
            })
          }
          placeholder="Min"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />

        <input
          type="number"
          value={currentValue.max !== null ? currentValue.max : ""}
          onChange={(e) =>
            onChange({
              ...currentValue,
              max: e.target.value ? Number(e.target.value) : null,
            })
          }
          placeholder="Max"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function AdvancedFilters({
  filters,
  values,
  onChange,
  onClear,
  savedPresets = [],
  onSavePreset,
  onLoadPreset,
  syncWithUrl = false,
  className = "",
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [showPresetMenu, setShowPresetMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCount = countActiveFilters(values)

  // Sync with URL on mount
  useEffect(() => {
    if (syncWithUrl && searchParams) {
      const urlValues = deserializeFilterValues(searchParams, filters)
      if (Object.keys(urlValues).length > 0) {
        onChange(urlValues)
        setIsExpanded(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only on mount

  // Update URL when values change
  useEffect(() => {
    if (syncWithUrl && typeof window !== "undefined") {
      const queryString = serializeFilterValues(values)
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname

      window.history.replaceState(null, "", newUrl)
    }
  }, [values, syncWithUrl])

  const handleFilterChange = useCallback(
    (filterId: string, value: any) => {
      onChange({
        ...values,
        [filterId]: value,
      })
    },
    [values, onChange]
  )

  const handleSavePreset = async () => {
    if (!presetName.trim() || !onSavePreset) return

    setIsSaving(true)
    try {
      await onSavePreset(presetName.trim(), values)
      setPresetName("")
      setShowSaveModal(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    onClear()
    if (syncWithUrl && typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
              {activeCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {savedPresets.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Presets
                <ChevronDown className="inline-block ml-1 h-3 w-3" />
              </button>

              {showPresetMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPresetMenu(false)}
                  />
                  <div className="absolute right-0 z-20 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {savedPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onLoadPreset?.(preset)
                          setShowPresetMenu(false)
                          setIsExpanded(true)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {onSavePreset && activeCount > 0 && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          )}

          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Grid */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => {
              const value = values[filter.id]

              switch (filter.type) {
                case "text":
                  return (
                    <FilterText
                      key={filter.id}
                      config={filter}
                      value={value as string}
                      onChange={(v) => handleFilterChange(filter.id, v)}
                    />
                  )
                case "select":
                  return (
                    <FilterSelect
                      key={filter.id}
                      config={filter}
                      value={value as string}
                      onChange={(v) => handleFilterChange(filter.id, v)}
                    />
                  )
                case "multiselect":
                  return (
                    <FilterMultiSelect
                      key={filter.id}
                      config={filter}
                      value={value as string[]}
                      onChange={(v) => handleFilterChange(filter.id, v)}
                    />
                  )
                case "daterange":
                  return (
                    <FilterDateRange
                      key={filter.id}
                      config={filter}
                      value={
                        value as { start: Date | null; end: Date | null }
                      }
                      onChange={(v) => handleFilterChange(filter.id, v)}
                    />
                  )
                case "numberrange":
                  return (
                    <FilterNumberRange
                      key={filter.id}
                      config={filter}
                      value={value as { min: number | null; max: number | null }}
                      onChange={(v) => handleFilterChange(filter.id, v)}
                    />
                  )
                default:
                  return null
              }
            })}
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {showSaveModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSaveModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Save Filter Preset
            </h3>

            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim() || isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Preset
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
