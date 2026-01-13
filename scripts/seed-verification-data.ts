
import { config } from "dotenv"
config({ path: ".env.local" })

import { db, users, partners } from "@/lib/db"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"

async function seed() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not set")
        process.exit(1)
    }

    console.log("Seeding verification data...")

    const testEmail = `test-partner-${Date.now()}@example.com`
    const testUserId = randomUUID()
    const testPartnerId = randomUUID()

    // 1. Create User
    console.log(`Creating user: ${testEmail} (${testUserId})`)
    await db!.insert(users).values({
        id: testUserId,
        email: testEmail,
        name: "Test User",
        role: "partner",
        createdAt: new Date(),
        updatedAt: new Date()
    })

    // 2. Create Partner
    console.log(`Creating partner: ${testPartnerId}`)
    await db!.insert(partners).values({
        id: testPartnerId,
        userId: testUserId,
        businessName: "Verification Gym",
        businessType: "gym",
        contactName: "Test Partner",
        contactEmail: testEmail,
        status: "active",
        brandingImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    })

    console.log("\n--- SEED DATA ---")
    console.log(`TEST_USER_ID=${testUserId}`)
    console.log(`TEST_PARTNER_ID=${testPartnerId}`)
}

seed().catch(console.error).finally(() => process.exit(0))
