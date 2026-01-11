"use client"

import { useState } from "react"
import { X, Palette, Type, Loader2, Check, Image, FileText } from "lucide-react"

interface ChangeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  currentBranding?: {
    siteName?: string
    primaryColor?: string
    logoUrl?: string
    heroImageUrl?: string
  }
  onSubmit: (request: {
    requestType: "branding" | "content" | "both"
    requestedBranding?: Record<string, string>
    requestedContent?: Record<string, string>
    partnerNotes?: string
  }) => Promise<void>
}

type TabType = "branding" | "content"

export function ChangeRequestModal({
  isOpen,
  onClose,
  currentBranding,
  onSubmit,
}: ChangeRequestModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("branding")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Branding fields
  const [siteName, setSiteName] = useState(currentBranding?.siteName || "")
  const [primaryColor, setPrimaryColor] = useState(currentBranding?.primaryColor || "#14B8A6")
  const [logoUrl, setLogoUrl] = useState(currentBranding?.logoUrl || "")
  const [heroImageUrl, setHeroImageUrl] = useState(currentBranding?.heroImageUrl || "")

  // Content fields
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")

  // Notes
  const [partnerNotes, setPartnerNotes] = useState("")

  if (!isOpen) return null

  const hasChanges = () => {
    if (activeTab === "branding") {
      return (
        siteName !== (currentBranding?.siteName || "") ||
        primaryColor !== (currentBranding?.primaryColor || "#14B8A6") ||
        logoUrl !== (currentBranding?.logoUrl || "") ||
        heroImageUrl !== (currentBranding?.heroImageUrl || "")
      )
    }
    return tagline.trim() !== "" || description.trim() !== ""
  }

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setError("Please make at least one change before submitting")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const requestedBranding: Record<string, string> = {}
      const requestedContent: Record<string, string> = {}

      // Only include changed branding fields
      if (siteName !== (currentBranding?.siteName || "")) {
        requestedBranding.siteName = siteName
      }
      if (primaryColor !== (currentBranding?.primaryColor || "#14B8A6")) {
        requestedBranding.primaryColor = primaryColor
      }
      if (logoUrl !== (currentBranding?.logoUrl || "")) {
        requestedBranding.logoUrl = logoUrl
      }
      if (heroImageUrl !== (currentBranding?.heroImageUrl || "")) {
        requestedBranding.heroImageUrl = heroImageUrl
      }

      // Content fields
      if (tagline.trim()) {
        requestedContent.tagline = tagline.trim()
      }
      if (description.trim()) {
        requestedContent.description = description.trim()
      }

      const hasBrandingChanges = Object.keys(requestedBranding).length > 0
      const hasContentChanges = Object.keys(requestedContent).length > 0

      let requestType: "branding" | "content" | "both" = "branding"
      if (hasBrandingChanges && hasContentChanges) {
        requestType = "both"
      } else if (hasContentChanges) {
        requestType = "content"
      }

      await onSubmit({
        requestType,
        requestedBranding: hasBrandingChanges ? requestedBranding : undefined,
        requestedContent: hasContentChanges ? requestedContent : undefined,
        partnerNotes: partnerNotes.trim() || undefined,
      })

      setSubmitted(true)
    } catch (err) {
      setError("Failed to submit request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setSubmitted(false)
      setError("")
      onClose()
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your change request has been submitted and will be reviewed by our team.
              You&apos;ll be notified when it&apos;s approved or if we need more information.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Microsite Changes</h2>
            <p className="text-sm text-gray-500">
              Submit changes for review by our team
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("branding")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "branding"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Palette className="w-4 h-4" />
            Branding
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "content"
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Content
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "branding" ? (
            <div className="space-y-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Your business name"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                {currentBranding?.siteName && siteName !== currentBranding.siteName && (
                  <p className="mt-1 text-xs text-amber-600">
                    Current: {currentBranding.siteName}
                  </p>
                )}
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#14B8A6"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                  />
                </div>
                {currentBranding?.primaryColor && primaryColor !== currentBranding.primaryColor && (
                  <p className="mt-1 text-xs text-amber-600">
                    Current: {currentBranding.primaryColor}
                  </p>
                )}
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                {logoUrl && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="max-h-16 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Hero Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL
                </label>
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                {heroImageUrl && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={heroImageUrl}
                      alt="Hero preview"
                      className="max-h-32 w-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your event, our protection"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your services..."
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6 pt-6 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={partnerNotes}
              onChange={(e) => setPartnerNotes(e.target.value)}
              placeholder="Any additional context or special requests..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges()}
            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
