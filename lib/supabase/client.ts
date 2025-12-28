import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Creates a Supabase client for browser/client-side usage.
 * This client uses the anon key and respects RLS policies.
 *
 * Usage in Client Components:
 * ```tsx
 * "use client"
 * import { createClient } from "@/lib/supabase/client"
 *
 * export default function MyComponent() {
 *   const supabase = createClient()
 *   // Use supabase client...
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Helper to check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
