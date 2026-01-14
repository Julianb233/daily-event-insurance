import { db, partners, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

const BASE_URL = "http://localhost:3000"

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { db, partners, microsites } = await import("@/lib/db")
    const { eq } = await import("drizzle-orm")

    console.log("🚀 Starting Comprehensive Firecrawl Verification...")

    if (!process.env.FIRECRAWL_API_KEY) {
        console.warn("⚠️  WARNING: FIRECRAWL_API_KEY not found. Test will likely fail to scrape.")
    }

    // ==========================================
    // Test Case 1: Direct URL (scrapes customDomain)
    // ==========================================
    console.log("\n🧪 Test Case 1: Direct URL Strategy")
    const p1Id = randomUUID()
    const s1 = `fc-url-${Date.now()}`

    await db.insert(partners).values({
        id: p1Id,
        businessName: "Ocean Pacific Gym",
        businessType: "gym",
        contactName: "Test 1",
        contactEmail: `t1-${Date.now()}@test.com`,
        status: "active",
        agreementSigned: true, w9Signed: true, directDepositSigned: true,
        brandingImages: []
    })

    const res1 = await fetch(`${BASE_URL}/api/admin/microsites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            partnerId: p1Id,
            slug: s1,
            customDomain: "www.oceanpacificgym.com"
        })
    })

    const d1 = await res1.json()
    if (d1.success && d1.data.logoUrl) {
        console.log("✅ Case 1 Success: Found Logo via URL")
    } else {
        console.log("❌ Case 1 Failed: No Logo found or API error", d1)
    }

    // ==========================================
    // Test Case 2: Name Search Strategy (Fallback)
    // ==========================================
    console.log("\n🧪 Test Case 2: Name Search Fallback")
    const p2Id = randomUUID()
    const s2 = `fc-search-${Date.now()}`

    // Using a very well known entity ensuring search success
    const targetName = "Planet Fitness"

    await db.insert(partners).values({
        id: p2Id,
        businessName: targetName,
        businessType: "gym",
        contactName: "Test 2",
        contactEmail: `t2-${Date.now()}@test.com`,
        status: "active",
        agreementSigned: true, w9Signed: true, directDepositSigned: true,
        brandingImages: []
    })

    // Note: NO customDomain provided. Logic should fall back to searching 'Planet Fitness'
    const res2 = await fetch(`${BASE_URL}/api/admin/microsites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            partnerId: p2Id,
            slug: s2,
            businessName: targetName
            // customDomain OMITTED
        })
    })

    const d2 = await res2.json()
    if (d2.success && d2.data.logoUrl) {
        console.log("✅ Case 2 Success: Found Logo via Name Search")
        console.log(`   URL Found: ${d2.data.customDomain || 'N/A in response'} (Note: scraped URL might not be saved as customDomain unless logic updates it, but logo should be there)`)
    } else {
        console.log("❌ Case 2 Failed: No Logo found or API error", d2)
    }
}

main()
