import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, articles, articleCategories, users } from "@/lib/db"
import { eq, desc, asc, ilike, or, and, sql, count } from "drizzle-orm"

// Article statuses
export const ARTICLE_STATUSES = ["draft", "published", "archived", "scheduled"] as const
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]

// Portal options
export const PORTAL_OPTIONS = ["all", "partner", "customer", "sales", "public"] as const
export type PortalOption = (typeof PORTAL_OPTIONS)[number]

// Demo articles for when DB is not configured
const DEMO_ARTICLES = [
  {
    id: "demo-1",
    title: "Getting Started with Partner Insurance",
    slug: "getting-started-partner-insurance",
    excerpt: "Learn the basics of offering daily event insurance through your business.",
    content: "# Getting Started\n\nWelcome to our partner program...",
    featuredImageUrl: null,
    categoryId: "demo-cat-1",
    categoryName: "Guides",
    tags: ["onboarding", "basics"],
    authorId: "demo-author-1",
    authorName: "Admin User",
    status: "published",
    publishedAt: new Date().toISOString(),
    views: 234,
    readTimeMinutes: 5,
    portals: ["all"],
    isFeatured: true,
    isPinned: false,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Understanding Commission Tiers",
    slug: "understanding-commission-tiers",
    excerpt: "A comprehensive guide to how commission tiers work and how to maximize earnings.",
    content: "# Commission Tiers Explained\n\nOur tiered commission structure...",
    featuredImageUrl: null,
    categoryId: "demo-cat-1",
    categoryName: "Guides",
    tags: ["commissions", "earnings"],
    authorId: "demo-author-1",
    authorName: "Admin User",
    status: "published",
    publishedAt: new Date().toISOString(),
    views: 156,
    readTimeMinutes: 8,
    portals: ["partner"],
    isFeatured: false,
    isPinned: false,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "New Coverage Options for 2025",
    slug: "new-coverage-options-2025",
    excerpt: "Announcing expanded coverage options for event insurance.",
    content: "# New Coverage Options\n\nWe're excited to announce...",
    featuredImageUrl: null,
    categoryId: "demo-cat-2",
    categoryName: "Announcements",
    tags: ["coverage", "updates"],
    authorId: "demo-author-1",
    authorName: "Admin User",
    status: "draft",
    publishedAt: null,
    views: 0,
    readTimeMinutes: 3,
    portals: ["all"],
    isFeatured: false,
    isPinned: false,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const DEMO_CATEGORIES = [
  { id: "demo-cat-1", name: "Guides", slug: "guides", description: "How-to guides and tutorials", color: "#14B8A6", sortOrder: 0, isActive: true },
  { id: "demo-cat-2", name: "Announcements", slug: "announcements", description: "Platform updates and news", color: "#3B82F6", sortOrder: 1, isActive: true },
  { id: "demo-cat-3", name: "Tips & Best Practices", slug: "tips-best-practices", description: "Expert advice and recommendations", color: "#8B5CF6", sortOrder: 2, isActive: true },
]

// Helper to calculate read time
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * GET /api/admin/articles
 * Get all articles with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const portal = searchParams.get("portal") || ""
    const sortBy = searchParams.get("sortBy") || "updatedAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // If db is not configured, return demo data
    if (!isDbConfigured()) {
      let filteredArticles = [...DEMO_ARTICLES]

      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase()
        filteredArticles = filteredArticles.filter(
          (a) => a.title.toLowerCase().includes(searchLower) || a.excerpt?.toLowerCase().includes(searchLower)
        )
      }
      if (status) {
        filteredArticles = filteredArticles.filter((a) => a.status === status)
      }
      if (categoryId) {
        filteredArticles = filteredArticles.filter((a) => a.categoryId === categoryId)
      }

      // Pagination
      const total = filteredArticles.length
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      const paginatedArticles = filteredArticles.slice(offset, offset + limit)

      return NextResponse.json({
        success: true,
        articles: paginatedArticles,
        categories: DEMO_CATEGORIES,
        pagination: { page, limit, total, totalPages },
        source: "demo",
      })
    }

    // Build query conditions
    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.excerpt, `%${search}%`)
        )
      )
    }

    if (status && ARTICLE_STATUSES.includes(status as ArticleStatus)) {
      conditions.push(eq(articles.status, status))
    }

    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId))
    }

    // Get total count
    const [{ value: total }] = await db!
      .select({ value: count() })
      .from(articles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    // Get articles with category join
    const orderColumn = sortBy === "title" ? articles.title :
                        sortBy === "publishedAt" ? articles.publishedAt :
                        sortBy === "views" ? articles.views :
                        sortBy === "createdAt" ? articles.createdAt :
                        articles.updatedAt

    const orderDirection = sortOrder === "asc" ? asc : desc

    const articleResults = await db!
      .select({
        article: articles,
        categoryName: articleCategories.name,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderDirection(orderColumn))
      .limit(limit)
      .offset((page - 1) * limit)

    // Get categories for filter dropdown
    const categories = await db!
      .select()
      .from(articleCategories)
      .where(eq(articleCategories.isActive, true))
      .orderBy(asc(articleCategories.sortOrder))

    const totalPages = Math.ceil(Number(total) / limit)

    return NextResponse.json({
      success: true,
      articles: articleResults.map((r) => ({
        ...r.article,
        categoryName: r.categoryName,
      })),
      categories,
      pagination: { page, limit, total: Number(total), totalPages },
      source: "database",
    })
  })
}

