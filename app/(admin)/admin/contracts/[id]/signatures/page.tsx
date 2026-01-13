'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  FileSignature,
  Search,
  Download,
  User,
  Calendar,
  Globe,
  Filter,
} from 'lucide-react'

interface Signature {
  id: string
  partnerId: string
  partnerName: string
  partnerEmail: string
  contractVersion: number
  signedAt: string
  ipAddress: string
}

interface Contract {
  id: string
  displayName: string
  version: number
}

export default function ContractSignaturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [contract, setContract] = useState<Contract | null>(null)
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [versionFilter, setVersionFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)

  useEffect(() => {
    fetchContract()
    fetchSignatures()
  }, [id, versionFilter, page])

  async function fetchContract() {
    try {
      const res = await fetch(`/api/admin/contracts/${id}`)
      const json = await res.json()

      if (json.success) {
        setContract(json.data)
      }
    } catch (error) {
      console.error('Failed to fetch contract:', error)
    }
  }

  async function fetchSignatures() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        ...(versionFilter !== 'all' && { version: versionFilter }),
      })

      const res = await fetch(`/api/admin/contracts/${id}/signatures?${params}`)
      const json = await res.json()

      if (json.success) {
        setSignatures(json.data || [])
        setPagination(json.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch signatures:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSignatures = signatures.filter(sig =>
    (sig.partnerName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (sig.partnerEmail?.toLowerCase() || '').includes(search.toLowerCase())
  )

  // Get unique versions for filter
  const versions = [...new Set(signatures.map(s => s.contractVersion))].sort((a, b) => b - a)

  function exportToCSV() {
    const headers = ['Partner Name', 'Email', 'Version', 'Signed At', 'IP Address']
    const rows = filteredSignatures.map(sig => [
      sig.partnerName,
      sig.partnerEmail,
      `v${sig.contractVersion}`,
      new Date(sig.signedAt).toISOString(),
      sig.ipAddress,
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signatures-${contract?.displayName?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/contracts/${id}`}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Signatures: {contract?.displayName}
            </h1>
            <p className="text-gray-500">
              Partners who have signed this contract
            </p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <FileSignature className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
              <p className="text-gray-500 text-sm">Total Signatures</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">v{contract?.version}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Current Version</p>
              <p className="text-gray-500 text-sm">{versions.length} version(s) signed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {signatures.length > 0
                  ? new Date(signatures[0].signedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p className="text-gray-500 text-sm">Most Recent Signature</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by partner name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Versions</option>
            {versions.map(v => (
              <option key={v} value={v}>Version {v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Signatures Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signed At
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredSignatures.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No signatures found
                </td>
              </tr>
            ) : (
              filteredSignatures.map((signature, index) => (
                <motion.tr
                  key={signature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{signature.partnerName}</p>
                        <p className="text-sm text-gray-500">{signature.partnerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                      signature.contractVersion === contract?.version
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      v{signature.contractVersion}
                      {signature.contractVersion === contract?.version && (
                        <span className="ml-1">(current)</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {new Date(signature.signedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(signature.signedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Globe className="w-4 h-4" />
                      {signature.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/partners?search=${encodeURIComponent(signature.partnerEmail)}`}
                      className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                    >
                      View Partner
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
