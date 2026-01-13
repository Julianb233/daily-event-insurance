"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileDown,
  FileSpreadsheet,
  CalendarClock,
  Filter,
  BarChart3,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Types
type Period = "7d" | "30d" | "90d" | "1y" | "custom"

interface ReportMetrics {
  totalPolicies: number
  activePolicies: number
  totalParticipants: number
  claimsCount: number
  claimsResolutionRate: number
  avgResolutionTime: number
  policyGrowth: number
  participantGrowth: number
}

interface PolicyVolumeData {
  date: string
  policies: number
  participants: number
}

interface PolicyTypeData {
  type: string
  count: number
  percentage: number
}

interface ClaimsStatusData {
  status: string
  count: number
}

interface MonthlyComparisonData {
  month: string
  currentYear: number
  previousYear: number
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  lastGenerated: string | null
  category: string
}

// Mock data generator
function generateMockData(period: Period) {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365
  const policyVolume: PolicyVolumeData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    policyVolume.push({
      date: date.toISOString().split('T')[0],
      policies: Math.floor(Math.random() * 50) + 70,
      participants: Math.floor(Math.random() * 200) + 250,
    })
  }

  const metrics: ReportMetrics = {
    totalPolicies: 4567,
    activePolicies: 3842,
    totalParticipants: 15234,
    claimsCount: 287,
    claimsResolutionRate: 94.5,
    avgResolutionTime: 3.2,
    policyGrowth: 12.5,
    participantGrowth: 18.3,
  }

  const policyTypes: PolicyTypeData[] = [
    { type: "Sports Events", count: 1823, percentage: 39.9 },
    { type: "Adventure Activities", count: 1368, percentage: 29.9 },
    { type: "Fitness Classes", count: 913, percentage: 20.0 },
    { type: "Outdoor Recreation", count: 463, percentage: 10.2 },
  ]

  const claimsStatus: ClaimsStatusData[] = [
    { status: "Approved", count: 142 },
    { status: "Pending", count: 23 },
    { status: "Under Review", count: 27 },
    { status: "Rejected", count: 18 },
  ]

  const monthlyComparison: MonthlyComparisonData[] = [
    { month: "Jan", currentYear: 380, previousYear: 320 },
    { month: "Feb", currentYear: 420, previousYear: 350 },
    { month: "Mar", currentYear: 390, previousYear: 380 },
    { month: "Apr", currentYear: 450, previousYear: 400 },
    { month: "May", currentYear: 480, previousYear: 420 },
    { month: "Jun", currentYear: 510, previousYear: 460 },
  ]

  return {
    metrics,
    policyVolume,
    policyTypes,
    claimsStatus,
    monthlyComparison,
  }
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "policy-summary",
    name: "Policy Summary Report",
    description: "Comprehensive overview of all policies, volumes, and trends",
    icon: Shield,
    lastGenerated: "2026-01-12T14:30:00Z",
    category: "Policies",
  },
  {
    id: "claims-analysis",
    name: "Claims Analysis Report",
    description: "Detailed breakdown of claims status, resolution rates, and trends",
    icon: AlertTriangle,
    lastGenerated: "2026-01-11T09:15:00Z",
    category: "Claims",
  },
  {
    id: "coverage-distribution",
    name: "Coverage Distribution Report",
    description: "Policy type distribution and participant demographics",
    icon: BarChart3,
    lastGenerated: "2026-01-10T16:45:00Z",
    category: "Analytics",
  },
  {
    id: "participant-insights",
    name: "Participant Insights Report",
    description: "Participant trends, growth metrics, and engagement data",
    icon: Users,
    lastGenerated: null,
    category: "Participants",
  },
  {
    id: "performance-metrics",
    name: "Performance Metrics Report",
    description: "KPIs, growth trends, and operational efficiency metrics",
    icon: TrendingUp,
    lastGenerated: "2026-01-13T08:00:00Z",
    category: "Analytics",
  },
  {
    id: "monthly-executive",
    name: "Monthly Executive Summary",
    description: "High-level overview for stakeholders and decision makers",
    icon: FileText,
    lastGenerated: "2026-01-01T12:00:00Z",
    category: "Executive",
  },
]

const COLORS = {
  emerald: ["#10b981", "#059669", "#047857", "#065f46"],
  status: {
    approved: "#10b981",
    pending: "#f59e0b",
    underReview: "#6366f1",
    rejected: "#ef4444",
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(timestamp))
}

