"use client"

import { useState, useEffect, useRef } from "react"
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
  Code,
  Variable,
  Copy,
  Check,
  SplitSquareHorizontal,
} from "lucide-react"
import Link from "next/link"
import { DOCUMENT_TYPES } from "@/lib/demo-documents"

// Template variables that can be inserted into documents
const TEMPLATE_VARIABLES = [
  { key: "{{BUSINESS_NAME}}", label: "Business Name", example: "Acme Fitness Studio" },
  { key: "{{CONTACT_NAME}}", label: "Contact Name", example: "John Smith" },
  { key: "{{CONTACT_EMAIL}}", label: "Contact Email", example: "john@acmefitness.com" },
  { key: "{{CONTACT_PHONE}}", label: "Contact Phone", example: "(555) 123-4567" },
  { key: "{{BUSINESS_ADDRESS}}", label: "Business Address", example: "123 Main St, City, ST 12345" },
  { key: "{{BUSINESS_TYPE}}", label: "Business Type", example: "Fitness Center" },
  { key: "{{EFFECTIVE_DATE}}", label: "Effective Date", example: new Date().toLocaleDateString() },
  { key: "{{COMMISSION_RATE}}", label: "Commission Rate", example: "40%" },
]

// Sample partner data for preview
const SAMPLE_PARTNER = {
  "{{BUSINESS_NAME}}": "Acme Fitness Studio",
  "{{CONTACT_NAME}}": "John Smith",
  "{{CONTACT_EMAIL}}": "john@acmefitness.com",
  "{{CONTACT_PHONE}}": "(555) 123-4567",
  "{{BUSINESS_ADDRESS}}": "123 Main Street, Suite 100, Los Angeles, CA 90001",
  "{{BUSINESS_TYPE}}": "Fitness Center",
  "{{EFFECTIVE_DATE}}": new Date().toLocaleDateString(),
  "{{COMMISSION_RATE}}": "40%",
}

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
  const [showSplitView, setShowSplitView] = useState(true)
  const [showVariables, setShowVariables] = useState(false)
  const [copiedVar, setCopiedVar] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Function to insert variable at cursor position
  function insertVariable(variable: string) {
    if (!textareaRef.current || !editDoc) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const content = editDoc.content
    const newContent = content.substring(0, start) + variable + content.substring(end)

    setEditDoc({ ...editDoc, content: newContent })

    // Restore cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length, start + variable.length)
    }, 0)
  }

  // Function to copy variable to clipboard
  function copyVariable(variable: string) {
    navigator.clipboard.writeText(variable)
    setCopiedVar(variable)
    setTimeout(() => setCopiedVar(null), 2000)
  }

  // Function to render preview with variables substituted
  function renderPreview(content: string): string {
    let preview = content
    Object.entries(SAMPLE_PARTNER).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value)
    })
    return preview
  }

  // Simple markdown to HTML renderer
  function renderMarkdown(content: string): string {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />')
  }

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
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditDoc(null)
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Edit {editDoc.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showVariables ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Variable className="w-4 h-4" />
                <span className="hidden sm:inline">Variables</span>
              </button>
              <button
                onClick={() => setShowSplitView(!showSplitView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showSplitView ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SplitSquareHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Split View</span>
              </button>
            </div>
          </div>

          {/* Variable Insertion Panel */}
          {showVariables && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Variable className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Template Variables</h3>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  Click to insert at cursor
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key)}
                    className="group flex flex-col items-start p-2 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
                  >
                    <span className="text-xs font-mono text-purple-700 group-hover:text-purple-900">
                      {v.key}
                    </span>
                    <span className="text-xs text-gray-500">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Title and Type */}
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={editDoc.title}
                    onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    value={editDoc.type}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  >
                    {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {getDocumentTypeLabel(value)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Editor and Preview */}
            <div className={`grid ${showSplitView ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
              {/* Editor */}
              <div className={`p-4 ${showSplitView ? "border-r border-gray-200" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Content (Markdown)
                  </label>
                  <span className="text-xs text-gray-500">
                    {editDoc.content.length} characters
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={editDoc.content}
                  onChange={(e) => setEditDoc({ ...editDoc, content: e.target.value })}
                  rows={showSplitView ? 24 : 20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm resize-none"
                  placeholder="Enter document content using Markdown..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use: # Heading, ## Subheading, **bold**, *italic*, - list items
                </p>
              </div>

              {/* Live Preview */}
              {showSplitView && (
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Live Preview
                    </label>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Sample data applied
                    </span>
                  </div>
                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 h-[500px] overflow-y-auto prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(renderPreview(editDoc.content))
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-500">
                Version: {editDoc.version} → {incrementVersion(editDoc.version)}
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

          {/* Help Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Template Variables</h4>
            <p className="text-sm text-blue-800 mb-2">
              Use variables like <code className="bg-blue-100 px-1 rounded">{"{{BUSINESS_NAME}}"}</code> to automatically insert partner information when the document is signed.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {TEMPLATE_VARIABLES.slice(0, 4).map((v) => (
                <div key={v.key} className="flex items-center gap-2">
                  <code className="bg-blue-100 px-1 rounded text-blue-700">{v.key}</code>
                  <span className="text-blue-600">→ {v.example}</span>
                </div>
              ))}
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
