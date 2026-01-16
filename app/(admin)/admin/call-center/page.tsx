"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalLeads: number
  leadsToday: number
  activeCalls: number
  callsToday: number
  smsToday: number
  conversionsToday: number
  conversionRate: number
  averageCallDuration: number
  revenueToday: number
}

const mockStats: DashboardStats = {
  totalLeads: 1247,
  leadsToday: 23,
  activeCalls: 2,
  callsToday: 47,
  smsToday: 156,
  conversionsToday: 8,
  conversionRate: 17,
  averageCallDuration: 245,
  revenueToday: 800,
}

export default function CallCenterDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Call Center Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Monitor your AI agents and lead conversion performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            {stats.activeCalls > 0 && (
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-1">Active Calls</p>
          <p className="text-3xl font-bold text-slate-900">{stats.activeCalls}</p>
        </motion.div>

        {/* Calls Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <PhoneOutgoing className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center text-sm font-medium text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Calls Today</p>
          <p className="text-3xl font-bold text-slate-900">{stats.callsToday}</p>
        </motion.div>

        {/* Conversions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center text-sm font-medium text-violet-600">
              {stats.conversionRate}% rate
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Conversions Today</p>
          <p className="text-3xl font-bold text-slate-900">{stats.conversionsToday}</p>
        </motion.div>

        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Revenue Today</p>
          <p className="text-3xl font-bold text-slate-900">
            ${stats.revenueToday.toLocaleString()}
          </p>
        </motion.div>

        {/* Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Leads</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalLeads.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">+{stats.leadsToday} today</p>
        </motion.div>

        {/* SMS Sent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <PhoneIncoming className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">SMS Today</p>
          <p className="text-3xl font-bold text-slate-900">{stats.smsToday}</p>
        </motion.div>

        {/* Avg Call Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Avg Call Duration</p>
          <p className="text-3xl font-bold text-slate-900">
            {formatDuration(stats.averageCallDuration)}
          </p>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-slate-900">{stats.conversionRate}%</p>
          <p className="text-xs text-slate-500 mt-1">$40 leads to $100</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/admin/call-center/leads"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                View All Leads
              </p>
              <p className="text-sm text-slate-500">Manage lead pipeline</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>

        <Link
          href="/admin/call-center/scripts"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Manage Scripts
              </p>
              <p className="text-sm text-slate-500">Configure AI agents</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>

        <Link
          href="/admin/call-center/analytics"
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                View Analytics
              </p>
              <p className="text-sm text-slate-500">Performance reports</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </Link>
      </div>
    </div>
  )
}
