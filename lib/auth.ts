import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { session } from "@descope/nextjs-sdk/server"
import { redirect } from "next/navigation"

// Descope Project ID
const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || "P38Ce5ELumb4fUCTq5JnhlpDTdd9"

// ================= Auth Core Functions =================

/**
 * Get the current session and ensure local DB user exists
 */
export async function auth() {
  const s = await session() as any

  if (!s || !s.isAuthenticated) {
    return null
  }

  // Descope User Details
  const descopeId = s.user?.userId
  const email = s.user?.email || s.user?.loginIds?.[0]
  const name = s.user?.name

  if (!email) {
    console.error("Descope session missing email", s)
    return null
  }

  // Sync with local DB
  // We try to find the user by email
  if (db) {
    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        // User exists, return combined data
        return {
          user: {
            ...s.user,
            id: existingUser.id, // Use our DB UUID
            descopeId: descopeId,
            role: existingUser.role,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
          },
          ...s
        }
      } else {
        // User doesn't exist, create them
        console.log(`Creating new user from Descope login: ${email}`)
        const [newUser] = await db.insert(users).values({
          name: name || email.split('@')[0],
          email: email,
          role: "user", // Default role
          // We can store descopeId if we add a column, for now we rely on email
        }).returning()

        return {
          user: {
            ...s.user,
            id: newUser.id,
            descopeId: descopeId,
            role: newUser.role,
            name: newUser.name,
            email: newUser.email,
          },
          ...s
        }
      }
    } catch (error) {
      console.error("Database sync error in auth():", error)
      // Fallback: return Descope session but without DB ID (might break things expecting UUID)
      // In a strict environment, we might want to throw or return null
      return {
        user: {
          ...s.user,
          id: descopeId, // Fallback to Descope ID (might break UUID checks!)
          role: "user"
        },
        ...s
      }
    }
  }

  return s
}

export const signIn = () => redirect("/sign-in")
export const signOut = () => redirect("/api/auth/logout")

// ================= Auth Helper Functions =================

export type Role = "admin" | "user" | "partner" | "moderator" | "viewer"

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<Role> {
  const s = await auth()
  return (s?.user?.role as Role) || "user"
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
  const s = await auth()

  if (!s?.user?.id) {
    if (redirectTo) {
      redirect(redirectTo)
    }
    throw new Error("Unauthorized: Authentication required")
  }

  return s.user.id
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const s = await session() as any
  return !!s?.isAuthenticated
}

/**
 * Get current user ID
 */
export async function getUserId(): Promise<string | null> {
  const s = await auth()
  return s?.user?.id || null
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

// Dummy 'handlers' export to keep imports from breaking, though middleware usage changes
export const handlers = {
  GET: () => { },
  POST: () => { }
}
