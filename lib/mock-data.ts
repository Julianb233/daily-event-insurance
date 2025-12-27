/**
 * Mock data for development mode when Supabase isn't configured
 */

import type { Partner, PartnerProduct, MonthlyEarnings, PartnerResource } from "./supabase"

// Development mode check
export const isDevMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY

// Mock User Data
export const MOCK_USER = {
  id: "mock-user-001",
  name: "Demo Partner",
  email: "demo@partner.dev",
  role: "partner",
}

// Mock Partner Data
export const MOCK_PARTNER: Partner = {
  id: "mock-partner-001",
  user_id: "mock-user-001",
  clerk_user_id: "dev_user_001", // Kept for backwards compatibility
  business_name: "Demo Fitness Center",
  business_type: "gym",
  contact_name: "Demo Partner",
  contact_email: "demo@partner.dev",
  contact_phone: "(555) 123-4567",
  integration_type: "widget",
  primary_color: "#14B8A6",
  logo_url: null,
  status: "active",
  created_at: new Date().toISOString(),
}

// Mock Products
export const MOCK_PRODUCTS: PartnerProduct[] = [
  {
    id: "mock-product-001",
    partner_id: "mock-partner-001",
    product_type: "liability",
    is_enabled: true,
    customer_price: 4.99,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-product-002",
    partner_id: "mock-partner-001",
    product_type: "equipment",
    is_enabled: true,
    customer_price: 9.99,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-product-003",
    partner_id: "mock-partner-001",
    product_type: "cancellation",
    is_enabled: false,
    customer_price: 14.99,
    created_at: new Date().toISOString(),
  },
]

// Mock Monthly Earnings (last 12 months)
export const MOCK_EARNINGS: MonthlyEarnings[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date()
  date.setMonth(date.getMonth() - i)
  const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  const totalParticipants = Math.floor(Math.random() * 500) + 200
  const optedIn = Math.floor(totalParticipants * 0.65)

  return {
    id: `mock-earnings-${i}`,
    partner_id: "mock-partner-001",
    year_month: yearMonth,
    total_participants: totalParticipants,
    opted_in_participants: optedIn,
    partner_commission: optedIn * 4.99 * 0.25, // 25% commission
    created_at: new Date().toISOString(),
  }
}).reverse()

// Mock Resources
export const MOCK_RESOURCES: PartnerResource[] = [
  {
    id: "mock-resource-001",
    title: "Partner Logo Pack",
    description: "High-resolution logos for marketing materials",
    category: "marketing",
    resource_type: "image",
    file_url: "/resources/logo-pack.zip",
    thumbnail_url: "/resources/thumbnails/logo-pack.png",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-resource-002",
    title: "Social Media Templates",
    description: "Ready-to-use social media graphics",
    category: "marketing",
    resource_type: "image",
    file_url: "/resources/social-templates.zip",
    thumbnail_url: "/resources/thumbnails/social-templates.png",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-resource-003",
    title: "Integration Walkthrough",
    description: "Video guide for setting up the widget",
    category: "training",
    resource_type: "video",
    file_url: "https://youtube.com/watch?v=demo",
    thumbnail_url: "/resources/thumbnails/walkthrough.png",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-resource-004",
    title: "Partner Handbook",
    description: "Complete guide to the partner program",
    category: "documentation",
    resource_type: "pdf",
    file_url: "/resources/partner-handbook.pdf",
    thumbnail_url: "/resources/thumbnails/handbook.png",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-resource-005",
    title: "API Documentation",
    description: "Technical docs for API integration",
    category: "documentation",
    resource_type: "link",
    file_url: "/api-docs",
    thumbnail_url: "/resources/thumbnails/api-docs.png",
    created_at: new Date().toISOString(),
  },
]

console.log("[MOCK DATA] Dev mode active - using mock data for Partner Portal")
