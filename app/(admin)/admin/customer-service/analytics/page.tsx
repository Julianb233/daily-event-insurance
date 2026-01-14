"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Headphones,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { cn } from "@/lib/utils"
import { SparklineCard } from "@/components/charts/SparklineCard"
import HeatmapChart, { violetScale } from "@/components/charts/HeatmapChart"
import DonutChart from "@/components/charts/DonutChart"
import LeaderboardCard from "@/components/charts/LeaderboardCard"
import {
  Skeleton,
  SkeletonStatsRow,
  SkeletonChart,
} from "@/components/shared/Skeleton"
import type {
  AnalyticsResponse,
  PeriodComparison,
  AgentPerformance,
} from "@/app/api/admin/support/analytics/route"

type Period = "7d" | "30d" | "90d"

function MetricCard({
  title,
  value,
  subtitle,
  comparison,
  icon: Icon,
  iconColor = "bg-violet-100 text-violet-600",
  format = "number",
  className,
}: {
  title: string
  value: number
  subtitle?: string
  comparison?: PeriodComparison
  icon: React.ElementType
  iconColor?: string
  format?: "number" | "percentage" | "time" | "rating"
  className?: string
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case "percentage":
        return `${val.toFixed(1)}%`
      case "time":
        return `${val.toFixed(1)}m`
      case "rating":
        return val.toFixed(1)
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    if (!comparison) return null
    if (comparison.trend === "up") {
      return <TrendingUp className="w-4 h-4 text-green-500" />
    }
    if (comparison.trend === "down") {
      return <TrendingDown className="w-4 h-4 text-red-500" />
    }
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {comparison && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {getTrendIcon()}
          <span
            className={cn(
              "text-sm font-medium",
              comparison.trend === "up" && "text-green-600",
              comparison.trend === "down" && "text-red-600",
              comparison.trend === "neutral" && "text-gray-500"
            )}
          >
            {comparison.changePercent > 0 ? "+" : ""}
            {comparison.changePercent.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">vs previous period</span>
        </div>
      )}
    </motion.div>
  )
}

