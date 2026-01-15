"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  Play,
  Pause,
  Copy,
  Mic,
  MessageSquare,
  Target,
  Settings,
  Flame,
  Thermometer,
  Snowflake,
} from "lucide-react"

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

interface ScriptFormData {
  name: string
  description: string
  businessType: string
  interestLevel: string
  geographicRegion: string
  systemPrompt: string
  openingScript: string
  keyPoints: string
  objectionHandlers: string
  closingScript: string
  maxCallDuration: number
  voiceId: string
  isActive: boolean
  priority: number
}

const defaultFormData: ScriptFormData = {
  name: "",
  description: "",
  businessType: "",
  interestLevel: "",
  geographicRegion: "",
  systemPrompt: "You are an AI sales agent for Daily Event Insurance. Your goal is to help prospects understand our offering and schedule a demo.",
  openingScript: "Hi, this is [Agent Name] from Daily Event Insurance. Am I speaking with [Prospect Name]?",
  keyPoints: "[]",
  objectionHandlers: "{}",
  closingScript: "Would you like to schedule a quick 15-minute demo to see how this could work for your business?",
  maxCallDuration: 300,
  voiceId: "alloy",
  isActive: true,
  priority: 0,
}

const businessTypes = [
  { value: "", label: "All Business Types" },
  { value: "gym", label: "Gym" },
  { value: "climbing", label: "Climbing" },
  { value: "rental", label: "Rental" },
  { value: "adventure", label: "Adventure" },
  { value: "fitness", label: "Fitness" },
]

const interestLevels = [
  { value: "", label: "All Interest Levels" },
  { value: "cold", label: "Cold", icon: Snowflake, color: "text-blue-600" },
  { value: "warm", label: "Warm", icon: Thermometer, color: "text-amber-600" },
  { value: "hot", label: "Hot", icon: Flame, color: "text-red-600" },
]

