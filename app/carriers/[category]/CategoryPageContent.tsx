"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  BarChart3,
  Activity,
  Database,
  LineChart,
  Sparkles,
  ChevronRight,
  Building2,
  FileCheck,
  Users,
  Dumbbell,
  Mountain,
  Trophy,
  TrendingUp
} from "lucide-react"
import { CarrierCategoryData, carrierCategories, carrierCategoryIconMap } from "@/lib/carrier-category-data"

// Floating orb component for background decoration
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

const iconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Mountain,
  Trophy,
  Sparkles,
  Shield,
  Activity,
  TrendingUp,
  Users,
  CheckCircle: CheckCircle2,
  Eye: Activity,
  Award: Trophy,
  Wrench: Building2,
  Thermometer: BarChart3,
  BadgeCheck: CheckCircle2,
  Syringe: Activity,
  Building: Building2,
  FileCheck,
  Map: Mountain,
  Cloud: Activity,
  Heart: Activity
}

const colorConfig = {
  teal: {
    gradient: "from-teal-500 to-emerald-500",
    bgLight: "bg-teal-50",
    bgMedium: "bg-teal-100",
    text: "text-teal-600",
    textLight: "text-teal-400",
    border: "border-teal-200",
    hoverBorder: "hover:border-teal-300",
    glow: "from-teal-500/30 to-emerald-500/20"
  },
  sky: {
    gradient: "from-sky-500 to-blue-500",
    bgLight: "bg-sky-50",
    bgMedium: "bg-sky-100",
    text: "text-sky-600",
    textLight: "text-sky-400",
    border: "border-sky-200",
    hoverBorder: "hover:border-sky-300",
    glow: "from-sky-500/30 to-blue-500/20"
  },
  purple: {
    gradient: "from-purple-500 to-violet-500",
    bgLight: "bg-purple-50",
    bgMedium: "bg-purple-100",
    text: "text-purple-600",
    textLight: "text-purple-400",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-300",
    glow: "from-purple-500/30 to-violet-500/20"
  },
  orange: {
    gradient: "from-orange-500 to-amber-500",
    bgLight: "bg-orange-50",
    bgMedium: "bg-orange-100",
    text: "text-orange-600",
    textLight: "text-orange-400",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-300",
    glow: "from-orange-500/30 to-amber-500/20"
  }
}

