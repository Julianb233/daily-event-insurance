/**
 * Database types for Supabase
 * These types are used by both client and server Supabase clients.
 */

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

export interface ResourceDownload {
  id: string
  partner_id: string
  resource_id: string
  downloaded_at: string
}

export interface SupportConversation {
  id: string
  partner_id?: string
  partner_email?: string
  partner_name?: string
  session_id: string
  page_url?: string
  onboarding_step?: number
  topic?: string
  tech_stack?: string
  integration_context?: string
  status: string
  priority: string
  escalated_at?: string
  escalated_to?: string
  escalation_reason?: string
  resolution?: string
  resolved_at?: string
  helpful_rating?: number
  feedback?: string
  created_at: string
  updated_at: string
}

export interface SupportMessage {
  id: string
  conversation_id: string
  role: string
  content: string
  content_type?: string
  code_snippet?: string
  code_language?: string
  tools_used?: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: Partner
        Insert: Omit<Partner, "id" | "created_at" | "updated_at">
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
      resource_downloads: {
        Row: ResourceDownload
        Insert: Omit<ResourceDownload, "id" | "downloaded_at">
        Update: Partial<Omit<ResourceDownload, "id" | "downloaded_at">>
      }
      support_conversations: {
        Row: SupportConversation
        Insert: Omit<SupportConversation, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<SupportConversation, "id" | "created_at">>
      }
      support_messages: {
        Row: SupportMessage
        Insert: Omit<SupportMessage, "id" | "created_at">
        Update: Partial<Omit<SupportMessage, "id" | "created_at">>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
