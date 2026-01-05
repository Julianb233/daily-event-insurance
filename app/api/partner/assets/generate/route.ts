import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerLocations } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  generateStandaloneMicrosite,
  generateCheckinMicrosite,
  generateQRCodeFlyer,
  prepareBrandingForStorage,
  type MicrositeConfig
} from "@/lib/microsite/generator"
import { fetchPartnerBranding } from "@/lib/firecrawl/client"

/**
 * POST /api/partner/assets/generate
 * Generate personalized marketing assets with partner branding
 *
 * NEW asset types:
 * - microsite: Full glass morphism landing page
 * - checkin: Front desk check-in form with lead capture
 * - qr-flyer: Printable QR code flyer (8.5x11)
 * - all-digital: Generate all digital assets at once
 *
 * Legacy asset types:
 * - flyer, email, social, brochure, certificate
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Parse request body
    const body = await request.json()
    const { assetType, template, customization = {}, locationId } = body

    // Validate asset type
    const validAssetTypes = [
      "microsite", "checkin", "qr-flyer", "all-digital",  // New digital assets
      "flyer", "email", "social", "brochure", "certificate"  // Legacy templates
    ]
    if (!assetType || !validAssetTypes.includes(assetType)) {
      // SECURITY: Don't expose valid asset types in production
      const isProduction = process.env.NODE_ENV === "production"
      return NextResponse.json(
        {
          error: "Invalid asset type",
          message: isProduction
            ? "Invalid asset type provided"
            : `Asset type must be one of: ${validAssetTypes.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Get partner profile for branding
    let partner: any = null
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

    // =================================================================
    // NEW: Digital asset generation (microsite, checkin, qr-flyer)
    // =================================================================
    const digitalAssetTypes = ["microsite", "checkin", "qr-flyer", "all-digital"]
    if (digitalAssetTypes.includes(assetType)) {
      // Fetch branding from partner's website (auto-extract logo + colors)
      let websiteBranding: { images: string[]; logoUrl?: string; metadata?: any } = { images: [] }
      const websiteUrl = partner.websiteUrl
      if (websiteUrl) {
        try {
          console.log("[Assets] Fetching branding from:", websiteUrl)
          websiteBranding = await fetchPartnerBranding(websiteUrl)
          console.log("[Assets] Extracted logo:", websiteBranding.logoUrl ? "✅ Found" : "❌ Not found")
        } catch (error) {
          console.error("[Assets] Error fetching branding:", error)
        }
      }

      // Use extracted logo or fall back to stored logo
      const logoUrl = websiteBranding.logoUrl || partner.logoUrl || "/images/logo-placeholder.png"

      // Update partner with extracted logo if we found a new one
      if (websiteBranding.logoUrl && websiteBranding.logoUrl !== partner.logoUrl) {
        await db!
          .update(partners)
          .set({
            logoUrl: websiteBranding.logoUrl,
            updatedAt: new Date()
          })
          .where(eq(partners.id, partner.id))
        console.log("[Assets] Updated partner logo in database")
      }

      // Build microsite config
      const config: MicrositeConfig = {
        partnerId: partner.id,
        partnerName: partner.businessName,
        websiteUrl: websiteUrl,
        logoUrl: logoUrl,
        primaryColor: partner.primaryColor || "#14B8A6",
        type: assetType === "checkin" ? "checkin" : "standalone",
        businessType: partner.businessType || "other",
        contactEmail: partner.contactEmail || undefined,
        contactPhone: partner.contactPhone || undefined,
      }

      // If generating for a specific location, get location details
      if (locationId) {
        const locationResult = await db!
          .select()
          .from(partnerLocations)
          .where(eq(partnerLocations.id, locationId))
          .limit(1)

        if (locationResult.length > 0) {
          const location = locationResult[0]
          config.subdomain = location.customSubdomain || undefined
        }
      }

      try {
        let result: any = {}

        switch (assetType) {
          case "microsite": {
            const microsite = await generateStandaloneMicrosite(config)
            result = {
              success: true,
              assetType: "microsite",
              html: microsite.html,
              qrCodeDataUrl: microsite.qrCodeDataUrl,
              micrositeUrl: microsite.url,
              branding: {
                logoUrl,
                primaryColor: config.primaryColor,
                businessName: partner.businessName
              }
            }
            break
          }

          case "checkin": {
            const checkin = await generateCheckinMicrosite(config)
            result = {
              success: true,
              assetType: "checkin",
              html: checkin.html,
              qrCodeDataUrl: checkin.qrCodeDataUrl,
              micrositeUrl: checkin.url,
              branding: {
                logoUrl,
                primaryColor: config.primaryColor,
                businessName: partner.businessName
              },
              instructions: "Display this on a tablet at your front desk for customer check-in"
            }
            break
          }

          case "qr-flyer": {
            const site = await generateStandaloneMicrosite(config)
            const flyerHtml = generateQRCodeFlyer({
              partnerName: config.partnerName,
              logoUrl: logoUrl,
              primaryColor: config.primaryColor || "#14B8A6",
              qrCodeDataUrl: site.qrCodeDataUrl,
              micrositeUrl: site.url
            })
            result = {
              success: true,
              assetType: "qr-flyer",
              html: flyerHtml,
              qrCodeDataUrl: site.qrCodeDataUrl,
              micrositeUrl: site.url,
              branding: {
                logoUrl,
                primaryColor: config.primaryColor,
                businessName: partner.businessName
              },
              instructions: "Print this 8.5x11 flyer and display at your front desk. Customers can scan the QR code to get instant coverage."
            }
            break
          }

          case "all-digital": {
            const fullMicrosite = await generateStandaloneMicrosite(config)
            const fullCheckin = await generateCheckinMicrosite(config)
            const fullFlyer = generateQRCodeFlyer({
              partnerName: config.partnerName,
              logoUrl: logoUrl,
              primaryColor: config.primaryColor || "#14B8A6",
              qrCodeDataUrl: fullMicrosite.qrCodeDataUrl,
              micrositeUrl: fullMicrosite.url
            })
            const brandingData = prepareBrandingForStorage(
              partner.id,
              partner.businessName,
              partner.primaryColor || "#14B8A6",
              websiteBranding,
              logoUrl
            )

            result = {
              success: true,
              assetType: "all-digital",
              microsite: {
                html: fullMicrosite.html,
                url: fullMicrosite.url
              },
              checkin: {
                html: fullCheckin.html,
                url: fullCheckin.url
              },
              flyer: {
                html: fullFlyer
              },
              qrCodeDataUrl: fullMicrosite.qrCodeDataUrl,
              micrositeUrl: fullMicrosite.url,
              branding: brandingData,
              quickStart: {
                step1: "Print the QR flyer and display at your front desk",
                step2: "Or use the check-in form on a tablet for customer sign-up",
                step3: "Share your microsite URL with customers via email or social media",
                step4: "Customers scan QR → fill quick form → get instant coverage"
              }
            }
            break
          }
        }

        console.log(`[ASSET GENERATION] Generated ${assetType} for partner ${partner.id}`)
        return NextResponse.json(result)

      } catch (error) {
        console.error("[Assets] Error generating digital assets:", error)
        return NextResponse.json(
          { error: "Failed to generate assets" },
          { status: 500 }
        )
      }
    }

    // =================================================================
    // LEGACY: Template-based asset generation
    // =================================================================

    // Validate template for legacy types
    if (!template) {
      return NextResponse.json(
        { error: "Missing template", message: "Template ID is required for this asset type" },
        { status: 400 }
      )
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
 * List available asset types and templates
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requirePartner()

    const searchParams = request.nextUrl.searchParams
    const assetType = searchParams.get("assetType")

    // NEW: Digital asset types (no template required)
    const digitalAssets = {
      microsite: {
        name: "Glass Morphism Microsite",
        description: "Beautiful full-page landing site with your branding, animated backgrounds, and QR code",
        features: ["3D glass morphism design", "Animated gradient orbs", "Your logo auto-extracted", "Brand colors applied", "Built-in QR code"],
        quickStart: true
      },
      checkin: {
        name: "Front Desk Check-In",
        description: "Customer lead capture form for tablets at your front desk",
        features: ["Glass morphism design", "Lead capture form", "Auto-sends to your dashboard", "QR code fallback for mobile"],
        quickStart: true
      },
      "qr-flyer": {
        name: "Printable QR Flyer",
        description: "8.5x11 print-ready flyer with large QR code and instructions",
        features: ["Your logo and branding", "Large scannable QR code", "Step-by-step instructions", "Ready to print"],
        quickStart: true
      },
      "all-digital": {
        name: "Complete Digital Kit",
        description: "Generate all digital assets at once - microsite, check-in form, and QR flyer",
        features: ["All 3 assets in one click", "Consistent branding", "Quick start guide included"],
        quickStart: true
      }
    }

    // If requesting digital assets info
    if (assetType && assetType in digitalAssets) {
      return NextResponse.json({
        assetType,
        ...digitalAssets[assetType as keyof typeof digitalAssets],
        usage: `POST /api/partner/assets/generate with { "assetType": "${assetType}" }`
      })
    }

    // Template library (legacy)
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

    // Return all assets (digital + templates)
    return NextResponse.json({
      digitalAssets,
      templates,
      categories: {
        quickStart: ["microsite", "checkin", "qr-flyer", "all-digital"],
        legacy: Object.keys(templates)
      },
      recommended: "all-digital",
      quickStartInstructions: {
        step1: "Call POST /api/partner/assets/generate with { \"assetType\": \"all-digital\" }",
        step2: "You'll receive HTML for microsite, check-in form, and printable QR flyer",
        step3: "Print the flyer, display at front desk, customers scan → get coverage",
        step4: "Your logo and brand colors are automatically extracted from your website"
      }
    })
  })
}
