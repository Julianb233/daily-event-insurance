"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
  Clock,
  Activity,
  Shield,
  Layers,
  Building2,
  Users,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2
} from "lucide-react"

const eventTypes = [
  "A race",
  "A gym check-in",
  "A league game",
  "A ski day",
  "A wellness appointment"
]

const howItWorks = [
  {
    icon: Zap,
    title: "Event Triggers",
    description: "Ticketing, check-in, and session start activate coverage automatically"
  },
  {
    icon: Activity,
    title: "Digital Health Signals",
    description: "Biometric face scan enhances intent and conversion rates"
  },
  {
    icon: Shield,
    title: "ActiveGuard\u2122",
    description: "Time-bound AD&D + accident medical coverage that protects participants"
  },
  {
    icon: Layers,
    title: "HIQOR OS",
    description: "Manages activation, lead flow, conversion, billing, and revenue share"
  }
]

const eventGenerators = [
  "Race events",
  "Gyms",
  "Adult sports leagues",
  "Adventure & outdoor operators",
  "Wellness & experiential brands"
]

const whyThisWins = [
  "Insurance aligned to actual risk windows",
  "Embedded inside existing event platforms (not ads)",
  "Lower CAC, higher conversion, recurring revenue",
  "One infrastructure layer powering all event-based insurance"
]

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14B8A6]/10 rounded-full mb-6">
              <span className="text-[#14B8A6] font-semibold text-sm tracking-wide">HIQOR</span>
              <span className="text-slate-600 text-sm">Events-Based InsurTech SaaS</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Insurance That Activates<br />
              <span className="text-[#14B8A6]">Only When an Event Is Happening</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Coverage turns on for the event and off when it ends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What We Are
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
              HIQOR is an events-based InsurTech SaaS platform that activates insurance only during
              verified event windows — races, gym sessions, sports leagues, adventure rentals,
              wellness visits, and live experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Events */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Events
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Every real-world activity is an event:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {eventTypes.map((event, index) => (
                <motion.div
                  key={event}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                >
                  <Clock className="w-5 h-5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{event}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-lg text-slate-600 mt-8">
              HIQOR treats all of these as insurable events with a start time, end time, and participant context.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-[#14B8A6]/5 rounded-2xl border border-[#14B8A6]/20">
              <p className="text-lg text-slate-700 font-medium text-center">
                Coverage turns on for the event and off when it ends.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Connect */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              Who We Connect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Generators */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Event Generators</h3>
                </div>
                <ul className="space-y-3">
                  {eventGenerators.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-[#14B8A6] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insurance Buyers */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Insurance Buyers</h3>
                </div>
                <p className="text-slate-600">
                  Carriers (e.g., Mutual of Omaha) seeking lower customer acquisition costs,
                  better signals, and recurring premium flow.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              Business Model
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Performance-Based</h4>
                  <p className="text-slate-600 text-sm">Tiered, performance-based acquisition fees</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Direct Conversion</h4>
                  <p className="text-slate-600 text-sm">Into monthly event-based coverage</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Recurring Revenue</h4>
                  <p className="text-slate-600 text-sm">SaaS-like revenue model</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Unified Economics</h4>
                  <p className="text-slate-600 text-sm">Across all event types</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Wins */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Why This Wins
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyThisWins.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              "HIQOR is the InsurTech SaaS infrastructure for events-based insurance."
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#14B8A6] text-white rounded-full">
              <span className="font-semibold">Insurance for moments, not time.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#14B8A6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Event Insurance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Partner with HIQOR to offer coverage that aligns with real-world risk.
            </p>
            <a
              href="/#apply"
              className="inline-flex items-center px-8 py-4 bg-white text-[#14B8A6] font-bold text-lg rounded-xl hover:bg-slate-100 transition-all shadow-lg"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
