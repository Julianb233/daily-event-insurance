/**
 * Supabase Client Exports
 *
 * This module provides properly configured Supabase clients for:
 * - Browser/Client-side usage (createClient from ./client)
 * - Server Components/Actions/Routes (createClient from ./server)
 * - Admin operations (createAdminClient from ./server)
 *
 * Usage:
 *
 * Client Components:
 * ```tsx
 * "use client"
 * import { createClient } from "@/lib/supabase/client"
 * const supabase = createClient()
 * ```
 *
 * Server Components/Actions:
 * ```tsx
 * import { createClient } from "@/lib/supabase/server"
 * const supabase = await createClient()
 * ```
 *
 * Admin Operations:
 * ```ts
 * import { createAdminClient } from "@/lib/supabase/server"
 * const supabase = createAdminClient()
 * ```
 */

// Re-export types
export type { Database, Partner, PartnerProduct, MonthlyEarnings, PartnerResource, ResourceDownload } from "./types"

// Note: Do not re-export createClient here to avoid confusion
// Import directly from ./client or ./server based on context
