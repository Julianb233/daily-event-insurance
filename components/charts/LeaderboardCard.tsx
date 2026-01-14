"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  value: number
  secondaryValue?: number
  trend?: "up" | "down" | "neutral"
  trendValue?: number
  metadata?: Record<string, string | number>
}

interface LeaderboardCardProps {
  title: string
  subtitle?: string
  entries: LeaderboardEntry[]
  valueLabel?: string
  secondaryLabel?: string
  format?: "number" | "currency" | "percentage" | "time"
  maxEntries?: number
  showRankBadges?: boolean
  showTrend?: boolean
  showAvatars?: boolean
  onEntryClick?: (entry: LeaderboardEntry) => void
  className?: string
  emptyMessage?: string
}

const formatValue = (
  value: number,
  format: "number" | "currency" | "percentage" | "time"
): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    case "percentage":
      return `${value.toFixed(1)}%`
    case "time":
      const minutes = Math.floor(value)
      const seconds = Math.round((value - minutes) * 60)
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    default:
      return value.toLocaleString()
  }
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Award className="w-5 h-5 text-amber-700" />
    default:
      return null
  }
}

const getRankStyle = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
  }
}

const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />
    default:
      return <Minus className="w-4 h-4 text-gray-400" />
  }
}

export default function LeaderboardCard({
  title,
  subtitle,
  entries,
  valueLabel = "Score",
  secondaryLabel,
  format = "number",
  maxEntries = 5,
  showRankBadges = true,
  showTrend = true,
  showAvatars = true,
  onEntryClick,
  className,
  emptyMessage = "No data available",
}: LeaderboardCardProps) {
  const sortedEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => b.value - a.value)
      .slice(0, maxEntries)
  }, [entries, maxEntries])

  const maxValue = useMemo(() => {
    return Math.max(...entries.map((e) => e.value), 1)
  }, [entries])

  if (!entries.length) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800",
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {valueLabel}
        </div>
      </div>

      <div className="space-y-3">
        {sortedEntries.map((entry, index) => {
          const rank = index + 1
          const progressWidth = (entry.value / maxValue) * 100

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-lg transition-all",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                onEntryClick && "cursor-pointer"
              )}
              onClick={() => onEntryClick?.(entry)}
            >
              {/* Progress bar background */}
              <div
                className="absolute inset-0 rounded-lg bg-violet-50 dark:bg-violet-900/20 transition-all"
                style={{ width: `${progressWidth}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center gap-3 flex-1 min-w-0">
                {/* Rank badge */}
                {showRankBadges && (
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0",
                      getRankStyle(rank)
                    )}
                  >
                    {getRankIcon(rank) || rank}
                  </div>
                )}

                {/* Avatar */}
                {showAvatars && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {entry.avatar ||
                      entry.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>
                )}

                {/* Name and secondary info */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {entry.name}
                  </p>
                  {entry.secondaryValue !== undefined && secondaryLabel && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {secondaryLabel}: {entry.secondaryValue.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Trend indicator */}
                {showTrend && entry.trend && (
                  <div className="flex items-center gap-1 shrink-0">
                    {getTrendIcon(entry.trend)}
                    {entry.trendValue !== undefined && (
                      <span
                        className={cn(
                          "text-xs font-medium",
                          entry.trend === "up" && "text-green-600",
                          entry.trend === "down" && "text-red-600",
                          entry.trend === "neutral" && "text-gray-500"
                        )}
                      >
                        {entry.trendValue > 0 ? "+" : ""}
                        {entry.trendValue}%
                      </span>
                    )}
                  </div>
                )}

                {/* Value */}
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatValue(entry.value, format)}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
