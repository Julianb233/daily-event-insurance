import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import {
  db,
  isDbConfigured,
  partners,
  policies,
  quotes,
  partnerTierOverrides,
  commissionTiers,
  commissionPayouts,
  partnerDocuments,
} from "@/lib/db"
import { eq, sql, desc, and, gte } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// Validation schema for partner updates (PUT)
const updatePartnerSchema = z.object({
  status: z.enum(["pending", "documents_sent", "documents_pending", "under_review", "active", "suspended"]).optional(),
  businessName: z.string().min(1).max(200).optional(),
  contactName: z.string().min(1).max(100).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional().nullable(),
  integrationType: z.enum(["widget", "api", "manual"]).optional(),
  primaryColor: z.string().max(20).optional(),
})

// Mock data for dev mode
const mockPartner = {
  id: "p1",
  businessName: "Adventure Sports Inc",
  businessType: "adventure",
  contactName: "John Smith",
  contactEmail: "john@adventuresports.com",
  contactPhone: "(555) 123-4567",
  status: "active",
  integrationType: "widget",
  primaryColor: "#14B8A6",
  logoUrl: null,
  documentsStatus: "completed",
  agreementSigned: true,
  w9Signed: true,
  directDepositSigned: true,
  createdAt: "2024-03-01T00:00:00Z",
  approvedAt: "2024-03-15T00:00:00Z",
}

const mockCurrentTier = {
  tierName: "Gold",
  commissionRate: 0.5,
  isOverride: false,
  overrideReason: null,
}

const mockStats = {
  totalPolicies: 512,
  activePolicies: 487,
  totalRevenue: 45200,
  totalCommission: 22600,
  monthlyVolume: 3200,
}

const mockRecentPolicies = [
  { id: "pol-1", policyNumber: "POL-20241220-00001", eventType: "climbing", eventDate: "2024-12-25", premium: 89.99, status: "active", customerName: "Alice Johnson", createdAt: "2024-12-20T10:00:00Z" },
  { id: "pol-2", policyNumber: "POL-20241219-00002", eventType: "gym", eventDate: "2024-12-24", premium: 49.99, status: "active", customerName: "Bob Smith", createdAt: "2024-12-19T14:30:00Z" },
]

const mockRecentQuotes = [
  { id: "qt-1", quoteNumber: "QT-20241222-00001", eventType: "adventure", eventDate: "2025-01-15", premium: 129.99, status: "pending", customerName: "Charlie Brown", createdAt: "2024-12-22T09:00:00Z" },
  { id: "qt-2", quoteNumber: "QT-20241221-00002", eventType: "rental", eventDate: "2025-01-10", premium: 79.99, status: "accepted", customerName: "Diana Ross", createdAt: "2024-12-21T16:45:00Z" },
]

const mockEarningsHistory = [
  { month: "2024-12", amount: 2850 },
  { month: "2024-11", amount: 2650 },
  { month: "2024-10", amount: 2400 },
  { month: "2024-09", amount: 2200 },
  { month: "2024-08", amount: 1950 },
  { month: "2024-07", amount: 1800 },
  { month: "2024-06", amount: 1600 },
  { month: "2024-05", amount: 1450 },
  { month: "2024-04", amount: 1200 },
  { month: "2024-03", amount: 950 },
  { month: "2024-02", amount: 750 },
  { month: "2024-01", amount: 500 },
]

const mockDocuments = [
  { id: "doc-1", documentType: "partner_agreement", status: "signed", sentAt: "2024-03-01T00:00:00Z", signedAt: "2024-03-02T10:00:00Z" },
  { id: "doc-2", documentType: "w9", status: "signed", sentAt: "2024-03-01T00:00:00Z", signedAt: "2024-03-02T11:00:00Z" },
  { id: "doc-3", documentType: "direct_deposit", status: "signed", sentAt: "2024-03-01T00:00:00Z", signedAt: "2024-03-02T12:00:00Z" },
]

