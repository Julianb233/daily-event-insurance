
import { config } from 'dotenv'
config({ path: '.env.local' })

async function debugQuery() {
    console.log("Starting debug query with dynamic import...")

    // Dynamic import to ensure env is loaded first
    const { db } = await import("../lib/db/index.ts")
    const { partners, microsites, policies, leads } = await import("../lib/db/schema.ts")
    const { eq, desc, sql, count } = await import("drizzle-orm")

    try {
        if (!db) {
            console.error("❌ DB is null even after dynamic import!")
            return
        }

        const limit = 20
        const offset = 0
        const sortOrder = "desc"

        console.log("Executing main select...")
        const partnersData = await db
            .select({
                id: partners.id,
                businessName: partners.businessName,
                // ... (simplified selection for test)
                contactName: partners.contactName
            })
            .from(partners)
            // .leftJoin(microsites, eq(microsites.partnerId, partners.id)) 
            // Simplified to isolate issues
            .limit(limit)

        console.log(`Initial fetch: ${partnersData.length} partners`)
        console.log("Data:", partnersData)

        console.log("✅ Query finished successfully")

    } catch (e) {
        console.error("❌ Query Failed:", e)
    }
}

debugQuery().then(() => process.exit(0))
