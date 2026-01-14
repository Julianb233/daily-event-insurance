"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface DonutChartData {
  name: string
  value: number
  color?: string
  percentage?: number
}

interface DonutChartProps {
  data: DonutChartData[]
  title?: string
  subtitle?: string
  centerLabel?: string
  centerValue?: string | number
  colors?: string[]
  className?: string
  height?: number
  showLegend?: boolean
  showPercentages?: boolean
  innerRadius?: number
  outerRadius?: number
  onSliceClick?: (data: DonutChartData) => void
}

const DEFAULT_COLORS = [
  "#8B5CF6", // violet-500
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#EC4899", // pink-500
  "#6366F1", // indigo-500
  "#14B8A6", // teal-500
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: DonutChartData & { color: string; percentage: number }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium">{data.name}</span>
      </div>
      <div className="text-gray-300 mt-1">
        {data.value.toLocaleString()} ({data.percentage.toFixed(1)}%)
      </div>
    </div>
  )
}

export default function DonutChart({
  data,
  title,
  subtitle,
  centerLabel,
  centerValue,
  colors = DEFAULT_COLORS,
  className,
  height = 300,
  showLegend = true,
  showPercentages = true,
  innerRadius = 60,
  outerRadius = 100,
  onSliceClick,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Process data with colors and percentages
  const processedData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    return data.map((item, index) => ({
      ...item,
      color: item.color || colors[index % colors.length],
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }))
  }, [data, colors])

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  const handleMouseEnter = (_: unknown, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  const handleClick = (entry: DonutChartData, index: number) => {
    if (onSliceClick) {
      onSliceClick(processedData[index])
    }
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-gray-500 dark:text-gray-400",
          className
        )}
        style={{ height }}
      >
        No data available
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              style={{ cursor: onSliceClick ? "pointer" : "default" }}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    filter:
                      activeIndex === index
                        ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                        : "none",
                    transform: activeIndex === index ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {centerValue && (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof centerValue === "number"
                  ? centerValue.toLocaleString()
                  : centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 space-y-2">
          {processedData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-lg transition-colors",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                onSliceClick && "cursor-pointer"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => onSliceClick?.(item)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.value.toLocaleString()}
                </span>
                {showPercentages && (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[50px] text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
