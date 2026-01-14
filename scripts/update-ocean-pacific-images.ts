import { db, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

async function main() {
    const { db, microsites } = await import("@/lib/db")

    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }

    console.log("🚀 Updating Ocean Pacific Gym Images...")

    await db.update(microsites)
        .set({
            logoUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=200&auto=format&fit=crop",
            isActive: true
        })
        .where(eq(microsites.slug, "ocean-pacific-gym"))

    console.log("✅ Updated images successfully.")
    process.exit(0)
}

main().catch(console.error)
