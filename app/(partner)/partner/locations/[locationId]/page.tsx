"use client"

import { useEffect, useState, use } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Globe,
  Code,
  Key,
  Webhook,
  ShoppingCart,
  CreditCard,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  ExternalLink,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Location {
  id: string
  locationName: string
  address: string
  city: string
  state: string
  zipCode: string
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  contactRole?: string | null
  customSubdomain?: string | null
  qrCodeUrl?: string | null
  integrationType?: string | null
  embedCode?: string | null
  apiKey?: string | null
  webhookUrl?: string | null
  webhookSecret?: string | null
  webhookEvents?: string | null
  ecommercePlatform?: string | null
  posTerminalId?: string | null
  status: string
}

interface LocationStats {
  totalPolicies: number
  totalPremium: string
  totalCommission: string
  policiesThisMonth: number
  policiesThisWeek: number
  policiesToday: number
  lastPolicyAt?: string | null
  recentPolicies: Array<{
    id: string
    policyNumber: string
    customerName: string
    eventType: string
    premium: string
    commission: string
    createdAt: string
  }>
}

const INTEGRATION_TYPES = [
  {
    id: "embedded",
    name: "Embedded Widget",
    description: "Add insurance checkout to your website",
    icon: Code,
  },
  {
    id: "api",
    name: "API Integration",
    description: "Full control via REST API",
    icon: Key,
  },
  {
    id: "ecommerce",
    name: "E-commerce Plugin",
    description: "Shopify, WooCommerce, etc.",
    icon: ShoppingCart,
  },
  {
    id: "pos",
    name: "Point of Sale",
    description: "Integrate with POS terminals",
    icon: CreditCard,
  },
]

