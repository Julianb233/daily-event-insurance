import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { authRateLimiter } from "@/lib/rate-limit"

// SECURITY: Dev mode auth bypass requires explicit opt-in
// Bypass ONLY if ALL conditions are met:
// 1. NODE_ENV === 'development'
// 2. DEV_AUTH_BYPASS === 'true' (explicit opt-in)
const shouldBypassAuth =
  process.env.NODE_ENV === 'development' &&
  process.env.DEV_AUTH_BYPASS === 'true'

// Create NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: db ? DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as any : undefined, // Type assertion needed due to @auth/drizzle-adapter version mismatch
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
        if (shouldBypassAuth) {
          console.warn("[DEV MODE] Auth bypassed - set AUTH_SECRET to disable")
          return {
            id: "dev_user_001",
            email: "demo@partner.dev",
            name: "Demo Partner",
            role: "partner",
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Rate limiting - use email as identifier for login attempts
        // This prevents brute force attacks on specific accounts
        const { success: withinLimit } = authRateLimiter.check(email.toLowerCase())
        if (!withinLimit) {
          console.warn(`[SECURITY] Rate limit exceeded for login attempts: ${email}`)
          throw new Error("Too many login attempts. Please try again later.")
        }

        if (!db) {
          console.error("Database not configured")
          return null
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user || !user.passwordHash) {
          return null
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign-in: set user data from credentials
      if (user && user.id) {
        token.id = user.id
        token.role = (user as any).role
      }

      // On session update or token refresh, refetch role from database
      // This ensures role changes (e.g., after onboarding) are immediately reflected
      if ((trigger === "update" || !user) && token.id && db) {
        try {
          const [dbUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1)

          if (dbUser) {
            token.role = dbUser.role || "user"
          }
        } catch (error) {
          console.error("Failed to refresh user role from database:", error)
          // Keep existing role on error
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})

// ================= Auth Helper Functions =================

export type Role = "admin" | "user" | "partner" | "moderator" | "viewer"

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
