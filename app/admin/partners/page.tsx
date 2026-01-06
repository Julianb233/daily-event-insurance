"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Download,
  Users,
  DollarSign,
  FileText,
  QrCode,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  Eye,
  MoreVertical,
  RefreshCw,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  Edit2
} from "lucide-react"

interface Partner {
  id: string
  businessName: string
  businessType: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  websiteUrl: string | null
  primaryColor: string | null
  logoUrl: string | null
  brandingImages: string[]
  status: string
  integrationType: string | null
  createdAt: string
  microsite: {
    id: string
    subdomain: string
    domain: string
    qrCodeUrl: string | null
    status: string
  } | null
  metrics: {
    totalPolicies: number
    totalRevenue: number
    totalCommission: number
    totalLeads: number
    conversionRate: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Summary {
  totalPartners: number
  activePartners: number
  pendingPartners: number
  totalRevenue: number
  totalPolicies: number
}

const businessTypeLabels: Record<string, string> = {
  fitness_center: "Fitness Center",
  gym: "Gym",
  yoga_studio: "Yoga Studio",
  climbing_gym: "Climbing Gym",
  crossfit: "CrossFit",
  martial_arts: "Martial Arts",
  dance_studio: "Dance Studio",
  adventure_sports: "Adventure Sports",
  ski_resort: "Ski Resort",
  wellness_center: "Wellness Center",
  other: "Other"
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  active: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="w-4 h-4" /> },
  under_review: { bg: "bg-blue-100", text: "text-blue-700", icon: <Clock className="w-4 h-4" /> },
  suspended: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> },
  inactive: { bg: "bg-gray-100", text: "text-gray-700", icon: <XCircle className="w-4 h-4" /> }
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showQrModal, setShowQrModal] = useState(false)
  const [viewingDocumentsFor, setViewingDocumentsFor] = useState<Partner | null>(null)
  const [partnerDocuments, setPartnerDocuments] = useState<any[]>([])
  const [viewDocument, setViewDocument] = useState<any | null>(null)
  const [loadingDocs, setLoadingDocs] = useState(false)

  // Edit State
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPartner) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPartner.id,
          businessName: editingPartner.businessName,
          primaryColor: editingPartner.primaryColor,
          logoUrl: editingPartner.logoUrl
        })
      })

      if (res.ok) {
        setEditingPartner(null)
        fetchPartners() // Refresh list
      } else {
        alert('Failed to save changes')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving changes')
    } finally {
      setIsSaving(false)
    }
  }

  // Fetch documents for a partner
  const fetchPartnerDocuments = async (partner: Partner) => {
    setViewingDocumentsFor(partner)
    setLoadingDocs(true)
    try {
      const res = await fetch(`/api/admin/partners/${partner.id}/documents`)
      const data = await res.json()
      if (data.success) {
        setPartnerDocuments(data.documents)
      } else {
        console.error("Failed to load documents")
      }
    } catch (err) {
      console.error("Error loading documents:", err)
    } finally {
      setLoadingDocs(false)
    }
  }

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (businessTypeFilter) params.set("businessType", businessTypeFilter)

      const response = await fetch(`/api/admin/partners?${params}`)
      const data = await response.json()

      if (data.success) {
        setPartners(data.data)
        setPagination(data.pagination)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, statusFilter, businessTypeFilter])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const openQrModal = (partner: Partner) => {
    setSelectedPartner(partner)
    setShowQrModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
              <ChevronLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Partner Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all partner accounts, QR codes, and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchPartners}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Partners</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalPartners}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.activePartners}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.pendingPartners}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Policies</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalPolicies}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by business name, contact name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={businessTypeFilter}
                onChange={(e) => {
                  setBusinessTypeFilter(e.target.value)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Types</option>
                {Object.entries(businessTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Partners Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sign-ups
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Conv. Rate
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                        <span className="text-gray-500">Loading partners...</span>
                      </div>
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No partners found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => {
                    const statusStyle = statusColors[partner.status] || statusColors.inactive
                    return (
                      <tr key={partner.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: partner.primaryColor || "#14B8A6" }}
                            >
                              {partner.logoUrl ? (
                                <img src={partner.logoUrl} alt="" className="w-8 h-8 object-contain" />
                              ) : (
                                partner.businessName.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{partner.businessName}</p>
                              <p className="text-sm text-gray-500">
                                {businessTypeLabels[partner.businessType] || partner.businessType}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{partner.contactName}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${partner.contactEmail}`} className="hover:text-teal-600">
                              {partner.contactEmail}
                            </a>
                          </div>
                          {partner.contactPhone && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              {partner.contactPhone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {partner.status.replace("_", " ")}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Joined {formatDate(partner.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {partner.microsite ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openQrModal(partner)}
                                className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-teal-500 flex items-center justify-center transition overflow-hidden"
                              >
                                {partner.microsite.qrCodeUrl ? (
                                  <img
                                    src={partner.microsite.qrCodeUrl}
                                    alt="QR Code"
                                    className="w-10 h-10"
                                  />
                                ) : (
                                  <QrCode className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                              <div className="text-xs">
                                <a
                                  href={`https://${partner.microsite.domain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:underline flex items-center gap-1"
                                >
                                  {partner.microsite.subdomain}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className={`${partner.microsite.status === 'live' ? 'text-green-600' : 'text-gray-400'}`}>
                                  {partner.microsite.status}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No microsite</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(partner.metrics.totalRevenue)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(partner.metrics.totalCommission)} comm.
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-900">{partner.metrics.totalPolicies}</p>
                          <p className="text-xs text-gray-500">{partner.metrics.totalLeads} leads</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className={`w-4 h-4 ${partner.metrics.conversionRate > 50 ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={`font-semibold ${partner.metrics.conversionRate > 50 ? 'text-green-600' : 'text-gray-900'}`}>
                              {partner.metrics.conversionRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openQrModal(partner)}
                              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="View QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => fetchPartnerDocuments(partner)}
                              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="View Documents"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingPartner(partner)}
                              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="Edit Branding"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {partner.websiteUrl && (
                              <a
                                href={partner.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Visit Website"
                              >
                                <Globe className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => fetchPartnerDocuments(partner)}
                              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="View Documents"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingPartner(partner)}
                              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="Edit Branding"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} partners
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQrModal && selectedPartner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">QR Code</h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: selectedPartner.primaryColor || "#14B8A6" }}
                >
                  {selectedPartner.logoUrl ? (
                    <img src={selectedPartner.logoUrl} alt="" className="w-16 h-16 object-contain" />
                  ) : (
                    selectedPartner.businessName.charAt(0)
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{selectedPartner.businessName}</h4>
                {selectedPartner.microsite && (
                  <>
                    <p className="text-sm text-gray-500 mb-4">{selectedPartner.microsite.domain}</p>
                    <div className="bg-gray-50 rounded-xl p-6 mb-4">
                      {selectedPartner.microsite.qrCodeUrl ? (
                        <img
                          src={selectedPartner.microsite.qrCodeUrl}
                          alt="QR Code"
                          className="w-48 h-48 mx-auto"
                        />
                      ) : (
                        <div className="w-48 h-48 mx-auto flex items-center justify-center bg-gray-200 rounded-lg">
                          <QrCode className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`https://${selectedPartner.microsite.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Microsite
                      </a>
                      <button
                        onClick={() => {
                          if (selectedPartner.microsite?.qrCodeUrl) {
                            const link = document.createElement('a')
                            link.href = selectedPartner.microsite.qrCodeUrl
                            link.download = `${selectedPartner.businessName.replace(/\s+/g, '-')}-qr.png`
                            link.click()
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Performance Metrics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(selectedPartner.metrics.totalRevenue)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Policies</p>
                    <p className="font-semibold text-gray-900">{selectedPartner.metrics.totalPolicies}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Leads</p>
                    <p className="font-semibold text-gray-900">{selectedPartner.metrics.totalLeads}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Conversion</p>
                    <p className="font-semibold text-gray-900">{selectedPartner.metrics.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Documents List Modal */}
        {viewingDocumentsFor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Documents - {viewingDocumentsFor.businessName}
                </h3>
                <button
                  onClick={() => setViewingDocumentsFor(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingDocs ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                  </div>
                ) : partnerDocuments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No documents signed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {partnerDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.status === 'signed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">
                              {doc.documentType.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm text-gray-500">
                              Signed: {new Date(doc.signedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewDocument({
                            id: doc.id,
                            title: doc.documentType.replace(/_/g, " ").toUpperCase(),
                            type: doc.documentType,
                            version: "1.0",
                            content: doc.contentSnapshot || "No content snapshot available."
                          })}
                          className="px-4 py-2 bg-white border border-gray-200 shadow-sm text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                        >
                          View Content
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Partner Modal */}
        {editingPartner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Edit Branding</h3>
                <button
                  onClick={() => setEditingPartner(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSavePartner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={editingPartner.businessName}
                    onChange={e => setEditingPartner({ ...editingPartner, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingPartner.primaryColor || '#000000'}
                      onChange={e => setEditingPartner({ ...editingPartner, primaryColor: e.target.value })}
                      className="h-10 w-10 rounded overflow-hidden border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingPartner.primaryColor || ''}
                      onChange={e => setEditingPartner({ ...editingPartner, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 uppercase"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      placeholder="#000000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={editingPartner.logoUrl || ''}
                    onChange={e => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="https://..."
                  />
                  {editingPartner.logoUrl && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 flex justify-center">
                      <img src={editingPartner.logoUrl} alt="Preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPartner(null)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Document Modal */}
        {viewDocument && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/50" onClick={() => setViewDocument(null)} />
            <div className="relative pointer-events-none flex items-center justify-center h-full">
              <div className="pointer-events-auto bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] m-4 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold text-gray-900">{viewDocument.title}</h2>
                  <button onClick={() => setViewDocument(null)} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{viewDocument.content}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
