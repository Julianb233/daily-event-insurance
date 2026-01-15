"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  FileSpreadsheet,
  Mail,
  Clock,
  Target,
  Award,
  ArrowRight,
  Filter,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";
import { StepByStep } from "@/components/support-hub/StepByStep";

export default function ReportingPage() {
  const dashboardMetrics = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "$48,250",
      change: "+18%",
      trend: "up",
      color: "green"
    },
    {
      icon: Users,
      label: "Active Members",
      value: "1,247",
      change: "+12%",
      trend: "up",
      color: "blue"
    },
    {
      icon: Target,
      label: "Conversion Rate",
      value: "68%",
      change: "+5%",
      trend: "up",
      color: "purple"
    },
    {
      icon: Award,
      label: "Retention Rate",
      value: "92%",
      change: "+3%",
      trend: "up",
      color: "orange"
    }
  ];

  const reportTypes = [
    {
      name: "Sales Report",
      description: "Revenue breakdown by product, time period, and location",
      metrics: ["Total sales", "Average transaction", "Top products", "Sales by location"],
      frequency: "Daily, Weekly, Monthly, Custom",
      formats: ["PDF", "CSV", "Excel"]
    },
    {
      name: "Member Engagement",
      description: "Member activity, retention, and usage patterns",
      metrics: ["Active members", "New sign-ups", "Cancellations", "Engagement score"],
      frequency: "Weekly, Monthly, Quarterly",
      formats: ["PDF", "CSV"]
    },
    {
      name: "Coverage Analytics",
      description: "Policy types, claims frequency, and risk assessment",
      metrics: ["Policies sold", "Coverage types", "Claims ratio", "Risk profile"],
      frequency: "Monthly, Quarterly, Annual",
      formats: ["PDF", "Excel"]
    },
    {
      name: "Financial Summary",
      description: "Commission breakdown, fees, and net payouts",
      metrics: ["Gross revenue", "Commission earned", "Processing fees", "Net income"],
      frequency: "Monthly, Quarterly, Annual",
      formats: ["PDF", "CSV", "Excel"]
    }
  ];

  const exportSteps = [
    {
      title: "Select Report Type",
      description: "Choose from Sales, Engagement, Coverage, or Financial reports"
    },
    {
      title: "Set Date Range",
      description: "Pick preset periods (This Month, Last Quarter) or custom date range"
    },
    {
      title: "Apply Filters",
      description: "Filter by location, member type, product category, or payment method"
    },
    {
      title: "Choose Format",
      description: "Select PDF (visual reports), CSV (data analysis), or Excel (advanced)"
    },
    {
      title: "Generate & Download",
      description: "Click 'Generate Report' and download when ready (30-60 seconds)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Reports & Analytics" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track performance, analyze trends, and make data-driven decisions
          </p>
        </motion.div>

        {/* Dashboard Metrics Overview */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Metrics</h2>
              <p className="text-gray-600 mt-1">Real-time performance indicators</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-xl border-2 border-${metric.color}-200 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${metric.color}-100 text-${metric.color}-800`}>
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-600">January 15, 2026 at 9:45 AM</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Available Reports */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <FileSpreadsheet className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Reports</h2>
              <p className="text-gray-600 mt-1">Comprehensive data analysis and insights</p>
            </div>
          </div>

          <div className="space-y-4">
            {reportTypes.map((report, index) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Generate
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Key Metrics</p>
                    <ul className="space-y-1">
                      {report.metrics.map((metric) => (
                        <li key={metric} className="text-sm text-gray-700 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Frequency</p>
                    <p className="text-sm text-gray-700">{report.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Export Formats</p>
                    <div className="flex flex-wrap gap-2">
                      {report.formats.map((format) => (
                        <span key={format} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Sales Report Deep Dive */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sales Report Breakdown</h2>
              <p className="text-gray-600 mt-1">Detailed revenue analysis</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">December 2025 Sales Summary</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-green-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Product Type</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Units Sold</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg. Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-green-100 hover:bg-white/50">
                      <td className="py-4 px-4 font-medium text-gray-900">Event Coverage</td>
                      <td className="text-right py-4 px-4 text-gray-700">127</td>
                      <td className="text-right py-4 px-4 font-medium text-gray-900">$6,350</td>
                      <td className="text-right py-4 px-4 text-gray-700">$50.00</td>
                      <td className="text-right py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3" />
                          +24%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-green-100 hover:bg-white/50">
                      <td className="py-4 px-4 font-medium text-gray-900">Monthly Plans</td>
                      <td className="text-right py-4 px-4 text-gray-700">84</td>
                      <td className="text-right py-4 px-4 font-medium text-gray-900">$4,200</td>
                      <td className="text-right py-4 px-4 text-gray-700">$50.00</td>
                      <td className="text-right py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3" />
                          +15%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-green-100 hover:bg-white/50">
                      <td className="py-4 px-4 font-medium text-gray-900">Annual Plans</td>
                      <td className="text-right py-4 px-4 text-gray-700">19</td>
                      <td className="text-right py-4 px-4 font-medium text-gray-900">$1,900</td>
                      <td className="text-right py-4 px-4 text-gray-700">$100.00</td>
                      <td className="text-right py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3" />
                          +8%
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-green-100 font-semibold">
                      <td className="py-4 px-4">Total</td>
                      <td className="text-right py-4 px-4">230</td>
                      <td className="text-right py-4 px-4">$12,450</td>
                      <td className="text-right py-4 px-4">$54.13</td>
                      <td className="text-right py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-200 text-green-900">
                          <TrendingUp className="w-3 h-3" />
                          +18%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Top Performing Locations</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Downtown Studio</span>
                    <span className="font-semibold text-green-600">$5,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Brooklyn Branch</span>
                    <span className="font-semibold text-green-600">$4,100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Online Classes</span>
                    <span className="font-semibold text-green-600">$3,150</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Method Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Credit Card</span>
                    <span className="font-semibold text-gray-900">68% ($8,466)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ACH</span>
                    <span className="font-semibold text-gray-900">24% ($2,988)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">PayPal</span>
                    <span className="font-semibold text-gray-900">8% ($996)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Member Engagement Stats */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Member Engagement</h2>
              <p className="text-gray-600 mt-1">Activity patterns and retention metrics</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-gray-600">Active Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    +12%
                  </span>
                  <span className="text-gray-600">vs. last month</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                    <p className="text-sm text-gray-600">Sign-Up Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    +5%
                  </span>
                  <span className="text-gray-600">vs. last month</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    +3%
                  </span>
                  <span className="text-gray-600">vs. last month</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Growth Trend</h3>
              <div className="space-y-3">
                {[
                  { month: "December 2025", newMembers: 147, churned: 15, net: 132, total: 1247 },
                  { month: "November 2025", newMembers: 132, churned: 18, net: 114, total: 1115 },
                  { month: "October 2025", newMembers: 125, churned: 21, net: 104, total: 1001 },
                  { month: "September 2025", newMembers: 118, churned: 19, net: 99, total: 897 }
                ].map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{data.month}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        +{data.newMembers} new • -{data.churned} churned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">+{data.net}</p>
                      <p className="text-sm text-gray-600">{data.total} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Export Options */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Download className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Export Options</h2>
              <p className="text-gray-600 mt-1">Download reports in multiple formats</p>
            </div>
          </div>

          <StepByStep steps={exportSteps} />

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
              <FileSpreadsheet className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">PDF Reports</h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional, print-ready reports with charts and visualizations. Best for presentations and stakeholder meetings.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Executive summaries</li>
                <li>• Visual dashboards</li>
                <li>• Branded formatting</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <FileSpreadsheet className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">CSV Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Raw data export for custom analysis. Compatible with all spreadsheet software and database tools.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Transaction-level detail</li>
                <li>• Easy import to Excel</li>
                <li>• Custom calculations</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Excel Files</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pre-formatted spreadsheets with formulas and pivot tables. Ready for advanced analysis right away.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Multiple worksheets</li>
                <li>• Built-in formulas</li>
                <li>• Pivot table ready</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-indigo-900">Scheduled Reports</p>
                <p className="text-sm text-indigo-800 mt-1">
                  Set up automatic report delivery to your email. Choose weekly, monthly, or quarterly
                  schedules. Reports are generated and sent automatically on your preferred day.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/dashboard" className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Dashboard Guide</p>
                  <p className="text-sm text-gray-600 mt-1">Learn dashboard features</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/metrics" className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">Performance Metrics</p>
                  <p className="text-sm text-gray-600 mt-1">Track KPIs & benchmarks</p>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
