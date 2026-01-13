"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Shield,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Building2,
  Sparkles,
  Heart,
  Award,
  Clock,
  DollarSign
} from "lucide-react"
import { AboutPageContext } from "@/components/voice"

const values = [
  {
    icon: Shield,
    title: "Protection First",
    description: "We believe every participant deserves coverage that activates when they need it most."
  },
  {
    icon: Users,
    title: "Partner Success",
    description: "Your success is our success. We provide tools, support, and resources to help you grow."
  },
  {
    icon: Heart,
    title: "Customer-Centric",
    description: "Simple, transparent coverage that customers understand and trust."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Leveraging cutting-edge InsurTech to deliver coverage that fits modern lifestyles."
  }
]

const stats = [
  { value: "500+", label: "Active Partners" },
  { value: "$2.4M+", label: "Partner Earnings" },
  { value: "100%", label: "Coverage Rate" },
  { value: "24hrs", label: "Avg. Setup Time" }
]

const whyPartnerWithUs = [
  "No contracts or setup fees",
  "Earn $10-15 per participant",
  "Real-time earnings dashboard",
  "Dedicated partner success manager",
  "Marketing materials included",
  "Monthly payouts via ACH or check"
]

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <AboutPageContext />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <Image
                  src="/images/logo-color.png"
                  alt="Daily Event Insurance"
                  width={220}
                  height={55}
                  className="h-auto w-auto"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">A HiQor Partner</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Daily Event Insurance
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
              Empowering fitness businesses and event organizers with embedded insurance
              technology that creates new revenue streams while protecting participants.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Who We Are</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Your Partner in{" "}
                <span className="text-teal-600">Event Insurance</span>
              </h2>

              <div className="space-y-4 text-lg text-slate-600">
                <p>
                  Daily Event Insurance is an independent company specializing in embedded
                  insurance solutions for fitness facilities, adventure operators, and event organizers.
                </p>
                <p>
                  We leverage <Link href="/about/hiqor" className="text-teal-600 font-semibold hover:text-teal-700">HiQor&apos;s</Link> cutting-edge
                  InsurTech platform to deliver same-day coverage that activates only when events happen.
                </p>
                <p>
                  Our mission is simple: help businesses create new revenue streams while
                  providing participants with transparent, affordable protection.
                </p>
              </div>

              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Daily Event Insurance is an independent company
                  and is not owned by, controlled by, or a subsidiary of HiQor. We operate
                  as a HiQor Partner through a technology partnership arrangement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center hover:shadow-xl hover:border-teal-200 transition-all"
                >
                  <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
              <Award className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Our Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every partnership we build.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:border-teal-200 transition-all text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-6">
                <DollarSign className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-semibold text-teal-300">Partner Benefits</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Partner With{" "}
                <span className="text-teal-400">Daily Event Insurance</span>
              </h2>

              <p className="text-lg text-slate-300 mb-8">
                Join hundreds of partners who are earning passive income while protecting their participants.
              </p>

              <ul className="space-y-4">
                {whyPartnerWithUs.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-slate-200">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-teal-400 mb-2">$2,400</div>
                <div className="text-slate-300">Average Monthly Partner Earnings</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-teal-400" />
                    <span className="text-slate-200">Setup Time</span>
                  </div>
                  <span className="font-bold text-white">24 hours</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-teal-400" />
                    <span className="text-slate-200">Coverage Rate</span>
                  </div>
                  <span className="font-bold text-white">100%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-teal-400" />
                    <span className="text-slate-200">Per Participant</span>
                  </div>
                  <span className="font-bold text-white">$10-15</span>
                </div>
              </div>

              <motion.a
                href="/#apply"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learn About HiQor Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powered by <span className="text-teal-600">HiQor</span> Technology
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Daily Event Insurance leverages HiQor&apos;s events-based InsurTech SaaS platform
              to deliver instant, event-activated insurance coverage.
            </p>

            <Link
              href="/about/hiqor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Learn About HiQor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Join our partner network and start earning commission on every protected participant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/#apply"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-xl shadow-lg hover:bg-slate-50 transition-colors"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
              >
                View Pricing
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
