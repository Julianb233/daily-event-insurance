
import { config } from 'dotenv'
config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users, partners, microsites } from "../lib/db/schema"
import { eq } from 'drizzle-orm'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set")
    process.exit(1)
}

const client = postgres(databaseUrl)
const db = drizzle(client)

async function setupAdminAndLaFitness() {
    console.log("Setup Admin and Seed LA Fitness...")

    const email = 'antigravity_admin@test.com'

    // 1. Find User
    console.log(`Finding user ${email}...`)
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (userList.length === 0) {
        console.error("❌ User not found! Please run the browser signup flow first.")
        process.exit(1)
    }

    const user = userList[0]
    console.log(`✅ Found user: ${user.id}`)

    // 2. Elevate to Admin
    console.log("Elevating to Admin...")
    // Update public.users
    await db.update(users).set({ role: 'admin' }).where(eq(users.id, user.id))

    // Update auth.users metadata
    try {
        await client.unsafe(`
      UPDATE auth.users 
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb), 
        '{role}', 
        '"admin"'
      )
      WHERE id = '${user.id}';
    `)
        console.log("✅ Updated auth.users metadata")
    } catch (err) {
        console.error("⚠️ Failed to update auth.users (might lack permissions):", err)
    }

    // 3. Seed LA Fitness
    console.log("Seeding LA Fitness Partner...")
    const businessName = "LA Fitness"

    const existingPartner = await db.select().from(partners).where(eq(partners.businessName, businessName)).limit(1)

    let partnerId = ""

    if (existingPartner.length > 0) {
        console.log("Updating existing partner...")
        partnerId = existingPartner[0].id
        await db.update(partners).set({
            userId: user.id, // Assign to our admin user
            status: 'active',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/LA_Fitness_logo.png/320px-LA_Fitness_logo.png', // Better URL
            primaryColor: '#1d2345',
            integrationType: 'widget'
        }).where(eq(partners.id, partnerId))
    } else {
        console.log("Creating new partner...")
        const [newPartner] = await db.insert(partners).values({
            userId: user.id,
            businessName,
            businessType: 'fitness_center',
            contactName: 'Admin Demo',
            contactEmail: 'demo@lafitness.com',
            websiteUrl: 'https://www.lafitness.com',
            status: 'active',
            primaryColor: '#1d2345',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/LA_Fitness_logo.png/320px-LA_Fitness_logo.png',
            agreementSigned: true
        }).returning()
        partnerId = newPartner.id
    }

    // 4. Ensure Microsite
    const existingSite = await db.select().from(microsites).where(eq(microsites.partnerId, partnerId)).limit(1)
    const subdomain = 'lafitness'

    if (existingSite.length > 0) {
        await db.update(microsites).set({
            subdomain,
            domain: `${subdomain}.dailyeventinsurance.com`,
            status: 'live',
            siteName: businessName,
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/LA_Fitness_logo.png/320px-LA_Fitness_logo.png',
            primaryColor: '#1d2345',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://lafitness.dailyeventinsurance.com' // Fallback valid QR
        }).where(eq(microsites.id, existingSite[0].id))
    } else {
        await db.insert(microsites).values({
            partnerId,
            subdomain,
            domain: `${subdomain}.dailyeventinsurance.com`,
            status: 'live',
            siteName: businessName,
            primaryColor: '#1d2345',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/LA_Fitness_logo.png/320px-LA_Fitness_logo.png',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://lafitness.dailyeventinsurance.com'
        })
    }

    console.log("✅ Setup Complete")
    await client.end()
}

setupAdminAndLaFitness().catch(console.error)
