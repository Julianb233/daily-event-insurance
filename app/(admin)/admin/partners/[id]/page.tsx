"use client"

import { useEffect, useState, use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Layers,
  Edit,
  Ban,
  RefreshCw,
} from "lucide-react"

interface PartnerDetail {
  id: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  businessType: string
  integrationType: string
  primaryColor: string
  logoUrl: string | null
  status: string
  documentsStatus: string
  agreementSigned: boolean
  w9Signed: boolean
  directDepositSigned: boolean
  documentsSentAt: string | null
  documentsCompletedAt: string | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
  policyCount: number
  totalRevenue: number
  totalCommission: number
  currentTier: string | null
  tierOverride: boolean
  tierOverrideReason: string | null
  monthlyVolume?: number
}

interface RecentPolicy {
  id: string
  policyNumber: string
  eventName: string
  premium: number
  commission: number
  status: string
  createdAt: string
}

const mockPartner: PartnerDetail = {
  id: "p1",
  businessName: "Adventure Sports Inc",
  contactName: "John Smith",
  contactEmail: "john@adventuresports.com",
  contactPhone: "(555) 123-4567",
  businessType: "adventure",
  integrationType: "widget",
  primaryColor: "#14B8A6",
  logoUrl: null,
  status: "active",
  documentsStatus: "completed",
  agreementSigned: true,
  w9Signed: true,
  directDepositSigned: true,
  documentsSentAt: "2024-03-10T00:00:00Z",
  documentsCompletedAt: "2024-03-12T00:00:00Z",
  approvedAt: "2024-03-15T00:00:00Z",
  createdAt: "2024-03-01T00:00:00Z",
  updatedAt: "2024-12-20T00:00:00Z",
  policyCount: 512,
  totalRevenue: 45200,
  totalCommission: 22600,
  currentTier: "Gold",
  tierOverride: false,
  tierOverrideReason: null,
  monthlyVolume: 3200,
}

