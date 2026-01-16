import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import {
  searchArticles,
  getArticlesByCategory,
  getPopularArticles,
} from "@/lib/support/knowledge-base"
import type { ArticleCategory } from "@/lib/support/types"

/**
 * GET /api/knowledge
 * List knowledge base articles with filtering and pagination
 *
 * Query params:
 * - category?: string - Filter by category (getting-started, widget-integration, api-reference, pos-integration, troubleshooting)
 * - posSystem?: string - Filter by POS system (mindbody, pike13, square, etc.)
 * - framework?: string - Filter by framework (react, vue, nextjs, etc.)
 * - search?: string - Text search query
 * - popular?: boolean - If true, return popular articles sorted by views
 * - limit?: number - Number of results (default 20, max 100)
 * - offset?: number - Pagination offset (default 0)
 *
 * Returns:
 * - articles: array of knowledge articles
 * - total: number - Total count matching filters
 * - pagination: { limit, offset, hasMore }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get("category") as ArticleCategory | null
    const posSystem = searchParams.get("posSystem")
    const framework = searchParams.get("framework")
    const search = searchParams.get("search")
    const popular = searchParams.get("popular") === "true"
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    // If search query provided, use the search function
    if (search) {
      const results = searchArticles(search, limit)
      return NextResponse.json({
        articles: results.map((r) => ({
          ...r.article,
          relevanceScore: r.relevanceScore,
          snippet: r.snippet,
        })),
        total: results.length,
        pagination: { limit, offset: 0, hasMore: false },
      })
    }

    // If popular requested, return popular articles
    if (popular) {
      const articles = getPopularArticles(limit)
      return NextResponse.json({
        articles,
        total: articles.length,
        pagination: { limit, offset: 0, hasMore: false },
      })
    }

    // Try database first if configured
    if (isSupabaseServerConfigured()) {
      try {
        const supabase = createAdminClient()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase as any)
          .from("integration_docs")
          .select("*", { count: "exact" })
          .eq("is_published", true)

        // Apply filters
        if (category) {
          query = query.eq("category", category)
        }
        if (posSystem) {
          query = query.eq("pos_system", posSystem)
        }
        if (framework) {
          query = query.eq("framework", framework)
        }

        // Apply pagination and ordering
        query = query
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        const { data: articles, error, count } = await query as { data: Record<string, unknown>[] | null; error: unknown; count: number | null }

        if (!error && articles && articles.length > 0) {
          // Transform to API response format
          const transformedArticles = articles.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            summary: (doc.content as string | undefined)?.substring(0, 200) + "...",
            content: doc.content,
            category: doc.category,
            posSystem: doc.pos_system,
            framework: doc.framework,
            codeExamples: doc.code_examples ? JSON.parse(doc.code_examples as string) : [],
            tags: [],
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
            source: "database",
          })
        }
      } catch (dbError) {
        console.warn("[Knowledge API] Database error, falling back to in-memory:", dbError)
      }
    }

    // Fallback to in-memory knowledge base
    let articles = category
      ? getArticlesByCategory(category)
      : getPopularArticles(100) // Get all if no category filter

    const total = articles.length

    // Apply pagination
    articles = articles.slice(offset, offset + limit)

    return NextResponse.json({
      articles,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      source: "in-memory",
    })
  } catch (error) {
    console.error("[Knowledge API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch knowledge articles" },
      { status: 500 }
    )
  }
}
