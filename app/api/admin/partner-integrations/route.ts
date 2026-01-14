import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partnerIntegrations, partners } from "@/lib/db"
import { eq, sql, desc, count, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, badRequest } from "@/lib/api-responses"

// Mock data for development
const mockIntegrations = [
  {
    id: "int-1",
    partnerId: "p-1",
    integrationType: "widget",
    posSystem: null,
    status: "live",
    configuration: '{"theme":"light","position":"bottom-right"}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    testResult: "success",
    testErrors: null,
    wentLiveAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-1",
      businessName: "Peak Performance Gym",
      businessType: "gym",
      contactName: "John Smith",
      contactEmail: "john@peakgym.com",
      status: "active",
    },
  },
  {
    id: "int-2",
    partnerId: "p-2",
    integrationType: "api",
    posSystem: null,
    status: "live",
    configuration: '{"version":"v2","sandbox":false}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    testResult: "success",
    testErrors: null,
    wentLiveAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-2",
      businessName: "Adventure Sports Inc",
      businessType: "adventure",
      contactName: "Sarah Johnson",
      contactEmail: "sarah@adventuresports.com",
      status: "active",
    },
  },
  {
    id: "int-3",
    partnerId: "p-3",
    integrationType: "pos",
    posSystem: "mindbody",
    status: "failed",
    configuration: '{"clientId":"mb_123","location":"main"}',
    apiKeyGenerated: true,
    webhookConfigured: false,
    lastTestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    testResult: "error",
    testErrors: '["API authentication failed","Invalid client credentials"]',
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-3",
      businessName: "Zen Yoga Studio",
      businessType: "wellness",
      contactName: "Emily Chen",
      contactEmail: "emily@zenyoga.com",
      status: "active",
    },
  },
  {
    id: "int-4",
    partnerId: "p-4",
    integrationType: "pos",
    posSystem: "square",
    status: "testing",
    configuration: '{"locationId":"sq_456"}',
    apiKeyGenerated: true,
    webhookConfigured: true,
    lastTestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    testResult: "pending",
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    partner: {
      id: "p-4",
      businessName: "Summit Climbing Center",
      businessType: "climbing",
      contactName: "Mike Davis",
      contactEmail: "mike@summitclimbing.com",
      status: "active",
    },
  },
  {
    id: "int-5",
    partnerId: "p-5",
    integrationType: "widget",
    posSystem: null,
    status: "pending",
    configuration: null,
    apiKeyGenerated: false,
    webhookConfigured: false,
    lastTestedAt: null,
    testResult: null,
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-5",
      businessName: "Kayak Adventures",
      businessType: "rental",
      contactName: "Lisa Wang",
      contactEmail: "lisa@kayakadv.com",
      status: "pending",
    },
  },
  {
    id: "int-6",
    partnerId: "p-6",
    integrationType: "api",
    posSystem: null,
    status: "configured",
    configuration: '{"version":"v2","sandbox":true}',
    apiKeyGenerated: true,
    webhookConfigured: false,
    lastTestedAt: null,
    testResult: null,
    testErrors: null,
    wentLiveAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    partner: {
      id: "p-6",
      businessName: "Extreme Sports Co",
      businessType: "adventure",
      contactName: "Tom Wilson",
      contactEmail: "tom@extremesports.com",
      status: "active",
    },
  },
]

