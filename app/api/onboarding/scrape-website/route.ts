import { NextRequest, NextResponse } from "next/server"
import { fetchPartnerBranding } from "@/lib/firecrawl/client"
import { requireAuth, withAuth } from "@/lib/api-auth"
import { apiRateLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit"

// SSRF Protection: Block private/internal IP ranges and localhost
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
]

// Private IP ranges to block (SSRF protection)
const PRIVATE_IP_PATTERNS = [
  /^10\./,                     // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./,               // 192.168.0.0/16
  /^169\.254\./,               // Link-local
  /^127\./,                    // Loopback
  /^0\./,                      // Current network
]

// Check if hostname is a private/internal address
function isPrivateOrLocalhost(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase()

  // Check blocked hostnames
  if (BLOCKED_HOSTS.includes(lowerHostname)) {
    return true
  }

  // Check if it's an IP address matching private ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return true
    }
  }

  // Block .local domains
  if (lowerHostname.endsWith('.local') || lowerHostname.endsWith('.internal')) {
    return true
  }

  return false
}

/**
 * POST /api/onboarding/scrape-website
 * Scrape a partner's website to auto-fill business information
 *
 * SECURITY:
 * - Requires authentication
 * - Rate limited
 * - SSRF protection (blocks private/internal IPs)
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      // Require authentication - any logged-in user can use during onboarding
      await requireAuth()

      // Rate limiting
      const clientIP = getClientIP(request)
      const { success: withinLimit } = apiRateLimiter.check(clientIP)
      if (!withinLimit) {
        return rateLimitResponse(60 * 1000) // 1 minute
      }

      const { url } = await request.json()

      if (!url) {
        return NextResponse.json(
          { error: "URL is required" },
          { status: 400 }
        )
      }

      // Validate URL format
      let validatedUrl: URL
      try {
        const urlString = url.startsWith("http") ? url : `https://${url}`
        validatedUrl = new URL(urlString)
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        )
      }

      // SECURITY: SSRF Protection - block private/internal addresses
      if (isPrivateOrLocalhost(validatedUrl.hostname)) {
        console.warn(`[SECURITY] SSRF attempt blocked: ${validatedUrl.hostname}`)
        return NextResponse.json(
          { error: "Invalid URL: private or internal addresses are not allowed" },
          { status: 400 }
        )
      }

      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        return NextResponse.json(
          { error: "Invalid URL: only HTTP/HTTPS protocols are allowed" },
          { status: 400 }
        )
      }

      // URL length limit (prevent DoS)
      if (validatedUrl.toString().length > 2048) {
        return NextResponse.json(
          { error: "URL too long (max 2048 characters)" },
          { status: 400 }
        )
      }

      // Check if FireCrawl is configured
      if (!process.env.FIRECRAWL_API_KEY) {
        // Return fallback data when FireCrawl is not configured
        console.log("[Scrape] FireCrawl not configured, returning fallback")
        return NextResponse.json({
          businessName: null,
          primaryColor: "#14B8A6",
          logoUrl: null,
          description: null,
          scraped: false,
          message: "Auto-fill not available (FireCrawl not configured)",
        })
      }

      // Scrape the website using FireCrawl
      console.log("[Scrape] Extracting branding from:", validatedUrl.toString())
      const branding = await fetchPartnerBranding(validatedUrl.toString())

      // Extract business name from title or meta
      let businessName = null
      if (branding?.metadata?.title) {
        // Clean up the title - remove common suffixes
        businessName = branding.metadata.title
          .replace(/\s*[-|–]\s*.*(home|official|welcome|fitness|gym|studio).*$/i, "")
          .replace(/\s*[-|–]\s*$/i, "")
          .trim()
      }

      // Use default primary color (color extraction not supported by FireCrawl)
      const primaryColor = "#14B8A6" // Default teal

      // Extract logo
      const logoUrl = branding?.logoUrl || null

      // Extract description
      const description = branding?.metadata?.description || null

      console.log("[Scrape] Extracted:", { businessName, primaryColor, logoUrl: !!logoUrl })

      return NextResponse.json({
        businessName,
        primaryColor,
        logoUrl,
        description,
        scraped: true,
        message: "Successfully extracted branding",
      })

    } catch (error) {
      console.error("[Scrape] Error scraping website:", error)

      // Return fallback data on error - don't expose error details
      return NextResponse.json({
        businessName: null,
        primaryColor: "#14B8A6",
        logoUrl: null,
        description: null,
        scraped: false,
        message: "Could not auto-fill from website",
      })
    }
  })
}
