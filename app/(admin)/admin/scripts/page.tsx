"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Building2,
  Flame,
  Thermometer,
  Snowflake,
  Volume2,
  ArrowUpCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { DataTable, Column } from "@/components/admin/DataTable"

interface AgentScript {
  id: string
  name: string
  description: string | null
  businessType: string | null
  interestLevel: string | null
  geographicRegion: string | null
  systemPrompt: string
  openingScript: string
  keyPoints: string | null
  objectionHandlers: string | null
  closingScript: string | null
  maxCallDuration: number
  voiceId: string
  isActive: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

const interestConfig: Record<string, { label: string; color: string; icon: typeof Flame }> = {
  hot: { label: "Hot", color: "bg-red-100 text-red-700", icon: Flame },
  warm: { label: "Warm", color: "bg-amber-100 text-amber-700", icon: Thermometer },
  cold: { label: "Cold", color: "bg-blue-100 text-blue-700", icon: Snowflake },
}

const voiceConfig: Record<string, { label: string; color: string }> = {
  alloy: { label: "Alloy", color: "bg-slate-100 text-slate-700" },
  echo: { label: "Echo", color: "bg-violet-100 text-violet-700" },
  fable: { label: "Fable", color: "bg-emerald-100 text-emerald-700" },
  onyx: { label: "Onyx", color: "bg-zinc-100 text-zinc-700" },
  nova: { label: "Nova", color: "bg-pink-100 text-pink-700" },
  shimmer: { label: "Shimmer", color: "bg-cyan-100 text-cyan-700" },
}

const businessTypes = ["gym", "climbing", "rental", "adventure", "fitness"]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}

