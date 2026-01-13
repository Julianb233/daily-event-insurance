
import { config } from "dotenv"
config({ path: ".env.local" })

import { NextRequest } from 'next/server';
import { execSync } from 'child_process';
import { sql } from "drizzle-orm";

async function main() {
    console.log("Starting Verification against REAL SUPABASE DB...");
    const { db } = await import("@/lib/db");
    const { GET: getContracts, POST: signContract } = await import('../app/api/partner/contracts/route');
    const { POST: createMicrosite } = await import('../app/api/admin/microsites/route');

    // 1. Seed Real Data
    console.log("\n--- Seeding Test Data ---");
    const seedOutput = execSync('npx tsx scripts/seed-verification-data.ts').toString();
    const userIdMatch = seedOutput.match(/TEST_USER_ID=(.*)/);
    const partnerIdMatch = seedOutput.match(/TEST_PARTNER_ID=(.*)/);

    if (!userIdMatch || !partnerIdMatch) {
        console.error("Failed to seed data", seedOutput);
        process.exit(1);
    }

    const testUserId = userIdMatch[1];
    const testPartnerId = partnerIdMatch[1];
    console.log(`Using Real User: ${testUserId}`);
    console.log(`Using Real Partner: ${testPartnerId}`);

    // Set Auth Bypass for Partner
    process.env.TEST_USER_ID = testUserId;
    process.env.TEST_USER_ROLE = 'partner';

    // 2. Sign Contracts (as Partner)
    console.log("\n--- Signing Contracts (as Partner) ---");
    const req1 = new NextRequest("http://localhost/api/partner/contracts");
    const res1 = await getContracts(req1);
    const data1 = await res1.json();

    if (data1.data?.contracts) {
        for (const contract of data1.data.contracts) {
            console.log(`Signing: ${contract.displayName || contract.name}`);
            const reqSign = new NextRequest("http://localhost/api/partner/contracts", {
                method: 'POST',
                body: JSON.stringify({
                    contractId: contract.id,
                    acceptedTerms: true
                })
            });
            const resSign = await signContract(reqSign);
            const dataSign = await resSign.json();
            if (!dataSign.success) console.error("Failed:", dataSign);
        }
    }

    // 3. Create Microsite (as Admin)
    console.log("\n--- Creating Microsite (as Admin) ---");
    // Switch to Admin Role
    const adminId = "admin_verify_" + Date.now();
    process.env.TEST_USER_ID = adminId;
    process.env.TEST_USER_ROLE = "admin";

    const slug = `verify-${Date.now()}`;

    const reqCreate = new NextRequest("http://localhost/api/admin/microsites", {
        method: 'POST',
        body: JSON.stringify({
            partnerId: testPartnerId, // Use the REAL partner ID
            slug: slug,
            businessName: "Verification Gym",
            primaryColor: "#000000"
        })
    });

    const resCreate = await createMicrosite(reqCreate);
    const resultCreate = await resCreate.json();
    console.log("Creation API Response:", resultCreate.success ? "Success" : resultCreate);

    // 4. Verify in DB (Direct SQL check)
    console.log("\n--- Verifying Database Record ---");
    // The 'microsites' table might be named differently? Let's assume 'microsites'.
    // We can use raw SQL if schema isn't fully imported or if we want to be sure.
    try {
        // NOTE: Using 'any' query if typed schema is tricky to import here
        const result = await db!.execute(sql`SELECT * FROM microsites WHERE slug = ${slug}`);
        if (result.length > 0) {
            console.log("✅ Microsite record found in DB:", result[0].slug);
            console.log("ID:", result[0].id);
            console.log("Partner ID:", result[0].partner_id);
        } else {
            console.error("❌ Microsite record NOT found in DB!");
        }
    } catch (e) {
        console.error("DB Verification Error:", e);
    }
}

main().catch(console.error).finally(() => process.exit(0));
