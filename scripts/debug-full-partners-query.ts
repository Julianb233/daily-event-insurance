
import { config } from 'dotenv'
config({ path: '.env.local' })

async function debugQuery() {
    console.log("Starting full debug query...")

    // Dynamic import to ensure env is loaded first
    const { db } = await import("../lib/db/index")
    const { partners, microsites, policies, leads } = await import("../lib/db/schema")
    const { eq, desc, sql, count, inArray } = await import("drizzle-orm")

    try {
        if (!db) {
            console.error("❌ DB is null!")
            return
        }

        const limit = 20
        const offset = 0
        const page = 1
        const sortOrder = "desc"

        console.log("Executing joined select...")
        const partnersData = await db
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
        const policyMetrics = partnerIds.length > 0 ? await db
            .select({
                partnerId: policies.partnerId,
                totalPolicies: count(),
                totalRevenue: sql<number>`COALESCE(SUM(${policies.premium}::numeric), 0)`,
                totalCommission: sql<number>`COALESCE(SUM(${policies.commission}::numeric), 0)`
            })
            .from(policies)
            .where(inArray(policies.partnerId, partnerIds))
            .groupBy(policies.partnerId) : []

        console.log("Policy Metrics:", policyMetrics.length)

        console.log("Fetching lead metrics...")
        const leadMetrics = partnerIds.length > 0 ? await db
            .select({
                partnerId: leads.partnerId,
                totalLeads: count()
            })
            .from(leads)
            .where(inArray(leads.partnerId, partnerIds))
            .groupBy(leads.partnerId) : []

        console.log("Lead Metrics:", leadMetrics.length)

        console.log("✅ Full Query finished successfully")
    } catch (e) {
        console.error("❌ Link Query Failed:", e)
    }
}

debugQuery().then(() => process.exit(0))
