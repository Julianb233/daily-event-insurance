/**
 * API Route: Generate Microsite
 * Generates standalone or integrated microsite for partner
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateStandaloneMicrosite, generateIntegratedMicrosite, type MicrositeConfig } from '@/lib/microsite/generator'
import { db, isDbConfigured } from '@/lib/db'
import { partners, microsites } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateQRCode } from '@/lib/qrcode/generator'

export async function POST(request: NextRequest) {
  try {
    if (!isDbConfigured() || !db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { partnerId, type = 'standalone' } = body

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      )
    }

    // Fetch partner data
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1)

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    // Prepare microsite config
    const config: MicrositeConfig = {
      partnerId: partner.id,
      partnerName: partner.businessName,
      websiteUrl: partner.websiteUrl || undefined,
      logoUrl: partner.logoUrl || undefined,
      primaryColor: partner.primaryColor || '#14B8A6',
      type: type === 'integrated' ? 'integrated' : 'standalone',
      subdomain: partner.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customDomain: undefined // Can be set later
    }

    // Generate microsite
    const microsite = type === 'integrated'
      ? await generateIntegratedMicrosite(config)
      : await generateStandaloneMicrosite(config)

    // Save QR code URL to database (save to cloud storage in production)
    // For now, we'll store the data URL or upload to a storage service
    const qrCodeUrl = microsite.qrCodeDataUrl // In production, upload to S3/Cloudinary/etc.

    // Check if microsite already exists
    const [existingMicrosite] = await db
      .select()
      .from(microsites)
      .where(eq(microsites.partnerId, partnerId))
      .limit(1)

    if (existingMicrosite) {
      // Update existing microsite
      await db
        .update(microsites)
        .set({
          qrCodeUrl: qrCodeUrl,
          updatedAt: new Date()
        })
        .where(eq(microsites.id, existingMicrosite.id))
    } else {
      // Create new microsite
      await db.insert(microsites).values({
        partnerId: partner.id,
        subdomain: config.subdomain,
        siteName: partner.businessName,
        primaryColor: config.primaryColor,
        logoUrl: microsite.branding.logoUrl || config.logoUrl,
        qrCodeUrl: qrCodeUrl,
        status: 'building'
      })
    }

    return NextResponse.json({
      success: true,
      microsite: {
        html: microsite.html,
        url: microsite.url,
        qrCodeUrl: qrCodeUrl,
        branding: microsite.branding
      },
      partnerId
    })
  } catch (error) {
    console.error('Error generating microsite:', error)
    return NextResponse.json(
      { error: 'Failed to generate microsite' },
      { status: 500 }
    )
  }
}

