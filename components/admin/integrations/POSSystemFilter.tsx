"use client"

import { cn } from "@/lib/utils"

export type POSSystem =
  | "mindbody"
  | "pike13"
  | "clubready"
  | "marianatek"
  | "zenoti"
  | "vagaro"
  | "other"

interface POSSystemFilterProps {
  selectedPOS: POSSystem | null
  onChange: (pos: POSSystem | null) => void
  counts?: Record<POSSystem, number>
  className?: string
}

const posSystemInfo: Record<
  POSSystem,
  {
    label: string
    shortLabel: string
    color: string
    bgColor: string
  }
> = {
  mindbody: {
    label: "Mindbody",
    shortLabel: "MB",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50",
  },
  pike13: {
    label: "Pike13",
    shortLabel: "P13",
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50",
  },
  clubready: {
    label: "ClubReady",
    shortLabel: "CR",
    color: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50",
  },
  marianatek: {
    label: "Mariana Tek",
    shortLabel: "MT",
    color: "text-pink-700 dark:text-pink-300",
    bgColor: "bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50",
  },
  zenoti: {
    label: "Zenoti",
    shortLabel: "ZN",
    color: "text-indigo-700 dark:text-indigo-300",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50",
  },
  vagaro: {
    label: "Vagaro",
    shortLabel: "VG",
    color: "text-teal-700 dark:text-teal-300",
    bgColor: "bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50",
  },
  other: {
    label: "Other",
    shortLabel: "OT",
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
  },
}

const posSystemsOrder: POSSystem[] = [
  "mindbody",
  "pike13",
  "clubready",
  "marianatek",
  "zenoti",
  "vagaro",
  "other",
]

export function POSSystemFilter({
  selectedPOS,
  onChange,
  counts = {} as Record<POSSystem, number>,
  className,
}: POSSystemFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
          selectedPOS === null
            ? "bg-violet-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        All POS
      </button>

      {posSystemsOrder.map((pos) => {
        const info = posSystemInfo[pos]
        const count = counts[pos] || 0
        const isSelected = selectedPOS === pos

        return (
          <button
            key={pos}
            onClick={() => onChange(isSelected ? null : pos)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
              isSelected
                ? "bg-violet-600 text-white"
                : info.bgColor + " " + info.color
            )}
          >
            <span>{info.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-white/50 dark:bg-black/20 text-inherit opacity-75"
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Compact dropdown version for smaller spaces
export function POSSystemSelect({
  selectedPOS,
  onChange,
  className,
}: {
  selectedPOS: POSSystem | null
  onChange: (pos: POSSystem | null) => void
  className?: string
}) {
  return (
    <select
      value={selectedPOS || ""}
      onChange={(e) => onChange(e.target.value as POSSystem || null)}
      className={cn(
        "px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent",
        className
      )}
    >
      <option value="">All POS Systems</option>
      {posSystemsOrder.map((pos) => (
        <option key={pos} value={pos}>
          {posSystemInfo[pos].label}
        </option>
      ))}
    </select>
  )
}
