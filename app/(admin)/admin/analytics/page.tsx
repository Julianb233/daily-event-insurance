"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Target,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Voicemail,
  PhoneMissed,
} from "lucide-react"

// Types
interface ConversionFunnel {
  leads: number
  contacted: number
  qualified: number
  demo_scheduled: number
  proposal_sent: number
  converted: number
}

interface ConversionRates {
  lead_to_contacted: number
  contacted_to_qualified: number
  qualified_to_demo: number
  demo_to_proposal: number
  proposal_to_converted: number
}

interface SourceBreakdown {
  [source: string]: {
    leads: number
    contacted: number
    qualified: number
    converted: number
  }
}

interface TrendPoint {
  date: string
  leads: number
  conversions: number
}

interface AgentMetrics {
  agentId: string
  totalCalls: number
  avgCallDuration: number
  dispositions: {
    reached_qualified?: number
    demo_scheduled?: number
    left_voicemail?: number
    no_answer?: number
    callback_requested?: number
    reached_not_interested?: number
    dnc?: number
  }
  conversionRate: number
  avgSentiment: number
}

interface AnalyticsData {
  funnel: ConversionFunnel
  conversionRates: ConversionRates
  bySource: SourceBreakdown
  byBusinessType: SourceBreakdown
  trend: TrendPoint[]
  dateRange: { startDate: string; endDate: string }
}

interface AgentData {
  agents: AgentMetrics[]
  summary: {
    totalCalls: number
    avgConversionRate: number
    bestPerformer: string | null
  }
}

// Date range options
const dateRanges = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "This year", value: 365 },
]

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Funnel Stage Component
function FunnelStage({
  label,
  value,
  rate,
  color,
  isLast,
}: {
  label: string
  value: number
  rate?: number
  color: string
  isLast?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 rounded-lg p-4 ${color}`}>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-2xl font-bold text-white">{formatNumber(value)}</p>
      </div>
      {!isLast && (
        <div className="flex flex-col items-center gap-1">
          <ArrowRight className="w-5 h-5 text-slate-400" />
          {rate !== undefined && (
            <span className="text-xs font-medium text-slate-500">
              {formatPercent(rate)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Simple Bar Chart Component
function BarChart({
  data,
  labelKey,
  valueKey,
  color = "bg-violet-500",
}: {
  data: { [key: string]: any }[]
  labelKey: string
  valueKey: string
  color?: string
}) {
  const maxValue = Math.max(...data.map((d) => d[valueKey]))

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="w-32 text-sm text-slate-600 truncate">
            {item[labelKey]}
          </span>
          <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500`}
              style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
            />
          </div>
          <span className="w-16 text-sm font-medium text-slate-700 text-right">
            {formatNumber(item[valueKey])}
          </span>
        </div>
      ))}
    </div>
  )
}

