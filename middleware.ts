import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Development mode - bypass auth when NextAuth isn't configured
const isDevMode = !process.env.AUTH_SECRET

// Protected routes
const protectedRoutes = [
  "/partner",
  "/onboarding",
  "/api/partner",
  "/api/admin",
]

// Public routes
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
]

// Dev mode middleware - bypasses auth entirely
function devModeMiddleware() {
  console.log("[DEV MODE] NextAuth middleware bypassed - no AUTH_SECRET configured")
  return NextResponse.next()
}

// Production middleware with NextAuth
const productionMiddleware = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isProtected = protectedRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  )

  const isPublic = publicRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  )

  // Allow API auth routes
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
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
