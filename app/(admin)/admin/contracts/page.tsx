'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ScrollText,
  Plus,
  Search,
  Edit,
  Eye,
  FileSignature,
  CheckCircle,
  Clock,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

interface Contract {
  id: string
  name: string
  displayName: string
  description: string | null
  version: number
  isActive: boolean
  isRequired: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  signatureCount: number
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchContracts()
  }, [])

  async function fetchContracts() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/contracts')
      const json = await res.json()

      if (json.success) {
        setContracts(json.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleContractStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/contracts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        fetchContracts()
      }
    } catch (error) {
      console.error('Failed to toggle contract status:', error)
    }
  }

  const filteredContracts = contracts.filter(contract =>
    contract.displayName.toLowerCase().includes(search.toLowerCase()) ||
    contract.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = contracts.filter(c => c.isActive).length
  const requiredCount = contracts.filter(c => c.isRequired).length
  const totalSignatures = contracts.reduce((sum, c) => sum + c.signatureCount, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Templates</h1>
          <p className="text-gray-500">Manage contracts partners sign during onboarding</p>
        </div>
        <Link
          href="/admin/contracts/new"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Contract
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
          <p className="text-gray-500 text-sm">Total Templates</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
          <p className="text-gray-500 text-sm">Active Contracts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{requiredCount}</p>
          <p className="text-gray-500 text-sm">Required for Onboarding</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSignatures}</p>
          <p className="text-gray-500 text-sm">Total Signatures</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            Loading...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            No contracts found
          </div>
        ) : (
          filteredContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      contract.isActive ? 'bg-violet-100' : 'bg-gray-100'
                    }`}>
                      <ScrollText className={`w-6 h-6 ${
                        contract.isActive ? 'text-violet-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contract.displayName}
                        </h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                          v{contract.version}
                        </span>
                        {contract.isRequired && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Required
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          contract.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {contract.isActive ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {contract.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileSignature className="w-4 h-4" />
                          {contract.signatureCount} signatures
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated {new Date(contract.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/contracts/${contract.id}/signatures`}
                      className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                      title="View Signatures"
                    >
                      <FileSignature className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/contracts/${contract.id}`}
                      className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                      title="Edit Contract"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => toggleContractStatus(contract.id, contract.isActive)}
                      className={`p-2 transition-colors ${
                        contract.isActive
                          ? 'text-green-500 hover:text-red-500'
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                      title={contract.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {contract.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ScrollText className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-amber-800">Version Control</h4>
            <p className="text-sm text-amber-700 mt-1">
              When you edit a contract's content, a new version is automatically created.
              Existing partner signatures remain valid for the version they signed.
              For legal compliance, contract templates are never permanently deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
