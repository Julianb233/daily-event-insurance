import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { articleCategories, getArticlesByCategory, type Article } from "@/lib/articles-data"
import { Clock, ArrowRight, ArrowLeft, BookOpen, TrendingUp, Shield, Users, Rocket } from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categoryIcons: Record<string, React.ElementType> = {
  'getting-started': Rocket,
  'revenue': TrendingUp,
  'operations': BookOpen,
  'compliance': Shield,
  'case-studies': Users,
}

export async function generateStaticParams() {
  return articleCategories.map((category) => ({
    category: category.id,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = articleCategories.find(c => c.id === category)

  if (!categoryInfo) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${categoryInfo.label} | Daily Event Insurance Resources`,
    description: `${categoryInfo.description} Browse articles about ${categoryInfo.label.toLowerCase()} for event insurance partners.`,
    openGraph: {
      title: `${categoryInfo.label} | Daily Event Insurance Resources`,
      description: categoryInfo.description,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryInfo = articleCategories.find(c => c.id === category)

  if (!categoryInfo) {
    notFound()
  }

  const articles = getArticlesByCategory(category as Article['category'])
  const CategoryIcon = categoryIcons[category] || BookOpen

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link href="/blog" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                All Articles
              </Link>
              <span>/</span>
              <span className="text-slate-700">{categoryInfo.label}</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl mb-6">
                <CategoryIcon className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {categoryInfo.label}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {categoryInfo.description}
              </p>
              <p className="text-slate-500 mt-4">
                {articles.length} article{articles.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/blog"
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
              >
                All Articles
              </Link>
              {articleCategories.map((cat) => {
                const Icon = categoryIcons[cat.id] || BookOpen
                const isActive = cat.id === category
                return (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.id}`}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                  const ArticleCategoryIcon = categoryIcons[article.category] || BookOpen
                  return (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all h-full flex flex-col">
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                              <ArticleCategoryIcon className="w-3.5 h-3.5" />
                              {categoryInfo.label}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-sm font-semibold">
                                {article.author.name.charAt(0)}
                              </div>
                              <span className="text-sm text-slate-600">{article.author.name}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Articles Yet</h2>
                <p className="text-slate-600 mb-8">
                  We are working on adding content to this category. Check back soon!
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse All Articles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Add Insurance Revenue to Your Business?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join hundreds of partners already earning commissions while protecting their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Apply for Partnership
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                View Commission Rates
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
