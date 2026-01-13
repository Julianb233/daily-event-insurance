'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Eye,
  ScrollText,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface Contract {
  id: string
  name: string
  displayName: string
  description: string | null
  content: string
  version: number
  isActive: boolean
  isRequired: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export default function ContractEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new'

  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    content: '',
    isActive: false,
    isRequired: true,
    sortOrder: 0,
  })

  useEffect(() => {
    if (!isNew) {
      fetchContract()
    }
  }, [id, isNew])

  async function fetchContract() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/contracts/${id}`)
      const json = await res.json()

      if (json.success) {
        setContract(json.data)
        setFormData({
          name: json.data.name || '',
          displayName: json.data.displayName || '',
          description: json.data.description || '',
          content: json.data.content || '',
          isActive: json.data.isActive ?? false,
          isRequired: json.data.isRequired ?? true,
          sortOrder: json.data.sortOrder || 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch contract:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)

      const url = isNew ? '/api/admin/contracts' : `/api/admin/contracts/${id}`
      const method = isNew ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (json.success) {
        if (isNew) {
          router.push(`/admin/contracts/${json.data.id}`)
        } else {
          setContract(json.data)
          alert('Contract saved successfully!')
        }
      } else {
        alert('Failed to save: ' + (json.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to save contract:', error)
      alert('Failed to save contract')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!formData.isActive) {
      setFormData({ ...formData, isActive: true })
    }
    await handleSave()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/contracts"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Create Contract' : `Edit: ${contract?.displayName}`}
            </h1>
            <p className="text-gray-500">
              {isNew
                ? 'Create a new contract template for partner onboarding'
                : `Version ${contract?.version} • Last updated ${new Date(contract?.updatedAt || '').toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Version Warning */}
      {!isNew && contract?.isActive && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Version Control Active</h4>
              <p className="text-sm text-amber-700 mt-1">
                This contract is currently published. Editing the content will create a new version (v{(contract?.version || 0) + 1}).
                Existing partner signatures will remain valid for their signed version.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            {showPreview ? (
              /* Preview Mode */
              <div className="p-6">
                <div className="prose max-w-none">
                  <h1>{formData.displayName}</h1>
                  {formData.description && (
                    <p className="text-gray-600">{formData.description}</p>
                  )}
                  <hr />
                  <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                    {formData.content || 'No content yet...'}
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="p-6 space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Partnership Agreement"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                {/* Internal Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Name (slug) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="partnership_agreement"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for internal reference. Use lowercase and underscores.</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this contract covers"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                {/* Contract Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder={`# Contract Title

## Section 1
Your contract content here...

## Section 2
More content...

Supports Markdown formatting.`}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports Markdown formatting. Use # for headings, ** for bold, etc.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Contract Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>

            <div className="space-y-4">
              {/* Required Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Required</p>
                  <p className="text-sm text-gray-500">Must sign during onboarding</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isRequired: !formData.isRequired })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.isRequired ? 'bg-violet-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.isRequired ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the onboarding flow
                </p>
              </div>
            </div>
          </motion.div>

          {/* Version Info */}
          {!isNew && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg border border-violet-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-500 text-white rounded text-xs flex items-center justify-center font-medium">
                      v{contract?.version}
                    </span>
                    <span className="text-sm font-medium text-gray-900">Current Version</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {contract?.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Placeholder for version history - would need API support */}
                <p className="text-xs text-gray-500 text-center py-2">
                  Version history coming soon...
                </p>
              </div>
            </motion.div>
          )}

          {/* Quick Links */}
          {!isNew && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>

              <div className="space-y-2">
                <Link
                  href={`/admin/contracts/${id}/signatures`}
                  className="flex items-center gap-2 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ScrollText className="w-4 h-4" />
                  View Signatures
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
