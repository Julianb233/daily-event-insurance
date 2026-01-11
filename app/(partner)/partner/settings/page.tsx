"use client"

import { useState, useEffect } from "react"
import { Bell, Mail, BarChart3, Save, Loader2, Check } from "lucide-react"

interface NotificationPreferences {
  changeRequests: {
    submitted: boolean
    approved: boolean
    rejected: boolean
    completed: boolean
  }
  marketing: boolean
  reports: boolean
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  async function fetchPreferences() {
    try {
      const res = await fetch("/api/partner/notification-preferences")
      const data = await res.json()
      if (data.success) {
        setPreferences(data.preferences)
      } else {
        setError(data.error || "Failed to load preferences")
      }
    } catch {
      setError("Failed to load preferences")
    } finally {
      setLoading(false)
    }
  }

  async function savePreferences() {
    if (!preferences) return

    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const res = await fetch("/api/partner/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || "Failed to save preferences")
      }
    } catch {
      setError("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  function updateChangeRequest(key: keyof NotificationPreferences["changeRequests"], value: boolean) {
    if (!preferences) return
    setPreferences({
      ...preferences,
      changeRequests: {
        ...preferences.changeRequests,
        [key]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your notification preferences and account settings.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Email Notifications</h2>
                <p className="text-sm text-slate-500">Choose which emails you want to receive</p>
              </div>
            </div>
          </div>

          {preferences && (
            <div className="p-6 space-y-6">
              {/* Change Request Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <h3 className="font-medium text-slate-900">Change Request Updates</h3>
                </div>
                <div className="space-y-3 pl-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.changeRequests.submitted}
                      onChange={(e) => updateChangeRequest("submitted", e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">
                      Request submitted confirmation
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.changeRequests.approved}
                      onChange={(e) => updateChangeRequest("approved", e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">
                      Request approved notifications
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.changeRequests.rejected}
                      onChange={(e) => updateChangeRequest("rejected", e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">
                      Request rejected notifications
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.changeRequests.completed}
                      onChange={(e) => updateChangeRequest("completed", e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900">
                      Changes applied notifications
                    </span>
                  </label>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Other Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <h3 className="font-medium text-slate-900">Other Notifications</h3>
                </div>
                <div className="space-y-3 pl-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.reports}
                      onChange={(e) => setPreferences({ ...preferences, reports: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-slate-700 group-hover:text-slate-900 block">
                        Monthly reports
                      </span>
                      <span className="text-sm text-slate-500">
                        Receive monthly earnings and performance summaries
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-slate-700 group-hover:text-slate-900 block">
                        Marketing updates
                      </span>
                      <span className="text-sm text-slate-500">
                        Tips, promotions, and product updates
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={savePreferences}
              disabled={saving || !preferences}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Critical notifications about your account security and important
            policy updates will always be sent regardless of your preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
