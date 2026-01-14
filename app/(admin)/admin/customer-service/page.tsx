'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Monitor,
  MessageSquare,
  Play,
  PhoneOff,
  UserPlus,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  Star,
  TrendingUp,
  Wifi,
  WifiOff,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { useCustomerServiceRealtime } from '@/lib/support/use-customer-service-realtime'
import {
  type QueueItem,
  type ActiveSession,
  type SessionHistory,
  type CustomerServiceStats,
  type Agent,
  type SessionPriority,
  type SLAStatus,
  getSLAColor,
  PRIORITY_CONFIG,
  SLA_CONFIG,
  formatDuration,
} from '@/lib/support/customer-service-types'

// SLA indicator component
function SLAIndicator({ status, waitTimeSeconds }: { status: SLAStatus; waitTimeSeconds: number }) {
  const colors = getSLAColor(status)
  const labels: Record<SLAStatus, string> = {
    good: 'Within SLA',
    warning: 'SLA Warning',
    critical: 'SLA Critical',
    breached: 'SLA Breached',
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {status === 'breached' || status === 'critical' ? (
        <AlertTriangle className="w-3 h-3" />
      ) : status === 'warning' ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      )}
      <span>{labels[status]}</span>
    </div>
  )
}

// Priority badge component
function PriorityBadge({ priority }: { priority: SessionPriority }) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
      {config.label}
    </span>
  )
}

// Connection status indicator
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
      isConnected
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Reconnecting...</span>
        </>
      )}
    </div>
  )
}

