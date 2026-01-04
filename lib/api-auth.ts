import { auth } from "./auth"
import { NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"

// SECURITY: Dev mode auth bypass requires explicit opt-in
// Bypass ONLY if ALL conditions are met:
// 1. NODE_ENV === 'development'
// 2. DEV_AUTH_BYPASS === 'true' (explicit opt-in)
// 3. AUTH_SECRET is NOT set (prevents bypass in prod-like environments)
const shouldBypassAuth =
  process.env.NODE_ENV === 'development' &&
  process.env.DEV_AUTH_BYPASS === 'true' &&
  !process.env.AUTH_SECRET

// Mock user for development
const MOCK_USER = {
  id: "dev_user_001",
  email: "demo@partner.dev",
  name: "Demo Partner",
  role: "partner",
}

export interface AuthenticatedUser {
  userId: string
  user: any
}

/**
 * Requires authentication for API route
 * Throws an error that returns 401 if not authenticated
 */
export async function requireAuth(): Promise<{ userId: string }> {
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (shouldBypassAuth) {
    console.warn("[DEV MODE] Auth bypassed - set AUTH_SECRET to disable")
    return { userId: MOCK_USER.id }
  }

  const session = await auth()

  if (!session?.user?.id) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  return { userId: session.user.id }
}

// Mock admin user for development
const MOCK_ADMIN = {
  id: "dev_admin_001",
  email: "admin@dailyeventinsurance.com",
  name: "Demo Admin",
  role: "admin",
}

/**
 * Requires admin role for API route
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (shouldBypassAuth) {
    console.warn("[DEV MODE] Admin auth bypassed - set AUTH_SECRET to disable")
    return { userId: MOCK_ADMIN.id, user: MOCK_ADMIN }
  }

  const session = await auth()

  if (!session?.user?.id) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  if (session.user.role !== "admin") {
    throw NextResponse.json(
      { error: "Forbidden", message: "Admin access required" },
      { status: 403 }
    )
  }

  let user = null
  if (db) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
    user = dbUser
  }

  return { userId: session.user.id, user: user || session.user }
}

/**
 * Requires partner role for API route
 */
export async function requirePartner(): Promise<AuthenticatedUser> {
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (shouldBypassAuth) {
    console.warn("[DEV MODE] Partner auth bypassed - set AUTH_SECRET to disable")
    return { userId: MOCK_USER.id, user: MOCK_USER }
  }

  const session = await auth()

  if (!session?.user?.id) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }

  const userRole = session.user.role
  const isPartner = userRole === "partner" || userRole === "admin"

  if (!isPartner) {
    throw NextResponse.json(
      { error: "Forbidden", message: "Partner access required" },
      { status: 403 }
    )
  }

  let user = null
  if (db) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
    user = dbUser
  }

  return { userId: session.user.id, user: user || session.user }
}

/**
 * Gets the authenticated user if available, returns null otherwise
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  let user = null
  if (db) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
    user = dbUser
  }

  return user ? { userId: session.user.id, user } : null
}

/**
 * Checks if current user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth()

  if (!session?.user) {
    return false
  }

  return session.user.role === role
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
