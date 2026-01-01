"use client"

import Link from "next/link"
import {
  FileText,
  FolderOpen,
  Phone,
  BarChart3,
  Settings,
  Users,
  Shield,
  Layers,
} from "lucide-react"

const adminSections = [
  {
    title: "Partner Resources",
    description: "Manage marketing materials, training videos, and documentation for partners",
    href: "/admin/resources",
    icon: FolderOpen,
    color: "bg-teal-100 text-teal-600",
    borderColor: "border-teal-200 hover:border-teal-400",
  },
  {
    title: "Document Templates",
    description: "Edit partner agreement, W-9, and direct deposit document templates",
    href: "/admin/documents",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200 hover:border-blue-400",
  },
  {
    title: "Voice Agent",
    description: "Configure AI voice agent settings, knowledge base, and escalation rules",
    href: "/admin/voice-agent",
    icon: Phone,
    color: "bg-purple-100 text-purple-600",
    borderColor: "border-purple-200 hover:border-purple-400",
  },
  {
    title: "Commission Tiers",
    description: "Set up and manage partner commission tier structures",
    href: "/admin/commission-tiers",
    icon: Layers,
    color: "bg-amber-100 text-amber-600",
    borderColor: "border-amber-200 hover:border-amber-400",
    disabled: true,
  },
  {
    title: "Partner Management",
    description: "View and manage partner accounts, approvals, and tier overrides",
    href: "/admin/partners",
    icon: Users,
    color: "bg-green-100 text-green-600",
    borderColor: "border-green-200 hover:border-green-400",
    disabled: true,
  },
  {
    title: "Analytics Dashboard",
    description: "View platform-wide analytics, revenue, and performance metrics",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "bg-indigo-100 text-indigo-600",
    borderColor: "border-indigo-200 hover:border-indigo-400",
    disabled: true,
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Manage platform content, partner resources, and system configuration.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">Partner Resources</p>
            <p className="text-2xl font-bold text-gray-900">16</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">Document Templates</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">Active Partners</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">System Status</p>
            <p className="text-lg font-bold text-green-600">Operational</p>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const IconComponent = section.icon
            const card = (
              <div
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                  section.disabled
                    ? "border-gray-100 opacity-60 cursor-not-allowed"
                    : `${section.borderColor} cursor-pointer hover:shadow-md`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {section.title}
                      {section.disabled && (
                        <span className="ml-2 text-xs font-normal text-gray-400">(Coming Soon)</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{section.description}</p>
                  </div>
                </div>
              </div>
            )

            if (section.disabled) {
              return <div key={section.href}>{card}</div>
            }

            return (
              <Link key={section.href} href={section.href}>
                {card}
              </Link>
            )
          })}
        </div>

        {/* Dev Mode Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Development Mode Active
          </h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Database not connected - using mock data</li>
            <li>• Authentication bypassed for development</li>
            <li>• Changes made in demo mode won&apos;t persist</li>
            <li>• Configure DATABASE_URL and AUTH_SECRET for production</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