// Stats card component
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  trend,
  delay = 0
}: {
  icon: React.ElementType
  value: string | number
  label: string
  color: string
  trend?: number
  delay?: number
}) {
  const colorClasses: Record<string, { bg: string; icon: string }> = {
    amber: { bg: 'bg-amber-100', icon: 'text-amber-600' },
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
    green: { bg: 'bg-green-100', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
    rose: { bg: 'bg-rose-100', icon: 'text-rose-600' },
  }

  const classes = colorClasses[color] || colorClasses.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${classes.bg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${classes.icon}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Queue item row component
function QueueItemRow({
  item,
  agents,
  onAssign,
  isAssigning,
}: {
  item: QueueItem
  agents: Agent[]
  onAssign: (queueItemId: string, agentId?: string) => void
  isAssigning: boolean
}) {
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const slaColors = getSLAColor(item.slaStatus)
  const availableAgents = agents.filter(a => a.status === 'available')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${
        item.priority === 'urgent'
          ? 'border-l-red-500 bg-red-50/30'
          : item.priority === 'high'
          ? 'border-l-orange-500 bg-orange-50/20'
          : 'border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            item.slaStatus === 'breached' || item.slaStatus === 'critical'
              ? 'bg-red-100 animate-pulse'
              : item.priority === 'urgent'
              ? 'bg-red-100'
              : 'bg-rose-100'
          }`}>
            <Users className={`w-6 h-6 ${
              item.slaStatus === 'breached' || item.slaStatus === 'critical'
                ? 'text-red-600'
                : item.priority === 'urgent'
                ? 'text-red-600'
                : 'text-rose-600'
            }`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{item.partnerName}</h3>
              <PriorityBadge priority={item.priority} />
              <SLAIndicator status={item.slaStatus} waitTimeSeconds={item.waitTimeSeconds} />
            </div>
            <p className="text-sm text-gray-600">{item.contactName} - {item.email}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {item.businessType}
              </span>
              {item.onboardingStep && (
                <span className="text-sm text-gray-500">
                  Step: {item.onboardingStep}
                </span>
              )}
              {item.techStack && (
                <span className="text-sm text-gray-400">
                  {item.techStack.framework && `${item.techStack.framework}`}
                  {item.techStack.pos && ` + ${item.techStack.pos}`}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-700">{item.requestReason}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-sm font-medium ${
              item.slaStatus === 'breached'
                ? 'text-red-600'
                : item.slaStatus === 'critical'
                ? 'text-red-500'
                : item.slaStatus === 'warning'
                ? 'text-amber-600'
                : 'text-gray-900'
            }`}>
              Waiting: {item.waitTimeFormatted}
            </p>
            {item.waitTimeSeconds > SLA_CONFIG.waitTime.critical && (
              <p className="text-xs text-red-500 mt-1">
                {Math.floor((item.waitTimeSeconds - SLA_CONFIG.waitTime.critical) / 60)} min over SLA
              </p>
            )}
          </div>
          <div className="relative">
            {availableAgents.length > 0 ? (
              <>
                <button
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                  disabled={isAssigning}
                  className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isAssigning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Assign
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
                {showAgentDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onAssign(item.id)
                          setShowAgentDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 font-medium text-rose-600"
                      >
                        Assign to me
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      {availableAgents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => {
                            onAssign(item.id, agent.id)
                            setShowAgentDropdown(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-gray-400 ml-2">({agent.currentSessionCount} active)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => onAssign(item.id)}
                disabled={isAssigning}
                className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isAssigning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    Join Session
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Active session row component
function ActiveSessionRow({
  session,
  onEnd,
}: {
  session: ActiveSession
  onEnd: (sessionId: string) => void
}) {
  const isLongSession = session.durationSeconds > SLA_CONFIG.duration.warning

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`p-6 hover:bg-gray-50 transition-colors ${isLongSession ? 'bg-amber-50/30' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            {session.sessionType === 'screen-share' ? (
              <Monitor className="w-6 h-6 text-green-600" />
            ) : session.sessionType === 'voice' ? (
              <Phone className="w-6 h-6 text-green-600" />
            ) : (
              <MessageSquare className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{session.partnerName}</h3>
            <p className="text-sm text-gray-500">
              Agent: {session.agentName}
              {session.onboardingStep && ` | ${session.onboardingStep}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isLongSession ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              isLongSession ? 'bg-amber-500' : 'bg-green-500'
            }`} />
            <span className="text-sm font-medium">{session.durationFormatted}</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full capitalize">
            {session.sessionType.replace('-', ' ')}
          </span>
          <button
            onClick={() => onEnd(session.id)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
          >
            <PhoneOff className="w-4 h-4" />
            End
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// History row component
function HistoryRow({ session }: { session: SessionHistory }) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {session.sessionType === 'screen-share' ? (
              <Monitor className="w-5 h-5 text-gray-600" />
            ) : session.sessionType === 'voice' ? (
              <Phone className="w-5 h-5 text-gray-600" />
            ) : (
              <MessageSquare className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{session.partnerName}</h4>
              {session.rating && (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < session.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {session.contactName} | {session.agentName || 'Unassigned'}
            </p>
            {session.resolution && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{session.resolution}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="text-gray-900">{session.durationFormatted}</p>
            <p className="text-gray-500">
              {new Date(session.completedAt).toLocaleDateString()} {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {session.recordingUrl && (
            <a
              href={session.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Playback
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CustomerServicePage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'active' | 'history'>('queue')
  const [historySearch, setHistorySearch] = useState('')
  const [historyRecordingFilter, setHistoryRecordingFilter] = useState<'all' | 'with' | 'without'>('all')
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyPagination, setHistoryPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [assigningId, setAssigningId] = useState<string | null>(null)

  const {
    queue,
    activeSessions,
    stats,
    agents,
    isLoading,
    isConnected,
    error,
    refresh,
    assignAgent,
    endSession,
  } = useCustomerServiceRealtime()

  // Fetch session history
  const fetchHistory = useCallback(async (page = 1) => {
    setHistoryLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (historySearch) params.set('search', historySearch)
      if (historyRecordingFilter === 'with') params.set('hasRecording', 'true')
      if (historyRecordingFilter === 'without') params.set('hasRecording', 'false')

      const res = await fetch(`/api/admin/customer-service/history?${params}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setSessionHistory(data.data)
          setHistoryPagination({
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            total: data.pagination.total,
          })
        }
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }, [historySearch, historyRecordingFilter])

  // Fetch history when tab changes or filters change
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory(1)
    }
  }, [activeTab, fetchHistory])

  // Handle agent assignment
  const handleAssign = async (queueItemId: string, agentId?: string) => {
    setAssigningId(queueItemId)
    try {
      await assignAgent(queueItemId, agentId)
    } finally {
      setAssigningId(null)
    }
  }

  // Handle session end
  const handleEndSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to end this session?')) {
      await endSession(sessionId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Service</h1>
                <p className="text-gray-500">Onboarding support dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ConnectionStatus isConnected={isConnected} />
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {stats && stats.waiting > 0 && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  queue.some(q => q.slaStatus === 'breached' || q.slaStatus === 'critical')
                    ? 'bg-red-100 text-red-700'
                    : queue.some(q => q.slaStatus === 'warning')
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    queue.some(q => q.slaStatus === 'breached' || q.slaStatus === 'critical')
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`} />
                  {stats.waiting} waiting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error.message}</p>
            <button
              onClick={refresh}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            icon={Users}
            value={stats?.waiting ?? 0}
            label="Waiting"
            color="amber"
            delay={0}
          />
          <StatCard
            icon={Phone}
            value={stats?.inProgress ?? 0}
            label="In Progress"
            color="blue"
            delay={0.1}
          />
          <StatCard
            icon={CheckCircle}
            value={stats?.completedToday ?? 0}
            label="Completed Today"
            color="green"
            delay={0.2}
          />
          <StatCard
            icon={Clock}
            value={stats?.avgWaitTimeFormatted ?? '0:00'}
            label="Avg Wait"
            color="purple"
            delay={0.3}
          />
          <StatCard
            icon={Star}
            value={stats?.avgRating?.toFixed(1) ?? '-'}
            label="Avg Rating"
            color="rose"
            delay={0.4}
          />
        </div>

        {/* SLA Compliance Bar */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">SLA Compliance Today</span>
              <span className={`text-sm font-bold ${
                stats.slaCompliancePercent >= 90
                  ? 'text-green-600'
                  : stats.slaCompliancePercent >= 70
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}>
                {stats.slaCompliancePercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.slaCompliancePercent >= 90
                    ? 'bg-green-500'
                    : stats.slaCompliancePercent >= 70
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${stats.slaCompliancePercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Target: 90%</span>
              <span>SLA Threshold: {formatDuration(SLA_CONFIG.waitTime.critical)}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-t-xl border border-gray-200 border-b-0">
          <nav className="flex gap-6 px-6">
            {[
              { id: 'queue', label: 'Support Queue', count: stats?.waiting },
              { id: 'active', label: 'Active Sessions', count: stats?.inProgress },
              { id: 'history', label: 'History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === 'queue' && (
              <motion.div
                key="queue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-gray-100"
              >
                {isLoading ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading queue...</p>
                  </div>
                ) : queue.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No partners waiting</h3>
                    <p className="text-gray-500">All support requests have been handled</p>
                  </div>
                ) : (
                  queue.map((item) => (
                    <QueueItemRow
                      key={item.id}
                      item={item}
                      agents={agents}
                      onAssign={handleAssign}
                      isAssigning={assigningId === item.id}
                    />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-gray-100"
              >
                {isLoading ? (
                  <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading sessions...</p>
                  </div>
                ) : activeSessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No active sessions</h3>
                    <p className="text-gray-500">Join a waiting partner to start a session</p>
                  </div>
                ) : (
                  activeSessions.map((session) => (
                    <ActiveSessionRow
                      key={session.id}
                      session={session}
                      onEnd={handleEndSession}
                    />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* History filters */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search by partner name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select
                        value={historyRecordingFilter}
                        onChange={(e) => setHistoryRecordingFilter(e.target.value as typeof historyRecordingFilter)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        <option value="all">All sessions</option>
                        <option value="with">With recording</option>
                        <option value="without">Without recording</option>
                      </select>
                    </div>
                    <button
                      onClick={() => fetchHistory(1)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* History list */}
                <div className="divide-y divide-gray-100">
                  {historyLoading ? (
                    <div className="p-12 text-center">
                      <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Loading history...</p>
                    </div>
                  ) : sessionHistory.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-gray-500">No sessions found</p>
                    </div>
                  ) : (
                    sessionHistory.map((session) => (
                      <HistoryRow key={session.id} session={session} />
                    ))
                  )}
                </div>

                {/* Pagination */}
                {historyPagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing {sessionHistory.length} of {historyPagination.total} sessions
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchHistory(historyPagination.page - 1)}
                        disabled={historyPagination.page <= 1}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {historyPagination.page} of {historyPagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchHistory(historyPagination.page + 1)}
                        disabled={historyPagination.page >= historyPagination.totalPages}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
