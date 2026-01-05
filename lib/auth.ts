import { createClient } from "@/lib/supabase/server"

// ================= Auth Helper Functions =================

export type Role = "admin" | "user" | "partner" | "moderator" | "viewer"

/**
 * Get current session (Supabase)
 */
export async function auth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role || "user",
    },
  }
}

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<Role> {
  const session = await auth()
  return (session?.user?.role as Role) || "user"
}

/**
 * Check if user has specific role
 */
export async function checkRole(role: Role): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole === role
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const userRole = await getUserRole()
  return roles.includes(userRole)
}

/**
 * Require authentication - redirect if not logged in
 */
export async function requireAuth(redirectTo?: string): Promise<string> {
  const session = await auth()

  if (!session?.user?.id) {
    if (redirectTo) {
      const { redirect } = await import("next/navigation")
      redirect(redirectTo)
    }
    throw new Error("Unauthorized: Authentication required")
  }

  return session.user.id
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

/**
 * Get current user ID
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id || null
}

/**
 * Role hierarchy for permission checks
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  user: 1,
  partner: 2,
  moderator: 3,
  admin: 4,
}

/**
 * Check if user's role meets minimum level
 */
export async function meetsRoleLevel(minRole: Role): Promise<boolean> {
  const userRole = await getUserRole()
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
}

/**
 * Require specific role
 */
export async function requireRole(role: Role, redirectTo?: string): Promise<void> {
  const hasRole = await checkRole(role)

  if (!hasRole) {
    if (redirectTo) {
      const { redirect } = await import("next/navigation")
      redirect(redirectTo)
    } else {
      throw new Error(`Unauthorized: Required role '${role}' not found`)
    }
  }
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(roles: Role[], redirectTo?: string): Promise<void> {
  const hasRole = await hasAnyRole(roles)

  if (!hasRole) {
    if (redirectTo) {
      const { redirect } = await import("next/navigation")
      redirect(redirectTo)
    } else {
      throw new Error(`Unauthorized: Required one of roles [${roles.join(", ")}]`)
    }
  }
}

/**
 * Get all roles assigned to the current user
 */
export async function getUserRoles(): Promise<Role[]> {
  const role = await getUserRole()
  return [role]
}

/**
 * Permission definitions - maps permissions to required roles
 */
const PERMISSIONS: Record<string, Role[]> = {
  // Admin permissions
  'manage:users': ['admin'],
  'manage:partners': ['admin'],
  'manage:settings': ['admin'],
  'view:analytics': ['admin', 'partner'],
  'view:reports': ['admin', 'partner'],

  // Partner permissions
  'create:quotes': ['admin', 'partner'],
  'view:policies': ['admin', 'partner'],
  'manage:products': ['admin', 'partner'],
  'posts.edit': ['admin', 'partner', 'moderator'],
  'content.delete': ['admin', 'moderator'],

  // Moderator permissions
  'moderate:content': ['admin', 'moderator'],

  // User permissions
  'view:dashboard': ['admin', 'partner', 'moderator', 'user'],
}

/**
 * Check if user has a specific permission
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const userRole = await getUserRole()
  const allowedRoles = PERMISSIONS[permission] || []
  return allowedRoles.includes(userRole)
}

/**
 * Sign out user (client-side helper)
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
