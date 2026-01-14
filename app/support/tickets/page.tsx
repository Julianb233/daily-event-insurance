"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Ticket, Search, Filter, Clock, ChevronRight, RefreshCw, AlertCircle, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    TicketStatus,
    TicketPriority,
    TicketCategory,
    STATUS_CONFIG,
    PRIORITY_CONFIG,
    CATEGORY_CONFIG,
    type Ticket as TicketType,
} from "@/lib/support/ticket-types"

interface TicketListResponse {
    success: boolean
    data: TicketType[]
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export default function SupportTicketsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // State
    const [email, setEmail] = useState(searchParams.get("email") || "")
    const [emailInput, setEmailInput] = useState(searchParams.get("email") || "")
    const [tickets, setTickets] = useState<TicketType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
    })

    // Fetch tickets
    const fetchTickets = useCallback(async () => {
        if (!email) return

        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                email,
                page: pagination.page.toString(),
                pageSize: pagination.pageSize.toString(),
            })

            if (statusFilter !== "all") {
                params.set("status", statusFilter)
            }

            const response = await fetch(`/api/support/tickets?${params.toString()}`)
            const data: TicketListResponse = await response.json()

            if (!response.ok || !data.success) {
                throw new Error("Failed to fetch tickets")
            }

            setTickets(data.data)
            setPagination({
                page: data.pagination.page,
                pageSize: data.pagination.pageSize,
                total: data.pagination.total,
                totalPages: data.pagination.totalPages,
            })
        } catch (err: any) {
            console.error("Error fetching tickets:", err)
            setError(err.message || "Failed to load tickets")
            setTickets([])
        } finally {
            setIsLoading(false)
        }
    }, [email, statusFilter, pagination.page, pagination.pageSize])

    // Initial load
    useEffect(() => {
        if (email) {
            fetchTickets()
        }
    }, [email, statusFilter, fetchTickets])

    // Handle email search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (emailInput.trim()) {
            setEmail(emailInput.trim().toLowerCase())
            setPagination(prev => ({ ...prev, page: 1 }))
            router.push(`/support/tickets?email=${encodeURIComponent(emailInput.trim().toLowerCase())}`)
        }
    }

    // Format date
    const formatDate = (date: Date | string) => {
        const d = new Date(date)
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })
    }

    // Get time ago
    const getTimeAgo = (date: Date | string) => {
        const d = new Date(date)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} min ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays < 7) return `${diffDays} days ago`
        return formatDate(date)
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-white pt-32 pb-16 border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Link href="/support" className="text-slate-600 hover:text-teal-600 transition-colors">
                                Support
                            </Link>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 font-medium">My Tickets</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                    Support Tickets
                                </h1>
                                <p className="text-xl text-slate-600">
                                    View and track the status of your support requests.
                                </p>
                            </div>
                            <Link
                                href="/support/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                New Ticket
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Enter your email to view tickets..."
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Tickets Section */}
            <section className="py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {!email ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Ticket className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Your Email</h3>
                            <p className="text-slate-600 max-w-md mx-auto">
                                Enter the email address you used when submitting your support tickets to view their status.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-slate-500" />
                                    <span className="text-sm text-slate-600">Filter by status:</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setStatusFilter("all")}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                statusFilter === "all"
                                                    ? "bg-teal-600 text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            All
                                        </button>
                                        {Object.values(TicketStatus).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                    statusFilter === status
                                                        ? "bg-teal-600 text-white"
                                                        : `${STATUS_CONFIG[status].bgColor} ${STATUS_CONFIG[status].color} hover:opacity-80`
                                                }`}
                                            >
                                                {STATUS_CONFIG[status].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={fetchTickets}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                                    Refresh
                                </button>
                            </div>

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
                                    <p className="text-slate-600">Loading tickets...</p>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Ticket className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Tickets Found</h3>
                                    <p className="text-slate-600 max-w-md mx-auto mb-6">
                                        {statusFilter !== "all"
                                            ? `No tickets with status "${STATUS_CONFIG[statusFilter].label}" found for ${email}`
                                            : `No support tickets found for ${email}`}
                                    </p>
                                    <Link
                                        href="/support/contact"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Create New Ticket
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Ticket List */}
                                    <div className="space-y-4">
                                        {tickets.map((ticket, index) => (
                                            <motion.div
                                                key={ticket.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-white rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all p-6"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="font-mono text-sm text-teal-600 font-semibold">
                                                                {ticket.ticketNumber}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    STATUS_CONFIG[ticket.status as TicketStatus]?.bgColor || "bg-slate-100"
                                                                } ${STATUS_CONFIG[ticket.status as TicketStatus]?.color || "text-slate-600"}`}
                                                            >
                                                                {STATUS_CONFIG[ticket.status as TicketStatus]?.label || ticket.status}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    PRIORITY_CONFIG[ticket.priority as TicketPriority]?.bgColor || "bg-slate-100"
                                                                } ${PRIORITY_CONFIG[ticket.priority as TicketPriority]?.color || "text-slate-600"}`}
                                                            >
                                                                {PRIORITY_CONFIG[ticket.priority as TicketPriority]?.label || ticket.priority}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                            {ticket.subject}
                                                        </h3>
                                                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                                                            {ticket.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {getTimeAgo(ticket.createdAt)}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                                {CATEGORY_CONFIG[ticket.category as TicketCategory]?.label || ticket.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center sm:justify-end">
                                                        <span className="text-slate-400">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                                            <p className="text-sm text-slate-600">
                                                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                                                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                                                {pagination.total} tickets
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                                                    }
                                                    disabled={pagination.page <= 1}
                                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                                                    }
                                                    disabled={pagination.page >= pagination.totalPages}
                                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}
