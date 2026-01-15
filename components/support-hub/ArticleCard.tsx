"use client"

import { motion } from "framer-motion"
import { Clock, ArrowRight, BookOpen, Award, Zap } from "lucide-react"
import { GlassCard } from "./GlassCard"
import { cn } from "@/lib/utils"

type DifficultyLevel = "beginner" | "intermediate" | "advanced"

interface Article {
  id: string
  title: string
  excerpt: string
  readingTime: number
  tags?: string[]
  difficulty?: DifficultyLevel
  category: string
  author?: {
    name: string
    avatar?: string
  }
  publishedAt?: string
  updatedAt?: string
  url: string
}

interface ArticleCardProps {
  article: Article
  onArticleClick?: (article: Article) => void
  index?: number
  className?: string
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  intermediate: {
    label: "Intermediate",
    icon: Zap,
    color: "text-sky-600",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
  },
  advanced: {
    label: "Advanced",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
}

export function ArticleCard({
  article,
  onArticleClick,
  index = 0,
  className,
}: ArticleCardProps) {
  const difficultyInfo = article.difficulty
    ? difficultyConfig[article.difficulty]
    : null

  const DifficultyIcon = difficultyInfo?.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={className}
    >
      <GlassCard
        variant="elevated"
        enable3D={true}
        hoverEffect={true}
        gradientBorder={false}
        onClick={() => onArticleClick?.(article)}
        className="group cursor-pointer h-full"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header with Category & Difficulty */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-xs font-semibold uppercase tracking-wide">
              {article.category}
            </span>

            {difficultyInfo && DifficultyIcon && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  difficultyInfo.bgColor,
                  difficultyInfo.color
                )}
                title={`Difficulty: ${difficultyInfo.label}`}
              >
                <DifficultyIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{difficultyInfo.label}</span>
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide line-clamp-2 group-hover:text-teal-600 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
            {/* Reading Time */}
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.readingTime} min read</span>
            </div>

            {/* Read More */}
            <motion.div
              className="flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:text-teal-700"
              whileHover={{ x: 3 }}
            >
              <span>Read</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Author & Date (Optional) */}
          {article.author && (
            <div className="flex items-center gap-3 pt-3 mt-3 border-t border-slate-200/50">
              {article.author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {article.author.name}
                </p>
                {article.publishedAt && (
                  <p className="text-xs text-slate-500">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={false}
        />
      </GlassCard>
    </motion.div>
  )
}

interface ArticleListProps {
  articles: Article[]
  onArticleClick?: (article: Article) => void
  className?: string
}

export function ArticleList({
  articles,
  onArticleClick,
  className,
}: ArticleListProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          index={index}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  )
}
