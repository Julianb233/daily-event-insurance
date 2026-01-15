"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  articles: number
  color?: string
}

export function CategoryCard({
  title,
  description,
  icon: Icon,
  href,
  articles,
  color = "teal"
}: CategoryCardProps) {
  const colorClasses = {
    teal: "from-teal-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-indigo-500",
    rose: "from-rose-500 to-pink-500",
  }

  const bgColorClasses = {
    teal: "bg-teal-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
    green: "bg-green-50",
    blue: "bg-blue-50",
    rose: "bg-rose-50",
  }

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <div className="
          h-full p-8
          bg-white/70 backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
          hover:shadow-[0_16px_48px_0_rgba(31,38,135,0.25)]
          transition-all duration-300
          relative overflow-hidden
        ">
          {/* Gradient overlay */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}
            transition-opacity duration-500
            mix-blend-soft-light
          `} />

          {/* Icon */}
          <div className={`
            w-16 h-16 mb-6 rounded-2xl
            ${bgColorClasses[color as keyof typeof bgColorClasses]}
            flex items-center justify-center
            relative z-10
            group-hover:scale-110
            transition-transform duration-300
          `}>
            <Icon className={`w-8 h-8 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent`} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-900 group-hover:to-teal-600 transition-all duration-300">
              {title}
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {articles} {articles === 1 ? "article" : "articles"}
              </span>
              <ArrowRight className="w-5 h-5 text-teal-500 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
