import { NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"

// Update user role - ADMIN ONLY
// Admins can change other users' roles (user <-> partner)
export async function PATCH(request: Request) {
  return withAuth(async () => {
    // Require admin authentication - throws 401/403 if not admin
    const { userId: adminId, user: adminUser } = await requireAdmin()

    const { userId, role } = await request.json()

    // Validate userId is provided
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "userId is required" },
        { status: 400 }
      )
    }

    // Only allow valid roles (user, partner - NOT admin to prevent privilege escalation)
    const validRoles = ["user", "partner"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid role. Allowed: user, partner" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Get the target user to verify they exist and get current role
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!targetUser) {
      return NextResponse.json(
        { error: "Not Found", message: "User not found" },
        { status: 404 }
      )
    }

    const previousRole = targetUser.role

    // Update target user's role
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning()

    // Audit logging for role changes
    console.log("[AUDIT] Role change:", {
      timestamp: new Date().toISOString(),
      action: "ROLE_CHANGE",
      adminId,
      adminEmail: adminUser?.email || "unknown",
      targetUserId: userId,
      targetUserEmail: updatedUser.email,
      previousRole,
      newRole: role,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  })
}
