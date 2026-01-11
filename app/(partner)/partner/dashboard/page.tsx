"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Target,
  Globe,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Rocket,
  BookOpen,
  Download,
  CheckCircle2,
  X,
} from "lucide-react"
import Link from "next/link"
import { EarningsChart } from "@/components/partner/EarningsChart"
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

interface MicrositeData {
  id: string
  domain?: string | null
  subdomain?: string | null
  customDomain?: string | null
  siteName: string
  status: string
  qrCodeUrl?: string | null
  launchedAt?: string | null
}

export default function PartnerDashboardPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [micrositeData, setMicrositeData] = useState<MicrositeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showGettingStarted, setShowGettingStarted] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    // Check localStorage for completed steps on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('partner_onboarding_steps')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Save completed steps to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(completedSteps).length > 0) {
      localStorage.setItem('partner_onboarding_steps', JSON.stringify(completedSteps))
    }
  }, [completedSteps])

  const toggleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch earnings
        const earningsResponse = await fetch("/api/partner/earnings")
        if (earningsResponse.ok) {
          const data = await earningsResponse.json()
          setEarningsData(data)
        } else {
          // Use demo data if API fails
          const demoData = generateDemoData()
          setEarningsData(demoData)
        }

        // Fetch profile with microsite info
        const profileResponse = await fetch("/api/partner/profile")
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          if (profileData.microsite) {
            setMicrositeData(profileData.microsite)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        // Use demo data if API fails
        const demoData = generateDemoData()
        setEarningsData(demoData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getMicrositeUrl = () => {
    if (micrositeData?.customDomain) {
      return `https://${micrositeData.customDomain}`
    }
    if (micrositeData?.subdomain) {
      return `https://dailyeventinsurance.com/${micrositeData.subdomain}`
    }
    return null
  }

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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here&apos;s your earnings overview.</p>
      </motion.div>

      {/* Getting Started Section - Show for new partners */}
      {showGettingStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100 relative"
        >
          <button
            onClick={() => setShowGettingStarted(false)}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/50 rounded-lg transition-colors"
            title="Dismiss getting started guide"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Getting Started</h2>
              <p className="text-sm text-slate-600">Complete these steps to start earning with your partnership</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: View Your Microsite */}
            <div
              className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
                completedSteps.viewMicrosite
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => toggleStepComplete('viewMicrosite')}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSteps.viewMicrosite
                    ? 'bg-green-500'
                    : 'bg-blue-100'
                }`}>
                  {completedSteps.viewMicrosite ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Globe className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">View Your Microsite</h3>
                  <p className="text-xs text-slate-500 mt-1">See your branded insurance portal</p>
                </div>
              </div>
              {micrositeData && getMicrositeUrl() && (
                <a
                  href={getMicrositeUrl()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCompletedSteps(prev => ({ ...prev, viewMicrosite: true }))
                  }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Open Microsite <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Step 2: Download Marketing Materials */}
            <Link
              href="/partner/materials"
              className={`bg-white rounded-xl p-4 border transition-all ${
                completedSteps.downloadMaterials
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setCompletedSteps(prev => ({ ...prev, downloadMaterials: true }))}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSteps.downloadMaterials
                    ? 'bg-green-500'
                    : 'bg-pink-100'
                }`}>
                  {completedSteps.downloadMaterials ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Download className="w-4 h-4 text-pink-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Download Materials</h3>
                  <p className="text-xs text-slate-500 mt-1">Get logos, flyers & social templates</p>
                </div>
              </div>
              <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                View Library <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Step 3: Review Training */}
            <Link
              href="/partner/materials?category=training"
              className={`bg-white rounded-xl p-4 border transition-all ${
                completedSteps.reviewTraining
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setCompletedSteps(prev => ({ ...prev, reviewTraining: true }))}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSteps.reviewTraining
                    ? 'bg-green-500'
                    : 'bg-amber-100'
                }`}>
                  {completedSteps.reviewTraining ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Review Training</h3>
                  <p className="text-xs text-slate-500 mt-1">Learn best practices & guides</p>
                </div>
              </div>
              <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                Start Training <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Step 4: Check Documents */}
            <Link
              href="/partner/documents"
              className={`bg-white rounded-xl p-4 border transition-all ${
                completedSteps.checkDocuments
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setCompletedSteps(prev => ({ ...prev, checkDocuments: true }))}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSteps.checkDocuments
                    ? 'bg-green-500'
                    : 'bg-purple-100'
                }`}>
                  {completedSteps.checkDocuments ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <FileText className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Check Documents</h3>
                  <p className="text-xs text-slate-500 mt-1">Review agreements & contracts</p>
                </div>
              </div>
              <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                View Documents <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 pt-4 border-t border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {Object.values(completedSteps).filter(Boolean).length} of 4 steps completed
              </span>
              <span className="text-blue-600 font-medium">
                {Math.round((Object.values(completedSteps).filter(Boolean).length / 4) * 100)}% complete
              </span>
            </div>
            <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: `${(Object.values(completedSteps).filter(Boolean).length / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

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
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentMonthData.earnings)}</p>
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
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.summary.totalCommission)}</p>
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
          <p className="text-2xl font-bold text-slate-900">{currentMonthData.participants.toLocaleString()}</p>
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
          <p className="text-2xl font-bold text-slate-900">{tierInfo.currentTier.percentage}%</p>
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
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 mb-6">
            <Target className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-amber-700">Top Tier Achieved!</p>
                </div>
                <p className="text-sm text-slate-600 text-center sm:text-left">You&apos;re earning the maximum commission rate.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Microsite & QR Code Section */}
      {micrositeData && micrositeData.status === 'live' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-teal-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Microsite Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Microsite</h3>
                  <p className="text-sm text-slate-600">Share this link with your customers</p>
                </div>
              </div>

              {getMicrositeUrl() && (
                <div className="bg-white rounded-xl p-4 border border-teal-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-slate-500">Microsite URL</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-teal-700 bg-teal-50 px-3 py-2 rounded-lg font-mono truncate">
                      {getMicrositeUrl()}
                    </code>
                    <button
                      onClick={() => copyToClipboard(getMicrositeUrl()!)}
                      className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                      title="Copy URL"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <a
                      href={getMicrositeUrl()!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-5 h-5 text-slate-500" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            {micrositeData.qrCodeUrl && (
              <div className="lg:w-48 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">QR Code</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-sm">
                  <img
                    src={micrositeData.qrCodeUrl}
                    alt="Microsite QR Code"
                    className="w-36 h-36"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Scan to access your customer portal
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Link
          href="/partner/earnings"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Report Participants</p>
              <p className="text-sm text-slate-500">Update monthly numbers</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all hidden sm:block sm:ml-auto" />
          </div>
        </Link>

        <Link
          href="/partner/materials"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Marketing Materials</p>
              <p className="text-sm text-slate-500">Download resources</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all hidden sm:block sm:ml-auto" />
          </div>
        </Link>

        <Link
          href="/partner/profile"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Profile Settings</p>
              <p className="text-sm text-slate-500">Manage your account</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all hidden sm:block sm:ml-auto" />
          </div>
        </Link>

        <Link
          href="/partner/documents"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Legal Documents</p>
              <p className="text-sm text-slate-500">View signed agreements</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all hidden sm:block sm:ml-auto" />
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
