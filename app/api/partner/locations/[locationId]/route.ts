import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerLocations } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { generateApiKey, generateWebhookSecret, generateEmbedCode } from "@/lib/webhooks/outbound"

/**
 * GET /api/partner/locations/[locationId]
 * Get a specific location with stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { locationId } = await params

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
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
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    // Get location (verify it belongs to this partner)
    const locationResult = await db!
      .select()
      .from(partnerLocations)
      .where(
        and(
          eq(partnerLocations.id, locationId),
          eq(partnerLocations.partnerId, partner.id)
        )
      )
      .limit(1)

    if (locationResult.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json({
      location: locationResult[0],
    })
  })
}

/**
 * PATCH /api/partner/locations/[locationId]
 * Update a location (including integration settings)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { locationId } = await params
    const body = await request.json()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
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
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    // Verify location belongs to this partner
    const locationResult = await db!
      .select()
      .from(partnerLocations)
      .where(
        and(
          eq(partnerLocations.id, locationId),
          eq(partnerLocations.partnerId, partner.id)
        )
      )
      .limit(1)

    if (locationResult.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const location = locationResult[0]

    // Build update object
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    // Basic location fields
    if (body.locationName !== undefined) updateData.locationName = body.locationName
    if (body.address !== undefined) updateData.address = body.address
    if (body.city !== undefined) updateData.city = body.city
    if (body.state !== undefined) updateData.state = body.state
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode
    if (body.contactName !== undefined) updateData.contactName = body.contactName
    if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail
    if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone
    if (body.contactRole !== undefined) updateData.contactRole = body.contactRole

    // Integration settings
    if (body.integrationType !== undefined) {
      updateData.integrationType = body.integrationType

      // Generate embed code if switching to embedded
      if (body.integrationType === 'embedded' && location.customSubdomain) {
        updateData.embedCode = generateEmbedCode(
          location.customSubdomain,
          partner.primaryColor || '#14B8A6'
        )
      }
    }

    // Webhook settings
    if (body.webhookUrl !== undefined) {
      updateData.webhookUrl = body.webhookUrl
      if (body.webhookUrl && !location.webhookSecret) {
        updateData.webhookSecret = generateWebhookSecret()
      }
    }
    if (body.webhookEvents !== undefined) {
      updateData.webhookEvents = JSON.stringify(body.webhookEvents)
    }

    // POS settings
    if (body.posTerminalId !== undefined) updateData.posTerminalId = body.posTerminalId

    // E-commerce settings
    if (body.ecommercePlatform !== undefined) updateData.ecommercePlatform = body.ecommercePlatform
    if (body.ecommerceStoreId !== undefined) updateData.ecommerceStoreId = body.ecommerceStoreId

    // Update the location
    await db!
      .update(partnerLocations)
      .set(updateData)
      .where(eq(partnerLocations.id, locationId))

    // Fetch updated location
    const updatedLocation = await db!
      .select()
      .from(partnerLocations)
      .where(eq(partnerLocations.id, locationId))
      .limit(1)

    return NextResponse.json({
      location: updatedLocation[0],
      message: "Location updated successfully",
    })
  })
}

/**
 * POST /api/partner/locations/[locationId]/generate-credentials
 * Generate API key/secret for a location
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { locationId } = await params
    const body = await request.json()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
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
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    // Verify location belongs to this partner
    const locationResult = await db!
      .select()
      .from(partnerLocations)
      .where(
        and(
          eq(partnerLocations.id, locationId),
          eq(partnerLocations.partnerId, partner.id)
        )
      )
      .limit(1)

    if (locationResult.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const location = locationResult[0]

    // Handle different credential types
    if (body.type === 'api') {
      // Generate new API credentials
      const { apiKey, apiSecret, apiSecretHash } = generateApiKey()

      await db!
        .update(partnerLocations)
        .set({
          apiKey,
          apiSecretHash,
          updatedAt: new Date(),
        })
        .where(eq(partnerLocations.id, locationId))

      // Return the secret ONCE (won't be retrievable later)
      return NextResponse.json({
        apiKey,
        apiSecret, // Only returned once!
        message: "API credentials generated. Save the secret - it won't be shown again!",
      })
    }

    if (body.type === 'webhook') {
      // Generate new webhook secret
      const webhookSecret = generateWebhookSecret()

      await db!
        .update(partnerLocations)
        .set({
          webhookSecret,
          updatedAt: new Date(),
        })
        .where(eq(partnerLocations.id, locationId))

      return NextResponse.json({
        webhookSecret,
        message: "Webhook secret generated",
      })
    }

    if (body.type === 'embed') {
      // Generate embed code
      const embedCode = generateEmbedCode(
        location.customSubdomain || locationId,
        partner.primaryColor || '#14B8A6'
      )

      await db!
        .update(partnerLocations)
        .set({
          embedCode,
          updatedAt: new Date(),
        })
        .where(eq(partnerLocations.id, locationId))

      return NextResponse.json({
        embedCode,
        message: "Embed code generated",
      })
    }

    return NextResponse.json(
      { error: "Invalid credential type" },
      { status: 400 }
    )
  })
}

/**
 * DELETE /api/partner/locations/[locationId]
 * Delete a location
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { locationId } = await params

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
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
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    // Verify location belongs to this partner
    const locationResult = await db!
      .select()
      .from(partnerLocations)
      .where(
        and(
          eq(partnerLocations.id, locationId),
          eq(partnerLocations.partnerId, partner.id)
        )
      )
      .limit(1)

    if (locationResult.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Delete the location
    await db!
      .delete(partnerLocations)
      .where(eq(partnerLocations.id, locationId))

    // Update partner location count
    const remainingLocations = await db!
      .select()
      .from(partnerLocations)
      .where(eq(partnerLocations.partnerId, partner.id))

    await db!
      .update(partners)
      .set({
        locationCount: remainingLocations.length,
        hasMultipleLocations: remainingLocations.length > 1,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partner.id))

    return NextResponse.json({
      message: "Location deleted successfully",
    })
  })
}
