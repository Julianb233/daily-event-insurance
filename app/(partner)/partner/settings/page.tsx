"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Link2,
  Save,
  User,
  Building2,
  Mail,
  Phone,
  Palette,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"

interface PartnerProfile {
  id: string
  business_name: string
  business_type: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  primary_color: string
  logo_url: string | null
  integration_type: string
}

interface NotificationSettings {
  email_new_quote: boolean
  email_quote_accepted: boolean
  email_policy_issued: boolean
  email_payment_received: boolean
  email_weekly_summary: boolean
  email_monthly_report: boolean
  webhook_url: string | null
  webhook_enabled: boolean
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_new_quote: true,
    email_quote_accepted: true,
    email_policy_issued: true,
    email_payment_received: true,
    email_weekly_summary: true,
    email_monthly_report: true,
    webhook_url: null,
    webhook_enabled: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/partner/profile")
      if (!response.ok) throw new Error("Failed to fetch settings")

      const data = await response.json()
      setProfile(data.profile || data)

      // Load notification settings from localStorage or API
      const savedNotifications = localStorage.getItem("partner_notifications")
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveNotifications() {
    try {
      setIsSaving(true)

      // Save to localStorage for now (would be API in production)
      localStorage.setItem("partner_notifications", JSON.stringify(notifications))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  function handleNotificationToggle(key: keyof NotificationSettings) {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  function handleWebhookUrlChange(value: string) {
    setNotifications(prev => ({
      ...prev,
      webhook_url: value || null,
    }))
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and notification preferences</p>
      </div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Building2 className="w-4 h-4" />
                Business Name
              </label>
              <input
                type="text"
                value={profile?.business_name || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Shield className="w-4 h-4" />
                Business Type
              </label>
              <input
                type="text"
                value={profile?.business_type || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 capitalize"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4" />
                Contact Name
              </label>
              <input
                type="text"
                value={profile?.contact_name || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={profile?.contact_email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile?.contact_phone || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Palette className="w-4 h-4" />
                Brand Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-slate-200"
                  style={{ backgroundColor: profile?.primary_color || "#14B8A6" }}
                />
                <input
                  type="text"
                  value={profile?.primary_color || "#14B8A6"}
                  disabled
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              To update your account information, please contact support at{" "}
              <a href="mailto:support@hiqor.com" className="font-semibold hover:underline">
                support@hiqor.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Email Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">New Quote Created</p>
              <p className="text-sm text-slate-600">Receive email when a new quote is generated</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_new_quote")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_new_quote ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_new_quote ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Quote Accepted</p>
              <p className="text-sm text-slate-600">Receive email when a customer accepts a quote</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_quote_accepted")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_quote_accepted ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_quote_accepted ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Policy Issued</p>
              <p className="text-sm text-slate-600">Receive email when a new policy is issued</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_policy_issued")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_policy_issued ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_policy_issued ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Payment Received</p>
              <p className="text-sm text-slate-600">Receive email when payment is processed</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_payment_received")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_payment_received ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_payment_received ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Weekly Summary</p>
              <p className="text-sm text-slate-600">Receive weekly summary of your performance</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_weekly_summary")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_weekly_summary ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_weekly_summary ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Monthly Report</p>
              <p className="text-sm text-slate-600">Receive detailed monthly earnings report</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("email_monthly_report")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email_monthly_report ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email_monthly_report ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Webhook Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Webhook Integration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={notifications.webhook_url || ""}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
              placeholder="https://your-domain.com/webhooks/insurance"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-sm text-slate-600 mt-2">
              Receive real-time notifications for quotes, policies, and payments at your endpoint
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-medium text-slate-900">Enable Webhook Notifications</p>
              <p className="text-sm text-slate-600">Send POST requests to your webhook URL for all events</p>
            </div>
            <button
              onClick={() => handleNotificationToggle("webhook_enabled")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.webhook_enabled ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.webhook_enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>API Partners:</strong> Webhooks are only available for API integration partners.
              Contact support to upgrade your integration type.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-green-600"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Settings saved successfully</span>
          </motion.div>
        )}
        <button
          onClick={handleSaveNotifications}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>

      <IntegrationChatWidget
        topic="api_integration"
        partnerId={profile?.id}
        partnerEmail={profile?.contact_email}
        partnerName={profile?.contact_name}
      />
    </div>
  )
}
