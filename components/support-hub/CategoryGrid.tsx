"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Puzzle,
  Code2,
  Wrench,
  HelpCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import { GlassCard } from "./GlassCard"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  articleCount: number
  color: string
}

interface CategoryGridProps {
  categories?: Category[]
  onCategoryClick?: (categoryId: string) => void
}

const defaultCategories: Category[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Quick start guides and onboarding resources",
    icon: BookOpen,
    articleCount: 12,
    color: "teal",
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with POS systems and third-party tools",
    icon: Puzzle,
    articleCount: 18,
    color: "sky",
  },
  {
    id: "api-reference",
    title: "API Reference",
    description: "Complete API documentation and code examples",
    icon: Code2,
    articleCount: 24,
    color: "teal",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Common issues and how to solve them",
    icon: Wrench,
    articleCount: 15,
    color: "sky",
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Frequently asked questions answered",
    icon: HelpCircle,
    articleCount: 20,
    color: "teal",
  },
  {
    id: "training",
    title: "Training & Tutorials",
    description: "Step-by-step video tutorials and guides",
    icon: GraduationCap,
    articleCount: 10,
    color: "sky",
  },
]

export function CategoryGrid({
  categories = defaultCategories,
  onCategoryClick,
}: CategoryGridProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find the answers you need organized by topic
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              onClick={() => onCategoryClick?.(category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface CategoryCardProps {
  category: Category
  index: number
  onClick: () => void
}

function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const Icon = category.icon

  const colorClasses = {
    teal: {
      icon: "text-teal-600",
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
      badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      hover: "group-hover:text-teal-600",
    },
    sky: {
      icon: "text-sky-600",
      iconBg: "bg-sky-100 dark:bg-sky-900/30",
      badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      hover: "group-hover:text-sky-600",
    },
  }

  const colors = colorClasses[category.color as keyof typeof colorClasses]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
    >
      <GlassCard
        variant="elevated"
        enable3D={true}
        hoverEffect={true}
        gradientBorder={true}
        onClick={onClick}
        className="group cursor-pointer h-full"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
              colors.iconBg
            )}
          >
            <Icon className={cn("w-7 h-7", colors.icon)} />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                {category.title}
              </h3>
              <motion.div
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  colors.hover
                )}
                whileHover={{ x: 3 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
            <p className="text-slate-600 mb-4 line-clamp-2">{category.description}</p>
          </div>

          {/* Article Count Badge */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                colors.badge
              )}
            >
              {category.articleCount} Articles
            </span>
            <motion.span
              className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors"
              whileHover={{ x: 2 }}
            >
              Explore →
            </motion.span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
