"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  FileText,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  RefreshCw,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClaimsTracker } from "@/components/claims/ClaimsTracker"
import { cn } from "@/lib/utils"
import type { Claim, ClaimStatus, ClaimsListResponse, DocumentType } from "@/types/claims"

// Status badge configuration
const statusConfig: Record<ClaimStatus, { label: string; color: string; bgColor: string }> = {
  submitted: { label: 'Submitted', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  under_review: { label: 'Under Review', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  additional_info_needed: { label: 'Info Needed', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-100' },
  denied: { label: 'Denied', color: 'text-red-600', bgColor: 'bg-red-100' },
  paid: { label: 'Paid', color: 'text-teal-600', bgColor: 'bg-teal-100' },
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch claims
  const fetchClaims = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      const response = await fetch(`/api/claims?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch claims')
      }

      const data = await response.json()
      if (data.success && data.data) {
        setClaims(data.data.claims || [])
        // Auto-select first claim if none selected
        if (!selectedClaim && data.data.claims.length > 0) {
          setSelectedClaim(data.data.claims[0])
        }
      }
    } catch (err) {
      console.error('Error fetching claims:', err)
      setError('Failed to load claims. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  // Handle document upload
  const handleUploadDocument = useCallback(async (file: File, type: DocumentType) => {
    // In production, this would upload to storage and update the claim
    console.log('Uploading document:', file.name, 'Type:', type)
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Refresh claims after upload
    await fetchClaims()
  }, [fetchClaims])

  // Handle sending message
  const handleSendMessage = useCallback(async (content: string) => {
    // In production, this would send the message via API
    console.log('Sending message:', content)
    // Simulate send delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Refresh claims after sending
    await fetchClaims()
  }, [fetchClaims])

  // Filter claims by search query
  const filteredClaims = claims.filter(claim => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      claim.claimNumber.toLowerCase().includes(query) ||
      claim.title.toLowerCase().includes(query) ||
      claim.policyNumber.toLowerCase().includes(query)
    )
  })

  // Calculate statistics
  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'submitted' || c.status === 'under_review').length,
    approved: claims.filter(c => c.status === 'approved').length,
    paid: claims.filter(c => c.status === 'paid').length,
    totalClaimed: claims.reduce((sum, c) => sum + c.claimedAmount, 0),
    totalPaid: claims.reduce((sum, c) => sum + (c.paidAmount || 0), 0),
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading && claims.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl" />
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
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Claims</h1>
          <p className="text-slate-600 mt-1">Track and manage your insurance claims</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchClaims}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/partner/claims/new">
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Claims</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.approved}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-lg border border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalPaid)}</p>
              <p className="text-xs text-slate-500">Total Paid</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-xl p-4 shadow-lg border border-slate-100 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by claim number, title, or policy..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-slate-100 transition-colors"
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">
                {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                <button
                  onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                    statusFilter === 'all' ? "text-teal-600 font-medium" : "text-slate-700"
                  )}
                >
                  All Status
                </button>
                {(Object.keys(statusConfig) as ClaimStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilters(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors",
                      statusFilter === status ? "text-teal-600 font-medium" : "text-slate-700"
                    )}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchClaims} className="ml-auto">
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Claims List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Your Claims</h3>
              <p className="text-xs text-slate-500 mt-1">
                {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredClaims.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No claims found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Submit a new claim to get started'}
                  </p>
                </div>
              ) : (
                filteredClaims.map((claim) => {
                  const status = statusConfig[claim.status]
                  return (
                    <button
                      key={claim.id}
                      onClick={() => setSelectedClaim(claim)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-slate-50 transition-colors",
                        selectedClaim?.id === claim.id && "bg-teal-50 border-l-4 border-teal-500"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-500">{claim.claimNumber}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.bgColor, status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-900 text-sm truncate">{claim.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-slate-700">
                          {formatCurrency(claim.claimedAmount)}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(claim.reportedDate)}</span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Claim Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="lg:col-span-2"
        >
          {selectedClaim ? (
            <ClaimsTracker
              claim={selectedClaim}
              onUploadDocument={handleUploadDocument}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Claim</h3>
              <p className="text-slate-600 mb-6">
                Choose a claim from the list to view details, upload documents, and communicate with your claims team.
              </p>
              <Button asChild>
                <Link href="/partner/claims/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Claim
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