/**
 * POST /api/admin/articles
 * Create a new article
 */
export async function POST(request: NextRequest) {
  return withAuth(async (currentUser) => {
    await requireAdmin()

    const body = await request.json()
    const {
      title,
      slug: providedSlug,
      excerpt,
      content,
      featuredImageUrl,
      featuredImageAlt,
      categoryId,
      tags,
      status,
      publishedAt,
      scheduledFor,
      seoTitle,
      seoDescription,
      seoKeywords,
      portals,
      isFeatured,
      isPinned,
      sortOrder,
    } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = providedSlug || generateSlug(title)
    const readTimeMinutes = calculateReadTime(content)

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      const newArticle = {
        id: `demo-${Date.now()}`,
        title,
        slug,
        excerpt,
        content,
        featuredImageUrl,
        featuredImageAlt,
        categoryId,
        tags: tags || [],
        authorId: currentUser?.id || "demo-author",
        authorName: currentUser?.name || "Admin User",
        status: status || "draft",
        publishedAt: status === "published" ? new Date().toISOString() : publishedAt,
        scheduledFor,
        seoTitle,
        seoDescription,
        seoKeywords,
        portals: portals || ["all"],
        isFeatured: isFeatured || false,
        isPinned: isPinned || false,
        sortOrder: sortOrder || 0,
        views: 0,
        readTimeMinutes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        article: newArticle,
        message: "Article created (demo mode)",
      })
    }

    // Check for duplicate slug
    const existingSlug = await db!
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1)

    if (existingSlug.length > 0) {
      return NextResponse.json(
        { success: false, error: "An article with this slug already exists" },
        { status: 400 }
      )
    }

    const [newArticle] = await db!
      .insert(articles)
      .values({
        title,
        slug,
        excerpt,
        content,
        featuredImageUrl,
        featuredImageAlt,
        categoryId: categoryId || null,
        tags: tags || [],
        authorId: currentUser?.id || null,
        authorName: currentUser?.name || "Admin",
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : publishedAt ? new Date(publishedAt) : null,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        seoTitle,
        seoDescription,
        seoKeywords,
        portals: portals || ["all"],
        isFeatured: isFeatured || false,
        isPinned: isPinned || false,
        sortOrder: sortOrder || 0,
        readTimeMinutes,
      })
      .returning()

    return NextResponse.json({
      success: true,
      article: newArticle,
      message: "Article created successfully",
    })
  })
}

/**
 * PUT /api/admin/articles
 * Update an existing article
 */
export async function PUT(request: NextRequest) {
  return withAuth(async (currentUser) => {
    await requireAdmin()

    const body = await request.json()
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl,
      featuredImageAlt,
      categoryId,
      tags,
      status,
      publishedAt,
      scheduledFor,
      seoTitle,
      seoDescription,
      seoKeywords,
      portals,
      isFeatured,
      isPinned,
      sortOrder,
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Article ID is required" },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        article: {
          id,
          title,
          slug,
          excerpt,
          content,
          updatedAt: new Date().toISOString(),
        },
        message: "Article updated (demo mode)",
      })
    }

    // Check if slug changed and is unique
    if (slug) {
      const existingSlug = await db!
        .select({ id: articles.id })
        .from(articles)
        .where(and(eq(articles.slug, slug), sql`${articles.id} != ${id}`))
        .limit(1)

      if (existingSlug.length > 0) {
        return NextResponse.json(
          { success: false, error: "An article with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const readTimeMinutes = content ? calculateReadTime(content) : undefined

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) {
      updateData.content = content
      updateData.readTimeMinutes = readTimeMinutes
    }
    if (featuredImageUrl !== undefined) updateData.featuredImageUrl = featuredImageUrl
    if (featuredImageAlt !== undefined) updateData.featuredImageAlt = featuredImageAlt
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (tags !== undefined) updateData.tags = tags
    if (status !== undefined) {
      updateData.status = status
      if (status === "published" && !publishedAt) {
        updateData.publishedAt = new Date()
      }
    }
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    if (scheduledFor !== undefined) updateData.scheduledFor = scheduledFor ? new Date(scheduledFor) : null
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords
    if (portals !== undefined) updateData.portals = portals
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isPinned !== undefined) updateData.isPinned = isPinned
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    const [updatedArticle] = await db!
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning()

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
      message: "Article updated successfully",
    })
  })
}

/**
 * DELETE /api/admin/articles
 * Delete an article
 */
export async function DELETE(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Article ID is required" },
        { status: 400 }
      )
    }

    // If db is not configured, return mock success
    if (!isDbConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Article deleted (demo mode)",
      })
    }

    const [deletedArticle] = await db!
      .delete(articles)
      .where(eq(articles.id, id))
      .returning()

    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    })
  })
}
