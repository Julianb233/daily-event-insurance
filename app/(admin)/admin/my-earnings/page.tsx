'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Globe,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
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

export default function MyEarningsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch(`/api/admin/my-earnings?period=${period}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch earnings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
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
          <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
          <p className="text-gray-500">Track your commission from leads and microsites</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Income Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              data?.today?.change >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {data?.today?.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.today?.change || 0)} vs yesterday
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.today?.amount || 0)}</p>
          <p className="text-violet-200 text-sm mt-1">Today's Earnings</p>
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
              data?.week?.change >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {data?.week?.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.week?.change || 0)} vs last week
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.week?.amount || 0)}</p>
          <p className="text-blue-200 text-sm mt-1">This Week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${
              data?.month?.change >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {data?.month?.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(data?.month?.change || 0)} vs last month
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.month?.amount || 0)}</p>
          <p className="text-teal-200 text-sm mt-1">This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.ytd?.amount || 0)}</p>
          <p className="text-emerald-200 text-sm mt-1">Year to Date</p>
        </motion.div>
      </div>

      {/* Chart and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Income Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Income Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
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
                  formatter={(value: any) => [formatCurrency(value), 'Total']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Income by Source</h2>

          <div className="space-y-6">
            {/* Lead Fees */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Lead Fees (25%)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(data?.byType?.leadFees?.amount || 0)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${data?.summary?.totalEarned ? (data.byType.leadFees.amount / data.summary.totalEarned * 100) : 0}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{data?.byType?.leadFees?.count || 0} leads</p>
            </div>

            {/* Microsite Setup */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium text-gray-700">Microsite Setup ($550)</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(data?.byType?.micrositeSetup?.amount || 0)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{
                    width: `${data?.summary?.totalEarned ? (data.byType.micrositeSetup.amount / data.summary.totalEarned * 100) : 0}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{data?.byType?.micrositeSetup?.count || 0} microsites</p>
            </div>

            <hr className="border-gray-200" />

            {/* Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Earned</span>
                <span className="font-semibold text-gray-900">{formatCurrency(data?.summary?.totalEarned || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pending Payout</span>
                <span className="font-semibold text-yellow-600">{formatCurrency(data?.summary?.pendingPayout || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paid Out</span>
                <span className="font-semibold text-green-600">{formatCurrency(data?.summary?.paidOut || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Earnings</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {(data?.recent || []).map((earning: any) => (
            <div key={earning.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    earning.earningType === 'lead_fee'
                      ? 'bg-blue-100'
                      : 'bg-teal-100'
                  }`}>
                    {earning.earningType === 'lead_fee'
                      ? <Users className="w-5 h-5 text-blue-600" />
                      : <Globe className="w-5 h-5 text-teal-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {earning.earningType === 'lead_fee' ? 'Lead Fee' : 'Microsite Setup'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {earning.partnerName} {earning.leadEmail && `• ${earning.leadEmail}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    +{formatCurrency(parseFloat(earning.earnedAmount))}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {new Date(earning.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
