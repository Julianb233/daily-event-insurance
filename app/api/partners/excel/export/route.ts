/**
 * API Route: Export Partner Data to Excel
 * Exports partner and microsite data to Excel file
 */

import { NextRequest, NextResponse } from 'next/server'
import { logPartnerToExcel, logMicrositeToExcel, type PartnerLogEntry, type MicrositeLogEntry } from '@/lib/excel/logger'
import { db, isDbConfigured } from '@/lib/db'
import { partners, microsites } from '@/lib/db/schema'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    if (!isDbConfigured() || !db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Fetch all partners
    const allPartners = await db.select().from(partners)
    
    // Fetch all microsites
    const allMicrosites = await db.select().from(microsites)

    // Prepare partner log entries
    const partnerEntries: PartnerLogEntry[] = allPartners.map(partner => ({
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
      status: partner.status || 'pending',
      createdAt: partner.createdAt
    }))

    // Prepare microsite log entries
    const micrositeEntries: MicrositeLogEntry[] = allMicrosites.map(microsite => ({
      micrositeId: microsite.id,
      partnerId: microsite.partnerId,
      partnerName: microsite.siteName,
      subdomain: microsite.subdomain || undefined,
      customDomain: microsite.customDomain || undefined,
      url: microsite.customDomain
        ? `https://${microsite.customDomain}`
        : microsite.domain
        ? `https://${microsite.domain}`
        : `https://${microsite.subdomain}.dailyeventinsurance.com`,
      qrCodeUrl: microsite.qrCodeUrl || undefined,
      status: microsite.status || 'building',
      launchedAt: microsite.launchedAt || undefined,
      createdAt: microsite.createdAt
    }))

    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), 'logs')
    try {
      await mkdir(logsDir, { recursive: true })
    } catch {
      // Directory might already exist
    }

    // Generate Excel files
    const partnersPath = join(logsDir, `partners-${Date.now()}.xlsx`)
    const micrositesPath = join(logsDir, `microsites-${Date.now()}.xlsx`)

    logPartnerToExcel(partnerEntries, partnersPath)
    logMicrositeToExcel(micrositeEntries, micrositesPath)

    return NextResponse.json({
      success: true,
      files: {
        partners: partnersPath,
        microsites: micrositesPath
      },
      counts: {
        partners: partnerEntries.length,
        microsites: micrositeEntries.length
      }
    })
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return NextResponse.json(
      { error: 'Failed to export data to Excel' },
      { status: 500 }
    )
  }
}

