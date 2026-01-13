'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  AlertCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'

// TypeScript types
interface Claim {
  id: string
  claimNumber: string
  policyNumber: string
  claimant: {
    name: string
    email: string
    phone: string
  }
  amount: number
  status: 'pending' | 'approved' | 'denied' | 'under_review'
  filedDate: string
  description: string
  type: string
  attachments: number
}

interface ClaimsStats {
  totalClaims: number
  pendingClaims: number
  approvedClaims: number
  deniedClaims: number
  totalValue: number
  avgProcessingTime: number
}

interface ClaimsData {
  stats: ClaimsStats
  claims: Claim[]
}

// Mock data for development
const mockData: ClaimsData = {
  stats: {
    totalClaims: 234,
    pendingClaims: 47,
    approvedClaims: 156,
    deniedClaims: 31,
    totalValue: 1245780,
    avgProcessingTime: 3.2,
  },
  claims: Array.from({ length: 50 }, (_, i) => {
    const statuses: Claim['status'][] = ['pending', 'approved', 'denied', 'under_review']
    const types = ['Medical', 'Property Damage', 'Cancellation', 'Liability', 'Weather']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    return {
      id: `claim-${i + 1}`,
      claimNumber: `CLM-2025-${String(i + 1001).padStart(6, '0')}`,
      policyNumber: `POL-2025-${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
      claimant: {
        name: [
          'John Smith', 'Sarah Johnson', 'Michael Davis', 'Emily Wilson',
          'David Brown', 'Jessica Martinez', 'James Anderson', 'Maria Garcia',
          'Robert Taylor', 'Jennifer Lee', 'William Clark', 'Linda Rodriguez',
        ][Math.floor(Math.random() * 12)],
        email: 'claimant@example.com',
        phone: '(555) 123-4567',
      },
      amount: Math.floor(Math.random() * 50000) + 500,
      status,
      filedDate: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
      ).toISOString(),
      description: 'Event cancellation due to unforeseen circumstances',
      type: types[Math.floor(Math.random() * types.length)],
      attachments: Math.floor(Math.random() * 5),
    }
  }),
}

export default function HiqorClaimsPage() {
  const [data, setData] = useState<ClaimsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from /api/hiqor/claims
        await new Promise(resolve => setTimeout(resolve, 500))
        setData(mockData)
      } catch (error) {
        console.error('Failed to fetch claims data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and search claims
  const filteredClaims = useMemo(() => {
    if (!data) return []

    let filtered = data.claims

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(claim =>
        claim.claimNumber.toLowerCase().includes(query) ||
        claim.policyNumber.toLowerCase().includes(query) ||
        claim.claimant.name.toLowerCase().includes(query) ||
        claim.type.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [data, statusFilter, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage)
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusConfig = (status: Claim['status']) => {
    const configs = {
      pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock,
      },
      approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
      },
      denied: {
        label: 'Denied',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
      },
      under_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: AlertCircle,
      },
    }
    return configs[status]
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-500 mt-1">Review and process insurance claims</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{data?.stats.totalClaims || 0}</p>
          <p className="text-indigo-200 text-sm mt-1">Total Claims</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{data?.stats.pendingClaims || 0}</p>
          <p className="text-yellow-200 text-sm mt-1">Pending Review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{data?.stats.approvedClaims || 0}</p>
          <p className="text-green-200 text-sm mt-1">Approved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{data?.stats.deniedClaims || 0}</p>
          <p className="text-red-200 text-sm mt-1">Denied</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.stats.totalValue || 0)}</p>
          <p className="text-purple-200 text-sm mt-1">Total Value</p>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by claim number, policy, claimant, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {paginatedClaims.length} of {filteredClaims.length} claims
        </div>
      </motion.div>

      {/* Claims Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Claim Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Claimant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Filed Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.claims.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={AlertCircle}
                      title="No claims filed"
                      description="Claims will appear here when participants file them."
                    />
                  </td>
                </tr>
              ) : paginatedClaims.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={AlertCircle}
                      title="No claims found"
                      description="Try adjusting your search or filters"
                      variant="compact"
                    />
                  </td>
                </tr>
              ) : null}
              {paginatedClaims.map((claim, index) => {
                const statusConfig = getStatusConfig(claim.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.tr
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-indigo-600">
                        {claim.claimNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">
                        {claim.policyNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.claimant.name}
                        </div>
                        {claim.attachments > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {claim.attachments} attachment{claim.attachments !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{claim.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(claim.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(claim.filedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClaim(claim)
                        }}
                        className="text-indigo-600 hover:text-indigo-700 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedClaim(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 border-b border-indigo-400">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold">{selectedClaim.claimNumber}</h3>
                  <p className="text-indigo-100 text-sm mt-0.5">Claim Details</p>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                {(() => {
                  const statusConfig = getStatusConfig(selectedClaim.status)
                  const StatusIcon = statusConfig.icon
                  return (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </span>
                  )
                })()}
              </div>

              {/* Claim Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Policy Number</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {selectedClaim.policyNumber}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Claim Amount</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {formatCurrency(selectedClaim.amount)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Claim Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedClaim.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Filed Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedClaim.filedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Claimant Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Claimant Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedClaim.claimant.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedClaim.claimant.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedClaim.claimant.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedClaim.description}
                </p>
              </div>

              {/* Attachments */}
              {selectedClaim.attachments > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Attachments</h4>
                  <div className="text-sm text-gray-600">
                    {selectedClaim.attachments} file{selectedClaim.attachments !== 1 ? 's' : ''}{' '}
                    attached
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Process Claim
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Request Info
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
