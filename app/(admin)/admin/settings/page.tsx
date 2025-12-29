"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Settings,
  Layers,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage system configuration and preferences</p>
      </motion.div>

      {/* Settings Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Commission Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link
            href="/admin/commission-tiers"
            className="block bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Commission Tiers</h3>
            <p className="text-sm text-slate-600">
              Configure commission rates, tier thresholds, and bonus structures for partners.
            </p>
          </Link>
        </motion.div>

        {/* Partner Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/admin/partners"
            className="block bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Partner Management</h3>
            <p className="text-sm text-slate-600">
              Manage partner accounts, tier overrides, and approval workflow.
            </p>
          </Link>
        </motion.div>

        {/* Payout Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/admin/payouts"
            className="block bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Payout Settings</h3>
            <p className="text-sm text-slate-600">
              Configure payout schedules, minimums, and processing settings.
            </p>
          </Link>
        </motion.div>
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">System Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Environment</span>
            <span className="font-medium text-slate-900">
              {process.env.NODE_ENV === "production" ? "Production" : "Development"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Version</span>
            <span className="font-medium text-slate-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">Database Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Connected
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
