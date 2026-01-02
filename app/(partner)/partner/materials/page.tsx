"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FolderOpen,
  Download,
  FileText,
  Video,
  Image,
  ExternalLink,
  Search,
  Megaphone,
  GraduationCap,
  BookOpen,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description?: string
  category: "marketing" | "training" | "documentation"
  resource_type: "pdf" | "video" | "image" | "link"
  file_url: string
  thumbnail_url?: string
  downloadCount?: number
}

interface ResourcesData {
  resources: Resource[]
  grouped: {
    marketing: Resource[]
    training: Resource[]
    documentation: Resource[]
  }
}

const categoryConfig = {
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    color: "bg-pink-100 text-pink-600",
    borderColor: "border-pink-200",
  },
  training: {
    label: "Training",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200",
  },
  documentation: {
    label: "Documentation",
    icon: BookOpen,
    color: "bg-emerald-100 text-emerald-600",
    borderColor: "border-emerald-200",
  },
}

const typeIcons = {
  pdf: FileText,
  video: Video,
  image: Image,
  link: ExternalLink,
}

// Demo resources for when API is not configured
const demoResources: Resource[] = [
  {
    id: "1",
    title: "Partner Logo Pack",
    description: "Official Daily Event Insurance logos in various formats (PNG, SVG, EPS)",
    category: "marketing",
    resource_type: "image",
    file_url: "/resources/logo-pack.zip",
  },
  {
    id: "2",
    title: "Social Media Templates",
    description: "Ready-to-use graphics for Instagram, Facebook, and LinkedIn",
    category: "marketing",
    resource_type: "image",
    file_url: "/resources/social-templates.zip",
  },
  {
    id: "3",
    title: "Email Templates",
    description: "Pre-written email templates for customer communication",
    category: "marketing",
    resource_type: "pdf",
    file_url: "/resources/email-templates.pdf",
  },
  {
    id: "4",
    title: "Widget Integration Guide",
    description: "Step-by-step video walkthrough for widget integration",
    category: "training",
    resource_type: "video",
    file_url: "https://www.youtube.com/watch?v=example",
  },
  {
    id: "5",
    title: "Best Practices Guide",
    description: "Tips and strategies for maximizing your partnership success",
    category: "training",
    resource_type: "pdf",
    file_url: "/resources/best-practices.pdf",
  },
  {
    id: "6",
    title: "Partner Handbook",
    description: "Complete partner program overview, policies, and procedures",
    category: "documentation",
    resource_type: "pdf",
    file_url: "/resources/partner-handbook.pdf",
  },
  {
    id: "7",
    title: "API Documentation",
    description: "Technical documentation for API integration",
    category: "documentation",
    resource_type: "link",
    file_url: "/docs/api",
  },
  {
    id: "8",
    title: "FAQ & Troubleshooting",
    description: "Common questions and solutions for partners",
    category: "documentation",
    resource_type: "pdf",
    file_url: "/resources/faq.pdf",
  },
]

export default function PartnerMaterialsPage() {
  const [data, setData] = useState<ResourcesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources() {
    try {
      const response = await fetch("/api/partner/resources")
      if (!response.ok) throw new Error("Failed to fetch")
      const resourcesData = await response.json()
      setData(resourcesData)
    } catch (err) {
      console.error("Error:", err)
      // Use demo data
      setData({
        resources: demoResources,
        grouped: {
          marketing: demoResources.filter((r) => r.category === "marketing"),
          training: demoResources.filter((r) => r.category === "training"),
          documentation: demoResources.filter((r) => r.category === "documentation"),
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function trackDownload(resourceId: string) {
    try {
      await fetch("/api/partner/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      })
    } catch (err) {
      // Silently fail tracking
    }
  }

  function handleResourceClick(resource: Resource) {
    trackDownload(resource.id)
    if (resource.resource_type === "link") {
      window.open(resource.file_url, "_blank")
    } else if (resource.resource_type === "video") {
      window.open(resource.file_url, "_blank")
    } else {
      // Download file using new download API endpoint
      const filename = resource.file_url.split("/").pop()
      if (filename) {
        // Use new download endpoint for better tracking and security
        window.location.href = `/api/downloads/${resource.category}/${filename}`
      } else {
        // Fallback to direct download
        const a = document.createElement("a")
        a.href = resource.file_url
        a.download = resource.title
        a.click()
      }
    }
  }

  // Filter resources
  const filteredResources = data?.resources.filter((resource) => {
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory
    const matchesSearch = !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }) || []

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Materials Library</h1>
        <p className="text-slate-600 mt-1">Access marketing materials, training resources, and documentation.</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-teal-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === key
                  ? "bg-teal-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <config.icon className="w-4 h-4" />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = data?.grouped[key as keyof typeof data.grouped]?.length || 0
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl p-5 shadow-lg border ${config.borderColor}`}
            >
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <config.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{config.label}</p>
                  <p className="text-xl font-bold text-slate-900">{count} Resources</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => {
          const config = categoryConfig[resource.category]
          const TypeIcon = typeIcons[resource.resource_type]

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all group cursor-pointer"
              onClick={() => handleResourceClick(resource)}
            >
              {/* Thumbnail / Icon area */}
              <div className={`h-32 ${config.color.replace('text-', 'bg-').replace('-600', '-50')} flex items-center justify-center relative`}>
                <div className={`w-16 h-16 rounded-xl ${config.color} flex items-center justify-center`}>
                  <TypeIcon className="w-8 h-8" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 ${config.color} text-xs font-medium rounded-full`}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase font-medium">
                    {resource.resource_type}
                  </span>
                  <button className="flex items-center gap-1 text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
                    {resource.resource_type === "link" ? (
                      <>
                        Open <ExternalLink className="w-4 h-4" />
                      </>
                    ) : resource.resource_type === "video" ? (
                      <>
                        Watch <Video className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Download <Download className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}

        {filteredResources.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
