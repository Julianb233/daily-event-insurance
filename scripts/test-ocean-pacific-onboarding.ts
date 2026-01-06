import { config } from "dotenv"
config({ path: ".env.local" })

// Move other imports to inside run() or keep non-side-effecting ones here.
// schema usually doesn't have side effects, but let's be safe.
import { eq } from "drizzle-orm"
import { DOCUMENT_TYPES } from "@/lib/demo-documents"

async function run() {
    console.log("🚀 Starting verification for Ocean Pacific Gym...")

    // Check Env
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is missing from environment. content of .env.local not loaded?")
        process.exit(1)
    }

    // Dynamic imports to ensure env vars are loaded first
    const { db } = await import("@/lib/db")
    // If lib/db/schema.ts has side effects (it shouldn't), import dynamic too.
    const { partners, users, partnerDocuments } = await import("@/lib/db/schema")
    const { completePartnerOnboarding } = await import("@/lib/onboarding-automation")

    if (!db) {
        console.error("❌ Database connection failed. mock mode active but script requires DB.")
        process.exit(1)
    }

    // 1. Get or create an admin user for context
    const [admin] = await db.select().from(users).limit(1)
    if (!admin) {
        console.error("No users found. Please run the seed script first or sign up a user.")
        process.exit(1)
    }

    // 2. Create or update the partner record
    const businessName = "Ocean Pacific Gym"
    const websiteUrl = "https://www.oceanpacificgym.com"

    // Check if exists
    let [partner] = await db.select().from(partners).where(eq(partners.businessName, businessName)).limit(1)

    if (partner) {
        console.log(`Updating existing partner: ${partner.id}`)
        const [updated] = await db.update(partners).set({
            websiteUrl,
            status: 'pending_onboarding', // Reset status to force onboarding flow logic if needed
            logoUrl: null, // Clear logo to force Fetch
            brandingImages: [], // Clear images
            agreementSigned: true, // Ensure agreement is marked signed
            integrationType: "manual" // Force standalone microsite
        }).where(eq(partners.id, partner.id)).returning()
        partner = updated
    } else {
        console.log("Creating new partner...")
        const [newPartner] = await db.insert(partners).values({
            userId: admin.id,
            businessName,
            businessType: "gym",
            contactName: "Test User",
            contactEmail: "test@oceanpacificgym.com",
            websiteUrl,
            status: "pending_onboarding",
            agreementSigned: true,
            integrationType: "manual" // Force standalone microsite
        }).returning()
        partner = newPartner
    }

    console.log(`Partner ID: ${partner.id}`)

    // 3. Ensure required documents are "signed"
    const requiredDocs = [
        DOCUMENT_TYPES.PARTNER_AGREEMENT,
        DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT,
        DOCUMENT_TYPES.MUTUAL_NDA,
        DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT
    ]

    for (const docType of requiredDocs) {
        const [existingDoc] = await db.select().from(partnerDocuments).where(
            // Normally check partnerId and docType
            eq(partnerDocuments.partnerId, partner.id)
        )
        // Just insert blindly for testing speed/simplicity or check if missing
        // For simplicity:
        await db.insert(partnerDocuments).values({
            partnerId: partner.id,
            documentType: docType,
            status: 'signed',
            signedAt: new Date()
        })
    }
    console.log("✅ Required documents marked as signed.")

    // 4. Run the onboarding automation
    console.log("🔄 Running completePartnerOnboarding...")
    try {
        const result = await completePartnerOnboarding(partner.id)

        console.log("\n🎉 Onboarding Complete!")
        console.log("-----------------------------------")
        console.log(`Partner: ${result.businessName}`)
        console.log(`Status: ${result.status}`)
        console.log(`Microsite URL: ${result.microsite.url}`)
        console.log(`QR Code URL: ${result.microsite.qrCodeDataUrl.substring(0, 50)}...`)
        console.log(`Branding Logo: ${result.branding.logoUrl}`)
        console.log(`Images Extracted: ${result.branding.imagesExtracted}`)
        console.log("-----------------------------------")

        if (result.branding.imagesExtracted > 0) {
            console.log("✅ SUCCESS: Firecrawl successfully extracted images.")
        } else {
            console.log("⚠️ WARNING: No images extracted. Check FireCrawl integration or website content.")
        }

    } catch (error) {
        console.error("❌ Onboarding failed:", error)
    }

    process.exit(0)
}

run()
