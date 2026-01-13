'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

// TypeScript types
interface Policy {
  id: string
  policyNumber: string
  holderName: string
  holderEmail: string
  premium: number
  status: 'active' | 'pending' | 'expired' | 'cancelled'
  eventDate: string
  eventType: string
  participants: number
  createdAt: string
  expiresAt: string
}

interface StatsCard {
  label: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface PoliciesData {
  policies: Policy[]
  stats: {
    total: number
    active: number
    pending: number
    totalPremium: number
  }
}

// Mock data generator
const generateMockPolicies = (): Policy[] => {
  const eventTypes = [
    'Wedding', 'Corporate Event', 'Birthday Party', 'Conference',
    'Sports Tournament', 'Concert', 'Festival', 'Graduation',
    'Anniversary', 'Charity Event', 'Trade Show', 'Retreat'
  ]

  const statuses: Policy['status'][] = ['active', 'pending', 'expired', 'cancelled']

  const names = [
    'Smith Wedding', 'Johnson Corp', 'Davis Birthday', 'Wilson Anniversary',
    'Brown Graduation', 'Martinez Festival', 'Garcia Conference', 'Rodriguez Gala',
    'Taylor Retreat', 'Anderson Sports', 'Thomas Concert', 'Moore Charity',
    'Jackson Corporate', 'White Wedding', 'Harris Birthday', 'Martin Anniversary',
    'Thompson Conference', 'Lee Festival', 'Walker Graduation', 'Hall Sports',
    'Allen Concert', 'Young Charity', 'King Corporate', 'Wright Wedding',
    'Lopez Birthday', 'Hill Anniversary', 'Scott Conference', 'Green Festival',
    'Adams Graduation', 'Baker Sports', 'Gonzalez Concert', 'Nelson Charity',
    'Carter Corporate', 'Mitchell Wedding', 'Perez Birthday', 'Roberts Anniversary',
    'Turner Conference', 'Phillips Festival', 'Campbell Graduation', 'Parker Sports',
    'Evans Concert', 'Edwards Charity', 'Collins Corporate', 'Stewart Wedding',
    'Sanchez Birthday', 'Morris Anniversary', 'Rogers Conference', 'Reed Festival',
    'Cook Graduation', 'Morgan Sports', 'Bell Concert', 'Murphy Charity',
  ]

  return Array.from({ length: 150 }, (_, i) => {
    const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const eventDate = new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000)
    const expiresDate = new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
      id: `pol-${i + 1}`,
      policyNumber: `POL-2025-${String(i + 1).padStart(6, '0')}`,
      holderName: names[i % names.length],
      holderEmail: `${names[i % names.length].toLowerCase().replace(/\s/g, '.')}@example.com`,
      premium: Math.floor(Math.random() * 800) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      eventDate: eventDate.toISOString(),
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      participants: Math.floor(Math.random() * 500) + 10,
      createdAt: createdDate.toISOString(),
      expiresAt: expiresDate.toISOString(),
    }
  })
}

const mockPolicies = generateMockPolicies()

export default function HiqorPoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PoliciesData | null>(null)

  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      try {
        // In production, fetch from /api/hiqor/policies
        await new Promise(resolve => setTimeout(resolve, 500))

        const stats = {
          total: mockPolicies.length,
          active: mockPolicies.filter(p => p.status === 'active').length,
          pending: mockPolicies.filter(p => p.status === 'pending').length,
          totalPremium: mockPolicies.reduce((sum, p) => sum + p.premium, 0),
        }

        setData({ policies: mockPolicies, stats })
      } catch (error) {
        console.error('Failed to fetch policies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and search policies
  const filteredPolicies = useMemo(() => {
    if (!data) return []

    return data.policies.filter(policy => {
      const matchesSearch =
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.holderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.eventType.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || policy.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [data, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage)
  const paginatedPolicies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPolicies.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPolicies, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'expired':
        return 'bg-gray-100 text-gray-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'expired':
      case 'cancelled':
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const statsCards: StatsCard[] = [
    {
      label: 'Total Policies',
      value: data?.stats.total.toLocaleString() || '0',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Active Policies',
      value: data?.stats.active.toLocaleString() || '0',
      change: 12,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Pending Review',
      value: data?.stats.pending.toLocaleString() || '0',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Total Premium',
      value: formatCurrency(data?.stats.totalPremium || 0),
      change: 8,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
        <p className="text-gray-500">View and manage all insurance policies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className="flex items-center gap-1 text-sm font-medium text-white/90">
                    <TrendingUp className="w-4 h-4" />
                    +{stat.change}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-white/80 text-sm mt-1">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by policy number, holder name, or event type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 font-medium">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{paginatedPolicies.length}</span> of{' '}
            <span className="font-medium text-gray-900">{filteredPolicies.length}</span> policies
          </p>
        </div>
      </motion.div>

      {/* Policies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holder
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPolicies.length > 0 ? (
                paginatedPolicies.map((policy, index) => (
                  <motion.tr
                    key={policy.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {policy.policyNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{policy.holderName}</p>
                        <p className="text-xs text-gray-500">{policy.holderEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{policy.eventType}</span>
                      <p className="text-xs text-gray-500">{policy.participants} participants</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(policy.eventDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(policy.premium)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          policy.status
                        )}`}
                      >
                        {getStatusIcon(policy.status)}
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No policies found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    // Show ellipsis only once between groups
                    if (page === 2 && currentPage > 3) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
