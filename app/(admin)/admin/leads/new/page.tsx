"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"

export default function NewLeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    source: "website_quote",
    interestLevel: "cold",
    city: "",
    state: "",
    estimatedParticipants: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedParticipants: formData.estimatedParticipants 
            ? parseInt(formData.estimatedParticipants) 
            : null,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        router.push(`/admin/leads/${data.data.id}`)
      } else {
        alert(data.error || "Failed to create lead")
      }
    } catch (error) {
      console.error("Failed to create lead:", error)
      alert("Failed to create lead")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/leads"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Lead</h1>
          <p className="text-sm text-slate-500">Enter lead information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl space-y-6">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="555-123-4567"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Business Information */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  placeholder="Acme Fitness"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Business Type
                  </label>
                  <select 
                    value={formData.businessType} 
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="gym">Gym / Fitness</option>
                    <option value="climbing">Climbing Gym</option>
                    <option value="rental">Rental Business</option>
                    <option value="adventure">Adventure / Tours</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Est. Monthly Participants
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedParticipants}
                    onChange={(e) => handleChange("estimatedParticipants", e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="CA"
                    maxLength={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lead Details */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Lead Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Lead Source *
                </label>
                <select 
                  value={formData.source} 
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-violet-500 outline-none"
                >
                  <option value="website_quote">Website Quote</option>
                  <option value="partner_referral">Partner Referral</option>
                  <option value="cold_list">Cold List</option>
                  <option value="ad_campaign">Ad Campaign</option>
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
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">🔥 Hot</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link 
              href="/admin/leads"
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Create Lead"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
