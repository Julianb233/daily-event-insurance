import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, microsites, micrositeChangeRequests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import {
  sendChangeRequestApprovedEmail,
  sendChangeRequestRejectedEmail,
  sendChangeRequestCompletedEmail,
  type ChangeRequestNotificationData,
} from "@/lib/email/change-request-notifications"

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/admin/change-requests/[id] - Get a single change request with full details
// SECURITY: Requires admin authentication
export async function GET(request: Request, context: RouteContext) {
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

      const [changeRequest] = await db
        .select({
          id: micrositeChangeRequests.id,
          requestNumber: micrositeChangeRequests.requestNumber,
          requestType: micrositeChangeRequests.requestType,
          status: micrositeChangeRequests.status,
          partnerNotes: micrositeChangeRequests.partnerNotes,
          source: micrositeChangeRequests.source,
          currentBranding: micrositeChangeRequests.currentBranding,
          requestedBranding: micrositeChangeRequests.requestedBranding,
          currentContent: micrositeChangeRequests.currentContent,
          requestedContent: micrositeChangeRequests.requestedContent,
          reviewedBy: micrositeChangeRequests.reviewedBy,
          reviewNotes: micrositeChangeRequests.reviewNotes,
          rejectionReason: micrositeChangeRequests.rejectionReason,
          submittedAt: micrositeChangeRequests.submittedAt,
          reviewedAt: micrositeChangeRequests.reviewedAt,
          completedAt: micrositeChangeRequests.completedAt,
          partnerId: micrositeChangeRequests.partnerId,
          micrositeId: micrositeChangeRequests.micrositeId,
          partnerName: partners.businessName,
          partnerContact: partners.contactName,
          partnerEmail: partners.contactEmail,
          micrositeSubdomain: microsites.subdomain,
          micrositeSiteName: microsites.siteName,
          micrositePrimaryColor: microsites.primaryColor,
          micrositeLogoUrl: microsites.logoUrl,
          micrositeHeroImageUrl: microsites.heroImageUrl,
        })
        .from(micrositeChangeRequests)
        .leftJoin(partners, eq(micrositeChangeRequests.partnerId, partners.id))
        .leftJoin(microsites, eq(micrositeChangeRequests.micrositeId, microsites.id))
        .where(eq(micrositeChangeRequests.id, id))
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

// PATCH /api/admin/change-requests/[id] - Update status (approve/reject/complete)
// SECURITY: Requires admin authentication
export async function PATCH(request: Request, context: RouteContext) {
  return withAuth(async () => {
    const { userId } = await requireAdmin()
    const { id } = await context.params

    try {
      const body = await request.json()
      const { action, reviewNotes, rejectionReason } = body

      if (!action || !["approve", "reject", "start_review", "complete"].includes(action)) {
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
      }

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

      // Validate state transitions
      const validTransitions: Record<string, string[]> = {
        pending: ["start_review", "approve", "reject"],
        in_review: ["approve", "reject"],
        approved: ["complete"],
        rejected: [], // No transitions allowed
        completed: [], // No transitions allowed
      }

      const currentStatus = changeRequest.status || "pending"
      if (!validTransitions[currentStatus]?.includes(action)) {
        return NextResponse.json(
          { success: false, error: `Cannot ${action} a request with status ${currentStatus}` },
          { status: 400 }
        )
      }

      // Determine new status based on action
      let newStatus: string
      switch (action) {
        case "start_review":
          newStatus = "in_review"
          break
        case "approve":
          newStatus = "approved"
          break
        case "reject":
          newStatus = "rejected"
          break
        case "complete":
          newStatus = "completed"
          break
        default:
          newStatus = currentStatus
      }

      const now = new Date()
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: now,
      }

      if (action === "approve" || action === "reject" || action === "start_review") {
        updateData.reviewedBy = userId
        updateData.reviewedAt = now
      }

      if (reviewNotes) {
        updateData.reviewNotes = reviewNotes
      }

      if (action === "reject" && rejectionReason) {
        updateData.rejectionReason = rejectionReason
      }

      if (action === "complete") {
        updateData.completedAt = now
      }

      // Update the request
      const [updated] = await db
        .update(micrositeChangeRequests)
        .set(updateData)
        .where(eq(micrositeChangeRequests.id, id))
        .returning()

      // Send email notification for approve/reject/complete actions
      if (action === "approve" || action === "reject" || action === "complete") {
        try {
          // Get partner and microsite details for the email
          const [partner] = await db
            .select({
              businessName: partners.businessName,
              contactName: partners.contactName,
              contactEmail: partners.contactEmail,
            })
            .from(partners)
            .where(eq(partners.id, changeRequest.partnerId))
            .limit(1)

          // Get microsite subdomain if available
          let micrositeSubdomain: string | null = null
          if (changeRequest.micrositeId) {
            const [microsite] = await db
              .select({ subdomain: microsites.subdomain })
              .from(microsites)
              .where(eq(microsites.id, changeRequest.micrositeId))
              .limit(1)
            micrositeSubdomain = microsite?.subdomain || null
          }

          if (partner?.contactEmail) {
            const notificationData: ChangeRequestNotificationData = {
              partnerId: changeRequest.partnerId,
              partnerName: partner.businessName || partner.contactName || "Partner",
              partnerEmail: partner.contactEmail,
              requestId: id,
              requestNumber: changeRequest.requestNumber || id.slice(0, 8).toUpperCase(),
              requestType: (changeRequest.requestType as "branding" | "content" | "both") || "both",
              requestedBranding: changeRequest.requestedBranding as Record<string, string> | null,
              requestedContent: changeRequest.requestedContent as Record<string, string> | null,
              reviewNotes: reviewNotes || null,
              rejectionReason: rejectionReason || null,
              micrositeSubdomain,
            }

            // Send appropriate email based on action
            let emailResult
            if (action === "approve") {
              emailResult = await sendChangeRequestApprovedEmail(notificationData)
            } else if (action === "reject") {
              emailResult = await sendChangeRequestRejectedEmail(notificationData)
            } else if (action === "complete") {
              emailResult = await sendChangeRequestCompletedEmail(notificationData)
            }

            if (emailResult && !emailResult.success) {
              console.error("Failed to send change request notification email:", emailResult.error)
            } else if (emailResult) {
              console.log("Change request notification email sent:", emailResult.messageId)
            }
          }
        } catch (emailError) {
          // Log but don't fail the request if email fails
          console.error("Error sending change request notification:", emailError)
        }
      }

      return NextResponse.json({
        success: true,
        request: updated,
        message: `Change request ${action === "start_review" ? "marked for review" : action + "d"} successfully`,
        emailSent: action === "approve" || action === "reject",
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
