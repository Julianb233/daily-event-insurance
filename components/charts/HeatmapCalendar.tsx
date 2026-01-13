"use client"

import { useState, useMemo } from "react"

interface HeatmapData {
  date: string // YYYY-MM-DD format
  value: number
  label?: string // Optional tooltip label
}

interface HeatmapCalendarProps {
  data: HeatmapData[]
  colorScale?: string[] // Array of colors from light to dark, default greens
  maxValue?: number // Optional max for scaling, auto-detect if not provided
  onDayClick?: (data: HeatmapData) => void
  emptyColor?: string // Color for days with no data
  title?: string
  valueLabel?: string // Label for values (e.g., "policies", "claims")
}

interface TooltipData {
  x: number
  y: number
  data: HeatmapData
}

// Predefined color scales
export const greenScale = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
export const violetScale = ['#ebedf0', '#d4b8ff', '#a78bfa', '#8b5cf6', '#6d28d9']
export const indigoScale = ['#ebedf0', '#c7d2fe', '#818cf8', '#6366f1', '#4338ca']
export const emeraldScale = ['#ebedf0', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981']

const SQUARE_SIZE = 12
const SQUARE_GAP = 2
const CELL_SIZE = SQUARE_SIZE + SQUARE_GAP
const MONTH_LABEL_HEIGHT = 20
const DAY_LABEL_WIDTH = 30

export default function HeatmapCalendar({
  data,
  colorScale = greenScale,
  maxValue,
  onDayClick,
  emptyColor = "#ebedf0",
  title,
  valueLabel = "items",
}: HeatmapCalendarProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  // Generate calendar data for the last 12 months
  const calendarData = useMemo(() => {
    const today = new Date()
    const endDate = new Date(today)
    const startDate = new Date(today)
    startDate.setMonth(startDate.getMonth() - 12)

    // Adjust to start from Sunday of that week
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    // Create a map of date strings to values
    const dataMap = new Map<string, HeatmapData>()
    data.forEach(item => {
      dataMap.set(item.date, item)
    })

    // Calculate max value for scaling
    const calculatedMaxValue = maxValue ?? Math.max(...data.map(d => d.value), 1)

    // Generate grid data
    const weeks: HeatmapData[][] = []
    let currentWeek: HeatmapData[] = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      const dayData = dataMap.get(dateString)

      currentWeek.push({
        date: dateString,
        value: dayData?.value ?? 0,
        label: dayData?.label,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', value: 0 })
      }
      weeks.push(currentWeek)
    }

    return { weeks, maxValue: calculatedMaxValue }
  }, [data, maxValue])

  // Generate month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = []
    let lastMonth = -1

    calendarData.weeks.forEach((week, weekIndex) => {
      // Check first day of week that has a date
      const firstDayWithDate = week.find(day => day.date !== '')
      if (firstDayWithDate) {
        const date = new Date(firstDayWithDate.date)
        const month = date.getMonth()

        if (month !== lastMonth && weekIndex > 0) {
          labels.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekIndex,
          })
          lastMonth = month
        }
      }
    })

    return labels
  }, [calendarData.weeks])

  // Get color based on value
  const getColor = (value: number): string => {
    if (value === 0) return emptyColor

    const percentage = Math.min(value / calendarData.maxValue, 1)
    const index = Math.min(
      Math.floor(percentage * (colorScale.length - 1)) + 1,
      colorScale.length - 1
    )

    return colorScale[index]
  }

  // Format date for tooltip
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleMouseEnter = (
    event: React.MouseEvent<SVGRectElement>,
    dayData: HeatmapData
  ) => {
    if (!dayData.date) return

    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: dayData,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const handleClick = (dayData: HeatmapData) => {
    if (dayData.date && onDayClick) {
      onDayClick(dayData)
    }
  }

  const svgWidth = DAY_LABEL_WIDTH + (calendarData.weeks.length * CELL_SIZE)
  const svgHeight = MONTH_LABEL_HEIGHT + (7 * CELL_SIZE)

  return (
    <div className="relative">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
      )}

      <div className="relative inline-block">
        <svg width={svgWidth} height={svgHeight} className="overflow-visible">
          {/* Month labels */}
          <g transform={`translate(${DAY_LABEL_WIDTH}, 0)`}>
            {monthLabels.map(({ month, weekIndex }) => (
              <text
                key={`${month}-${weekIndex}`}
                x={weekIndex * CELL_SIZE}
                y={MONTH_LABEL_HEIGHT - 5}
                className="text-xs fill-gray-600 dark:fill-gray-400"
                style={{ fontSize: '10px' }}
              >
                {month}
              </text>
            ))}
          </g>

          {/* Day labels */}
          <g transform={`translate(0, ${MONTH_LABEL_HEIGHT})`}>
            {['Mon', 'Wed', 'Fri'].map((day, index) => {
              const yOffset = (index * 2 + 1) * CELL_SIZE + SQUARE_SIZE / 2
              return (
                <text
                  key={day}
                  x={DAY_LABEL_WIDTH - 5}
                  y={yOffset}
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                  textAnchor="end"
                  alignmentBaseline="middle"
                  style={{ fontSize: '9px' }}
                >
                  {day}
                </text>
              )
            })}
          </g>

          {/* Calendar grid */}
          <g transform={`translate(${DAY_LABEL_WIDTH}, ${MONTH_LABEL_HEIGHT})`}>
            {calendarData.weeks.map((week, weekIndex) => (
              <g key={weekIndex} transform={`translate(${weekIndex * CELL_SIZE}, 0)`}>
                {week.map((day, dayIndex) => {
                  if (!day.date) return null

                  return (
                    <g key={`${weekIndex}-${dayIndex}`}>
                      <rect
                        x={0}
                        y={dayIndex * CELL_SIZE}
                        width={SQUARE_SIZE}
                        height={SQUARE_SIZE}
                        rx={2}
                        fill={getColor(day.value)}
                        className={`
                          transition-all duration-150
                          ${onDayClick ? 'cursor-pointer hover:ring-2 hover:ring-gray-400' : ''}
                          dark:hover:ring-gray-500
                        `}
                        onMouseEnter={(e) => handleMouseEnter(e, day)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(day)}
                      />
                    </g>
                  )
                })}
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="rounded-sm"
                style={{
                  width: SQUARE_SIZE,
                  height: SQUARE_SIZE,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="font-medium">
              {tooltip.data.label || `${tooltip.data.value} ${valueLabel}`}
            </div>
            <div className="text-xs text-gray-300 dark:text-gray-400">
              {formatDate(tooltip.data.date)}
            </div>
          </div>
          {/* Tooltip arrow */}
          <div
            className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 -translate-x-1/2"
          />
        </div>
      )}
    </div>
  )
}
