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
import { completePartnerOnboarding } from "@/lib/onboarding-automation"

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

    const result = await completePartnerOnboarding(partnerId)

    return NextResponse.json({
      success: true,
      message: `Onboarding complete for ${result.businessName}`,
      data: result
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

