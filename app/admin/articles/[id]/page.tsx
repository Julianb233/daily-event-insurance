"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Save,
  Eye,
  FileText,
  Image,
  Tag,
  Calendar,
  Globe,
  Star,
  Pin,
  RefreshCw,
  X,
  Plus,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImageUrl: string | null
  featuredImageAlt: string | null
  categoryId: string | null
  tags: string[]
  authorId: string | null
  authorName: string | null
  status: string
  publishedAt: string | null
  scheduledFor: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  portals: string[]
  isFeatured: boolean
  isPinned: boolean
  sortOrder: number
  views: number
  readTimeMinutes: number | null
  createdAt: string
  updatedAt: string
}

const PORTAL_OPTIONS = [
  { value: "all", label: "All Portals" },
  { value: "partner", label: "Partner Portal" },
  { value: "customer", label: "Customer Portal" },
  { value: "sales", label: "Sales Portal" },
  { value: "public", label: "Public Website" },
]

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tagInput, setTagInput] = useState("")
  const [article, setArticle] = useState<Article | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    featuredImageAlt: "",
    categoryId: "",
    tags: [] as string[],
    status: "draft",
    publishedAt: "",
    scheduledFor: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    portals: ["all"] as string[],
    isFeatured: false,
    isPinned: false,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch article and categories in parallel
        const [articleRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/articles/${id}`),
          fetch("/api/admin/articles/categories?activeOnly=true"),
        ])

        const [articleData, categoriesData] = await Promise.all([
          articleRes.json(),
          categoriesRes.json(),
        ])

        if (categoriesData.success) {
          setCategories(categoriesData.categories)
        }

        if (articleData.success && articleData.article) {
          const a = articleData.article
          setArticle(a)
          setFormData({
            title: a.title || "",
            slug: a.slug || "",
            excerpt: a.excerpt || "",
            content: a.content || "",
            featuredImageUrl: a.featuredImageUrl || "",
            featuredImageAlt: a.featuredImageAlt || "",
            categoryId: a.categoryId || "",
            tags: (a.tags as string[]) || [],
            status: a.status || "draft",
            publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 16) : "",
            scheduledFor: a.scheduledFor ? new Date(a.scheduledFor).toISOString().slice(0, 16) : "",
            seoTitle: a.seoTitle || "",
            seoDescription: a.seoDescription || "",
            seoKeywords: a.seoKeywords || "",
            portals: (a.portals as string[]) || ["all"],
            isFeatured: a.isFeatured || false,
            isPinned: a.isPinned || false,
          })
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Track changes
  useEffect(() => {
    if (article) {
      const hasChanged =
        formData.title !== (article.title || "") ||
        formData.slug !== (article.slug || "") ||
        formData.excerpt !== (article.excerpt || "") ||
        formData.content !== (article.content || "") ||
        formData.status !== (article.status || "draft") ||
        formData.isFeatured !== (article.isFeatured || false) ||
        formData.isPinned !== (article.isPinned || false)
      setHasChanges(hasChanged)
    }
  }, [formData, article])

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = {
        id,
        ...formData,
        status: publishNow ? "published" : formData.status,
      }

      const response = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        setArticle(data.article)
        setHasChanges(false)
        // Show success feedback
        alert("Article saved successfully!")
      } else {
        alert(data.error || "Failed to save article")
      }
    } catch (error) {
      console.error("Failed to save article:", error)
      alert("Failed to save article")
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }

  const handlePortalToggle = (portal: string) => {
    setFormData(prev => {
      if (portal === "all") {
        return { ...prev, portals: ["all"] }
      }
      const newPortals = prev.portals.filter(p => p !== "all")
      if (newPortals.includes(portal)) {
        const filtered = newPortals.filter(p => p !== portal)
        return { ...prev, portals: filtered.length > 0 ? filtered : ["all"] }
      }
      return { ...prev, portals: [...newPortals, portal] }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600">Loading article...</span>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-4">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/articles"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Edit Article</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{article.views?.toLocaleString() || 0} views</span>
                  <span>•</span>
                  <span>{article.readTimeMinutes || 0} min read</span>
                  {hasChanges && (
                    <>
                      <span>•</span>
                      <span className="text-amber-600">Unsaved changes</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving || !formData.title || !formData.content}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              {formData.status !== "published" && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving || !formData.title || !formData.content}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter article title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">/articles/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      }))}
                      placeholder="article-url-slug"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <p className="text-xs text-gray-500 mb-2">A brief summary shown in article listings</p>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a brief summary of the article..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={300}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{formData.excerpt.length}/300</p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Supports Markdown formatting</p>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your article content here..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                required
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Custom title for search engines"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.seoTitle.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Description for search engine results..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.seoDescription.length}/160</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Scheduling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                Publishing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {formData.status === "scheduled" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
                {article.publishedAt && (
                  <p className="text-xs text-gray-500">
                    Published: {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-gray-400" />
                Featured Image
              </h3>
              <div className="space-y-4">
                <input
                  type="url"
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {formData.featuredImageUrl && (
                  <div className="relative">
                    <img
                      src={formData.featuredImageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                    <input
                      type="text"
                      value={formData.featuredImageAlt}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuredImageAlt: e.target.value }))}
                      placeholder="Image alt text..."
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                Category
              </h3>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Portal Targeting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                Portal Visibility
              </h3>
              <div className="space-y-2">
                {PORTAL_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.portals.includes(option.value)}
                      onChange={() => handlePortalToggle(option.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">Featured Article</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <Pin className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-700">Pin to Top</span>
                </label>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
              <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(article.updatedAt).toLocaleString()}</p>
              <p>Author: {article.authorName || "Unknown"}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
