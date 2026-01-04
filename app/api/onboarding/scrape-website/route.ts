import { NextRequest, NextResponse } from "next/server"
import { fetchPartnerBranding } from "@/lib/firecrawl/client"

/**
 * POST /api/onboarding/scrape-website
 * Scrape a partner's website to auto-fill business information
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    // Validate URL format
    let validatedUrl: string
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
      validatedUrl = urlObj.toString()
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
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
    console.log("[Scrape] Extracting branding from:", validatedUrl)
    const branding = await fetchPartnerBranding(validatedUrl)

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

    // Return fallback data on error
    return NextResponse.json({
      businessName: null,
      primaryColor: "#14B8A6",
      logoUrl: null,
      description: null,
      scraped: false,
      message: "Could not auto-fill from website",
    })
  }
}
