
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

import { db, microsites } from "@/lib/db"

async function main() {
    // Dynamic import to ensure env is loaded first if needed, though top-level import might be too early if db init is immediate.
    // Actually db init usually happens at top level of standard import.
    // But dotenv config needs to happen BEFORE that import.
    // So distinct import is better. But ESM import hoisting might be an issue.
    // So let's use require or dynamic import for db.

    // In TS with esModuleInterop, we can just ensure dotenv runs first? 
    // No, static imports are hoisted.
    // So I need to move the db import to dynamic or ensure this file is JS execution order friendly.
    // npx tsx handles prompt execution.

    // Changing to dynamic import for safety.
    const { db, microsites } = await import("@/lib/db")

    if (!db) {
        console.error("No DB connection (db is null)")
        process.exit(1)
    }
    const sites = await db.select().from(microsites).limit(5)
    console.log("Found microsites:", sites.map(s => s.slug))
    process.exit(0)
}
main()
