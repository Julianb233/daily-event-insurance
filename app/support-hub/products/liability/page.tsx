"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  AlertTriangle,
  Shield,
  Scale,
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Building,
  Car,
  Home,
  TrendingUp,
  ArrowRight,
  Hammer
} from "lucide-react"

const coverageLimits = [
  {
    name: "General Liability",
    limit: "$100,000",
    price: "$5-8",
    best: "Small venues, low-risk",
    features: [
      "Third-party bodily injury",
      "Property damage claims",
      "Medical payments",
      "Legal defense costs"
    ]
  },
  {
    name: "Standard Liability",
    limit: "$500,000",
    price: "$10-15",
    best: "Most businesses",
    features: [
      "Everything in General",
      "Products liability",
      "Completed operations",
      "Personal & advertising injury",
      "Fire legal liability"
    ],
    popular: true
  },
  {
    name: "Aggregate Liability",
    limit: "$1,000,000",
    price: "$15-20",
    best: "Large facilities, high-risk",
    features: [
      "Everything in Standard",
      "Aggregate coverage per location",
      "Excess liability protection",
      "Contractual liability",
      "Host liquor liability",
      "Umbrella coverage"
    ]
  }
]

const liabilityScenarios = [
  {
    title: "Equipment Malfunction",
    incident: "Treadmill malfunction causes member fall",
    icon: Car,
    damages: [
      { item: "Medical expenses", cost: "$15,000" },
      { item: "Legal defense", cost: "$8,000" },
      { item: "Settlement payment", cost: "$25,000" },
      { item: "Total claim", cost: "$48,000" }
    ],
    outcome: "Covered under Standard Liability. Business protected from lawsuit."
  },
  {
    title: "Property Damage",
    incident: "Member damages neighboring property during class",
    icon: Home,
    damages: [
      { item: "Property repairs", cost: "$12,000" },
      { item: "Lost business income", cost: "$3,000" },
      { item: "Legal fees", cost: "$5,000" },
      { item: "Total claim", cost: "$20,000" }
    ],
    outcome: "Covered under General Liability. Third-party claim settled quickly."
  },
  {
    title: "Slip & Fall Lawsuit",
    incident: "Visitor slips in lobby, files lawsuit",
    icon: AlertTriangle,
    damages: [
      { item: "Medical bills", cost: "$30,000" },
      { item: "Pain & suffering", cost: "$50,000" },
      { item: "Legal defense", cost: "$15,000" },
      { item: "Court costs", cost: "$5,000" },
      { item: "Total claim", cost: "$100,000" }
    ],
    outcome: "Covered under Aggregate Liability. Business fully protected from major lawsuit."
  }
]

const claimProcessSteps = [
  {
    title: "Incident Occurs",
    description: "Third party is injured or property is damaged during your business operations. Document the incident immediately with photos and witness statements.",
    icon: AlertTriangle
  },
  {
    title: "Report to Insurance",
    description: "Submit claim through your Daily Event Insurance portal within 24-48 hours. Faster reporting leads to faster processing and better outcomes.",
    icon: FileText
  },
  {
    title: "Investigation",
    description: "Insurance adjuster reviews the claim, interviews parties involved, and assesses damages. You'll be kept updated throughout the process.",
    icon: Scale
  },
  {
    title: "Defense & Settlement",
    description: "Legal team handles all negotiations and defense. Claims are settled or defended in court. You're protected throughout the entire process.",
    icon: Shield
  }
]

const commonClaims = [
  {
    type: "Slip & Fall",
    frequency: "45%",
    avgCost: "$35,000",
    prevention: "Regular floor maintenance, warning signs, proper lighting"
  },
  {
    type: "Equipment Injury",
    frequency: "25%",
    avgCost: "$28,000",
    prevention: "Regular equipment inspections, safety training, proper supervision"
  },
  {
    type: "Property Damage",
    frequency: "20%",
    avgCost: "$15,000",
    prevention: "Clear boundaries, proper storage, activity restrictions"
  },
  {
    type: "Professional Negligence",
    frequency: "10%",
    avgCost: "$45,000",
    prevention: "Proper certifications, waivers, documented procedures"
  }
]

