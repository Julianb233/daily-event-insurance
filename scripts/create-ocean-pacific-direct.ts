
import { db, partners, microsites, adminEarnings } from "@/lib/db"
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

async function main() {
    // Dynamically import DB
    const { db, partners, microsites, adminEarnings } = await import("@/lib/db")
    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }
    console.log("🚀 Creating Ocean Pacific Gym Sample [DIRECT DB]...")

    // 1. Setup Ocean Pacific Gym Partner
    const testPartnerId = randomUUID()
    const testEmail = `admin@oceanpacificgym.com`
    const testSlug = `ocean-pacific-gym`

    // Clean up existing if any (by email or slug)
    // We'll just try insert and catch error

    try {
        console.log("Creating Partner...")
        const [partner] = await db.insert(partners).values({
            id: testPartnerId,
            businessName: "Ocean Pacific Gym",
            businessType: "gym",
            contactName: "Gym Manager",
            contactEmail: testEmail,
            status: "active",
            agreementSigned: true,
            w9Signed: true,
            directDepositSigned: true,
            brandingImages: [],
        }).returning({ id: partners.id })
        console.log("✅ Partner created.")

        console.log("Creating Microsite...")
        const [microsite] = await db.insert(microsites).values({
            partnerId: testPartnerId,
            slug: testSlug,
            customDomain: "www.oceanpacificgym.com",
            isActive: true, // IMPORTANT
            logoUrl: null, // User can update later? Or maybe I should add a fake one?
            primaryColor: "#0066CC",
            businessName: "Ocean Pacific Gym",
            setupFee: "550.00",
            feeCollected: true, // Mark as collected for "looks good"
        }).returning({ id: microsites.id })
        console.log("✅ Microsite created.")

        // Earnings
        console.log("Creating Earnings...")
        await db.insert(adminEarnings).values({
            earningType: "microsite_setup",
            micrositeId: microsite.id,
            partnerId: testPartnerId,
            baseAmount: "550.00",
            commissionRate: "1.0000",
            earnedAmount: "550.00",
            status: "paid", // Mark as paid
        })
        console.log("✅ Earnings created.")

        console.log("\n🎉 Sample Data Created Successfully!")

    } catch (error) {
        console.error("❌ Creation Failed:", error)
        // If it failed, it might be because it exists. Checking...
        // But the verify script said it didn't exist.
    }
}

main()
