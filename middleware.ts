import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Development mode check - SECURITY: Use NODE_ENV, not AUTH_SECRET absence
// This ensures production ALWAYS requires auth even if AUTH_SECRET is misconfigured
const isDevMode = process.env.NODE_ENV === 'development'

// Route role requirements - more specific routes should come first
const ROUTE_ROLES: Record<string, string[]> = {
  "/api/admin": ["admin"],
  "/api/partner": ["partner", "admin"],
  "/partner": ["partner", "admin"],
  "/onboarding": ["user", "partner", "admin"], // Any authenticated user can access onboarding
}

// Session refresh interval - refresh role from DB if session older than this (ms)
const SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

// Public routes (no auth required)
const publicRoutes = [
  "/",
  "/about",
  "/pricing",
  "/privacy",
  "/terms",
  "/insurance-disclosure",
  "/industries",
  "/categories",
  "/for-gyms",
  "/for-climbing",
  "/for-rentals",
  "/for-adventure",
  "/hero-demo",
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/api/webhook", // Webhooks need to be public
]

// Dev mode middleware - bypasses auth entirely (only in NODE_ENV=development)
function devModeMiddleware() {
  console.log("[DEV MODE] NextAuth middleware bypassed - NODE_ENV is development")
  return NextResponse.next()
}

// Helper to check if user has required role
function hasRequiredRole(userRole: string | undefined, requiredRoles: string[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

// Get required roles for a path
function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(route)) {
      return roles
    }
  }
  return null
}

// Production middleware with NextAuth - checks both authentication AND role
const productionMiddleware = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined
  const response = NextResponse.next()

  // Allow API auth routes
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return response
  }

  // Check if public route
  const isPublic = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  )

  if (isPublic) {
    return response
  }

  // Get required roles for this path
  const requiredRoles = getRequiredRoles(nextUrl.pathname)

  // If no role requirements, allow access (unprotected route)
  if (!requiredRoles) {
    return response
  }

  // Check authentication first
  if (!isLoggedIn) {
    const signInUrl = new URL("/sign-in", nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role authorization
  if (!hasRequiredRole(userRole, requiredRoles)) {
    // User is logged in but doesn't have the required role
    // Redirect to appropriate page based on context
    if (nextUrl.pathname.startsWith("/partner")) {
      // User trying to access partner area without partner role
      // Redirect to onboarding if they're a regular user
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/onboarding", nextUrl.origin))
      }
      // Otherwise redirect to home with error
      const homeUrl = new URL("/", nextUrl.origin)
      homeUrl.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(homeUrl)
    }

    if (nextUrl.pathname.startsWith("/api/")) {
      // API routes return 403 Forbidden - SECURITY: Don't expose role requirements
      return NextResponse.json(
        { error: "Forbidden", message: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Default: redirect to home
    return NextResponse.redirect(new URL("/", nextUrl.origin))
  }

  // Add security headers to response
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return response
})

export default isDevMode ? devModeMiddleware : productionMiddleware

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
