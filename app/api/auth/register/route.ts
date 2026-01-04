import { NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { registrationRateLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit"
import {
  validateRegistration,
  validatePasswordStrength,
  isCommonPassword,
  getPasswordRequirements,
} from "@/lib/password-policy"

export async function POST(request: Request) {
  try {
    // Rate limiting - 3 registrations per hour per IP
    const clientIP = getClientIP(request)
    const { success: withinLimit, remaining } = registrationRateLimiter.check(clientIP)

    if (!withinLimit) {
      return rateLimitResponse(60 * 60 * 1000) // 1 hour
    }

    // Parse request body
    let requestBody: unknown
    try {
      requestBody = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    // Validate registration data using Zod schema
    const validation = validateRegistration(requestBody)
    if (!validation.valid) {
      // Check if password-specific errors exist for better UX
      const passwordErrors = validation.errors.filter(e => e.field === 'password')
      const otherErrors = validation.errors.filter(e => e.field !== 'password')

      if (passwordErrors.length > 0 && otherErrors.length === 0) {
        // Only password errors - return password-specific message
        return NextResponse.json(
          {
            error: "Password does not meet security requirements",
            details: passwordErrors,
            requirements: getPasswordRequirements(),
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
          requirements: getPasswordRequirements(),
        },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data!

    // Enhanced password strength validation (includes common password check)
    const passwordStrength = validatePasswordStrength(password)
    if (!passwordStrength.valid) {
      return NextResponse.json(
        {
          error: "Password does not meet security requirements",
          details: passwordStrength.errors,
          warnings: passwordStrength.warnings,
          requirements: getPasswordRequirements(),
        },
        { status: 400 }
      )
    }

    // Additional check: Block passwords that contain common patterns
    if (isCommonPassword(password)) {
      return NextResponse.json(
        {
          error: "Password is too common",
          details: ["Please choose a more unique password that is not commonly used"],
          requirements: getPasswordRequirements(),
        },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      // Generic message to prevent account enumeration
      return NextResponse.json(
        { error: "Unable to create account. Please try again or contact support." },
        { status: 400 }
      )
    }

    // Hash password with bcrypt (cost factor 12 for security)
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: name || null,
        email, // Already lowercase and trimmed by Zod transform
        passwordHash,
        role: "user",
      })
      .returning()

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    )
  }
}
