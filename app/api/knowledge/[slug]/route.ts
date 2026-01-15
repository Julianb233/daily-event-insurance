import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import {
  getArticleBySlug,
  getRelatedArticles,
  trackArticleView,
} from "@/lib/support/knowledge-base"

/**
 * GET /api/knowledge/[slug]
 * Get a single knowledge base article by slug
 *
 * Returns:
 * - article: full article object
 * - related: array of related articles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: "Article slug is required" },
        { status: 400 }
      )
    }

    // Try database first if configured
    if (isSupabaseServerConfigured()) {
      try {
        const supabase = createAdminClient()

        const { data: docData, error } = await (supabase as any)
          .from("integration_docs")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single()

        const doc = docData as any

        if (!error && doc) {
          // Get related articles from same category
          const { data: relatedDocs } = await (supabase as any)
            .from("integration_docs")
            .select("id, title, slug, category, content")
            .eq("category", doc.category)
            .eq("is_published", true)
            .neq("id", doc.id)
            .limit(3)

          // Track view (async, don't block response)
          ;(supabase as any)
            .rpc("increment_doc_views", { doc_id: doc.id })
            .then(() => {})
            .catch(() => {})

          const article = {
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            summary: doc.content?.substring(0, 200) + "...",
            content: doc.content,
            category: doc.category,
            posSystem: doc.pos_system,
            framework: doc.framework,
            codeExamples: doc.code_examples ? JSON.parse(doc.code_examples) : [],
            tags: [],
            createdAt: doc.created_at,
            updatedAt: doc.updated_at,
          }

          const related = (relatedDocs || []).map((r: any) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            category: r.category,
            summary: r.content?.substring(0, 150) + "...",
          }))

          return NextResponse.json({
            article,
            related,
            source: "database",
          })
        }
      } catch (dbError) {
        console.warn("[Knowledge API] Database error, falling back to in-memory:", dbError)
      }
    }

    // Fallback to in-memory knowledge base
    const article = getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Track view
    trackArticleView(article.id)

    // Get related articles
    const related = getRelatedArticles(article.id, 3)

    return NextResponse.json({
      article,
      related,
      source: "in-memory",
    })
  } catch (error) {
    console.error("[Knowledge API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}
