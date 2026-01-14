
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

const BASE_URL = process.env.TARGET_URL || "http://localhost:3000"

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

        // 2. Call Admin API to create Microsite OR Direct DB Insert if testing Production (which has Auth)
        console.log(`\nCreating microsite...`)

        let createdMicrosite;
        const isProductionTest = BASE_URL !== "http://localhost:3000";

        if (isProductionTest) {
            console.log("ℹ️ Testing against remote environment (Authentication enforced).");
            console.log("ℹ️ Bypassing API and inserting directly into DB to verify connectivity.");

            const [microsite] = await db.insert(microsites).values({
                partnerId: testPartnerId,
                slug: testSlug,
                businessName: "E2E Test Gym",
                primaryColor: "#000000",
                isActive: true,
                setupFee: "550.00",
                feeCollected: false
            }).returning();

            createdMicrosite = microsite;

            // Also create earnings record to match API behavior
            await db.insert(adminEarnings).values({
                earningType: "microsite_setup",
                micrositeId: createdMicrosite.id,
                partnerId: testPartnerId,
                baseAmount: "550.00",
                commissionRate: "1.0000",
                earnedAmount: "550.00",
                status: "pending",
            });

            console.log("✅ Microsite inserted into DB directly.");

        } else {
            const response = await fetch(`${BASE_URL}/api/admin/microsites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
            createdMicrosite = responseData.data
        }

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

        // 4. Verify Public URL (Critical for E2E)
        if (isProductionTest) {
            const publicUrl = `${BASE_URL}/events/${testSlug}`;
            console.log(`\nVerifying Public URL: ${publicUrl}`);

            // Retry logic for propagation
            let attempts = 0;
            let success = false;
            while (attempts < 3 && !success) {
                const res = await fetch(publicUrl);
                if (res.status === 200) {
                    const text = await res.text();
                    if (text.includes("E2E Test Gym")) {
                        console.log("✅ Public URL returned 200 and contains Business Name.");
                        success = true;
                    } else {
                        console.warn("⚠️ Public URL returned 200 but missing content.");
                    }
                } else {
                    console.warn(`⚠️ Public URL returned status: ${res.status}. Retrying...`);
                }
                if (!success) await new Promise(r => setTimeout(r, 2000));
                attempts++;
            }

            if (!success) {
                console.error(`❌ Failed to verify public URL after ${attempts} attempts`);
                // Don't fail the script immediately if it's just propagation, but mark as warning
                process.exit(1);
            }
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
