import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partnerResources } from "@/lib/db"
import { eq, desc, asc } from "drizzle-orm"
import { RESOURCE_CATEGORIES, RESOURCE_TYPES, type PartnerResourceInput } from "@/lib/partner-resources-data"

/**
 * GET /api/admin/resources
 * Get all partner resources (admin view with full details)
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    // If db is not configured, return demo resources
    if (!isDbConfigured()) {
      const { ADMIN_DEMO_RESOURCES } = await import("@/lib/partner-resources-data")
      return NextResponse.json({
        success: true,
        resources: ADMIN_DEMO_RESOURCES,
        source: "demo",
      })
    }

    const resources = await db!
      .select()
      .from(partnerResources)
      .orderBy(asc(partnerResources.sortOrder), desc(partnerResources.createdAt))

    return NextResponse.json({
      success: true,
      resources,
      source: "database",
    })
  })
}

/**
 * POST /api/admin/resources
 * Create a new partner resource
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const body = await request.json()
    const { title, description, category, resourceType, fileUrl, thumbnailUrl, sortOrder } = body

    // Validation
    if (!title || !category || !resourceType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, category, resourceType" },
        { status: 400 }
      )
    }

    if (!RESOURCE_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${RESOURCE_CATEGORIES.join(", ")}` },
        { status: 400 }
      )
    }

    if (!RESOURCE_TYPES.includes(resourceType)) {
      return NextResponse.json(
        { success: false, error: `Invalid resourceType. Must be one of: ${RESOURCE_TYPES.join(", ")}` },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        resource: {
          id: `demo-${Date.now()}`,
          title,
          description,
          category,
          resourceType,
          fileUrl,
          thumbnailUrl,
          sortOrder: sortOrder || 0,
          createdAt: new Date().toISOString(),
        },
        message: "Resource created (demo mode)",
      })
    }

    const [newResource] = await db!
      .insert(partnerResources)
      .values({
        title,
        description,
        category,
        resourceType,
        fileUrl,
        thumbnailUrl,
        sortOrder: sortOrder || 0,
      })
      .returning()

    return NextResponse.json({
      success: true,
      resource: newResource,
      message: "Resource created successfully",
    })
  })
}

/**
 * PUT /api/admin/resources
 * Update an existing partner resource
 */
export async function PUT(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const body = await request.json()
    const { id, title, description, category, resourceType, fileUrl, thumbnailUrl, sortOrder } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      )
    }

    // Validation
    if (category && !RESOURCE_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${RESOURCE_CATEGORIES.join(", ")}` },
        { status: 400 }
      )
    }

    if (resourceType && !RESOURCE_TYPES.includes(resourceType)) {
      return NextResponse.json(
        { success: false, error: `Invalid resourceType. Must be one of: ${RESOURCE_TYPES.join(", ")}` },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        resource: {
          id,
          title,
          description,
          category,
          resourceType,
          fileUrl,
          thumbnailUrl,
          sortOrder,
          updatedAt: new Date().toISOString(),
        },
        message: "Resource updated (demo mode)",
      })
    }

    const [updatedResource] = await db!
      .update(partnerResources)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(resourceType && { resourceType }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(sortOrder !== undefined && { sortOrder }),
      })
      .where(eq(partnerResources.id, id))
      .returning()

    if (!updatedResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      resource: updatedResource,
      message: "Resource updated successfully",
    })
  })
}

/**
 * DELETE /api/admin/resources
 * Delete a partner resource
 */
export async function DELETE(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Resource deleted (demo mode)",
      })
    }

    const [deletedResource] = await db!
      .delete(partnerResources)
      .where(eq(partnerResources.id, id))
      .returning()

    if (!deletedResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
    })
  })
}
