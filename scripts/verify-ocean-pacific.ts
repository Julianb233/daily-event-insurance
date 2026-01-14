
import { db, partners, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

async function main() {
    // Dynamically import DB
    const { db, microsites } = await import("@/lib/db")

    console.log("🚀 Checking for Ocean Pacific Gym...")

    try {
        const [site] = await db.select().from(microsites).where(eq(microsites.slug, "ocean-pacific-gym"));

        if (site) {
            console.log("✅ FOUND: Ocean Pacific Gym microsite exists in DB.")
            console.log(`   - ID: ${site.id}`)
            console.log(`   - Slug: ${site.slug}`)
            console.log(`   - Business Name: ${site.businessName}`)
        } else {
            console.log("❌ NOT FOUND: Ocean Pacific Gym microsite does not exist.")
        }

    } catch (error) {
        console.error("❌ Error querying DB:", error)
    }
}

main()