const voiceOptions = [
  { value: "alloy", label: "Alloy (Neutral)" },
  { value: "echo", label: "Echo (Male)" },
  { value: "fable", label: "Fable (British)" },
  { value: "onyx", label: "Onyx (Deep Male)" },
  { value: "nova", label: "Nova (Female)" },
  { value: "shimmer", label: "Shimmer (Soft Female)" },
]

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<AgentScript[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScript, setEditingScript] = useState<AgentScript | null>(null)
  const [formData, setFormData] = useState<ScriptFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("")
  const [interestLevelFilter, setInterestLevelFilter] = useState("")
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "config">("basic")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchScripts()
  }, [businessTypeFilter, interestLevelFilter])

  async function fetchScripts() {
    try {
      const params = new URLSearchParams()
      if (businessTypeFilter) params.set("businessType", businessTypeFilter)
      if (interestLevelFilter) params.set("interestLevel", interestLevelFilter)

      const response = await fetch(`/api/admin/scripts?${params}`)
      if (!response.ok) throw new Error("Failed to fetch scripts")
      const result = await response.json()
      setScripts(result.data || [])
    } catch (err) {
      console.error("Error fetching scripts:", err)
      setError("Failed to load scripts")
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateModal() {
    setEditingScript(null)
    setFormData(defaultFormData)
    setActiveTab("basic")
    setIsModalOpen(true)
  }

  function openEditModal(script: AgentScript) {
    setEditingScript(script)
    setFormData({
      name: script.name,
      description: script.description || "",
      businessType: script.businessType || "",
      interestLevel: script.interestLevel || "",
      geographicRegion: script.geographicRegion || "",
      systemPrompt: script.systemPrompt,
      openingScript: script.openingScript,
      keyPoints: script.keyPoints || "[]",
      objectionHandlers: script.objectionHandlers || "{}",
      closingScript: script.closingScript || "",
      maxCallDuration: script.maxCallDuration,
      voiceId: script.voiceId,
      isActive: script.isActive,
      priority: script.priority,
    })
    setActiveTab("basic")
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingScript(null)
    setFormData(defaultFormData)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingScript
        ? `/api/admin/scripts/${editingScript.id}`
        : "/api/admin/scripts"
      const method = editingScript ? "PATCH" : "POST"

      const payload = {
        ...formData,
        businessType: formData.businessType || null,
        interestLevel: formData.interestLevel || null,
        geographicRegion: formData.geographicRegion || null,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to save script")
      }

      await fetchScripts()
      closeModal()
    } catch (err: any) {
      console.error("Error saving script:", err)
      setError(err.message || "Failed to save script")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/scripts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete script")
      await fetchScripts()
      setDeleteConfirm(null)
    } catch (err) {
      console.error("Error deleting script:", err)
      setError("Failed to delete script")
    }
  }

  async function handleToggleActive(script: AgentScript) {
    try {
      const response = await fetch(`/api/admin/scripts/${script.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !script.isActive }),
      })
      if (!response.ok) throw new Error("Failed to update script")
      await fetchScripts()
    } catch (err) {
      console.error("Error toggling script:", err)
    }
  }

  function duplicateScript(script: AgentScript) {
    setEditingScript(null)
    setFormData({
      name: `${script.name} (Copy)`,
      description: script.description || "",
      businessType: script.businessType || "",
      interestLevel: script.interestLevel || "",
      geographicRegion: script.geographicRegion || "",
      systemPrompt: script.systemPrompt,
      openingScript: script.openingScript,
      keyPoints: script.keyPoints || "[]",
      objectionHandlers: script.objectionHandlers || "{}",
      closingScript: script.closingScript || "",
      maxCallDuration: script.maxCallDuration,
      voiceId: script.voiceId,
      isActive: false,
      priority: script.priority,
    })
    setActiveTab("basic")
    setIsModalOpen(true)
  }

  const filteredScripts = scripts.filter((script) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      script.name.toLowerCase().includes(query) ||
      script.description?.toLowerCase().includes(query) ||
      script.businessType?.toLowerCase().includes(query)
    )
  })

  const getInterestIcon = (level: string | null) => {
    const config = interestLevels.find((l) => l.value === level)
    if (!config || !config.icon) return null
    const Icon = config.icon
    return <Icon className={`w-4 h-4 ${config.color}`} />
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Agent Scripts</h1>
          <p className="text-slate-600 mt-1">Manage AI call scripts for lead conversion</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Script
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={businessTypeFilter}
              onChange={(e) => setBusinessTypeFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none bg-white cursor-pointer text-sm"
            >
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={interestLevelFilter}
              onChange={(e) => setInterestLevelFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none bg-white cursor-pointer text-sm"
            >
              {interestLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Scripts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredScripts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No scripts found</h3>
            <p className="text-slate-500 mb-4">Create your first AI call script to get started.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-100 text-violet-700 font-medium hover:bg-violet-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Script
            </button>
          </div>
        ) : (
          filteredScripts.map((script) => (
            <motion.div
              key={script.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">{script.name}</h3>
                    <button
                      onClick={() => handleToggleActive(script)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        script.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {script.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  {script.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{script.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {script.businessType && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <Target className="w-3 h-3" />
                        {script.businessType}
                      </span>
                    )}
                    {script.interestLevel && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700">
                        {getInterestIcon(script.interestLevel)}
                        {script.interestLevel}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                      <Mic className="w-3 h-3" />
                      {script.voiceId}
                    </span>
                    <span className="text-xs text-slate-400">
                      Priority: {script.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => duplicateScript(script)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(script)}
                    className="p-2 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === script.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(script.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Confirm delete"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(script.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingScript ? "Edit Script" : "Create New Script"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                {[
                  { id: "basic", label: "Basic Info", icon: FileText },
                  { id: "content", label: "Script Content", icon: MessageSquare },
                  { id: "config", label: "Configuration", icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {activeTab === "basic" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Script Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="e.g., Cold Outreach - Gym"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                          rows={2}
                          placeholder="Brief description of this script's purpose"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Business Type
                          </label>
                          <select
                            value={formData.businessType}
                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none bg-white"
                          >
                            <option value="">Any</option>
                            <option value="gym">Gym</option>
                            <option value="climbing">Climbing</option>
                            <option value="rental">Rental</option>
                            <option value="adventure">Adventure</option>
                            <option value="fitness">Fitness</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Interest Level
                          </label>
                          <select
                            value={formData.interestLevel}
                            onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none bg-white"
                          >
                            <option value="">Any</option>
                            <option value="cold">Cold</option>
                            <option value="warm">Warm</option>
                            <option value="hot">Hot</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Geographic Region
                        </label>
                        <input
                          type="text"
                          value={formData.geographicRegion}
                          onChange={(e) => setFormData({ ...formData, geographicRegion: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="e.g., West Coast, Northeast (leave empty for all)"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "content" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          System Prompt <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.systemPrompt}
                          onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none font-mono text-sm"
                          rows={4}
                          placeholder="AI agent instructions and persona..."
                          required
                        />
                        <p className="text-xs text-slate-500 mt-1">Define the AI agent's role, tone, and behavior</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Opening Script <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.openingScript}
                          onChange={(e) => setFormData({ ...formData, openingScript: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                          rows={3}
                          placeholder="How to start the conversation..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Key Points (JSON Array)
                        </label>
                        <textarea
                          value={formData.keyPoints}
                          onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none font-mono text-sm"
                          rows={3}
                          placeholder='["Point 1", "Point 2", "Point 3"]'
                        />
                        <p className="text-xs text-slate-500 mt-1">Main talking points as a JSON array</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Objection Handlers (JSON Object)
                        </label>
                        <textarea
                          value={formData.objectionHandlers}
                          onChange={(e) => setFormData({ ...formData, objectionHandlers: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none font-mono text-sm"
                          rows={4}
                          placeholder='{"objection": "response", "too expensive": "Our coverage is just $4.99..."}'
                        />
                        <p className="text-xs text-slate-500 mt-1">Map objections to suggested responses</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Closing Script
                        </label>
                        <textarea
                          value={formData.closingScript}
                          onChange={(e) => setFormData({ ...formData, closingScript: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                          rows={2}
                          placeholder="How to end the call with a CTA..."
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "config" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Voice
                          </label>
                          <select
                            value={formData.voiceId}
                            onChange={(e) => setFormData({ ...formData, voiceId: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none bg-white"
                          >
                            {voiceOptions.map((voice) => (
                              <option key={voice.value} value={voice.value}>
                                {voice.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Max Call Duration (seconds)
                          </label>
                          <input
                            type="number"
                            value={formData.maxCallDuration}
                            onChange={(e) => setFormData({ ...formData, maxCallDuration: parseInt(e.target.value) || 300 })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                            min={60}
                            max={3600}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Priority (0-100)
                          </label>
                          <input
                            type="number"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                            min={0}
                            max={100}
                          />
                          <p className="text-xs text-slate-500 mt-1">Higher priority scripts are preferred</p>
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-violet-500 transition-colors" />
                              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Active</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {editingScript ? "Update Script" : "Create Script"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
