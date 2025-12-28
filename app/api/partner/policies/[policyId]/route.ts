import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, policies } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  forbiddenError,
} from "@/lib/api-responses"

/**
 * GET /api/partner/policies/[policyId]
 * Get detailed information about a specific policy
 *
 * Params:
 * - policyId: string (UUID)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { policyId: string } }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { policyId } = params

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(policyId)) {
        return notFoundError("Policy")
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock policy details for:", policyId)
        const mockPolicy = {
          id: policyId,
          policy_number: "POL-20250101-00001",
          event_type: "Gym Session",
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          participants: 50,
          coverage_type: "liability",
          premium: 249.50,
          commission: 124.75,
          status: "active",
          effective_date: new Date(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          customer_email: "john@example.com",
          customer_name: "John Doe",
          customer_phone: "+15551234567",
          event_details: JSON.stringify({
            location: "Downtown Gym",
            duration: 2,
            description: "Group fitness class",
          }),
          policy_document: "https://example.com/policies/POL-20250101-00001.pdf",
          certificate_issued: true,
          metadata: JSON.stringify({
            source: "api",
            referrer: "partner_portal",
          }),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updated_at: new Date(),
        }

        return successResponse({ policy: mockPolicy })
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Get policy and verify ownership
      const policyResult = await db!
        .select()
        .from(policies)
        .where(
          and(
            eq(policies.id, policyId),
            eq(policies.partnerId, partner.id)
          )
        )
        .limit(1)

      if (policyResult.length === 0) {
        // Check if policy exists but belongs to different partner
        const anyPolicyResult = await db!
          .select({ id: policies.id })
          .from(policies)
          .where(eq(policies.id, policyId))
          .limit(1)

        if (anyPolicyResult.length > 0) {
          return forbiddenError("You don't have access to this policy")
        }

        return notFoundError("Policy")
      }

      const policy = policyResult[0]

      // Parse JSON fields if they exist
      const enrichedPolicy = {
        ...policy,
        eventDetails: policy.eventDetails ? JSON.parse(policy.eventDetails) : null,
        metadata: policy.metadata ? JSON.parse(policy.metadata) : null,
      }

      return successResponse({ policy: enrichedPolicy })
    } catch (error: any) {
      console.error("[Partner Policies] GET [policyId] Error:", error)
      return serverError(error.message || "Failed to fetch policy details")
    }
  })
}
