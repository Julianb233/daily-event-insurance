import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { articles, articleCategories, getArticleBySlug, getRelatedArticles, type ArticleSection } from "@/lib/articles-data"
import { Clock, ArrowLeft, ArrowRight, Share2, Bookmark, CheckCircle, AlertTriangle, Info, Lightbulb } from "lucide-react"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  }
}

function renderSection(section: ArticleSection, index: number) {
  switch (section.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-lg text-slate-700 leading-relaxed mb-6">
          {section.content}
        </p>
      )

    case 'heading':
      return (
        <h2 key={index} className="text-2xl font-bold text-slate-900 mt-12 mb-6">
          {section.content}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={index} className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          {section.content}
        </h3>
      )

    case 'list':
      return (
        <ul key={index} className="space-y-3 mb-6 ml-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-slate-700">
              <span className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-teal-500 pl-6 py-2 my-8 bg-slate-50 rounded-r-lg">
          <p className="text-xl italic text-slate-700 leading-relaxed">
            {section.content}
          </p>
        </blockquote>
      )

    case 'callout':
      const variants = {
        tip: {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: Lightbulb,
          iconColor: 'text-amber-600',
          label: 'Pro Tip'
        },
        warning: {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          label: 'Warning'
        },
        info: {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          label: 'Info'
        },
        success: {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          label: 'Success'
        }
      }
      const variant = variants[section.variant || 'info']
      const Icon = variant.icon

      return (
        <div key={index} className={`${variant.bg} ${variant.border} border rounded-xl p-6 my-8`}>
          <div className="flex items-start gap-4">
            <Icon className={`w-6 h-6 ${variant.iconColor} flex-shrink-0 mt-0.5`} />
            <div>
              <span className={`font-semibold ${variant.iconColor} block mb-1`}>{variant.label}</span>
              <p className="text-slate-700">{section.content}</p>
            </div>
          </div>
        </div>
      )

    case 'stats':
      return (
        <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
          {section.stats?.map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-xl p-5 text-center border border-teal-100">
              <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = getRelatedArticles(article)
  const category = articleCategories.find(c => c.id === article.category)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Daily Event Insurance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dailyeventinsurance.com/images/logo-color.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dailyeventinsurance.com/blog/${article.slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-white">
        {/* Article Header */}
        <section className="relative pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link href="/blog" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                All Articles
              </Link>
              <span>/</span>
              <span className="text-slate-700">{category?.label}</span>
            </nav>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                {category?.label}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="text-slate-400 text-sm">
                Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Author & Actions */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{article.author.name}</p>
                  <p className="text-sm text-slate-500">{article.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg prose-slate max-w-none">
              {article.content.map((section, index) => renderSection(section, index))}
            </article>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-500 mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => {
                  const relatedCategory = articleCategories.find(c => c.id === related.category)
                  return (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all h-full flex flex-col">
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                              {relatedCategory?.label}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              {related.readTime}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-slate-600 text-sm flex-1 line-clamp-2">
                            {related.excerpt}
                          </p>
                          <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-100">
                            <span className="flex items-center gap-1 text-sm text-teal-600 font-medium group-hover:gap-2 transition-all">
                              Read more
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Apply for partnership today and start generating insurance commissions within 24 hours.
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
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Browse More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
