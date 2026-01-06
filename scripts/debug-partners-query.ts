
import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from "../lib/db"
import { partners, microsites, policies, leads } from "../lib/db/schema"
import { eq, desc, ilike, or, sql, and, count } from "drizzle-orm"

async function debugQuery() {
    console.log("Starting debug query...")

    try {
        const limit = 20
        const offset = 0
        const sortOrder = "desc"

        // Get partners with microsites
        console.log("Executing main select...")
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
            .orderBy(sortOrder === "desc" ? desc(partners.createdAt) : partners.createdAt)
            .limit(limit)
            .offset(offset)

        console.log(`Initial fetch: ${partnersData.length} partners`)

        // Get metrics for each partner
        const partnerIds = partnersData.map(p => p.id)

        console.log("Fetching metrics...")
        // Get policy metrics per partner
        const policyMetrics = partnerIds.length > 0 ? await db!
            .select({
                partnerId: policies.partnerId,
                totalPolicies: count(),
                totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
                totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`
            })
            .from(policies)
            .where(sql`${policies.partnerId} = ANY(${partnerIds})`)
            .groupBy(policies.partnerId) : []

        console.log("Policy Metrics:", policyMetrics)

        console.log("✅ Query finished successfully")

    } catch (e) {
        console.error("❌ Query Failed:", e)
    }
}

debugQuery().then(() => process.exit(0))
