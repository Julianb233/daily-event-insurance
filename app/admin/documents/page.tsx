"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { DOCUMENT_TYPES } from "@/lib/demo-documents"

interface DocumentTemplate {
  id: string
  type: string
  title: string
  content: string
  version: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export default function AdminDocumentsPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewDoc, setPreviewDoc] = useState<DocumentTemplate | null>(null)
  const [editDoc, setEditDoc] = useState<DocumentTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/documents/templates")
      const data = await res.json()

      if (data.success) {
        setTemplates(data.templates)
      } else {
        throw new Error("Failed to load templates")
      }
    } catch (err) {
      console.error("Error loading templates:", err)
      setError("Failed to load document templates")
    } finally {
      setLoading(false)
    }
  }

  async function saveTemplate(template: DocumentTemplate) {
    setSaving(true)
    try {
      const res = await fetch("/api/documents/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: template.type,
          title: template.title,
          content: template.content,
          version: incrementVersion(template.version),
        }),
      })

      const data = await res.json()

      if (data.success) {
        await fetchTemplates()
        setEditDoc(null)
        setIsEditing(false)
      } else {
        throw new Error(data.error || "Failed to save template")
      }
    } catch (err) {
      console.error("Error saving template:", err)
      setError("Failed to save template")
    } finally {
      setSaving(false)
    }
  }

  function incrementVersion(version: string): string {
    const parts = version.split(".")
    if (parts.length === 2) {
      const minor = parseInt(parts[1], 10) + 1
      return `${parts[0]}.${minor}`
    }
    return "1.1"
  }

  function getDocumentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      partner_agreement: "Partner Agreement",
      w9: "W-9 Tax Form",
      direct_deposit: "Direct Deposit Authorization",
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                fetchTemplates()
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  if (isEditing && editDoc) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setIsEditing(false)
              setEditDoc(null)
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documents
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit {editDoc.title}
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={editDoc.title}
                  onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={editDoc.type}
                  onChange={(e) => setEditDoc({ ...editDoc, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  disabled
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {getDocumentTypeLabel(value)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Document type cannot be changed after creation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={editDoc.content}
                  onChange={(e) => setEditDoc({ ...editDoc, content: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Markdown formatting: # Heading, **bold**, - list items, etc.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Current version: {editDoc.version} → New version: {incrementVersion(editDoc.version)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditDoc(null)
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveTemplate(editDoc)}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Preview Mode
  if (previewDoc) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setPreviewDoc(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documents
          </button>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{previewDoc.title}</h1>
                  <p className="text-sm text-gray-500">Version {previewDoc.version}</p>
                </div>
                <button
                  onClick={() => {
                    setEditDoc(previewDoc)
                    setIsEditing(true)
                    setPreviewDoc(null)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Document
                </button>
              </div>
            </div>
            <div className="p-6 prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">{previewDoc.content}</pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Templates</h1>
            <p className="text-gray-600">
              Manage partner onboarding documents. Edit content to customize for your business.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
        </div>

        {/* Document Cards */}
        <div className="grid gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{template.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {getDocumentTypeLabel(template.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Version {template.version}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={() => setPreviewDoc(template)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditDoc(template)
                      setIsEditing(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {template.content.substring(0, 200).replace(/[#*\n]/g, " ").trim()}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Templates</h3>
            <p className="text-gray-600 mb-6">
              Document templates will appear here once created.
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Document Templates Work</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Documents are shown to partners during the onboarding process</li>
            <li>• Partners must sign all documents before their account is activated</li>
            <li>• Editing a document creates a new version (existing signatures remain valid)</li>
            <li>• Use Markdown formatting for headings, lists, and emphasis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
