import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, articleCategories } from "@/lib/db"
import { eq, desc, asc, count } from "drizzle-orm"

// Demo categories for when DB is not configured
const DEMO_CATEGORIES = [
  { id: "demo-cat-1", name: "Guides", slug: "guides", description: "How-to guides and tutorials", color: "#14B8A6", sortOrder: 0, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "demo-cat-2", name: "Announcements", slug: "announcements", description: "Platform updates and news", color: "#3B82F6", sortOrder: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "demo-cat-3", name: "Tips & Best Practices", slug: "tips-best-practices", description: "Expert advice and recommendations", color: "#8B5CF6", sortOrder: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "demo-cat-4", name: "Industry News", slug: "industry-news", description: "Insurance and event industry updates", color: "#F59E0B", sortOrder: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

// Helper to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * GET /api/admin/articles/categories
 * Get all article categories
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    // If db is not configured, return demo data
    if (!isDbConfigured()) {
      const categories = activeOnly
        ? DEMO_CATEGORIES.filter(c => c.isActive)
        : DEMO_CATEGORIES

      return NextResponse.json({
        success: true,
        categories,
        source: "demo",
      })
    }

    const conditions = activeOnly ? eq(articleCategories.isActive, true) : undefined

    const categories = await db!
      .select()
      .from(articleCategories)
      .where(conditions)
      .orderBy(asc(articleCategories.sortOrder), asc(articleCategories.name))

    return NextResponse.json({
      success: true,
      categories,
      source: "database",
    })
  })
}

/**
 * POST /api/admin/articles/categories
 * Create a new article category
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const body = await request.json()
    const { name, slug: providedSlug, description, color, sortOrder, isActive } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      )
    }

    const slug = providedSlug || generateSlug(name)

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      const newCategory = {
        id: `demo-${Date.now()}`,
        name,
        slug,
        description,
        color: color || "#14B8A6",
        sortOrder: sortOrder || 0,
        isActive: isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        category: newCategory,
        message: "Category created (demo mode)",
      })
    }

    // Check for duplicate slug
    const existingSlug = await db!
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(eq(articleCategories.slug, slug))
      .limit(1)

    if (existingSlug.length > 0) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists" },
        { status: 400 }
      )
    }

    const [newCategory] = await db!
      .insert(articleCategories)
      .values({
        name,
        slug,
        description,
        color: color || "#14B8A6",
        sortOrder: sortOrder || 0,
        isActive: isActive !== false,
      })
      .returning()

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category created successfully",
    })
  })
}

/**
 * PUT /api/admin/articles/categories
 * Update an existing article category
 */
export async function PUT(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const body = await request.json()
    const { id, name, slug, description, color, sortOrder, isActive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        category: {
          id,
          name,
          slug,
          description,
          color,
          sortOrder,
          isActive,
          updatedAt: new Date().toISOString(),
        },
        message: "Category updated (demo mode)",
      })
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder
    if (isActive !== undefined) updateData.isActive = isActive

    const [updatedCategory] = await db!
      .update(articleCategories)
      .set(updateData)
      .where(eq(articleCategories.id, id))
      .returning()

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: "Category updated successfully",
    })
  })
}

/**
 * DELETE /api/admin/articles/categories
 * Delete an article category
 */
export async function DELETE(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Category deleted (demo mode)",
      })
    }

    const [deletedCategory] = await db!
      .delete(articleCategories)
      .where(eq(articleCategories.id, id))
      .returning()

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  })
}
