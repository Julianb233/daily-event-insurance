import { NextRequest, NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const ADMIN_EMAILS = [
  "julianb233@gmail.com",
  "julian@aiacrobatics.com",
]

/**
 * POST /api/admin/seed
 * Seeds admin users - requires a secret key for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secretKey, password } = body

    // Verify secret key matches AUTH_SECRET
    if (secretKey !== process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const results = []
    const passwordHash = await bcrypt.hash(password, 10)

    for (const email of ADMIN_EMAILS) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        // Update existing user to admin role and reset password
        await db
          .update(users)
          .set({ 
            role: "admin", 
            passwordHash,
            updatedAt: new Date() 
          })
          .where(eq(users.email, email))
        results.push({ email, action: "updated", role: "admin" })
      } else {
        // Create new admin user
        await db.insert(users).values({
          email,
          name: "Julian Bradley",
          passwordHash,
          role: "admin",
        })
        results.push({ email, action: "created", role: "admin" })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin users seeded successfully",
      results,
    })
  } catch (error) {
    console.error("[Admin Seed] Error:", error)
    return NextResponse.json(
      { error: "Failed to seed admin users" },
      { status: 500 }
    )
  }
}
