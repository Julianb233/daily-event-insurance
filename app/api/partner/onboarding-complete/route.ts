/**
 * POST /api/partner/onboarding-complete
 *
 * Orchestrates the post-signing automation pipeline:
 * 1. Fetch partner data from database
 * 2. FireCrawl: Scrape partner website for branding
 * 3. Generate microsite with branding
 * 4. Create QR code for microsite URL
 * 5. Update Supabase (microsites table + partner status)
 * 6. Sync to Google Sheets
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, microsites } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { fetchPartnerBranding } from "@/lib/firecrawl/client"
import { generateStandaloneMicrosite, generateIntegratedMicrosite } from "@/lib/microsite/generator"
import { generateQRCode } from "@/lib/qrcode/generator"
import { appendPartnerToSheet, updatePartnerInSheet } from "@/lib/google-sheets/client"
import { appendPartnerToExcel, type PartnerLogEntry } from "@/lib/excel/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { partnerId } = body

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: partnerId" },
        { status: 400 }
      )
    }

    // Check database connection
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    // 1. Get partner data from database
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "Partner not found" },
        { status: 404 }
      )
    }

    // Verify all documents are signed
    if (!partner.agreementSigned || !partner.w9Signed || !partner.directDepositSigned) {
      return NextResponse.json(
        { success: false, error: "All documents must be signed before completing onboarding" },
        { status: 400 }
      )
    }

    console.log(`Starting onboarding completion for partner: ${partner.businessName} (${partnerId})`)

    // 2. FireCrawl: Scrape partner website for branding (if website URL provided)
    let branding: { logoUrl?: string; images: string[] } = { images: [] }
    if (partner.websiteUrl) {
      console.log(`Fetching branding from: ${partner.websiteUrl}`)
      try {
        const fetchedBranding = await fetchPartnerBranding(partner.websiteUrl)
        branding = {
          logoUrl: fetchedBranding.logoUrl,
          images: fetchedBranding.images
        }
        console.log(`Branding fetched: logo=${branding.logoUrl ? 'found' : 'not found'}, images=${branding.images.length}`)
      } catch (error) {
        console.error('Error fetching branding (continuing without):', error)
      }
    }

    // Use fetched logo or existing partner logo
    const logoUrl = branding.logoUrl || partner.logoUrl || undefined

    // 3. Generate microsite with branding
    const micrositeConfig = {
      partnerId: partner.id,
      partnerName: partner.businessName,
      websiteUrl: partner.websiteUrl || undefined,
      logoUrl,
      primaryColor: partner.primaryColor || '#14B8A6',
      type: (partner.integrationType === 'widget' ? 'integrated' : 'standalone') as 'integrated' | 'standalone',
      subdomain: partner.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    }

    console.log(`Generating ${micrositeConfig.type} microsite...`)

    const generatedMicrosite = micrositeConfig.type === 'integrated'
      ? await generateIntegratedMicrosite(micrositeConfig)
      : await generateStandaloneMicrosite(micrositeConfig)

    console.log(`Microsite generated: ${generatedMicrosite.url}`)

    // 4. Generate QR code for microsite URL (with partner's brand color)
    const qrCodeDataUrl = await generateQRCode(generatedMicrosite.url, {
      width: 300,
      color: {
        dark: partner.primaryColor || '#14B8A6',
        light: '#FFFFFF'
      }
    })

    console.log('QR code generated')

    // 5. Update Supabase - Create microsite record
    const now = new Date()

    // Check if microsite already exists for this partner
    const existingMicrosite = await db
      .select()
      .from(microsites)
      .where(eq(microsites.partnerId, partnerId))
      .limit(1)

    let micrositeId: string

    if (existingMicrosite.length > 0) {
      // Update existing microsite
      await db
        .update(microsites)
        .set({
          siteName: partner.businessName,
          subdomain: micrositeConfig.subdomain,
          domain: `${micrositeConfig.subdomain}.dailyeventinsurance.com`,
          logoUrl: logoUrl || null,
          primaryColor: partner.primaryColor || '#14B8A6',
          qrCodeUrl: qrCodeDataUrl,
          status: 'live',
          launchedAt: now,
          updatedAt: now
        })
        .where(eq(microsites.partnerId, partnerId))

      micrositeId = existingMicrosite[0].id
      console.log(`Updated existing microsite: ${micrositeId}`)
    } else {
      // Create new microsite
      const [newMicrosite] = await db
        .insert(microsites)
        .values({
          partnerId,
          siteName: partner.businessName,
          subdomain: micrositeConfig.subdomain,
          domain: `${micrositeConfig.subdomain}.dailyeventinsurance.com`,
          logoUrl: logoUrl || null,
          primaryColor: partner.primaryColor || '#14B8A6',
          qrCodeUrl: qrCodeDataUrl,
          status: 'live',
          launchedAt: now,
          createdAt: now,
          updatedAt: now
        })
        .returning()

      micrositeId = newMicrosite.id
      console.log(`Created new microsite: ${micrositeId}`)
    }

    // Update partner status to 'active' and store microsite info
    await db
      .update(partners)
      .set({
        status: 'active',
        logoUrl: logoUrl || partner.logoUrl,
        approvedAt: now,
        updatedAt: now
      })
      .where(eq(partners.id, partnerId))

    console.log(`Partner status updated to 'active'`)

    // 6. Sync to Google Sheets
    const sheetData = {
      partnerId: partner.id,
      businessName: partner.businessName,
      businessType: partner.businessType,
      contactName: partner.contactName,
      contactEmail: partner.contactEmail,
      contactPhone: partner.contactPhone || undefined,
      websiteUrl: partner.websiteUrl || undefined,
      directContactName: partner.directContactName || undefined,
      directContactEmail: partner.directContactEmail || undefined,
      directContactPhone: partner.directContactPhone || undefined,
      estimatedMonthlyParticipants: partner.estimatedMonthlyParticipants || undefined,
      estimatedAnnualParticipants: partner.estimatedAnnualParticipants || undefined,
      integrationType: partner.integrationType || undefined,
      micrositeUrl: generatedMicrosite.url,
      qrCodeUrl: qrCodeDataUrl,
      status: 'active',
      signupDate: partner.createdAt
    }

    try {
      await appendPartnerToSheet(sheetData)
      console.log('Partner synced to Google Sheets')
    } catch (error) {
      console.error('Google Sheets sync failed (non-blocking):', error)
    }

    // Also log to local Excel file as backup
    try {
      const excelEntry: PartnerLogEntry = {
        partnerId: partner.id,
        businessName: partner.businessName,
        businessType: partner.businessType,
        contactName: partner.contactName,
        contactEmail: partner.contactEmail,
        contactPhone: partner.contactPhone || undefined,
        websiteUrl: partner.websiteUrl || undefined,
        directContactName: partner.directContactName || undefined,
        directContactEmail: partner.directContactEmail || undefined,
        directContactPhone: partner.directContactPhone || undefined,
        estimatedMonthlyParticipants: partner.estimatedMonthlyParticipants || undefined,
        estimatedAnnualParticipants: partner.estimatedAnnualParticipants || undefined,
        micrositeUrl: generatedMicrosite.url,
        qrCodeUrl: qrCodeDataUrl,
        status: 'active',
        createdAt: partner.createdAt
      }
      appendPartnerToExcel(excelEntry)
      console.log('Partner logged to Excel')
    } catch (error) {
      console.error('Excel logging failed (non-blocking):', error)
    }

    console.log(`✅ Onboarding complete for ${partner.businessName}`)

    return NextResponse.json({
      success: true,
      message: `Onboarding complete for ${partner.businessName}`,
      data: {
        partnerId: partner.id,
        businessName: partner.businessName,
        status: 'active',
        microsite: {
          id: micrositeId,
          url: generatedMicrosite.url,
          qrCodeDataUrl
        },
        branding: {
          logoUrl: logoUrl || null,
          imagesExtracted: branding.images.length
        }
      }
    })

  } catch (error) {
    console.error("Error completing onboarding:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete onboarding",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
