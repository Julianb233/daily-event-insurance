/**
 * Seed admin users via Supabase
 * Run with: npx tsx scripts/seed-admin-supabase.ts
 * 
 * Requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { config } from "dotenv"

config({ path: ".env.local" })


const ADMIN_USERS = [
  { email: "julianb233@gmail.com", name: "Julian Bradley" },
  { email: "julian@aiacrobatics.com", name: "Julian Bradley" },
]

const DEFAULT_PASSWORD = "Admin123!" // Change this after first login!

async function seedAdmins() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  console.log("Seeding admin users via Supabase...")

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  for (const admin of ADMIN_USERS) {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", admin.email)
      .single()

    if (existingUser) {
      // Update to admin role and reset password
      const { error } = await supabase
        .from("users")
        .update({
          role: "admin",
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq("email", admin.email)

      if (error) {
        console.error(`❌ Failed to update ${admin.email}:`, error.message)
      } else {
        console.log(`✅ Updated ${admin.email} to admin role`)
      }
    } else {
      // Create new admin user
      const { error } = await supabase
        .from("users")
        .insert({
          email: admin.email,
          name: admin.name,
          password_hash: passwordHash,
          role: "admin",
        })

      if (error) {
        console.error(`❌ Failed to create ${admin.email}:`, error.message)
      } else {
        console.log(`✅ Created admin user: ${admin.email}`)
      }
    }
  }

  console.log("\n✅ Admin seeding complete!")
  console.log(`Default password: ${DEFAULT_PASSWORD}`)
  console.log("⚠️  Change your password after first login!")
  process.exit(0)
}

seedAdmins().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
