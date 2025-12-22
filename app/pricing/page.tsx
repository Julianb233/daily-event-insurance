"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, Check, Sparkles, Zap, Crown, Rocket, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

// Pricing tiers - Content can be updated from Notion
const pricingTiers = [
  {
    id: 1,
    name: "Discovery Session",
    tagline: "Start Your AI Journey",
    price: "Free",
    priceDetail: "One-time consultation",
    description: "Perfect for businesses exploring AI automation and wanting to understand the possibilities.",
    icon: Sparkles,
    features: [
      "60-minute strategy session",
      "AI readiness assessment",
      "Custom roadmap outline",
      "Technology recommendations",
      "Q&A with AI expert",
    ],
    cta: "Book Free Session",
    featured: false,
    gradient: "from-[#0D6B4F]/50 to-[#0A4D3C]/50",
  },
  {
    id: 2,
    name: "AI Automation Starter",
    tagline: "Automate Your First Workflow",
    price: "$5,000",
    priceDetail: "One-time project",
    description: "Implement your first AI-powered workflow and start seeing immediate ROI.",
    icon: Zap,
    features: [
      "1 custom AI workflow automation",
      "Integration with existing tools",
      "30 days of support & optimization",
      "Team training session",
      "Documentation & handoff",
      "Performance analytics dashboard",
    ],
    cta: "Get Started",
    featured: false,
    gradient: "from-[#0D6B4F]/60 to-[#0A4D3C]/60",
  },
  {
    id: 3,
    name: "Growth Accelerator",
    tagline: "Scale With AI Agents",
    price: "$15,000",
    priceDetail: "Monthly retainer",
    description: "Deploy multiple AI agents and automation workflows to transform your entire operation.",
    icon: Crown,
    features: [
      "3-5 AI agent implementations",
      "Custom BottleneckBots deployment",
      "Unlimited workflow automations",
      "Priority support (24/7)",
      "Weekly optimization sessions",
      "Advanced analytics & reporting",
      "Dedicated success manager",
      "Integration with all major platforms",
    ],
    cta: "Transform Your Business",
    featured: true,
    gradient: "from-[#D4A84B]/30 to-[#0D6B4F]/50",
  },
  {
    id: 4,
    name: "Enterprise AI",
    tagline: "Full AI Transformation",
    price: "Custom",
    priceDetail: "Tailored to your needs",
    description: "Complete AI transformation with custom solutions, dedicated team, and ongoing strategic partnership.",
    icon: Rocket,
    features: [
      "Unlimited AI agents & workflows",
      "Custom AI model development",
      "Enterprise-grade security & compliance",
      "Dedicated AI team & support",
      "Strategic planning & consultation",
      "White-label solutions available",
      "API access & custom integrations",
      "SLA guarantees",
      "Quarterly business reviews",
    ],
    cta: "Let's Talk",
    featured: false,
    gradient: "from-[#0D6B4F]/70 to-[#0A4D3C]/70",
  },
]

// Add-on services
const addons = [
  {
    name: "Training & Workshops",
    description: "Custom AI training sessions for your team",
    price: "Starting at $2,500",
  },
  {
    name: "AI Audit",
    description: "Comprehensive analysis of AI opportunities in your business",
    price: "$3,500",
  },
  {
    name: "Priority Support",
    description: "24/7 dedicated support with 1-hour response time",
    price: "$1,500/month",
  },
]

// Sparkles animation
const sparkles = [
  { left: "5%", top: "15%", delay: 0, size: "lg" },
  { left: "92%", top: "20%", delay: 0.5, size: "md" },
  { left: "8%", top: "75%", delay: 0.3, size: "lg" },
  { left: "88%", top: "70%", delay: 0.8, size: "md" },
  { left: "50%", top: "10%", delay: 0.2, size: "sm" },
  { left: "95%", top: "45%", delay: 0.7, size: "lg" },
  { left: "3%", top: "50%", delay: 1.0, size: "md" },
  { left: "15%", top: "35%", delay: 0.4, size: "sm" },
  { left: "85%", top: "85%", delay: 0.9, size: "lg" },
  { left: "40%", top: "5%", delay: 1.1, size: "md" },
  { left: "70%", top: "60%", delay: 0.6, size: "sm" },
  { left: "25%", top: "90%", delay: 1.2, size: "md" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-4 h-4 md:w-6 md:h-6"
    case "md":
      return "w-3 h-3 md:w-4 md:h-4"
    default:
      return "w-2 h-2 md:w-3 md:h-3"
  }
}

