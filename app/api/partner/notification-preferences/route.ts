import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requirePartner, withAuth } from "@/lib/api-auth"

/**
 * Notification preferences structure
 */
export interface NotificationPreferences {
  changeRequests: {
    submitted: boolean
    approved: boolean
    rejected: boolean
    completed: boolean
  }
  marketing: boolean
  reports: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  changeRequests: {
    submitted: true,
    approved: true,
    rejected: true,
    completed: true,
  },
  marketing: true,
  reports: true,
}

// GET /api/partner/notification-preferences - Get current preferences
// SECURITY: Requires partner authentication
export async function GET() {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    try {
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      const [partner] = await db
        .select({
          notificationPreferences: partners.notificationPreferences,
        })
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // Merge with defaults to ensure all fields exist
      const preferences = {
        ...DEFAULT_PREFERENCES,
        ...(partner.notificationPreferences as Partial<NotificationPreferences> || {}),
      }

      return NextResponse.json({
        success: true,
        preferences,
      })
    } catch (error) {
      console.error("Error fetching notification preferences:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch preferences" },
        { status: 500 }
      )
    }
  })
}

// PUT /api/partner/notification-preferences - Update preferences
// SECURITY: Requires partner authentication
export async function PUT(request: Request) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    try {
      const body = await request.json()
      const { preferences } = body

      if (!preferences) {
        return NextResponse.json(
          { success: false, error: "Preferences are required" },
          { status: 400 }
        )
      }

      // Validate structure
      if (preferences.changeRequests !== undefined) {
        const cr = preferences.changeRequests
        if (
          typeof cr.submitted !== "boolean" ||
          typeof cr.approved !== "boolean" ||
          typeof cr.rejected !== "boolean" ||
          typeof cr.completed !== "boolean"
        ) {
          return NextResponse.json(
            { success: false, error: "Invalid changeRequests preferences" },
            { status: 400 }
          )
        }
      }

      if (preferences.marketing !== undefined && typeof preferences.marketing !== "boolean") {
        return NextResponse.json(
          { success: false, error: "Invalid marketing preference" },
          { status: 400 }
        )
      }

      if (preferences.reports !== undefined && typeof preferences.reports !== "boolean") {
        return NextResponse.json(
          { success: false, error: "Invalid reports preference" },
          { status: 400 }
        )
      }

      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get current preferences to merge
      const [partner] = await db
        .select({
          id: partners.id,
          notificationPreferences: partners.notificationPreferences,
        })
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // Deep merge preferences
      const currentPrefs = (partner.notificationPreferences as NotificationPreferences) || DEFAULT_PREFERENCES
      const updatedPrefs: NotificationPreferences = {
        changeRequests: {
          ...currentPrefs.changeRequests,
          ...preferences.changeRequests,
        },
        marketing: preferences.marketing ?? currentPrefs.marketing,
        reports: preferences.reports ?? currentPrefs.reports,
      }

      // Update
      await db
        .update(partners)
        .set({
          notificationPreferences: updatedPrefs,
          updatedAt: new Date(),
        })
        .where(eq(partners.id, partner.id))

      return NextResponse.json({
        success: true,
        preferences: updatedPrefs,
        message: "Preferences updated successfully",
      })
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update preferences" },
        { status: 500 }
      )
    }
  })
}
