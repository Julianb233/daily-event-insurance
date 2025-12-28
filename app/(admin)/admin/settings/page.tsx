"use client"

import { motion } from "framer-motion"
import {
  Settings,
  User,
  Shield,
  Bell,
  Mail,
  Database,
  Globe,
  Key,
} from "lucide-react"

export default function SettingsPage() {
  const settingSections = [
    {
      title: "Account Settings",
      icon: User,
      settings: [
        { name: "Profile Information", description: "Update your name and contact details" },
        { name: "Change Password", description: "Update your account password" },
        { name: "Two-Factor Auth", description: "Add an extra layer of security" },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { name: "Email Notifications", description: "Control email alerts and digests" },
        { name: "System Alerts", description: "Critical system notifications" },
        { name: "Partner Activity", description: "New partner signups and activity" },
      ]
    },
    {
      title: "System Configuration",
      icon: Database,
      settings: [
        { name: "Commission Settings", description: "Default rates and calculation rules" },
        { name: "Payout Schedule", description: "Configure automatic payout timing" },
        { name: "API Configuration", description: "Manage API keys and webhooks" },
      ]
    },
    {
      title: "Security",
      icon: Shield,
      settings: [
        { name: "Active Sessions", description: "View and manage active sessions" },
        { name: "Login History", description: "Review recent account activity" },
        { name: "Access Control", description: "Manage admin user permissions" },
      ]
    },
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
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage system configuration and preferences</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + sectionIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 divide-y divide-slate-100">
              {section.settings.map((setting) => (
                <div
                  key={setting.name}
                  className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium text-slate-900">{setting.name}</h3>
                    <p className="text-sm text-slate-500">{setting.description}</p>
                  </div>
                  <Settings className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Key className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Danger Zone</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Reset System Data</h3>
              <p className="text-sm text-slate-500">Clear all test data from the system (cannot be undone)</p>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors">
              Reset Data
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
