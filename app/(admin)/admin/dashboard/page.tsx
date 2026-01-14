"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Building2,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Bell,
  MessageSquare,
  ChevronDown,
  Activity,
  Headphones,
  AlertTriangle,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import { SparklineCard } from "@/components/charts/SparklineCard"
import { SkeletonStatsRow, SkeletonChart } from "@/components/shared/Skeleton"
import { KPIGauge, KPISparkline } from "@/components/charts/KPIGauge"

// Types for dashboard data from API
interface DashboardStats {
  overview: {
    totalPartners: number
    activePartners: number
    pendingPartners: number
    totalPolicies: number
    activePolicies: number
    totalQuotes: number
    conversionRate: number
  }
  revenue: {
    totalPremium: number
    totalCommissions: number
    totalParticipants: number
    avgPremiumPerPolicy: number
    avgCommissionRate: number
  }
  comparison: {
    premiumChange: number
    policyChange: number
    previousPremium: number
    previousPolicies: number
  }
  sparklines: {
    premiumTrend: number[]
    partnerTrend: number[]
    policyTrend: number[]
    payoutTrend: number[]
  }
  commissionTiers: {
    name: string
    rate: number
  }[]
  topPartners: {
    id: string
    name: string
    policies: number
    revenue: number
    commission: number
  }[]
  pendingPayouts: {
    count: number
    totalAmount: number
  }
  pendingActions: {
    pendingPartners: number
    pendingPayouts: number
    activeSupport: number
    escalatedSupport: number
  }
  recentActivity: {
    policies: ActivityItem[]
    partners: ActivityItem[]
    payouts: ActivityItem[]
  }
  supportStats: {
    active: number
    escalated: number
    resolved: number
    total: number
  }
  insuranceKPIs: {
    lossRatio: number
    expenseRatio: number
    combinedRatio: number
    claimsFrequency: number
    averageClaimCost: number
    trends: {
      lossRatioTrend: number[]
      expenseRatioTrend: number[]
      combinedRatioTrend: number[]
      claimsFrequencyTrend: number[]
    }
  }
  period: string
  generatedAt: string
}

interface ActivityItem {
  id: string
  type: "policy" | "partner" | "payout"
  title: string
  description: string
  amount?: number
  status: string
  timestamp: string
}

type Period = "7d" | "30d" | "90d" | "1y"
type RefreshInterval = 0 | 30000 | 60000 | 300000

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
]

