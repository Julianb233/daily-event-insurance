"use client"

import { useEffect, useState, use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Download,
  MessageSquare,
  Plus,
} from "lucide-react"

interface ClaimDetail {
  id: string
  claimNumber: string
  policyId: string
  policyNumber: string
  partnerId: string
  partnerName: string
  claimType: string
  incidentDate: string
  incidentLocation: string | null
  incidentDescription: string
  claimantName: string
  claimantEmail: string | null
  claimantPhone: string | null
  claimAmount: number | null
  approvedAmount: number | null
  payoutAmount: number | null
  deductibleAmount: number | null
  status: string
  assignedTo: string | null
  reviewNotes: string | null
  denialReason: string | null
  submittedAt: string
  reviewedAt: string | null
  approvedAt: string | null
  deniedAt: string | null
  paidAt: string | null
  closedAt: string | null
  createdAt: string
  documents: ClaimDocument[]
}

interface ClaimDocument {
  id: string
  documentType: string
  fileName: string
  fileUrl?: string
  fileSize?: number
  description: string | null
  uploadedBy?: string
  createdAt?: string
}

const mockClaim: ClaimDetail = {
  id: "1",
  claimNumber: "CLM-2024-0042",
  policyId: "pol1",
  policyNumber: "POL-2024-1234",
  partnerId: "p1",
  partnerName: "Adventure Sports Inc",
  claimType: "equipment_loss",
  incidentDate: "2024-12-18T00:00:00Z",
  incidentLocation: "Mountain Trail, Colorado",
  incidentDescription: "Rental kayak was damaged during a guided tour. The kayak hit submerged rocks while navigating rapids, resulting in a significant crack in the hull. The participant reported the damage immediately after the tour concluded.",
  claimantName: "James Wilson",
  claimantEmail: "james.wilson@email.com",
  claimantPhone: "(555) 123-4567",
  claimAmount: 450.00,
  approvedAmount: null,
  payoutAmount: 0,
  deductibleAmount: 0,
  status: "submitted",
  assignedTo: null,
  reviewNotes: null,
  denialReason: null,
  submittedAt: "2024-12-20T00:00:00Z",
  reviewedAt: null,
  approvedAt: null,
  deniedAt: null,
  paidAt: null,
  closedAt: null,
  createdAt: "2024-12-20T00:00:00Z",
  documents: [
    { id: "doc1", documentType: "photo", fileName: "damage-photo-1.jpg", description: "Front view of kayak damage" },
    { id: "doc2", documentType: "photo", fileName: "damage-photo-2.jpg", description: "Close-up of hull crack" },
    { id: "doc3", documentType: "receipt", fileName: "purchase-receipt.pdf", description: "Original equipment purchase receipt" },
  ],
}

