"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Edit, Trash2, MessageSquare, X } from "lucide-react"

interface Script {
  id: string
  name: string
  description: string | null
  businessType: string | null
  interestLevel: string | null
  geographicRegion: string | null
  systemPrompt: string
  openingScript: string
  closingScript: string | null
  voiceId: string
  isActive: boolean
  priority: number
  createdAt: string
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingScript, setEditingScript] = useState<Script | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    businessType: "",
    interestLevel: "",
    geographicRegion: "",
    systemPrompt: "",
    openingScript: "",
    closingScript: "",
    voiceId: "alloy",
    priority: 0,
  })

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      const response = await fetch("/api/admin/scripts")
      const data = await response.json()
      if (data.success) {
        setScripts(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch scripts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const openNewDialog = () => {
    setEditingScript(null)
    setFormData({
      name: "",
      description: "",
      businessType: "",
      interestLevel: "",
      geographicRegion: "",
      systemPrompt: "You are Alex, a friendly sales representative for Daily Event Insurance...",
      openingScript: "Hi, is this {first_name}? This is Alex from Daily Event Insurance...",
      closingScript: "",
      voiceId: "alloy",
      priority: 0,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (script: Script) => {
    setEditingScript(script)
    setFormData({
      name: script.name,
      description: script.description || "",
      businessType: script.businessType || "",
      interestLevel: script.interestLevel || "",
      geographicRegion: script.geographicRegion || "",
      systemPrompt: script.systemPrompt,
      openingScript: script.openingScript,
      closingScript: script.closingScript || "",
      voiceId: script.voiceId,
      priority: script.priority,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const url = editingScript 
        ? `/api/admin/scripts/${editingScript.id}` 
        : "/api/admin/scripts"
      
      const response = await fetch(url, {
        method: editingScript ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessType: formData.businessType || null,
          interestLevel: formData.interestLevel || null,
          geographicRegion: formData.geographicRegion || null,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setDialogOpen(false)
        fetchScripts()
      } else {
        alert(data.error || "Failed to save script")
      }
    } catch (error) {
      console.error("Failed to save script:", error)
    }
  }

  const toggleActive = async (script: Script) => {
    try {
      await fetch(`/api/admin/scripts/${script.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !script.isActive }),
      })
      fetchScripts()
    } catch (error) {
      console.error("Failed to toggle script:", error)
    }
  }

  const deleteScript = async (id: string) => {
    if (!confirm("Are you sure you want to delete this script?")) return
    try {
      await fetch(`/api/admin/scripts/${id}`, { method: "DELETE" })
      fetchScripts()
    } catch (error) {
      console.error("Failed to delete script:", error)
    }
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
            <h1 className="text-xl font-bold text-slate-900">AI Scripts</h1>
            <p className="text-sm text-slate-500">Manage voice agent scripts</p>
          </div>
        </div>
        <button 
          onClick={openNewDialog}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Script
        </button>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
            Loading scripts...
          </div>
        ) : scripts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">No scripts yet</p>
            <button 
              onClick={openNewDialog}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
            >
              Create Your First Script
            </button>
          </div>
        ) : (
          scripts.map((script, index) => (
            <motion.div 
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{script.name}</h3>
                    {!script.isActive && (
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">
                        Inactive
                      </span>
                    )}
                    {script.businessType && (
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                        {script.businessType}
                      </span>
                    )}
                    {script.interestLevel && (
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        script.interestLevel === "hot" 
                          ? "bg-red-100 text-red-700" 
                          : script.interestLevel === "warm"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {script.interestLevel}
                      </span>
                    )}
                    {script.geographicRegion && (
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                        {script.geographicRegion}
                      </span>
                    )}
                  </div>
                  {script.description && (
                    <p className="text-sm text-slate-500 mb-3">{script.description}</p>
                  )}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Opening:</p>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {script.openingScript}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(script)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      script.isActive ? "bg-violet-600" : "bg-slate-300"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        script.isActive ? "left-5" : "left-1"
                      }`} 
                    />
                  </button>
                  <button 
                    onClick={() => openEditDialog(script)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteScript(script.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDialogOpen(false)}
              className="fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {editingScript ? "Edit Script" : "New Script"}
                  </h2>
                  <button 
                    onClick={() => setDialogOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Script Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Cold Lead - Gym"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Script for cold outreach to gyms"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Business Type
                      </label>
                      <select 
                        value={formData.businessType} 
                        onChange={(e) => handleChange("businessType", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
                      >
                        <option value="">Any</option>
                        <option value="gym">Gym</option>
                        <option value="climbing">Climbing</option>
                        <option value="rental">Rental</option>
                        <option value="adventure">Adventure</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Interest Level
                      </label>
                      <select 
                        value={formData.interestLevel} 
                        onChange={(e) => handleChange("interestLevel", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
                      >
                        <option value="">Any</option>
                        <option value="cold">Cold</option>
                        <option value="warm">Warm</option>
                        <option value="hot">Hot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Region
                      </label>
                      <input
                        type="text"
                        value={formData.geographicRegion}
                        onChange={(e) => handleChange("geographicRegion", e.target.value)}
                        placeholder="california"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      System Prompt *
                    </label>
                    <textarea
                      value={formData.systemPrompt}
                      onChange={(e) => handleChange("systemPrompt", e.target.value)}
                      rows={4}
                      placeholder="You are Alex, a friendly sales representative..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Opening Script *
                    </label>
                    <textarea
                      value={formData.openingScript}
                      onChange={(e) => handleChange("openingScript", e.target.value)}
                      rows={3}
                      placeholder="Hi, is this {first_name}? This is Alex from..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Use {"{first_name}"}, {"{business_name}"}, {"{estimated_participants}"} for variables
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Closing Script
                    </label>
                    <textarea
                      value={formData.closingScript}
                      onChange={(e) => handleChange("closingScript", e.target.value)}
                      rows={2}
                      placeholder="Based on what you've told me..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Voice
                      </label>
                      <select 
                        value={formData.voiceId} 
                        onChange={(e) => handleChange("voiceId", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
                      >
                        <option value="alloy">Alloy (Neutral)</option>
                        <option value="echo">Echo (Male)</option>
                        <option value="fable">Fable (British)</option>
                        <option value="onyx">Onyx (Deep Male)</option>
                        <option value="nova">Nova (Female)</option>
                        <option value="shimmer">Shimmer (Soft Female)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => handleChange("priority", parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">Higher = preferred when multiple match</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={() => setDialogOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                    >
                      {editingScript ? "Save Changes" : "Create Script"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
