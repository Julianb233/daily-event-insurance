import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Creates a Supabase client for browser/client-side usage.
 * This client uses the anon key and respects RLS policies.
 * Returns null if Supabase is not configured.
 *
 * Usage in Client Components:
 * ```tsx
 * "use client"
 * import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
 *
 * export default function MyComponent() {
 *   if (!isSupabaseConfigured()) return <div>Not configured</div>
 *   const supabase = createClient()
 *   // Use supabase client...
 * }
 * ```
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time or when not configured
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Helper to check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
