"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Target,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  X,
} from "lucide-react"
import Link from "next/link"
import { EarningsChart } from "@/components/partner/EarningsChart"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"
import { DashboardHeader, DateRange, ExportFormat } from "@/components/shared"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import {
  useRealtimeDashboard,
  getConnectionStatusInfo,
  type RealtimeNotification,
} from "@/lib/hooks/use-realtime-dashboard"
import {
  formatCurrency,
  getNextTier,
  commissionTiers,
  calculateEarnings,
  getLastNMonths,
  OPT_IN_RATE,
} from "@/lib/commission-tiers"

interface EarningsData {
  summary: {
    year: string
    totalParticipants: number
    totalOptedIn: number
    totalCommission: number
    averageMonthlyCommission: number
  }
  chartData: Array<{
    month: string
    participants: number
    optedIn: number
    earnings: number
  }>
}

// Connection Status Indicator Component
function ConnectionStatusIndicator({
  connectionState,
  lastUpdated,
  onReconnect,
}: {
  connectionState: "connecting" | "connected" | "reconnecting" | "disconnected"
  lastUpdated: Date | null
  onReconnect: () => void
}) {
  const statusInfo = getConnectionStatusInfo(connectionState)

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 5) return "Just now"
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`} />
          {statusInfo.pulse && (
            <div
              className={`absolute inset-0 w-2 h-2 rounded-full ${statusInfo.bgColor} animate-ping`}
            />
          )}
        </div>
        <span className={`font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {lastUpdated && (
        <span className="text-slate-400">
          Updated {formatLastUpdated(lastUpdated)}
        </span>
      )}

      {connectionState === "disconnected" && (
        <button
          onClick={onReconnect}
          className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reconnect
        </button>
      )}
    </div>
  )
}

