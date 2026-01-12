"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Filter,
  Search,
  Copy,
  Send,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { formatCurrency } from "@/lib/commission-tiers"

interface Quote {
  id: string
  quote_number: string
  event_type: string
  event_date: Date | string
  participants: number
  coverage_type: string
  premium: number
  commission: number
  status: string
  customer_email: string | null
  customer_name: string | null
  created_at: Date | string
  expires_at?: Date | string
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    color: "text-slate-500",
    bg: "bg-slate-100",
  },
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [coverageFilter, setCoverageFilter] = useState<string>("all")

  useEffect(() => {
    fetchQuotes()
  }, [statusFilter, coverageFilter])

  async function fetchQuotes() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (coverageFilter !== "all") params.append("coverageType", coverageFilter)

      const response = await fetch(`/api/partner/quotes?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch quotes")

      const data = await response.json()
      setQuotes(data.data || data)
    } catch (err) {
      console.error("Error fetching quotes:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopyLink(quoteNumber: string) {
    const link = `${window.location.origin}/quote/${quoteNumber}`
    await navigator.clipboard.writeText(link)
    alert("Quote link copied to clipboard!")
  }

  async function handleResend(quoteId: string) {
    try {
      const response = await fetch(`/api/partner/quotes/${quoteId}/resend`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to resend quote")
      alert("Quote resent successfully!")
    } catch (err) {
      console.error("Error resending quote:", err)
      alert("Failed to resend quote")
    }
  }

  async function handleDelete(quoteId: string) {
    if (!confirm("Are you sure you want to delete this quote?")) return

    try {
      const response = await fetch(`/api/partner/quotes/${quoteId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete quote")
      fetchQuotes()
    } catch (err) {
      console.error("Error deleting quote:", err)
      alert("Failed to delete quote")
    }
  }

  function getTimeRemaining(expiresAt: Date | string | undefined) {
    if (!expiresAt) return null
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diff = expiry.getTime() - now.getTime()

    if (diff < 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const filteredQuotes = quotes.filter((quote) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      quote.quote_number.toLowerCase().includes(searchLower) ||
      quote.event_type.toLowerCase().includes(searchLower) ||
      quote.customer_name?.toLowerCase().includes(searchLower) ||
      quote.customer_email?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Quotes</h1>
            <p className="text-slate-600 mt-1">Manage and track your insurance quotes</p>
          </div>
          <a
            href="/partner/quotes/new"
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Create Quote
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Coverage Filter */}
        <select
          value={coverageFilter}
          onChange={(e) => setCoverageFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Coverage Types</option>
          <option value="liability">Liability</option>
          <option value="equipment">Equipment</option>
          <option value="cancellation">Cancellation</option>
        </select>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center shadow-lg border border-slate-100"
          >
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No quotes found</h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== "all" || coverageFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first quote to get started"}
            </p>
          </motion.div>
        ) : (
          filteredQuotes.map((quote, index) => {
            const status = statusConfig[quote.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon
            const timeRemaining = getTimeRemaining(quote.expires_at)

            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/partner/quotes/${quote.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Quote Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{quote.quote_number}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium">{quote.event_type}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{quote.participants} participants</span>
                          <span className="capitalize">{quote.coverage_type}</span>
                          <span>{new Date(quote.event_date).toLocaleDateString()}</span>
                        </div>
                        {quote.customer_name && (
                          <p className="text-sm text-slate-600 mt-2">
                            {quote.customer_name} {quote.customer_email && `• ${quote.customer_email}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-500">Premium</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(Number(quote.premium))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Your Commission</p>
                        <p className="text-lg font-bold text-teal-600">{formatCurrency(Number(quote.commission))}</p>
                      </div>
                      {timeRemaining && quote.status === "pending" && (
                        <div>
                          <p className="text-xs text-slate-500">Expires</p>
                          <p className={`text-sm font-semibold ${timeRemaining === "Expired" ? "text-red-600" : "text-amber-600"}`}>
                            {timeRemaining}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCopyLink(quote.quote_number)}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="Copy quote link"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                    {quote.status === "pending" && (
                      <button
                        onClick={() => handleResend(quote.id)}
                        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                        title="Resend quote"
                      >
                        <Send className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                    <a
                      href={`/quote/${quote.quote_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                      title="View quote"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                    </a>
                    {quote.status !== "accepted" && (
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
                        title="Delete quote"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
