"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Mail,
  Building2,
  Calendar,
  Clock,
  User,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
  Activity,
  Send,
  Play,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { CallPlayer } from "@/components/admin/CallPlayer"

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
  city: string | null
  state: string | null
  zipCode: string | null
  timezone: string | null
  createdAt: string
  updatedAt: string
}

interface Communication {
  id: string
  type: "call" | "sms" | "email"
  direction: "inbound" | "outbound"
  status: string
  duration?: number
  transcript?: string
  recordingUrl?: string
  message?: string
  createdAt: string
  disposition?: string
  sentiment?: string
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

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [communications, setCommunications] = useState<Communication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCallInProgress, setIsCallInProgress] = useState(false)
  const [isSendingSms, setIsSendingSms] = useState(false)
  const [smsMessage, setSmsMessage] = useState("")
  const [showSmsForm, setShowSmsForm] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<Communication | null>(null)

  useEffect(() => {
    fetchLeadData()
  }, [leadId])

  async function fetchLeadData() {
    try {
      const [leadResponse, commsResponse] = await Promise.all([
        fetch(`/api/admin/leads/${leadId}`),
        fetch(`/api/admin/leads/${leadId}/communications`),
      ])

      if (leadResponse.ok) {
        const leadData = await leadResponse.json()
        setLead(leadData.data || generateMockLead())
      } else {
        setLead(generateMockLead())
      }

      if (commsResponse.ok) {
        const commsData = await commsResponse.json()
        setCommunications(commsData.data || generateMockCommunications())
      } else {
        setCommunications(generateMockCommunications())
      }
    } catch (err) {
      console.error("Error fetching lead data:", err)
      setLead(generateMockLead())
      setCommunications(generateMockCommunications())
    } finally {
      setIsLoading(false)
    }
  }

  function generateMockLead(): Lead {
    return {
      id: leadId,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "+15551234567",
      businessName: "Peak Fitness",
      businessType: "gym",
      status: "contacted",
      interestLevel: "warm",
      source: "website_quote",
      interestScore: 65,
      initialValue: "40.00",
      convertedValue: null,
      lastActivityAt: new Date().toISOString(),
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      timezone: "America/Los_Angeles",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  function generateMockCommunications(): Communication[] {
    return [
      {
        id: "comm-1",
        type: "call",
        direction: "outbound",
        status: "completed",
        duration: 185,
        transcript: "Hi John, this is Sarah from Daily Event Insurance...",
        recordingUrl: "",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        disposition: "callback",
        sentiment: "positive",
      },
      {
        id: "comm-2",
        type: "sms",
        direction: "outbound",
        status: "delivered",
        message: "Hi John! Following up on our conversation about the partnership program. Let me know if you have any questions!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-3",
        type: "sms",
        direction: "inbound",
        status: "received",
        message: "Thanks for reaching out! I'm interested but need to discuss with my business partner first.",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  async function initiateCall() {
    if (!lead) return
    setIsCallInProgress(true)

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callType: "outbound_followup",
          agentId: "sarah-ai",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh communications after call
        setTimeout(() => {
          fetchLeadData()
          setIsCallInProgress(false)
        }, 3000)
      } else {
        throw new Error("Failed to initiate call")
      }
    } catch (err) {
      console.error("Error initiating call:", err)
      alert("Failed to initiate call. Please try again.")
      setIsCallInProgress(false)
    }
  }

  async function sendSms() {
    if (!lead || !smsMessage.trim()) return
    setIsSendingSms(true)

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: smsMessage,
          templateId: null,
        }),
      })

      if (response.ok) {
        setSmsMessage("")
        setShowSmsForm(false)
        fetchLeadData() // Refresh communications
      } else {
        throw new Error("Failed to send SMS")
      }
    } catch (err) {
      console.error("Error sending SMS:", err)
      alert("Failed to send SMS. Please try again.")
    } finally {
      setIsSendingSms(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-slate-200 rounded-xl" />
              <div className="h-96 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">Lead not found</h3>
          <p className="text-slate-500 mt-1">The requested lead could not be found.</p>
          <Link
            href="/admin/leads"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[lead.status] || { label: lead.status, color: "bg-slate-100 text-slate-700" }
  const interestInfo = interestConfig[lead.interestLevel] || { label: lead.interestLevel, color: "bg-slate-100 text-slate-700", icon: Thermometer }
  const InterestIcon = interestInfo.icon

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                {lead.firstName} {lead.lastName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${interestInfo.color}`}>
                <InterestIcon className="w-3 h-3" />
                {interestInfo.label}
              </span>
            </div>
            {lead.businessName && (
              <p className="text-slate-600 mt-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {lead.businessName}
                {lead.businessType && (
                  <span className="text-slate-400">• {lead.businessType}</span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={initiateCall}
              disabled={isCallInProgress || lead.status === "dnc"}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-lg transition-all ${
                isCallInProgress
                  ? "bg-amber-500 text-white cursor-wait"
                  : lead.status === "dnc"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-green-500/25 hover:shadow-xl"
              }`}
            >
              {isCallInProgress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calling...
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  Call Lead
                </>
              )}
            </button>
            <button
              onClick={() => setShowSmsForm(!showSmsForm)}
              disabled={lead.status === "dnc"}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-lg transition-all ${
                lead.status === "dnc"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-500/25 hover:shadow-xl"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Send SMS
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SMS Form */}
          {showSmsForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-100"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Send SMS to {lead.firstName}</h3>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-500">
                  {smsMessage.length}/160 characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSmsForm(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendSms}
                    disabled={isSendingSms || !smsMessage.trim()}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSendingSms ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Communication History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-600" />
                Communication History
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {communications.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No communications yet
                </div>
              ) : (
                communications.map((comm) => (
                  <div key={comm.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          comm.type === "call"
                            ? "bg-green-100"
                            : comm.type === "sms"
                            ? "bg-violet-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {comm.type === "call" ? (
                          <Phone className="w-5 h-5 text-green-600" />
                        ) : comm.type === "sms" ? (
                          <MessageSquare className="w-5 h-5 text-violet-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900 capitalize">
                            {comm.direction} {comm.type}
                          </span>
                          {comm.type === "call" && comm.duration && (
                            <span className="text-sm text-slate-500">
                              {formatDuration(comm.duration)}
                            </span>
                          )}
                          {comm.disposition && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
                              {comm.disposition}
                            </span>
                          )}
                          {comm.sentiment && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                comm.sentiment === "positive"
                                  ? "bg-green-100 text-green-700"
                                  : comm.sentiment === "negative"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {comm.sentiment}
                            </span>
                          )}
                        </div>
                        {comm.message && (
                          <p className="text-sm text-slate-600 mb-2">{comm.message}</p>
                        )}
                        {comm.type === "call" && comm.recordingUrl && (
                          <button
                            onClick={() => setSelectedRecording(comm)}
                            className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700"
                          >
                            <Play className="w-4 h-4" />
                            Play Recording
                          </button>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(comm.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Call Recording Player */}
          {selectedRecording && selectedRecording.recordingUrl && (
            <CallPlayer
              recordingUrl={selectedRecording.recordingUrl}
              duration={selectedRecording.duration || 0}
              callerName={`${lead.firstName} ${lead.lastName}`}
              transcript={selectedRecording.transcript || undefined}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="text-violet-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${lead.phone}`} className="text-violet-600 hover:underline">
                  {lead.phone}
                </a>
              </div>
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {[lead.city, lead.state, lead.zipCode].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              {lead.timezone && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{lead.timezone}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lead Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Lead Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Interest Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full"
                      style={{ width: `${lead.interestScore}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-900">{lead.interestScore}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Initial Value</span>
                <span className="font-semibold text-slate-900">${lead.initialValue}</span>
              </div>
              {lead.convertedValue && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Converted Value</span>
                  <span className="font-semibold text-green-600">${lead.convertedValue}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {lead.source.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-600">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Activity</span>
                <span className="text-slate-600">{formatDate(lead.lastActivityAt)}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                <Edit2 className="w-4 h-4" />
                Edit Lead
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Follow-up
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                <FileText className="w-4 h-4" />
                Add Note
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                <XCircle className="w-4 h-4" />
                Mark as DNC
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