function SatisfactionChart({
  data,
}: {
  data: { date: string; score: number; responses: number }[]
}) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Satisfaction Score Over Time
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily average customer satisfaction rating
          </p>
        </div>
        <Star className="w-5 h-5 text-amber-500" />
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[3, 5]}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number, name: string) => [
                name === "score" ? value.toFixed(2) : value,
                name === "score" ? "Rating" : "Responses",
              ]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#satisfactionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function EscalationTrendChart({
  data,
}: {
  data: { date: string; escalations: number; total: number; rate: number }[]
}) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Escalation Rate Trends
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily escalation rate as percentage of total conversations
          </p>
        </div>
        <AlertTriangle className="w-5 h-5 text-amber-500" />
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number, name: string) => [
                name === "rate" ? `${value.toFixed(1)}%` : value,
                name === "rate" ? "Escalation Rate" : name === "escalations" ? "Escalations" : "Total",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="rate"
              name="Escalation Rate"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ResponseTimeChart({
  data,
}: {
  data: { date: string; avgTime: number }[]
}) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response Time Trend
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average response time in minutes
          </p>
        </div>
        <Clock className="w-5 h-5 text-blue-500" />
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}m`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value.toFixed(1)} minutes`, "Avg Response Time"]}
            />
            <Bar dataKey="avgTime" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function RatingDistributionChart({
  distribution,
}: {
  distribution: Record<number, number>
}) {
  const data = useMemo(() => {
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `${rating} Star${parseInt(rating) !== 1 ? "s" : ""}`,
      count,
    }))
  }, [distribution])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rating Distribution
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customer satisfaction ratings breakdown
          </p>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis
              type="category"
              dataKey="rating"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function CustomerServiceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAnalytics = async (selectedPeriod: Period = period) => {
    try {
      setIsRefreshing(true)
      const response = await fetch(`/api/admin/support/analytics?period=${selectedPeriod}`)
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const result = await response.json()
      setAnalytics(result.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching analytics:", err)
      setError("Failed to load analytics data")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    fetchAnalytics(newPeriod)
  }

  const handleRefresh = () => {
    fetchAnalytics()
  }

  // Transform agent performance data for leaderboard
  const leaderboardEntries = useMemo(() => {
    if (!analytics) return []
    return analytics.agentPerformance.map((agent: AgentPerformance) => ({
      id: agent.id,
      name: agent.name,
      value: agent.avgSatisfactionScore,
      secondaryValue: agent.conversationsHandled,
      trend: agent.trend,
      trendValue: agent.trendValue,
    }))
  }, [analytics])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-96" />
          </div>
          <SkeletonStatsRow stats={4} />
          <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonChart className="h-[400px]" />
            <SkeletonChart className="h-[400px]" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Error Loading Analytics
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {error || "Unable to load analytics data"}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Customer Service Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Performance metrics and insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(["7d", "30d", "90d"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                      period === p
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={cn(
                  "p-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isRefreshing && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw
                  className={cn(
                    "w-5 h-5 text-gray-600 dark:text-gray-400",
                    isRefreshing && "animate-spin"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Avg Response Time"
            value={analytics.responseMetrics.averageResponseTimeMinutes}
            subtitle={`P50: ${analytics.responseMetrics.p50ResponseTimeMinutes}m / P95: ${analytics.responseMetrics.p95ResponseTimeMinutes}m`}
            comparison={analytics.periodComparison.responseTime}
            icon={Clock}
            iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            format="time"
          />
          <MetricCard
            title="Resolution Rate"
            value={analytics.resolutionRate}
            subtitle={`${analytics.overview.resolvedConversations} resolved`}
            comparison={analytics.periodComparison.resolutionRate}
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            format="percentage"
          />
          <MetricCard
            title="Customer Satisfaction"
            value={analytics.satisfaction.averageRating}
            subtitle={`NPS: ${analytics.satisfaction.npsScore} (${analytics.satisfaction.totalRatings} ratings)`}
            comparison={analytics.periodComparison.satisfaction}
            icon={Star}
            iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            format="number"
          />
          <MetricCard
            title="Escalation Rate"
            value={analytics.escalationRate}
            subtitle={`${analytics.overview.escalatedConversations} escalated`}
            comparison={analytics.periodComparison.escalationRate}
            icon={AlertTriangle}
            iconColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            format="percentage"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <SatisfactionChart data={analytics.timeSeries.satisfaction} />
          <ResponseTimeChart data={analytics.timeSeries.responseTime} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <DonutChart
            data={analytics.byTopic}
            title="Topic Distribution"
            subtitle="Support requests by topic"
            centerValue={analytics.overview.totalConversations}
            centerLabel="Total"
            height={350}
          />

          <div className="lg:col-span-2">
            <LeaderboardCard
              title="Agent Performance"
              subtitle="Ranked by customer satisfaction score"
              entries={leaderboardEntries}
              valueLabel="Rating"
              secondaryLabel="Conversations"
              format="number"
              maxEntries={7}
              showTrend={true}
            />
          </div>
        </div>

        {/* Peak Hours Heatmap */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Peak Hours Heatmap
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Support request volume by day and hour
              </p>
            </div>
            <Headphones className="w-5 h-5 text-violet-500" />
          </div>
          <HeatmapChart
            data={analytics.peakHours}
            colorScale={violetScale}
            valueLabel="requests"
            title=""
          />
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <EscalationTrendChart data={analytics.timeSeries.escalationRate} />
          <RatingDistributionChart distribution={analytics.satisfaction.ratingDistribution} />
        </div>

        {/* Recent Trends Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-4">Quick Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-violet-200 text-sm">Last 7 Days</p>
              <p className="text-3xl font-bold">{analytics.recentTrends.last7Days.newConversations}</p>
              <p className="text-violet-200 text-sm">new conversations</p>
              <p className="text-sm mt-2">
                {analytics.recentTrends.last7Days.resolved} resolved,{" "}
                {analytics.recentTrends.last7Days.escalated} escalated
              </p>
            </div>
            <div>
              <p className="text-violet-200 text-sm">Last 30 Days</p>
              <p className="text-3xl font-bold">{analytics.recentTrends.last30Days.newConversations}</p>
              <p className="text-violet-200 text-sm">new conversations</p>
              <p className="text-sm mt-2">
                {analytics.recentTrends.last30Days.resolved} resolved,{" "}
                {analytics.recentTrends.last30Days.escalated} escalated
              </p>
            </div>
            <div>
              <p className="text-violet-200 text-sm">Active Now</p>
              <p className="text-3xl font-bold">{analytics.overview.activeConversations}</p>
              <p className="text-violet-200 text-sm">active conversations</p>
              <p className="text-sm mt-2">
                {analytics.overview.abandonedConversations} abandoned
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