/**
 * GET /api/admin/partners/[id]
 * Returns comprehensive partner details for admin view
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          partner: { ...mockPartner, id },
          currentTier: mockCurrentTier,
          stats: mockStats,
          recentPolicies: mockRecentPolicies,
          recentQuotes: mockRecentQuotes,
          earningsHistory: mockEarningsHistory,
          documents: mockDocuments,
        })
      }

      // Get partner base data
      const [partner] = await db!
        .select({
          id: partners.id,
          businessName: partners.businessName,
          businessType: partners.businessType,
          contactName: partners.contactName,
          contactEmail: partners.contactEmail,
          contactPhone: partners.contactPhone,
          status: partners.status,
          integrationType: partners.integrationType,
          primaryColor: partners.primaryColor,
          logoUrl: partners.logoUrl,
          documentsStatus: partners.documentsStatus,
          agreementSigned: partners.agreementSigned,
          w9Signed: partners.w9Signed,
          directDepositSigned: partners.directDepositSigned,
          createdAt: partners.createdAt,
          approvedAt: partners.approvedAt,
        })
        .from(partners)
        .where(eq(partners.id, id))
        .limit(1)

      if (!partner) {
        return notFoundError("Partner")
      }

      // Get tier info (check for override first, then calculate from volume)
      const [tierOverride] = await db!
        .select({
          tierName: commissionTiers.tierName,
          commissionRate: commissionTiers.commissionRate,
          reason: partnerTierOverrides.reason,
        })
        .from(partnerTierOverrides)
        .innerJoin(commissionTiers, eq(partnerTierOverrides.tierId, commissionTiers.id))
        .where(eq(partnerTierOverrides.partnerId, id))
        .limit(1)

      let currentTier: {
        tierName: string
        commissionRate: number
        isOverride: boolean
        overrideReason: string | null
      }

      if (tierOverride) {
        currentTier = {
          tierName: tierOverride.tierName,
          commissionRate: Number(tierOverride.commissionRate),
          isOverride: true,
          overrideReason: tierOverride.reason,
        }
      } else {
        // Calculate tier from monthly volume
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const [volumeResult] = await db!
          .select({
            volume: sql<number>`COALESCE(SUM(participants), 0)`,
          })
          .from(policies)
          .where(
            and(
              eq(policies.partnerId, id),
              gte(policies.createdAt, thirtyDaysAgo)
            )
          )

        const monthlyVolume = Number(volumeResult?.volume || 0)

        // Get appropriate tier based on volume
        const [tier] = await db!
          .select({
            tierName: commissionTiers.tierName,
            commissionRate: commissionTiers.commissionRate,
          })
          .from(commissionTiers)
          .where(
            and(
              eq(commissionTiers.isActive, true),
              sql`${commissionTiers.minVolume} <= ${monthlyVolume}`,
              sql`(${commissionTiers.maxVolume} IS NULL OR ${commissionTiers.maxVolume} >= ${monthlyVolume})`
            )
          )
          .orderBy(desc(commissionTiers.minVolume))
          .limit(1)

        currentTier = {
          tierName: tier?.tierName || "Bronze",
          commissionRate: Number(tier?.commissionRate || 0.35),
          isOverride: false,
          overrideReason: null,
        }
      }

      // Get stats
      const [statsResult] = await db!
        .select({
          totalPolicies: sql<number>`COALESCE(COUNT(*), 0)`,
          activePolicies: sql<number>`COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0)`,
          totalRevenue: sql<number>`COALESCE(SUM(premium::numeric), 0)`,
          totalCommission: sql<number>`COALESCE(SUM(commission::numeric), 0)`,
        })
        .from(policies)
        .where(eq(policies.partnerId, id))

      // Get monthly volume (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const [monthlyResult] = await db!
        .select({
          monthlyVolume: sql<number>`COALESCE(SUM(participants), 0)`,
        })
        .from(policies)
        .where(
          and(
            eq(policies.partnerId, id),
            gte(policies.createdAt, thirtyDaysAgo)
          )
        )

      const stats = {
        totalPolicies: Number(statsResult?.totalPolicies || 0),
        activePolicies: Number(statsResult?.activePolicies || 0),
        totalRevenue: Number(statsResult?.totalRevenue || 0),
        totalCommission: Number(statsResult?.totalCommission || 0),
        monthlyVolume: Number(monthlyResult?.monthlyVolume || 0),
      }

      // Get recent policies (last 10)
      const recentPolicies = await db!
        .select({
          id: policies.id,
          policyNumber: policies.policyNumber,
          eventType: policies.eventType,
          eventDate: policies.eventDate,
          premium: policies.premium,
          commission: policies.commission,
          status: policies.status,
          customerName: policies.customerName,
          customerEmail: policies.customerEmail,
          participants: policies.participants,
          createdAt: policies.createdAt,
        })
        .from(policies)
        .where(eq(policies.partnerId, id))
        .orderBy(desc(policies.createdAt))
        .limit(10)

      // Get recent quotes (last 10)
      const recentQuotes = await db!
        .select({
          id: quotes.id,
          quoteNumber: quotes.quoteNumber,
          eventType: quotes.eventType,
          eventDate: quotes.eventDate,
          premium: quotes.premium,
          commission: quotes.commission,
          status: quotes.status,
          customerName: quotes.customerName,
          customerEmail: quotes.customerEmail,
          participants: quotes.participants,
          createdAt: quotes.createdAt,
          expiresAt: quotes.expiresAt,
        })
        .from(quotes)
        .where(eq(quotes.partnerId, id))
        .orderBy(desc(quotes.createdAt))
        .limit(10)

      // Get earnings history (last 12 months)
      const earningsHistory = await db!
        .select({
          month: commissionPayouts.yearMonth,
          amount: commissionPayouts.commissionAmount,
        })
        .from(commissionPayouts)
        .where(eq(commissionPayouts.partnerId, id))
        .orderBy(desc(commissionPayouts.yearMonth))
        .limit(12)

      // Get partner documents
      const documents = await db!
        .select({
          id: partnerDocuments.id,
          documentType: partnerDocuments.documentType,
          status: partnerDocuments.status,
          sentAt: partnerDocuments.sentAt,
          viewedAt: partnerDocuments.viewedAt,
          signedAt: partnerDocuments.signedAt,
          createdAt: partnerDocuments.createdAt,
        })
        .from(partnerDocuments)
        .where(eq(partnerDocuments.partnerId, id))
        .orderBy(desc(partnerDocuments.createdAt))

      return successResponse({
        partner,
        currentTier,
        stats,
        recentPolicies,
        recentQuotes,
        earningsHistory: earningsHistory.map((e) => ({
          month: e.month,
          amount: Number(e.amount),
        })),
        documents,
      })
    } catch (error: any) {
      console.error("[Admin Partner Detail] GET Error:", error)
      return serverError(error.message || "Failed to fetch partner details")
    }
  })
}

/**
 * PUT /api/admin/partners/[id]
 * Update partner details
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      const { userId } = await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = updatePartnerSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid partner data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          ...mockPartner,
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        }, "Partner updated")
      }

      // Check partner exists
      const [existing] = await db!
        .select({ id: partners.id })
        .from(partners)
        .where(eq(partners.id, id))
        .limit(1)

      if (!existing) {
        return notFoundError("Partner")
      }

      // Build update object
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      if (data.status !== undefined) {
        updateData.status = data.status
        if (data.status === "active") {
          updateData.approvedAt = new Date()
          updateData.approvedBy = userId
        }
      }
      if (data.businessName !== undefined) updateData.businessName = data.businessName
      if (data.contactName !== undefined) updateData.contactName = data.contactName
      if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail
      if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone
      if (data.integrationType !== undefined) updateData.integrationType = data.integrationType
      if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor

      const [updated] = await db!
        .update(partners)
        .set(updateData)
        .where(eq(partners.id, id))
        .returning()

      return successResponse(updated, "Partner updated")
    } catch (error: any) {
      console.error("[Admin Partner Detail] PUT Error:", error)
      return serverError(error.message || "Failed to update partner")
    }
  })
}

/**
 * PATCH /api/admin/partners/[id]
 * Partial update a partner (same as PUT for backwards compatibility)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return PUT(request, context)
}

/**
 * DELETE /api/admin/partners/[id]
 * Soft delete a partner (sets status to suspended)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        return successResponse({ id }, "Partner deleted")
      }

      const [deleted] = await db!
        .update(partners)
        .set({
          status: "suspended",
          updatedAt: new Date(),
        })
        .where(eq(partners.id, id))
        .returning({ id: partners.id })

      if (!deleted) {
        return notFoundError("Partner")
      }

      return successResponse({ id }, "Partner deleted")
    } catch (error: any) {
      console.error("[Admin Partner Detail] DELETE Error:", error)
      return serverError(error.message || "Failed to delete partner")
    }
  })
}
