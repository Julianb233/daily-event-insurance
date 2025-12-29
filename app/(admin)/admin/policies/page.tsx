"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
} from "lucide-react"
import { DataTable, Column } from "@/components/admin/DataTable"

interface Policy {
  id: string
  policyNumber: string
  partnerId: string
  partnerName: string
  customerName: string | null
  customerEmail: string | null
  eventType: string
  eventDate: string
  participants: number
  coverageType: string
  premium: string
  commission: string
  status: string
  createdAt: string
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-700", icon: XCircle },
  claimed: { label: "Claimed", color: "bg-blue-100 text-blue-700", icon: FileText },
}

function formatCurrency(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [partnerFilter, setPartnerFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    fetchPolicies()
  }, [])

  async function fetchPolicies() {
    try {
      const response = await fetch("/api/admin/policies")
      if (!response.ok) throw new Error("Failed to fetch policies")
      const result = await response.json()
      setPolicies(result.data || [])
    } catch (err) {
      console.error("Error fetching policies:", err)
      // Use mock data for development
      setPolicies(generateMockPolicies())
    } finally {
      setIsLoading(false)
    }
  }

  function generateMockPolicies(): Policy[] {
    const mockData: Policy[] = []
    const eventTypes = ["Gym Class", "Rock Climbing", "Outdoor Adventure", "Team Building", "Fitness Bootcamp"]
    const coverageTypes = ["liability", "equipment", "cancellation"]
    const statuses = ["active", "pending", "expired", "claimed"]
    const partners = [
      { id: "1", name: "Adventure Sports Inc" },
      { id: "2", name: "Peak Performance Gym" },
      { id: "3", name: "Urban Gym Network" },
      { id: "4", name: "Summit Fitness" },
    ]

    for (let i = 0; i < 50; i++) {
      const partner = partners[Math.floor(Math.random() * partners.length)]
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 90) - 30)

      mockData.push({
        id: `policy_${i + 1}`,
        policyNumber: `POL-${new Date().getFullYear()}${String(i + 1).padStart(5, "0")}`,
        partnerId: partner.id,
        partnerName: partner.name,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        eventDate: eventDate.toISOString(),
        participants: Math.floor(Math.random() * 50) + 5,
        coverageType: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
        premium: (Math.random() * 200 + 50).toFixed(2),
        commission: (Math.random() * 100 + 20).toFixed(2),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    return mockData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      searchQuery === "" ||
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || policy.status === statusFilter
    const matchesPartner = partnerFilter === "all" || policy.partnerId === partnerFilter

    let matchesDate = true
    if (dateFilter === "today") {
      const today = new Date().toDateString()
      matchesDate = new Date(policy.eventDate).toDateString() === today
    } else if (dateFilter === "week") {
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      matchesDate = new Date(policy.eventDate) <= weekFromNow
    } else if (dateFilter === "month") {
      const monthFromNow = new Date()
      monthFromNow.setMonth(monthFromNow.getMonth() + 1)
      matchesDate = new Date(policy.eventDate) <= monthFromNow
    }

    return matchesSearch && matchesStatus && matchesPartner && matchesDate
  })

  const uniquePartners = Array.from(
    new Set(policies.map((p) => JSON.stringify({ id: p.partnerId, name: p.partnerName })))
  ).map((str) => JSON.parse(str))

  const columns: Column<Policy>[] = [
    {
      key: "policyNumber",
      label: "Policy Number",
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold text-slate-900">{value}</span>
      ),
    },
    {
      key: "partnerName",
      label: "Partner",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">{value}</span>
        </div>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-900">{value || "N/A"}</p>
          <p className="text-xs text-slate-500">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "eventType",
      label: "Event Type",
      sortable: true,
      render: (value) => (
        <span className="text-slate-700">{value}</span>
      ),
    },
    {
      key: "eventDate",
      label: "Event Date",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700">{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: "participants",
      label: "Participants",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700">{value}</span>
        </div>
      ),
    },
    {
      key: "premium",
      label: "Premium",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-slate-900">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const config = statusConfig[value as keyof typeof statusConfig]
        const Icon = config?.icon || Clock
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config?.color || "bg-slate-100 text-slate-700"}`}>
            <Icon className="w-3 h-3" />
            {config?.label || value}
          </span>
        )
      },
    },
    {
      key: "id",
      label: "Actions",
      render: (value, row) => (
        <button
          className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
          title="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-12 bg-slate-200 rounded-xl" />
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
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Policies</h1>
        <p className="text-slate-600 mt-1">Manage and monitor all insurance policies</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Policies</p>
              <p className="text-xl font-bold text-slate-900">{policies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">
                {policies.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900">
                {policies.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Premium</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(policies.reduce((sum, p) => sum + parseFloat(p.premium), 0))}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by policy number, partner, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="claimed">Claimed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <DataTable
          columns={columns}
          data={filteredPolicies}
          idKey="id"
          searchQuery={searchQuery}
          onExport={() => {}}
          emptyMessage="No policies found matching your criteria"
        />
      </motion.div>
    </div>
  )
}
