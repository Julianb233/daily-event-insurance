
import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { partners, microsites } from "../lib/db/schema"
import { eq } from 'drizzle-orm'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set")
    process.exit(1)
}

const client = postgres(databaseUrl)
const db = drizzle(client)

async function seedLaFitness() {
    console.log("Seeding LA Fitness Partner...")

    const businessName = "LA Fitness"

    // 1. Create Partner
    // Check if exists
    const existing = await db.select().from(partners).where(eq(partners.businessName, businessName)).limit(1)

    let partnerId = ""

    if (existing.length > 0) {
        console.log("Partner already exists, updating...")
        partnerId = existing[0].id
        await db.update(partners).set({
            status: 'active',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/LA_Fitness_logo.png', // Fallback
            primaryColor: '#1d2345'
        }).where(eq(partners.id, partnerId))
    } else {
        console.log("Creating new partner...")
        const [newPartner] = await db.insert(partners).values({
            businessName,
            businessType: 'fitness_center',
            contactName: 'Admin Demo',
            contactEmail: 'demo@lafitness.com',
            websiteUrl: 'https://www.lafitness.com',
            status: 'active',
            primaryColor: '#1d2345',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/LA_Fitness_logo.png',
            userId: 'demo-user-id' // arbitrary ID for now
        }).returning()
        partnerId = newPartner.id
    }

    // 2. Create Microsite
    const existingSite = await db.select().from(microsites).where(eq(microsites.partnerId, partnerId)).limit(1)

    const subdomain = 'lafitness'

    if (existingSite.length > 0) {
        console.log("Microsite already exists, updating...")
        await db.update(microsites).set({
            subdomain,
            domain: `${subdomain}.dailyeventinsurance.com`,
            status: 'live',
            siteName: businessName
        }).where(eq(microsites.id, existingSite[0].id))
    } else {
        console.log("Creating microsite...")
        await db.insert(microsites).values({
            partnerId,
            subdomain,
            domain: `${subdomain}.dailyeventinsurance.com`,
            status: 'live',
            siteName: businessName,
            primaryColor: '#1d2345',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/LA_Fitness_logo.png'
        })
    }

    console.log("✅ LA Fitness Seeded Successfully")
    await client.end()
}

seedLaFitness().catch(console.error)
