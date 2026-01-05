import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface AuthenticatedUser {
  userId: string
  user: {
    id: string
    email: string
    name?: string
    role?: string
  }
}

/**
 * Requires authentication for API route
 * Throws an error that returns 401 if not authenticated
 */
export async function requireAuth(): Promise<{ userId: string }> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  return { userId: user.id }
}

/**
 * Requires admin role for API route
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  const userRole = user.user_metadata?.role as string | undefined

  if (userRole !== "admin") {
    throw NextResponse.json(
      { error: "Forbidden", message: "Admin access required" },
      { status: 403 }
    )
  }

  return {
    userId: user.id,
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role: userRole,
    },
  }
}

/**
 * Requires partner role for API route
 */
export async function requirePartner(): Promise<AuthenticatedUser> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  const userRole = user.user_metadata?.role as string | undefined
  const isPartner = userRole === "partner" || userRole === "admin"

  if (!isPartner) {
    throw NextResponse.json(
      { error: "Forbidden", message: "Partner access required" },
      { status: 403 }
    )
  }

  return {
    userId: user.id,
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role: userRole,
    },
  }
}

/**
 * Gets the authenticated user if available, returns null otherwise
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    userId: user.id,
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role,
    },
  }
}

/**
 * Checks if current user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return false
  }

  return user.user_metadata?.role === role
}

/**
 * Wrapper for API route handlers that catches auth errors
 */
export function withAuth(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch((error) => {
    // If error is already a NextResponse (thrown by requireAuth/requireAdmin), return it
    if (error instanceof NextResponse) {
      return error
    }

    // Otherwise, return a generic 500 error
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    )
  })
}
