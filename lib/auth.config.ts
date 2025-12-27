import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/partner") ||
        nextUrl.pathname.startsWith("/onboarding") ||
        nextUrl.pathname.startsWith("/api/partner") ||
        nextUrl.pathname.startsWith("/api/admin")

      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return false // Redirect to signIn page
      }

      return true
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
