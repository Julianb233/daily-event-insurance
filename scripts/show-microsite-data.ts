
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

import { desc } from "drizzle-orm"
import { microsites } from "@/lib/db/schema"

async function main() {
    // Dynamically import DB
    const { db } = await import("@/lib/db")

    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }

    console.log("🔍 Fetching latest microsites from DB...\n")

    const sites = await db
        .select()
        .from(microsites)
        .orderBy(desc(microsites.createdAt))
        .limit(5)

    if (sites.length === 0) {
        console.log("❌ No microsites found in the database.")
    } else {
        console.log(`✅ Found ${sites.length} microsites (showing latest 5):\n`)
        sites.forEach((site, index) => {
            console.log(`[${index + 1}] Slug: ${site.slug}`)
            console.log(`    Business: ${site.businessName}`)
            console.log(`    URL: http://localhost:3000/${site.slug}`) // Assumption, will verify
            console.log(`    Created: ${site.createdAt}`)
            console.log(`    ID: ${site.id}`)
            console.log(`    Primary Color: ${site.primaryColor}`)
            console.log(`    Active: ${site.isActive}`)
            console.log(`    Fee Status: ${site.feeCollected ? 'Paid' : 'Pending'}`);
            console.log(`    Logo URL: ${site.logoUrl || "MISSING"}`);
            console.log(`----------------------------------------`)
        })
    }
    process.exit(0)
}

main().catch(console.error)
