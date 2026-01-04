/**
 * API Route: Generate Contracts
 * Auto-populates contract templates with partner data
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateAllContracts, type PartnerData } from '@/lib/contracts/populate'
import { db, isDbConfigured } from '@/lib/db'
import { partners } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    if (!isDbConfigured() || !db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { partnerId } = body

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

    // Prepare partner data for contract generation
    const partnerData: PartnerData = {
      businessName: partner.businessName,
      contactName: partner.contactName,
      contactEmail: partner.contactEmail,
      contactPhone: partner.contactPhone || undefined,
      businessAddress: partner.businessAddress || undefined,
      websiteUrl: partner.websiteUrl || undefined,
      businessType: partner.businessType,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Generate all contracts
    const contracts = await generateAllContracts(partnerData)

    return NextResponse.json({
      success: true,
      contracts,
      partnerId
    })
  } catch (error) {
    console.error('Error generating contracts:', error)
    return NextResponse.json(
      { error: 'Failed to generate contracts' },
      { status: 500 }
    )
  }
}