const mockRecentPolicies: RecentPolicy[] = [
  { id: "pol1", policyNumber: "POL-2024-1234", eventName: "Mountain Biking Tour", premium: 85.00, commission: 42.50, status: "active", createdAt: "2024-12-20T00:00:00Z" },
  { id: "pol2", policyNumber: "POL-2024-1233", eventName: "Rock Climbing Session", premium: 65.00, commission: 32.50, status: "active", createdAt: "2024-12-19T00:00:00Z" },
  { id: "pol3", policyNumber: "POL-2024-1232", eventName: "Kayaking Adventure", premium: 95.00, commission: 47.50, status: "active", createdAt: "2024-12-18T00:00:00Z" },
  { id: "pol4", policyNumber: "POL-2024-1231", eventName: "Hiking Expedition", premium: 55.00, commission: 27.50, status: "expired", createdAt: "2024-12-15T00:00:00Z" },
  { id: "pol5", policyNumber: "POL-2024-1230", eventName: "Camping Trip", premium: 45.00, commission: 22.50, status: "active", createdAt: "2024-12-14T00:00:00Z" },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  documents_sent: { label: "Documents Sent", color: "bg-blue-100 text-blue-700", icon: FileText },
  documents_pending: { label: "Documents Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Clock },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700", icon: XCircle },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [partner, setPartner] = useState<PartnerDetail | null>(null)
  const [recentPolicies, setRecentPolicies] = useState<RecentPolicy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPartnerDetails()
  }, [resolvedParams.id])

  async function fetchPartnerDetails() {
    try {
      const [partnerRes, policiesRes] = await Promise.all([
        fetch(`/api/admin/partners/${resolvedParams.id}`),
        fetch(`/api/admin/partners/${resolvedParams.id}/policies?limit=5`),
      ])

      if (partnerRes.ok) {
        const partnerData = await partnerRes.json()
        setPartner(partnerData.data || { ...mockPartner, id: resolvedParams.id })
      } else {
        setPartner({ ...mockPartner, id: resolvedParams.id })
      }

      if (policiesRes.ok) {
        const policiesData = await policiesRes.json()
        setRecentPolicies(policiesData.data || mockRecentPolicies)
      } else {
        setRecentPolicies(mockRecentPolicies)
      }
    } catch (err) {
      console.error("Error fetching partner:", err)
      setPartner({ ...mockPartner, id: resolvedParams.id })
      setRecentPolicies(mockRecentPolicies)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!partner) return

    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setPartner({ ...partner, status: newStatus })
      }
    } catch (err) {
      console.error("Error updating status:", err)
      // Update locally for demo
      setPartner({ ...partner, status: newStatus })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-32" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Partner not found</p>
          <Link
            href="/admin/partners"
            className="inline-flex items-center gap-2 mt-4 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to partners
          </Link>
        </div>
      </div>
    )
  }

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
        <Link
          href="/admin/partners"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to partners
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: partner.primaryColor || "#8B5CF6" }}
            >
              {partner.businessName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{partner.businessName}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
                {partner.tierOverride && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <AlertTriangle className="w-3 h-3" />
                    Tier Override
                  </span>
                )}
              </div>
              <p className="text-slate-600 mt-1">{partner.contactName} • {partner.businessType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {partner.status === "active" && (
              <button
                onClick={() => handleStatusChange("suspended")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Suspend
              </button>
            )}
            {partner.status === "suspended" && (
              <button
                onClick={() => handleStatusChange("active")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reactivate
              </button>
            )}
            {partner.status === "pending" && (
              <button
                onClick={() => handleStatusChange("active")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
            )}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 font-medium rounded-lg hover:bg-violet-200 transition-colors">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{partner.policyCount.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Total Policies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(partner.totalRevenue)}</p>
          <p className="text-sm text-slate-500">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(partner.totalCommission)}</p>
          <p className="text-sm text-slate-500">Total Commission</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{partner.currentTier || "—"}</p>
          <p className="text-sm text-slate-500">Current Tier</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Contact Name</p>
                <p className="font-medium text-slate-900">{partner.contactName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <a href={`mailto:${partner.contactEmail}`} className="font-medium text-violet-600 hover:text-violet-700">
                  {partner.contactEmail}
                </a>
              </div>
            </div>
            {partner.contactPhone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">{partner.contactPhone}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Documents Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">Documents</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-700">Partner Agreement</span>
              {partner.agreementSigned ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-700">W-9 Form</span>
              {partner.w9Signed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-700">Direct Deposit</span>
              {partner.directDepositSigned ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">Timeline</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <div className="flex-1">
                <p className="text-sm text-slate-700">Partner Created</p>
                <p className="text-xs text-slate-500">{formatDate(partner.createdAt)}</p>
              </div>
            </div>
            {partner.documentsSentAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Documents Sent</p>
                  <p className="text-xs text-slate-500">{formatDate(partner.documentsSentAt)}</p>
                </div>
              </div>
            )}
            {partner.documentsCompletedAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Documents Completed</p>
                  <p className="text-xs text-slate-500">{formatDate(partner.documentsCompletedAt)}</p>
                </div>
              </div>
            )}
            {partner.approvedAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Partner Approved</p>
                  <p className="text-xs text-slate-500">{formatDate(partner.approvedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Policies</h2>
          <Link
            href={`/admin/policies?partnerId=${partner.id}`}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-medium">Policy #</th>
                <th className="pb-3 font-medium">Event</th>
                <th className="pb-3 font-medium">Premium</th>
                <th className="pb-3 font-medium">Commission</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPolicies.map((policy) => (
                <tr key={policy.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <span className="font-mono text-sm text-violet-600">{policy.policyNumber}</span>
                  </td>
                  <td className="py-3 text-sm text-slate-900">{policy.eventName}</td>
                  <td className="py-3 text-sm font-medium text-slate-900">{formatCurrency(policy.premium)}</td>
                  <td className="py-3 text-sm text-green-600">{formatCurrency(policy.commission)}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      policy.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-500">{formatDate(policy.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
