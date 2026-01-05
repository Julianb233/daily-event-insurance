import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Route role requirements - more specific routes should come first
const ROUTE_ROLES: Record<string, string[]> = {
  "/api/admin": ["admin"],
  "/api/partner": ["user", "partner", "admin"],
  "/partner": ["partner", "admin"],
  "/onboarding": ["user", "partner", "admin"], // Any authenticated user can access onboarding
}

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
  "/carriers", // Carrier pages for insurance partners
  "/race-day-flow", // Race day coverage flow diagram
  "/blog", // Blog posts and articles
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

export async function middleware(request: NextRequest) {
  const { nextUrl } = request

  // Allow API auth routes
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Check if public route
  const isPublic = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  )

  if (isPublic) {
    // Still refresh the session for public routes
    const { supabaseResponse } = await updateSession(request)
    return supabaseResponse
  }

  // Get Supabase session
  const { user, supabaseResponse } = await updateSession(request)
  const isLoggedIn = !!user

  // Get user role from Supabase user metadata
  // The role is stored in user_metadata when the user signs up or is updated
  const userRole = user?.user_metadata?.role as string | undefined

  // Get required roles for this path
  const requiredRoles = getRequiredRoles(nextUrl.pathname)

  // If no role requirements, allow access if authenticated
  if (!requiredRoles) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/sign-in", nextUrl.origin)
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
    return supabaseResponse
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
      if (userRole === "user" || !userRole) {
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
  supabaseResponse.headers.set("X-Frame-Options", "DENY")
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff")
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block")
  supabaseResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  supabaseResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return supabaseResponse
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