const REFRESH_OPTIONS: { value: RefreshInterval; label: string }[] = [
  { value: 0, label: "Manual" },
  { value: 30000, label: "30 seconds" },
  { value: 60000, label: "1 minute" },
  { value: 300000, label: "5 minutes" },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function getActivityIcon(type: string, status: string) {
  switch (type) {
    case "policy":
      return status === "active" ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <Clock className="w-4 h-4 text-amber-500" />
      )
    case "partner":
      return status === "pending" ? (
        <AlertCircle className="w-4 h-4 text-amber-500" />
      ) : (
        <Building2 className="w-4 h-4 text-violet-500" />
      )
    case "payout":
      return status === "completed" ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <DollarSign className="w-4 h-4 text-amber-500" />
      )
    default:
      return <Activity className="w-4 h-4 text-slate-400" />
  }
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [period, setPeriod] = useState<Period>("30d")
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(60000)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [showRefreshDropdown, setShowRefreshDropdown] = useState(false)
  const [activityTab, setActivityTab] = useState<"all" | "policies" | "partners" | "payouts">("all")
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchDashboard = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true)
      }
      const response = await fetch(`/api/admin/dashboard?period=${period}`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const result = await response.json()
      setDashboardData(result.data)
      setLastRefresh(new Date())
    } catch (err) {
      console.error("Error fetching dashboard:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [period])

  // Initial load and period change
  useEffect(() => {
    setIsLoading(true)
    fetchDashboard()
  }, [period, fetchDashboard])

  // Auto-refresh setup
  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    if (refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchDashboard(true)
      }, refreshInterval)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [refreshInterval, fetchDashboard])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPeriodDropdown(false)
      setShowRefreshDropdown(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-64" />
          </div>

          <SkeletonStatsRow stats={4} />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonChart className="h-80" />
            </div>
            <div>
              <SkeletonChart className="h-80" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">Failed to load dashboard</h3>
          <p className="text-slate-500 mt-1">Please try refreshing the page</p>
          <button
            onClick={() => fetchDashboard()}
            className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const data = dashboardData

  // Combine recent activity for "all" tab
  const allActivity = [
    ...data.recentActivity.policies,
    ...data.recentActivity.partners,
    ...data.recentActivity.payouts,
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const currentActivity = activityTab === "all"
    ? allActivity
    : activityTab === "policies"
    ? data.recentActivity.policies
    : activityTab === "partners"
    ? data.recentActivity.partners
    : data.recentActivity.payouts

  // Calculate total pending actions for badge
  const totalPendingActions =
    data.pendingActions.pendingPartners +
    data.pendingActions.pendingPayouts +
    data.pendingActions.escalatedSupport

  return (
    <div className="p-6 lg:p-8">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              {totalPendingActions > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  <Bell className="w-4 h-4" />
                  {totalPendingActions} pending
                </span>
              )}
            </div>
            <p className="text-slate-600 mt-1">
              System overview and performance metrics
              <span className="text-slate-400 ml-2">
                Last updated: {formatTimeAgo(lastRefresh.toISOString())}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPeriodDropdown(!showPeriodDropdown)
                  setShowRefreshDropdown(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-violet-300 transition-colors text-sm font-medium text-slate-700"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                {PERIOD_OPTIONS.find((o) => o.value === period)?.label}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <AnimatePresence>
                {showPeriodDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden"
                  >
                    {PERIOD_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          setPeriod(option.value)
                          setShowPeriodDropdown(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                          period === option.value
                            ? "bg-violet-50 text-violet-700 font-medium"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Refresh Controls */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRefreshDropdown(!showRefreshDropdown)
                  setShowPeriodDropdown(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-violet-300 transition-colors text-sm font-medium text-slate-700"
              >
                <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} />
                {REFRESH_OPTIONS.find((o) => o.value === refreshInterval)?.label}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <AnimatePresence>
                {showRefreshDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden"
                  >
                    {REFRESH_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          setRefreshInterval(option.value)
                          setShowRefreshDropdown(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors ${
                          refreshInterval === option.value
                            ? "bg-violet-50 text-violet-700 font-medium"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchDashboard(true)}
              disabled={isRefreshing}
              className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Primary Stats Grid - Hero Stats with Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SparklineCard
            title="Total Premium"
            value={data.revenue.totalPremium}
            data={data.sparklines.premiumTrend}
            icon={<DollarSign className="w-6 h-6" />}
            color="violet"
            change={data.comparison.premiumChange}
            changeLabel="vs prev. period"
            format="currency"
          />
        </motion.div>

        {/* Total Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SparklineCard
            title="Active Partners"
            value={data.overview.activePartners}
            data={data.sparklines.partnerTrend}
            icon={<Building2 className="w-6 h-6" />}
            color="blue"
            change={5.6}
            subtitle={
              data.overview.pendingPartners > 0
                ? `${data.overview.pendingPartners} pending approval`
                : undefined
            }
          />
        </motion.div>

        {/* Total Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SparklineCard
            title="Total Policies"
            value={data.overview.totalPolicies}
            data={data.sparklines.policyTrend}
            icon={<FileText className="w-6 h-6" />}
            color="emerald"
            change={data.comparison.policyChange}
            changeLabel="vs prev. period"
            format="number"
          />
        </motion.div>

        {/* Pending Payouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <SparklineCard
            title="Pending Payouts"
            value={data.pendingPayouts.totalAmount}
            data={data.sparklines.payoutTrend}
            icon={<Clock className="w-6 h-6" />}
            color="amber"
            change={-15.3}
            format="currency"
            subtitle={`${data.pendingPayouts.count} payouts awaiting`}
          />
        </motion.div>
      </div>

      {/* Secondary Stats Row - Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Conversion Rate
          </div>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber value={data.overview.conversionRate} format="percentage" decimals={1} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Avg. Premium
          </div>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber value={data.revenue.avgPremiumPerPolicy} format="currency" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Users className="w-4 h-4" />
            Total Participants
          </div>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber value={data.revenue.totalParticipants} format="number" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Layers className="w-4 h-4" />
            Commission Rate
          </div>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber value={data.revenue.avgCommissionRate * 100} format="percentage" decimals={1} />
          </div>
        </div>
      </motion.div>

      {/* Insurance Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-bold text-slate-900">Insurance Metrics</h3>
          <span className="text-xs text-slate-400 ml-2">Critical KPIs for underwriting performance</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Combined Ratio Gauge - Most Important */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Combined Ratio</h4>
                  <p className="text-sm text-slate-500">Target: under 100%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data.insuranceKPIs.combinedRatio < 95
                      ? "bg-emerald-100 text-emerald-700"
                      : data.insuranceKPIs.combinedRatio < 100
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {data.insuranceKPIs.combinedRatio < 95
                      ? "Excellent"
                      : data.insuranceKPIs.combinedRatio < 100
                      ? "Good"
                      : "Needs Review"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <KPIGauge
                  value={data.insuranceKPIs.combinedRatio}
                  target={100}
                  min={0}
                  max={150}
                  title=""
                  format="percentage"
                  invertColors={true}
                  thresholds={{ good: 95, warning: 100 }}
                  size="lg"
                  showTarget={false}
                  className="flex-shrink-0 border-0 shadow-none p-0"
                />

                <div className="flex-1 space-y-3">
                  <KPISparkline
                    title="Loss Ratio"
                    value={data.insuranceKPIs.lossRatio}
                    data={data.insuranceKPIs.trends.lossRatioTrend}
                    format="percentage"
                    invertColors={true}
                    threshold={50}
                  />
                  <KPISparkline
                    title="Expense Ratio"
                    value={data.insuranceKPIs.expenseRatio}
                    data={data.insuranceKPIs.trends.expenseRatioTrend}
                    format="percentage"
                    invertColors={true}
                    threshold={35}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Combined = Loss Ratio + Expense Ratio</span>
                  <span className="text-slate-300">|</span>
                  <span>Below 100% indicates profitable underwriting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claims Frequency & Average Cost */}
          <div className="space-y-4">
            <KPIGauge
              value={data.insuranceKPIs.claimsFrequency}
              target={2.0}
              min={0}
              max={5}
              title="Claims Frequency"
              subtitle="Claims per 100 policies"
              format="percentage"
              invertColors={true}
              thresholds={{ good: 2.0, warning: 3.0 }}
              size="md"
              showTarget={true}
            />

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <DollarSign className="w-4 h-4" />
                Average Claim Cost
              </div>
              <div className="text-2xl font-bold text-slate-900">
                <AnimatedNumber value={data.insuranceKPIs.averageClaimCost} format="currency" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Per claim payout</p>
            </div>
          </div>

          {/* Claims Frequency Trend */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <h4 className="text-sm font-medium text-slate-600 mb-3">Claims Frequency Trend</h4>
            <div className="space-y-2">
              {data.insuranceKPIs.trends.claimsFrequencyTrend.slice(-6).map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-16">
                    {index === data.insuranceKPIs.trends.claimsFrequencyTrend.slice(-6).length - 1
                      ? "Current"
                      : `Week ${index + 1}`}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        value < 2.0 ? "bg-emerald-500" : value < 3.0 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((value / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium w-12 text-right ${
                    value < 2.0 ? "text-emerald-600" : value < 3.0 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {value.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Target: &lt; 2.0% claims per policies
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Top Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Top Partners</h3>
              <p className="text-sm text-slate-500">By total revenue this period</p>
            </div>
            <Link
              href="/admin/partners"
              className="text-sm text-violet-600 font-medium hover:text-violet-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {data.topPartners.slice(0, 5).map((partner, index) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{partner.name}</p>
                    <p className="text-sm text-slate-500">{partner.policies} policies</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">
                    <AnimatedNumber value={partner.revenue} format="currency" />
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatCurrency(partner.commission)} commission
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>

          {/* Activity Tabs */}
          <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg">
            {[
              { key: "all", label: "All" },
              { key: "policies", label: "Policies" },
              { key: "partners", label: "Partners" },
              { key: "payouts", label: "Payouts" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivityTab(tab.key as typeof activityTab)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activityTab === tab.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {currentActivity.slice(0, 8).map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="mt-0.5">{getActivityIcon(item.type, item.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(item.timestamp)}</p>
                  </div>
                  {item.amount && (
                    <div className="text-sm font-semibold text-slate-700">
                      {formatCurrency(item.amount)}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Commission Tiers, Quick Actions, Support Widget */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Commission Tiers & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-bold text-slate-900">Commission Tiers</h3>
          </div>

          <div className="space-y-3">
            {data.commissionTiers.map((tier) => {
              const colors: Record<string, string> = {
                Bronze: "from-amber-600 to-amber-700",
                Silver: "from-slate-400 to-slate-500",
                Gold: "from-yellow-500 to-yellow-600",
                Platinum: "from-violet-500 to-violet-600",
              }
              return (
                <div key={tier.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[tier.name] || 'from-slate-400 to-slate-500'} flex items-center justify-center text-white font-bold text-sm`}>
                      {(tier.rate * 100).toFixed(0)}%
                    </div>
                    <span className="font-medium text-slate-700">{tier.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">Commission Rate</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Commissions</span>
              <div className="font-semibold text-slate-900">
                <AnimatedNumber value={data.revenue.totalCommissions} format="currency" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <Link
              href="/admin/commission-tiers"
              className="text-sm text-violet-600 font-medium hover:text-violet-700 flex items-center gap-1"
            >
              Manage Tiers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions with Notification Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>

          <Link
            href="/admin/partners?status=pending"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group relative"
          >
            {data.pendingActions.pendingPartners > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {data.pendingActions.pendingPartners}
              </span>
            )}
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Review Pending Partners
              </p>
              <p className="text-sm text-slate-500">
                {data.pendingActions.pendingPartners} partners awaiting approval
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/payouts"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group relative"
          >
            {data.pendingActions.pendingPayouts > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {data.pendingActions.pendingPayouts}
              </span>
            )}
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Process Payouts
              </p>
              <p className="text-sm text-slate-500">
                <AnimatedNumber value={data.pendingPayouts.totalAmount} format="currency" /> pending
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                View Reports
              </p>
              <p className="text-sm text-slate-500">
                Analytics and insights
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        {/* Support Stats Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-bold text-slate-900">Support</h3>
            </div>
            <Link
              href="/admin/support"
              className="text-sm text-violet-600 font-medium hover:text-violet-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">Active</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">{data.supportStats.active}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">Escalated</span>
              </div>
              <div className="text-2xl font-bold text-amber-700">{data.supportStats.escalated}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-700">Resolved</span>
              </div>
              <span className="font-semibold text-slate-900">{data.supportStats.resolved}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-500" />
                <span className="text-sm text-slate-700">Total Conversations</span>
              </div>
              <span className="font-semibold text-slate-900">{data.supportStats.total}</span>
            </div>
          </div>

          {data.supportStats.escalated > 0 && (
            <Link
              href="/admin/support?status=escalated"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Handle {data.supportStats.escalated} Escalated
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}
