import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerLocations } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import postgres from "postgres"

// SECURITY: Module-level connection pool (reused across requests)
// Only created once when module loads, not per-request
let sqlPool: ReturnType<typeof postgres> | null = null

function getSqlPool() {
  if (!sqlPool && process.env.DATABASE_URL) {
    sqlPool = postgres(process.env.DATABASE_URL, {
      ssl: "require",
      max: 10, // Connection pool size
      idle_timeout: 20, // Close idle connections after 20 seconds
    })
  }
  return sqlPool
}

/**
 * GET /api/partner/locations/[locationId]/stats
 * Get real-time stats for a specific location
 * SECURITY: Verifies partner ownership before returning any data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { locationId } = await params

    if (!isDbConfigured()) {
      // Return mock stats in dev mode
      return NextResponse.json({
        locationId,
        totalPolicies: 42,
        totalPremium: "2,450.00",
        totalCommission: "612.50",
        policiesThisMonth: 15,
        policiesThisWeek: 5,
        policiesToday: 2,
        lastPolicyAt: new Date().toISOString(),
        recentPolicies: [
          {
            id: "pol-1",
            policyNumber: "POL-20250104-00001",
            customerName: "John Doe",
            eventType: "Birthday Party",
            premium: "4.99",
            commission: "1.25",
            createdAt: new Date().toISOString(),
          },
          {
            id: "pol-2",
            policyNumber: "POL-20250104-00002",
            customerName: "Jane Smith",
            eventType: "Wedding Reception",
            premium: "4.99",
            commission: "1.25",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      })
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    // Verify location belongs to this partner
    const locationResult = await db!
      .select()
      .from(partnerLocations)
      .where(
        and(
          eq(partnerLocations.id, locationId),
          eq(partnerLocations.partnerId, partner.id)
        )
      )
      .limit(1)

    if (locationResult.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Query real-time stats using raw SQL for complex aggregations
    // SECURITY: Use connection pool instead of per-request connections
    const sql = getSqlPool()

    if (!sql) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    try {
      // SECURITY: Defense in depth - include partner_id in SQL queries
      // Even though we verified ownership above, this prevents any bypass attempts
      const partnerId = partner.id

      // Get aggregate stats with partner authorization
      const statsResult = await sql`
        SELECT
          COUNT(*)::int AS total_policies,
          COALESCE(SUM(p.premium::numeric), 0) AS total_premium,
          COALESCE(SUM(p.commission::numeric), 0) AS total_commission,
          COUNT(*) FILTER (WHERE p.created_at >= NOW() - INTERVAL '30 days')::int AS policies_30_days,
          COUNT(*) FILTER (WHERE p.created_at >= NOW() - INTERVAL '7 days')::int AS policies_7_days,
          COUNT(*) FILTER (WHERE p.created_at >= DATE_TRUNC('day', NOW()))::int AS policies_today,
          MAX(p.created_at) AS last_policy_at
        FROM policies p
        INNER JOIN partner_locations pl ON pl.id = p.location_id
        WHERE p.location_id = ${locationId}
          AND pl.partner_id = ${partnerId}
      `

      // Get recent policies with partner authorization
      const recentPolicies = await sql`
        SELECT
          p.id,
          p.policy_number AS "policyNumber",
          p.customer_name AS "customerName",
          p.event_type AS "eventType",
          p.premium,
          p.commission,
          p.created_at AS "createdAt"
        FROM policies p
        INNER JOIN partner_locations pl ON pl.id = p.location_id
        WHERE p.location_id = ${locationId}
          AND pl.partner_id = ${partnerId}
        ORDER BY p.created_at DESC
        LIMIT 10
      `

      // Note: Don't close connection pool - it's reused across requests

      const stats = statsResult[0]

      return NextResponse.json({
        locationId,
        totalPolicies: stats.total_policies || 0,
        totalPremium: parseFloat(stats.total_premium || 0).toFixed(2),
        totalCommission: parseFloat(stats.total_commission || 0).toFixed(2),
        policiesThisMonth: stats.policies_30_days || 0,
        policiesThisWeek: stats.policies_7_days || 0,
        policiesToday: stats.policies_today || 0,
        lastPolicyAt: stats.last_policy_at,
        recentPolicies,
      })
    } catch (error) {
      console.error("[Stats] Error fetching location stats:", error)
      return NextResponse.json(
        { error: "Failed to fetch stats" },
        { status: 500 }
      )
    }
  })
}
