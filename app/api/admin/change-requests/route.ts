import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, microsites, micrositeChangeRequests } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { requireAdmin, withAuth } from "@/lib/api-auth"

// GET /api/admin/change-requests - List all change requests with filtering
// SECURITY: Requires admin authentication
export async function GET(request: Request) {
  return withAuth(async () => {
    await requireAdmin()

    try {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get("status")
      const limit = parseInt(searchParams.get("limit") || "50")
      const offset = parseInt(searchParams.get("offset") || "0")

      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Build query with optional status filter
      let query = db
        .select({
          id: micrositeChangeRequests.id,
          requestNumber: micrositeChangeRequests.requestNumber,
          requestType: micrositeChangeRequests.requestType,
          status: micrositeChangeRequests.status,
          partnerNotes: micrositeChangeRequests.partnerNotes,
          currentBranding: micrositeChangeRequests.currentBranding,
          requestedBranding: micrositeChangeRequests.requestedBranding,
          currentContent: micrositeChangeRequests.currentContent,
          requestedContent: micrositeChangeRequests.requestedContent,
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
        })
        .from(micrositeChangeRequests)
        .leftJoin(partners, eq(micrositeChangeRequests.partnerId, partners.id))
        .leftJoin(microsites, eq(micrositeChangeRequests.micrositeId, microsites.id))
        .orderBy(desc(micrositeChangeRequests.submittedAt))
        .limit(limit)
        .offset(offset)

      if (status) {
        query = query.where(eq(micrositeChangeRequests.status, status)) as typeof query
      }

      const requests = await query

      // Get counts by status
      const statusCounts = await db
        .select({
          status: micrositeChangeRequests.status,
          count: sql<number>`count(*)::int`,
        })
        .from(micrositeChangeRequests)
        .groupBy(micrositeChangeRequests.status)

      const counts = {
        pending: 0,
        in_review: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        total: 0,
      }

      for (const row of statusCounts) {
        if (row.status && row.status in counts) {
          counts[row.status as keyof typeof counts] = row.count
        }
        counts.total += row.count
      }

      return NextResponse.json({
        success: true,
        requests,
        counts,
        pagination: {
          limit,
          offset,
          hasMore: requests.length === limit,
        },
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