function generateMockScripts(): AgentScript[] {
  const scripts: AgentScript[] = []
  const interestLevels = ["cold", "warm", "hot"]
  const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

  const scriptNames = [
    "General Insurance Intro",
    "Gym Owner Outreach",
    "Climbing Gym Special",
    "Equipment Rental Cold Call",
    "Adventure Tour Lead",
    "Fitness Studio Follow-up",
    "Hot Lead Closer",
    "Warm Lead Nurture",
    "Re-engagement Script",
    "Objection Handler Pro",
  ]

  const descriptions = [
    "Standard script for initial contact with new leads",
    "Specialized script for gym owners highlighting liability coverage",
    "Script focused on climbing gym specific needs and risks",
    "Cold outreach for equipment rental businesses",
    "Adventure tourism focused with emphasis on participant coverage",
    "Follow-up script for fitness studio prospects",
    "Aggressive closing script for high-intent leads",
    "Relationship building script for warm prospects",
    "Win-back script for previously unresponsive leads",
    "Advanced objection handling for experienced agents",
  ]

  for (let i = 0; i < 10; i++) {
    const businessType = i < 5 ? businessTypes[i % businessTypes.length] : null
    const interestLevel = interestLevels[i % interestLevels.length]

    scripts.push({
      id: `script_${i + 1}`,
      name: scriptNames[i],
      description: descriptions[i],
      businessType,
      interestLevel,
      geographicRegion: i === 3 ? "West Coast" : i === 7 ? "Northeast" : null,
      systemPrompt: "You are a friendly insurance sales agent helping businesses protect their customers with daily event insurance coverage.",
      openingScript: "Hi, this is [Agent] from Daily Event Insurance. I noticed your business might benefit from our participant coverage plans.",
      keyPoints: JSON.stringify([
        "Covers participants for $40/day",
        "No annual contracts required",
        "Instant certificate generation",
        "Claims processed within 48 hours",
      ]),
      objectionHandlers: JSON.stringify({
        "too expensive": "I understand budget is important. Let me show you how our daily model actually saves money compared to annual policies.",
        "not interested": "That's completely understandable. Many of our best partners felt the same way initially. Can I ask what coverage you currently have?",
        "need to think about it": "Of course, it's an important decision. What specific questions can I answer to help you make that decision?",
      }),
      closingScript: "Based on what we discussed, I think our [Plan Name] would be perfect for your needs. Shall I send over the details?",
      maxCallDuration: [180, 240, 300, 360, 420][i % 5],
      voiceId: voices[i % voices.length],
      isActive: i !== 4 && i !== 8, // Some inactive for variety
      priority: i < 3 ? 10 - i : i % 5,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return scripts.sort((a, b) => b.priority - a.priority)
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<AgentScript[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")
  const [interestFilter, setInterestFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    fetchScripts()
  }, [])

  async function fetchScripts() {
    try {
      const response = await fetch("/api/admin/scripts")
      if (!response.ok) throw new Error("Failed to fetch scripts")
      const result = await response.json()
      setScripts(result.data || generateMockScripts())
    } catch (err) {
      console.error("Error fetching scripts:", err)
      setScripts(generateMockScripts())
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleActive(scriptId: string, currentState: boolean) {
    // Optimistic update
    setScripts(prev =>
      prev.map(script =>
        script.id === scriptId
          ? { ...script, isActive: !currentState }
          : script
      )
    )

    try {
      await fetch(`/api/admin/scripts/${scriptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentState }),
      })
    } catch (err) {
      console.error("Error toggling script:", err)
      // Revert on error
      setScripts(prev =>
        prev.map(script =>
          script.id === scriptId
            ? { ...script, isActive: currentState }
            : script
        )
      )
    }
  }

  async function deleteScript(scriptId: string) {
    if (!confirm("Are you sure you want to delete this script?")) return

    const previousScripts = scripts
    setScripts(prev => prev.filter(script => script.id !== scriptId))

    try {
      const response = await fetch(`/api/admin/scripts/${scriptId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete script")
    } catch (err) {
      console.error("Error deleting script:", err)
      setScripts(previousScripts)
    }
  }

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch =
      searchQuery === "" ||
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBusinessType =
      businessTypeFilter === "all" ||
      script.businessType === businessTypeFilter ||
      (businessTypeFilter === "universal" && !script.businessType)

    const matchesInterest = interestFilter === "all" || script.interestLevel === interestFilter

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && script.isActive) ||
      (activeFilter === "inactive" && !script.isActive)

    return matchesSearch && matchesBusinessType && matchesInterest && matchesActive
  })

  const uniqueBusinessTypes = Array.from(
    new Set(scripts.map((s) => s.businessType).filter((t): t is string => Boolean(t)))
  )

  const columns: Column<AgentScript>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{row.description || "No description"}</p>
        </div>
      ),
    },
    {
      key: "businessType",
      label: "Business Type",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700 capitalize">
            {value || "All Types"}
          </span>
        </div>
      ),
    },
    {
      key: "interestLevel",
      label: "Interest Level",
      sortable: true,
      render: (value) => {
        if (!value) {
          return <span className="text-sm text-slate-500">Any</span>
        }
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
      key: "voiceId",
      label: "Voice",
      sortable: true,
      render: (value) => {
        const config = voiceConfig[value] || { label: value, color: "bg-slate-100 text-slate-700" }
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Volume2 className="w-3 h-3" />
            {config.label}
          </span>
        )
      },
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          value ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
        }`}>
          {value ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Active
            </>
          ) : (
            <>
              <PowerOff className="w-3 h-3" />
              Inactive
            </>
          )}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <ArrowUpCircle className={`w-4 h-4 ${
            value >= 8 ? "text-violet-600" :
            value >= 5 ? "text-amber-500" :
            "text-slate-400"
          }`} />
          <span className="text-sm font-medium text-slate-700">{value}</span>
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/scripts/${row.id}`}
            className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/scripts/${row.id}/edit`}
            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
            title="Edit script"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => toggleActive(row.id, row.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              row.isActive
                ? "hover:bg-amber-100 text-amber-600"
                : "hover:bg-green-100 text-green-600"
            }`}
            title={row.isActive ? "Deactivate" : "Activate"}
          >
            {row.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteScript(row.id)}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
            title="Delete script"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const stats = {
    total: scripts.length,
    active: scripts.filter((s) => s.isActive).length,
    businessTypes: new Set(scripts.map((s) => s.businessType).filter(Boolean)).size,
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Agent Scripts</h1>
          <p className="text-slate-600 mt-1">Manage AI call scripts and voice configurations</p>
        </div>
        <Link
          href="/admin/scripts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Script
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Scripts</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Scripts</p>
              <p className="text-xl font-bold text-slate-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Business Types</p>
              <p className="text-xl font-bold text-slate-900">{stats.businessTypes}</p>
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
            placeholder="Search by script name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              <option value="all">All Business Types</option>
              <option value="universal">Universal (All Types)</option>
              {uniqueBusinessTypes.map((type) => (
                <option key={type} value={type} className="capitalize">{type}</option>
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
              <option value="all">All Interest Levels</option>
              {Object.entries(interestConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all bg-white cursor-pointer text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
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
          data={filteredScripts}
          idKey="id"
          searchQuery={searchQuery}
          onExport={() => {}}
          emptyMessage="No scripts found matching your criteria"
        />
      </motion.div>
    </div>
  )
}
