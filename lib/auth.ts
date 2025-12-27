import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

// Development mode check
const isDevMode = !process.env.AUTH_SECRET

// Create NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: db ? DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) : undefined,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dev mode bypass
        if (isDevMode) {
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
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
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
