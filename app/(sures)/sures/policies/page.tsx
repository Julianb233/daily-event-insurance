'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';

// Types
interface Policy {
  id: string;
  policyNumber: string;
  partnerName: string;
  participants: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  coverageType: string;
}

interface Stats {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  expiredPolicies: number;
}

// Mock data
const mockPolicies: Policy[] = [
  {
    id: '1',
    policyNumber: 'POL-2024-001',
    partnerName: 'Adventure Tours Inc',
    participants: 25,
    effectiveDate: '2024-01-15',
    expiryDate: '2024-12-31',
    status: 'active',
    coverageType: 'Event Liability',
  },
  {
    id: '2',
    policyNumber: 'POL-2024-002',
    partnerName: 'City Sports League',
    participants: 150,
    effectiveDate: '2024-02-01',
    expiryDate: '2024-12-31',
    status: 'active',
    coverageType: 'Sports Coverage',
  },
  {
    id: '3',
    policyNumber: 'POL-2024-003',
    partnerName: 'Music Festival Organizers',
    participants: 500,
    effectiveDate: '2024-03-10',
    expiryDate: '2024-03-12',
    status: 'expired',
    coverageType: 'Event Liability',
  },
  {
    id: '4',
    policyNumber: 'POL-2024-004',
    partnerName: 'Corporate Events Co',
    participants: 75,
    effectiveDate: '2024-04-01',
    expiryDate: '2024-12-31',
    status: 'pending',
    coverageType: 'General Liability',
  },
  {
    id: '5',
    policyNumber: 'POL-2024-005',
    partnerName: 'Outdoor Adventures LLC',
    participants: 40,
    effectiveDate: '2024-01-01',
    expiryDate: '2024-06-30',
    status: 'expired',
    coverageType: 'Adventure Sports',
  },
  {
    id: '6',
    policyNumber: 'POL-2024-006',
    partnerName: 'Community Center',
    participants: 200,
    effectiveDate: '2024-02-15',
    expiryDate: '2025-02-14',
    status: 'active',
    coverageType: 'Facility Coverage',
  },
  {
    id: '7',
    policyNumber: 'POL-2024-007',
    partnerName: 'Tech Conference Inc',
    participants: 300,
    effectiveDate: '2024-05-01',
    expiryDate: '2024-05-03',
    status: 'cancelled',
    coverageType: 'Event Liability',
  },
  {
    id: '8',
    policyNumber: 'POL-2024-008',
    partnerName: 'Fitness Studio Network',
    participants: 120,
    effectiveDate: '2024-03-01',
    expiryDate: '2025-02-28',
    status: 'active',
    coverageType: 'Fitness Coverage',
  },
];

const ITEMS_PER_PAGE = 10;

export default function SuresPoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats
  const stats: Stats = useMemo(() => {
    return {
      totalPolicies: mockPolicies.length,
      activePolicies: mockPolicies.filter((p) => p.status === 'active').length,
      pendingPolicies: mockPolicies.filter((p) => p.status === 'pending').length,
      expiredPolicies: mockPolicies.filter((p) => p.status === 'expired').length,
    };
  }, []);

  // Filter policies
  const filteredPolicies = useMemo(() => {
    return mockPolicies.filter((policy) => {
      const matchesSearch =
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.coverageType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Paginate policies
  const paginatedPolicies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPolicies.slice(startIndex, endIndex);
  }, [filteredPolicies, currentPage]);

  const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusConfig = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: 'Active',
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          className: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'expired':
        return {
          icon: AlertCircle,
          label: 'Expired',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelled',
          className: 'bg-red-100 text-red-700 border-red-200',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage insurance policies</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPolicies}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activePolicies}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingPolicies}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">{stats.expiredPolicies}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by policy number, partner, or coverage type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Policies Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Policy Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Coverage Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-emerald-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPolicies.map((policy, index) => {
                  const statusConfig = getStatusConfig(policy.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={policy.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-emerald-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{policy.policyNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{policy.partnerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{policy.coverageType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{policy.participants}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(policy.effectiveDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(policy.expiryDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredPolicies.length)} of {filteredPolicies.length}{' '}
                policies
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {mockPolicies.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No policies found"
              description="Policies will appear here once you start creating them."
            />
          ) : paginatedPolicies.length === 0 ? (
            <div className="px-6 py-12">
              <EmptyState
                icon={FileText}
                title="No policies found"
                description="Try adjusting your search or filter criteria"
                variant="compact"
              />
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
