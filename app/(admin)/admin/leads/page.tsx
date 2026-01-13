"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Phone, 
  MessageSquare, 
  Plus, 
  Search, 
  ArrowLeft,
  MoreHorizontal,
  Filter,
  RefreshCw
} from "lucide-react"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string | null
  businessType: string | null
  source: string
  status: string
  interestLevel: string
  initialValue: string
  convertedValue: string | null
  createdAt: string
  lastContact: {
    channel: string
    createdAt: string
    disposition: string | null
  } | null
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [interestFilter, setInterestFilter] = useState("")

  useEffect(() => {
    fetchLeads()
  }, [statusFilter, interestFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("limit", "50")
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (interestFilter) params.set("interestLevel", interestFilter)

      const response = await fetch(`/api/admin/leads?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setLeads(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLeads()
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      qualified: "bg-purple-100 text-purple-700",
      demo_scheduled: "bg-indigo-100 text-indigo-700",
      proposal_sent: "bg-orange-100 text-orange-700",
      converted: "bg-green-100 text-green-700",
      lost: "bg-slate-100 text-slate-600",
      dnc: "bg-red-100 text-red-700",
    }
    return styles[status] || "bg-slate-100 text-slate-700"
  }

  const getInterestStyle = (level: string) => {
    const styles: Record<string, string> = {
      cold: "bg-blue-50 text-blue-600 border-blue-200",
      warm: "bg-orange-50 text-orange-600 border-orange-200",
      hot: "bg-red-50 text-red-600 border-red-200",
    }
    return styles[level] || ""
  }

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/call-center"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">All Leads</h1>
            <p className="text-sm text-slate-500">{leads.length} total</p>
          </div>
        </div>
        <Link 
          href="/admin/leads/new"
          className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Link>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4"
      >
        <form onSubmit={handleSearch} className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, phone, business..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="demo_scheduled">Demo</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="">All Interest</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Search
          </button>
          <button 
            type="button"
            onClick={fetchLeads}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </form>
      </motion.div>

      {/* Leads List */}
      <div className="space-y-2">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
            <p className="text-slate-500 mb-4">No leads found</p>
            <Link 
              href="/admin/leads/new"
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 inline-block"
            >
              Add Your First Lead
            </Link>
          </div>
        ) : (
          leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-center justify-between">
                {/* Left: Lead Info */}
                <Link 
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  {/* Interest Indicator */}
                  <div 
                    className={`w-1 h-12 rounded-full ${
                      lead.interestLevel === "hot" 
                        ? "bg-red-500" 
                        : lead.interestLevel === "warm"
                        ? "bg-orange-400"
                        : "bg-blue-300"
                    }`}
                  />
                  
                  {/* Name & Business */}
                  <div className="min-w-[200px]">
                    <p className="font-semibold text-slate-900">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {lead.businessName || lead.businessType || "No business"}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="hidden md:block min-w-[180px]">
                    <p className="text-sm text-slate-600">{lead.phone}</p>
                    <p className="text-sm text-slate-400 truncate max-w-[160px]">
                      {lead.email}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(lead.status)}`}>
                    {lead.status.replace("_", " ")}
                  </span>

                  {/* Interest Level */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getInterestStyle(lead.interestLevel)}`}>
                    {lead.interestLevel === "hot" && "🔥 "}
                    {lead.interestLevel}
                  </span>

                  {/* Value */}
                  <div className="hidden lg:block text-right min-w-[80px]">
                    <p className="text-sm font-medium">
                      ${lead.initialValue}
                      {lead.convertedValue && (
                        <span className="text-green-600"> → ${lead.convertedValue}</span>
                      )}
                    </p>
                  </div>

                  {/* Last Contact */}
                  <div className="hidden lg:block text-right min-w-[60px]">
                    {lead.lastContact ? (
                      <p className="text-sm text-slate-400">
                        {formatTime(lead.lastContact.createdAt)}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-300">—</p>
                    )}
                  </div>
                </Link>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <button 
                    className="p-2 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600"
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                    title="SMS"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
