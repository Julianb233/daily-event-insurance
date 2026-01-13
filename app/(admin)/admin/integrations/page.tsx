'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plug,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  ChevronRight,
  Zap,
  AlertTriangle,
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  displayName: string
  isActive: boolean
  lastSyncAt: string | null
  lastSyncStatus: string | null
  lastSyncError: string | null
  syncInterval: number
  autoSync: boolean
}

interface SyncLog {
  id: string
  syncType: string
  status: string
  recordsProcessed: number
  errorMessage: string | null
  startedAt: string
  completedAt: string | null
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [recentLogs, setRecentLogs] = useState<Record<string, SyncLog[]>>({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  async function fetchIntegrations() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/integrations')
      const json = await res.json()

      if (json.success) {
        setIntegrations(json.data.integrations || [])

        // Fetch recent logs for each integration
        for (const integration of json.data.integrations || []) {
          fetchLogs(integration.name)
        }
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLogs(name: string) {
    try {
      const res = await fetch(`/api/admin/integrations/${name}/logs?pageSize=5`)
      const json = await res.json()

      if (json.success) {
        setRecentLogs(prev => ({
          ...prev,
          [name]: json.data || [],
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch logs for ${name}:`, error)
    }
  }

  async function triggerSync(name: string) {
    try {
      setSyncing(name)
      const res = await fetch(`/api/admin/integrations/${name}/sync`, {
        method: 'POST',
      })

      const json = await res.json()

      if (json.success) {
        // Refresh data
        await fetchIntegrations()
      }
    } catch (error) {
      console.error(`Failed to sync ${name}:`, error)
    } finally {
      setSyncing(null)
    }
  }

  function getStatusIcon(integration: Integration) {
    if (!integration.isActive) {
      return <XCircle className="w-5 h-5 text-gray-400" />
    }
    if (integration.lastSyncStatus === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    if (integration.lastSyncStatus === 'error') {
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
    return <Clock className="w-5 h-5 text-yellow-500" />
  }

  function getStatusText(integration: Integration) {
    if (!integration.isActive) return 'Inactive'
    if (integration.lastSyncStatus === 'success') return 'Connected'
    if (integration.lastSyncStatus === 'error') return 'Error'
    return 'Pending'
  }

  function formatTimeAgo(dateStr: string | null) {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} mins ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Integrations</h1>
        <p className="text-gray-500">Manage carrier API connections and sync settings</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Card Header */}
            <div className={`px-6 py-4 border-b border-gray-100 ${
              integration.name === 'hiqor'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plug className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.displayName}</h3>
                    <p className="text-sm text-white/80">Carrier Integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                  {getStatusIcon(integration)}
                  <span className="text-sm font-medium text-white">{getStatusText(integration)}</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Sync Status */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Sync</p>
                  <p className="font-semibold text-gray-900">
                    {formatTimeAgo(integration.lastSyncAt)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Auto Sync</p>
                  <p className="font-semibold text-gray-900">
                    {integration.autoSync ? `Every ${integration.syncInterval} min` : 'Disabled'}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {integration.lastSyncError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Last Sync Error</p>
                      <p className="text-sm text-red-600 mt-1">{integration.lastSyncError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Sync Logs */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Syncs</h4>
                <div className="space-y-2">
                  {(recentLogs[integration.name] || []).slice(0, 3).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : log.status === 'error' ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-gray-600 capitalize">{log.syncType}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-900 font-medium">{log.recordsProcessed} records</span>
                        <span className="text-gray-400 ml-2">
                          {new Date(log.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!recentLogs[integration.name] || recentLogs[integration.name].length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-2">No sync history yet</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerSync(integration.name)}
                  disabled={syncing === integration.name || !integration.isActive}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    integration.name === 'hiqor'
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-300'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${syncing === integration.name ? 'animate-spin' : ''}`} />
                  {syncing === integration.name ? 'Syncing...' : 'Sync Now'}
                </button>
                <Link
                  href={`/admin/integrations/${integration.name}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sync Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Sync Activity</h2>
          <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
            View All Logs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(recentLogs).flatMap(([name, logs]) =>
                logs.map((log) => {
                  const integration = integrations.find(i => i.name === name)
                  const duration = log.completedAt
                    ? Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000)
                    : null

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            name === 'hiqor' ? 'bg-indigo-500' : 'bg-emerald-500'
                          }`} />
                          <span className="font-medium text-gray-900">
                            {integration?.displayName || name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {log.syncType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : log.status === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : log.status === 'error' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.recordsProcessed}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(log.startedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {duration !== null ? `${duration}s` : 'In Progress'}
                      </td>
                    </tr>
                  )
                })
              )}
              {Object.keys(recentLogs).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No sync activity yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
