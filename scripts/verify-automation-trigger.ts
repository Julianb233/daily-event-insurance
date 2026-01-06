
import { config } from "dotenv"
config({ path: ".env.local" })
import { eq } from "drizzle-orm"

async function main() {
    // Dynamic imports to ensure env vars are loaded first
    const { db } = await import("@/lib/db")
    const { partners, partnerDocuments, microsites } = await import("@/lib/db/schema")
    const { DOCUMENT_TYPES } = await import("@/lib/demo-documents")
    const { completePartnerOnboarding } = await import("@/lib/onboarding-automation")

    console.log("Starting Automation Verification...")

    // Helper function moved inside to access imported modules variables
    async function triggerAutomationIfReady(partnerId: string) {
        const [partner] = await db
            .select()
            .from(partners)
            .where(eq(partners.id, partnerId))

        const signedDocs = await db
            .select()
            .from(partnerDocuments)
            .where(eq(partnerDocuments.partnerId, partnerId))

        // Check against the 4 required types defined in route.ts
        const hasPartnerAgreement = partner?.agreementSigned
        const hasJMA = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT && d.status === 'signed')
        const hasNDA = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.MUTUAL_NDA && d.status === 'signed')
        const hasSponsorship = signedDocs.some(d => d.documentType === DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT && d.status === 'signed')

        console.log(`[Status] Partner Agreement: ${hasPartnerAgreement}`)
        console.log(`[Status] JMA: ${hasJMA}`)
        console.log(`[Status] NDA: ${hasNDA}`)
        console.log(`[Status] Sponsorship: ${hasSponsorship}`)

        if (hasPartnerAgreement && hasJMA && hasNDA && hasSponsorship) {
            console.log(">>> ALL CONTRACTS SIGNED. Triggering Automation...")
            await completePartnerOnboarding(partnerId)
            return true
        }
        return false
    }

    // 1. Create a Test Partner
    const testSlug = `automation-test-${Date.now()}`
    const [partner] = await db.insert(partners).values({
        businessName: "Automation Test Gym",
        businessType: "gym",
        contactName: "Test User",
        contactEmail: `test-${Date.now()}@example.com`,
        status: "pending_onboarding",
        documentsStatus: "pending",
        integrationType: "manual" // Ensure standalone
    }).returning()
    console.log(`Created test partner: ${partner.businessName} (${partner.id})`)

    // 2. Sign Documents One by One

    // Sign Partner Agreement
    console.log("\n--- Signing Partner Agreement ---")
    await db.update(partners).set({ agreementSigned: true }).where(eq(partners.id, partner.id))
    await db.insert(partnerDocuments).values({
        partnerId: partner.id,
        documentType: DOCUMENT_TYPES.PARTNER_AGREEMENT,
        status: "signed",
        contentSnapshot: "Signed...",
        signedAt: new Date()
    })
    let triggered = await triggerAutomationIfReady(partner.id)
    if (triggered) console.error("FAIL: Triggered too early!")

    // Sign NDA
    console.log("\n--- Signing Mutual NDA ---")
    await db.insert(partnerDocuments).values({
        partnerId: partner.id,
        documentType: DOCUMENT_TYPES.MUTUAL_NDA,
        status: "signed",
        contentSnapshot: "Signed...",
        signedAt: new Date()
    })
    triggered = await triggerAutomationIfReady(partner.id)
    if (triggered) console.error("FAIL: Triggered too early!")

    // Sign JMA
    console.log("\n--- Signing Joint Marketing Agreement ---")
    await db.insert(partnerDocuments).values({
        partnerId: partner.id,
        documentType: DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT,
        status: "signed",
        contentSnapshot: "Signed...",
        signedAt: new Date()
    })
    triggered = await triggerAutomationIfReady(partner.id)
    if (triggered) console.error("FAIL: Triggered too early!")

    // Sign Sponsorship (The 4th one)
    console.log("\n--- Signing Sponsorship Agreement ---")
    await db.insert(partnerDocuments).values({
        partnerId: partner.id,
        documentType: DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT,
        status: "signed",
        contentSnapshot: "Signed...",
        signedAt: new Date()
    })

    // This should trigger it
    triggered = await triggerAutomationIfReady(partner.id)
    if (triggered) {
        console.log("SUCCESS: Automation Triggered!")
    } else {
        console.error("FAIL: Automation DID NOT trigger after 4 contracts!")
    }

    // 3. Verify Microsite Creation
    // Wait a moment for async side effects if necessary (though completePartnerOnboarding is awaited)
    const [microsite] = await db.select().from(microsites).where(eq(microsites.partnerId, partner.id))
    if (microsite) {
        console.log("\n✅ Microsite Record Created")
        console.log(`   Subdomain: ${microsite.subdomain}`)
        console.log(`   Live URL: https://${microsite.subdomain}.dailyeventinsurance.com`)
    } else {
        console.error("\n❌ Microsite Record NOT Found")
    }

    process.exit(0)
}

main().catch(console.error)
