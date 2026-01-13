'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Shield,
  AlertCircle,
} from 'lucide-react';

// Types
interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimant: {
    name: string;
    email: string;
  };
  status: 'pending' | 'under_review' | 'approved' | 'denied' | 'closed';
  filedDate: string;
  incidentDate: string;
  incidentType: string;
  description: string;
}

interface StatsCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

type ClaimStatus = Claim['status'] | 'all';

// Mock data for development
const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2026-001',
    policyNumber: 'POL-2026-100',
    claimant: {
      name: 'John Smith',
      email: 'john.smith@email.com',
    },
    status: 'pending',
    filedDate: '2026-01-13',
    incidentDate: '2026-01-12',
    incidentType: 'Event Cancellation',
    description: 'Wedding cancelled due to venue closure',
  },
  {
    id: '2',
    claimNumber: 'CLM-2026-002',
    policyNumber: 'POL-2026-101',
    claimant: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
    },
    status: 'under_review',
    filedDate: '2026-01-12',
    incidentDate: '2026-01-11',
    incidentType: 'Weather Related',
    description: 'Outdoor concert cancelled due to severe storm',
  },
  {
    id: '3',
    claimNumber: 'CLM-2026-003',
    policyNumber: 'POL-2026-102',
    claimant: {
      name: 'Michael Chen',
      email: 'mchen@email.com',
    },
    status: 'approved',
    filedDate: '2026-01-10',
    incidentDate: '2026-01-09',
    incidentType: 'Vendor No-Show',
    description: 'Catering service failed to deliver',
  },
  {
    id: '4',
    claimNumber: 'CLM-2026-004',
    policyNumber: 'POL-2026-103',
    claimant: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
    },
    status: 'denied',
    filedDate: '2026-01-09',
    incidentDate: '2026-01-08',
    incidentType: 'Policy Exclusion',
    description: 'Claim outside policy coverage period',
  },
  {
    id: '5',
    claimNumber: 'CLM-2026-005',
    policyNumber: 'POL-2026-104',
    claimant: {
      name: 'David Williams',
      email: 'dwilliams@email.com',
    },
    status: 'closed',
    filedDate: '2026-01-08',
    incidentDate: '2026-01-07',
    incidentType: 'Equipment Failure',
    description: 'Sound system malfunction at corporate event',
  },
  {
    id: '6',
    claimNumber: 'CLM-2026-006',
    policyNumber: 'POL-2026-105',
    claimant: {
      name: 'Amanda Taylor',
      email: 'ataylor@email.com',
    },
    status: 'pending',
    filedDate: '2026-01-13',
    incidentDate: '2026-01-12',
    incidentType: 'Property Damage',
    description: 'Venue damage during event setup',
  },
  {
    id: '7',
    claimNumber: 'CLM-2026-007',
    policyNumber: 'POL-2026-106',
    claimant: {
      name: 'James Anderson',
      email: 'j.anderson@email.com',
    },
    status: 'under_review',
    filedDate: '2026-01-11',
    incidentDate: '2026-01-10',
    incidentType: 'Illness/Injury',
    description: 'Key speaker medical emergency',
  },
  {
    id: '8',
    claimNumber: 'CLM-2026-008',
    policyNumber: 'POL-2026-107',
    claimant: {
      name: 'Lisa Martinez',
      email: 'lmartinez@email.com',
    },
    status: 'approved',
    filedDate: '2026-01-09',
    incidentDate: '2026-01-08',
    incidentType: 'Event Cancellation',
    description: 'Conference cancelled due to public health order',
  },
];

const statusColors = {
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  under_review: 'text-blue-600 bg-blue-50 border-blue-200',
  approved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  denied: 'text-red-600 bg-red-50 border-red-200',
  closed: 'text-gray-600 bg-gray-50 border-gray-200',
};

const statusIcons = {
  pending: Clock,
  under_review: AlertCircle,
  approved: CheckCircle,
  denied: XCircle,
  closed: FileText,
};

export default function SuresClaimsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and search claims
  const filteredClaims = useMemo(() => {
    return mockClaims.filter((claim) => {
      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimant.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Calculate stats
  const stats: StatsCard[] = useMemo(() => {
    const totalClaims = mockClaims.length;
    const pendingClaims = mockClaims.filter(
      (c) => c.status === 'pending' || c.status === 'under_review'
    ).length;
    const approvedClaims = mockClaims.filter(
      (c) => c.status === 'approved'
    ).length;
    const deniedClaims = mockClaims.filter((c) => c.status === 'denied').length;

    return [
      {
        title: 'Total Claims',
        value: totalClaims,
        icon: FileText,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      },
      {
        title: 'Pending Review',
        value: pendingClaims,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      },
      {
        title: 'Approved',
        value: approvedClaims,
        icon: CheckCircle,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      },
      {
        title: 'Denied',
        value: deniedClaims,
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ];
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatStatus = (status: Claim['status']) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Claims Management
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor and manage insurance claims for your policies
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by claim number, policy, or claimant..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ClaimStatus);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Claims Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Claim Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Policy Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Claimant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Incident Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Filed Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">
                        No claims found
                      </p>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedClaims.map((claim, index) => {
                    const StatusIcon = statusIcons[claim.status];
                    return (
                      <motion.tr
                        key={claim.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-emerald-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {claim.claimNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {claim.policyNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {claim.claimant.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {claim.claimant.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {claim.incidentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                              statusColors[claim.status]
                            }`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {formatStatus(claim.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(claim.filedDate)}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredClaims.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredClaims.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredClaims.length}</span>{' '}
                    claims
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
