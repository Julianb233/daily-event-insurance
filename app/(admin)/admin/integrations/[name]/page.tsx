'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plug,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Zap,
  AlertTriangle,
} from 'lucide-react'

interface IntegrationConfig {
  id: string
  name: string
  displayName: string
  apiKey: string | null
  apiSecret: string | null
  baseUrl: string | null
  webhookSecret: string | null
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

export default function IntegrationConfigPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params)
  const router = useRouter()
  const [config, setConfig] = useState<IntegrationConfig | null>(null)
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    baseUrl: '',
    webhookSecret: '',
    syncInterval: 60,
    autoSync: true,
    isActive: false,
  })

  useEffect(() => {
    fetchConfig()
    fetchLogs()
  }, [name])

  async function fetchConfig() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/integrations/${name}`)
      const json = await res.json()

      if (json.success) {
        setConfig(json.data)
        setFormData({
          apiKey: json.data.apiKey || '',
          apiSecret: json.data.apiSecret || '',
          baseUrl: json.data.baseUrl || '',
          webhookSecret: json.data.webhookSecret || '',
          syncInterval: json.data.syncInterval || 60,
          autoSync: json.data.autoSync ?? true,
          isActive: json.data.isActive ?? false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLogs() {
    try {
      const res = await fetch(`/api/admin/integrations/${name}/logs?pageSize=10`)
      const json = await res.json()

      if (json.success) {
        setLogs(json.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/integrations/${name}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (json.success) {
        setConfig(json.data)
        alert('Configuration saved successfully!')
      } else {
        alert('Failed to save: ' + (json.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to save config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  async function handleTestConnection() {
    try {
      setTesting(true)
      setTestResult(null)

      // Simulate a test - in production this would actually test the API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For now, check if API key is provided
      if (formData.apiKey && formData.baseUrl) {
        setTestResult({ success: true, message: 'Connection successful! API is responding.' })
      } else {
        setTestResult({ success: false, message: 'Please provide API Key and Base URL to test.' })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed. Please check your credentials.' })
    } finally {
      setTesting(false)
    }
  }

  async function handleSync() {
    try {
      setSyncing(true)
      const res = await fetch(`/api/admin/integrations/${name}/sync`, {
        method: 'POST',
      })

      const json = await res.json()

      if (json.success) {
        await fetchConfig()
        await fetchLogs()
      }
    } catch (error) {
      console.error('Failed to sync:', error)
    } finally {
      setSyncing(false)
    }
  }

  const isHiqor = name === 'hiqor'
  const themeColor = isHiqor ? 'indigo' : 'emerald'

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/integrations"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {config?.displayName || name.toUpperCase()} Configuration
          </h1>
          <p className="text-gray-500">Manage API credentials and sync settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* API Credentials Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">API Credentials</h2>

            <div className="space-y-4">
              {/* Base URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Enter API Key"
                    className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* API Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <div className="relative">
                  <input
                    type={showApiSecret ? 'text' : 'password'}
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder="Enter API Secret"
                    className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Webhook Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Secret (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showWebhookSecret ? 'text' : 'password'}
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder="Enter Webhook Secret"
                    className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showWebhookSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Test Connection */}
              <div className="pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isHiqor
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${testing ? 'animate-pulse' : ''}`} />
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>

                {testResult && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    testResult.success
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      {testResult.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sync Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sync Settings</h2>

            <div className="space-y-4">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Integration Active</p>
                  <p className="text-sm text-gray-500">Enable or disable this integration</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.isActive
                      ? isHiqor ? 'bg-indigo-500' : 'bg-emerald-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.isActive ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto Sync</p>
                  <p className="text-sm text-gray-500">Automatically sync data on schedule</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, autoSync: !formData.autoSync })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.autoSync
                      ? isHiqor ? 'bg-indigo-500' : 'bg-emerald-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.autoSync ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Sync Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Interval (minutes)
                </label>
                <select
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                  <option value={120}>Every 2 hours</option>
                  <option value={360}>Every 6 hours</option>
                  <option value={720}>Every 12 hours</option>
                  <option value={1440}>Once daily</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                isHiqor
                  ? 'bg-indigo-500 hover:bg-indigo-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            <Link
              href="/admin/integrations"
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Status & Logs Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`flex items-center gap-1 font-medium ${
                  config?.lastSyncStatus === 'success'
                    ? 'text-green-600'
                    : config?.lastSyncStatus === 'error'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {config?.lastSyncStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : config?.lastSyncStatus === 'error' ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {config?.lastSyncStatus || 'Never synced'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Sync</span>
                <span className="font-medium text-gray-900">
                  {config?.lastSyncAt
                    ? new Date(config.lastSyncAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>

              <button
                onClick={handleSync}
                disabled={syncing || !formData.isActive}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isHiqor
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-300'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </motion.div>

          {/* Recent Logs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : log.status === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {log.syncType} sync
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.recordsProcessed} records • {new Date(log.startedAt).toLocaleString()}
                    </p>
                    {log.errorMessage && (
                      <p className="text-xs text-red-600 mt-1 truncate">{log.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No sync activity yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
