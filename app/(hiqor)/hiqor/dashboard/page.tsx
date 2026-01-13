'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Wallet,
  FileText,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardData {
  income: {
    today: { amount: number; change: number; policies: number }
    week: { amount: number; change: number; policies: number }
    month: { amount: number; change: number; policies: number }
    ytd: { amount: number; change: number }
  }
  chartData: Array<{ date: string; premium: number; policies: number }>
  stats: {
    totalPolicies: number
    activePolicies: number
    totalParticipants: number
    pendingClaims: number
  }
  recentPolicies: Array<{
    id: string
    policyNumber: string
    holderName: string
    premium: number
    createdAt: string
    status: string
  }>
  syncStatus: {
    lastSync: string
    status: string
    recordsProcessed: number
  }
}

// Mock data for development
const mockData: DashboardData = {
  income: {
    today: { amount: 3450, change: 8, policies: 12 },
    week: { amount: 18230, change: 5, policies: 67 },
    month: { amount: 72540, change: 12, policies: 243 },
    ytd: { amount: 687540, change: 32 },
  },
  chartData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    premium: Math.floor(Math.random() * 3000) + 1500,
    policies: Math.floor(Math.random() * 15) + 5,
  })),
  stats: {
    totalPolicies: 2847,
    activePolicies: 1234,
    totalParticipants: 15670,
    pendingClaims: 23,
  },
  recentPolicies: [
    { id: '1', policyNumber: 'POL-2025-001234', holderName: 'Smith Wedding', premium: 275, createdAt: new Date().toISOString(), status: 'active' },
    { id: '2', policyNumber: 'POL-2025-001233', holderName: 'Johnson Corp Event', premium: 450, createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'active' },
    { id: '3', policyNumber: 'POL-2025-001232', holderName: 'Davis Birthday', premium: 125, createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'pending' },
    { id: '4', policyNumber: 'POL-2025-001231', holderName: 'Wilson Anniversary', premium: 350, createdAt: new Date(Date.now() - 10800000).toISOString(), status: 'active' },
    { id: '5', policyNumber: 'POL-2025-001230', holderName: 'Brown Graduation', premium: 200, createdAt: new Date(Date.now() - 14400000).toISOString(), status: 'active' },
  ],
  syncStatus: {
    lastSync: new Date(Date.now() - 300000).toISOString(),
    status: 'success',
    recordsProcessed: 1234,
  },
}

export default function HiqorDashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from /api/hiqor/dashboard
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setData(mockData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value}%`
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HIQOR Dashboard</h1>
          <p className="text-gray-500">Track policies, premiums, and performance</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sync Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
            {data?.syncStatus.status === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm text-gray-600">
              Synced {data?.syncStatus.lastSync ? new Date(data.syncStatus.lastSync).toLocaleTimeString() : 'never'}
            </span>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
            {(['7d', '30d', '90d', '1y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  period === p
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Income Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              (data?.income.today.change || 0) >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {(data?.income.today.change || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.income.today.change || 0)} vs yesterday
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.income.today.amount || 0)}</p>
          <p className="text-indigo-200 text-sm mt-1">Today's Premium • {data?.income.today.policies} policies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              (data?.income.week.change || 0) >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {(data?.income.week.change || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.income.week.change || 0)} vs last week
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.income.week.amount || 0)}</p>
          <p className="text-blue-200 text-sm mt-1">This Week • {data?.income.week.policies} policies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              (data?.income.month.change || 0) >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {(data?.income.month.change || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.income.month.change || 0)} vs last month
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.income.month.amount || 0)}</p>
          <p className="text-purple-200 text-sm mt-1">This Month • {data?.income.month.policies} policies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              (data?.income.ytd.change || 0) >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {(data?.income.ytd.change || 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.income.ytd.change || 0)} vs last year
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.income.ytd.amount || 0)}</p>
          <p className="text-violet-200 text-sm mt-1">Year to Date</p>
        </motion.div>
      </div>

      {/* Chart and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Premium Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Premium Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), 'Premium']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                />
                <Area
                  type="monotone"
                  dataKey="premium"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#colorPremium)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Policies</p>
                  <p className="text-lg font-bold text-gray-900">{data?.stats.totalPolicies.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Policies</p>
                  <p className="text-lg font-bold text-gray-900">{data?.stats.activePolicies.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Participants</p>
                  <p className="text-lg font-bold text-gray-900">{data?.stats.totalParticipants.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Claims</p>
                  <p className="text-lg font-bold text-gray-900">{data?.stats.pendingClaims}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Policies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Policies</h2>
          <a href="/hiqor/policies" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recentPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{policy.policyNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{policy.holderName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(policy.premium)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      policy.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(policy.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
