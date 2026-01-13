"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Building2,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import { SparklineCard } from "@/components/charts/SparklineCard"
import { SkeletonStatsRow, SkeletonChart } from "@/components/shared/Skeleton"

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
  period: string
  generatedAt: string
}

// Mock data for development - matches API structure
function generateMockData(): DashboardStats {
  return {
    overview: {
      totalPartners: 47,
      activePartners: 38,
      pendingPartners: 9,
      totalPolicies: 3842,
      activePolicies: 3241,
      totalQuotes: 5234,
      conversionRate: 73.4,
    },
    revenue: {
      totalPremium: 287540.00,
      totalCommissions: 129393.00,
      totalParticipants: 12450,
      avgPremiumPerPolicy: 74.85,
      avgCommissionRate: 0.45,
    },
    topPartners: [
      { id: "1", name: "Adventure Sports Inc", revenue: 45200, commission: 22600, policies: 512 },
      { id: "2", name: "Mountain Climbers Co", revenue: 38900, commission: 19450, policies: 423 },
      { id: "3", name: "Urban Gym Network", revenue: 32100, commission: 16050, policies: 378 },
      { id: "4", name: "Outdoor Adventures LLC", revenue: 28700, commission: 14350, policies: 312 },
      { id: "5", name: "Summit Fitness", revenue: 24500, commission: 12250, policies: 289 },
    ],
    commissionTiers: [
      { name: "Bronze", rate: 0.40 },
      { name: "Silver", rate: 0.45 },
      { name: "Gold", rate: 0.50 },
      { name: "Platinum", rate: 0.55 },
    ],
    pendingPayouts: {
      count: 12,
      totalAmount: 15670.50,
    },
    period: "30d",
    generatedAt: new Date().toISOString(),
  }
}

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

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const result = await response.json()
        setDashboardData(result.data)
      } catch (err) {
        console.error("Error fetching dashboard:", err)
        // Use mock data if API fails
        setDashboardData(generateMockData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
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

  const data = dashboardData || generateMockData()

  // Mock sparkline data for 7-day trends
  const premiumTrend = [245000, 252000, 258000, 265000, 272000, 280000, 287540]
  const partnerTrend = [32, 33, 35, 36, 37, 38, 38]
  const policyTrend = [3200, 3350, 3480, 3620, 3720, 3810, 3842]
  const payoutTrend = [18500, 17200, 16800, 16200, 15900, 15800, 15670]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">System overview and performance metrics</p>
      </motion.div>

      {/* Primary Stats Grid */}
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
            data={premiumTrend}
            icon={<DollarSign className="w-6 h-6" />}
            color="violet"
            change={12.5}
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
            data={partnerTrend}
            icon={<Building2 className="w-6 h-6" />}
            color="blue"
            change={5.6}
            subtitle={`${data.overview.pendingPartners} pending`}
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
            data={policyTrend}
            icon={<FileText className="w-6 h-6" />}
            color="emerald"
            change={8.3}
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
            data={payoutTrend}
            icon={<Clock className="w-6 h-6" />}
            color="amber"
            change={-15.3}
            format="currency"
            subtitle={`${data.pendingPayouts.count} payouts`}
          />
        </motion.div>
      </div>

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
              <p className="text-sm text-slate-500">By total revenue this month</p>
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
            {data.topPartners.map((partner, index) => (
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
                <div className="font-bold text-slate-900">
                  <AnimatedNumber value={partner.revenue} format="currency" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

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
              <span className="text-sm text-slate-600">Avg. Commission Rate</span>
              <div className="font-semibold text-slate-900">
                <AnimatedNumber value={data.revenue.avgCommissionRate * 100} format="percentage" decimals={1} />
              </div>
            </div>
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
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>

          <Link
            href="/admin/partners?status=pending"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Review Pending Partners
              </p>
              <p className="text-sm text-slate-500">
                {data.overview.pendingPartners} partners awaiting approval
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/payouts"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
          >
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
            href="/admin/commission-tiers"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Manage Commission Tiers
              </p>
              <p className="text-sm text-slate-500">
                Configure rates and bonuses
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
      </div>
    </div>
  )
}
