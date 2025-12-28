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

// Types for dashboard data
interface DashboardStats {
  overview: {
    totalPartners: number
    activePartners: number
    pendingPartners: number
    totalPolicies: number
    totalRevenue: number
    totalCommission: number
    pendingPayouts: number
  }
  revenue: {
    daily: { date: string; amount: number }[]
    monthly: { month: string; amount: number }[]
  }
  topPartners: {
    id: string
    businessName: string
    totalRevenue: number
    policyCount: number
  }[]
  recentActivity: {
    id: string
    type: string
    description: string
    timestamp: string
  }[]
  commissionTiers: {
    tierName: string
    partnerCount: number
    totalRevenue: number
  }[]
}

// Mock data for development
function generateMockData(): DashboardStats {
  return {
    overview: {
      totalPartners: 47,
      activePartners: 38,
      pendingPartners: 9,
      totalPolicies: 3842,
      totalRevenue: 287540.00,
      totalCommission: 129393.00,
      pendingPayouts: 12450.00,
    },
    revenue: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
        amount: 5000 + Math.random() * 10000,
      })),
      monthly: [
        { month: "Jul", amount: 18500 },
        { month: "Aug", amount: 22300 },
        { month: "Sep", amount: 25800 },
        { month: "Oct", amount: 31200 },
        { month: "Nov", amount: 28900 },
        { month: "Dec", amount: 35400 },
      ],
    },
    topPartners: [
      { id: "1", businessName: "Adventure Sports Inc", totalRevenue: 45200, policyCount: 512 },
      { id: "2", businessName: "Mountain Climbers Co", totalRevenue: 38900, policyCount: 423 },
      { id: "3", businessName: "Urban Gym Network", totalRevenue: 32100, policyCount: 378 },
      { id: "4", businessName: "Outdoor Adventures LLC", totalRevenue: 28700, policyCount: 312 },
      { id: "5", businessName: "Summit Fitness", totalRevenue: 24500, policyCount: 289 },
    ],
    recentActivity: [
      { id: "1", type: "partner_approved", description: "New partner approved: Peak Performance Gym", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "2", type: "payout_processed", description: "Payout processed: $2,450 to Adventure Sports Inc", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: "3", type: "tier_updated", description: "Urban Gym Network upgraded to Gold tier", timestamp: new Date(Date.now() - 14400000).toISOString() },
      { id: "4", type: "policy_milestone", description: "System milestone: 3,800 policies issued", timestamp: new Date(Date.now() - 28800000).toISOString() },
    ],
    commissionTiers: [
      { tierName: "Bronze", partnerCount: 18, totalRevenue: 42300 },
      { tierName: "Silver", partnerCount: 12, totalRevenue: 68500 },
      { tierName: "Gold", partnerCount: 6, totalRevenue: 89200 },
      { tierName: "Platinum", partnerCount: 2, totalRevenue: 87540 },
    ],
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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-slate-200 rounded-xl" />
            <div className="h-80 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const data = dashboardData || generateMockData()

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
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              12.5%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.overview.totalRevenue)}</p>
        </motion.div>

        {/* Total Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-slate-500">
              {data.overview.pendingPartners} pending
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Active Partners</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.activePartners}</p>
        </motion.div>

        {/* Total Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              8.3%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Policies</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.totalPolicies.toLocaleString()}</p>
        </motion.div>

        {/* Pending Payouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Pending Payouts</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.overview.pendingPayouts)}</p>
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
                    <p className="font-semibold text-slate-900">{partner.businessName}</p>
                    <p className="text-sm text-slate-500">{partner.policyCount} policies</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900">{formatCurrency(partner.totalRevenue)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Commission Tiers Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-violet-600" />
            <h3 className="text-lg font-bold text-slate-900">Tier Distribution</h3>
          </div>

          <div className="space-y-4">
            {data.commissionTiers.map((tier) => {
              const colors: Record<string, string> = {
                Bronze: "from-amber-600 to-amber-700",
                Silver: "from-slate-400 to-slate-500",
                Gold: "from-yellow-500 to-yellow-600",
                Platinum: "from-violet-500 to-violet-600",
              }
              return (
                <div key={tier.tierName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colors[tier.tierName] || 'from-slate-400 to-slate-500'}`} />
                      <span className="text-sm font-medium text-slate-700">{tier.tierName}</span>
                    </div>
                    <span className="text-sm text-slate-500">{tier.partnerCount} partners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${colors[tier.tierName] || 'from-slate-400 to-slate-500'} h-2 rounded-full`}
                        style={{
                          width: `${(tier.totalRevenue / data.overview.totalRevenue) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-20 text-right">
                      {formatCurrency(tier.totalRevenue)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
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

      {/* Activity and Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => {
              const icons: Record<string, React.ReactNode> = {
                partner_approved: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                payout_processed: <DollarSign className="w-5 h-5 text-blue-500" />,
                tier_updated: <TrendingUp className="w-5 h-5 text-purple-500" />,
                policy_milestone: <FileText className="w-5 h-5 text-amber-500" />,
              }
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="mt-0.5">
                    {icons[activity.type] || <AlertCircle className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
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
                {formatCurrency(data.overview.pendingPayouts)} pending
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
