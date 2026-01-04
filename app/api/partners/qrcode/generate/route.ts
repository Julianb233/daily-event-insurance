/**
 * API Route: Generate QR Code
 * Generates QR code for microsite URL
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateQRCode } from '@/lib/qrcode/generator'
import { db, isDbConfigured } from '@/lib/db'
import { microsites } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { micrositeId, url, color } = body

    if (!micrositeId && !url) {
      return NextResponse.json(
        { error: 'Microsite ID or URL is required' },
        { status: 400 }
      )
    }

    let qrCodeUrl: string
    let micrositeUrl: string

    if (micrositeId) {
      if (!isDbConfigured() || !db) {
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 503 }
        )
      }

      // Fetch microsite from database
      const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.id, micrositeId))
        .limit(1)

      if (!microsite) {
        return NextResponse.json(
          { error: 'Microsite not found' },
          { status: 404 }
        )
      }

      micrositeUrl = microsite.customDomain
        ? `https://${microsite.customDomain}`
        : microsite.domain
        ? `https://${microsite.domain}`
        : `https://${microsite.subdomain}.dailyeventinsurance.com`
    } else {
      micrositeUrl = url
    }

    // Generate QR code
    qrCodeUrl = await generateQRCode(micrositeUrl, {
      width: 300,
      color: {
        dark: color || '#14B8A6',
        light: '#FFFFFF'
      }
    })

    // Update microsite with QR code URL if micrositeId provided
    if (micrositeId && db) {
      await db
        .update(microsites)
        .set({
          qrCodeUrl: qrCodeUrl,
          updatedAt: new Date()
        })
        .where(eq(microsites.id, micrositeId))
    }

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      url: micrositeUrl
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

