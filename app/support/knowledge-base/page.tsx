"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, BookOpen, Rocket, Code, Layout, Wrench, Lightbulb, CreditCard,
    ArrowRight, Clock, Tag, ChevronRight, TrendingUp
} from "lucide-react"
import Link from "next/link"

// Knowledge Base Types and Data
interface Article {
    id: string
    slug: string
    title: string
    summary: string
    category: ArticleCategory
    tags: string[]
    lastUpdated: string
    readTime: number
    featured?: boolean
    popular?: boolean
}

type ArticleCategory =
    | "getting-started"
    | "api-integration"
    | "widget-setup"
    | "troubleshooting"
    | "best-practices"
    | "billing"

interface CategoryInfo {
    id: ArticleCategory
    name: string
    description: string
    icon: React.ElementType
    color: string
    articleCount: number
}

// Category definitions
const categories: CategoryInfo[] = [
    {
        id: "getting-started",
        name: "Getting Started",
        description: "Learn the basics of setting up your partner account and first integration.",
        icon: Rocket,
        color: "teal",
        articleCount: 5
    },
    {
        id: "api-integration",
        name: "API Integration",
        description: "Technical documentation for integrating with our REST API.",
        icon: Code,
        color: "blue",
        articleCount: 4
    },
    {
        id: "widget-setup",
        name: "Widget Setup",
        description: "Configure and customize the insurance widget for your platform.",
        icon: Layout,
        color: "purple",
        articleCount: 3
    },
    {
        id: "troubleshooting",
        name: "Troubleshooting",
        description: "Solutions to common issues and error messages.",
        icon: Wrench,
        color: "orange",
        articleCount: 3
    },
    {
        id: "best-practices",
        name: "Best Practices",
        description: "Tips and strategies to maximize enrollment and revenue.",
        icon: Lightbulb,
        color: "green",
        articleCount: 3
    },
    {
        id: "billing",
        name: "Billing & Payouts",
        description: "Commission structure, payouts, and financial reporting.",
        icon: CreditCard,
        color: "indigo",
        articleCount: 3
    }
]

