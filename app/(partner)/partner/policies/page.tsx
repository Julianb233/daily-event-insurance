"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Filter,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { formatCurrency } from "@/lib/commission-tiers"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"

interface Policy {
  id: string
  policy_number: string
  event_type: string
  event_date: Date | string
  participants: number
  coverage_type: string
  premium: number
  commission: number
  status: string
  effective_date: Date | string
  expiration_date: Date | string
  customer_email: string
  customer_name: string
  customer_phone: string | null
  certificate_issued: boolean
  created_at: Date | string
}

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [coverageFilter, setCoverageFilter] = useState<string>("all")

  useEffect(() => {
    fetchPolicies()
  }, [statusFilter, coverageFilter])

  async function fetchPolicies() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (coverageFilter !== "all") params.append("coverageType", coverageFilter)

      const response = await fetch(`/api/partner/policies?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch policies")

      const data = await response.json()
      setPolicies(data.data || data)
    } catch (err) {
      console.error("Error fetching policies:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDownloadPolicy(policyId: string, policyNumber: string) {
    try {
      // Stub for now - will implement PDF generation later
      alert(`Policy ${policyNumber} PDF download will be available soon`)
    } catch (err) {
      console.error("Error downloading policy:", err)
      alert("Failed to download policy")
    }
  }

  function getDaysUntilExpiry(expirationDate: Date | string) {
    const expiry = new Date(expirationDate)
    const now = new Date()
    const diff = expiry.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const filteredPolicies = policies.filter((policy) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      policy.policy_number.toLowerCase().includes(searchLower) ||
      policy.event_type.toLowerCase().includes(searchLower) ||
      policy.customer_name.toLowerCase().includes(searchLower) ||
      policy.customer_email.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Policies</h1>
        <p className="text-slate-600 mt-1">View and manage your sold policies</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-500">Active Policies</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {policies.filter(p => p.status === "active").length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm text-slate-500">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(policies.reduce((sum, p) => sum + Number(p.commission), 0))}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-500">This Month</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {policies.filter(p => {
              const created = new Date(p.created_at)
              const now = new Date()
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">Certificates</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {policies.filter(p => p.certificate_issued).length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Coverage Filter */}
        <select
          value={coverageFilter}
          onChange={(e) => setCoverageFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Coverage Types</option>
          <option value="liability">Liability</option>
          <option value="equipment">Equipment</option>
          <option value="cancellation">Cancellation</option>
        </select>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center shadow-lg border border-slate-100"
          >
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No policies found</h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== "all" || coverageFilter !== "all"
                ? "Try adjusting your filters"
                : "Your sold policies will appear here"}
            </p>
          </motion.div>
        ) : (
          filteredPolicies.map((policy, index) => {
            const status = statusConfig[policy.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon
            const daysUntilExpiry = getDaysUntilExpiry(policy.expiration_date)

            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Policy Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{policy.policy_number}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                          {policy.certificate_issued && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Certificate Issued
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-medium">{policy.event_type}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{policy.participants} participants</span>
                          <span className="capitalize">{policy.coverage_type}</span>
                          <span>{new Date(policy.event_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{policy.customer_name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <a href={`mailto:${policy.customer_email}`} className="flex items-center gap-1.5 hover:text-teal-600">
                          <Mail className="w-3.5 h-3.5" />
                          {policy.customer_email}
                        </a>
                        {policy.customer_phone && (
                          <a href={`tel:${policy.customer_phone}`} className="flex items-center gap-1.5 hover:text-teal-600">
                            <Phone className="w-3.5 h-3.5" />
                            {policy.customer_phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Dates & Pricing */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-500">Effective</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(policy.effective_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Expires</p>
                        <p className={`text-sm font-medium ${daysUntilExpiry <= 7 && daysUntilExpiry > 0 ? "text-amber-600" : "text-slate-900"}`}>
                          {new Date(policy.expiration_date).toLocaleDateString()}
                          {policy.status === "active" && daysUntilExpiry > 0 && (
                            <span className="text-xs ml-1">({daysUntilExpiry}d)</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Premium</p>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(Number(policy.premium))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Your Commission</p>
                        <p className="text-sm font-bold text-teal-600">{formatCurrency(Number(policy.commission))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPolicy(policy.id, policy.policy_number)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Download policy PDF"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium">Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <IntegrationChatWidget topic="troubleshooting" />
    </div>
  )
}
