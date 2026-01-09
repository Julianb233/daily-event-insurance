import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { articles, articleCategories } from "@/lib/articles-data"
import { Clock, ArrowRight, BookOpen, TrendingUp, Shield, Users, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Business Owner Resources | Daily Event Insurance Blog",
  description: "Educational articles and guides for business owners on event insurance, revenue growth, compliance, and best practices. Learn how to maximize your insurance partnership.",
  openGraph: {
    title: "Business Owner Resources | Daily Event Insurance Blog",
    description: "Educational articles and guides for business owners on event insurance, revenue growth, compliance, and best practices.",
    type: "website",
  },
}

const categoryIcons: Record<string, React.ElementType> = {
  'getting-started': Rocket,
  'revenue': TrendingUp,
  'operations': BookOpen,
  'compliance': Shield,
  'case-studies': Users,
}

export default function BlogPage() {
  // Get featured article (first one)
  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-medium rounded-full mb-4">
                Resource Center
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Business Owner{" "}
                <span className="text-teal-600">Resources</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Everything you need to know about adding event insurance as a revenue stream.
                Guides, best practices, and real success stories from partners.
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
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
              >
                All Articles
              </Link>
              {articleCategories.map((category) => {
                const Icon = categoryIcons[category.id] || BookOpen
                return (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Featured Article</h2>
            </div>
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group block"
            >
              <article className="relative bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10" />
                <div className="relative p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm font-medium rounded-full">
                      {articleCategories.find(c => c.id === featuredArticle.category)?.label}
                    </span>
                    <span className="flex items-center gap-1 text-white/80 text-sm">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:underline decoration-2 underline-offset-4">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-lg text-white/90 mb-6 max-w-3xl">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                        {featuredArticle.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{featuredArticle.author.name}</p>
                        <p className="text-white/70 text-sm">{featuredArticle.author.role}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Read Article
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* All Articles Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">All Articles</h2>
              <p className="text-slate-600 mt-2">Explore our complete library of business resources</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article) => {
                const CategoryIcon = categoryIcons[article.category] || BookOpen
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all h-full flex flex-col">
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                            <CategoryIcon className="w-3.5 h-3.5" />
                            {articleCategories.find(c => c.id === article.category)?.label}
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
              Get started in less than 24 hours.
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
