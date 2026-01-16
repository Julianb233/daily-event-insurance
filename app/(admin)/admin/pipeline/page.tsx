"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  RefreshCw,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MoreVertical,
  ChevronRight,
  Flame,
  Snowflake,
  Sun,
  GripVertical,
  Plus,
  Settings,
} from "lucide-react"

// Types
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
  interestScore: number
  initialValue: string
  convertedValue: string | null
  createdAt: string
  updatedAt: string
  lastActivityAt: string | null
}

interface Stage {
  id: string
  name: string
  slug: string
  color: string
  sortOrder: number
  stageType: string
  isDefault?: boolean
  isTerminal?: boolean
}

// Default stages
const DEFAULT_STAGES: Stage[] = [
  { id: "1", name: "New", slug: "new", color: "#6366F1", sortOrder: 0, stageType: "active", isDefault: true },
  { id: "2", name: "Contacted", slug: "contacted", color: "#8B5CF6", sortOrder: 1, stageType: "active" },
  { id: "3", name: "Qualified", slug: "qualified", color: "#EC4899", sortOrder: 2, stageType: "active" },
  { id: "4", name: "Demo Scheduled", slug: "demo_scheduled", color: "#F59E0B", sortOrder: 3, stageType: "active" },
  { id: "5", name: "Proposal Sent", slug: "proposal_sent", color: "#10B981", sortOrder: 4, stageType: "active" },
  { id: "6", name: "Converted", slug: "converted", color: "#22C55E", sortOrder: 5, stageType: "won", isTerminal: true },
  { id: "7", name: "Lost", slug: "lost", color: "#EF4444", sortOrder: 6, stageType: "lost", isTerminal: true },
]

// Interest level icon
function InterestIcon({ level }: { level: string }) {
  switch (level) {
    case "hot":
      return <Flame className="h-3 w-3 text-red-500" />
    case "warm":
      return <Sun className="h-3 w-3 text-amber-500" />
    case "cold":
    default:
      return <Snowflake className="h-3 w-3 text-blue-400" />
  }
}