/**
 * GET /api/admin/partner-integrations
 * List all partner integrations with their status
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const status = searchParams.get("status") // pending, configured, testing, live, failed, all
      const type = searchParams.get("type") // widget, api, pos, all
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "50")
      const offset = (page - 1) * limit

      // Dev mode mock data
      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockIntegrations]

        // Apply filters
        if (status && status !== "all") {
          filtered = filtered.filter(i => i.status === status)
        }
        if (type && type !== "all") {
          filtered = filtered.filter(i => i.integrationType === type)
        }

        // Sort by status (failed first for attention) then by updatedAt
        const statusOrder: Record<string, number> = {
          failed: 0,
          pending: 1,
          configured: 2,
          testing: 3,
          live: 4,
        }
        filtered.sort((a, b) => {
          const statusDiff = (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5)
          if (statusDiff !== 0) return statusDiff
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })

        // Calculate stats
        const stats = {
          total: mockIntegrations.length,
          live: mockIntegrations.filter(i => i.status === "live").length,
          failed: mockIntegrations.filter(i => i.status === "failed").length,
          pending: mockIntegrations.filter(i => i.status === "pending").length,
          testing: mockIntegrations.filter(i => i.status === "testing").length,
          configured: mockIntegrations.filter(i => i.status === "configured").length,
          byType: {
            widget: mockIntegrations.filter(i => i.integrationType === "widget").length,
            api: mockIntegrations.filter(i => i.integrationType === "api").length,
            pos: mockIntegrations.filter(i => i.integrationType === "pos").length,
          },
        }

        return successResponse({
          data: filtered.slice(offset, offset + limit),
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit),
          },
          stats,
        })
      }

      // Build where conditions
      const conditions = []

      if (status && status !== "all") {
        conditions.push(eq(partnerIntegrations.status, status))
      }
      if (type && type !== "all") {
        conditions.push(eq(partnerIntegrations.integrationType, type))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get integrations with partner info
      const integrationsData = await db!
        .select({
          id: partnerIntegrations.id,
          partnerId: partnerIntegrations.partnerId,
          integrationType: partnerIntegrations.integrationType,
          posSystem: partnerIntegrations.posSystem,
          status: partnerIntegrations.status,
          configuration: partnerIntegrations.configuration,
          apiKeyGenerated: partnerIntegrations.apiKeyGenerated,
          webhookConfigured: partnerIntegrations.webhookConfigured,
          lastTestedAt: partnerIntegrations.lastTestedAt,
          testResult: partnerIntegrations.testResult,
          testErrors: partnerIntegrations.testErrors,
          wentLiveAt: partnerIntegrations.wentLiveAt,
          createdAt: partnerIntegrations.createdAt,
          updatedAt: partnerIntegrations.updatedAt,
          partnerBusinessName: partners.businessName,
          partnerBusinessType: partners.businessType,
          partnerContactName: partners.contactName,
          partnerContactEmail: partners.contactEmail,
          partnerStatus: partners.status,
        })
        .from(partnerIntegrations)
        .leftJoin(partners, eq(partnerIntegrations.partnerId, partners.id))
        .where(whereClause)
        .orderBy(
          sql`CASE ${partnerIntegrations.status} WHEN 'failed' THEN 0 WHEN 'pending' THEN 1 WHEN 'configured' THEN 2 WHEN 'testing' THEN 3 WHEN 'live' THEN 4 END`,
          desc(partnerIntegrations.updatedAt)
        )
        .limit(limit)
        .offset(offset)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(partnerIntegrations)
        .where(whereClause)

      // Get stats
      const statsData = await db!
        .select({
          status: partnerIntegrations.status,
          type: partnerIntegrations.integrationType,
          count: count(),
        })
        .from(partnerIntegrations)
        .groupBy(partnerIntegrations.status, partnerIntegrations.integrationType)

      // Build stats object
      const stats = {
        total: Number(total),
        live: 0,
        failed: 0,
        pending: 0,
        testing: 0,
        configured: 0,
        byType: {
          widget: 0,
          api: 0,
          pos: 0,
        },
      }

      statsData.forEach(s => {
        // Status counts
        if (s.status === "live") stats.live += Number(s.count)
        else if (s.status === "failed") stats.failed += Number(s.count)
        else if (s.status === "pending") stats.pending += Number(s.count)
        else if (s.status === "testing") stats.testing += Number(s.count)
        else if (s.status === "configured") stats.configured += Number(s.count)

        // Type counts
        if (s.type === "widget") stats.byType.widget += Number(s.count)
        else if (s.type === "api") stats.byType.api += Number(s.count)
        else if (s.type === "pos") stats.byType.pos += Number(s.count)
      })

      // Format response
      const formattedData = integrationsData.map(i => ({
        id: i.id,
        partnerId: i.partnerId,
        integrationType: i.integrationType,
        posSystem: i.posSystem,
        status: i.status,
        configuration: i.configuration,
        apiKeyGenerated: i.apiKeyGenerated,
        webhookConfigured: i.webhookConfigured,
        lastTestedAt: i.lastTestedAt?.toISOString() || null,
        testResult: i.testResult,
        testErrors: i.testErrors,
        wentLiveAt: i.wentLiveAt?.toISOString() || null,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        partner: i.partnerBusinessName ? {
          id: i.partnerId,
          businessName: i.partnerBusinessName,
          businessType: i.partnerBusinessType,
          contactName: i.partnerContactName,
          contactEmail: i.partnerContactEmail,
          status: i.partnerStatus,
        } : null,
      }))

      return successResponse({
        data: formattedData,
        pagination: {
          page,
          limit,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / limit),
        },
        stats,
      })
    } catch (error: unknown) {
      console.error("[Admin Partner Integrations] GET Error:", error)
      const message = error instanceof Error ? error.message : "Failed to fetch integrations"
      return serverError(message)
    }
  })
}
