
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

import { eq as eq2 } from "drizzle-orm" // Just re-importing to be safe with dynamic loading if needed

const BASE_URL = "http://localhost:3000"

async function main() {
    // Dynamically import DB after env is loaded
    const { db, partners, microsites, adminEarnings } = await import("@/lib/db")
    console.log("🚀 Creating Ocean Pacific Gym Sample...")

    // 1. Setup Ocean Pacific Gym Partner
    const testPartnerId = randomUUID()
    const testEmail = `admin@oceanpacificgym.com`
    const testSlug = `ocean-pacific-gym`

    console.log(`\nCreating partner: Ocean Pacific Gym...`)

    try {
        if (!db) {
            throw new Error("Database not configured. Please check your environment variables.")
        }

        // Create partner directly in DB
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

        console.log("✅ Partner created successfully.")

        // 2. Call Admin API to create Microsite
        console.log(`\nCalling Admin API to create microsite...`)
        const response = await fetch(`${BASE_URL}/api/admin/microsites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                partnerId: testPartnerId,
                slug: testSlug,
                businessName: "Ocean Pacific Gym",
                primaryColor: "#0066CC", // Ocean blue
                customDomain: "www.oceanpacificgym.com"
            })
        })

        const responseData = await response.json()

        if (!response.ok) {
            console.error("❌ API Request Failed:", response.status, responseData)
            process.exit(1)
        }

        console.log("✅ API returned success:", responseData)

        console.log("\n🎉 Sample Data Created Successfully!")
        console.log(`Microsite Slug: ${testSlug}`)
        console.log(`Custom Domain: www.oceanpacificgym.com`)

    } catch (error: unknown) {
        // If duplicate key error, we can ignore or log
        const dbError = error as { code?: string }
        if (dbError.code === '23505') {
            console.log("⚠️  Sample data likely already exists (duplicate key).")
        } else {
            console.error("\n❌ Creation Failed:", error)
        }
        process.exit(1)
    }
}

main()
