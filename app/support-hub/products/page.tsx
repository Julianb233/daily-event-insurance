"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Shield,
  Calendar,
  AlertTriangle,
  Home,
  XCircle,
  DollarSign,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Sparkles
} from "lucide-react"

const coverageCategories = [
  {
    title: "Coverage Types",
    description: "Compare all insurance options and find the right coverage for your members",
    icon: Shield,
    href: "/support-hub/products/coverage-types",
    highlight: true
  },
  {
    title: "Event Insurance",
    description: "Single-day coverage for classes, workshops, and special events",
    icon: Calendar,
    href: "/support-hub/products/event-insurance"
  },
  {
    title: "Liability Coverage",
    description: "Protection against third-party claims and legal costs",
    icon: AlertTriangle,
    href: "/support-hub/products/liability"
  },
  {
    title: "Property Coverage",
    description: "Equipment, facility, and asset protection options",
    icon: Home,
    href: "/support-hub/products/property"
  },
  {
    title: "Cancellation Coverage",
    description: "Protect against event cancellations and no-shows",
    icon: XCircle,
    href: "/support-hub/products/cancellation"
  },
  {
    title: "Pricing & Premiums",
    description: "Understanding costs, commission structures, and revenue",
    icon: DollarSign,
    href: "/support-hub/products/pricing"
  },
  {
    title: "Claims Process",
    description: "How to file, track, and manage insurance claims",
    icon: FileCheck,
    href: "/support-hub/products/claims"
  }
]

const keyBenefits = [
  {
    title: "Instant Coverage",
    description: "Members get covered immediately upon purchase - no waiting periods",
    icon: Sparkles
  },
  {
    title: "Per-Activity Pricing",
    description: "Pay only for what you use with flexible daily coverage options",
    icon: DollarSign
  },
  {
    title: "Partner Revenue Share",
    description: "Earn 40-60% commission on every policy sold through your platform",
    icon: Users
  },
  {
    title: "Enterprise Options",
    description: "Custom solutions for multi-location businesses and franchises",
    icon: Building2
  }
]

const coverageComparison = [
  {
    type: "Event Insurance",
    coverage: "Single day/event",
    price: "$3-15",
    bestFor: "Classes, workshops, one-time activities"
  },
  {
    type: "Liability Coverage",
    coverage: "Third-party claims",
    price: "$5-20",
    bestFor: "High-risk activities, equipment rentals"
  },
  {
    type: "Property Coverage",
    coverage: "Equipment & assets",
    price: "$2-10",
    bestFor: "Rental equipment, facility protection"
  },
  {
    type: "Cancellation Coverage",
    coverage: "Event cancellation",
    price: "$1-5",
    bestFor: "Outdoor events, weather-dependent activities"
  }
]

export default function ProductsPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Products & Coverage" }]} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Shield className="w-4 h-4" />
          Insurance Products
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Coverage Options for
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Every Activity
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Daily Event Insurance offers flexible, per-activity coverage that protects your members
          and generates revenue for your business. Explore our comprehensive insurance products below.
        </p>
      </motion.div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-4 gap-6">
        {keyBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover>
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Coverage Categories */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Explore Our Products
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive insurance solutions designed for fitness facilities, adventure sports, and equipment rentals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <GlassCard hover glow={category.highlight}>
                  <div className="p-6 group">
                    {category.highlight && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-3">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </div>
                    )}
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-teal-600 font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Coverage at a Glance
                </h2>
                <p className="text-slate-600 mt-1">
                  Quick comparison of our main insurance products
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Coverage Type</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-900">What It Covers</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Price Range</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-900">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageComparison.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-900">{item.type}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{item.coverage}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm">
                          {item.price}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{item.bestFor}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* How It Works */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              How Coverage Works for Your Members
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Member Books Activity", description: "Customer schedules a class, rental, or event through your platform" },
                { step: "2", title: "Insurance Offered", description: "Coverage option appears at checkout with clear pricing and benefits" },
                { step: "3", title: "Instant Activation", description: "Upon purchase, coverage begins immediately - no paperwork needed" },
                { step: "4", title: "Protected Activity", description: "Member participates with peace of mind, knowing they're covered" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard hover={false}>
          <div className="p-12 text-center bg-gradient-to-br from-teal-50/50 to-blue-50/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-teal-600" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to Offer Coverage to Your Members?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Start generating revenue while providing valuable protection for your customers.
                Our team will help you choose the right coverage mix.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
                >
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/support-hub/products/coverage-types"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-teal-500 text-teal-600 font-bold text-lg rounded-xl hover:bg-teal-50 transition-all duration-300"
                >
                  Compare Coverage Types
                </Link>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
