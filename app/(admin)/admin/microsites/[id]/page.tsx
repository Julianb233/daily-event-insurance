'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Upload,
  Save,
  Power,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
  Mail,
  Award,
  Calendar,
  TrendingUp,
  AlertTriangle,
  X,
  Image as ImageIcon,
} from 'lucide-react'

interface Microsite {
  id: string
  partnerId: string
  slug: string
  customDomain: string | null
  isActive: boolean
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  businessName: string
  setupFee: string
  feeCollected: boolean
  feeCollectedAt: string | null
  createdAt: string
  updatedAt: string
  partnerName: string
  partnerEmail: string
  partnerTier: string | null
  totalPolicies: number
  totalPremium: number
}

interface FormData {
  businessName: string
  slug: string
  customDomain: string
  primaryColor: string
  secondaryColor: string
  isActive: boolean
}

interface FormErrors {
  businessName?: string
  slug?: string
  customDomain?: string
}

// Mock data for development
const mockMicrosite: Microsite = {
  id: 'ms1',
  partnerId: 'p1',
  slug: 'adventure-sports-inc',
  customDomain: null,
  isActive: true,
  logoUrl: null,
  primaryColor: '#14B8A6',
  secondaryColor: '#0D9488',
  businessName: 'Adventure Sports Inc',
  setupFee: '550.00',
  feeCollected: true,
  feeCollectedAt: '2024-03-25T10:30:00Z',
  createdAt: '2024-03-20T00:00:00Z',
  updatedAt: '2024-03-20T00:00:00Z',
  partnerName: 'John Smith',
  partnerEmail: 'john@adventuresports.com',
  partnerTier: 'Gold',
  totalPolicies: 342,
  totalPremium: 85600,
}

