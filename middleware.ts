import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Development mode - bypass auth when Clerk isn't configured
const isDevMode = !process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/partner(.*)",
  "/onboarding(.*)",
  "/api/partner(.*)",
  "/api/user(.*)",
  "/api/admin(.*)",
])

// Define public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/pricing",
  "/privacy",
  "/terms",
  "/insurance-disclosure",
  "/industries(.*)",
  "/categories(.*)",
  "/for-gyms",
  "/for-climbing",
  "/for-rentals",
  "/for-adventure",
  "/hero-demo",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

// Dev mode middleware - bypasses Clerk entirely
function devModeMiddleware() {
  console.log("[DEV MODE] Clerk middleware bypassed - no credentials configured")
  return NextResponse.next()
}

export default isDevMode
  ? devModeMiddleware
  : clerkMiddleware(async (auth, req) => {
      // Protect routes that require authentication
      if (isProtectedRoute(req)) {
        await auth.protect()
      }
    }, { debug: process.env.NODE_ENV === "development" })

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