export default function LiabilityPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Liability Coverage" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 font-semibold text-sm mb-6">
          <AlertTriangle className="w-4 h-4" />
          Third-Party Protection
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Liability Coverage
          <span className="block mt-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Protect Your Business
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive protection against third-party claims for bodily injury and property damage.
          Legal defense included. Your business stays protected from costly lawsuits.
        </p>
      </motion.div>

      {/* Coverage Tiers */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Liability Coverage Levels
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose coverage limits based on your business size and risk exposure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {coverageLimits.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                variant={tier.popular ? "featured" : "default"}
                className="h-full"
              >
                <div className="p-8">
                  {tier.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Recommended
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-orange-600">
                      {tier.price}
                    </span>
                    <span className="text-slate-600">per activity</span>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl mb-6">
                    <div className="text-sm text-orange-700 font-semibold mb-1">
                      Coverage Limit
                    </div>
                    <div className="text-2xl font-bold text-orange-900">
                      {tier.limit}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                      Best For
                    </div>
                    <div className="text-slate-900 font-medium">
                      {tier.best}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real Scenarios */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real Liability Scenarios
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how liability coverage protects businesses from costly claims
          </p>
        </motion.div>

        <div className="space-y-6">
          {liabilityScenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <scenario.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        {scenario.title}
                      </h3>
                      <p className="text-slate-700 font-medium mb-6">
                        {scenario.incident}
                      </p>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-start gap-2 text-green-700">
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">{scenario.outcome}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3">
                      <h4 className="font-bold text-slate-900 mb-4">
                        Claim Breakdown
                      </h4>
                      <div className="space-y-3">
                        {scenario.damages.map((damage, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-4 rounded-xl ${
                              damage.item === "Total claim"
                                ? "bg-orange-50 border border-orange-200"
                                : "bg-white/50"
                            }`}
                          >
                            <span className={`${
                              damage.item === "Total claim"
                                ? "font-bold text-slate-900"
                                : "text-slate-700"
                            }`}>
                              {damage.item}
                            </span>
                            <span className={`font-bold ${
                              damage.item === "Total claim"
                                ? "text-orange-600 text-xl"
                                : "text-slate-900"
                            }`}>
                              {damage.cost}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Claims Process */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How Liability Claims Work
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From incident to resolution, we handle everything
          </p>
        </motion.div>

        <StepByStep steps={claimProcessSteps} />
      </section>

      {/* Common Claims Statistics */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Common Liability Claims
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Understanding the most frequent claims and how to prevent them
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {commonClaims.map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      {claim.type}
                    </h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      {claim.frequency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span className="text-slate-600">Average Cost:</span>
                    <span className="font-bold text-orange-600">{claim.avgCost}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-600 mb-2">
                      Prevention Tips
                    </h4>
                    <p className="text-slate-700 text-sm">
                      {claim.prevention}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* What's Covered / Not Covered */}
      <section>
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  What's Covered
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  "Third-party bodily injury claims",
                  "Property damage to others' property",
                  "Legal defense costs and attorney fees",
                  "Court costs and settlements",
                  "Medical payments to injured parties",
                  "Products liability (if applicable)",
                  "Completed operations coverage",
                  "Personal and advertising injury",
                  "Fire legal liability",
                  "Host liquor liability (if included)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Not Covered
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  "Intentional acts or criminal behavior",
                  "Contractual liability (unless specified)",
                  "Professional errors & omissions",
                  "Employee injuries (workers' comp)",
                  "Pollution or environmental damage",
                  "Auto liability (separate policy)",
                  "Cyber liability claims",
                  "Employment-related claims",
                  "Expected or intended injury",
                  "War or terrorism (unless covered)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Protect Your Business Today
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Don't risk everything you've built. Get comprehensive liability coverage now.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support-hub/integrations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </Link>

              <Link href="/support-hub/products/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
