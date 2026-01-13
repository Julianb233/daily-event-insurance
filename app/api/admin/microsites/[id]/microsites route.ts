import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, microsites, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
  notFound,
  badRequest,
} from "@/lib/api-responses"

// Mock data for development
const mockMicrosites: Record<string, any> = {
  ms1: {
    id: "ms1",
    partnerId: "p1",
    slug: "adventure-sports-inc",
    customDomain: null,
    isActive: true,
    logoUrl: null,
    primaryColor: "#14B8A6",
    businessName: "Adventure Sports Inc",
    setupFee: "550.00",
    feeCollected: true,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
    partnerName: "John Smith",
    partnerEmail: "john@adventuresports.com",
  },
  ms2: {
    id: "ms2",
    partnerId: "p2",
    slug: "mountain-climbers-co",
    customDomain: "insurance.mountainclimbers.co",
    isActive: true,
    logoUrl: "/uploads/mountain-logo.png",
    primaryColor: "#2563EB",
    businessName: "Mountain Climbers Co",
    setupFee: "550.00",
    feeCollected: true,
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-06-15T00:00:00Z",
    partnerName: "Sarah Johnson",
    partnerEmail: "sarah@mountainclimbers.co",
  },
}

/**
 * GET /api/admin/microsites/[id]
 * Get a specific microsite
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const microsite = mockMicrosites[id]
        if (!microsite) {
          return notFound("Microsite")
        }
        return successResponse(microsite)
      }

      const [microsite] = await db!
        .select({
          id: microsites.id,
          partnerId: microsites.partnerId,
          slug: microsites.slug,
          customDomain: microsites.customDomain,
          isActive: microsites.isActive,
          logoUrl: microsites.logoUrl,
          primaryColor: microsites.primaryColor,
          businessName: microsites.businessName,
          setupFee: microsites.setupFee,
          feeCollected: microsites.feeCollected,
          createdAt: microsites.createdAt,
          updatedAt: microsites.updatedAt,
          partnerName: partners.contactName,
          partnerEmail: partners.contactEmail,
          partnerBusinessName: partners.businessName,
        })
        .from(microsites)
        .leftJoin(partners, eq(microsites.partnerId, partners.id))
        .where(eq(microsites.id, id))
        .limit(1)

      if (!microsite) {
        return notFound("Microsite")
      }

      return successResponse(microsite)
    } catch (error: any) {
      console.error("[Admin Microsites] GET by ID Error:", error)
      return serverError(error.message || "Failed to fetch microsite")
    }
  })
}

/**
 * PATCH /api/admin/microsites/[id]
 * Update a microsite
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params
      const body = await request.json()

      const {
        slug,
        customDomain,
        isActive,
        logoUrl,
        primaryColor,
        businessName,
        feeCollected,
      } = body

      // Validate slug format if provided
      if (slug) {
        const slugRegex = /^[a-z0-9-]+$/
        if (!slugRegex.test(slug)) {
          return badRequest("Slug must be lowercase alphanumeric with hyphens only")
        }
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const microsite = mockMicrosites[id]
        if (!microsite) {
          return notFound("Microsite")
        }

        const updated = {
          ...microsite,
          ...(slug !== undefined && { slug }),
          ...(customDomain !== undefined && { customDomain }),
          ...(isActive !== undefined && { isActive }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(primaryColor !== undefined && { primaryColor }),
          ...(businessName !== undefined && { businessName }),
          ...(feeCollected !== undefined && { feeCollected }),
          updatedAt: new Date().toISOString(),
        }

        return successResponse(updated, "Microsite updated successfully")
      }

      // Check if microsite exists
      const [existing] = await db!
        .select()
        .from(microsites)
        .where(eq(microsites.id, id))
        .limit(1)

      if (!existing) {
        return notFound("Microsite")
      }

      // Check if new slug already exists (if changing slug)
      if (slug && slug !== existing.slug) {
        const [existingSlug] = await db!
          .select()
          .from(microsites)
          .where(eq(microsites.slug, slug))
          .limit(1)

        if (existingSlug) {
          return badRequest("Slug already exists")
        }
      }

      // Build update object
      const updateData: any = {
        updatedAt: new Date(),
      }

      if (slug !== undefined) updateData.slug = slug
      if (customDomain !== undefined) updateData.customDomain = customDomain
      if (isActive !== undefined) updateData.isActive = isActive
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl
      if (primaryColor !== undefined) updateData.primaryColor = primaryColor
      if (businessName !== undefined) updateData.businessName = businessName
      if (feeCollected !== undefined) updateData.feeCollected = feeCollected

      const [updated] = await db!
        .update(microsites)
        .set(updateData)
        .where(eq(microsites.id, id))
        .returning()

      return successResponse(updated, "Microsite updated successfully")
    } catch (error: any) {
      console.error("[Admin Microsites] PATCH Error:", error)
      return serverError(error.message || "Failed to update microsite")
    }
  })
}

/**
 * DELETE /api/admin/microsites/[id]
 * Deactivate a microsite (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { id } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const microsite = mockMicrosites[id]
        if (!microsite) {
          return notFound("Microsite")
        }

        return successResponse({ id, isActive: false }, "Microsite deactivated successfully")
      }

      // Check if microsite exists
      const [existing] = await db!
        .select()
        .from(microsites)
        .where(eq(microsites.id, id))
        .limit(1)

      if (!existing) {
        return notFound("Microsite")
      }

      // Soft delete - just deactivate
      const [updated] = await db!
        .update(microsites)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(microsites.id, id))
        .returning()

      return successResponse(updated, "Microsite deactivated successfully")
    } catch (error: any) {
      console.error("[Admin Microsites] DELETE Error:", error)
      return serverError(error.message || "Failed to deactivate microsite")
    }
  })
}
