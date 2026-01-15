"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import Link from "next/link"
import {
  Plug,
  Code,
  Webhook,
  Layers,
  CreditCard,
  Activity,
  Settings,
  Zap,
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles
} from "lucide-react"

const integrationCategories = [
  {
    title: "POS Systems",
    description: "Connect your point-of-sale system for automated insurance quotes at checkout",
    icon: CreditCard,
    href: "/support-hub/integrations/pos",
    features: [
      "Square integration",
      "Pike13 integration",
      "Mindbody integration",
      "Toast POS support"
    ],
    badge: "Popular"
  },
  {
    title: "API Integration",
    description: "Full REST API access for custom integrations and automations",
    icon: Code,
    href: "/support-hub/integrations/api",
    features: [
      "RESTful endpoints",
      "API key authentication",
      "Real-time quotes",
      "Policy management"
    ],
    badge: "Developer"
  },
  {
    title: "Website Widget",
    description: "Embed insurance quotes directly on your website with our JavaScript widget",
    icon: Layers,
    href: "/support-hub/integrations/widget",
    features: [
      "JavaScript snippet",
      "React component",
      "Customizable styling",
      "Mobile responsive"
    ],
    badge: "Easy Setup"
  },
  {
    title: "Webhooks",
    description: "Receive real-time notifications for policy events and updates",
    icon: Webhook,
    href: "/support-hub/integrations/webhooks",
    features: [
      "Event notifications",
      "Payload signing",
      "Automatic retries",
      "Status monitoring"
    ],
    badge: "Real-time"
  }
]

const quickStartSteps = [
  {
    title: "Choose Your Integration",
    description: "Select the integration method that best fits your workflow",
    icon: Settings
  },
  {
    title: "Get API Credentials",
    description: "Generate your API key from the dashboard settings",
    icon: Shield
  },
  {
    title: "Follow Setup Guide",
    description: "Use our detailed documentation to implement the integration",
    icon: Code
  },
  {
    title: "Test & Deploy",
    description: "Test in sandbox mode before going live",
    icon: Zap
  }
]

const benefits = [
  {
    title: "Automated Workflows",
    description: "Reduce manual work by automating insurance quotes and policy creation"
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications for policy changes and renewals"
  },
  {
    title: "Seamless Experience",
    description: "Provide customers with a smooth checkout experience"
  },
  {
    title: "Developer-Friendly",
    description: "Well-documented APIs with SDKs and code examples"
  }
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs items={[{ label: "Integrations" }]} />

          <div className="mt-6 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Integrations
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Connect Daily Event Insurance with your existing tools and workflows
            </p>
          </div>
        </motion.div>

        {/* Integration Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {integrationCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <GlassCard
                  variant="elevated"
                  className="p-8 h-full group cursor-pointer hover:border-teal-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full">
                      {category.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {category.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard variant="featured" className="p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Quick Start Guide
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {step.description}
                  </p>

                  {index < quickStartSteps.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-gradient-to-r from-teal-300 to-transparent -translate-x-1/2" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Integration Benefits
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <GlassCard key={benefit.title} className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-sky-100 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {benefit.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <Plug className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Integration?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our technical support team is ready to help you get started with any integration
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support-hub/integrations/api">
                <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                  View API Documentation
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-6 py-3 bg-white/80 text-slate-900 rounded-xl font-medium border border-slate-200 hover:border-teal-300 transition-colors">
                  Contact Support
                </button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
