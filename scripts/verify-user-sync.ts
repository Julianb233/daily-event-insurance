
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
}

import { desc } from "drizzle-orm"
import { users } from "@/lib/db/schema"

async function main() {
    // Dynamically import DB
    const { db } = await import("@/lib/db")

    if (!db) {
        console.error("❌ Database connection not available")
        process.exit(1)
    }

    console.log("🔍 Fetching latest users from DB...\n")

    const latestUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(5)

    if (latestUsers.length === 0) {
        console.log("❌ No users found in the database.")
    } else {
        console.log(`✅ Found ${latestUsers.length} users (showing latest 5):\n`)
        latestUsers.forEach((user, index) => {
            console.log(`[${index + 1}] Email: ${user.email}`)
            console.log(`    Name: ${user.name}`)
            console.log(`    Role: ${user.role}`)
            console.log(`    ID: ${user.id}`)
            console.log(`    Created: ${user.createdAt}`)
            console.log(`----------------------------------------`)
        })
    }
    process.exit(0)
}

main().catch(console.error)
