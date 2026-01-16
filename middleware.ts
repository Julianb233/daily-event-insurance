import { authMiddleware } from '@descope/nextjs-sdk/server'
import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server'

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
  "/carriers",
  "/for-gyms",
  "/for-climbing",
  "/for-rentals",
  "/for-adventure",
  "/hero-demo",
  "/work-with-us",
  "/sign-in",
  "/sign-up",
  "/checkout",
  "/talk", // Voice AI chat page
  "/call-center", // Call center support page
  "/support", // Support pages
  "/demo", // Demo pages
  "/api/auth",
  "/api/webhook", // Webhooks need to be public
  "/api/stripe", // Stripe webhooks and checkout need to be accessible
  "/api/voice", // Voice agent API
  "/events", // Public microsites
]

const descopeMiddleware = authMiddleware({
  publicRoutes: publicRoutes,
  redirectUrl: '/sign-in'
})

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Manual prefix check for routes that require recursive/deep public access
  // and might fail standard Descope wildcard matching.
  // We want to allow subpaths for these routes:
  const recursivePublicConfig = [
    '/demo',
    '/about/hiqor',
    '/api/webhook',
    '/api/stripe',
    '/api/voice',
    '/events',
    '/industries',
    '/categories',
    '/carriers',
    '/for-gyms',
    '/for-climbing',
    '/for-rentals',
    '/for-adventure',
    '/partner' // Emergency Demo Bypass
  ]

  const pathname = req.nextUrl.pathname

  // If path starts with any of the recursive public routes, allow access
  if (recursivePublicConfig.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  return descopeMiddleware(req)
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
