"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  Home,
  Shield,
  Bike,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  Camera,
  Zap,
  Mountain,
  Waves,
  TrendingUp,
  ArrowRight,
  AlertCircle
} from "lucide-react"

const coverageTiers = [
  {
    name: "Basic Equipment",
    price: "$2-4",
    coverage: "$1,000",
    best: "Low-value items",
    features: [
      "Accidental damage",
      "Theft protection",
      "Replacement cost",
      "24/7 support"
    ]
  },
  {
    name: "Standard Protection",
    price: "$5-8",
    coverage: "$5,000",
    best: "Most rentals",
    features: [
      "Everything in Basic",
      "Lost equipment coverage",
      "Transit damage",
      "Expedited claims",
      "No deductible"
    ],
    popular: true
  },
  {
    name: "Premium Coverage",
    price: "$9-12",
    coverage: "$10,000+",
    best: "High-value gear",
    features: [
      "Everything in Standard",
      "Full replacement value",
      "Worldwide coverage",
      "Same-day claim processing",
      "Loaner equipment included",
      "No depreciation"
    ]
  }
]

const equipmentTypes = [
  {
    category: "Fitness Equipment",
    icon: Bike,
    examples: ["Bikes", "Treadmills", "Weight sets", "Rowing machines"],
    avgValue: "$500-2,000",
    risk: "Medium",
    price: "$4-6"
  },
  {
    category: "Adventure Gear",
    icon: Mountain,
    examples: ["Climbing gear", "Skis/Snowboards", "Camping equipment", "Hiking gear"],
    avgValue: "$300-1,500",
    risk: "High",
    price: "$6-10"
  },
  {
    category: "Water Sports",
    icon: Waves,
    examples: ["Kayaks", "Paddleboards", "Surfboards", "Wetsuits"],
    avgValue: "$400-2,500",
    risk: "Medium-High",
    price: "$5-8"
  },
  {
    category: "Electronics",
    icon: Camera,
    examples: ["Heart rate monitors", "GPS devices", "Action cameras", "Smart watches"],
    avgValue: "$100-800",
    risk: "Low-Medium",
    price: "$3-5"
  }
]

const claimExamples = [
  {
    title: "Damaged Rental Bike",
    equipment: "Mountain Bike ($1,200 value)",
    incident: "Member crashed on trail, bent frame and damaged wheels",
    coverage: "Standard Protection",
    claim: [
      { item: "Frame replacement", cost: "$800" },
      { item: "Wheel set", cost: "$300" },
      { item: "Labor", cost: "$100" },
      { item: "Total paid", cost: "$1,200" }
    ],
    result: "Full replacement cost covered, no out-of-pocket expense"
  },
  {
    title: "Lost Kayak",
    equipment: "Ocean Kayak ($2,000 value)",
    incident: "Kayak drifted away and couldn't be recovered",
    coverage: "Standard Protection",
    claim: [
      { item: "Replacement kayak", cost: "$2,000" },
      { item: "Rush shipping", cost: "$150" },
      { item: "Total paid", cost: "$2,150" }
    ],
    result: "Claim approved within 24 hours, loaner provided immediately"
  },
  {
    title: "Stolen Equipment Set",
    equipment: "Climbing Gear Set ($3,500 value)",
    incident: "Equipment stolen from rental facility",
    coverage: "Premium Coverage",
    claim: [
      { item: "Harness & ropes", cost: "$800" },
      { item: "Carabiners & protection", cost: "$600" },
      { item: "Climbing shoes", cost: "$200" },
      { item: "Helmet & accessories", cost: "$300" },
      { item: "Express replacement", cost: "$200" },
      { item: "Total paid", cost: "$2,100" }
    ],
    result: "Same-day approval, full replacement with no depreciation"
  }
]

const protectionSteps = [
  {
    title: "Equipment Check-Out",
    description: "When member rents equipment, coverage option is presented at checkout. Member selects desired protection level and coverage activates immediately upon rental confirmation.",
    icon: Package
  },
  {
    title: "During Rental Period",
    description: "Equipment is fully protected against damage, theft, and loss throughout the entire rental period. Coverage includes transit to and from your facility.",
    icon: Shield
  },
  {
    title: "Damage or Loss Occurs",
    description: "If equipment is damaged, lost, or stolen, member reports incident through your platform. Photos and incident details are collected for the claim.",
    icon: AlertCircle
  },
  {
    title: "Instant Claim Processing",
    description: "Claims are processed within hours, not days. Business receives reimbursement for repair or replacement costs. Member relationship stays positive.",
    icon: Zap
  }
]

