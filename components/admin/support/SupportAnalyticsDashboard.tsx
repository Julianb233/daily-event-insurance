"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Zap,
  BarChart3,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import { SparklineCard } from "@/components/charts/SparklineCard"

// Types for analytics data
interface SupportAnalytics {
  overview: {
    totalConversations: number
    activeConversations: number
    resolvedConversations: number
    escalatedConversations: number
    abandonedConversations: number
  }
  responseMetrics: {
    averageResponseTimeMinutes: number
    averageMessagesPerConversation: number
    averageResolutionTimeMinutes: number
    firstResponseTimeMinutes: number
  }
  satisfaction: {
    averageRating: number
    totalRatings: number
    ratingDistribution: Record<number, number>
    npsScore: number
  }
  resolutionRate: number
  escalationRate: number
  byTopic: {
    topic: string
    count: number
    percentage: number
    resolved?: number
    escalated?: number
    avgResolutionMins?: number
  }[]
  byPriority: {
    priority: string
    count: number
    percentage: number
  }[]
  recentTrends: {
    last7Days: {
      newConversations: number
      resolved: number
      escalated: number
      avgResponseTime?: number
    }
    last30Days: {
      newConversations: number
      resolved: number
      escalated: number
      avgResponseTime?: number
    }
  }
  dailyVolume?: {
    date: string
    conversations: number
    resolved: number
  }[]
  responseTimeTrend?: {
    hour: string
    avgMinutes: number
  }[]
  topIssues?: {
    issue: string
    count: number
    trend: string
    percentChange: number
  }[]
  agentPerformance?: {
    agentId: string
    agentName: string
    conversations: number
    resolved: number
    avgRating: number
    avgResponseTime: number
  }[]
  escalationPatterns?: {
    reason: string
    count: number
    avgTimeToEscalate: number
  }[]
  peakHours?: {
    hour: number
    count: number
  }[]
}

// Topic labels for display
const topicLabels: Record<string, string> = {
  onboarding: "Onboarding",
  widget_install: "Widget Install",
  api_integration: "API Integration",
  pos_setup: "POS Setup",
  troubleshooting: "Troubleshooting",
}

// Colors for charts
const COLORS = {
  violet: "#8B5CF6",
  blue: "#3B82F6",
  emerald: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  slate: "#64748B",
}

const TOPIC_COLORS = [COLORS.violet, COLORS.blue, COLORS.emerald, COLORS.amber, COLORS.slate]

interface SupportAnalyticsDashboardProps {
  className?: string
}

