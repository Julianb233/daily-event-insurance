import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Types for database tables
export interface Partner {
  id: string
  clerk_user_id: string
  business_name: string
  business_type: "gym" | "climbing" | "rental" | "wellness" | "ski" | "water-sports" | "other"
  contact_name: string
  contact_email: string
  contact_phone?: string
  integration_type: "widget" | "api" | "manual"
  primary_color?: string
  logo_url?: string
  status: "pending" | "active" | "suspended"
  created_at: string
  updated_at?: string
}

export interface PartnerProduct {
  id: string
  partner_id: string
  product_type: "liability" | "equipment" | "cancellation"
  is_enabled: boolean
  customer_price: number
  created_at: string
}

export interface MonthlyEarnings {
  id: string
  partner_id: string
  year_month: string // "2025-01" format
  total_participants: number
  opted_in_participants: number
  partner_commission: number
  created_at: string
}

export interface PartnerResource {
  id: string
  title: string
  description?: string
  category: "marketing" | "training" | "documentation"
  resource_type: "pdf" | "video" | "image" | "link"
  file_url: string
  thumbnail_url?: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: Partner
        Insert: Omit<Partner, "id" | "created_at">
        Update: Partial<Omit<Partner, "id" | "created_at">>
      }
      partner_products: {
        Row: PartnerProduct
        Insert: Omit<PartnerProduct, "id" | "created_at">
        Update: Partial<Omit<PartnerProduct, "id" | "created_at">>
      }
      monthly_earnings: {
        Row: MonthlyEarnings
        Insert: Omit<MonthlyEarnings, "id" | "created_at">
        Update: Partial<Omit<MonthlyEarnings, "id" | "created_at">>
      }
      partner_resources: {
        Row: PartnerResource
        Insert: Omit<PartnerResource, "id" | "created_at">
        Update: Partial<Omit<PartnerResource, "id" | "created_at">>
      }
    }
  }
}

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Client for browser/client-side usage
let browserClient: SupabaseClient<Database> | null = null

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured")
    }
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return browserClient
}

// Server client with service role key for admin operations
export function getSupabaseServerClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase server credentials not configured")
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Default export for convenience (browser client)
export const supabase = getSupabaseBrowserClient()

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
