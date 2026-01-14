
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
    // Dynamic import
    const { db, partners, microsites } = await import("@/lib/db")
    const { eq } = await import("drizzle-orm")

    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }

    console.log("🚀 Starting Firecrawl Verification Test...")

    if (!process.env.FIRECRAWL_API_KEY) {
        console.warn("⚠️  WARNING: FIRECRAWL_API_KEY not found in env. Test may fail or skip scraping.")
    }

    // 1. Setup Partner
    const testPartnerId = randomUUID()
    const testSlug = `firecrawl-test-${Date.now()}`

    // Create partner direclty
    await db.insert(partners).values({
        id: testPartnerId,
        businessName: "Firecrawl Gym",
        businessType: "gym",
        contactName: "FC Tester",
        contactEmail: `fc-${Date.now()}@test.com`,
        status: "active",
        agreementSigned: true,
        w9Signed: true,
        directDepositSigned: true,
        brandingImages: [],
    }).returning({ id: partners.id })
    console.log("✅ Partner created.")

    // 2. Call Admin API with customDomain
    console.log(`\nCalling Admin API with customDomain="www.oceanpacificgym.com"...`)
    // We expect it to scrape and find the logo

    try {
        const response = await fetch(`${BASE_URL}/api/admin/microsites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                partnerId: testPartnerId,
                slug: testSlug,
                businessName: "Firecrawl Gym",
                // Intentionally OMITTING logoUrl to trigger scrape
                // primaryColor: "#123456" // Omit this too to see if we get anything, though code only does logo currently effectively
                customDomain: "www.oceanpacificgym.com"
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("❌ API Request Failed:", data)
            process.exit(1)
        }

        const createdSite = data.data
        console.log("✅ API returned success.")
        console.log("---------------------------------------------------")
        console.log("Created Microsite Data:")
        console.log(`Slug: ${createdSite.slug}`)
        console.log(`Logo URL: ${createdSite.logoUrl}`)
        console.log(`Primary Color: ${createdSite.primaryColor}`)
        console.log("---------------------------------------------------")

        if (createdSite.logoUrl && createdSite.logoUrl.startsWith("http")) {
            console.log("🎉 SUCCESS: Logo URL was automatically populated!")
        } else {
            console.log("⚠️  WARNING: Logo URL was NOT populated. Firecrawl scrape may have failed or found nothing.")
        }

    } catch (error) {
        console.error("❌ Test Failed:", error)
    }
}

main()
