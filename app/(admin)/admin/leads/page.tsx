"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Phone,
  Mail,
  Building2,
  Calendar,
  Plus,
  Flame,
  Thermometer,
  Snowflake,
  Eye,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { DataTable, Column } from "@/components/admin/DataTable"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string | null
  businessType: string | null
  status: string
  interestLevel: string
  source: string
  interestScore: number
  initialValue: string
  convertedValue: string | null
  lastActivityAt: string | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-purple-100 text-purple-700" },
  qualified: { label: "Qualified", color: "bg-teal-100 text-teal-700" },
  demo_scheduled: { label: "Demo Scheduled", color: "bg-amber-100 text-amber-700" },
  proposal_sent: { label: "Proposal Sent", color: "bg-orange-100 text-orange-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-slate-100 text-slate-700" },
  dnc: { label: "Do Not Contact", color: "bg-red-100 text-red-700" },
}

const interestConfig: Record<string, { label: string; color: string; icon: typeof Flame }> = {
  hot: { label: "Hot", color: "bg-red-100 text-red-700", icon: Flame },
  warm: { label: "Warm", color: "bg-amber-100 text-amber-700", icon: Thermometer },
  cold: { label: "Cold", color: "bg-blue-100 text-blue-700", icon: Snowflake },
}

const sourceOptions = [
  { value: "all", label: "All Sources" },
  { value: "website_quote", label: "Website Quote" },
  { value: "partner_referral", label: "Partner Referral" },
  { value: "cold_list", label: "Cold List" },
  { value: "ad_campaign", label: "Ad Campaign" },
]

function formatCurrency(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function generateMockLeads(): Lead[] {
  const leads: Lead[] = []
  const statuses = ["new", "contacted", "qualified", "demo_scheduled", "proposal_sent", "converted", "lost"]
  const interestLevels = ["cold", "warm", "hot"]
  const sources = ["website_quote", "partner_referral", "cold_list", "ad_campaign"]
  const businessTypes = ["gym", "climbing", "rental", "adventure", "fitness"]

  const firstNames = ["John", "Sarah", "Mike", "Emily", "Chris", "Lisa", "Tom", "Anna", "David", "Rachel"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Lee"]
  const businesses = ["Peak Fitness", "Adventure Co", "Urban Gym", "Mountain Sports", "Elite Training", "Summit Athletics"]

  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const interestLevel = interestLevels[Math.floor(Math.random() * interestLevels.length)]
    
    leads.push({
      id: `lead_${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      businessName: Math.random() > 0.3 ? businesses[Math.floor(Math.random() * businesses.length)] : null,
      businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
      status,
      interestLevel,
      source: sources[Math.floor(Math.random() * sources.length)],
      interestScore: Math.floor(Math.random() * 100),
      initialValue: "40.00",
      convertedValue: status === "converted" ? (Math.random() * 60 + 40).toFixed(2) : null,
      lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [interestFilter, setInterestFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      const response = await fetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const result = await response.json()
      setLeads(result.data || generateMockLeads())
    } catch (err) {
      console.error("Error fetching leads:", err)
      setLeads(generateMockLeads())
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === "" ||
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.businessName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesInterest = interestFilter === "all" || lead.interestLevel === interestFilter
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter
    const matchesBusinessType = businessTypeFilter === "all" || lead.businessType === businessTypeFilter

    return matchesSearch && matchesStatus && matchesInterest && matchesSource && matchesBusinessType
  })

  const uniqueBusinessTypes = Array.from(new Set(leads.map((l) => l.businessType).filter((t): t is string => Boolean(t))))

  const columns: Column<Lead>[] = [
    {
      key: "firstName",
      label: "Name",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "businessName",
      label: "Business",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-700">{value || "—"}</p>
            {row.businessType && (
              <p className="text-xs text-slate-500 capitalize">{row.businessType}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const config = statusConfig[value] || { label: value, color: "bg-slate-100 text-slate-700" }
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        )
      },
    },
    {
      key: "interestLevel",
      label: "Interest",
      sortable: true,
      render: (value) => {
        const config = interestConfig[value] || { label: value, color: "bg-slate-100 text-slate-700", icon: Thermometer }
        const Icon = config.icon
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        )
      },
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-slate-600 capitalize">{value.replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "lastActivityAt",
      label: "Last Contact",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/leads/${row.id}`}
            className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <a
            href={`tel:${row.phone}`}
            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${row.email}`}
            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      ),
    },
  ]

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.interestLevel === "hot").length,
    converted: leads.filter((l) => l.status === "converted").length,
    totalValue: leads.reduce((sum, l) => sum + parseFloat(l.convertedValue || l.initialValue), 0),
  }

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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600 mt-1">Manage call center leads and conversions</p>
        </div>
        <Link
          href="/admin/leads/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Lead
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Hot Leads</p>
              <p className="text-xl font-bold text-slate-900">{stats.hot}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Converted</p>
              <p className="text-xl font-bold text-slate-900">{stats.converted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pipeline Value</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              <option value="all">All Interest</option>
              {Object.entries(interestConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none px-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              {sourceOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              <option value="all">All Business Types</option>
              {uniqueBusinessTypes.map((type) => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <DataTable
          columns={columns}
          data={filteredLeads}
          idKey="id"
          searchQuery={searchQuery}
          onExport={() => {}}
          emptyMessage="No leads found matching your criteria"
        />
      </motion.div>
    </div>
  )
}
