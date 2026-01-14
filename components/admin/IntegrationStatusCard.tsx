"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  TestTube,
  Zap,
  AlertTriangle,
  Building2,
  ExternalLink,
  Code,
  Plug,
  Terminal,
} from "lucide-react"
import Link from "next/link"

// Status configuration with colors and icons
const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
    dotColor: "bg-slate-400",
  },
  configured: {
    label: "Configured",
    icon: Settings,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  testing: {
    label: "Testing",
    icon: TestTube,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  live: {
    label: "Live",
    icon: Zap,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    dotColor: "bg-red-500",
  },
}

// Integration type configuration
const typeConfig = {
  widget: {
    label: "Widget",
    icon: Code,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  api: {
    label: "API",
    icon: Terminal,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  pos: {
    label: "POS",
    icon: Plug,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
}

interface IntegrationStatusCardProps {
  id: string
  partnerId: string
  partnerName: string
  partnerBusinessName: string
  partnerEmail: string
  integrationType: string
  posSystem: string | null
  status: string
  apiKeyGenerated: boolean
  webhookConfigured: boolean
  lastTestedAt: string | null
  testResult: string | null
  testErrors: string | null
  wentLiveAt: string | null
  createdAt: string
  updatedAt: string
  index?: number
}

function formatTimeAgo(timestamp: string | null): string {
  if (!timestamp) return "Never"
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatDate(timestamp: string | null): string {
  if (!timestamp) return "N/A"
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function IntegrationStatusCard({
  id,
  partnerId,
  partnerName,
  partnerBusinessName,
  partnerEmail,
  integrationType,
  posSystem,
  status,
  apiKeyGenerated,
  webhookConfigured,
  lastTestedAt,
  testResult,
  testErrors,
  wentLiveAt,
  createdAt,
  updatedAt,
  index = 0,
}: IntegrationStatusCardProps) {
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const typeInfo = typeConfig[integrationType as keyof typeof typeConfig] || typeConfig.widget
  const StatusIcon = statusInfo.icon
  const TypeIcon = typeInfo.icon

  // Parse test errors if they exist
  let parsedErrors: string[] = []
  if (testErrors) {
    try {
      parsedErrors = JSON.parse(testErrors)
    } catch {
      parsedErrors = [testErrors]
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Header with status indicator */}
      <div className={`px-5 py-4 border-b ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${typeInfo.bgColor} flex items-center justify-center`}>
              <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                {partnerBusinessName}
                <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              </h3>
              <p className="text-sm text-slate-600">{partnerName}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
            <StatusIcon className={`w-4 h-4 ${statusInfo.textColor}`} />
            <span className={`text-sm font-medium ${statusInfo.textColor}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Integration Type & POS */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Type</p>
            <p className="font-medium text-slate-900 capitalize">{integrationType}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">POS System</p>
            <p className="font-medium text-slate-900">{posSystem || "N/A"}</p>
          </div>
        </div>

        {/* Configuration Status */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            {apiKeyGenerated ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-300" />
            )}
            <span className="text-sm text-slate-600">API Key</span>
          </div>
          <div className="flex items-center gap-2">
            {webhookConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-300" />
            )}
            <span className="text-sm text-slate-600">Webhook</span>
          </div>
        </div>

        {/* Test Results */}
        {(lastTestedAt || testResult) && (
          <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Last Test</p>
              <span className="text-xs text-slate-500">{formatTimeAgo(lastTestedAt)}</span>
            </div>
            {testResult && (
              <div className={`flex items-center gap-2 ${
                testResult === "success" ? "text-emerald-600" :
                testResult === "failed" ? "text-red-600" : "text-slate-600"
              }`}>
                {testResult === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : testResult === "failed" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span className="text-sm font-medium capitalize">{testResult}</span>
              </div>
            )}
          </div>
        )}

        {/* Error Messages */}
        {parsedErrors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Errors</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {parsedErrors.slice(0, 3).map((error, i) => (
                    <li key={i} className="truncate">{error}</li>
                  ))}
                  {parsedErrors.length > 3 && (
                    <li className="text-red-500 font-medium">
                      +{parsedErrors.length - 3} more errors
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Live Date */}
        {wentLiveAt && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                Went live on {formatDate(wentLiveAt)}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Updated {formatTimeAgo(updatedAt)}</span>
          </div>
          <Link
            href={`/admin/partners/${partnerId}`}
            className="flex items-center gap-1 text-sm text-violet-600 font-medium hover:text-violet-700 transition-colors"
          >
            View Partner
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default IntegrationStatusCard
