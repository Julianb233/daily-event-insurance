import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerLocations, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"

// Mock locations for dev mode
const MOCK_LOCATIONS = [
  {
    id: "loc-1",
    partnerId: "partner-1",
    locationName: "Downtown LA",
    locationCode: "DTLA-001",
    isPrimary: true,
    address: "123 Main Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90012",
    country: "USA",
    contactName: "Mike Thompson",
    contactEmail: "mike@spartanfitness.com",
    contactPhone: "(213) 555-0100",
    contactRole: "Owner",
    customSubdomain: "spartan-downtown-la",
    qrCodeUrl: null,
    estimatedMonthlyParticipants: 500,
    totalPolicies: 0,
    totalRevenue: "0",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "loc-2",
    partnerId: "partner-1",
    locationName: "Santa Monica",
    locationCode: "SM-002",
    isPrimary: false,
    address: "456 Ocean Ave",
    city: "Santa Monica",
    state: "CA",
    zipCode: "90401",
    country: "USA",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@spartanfitness.com",
    contactPhone: "(310) 555-0200",
    contactRole: "Manager",
    customSubdomain: "spartan-santa-monica",
    qrCodeUrl: null,
    estimatedMonthlyParticipants: 350,
    totalPolicies: 0,
    totalRevenue: "0",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

/**
 * GET /api/partner/locations
 * Get all locations for the authenticated partner
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock locations data")
      return NextResponse.json({
        locations: MOCK_LOCATIONS,
        hasMultipleLocations: true,
      })
    }

    // Get partner
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

    const partner = partnerResult[0]

    // Get all locations for this partner
    const locations = await db!
      .select()
      .from(partnerLocations)
      .where(eq(partnerLocations.partnerId, partner.id))

    // Get microsite info for base URL
    const micrositeResult = await db!
      .select()
      .from(microsites)
      .where(eq(microsites.partnerId, partner.id))
      .limit(1)

    const microsite = micrositeResult.length > 0 ? micrositeResult[0] : null

    return NextResponse.json({
      locations,
      hasMultipleLocations: partner.hasMultipleLocations ?? locations.length > 1,
      microsite,
    })
  })
}

/**
 * POST /api/partner/locations
 * Create a new location
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]
    const body = await request.json()

    // Create the location
    const newLocation = await db!
      .insert(partnerLocations)
      .values({
        partnerId: partner.id,
        locationName: body.locationName,
        locationCode: body.locationCode,
        isPrimary: body.isPrimary ?? false,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        country: body.country ?? "USA",
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactRole: body.contactRole,
        customSubdomain: body.customSubdomain,
        estimatedMonthlyParticipants: body.estimatedMonthlyParticipants,
        status: "active",
        activatedAt: new Date(),
      })
      .returning()

    // Update partner location count
    const allLocations = await db!
      .select()
      .from(partnerLocations)
      .where(eq(partnerLocations.partnerId, partner.id))

    await db!
      .update(partners)
      .set({
        locationCount: allLocations.length,
        hasMultipleLocations: allLocations.length > 1,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partner.id))

    return NextResponse.json({
      location: newLocation[0],
      message: "Location created successfully",
    })
  })
}