export default function MicrositePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [microsite, setMicrosite] = useState<Microsite | null>(null)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    slug: '',
    customDomain: '',
    primaryColor: '#14B8A6',
    secondaryColor: '#0D9488',
    isActive: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [collectingFee, setCollectingFee] = useState(false)

  useEffect(() => {
    if (id) {
      fetchMicrosite()
    }
  }, [id])

  async function fetchMicrosite() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/microsites/${id}`)
      const json = await res.json()

      if (json.success) {
        const data = json.data
        setMicrosite(data)
        setFormData({
          businessName: data.businessName,
          slug: data.slug,
          customDomain: data.customDomain || '',
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor || '#0D9488',
          isActive: data.isActive,
        })
        setLogoPreview(data.logoUrl)
      } else {
        // Use mock data in dev mode
        setMicrosite(mockMicrosite)
        setFormData({
          businessName: mockMicrosite.businessName,
          slug: mockMicrosite.slug,
          customDomain: mockMicrosite.customDomain || '',
          primaryColor: mockMicrosite.primaryColor,
          secondaryColor: mockMicrosite.secondaryColor,
          isActive: mockMicrosite.isActive,
        })
        setLogoPreview(mockMicrosite.logoUrl)
      }
    } catch (error) {
      console.error('Failed to fetch microsite:', error)
      // Use mock data
      setMicrosite(mockMicrosite)
      setFormData({
        businessName: mockMicrosite.businessName,
        slug: mockMicrosite.slug,
        customDomain: mockMicrosite.customDomain || '',
        primaryColor: mockMicrosite.primaryColor,
        secondaryColor: mockMicrosite.secondaryColor,
        isActive: mockMicrosite.isActive,
      })
      setLogoPreview(mockMicrosite.logoUrl)
    } finally {
      setLoading(false)
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase alphanumeric with hyphens only'
    }

    if (formData.customDomain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.customDomain)) {
      newErrors.customDomain = 'Invalid domain format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSave() {
    if (!validateForm()) return

    try {
      setSaving(true)

      // Upload logo if changed
      let logoUrl = microsite?.logoUrl
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        formData.append('type', 'microsite-logo')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json()
          logoUrl = uploadJson.url
        }
      }

      const res = await fetch(`/api/admin/microsites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customDomain: formData.customDomain || null,
          logoUrl,
        }),
      })

      if (res.ok) {
        await fetchMicrosite()
        // Show success notification
        alert('Microsite updated successfully')
      } else {
        const json = await res.json()
        alert(json.message || 'Failed to update microsite')
      }
    } catch (error) {
      console.error('Failed to save microsite:', error)
      alert('Failed to save microsite')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true)

      const res = await fetch(`/api/admin/microsites/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/admin/microsites')
      } else {
        const json = await res.json()
        alert(json.message || 'Failed to delete microsite')
      }
    } catch (error) {
      console.error('Failed to delete microsite:', error)
      alert('Failed to delete microsite')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  async function handleMarkFeeCollected() {
    try {
      setCollectingFee(true)

      const res = await fetch(`/api/admin/microsites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeCollected: true }),
      })

      if (res.ok) {
        await fetchMicrosite()
      }
    } catch (error) {
      console.error('Failed to mark fee collected:', error)
    } finally {
      setCollectingFee(false)
    }
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!microsite) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-500">Microsite not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/microsites"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{microsite.businessName}</h1>
            <p className="text-gray-500">Microsite Configuration</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              microsite.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${microsite.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            {microsite.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Preview Link */}
        <div className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4 text-gray-400" />
          <a
            href={
              microsite.customDomain
                ? `https://${microsite.customDomain}`
                : `/m/${microsite.slug}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            {microsite.customDomain || `${window.location.host}/m/${microsite.slug}`}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Branding</h2>

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.businessName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Logo
                </label>
                <div className="flex items-start gap-4">
                  <div
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-violet-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Upload</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your business logo. Recommended size: 400x400px
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </button>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-16 h-10 rounded cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="#14B8A6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="w-16 h-10 rounded cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="#0D9488"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>

            <div className="space-y-4">
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug (URL Path) *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">
                    /m/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                    }
                    className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                      errors.slug ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="adventure-sports-inc"
                  />
                </div>
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              {/* Custom Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, customDomain: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.customDomain ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="insurance.yourdomain.com"
                />
                {errors.customDomain && (
                  <p className="text-red-500 text-sm mt-1">{errors.customDomain}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Point your custom domain&apos;s CNAME record to our server
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Active Status</p>
                  <p className="text-sm text-gray-500">
                    {formData.isActive
                      ? 'Microsite is publicly accessible'
                      : 'Microsite is hidden from public'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? 'bg-violet-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-violet-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <p className="text-sm text-violet-700 font-medium">Policies Sold</p>
                </div>
                <p className="text-2xl font-bold text-violet-900">
                  {microsite.totalPolicies.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <p className="text-sm text-teal-700 font-medium">Premium Generated</p>
                </div>
                <p className="text-2xl font-bold text-teal-900">
                  {formatCurrency(microsite.totalPremium)}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-700 font-medium">Created</p>
                </div>
                <p className="text-sm font-semibold text-blue-900">
                  {formatDate(microsite.createdAt)}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-700 font-medium">Last Updated</p>
                </div>
                <p className="text-sm font-semibold text-purple-900">
                  {formatDate(microsite.updatedAt)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                formData.isActive
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <Power className="w-4 h-4" />
              {formData.isActive ? 'Deactivate' : 'Activate'}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partner Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner Info</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Partner Name</p>
                  <p className="font-medium text-gray-900 truncate">
                    {microsite.partnerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${microsite.partnerEmail}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate block"
                  >
                    {microsite.partnerEmail}
                  </a>
                </div>
              </div>

              {microsite.partnerTier && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">Commission Tier</p>
                    <p className="font-medium text-gray-900">{microsite.partnerTier}</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/admin/partners/${microsite.partnerId}`}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              View Partner Details
              <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>

          {/* Setup Fee */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Fee</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fee Amount</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(parseFloat(microsite.setupFee))}
                </span>
              </div>

              {microsite.feeCollected ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-900">Fee Collected</p>
                  </div>
                  {microsite.feeCollectedAt && (
                    <p className="text-sm text-green-700">
                      Collected on {formatDate(microsite.feeCollectedAt)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <p className="font-medium text-yellow-900">Payment Pending</p>
                    </div>
                  </div>

                  <button
                    onClick={handleMarkFeeCollected}
                    disabled={collectingFee}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {collectingFee ? 'Updating...' : 'Mark as Collected'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Microsite</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{microsite.businessName}</strong>?
                This will deactivate the microsite and make it inaccessible.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
