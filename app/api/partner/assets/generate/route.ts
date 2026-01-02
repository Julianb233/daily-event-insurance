import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"

/**
 * POST /api/partner/assets/generate
 * Generate personalized marketing assets with partner branding
 *
 * Request body:
 * {
 *   assetType: "flyer" | "email" | "social" | "brochure" | "certificate",
 *   template: string, // template ID
 *   customization?: {
 *     headline?: string,
 *     subheadline?: string,
 *     callToAction?: string,
 *     additionalText?: string
 *   }
 * }
 *
 * Returns:
 * {
 *   downloadUrl: string,
 *   previewUrl: string,
 *   assetId: string,
 *   expiresAt: string
 * }
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Parse request body
    const body = await request.json()
    const { assetType, template, customization = {} } = body

    // Validate asset type
    const validAssetTypes = ["flyer", "email", "social", "brochure", "certificate"]
    if (!assetType || !validAssetTypes.includes(assetType)) {
      return NextResponse.json(
        {
          error: "Invalid asset type",
          message: `Asset type must be one of: ${validAssetTypes.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Validate template
    if (!template) {
      return NextResponse.json(
        { error: "Missing template", message: "Template ID is required" },
        { status: 400 }
      )
    }

    // Get partner profile for branding
    let partner = null
    if (!isDevMode && isDbConfigured()) {
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return NextResponse.json(
          { error: "Partner not found", message: "Partner profile not found" },
          { status: 404 }
        )
      }

      partner = partnerResult[0]
    }

    // Demo mode - return mock data
    if (isDevMode || !isDbConfigured() || !partner) {
      console.log("[DEV MODE] Returning mock generated asset")
      return NextResponse.json({
        downloadUrl: `/api/downloads/marketing/generated-${assetType}-${Date.now()}.pdf`,
        previewUrl: `/preview/generated-${assetType}-${Date.now()}.png`,
        assetId: `asset-${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          assetType,
          template,
          customization,
          branding: {
            primaryColor: "#14B8A6",
            businessName: "Demo Partner",
            logoUrl: "/images/logo-placeholder.png",
          },
        },
      })
    }

    // Extract partner branding
    const branding = {
      primaryColor: partner.primaryColor || "#14B8A6",
      businessName: partner.businessName,
      logoUrl: partner.logoUrl || "/images/logo-placeholder.png",
      contactName: partner.contactName,
      contactEmail: partner.contactEmail,
      contactPhone: partner.contactPhone,
    }

    // TODO: Integrate with PDF generation service
    // For now, we'll return a placeholder response
    // In production, this would:
    // 1. Load the template from a template engine (e.g., Handlebars, Puppeteer)
    // 2. Inject partner branding and customization
    // 3. Generate PDF/PNG using a service like Puppeteer, PDFKit, or an external API
    // 4. Upload to cloud storage (S3, Cloudflare R2)
    // 5. Return download URL with expiration

    // Generate unique asset ID
    const assetId = `asset-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // In production, this would be the actual generated asset URL
    const downloadUrl = `/api/downloads/marketing/generated-${assetType}-${assetId}.pdf`
    const previewUrl = `/preview/generated-${assetType}-${assetId}.png`

    console.log(`[ASSET GENERATION] Generated ${assetType} for partner ${partner.id}`)

    return NextResponse.json({
      downloadUrl,
      previewUrl,
      assetId,
      expiresAt: expiresAt.toISOString(),
      metadata: {
        assetType,
        template,
        customization,
        branding,
      },
    })
  })
}

/**
 * GET /api/partner/assets/generate
 * List available templates for asset generation
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requirePartner()

    const searchParams = request.nextUrl.searchParams
    const assetType = searchParams.get("assetType")

    // Template library
    const templates = {
      flyer: [
        {
          id: "flyer-modern",
          name: "Modern Flyer",
          description: "Clean, modern design with bold headlines",
          previewUrl: "/templates/flyer-modern-preview.png",
        },
        {
          id: "flyer-classic",
          name: "Classic Flyer",
          description: "Traditional layout with professional styling",
          previewUrl: "/templates/flyer-classic-preview.png",
        },
        {
          id: "flyer-bold",
          name: "Bold Flyer",
          description: "Eye-catching design with vibrant colors",
          previewUrl: "/templates/flyer-bold-preview.png",
        },
      ],
      email: [
        {
          id: "email-welcome",
          name: "Welcome Email",
          description: "Introduce your insurance offering to new customers",
          previewUrl: "/templates/email-welcome-preview.png",
        },
        {
          id: "email-reminder",
          name: "Coverage Reminder",
          description: "Remind customers about available coverage",
          previewUrl: "/templates/email-reminder-preview.png",
        },
        {
          id: "email-renewal",
          name: "Renewal Notice",
          description: "Policy renewal notification",
          previewUrl: "/templates/email-renewal-preview.png",
        },
      ],
      social: [
        {
          id: "social-square",
          name: "Square Post",
          description: "Instagram/Facebook square post (1080x1080)",
          previewUrl: "/templates/social-square-preview.png",
        },
        {
          id: "social-story",
          name: "Story/Reel",
          description: "Instagram story format (1080x1920)",
          previewUrl: "/templates/social-story-preview.png",
        },
        {
          id: "social-linkedin",
          name: "LinkedIn Post",
          description: "LinkedIn horizontal post (1200x627)",
          previewUrl: "/templates/social-linkedin-preview.png",
        },
      ],
      brochure: [
        {
          id: "brochure-trifold",
          name: "Tri-fold Brochure",
          description: "Classic tri-fold design with product information",
          previewUrl: "/templates/brochure-trifold-preview.png",
        },
        {
          id: "brochure-bifold",
          name: "Bi-fold Brochure",
          description: "Simple bi-fold layout with key benefits",
          previewUrl: "/templates/brochure-bifold-preview.png",
        },
      ],
      certificate: [
        {
          id: "certificate-standard",
          name: "Standard Certificate",
          description: "Professional insurance certificate",
          previewUrl: "/templates/certificate-standard-preview.png",
        },
        {
          id: "certificate-premium",
          name: "Premium Certificate",
          description: "Enhanced certificate with decorative border",
          previewUrl: "/templates/certificate-premium-preview.png",
        },
      ],
    }

    // Filter by asset type if provided
    if (assetType && assetType in templates) {
      return NextResponse.json({
        templates: templates[assetType as keyof typeof templates],
        assetType,
      })
    }

    // Return all templates
    return NextResponse.json({
      templates,
      categories: Object.keys(templates),
    })
  })
}
