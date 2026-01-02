/**
 * Partner Resources Data and Content
 * 
 * This file contains all partner resource constants, types, and content
 * that can be managed through the admin dashboard.
 */

// Resource Categories
export const RESOURCE_CATEGORIES = ["marketing", "training", "documentation"] as const
export type ResourceCategory = typeof RESOURCE_CATEGORIES[number]

// Resource Types
export const RESOURCE_TYPES = ["pdf", "video", "image", "link"] as const
export type ResourceType = typeof RESOURCE_TYPES[number]

// Input type for creating/updating resources
export interface PartnerResourceInput {
  title: string
  description?: string
  category: ResourceCategory
  resourceType: ResourceType
  fileUrl?: string
  thumbnailUrl?: string
  sortOrder?: number
}

// Full resource type (includes database fields)
export interface PartnerResource extends PartnerResourceInput {
  id: string
  createdAt: string
}

// Category configuration for display
export const CATEGORY_CONFIG = {
  marketing: {
    label: "Marketing",
    description: "Promotional materials, logos, and social media assets",
    color: "bg-pink-100 text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  training: {
    label: "Training",
    description: "Video tutorials, guides, and best practices",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  documentation: {
    label: "Documentation",
    description: "API docs, handbooks, and reference materials",
    color: "bg-emerald-100 text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
} as const

// Type configuration for display
export const TYPE_CONFIG = {
  pdf: {
    label: "PDF Document",
    action: "Download",
  },
  video: {
    label: "Video",
    action: "Watch",
  },
  image: {
    label: "Image/Graphics",
    action: "Download",
  },
  link: {
    label: "External Link",
    action: "Open",
  },
} as const

/**
 * Demo resources with realistic content for admin management
 * These are displayed when the database is not configured
 */
export const ADMIN_DEMO_RESOURCES: PartnerResource[] = [
  // Marketing Resources
  {
    id: "res-001",
    title: "Partner Logo Pack",
    description: "Official Daily Event Insurance logos in various formats (PNG, SVG, EPS). Includes light and dark versions, horizontal and stacked layouts for all marketing needs.",
    category: "marketing",
    resourceType: "image",
    fileUrl: "/resources/marketing/logo-pack-readme.txt",
    thumbnailUrl: "/images/logo-thumbnail.png",
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-002",
    title: "Social Media Templates",
    description: "Ready-to-use graphics optimized for Instagram, Facebook, LinkedIn, and Twitter. Includes story templates, post templates, and cover images with customizable branding.",
    category: "marketing",
    resourceType: "image",
    fileUrl: "/resources/marketing/social-media-readme.txt",
    thumbnailUrl: "/images/social-thumbnail.png",
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-003",
    title: "Email Templates Collection",
    description: "Pre-written email templates for customer outreach, follow-ups, and promotional campaigns. Includes welcome emails, coverage reminders, and renewal notices.",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/marketing/email-templates.pdf",
    thumbnailUrl: "/images/email-thumbnail.png",
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-004",
    title: "Promotional Flyer Templates",
    description: "Print-ready flyer designs for gyms, events, and rental facilities. Editable in Canva or Adobe with your branding and contact information.",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/marketing/promotional-flyers.pdf",
    thumbnailUrl: "/images/flyer-thumbnail.png",
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-005",
    title: "Partner Co-Branding Guidelines",
    description: "Complete guide for using Daily Event Insurance branding alongside your own. Includes do's and don'ts, color specifications, and approved messaging.",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/marketing/co-branding-guidelines.pdf",
    thumbnailUrl: "/images/brand-thumbnail.png",
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },

  // Training Resources
  {
    id: "res-006",
    title: "Widget Integration Guide",
    description: "Step-by-step instructions for integrating the insurance widget on your website. Covers HTML embed, React/Next.js integration, and customization options.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/training/widget-integration-guide.pdf",
    thumbnailUrl: "/images/widget-video-thumbnail.png",
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-007",
    title: "Selling Insurance: Best Practices",
    description: "Tips and strategies for presenting insurance options to customers. Learn how to increase opt-in rates and provide better customer experiences.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/training/selling-best-practices.pdf",
    thumbnailUrl: "/images/selling-thumbnail.png",
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-008",
    title: "Understanding Coverage Options",
    description: "Comprehensive training on all coverage types: liability, equipment, and cancellation insurance. Know what's covered and how to explain it to customers.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/training/coverage-options-guide.pdf",
    thumbnailUrl: "/images/coverage-video-thumbnail.png",
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-009",
    title: "Customer FAQ Cheat Sheet",
    description: "Quick reference guide for answering common customer questions about coverage, claims, and pricing. Perfect for front desk and staff training.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/training/faq-cheatsheet.pdf",
    thumbnailUrl: "/images/faq-thumbnail.png",
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-010",
    title: "Claims Process Guide",
    description: "How to help customers file claims and what to expect during the claims process. Includes timeline expectations and documentation requirements.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/training/claims-process-guide.pdf",
    thumbnailUrl: "/images/claims-video-thumbnail.png",
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },

  // Documentation Resources
  {
    id: "res-011",
    title: "Partner Handbook",
    description: "Complete partner program overview including policies, procedures, commission structures, and support contacts. Your go-to reference for all partnership questions.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/documentation/partner-handbook.pdf",
    thumbnailUrl: "/images/handbook-thumbnail.png",
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-012",
    title: "API Documentation",
    description: "Technical documentation for direct API integration. Includes authentication, endpoints, request/response formats, and code examples in multiple languages.",
    category: "documentation",
    resourceType: "link",
    fileUrl: "/api/docs",
    thumbnailUrl: "/images/api-thumbnail.png",
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-013",
    title: "Commission Structure Guide",
    description: "Detailed explanation of commission tiers, calculation methods, and payout schedules. Understand how your earnings are calculated and when you get paid.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/documentation/commission-structure.pdf",
    thumbnailUrl: "/images/commission-thumbnail.png",
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-014",
    title: "Terms of Service",
    description: "Full partner agreement terms and conditions. Reference document for understanding your rights and obligations as a Daily Event Insurance partner.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/documentation/terms-of-service.pdf",
    thumbnailUrl: "/images/terms-thumbnail.png",
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-015",
    title: "Compliance & Regulatory Guide",
    description: "Important compliance information for insurance referrals. Covers state regulations, disclosure requirements, and best practices for staying compliant.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/documentation/compliance-guide.pdf",
    thumbnailUrl: "/images/compliance-thumbnail.png",
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "res-016",
    title: "Troubleshooting Guide",
    description: "Common issues and solutions for widget integration, API connections, and dashboard access. Self-service guide to resolve technical problems quickly.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/documentation/troubleshooting-guide.pdf",
    thumbnailUrl: "/images/troubleshooting-thumbnail.png",
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
]

/**
 * Get resources grouped by category
 */
export function getResourcesByCategory(resources: PartnerResource[]) {
  return {
    marketing: resources.filter(r => r.category === "marketing"),
    training: resources.filter(r => r.category === "training"),
    documentation: resources.filter(r => r.category === "documentation"),
  }
}

/**
 * Get category statistics
 */
export function getCategoryStats(resources: PartnerResource[]) {
  const grouped = getResourcesByCategory(resources)
  return {
    marketing: grouped.marketing.length,
    training: grouped.training.length,
    documentation: grouped.documentation.length,
    total: resources.length,
  }
}

/**
 * Interface for snake_case format (used by Supabase/frontend)
 */
export interface PartnerResourceSnakeCase {
  id: string
  title: string
  description?: string
  category: ResourceCategory
  resource_type: ResourceType
  file_url?: string
  thumbnail_url?: string
  sort_order?: number
  created_at: string
}

/**
 * Convert admin resources to snake_case format for frontend compatibility
 */
export function toSnakeCaseResources(resources: PartnerResource[]): PartnerResourceSnakeCase[] {
  return resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    resource_type: resource.resourceType,
    file_url: resource.fileUrl,
    thumbnail_url: resource.thumbnailUrl,
    sort_order: resource.sortOrder,
    created_at: resource.createdAt,
  }))
}

/**
 * Get demo resources in snake_case format for mock data
 */
export const MOCK_RESOURCES_SNAKE_CASE = toSnakeCaseResources(ADMIN_DEMO_RESOURCES)
