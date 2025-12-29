"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
} from "lucide-react"

export default function ReportsPage() {
  const reports = [
    { name: "Revenue Report", description: "Total revenue by period and partner", icon: TrendingUp, color: "from-violet-500 to-violet-600" },
    { name: "Commission Report", description: "Partner commissions breakdown", icon: BarChart3, color: "from-blue-500 to-blue-600" },
    { name: "Policy Report", description: "Policies issued by type and partner", icon: PieChart, color: "from-emerald-500 to-emerald-600" },
    { name: "Claims Report", description: "Claims status and payout analysis", icon: LineChart, color: "from-amber-500 to-amber-600" },
    { name: "Partner Performance", description: "Partner metrics and rankings", icon: FileText, color: "from-rose-500 to-rose-600" },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">Generate and download business reports</p>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Report Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Last 7 Days", "Last 30 Days", "This Month", "Last Month", "This Quarter", "Custom"].map((period) => (
              <button
                key={period}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === "Last 30 Days"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
              <report.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{report.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{report.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Preview
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
