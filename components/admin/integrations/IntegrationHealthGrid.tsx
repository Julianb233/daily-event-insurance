"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Plug,
  Code,
  Laptop,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  IntegrationStatusBadge,
  IntegrationStatusDot,
  type IntegrationStatus,
} from "./IntegrationStatusBadge"

export type IntegrationType = "widget" | "api" | "pos"
export type POSSystem =
  | "mindbody"
  | "pike13"
  | "clubready"
  | "marianatek"
  | "zenoti"
  | "vagaro"
  | "other"

export interface PartnerIntegration {
  id: string
  partnerId: string
  integrationType: IntegrationType
  posSystem: POSSystem | null
  status: IntegrationStatus
  configuration: string | null
  apiKeyGenerated: boolean
  webhookConfigured: boolean
  lastTestedAt: string | null
  testResult: string | null
  testErrors: string | null
  wentLiveAt: string | null
  createdAt: string
  updatedAt: string
  partner: {
    id: string
    businessName: string
    businessType: string
    contactEmail: string
  }
}

interface IntegrationHealthGridProps {
  integrations: PartnerIntegration[]
  onTestIntegration: (id: string) => Promise<void>
  testingId: string | null
  className?: string
}

const integrationTypeConfig: Record<
  IntegrationType,
  { label: string; icon: typeof Plug; color: string }
> = {
  widget: {
    label: "Widget",
    icon: Laptop,
    color: "text-blue-600 dark:text-blue-400",
  },
  api: {
    label: "API",
    icon: Code,
    color: "text-purple-600 dark:text-purple-400",
  },
  pos: {
    label: "POS",
    icon: Plug,
    color: "text-teal-600 dark:text-teal-400",
  },
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function IntegrationCard({
  integration,
  onTest,
  isTesting,
}: {
  integration: PartnerIntegration
  onTest: () => void
  isTesting: boolean
}) {
  const typeConfig = integrationTypeConfig[integration.integrationType]
  const TypeIcon = typeConfig.icon

  const testErrors = integration.testErrors
    ? JSON.parse(integration.testErrors)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                integration.status === "live"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : integration.status === "failed"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <TypeIcon
                className={cn(
                  "w-5 h-5",
                  integration.status === "live"
                    ? "text-green-600 dark:text-green-400"
                    : integration.status === "failed"
                    ? "text-red-600 dark:text-red-400"
                    : typeConfig.color
                )}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {integration.partner.businessName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {integration.partner.contactEmail}
              </p>
            </div>
          </div>
          <IntegrationStatusBadge status={integration.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Integration Type */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Type</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {typeConfig.label}
            </span>
            {integration.posSystem && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                {integration.posSystem}
              </span>
            )}
          </div>
        </div>

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Configuration</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {integration.apiKeyGenerated ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              )}
              <span
                className={cn(
                  "text-xs",
                  integration.apiKeyGenerated
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400"
                )}
              >
                API Key
              </span>
            </div>
            <div className="flex items-center gap-1">
              {integration.webhookConfigured ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              )}
              <span
                className={cn(
                  "text-xs",
                  integration.webhookConfigured
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400"
                )}
              >
                Webhook
              </span>
            </div>
          </div>
        </div>

        {/* Last Test */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Last Test</span>
          <div className="flex items-center gap-2">
            {integration.testResult === "success" && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {integration.testResult === "partial" && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
            {integration.testResult === "failed" && (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-gray-900 dark:text-white">
              {formatTimeAgo(integration.lastTestedAt)}
            </span>
          </div>
        </div>

        {/* Went Live */}
        {integration.wentLiveAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Went Live</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(integration.wentLiveAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Error Messages */}
        {testErrors.length > 0 && integration.status === "failed" && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {testErrors.slice(0, 2).map((error: string, i: number) => (
                  <p
                    key={i}
                    className="text-xs text-red-600 dark:text-red-400"
                  >
                    {error}
                  </p>
                ))}
                {testErrors.length > 2 && (
                  <p className="text-xs text-red-500">
                    +{testErrors.length - 2} more errors
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button
          onClick={onTest}
          disabled={isTesting}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            isTesting
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50"
          )}
        >
          <RefreshCw
            className={cn("w-4 h-4", isTesting && "animate-spin")}
          />
          {isTesting ? "Testing..." : "Test"}
        </button>

        <Link
          href={`/admin/partners/${integration.partnerId}`}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          View Partner
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}

export function IntegrationHealthGrid({
  integrations,
  onTestIntegration,
  testingId,
  className,
}: IntegrationHealthGridProps) {
  if (integrations.length === 0) {
    return (
      <div className="text-center py-12">
        <Plug className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No integrations found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No partner integrations match your current filters.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
        className
      )}
    >
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onTest={() => onTestIntegration(integration.id)}
          isTesting={testingId === integration.id}
        />
      ))}
    </div>
  )
}

// Table view alternative
export function IntegrationHealthTable({
  integrations,
  onTestIntegration,
  testingId,
  className,
}: IntegrationHealthGridProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Configuration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Test
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {integrations.map((integration) => {
              const typeConfig =
                integrationTypeConfig[integration.integrationType]
              const TypeIcon = typeConfig.icon

              return (
                <tr
                  key={integration.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <IntegrationStatusDot status={integration.status} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {integration.partner.businessName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {integration.partner.contactEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={cn("w-4 h-4", typeConfig.color)} />
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {typeConfig.label}
                      </span>
                      {integration.posSystem && (
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                          {integration.posSystem}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <IntegrationStatusBadge
                      status={integration.status}
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {integration.apiKeyGenerated ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          API
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {integration.webhookConfigured ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Webhook
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {integration.testResult === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {integration.testResult === "partial" && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {integration.testResult === "failed" && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(integration.lastTestedAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onTestIntegration(integration.id)}
                        disabled={testingId === integration.id}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          testingId === integration.id
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        )}
                        title="Test integration"
                      >
                        <RefreshCw
                          className={cn(
                            "w-4 h-4",
                            testingId === integration.id && "animate-spin"
                          )}
                        />
                      </button>
                      <Link
                        href={`/admin/partners/${integration.partnerId}`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                        title="View partner"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
