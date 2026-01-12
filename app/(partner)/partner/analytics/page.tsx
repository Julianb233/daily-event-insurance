"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

const COLORS = ["#14B8A6", "#0D9488", "#0F766E", "#115E59"]

type Period = "7d" | "30d" | "90d" | "ytd"

interface TrendPoint {
  date: string
  amount?: number
  count?: number
}

interface CoverageBreakdown {
  type: string
  count: number
  revenue: number
}

interface MonthBreakdown {
  month: string
  policies: number
  revenue: number
}

interface AnalyticsData {
  summary: {
    totalPolicies: number
    totalRevenue: number
    totalCommission: number
    averagePolicyValue: number
    conversionRate: number
  }
  trends: {
    revenue: TrendPoint[]
    policies: TrendPoint[]
  }
  breakdown: {
    byCoverage: CoverageBreakdown[]
    byMonth: MonthBreakdown[]
  }
  comparison: {
    previousPeriod: {
      policies: number
      revenue: number
      policyChange: number
      revenueChange: number
    }
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-")
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
}

function formatCoverageType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: TrendPoint }>
  label?: string
}

const RevenueTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-teal-200 rounded-xl shadow-xl p-4 min-w-[140px]">
        <p className="text-sm font-semibold text-slate-700 mb-1">{formatDate(data.date)}</p>
        <p className="text-lg font-bold text-teal-600">{formatCurrency(data.amount || 0)}</p>
      </div>
    )
  }
  return null
}

export default function PartnerAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<Period>("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  async function fetchAnalytics() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/partner/analytics?period=${period}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const analyticsData = await response.json()
      setData(analyticsData.data || analyticsData)
    } catch (err) {
      console.error("Error:", err)
      setData(generateMockData())
    } finally {
      setIsLoading(false)
    }
  }

  function generateMockData(): AnalyticsData {
    const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "ytd" ? 180 : 30
    const revenue: TrendPoint[] = []
    const policies: TrendPoint[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      revenue.push({ date: dateStr, amount: Math.floor(Math.random() * 500) + 100 })
      policies.push({ date: dateStr, count: Math.floor(Math.random() * 5) + 1 })
    }

    return {
      summary: {
        totalPolicies: 127,
        totalRevenue: 15890.5,
        totalCommission: 3178.1,
        averagePolicyValue: 125.12,
        conversionRate: 68.5,
      },
      trends: { revenue, policies },
      breakdown: {
        byCoverage: [
          { type: "liability", count: 78, revenue: 9750 },
          { type: "equipment", count: 35, revenue: 4375 },
          { type: "cancellation", count: 14, revenue: 1765 },
        ],
        byMonth: [
          { month: "2024-07", policies: 18, revenue: 2250 },
          { month: "2024-08", policies: 22, revenue: 2750 },
          { month: "2024-09", policies: 20, revenue: 2500 },
          { month: "2024-10", policies: 25, revenue: 3125 },
          { month: "2024-11", policies: 21, revenue: 2625 },
          { month: "2024-12", policies: 21, revenue: 2640 },
        ],
      },
      comparison: {
        previousPeriod: {
          policies: 112,
          revenue: 14650,
          policyChange: 13.39,
          revenueChange: 8.5,
        },
      },
    }
  }

  const periodButtons: { value: Period; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "ytd", label: "Year" },
  ]

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-4 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-80 bg-slate-200 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200 rounded-xl" />
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const policyChange = data?.comparison.previousPeriod.policyChange || 0
  const revenueChange = data?.comparison.previousPeriod.revenueChange || 0

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Track your performance and growth</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {periodButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setPeriod(btn.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === btn.value
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm text-slate-500">Total Policies</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {(data?.summary.totalPolicies || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {policyChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${policyChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(policyChange).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">vs previous</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-500">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(data?.summary.totalRevenue || 0)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {revenueChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(revenueChange).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">vs previous</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">Avg Policy Value</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(data?.summary.averagePolicyValue || 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500">Conversion Rate</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {(data?.summary.conversionRate || 0).toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data?.trends.revenue || []}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={formatDate}
                stroke="#cbd5e1"
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}`}
                stroke="#cbd5e1"
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#14B8A6", strokeWidth: 2, strokeDasharray: "5 5" }} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#14B8A6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Policies by Coverage Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Policies by Coverage Type</h3>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.breakdown.byCoverage || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="type"
                  label={({ type, percent }) => `${formatCoverageType(type)} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(data?.breakdown.byCoverage || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, formatCoverageType(name)]}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {(data?.breakdown.byCoverage || []).map((item, index) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600">{formatCoverageType(item.type)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-teal-100 p-6"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Compared to Previous Period</h3>
          <div className="space-y-6">
            <div className="bg-white/80 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Policy Change</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {policyChange >= 0 ? "+" : ""}{policyChange.toFixed(1)}%
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  policyChange >= 0 ? "bg-green-100" : "bg-red-100"
                }`}>
                  {policyChange >= 0 ? (
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {data?.summary.totalPolicies || 0} vs {data?.comparison.previousPeriod.policies || 0} policies
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Revenue Change</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  revenueChange >= 0 ? "bg-green-100" : "bg-red-100"
                }`}>
                  {revenueChange >= 0 ? (
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {formatCurrency(data?.summary.totalRevenue || 0)} vs {formatCurrency(data?.comparison.previousPeriod.revenue || 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Monthly Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Policies
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(data?.breakdown.byMonth || []).map((row) => {
                const commission = row.revenue * 0.2
                return (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {formatMonth(row.month)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">
                      {row.policies.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-teal-600 text-right">
                      {formatCurrency(commission)}
                    </td>
                  </tr>
                )
              })}
              {(!data?.breakdown.byMonth || data.breakdown.byMonth.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No data available for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
