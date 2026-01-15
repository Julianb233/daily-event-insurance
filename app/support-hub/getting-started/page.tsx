"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { StepByStep } from "@/components/support-hub/StepByStep"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Rocket,
  Users,
  Shield,
  DollarSign,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  FileText,
  Zap,
  Target
} from "lucide-react"

const coverageTypes = [
  {
    name: "Gym & Fitness",
    icon: "💪",
    description: "Covers injuries during training, classes, and equipment use",
    price: "$3-5/session"
  },
  {
    name: "Climbing & Bouldering",
    icon: "🧗",
    description: "Specialized coverage for indoor and outdoor climbing activities",
    price: "$4-7/session"
  },
  {
    name: "Equipment Rentals",
    icon: "🚴",
    description: "Protection for bikes, skis, boards, and adventure gear",
    price: "$5-8/rental"
  },
  {
    name: "Adventure Sports",
    icon: "🪂",
    description: "High-risk activities including skydiving, rafting, and more",
    price: "$8-15/activity"
  }
]

const onboardingSteps = [
  {
    title: "Sign Partnership Agreement",
    description: "Quick online contract with zero upfront costs or commitments. Takes 5 minutes to complete.",
    icon: FileText
  },
  {
    title: "Configure Your Settings",
    description: "Set your coverage types, pricing, and branding preferences in the partner dashboard.",
    icon: Target
  },
  {
    title: "Integrate with Your System",
    description: "Install our widget or connect via API to your POS system. Most integrations complete in 24 hours.",
    icon: Zap
  },
  {
    title: "Go Live & Start Earning",
    description: "Launch to your members and start generating revenue immediately. We handle all the insurance logistics.",
    icon: Rocket
  }
]

const revenueModel = [
  {
    metric: "Partner Commission",
    value: "40-60%",
    description: "Of every policy sold"
  },
  {
    metric: "Payment Frequency",
    value: "Monthly",
    description: "Direct deposit to your account"
  },
  {
    metric: "Average Revenue",
    value: "$5-15k/year",
    description: "For mid-size facilities"
  }
]

export default function GettingStartedPage() {
  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Getting Started" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Rocket className="w-4 h-4" />
          Quick Start Guide
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Welcome to Daily Event
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Insurance
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Get up and running in minutes. This guide covers everything you need to start generating revenue with insurance coverage for your members.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Zap, label: "Setup Time", value: "< 24 hours" },
          { icon: DollarSign, label: "Upfront Cost", value: "$0" },
          { icon: Users, label: "Active Partners", value: "1,200+" },
          { icon: CheckCircle, label: "Success Rate", value: "98%" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hoverEffect>
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">
                  {stat.label}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Onboarding Steps */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Partner Onboarding Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four simple steps to start generating revenue
          </p>
        </motion.div>

        <StepByStep steps={onboardingSteps} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            href="/apply"
            className="
              inline-flex items-center gap-2 px-8 py-4
              bg-gradient-to-r from-teal-500 to-blue-500
              text-white font-bold text-lg rounded-xl
              hover:shadow-xl hover:shadow-teal-500/30
              transition-all duration-300
            "
          >
            <PlayCircle className="w-5 h-5" />
            Start Onboarding
          </Link>
        </motion.div>
      </section>

      {/* Coverage Types */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Coverage Types Overview
                </h2>
                <p className="text-slate-600 mt-1">
                  Flexible insurance options for every activity type
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {coverageTypes.map((coverage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{coverage.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {coverage.name}
                      </h3>
                      <p className="text-slate-600 mb-3">
                        {coverage.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm">
                        {coverage.price}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Revenue Model */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  How Partners Make Money
                </h2>
                <p className="text-slate-600 mt-1">
                  Transparent revenue sharing with no hidden fees
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {revenueModel.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {item.value}
                  </div>
                  <div className="font-bold text-slate-900 mb-1">
                    {item.metric}
                  </div>
                  <div className="text-sm text-slate-600">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Example Revenue Calculation
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Monthly active members:</span>
                  <span className="font-semibold">500</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion rate:</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average policy price:</span>
                  <span className="font-semibold">$5</span>
                </div>
                <div className="flex justify-between">
                  <span>Your commission (50%):</span>
                  <span className="font-semibold">$2.50</span>
                </div>
                <div className="border-t border-teal-200 pt-2 mt-2 flex justify-between text-lg">
                  <span className="font-bold">Monthly Revenue:</span>
                  <span className="font-bold text-teal-600">$375</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Annual Revenue:</span>
                  <span className="font-bold text-teal-600">$4,500</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Next Steps */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Ready for the Next Step?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/support-hub/integrations">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Zap className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Set Up Integration
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Connect your POS system or install our widget
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Integration Guides
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/faq">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <FileText className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Browse FAQs
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Get answers to common partnership questions
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View All FAQs
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
