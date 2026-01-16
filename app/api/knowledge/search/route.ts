import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { searchArticles, getSuggestedArticles } from "@/lib/support/knowledge-base"

/**
 * POST /api/knowledge/search
 * Search knowledge base articles with semantic/full-text search
 *
 * Request body:
 * - query: string - Search query (required)
 * - category?: string - Filter by category
 * - limit?: number - Max results (default 5, max 20)
 * - context?: object - Additional context for suggestions
 *   - topic?: string - Current topic/page
 *   - recentMessages?: string[] - Recent chat messages for context
 *   - errorType?: string - Type of error if troubleshooting
 *
 * Returns:
 * - results: array of search results with relevance scores
 * - suggestions: array of suggested articles based on context
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category, limit = 5, context } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    const maxLimit = Math.min(limit, 20)

    // Try database search first if configured
    if (isSupabaseServerConfigured()) {
      try {
        const supabase = createAdminClient()

        // Use Postgres full-text search
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let searchQuery = (supabase as any)
          .from("integration_docs")
          .select("*")
          .eq("is_published", true)
          .textSearch("title", query, { type: "websearch" })

        if (category) {
          searchQuery = searchQuery.eq("category", category)
        }

        searchQuery = searchQuery.limit(maxLimit)

        const { data: titleResults, error: titleError } = await searchQuery as { data: Record<string, unknown>[] | null; error: unknown }

        // Also search content if title search returns few results
        let contentResults: Record<string, unknown>[] = []
        if (!titleError && (!titleResults || titleResults.length < maxLimit)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: contentData } = await (supabase as any)
            .from("integration_docs")
            .select("*")
            .eq("is_published", true)
            .textSearch("content", query, { type: "websearch" })
            .limit(maxLimit - (titleResults?.length || 0)) as { data: Record<string, unknown>[] | null; error: unknown }

          contentResults = contentData || []
        }

        // Combine and deduplicate results
        const allResults = [...(titleResults || []), ...contentResults] as any[]
        const uniqueResults = Array.from(
          new Map(allResults.map((r: any) => [r.id, r])).values()
        ).slice(0, maxLimit) as any[]

        if (uniqueResults.length > 0) {
          const results = uniqueResults.map((doc: any) => ({
            article: {
              id: doc.id,
              title: doc.title,
              slug: doc.slug,
              summary: (doc.content as string | undefined)?.substring(0, 200) + "...",
              category: doc.category,
              posSystem: doc.pos_system,
              framework: doc.framework,
            },
            relevanceScore: 1, // DB doesn't provide score
            snippet: generateSnippet((doc.content as string) || "", query),
            matchedTerms: query.split(/\s+/),
          }))

          // Get suggestions based on context
          const suggestions = context
            ? getSuggestedArticles(context)
            : []

          return NextResponse.json({
            results,
            suggestions,
            total: results.length,
            source: "database",
          })
        }
      } catch (dbError) {
        console.warn("[Knowledge Search] Database error, falling back to in-memory:", dbError)
      }
    }

    // Fallback to in-memory search
    const searchResults = searchArticles(query, maxLimit)

    // Get suggestions if context provided
    const suggestions = context
      ? getSuggestedArticles(context)
      : []

    return NextResponse.json({
      results: searchResults.map((r) => ({
        article: {
          id: r.article.id,
          title: r.article.title,
          slug: r.article.slug,
          summary: r.article.summary,
          category: r.article.category,
          tags: r.article.tags,
        },
        relevanceScore: r.relevanceScore,
        snippet: r.snippet,
        matchedTerms: r.matchedTerms,
      })),
      suggestions: suggestions.map((s) => ({
        article: {
          id: s.article.id,
          title: s.article.title,
          slug: s.article.slug,
          summary: s.article.summary,
        },
        reason: s.reason,
        confidence: s.confidence,
      })),
      total: searchResults.length,
      source: "in-memory",
    })
  } catch (error) {
    console.error("[Knowledge Search] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}

// Generate a snippet around the search term
function generateSnippet(content: string, query: string, contextLength: number = 100): string {
  const plainText = content.replace(/[#*`\n]/g, " ").replace(/\s+/g, " ").trim()
  const queryTerms = query.toLowerCase().split(/\s+/)

  // Find first matching term
  let matchIndex = -1
  for (const term of queryTerms) {
    matchIndex = plainText.toLowerCase().indexOf(term)
    if (matchIndex !== -1) break
  }

  if (matchIndex === -1) {
    return plainText.slice(0, contextLength * 2) + "..."
  }

  const start = Math.max(0, matchIndex - contextLength)
  const end = Math.min(plainText.length, matchIndex + contextLength)

  let snippet = plainText.slice(start, end)
  if (start > 0) snippet = "..." + snippet
  if (end < plainText.length) snippet = snippet + "..."

  return snippet
}
