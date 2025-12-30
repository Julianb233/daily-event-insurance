"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Download,
  Plus,
  X,
  Check,
  Calculator,
} from "lucide-react"
import { EarningsChart } from "@/components/partner/EarningsChart"
import {
  formatCurrency,
  getCommissionTier,
  calculateEarnings,
  getCurrentYearMonth,
  getLastNMonths,
  getMonthName,
  OPT_IN_RATE,
  commissionTiers,
} from "@/lib/commission-tiers"

interface MonthlyEarning {
  id: string
  year_month: string
  total_participants: number
  opted_in_participants: number
  partner_commission: number
}

interface EarningsData {
  summary: {
    year: string
    totalParticipants: number
    totalOptedIn: number
    totalCommission: number
    averageMonthlyCommission: number
  }
  earnings: MonthlyEarning[]
  chartData: Array<{
    month: string
    participants: number
    optedIn: number
    earnings: number
  }>
}

export default function PartnerEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportMonth, setReportMonth] = useState(getCurrentYearMonth())
  const [reportParticipants, setReportParticipants] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  useEffect(() => {
    fetchEarnings()
  }, [selectedYear])

  async function fetchEarnings() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/partner/earnings?year=${selectedYear}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const earningsData = await response.json()
      setData(earningsData)
    } catch (err) {
      console.error("Error:", err)
      // Generate demo data
      setData(generateDemoData())
    } finally {
      setIsLoading(false)
    }
  }

  function generateDemoData(): EarningsData {
    const months = getLastNMonths(12)
    const earnings: MonthlyEarning[] = months.map((month, index) => {
      const participants = 800 + index * 150 + Math.floor(Math.random() * 200)
      const optedIn = Math.round(participants * OPT_IN_RATE)
      const { monthlyEarnings } = calculateEarnings(participants, 1)
      return {
        id: `demo-${month}`,
        year_month: month,
        total_participants: participants,
        opted_in_participants: optedIn,
        partner_commission: monthlyEarnings,
      }
    })

    const chartData = earnings.map((e) => ({
      month: e.year_month,
      participants: e.total_participants,
      optedIn: e.opted_in_participants,
      earnings: e.partner_commission,
    }))

    const totalParticipants = earnings.reduce((sum, e) => sum + e.total_participants, 0)
    const totalCommission = earnings.reduce((sum, e) => sum + e.partner_commission, 0)

    return {
      summary: {
        year: selectedYear,
        totalParticipants,
        totalOptedIn: Math.round(totalParticipants * OPT_IN_RATE),
        totalCommission,
        averageMonthlyCommission: totalCommission / 12,
      },
      earnings,
      chartData,
    }
  }

  async function handleSubmitReport() {
    if (!reportParticipants) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/partner/earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yearMonth: reportMonth,
          totalParticipants: parseInt(reportParticipants),
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setShowReportModal(false)
      setReportParticipants("")
      fetchEarnings()
    } catch (err) {
      console.error("Error submitting:", err)
      alert("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate projected earnings for input
  const projectedEarnings = reportParticipants
    ? calculateEarnings(parseInt(reportParticipants) || 0, 1)
    : null

  function exportToCSV() {
    if (!data?.earnings) return

    const headers = ["Month", "Participants", "Opted In", "Commission"]
    const rows = data.earnings.map((e) => [
      getMonthName(e.year_month),
      e.total_participants,
      e.opted_in_participants,
      e.partner_commission.toFixed(2),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `earnings-${selectedYear}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-80 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Earnings</h1>
          <p className="text-slate-600 mt-1">Track your commission earnings and report participants.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value={String(new Date().getFullYear())}>{new Date().getFullYear()}</option>
            <option value={String(new Date().getFullYear() - 1)}>{new Date().getFullYear() - 1}</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-colors shadow-lg shadow-teal-500/25"
          >
            <Plus className="w-4 h-4" />
            Report Participants
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm text-slate-500">Total Earnings</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 text-center sm:text-left">
            {formatCurrency(data?.summary.totalCommission || 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-500">Total Participants</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 text-center sm:text-left">
            {(data?.summary.totalParticipants || 0).toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-500">Avg Monthly</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 text-center sm:text-left">
            {formatCurrency(data?.summary.averageMonthlyCommission || 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">Months Reported</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 text-center sm:text-left">
            {data?.earnings.length || 0}
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Earnings Over Time</h3>
        <EarningsChart data={data?.chartData || []} />
      </motion.div>

      {/* Monthly Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Participants</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Opted In</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.earnings.map((earning) => (
                <tr key={earning.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {getMonthName(earning.year_month)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">
                    {earning.total_participants.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">
                    {earning.opted_in_participants.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-teal-600 text-right">
                    {formatCurrency(earning.partner_commission)}
                  </td>
                </tr>
              ))}
              {(!data?.earnings || data.earnings.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No earnings data yet. Report your first month&apos;s participants to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Commission Tiers Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-slate-50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Commission Tiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {commissionTiers.map((tier, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center border border-slate-200">
              <div className="text-lg font-bold text-teal-600">{tier.percentage}%</div>
              <div className="text-xs text-slate-500 mt-1">
                {tier.minVolume.toLocaleString()}{tier.maxVolume === Infinity ? '+' : `-${tier.maxVolume.toLocaleString()}`}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">${tier.perParticipant}/person</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReportModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Participants</h3>
                <p className="text-sm text-slate-500">Enter your monthly numbers</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                <input
                  type="month"
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Participants</label>
                <input
                  type="number"
                  value={reportParticipants}
                  onChange={(e) => setReportParticipants(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {projectedEarnings && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-sm text-slate-600 mb-1">Projected Earnings</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {formatCurrency(projectedEarnings.monthlyEarnings)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {projectedEarnings.tierPercentage}% commission tier • {projectedEarnings.optedInParticipants.toLocaleString()} opted in (65%)
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmitReport}
                disabled={!reportParticipants || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
