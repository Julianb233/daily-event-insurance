"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plug,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Settings,
  Zap,
  Globe,
  Server,
  Activity,
  ArrowRight,
  MoreVertical,
  Play,
  ExternalLink,
} from "lucide-react"

interface PartnerIntegration {
  id: string
  partnerId: string
  integrationType: "widget" | "api" | "pos"
  posSystem: string | null
  status: "pending" | "configured" | "testing" | "live" | "failed"
  configuration: string | null
  apiKeyGenerated: boolean
  webhookConfigured: boolean
  lastTestedAt: string | null
  testResult: string | null
  testErrors: string | null
  wentLiveAt: string | null
  createdAt: string
  updatedAt: string
  // Joined partner data
  partner?: {
    id: string
    businessName: string
    businessType: string
    contactName: string
    contactEmail: string
    status: string
  }
}

interface IntegrationStats {
  total: number
  live: number
  failed: number
  pending: number
  testing: number
  configured: number
}

// Mock data for development
const mockIntegrations: PartnerIntegration[] = [
  {
    id: "int-1",
    partnerId: "p-1",
    integrationType: "widget",
    posSystem: null,
    status: "live",
    configuration: '{"theme":"light","position":"bottom-right"}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    testResult: "success",
    testErrors: null,
    wentLiveAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-1",
      businessName: "Peak Performance Gym",
      businessType: "gym",
      contactName: "John Smith",
      contactEmail: "john@peakgym.com",
      status: "active",
    },
  },
  {
    id: "int-2",
    partnerId: "p-2",
    integrationType: "api",
    posSystem: null,
    status: "live",
    configuration: '{"version":"v2","sandbox":false}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    testResult: "success",
    testErrors: null,
    wentLiveAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-2",
      businessName: "Adventure Sports Inc",
      businessType: "adventure",
      contactName: "Sarah Johnson",
      contactEmail: "sarah@adventuresports.com",
      status: "active",
    },
  },
  {
    id: "int-3",
    partnerId: "p-3",
    integrationType: "pos",
    posSystem: "mindbody",
    status: "failed",
    configuration: '{"clientId":"mb_123","location":"main"}',
    apiKeyGenerated: true,
    webhookConfigured: false,
    lastTestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    testResult: "error",
    testErrors: '["API authentication failed","Invalid client credentials"]',
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-3",
      businessName: "Zen Yoga Studio",
      businessType: "wellness",
      contactName: "Emily Chen",
      contactEmail: "emily@zenyoga.com",
      status: "active",
    },
  },
  {
    id: "int-4",
    partnerId: "p-4",
    integrationType: "pos",
    posSystem: "square",
    status: "testing",
    configuration: '{"locationId":"sq_456"}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    testResult: "pending",
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    partner: {
      id: "p-4",
      businessName: "Summit Climbing Center",
      businessType: "climbing",
      contactName: "Mike Davis",
      contactEmail: "mike@summitclimbing.com",
      status: "active",
    },
  },
  {
    id: "int-5",
    partnerId: "p-5",
    integrationType: "widget",
    posSystem: null,
    status: "pending",
    configuration: null,
    apiKeyGenerated: false,
    webhookConfigured: false,
    lastTestedAt: null,
    testResult: null,
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-5",
      businessName: "Kayak Adventures",
      businessType: "rental",
      contactName: "Lisa Wang",
      contactEmail: "lisa@kayakadv.com",
      status: "pending",
    },
  },
  {
    id: "int-6",
    partnerId: "p-6",
    integrationType: "api",
    posSystem: null,
    status: "configured",
    configuration: '{"version":"v2","sandbox":true}',
    apiKeyGenerated: true,
    webhookConfigured: false,
    lastTestedAt: null,
    testResult: null,
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-6",
      businessName: "Extreme Sports Co",
      businessType: "adventure",
      contactName: "Tom Wilson",
      contactEmail: "tom@extremesports.com",
      status: "active",
    },
  },
]

function getStatusConfig(status: string): {
  color: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
  label: string
} {
  switch (status) {
    case "live":
      return {
        color: "green",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-700 dark:text-green-300",
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        label: "Live",
      }
    case "failed":
      return {
        color: "red",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-700 dark:text-red-300",
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        label: "Failed",
      }
    case "testing":
      return {
        color: "yellow",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-700 dark:text-yellow-300",
        icon: <Activity className="w-4 h-4 text-yellow-500" />,
        label: "Testing",
      }
    case "configured":
      return {
        color: "blue",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-300",
        icon: <Settings className="w-4 h-4 text-blue-500" />,
        label: "Configured",
      }
    case "pending":
    default:
      return {
        color: "slate",
        bgColor: "bg-slate-100 dark:bg-slate-700",
        textColor: "text-slate-600 dark:text-slate-300",
        icon: <Clock className="w-4 h-4 text-slate-400" />,
        label: "Pending",
      }
  }
}

