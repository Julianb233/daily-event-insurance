"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Users,
  Shield,
  AlertCircle,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

// Types for Sures dashboard data
interface SuresDashboardStats {
  overview: {
    totalPolicies: number
    activePolicies: number
    totalParticipants: number
    pendingClaims: number
    processedClaims: number
    claimsThisMonth: number
  }
  policyVolume: {
    date: string
    policies: number
    participants: number
  }[]
  recentPolicies: {
    id: string
    policyNumber: string
    partnerName: string
    participants: number
    status: "active" | "expired" | "cancelled"
    effectiveDate: string
    expiryDate: string
  }[]
  claimsStats: {
    pending: number
    approved: number
    rejected: number
    underReview: number
  }
  apiSync: {
    lastSync: string
    status: "healthy" | "warning" | "error"
    policiesSynced: number
    claimsSynced: number
  }
  period: string
  generatedAt: string
}

// Mock data for development
function generateMockData(): SuresDashboardStats {
  const mockPolicyVolume = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    mockPolicyVolume.push({
      date: date.toISOString().split('T')[0],
      policies: Math.floor(Math.random() * 50) + 80,
      participants: Math.floor(Math.random() * 200) + 300,
    })
  }

  return {
    overview: {
      totalPolicies: 3842,
      activePolicies: 3241,
      totalParticipants: 12450,
      pendingClaims: 23,
      processedClaims: 187,
      claimsThisMonth: 45,
    },
    policyVolume: mockPolicyVolume,
    recentPolicies: [
      {
        id: "1",
        policyNumber: "POL-2026-001234",
        partnerName: "Adventure Sports Inc",
        participants: 45,
        status: "active",
        effectiveDate: "2026-01-10",
        expiryDate: "2026-02-10",
      },
      {
        id: "2",
        policyNumber: "POL-2026-001235",
        partnerName: "Mountain Climbers Co",
        participants: 32,
        status: "active",
        effectiveDate: "2026-01-11",
        expiryDate: "2026-02-11",
      },
      {
        id: "3",
        policyNumber: "POL-2026-001236",
        partnerName: "Urban Gym Network",
        participants: 78,
        status: "active",
        effectiveDate: "2026-01-12",
        expiryDate: "2026-02-12",
      },
      {
        id: "4",
        policyNumber: "POL-2026-001237",
        partnerName: "Outdoor Adventures LLC",
        participants: 23,
        status: "active",
        effectiveDate: "2026-01-12",
        expiryDate: "2026-02-12",
      },
      {
        id: "5",
        policyNumber: "POL-2026-001238",
        partnerName: "Summit Fitness",
        participants: 56,
        status: "active",
        effectiveDate: "2026-01-13",
        expiryDate: "2026-02-13",
      },
    ],
    claimsStats: {
      pending: 23,
      approved: 142,
      rejected: 18,
      underReview: 27,
    },
    apiSync: {
      lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      status: "healthy",
      policiesSynced: 3842,
      claimsSynced: 210,
    },
    period: "30d",
    generatedAt: new Date().toISOString(),
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const statusConfig = {
  active: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-100" },
  expired: { label: "Expired", color: "text-slate-600", bg: "bg-slate-100" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-100" },
}

export default function SuresDashboardPage() {
  const [dashboardData, setDashboardData] = useState<SuresDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/sures/dashboard")
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
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Sures Carrier Dashboard</h1>
        <p className="text-slate-600 mt-1">Policy and claims overview</p>
      </motion.div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center text-sm font-medium text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Policies</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.totalPolicies.toLocaleString()}</p>
        </motion.div>

        {/* Active Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-slate-500">
              {((data.overview.activePolicies / data.overview.totalPolicies) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Active Policies</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.activePolicies.toLocaleString()}</p>
        </motion.div>

        {/* Total Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-slate-500">
              Avg {Math.round(data.overview.totalParticipants / data.overview.totalPolicies)}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Participants</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.totalParticipants.toLocaleString()}</p>
        </motion.div>

        {/* Pending Claims */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-slate-500">
              {data.overview.claimsThisMonth} this month
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Pending Claims</p>
          <p className="text-2xl font-bold text-slate-900">{data.overview.pendingClaims}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Policy Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Policy Volume</h3>
              <p className="text-sm text-slate-500">Last 30 days</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.policyVolume}>
                <defs>
                  <linearGradient id="colorPolicies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelFormatter={(value) => formatDate(value)}
                />
                <Area
                  type="monotone"
                  dataKey="policies"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPolicies)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Claims Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Claims Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Pending</span>
                </div>
                <span className="font-bold text-slate-900">{data.claimsStats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Approved</span>
                </div>
                <span className="font-bold text-slate-900">{data.claimsStats.approved}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Under Review</span>
                </div>
                <span className="font-bold text-slate-900">{data.claimsStats.underReview}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-slate-700">Rejected</span>
                </div>
                <span className="font-bold text-slate-900">{data.claimsStats.rejected}</span>
              </div>
            </div>
            <Link
              href="/sures/call-center"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
            >
              View All Claims
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* API Sync Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">API Sync</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.apiSync.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                  data.apiSync.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {data.apiSync.status === 'healthy' ? '● Healthy' :
                   data.apiSync.status === 'warning' ? '● Warning' :
                   '● Error'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Sync</span>
                <span className="text-sm font-medium text-slate-900">{formatTimeAgo(data.apiSync.lastSync)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Policies Synced</span>
                  <span className="text-sm font-semibold text-slate-900">{data.apiSync.policiesSynced.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Claims Synced</span>
                  <span className="text-sm font-semibold text-slate-900">{data.apiSync.claimsSynced.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Link
              href="/sures/sync"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
            >
              Manage Sync
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Policies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Policies</h3>
              <p className="text-sm text-slate-500">Latest policy submissions</p>
            </div>
            <Link
              href="/sures/policies"
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/sures/policies/${policy.id}`}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      {policy.policyNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{policy.partnerName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{policy.participants}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(policy.effectiveDate)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(policy.expiryDate)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[policy.status].bg
                      } ${statusConfig[policy.status].color}`}
                    >
                      {statusConfig[policy.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
