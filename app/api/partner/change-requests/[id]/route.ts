import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, micrositeChangeRequests } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { requirePartner, withAuth } from "@/lib/api-auth"

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/partner/change-requests/[id] - Get a single change request
// SECURITY: Requires partner authentication and ownership verification
export async function GET(request: Request, context: RouteContext) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { id } = await context.params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get partner record
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // Get the change request, verifying ownership
      const [changeRequest] = await db
        .select()
        .from(micrositeChangeRequests)
        .where(
          and(
            eq(micrositeChangeRequests.id, id),
            eq(micrositeChangeRequests.partnerId, partner.id)
          )
        )
        .limit(1)

      if (!changeRequest) {
        return NextResponse.json(
          { success: false, error: "Change request not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        request: changeRequest,
      })
    } catch (error) {
      console.error("Error fetching change request:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch change request" },
        { status: 500 }
      )
    }
  })
}

// PATCH /api/partner/change-requests/[id] - Update a change request (only if pending)
// SECURITY: Requires partner authentication and ownership verification
export async function PATCH(request: Request, context: RouteContext) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { id } = await context.params

    try {
      const body = await request.json()
      const { requestedBranding, requestedContent, partnerNotes } = body

      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get partner record
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // Get the change request, verifying ownership
      const [changeRequest] = await db
        .select()
        .from(micrositeChangeRequests)
        .where(
          and(
            eq(micrositeChangeRequests.id, id),
            eq(micrositeChangeRequests.partnerId, partner.id)
          )
        )
        .limit(1)

      if (!changeRequest) {
        return NextResponse.json(
          { success: false, error: "Change request not found" },
          { status: 404 }
        )
      }

      // Only allow updates to pending requests
      if (changeRequest.status !== "pending") {
        return NextResponse.json(
          { success: false, error: "Cannot update a request that is already being reviewed" },
          { status: 400 }
        )
      }

      // Update the request
      const [updated] = await db
        .update(micrositeChangeRequests)
        .set({
          requestedBranding: requestedBranding !== undefined ? requestedBranding : changeRequest.requestedBranding,
          requestedContent: requestedContent !== undefined ? requestedContent : changeRequest.requestedContent,
          partnerNotes: partnerNotes !== undefined ? partnerNotes : changeRequest.partnerNotes,
          updatedAt: new Date(),
        })
        .where(eq(micrositeChangeRequests.id, id))
        .returning()

      return NextResponse.json({
        success: true,
        request: updated,
        message: "Change request updated successfully",
      })
    } catch (error) {
      console.error("Error updating change request:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update change request" },
        { status: 500 }
      )
    }
  })
}

// DELETE /api/partner/change-requests/[id] - Cancel a change request (only if pending)
// SECURITY: Requires partner authentication and ownership verification
export async function DELETE(request: Request, context: RouteContext) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { id } = await context.params

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get partner record
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // Get the change request, verifying ownership
      const [changeRequest] = await db
        .select()
        .from(micrositeChangeRequests)
        .where(
          and(
            eq(micrositeChangeRequests.id, id),
            eq(micrositeChangeRequests.partnerId, partner.id)
          )
        )
        .limit(1)

      if (!changeRequest) {
        return NextResponse.json(
          { success: false, error: "Change request not found" },
          { status: 404 }
        )
      }

      // Only allow cancellation of pending requests
      if (changeRequest.status !== "pending") {
        return NextResponse.json(
          { success: false, error: "Cannot cancel a request that is already being reviewed" },
          { status: 400 }
        )
      }

      // Delete the request
      await db
        .delete(micrositeChangeRequests)
        .where(eq(micrositeChangeRequests.id, id))

      return NextResponse.json({
        success: true,
        message: "Change request cancelled successfully",
      })
    } catch (error) {
      console.error("Error cancelling change request:", error)
      return NextResponse.json(
        { success: false, error: "Failed to cancel change request" },
        { status: 500 }
      )
    }
  })
}
