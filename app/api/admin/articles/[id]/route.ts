import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, articles, articleCategories } from "@/lib/db"
import { eq } from "drizzle-orm"

// Demo article for when DB is not configured
const DEMO_ARTICLE = {
  id: "demo-1",
  title: "Getting Started with Partner Insurance",
  slug: "getting-started-partner-insurance",
  excerpt: "Learn the basics of offering daily event insurance through your business.",
  content: `# Getting Started with Partner Insurance

Welcome to our partner program! This comprehensive guide will help you understand how to effectively offer daily event insurance to your customers.

## What is Daily Event Insurance?

Daily event insurance provides coverage for specific events, activities, or rentals on a per-day basis. This is perfect for:

- Fitness studios offering day passes
- Equipment rental businesses
- Event venues hosting private functions
- Recreational facilities

## Getting Your Account Set Up

1. **Complete your profile** - Make sure all business information is accurate
2. **Configure your products** - Select which insurance products you want to offer
3. **Set up your integration** - Choose between widget, API, or manual methods
4. **Test your setup** - Run through the customer experience

## Best Practices

- Always clearly display insurance options to customers
- Train your staff on explaining coverage benefits
- Keep track of your metrics in the partner dashboard

Need help? Contact our partner support team at partner-support@example.com`,
  featuredImageUrl: null,
  featuredImageAlt: null,
  categoryId: "demo-cat-1",
  categoryName: "Guides",
  tags: ["onboarding", "basics", "getting-started"],
  authorId: "demo-author-1",
  authorName: "Admin User",
  status: "published",
  publishedAt: new Date().toISOString(),
  scheduledFor: null,
  seoTitle: "Getting Started with Partner Insurance | Daily Event Insurance",
  seoDescription: "A comprehensive guide to getting started with our partner insurance program.",
  seoKeywords: "partner insurance, event insurance, getting started",
  canonicalUrl: null,
  views: 234,
  readTimeMinutes: 5,
  portals: ["all"],
  isFeatured: true,
  isPinned: false,
  sortOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * GET /api/admin/articles/[id]
 * Get a single article by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    await requireAdmin()

    const { id } = await params

    // If db is not configured, return demo data
    if (!isDbConfigured()) {
      if (id.startsWith("demo-")) {
        return NextResponse.json({
          success: true,
          article: DEMO_ARTICLE,
          source: "demo",
        })
      }
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    const [articleResult] = await db!
      .select({
        article: articles,
        categoryName: articleCategories.name,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .where(eq(articles.id, id))
      .limit(1)

    if (!articleResult) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      article: {
        ...articleResult.article,
        categoryName: articleResult.categoryName,
      },
      source: "database",
    })
  })
}
