'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import {
  Phone,
  PhoneIncoming,
  PhoneOff,
  Settings,
  BarChart3,
  Clock,
  Users,
  MessageSquare,
  Volume2,
  CheckCircle,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Play,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Building2,
  MapPin,
  Loader2,
} from 'lucide-react'

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json())

// TypeScript interfaces
interface CallRecord {
  id: string
  callerName: string
  callerPhone: string
  callerType: 'Agent' | 'Policyholder' | 'Claimant' | 'Partner'
  duration: string
  status: 'completed' | 'missed' | 'escalated' | 'voicemail'
  sentiment: 'positive' | 'neutral' | 'negative'
  topics: string[]
  timestamp: string
  location?: string
  policyNumber?: string
}

interface CallStats {
  todayTotal: number
  todayCompleted: number
  todayMissed: number
  weekTotal: number
  weekCompleted: number
  weekMissed: number
  avgDuration: string
  avgWaitTime: string
  escalationRate: string
  satisfactionScore: number
  peakHours: string
  answerRate: string
}

interface DailyStat {
  day: string
  calls: number
  completed: number
}

// Mock data for development (fallback when API unavailable)
const MOCK_CALL_STATS: CallStats = {
  todayTotal: 87,
  todayCompleted: 81,
  todayMissed: 6,
  weekTotal: 542,
  weekCompleted: 507,
  weekMissed: 35,
  avgDuration: '6:24',
  avgWaitTime: '8s',
  escalationRate: '5.8%',
  satisfactionScore: 4.7,
  peakHours: '9am - 12pm',
  answerRate: '93.5%',
}

const mockRecentCalls: CallRecord[] = [
  {
    id: '1',
    callerName: 'Michael Torres',
    callerPhone: '(555) 123-4567',
    callerType: 'Agent',
    duration: '8:45',
    status: 'completed',
    sentiment: 'positive',
    topics: ['policy quote', 'event coverage'],
    timestamp: '3 min ago',
    location: 'Austin, TX',
  },
  {
    id: '2',
    callerName: 'Sarah Mitchell',
    callerPhone: '(555) 234-5678',
    callerType: 'Policyholder',
    duration: '4:23',
    status: 'completed',
    sentiment: 'neutral',
    topics: ['policy inquiry', 'coverage limits'],
    timestamp: '12 min ago',
    location: 'Denver, CO',
    policyNumber: 'HIQ-2024-00123',
  },
  {
    id: '3',
    callerName: 'James Anderson',
    callerPhone: '(555) 345-6789',
    callerType: 'Agent',
    duration: '11:32',
    status: 'escalated',
    sentiment: 'negative',
    topics: ['claim processing', 'technical issue'],
    timestamp: '28 min ago',
    location: 'Seattle, WA',
  },
  {
    id: '4',
    callerName: 'Emily Rodriguez',
    callerPhone: '(555) 456-7890',
    callerType: 'Partner',
    duration: '5:17',
    status: 'completed',
    sentiment: 'positive',
    topics: ['partnership', 'integration'],
    timestamp: '42 min ago',
    location: 'Miami, FL',
  },
  {
    id: '5',
    callerName: 'Unknown Caller',
    callerPhone: '(555) 567-8901',
    callerType: 'Claimant',
    duration: '0:00',
    status: 'missed',
    sentiment: 'neutral',
    topics: [],
    timestamp: '1 hour ago',
    location: 'Unknown',
  },
  {
    id: '6',
    callerName: 'David Chen',
    callerPhone: '(555) 678-9012',
    callerType: 'Policyholder',
    duration: '3:45',
    status: 'voicemail',
    sentiment: 'neutral',
    topics: ['policy renewal'],
    timestamp: '1 hour ago',
    location: 'San Francisco, CA',
    policyNumber: 'HIQ-2024-00089',
  },
]

const MOCK_WEEKLY_DATA: DailyStat[] = [
  { day: 'Mon', calls: 89, completed: 84 },
  { day: 'Tue', calls: 102, completed: 96 },
  { day: 'Wed', calls: 95, completed: 89 },
  { day: 'Thu', calls: 112, completed: 105 },
  { day: 'Fri', calls: 87, completed: 81 },
  { day: 'Sat', calls: 34, completed: 32 },
  { day: 'Sun', calls: 23, completed: 20 },
]