export default function PropertyPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Property Coverage" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
          <Home className="w-4 h-4" />
          Equipment Protection
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Property Coverage
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Protect Your Equipment
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive protection for rental equipment and gear. Coverage for damage, theft, and loss.
          Keep your assets protected and your business profitable.
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
            Protection Levels
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the right protection for your equipment value and rental risk
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {coverageTiers.map((tier, index) => (
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-blue-600">
                      {tier.price}
                    </span>
                    <span className="text-slate-600">per rental</span>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl mb-6">
                    <div className="text-sm text-blue-700 font-semibold mb-1">
                      Coverage Limit
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {tier.coverage}
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

      {/* Equipment Categories */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Coverage by Equipment Type
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Pricing varies based on equipment value and risk level
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipmentTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <type.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {type.category}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        Typical Value
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {type.avgValue}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        Risk Level
                      </div>
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                        type.risk === "High" ? "bg-red-100 text-red-700" :
                        type.risk.includes("Medium") ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {type.risk}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        Coverage Cost
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        {type.price}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-2">
                      Examples
                    </div>
                    <div className="space-y-1">
                      {type.examples.map((example, i) => (
                        <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* How It Works */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How Equipment Protection Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From rental to claim, the process is seamless
          </p>
        </motion.div>

        <StepByStep steps={protectionSteps} />
      </section>

      {/* Real Claim Examples */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real Equipment Claims
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how property coverage protects your equipment investment
          </p>
        </motion.div>

        <div className="space-y-6">
          {claimExamples.map((example, index) => (
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
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        {example.coverage}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {example.title}
                      </h3>
                      <div className="text-slate-600 mb-4">
                        {example.equipment}
                      </div>
                      <p className="text-slate-700 font-medium mb-6">
                        {example.incident}
                      </p>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-start gap-2 text-green-700">
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">{example.result}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3">
                      <h4 className="font-bold text-slate-900 mb-4">
                        Claim Payment Breakdown
                      </h4>
                      <div className="space-y-3">
                        {example.claim.map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-4 rounded-xl ${
                              item.item === "Total paid"
                                ? "bg-blue-50 border border-blue-200"
                                : "bg-white/50"
                            }`}
                          >
                            <span className={`${
                              item.item === "Total paid"
                                ? "font-bold text-slate-900"
                                : "text-slate-700"
                            }`}>
                              {item.item}
                            </span>
                            <span className={`font-bold ${
                              item.item === "Total paid"
                                ? "text-blue-600 text-xl"
                                : "text-slate-900"
                            }`}>
                              {item.cost}
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
                  "Accidental damage during rental",
                  "Theft from member or facility",
                  "Lost equipment during use",
                  "Transit damage to/from facility",
                  "Vandalism or malicious damage",
                  "Fire or water damage",
                  "Weather-related damage",
                  "Replacement at full value",
                  "Repair costs and labor",
                  "Expedited replacement shipping"
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
                  "Normal wear and tear",
                  "Mechanical or electrical breakdown",
                  "Pre-existing damage",
                  "Intentional damage or abuse",
                  "Modification or unauthorized repairs",
                  "Equipment left unattended",
                  "Rental beyond agreed period",
                  "Use outside intended purpose",
                  "Cosmetic damage that doesn't affect function",
                  "Items not listed in rental agreement"
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
              Protect Your Equipment Investment
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Stop losing money on damaged rentals. Add property coverage today.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/integrations">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-blue-300 transition-all group"
                >
                  <Shield className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Get Started
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Add coverage to your rentals
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold">
                    Start Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/pricing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-blue-300 transition-all group"
                >
                  <DollarSign className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    See Pricing
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Calculate your costs
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/claims">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-blue-300 transition-all group"
                >
                  <Package className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    File a Claim
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Learn the process
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
