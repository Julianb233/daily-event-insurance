"use client"

import { useState, useEffect } from "react"
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  Video,
  Image,
  ExternalLink,
  Search,
  Megaphone,
  GraduationCap,
  BookOpen,
  X,
  Save,
  Eye,
} from "lucide-react"
import Link from "next/link"
import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  CATEGORY_CONFIG,
  TYPE_CONFIG,
  type PartnerResource,
  type ResourceCategory,
  type ResourceType,
} from "@/lib/partner-resources-data"

const typeIcons = {
  pdf: FileText,
  video: Video,
  image: Image,
  link: ExternalLink,
}

const categoryIcons = {
  marketing: Megaphone,
  training: GraduationCap,
  documentation: BookOpen,
}

interface ResourceFormData {
  id?: string
  title: string
  description: string
  category: ResourceCategory
  resourceType: ResourceType
  fileUrl: string
  thumbnailUrl: string
  sortOrder: number
}

const emptyForm: ResourceFormData = {
  title: "",
  description: "",
  category: "marketing",
  resourceType: "pdf",
  fileUrl: "",
  thumbnailUrl: "",
  sortOrder: 0,
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<PartnerResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [formData, setFormData] = useState<ResourceFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/resources")
      const data = await res.json()

      if (data.success) {
        setResources(data.resources)
      } else {
        throw new Error(data.error || "Failed to load resources")
      }
    } catch (err) {
      console.error("Error loading resources:", err)
      setError("Failed to load resources. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.title || !formData.category || !formData.resourceType) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const method = modalMode === "create" ? "POST" : "PUT"
      const res = await fetch("/api/admin/resources", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        await fetchResources()
        setShowModal(false)
        setFormData(emptyForm)
      } else {
        throw new Error(data.error || "Failed to save resource")
      }
    } catch (err: any) {
      console.error("Error saving resource:", err)
      setError(err.message || "Failed to save resource")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        await fetchResources()
        setDeleteConfirm(null)
      } else {
        throw new Error(data.error || "Failed to delete resource")
      }
    } catch (err: any) {
      console.error("Error deleting resource:", err)
      setError(err.message || "Failed to delete resource")
    }
  }

  function openCreateModal() {
    setFormData(emptyForm)
    setModalMode("create")
    setShowModal(true)
    setError(null)
  }

  function openEditModal(resource: PartnerResource) {
    setFormData({
      id: resource.id,
      title: resource.title,
      description: resource.description || "",
      category: resource.category,
      resourceType: resource.resourceType,
      fileUrl: resource.fileUrl || "",
      thumbnailUrl: resource.thumbnailUrl || "",
      sortOrder: resource.sortOrder || 0,
    })
    setModalMode("edit")
    setShowModal(true)
    setError(null)
  }

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesCategory = filterCategory === "all" || resource.category === filterCategory
    const matchesSearch = !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group by category for stats
  const stats = {
    marketing: resources.filter(r => r.category === "marketing").length,
    training: resources.filter(r => r.category === "training").length,
    documentation: resources.filter(r => r.category === "documentation").length,
    total: resources.length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Partner Resources</h1>
            </div>
            <p className="text-gray-600">
              Manage marketing materials, training resources, and documentation for partners.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const CategoryIcon = categoryIcons[key as ResourceCategory]
            return (
              <div key={key} className={`bg-white rounded-xl p-5 shadow-sm border ${config.borderColor}`}>
                <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{config.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stats[key as ResourceCategory]}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCategory === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const CategoryIcon = categoryIcons[key as ResourceCategory]
              return (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterCategory === key
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <CategoryIcon className="w-4 h-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResources.map((resource) => {
                  const categoryConfig = CATEGORY_CONFIG[resource.category]
                  const TypeIcon = typeIcons[resource.resourceType]
                  const CategoryIcon = categoryIcons[resource.category]

                  return (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${categoryConfig.color} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{resource.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-md">
                              {resource.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                          <CategoryIcon className="w-3.5 h-3.5" />
                          {categoryConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">
                          {TYPE_CONFIG[resource.resourceType].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {resource.sortOrder || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {resource.fileUrl && (
                            <a
                              href={resource.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(resource)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(resource.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FolderOpen className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500">No resources found</p>
              <button
                onClick={openCreateModal}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                Add your first resource
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === "create" ? "Add New Resource" : "Edit Resource"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Partner Logo Pack"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this resource..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Category and Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      {RESOURCE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_CONFIG[cat].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.resourceType}
                      onChange={(e) => setFormData({ ...formData, resourceType: e.target.value as ResourceType })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {TYPE_CONFIG[type].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File URL / Link
                  </label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://... or /resources/file.pdf"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full URL for external links or path for internal files
                  </p>
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="/images/thumbnail.png"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    min={0}
                    className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first within each category
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {modalMode === "create" ? "Add Resource" : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Resource</h3>
                  <p className="text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Partner Resources Work</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Resources are shown to partners in the Materials Library section</li>
            <li>• Partners can download files, watch videos, or access external links</li>
            <li>• Downloads are tracked for analytics purposes</li>
            <li>• Use sort order to control display order within each category</li>
            <li>• Supported types: PDF documents, Videos (YouTube/Vimeo), Images, External Links</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
