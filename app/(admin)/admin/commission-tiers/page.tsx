"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  DollarSign,
  Users,
  ArrowUpDown,
} from "lucide-react"

interface CommissionTier {
  id: string
  tierName: string
  minVolume: number
  maxVolume: number | null
  commissionRate: string
  flatBonus: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface TierFormData {
  tierName: string
  minVolume: number
  maxVolume: number | null
  commissionRate: number
  flatBonus: number
  isActive: boolean
  sortOrder: number
}

const defaultFormData: TierFormData = {
  tierName: "",
  minVolume: 0,
  maxVolume: null,
  commissionRate: 0.4,
  flatBonus: 0,
  isActive: true,
  sortOrder: 0,
}

// Mock tiers for development
const mockTiers: CommissionTier[] = [
  { id: "tier_1", tierName: "Bronze", minVolume: 500, maxVolume: 999, commissionRate: "0.4000", flatBonus: "0", isActive: true, sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tier_2", tierName: "Silver", minVolume: 1000, maxVolume: 2499, commissionRate: "0.4500", flatBonus: "10.00", isActive: true, sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tier_3", tierName: "Gold", minVolume: 2500, maxVolume: 4999, commissionRate: "0.5000", flatBonus: "25.00", isActive: true, sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tier_4", tierName: "Platinum", minVolume: 5000, maxVolume: null, commissionRate: "0.5500", flatBonus: "50.00", isActive: true, sortOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatPercentage(rate: number | string): string {
  const num = typeof rate === "string" ? parseFloat(rate) : rate
  return `${(num * 100).toFixed(0)}%`
}

export default function CommissionTiersPage() {
  const [tiers, setTiers] = useState<CommissionTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null)
  const [formData, setFormData] = useState<TierFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchTiers()
  }, [])

  async function fetchTiers() {
    try {
      const response = await fetch("/api/admin/commission-tiers")
      if (!response.ok) throw new Error("Failed to fetch tiers")
      const result = await response.json()
      setTiers(result.data || mockTiers)
    } catch (err) {
      console.error("Error fetching tiers:", err)
      setTiers(mockTiers)
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateModal() {
    setEditingTier(null)
    setFormData({
      ...defaultFormData,
      sortOrder: tiers.length + 1,
    })
    setIsModalOpen(true)
  }

  function openEditModal(tier: CommissionTier) {
    setEditingTier(tier)
    setFormData({
      tierName: tier.tierName,
      minVolume: tier.minVolume,
      maxVolume: tier.maxVolume,
      commissionRate: parseFloat(tier.commissionRate),
      flatBonus: parseFloat(tier.flatBonus || "0"),
      isActive: tier.isActive,
      sortOrder: tier.sortOrder,
    })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTier(null)
    setFormData(defaultFormData)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingTier
        ? `/api/admin/commission-tiers/${editingTier.id}`
        : "/api/admin/commission-tiers"
      const method = editingTier ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save tier")

      await fetchTiers()
      closeModal()
    } catch (err) {
      console.error("Error saving tier:", err)
      // For demo, still update locally
      if (editingTier) {
        setTiers(tiers.map(t =>
          t.id === editingTier.id
            ? {
                ...t,
                ...formData,
                commissionRate: formData.commissionRate.toFixed(4),
                flatBonus: formData.flatBonus.toFixed(2),
                updatedAt: new Date().toISOString(),
              }
            : t
        ))
      } else {
        const newTier: CommissionTier = {
          id: `tier_${Date.now()}`,
          ...formData,
          commissionRate: formData.commissionRate.toFixed(4),
          flatBonus: formData.flatBonus.toFixed(2),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTiers([...tiers, newTier].sort((a, b) => a.sortOrder - b.sortOrder))
      }
      closeModal()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(tierId: string) {
    try {
      const response = await fetch(`/api/admin/commission-tiers/${tierId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete tier")

      setTiers(tiers.filter(t => t.id !== tierId))
    } catch (err) {
      console.error("Error deleting tier:", err)
      // For demo, still update locally
      setTiers(tiers.filter(t => t.id !== tierId))
    } finally {
      setDeleteConfirm(null)
    }
  }

  const tierColors: Record<string, string> = {
    Bronze: "from-amber-600 to-amber-700",
    Silver: "from-slate-400 to-slate-500",
    Gold: "from-yellow-500 to-yellow-600",
    Platinum: "from-violet-500 to-violet-600",
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Commission Tiers</h1>
          <p className="text-slate-600 mt-1">Manage commission rates and volume thresholds</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Tier
        </button>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-900">Commission Tier Structure</p>
            <p className="text-sm text-violet-700 mt-1">
              Partners are automatically assigned to tiers based on their monthly participant volume.
              Bronze tier starts at 500 minimum participants. Commission rates include a percentage of
              premium plus an optional flat bonus per policy.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tiers List */}
      <div className="space-y-4">
        {tiers
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Tier Badge */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tierColors[tier.tierName] || 'from-slate-400 to-slate-500'} flex items-center justify-center shadow-lg`}>
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{tier.tierName}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      tier.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {tier.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <Users className="w-3.5 h-3.5" />
                      Volume Range
                    </div>
                    <p className="font-semibold text-slate-900">
                      {tier.minVolume.toLocaleString()} - {tier.maxVolume ? tier.maxVolume.toLocaleString() : "Unlimited"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Commission Rate
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatPercentage(tier.commissionRate)}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <Plus className="w-3.5 h-3.5" />
                      Flat Bonus
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(tier.flatBonus)}/policy
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      Sort Order
                    </div>
                    <p className="font-semibold text-slate-900">
                      {tier.sortOrder}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(tier)}
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Edit tier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === tier.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(tier.id)}
                        className="p-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Confirm delete"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(tier.id)}
                      className="p-2.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
                      title="Delete tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 bg-white rounded-2xl shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingTier ? "Edit Commission Tier" : "Create Commission Tier"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Tier Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tier Name
                    </label>
                    <input
                      type="text"
                      value={formData.tierName}
                      onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                      placeholder="e.g., Bronze, Silver, Gold"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Volume Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Min Volume
                      </label>
                      <input
                        type="number"
                        value={formData.minVolume}
                        onChange={(e) => setFormData({ ...formData, minVolume: parseInt(e.target.value) || 0 })}
                        min={0}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Max Volume
                        <span className="text-slate-400 font-normal ml-1">(blank = unlimited)</span>
                      </label>
                      <input
                        type="number"
                        value={formData.maxVolume ?? ""}
                        onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value ? parseInt(e.target.value) : null })}
                        min={0}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Commission Rate */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Commission Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.commissionRate * 100}
                        onChange={(e) => setFormData({ ...formData, commissionRate: (parseFloat(e.target.value) || 0) / 100 })}
                        min={0}
                        max={100}
                        step={0.5}
                        className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Percentage of premium paid as commission
                    </p>
                  </div>

                  {/* Flat Bonus */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Flat Bonus per Policy
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input
                        type="number"
                        value={formData.flatBonus}
                        onChange={(e) => setFormData({ ...formData, flatBonus: parseFloat(e.target.value) || 0 })}
                        min={0}
                        step={0.01}
                        className="w-full px-4 py-2.5 pl-8 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Additional flat amount per policy sold
                    </p>
                  </div>

                  {/* Sort Order & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        min={0}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Status
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                          formData.isActive
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        {formData.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : editingTier ? "Update Tier" : "Create Tier"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