// Trend Line Chart (Simple SVG)
function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) return null

  const maxLeads = Math.max(...data.map((d) => d.leads))
  const maxConversions = Math.max(...data.map((d) => d.conversions))
  const chartHeight = 150
  const chartWidth = 100

  const leadsPath = data
    .map((point, idx) => {
      const x = (idx / (data.length - 1)) * chartWidth
      const y = chartHeight - (point.leads / maxLeads) * chartHeight
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const conversionsPath = data
    .map((point, idx) => {
      const x = (idx / (data.length - 1)) * chartWidth
      const y =
        chartHeight - (point.conversions / (maxConversions || 1)) * chartHeight
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-40"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={(y / 100) * chartHeight}
            x2={chartWidth}
            y2={(y / 100) * chartHeight}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}

        {/* Leads line */}
        <path
          d={leadsPath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Conversions line */}
        <path
          d={conversionsPath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-sm text-slate-600">Leads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-600">Conversions</span>
        </div>
      </div>
    </div>
  )
}

// Agent Card Component
function AgentCard({ agent }: { agent: AgentMetrics }) {
  const dispositions = agent.dispositions
  const totalDispositions = Object.values(dispositions).reduce(
    (sum, v) => sum + (v || 0),
    0
  )

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{agent.agentId}</h3>
            <p className="text-sm text-slate-500">
              {formatNumber(agent.totalCalls)} calls
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            agent.conversionRate >= 0.25
              ? "bg-emerald-100 text-emerald-700"
              : agent.conversionRate >= 0.15
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {formatPercent(agent.conversionRate)} conversion
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-slate-500">Avg Duration</p>
          <p className="text-lg font-semibold text-slate-900">
            {formatDuration(agent.avgCallDuration)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Avg Sentiment</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  agent.avgSentiment >= 0.6
                    ? "bg-emerald-500"
                    : agent.avgSentiment >= 0.4
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${agent.avgSentiment * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {(agent.avgSentiment * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Disposition breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Dispositions</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {dispositions.demo_scheduled !== undefined && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-slate-600">
                Demo: {dispositions.demo_scheduled}
              </span>
            </div>
          )}
          {dispositions.reached_qualified !== undefined && (
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-blue-500" />
              <span className="text-slate-600">
                Qualified: {dispositions.reached_qualified}
              </span>
            </div>
          )}
          {dispositions.left_voicemail !== undefined && (
            <div className="flex items-center gap-2">
              <Voicemail className="w-3 h-3 text-amber-500" />
              <span className="text-slate-600">
                Voicemail: {dispositions.left_voicemail}
              </span>
            </div>
          )}
          {dispositions.no_answer !== undefined && (
            <div className="flex items-center gap-2">
              <PhoneMissed className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600">
                No Answer: {dispositions.no_answer}
              </span>
            </div>
          )}
          {dispositions.callback_requested !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-violet-500" />
              <span className="text-slate-600">
                Callback: {dispositions.callback_requested}
              </span>
            </div>
          )}
          {dispositions.dnc !== undefined && (
            <div className="flex items-center gap-2">
              <XCircle className="w-3 h-3 text-red-500" />
              <span className="text-slate-600">DNC: {dispositions.dnc}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState(30)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [activeTab, setActiveTab] = useState<"funnel" | "agents" | "sources">(
    "funnel"
  )

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  async function fetchAnalytics() {
    setIsLoading(true)
    try {
      const startDate = new Date(
        Date.now() - dateRange * 24 * 60 * 60 * 1000
      ).toISOString()
      const endDate = new Date().toISOString()

      const [conversionRes, agentRes] = await Promise.all([
        fetch(
          `/api/admin/analytics/conversions?startDate=${startDate}&endDate=${endDate}`
        ),
        fetch(
          `/api/admin/analytics/agent-performance?startDate=${startDate}&endDate=${endDate}`
        ),
      ])

      if (conversionRes.ok) {
        const conversionData = await conversionRes.json()
        setAnalyticsData(conversionData.data)
      }

      if (agentRes.ok) {
        const agentDataRes = await agentRes.json()
        setAgentData(agentDataRes.data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate derived metrics
  const overallConversionRate = analyticsData
    ? analyticsData.funnel.converted / analyticsData.funnel.leads
    : 0

  const totalValue = analyticsData ? analyticsData.funnel.converted * 100 : 0 // $100 per conversion

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Conversion Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Track lead conversion and agent performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(analyticsData?.funnel.leads || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Conversions</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(analyticsData?.funnel.converted || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatPercent(overallConversionRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pipeline Value</p>
              <p className="text-2xl font-bold text-slate-900">
                ${formatNumber(totalValue)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-slate-100 mb-8"
      >
        <div className="flex border-b border-slate-100">
          {[
            { id: "funnel", label: "Conversion Funnel", icon: BarChart3 },
            { id: "agents", label: "Agent Performance", icon: Activity },
            { id: "sources", label: "Source Breakdown", icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-violet-600 border-b-2 border-violet-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Funnel Tab */}
          {activeTab === "funnel" && analyticsData && (
            <div className="space-y-8">
              {/* Funnel Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Lead Journey Funnel
                </h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-4">
                  <FunnelStage
                    label="Leads"
                    value={analyticsData.funnel.leads}
                    rate={analyticsData.conversionRates.lead_to_contacted}
                    color="bg-violet-500"
                  />
                  <FunnelStage
                    label="Contacted"
                    value={analyticsData.funnel.contacted}
                    rate={analyticsData.conversionRates.contacted_to_qualified}
                    color="bg-blue-500"
                  />
                  <FunnelStage
                    label="Qualified"
                    value={analyticsData.funnel.qualified}
                    rate={analyticsData.conversionRates.qualified_to_demo}
                    color="bg-cyan-500"
                  />
                  <FunnelStage
                    label="Demo"
                    value={analyticsData.funnel.demo_scheduled}
                    rate={analyticsData.conversionRates.demo_to_proposal}
                    color="bg-teal-500"
                  />
                  <FunnelStage
                    label="Proposal"
                    value={analyticsData.funnel.proposal_sent}
                    rate={analyticsData.conversionRates.proposal_to_converted}
                    color="bg-emerald-500"
                  />
                  <FunnelStage
                    label="Converted"
                    value={analyticsData.funnel.converted}
                    color="bg-green-600"
                    isLast
                  />
                </div>
              </div>

              {/* Trend Chart */}
              {analyticsData.trend && analyticsData.trend.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Leads & Conversions Over Time
                  </h3>
                  <TrendChart data={analyticsData.trend} />
                </div>
              )}

              {/* Conversion Rates Table */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Stage-to-Stage Conversion Rates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Lead → Contacted",
                      value: analyticsData.conversionRates.lead_to_contacted,
                    },
                    {
                      label: "Contacted → Qualified",
                      value: analyticsData.conversionRates.contacted_to_qualified,
                    },
                    {
                      label: "Qualified → Demo",
                      value: analyticsData.conversionRates.qualified_to_demo,
                    },
                    {
                      label: "Demo → Proposal",
                      value: analyticsData.conversionRates.demo_to_proposal,
                    },
                    {
                      label: "Proposal → Converted",
                      value: analyticsData.conversionRates.proposal_to_converted,
                    },
                  ].map((rate, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-lg p-4 text-center"
                    >
                      <p className="text-sm text-slate-500 mb-1">{rate.label}</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatPercent(rate.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === "agents" && agentData && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
                  <p className="text-violet-100 text-sm">Total Calls</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(agentData.summary.totalCalls)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
                  <p className="text-emerald-100 text-sm">Avg Conversion</p>
                  <p className="text-3xl font-bold">
                    {formatPercent(agentData.summary.avgConversionRate)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
                  <p className="text-amber-100 text-sm">Best Performer</p>
                  <p className="text-xl font-bold truncate">
                    {agentData.summary.bestPerformer || "—"}
                  </p>
                </div>
              </div>

              {/* Agent Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agentData.agents.map((agent) => (
                  <AgentCard key={agent.agentId} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {/* Sources Tab */}
          {activeTab === "sources" && analyticsData && (
            <div className="space-y-8">
              {/* By Source */}
              {analyticsData.bySource && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Performance by Lead Source
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                            Source
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                            Leads
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                            Contacted
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                            Qualified
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                            Converted
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                            Conv. Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(analyticsData.bySource).map(
                          ([source, data]) => (
                            <tr
                              key={source}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >
                              <td className="py-3 px-4 font-medium text-slate-900 capitalize">
                                {source.replace(/_/g, " ")}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-700">
                                {formatNumber(data.leads)}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-700">
                                {formatNumber(data.contacted)}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-700">
                                {formatNumber(data.qualified)}
                              </td>
                              <td className="py-3 px-4 text-right text-slate-700">
                                {formatNumber(data.converted)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                    data.converted / data.leads >= 0.05
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {formatPercent(data.converted / data.leads)}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* By Business Type */}
              {analyticsData.byBusinessType && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Performance by Business Type
                  </h3>
                  <BarChart
                    data={Object.entries(analyticsData.byBusinessType).map(
                      ([type, data]) => ({
                        type: type.charAt(0).toUpperCase() + type.slice(1),
                        converted: data.converted,
                      })
                    )}
                    labelKey="type"
                    valueKey="converted"
                    color="bg-gradient-to-r from-violet-500 to-violet-600"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
