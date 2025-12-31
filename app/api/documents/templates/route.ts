import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { documentTemplates } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { demoDocuments, DOCUMENT_TYPES } from "@/lib/demo-documents"

// GET /api/documents/templates - List all active document templates
export async function GET() {
  try {
    // If db is configured, try to get templates from database
    if (db) {
      const dbTemplates = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.isActive, true))
        .orderBy(documentTemplates.type)

      // If we have templates in DB, return those
      if (dbTemplates.length > 0) {
        return NextResponse.json({
          success: true,
          templates: dbTemplates.map((t) => ({
            id: t.id,
            type: t.type,
            title: t.title,
            content: t.content,
            version: t.version,
          })),
          source: "database",
        })
      }
    }

    // Otherwise, return demo documents as fallback
    // This ensures the onboarding flow works even before admin adds templates
    return NextResponse.json({
      success: true,
      templates: demoDocuments.map((doc, index) => ({
        id: `demo-${index}`,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        version: doc.version,
      })),
      source: "demo",
    })
  } catch (error) {
    console.error("Error fetching document templates:", error)

    // Fallback to demo documents on any error
    return NextResponse.json({
      success: true,
      templates: demoDocuments.map((doc, index) => ({
        id: `demo-${index}`,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        version: doc.version,
      })),
      source: "demo-fallback",
    })
  }
}

// POST /api/documents/templates - Create a new template (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, title, content, version = "1.0" } = body

    if (!type || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, title, content" },
        { status: 400 }
      )
    }

    // Validate type is one of allowed types
    const validTypes = Object.values(DOCUMENT_TYPES)
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Check database connection
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    // Deactivate existing template of same type
    await db
      .update(documentTemplates)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(documentTemplates.type, type))

    // Create new template
    const [newTemplate] = await db
      .insert(documentTemplates)
      .values({
        type,
        title,
        content,
        version,
        isActive: true,
      })
      .returning()

    return NextResponse.json({
      success: true,
      template: newTemplate,
    })
  } catch (error) {
    console.error("Error creating document template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    )
  }
}