// Notification Toast Component
function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: RealtimeNotification
  onDismiss: (id: string) => void
}) {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "insert":
        return <Bell className="w-4 h-4 text-green-500" />
      case "update":
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      case "delete":
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 flex items-center gap-3 max-w-sm"
    >
      <div className="flex-shrink-0">{getNotificationIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {notification.message}
        </p>
        <p className="text-xs text-slate-500">
          {notification.timestamp.toLocaleTimeString()}
        </p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default function PartnerDashboardPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  })

  // Real-time dashboard hook
  const {
    connectionState,
    lastUpdated: realtimeLastUpdated,
    notifications,
    clearNotifications,
    reconnect,
    isSubscribed,
  } = useRealtimeDashboard({
    enabled: true,
    onNotification: (notification) => {
      // Trigger a data refresh when we receive a notification
      fetchEarnings()
    },
  })

  // Track local last updated time
  const [localLastUpdated, setLocalLastUpdated] = useState<Date | null>(null)
  const effectiveLastUpdated = realtimeLastUpdated || localLastUpdated

  const fetchEarnings = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/partner/earnings")
      if (!response.ok) {
        throw new Error("Failed to fetch earnings data")
      }
      const data = await response.json()
      setEarningsData(data)
      setLocalLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching earnings:", err)
      // Use demo data if API fails
      const demoData = generateDemoData()
      setEarningsData(demoData)
      setLocalLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEarnings()
  }, [fetchEarnings])

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range)
    // In a real implementation, this would trigger a data fetch with the new date range
    console.log("Date range changed:", range)
  }, [])

  const handleExport = useCallback(async (format: ExportFormat) => {
    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const data = earningsData || generateDemoData()

    if (format === "csv") {
      // Generate CSV
      const headers = ["Month", "Participants", "Opted In", "Earnings"]
      const rows = data.chartData.map((row) => [
        row.month,
        row.participants.toString(),
        row.optedIn.toString(),
        row.earnings.toFixed(2),
      ])
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `partner-earnings-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === "pdf") {
      // In a real implementation, this would generate a PDF
      console.log("PDF export - would generate PDF report")
      alert("PDF export functionality would be implemented here")
    } else if (format === "excel") {
      // In a real implementation, this would generate an Excel file
      console.log("Excel export - would generate Excel spreadsheet")
      alert("Excel export functionality would be implemented here")
    }
  }, [earningsData])

  const handleRefresh = useCallback(async () => {
    await fetchEarnings()
  }, [fetchEarnings])

  // Handle notification dismissal
  const handleDismissNotification = useCallback((id: string) => {
    // The useRealtimeDashboard hook handles auto-dismissal,
    // but we can trigger early dismissal if needed
  }, [])

  // Generate demo data for display
  function generateDemoData(): EarningsData {
    const months = getLastNMonths(12)
    const chartData = months.map((month, index) => {
      // Simulate growth trend
      const baseParticipants = 800 + index * 150 + Math.floor(Math.random() * 200)
      const optedIn = Math.round(baseParticipants * OPT_IN_RATE)
      const { monthlyEarnings } = calculateEarnings(baseParticipants, 1)
      return {
        month,
        participants: baseParticipants,
        optedIn,
        earnings: monthlyEarnings,
      }
    })

    const totalParticipants = chartData.reduce((sum, d) => sum + d.participants, 0)
    const totalOptedIn = chartData.reduce((sum, d) => sum + d.optedIn, 0)
    const totalCommission = chartData.reduce((sum, d) => sum + d.earnings, 0)

    return {
      summary: {
        year: new Date().getFullYear().toString(),
        totalParticipants,
        totalOptedIn,
        totalCommission,
        averageMonthlyCommission: totalCommission / 12,
      },
      chartData,
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-80 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  const data = earningsData || generateDemoData()
  const currentMonthData = data.chartData[data.chartData.length - 1]
  const previousMonthData = data.chartData[data.chartData.length - 2]
  const monthlyGrowth = previousMonthData?.earnings
    ? ((currentMonthData.earnings - previousMonthData.earnings) / previousMonthData.earnings) * 100
    : 0

  // Get tier progress
  const tierInfo = getNextTier(currentMonthData.participants)

  return (
    <div className="p-6 lg:p-8 relative">
      {/* Notification Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onDismiss={handleDismissNotification}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Header with Date Range Picker, Export, and Refresh */}
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your earnings overview."
        breadcrumbs={[
          { label: "Partner Portal", href: "/partner" },
          { label: "Dashboard" },
        ]}
        showDateRangePicker
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        showExport
        exportFormats={["csv", "pdf", "excel"]}
        onExport={handleExport}
        showRefresh
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Connection Status Indicator */}
      <div className="flex items-center justify-end mb-4 -mt-2">
        <ConnectionStatusIndicator
          connectionState={connectionState}
          lastUpdated={effectiveLastUpdated}
          onReconnect={reconnect}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Monthly Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            {monthlyGrowth !== 0 && (
              <span className={`flex items-center text-sm font-medium ${monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <ArrowUpRight className={`w-4 h-4 ${monthlyGrowth < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(monthlyGrowth).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-1">This Month</p>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber
              value={currentMonthData.earnings}
              format="currency"
              decimals={0}
              duration={800}
            />
          </div>
        </motion.div>

        {/* Total YTD Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Year-to-Date</p>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber
              value={data.summary.totalCommission}
              format="currency"
              decimals={0}
              duration={800}
            />
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Participants (This Month)</p>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber
              value={currentMonthData.participants}
              format="number"
              decimals={0}
              duration={800}
            />
          </div>
        </motion.div>

        {/* Commission Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Commission Rate</p>
          <div className="text-2xl font-bold text-slate-900">
            <AnimatedNumber
              value={tierInfo.currentTier.percentage}
              format="number"
              decimals={0}
              duration={800}
              suffix="%"
            />
          </div>
          <p className="text-xs text-slate-500">${tierInfo.currentTier.perParticipant}/participant</p>
        </motion.div>
      </div>

      {/* Chart and Tier Progress */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Earnings Trend</h3>
              <p className="text-sm text-slate-500">Last 12 months performance</p>
            </div>
            <Link
              href="/partner/earnings"
              className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <EarningsChart data={data.chartData} />
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-900">Tier Progress</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100">
              <p className="text-sm text-slate-600 mb-1">Current Tier</p>
              <p className="text-xl font-bold text-teal-600">{tierInfo.currentTier.percentage}% Commission</p>
              <p className="text-sm text-slate-500 mt-1">
                {tierInfo.currentTier.minVolume.toLocaleString()} - {tierInfo.currentTier.maxVolume === Infinity ? '∞' : tierInfo.currentTier.maxVolume.toLocaleString()} participants
              </p>
            </div>

            {tierInfo.nextTier && (
              <>
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentMonthData.participants / tierInfo.nextTier.minVolume) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    {tierInfo.participantsToNext.toLocaleString()} more to next tier
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Next Tier</p>
                  <p className="text-lg font-bold text-slate-900">{tierInfo.nextTier.percentage}% Commission</p>
                  <p className="text-sm text-teal-600 font-medium">
                    +{tierInfo.percentageIncrease}% increase
                  </p>
                </div>
              </>
            )}

            {!tierInfo.nextTier && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-amber-700">Top Tier Achieved!</p>
                </div>
                <p className="text-sm text-slate-600">You&apos;re earning the maximum commission rate.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Link
          href="/partner/earnings"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Report Participants</p>
              <p className="text-sm text-slate-500">Update monthly numbers</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>

        <Link
          href="/partner/materials"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Marketing Materials</p>
              <p className="text-sm text-slate-500">Download resources</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>

        <Link
          href="/partner/profile"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Profile Settings</p>
              <p className="text-sm text-slate-500">Manage your account</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>
      </motion.div>

      {/* Integration Support Chat Widget */}
      <IntegrationChatWidget
        topic="widget_install"
        position="bottom-right"
        primaryColor="#14B8A6"
      />
    </div>
  )
}
