"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Phone,
  PhoneCall,
  MessageSquare,
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
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
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

interface Toast {
  id: string
  type: "success" | "error"
  message: string
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

const smsTemplates = [
  { id: "intro", name: "Introduction", message: "Hi {firstName}, this is {agentName} from Daily Event Insurance. I wanted to follow up on your recent quote request. Do you have a moment to discuss your coverage options?" },
  { id: "followup", name: "Follow Up", message: "Hi {firstName}, just checking in about your event insurance needs. We have some great options that might work for {businessName}. Let me know if you'd like to chat!" },
  { id: "quote_reminder", name: "Quote Reminder", message: "Hi {firstName}, your personalized quote for event insurance is ready. It only takes 5 minutes to get covered. Ready to protect your events?" },
  { id: "promo", name: "Special Offer", message: "Hi {firstName}, we have a special offer for new customers this month - 15% off your first policy! Would you like to learn more?" },
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

  // Call and SMS states
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null)

  // SMS Modal state
  const [smsModalOpen, setSmsModalOpen] = useState(false)
  const [smsLead, setSmsLead] = useState<Lead | null>(null)
  const [smsMessage, setSmsMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isSendingSms, setIsSendingSms] = useState(false)

  // Bulk actions state
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [isBulkCalling, setIsBulkCalling] = useState(false)
  const [isBulkSmsing, setIsBulkSmsing] = useState(false)

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    fetchLeads()
  }, [])

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1))
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  const addToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, type, message }])
  }

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

  async function initiateCall(lead: Lead) {
    if (lead.status === "dnc") return

    setCallingLeadId(lead.id)
    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callType: "outbound_followup" }),
      })
      if (response.ok) {
        addToast("success", `Call initiated to ${lead.firstName} ${lead.lastName}`)
        // Navigate to lead detail to see the call
        router.push(`/admin/leads/${lead.id}`)
      } else {
        throw new Error("Failed to initiate call")
      }
    } catch (err) {
      console.error("Error initiating call:", err)
      addToast("error", `Failed to call ${lead.firstName} ${lead.lastName}`)
    } finally {
      setCallingLeadId(null)
    }
  }

  const openSmsModal = (lead: Lead) => {
    if (lead.status === "dnc") return
    setSmsLead(lead)
    setSmsMessage("")
    setSelectedTemplate("")
    setSmsModalOpen(true)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = smsTemplates.find(t => t.id === templateId)
    if (template && smsLead) {
      let message = template.message
        .replace("{firstName}", smsLead.firstName)
        .replace("{businessName}", smsLead.businessName || "your business")
        .replace("{agentName}", "Your Agent")
      setSmsMessage(message)
    }
  }

  const handleSendSms = async () => {
    if (!smsLead || !smsMessage.trim()) return

    setIsSendingSms(true)
    try {
      const response = await fetch(`/api/admin/leads/${smsLead.id}/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: smsMessage,
          templateId: selectedTemplate || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send SMS")
      }

      addToast("success", `SMS sent to ${smsLead.firstName} ${smsLead.lastName}`)
      setSmsModalOpen(false)
      setSmsLead(null)
      setSmsMessage("")
    } catch (err) {
      console.error("Error sending SMS:", err)
      addToast("error", `Failed to send SMS to ${smsLead.firstName} ${smsLead.lastName}`)
    } finally {
      setIsSendingSms(false)
    }
  }

  const handleBulkCall = async () => {
    if (selectedLeads.length === 0) return

    setIsBulkCalling(true)
    try {
      const response = await fetch("/api/admin/leads/bulk-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedLeads }),
      })

      if (!response.ok) {
        throw new Error("Failed to initiate bulk calls")
      }

      addToast("success", `Bulk call initiated for ${selectedLeads.length} leads`)
      setSelectedLeads([])
    } catch (err) {
      console.error("Error initiating bulk calls:", err)
      addToast("error", "Failed to initiate bulk calls")
    } finally {
      setIsBulkCalling(false)
    }
  }

  const handleBulkSms = async () => {
    if (selectedLeads.length === 0) return

    setIsBulkSmsing(true)
    try {
      const response = await fetch("/api/admin/leads/bulk-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: selectedLeads,
          templateId: "intro",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send bulk SMS")
      }

      addToast("success", `Bulk SMS sent to ${selectedLeads.length} leads`)
      setSelectedLeads([])
    } catch (err) {
      console.error("Error sending bulk SMS:", err)
      addToast("error", "Failed to send bulk SMS")
    } finally {
      setIsBulkSmsing(false)
    }
  }

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const toggleAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id))
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
      key: "select",
      label: "",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedLeads.includes(row.id)}
          onChange={() => toggleLeadSelection(row.id)}
          className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
        />
      ),
      className: "w-12",
    },
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
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/leads/${row.id}`}
            className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => initiateCall(row)}
            disabled={callingLeadId === row.id || row.status === "dnc"}
            className={`p-2 rounded-lg transition-colors ${
              callingLeadId === row.id
                ? "bg-green-100 text-green-600"
                : row.status === "dnc"
                ? "opacity-50 cursor-not-allowed text-slate-400"
                : "hover:bg-green-100 text-green-600"
            }`}
            title="AI Call"
          >
            {callingLeadId === row.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PhoneCall className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openSmsModal(row)}
            disabled={row.status === "dnc"}
            className={`p-2 rounded-lg transition-colors ${
              row.status === "dnc"
                ? "opacity-50 cursor-not-allowed text-slate-400"
                : "hover:bg-blue-100 text-blue-600"
            }`}
            title="Send SMS"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <a
            href={`mailto:${row.email}`}
            className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
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
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
                toast.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SMS Modal */}
      <AnimatePresence>
        {smsModalOpen && smsLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSmsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Send SMS</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    To: {smsLead.firstName} {smsLead.lastName} ({smsLead.phone})
                  </p>
                </div>
                <button
                  onClick={() => setSmsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Template (optional)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  >
                    <option value="">Select a template...</option>
                    {smsTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {smsMessage.length} / 160 characters
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <button
                  onClick={() => setSmsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSms}
                  disabled={!smsMessage.trim() || isSendingSms}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingSms ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Send SMS
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="flex items-center gap-3 flex-wrap">
          {selectedLeads.length > 0 && (
            <>
              <button
                onClick={handleBulkCall}
                disabled={isBulkCalling}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all disabled:opacity-50"
              >
                {isBulkCalling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PhoneCall className="w-4 h-4" />
                )}
                Bulk Call ({selectedLeads.length})
              </button>
              <button
                onClick={handleBulkSms}
                disabled={isBulkSmsing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {isBulkSmsing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                Bulk SMS ({selectedLeads.length})
              </button>
            </>
          )}
          <Link
            href="/admin/leads/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </Link>
        </div>
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

      {/* Select All Row */}
      {filteredLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex items-center gap-3 mb-4 px-6"
        >
          <input
            type="checkbox"
            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
            onChange={toggleAllLeads}
            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <span className="text-sm text-slate-600">
            {selectedLeads.length > 0
              ? `${selectedLeads.length} lead${selectedLeads.length > 1 ? "s" : ""} selected`
              : "Select all"}
          </span>
        </motion.div>
      )}

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
