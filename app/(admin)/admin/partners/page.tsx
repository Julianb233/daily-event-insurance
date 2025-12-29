"use client"

import { Suspense, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import {
  Building2,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Pencil,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react"

interface Partner {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string | null
  website: string | null
  status: "pending" | "active" | "suspended" | "documents_sent"
  currentTier: string | null
  tierOverride: boolean
  monthlyVolume: number
  totalRevenue: number
  policyCount: number
  createdAt: string
}

interface CommissionTier {
  id: string
  tierName: string
  commissionRate: string
}

// Mock data
const mockPartners: Partner[] = [
  { id: "1", businessName: "Adventure Sports Inc", contactName: "John Smith", email: "john@adventuresports.com", phone: "(555) 123-4567", website: "adventuresports.com", status: "active", currentTier: "Gold", tierOverride: false, monthlyVolume: 3200, totalRevenue: 45200, policyCount: 512, createdAt: "2024-03-15" },
  { id: "2", businessName: "Mountain Climbers Co", contactName: "Sarah Johnson", email: "sarah@mountainclimbers.co", phone: "(555) 234-5678", website: "mountainclimbers.co", status: "active", currentTier: "Gold", tierOverride: true, monthlyVolume: 2100, totalRevenue: 38900, policyCount: 423, createdAt: "2024-04-02" },
  { id: "3", businessName: "Urban Gym Network", contactName: "Mike Davis", email: "mike@urbangym.net", phone: "(555) 345-6789", website: "urbangym.net", status: "active", currentTier: "Silver", tierOverride: false, monthlyVolume: 1450, totalRevenue: 32100, policyCount: 378, createdAt: "2024-05-10" },
  { id: "4", businessName: "Outdoor Adventures LLC", contactName: "Emily Brown", email: "emily@outdooradv.com", phone: null, website: "outdooradv.com", status: "pending", currentTier: null, tierOverride: false, monthlyVolume: 0, totalRevenue: 0, policyCount: 0, createdAt: "2024-12-20" },
  { id: "5", businessName: "Summit Fitness", contactName: "Chris Wilson", email: "chris@summitfit.com", phone: "(555) 456-7890", website: null, status: "active", currentTier: "Bronze", tierOverride: false, monthlyVolume: 680, totalRevenue: 24500, policyCount: 289, createdAt: "2024-06-18" },
  { id: "6", businessName: "Peak Performance Gym", contactName: "Lisa Chen", email: "lisa@peakgym.com", phone: "(555) 567-8901", website: "peakgym.com", status: "documents_sent", currentTier: null, tierOverride: false, monthlyVolume: 0, totalRevenue: 0, policyCount: 0, createdAt: "2024-12-22" },
  { id: "7", businessName: "Extreme Events", contactName: "Tom Anderson", email: "tom@extremeevents.io", phone: "(555) 678-9012", website: "extremeevents.io", status: "suspended", currentTier: "Silver", tierOverride: false, monthlyVolume: 1200, totalRevenue: 18700, policyCount: 156, createdAt: "2024-02-28" },
]

const mockTiers: CommissionTier[] = [
  { id: "tier_1", tierName: "Bronze", commissionRate: "0.4000" },
  { id: "tier_2", tierName: "Silver", commissionRate: "0.4500" },
  { id: "tier_3", tierName: "Gold", commissionRate: "0.5000" },
  { id: "tier_4", tierName: "Platinum", commissionRate: "0.5500" },
]

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  documents_sent: { label: "Documents Sent", color: "bg-blue-100 text-blue-700", icon: Mail },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700", icon: XCircle },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function PartnersPageContent() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status") || "all"

  const [partners, setPartners] = useState<Partner[]>([])
  const [tiers, setTiers] = useState<CommissionTier[]>(mockTiers)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showTierOverride, setShowTierOverride] = useState(false)
  const [overrideTierId, setOverrideTierId] = useState("")
  const [overrideReason, setOverrideReason] = useState("")

  useEffect(() => {
    fetchPartners()
    fetchTiers()
  }, [])

  async function fetchPartners() {
    try {
      const response = await fetch("/api/admin/partners")
      if (!response.ok) throw new Error("Failed to fetch partners")
      const result = await response.json()
      setPartners(result.data || mockPartners)
    } catch (err) {
      console.error("Error fetching partners:", err)
      setPartners(mockPartners)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchTiers() {
    try {
      const response = await fetch("/api/admin/commission-tiers?activeOnly=true")
      if (!response.ok) throw new Error("Failed to fetch tiers")
      const result = await response.json()
      setTiers(result.data || mockTiers)
    } catch (err) {
      console.error("Error fetching tiers:", err)
    }
  }

  async function handleTierOverride() {
    if (!selectedPartner || !overrideTierId) return

    try {
      const response = await fetch(`/api/admin/partners/${selectedPartner.id}/tier-override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: overrideTierId,
          reason: overrideReason,
        }),
      })

      if (!response.ok) throw new Error("Failed to set tier override")

      // Update local state
      const tier = tiers.find(t => t.id === overrideTierId)
      setPartners(partners.map(p =>
        p.id === selectedPartner.id
          ? { ...p, currentTier: tier?.tierName || p.currentTier, tierOverride: true }
          : p
      ))
    } catch (err) {
      console.error("Error setting tier override:", err)
      // For demo, still update locally
      const tier = tiers.find(t => t.id === overrideTierId)
      setPartners(partners.map(p =>
        p.id === selectedPartner.id
          ? { ...p, currentTier: tier?.tierName || p.currentTier, tierOverride: true }
          : p
      ))
    } finally {
      setShowTierOverride(false)
      setOverrideTierId("")
      setOverrideReason("")
      setSelectedPartner(null)
    }
  }

  async function handleStatusChange(partnerId: string, newStatus: Partner["status"]) {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setPartners(partners.map(p =>
        p.id === partnerId ? { ...p, status: newStatus } : p
      ))
    } catch (err) {
      console.error("Error updating status:", err)
      // For demo, still update locally
      setPartners(partners.map(p =>
        p.id === partnerId ? { ...p, status: newStatus } : p
      ))
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-12 bg-slate-200 rounded-xl" />
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
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Partners</h1>
        <p className="text-slate-600 mt-1">Manage partner accounts and tier assignments</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="documents_sent">Documents Sent</option>
            <option value="suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Partners List */}
      <div className="space-y-4">
        {filteredPartners.map((partner, index) => {
          const status = statusConfig[partner.status]
          const StatusIcon = status.icon
          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.03 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Partner Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {partner.businessName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{partner.businessName}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      {partner.tierOverride && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <AlertTriangle className="w-3 h-3" />
                          Tier Override
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {partner.email}
                      </span>
                      {partner.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {partner.phone}
                        </span>
                      )}
                      {partner.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {partner.website}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                  <div className="bg-slate-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-slate-500 mb-0.5">Tier</div>
                    <div className="font-semibold text-slate-900">{partner.currentTier || "—"}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-slate-500 mb-0.5">Volume</div>
                    <div className="font-semibold text-slate-900">{partner.monthlyVolume.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-slate-500 mb-0.5">Revenue</div>
                    <div className="font-semibold text-slate-900">{formatCurrency(partner.totalRevenue)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-slate-500 mb-0.5">Policies</div>
                    <div className="font-semibold text-slate-900">{partner.policyCount}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/partners/${partner.id}`}
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedPartner(partner)
                      setShowTierOverride(true)
                    }}
                    className="p-2.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-600 transition-colors"
                    title="Set tier override"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  {partner.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(partner.id, "active")}
                      className="p-2.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                      title="Approve partner"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  {partner.status === "active" && (
                    <button
                      onClick={() => handleStatusChange(partner.id, "suspended")}
                      className="p-2.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
                      title="Suspend partner"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  {partner.status === "suspended" && (
                    <button
                      onClick={() => handleStatusChange(partner.id, "active")}
                      className="p-2.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                      title="Reactivate partner"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {filteredPartners.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No partners found matching your criteria</p>
          </motion.div>
        )}
      </div>

      {/* Tier Override Modal */}
      <AnimatePresence>
        {showTierOverride && selectedPartner && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowTierOverride(false)
                setSelectedPartner(null)
              }}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-white rounded-2xl shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Set Tier Override</h2>
                  <button
                    onClick={() => {
                      setShowTierOverride(false)
                      setSelectedPartner(null)
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-violet-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-violet-700">
                    <strong>{selectedPartner.businessName}</strong>
                  </p>
                  <p className="text-sm text-violet-600 mt-1">
                    Current tier: {selectedPartner.currentTier || "None"} (Volume: {selectedPartner.monthlyVolume.toLocaleString()})
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Override Tier
                    </label>
                    <select
                      value={overrideTierId}
                      onChange={(e) => setOverrideTierId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white"
                    >
                      <option value="">Select a tier...</option>
                      {tiers.map(tier => (
                        <option key={tier.id} value={tier.id}>
                          {tier.tierName} ({(parseFloat(tier.commissionRate) * 100).toFixed(0)}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Reason (optional)
                    </label>
                    <textarea
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g., Strategic partnership agreement"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        This will override the automatically calculated tier based on volume. The override will remain until manually removed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowTierOverride(false)
                      setSelectedPartner(null)
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTierOverride}
                    disabled={!overrideTierId}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Override
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function PartnersLoadingFallback() {
  return (
    <div className="p-6 lg:p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-12 bg-slate-200 rounded-xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PartnersPage() {
  return (
    <Suspense fallback={<PartnersLoadingFallback />}>
      <PartnersPageContent />
    </Suspense>
  )
}
