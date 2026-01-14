"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

interface HeatmapData {
  day: number // 0-6 (Sunday-Saturday)
  hour: number // 0-23
  value: number
  label?: string
}

interface HeatmapChartProps {
  data: HeatmapData[]
  colorScale?: string[]
  maxValue?: number
  title?: string
  valueLabel?: string
  onCellClick?: (data: HeatmapData) => void
  className?: string
  showLegend?: boolean
}

// Predefined color scales
export const blueScale = ["#f0f9ff", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7"]
export const greenScale = ["#f0fdf4", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a"]
export const violetScale = ["#faf5ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#7c3aed"]
export const amberScale = ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b"]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface TooltipData {
  x: number
  y: number
  data: HeatmapData
}

export default function HeatmapChart({
  data,
  colorScale = violetScale,
  maxValue,
  title,
  valueLabel = "interactions",
  onCellClick,
  className,
  showLegend = true,
}: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapData>()
    data.forEach((item) => {
      map.set(`${item.day}-${item.hour}`, item)
    })
    return map
  }, [data])

  // Calculate max value for scaling
  const calculatedMaxValue = useMemo(() => {
    return maxValue ?? Math.max(...data.map((d) => d.value), 1)
  }, [data, maxValue])

  // Get color based on value
  const getColor = (value: number): string => {
    if (value === 0) return colorScale[0]
    const percentage = Math.min(value / calculatedMaxValue, 1)
    const index = Math.min(
      Math.floor(percentage * (colorScale.length - 1)) + 1,
      colorScale.length - 1
    )
    return colorScale[index]
  }

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    cellData: HeatmapData
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: cellData,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const handleClick = (cellData: HeatmapData) => {
    if (onCellClick) {
      onCellClick(cellData)
    }
  }

  const formatHour = (hour: number): string => {
    if (hour === 0) return "12a"
    if (hour === 12) return "12p"
    if (hour < 12) return `${hour}a`
    return `${hour - 12}p`
  }

  return (
    <div className={cn("relative", className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex ml-12 mb-1">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-[10px] text-gray-500 dark:text-gray-400"
              >
                {hour % 3 === 0 ? formatHour(hour) : ""}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-1">
                {/* Day label */}
                <div className="w-10 text-right pr-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {day}
                </div>

                {/* Hour cells */}
                <div className="flex flex-1 gap-[2px]">
                  {HOURS.map((hour) => {
                    const cellData = dataMap.get(`${dayIndex}-${hour}`) || {
                      day: dayIndex,
                      hour,
                      value: 0,
                    }

                    return (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className={cn(
                          "flex-1 aspect-square rounded-sm transition-all duration-150",
                          "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500",
                          onCellClick && "cursor-pointer"
                        )}
                        style={{ backgroundColor: getColor(cellData.value) }}
                        onMouseEnter={(e) => handleMouseEnter(e, cellData)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(cellData)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {colorScale.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="font-medium">
              {tooltip.data.label ||
                `${tooltip.data.value} ${valueLabel}`}
            </div>
            <div className="text-xs text-gray-300 dark:text-gray-400">
              {DAYS[tooltip.data.day]} {formatHour(tooltip.data.hour)} -{" "}
              {formatHour((tooltip.data.hour + 1) % 24)}
            </div>
          </div>
          <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 -translate-x-1/2" />
        </div>
      )}
    </div>
  )
}
