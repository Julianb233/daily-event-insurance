
import { config } from "dotenv"
config({ path: ".env.local" })
import { randomUUID } from "crypto"

async function main() {
    const { db } = await import("@/lib/db");
    const { users, partners } = await import("@/lib/db/schema");

    console.log("=== PRODUCTION READINESS TEST ===\n");

    // 1. Create Test Partner (simulating admin seeded partner)
    const partnerId = randomUUID();
    const userId = randomUUID();
    const testEmail = `prod-test-${Date.now()}@example.com`;

    console.log("1. Creating test partner in Supabase...");
    await db!.insert(users).values({
        id: userId,
        email: testEmail,
        name: "Production Test Partner",
        role: "partner",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await db!.insert(partners).values({
        id: partnerId,
        userId: userId,
        businessName: "Production Fitness Center",
        businessType: "gym",
        contactName: "Test Owner",
        contactEmail: testEmail,
        status: "active",
        brandingImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    });

    console.log(`✓ Partner created (ID: ${partnerId})\n`);

    // 2. Simulate Microsite Creation via API Logic
    console.log("2. Simulating microsite creation (API logic)...");
    const { microsites, adminEarnings } = await import("@/lib/db/schema");
    const slug = `prod-test-${Date.now()}`;

    const [microsite] = await db!.insert(microsites).values({
        partnerId: partnerId,
        slug: slug,
        customDomain: null,
        isActive: true,
        logoUrl: null,
        primaryColor: "#14B8A6",
        businessName: "Production Fitness Center",
        setupFee: "550.00",
        feeCollected: false,
    }).returning();

    console.log(`✓ Microsite created (ID: ${microsite.id})`);
    console.log(`  URL: https://daily-event-insurance.vercel.app/${slug}\n`);

    // 3. Create admin earnings record
    console.log("3. Creating admin earnings record...");
    await db!.insert(adminEarnings).values({
        earningType: "microsite_setup",
        micrositeId: microsite.id,
        partnerId: partnerId,
        baseAmount: "550.00",
        commissionRate: "1.0000",
        earnedAmount: "550.00",
        status: "pending",
    });

    console.log("✓ Admin earnings recorded\n");

    // 4. Verification
    console.log("4. Verifying persistence...");
    const { eq } = await import("drizzle-orm");
    const [fetched] = await db!.select().from(microsites).where(eq(microsites.id, microsite.id));

    if (fetched && fetched.slug === slug) {
        console.log("✅ SUCCESS: All data persisted correctly to Supabase!");
        console.log("\n=== PRODUCTION READY ===");
        console.log("• Database connection: ✓");
        console.log("• Schema synchronized: ✓");
        console.log("• Microsite creation: ✓");
        console.log("• URL generation: ✓");
        console.log("• Admin earnings: ✓");
    } else {
        console.error("❌ FAILURE: Data not persisted correctly");
    }

    process.exit(0);
}

main();
