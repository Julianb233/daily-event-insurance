/**
 * Mock data for development mode when Supabase isn't configured
 */

import type { Partner, PartnerProduct, MonthlyEarnings, PartnerResource } from "./supabase"
import { MOCK_RESOURCES_SNAKE_CASE } from "./partner-resources-data"

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
  clerk_user_id: "dev_user_001",
  business_name: "Demo Fitness Center",
  business_type: "gym",
  contact_name: "Demo Partner",
  contact_email: "demo@partner.dev",
  contact_phone: "(555) 123-4567",
  integration_type: "widget",
  primary_color: "#14B8A6",
  logo_url: undefined,
  status: "active",
  created_at: new Date().toISOString(),
}

// Mock Microsite Data - for displaying the microsite section on partner dashboard
export const MOCK_MICROSITE = {
  id: "mock-microsite-001",
  partnerId: "mock-partner-001",
  domain: "demo.dailyeventinsurance.com",
  subdomain: "demo",
  customDomain: null,
  siteName: "Demo Fitness Center Insurance",
  primaryColor: "#14B8A6",
  logoUrl: null,
  heroImageUrl: null,
  monthlyCharge: "650.00",
  setupFee: "10000.00",
  billingStatus: "active",
  stripeSubscriptionId: null,
  status: "live", // live status means it will be displayed on dashboard
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://demo.dailyeventinsurance.com",
  launchedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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

// Mock Resources - Enhanced with realistic content from partner-resources-data
export const MOCK_RESOURCES: PartnerResource[] = MOCK_RESOURCES_SNAKE_CASE as PartnerResource[]

console.log("[MOCK DATA] Dev mode active - using mock data for Partner Portal")
