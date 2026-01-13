"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useState } from "react"

export interface FunnelStage {
  id: string
  label: string
  value: number
  color?: string
}

export interface FunnelChartProps {
  stages: FunnelStage[]
  title?: string
  showPercentages?: boolean
  showConversionRates?: boolean
  onStageClick?: (stage: FunnelStage) => void
  height?: number
  animated?: boolean
}

export const leadFunnelStages: FunnelStage[] = [
  { id: "leads", label: "Leads", value: 1000, color: "#8B5CF6" },
  { id: "qualified", label: "Qualified", value: 750, color: "#7C3AED" },
  { id: "quoted", label: "Quoted", value: 500, color: "#6D28D9" },
  { id: "converted", label: "Converted", value: 250, color: "#5B21B6" },
]

export default function FunnelChart({
  stages,
  title,
  showPercentages = true,
  showConversionRates = true,
  onStageClick,
  height = 400,
  animated = true,
  ...props
}: FunnelChartProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  if (!stages.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    )
  }

  // Calculate max value for width scaling
  const maxValue = Math.max(...stages.map((s) => s.value))

  // Calculate percentages and conversion rates
  const stagesWithMetrics = stages.map((stage, index) => {
    const percentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0
    const percentageOfTotal = maxValue > 0 ? (stage.value / stages[0].value) * 100 : 0

    let conversionRate = 0
    if (index > 0 && stages[index - 1].value > 0) {
      conversionRate = (stage.value / stages[index - 1].value) * 100
    }

    return {
      ...stage,
      percentage,
      percentageOfTotal,
      conversionRate,
    }
  })

  // Calculate bar width for funnel shape
  const getBarWidth = (percentage: number) => {
    return `${percentage}%`
  }

  return (
    <div className="w-full space-y-4" style={{ height }} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}

      <div className="space-y-3">
        {stagesWithMetrics.map((stage, index) => (
          <div key={stage.id} className="space-y-2">
            {/* Stage Bar */}
            <div className="flex items-center justify-center">
              <motion.button
                initial={animated ? { width: 0, opacity: 0 } : false}
                animate={{ width: getBarWidth(stage.percentage), opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                onClick={() => onStageClick?.(stage)}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className="relative rounded-lg transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: stage.color || "#8B5CF6",
                  minHeight: "64px",
                  boxShadow:
                    hoveredStage === stage.id
                      ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transform:
                    hoveredStage === stage.id ? "scale(1.02)" : "scale(1)",
                }}
                disabled={!onStageClick}
              >
                <div className="px-4 py-3 flex flex-col items-center justify-center text-white">
                  <div className="font-semibold text-base">{stage.label}</div>
                  <div className="text-2xl font-bold mt-1">
                    {stage.value.toLocaleString()}
                  </div>
                  {showPercentages && (
                    <div className="text-xs opacity-90 mt-1">
                      {stage.percentageOfTotal.toFixed(1)}% of total
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                {hoveredStage === stage.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap z-10"
                  >
                    Click to filter
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Conversion Rate Arrow */}
            {showConversionRates && index < stagesWithMetrics.length - 1 && (
              <motion.div
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <ArrowDown className="w-4 h-4 text-muted-foreground" />
                <span
                  className={`font-medium ${
                    stagesWithMetrics[index + 1].conversionRate >= 70
                      ? "text-green-600 dark:text-green-400"
                      : stagesWithMetrics[index + 1].conversionRate >= 50
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stagesWithMetrics[index + 1].conversionRate.toFixed(1)}%
                  conversion
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Conversion Rate */}
      {stages.length > 1 && (
        <motion.div
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stages.length * 0.1 }}
          className="pt-4 border-t border-border"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Conversion Rate:</span>
            <span className="font-bold text-lg text-foreground">
              {((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stages[stages.length - 1].value.toLocaleString()} of{" "}
            {stages[0].value.toLocaleString()} leads converted
          </div>
        </motion.div>
      )}
    </div>
  )
}
