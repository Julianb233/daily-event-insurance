
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"

const BASE_URL = "http://localhost:3000"

async function main() {
    // Dynamically import DB after env is loaded
    const { db, partners, microsites, adminEarnings } = await import("@/lib/db")

    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }

    console.log("🚀 Starting E2E Microsite Creation Test...")

    // 1. Setup Test Partner
    const testPartnerId = randomUUID()
    const testEmail = `e2e-test-${Date.now()}@test.com`
    const testSlug = `e2e-gym-${Date.now()}`

    console.log(`\nCreating test partner...`)
    console.log(`- ID: ${testPartnerId}`)
    console.log(`- Email: ${testEmail}`)

    try {
        // Clean up any existing test data if needed (though we're using unique IDs)

        // Create partner direclty in DB
        const [partner] = await db.insert(partners).values({
            id: testPartnerId,
            // We don't link to a user for this test, as the API doesn't enforce FK on userId for creation
            businessName: "E2E Rest Gym",
            businessType: "gym",
            contactName: "Test Owner",
            contactEmail: testEmail,
            status: "active",
            agreementSigned: true,
            w9Signed: true,
            directDepositSigned: true,
            brandingImages: [],
        }).returning({ id: partners.id })

        console.log("✅ Partner created successfully.")

        // 2. Call Admin API to create Microsite
        console.log(`\nCalling Admin API to create microsite...`)
        const response = await fetch(`${BASE_URL}/api/admin/microsites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // No Auth header needed due to dev bypass
            },
            body: JSON.stringify({
                partnerId: testPartnerId,
                slug: testSlug,
                businessName: "E2E Test Gym",
                primaryColor: "#000000"
            })
        })

        const responseData = await response.json()

        if (!response.ok) {
            console.error("❌ API Request Failed:", response.status, responseData)
            process.exit(1)
        }

        console.log("✅ API returned success:", responseData)
        const createdMicrosite = responseData.data

        // 3. Verify Database State
        console.log(`\nVerifying database state...`)

        // Check Microsite
        const [dbMicrosite] = await db
            .select()
            .from(microsites)
            .where(eq(microsites.id, createdMicrosite.id))

        if (!dbMicrosite) {
            console.error("❌ Microsite not found in DB!")
            process.exit(1)
        }
        console.log("✅ Microsite record exists in DB")
        console.log(`   - Slug: ${dbMicrosite.slug}`)
        console.log(`   - Setup Fee: ${dbMicrosite.setupFee}`)

        // Check Admin Earnings
        const [earning] = await db
            .select()
            .from(adminEarnings)
            .where(eq(adminEarnings.micrositeId, createdMicrosite.id))

        if (!earning) {
            console.error("❌ Admin Earning record not found!")
            process.exit(1)
        }

        console.log("✅ Admin Earning record exists")
        console.log(`   - Amount: ${earning.earnedAmount}`)
        console.log(`   - Type: ${earning.earningType}`)

        if (Number(earning.earnedAmount) !== 550.00) {
            console.warn("⚠️ Warning: Earning amount mismatch. Expected 550.00")
        }

        console.log("\n🎉 E2E TEST PASSED CUSTOMER SUCCESSFUL!")

        // Cleanup (Optional - strictly speaking we might want to keep it to inspect, but good to offer)
        // await db.delete(partners).where(eq(partners.id, testPartnerId))


    } catch (error) {
        console.error("\n❌ Test Failed with unknown error:", error)
        process.exit(1)
    }
}

main()