// Helper to format relative time
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export default function HiqorCallCenterPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'call-history' | 'settings'>('overview')
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'missed' | 'escalated'>('all')

  // Fetch call center stats from API
  const { data: statsResponse, isLoading: statsLoading } = useSWR(
    `/api/admin/call-center/stats?period=${timeFilter}`,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )

  // Fetch recent calls from API
  const { data: callsResponse, isLoading: callsLoading } = useSWR(
    `/api/admin/call-center/calls?period=${timeFilter}&status=${statusFilter === 'all' ? '' : statusFilter}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  // Fetch volume data for charts
  const { data: volumeResponse, isLoading: volumeLoading } = useSWR(
    '/api/admin/call-center/volume?days=7',
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  )

  // Transform API data to match existing interfaces, with fallback to mock data
  const callStats: CallStats = statsResponse?.data ? {
    todayTotal: statsResponse.data.totalCalls,
    todayCompleted: statsResponse.data.completedCalls,
    todayMissed: statsResponse.data.missedCalls,
    weekTotal: statsResponse.data.totalCalls,
    weekCompleted: statsResponse.data.completedCalls,
    weekMissed: statsResponse.data.missedCalls,
    avgDuration: statsResponse.data.avgDuration,
    avgWaitTime: statsResponse.data.avgWaitTime,
    escalationRate: statsResponse.data.escalationRate,
    satisfactionScore: statsResponse.data.satisfactionScore,
    peakHours: statsResponse.data.peakHours,
    answerRate: statsResponse.data.answerRate,
  } : MOCK_CALL_STATS

  // Transform calls data
  const recentCalls: CallRecord[] = callsResponse?.data?.map((call: any) => ({
    id: call.id,
    callerName: call.callerName,
    callerPhone: call.callerPhone,
    callerType: call.callerType === 'Partner' ? 'Partner' : call.callerType === 'Lead' ? 'Agent' : 'Policyholder',
    duration: call.durationFormatted,
    status: call.status as CallRecord['status'],
    sentiment: call.sentiment as CallRecord['sentiment'],
    topics: call.topics || [],
    timestamp: formatRelativeTime(call.timestamp),
    location: call.location,
    policyNumber: undefined,
  })) || mockRecentCalls

  // Transform volume data
  const weeklyData: DailyStat[] = volumeResponse?.data?.data?.map((day: any) => ({
    day: day.day,
    calls: day.totalCalls,
    completed: day.completedCalls,
  })) || MOCK_WEEKLY_DATA

  const filteredCalls = recentCalls.filter(call => {
    if (statusFilter === 'all') return true
    return call.status === statusFilter
  })

  const getStatusIcon = (status: CallRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'escalated':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      case 'voicemail':
        return <MessageSquare className="w-5 h-5 text-blue-600" />
    }
  }

  const getStatusBgColor = (status: CallRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100'
      case 'missed':
        return 'bg-red-100'
      case 'escalated':
        return 'bg-amber-100'
      case 'voicemail':
        return 'bg-blue-100'
    }
  }

  const getCallerTypeIcon = (type: CallRecord['callerType']) => {
    switch (type) {
      case 'Agent':
        return <Building2 className="w-4 h-4" />
      case 'Policyholder':
        return <User className="w-4 h-4" />
      case 'Claimant':
        return <AlertTriangle className="w-4 h-4" />
      case 'Partner':
        return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  HIQOR Call Center
                </h1>
                <p className="text-gray-600">Monitor and manage carrier communications</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Active
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Place Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'call-history', label: 'Call History', icon: Clock },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Time Filter */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {['today', 'week', 'month'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeFilter === filter
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                Custom Range
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100 relative"
              >
                {statsLoading && (
                  <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    12%
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {timeFilter === 'today' ? callStats.todayTotal : callStats.weekTotal}
                </p>
                <p className="text-gray-600 text-sm">Total Calls</p>
                <p className="text-xs text-gray-500 mt-2">
                  {timeFilter === 'today' ? 'Today' : 'This week'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    {callStats.answerRate}
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {timeFilter === 'today' ? callStats.todayCompleted : callStats.weekCompleted}
                </p>
                <p className="text-gray-600 text-sm">Completed Calls</p>
                <p className="text-xs text-gray-500 mt-2">Answer rate</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{callStats.avgDuration}</p>
                <p className="text-gray-600 text-sm">Avg Duration</p>
                <p className="text-xs text-gray-500 mt-2">Wait time: {callStats.avgWaitTime}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                    <ArrowDownRight className="w-4 h-4" />
                    2.1%
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{callStats.escalationRate}</p>
                <p className="text-gray-600 text-sm">Escalation Rate</p>
                <p className="text-xs text-gray-500 mt-2">Down from last {timeFilter}</p>
              </motion.div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Call Volume</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    <span className="text-gray-600">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between gap-4 h-48">
                {weeklyData.map((stat, index) => {
                  const maxCalls = Math.max(...weeklyData.map(d => d.calls))
                  const totalHeight = (stat.calls / maxCalls) * 100
                  const completedHeight = (stat.completed / maxCalls) * 100

                  return (
                    <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full flex items-end justify-center gap-1 h-40">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${totalHeight}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="w-8 bg-indigo-200 rounded-t-lg"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${completedHeight}%` }}
                          transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
                          className="w-8 bg-green-500 rounded-t-lg"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{stat.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Calls */}
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
              <div className="px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
                <div className="flex items-center gap-2">
                  {['all', 'completed', 'missed', 'escalated'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter as any)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === filter
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredCalls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-6 py-4 hover:bg-indigo-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBgColor(call.status)}`}>
                          {getStatusIcon(call.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{call.callerName}</p>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                              {getCallerTypeIcon(call.callerType)}
                              <span>{call.callerType}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {call.callerPhone}
                            </span>
                            {call.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {call.location}
                              </span>
                            )}
                            <span>{call.timestamp}</span>
                          </div>
                          {call.policyNumber && (
                            <p className="text-xs text-indigo-600 mt-1 font-medium">
                              Policy: {call.policyNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 mb-1">{call.duration}</p>
                          <div className="flex gap-1">
                            {call.topics.map((topic) => (
                              <span key={topic} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded font-medium">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          call.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          call.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {call.sentiment}
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-indigo-100 rounded-lg">
                          <Play className="w-4 h-4 text-indigo-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-indigo-100 bg-gray-50">
                <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors">
                  View All Calls →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                    AI Powered
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Call Monitoring</h3>
                <p className="text-indigo-100 mb-4">Real-time call quality monitoring and sentiment analysis</p>
                <button className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                  Start Monitoring
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                    New
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Reports</h3>
                <p className="text-purple-100 mb-4">Generate detailed call center performance insights</p>
                <button className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Call Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Peak Call Time</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{callStats.peakHours}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Satisfaction Score</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{callStats.satisfactionScore}/5.0</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Avg Wait Time</span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{callStats.avgWaitTime}</p>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
                  <p className="text-gray-500">Advanced analytics charts coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'call-history' && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Complete Call History</h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Advanced Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Call Archive</h3>
                <p className="text-gray-500 mb-6">Access full call history with transcripts and recordings</p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Browse Archive
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="px-6 py-4 border-b border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-900">Call Center Settings</h2>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Operating Hours</label>
                <p className="text-gray-500 text-sm mb-4">Configure call center availability</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                    <input type="time" defaultValue="08:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                    <input type="time" defaultValue="20:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Call Routing Rules</label>
                <p className="text-gray-500 text-sm mb-4">Manage how calls are distributed</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Priority routing for claims</p>
                      <p className="text-xs text-gray-500">Route claim calls to specialized agents first</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">VIP agent routing</p>
                      <p className="text-xs text-gray-500">Fast-track calls from partner agents</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">After-hours voicemail</p>
                      <p className="text-xs text-gray-500">Enable voicemail outside operating hours</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Escalation Settings</label>
                <p className="text-gray-500 text-sm mb-4">Define escalation thresholds</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Max wait time before escalation</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="30" max="300" defaultValue="120" className="flex-1" />
                      <span className="text-sm font-medium text-gray-900 w-16">120s</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Escalation notification email</label>
                    <input type="email" defaultValue="admin@hiqor.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