// Articles data
const articles: Article[] = [
    // Getting Started
    {
        id: "1",
        slug: "partner-account-setup",
        title: "Creating Your Partner Account",
        summary: "Sign up and set up your partner account in under 5 minutes with our step-by-step guide.",
        category: "getting-started",
        tags: ["account", "setup", "onboarding"],
        lastUpdated: "2024-01-10",
        readTime: 3,
        featured: true,
        popular: true
    },
    {
        id: "2",
        slug: "platform-overview",
        title: "Platform Overview & Features",
        summary: "Discover all the features available in your partner dashboard and how to use them.",
        category: "getting-started",
        tags: ["overview", "features", "dashboard"],
        lastUpdated: "2024-01-08",
        readTime: 5,
        featured: true
    },
    {
        id: "3",
        slug: "first-integration-guide",
        title: "Your First Integration: Step-by-Step",
        summary: "Complete walkthrough of integrating Daily Event Insurance into your platform.",
        category: "getting-started",
        tags: ["integration", "setup", "tutorial"],
        lastUpdated: "2024-01-12",
        readTime: 8,
        popular: true
    },
    {
        id: "4",
        slug: "dashboard-navigation",
        title: "Navigating Your Partner Dashboard",
        summary: "Learn how to navigate the dashboard efficiently and find key features quickly.",
        category: "getting-started",
        tags: ["dashboard", "navigation", "ui"],
        lastUpdated: "2024-01-05",
        readTime: 4
    },
    {
        id: "5",
        slug: "event-types-coverage",
        title: "Understanding Event Types & Coverage",
        summary: "Overview of supported event types and their corresponding coverage options.",
        category: "getting-started",
        tags: ["events", "coverage", "policies"],
        lastUpdated: "2024-01-03",
        readTime: 6
    },

    // API Integration
    {
        id: "6",
        slug: "api-authentication",
        title: "API Authentication & Security",
        summary: "Learn how to securely authenticate API requests with your partner credentials.",
        category: "api-integration",
        tags: ["api", "authentication", "security"],
        lastUpdated: "2024-01-11",
        readTime: 6,
        featured: true
    },
    {
        id: "7",
        slug: "api-endpoints-reference",
        title: "API Endpoints Reference",
        summary: "Complete reference documentation for all available API endpoints.",
        category: "api-integration",
        tags: ["api", "endpoints", "reference"],
        lastUpdated: "2024-01-13",
        readTime: 10,
        popular: true
    },
    {
        id: "8",
        slug: "webhook-configuration",
        title: "Webhook Configuration Guide",
        summary: "Set up webhooks to receive real-time notifications about policy events.",
        category: "api-integration",
        tags: ["webhooks", "events", "notifications"],
        lastUpdated: "2024-01-09",
        readTime: 7
    },
    {
        id: "9",
        slug: "api-code-samples",
        title: "API Code Samples & SDKs",
        summary: "Ready-to-use code examples in JavaScript, Python, PHP, and more.",
        category: "api-integration",
        tags: ["api", "code", "sdk", "examples"],
        lastUpdated: "2024-01-13",
        readTime: 8
    },

    // Widget Setup
    {
        id: "10",
        slug: "widget-customization",
        title: "Widget Customization Options",
        summary: "Customize colors, fonts, and layout to match your brand perfectly.",
        category: "widget-setup",
        tags: ["widget", "customization", "branding"],
        lastUpdated: "2024-01-10",
        readTime: 6,
        featured: true
    },
    {
        id: "11",
        slug: "widget-embedding",
        title: "Embedding the Widget on Your Site",
        summary: "Multiple methods to add the insurance widget to your website or app.",
        category: "widget-setup",
        tags: ["widget", "embed", "javascript"],
        lastUpdated: "2024-01-07",
        readTime: 4,
        popular: true
    },
    {
        id: "12",
        slug: "widget-events",
        title: "Widget Events & Callbacks",
        summary: "Handle widget events and callbacks for a seamless user experience.",
        category: "widget-setup",
        tags: ["widget", "events", "callbacks"],
        lastUpdated: "2024-01-06",
        readTime: 5
    },

    // Troubleshooting
    {
        id: "13",
        slug: "common-integration-errors",
        title: "Common Integration Errors & Fixes",
        summary: "Solutions to the most common issues partners encounter during integration.",
        category: "troubleshooting",
        tags: ["errors", "troubleshooting", "debugging"],
        lastUpdated: "2024-01-11",
        readTime: 7,
        featured: true,
        popular: true
    },
    {
        id: "14",
        slug: "testing-sandbox-mode",
        title: "Using Test/Sandbox Mode",
        summary: "How to use sandbox mode for safe testing without real transactions.",
        category: "troubleshooting",
        tags: ["testing", "sandbox", "development"],
        lastUpdated: "2024-01-08",
        readTime: 4
    },
    {
        id: "15",
        slug: "debugging-webhooks",
        title: "Debugging Webhook Issues",
        summary: "Troubleshoot webhook delivery problems and signature verification.",
        category: "troubleshooting",
        tags: ["webhooks", "debugging", "errors"],
        lastUpdated: "2024-01-04",
        readTime: 5
    },

    // Best Practices
    {
        id: "16",
        slug: "maximizing-enrollment",
        title: "Maximizing Insurance Enrollment Rates",
        summary: "Proven strategies to increase insurance opt-in rates by 40% or more.",
        category: "best-practices",
        tags: ["enrollment", "conversion", "marketing"],
        lastUpdated: "2024-01-12",
        readTime: 8,
        featured: true,
        popular: true
    },
    {
        id: "17",
        slug: "marketing-insurance-participants",
        title: "Marketing Insurance to Participants",
        summary: "Effective messaging and channels for promoting insurance to your users.",
        category: "best-practices",
        tags: ["marketing", "communication", "email"],
        lastUpdated: "2024-01-09",
        readTime: 6
    },
    {
        id: "18",
        slug: "seasonal-planning",
        title: "Seasonal Planning for Events",
        summary: "Plan your insurance offerings around peak seasons and event calendars.",
        category: "best-practices",
        tags: ["planning", "seasonal", "strategy"],
        lastUpdated: "2024-01-02",
        readTime: 5
    },

    // Billing
    {
        id: "19",
        slug: "commission-structure",
        title: "Understanding Your Commission Structure",
        summary: "How commissions are calculated and how to maximize your earnings.",
        category: "billing",
        tags: ["commission", "earnings", "revenue"],
        lastUpdated: "2024-01-11",
        readTime: 5,
        featured: true
    },
    {
        id: "20",
        slug: "payout-schedule",
        title: "Payout Schedule & Methods",
        summary: "When and how you receive your commission payments.",
        category: "billing",
        tags: ["payouts", "payments", "banking"],
        lastUpdated: "2024-01-10",
        readTime: 4
    },
    {
        id: "21",
        slug: "tax-documentation",
        title: "Tax Documentation & 1099s",
        summary: "Information about tax forms, documentation, and reporting requirements.",
        category: "billing",
        tags: ["taxes", "1099", "documentation"],
        lastUpdated: "2024-01-05",
        readTime: 3
    }
]

// Helper functions
function getArticlesByCategory(categoryId: ArticleCategory): Article[] {
    return articles.filter(article => article.category === categoryId)
}

