"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bell,
  Settings,
  Eye,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Maximize2,
  RefreshCw,
  PieChart
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";
import { StepByStep } from "@/components/support-hub/StepByStep";

export default function DashboardPage() {
  const dashboardSections = [
    {
      icon: TrendingUp,
      title: "Performance Overview",
      description: "Revenue, growth trends, and key metrics at a glance",
      features: ["Revenue chart", "Growth percentage", "Comparison to previous periods", "Goal progress"]
    },
    {
      icon: Users,
      title: "Member Activity",
      description: "Active members, new sign-ups, and engagement stats",
      features: ["Active member count", "New registrations", "Churn rate", "Engagement score"]
    },
    {
      icon: DollarSign,
      title: "Financial Summary",
      description: "Commission breakdown, payouts, and pending payments",
      features: ["Total earnings", "Pending payouts", "Next payment date", "Commission breakdown"]
    },
    {
      icon: PieChart,
      title: "Coverage Analytics",
      description: "Policy types, claims, and coverage distribution",
      features: ["Policies by type", "Active coverage", "Claims summary", "Risk assessment"]
    }
  ];

  const navigationSteps = [
    {
      title: "Access Dashboard",
      description: "Log in to your partner portal at dashboard.dailyeventinsurance.com"
    },
    {
      title: "Main Navigation",
      description: "Use the left sidebar to access different sections: Overview, Reports, Billing, Settings"
    },
    {
      title: "Quick Actions",
      description: "Top right corner has quick access to: Add Member, View Reports, Download Invoice"
    },
    {
      title: "Customize Layout",
      description: "Click the gear icon to customize which widgets appear on your dashboard"
    }
  ];

  const customizationOptions = [
    {
      category: "Metrics Display",
      options: ["Show/hide revenue charts", "Toggle member stats", "Display period selector", "Revenue goal tracker"]
    },
    {
      category: "Time Period",
      options: ["Last 7 days", "Last 30 days", "Last quarter", "Custom date range"]
    },
    {
      category: "Data Visualization",
      options: ["Line charts", "Bar graphs", "Pie charts", "Data tables"]
    },
    {
      category: "Quick Filters",
      options: ["By location", "By product type", "By payment method", "By member status"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Dashboard Guide" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Partner Dashboard Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your dashboard, navigate key features, and customize your view
          </p>
        </motion.div>

        {/* Dashboard Overview */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <LayoutDashboard className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Sections</h2>
              <p className="text-gray-600 mt-1">Your command center for partner management</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dashboardSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-indigo-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-16">
                  {section.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Navigation Guide */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Eye className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Navigation</h2>
              <p className="text-gray-600 mt-1">How to navigate and use key features</p>
            </div>
          </div>

          <StepByStep steps={navigationSteps} />

          <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Layout</h3>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Top Navigation Bar</h4>
                  <span className="text-xs text-gray-500">Always visible</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Contains your profile, notifications, quick actions, and search functionality
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Profile Menu</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Notifications (🔔)</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Quick Add (+)</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Search (🔍)</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Left Sidebar</h4>
                  <span className="text-xs text-gray-500">Collapsible</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Main navigation menu with access to all major sections
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>📊 Dashboard</span>
                    <span className="text-xs text-gray-500">Cmd+D</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>👥 Members</span>
                    <span className="text-xs text-gray-500">Cmd+M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>📈 Reports</span>
                    <span className="text-xs text-gray-500">Cmd+R</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💳 Billing</span>
                    <span className="text-xs text-gray-500">Cmd+B</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⚙️ Settings</span>
                    <span className="text-xs text-gray-500">Cmd+,</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Main Content Area</h4>
                  <span className="text-xs text-gray-500">Responsive</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Dynamic content that changes based on your selected section
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Widgets</span>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Charts</span>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Data Tables</span>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Action Buttons</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Setting Up Alerts */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Bell className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Setting Up Alerts</h2>
              <p className="text-gray-600 mt-1">Stay informed with custom notifications</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Alert Types</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Revenue Alerts</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-7">
                    <li>• Daily revenue threshold reached</li>
                    <li>• Monthly goal achieved</li>
                    <li>• Payment deposited</li>
                    <li>• Large transaction (customizable amount)</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Member Alerts</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-7">
                    <li>• New member registered</li>
                    <li>• Member cancellation</li>
                    <li>• Payment failure</li>
                    <li>• Membership renewal due</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-gray-900">System Alerts</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-7">
                    <li>• Integration errors</li>
                    <li>• API connection issues</li>
                    <li>• Security notifications</li>
                    <li>• System maintenance scheduled</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Performance Alerts</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-7">
                    <li>• Conversion rate drop</li>
                    <li>• High churn rate detected</li>
                    <li>• Growth milestone reached</li>
                    <li>• Weekly performance summary</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">How to Configure Alerts</h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                    <span>Go to Settings → Notifications</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                    <span>Select alert category to customize</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                    <span>Toggle individual alerts on/off</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">4</span>
                    <span>Set thresholds (e.g., $500+ transactions)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">5</span>
                    <span>Choose delivery method (in-app, email, SMS)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-xs">6</span>
                    <span>Save preferences</span>
                  </li>
                </ol>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <h3 className="font-semibold text-gray-900 mb-4">Alert Delivery Options</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">In-App Notifications</p>
                      <p className="text-sm text-gray-600">Bell icon in dashboard (real-time)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">📧</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Alerts</p>
                      <p className="text-sm text-gray-600">Sent to your registered email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">📱</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Critical alerts only (optional)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Customizing Views */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Settings className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customizing Your Dashboard</h2>
              <p className="text-gray-600 mt-1">Personalize your view for maximum efficiency</p>
            </div>
          </div>

          <div className="space-y-6">
            {customizationOptions.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl border border-purple-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.options.map((option) => (
                    <div key={option} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-start gap-4">
                <Maximize2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Widget Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop widgets to rearrange your dashboard. Click the gear icon on any widget to:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>Show/hide specific data points</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-purple-600" />
                      <span>Apply filters (location, date range)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-purple-600" />
                      <span>Set auto-refresh intervals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-600" />
                      <span>Enable quick export buttons</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Keyboard Shortcuts */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Settings className="w-6 h-6 text-teal-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
              <p className="text-gray-600 mt-1">Work faster with keyboard commands</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { keys: "Cmd/Ctrl + D", action: "Go to Dashboard" },
              { keys: "Cmd/Ctrl + M", action: "Members section" },
              { keys: "Cmd/Ctrl + R", action: "Reports section" },
              { keys: "Cmd/Ctrl + B", action: "Billing section" },
              { keys: "Cmd/Ctrl + ,", action: "Settings" },
              { keys: "Cmd/Ctrl + K", action: "Quick search" },
              { keys: "Cmd/Ctrl + N", action: "Add new member" },
              { keys: "Cmd/Ctrl + E", action: "Export current view" }
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <span className="text-sm text-gray-700">{shortcut.action}</span>
                <kbd className="px-3 py-1 bg-white rounded border border-gray-300 text-sm font-mono text-gray-900">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/reporting" className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">View Reports</p>
                  <p className="text-sm text-gray-600 mt-1">Generate analytics reports</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/team" className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Team Management</p>
                  <p className="text-sm text-gray-600 mt-1">Add & manage team members</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