export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const { locationId } = use(params)
  const [location, setLocation] = useState<Location | null>(null)
  const [stats, setStats] = useState<LocationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookEvents, setWebhookEvents] = useState<string[]>(["policy.created"])
  const [isSavingWebhook, setIsSavingWebhook] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [locationRes, statsRes] = await Promise.all([
          fetch(`/api/partner/locations/${locationId}`),
          fetch(`/api/partner/locations/${locationId}/stats`),
        ])

        if (locationRes.ok) {
          const data = await locationRes.json()
          setLocation(data.location)
          setSelectedIntegration(data.location.integrationType)
          setWebhookUrl(data.location.webhookUrl || "")
          // Parse webhook events from comma-separated string or default
          if (data.location.webhookEvents) {
            setWebhookEvents(data.location.webhookEvents.split(",").map((e: string) => e.trim()))
          }
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Poll for stats every 30 seconds for real-time updates
    const interval = setInterval(async () => {
      try {
        const statsRes = await fetch(`/api/partner/locations/${locationId}/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error refreshing stats:", error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [locationId])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateCredentials = async (type: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/partner/locations/${locationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh location data
        const locationRes = await fetch(`/api/partner/locations/${locationId}`)
        if (locationRes.ok) {
          const locationData = await locationRes.json()
          setLocation(locationData.location)
        }

        // Show the secret if it was just generated
        if (data.apiSecret) {
          alert(`API Secret (save this, it won't be shown again):\n\n${data.apiSecret}`)
        }
      }
    } catch (error) {
      console.error("Error generating credentials:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updateIntegrationType = async (type: string) => {
    setSelectedIntegration(type)
    try {
      await fetch(`/api/partner/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationType: type }),
      })

      // Refresh location
      const locationRes = await fetch(`/api/partner/locations/${locationId}`)
      if (locationRes.ok) {
        const data = await locationRes.json()
        setLocation(data.location)
      }
    } catch (error) {
      console.error("Error updating integration type:", error)
    }
  }

  const toggleWebhookEvent = (event: string) => {
    setWebhookEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    )
  }

  const saveWebhookSettings = async () => {
    setIsSavingWebhook(true)
    try {
      const response = await fetch(`/api/partner/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: webhookUrl || null,
          webhookEvents: webhookEvents.length > 0 ? webhookEvents.join(",") : null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLocation(data.location)
        toast.success("Webhook settings saved successfully")
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to save webhook settings")
      }
    } catch (error) {
      console.error("Error saving webhook settings:", error)
      toast.error("Failed to save webhook settings")
    } finally {
      setIsSavingWebhook(false)
    }
  }

  const downloadQrCode = (qrCodeUrl: string, locationName: string) => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-code-${locationName.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">
          Location not found
        </div>
      </div>
    )
  }

  const locationUrl = location.customSubdomain
    ? `https://${location.customSubdomain}.dailyeventinsurance.com`
    : null

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/partner/locations"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Locations
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {location.locationName}
            </h1>
            <p className="text-slate-600">
              {location.city}, {location.state}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-slate-600">Today</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.policiesToday}</p>
            <p className="text-xs text-slate-500">policies sold</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">This Month</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.policiesThisMonth}</p>
            <p className="text-xs text-slate-500">policies sold</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalPolicies}</p>
            <p className="text-xs text-slate-500">all time</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Commission</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">${stats.totalCommission}</p>
            <p className="text-xs text-slate-500">earned</p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">QR Code</h2>
          </div>

          {location.qrCodeUrl ? (
            <div className="flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-xl mb-4">
                <img
                  src={location.qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-slate-600 mb-4 text-center">
                Customers scan this to purchase insurance
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadQrCode(location.qrCodeUrl!, location.locationName)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open("", "_blank")
                    if (printWindow) {
                      printWindow.document.write(`
                        <html><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
                          <div style="text-align:center;">
                            <img src="${location.qrCodeUrl}" style="width:300px;height:300px;" />
                            <h2>${location.locationName}</h2>
                            <p>Scan for Event Insurance</p>
                          </div>
                        </body></html>
                      `)
                      printWindow.print()
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No QR code generated yet</p>
            </div>
          )}

          {locationUrl && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">Location URL</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-slate-50 px-3 py-2 rounded-lg truncate">
                  {locationUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(locationUrl, "url")}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  {copied === "url" ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>
          )}
        </motion.div>

        {/* Integration Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Integration Method</h2>
          </div>

          <div className="space-y-3 mb-6">
            {INTEGRATION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => updateIntegrationType(type.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedIntegration === type.id
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedIntegration === type.id
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{type.name}</p>
                  <p className="text-sm text-slate-500">{type.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Integration-specific settings */}
          {selectedIntegration === "embedded" && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Embed Code</span>
                <button
                  onClick={() => generateCredentials("embed")}
                  disabled={isGenerating}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  {isGenerating ? "Generating..." : "Regenerate"}
                </button>
              </div>
              {location.embedCode ? (
                <div className="relative">
                  <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {location.embedCode}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(location.embedCode!, "embed")}
                    className="absolute top-2 right-2 p-2 bg-slate-700 rounded hover:bg-slate-600"
                  >
                    {copied === "embed" ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => generateCredentials("embed")}
                  disabled={isGenerating}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
                >
                  Generate Embed Code
                </button>
              )}
            </div>
          )}

          {selectedIntegration === "api" && (
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">API Key</span>
                  <button
                    onClick={() => generateCredentials("api")}
                    disabled={isGenerating}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    {isGenerating ? "Generating..." : "Regenerate"}
                  </button>
                </div>
                {location.apiKey ? (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-slate-100 px-3 py-2 rounded-lg font-mono">
                      {location.apiKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(location.apiKey!, "apiKey")}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      {copied === "apiKey" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => generateCredentials("api")}
                    disabled={isGenerating}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
                  >
                    Generate API Credentials
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500">
                API documentation: <a href="/docs/api" className="text-teal-600 hover:underline">docs.dailyeventinsurance.com/api</a>
              </p>
            </div>
          )}

          {selectedIntegration === "ecommerce" && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600 mb-4">
                Select your e-commerce platform to get started:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Shopify", "WooCommerce", "Magento", "BigCommerce"].map((platform) => (
                  <button
                    key={platform}
                    className="p-3 border border-slate-200 rounded-lg text-sm font-medium hover:border-teal-500 hover:text-teal-600 transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedIntegration === "pos" && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600 mb-4">
                Contact us to set up POS integration for your terminals.
              </p>
              <a
                href="mailto:partners@dailyeventinsurance.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          )}
        </motion.div>

        {/* Recent Policies */}
        {stats && stats.recentPolicies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">Recent Policies</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <RefreshCw className="w-4 h-4" />
                Auto-refreshes every 30s
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Policy #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Event Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Premium</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Commission</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPolicies.map((policy) => (
                    <tr key={policy.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-mono text-slate-600">
                        {policy.policyNumber}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-900">{policy.customerName}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{policy.eventType}</td>
                      <td className="py-3 px-4 text-sm text-right text-slate-900">
                        ${policy.premium}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                        +${policy.commission}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-slate-500">
                        {new Date(policy.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Webhook Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Webhook className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Webhook Configuration</h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Receive real-time notifications when policies are sold at this location.
            Perfect for integrating with HiQueue or your own systems.
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://your-system.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Webhook Secret
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={location.webhookSecret ? "••••••••••••••••" : "Not generated"}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                />
                <button
                  onClick={() => generateCredentials("webhook")}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {isGenerating ? "..." : "Generate"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subscribe to Events
            </label>
            <div className="flex flex-wrap gap-2">
              {["policy.created", "policy.cancelled", "commission.earned", "claim.filed"].map((event) => (
                <label
                  key={event}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                    webhookEvents.includes(event)
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="rounded text-teal-600"
                    checked={webhookEvents.includes(event)}
                    onChange={() => toggleWebhookEvent(event)}
                  />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={saveWebhookSettings}
            disabled={isSavingWebhook}
            className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSavingWebhook && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSavingWebhook ? "Saving..." : "Save Webhook Settings"}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