const statusConfig: Record<string, { label: string; color: string; icon: any; bgColor: string }> = {
  submitted: { label: "Submitted", color: "text-amber-700", bgColor: "bg-amber-100", icon: Clock },
  under_review: { label: "Under Review", color: "text-blue-700", bgColor: "bg-blue-100", icon: Eye },
  additional_info_requested: { label: "Info Requested", color: "text-orange-700", bgColor: "bg-orange-100", icon: MessageSquare },
  approved: { label: "Approved", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 },
  denied: { label: "Denied", color: "text-red-700", bgColor: "bg-red-100", icon: XCircle },
  paid: { label: "Paid", color: "text-emerald-700", bgColor: "bg-emerald-100", icon: DollarSign },
  closed: { label: "Closed", color: "text-slate-700", bgColor: "bg-slate-100", icon: CheckCircle2 },
  disputed: { label: "Disputed", color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
}

const claimTypeLabels: Record<string, string> = {
  injury: "Personal Injury",
  property_damage: "Property Damage",
  liability: "Liability",
  equipment_loss: "Equipment Damage",
  cancellation: "Cancellation",
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return "—"
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

function formatDateTime(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [claim, setClaim] = useState<ClaimDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [approvedAmount, setApprovedAmount] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")
  const [denialReason, setDenialReason] = useState("")

  useEffect(() => {
    fetchClaimDetails()
  }, [resolvedParams.id])

  async function fetchClaimDetails() {
    try {
      const response = await fetch(`/api/admin/claims/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setClaim(data.data || { ...mockClaim, id: resolvedParams.id })
        if (data.data?.reviewNotes) setReviewNotes(data.data.reviewNotes)
        if (data.data?.approvedAmount) setApprovedAmount(String(data.data.approvedAmount))
      } else {
        setClaim({ ...mockClaim, id: resolvedParams.id })
      }
    } catch (err) {
      console.error("Error fetching claim:", err)
      setClaim({ ...mockClaim, id: resolvedParams.id })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(newStatus: string, additionalData?: Record<string, any>) {
    if (!claim) return

    const payload: Record<string, any> = { status: newStatus, ...additionalData }

    if (newStatus === "under_review" && reviewNotes) {
      payload.reviewNotes = reviewNotes
    }

    if (newStatus === "approved" && approvedAmount) {
      payload.approvedAmount = parseFloat(approvedAmount)
      payload.reviewNotes = reviewNotes
    }

    if (newStatus === "denied") {
      payload.denialReason = denialReason
      payload.reviewNotes = reviewNotes
    }

    try {
      const response = await fetch(`/api/admin/claims/${claim.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setClaim({
          ...claim,
          ...data.data,
          status: newStatus,
        })
      }
    } catch (err) {
      console.error("Error updating claim:", err)
      // Update locally for demo
      setClaim({ ...claim, status: newStatus })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-32" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Claim not found</p>
          <Link
            href="/admin/claims"
            className="inline-flex items-center gap-2 mt-4 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to claims
          </Link>
        </div>
      </div>
    )
  }

  const status = statusConfig[claim.status] || statusConfig.submitted
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
          href="/admin/claims"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to claims
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">{claim.claimNumber}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
            </div>
            <p className="text-slate-600 mt-1">
              {claimTypeLabels[claim.claimType] || claim.claimType} • Submitted {formatDate(claim.submittedAt)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Incident Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Incident Date</p>
                  <p className="font-medium text-slate-900">{formatDate(claim.incidentDate)}</p>
                </div>
              </div>
              {claim.incidentLocation && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">{claim.incidentLocation}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500 mb-2">Description</p>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 leading-relaxed">{claim.incidentDescription}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Claimant Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Claimant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">{claim.claimantName}</p>
                </div>
              </div>
              {claim.claimantEmail && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href={`mailto:${claim.claimantEmail}`} className="font-medium text-violet-600 hover:text-violet-700">
                      {claim.claimantEmail}
                    </a>
                  </div>
                </div>
              )}
              {claim.claimantPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{claim.claimantPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Supporting Documents</h2>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 text-sm font-medium rounded-lg hover:bg-violet-200 transition-colors">
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>
            {claim.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {claim.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
                      <p className="text-xs text-slate-500">{doc.description || doc.documentType}</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-violet-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No documents uploaded</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Claimed Amount</span>
                <span className="font-bold text-slate-900">{formatCurrency(claim.claimAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Approved Amount</span>
                <span className="font-bold text-green-600">{formatCurrency(claim.approvedAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Deductible</span>
                <span className="font-medium text-slate-700">{formatCurrency(claim.deductibleAmount)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Payout Amount</span>
                  <span className="font-bold text-lg text-emerald-600">{formatCurrency(claim.payoutAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Policy Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Policy & Partner</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Policy Number</p>
                <Link href={`/admin/policies/${claim.policyId}`} className="font-mono text-sm text-violet-600 hover:text-violet-700">
                  {claim.policyNumber}
                </Link>
              </div>
              <div>
                <p className="text-sm text-slate-500">Partner</p>
                <Link href={`/admin/partners/${claim.partnerId}`} className="font-medium text-violet-600 hover:text-violet-700">
                  {claim.partnerName}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Actions</h2>

            {claim.status === "submitted" && (
              <div className="space-y-3">
                <textarea
                  placeholder="Review notes..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                />
                <button
                  onClick={() => handleStatusChange("under_review")}
                  className="w-full px-4 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Start Review
                </button>
              </div>
            )}

            {claim.status === "under_review" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Approved Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Review Notes</label>
                  <textarea
                    placeholder="Notes..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange("approved")}
                    disabled={!approvedAmount}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter denial reason:")
                      if (reason) {
                        setDenialReason(reason)
                        handleStatusChange("denied", { denialReason: reason })
                      }
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>
            )}

            {claim.status === "approved" && (
              <button
                onClick={() => handleStatusChange("paid")}
                className="w-full px-4 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Mark as Paid
              </button>
            )}

            {(claim.status === "paid" || claim.status === "denied") && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Claim is {claim.status}</p>
              </div>
            )}
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
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Submitted</p>
                  <p className="text-xs text-slate-500">{formatDateTime(claim.submittedAt)}</p>
                </div>
              </div>
              {claim.reviewedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Review Started</p>
                    <p className="text-xs text-slate-500">{formatDateTime(claim.reviewedAt)}</p>
                  </div>
                </div>
              )}
              {claim.approvedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Approved</p>
                    <p className="text-xs text-slate-500">{formatDateTime(claim.approvedAt)}</p>
                  </div>
                </div>
              )}
              {claim.deniedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Denied</p>
                    <p className="text-xs text-slate-500">{formatDateTime(claim.deniedAt)}</p>
                  </div>
                </div>
              )}
              {claim.paidAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">Paid</p>
                    <p className="text-xs text-slate-500">{formatDateTime(claim.paidAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
