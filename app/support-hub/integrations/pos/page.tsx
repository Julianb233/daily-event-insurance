"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import Link from "next/link"
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  TrendingUp,
  Clock,
  Users
} from "lucide-react"

const posProviders = [
  {
    name: "Square",
    description: "Seamlessly integrate insurance quotes into your Square checkout flow",
    logo: "Square",
    href: "/support-hub/integrations/pos/square",
    features: [
      "Automatic quote generation",
      "Single checkout flow",
      "Real-time policy issuance",
      "Transaction sync"
    ],
    setupTime: "15 minutes",
    difficulty: "Easy"
  },
  {
    name: "Pike13",
    description: "Add insurance options to your fitness and wellness bookings",
    logo: "Pike13",
    href: "/support-hub/integrations/pos/pike13",
    features: [
      "Event-based triggers",
      "Client profile sync",
      "Automated renewals",
      "Booking integration"
    ],
    setupTime: "20 minutes",
    difficulty: "Easy"
  },
  {
    name: "Mindbody",
    description: "Offer insurance coverage for wellness events and classes",
    logo: "Mindbody",
    href: "/support-hub/integrations/pos/mindbody",
    features: [
      "Class integration",
      "Member management",
      "Workshop coverage",
      "Payment processing"
    ],
    setupTime: "20 minutes",
    difficulty: "Moderate"
  },
  {
    name: "Toast POS",
    description: "Perfect for restaurant events and catering services",
    logo: "Toast",
    href: "/support-hub/integrations/pos/toast",
    features: [
      "Order integration",
      "Event management",
      "Custom coverage",
      "Multi-location support"
    ],
    setupTime: "25 minutes",
    difficulty: "Moderate",
    comingSoon: true
  }
]

const benefits = [
  {
    icon: Zap,
    title: "Instant Quotes",
    description: "Generate insurance quotes automatically at checkout without manual work"
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "PCI-compliant payment handling with enterprise-grade security"
  },
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    description: "Add insurance as an additional revenue stream with zero inventory"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Eliminate manual insurance paperwork and phone calls"
  },
  {
    icon: Users,
    title: "Better Experience",
    description: "Provide customers one-stop shopping for events and insurance"
  }
]

const integrationSteps = [
  {
    step: 1,
    title: "Choose Your POS",
    description: "Select your point-of-sale system from the supported providers"
  },
  {
    step: 2,
    title: "Connect Account",
    description: "Link your POS account using OAuth or API keys"
  },
  {
    step: 3,
    title: "Configure Settings",
    description: "Set up quote triggers, coverage options, and pricing rules"
  },
  {
    step: 4,
    title: "Test Integration",
    description: "Run test transactions to verify everything works correctly"
  },
  {
    step: 5,
    title: "Go Live",
    description: "Activate the integration and start offering insurance"
  }
]

export default function POSIntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/support-hub/integrations" },
              { label: "POS Systems" }
            ]}
          />

          <div className="mt-6 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              POS System Integrations
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Connect your point-of-sale system to offer event insurance at checkout
            </p>
          </div>
        </motion.div>

        {/* POS Providers */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {posProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={provider.comingSoon ? "#" : provider.href}>
                <GlassCard
                  variant="elevated"
                  className={`p-8 h-full group ${
                    provider.comingSoon
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-teal-200"
                  }`}
                >
                  {provider.comingSoon && (
                    <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                      Coming Soon
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl">
                        {provider.logo[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {provider.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">
                            Setup: {provider.setupTime}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {provider.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6">
                    {provider.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {provider.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!provider.comingSoon && (
                    <div className="flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
                      Setup Guide
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard variant="featured" className="p-8 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Why Integrate Your POS?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.slice(0, 3).map((benefit) => (
                <div key={benefit.title}>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white w-fit mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {benefits.slice(3).map((benefit) => (
                <div key={benefit.title}>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white w-fit mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Integration Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Integration Process
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="space-y-6">
              {integrationSteps.map((item, index) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-white flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  {index < integrationSteps.length - 1 && (
                    <div className="flex-shrink-0 w-0.5 h-12 bg-gradient-to-b from-teal-300 to-transparent ml-6" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need a Custom Integration?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Don't see your POS system listed? Contact us to discuss custom integration options
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                Contact Sales
              </button>
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
