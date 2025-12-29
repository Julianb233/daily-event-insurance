"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ChevronDown,
  Download,
  Send,
  Calendar,
  Building2,
} from "lucide-react"

interface Payout {
  id: string
  partnerId: string
  partnerName: string
  yearMonth: string
  tierAtPayout: string
  commissionRate: number
  totalPolicies: number
  totalParticipants: number
  grossRevenue: number
  commissionAmount: number
  bonusAmount: number
  status: "pending" | "processing" | "paid" | "failed"
  paidAt: string | null
  paymentReference: string | null
  createdAt: string
}

// Mock data
const mockPayouts: Payout[] = [
  { id: "1", partnerId: "p1", partnerName: "Adventure Sports Inc", yearMonth: "2024-12", tierAtPayout: "Gold", commissionRate: 0.50, totalPolicies: 87, totalParticipants: 2450, grossRevenue: 9040.00, commissionAmount: 4520.00, bonusAmount: 0, status: "pending", paidAt: null, paymentReference: null, createdAt: "2024-12-16" },
  { id: "2", partnerId: "p2", partnerName: "Mountain Climbers Co", yearMonth: "2024-12", tierAtPayout: "Gold", commissionRate: 0.50, totalPolicies: 72, totalParticipants: 1890, grossRevenue: 7781.00, commissionAmount: 3890.50, bonusAmount: 0, status: "pending", paidAt: null, paymentReference: null, createdAt: "2024-12-16" },
  { id: "3", partnerId: "p3", partnerName: "Urban Gym Network", yearMonth: "2024-12", tierAtPayout: "Silver", commissionRate: 0.45, totalPolicies: 45, totalParticipants: 1350, grossRevenue: 4766.67, commissionAmount: 2145.00, bonusAmount: 0, status: "processing", paidAt: null, paymentReference: null, createdAt: "2024-12-16" },
  { id: "4", partnerId: "p1", partnerName: "Adventure Sports Inc", yearMonth: "2024-11", tierAtPayout: "Gold", commissionRate: 0.50, totalPolicies: 78, totalParticipants: 2100, grossRevenue: 7960.00, commissionAmount: 3980.00, bonusAmount: 0, status: "paid", paidAt: "2024-12-03", paymentReference: "ACH-2024-12-001", createdAt: "2024-12-01" },
  { id: "5", partnerId: "p2", partnerName: "Mountain Climbers Co", yearMonth: "2024-11", tierAtPayout: "Gold", commissionRate: 0.50, totalPolicies: 68, totalParticipants: 1780, grossRevenue: 7120.00, commissionAmount: 3560.00, bonusAmount: 0, status: "paid", paidAt: "2024-12-03", paymentReference: "ACH-2024-12-002", createdAt: "2024-12-01" },
  { id: "6", partnerId: "p5", partnerName: "Summit Fitness", yearMonth: "2024-11", tierAtPayout: "Bronze", commissionRate: 0.40, totalPolicies: 28, totalParticipants: 840, grossRevenue: 3075.00, commissionAmount: 1230.00, bonusAmount: 0, status: "paid", paidAt: "2024-12-03", paymentReference: "ACH-2024-12-003", createdAt: "2024-12-01" },
]

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: Send },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: Clock },
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

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchPayouts()
  }, [])

  async function fetchPayouts() {
    try {
      const response = await fetch("/api/admin/payouts")
      if (!response.ok) throw new Error("Failed to fetch payouts")
      const result = await response.json()
      setPayouts(result.data || mockPayouts)
    } catch (err) {
      console.error("Error fetching payouts:", err)
      setPayouts(mockPayouts)
    } finally {
      setIsLoading(false)
    }
  }

  async function processPayout(payoutId: string) {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "processing" }),
      })
      if (!response.ok) throw new Error("Failed to process payout")
      setPayouts(payouts.map(p =>
        p.id === payoutId ? { ...p, status: "processing" as const } : p
      ))
    } catch (err) {
      console.error("Error processing payout:", err)
      // For demo, still update locally
      setPayouts(payouts.map(p =>
        p.id === payoutId ? { ...p, status: "processing" as const } : p
      ))
    }
  }

  async function markAsPaid(payoutId: string) {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      })
      if (!response.ok) throw new Error("Failed to mark payout as paid")
      setPayouts(payouts.map(p =>
        p.id === payoutId ? { ...p, status: "paid" as const, paidAt: new Date().toISOString() } : p
      ))
    } catch (err) {
      console.error("Error marking payout as paid:", err)
      setPayouts(payouts.map(p =>
        p.id === payoutId ? { ...p, status: "paid" as const, paidAt: new Date().toISOString() } : p
      ))
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingTotal = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.commissionAmount, 0)
  const processingTotal = payouts.filter(p => p.status === "processing").reduce((sum, p) => sum + p.commissionAmount, 0)
  const paidTotal = payouts.filter(p => p.status === "paid").reduce((sum, p) => sum + p.commissionAmount, 0)

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
              <div key={i} className="h-20 bg-slate-200 rounded-xl" />
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Payouts</h1>
          <p className="text-slate-600 mt-1">Manage partner commission payouts</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
          <Download className="w-5 h-5" />
          Export
        </button>
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
            <span className="text-sm font-medium text-slate-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(pendingTotal)}</p>
          <p className="text-sm text-slate-500 mt-1">{payouts.filter(p => p.status === "pending").length} payouts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Processing</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(processingTotal)}</p>
          <p className="text-sm text-slate-500 mt-1">{payouts.filter(p => p.status === "processing").length} payouts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Paid (This Month)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(paidTotal)}</p>
          <p className="text-sm text-slate-500 mt-1">{payouts.filter(p => p.status === "paid").length} payouts</p>
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
            placeholder="Search partners..."
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
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Payouts List */}
      <div className="space-y-4">
        {filteredPayouts.map((payout, index) => {
          const status = statusConfig[payout.status]
          const StatusIcon = status.icon
          return (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.03 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold">
                    {payout.partnerName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{payout.partnerName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {payout.yearMonth}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        payout.tierAtPayout === "Gold" ? "bg-amber-100 text-amber-700" :
                        payout.tierAtPayout === "Silver" ? "bg-slate-100 text-slate-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {payout.tierAtPayout}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Policies</p>
                    <p className="font-semibold text-slate-900">{payout.totalPolicies}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Participants</p>
                    <p className="font-semibold text-slate-900">{payout.totalParticipants.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Commission</p>
                    <p className="font-bold text-slate-900">{formatCurrency(payout.commissionAmount)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                  {payout.status === "pending" && (
                    <button
                      onClick={() => processPayout(payout.id)}
                      className="px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all"
                    >
                      Process
                    </button>
                  )}
                  {payout.status === "processing" && (
                    <button
                      onClick={() => markAsPaid(payout.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-green-500/25 hover:shadow-xl transition-all"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {filteredPayouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No payouts found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