export function SupportAnalyticsDashboard({ className = "" }: SupportAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<SupportAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d")

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/admin/support/analytics")
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const result = await response.json()
        setAnalytics(result.data)
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError("Failed to load analytics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Prepare chart data
  const topicChartData = useMemo(() => {
    if (!analytics?.byTopic) return []
    return analytics.byTopic.map((item, index) => ({
      name: topicLabels[item.topic] || item.topic,
      value: item.count,
      percentage: item.percentage,
      fill: TOPIC_COLORS[index % TOPIC_COLORS.length],
    }))
  }, [analytics?.byTopic])

  const trendData = useMemo(() => {
    if (!analytics?.recentTrends) return null
    return timeRange === "7d" ? analytics.recentTrends.last7Days : analytics.recentTrends.last30Days
  }, [analytics?.recentTrends, timeRange])

  // Sparkline data for key metrics
  const conversationTrend = [120, 128, 135, 142, 148, 152, analytics?.overview?.totalConversations || 156]
  const resolutionTrend = [78, 79, 80, 81, 82, 82, analytics?.resolutionRate || 82]
  const responseTrend = [5.2, 4.8, 4.5, 4.3, 4.2, 4.1, analytics?.responseMetrics?.averageResponseTimeMinutes || 4.2]

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
              <div className="h-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse h-80" />
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 animate-pulse h-80" />
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-2xl p-6 ${className}`}>
        <p className="text-red-600">{error || "Unable to load analytics"}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Time Range Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Support Analytics</h2>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "7d"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "30d"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Conversations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SparklineCard
            title="Total Conversations"
            value={analytics.overview.totalConversations}
            data={conversationTrend}
            icon={<MessageSquare className="w-5 h-5" />}
            color="violet"
            gradient="from-violet-500 to-violet-600"
            change={8.2}
            changeLabel="vs last period"
            format="number"
          />
        </motion.div>

        {/* Resolution Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SparklineCard
            title="Resolution Rate"
            value={analytics.resolutionRate}
            data={resolutionTrend}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="emerald"
            gradient="from-emerald-500 to-emerald-600"
            change={2.4}
            changeLabel="vs last period"
            format="percentage"
          />
        </motion.div>

        {/* Avg Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SparklineCard
            title="Avg Response Time"
            value={`${analytics.responseMetrics.averageResponseTimeMinutes}m`}
            data={responseTrend}
            icon={<Clock className="w-5 h-5" />}
            color="blue"
            gradient="from-blue-500 to-blue-600"
            change={-12.5}
            changeLabel="faster"
          />
        </motion.div>

        {/* Satisfaction Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Satisfaction</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedNumber value={analytics.satisfaction.averageRating} decimals={1} />
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(analytics.satisfaction.averageRating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  NPS: {analytics.satisfaction.npsScore > 0 ? "+" : ""}{analytics.satisfaction.npsScore}
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Now</p>
              <p className="text-lg font-bold text-slate-900">
                <AnimatedNumber value={analytics.overview.activeConversations} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.55 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Escalated</p>
              <p className="text-lg font-bold text-slate-900">
                <AnimatedNumber value={analytics.overview.escalatedConversations} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">First Response</p>
              <p className="text-lg font-bold text-slate-900">
                {analytics.responseMetrics.firstResponseTimeMinutes}m
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.65 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Resolution</p>
              <p className="text-lg font-bold text-slate-900">
                {analytics.responseMetrics.averageResolutionTimeMinutes}m
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Topic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Topics Distribution</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicChartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                          <p className="font-medium text-slate-900">{data.name}</p>
                          <p className="text-sm text-slate-600">
                            {data.value} conversations ({data.percentage}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topicChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Response Time Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Response Time by Hour</h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.responseTimeTrend || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                          <p className="font-medium text-slate-900">{payload[0].payload.hour}</p>
                          <p className="text-sm text-slate-600">
                            Avg: {payload[0].value} minutes
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgMinutes"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  fill="url(#responseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Issues and Agent Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Top Issues</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {(analytics.topIssues || []).slice(0, 5).map((issue, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{issue.issue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{issue.count}</span>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      issue.trend === "up"
                        ? "text-red-500"
                        : issue.trend === "down"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    {issue.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : issue.trend === "down" ? (
                      <ArrowDownRight className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {Math.abs(issue.percentChange)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agent Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Agent Performance</h3>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {(analytics.agentPerformance || []).map((agent) => (
              <div
                key={agent.agentId}
                className="p-4 rounded-xl bg-slate-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                      {agent.agentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{agent.agentName}</p>
                      <p className="text-xs text-slate-500">{agent.conversations} conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900">{agent.avgRating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white">
                    <p className="text-xs text-slate-500">Resolved</p>
                    <p className="font-semibold text-slate-900">{agent.resolved}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white">
                    <p className="text-xs text-slate-500">Rate</p>
                    <p className="font-semibold text-emerald-600">
                      {Math.round((agent.resolved / agent.conversations) * 100)}%
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white">
                    <p className="text-xs text-slate-500">Avg Time</p>
                    <p className="font-semibold text-slate-900">{agent.avgResponseTime}m</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Escalation Patterns */}
      {analytics.escalationPatterns && analytics.escalationPatterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.1 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Escalation Patterns</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.escalationPatterns.map((pattern, index) => (
              <div key={index} className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-sm font-medium text-amber-800 mb-2">{pattern.reason}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-amber-900">{pattern.count}</p>
                    <p className="text-xs text-amber-600">escalations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-amber-700">{pattern.avgTimeToEscalate}m</p>
                    <p className="text-xs text-amber-600">avg time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SupportAnalyticsDashboard
