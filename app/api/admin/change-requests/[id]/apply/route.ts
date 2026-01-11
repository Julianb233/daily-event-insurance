import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { microsites, micrositeChangeRequests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, withAuth } from "@/lib/api-auth"

type RouteContext = { params: Promise<{ id: string }> }

// POST /api/admin/change-requests/[id]/apply - Apply approved changes to microsite
// SECURITY: Requires admin authentication
export async function POST(request: Request, context: RouteContext) {
  return withAuth(async () => {
    await requireAdmin()
    const { id } = await context.params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get the change request
      const [changeRequest] = await db
        .select()
        .from(micrositeChangeRequests)
        .where(eq(micrositeChangeRequests.id, id))
        .limit(1)

      if (!changeRequest) {
        return NextResponse.json(
          { success: false, error: "Change request not found" },
          { status: 404 }
        )
      }

      // Only apply approved requests
      if (changeRequest.status !== "approved") {
        return NextResponse.json(
          { success: false, error: "Can only apply approved change requests" },
          { status: 400 }
        )
      }

      if (!changeRequest.micrositeId) {
        return NextResponse.json(
          { success: false, error: "No microsite associated with this request" },
          { status: 400 }
        )
      }

      // Build update object from requested changes
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      // Apply branding changes
      if (changeRequest.requestedBranding) {
        const branding = changeRequest.requestedBranding as Record<string, unknown>
        if (branding.siteName !== undefined) updateData.siteName = branding.siteName
        if (branding.primaryColor !== undefined) updateData.primaryColor = branding.primaryColor
        if (branding.logoUrl !== undefined) updateData.logoUrl = branding.logoUrl
        if (branding.heroImageUrl !== undefined) updateData.heroImageUrl = branding.heroImageUrl
      }

      // Apply content changes (if you have content fields on microsites)
      // if (changeRequest.requestedContent) {
      //   const content = changeRequest.requestedContent as Record<string, unknown>
      //   // Apply content fields here
      // }

      // Update the microsite
      const [updatedMicrosite] = await db
        .update(microsites)
        .set(updateData)
        .where(eq(microsites.id, changeRequest.micrositeId))
        .returning()

      // Mark the request as completed
      await db
        .update(micrositeChangeRequests)
        .set({
          status: "completed",
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(micrositeChangeRequests.id, id))

      return NextResponse.json({
        success: true,
        message: "Changes applied successfully",
        microsite: {
          id: updatedMicrosite.id,
          siteName: updatedMicrosite.siteName,
          primaryColor: updatedMicrosite.primaryColor,
          logoUrl: updatedMicrosite.logoUrl,
          heroImageUrl: updatedMicrosite.heroImageUrl,
        },
      })
    } catch (error) {
      console.error("Error applying change request:", error)
      return NextResponse.json(
        { success: false, error: "Failed to apply changes" },
        { status: 500 }
      )
    }
  })
}
