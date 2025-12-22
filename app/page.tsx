"use client"

import { motion } from "framer-motion"
import { Shield, Users, TrendingUp, FileCheck, Building2, Mountain, Bike, Waves } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import { FAQSection } from "@/components/faq-section"

// Simple inline components for the insurance landing page

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Register your facility and integrate our API in minutes. We handle all the compliance and underwriting.",
      icon: FileCheck,
    },
    {
      number: "02",
      title: "Integrate",
      description: "Add our widget to your booking system or app. Your members can purchase coverage with just a few clicks.",
      icon: Shield,
    },
    {
      number: "03",
      title: "Members Get Coverage",
      description: "Your members get instant, same-day insurance for their activities. You earn commission on every policy sold.",
      icon: Users,
    },
  ]

  return (
    <section className="relative bg-slate-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            How It <span className="text-teal-600">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to offer insurance to your members
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
            >
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                  {step.number}
                </div>
              </div>
              <div className="mt-8 mb-6">
                <step.icon className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhoWeServeSection() {
  const markets = [
    {
      title: "Gyms & Fitness Centers",
      description: "Offer coverage for personal training, group classes, and specialized fitness activities.",
      icon: Building2,
      color: "from-teal-700 to-teal-600",
    },
    {
      title: "Rock Climbing Facilities",
      description: "Same-day insurance for climbing sessions, courses, and memberships.",
      icon: Mountain,
      color: "from-teal-600 to-teal-500",
    },
    {
      title: "Equipment Rentals",
      description: "Coverage for bike rentals, water sports equipment, and adventure gear.",
      icon: Bike,
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Adventure Sports",
      description: "Protect your business and members during kayaking, surfing, and outdoor activities.",
      icon: Waves,
      color: "from-cyan-500 to-sky-500",
    },
  ]

  return (
    <section className="relative bg-slate-900 py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.4) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Who We <span className="text-teal-400">Serve</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Daily Event Insurance is built for active lifestyle businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {markets.map((market, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-gradient-to-br ${market.color} rounded-2xl p-8 overflow-hidden group cursor-pointer`}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

              <div className="relative z-10">
                <market.icon className="w-14 h-14 text-white mb-6" />
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-4">
                  {market.title}
                </h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                  {market.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    {
      title: "New Revenue Stream",
      description: "Earn commission on every insurance policy sold through your platform. No overhead, pure profit.",
      icon: TrendingUp,
    },
    {
      title: "Reduced Liability",
      description: "Protect your business from potential claims with comprehensive member coverage.",
      icon: Shield,
    },
    {
      title: "Member Convenience",
      description: "Offer seamless, one-click insurance that your members actually want and need.",
      icon: Users,
    },
  ]

  return (
    <section className="relative bg-gradient-to-br from-teal-500 to-teal-600 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Business <span className="text-teal-100">Benefits</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Why forward-thinking facility owners choose Daily Event Insurance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <benefit.icon className="w-12 h-12 text-white mb-6" />
              <h3 className="text-2xl font-black uppercase text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GetStartedSection() {
  return (
    <section id="get-started" className="relative bg-slate-900 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Ready to Get <span className="text-teal-400">Started?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Join 200+ facilities already earning commissions with embedded insurance.
          </p>
          <p className="text-base md:text-lg text-teal-400 font-bold max-w-2xl mx-auto mb-12">
            Turn every member interaction into a revenue opportunity. Zero overhead. Pure profit.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-teal-500/20 p-8 md:p-12 mb-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Select Business Type</option>
                <option>Gym / Fitness Center</option>
                <option>Rock Climbing Facility</option>
                <option>Equipment Rental</option>
                <option>Adventure Sports</option>
                <option>Other</option>
              </select>
              <textarea
                placeholder="Tell us about your business and how you'd like to use Daily Event Insurance..."
                rows={4}
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-teal-500 text-white font-black uppercase px-8 py-5 rounded-full text-lg tracking-wider hover:bg-teal-400 transition-colors"
              >
                Request a Demo
              </motion.button>
            </form>
          </div>

          <p className="text-slate-400 text-sm">
            We'll get back to you within 24 hours to schedule your personalized demo.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* Header - Navigation bar */}
      <Header />

      {/* Hero Section - Main hero with headline and CTA */}
      <HeroSection />

      {/* How It Works - 3-step process */}
      <HowItWorksSection />

      {/* Who We Serve - Target markets */}
      <WhoWeServeSection />

      {/* Benefits - Business owner benefits */}
      <BenefitsSection />

      {/* FAQ - Frequently asked questions */}
      <FAQSection />

      {/* Get Started - Contact/CTA section */}
      <GetStartedSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
