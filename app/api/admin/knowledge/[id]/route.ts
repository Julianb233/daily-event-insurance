import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

/**
 * GET /api/admin/knowledge/[id]
 * Get a single knowledge base article by ID (admin view)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      )
    }

    const supabase = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: doc, error } = await (supabase as any)
      .from("integration_docs")
      .select("*")
      .eq("id", id)
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (error || !doc) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      article: {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        category: doc.category,
        posSystem: doc.pos_system,
        framework: doc.framework,
        codeExamples: doc.code_examples ? JSON.parse(doc.code_examples as string) : [],
        embedding: doc.embedding ? true : false, // Just indicate if embedding exists
        isPublished: doc.is_published,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
      },
    })
  } catch (error) {
    console.error("[Admin Knowledge] GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/knowledge/[id]
 * Update a knowledge base article
 *
 * Request body (all optional):
 * - title?: string
 * - slug?: string
 * - content?: string
 * - category?: string
 * - posSystem?: string | null
 * - framework?: string | null
 * - codeExamples?: array
 * - isPublished?: boolean
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      )
    }

    const supabase = createAdminClient()

    // Check if article exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from("integration_docs")
      .select("id")
      .eq("id", id)
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Map camelCase to snake_case and validate
    const fieldMap: Record<string, string> = {
      title: "title",
      slug: "slug",
      content: "content",
      category: "category",
      posSystem: "pos_system",
      framework: "framework",
      codeExamples: "code_examples",
      isPublished: "is_published",
    }

    for (const [camelKey, snakeKey] of Object.entries(fieldMap)) {
      if (body[camelKey] !== undefined) {
        if (camelKey === "codeExamples") {
          updateData[snakeKey] = JSON.stringify(body[camelKey])
        } else {
          updateData[snakeKey] = body[camelKey]
        }
      }
    }

    // If slug is being updated, check for uniqueness
    if (body.slug) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: slugExists } = await (supabase as any)
        .from("integration_docs")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .single() as { data: Record<string, unknown> | null; error: unknown }

      if (slugExists) {
        return NextResponse.json(
          { error: "An article with this slug already exists" },
          { status: 409 }
        )
      }
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = [
        "getting-started",
        "widget-integration",
        "api-reference",
        "pos-integration",
        "troubleshooting",
        "webhook",
      ]
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: `Invalid category. Valid options: ${validCategories.join(", ")}` },
          { status: 400 }
        )
      }
    }

    // Update article
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase as any)
      .from("integration_docs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (error || !updated) {
      console.error("[Admin Knowledge] Update error:", error)
      return NextResponse.json(
        { error: "Failed to update article" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      article: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        content: updated.content,
        category: updated.category,
        posSystem: updated.pos_system,
        framework: updated.framework,
        codeExamples: updated.code_examples ? JSON.parse(updated.code_examples as string) : [],
        isPublished: updated.is_published,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
      message: "Article updated successfully",
    })
  } catch (error) {
    console.error("[Admin Knowledge] PATCH error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/knowledge/[id]
 * Delete a knowledge base article
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      )
    }

    const supabase = createAdminClient()

    // Check if article exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from("integration_docs")
      .select("id, title")
      .eq("id", id)
      .single() as { data: Record<string, unknown> | null; error: unknown }

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Delete the article
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("integration_docs")
      .delete()
      .eq("id", id) as { error: unknown }

    if (error) {
      console.error("[Admin Knowledge] Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete article" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Article "${existing.title}" deleted successfully`,
    })
  } catch (error) {
    console.error("[Admin Knowledge] DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}
