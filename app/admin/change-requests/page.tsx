"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Check,
  X,
  PlayCircle,
  ExternalLink,
  Palette,
  FileText,
  RefreshCw,
} from "lucide-react"

interface ChangeRequest {
  id: string
  requestNumber: string
  requestType: string
  status: string
  partnerNotes: string | null
  currentBranding: Record<string, string> | null
  requestedBranding: Record<string, string> | null
  currentContent: Record<string, string> | null
  requestedContent: Record<string, string> | null
  reviewNotes: string | null
  rejectionReason: string | null
  submittedAt: string
  reviewedAt: string | null
  completedAt: string | null
  partnerId: string
  micrositeId: string | null
  partnerName: string | null
  partnerContact: string | null
  partnerEmail: string | null
  micrositeSubdomain: string | null
  micrositeSiteName: string | null
}

interface StatusCounts {
  pending: number
  in_review: number
  approved: number
  rejected: number
  completed: number
  total: number
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  pending: { color: "text-amber-600", icon: Clock, bg: "bg-amber-100" },
  in_review: { color: "text-blue-600", icon: Eye, bg: "bg-blue-100" },
  approved: { color: "text-green-600", icon: CheckCircle, bg: "bg-green-100" },
  rejected: { color: "text-red-600", icon: XCircle, bg: "bg-red-100" },
  completed: { color: "text-teal-600", icon: Check, bg: "bg-teal-100" },
}

export default function AdminChangeRequestsPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>([])
  const [counts, setCounts] = useState<StatusCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionNotes, setActionNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const url = filter
        ? `/api/admin/change-requests?status=${filter}`
        : "/api/admin/change-requests"
      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setRequests(data.requests)
        setCounts(data.counts)
      } else {
        setError(data.error || "Failed to fetch requests")
      }
    } catch {
      setError("Failed to fetch requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [filter])

  const handleAction = async (action: string) => {
    if (!selectedRequest) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/change-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewNotes: actionNotes || undefined,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      })

      const data = await res.json()
      if (data.success) {
        // If approved, apply changes
        if (action === "approve") {
          await fetch(`/api/admin/change-requests/${selectedRequest.id}/apply`, {
            method: "POST",
          })
        }
        setSelectedRequest(null)
        setActionNotes("")
        setRejectionReason("")
        fetchRequests()
      } else {
        setError(data.error || "Action failed")
      }
    } catch {
      setError("Action failed")
    } finally {
      setActionLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === "branding") return <Palette className="w-4 h-4" />
    if (type === "content") return <FileText className="w-4 h-4" />
    return <RefreshCw className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Microsite Change Requests
              </h1>
              <p className="text-sm text-slate-500">
                Review and manage partner change requests
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {counts && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {Object.entries(counts).filter(([key]) => key !== "total").map(([status, count]) => {
              const config = statusConfig[status] || { color: "text-gray-600", icon: Clock, bg: "bg-gray-100" }
              const Icon = config.icon
              return (
                <button
                  key={status}
                  onClick={() => setFilter(filter === status ? null : status)}
                  className={`p-4 rounded-xl border transition ${
                    filter === status
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-slate-900">{count}</p>
                      <p className="text-xs text-slate-500 capitalize">{status.replace("_", " ")}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-slate-900 mb-2">No change requests</h2>
            <p className="text-slate-500">
              {filter ? `No ${filter.replace("_", " ")} requests found` : "No requests have been submitted yet"}
            </p>
            {filter && (
              <button
                onClick={() => setFilter(null)}
                className="mt-4 text-teal-600 hover:text-teal-700"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Request
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Partner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => {
                  const config = statusConfig[req.status] || statusConfig.pending
                  const Icon = config.icon
                  return (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm text-slate-900">{req.requestNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{req.partnerName || "Unknown"}</p>
                        <p className="text-sm text-slate-500">{req.partnerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(req.requestType)}
                          <span className="text-sm text-slate-600 capitalize">{req.requestType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {req.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !actionLoading && setSelectedRequest(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedRequest.requestNumber}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedRequest.partnerName} - {selectedRequest.requestType} request
                </p>
              </div>
              <button
                onClick={() => !actionLoading && setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Current vs Requested */}
              {selectedRequest.requestedBranding && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Branding Changes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-2">Current</p>
                      <div className="space-y-2">
                        {selectedRequest.currentBranding && Object.entries(selectedRequest.currentBranding).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-slate-500 capitalize">{key}: </span>
                            {key.includes("Color") ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-4 h-4 rounded" style={{ backgroundColor: value }} />
                                {value}
                              </span>
                            ) : (
                              <span className="text-slate-900">{value || "Not set"}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <p className="text-xs text-teal-700 mb-2">Requested</p>
                      <div className="space-y-2">
                        {Object.entries(selectedRequest.requestedBranding).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-slate-500 capitalize">{key}: </span>
                            {key.includes("Color") ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-4 h-4 rounded" style={{ backgroundColor: value }} />
                                {value}
                              </span>
                            ) : (
                              <span className="text-slate-900">{value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Partner Notes */}
              {selectedRequest.partnerNotes && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Partner Notes</h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {selectedRequest.partnerNotes}
                  </p>
                </div>
              )}

              {/* Admin Notes Input */}
              {["pending", "in_review"].includes(selectedRequest.status) && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add notes about this review..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              )}

              {/* Rejection Reason */}
              {["pending", "in_review"].includes(selectedRequest.status) && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Rejection Reason (required if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this request is being rejected..."
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t bg-slate-50 flex items-center justify-end gap-3">
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAction("start_review")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start Review
                  </button>
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Approve & Apply
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
              {selectedRequest.status === "in_review" && (
                <>
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Approve & Apply
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
              {selectedRequest.status === "approved" && (
                <button
                  onClick={() => handleAction("complete")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
              {actionLoading && (
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
