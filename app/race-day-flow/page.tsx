"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, Users, Shield, Building2, FileText } from "lucide-react"

// Flowchart arrow component
function FlowArrow({ direction = "down" }: { direction?: "down" | "right" }) {
  return (
    <div className={`flex items-center justify-center ${direction === "down" ? "py-4" : "px-4"}`}>
      {direction === "down" ? (
        <ArrowDown className="w-6 h-6 text-slate-400" />
      ) : (
        <ArrowRight className="w-6 h-6 text-slate-400" />
      )}
    </div>
  )
}

// Flow box component
function FlowBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-6 shadow-lg border-2 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function RaceDayFlowPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Race Day Coverage{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Lead Flow
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Complete journey from ticket purchase to insurance coverage activation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Flowchart Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Row: Race Provider */}
          <div className="mb-8">
            <FlowBox className="bg-red-100 border-red-300 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded">
                  Race Provider
                </div>
              </div>
              <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                <p className="font-semibold text-slate-700">racer purchases tickets</p>
              </div>
            </FlowBox>
            <FlowArrow />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

            {/* Left Column: HIQOR */}
            <div className="lg:col-span-4">
              <FlowBox className="bg-emerald-50 border-emerald-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded">
                    HIQOR
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  LEAD FLOW TO INSURANCE PARTNER AND REVENUE SHARE
                </h3>

                <div className="space-y-4">
                  <div className="bg-white border border-emerald-200 rounded-lg p-4">
                    <p className="font-semibold text-sm text-slate-700 mb-3">
                      Race Provider sends lead packet to HIQOR via API with...
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1.5">
                      <li>• First name</li>
                      <li>• Last name</li>
                      <li>• Email</li>
                      <li>• Phone</li>
                      <li>• City</li>
                      <li>• State</li>
                      <li>• Zip</li>
                      <li>• TCPA consent to be contacted</li>
                      <li>• URL</li>
                    </ul>
                  </div>

                  <FlowArrow />

                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700">HIQOR distributes revenue share</p>
                  </div>

                  <FlowArrow />

                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700">Insurance Partner pays HIQOR for qualified leads</p>
                  </div>
                </div>
              </FlowBox>
            </div>

            {/* Center Column: Racer Ticket Claim Experience */}
            <div className="lg:col-span-4">
              <FlowBox className="bg-yellow-50 border-yellow-400 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
                    Race Provider Ticket Claim / Registration
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                  RACER TICKET CLAIM EXPERIENCE
                </h3>

                <div className="space-y-3">
                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer begins individual ticket claim process
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer enters basic info (full name, address, email, phone)
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-3 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Residents of accepted 47 states
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      ARE presented with no-cost race day coverage
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      ARE interested in race day coverage AND consent/opt-in to be contacted by Insurance Provider
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-3 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer has met criteria to become qualified lead
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer completes ticket claim flow
                    </p>
                  </div>
                </div>
              </FlowBox>
            </div>

            {/* Right Column: Tech Partner */}
            <div className="lg:col-span-4">
              <FlowBox className="bg-purple-100 border-purple-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                    Tech Partner
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
                  RACE DAY COVERAGE POLICY PRODUCER
                </h3>

                <div className="space-y-4">
                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer moves to tech partner payout site to claim their coverage
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Racer inputs basic info to complete race day coverage acceptance
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      Policy Writer instantly sends coverage info and policy docs to racer via email
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-red-200 border-2 border-red-300 rounded-lg p-4 text-center">
                    <p className="font-semibold text-slate-700 text-sm">
                      24hrs of coverage begins at 12:01am on race day
                    </p>
                  </div>
                </div>
              </FlowBox>
            </div>
          </div>

          {/* Bottom Row: Insurance Partner */}
          <div className="mt-8">
            <FlowBox className="bg-blue-100 border-blue-300">
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  Insurance Partner
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
                INSURANCE PARTNER
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Marketing Division */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-slate-700 text-sm mb-3">
                      HIQOR sends lead packet to Insurance Partner via API
                    </p>
                  </div>

                  <FlowArrow />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-slate-700 text-sm">
                      Insurance Provider markets to leads
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-blue-300">
                    <p className="text-center font-bold text-slate-800 text-sm">
                      MARKETING DIVISION / LEAD BUYER
                    </p>
                  </div>
                </div>

                {/* Right: Special Risk Division */}
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-slate-700 text-sm">
                      Insurance partner underwrites the 1 day event insurance
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t-2 border-blue-300">
                    <p className="text-center font-bold text-slate-800 text-sm">
                      SPECIAL RISK DIVISION
                    </p>
                  </div>
                </div>
              </div>
            </FlowBox>
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-4 h-4 bg-red-300 rounded" />
              <span className="text-sm font-semibold text-slate-700">Race Provider</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-4 h-4 bg-yellow-300 rounded" />
              <span className="text-sm font-semibold text-slate-700">Ticket Claim Flow</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="w-4 h-4 bg-emerald-300 rounded" />
              <span className="text-sm font-semibold text-slate-700">HIQOR Platform</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-4 h-4 bg-purple-300 rounded" />
              <span className="text-sm font-semibold text-slate-700">Tech Partner</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Key Benefits of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                This Flow
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Seamless Integration</h3>
              <p className="text-slate-600">
                Embedded directly into the ticket claim process - no additional steps for racers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Coverage</h3>
              <p className="text-slate-600">
                Policy documents delivered immediately via email with coverage starting at 12:01am on race day
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Revenue Share Model</h3>
              <p className="text-slate-600">
                HIQOR manages the entire flow and coordinates revenue distribution between all parties
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Want to Implement This Flow?
            </h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Partner with HIQOR to offer race day coverage to your participants
            </p>

            <motion.a
              href="/#apply"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-2xl hover:bg-teal-50 transition-all shadow-2xl"
            >
              Become a Partner
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
