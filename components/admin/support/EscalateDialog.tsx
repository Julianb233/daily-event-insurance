"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  AlertTriangle,
  Zap,
  Send,
  UserPlus,
  ChevronDown,
} from "lucide-react"
import {
  ESCALATION_REASONS,
  PRIORITY_CONFIG,
  type EscalationPriority,
  type EscalationReason,
  type TeamMember,
} from "@/lib/support/escalation-types"

interface EscalateDialogProps {
  isOpen: boolean
  onClose: () => void
  conversationId: string
  partnerName?: string
  onSuccess?: () => void
}

export function EscalateDialog({
  isOpen,
  onClose,
  conversationId,
  partnerName,
  onSuccess,
}: EscalateDialogProps) {
  const [reason, setReason] = useState<EscalationReason>("technical_issue")
  const [priority, setPriority] = useState<EscalationPriority>("normal")
  const [notes, setNotes] = useState("")
  const [assignTo, setAssignTo] = useState<string>("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch team members on open
  useEffect(() => {
    if (isOpen) {
      fetchTeamMembers()
      // Reset form
      setReason("technical_issue")
      setPriority("normal")
      setNotes("")
      setAssignTo("")
      setError(null)
    }
  }, [isOpen])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/admin/support/escalations?limit=1")
      if (response.ok) {
        const result = await response.json()
        setTeamMembers(result.data?.teamMembers || [])
      }
    } catch (err) {
      console.error("Error fetching team members:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/admin/support/conversations/${conversationId}/escalate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason,
            priority,
            notes: notes.trim() || undefined,
            assignTo: assignTo || undefined,
          }),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || "Failed to escalate conversation")
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Escalate Conversation
                    </h2>
                    {partnerName && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {partnerName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Reason Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Escalation Reason *
                  </label>
                  <div className="relative">
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value as EscalationReason)}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all cursor-pointer"
                    >
                      {ESCALATION_REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Priority Level *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["urgent", "high", "normal", "low"] as EscalationPriority[]).map(
                      (p) => {
                        const config = PRIORITY_CONFIG[p]
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              priority === p
                                ? `${config.bgColor} ${config.color} ring-2 ring-offset-2 ring-violet-500`
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1">
                              {p === "urgent" && <Zap className="w-3.5 h-3.5" />}
                              {p === "high" && <AlertTriangle className="w-3.5 h-3.5" />}
                              {config.label}
                            </span>
                          </button>
                        )
                      }
                    )}
                  </div>
                </div>

                {/* Assign To (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Assign To (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Leave unassigned</option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide context about the issue..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Escalating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Escalate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
