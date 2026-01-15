import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

/**
 * GET /api/admin/knowledge
 * List all knowledge base articles (including unpublished) for admin
 *
 * Query params:
 * - category?: string - Filter by category
 * - isPublished?: boolean - Filter by published status
 * - limit?: number - Number of results (default 50, max 200)
 * - offset?: number - Pagination offset
 * - orderBy?: string - Sort field (default "updated_at")
 * - order?: string - Sort direction (asc/desc, default "desc")
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const isPublished = searchParams.get("isPublished")
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200)
    const offset = parseInt(searchParams.get("offset") || "0", 10)
    const orderBy = searchParams.get("orderBy") || "updated_at"
    const order = searchParams.get("order") === "asc"

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        articles: [],
        total: 0,
        pagination: { limit, offset, hasMore: false },
        message: "Supabase not configured. In-memory articles are read-only.",
      })
    }

    const supabase = createAdminClient()

    let query = supabase
      .from("integration_docs")
      .select("*", { count: "exact" })

    // Apply filters
    if (category) {
      query = query.eq("category", category)
    }
    if (isPublished !== null) {
      query = query.eq("is_published", isPublished === "true")
    }

    // Apply ordering and pagination
    query = query
      .order(orderBy, { ascending: order })
      .range(offset, offset + limit - 1)

    const { data: articles, error, count } = await query

    if (error) {
      console.error("[Admin Knowledge] Query error:", error)
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      )
    }

    // Transform to API response format
    const transformedArticles = (articles || []).map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      category: doc.category,
      posSystem: doc.pos_system,
      framework: doc.framework,
      codeExamples: doc.code_examples ? JSON.parse(doc.code_examples) : [],
      isPublished: doc.is_published,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    }))

    const total = count || 0

    return NextResponse.json({
      articles: transformedArticles,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("[Admin Knowledge] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/knowledge
 * Create a new knowledge base article
 *
 * Request body:
 * - title: string (required)
 * - slug?: string - Auto-generated from title if not provided
 * - content: string (required)
 * - category: string (required) - getting-started, widget-integration, api-reference, pos-integration, troubleshooting
 * - posSystem?: string - For POS-specific articles
 * - framework?: string - For framework-specific articles
 * - codeExamples?: array - Array of code snippets
 * - isPublished?: boolean - Default false (draft)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug: providedSlug,
      content,
      category,
      posSystem,
      framework,
      codeExamples,
      isPublished = false,
    } = body

    // Validation
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Valid categories
    const validCategories = [
      "getting-started",
      "widget-integration",
      "api-reference",
      "pos-integration",
      "troubleshooting",
      "webhook",
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Valid options: ${validCategories.join(", ")}` },
        { status: 400 }
      )
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured. Cannot create articles in read-only mode." },
        { status: 503 }
      )
    }

    const supabase = createAdminClient()

    // Generate slug from title if not provided
    const slug = providedSlug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("integration_docs")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 }
      )
    }

    // Create article
    const articleId = nanoid()
    const timestamp = new Date().toISOString()

    const { data: article, error } = await supabase
      .from("integration_docs")
      .insert({
        id: articleId,
        title,
        slug,
        content,
        category,
        pos_system: posSystem || null,
        framework: framework || null,
        code_examples: codeExamples ? JSON.stringify(codeExamples) : null,
        is_published: isPublished,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select()
      .single()

    if (error) {
      console.error("[Admin Knowledge] Create error:", error)
      return NextResponse.json(
        { error: "Failed to create article" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        category: article.category,
        posSystem: article.pos_system,
        framework: article.framework,
        codeExamples: article.code_examples ? JSON.parse(article.code_examples) : [],
        isPublished: article.is_published,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
      },
      message: "Article created successfully",
    }, { status: 201 })
  } catch (error) {
    console.error("[Admin Knowledge] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