// Lead card component
function LeadCard({
  lead,
  onDragStart,
  isDragging,
}: {
  lead: Lead
  onDragStart: () => void
  isDragging: boolean
}) {
  const [showMenu, setShowMenu] = useState(false)

  const value = lead.convertedValue || lead.initialValue
  const formattedValue = parseFloat(value || "0").toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={onDragStart}
      className={`
        bg-white rounded-lg border border-slate-200 p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md hover:border-slate-300 transition-all group
        ${isDragging ? "shadow-lg ring-2 ring-violet-500" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <Link
              href={`/admin/leads/${lead.id}`}
              className="font-medium text-slate-900 hover:text-violet-600 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.firstName} {lead.lastName}
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <InterestIcon level={lead.interestLevel} />
              <span className="capitalize">{lead.interestLevel}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                View Details
              </Link>
              <button className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                Call Lead
              </button>
              <button className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                Send SMS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Business info */}
      {lead.businessName && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
          <Building2 className="h-3 w-3 text-slate-400" />
          <span className="truncate">{lead.businessName}</span>
        </div>
      )}

      {/* Contact info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Mail className="h-3 w-3" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Phone className="h-3 w-3" />
          <span>{lead.phone}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <DollarSign className="h-3 w-3" />
          <span>{formattedValue}</span>
        </div>
      </div>

      {/* Drag handle indicator */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-50">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
    </motion.div>
  )
}

// Stage column component
function StageColumn({
  stage,
  leads,
  onDropLead,
  draggingLead,
  setDraggingLead,
}: {
  stage: Stage
  leads: Lead[]
  onDropLead: (leadId: string, newStage: string) => void
  draggingLead: string | null
  setDraggingLead: (id: string | null) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (draggingLead) {
      onDropLead(draggingLead, stage.slug)
      setDraggingLead(null)
    }
  }

  // Calculate total value in this stage
  const totalValue = leads.reduce((sum, lead) => {
    const value = parseFloat(lead.convertedValue || lead.initialValue || "0")
    return sum + value
  }, 0)

  return (
    <div
      className={`
        flex-shrink-0 w-72 flex flex-col bg-slate-50 rounded-xl
        ${isDragOver ? "ring-2 ring-violet-500 bg-violet-50" : ""}
        transition-all
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Stage header */}
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-slate-800">{stage.name}</h3>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          ${totalValue.toLocaleString()} total value
        </div>
      </div>

      {/* Leads */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)]">
        <AnimatePresence mode="popLayout">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onDragStart={() => setDraggingLead(lead.id)}
              isDragging={draggingLead === lead.id}
            />
          ))}
        </AnimatePresence>

        {leads.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No leads in this stage
          </div>
        )}
      </div>

      {/* Add lead button */}
      <div className="p-2 border-t border-slate-200">
        <button className="w-full py-2 text-sm text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg flex items-center justify-center gap-1 transition-colors">
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES)
  const [leadsByStage, setLeadsByStage] = useState<Record<string, Lead[]>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [draggingLead, setDraggingLead] = useState<string | null>(null)

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      // Fetch stages
      const stagesRes = await fetch("/api/admin/pipeline/stages")
      const stagesData = await stagesRes.json()
      if (stagesData.stages) {
        setStages(stagesData.stages)
      }

      // Fetch leads
      const leadsRes = await fetch("/api/admin/pipeline/leads")
      const leadsData = await leadsRes.json()
      if (leadsData.byStage) {
        setLeadsByStage(leadsData.byStage)
      }
    } catch (error) {
      console.error("Failed to fetch pipeline data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // Handle lead drop (stage change)
  const handleDropLead = async (leadId: string, newStage: string) => {
    // Find the lead
    let movedLead: Lead | null = null
    let oldStage: string | null = null

    for (const [stage, leads] of Object.entries(leadsByStage)) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead) {
        movedLead = lead
        oldStage = stage
        break
      }
    }

    if (!movedLead || oldStage === newStage) return

    // Optimistic update
    setLeadsByStage((prev) => {
      const updated = { ...prev }
      updated[oldStage!] = prev[oldStage!].filter((l) => l.id !== leadId)
      updated[newStage] = [...(prev[newStage] || []), { ...movedLead!, status: newStage }]
      return updated
    })

    // API call
    try {
      const res = await fetch("/api/admin/pipeline/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, newStage }),
      })

      if (!res.ok) {
        throw new Error("Failed to move lead")
      }
    } catch (error) {
      console.error("Failed to move lead:", error)
      // Revert on error
      fetchData()
    }
  }

  // Calculate totals
  const totalLeads = Object.values(leadsByStage).reduce((sum, leads) => sum + leads.length, 0)
  const totalValue = Object.values(leadsByStage)
    .flat()
    .reduce((sum, lead) => sum + parseFloat(lead.convertedValue || lead.initialValue || "0"), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/leads"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Pipeline Board</h1>
                <p className="text-sm text-slate-500">
                  {totalLeads} leads · ${totalValue.toLocaleString()} total value
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <Link
                href="/admin/pipeline/settings"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <Link
                href="/admin/leads"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                View List
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pipeline board */}
      <div className="p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {stages
            .filter((s) => s.stageType !== "lost") // Show lost at the end
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                leads={leadsByStage[stage.slug] || []}
                onDropLead={handleDropLead}
                draggingLead={draggingLead}
                setDraggingLead={setDraggingLead}
              />
            ))}

          {/* Lost column at the end */}
          {stages
            .filter((s) => s.stageType === "lost")
            .map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                leads={leadsByStage[stage.slug] || []}
                onDropLead={handleDropLead}
                draggingLead={draggingLead}
                setDraggingLead={setDraggingLead}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
