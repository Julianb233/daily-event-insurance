/**
 * Seed admin users script
 * Run with: npx tsx scripts/seed-admin.ts
 */
import { db, users } from "../lib/db"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const ADMIN_USERS = [
  { email: "julianb233@gmail.com", name: "Julian Bradley" },
  { email: "julian@aiacrobatics.com", name: "Julian Bradley" },
]

async function seedAdmins() {
  if (!db) {
    console.error("Database not configured. Check your .env.local file.")
    process.exit(1)
  }

  console.log("Seeding admin users...")

  for (const admin of ADMIN_USERS) {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, admin.email))
      .limit(1)

    if (existingUser) {
      // Update existing user to admin role
      await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.email, admin.email))
      console.log(`✅ Updated ${admin.email} to admin role`)
    } else {
      // Create new admin user with a temporary password
      const tempPassword = "Admin123!"
      const passwordHash = await bcrypt.hash(tempPassword, 10)

      await db.insert(users).values({
        email: admin.email,
        name: admin.name,
        passwordHash,
        role: "admin",
      })
      console.log(`✅ Created admin user: ${admin.email} (password: ${tempPassword})`)
    }
  }

  console.log("\nAdmin seeding complete!")
  console.log("You can now log in at /sign-in with these credentials.")
  process.exit(0)
}

seedAdmins().catch((error) => {
  console.error("Error seeding admins:", error)
  process.exit(1)
})
