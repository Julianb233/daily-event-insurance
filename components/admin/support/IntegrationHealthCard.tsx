"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  Wifi,
  Database,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface IntegrationHealth {
  name: string
  displayName: string
  status: "healthy" | "degraded" | "down" | "unknown"
  lastChecked: string
  responseTime?: number
  uptime?: number
  errorRate?: number
  details?: {
    label: string
    value: string
    status?: "good" | "warning" | "error"
  }[]
}

interface IntegrationHealthCardProps {
  integrations: IntegrationHealth[]
  onRefresh?: () => void
  isRefreshing?: boolean
}

const statusConfig = {
  healthy: {
    label: "Healthy",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
    iconColor: "text-green-500"
  },
  degraded: {
    label: "Degraded",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: AlertTriangle,
    iconColor: "text-amber-500"
  },
  down: {
    label: "Down",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
    iconColor: "text-red-500"
  },
  unknown: {
    label: "Unknown",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    icon: Clock,
    iconColor: "text-slate-400"
  },
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function IntegrationHealthCard({
  integrations,
  onRefresh,
  isRefreshing = false,
}: IntegrationHealthCardProps) {
  const healthyCount = integrations.filter((i) => i.status === "healthy").length
  const issueCount = integrations.filter((i) => i.status !== "healthy" && i.status !== "unknown").length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Integration Health</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {healthyCount} healthy, {issueCount} {issueCount === 1 ? "issue" : "issues"}
              </p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </button>
          )}
        </div>
      </div>

      {/* Integration List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {integrations.map((integration, index) => {
          const status = statusConfig[integration.status]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    integration.status === "healthy" ? "bg-green-100 dark:bg-green-900/30" :
                    integration.status === "degraded" ? "bg-amber-100 dark:bg-amber-900/30" :
                    integration.status === "down" ? "bg-red-100 dark:bg-red-900/30" :
                    "bg-slate-100 dark:bg-slate-700"
                  )}>
                    <StatusIcon className={cn("w-4 h-4", status.iconColor)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {integration.displayName}
                      </span>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        status.color
                      )}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {integration.responseTime !== undefined && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {integration.responseTime}ms
                        </span>
                      )}
                      {integration.uptime !== undefined && (
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          {integration.uptime.toFixed(2)}% uptime
                        </span>
                      )}
                      {integration.errorRate !== undefined && (
                        <span className={cn(
                          "flex items-center gap-1",
                          integration.errorRate > 1 ? "text-red-500" : ""
                        )}>
                          <AlertTriangle className="w-3 h-3" />
                          {integration.errorRate.toFixed(2)}% errors
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        Checked {formatTimeAgo(integration.lastChecked)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {integration.details && integration.details.length > 0 && (
                <div className="mt-3 ml-11 flex flex-wrap gap-2">
                  {integration.details.map((detail, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-xs",
                        detail.status === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" :
                        detail.status === "warning" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" :
                        "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {detail.label}: {detail.value}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {integrations.length === 0 && (
        <div className="p-8 text-center">
          <Database className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">No integrations configured</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure integrations to monitor their health
          </p>
        </div>
      )}
    </div>
  )
}

// Summary Stats Component
export function IntegrationHealthSummary({
  integrations,
}: {
  integrations: IntegrationHealth[]
}) {
  const stats = {
    healthy: integrations.filter((i) => i.status === "healthy").length,
    degraded: integrations.filter((i) => i.status === "degraded").length,
    down: integrations.filter((i) => i.status === "down").length,
    total: integrations.length,
  }

  const avgResponseTime = integrations
    .filter((i) => i.responseTime !== undefined)
    .reduce((sum, i) => sum + (i.responseTime || 0), 0) /
    (integrations.filter((i) => i.responseTime !== undefined).length || 1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Wifi className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Healthy</span>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.healthy}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Issues</span>
        </div>
        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.degraded + stats.down}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Avg Response</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgResponseTime.toFixed(0)}ms</p>
      </div>
    </div>
  )
}
