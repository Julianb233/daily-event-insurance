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
  validationError,
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
  { params }: { params: Promise<{ policyId: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { policyId } = await params

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

      // Parse JSON fields if they exist (with error handling)
      let eventDetails = null
      let metadata = null

      if (policy.eventDetails) {
        try {
          eventDetails = JSON.parse(policy.eventDetails)
        } catch (e) {
          console.error(`[Policy ${policy.id}] Invalid eventDetails JSON:`, e)
          eventDetails = null
        }
      }

      if (policy.metadata) {
        try {
          metadata = JSON.parse(policy.metadata)
        } catch (e) {
          console.error(`[Policy ${policy.id}] Invalid metadata JSON:`, e)
          metadata = null
        }
      }

      const enrichedPolicy = {
        ...policy,
        eventDetails,
        metadata,
      }

      return successResponse({ policy: enrichedPolicy })
    } catch (error: any) {
      console.error("[Partner Policies] GET [policyId] Error:", error)
      // SECURITY: Don't expose internal error details
      return serverError("Failed to fetch policy details")
    }
  })
}

/**
 * PATCH /api/partner/policies/[policyId]
 * Update policy (cancel, issue certificate, etc.)
 *
 * Body:
 * - action: "cancel" | "issue-certificate"
 * - reason?: string (for cancellation)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { policyId } = await params
      const body = await request.json()

      const { action, reason } = body

      // Validate action
      const validActions = ["cancel", "issue-certificate"]
      if (!action || !validActions.includes(action)) {
        return validationError("Invalid action", {
          action: [`Must be one of: ${validActions.join(", ")}`]
        })
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Would update policy:", policyId, "action:", action)

        if (action === "cancel") {
          return successResponse(
            {
              policy: {
                id: policyId,
                status: "cancelled",
                cancelled_at: new Date(),
                cancellation_reason: reason || "Requested by partner",
              },
              message: "Policy cancelled successfully",
            },
            "Policy cancelled"
          )
        }

        if (action === "issue-certificate") {
          return successResponse(
            {
              policy: {
                id: policyId,
                certificate_issued: true,
                certificate_url: `https://dailyeventinsurance.com/certificates/${policyId}.pdf`,
              },
              message: "Certificate issued successfully",
            },
            "Certificate issued"
          )
        }

        return successResponse({ message: `Policy ${action} successful` })
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

      // Get policy
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
        return notFoundError("Policy")
      }

      const policy = policyResult[0]

      // Handle cancel action
      if (action === "cancel") {
        if (policy.status === "cancelled") {
          return validationError("Invalid operation", {
            status: ["Policy is already cancelled"]
          })
        }

        if (policy.status === "expired") {
          return validationError("Invalid operation", {
            status: ["Cannot cancel expired policies"]
          })
        }

        const [updatedPolicy] = await db!
          .update(policies)
          .set({
            status: "cancelled",
            cancelledAt: new Date(),
            cancellationReason: reason || "Requested by partner",
            updatedAt: new Date(),
          })
          .where(eq(policies.id, policyId))
          .returning()

        return successResponse(
          { policy: updatedPolicy },
          "Policy cancelled successfully"
        )
      }

      // Handle issue-certificate action
      if (action === "issue-certificate") {
        if (policy.status !== "active") {
          return validationError("Invalid operation", {
            status: ["Certificates can only be issued for active policies"]
          })
        }

        if (policy.certificateIssued) {
          return validationError("Invalid operation", {
            status: ["Certificate already issued for this policy"]
          })
        }

        // Generate certificate URL (in production, this would trigger actual PDF generation)
        const certificateUrl = `https://dailyeventinsurance.com/certificates/${policyId}.pdf`

        const [updatedPolicy] = await db!
          .update(policies)
          .set({
            certificateIssued: true,
            policyDocument: certificateUrl,
            updatedAt: new Date(),
          })
          .where(eq(policies.id, policyId))
          .returning()

        return successResponse(
          {
            policy: updatedPolicy,
            certificate_url: certificateUrl,
          },
          "Certificate issued successfully"
        )
      }

      return serverError("Invalid action")
    } catch (error: any) {
      console.error("[Partner Policies] PATCH [policyId] Error:", error)
      // SECURITY: Don't expose internal error details
      return serverError("Failed to update policy")
    }
  })
}
