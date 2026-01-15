"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SearchBar } from "@/components/support-hub/SearchBar"
import { CategoryCard } from "@/components/support-hub/CategoryCard"
import { GlassCard } from "@/components/support-hub/GlassCard"
import {
  BookOpen,
  Code,
  HelpCircle,
  Wrench,
  Building2,
  GraduationCap,
  Zap,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react"

const categories = [
  {
    title: "Getting Started",
    description: "Quick start guides, partner onboarding, and coverage basics",
    icon: BookOpen,
    href: "/support-hub/getting-started",
    articles: 12,
    color: "teal"
  },
  {
    title: "Integrations",
    description: "POS systems, widget setup, API documentation, and webhooks",
    icon: Code,
    href: "/support-hub/integrations",
    articles: 18,
    color: "purple"
  },
  {
    title: "FAQ",
    description: "Common questions about partnerships, coverage, and claims",
    icon: HelpCircle,
    href: "/support-hub/faq",
    articles: 24,
    color: "orange"
  },
  {
    title: "Troubleshooting",
    description: "Common issues, error codes, and step-by-step solutions",
    icon: Wrench,
    href: "/support-hub/troubleshooting",
    articles: 15,
    color: "green"
  },
  {
    title: "Enterprise",
    description: "Multi-location setup, white-label, SSO, and analytics",
    icon: Building2,
    href: "/support-hub/enterprise",
    articles: 10,
    color: "blue"
  },
  {
    title: "Training",
    description: "Support agent resources, escalation procedures, and guides",
    icon: GraduationCap,
    href: "/support-hub/training",
    articles: 8,
    color: "rose"
  }
]

const quickActions = [
  {
    title: "Install Widget",
    description: "Add insurance to your site in 5 minutes",
    icon: Zap,
    href: "/support-hub/integrations#widget"
  },
  {
    title: "API Docs",
    description: "Complete REST API reference",
    icon: FileText,
    href: "/support-hub/integrations#api"
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: MessageSquare,
    href: "/support"
  }
]

const popularArticles = [
  { title: "How to set up your first integration", href: "/support-hub/getting-started#integration", views: 2543 },
  { title: "Understanding coverage types and pricing", href: "/support-hub/getting-started#coverage", views: 1892 },
  { title: "Widget installation guide", href: "/support-hub/integrations#widget", views: 1654 },
  { title: "Troubleshooting common API errors", href: "/support-hub/troubleshooting#api-errors", views: 1432 },
  { title: "Multi-location enterprise setup", href: "/support-hub/enterprise#multi-location", views: 987 }
]

const stats = [
  { label: "Total Articles", value: "87", icon: FileText },
  { label: "Active Partners", value: "1,200+", icon: Users },
  { label: "Avg Response Time", value: "< 2h", icon: Clock },
  { label: "Satisfaction Rate", value: "98%", icon: TrendingUp }
]

export default function SupportHubPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search logic here
    console.log("Searching for:", query)
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Partner Support Hub
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Everything You Need
            <span className="block mt-2 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              To Succeed
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive documentation, integration guides, and resources to help you maximize revenue with Daily Event Insurance
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <SearchBar
            onSearch={handleSearch}
            suggestions={[
              "How do I install the widget?",
              "API authentication",
              "Multi-location setup",
              "Webhook configuration",
              "Coverage types explained"
            ]}
          />
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <GlassCard hoverEffect gradientBorder>
                <div className="p-6 group">
                  <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600">
            Find the resources you need to get started, integrate, and scale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Popular Articles
              </h2>
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>

            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Link key={index} href={article.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-teal-50/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {article.views.toLocaleString()} views
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hoverEffect gradientBorder>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">
                    {stat.label}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-6 text-teal-600" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our support team is available 24/7 to help you with any questions or issues
              </p>
              <Link
                href="/support"
                className="
                  inline-flex items-center gap-2 px-8 py-4
                  bg-gradient-to-r from-teal-500 to-blue-500
                  text-white font-bold text-lg rounded-xl
                  hover:shadow-xl hover:shadow-teal-500/30
                  transition-all duration-300
                "
              >
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
