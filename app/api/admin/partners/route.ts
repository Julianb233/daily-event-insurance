import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured } from "@/lib/db"
import { partners, microsites, policies, leads } from "@/lib/db/schema"
import { eq, desc, ilike, or, sql, and, count, inArray } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"

/**
 * GET /api/admin/partners
 * List all partners with search, filtering, and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const businessType = searchParams.get("businessType") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Dev mode mock data
    if (isDevMode || !isDbConfigured()) {
      const mockPartners = [
        {
          id: "partner-001",
          businessName: "Peak Performance Gym",
          businessType: "fitness_center",
          contactName: "Mike Johnson",
          contactEmail: "mike@peakperformance.com",
          contactPhone: "(555) 123-4567",
          websiteUrl: "https://peakperformance.com",
          primaryColor: "#E31937",
          logoUrl: "/images/partners/peak-logo.png",
          status: "active",
          integrationType: "microsite",
          createdAt: "2025-10-15T00:00:00Z",
          microsite: {
            id: "ms-001",
            subdomain: "peak-performance",
            domain: "peak-performance.dailyeventinsurance.com",
            qrCodeUrl: "data:image/png;base64,iVBORw0KGgo...",
            status: "live"
          },
          metrics: {
            totalPolicies: 89,
            totalRevenue: 11125.00,
            totalCommission: 4450.00,
            totalLeads: 156,
            conversionRate: 57.05
          }
        },
        {
          id: "partner-002",
          businessName: "Summit Climbing Center",
          businessType: "climbing_gym",
          contactName: "Sarah Chen",
          contactEmail: "sarah@summitclimbing.com",
          contactPhone: "(555) 234-5678",
          websiteUrl: "https://summitclimbing.com",
          primaryColor: "#0EA5E9",
          logoUrl: "/images/partners/summit-logo.png",
          status: "active",
          integrationType: "microsite",
          createdAt: "2025-11-01T00:00:00Z",
          microsite: {
            id: "ms-002",
            subdomain: "summit-climbing",
            domain: "summit-climbing.dailyeventinsurance.com",
            qrCodeUrl: "data:image/png;base64,iVBORw0KGgo...",
            status: "live"
          },
          metrics: {
            totalPolicies: 67,
            totalRevenue: 8375.00,
            totalCommission: 3350.00,
            totalLeads: 112,
            conversionRate: 59.82
          }
        },
        {
          id: "partner-003",
          businessName: "Adventure Sports Co",
          businessType: "adventure_sports",
          contactName: "Tom Williams",
          contactEmail: "tom@adventuresports.com",
          contactPhone: "(555) 345-6789",
          websiteUrl: "https://adventuresports.com",
          primaryColor: "#8B5CF6",
          logoUrl: "/images/partners/adventure-logo.png",
          status: "active",
          integrationType: "widget",
          createdAt: "2025-11-15T00:00:00Z",
          microsite: {
            id: "ms-003",
            subdomain: "adventure-sports",
            domain: "adventure-sports.dailyeventinsurance.com",
            qrCodeUrl: "data:image/png;base64,iVBORw0KGgo...",
            status: "live"
          },
          metrics: {
            totalPolicies: 54,
            totalRevenue: 7425.00,
            totalCommission: 2970.00,
            totalLeads: 98,
            conversionRate: 55.10
          }
        },
        {
          id: "partner-004",
          businessName: "Zen Yoga Studio",
          businessType: "yoga_studio",
          contactName: "Lisa Park",
          contactEmail: "lisa@zenyoga.com",
          contactPhone: "(555) 456-7890",
          websiteUrl: "https://zenyoga.com",
          primaryColor: "#10B981",
          logoUrl: null,
          status: "pending",
          integrationType: "microsite",
          createdAt: "2025-12-20T00:00:00Z",
          microsite: null,
          metrics: {
            totalPolicies: 0,
            totalRevenue: 0,
            totalCommission: 0,
            totalLeads: 12,
            conversionRate: 0
          }
        },
        {
          id: "partner-005",
          businessName: "CrossFit Ironside",
          businessType: "crossfit",
          contactName: "Jake Thompson",
          contactEmail: "jake@crossfitironside.com",
          contactPhone: "(555) 567-8901",
          websiteUrl: "https://crossfitironside.com",
          primaryColor: "#F59E0B",
          logoUrl: "/images/partners/crossfit-logo.png",
          status: "active",
          integrationType: "microsite",
          createdAt: "2025-09-01T00:00:00Z",
          microsite: {
            id: "ms-005",
            subdomain: "crossfit-ironside",
            domain: "crossfit-ironside.dailyeventinsurance.com",
            qrCodeUrl: "data:image/png;base64,iVBORw0KGgo...",
            status: "live"
          },
          metrics: {
            totalPolicies: 123,
            totalRevenue: 15375.00,
            totalCommission: 6150.00,
            totalLeads: 234,
            conversionRate: 52.56
          }
        }
      ]

      // Apply search filter
      let filtered = mockPartners
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p =>
          p.businessName.toLowerCase().includes(searchLower) ||
          p.contactName.toLowerCase().includes(searchLower) ||
          p.contactEmail.toLowerCase().includes(searchLower)
        )
      }

      // Apply status filter
      if (status) {
        filtered = filtered.filter(p => p.status === status)
      }

      // Apply business type filter
      if (businessType) {
        filtered = filtered.filter(p => p.businessType === businessType)
      }

      // Pagination
      const total = filtered.length
      const start = (page - 1) * limit
      const paged = filtered.slice(start, start + limit)

      return NextResponse.json({
        success: true,
        data: paged,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        summary: {
          totalPartners: mockPartners.length,
          activePartners: mockPartners.filter(p => p.status === "active").length,
          pendingPartners: mockPartners.filter(p => p.status === "pending").length,
          totalRevenue: mockPartners.reduce((sum, p) => sum + p.metrics.totalRevenue, 0),
          totalPolicies: mockPartners.reduce((sum, p) => sum + p.metrics.totalPolicies, 0)
        }
      })
    }

    // Production: Query database
    const offset = (page - 1) * limit

    // Build where conditions
    const whereConditions = []
    if (search) {
      whereConditions.push(
        or(
          ilike(partners.businessName, `%${search}%`),
          ilike(partners.contactName, `%${search}%`),
          ilike(partners.contactEmail, `%${search}%`)
        )
      )
    }
    if (status) {
      whereConditions.push(eq(partners.status, status))
    }
    if (businessType) {
      whereConditions.push(eq(partners.businessType, businessType))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get partners with microsites
    const partnersData = await db!
      .select({
        id: partners.id,
        businessName: partners.businessName,
        businessType: partners.businessType,
        contactName: partners.contactName,
        contactEmail: partners.contactEmail,
        contactPhone: partners.contactPhone,
        websiteUrl: partners.websiteUrl,
        primaryColor: partners.primaryColor,
        logoUrl: partners.logoUrl,
        status: partners.status,
        integrationType: partners.integrationType,
        createdAt: partners.createdAt,
        micrositeId: microsites.id,
        micrositeSubdomain: microsites.subdomain,
        micrositeDomain: microsites.domain,
        micrositeQrCodeUrl: microsites.qrCodeUrl,
        micrositeStatus: microsites.status
      })
      .from(partners)
      .leftJoin(microsites, eq(microsites.partnerId, partners.id))
      .where(whereClause)
      .orderBy(sortOrder === "desc" ? desc(partners.createdAt) : partners.createdAt)
      .limit(limit)
      .offset(offset)

    // Get total count
    const [countResult] = await db!
      .select({ count: count() })
      .from(partners)
      .where(whereClause)

    const total = Number(countResult?.count || 0)

    // Get metrics for each partner
    const partnerIds = partnersData.map(p => p.id)

    // Get policy metrics per partner
    const policyMetrics = partnerIds.length > 0 ? await db!
      .select({
        partnerId: policies.partnerId,
        totalPolicies: count(),
        totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`
      })
      .from(policies)
      .where(inArray(policies.partnerId, partnerIds))
      .groupBy(policies.partnerId) : []

    // Get lead counts per partner
    const leadMetrics = partnerIds.length > 0 ? await db!
      .select({
        partnerId: leads.partnerId,
        totalLeads: count()
      })
      .from(leads)
      .where(inArray(leads.partnerId, partnerIds))
      .groupBy(leads.partnerId) : []

    // Combine data
    const partnersWithMetrics = partnersData.map(p => {
      const pMetrics = policyMetrics.find(m => m.partnerId === p.id)
      const lMetrics = leadMetrics.find(m => m.partnerId === p.id)

      const totalPolicies = Number(pMetrics?.totalPolicies || 0)
      const totalLeads = Number(lMetrics?.totalLeads || 0)

      return {
        id: p.id,
        businessName: p.businessName,
        businessType: p.businessType,
        contactName: p.contactName,
        contactEmail: p.contactEmail,
        contactPhone: p.contactPhone,
        websiteUrl: p.websiteUrl,
        primaryColor: p.primaryColor,
        logoUrl: p.logoUrl,
        status: p.status,
        integrationType: p.integrationType,
        createdAt: p.createdAt,
        microsite: p.micrositeId ? {
          id: p.micrositeId,
          subdomain: p.micrositeSubdomain,
          domain: p.micrositeDomain,
          qrCodeUrl: p.micrositeQrCodeUrl,
          status: p.micrositeStatus
        } : null,
        metrics: {
          totalPolicies,
          totalRevenue: Number(pMetrics?.totalRevenue || 0),
          totalCommission: Number(pMetrics?.totalCommission || 0),
          totalLeads,
          conversionRate: totalLeads > 0 ? Math.round((totalPolicies / totalLeads) * 10000) / 100 : 0
        }
      }
    })

    // Get summary stats
    const [summaryStats] = await db!
      .select({
        totalPartners: count(),
        activePartners: sql<number>`COUNT(CASE WHEN ${partners.status} = 'active' THEN 1 END)`,
        pendingPartners: sql<number>`COUNT(CASE WHEN ${partners.status} IN ('pending', 'under_review') THEN 1 END)`
      })
      .from(partners)

    const [revenueStats] = await db!
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
        totalPolicies: count()
      })
      .from(policies)

    return NextResponse.json({
      success: true,
      data: partnersWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalPartners: Number(summaryStats?.totalPartners || 0),
        activePartners: Number(summaryStats?.activePartners || 0),
        pendingPartners: Number(summaryStats?.pendingPartners || 0),
        totalRevenue: Number(revenueStats?.totalRevenue || 0),
        totalPolicies: Number(revenueStats?.totalPolicies || 0)
      }
    })
  } catch (error) {
    console.error("[Admin Partners] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch partners" },
      { status: 500 }
    )
  }
}
