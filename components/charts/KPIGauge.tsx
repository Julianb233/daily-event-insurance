"use client"

import React, { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Target } from "lucide-react"

interface KPIGaugeProps {
  value: number
  target?: number
  min?: number
  max?: number
  title: string
  subtitle?: string
  format?: "percentage" | "number" | "currency"
  invertColors?: boolean // For metrics where lower is better (like combined ratio)
  thresholds?: {
    good: number
    warning: number
  }
  size?: "sm" | "md" | "lg"
  showTarget?: boolean
  trend?: number
  className?: string
}

const SIZE_CONFIG = {
  sm: { width: 120, height: 80, innerRadius: 35, outerRadius: 45, fontSize: "text-lg" },
  md: { width: 160, height: 100, innerRadius: 45, outerRadius: 60, fontSize: "text-2xl" },
  lg: { width: 200, height: 120, innerRadius: 55, outerRadius: 75, fontSize: "text-3xl" },
}

export function KPIGauge({
  value,
  target = 100,
  min = 0,
  max = 150,
  title,
  subtitle,
  format = "percentage",
  invertColors = false,
  thresholds = { good: 95, warning: 100 },
  size = "md",
  showTarget = true,
  trend,
  className,
}: KPIGaugeProps) {
  const config = SIZE_CONFIG[size]

  // Calculate gauge color based on value and thresholds
  const getGaugeColor = useMemo(() => {
    if (invertColors) {
      // For combined ratio: green when low, red when high
      if (value < thresholds.good) return "#10B981" // emerald-500
      if (value < thresholds.warning) return "#F59E0B" // amber-500
      return "#EF4444" // red-500
    } else {
      // Normal: green when high, red when low
      if (value >= thresholds.warning) return "#10B981"
      if (value >= thresholds.good) return "#F59E0B"
      return "#EF4444"
    }
  }, [value, thresholds, invertColors])

  // Calculate status label
  const getStatusLabel = useMemo(() => {
    if (invertColors) {
      if (value < thresholds.good) return { text: "Excellent", color: "text-emerald-600" }
      if (value < thresholds.warning) return { text: "Acceptable", color: "text-amber-600" }
      return { text: "Needs Attention", color: "text-red-600" }
    } else {
      if (value >= thresholds.warning) return { text: "Excellent", color: "text-emerald-600" }
      if (value >= thresholds.good) return { text: "Acceptable", color: "text-amber-600" }
      return { text: "Needs Attention", color: "text-red-600" }
    }
  }, [value, thresholds, invertColors])

  // Calculate gauge percentage (0-100 for display)
  const gaugePercentage = useMemo(() => {
    const clampedValue = Math.max(min, Math.min(max, value))
    return ((clampedValue - min) / (max - min)) * 100
  }, [value, min, max])

  // Create gauge data for semi-circle
  const gaugeData = useMemo(() => {
    const filledAngle = (gaugePercentage / 100) * 180
    return [
      { name: "filled", value: filledAngle, color: getGaugeColor },
      { name: "empty", value: 180 - filledAngle, color: "#E5E7EB" },
    ]
  }, [gaugePercentage, getGaugeColor])

  // Target marker position (as percentage of arc)
  const targetPosition = useMemo(() => {
    if (target === undefined) return null
    const clampedTarget = Math.max(min, Math.min(max, target))
    return ((clampedTarget - min) / (max - min)) * 100
  }, [target, min, max])

  const formatValue = (val: number) => {
    switch (format) {
      case "percentage":
        return `${val.toFixed(1)}%`
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val)
      default:
        return val.toFixed(2)
    }
  }

  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm border border-slate-100", className)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-600">{title}</h4>
        {showTarget && target !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Target className="w-3 h-3" />
            Target: {formatValue(target)}
          </div>
        )}
      </div>

      <div className="relative" style={{ height: config.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center value display */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none"
        >
          <span className={cn("font-bold text-slate-900", config.fontSize)}>
            {formatValue(value)}
          </span>
        </div>

        {/* Target indicator line */}
        {showTarget && targetPosition !== null && (
          <div
            className="absolute w-0.5 h-3 bg-slate-600"
            style={{
              bottom: "10%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${-90 + (targetPosition / 100) * 180}deg)`,
            }}
          />
        )}
      </div>

      {/* Status and trend */}
      <div className="flex items-center justify-between mt-2">
        <span className={cn("text-xs font-medium", getStatusLabel.color)}>
          {getStatusLabel.text}
        </span>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp className={cn("w-3 h-3", invertColors ? "text-red-500" : "text-emerald-500")} />
            ) : trend < 0 ? (
              <TrendingDown className={cn("w-3 h-3", invertColors ? "text-emerald-500" : "text-red-500")} />
            ) : null}
            <span className={cn(
              "text-xs font-medium",
              trend > 0
                ? invertColors ? "text-red-500" : "text-emerald-500"
                : trend < 0
                ? invertColors ? "text-emerald-500" : "text-red-500"
                : "text-slate-400"
            )}>
              {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

// Mini sparkline version for loss/expense ratio trends
interface KPISparklineProps {
  title: string
  value: number
  data: number[]
  format?: "percentage" | "number"
  invertColors?: boolean
  threshold?: number
  className?: string
}

export function KPISparkline({
  title,
  value,
  data,
  format = "percentage",
  invertColors = false,
  threshold = 100,
  className,
}: KPISparklineProps) {
  const isGood = invertColors ? value < threshold : value >= threshold
  const color = isGood ? "#10B981" : "#EF4444"

  const formatValue = (val: number) => {
    return format === "percentage" ? `${val.toFixed(1)}%` : val.toFixed(2)
  }

  // Calculate min/max for scaling
  const minVal = Math.min(...data)
  const maxVal = Math.max(...data)
  const range = maxVal - minVal || 1

  // Generate SVG path for sparkline
  const pathData = useMemo(() => {
    if (data.length < 2) return ""
    const width = 100
    const height = 24
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - minVal) / range) * height
      return `${x},${y}`
    })
    return `M${points.join(" L")}`
  }, [data, minVal, range])

  return (
    <div className={cn("flex items-center gap-3 p-3 bg-slate-50 rounded-lg", className)}>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 truncate">{title}</p>
        <p className={cn("text-lg font-bold", isGood ? "text-emerald-600" : "text-red-600")}>
          {formatValue(value)}
        </p>
      </div>
      <div className="w-24 h-8 flex-shrink-0">
        <svg viewBox="0 0 100 24" className="w-full h-full">
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default KPIGauge
