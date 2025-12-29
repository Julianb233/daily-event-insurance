"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  ExternalLink,
} from "lucide-react"

interface Claim {
  id: string
  claimNumber: string
  policyNumber: string
  partnerName: string
  claimantName: string
  incidentDate: string
  incidentType: string
  claimAmount: number
  status: "pending" | "under_review" | "approved" | "denied" | "paid"
  description: string
  createdAt: string
}

// Mock data
const mockClaims: Claim[] = [
  { id: "1", claimNumber: "CLM-2024-0042", policyNumber: "POL-2024-1234", partnerName: "Adventure Sports Inc", claimantName: "James Wilson", incidentDate: "2024-12-18", incidentType: "Equipment Damage", claimAmount: 450.00, status: "pending", description: "Damaged rental kayak during guided tour", createdAt: "2024-12-20" },
  { id: "2", claimNumber: "CLM-2024-0041", policyNumber: "POL-2024-1198", partnerName: "Mountain Climbers Co", claimantName: "Sarah Martinez", incidentDate: "2024-12-15", incidentType: "Personal Injury", claimAmount: 1250.00, status: "under_review", description: "Minor ankle sprain during rock climbing session", createdAt: "2024-12-16" },
  { id: "3", claimNumber: "CLM-2024-0040", policyNumber: "POL-2024-1156", partnerName: "Urban Gym Network", claimantName: "Michael Brown", incidentDate: "2024-12-10", incidentType: "Property Damage", claimAmount: 320.00, status: "approved", description: "Locker damage from faulty lock mechanism", createdAt: "2024-12-11" },
  { id: "4", claimNumber: "CLM-2024-0039", policyNumber: "POL-2024-1089", partnerName: "Summit Fitness", claimantName: "Emily Chen", incidentDate: "2024-12-05", incidentType: "Personal Injury", claimAmount: 890.00, status: "paid", description: "Treadmill incident resulting in minor injuries", createdAt: "2024-12-06" },
  { id: "5", claimNumber: "CLM-2024-0038", policyNumber: "POL-2024-1045", partnerName: "Adventure Sports Inc", claimantName: "David Lee", incidentDate: "2024-12-01", incidentType: "Cancellation", claimAmount: 180.00, status: "denied", description: "Event cancellation claim - weather related", createdAt: "2024-12-02" },
]

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  denied: { label: "Denied", color: "bg-red-100 text-red-700", icon: XCircle },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: DollarSign },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchClaims()
  }, [])

  async function fetchClaims() {
    try {
      const response = await fetch("/api/admin/claims")
      if (!response.ok) throw new Error("Failed to fetch claims")
      const result = await response.json()
      setClaims(result.data || mockClaims)
    } catch (err) {
      console.error("Error fetching claims:", err)
      setClaims(mockClaims)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateClaimStatus(claimId: string, newStatus: Claim["status"]) {
    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error("Failed to update claim")
      setClaims(claims.map(c =>
        c.id === claimId ? { ...c, status: newStatus } : c
      ))
    } catch (err) {
      console.error("Error updating claim:", err)
      // For demo, still update locally
      setClaims(claims.map(c =>
        c.id === claimId ? { ...c, status: newStatus } : c
      ))
    }
  }

  const filteredClaims = claims.filter(claim => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = claims.filter(c => c.status === "pending").length
  const reviewCount = claims.filter(c => c.status === "under_review").length
  const totalPending = claims.filter(c => ["pending", "under_review"].includes(c.status))
    .reduce((sum, c) => sum + c.claimAmount, 0)

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Claims</h1>
        <p className="text-slate-600 mt-1">Review and manage insurance claims</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          <p className="text-sm text-slate-500 mt-1">Awaiting initial review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Under Review</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{reviewCount}</p>
          <p className="text-sm text-slate-500 mt-1">Being processed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Total Pending Value</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPending)}</p>
          <p className="text-sm text-slate-500 mt-1">Across all open claims</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
            <option value="paid">Paid</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.map((claim, index) => {
          const status = statusConfig[claim.status]
          const StatusIcon = status.icon
          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.03 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-violet-600 font-semibold">{claim.claimNumber}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{claim.claimantName}</h3>
                  <p className="text-sm text-slate-500">{claim.partnerName}</p>
                  <p className="text-sm text-slate-600 mt-2">{claim.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Incident: {formatDate(claim.incidentDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {claim.incidentType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Claim Amount</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(claim.claimAmount)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/claims/${claim.id}`}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>

                  {claim.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateClaimStatus(claim.id, "under_review")}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Start Review
                      </button>
                    </div>
                  )}

                  {claim.status === "under_review" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateClaimStatus(claim.id, "approved")}
                        className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateClaimStatus(claim.id, "denied")}
                        className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  )}

                  {claim.status === "approved" && (
                    <button
                      onClick={() => updateClaimStatus(claim.id, "paid")}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {filteredClaims.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No claims found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