export default function CategoryPageContent({ category }: { category: CarrierCategoryData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.8])

  const colors = colorConfig[category.color]
  const CategoryIcon = carrierCategoryIconMap[category.icon] || Dumbbell

  return (
    <main ref={containerRef} className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="pt-32 pb-24 text-white relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={category.heroImage}
            alt={category.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
        </div>

        {/* Animated background orbs */}
        <FloatingOrb
          className={`absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br ${colors.glow} rounded-full blur-[100px]`}
          delay={0}
        />
        <FloatingOrb
          className={`absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br ${colors.glow} rounded-full blur-[120px]`}
          delay={2}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-teal-500/10 rounded-full blur-[150px]"
          delay={1}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-6"
            >
              <Link href="/carriers" className="hover:text-white transition-colors">
                For Carriers
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className={colors.textLight}>{category.shortTitle}</span>
            </motion.div>

            {/* Logo badge with category icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                <CategoryIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">{category.title} Coverage</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
            >
              {category.tagline.split(" ").slice(0, 4).join(" ")}
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`}>
                {category.tagline.split(" ").slice(4).join(" ")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              {category.description}
            </motion.p>

            {/* Market Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
              {[
                { label: "Market Size", value: category.marketStats.marketSize },
                { label: "Annual Growth", value: category.marketStats.annualGrowth },
                { label: "Opt-In Rate", value: category.marketStats.optInRate },
                { label: "Avg Premium", value: category.marketStats.avgPremium },
                { label: "Claims Freq", value: category.marketStats.claimsFrequency },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="group relative"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                  <div className="relative backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 shadow-xl hover:border-white/40 transition-all duration-300">
                    <div className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${colors.gradient} text-white font-bold text-lg rounded-2xl transition-all shadow-2xl`}
              >
                Partner With Us
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/carriers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
              >
                View All Categories
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Policy Advantages Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/50 to-transparent rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm ${colors.bgLight} rounded-full ${colors.border} border mb-6 shadow-sm`}
            >
              <Shield className={`w-4 h-4 ${colors.text}`} />
              <span className={`text-sm font-semibold ${colors.text}`}>Policy Advantages</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why This Vertical Is{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`}>
                Perfect for Carriers
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {category.title} offers unique underwriting advantages with real-time activity data and verified participation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {category.policyAdvantages.map((advantage, index) => {
              const Icon = iconMap[advantage.icon] || Shield
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    rotateY: -5,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="group relative"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`} />

                  <div className={`relative h-full backdrop-blur-sm bg-white/80 rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl ${colors.hoverBorder} transition-all duration-500`}>
                    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-5">
                      <motion.div
                        className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{advantage.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{advantage.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Insights Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className={`absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br ${colors.glow} rounded-full blur-[80px]`}
          delay={0.5}
        />
        <FloatingOrb
          className="absolute bottom-20 left-[15%] w-80 h-80 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-full blur-[100px]"
          delay={1.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <Database className={colors.textLight} />
              <span className={`text-sm font-semibold ${colors.textLight}`}>Data Insights</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Rich Data That Powers
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`}>
                Smarter Underwriting
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Every {category.shortTitle.toLowerCase()} policy generates valuable data that improves your risk models and pricing accuracy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.dataInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  rotateX: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group relative"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 h-full">
                  <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-30 flex items-center justify-center flex-shrink-0`}>
                      <LineChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{insight.title}</h3>
                      <p className="text-slate-400">{insight.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Underwriting Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Underwriting Benefits
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              What makes {category.shortTitle.toLowerCase()} coverage uniquely attractive for carriers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} opacity-20 rounded-3xl blur-xl`} />

            <div className="relative backdrop-blur-sm bg-white/80 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.underwritingBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-slate-700 leading-relaxed">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risk Profile Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} opacity-10 rounded-3xl blur-xl`} />

            <div className="relative backdrop-blur-sm bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-lg mx-auto md:mx-0`}>
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">Risk Profile</h3>
                    <span className={`px-4 py-1.5 rounded-full ${colors.bgMedium} ${colors.text} text-sm font-bold`}>
                      {category.riskProfile.category}
                    </span>
                  </div>

                  <p className="text-lg text-slate-600 mb-6">{category.riskProfile.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800">Risk Mitigation Factors:</h4>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {category.riskProfile.mitigationFactors.map((factor, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm text-slate-700 shadow-sm"
                        >
                          {factor}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Platform Integrations
            </h2>
            <p className="text-lg text-slate-600">
              We're integrated with leading {category.shortTitle.toLowerCase()} platforms for seamless distribution.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {category.platforms.map((platform, index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`px-6 py-3 bg-gradient-to-r ${colors.bgLight} rounded-xl border ${colors.border} ${colors.text} font-semibold shadow-sm hover:shadow-md transition-all`}
              >
                {platform}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Explore Other Verticals
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carrierCategories
              .filter((cat) => cat.slug !== category.slug)
              .slice(0, 3)
              .map((cat, index) => {
                const catColors = colorConfig[cat.color]
                const CatIcon = carrierCategoryIconMap[cat.icon] || Dumbbell
                return (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/carriers/${cat.slug}`}>
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group relative h-full"
                      >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${catColors.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300`} />
                        <div className="relative backdrop-blur-sm bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all h-full">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catColors.gradient} flex items-center justify-center mb-4 mx-auto`}>
                            <CatIcon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 text-center mb-2">{cat.shortTitle}</h3>
                          <p className="text-sm text-slate-600 text-center">{cat.marketStats.marketSize} market</p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className={`py-28 bg-gradient-to-br ${colors.gradient} relative overflow-hidden`}>
        <FloatingOrb
          className="absolute top-10 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-[60px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"
          delay={1}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Ready to Enter the {category.shortTitle} Market?
            </motion.h2>
            <motion.p
              className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Partner with HIQOR to access the {category.marketStats.marketSize} {category.shortTitle.toLowerCase()} market
              with embedded, event-triggered distribution.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="mailto:partners@dailyeventinsurance.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-800 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all shadow-2xl"
              >
                Contact Partnerships Team
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/carriers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
              >
                Back to All Carriers
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