function getIntegrationTypeConfig(type: string): {
  icon: React.ReactNode
  label: string
  color: string
} {
  switch (type) {
    case "widget":
      return {
        icon: <Globe className="w-4 h-4" />,
        label: "Widget",
        color: "text-violet-600 dark:text-violet-400",
      }
    case "api":
      return {
        icon: <Zap className="w-4 h-4" />,
        label: "API",
        color: "text-blue-600 dark:text-blue-400",
      }
    case "pos":
      return {
        icon: <Server className="w-4 h-4" />,
        label: "POS",
        color: "text-emerald-600 dark:text-emerald-400",
      }
    default:
      return {
        icon: <Plug className="w-4 h-4" />,
        label: type,
        color: "text-slate-600 dark:text-slate-400",
      }
  }
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never"
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

interface IntegrationHealthDashboardProps {
  onTestIntegration?: (integrationId: string) => void
  onViewDetails?: (integrationId: string) => void
}

export function IntegrationHealthDashboard({
  onTestIntegration,
  onViewDetails,
}: IntegrationHealthDashboardProps) {
  const [integrations, setIntegrations] = useState<PartnerIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    fetchIntegrations()
  }, [])

  async function fetchIntegrations() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/partner-integrations")

      if (!res.ok) {
        setIntegrations(mockIntegrations)
        return
      }

      const json = await res.json()
      if (json.success && json.data) {
        setIntegrations(json.data)
      } else {
        setIntegrations(mockIntegrations)
      }
    } catch (error) {
      console.error("Failed to fetch integrations:", error)
      setIntegrations(mockIntegrations)
    } finally {
      setLoading(false)
    }
  }

  async function handleTestIntegration(integrationId: string) {
    try {
      setTestingId(integrationId)

      const res = await fetch(`/api/admin/partner-integrations/${integrationId}/test`, {
        method: "POST",
      })

      if (res.ok) {
        // Refresh integrations
        await fetchIntegrations()
      }

      onTestIntegration?.(integrationId)
    } catch (error) {
      console.error("Failed to test integration:", error)
    } finally {
      setTestingId(null)
    }
  }

  // Calculate stats
  const stats: IntegrationStats = {
    total: integrations.length,
    live: integrations.filter((i) => i.status === "live").length,
    failed: integrations.filter((i) => i.status === "failed").length,
    pending: integrations.filter((i) => i.status === "pending").length,
    testing: integrations.filter((i) => i.status === "testing").length,
    configured: integrations.filter((i) => i.status === "configured").length,
  }

  // Filter integrations
  const filteredIntegrations = integrations.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter
    const matchesType = typeFilter === "all" || i.integrationType === typeFilter
    return matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-100 dark:bg-slate-700 rounded-xl h-24"
            />
          ))}
        </div>
        <div className="animate-pulse bg-slate-100 dark:bg-slate-700 rounded-xl h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
              <Plug className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Integrations</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.live}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Live</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.failed}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Failed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.pending + stats.testing + stats.configured}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending/Testing</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Integration List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Integration Status
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Monitor partner integration health
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchIntegrations()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="failed">Failed</option>
              <option value="testing">Testing</option>
              <option value="configured">Configured</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="widget">Widget</option>
              <option value="api">API</option>
              <option value="pos">POS</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Last Tested
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredIntegrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    No integrations found matching your filters
                  </td>
                </tr>
              ) : (
                filteredIntegrations.map((integration, index) => {
                  const statusConfig = getStatusConfig(integration.status)
                  const typeConfig = getIntegrationTypeConfig(integration.integrationType)
                  const errors = integration.testErrors
                    ? JSON.parse(integration.testErrors)
                    : []

                  return (
                    <motion.tr
                      key={integration.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        integration.status === "failed"
                          ? "bg-red-50/50 dark:bg-red-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                            {integration.partner?.businessName?.[0] || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {integration.partner?.businessName || "Unknown Partner"}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {integration.partner?.businessType || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={typeConfig.color}>{typeConfig.icon}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {typeConfig.label}
                          </span>
                          {integration.posSystem && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded capitalize">
                              {integration.posSystem}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} w-fit`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                          {integration.status === "failed" && errors.length > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 truncate max-w-[200px]">
                              {errors[0]}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatTimeAgo(integration.lastTestedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTestIntegration(integration.id)}
                            disabled={testingId === integration.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              testingId === integration.id
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50"
                            }`}
                          >
                            {testingId === integration.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                            Test
                          </button>
                          <button
                            onClick={() => onViewDetails?.(integration.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Details
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
