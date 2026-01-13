
import { config } from "dotenv"
config({ path: ".env.local" })

async function main() {
    const { db } = await import("@/lib/db");
    const { partners } = await import("@/lib/db/schema");
    console.log("Testing Drizzle on Partners...");
    try {
        const result = await db!.select().from(partners).limit(1);
        console.log("Partners Result:", result);
    } catch (err: any) {
        console.error("Drizzle Error:", err);
        console.error("Error Stack:", err.stack);
    }
    process.exit(0);
}

main();
