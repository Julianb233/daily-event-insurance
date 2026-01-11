import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, microsites, micrositeChangeRequests } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { requirePartner, withAuth } from "@/lib/api-auth"
import {
  sendChangeRequestSubmittedEmail,
  sendAdminNewRequestNotification,
} from "@/lib/email/change-request-notifications"

// Helper to generate request number
function generateRequestNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CR-${dateStr}-${random}`
}

// GET /api/partner/change-requests - List partner's change requests
// SECURITY: Requires partner authentication
export async function GET() {
  return withAuth(async () => {
    const { userId } = await requirePartner()

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

      // Get all change requests for this partner
      const requests = await db
        .select()
        .from(micrositeChangeRequests)
        .where(eq(micrositeChangeRequests.partnerId, partner.id))
        .orderBy(desc(micrositeChangeRequests.submittedAt))

      return NextResponse.json({
        success: true,
        requests: requests.map(r => ({
          id: r.id,
          requestNumber: r.requestNumber,
          requestType: r.requestType,
          status: r.status,
          partnerNotes: r.partnerNotes,
          currentBranding: r.currentBranding,
          requestedBranding: r.requestedBranding,
          currentContent: r.currentContent,
          requestedContent: r.requestedContent,
          reviewNotes: r.reviewNotes,
          rejectionReason: r.rejectionReason,
          submittedAt: r.submittedAt,
          reviewedAt: r.reviewedAt,
          completedAt: r.completedAt,
        })),
      })
    } catch (error) {
      console.error("Error fetching change requests:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch change requests" },
        { status: 500 }
      )
    }
  })
}

// POST /api/partner/change-requests - Create a new change request
// SECURITY: Requires partner authentication
export async function POST(request: Request) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    try {
      const body = await request.json()
      const {
        requestType,
        requestedBranding,
        requestedContent,
        partnerNotes,
        source = "dashboard",
      } = body

      if (!requestType || !["branding", "content", "both"].includes(requestType)) {
        return NextResponse.json(
          { success: false, error: "Invalid request type" },
          { status: 400 }
        )
      }

      // Validate we have changes for the request type
      if (requestType === "branding" && !requestedBranding) {
        return NextResponse.json(
          { success: false, error: "Branding changes required for branding request" },
          { status: 400 }
        )
      }

      if (requestType === "content" && !requestedContent) {
        return NextResponse.json(
          { success: false, error: "Content changes required for content request" },
          { status: 400 }
        )
      }

      if (requestType === "both" && !requestedBranding && !requestedContent) {
        return NextResponse.json(
          { success: false, error: "Changes required for request" },
          { status: 400 }
        )
      }

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

      // Get partner's microsite
      const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.partnerId, partner.id))
        .limit(1)

      // Snapshot current values
      const currentBranding = microsite ? {
        siteName: microsite.siteName,
        primaryColor: microsite.primaryColor,
        logoUrl: microsite.logoUrl,
        heroImageUrl: microsite.heroImageUrl,
      } : null

      const now = new Date()

      // Create the change request
      const [newRequest] = await db
        .insert(micrositeChangeRequests)
        .values({
          partnerId: partner.id,
          micrositeId: microsite?.id || null,
          requestNumber: generateRequestNumber(),
          requestType,
          currentBranding,
          currentContent: null, // Add current content snapshot if you have content fields
          requestedBranding: requestedBranding || null,
          requestedContent: requestedContent || null,
          partnerNotes: partnerNotes || null,
          source,
          status: "pending",
          submittedAt: now,
          createdAt: now,
          updatedAt: now,
        })
        .returning()

      // Send email notifications (non-blocking)
      const notificationData = {
        partnerId: partner.id,
        partnerName: partner.businessName || partner.contactName || "Partner",
        partnerEmail: partner.contactEmail,
        requestId: newRequest.id,
        requestNumber: newRequest.requestNumber,
        requestType: newRequest.requestType as "branding" | "content" | "both",
        requestedBranding: requestedBranding || null,
        requestedContent: requestedContent || null,
        partnerNotes: partnerNotes || null,
        micrositeSubdomain: microsite?.subdomain || null,
      }

      // Send confirmation to partner
      sendChangeRequestSubmittedEmail(notificationData).catch((err) => {
        console.error("[Email] Failed to send submitted notification:", err)
      })

      // Notify admin(s) of new request
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
      if (adminEmail) {
        sendAdminNewRequestNotification(notificationData, adminEmail).catch((err) => {
          console.error("[Email] Failed to send admin notification:", err)
        })
      }

      return NextResponse.json({
        success: true,
        request: {
          id: newRequest.id,
          requestNumber: newRequest.requestNumber,
          requestType: newRequest.requestType,
          status: newRequest.status,
          submittedAt: newRequest.submittedAt,
        },
        message: "Change request submitted successfully",
      })
    } catch (error) {
      console.error("Error creating change request:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create change request" },
        { status: 500 }
      )
    }
  })
}