export default function PricingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <main className="relative min-h-screen bg-[#0A4D3C] overflow-x-hidden">
      <Header />

      {/* Golden Sparkles */}
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
          style={{ left: sparkle.left, top: sparkle.top }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 1, 0],
            scale: [0, 1.3, 0.9, 1.3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3.5,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="#D4A84B"
              style={{ filter: "drop-shadow(0 0 10px rgba(212,168,75,0.95))" }}
            />
          </svg>
        </motion.div>
      ))}

      <div className="pt-40 md:pt-48 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#D4A84B] hover:text-[#E8C55A] transition-all duration-300 mb-8 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="font-medium group-hover:underline underline-offset-4">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 text-center"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A84B]/10 rounded-full mb-6 border border-[#D4A84B]/30"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(212,168,75,0.2)",
                  "0 0 30px rgba(212,168,75,0.4)",
                  "0 0 20px rgba(212,168,75,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-5 h-5 text-[#D4A84B]" />
              <span className="text-[#D4A84B] font-bold text-sm uppercase tracking-wider">Investment in Your Future</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-tight mb-6"
              animate={{
                textShadow: [
                  "0 0 20px rgba(212,168,75,0.3)",
                  "0 0 40px rgba(212,168,75,0.5)",
                  "0 0 20px rgba(212,168,75,0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="block text-[#FDF8E8]">PRICING &</span>
              <motion.span
                className="block text-[#D4A84B]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Packages
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-[#F0D98C] max-w-3xl mx-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Choose the perfect package to transform your business with AI automation. Every journey starts with a conversation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A84B]/20 border border-[#D4A84B]/40 rounded-full"
            >
              <svg className="w-4 h-4 text-[#D4A84B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-[#D4A84B] text-sm font-semibold">Currently booking 4-6 weeks out</span>
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`group relative ${tier.featured ? 'lg:scale-105' : ''}`}
                style={{ perspective: "1000px" }}
                onMouseEnter={() => setHoveredCard(tier.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className={`relative h-full bg-gradient-to-br ${tier.gradient} rounded-3xl overflow-hidden border ${
                    tier.featured ? 'border-[#D4A84B] border-2' : 'border-[#D4A84B]/20'
                  } transition-all duration-500`}
                  whileHover={{
                    rotateY: 5,
                    rotateX: -5,
                    scale: tier.featured ? 1.02 : 1.05,
                    boxShadow: tier.featured
                      ? "0 30px 60px rgba(212,168,75,0.4)"
                      : "0 25px 50px rgba(212,168,75,0.25)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Featured badge */}
                  {tier.featured && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-[#D4A84B] to-[#E8C55A] text-[#0A4D3C] text-center font-bold text-sm uppercase tracking-wider"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(212,168,75,0.5)",
                          "0 0 30px rgba(212,168,75,0.7)",
                          "0 0 20px rgba(212,168,75,0.5)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 inline-block mr-1" />
                      Most Popular • 90% Start Here
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className={`p-6 ${tier.featured ? 'pt-14' : 'pt-6'}`}>
                    {/* Icon */}
                    <motion.div
                      className="mb-4"
                      animate={{
                        rotate: hoveredCard === tier.id ? [0, -10, 10, 0] : 0,
                        scale: hoveredCard === tier.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`inline-flex p-3 rounded-xl ${
                        tier.featured ? 'bg-[#D4A84B]/20' : 'bg-[#D4A84B]/10'
                      }`}>
                        <tier.icon className="w-8 h-8 text-[#D4A84B]" />
                      </div>
                    </motion.div>

                    {/* Tier name and tagline */}
                    <h3 className="text-2xl font-black text-[#FDF8E8] mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-[#D4A84B] text-sm font-medium mb-4">
                      {tier.tagline}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-4xl font-black text-[#D4A84B] mb-1">
                        {tier.price}
                      </div>
                      <div className="text-[#FDF8E8]/60 text-sm">
                        {tier.priceDetail}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#FDF8E8]/70 text-sm leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-start gap-2 text-[#FDF8E8]/80 text-sm"
                        >
                          <Check className="w-5 h-5 text-[#D4A84B] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.a
                      href="#apply"
                      className={`block w-full py-3 px-6 rounded-xl font-bold text-center transition-all duration-300 ${
                        tier.featured
                          ? 'bg-gradient-to-r from-[#D4A84B] to-[#E8C55A] text-[#0A4D3C]'
                          : 'bg-[#0A4D3C]/50 text-[#D4A84B] border border-[#D4A84B]/30 hover:border-[#D4A84B]/60'
                      }`}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,168,75,0.4)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.cta}
                    </motion.a>
                  </div>

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A84B]/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: tier.featured ? 2 : 4,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#D4A84B] mb-8 text-center">
              Add-On Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addons.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(212,168,75,0.2)"
                  }}
                  className="bg-[#0D6B4F]/30 rounded-2xl p-6 border border-[#D4A84B]/20 hover:border-[#D4A84B]/60 transition-all duration-500"
                >
                  <h3 className="text-xl font-bold text-[#FDF8E8] mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-[#FDF8E8]/70 text-sm mb-4">
                    {addon.description}
                  </p>
                  <div className="text-[#D4A84B] font-bold">
                    {addon.price}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            <div className="relative py-16 px-8 bg-gradient-to-br from-[#0D6B4F]/50 via-[#0D6B4F]/30 to-[#0A4D3C]/50 rounded-3xl border border-[#D4A84B]/30">
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(212,168,75,0.3), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-12 h-12 text-[#D4A84B]" />
                </motion.div>

                <motion.h3
                  className="text-3xl md:text-4xl font-black text-[#FDF8E8] mb-4 uppercase"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(212,168,75,0.2)",
                      "0 0 30px rgba(212,168,75,0.4)",
                      "0 0 10px rgba(212,168,75,0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Not Sure Which Package <span className="text-[#D4A84B]">Fits?</span>
                </motion.h3>
                <p className="text-[#F0D98C] mb-8 text-lg">
                  Book a free discovery session and we'll create a custom solution tailored to your specific needs and goals.
                </p>

                <motion.a
                  href="#apply"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D4A84B] to-[#E8C55A] text-[#0A4D3C] font-bold text-lg rounded-xl transition-all duration-300 shadow-xl"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(212,168,75,0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Free Consultation
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </motion.a>
              </div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`cta-particle-${i}`}
                  className="absolute w-2 h-2 bg-[#D4A84B] rounded-full"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${25 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
