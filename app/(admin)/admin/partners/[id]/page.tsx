"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Layers,
  Globe,
  CreditCard,
} from "lucide-react"

interface PartnerData {
  id: string
  businessName: string
  businessType: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  status: "pending" | "active" | "suspended" | "documents_sent"
  integrationType: "widget" | "api" | "manual"
  createdAt: string
  approvedAt: string | null
  agreementSigned: boolean
  w9Signed: boolean
  directDepositSigned: boolean
}

interface TierData {
  tierName: string
  commissionRate: number
  isOverride: boolean
  overrideReason: string | null
}

interface StatsData {
  totalPolicies: number
  activePolicies: number
  totalRevenue: number
  totalCommission: number
}

interface PolicyData {
  id: string
  policyNumber: string
  eventType: string
  eventDate: string
  premium: number
  customerName?: string
  createdAt: string
}

interface QuoteData {
  id: string
  quoteNumber: string
  eventType: string
  status: string
  premium: number
  customerName?: string
  createdAt: string
}

interface EarningsData {
  month: string
  amount: number
}

interface PartnerDetailResponse {
  partner: PartnerData
  currentTier: TierData
  stats: StatsData
  recentPolicies: PolicyData[]
  recentQuotes: QuoteData[]
  earningsHistory: EarningsData[]
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  documents_sent: { label: "Documents Sent", color: "bg-blue-100 text-blue-700", icon: Mail },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700", icon: XCircle },
}

const tierColors: Record<string, string> = {
  Bronze: "from-amber-600 to-amber-700",
  Silver: "from-slate-400 to-slate-500",
  Gold: "from-yellow-500 to-yellow-600",
  Platinum: "from-violet-500 to-violet-600",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function PartnerDetailPage() {
  const params = useParams()
  const partnerId = params.id as string

  const [data, setData] = useState<PartnerDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"policies" | "quotes" | "earnings">("policies")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchPartnerDetails()
  }, [partnerId])

  async function fetchPartnerDetails() {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`)
      if (!response.ok) throw new Error("Failed to fetch partner")
      const result = await response.json()
      setData(result.data)
    } catch (err) {
      console.error("Error fetching partner:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusToggle() {
    if (!data) return
    setIsUpdating(true)

    const newStatus = data.partner.status === "active" ? "suspended" : "active"

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setData({
        ...data,
        partner: { ...data.partner, status: newStatus },
      })
    } catch (err) {
      console.error("Error updating status:", err)
      setData({
        ...data,
        partner: { ...data.partner, status: newStatus },
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            <div className="h-8 bg-slate-200 rounded w-64" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="h-64 bg-slate-200 rounded-2xl" />
              <div className="h-40 bg-slate-200 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Partner not found</p>
          <Link
            href="/admin/partners"
            className="mt-4 inline-flex items-center gap-2 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
          </Link>
        </div>
      </div>
    )
  }

  const { partner, currentTier, stats, recentPolicies, recentQuotes, earningsHistory } = data
  const status = statusConfig[partner.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/partners"
              className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                {partner.businessName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {partner.status === "active" ? (
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Suspend Partner
              </button>
            ) : partner.status === "suspended" ? (
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                Activate Partner
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Partner Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-bold text-slate-900">Partner Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">Business Name</span>
                <span className="font-medium text-slate-900">{partner.businessName}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-slate-500">Business Type</span>
                <span className="font-medium text-slate-900 capitalize">{partner.businessType}</span>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500 mb-2">Contact</p>
                <p className="font-medium text-slate-900">{partner.contactName}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  {partner.contactEmail}
                </div>
                {partner.contactPhone && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    {partner.contactPhone}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-slate-500">Integration Type</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 capitalize">
                    <Globe className="w-3 h-3" />
                    {partner.integrationType}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-sm text-slate-500">Created</span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(partner.createdAt)}
                  </span>
                </div>
                {partner.approvedAt && (
                  <div className="flex items-start justify-between mt-2">
                    <span className="text-sm text-slate-500">Approved</span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {formatDate(partner.approvedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Document Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-bold text-slate-900">Document Status</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">Partner Agreement</span>
                {partner.agreementSigned ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Signed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                    <XCircle className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">W-9 Form</span>
                {partner.w9Signed ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Signed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                    <XCircle className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-700">Direct Deposit</span>
                {partner.directDepositSigned ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CreditCard className="w-4 h-4" />
                    Set Up
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                    <XCircle className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Current Tier Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-bold text-slate-900">Current Tier</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tierColors[currentTier.tierName] || 'from-slate-400 to-slate-500'} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {Math.round(currentTier.commissionRate * 100)}%
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{currentTier.tierName}</p>
                <p className="text-sm text-slate-500">
                  {Math.round(currentTier.commissionRate * 100)}% commission rate
                </p>
                {currentTier.isOverride && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      <AlertTriangle className="w-3 h-3" />
                      Override Applied
                    </span>
                  </div>
                )}
              </div>
            </div>

            {currentTier.isOverride && currentTier.overrideReason && (
              <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-100">
                <p className="text-sm text-purple-700">
                  <strong>Reason:</strong> {currentTier.overrideReason}
                </p>
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-slate-500">Total Policies</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalPolicies.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-slate-500">Active Policies</p>
              <p className="text-2xl font-bold text-slate-900">{stats.activePolicies.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-slate-500">Total Commission</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalCommission)}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100"
      >
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("policies")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "policies"
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Recent Policies
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "quotes"
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Recent Quotes
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "earnings"
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Earnings History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "policies" && (
            <div className="overflow-x-auto">
              {recentPolicies.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-medium">Policy Number</th>
                      <th className="pb-3 font-medium">Event Type</th>
                      <th className="pb-3 font-medium">Event Date</th>
                      <th className="pb-3 font-medium text-right">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentPolicies.map((policy) => (
                      <tr key={policy.id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <span className="font-medium text-slate-900">{policy.policyNumber}</span>
                        </td>
                        <td className="py-3">
                          <span className="capitalize text-slate-600">{policy.eventType}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-slate-600">{formatDate(policy.eventDate)}</span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-slate-900">{formatCurrency(policy.premium)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-slate-500">No policies found</div>
              )}
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="overflow-x-auto">
              {recentQuotes.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-medium">Quote Number</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <span className="font-medium text-slate-900">{quote.quoteNumber}</span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            quote.status === "accepted" ? "bg-green-100 text-green-700" :
                            quote.status === "pending" ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-slate-900">{formatCurrency(quote.premium)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-slate-500">No quotes found</div>
              )}
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="space-y-3">
              {earningsHistory.length > 0 ? (
                earningsHistory.map((earning, index) => {
                  const maxAmount = Math.max(...earningsHistory.map(e => e.amount))
                  const widthPercent = maxAmount > 0 ? (earning.amount / maxAmount) * 100 : 0

                  return (
                    <div key={earning.month} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-slate-600">{earning.month}</span>
                      <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg"
                        />
                      </div>
                      <span className="w-24 text-right font-medium text-slate-900">
                        {formatCurrency(earning.amount)}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-slate-500">No earnings history</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
