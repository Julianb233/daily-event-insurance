"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  User,
  Building2,
  Mail,
  Phone,
  Palette,
  Code,
  Save,
  Check,
  Shield,
  Copy,
} from "lucide-react"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"

interface Partner {
  id: string
  business_name: string
  business_type: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  integration_type: string
  primary_color?: string
  logo_url?: string
  status: string
}

interface Product {
  id: string
  product_type: string
  is_enabled: boolean
  customer_price: number
}

interface ProfileData {
  partner: Partner
  products: Product[]
}

const businessTypes = [
  { value: "gym", label: "Gym / Fitness Center" },
  { value: "climbing", label: "Rock Climbing Gym" },
  { value: "rental", label: "Equipment Rental" },
  { value: "wellness", label: "Wellness / Spa" },
  { value: "ski", label: "Ski Resort" },
  { value: "water-sports", label: "Water Sports" },
  { value: "other", label: "Other" },
]

const integrationTypes = [
  { value: "widget", label: "Widget Integration", description: "Embed our widget on your website" },
  { value: "api", label: "API Integration", description: "Direct API access for custom solutions" },
  { value: "manual", label: "Manual Process", description: "Email-based waiver collection" },
]

export default function PartnerProfilePage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    integrationType: "",
    primaryColor: "#14B8A6",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const response = await fetch("/api/partner/profile")
      if (!response.ok) throw new Error("Failed to fetch")
      const profileData = await response.json()
      setData(profileData)
      setFormData({
        businessName: profileData.partner.business_name,
        businessType: profileData.partner.business_type,
        contactName: profileData.partner.contact_name,
        contactEmail: profileData.partner.contact_email,
        contactPhone: profileData.partner.contact_phone || "",
        integrationType: profileData.partner.integration_type,
        primaryColor: profileData.partner.primary_color || "#14B8A6",
      })
    } catch (err) {
      console.error("Error:", err)
      // Use demo data
      const demoPartner = {
        id: "demo",
        business_name: "Demo Fitness Studio",
        business_type: "gym",
        contact_name: session?.user?.name || "Partner",
        contact_email: session?.user?.email || "partner@example.com",
        contact_phone: "",
        integration_type: "widget",
        primary_color: "#14B8A6",
        status: "active",
      }
      setData({
        partner: demoPartner,
        products: [
          { id: "1", product_type: "liability", is_enabled: true, customer_price: 4.99 },
          { id: "2", product_type: "equipment", is_enabled: false, customer_price: 9.99 },
          { id: "3", product_type: "cancellation", is_enabled: false, customer_price: 14.99 },
        ],
      })
      setFormData({
        businessName: demoPartner.business_name,
        businessType: demoPartner.business_type,
        contactName: demoPartner.contact_name,
        contactEmail: demoPartner.contact_email,
        contactPhone: "",
        integrationType: demoPartner.integration_type,
        primaryColor: demoPartner.primary_color,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const response = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessType: formData.businessType,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          integrationType: formData.integrationType,
          primaryColor: formData.primaryColor,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Error saving:", err)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  function copyWidgetCode() {
    const code = `<script src="https://dailyeventinsurance.com/widget.js" data-partner-id="${data?.partner.id}"></script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-xl" />
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
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-1">Manage your business information and integration settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data?.partner.status === "active" ? "bg-green-100 text-green-700" :
            data?.partner.status === "pending" ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {data?.partner.status === "active" ? "Active" :
             data?.partner.status === "pending" ? "Pending Approval" : "Suspended"}
          </span>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Business Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Contact Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Integration Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Integration Settings</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Integration Type</label>
                <div className="space-y-3">
                  {integrationTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        formData.integrationType === type.value
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="integrationType"
                        value={type.value}
                        checked={formData.integrationType === type.value}
                        onChange={(e) => setFormData({ ...formData, integrationType: e.target.value })}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{type.label}</p>
                        <p className="text-sm text-slate-500">{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Widget Code */}
              {formData.integrationType === "widget" && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Widget Code</span>
                    <button
                      onClick={copyWidgetCode}
                      className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    {`<script src="https://dailyeventinsurance.com/widget.js" data-partner-id="${data?.partner.id}"></script>`}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Branding</h3>
              </div>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-32 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                  />
                  <div
                    className="flex-1 h-12 rounded-lg"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Account</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                  {session?.user?.name?.[0] || "P"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{session?.user?.name || "Partner"}</p>
                  <p className="text-sm text-slate-500">{session?.user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Partner ID</span>
                  <span className="font-mono text-slate-700">{data?.partner.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-green-600">
                    {data?.partner.status === "active" ? "Active" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">Product Configuration</h3>
            </div>
            <div className="p-6 space-y-4">
              {data?.products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{product.product_type}</p>
                    <p className="text-sm text-slate-500">${product.customer_price.toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {product.is_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-400 text-center mt-4">
                Contact support to modify product configuration
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <IntegrationChatWidget
        topic="widget_install"
        partnerId={data?.partner.id}
        partnerEmail={data?.partner.contact_email}
        partnerName={data?.partner.contact_name}
      />
    </div>
  )
}
