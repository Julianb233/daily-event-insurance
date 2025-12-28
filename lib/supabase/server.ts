import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./types"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * This client respects RLS policies using the user's session.
 *
 * Usage in Server Components:
 * ```tsx
 * import { createClient } from "@/lib/supabase/server"
 *
 * export default async function ServerComponent() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from("partners").select()
 *   // ...
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Creates a Supabase client with admin/service role privileges.
 * This client bypasses RLS and should only be used for server-side admin operations.
 *
 * SECURITY: Never expose this client to the browser or use in client components.
 *
 * Usage in API routes or Server Actions:
 * ```ts
 * import { createAdminClient } from "@/lib/supabase/server"
 *
 * export async function adminOperation() {
 *   const supabase = createAdminClient()
 *   // Perform admin operations...
 * }
 * ```
 */
export function createAdminClient() {
  return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Admin client doesn't need to manage cookies
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Helper to check if Supabase server credentials are configured
 */
export function isSupabaseServerConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey)
}