export default function SuresReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("30d")
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)

  const data = useMemo(() => generateMockData(selectedPeriod), [selectedPeriod])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  const handleExportCSV = () => {
    console.log("Exporting to CSV...")
    // Implementation would generate CSV from data
  }

  const handleExportPDF = () => {
    console.log("Exporting to PDF...")
    // Implementation would generate PDF report
  }

  const handleScheduleReport = () => {
    console.log("Opening schedule dialog...")
    // Implementation would show scheduling modal
  }

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`)
    // Implementation would generate the specific report
  }

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`)
    // Implementation would download the pre-generated report
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="text-slate-600 mt-1">Comprehensive insights and data exports</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={handleScheduleReport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-white font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/25"
              >
                <CalendarClock className="w-4 h-4" />
                Schedule Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Period:</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { value: "7d" as Period, label: "7 Days" },
                  { value: "30d" as Period, label: "30 Days" },
                  { value: "90d" as Period, label: "90 Days" },
                  { value: "1y" as Period, label: "1 Year" },
                  { value: "custom" as Period, label: "Custom" },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => {
                      setSelectedPeriod(period.value)
                      if (period.value === "custom") {
                        setShowCustomDatePicker(true)
                      } else {
                        setShowCustomDatePicker(false)
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedPeriod === period.value
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Policies */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-600">
                +{data.metrics.policyGrowth}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Policies</p>
            <p className="text-2xl font-bold text-slate-900">{data.metrics.totalPolicies.toLocaleString()}</p>
          </motion.div>

          {/* Active Policies */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-slate-500">
                {((data.metrics.activePolicies / data.metrics.totalPolicies) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Active Policies</p>
            <p className="text-2xl font-bold text-slate-900">{data.metrics.activePolicies.toLocaleString()}</p>
          </motion.div>

          {/* Total Participants */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-600">
                +{data.metrics.participantGrowth}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Participants</p>
            <p className="text-2xl font-bold text-slate-900">{data.metrics.totalParticipants.toLocaleString()}</p>
          </motion.div>

          {/* Claims Count */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-slate-500">
                {data.metrics.claimsCount} total
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Claims Count</p>
            <p className="text-2xl font-bold text-slate-900">{data.claimsStatus.find(c => c.status === "Pending")?.count || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Pending claims</p>
          </motion.div>

          {/* Claims Resolution Rate */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-slate-500">
                {data.metrics.avgResolutionTime}d avg
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Resolution Rate</p>
            <p className="text-2xl font-bold text-slate-900">{data.metrics.claimsResolutionRate}%</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Policy Volume Trends */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Policy Volume Trends</h3>
              <p className="text-sm text-slate-500">Daily policy and participant counts</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.policyVolume}>
                  <defs>
                    <linearGradient id="colorPolicies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    labelFormatter={(value) => formatDate(value)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="policies"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPolicies)"
                    name="Policies"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Policy Distribution by Type */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Policy Distribution by Type</h3>
              <p className="text-sm text-slate-500">Coverage breakdown by category</p>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.policyTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.policyTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.emerald[index % COLORS.emerald.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Claims by Status */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Claims by Status</h3>
              <p className="text-sm text-slate-500">Current claims distribution</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.claimsStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="status" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.claimsStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.status === "Approved" ? COLORS.status.approved :
                          entry.status === "Pending" ? COLORS.status.pending :
                          entry.status === "Under Review" ? COLORS.status.underReview :
                          COLORS.status.rejected
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Policy Comparison */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Monthly Policy Comparison</h3>
              <p className="text-sm text-slate-500">Year-over-year comparison</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="currentYear"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="2026"
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previousYear"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="2025"
                    dot={{ fill: "#94a3b8", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Report Templates Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Templates</h3>
                <p className="text-sm text-slate-500">Pre-built reports ready to generate</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {reportTemplates.map((template) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="text-base font-semibold text-slate-900">{template.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {template.lastGenerated && (
                            <button
                              onClick={() => handleDownloadReport(template.id)}
                              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                              title="Download last report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleGenerateReport(template.id)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg text-white font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md shadow-emerald-500/20"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {template.category}
                        </span>
                        {template.lastGenerated ? (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last generated {formatTimeAgo(template.lastGenerated)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Never generated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Export Options Footer */}
        <motion.div variants={itemVariants} className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-1">Need a custom report?</h3>
              <p className="text-emerald-100 text-sm">Export raw data or schedule automated reports</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-emerald-700 font-medium hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Raw Data
              </button>
              <button
                onClick={handleScheduleReport}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 rounded-xl text-white font-medium hover:bg-emerald-900 transition-colors shadow-lg"
              >
                <CalendarClock className="w-4 h-4" />
                Schedule Reports
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
