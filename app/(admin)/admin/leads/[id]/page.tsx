"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  Phone, 
  MessageSquare, 
  Mail,
  MapPin,
  Building,
  Clock,
  Play,
  Send
} from "lucide-react"

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string | null
  businessType: string | null
  city: string | null
  state: string | null
  source: string
  status: string
  interestLevel: string
  interestScore: number
  initialValue: string
  convertedValue: string | null
  createdAt: string
  updatedAt: string
  communications: Communication[]
  conversionEvents: ConversionEvent[]
}

interface Communication {
  id: string
  channel: string
  direction: string
  callDuration: number | null
  callSummary: string | null
  callRecordingUrl: string | null
  smsContent: string | null
  disposition: string | null
  outcome: string | null
  createdAt: string
}

interface ConversionEvent {
  id: string
  eventType: string
  eventValue: string | null
  createdAt: string
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [smsMessage, setSmsMessage] = useState("")
  const [sendingSms, setSendingSms] = useState(false)
  const [activeTab, setActiveTab] = useState<"activity" | "calls" | "sms">("activity")

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`)
      const data = await response.json()
      if (data.success) {
        setLead(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchLead()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const initiateCall = async () => {
    try {
      const response = await fetch(`/api/admin/leads/${id}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await response.json()
      alert(data.data?.message || "Call initiated")
    } catch (error) {
      console.error("Failed to initiate call:", error)
    }
  }

  const sendSms = async () => {
    if (!smsMessage.trim()) return
    setSendingSms(true)
    try {
      await fetch(`/api/admin/leads/${id}/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: smsMessage }),
      })
      setSmsMessage("")
      fetchLead()
    } catch (error) {
      console.error("Failed to send SMS:", error)
    } finally {
      setSendingSms(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      qualified: "bg-purple-100 text-purple-700",
      demo_scheduled: "bg-indigo-100 text-indigo-700",
      converted: "bg-green-100 text-green-700",
      lost: "bg-slate-100 text-slate-600",
    }
    return styles[status] || "bg-slate-100"
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 mb-4">Lead not found</p>
        <Link 
          href="/admin/leads"
          className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 inline-block"
        >
          Back to Leads
        </Link>
      </div>
    )
  }

  const filteredComms = activeTab === "activity" 
    ? lead.communications 
    : lead.communications.filter(c => c.channel === activeTab.replace("s", ""))

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/leads"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-sm text-slate-500">
              {lead.businessName || lead.businessType || "Individual"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg font-medium ${getStatusStyle(lead.status)}`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="demo_scheduled">Demo Scheduled</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
            <option value="dnc">Do Not Call</option>
          </select>
          <button 
            onClick={initiateCall}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="space-y-4">
          {/* Contact Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <a href={`tel:${lead.phone}`} className="text-violet-600 hover:underline">
                  {lead.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="text-violet-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{[lead.city, lead.state].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {lead.businessType && (
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span className="capitalize">{lead.businessType}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lead Score */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Lead Score</h3>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                lead.interestLevel === "hot" 
                  ? "bg-red-100 text-red-700" 
                  : lead.interestLevel === "warm"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {lead.interestLevel === "hot" && "🔥 "}
                {lead.interestLevel.toUpperCase()}
              </span>
              <span className="text-2xl font-bold">{lead.interestScore || 0}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  lead.interestLevel === "hot" 
                    ? "bg-red-500" 
                    : lead.interestLevel === "warm"
                    ? "bg-orange-400"
                    : "bg-blue-400"
                }`}
                style={{ width: `${lead.interestScore || 0}%` }}
              />
            </div>
          </motion.div>

          {/* Value Tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Value</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Initial</p>
                <p className="text-xl font-bold">${lead.initialValue}</p>
              </div>
              <div className="text-2xl text-slate-300">→</div>
              <div>
                <p className="text-sm text-slate-500">Converted</p>
                <p className={`text-xl font-bold ${lead.convertedValue ? "text-green-600" : "text-slate-300"}`}>
                  {lead.convertedValue ? `$${lead.convertedValue}` : "—"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick SMS */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Quick SMS</h3>
            <textarea
              placeholder="Type a message..."
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none mb-3"
            />
            <button 
              onClick={sendSms} 
              disabled={!smsMessage.trim() || sendingSms}
              className="w-full px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {sendingSms ? "Sending..." : "Send SMS"}
            </button>
          </motion.div>
        </div>

        {/* Right Column - Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100"
        >
          {/* Tabs */}
          <div className="border-b border-slate-100 p-4">
            <div className="flex gap-2">
              {[
                { key: "activity", label: "Activity" },
                { key: "calls", label: `Calls (${lead.communications.filter(c => c.channel === "call").length})` },
                { key: "sms", label: `SMS (${lead.communications.filter(c => c.channel === "sms").length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {filteredComms.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No activity yet. Start by making a call!
              </p>
            ) : (
              filteredComms.map((comm) => (
                <div 
                  key={comm.id}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    comm.channel === "call" ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    {comm.channel === "call" ? (
                      <Phone className="h-5 w-5 text-green-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">
                        {comm.direction === "outbound" ? "Outbound" : "Inbound"} {comm.channel}
                        {comm.callDuration && ` (${Math.floor(comm.callDuration / 60)}:${String(comm.callDuration % 60).padStart(2, "0")})`}
                      </p>
                      <span className="text-sm text-slate-400">
                        {formatDate(comm.createdAt)}
                      </span>
                    </div>
                    {comm.disposition && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-600">
                        {comm.disposition}
                      </span>
                    )}
                    {comm.callSummary && (
                      <p className="text-sm text-slate-600 mt-2">{comm.callSummary}</p>
                    )}
                    {comm.smsContent && (
                      <p className="text-sm text-slate-600 mt-2 bg-white p-2 rounded">
                        {comm.smsContent}
                      </p>
                    )}
                    {comm.callRecordingUrl && (
                      <button className="mt-2 px-3 py-1.5 rounded-lg text-sm text-violet-600 hover:bg-violet-50 flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        Play Recording
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