function getFeaturedArticles(): Article[] {
    return articles.filter(article => article.featured)
}

function getPopularArticles(): Article[] {
    return articles.filter(article => article.popular)
}

function getRecentArticles(limit: number = 5): Article[] {
    return [...articles]
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, limit)
}

function searchArticles(query: string): Article[] {
    const lowerQuery = query.toLowerCase()
    return articles.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.summary.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
}

function getCategoryColor(color: string): string {
    const colorMap: Record<string, string> = {
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-green-50 text-green-600 border-green-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
    }
    return colorMap[color] || colorMap.teal
}

function getCategoryIconBg(color: string): string {
    const colorMap: Record<string, string> = {
        teal: "bg-teal-100 text-teal-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        orange: "bg-orange-100 text-orange-600",
        green: "bg-green-100 text-green-600",
        indigo: "bg-indigo-100 text-indigo-600"
    }
    return colorMap[color] || colorMap.teal
}

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(null)

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return []
        return searchArticles(searchQuery)
    }, [searchQuery])

    const featuredArticles = getFeaturedArticles()
    const popularArticles = getPopularArticles()
    const recentArticles = getRecentArticles(5)

    const displayedArticles = activeCategory
        ? getArticlesByCategory(activeCategory)
        : searchQuery
            ? searchResults
            : null

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section with Search */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 mb-6">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Knowledge Base
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            Find answers, learn best practices, and get the most out of your Daily Event Insurance partnership.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setActiveCategory(null)
                                }}
                                placeholder="Search for articles, topics, or keywords..."
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    <span className="text-sm">Clear</span>
                                </button>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            <span className="text-slate-400 text-sm">Popular:</span>
                            {["Getting Started", "API Setup", "Widget", "Commissions"].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm hover:bg-slate-700 transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Search Results or Category Articles */}
            <AnimatePresence mode="wait">
                {displayedArticles && (
                    <motion.section
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="py-12 bg-white border-b border-slate-100"
                    >
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {activeCategory
                                            ? categories.find(c => c.id === activeCategory)?.name
                                            : `Search Results`}
                                    </h2>
                                    <p className="text-slate-600">
                                        {displayedArticles.length} article{displayedArticles.length !== 1 ? "s" : ""} found
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveCategory(null)
                                        setSearchQuery("")
                                    }}
                                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                                >
                                    Clear filter
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedArticles.map((article, index) => (
                                    <ArticleCard key={article.id} article={article} index={index} />
                                ))}
                            </div>

                            {displayedArticles.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-slate-600 text-lg">No articles found matching your search.</p>
                                    <p className="text-slate-500 mt-2">Try different keywords or browse categories below.</p>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Categories Grid */}
            {!displayedArticles && (
                <>
                    <section className="py-16">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
                                <p className="text-lg text-slate-600">
                                    Find the information you need organized by topic
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((category, index) => (
                                    <motion.button
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setActiveCategory(category.id)}
                                        className="bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all text-left group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getCategoryIconBg(category.color)}`}>
                                            <category.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-slate-600 mb-4">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                {getArticlesByCategory(category.id).length} articles
                                            </span>
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Popular Articles */}
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-teal-600 uppercase tracking-wide">Most Popular</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900">Popular Articles</h2>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {popularArticles.slice(0, 6).map((article, index) => (
                                    <ArticleCard key={article.id} article={article} index={index} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Recent Updates */}
                    <section className="py-16">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Recently Updated</h2>
                                <p className="text-slate-600">Stay up to date with our latest documentation changes</p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                                {recentArticles.map((article, index) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={`/support/knowledge-base/${article.slug}`}
                                            className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(categories.find(c => c.id === article.category)?.color || "teal")}`}>
                                                        {categories.find(c => c.id === article.category)?.name}
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        Updated {new Date(article.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                                                    {article.title}
                                                </h3>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Can&apos;t Find What You&apos;re Looking For?
                    </h2>
                    <p className="text-lg text-teal-100 mb-8">
                        Our support team is here to help you succeed. Reach out anytime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/support/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
                        >
                            Contact Support
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/support"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors font-semibold"
                        >
                            Visit Support Hub
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

// Article Card Component
function ArticleCard({ article, index }: { article: Article; index: number }) {
    const category = categories.find(c => c.id === article.category)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                href={`/support/knowledge-base/${article.slug}`}
                className="block bg-white p-6 rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all h-full group"
            >
                <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(category?.color || "teal")}`}>
                        {category?.name}
                    </span>
                    {article.popular && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600">
                            Popular
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {article.summary}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {article.tags.slice(0, 2).join(", ")}
                    </span>
                </div>
            </Link>
        </motion.div>
    )
}
