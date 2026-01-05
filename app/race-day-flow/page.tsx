"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowRight,
  Users,
  Shield,
  Building2,
  CheckCircle2,
  Ticket,
  ChevronDown,
  Activity,
  Server,
  FileCheck
} from "lucide-react"

// --- Components ---

function RoleBadge({ role, colorClass }: { role: string; colorClass: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${colorClass}`}>
      {role}
    </span>
  )
}

function Connector({ direction = "down" }: { direction?: "down" | "right" }) {
  return (
    <div className={`flex items-center justify-center ${direction === "down" ? "py-3" : "px-3"}`}>
      {direction === "down" ? (
        <div className="flex flex-col items-center gap-1">
          <div className="w-0.5 h-3 bg-slate-200" />
          <ChevronDown className="w-4 h-4 text-slate-300" />
        </div>
      ) : (
        <ArrowRight className="w-4 h-4 text-slate-300" />
      )}
    </div>
  )
}

function ProcessCard({
  children,
  className = "",
  accentColor = "border-slate-200",
  icon: Icon
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  icon?: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 ${className}`}
    >
      {Icon && (
        <div className={`absolute -top-3 left-4 p-1.5 rounded-lg bg-white border shadow-sm ${accentColor.replace('border-', 'text-').replace('-500', '-600')}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className={Icon ? "mt-2" : ""}>
        {children}
      </div>
    </motion.div>
  )
}

// --- Page ---

export default function RaceDayFlowPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-900/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-widest">Process Architecture</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Race Day Coverage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Data & Lead Flow
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Visualize the seamless journey from a racer's ticket purchase to the activation of their comprehensive race day insurance coverage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Flowchart Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <RoleBadge role="Race Provider" colorClass="bg-rose-100 text-rose-700" />
            <RoleBadge role="HIQOR Platform" colorClass="bg-emerald-100 text-emerald-700" />
            <RoleBadge role="Racer Experience" colorClass="bg-amber-100 text-amber-700" />
            <RoleBadge role="Tech Partner" colorClass="bg-violet-100 text-violet-700" />
            <RoleBadge role="Insurance Partner" colorClass="bg-blue-100 text-blue-700" />
          </div>

          <div className="relative">
            {/* Connecting Lines (Desktop Only Background) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-slate-200 to-slate-300" />
              {/* Horizontal Connector */}
              <div className="absolute top-40 left-[16.666%] right-[16.666%] h-0.5 bg-slate-200" />
              {/* Vertical Drops */}
              <div className="absolute top-40 left-[16.666%] w-0.5 h-12 bg-slate-200" />
              <div className="absolute top-40 left-1/2 w-0.5 h-12 bg-slate-200" />
              <div className="absolute top-40 right-[16.666%] w-0.5 h-12 bg-slate-200" />
            </div>

            {/* Top Level: Trigger */}
            <div className="max-w-md mx-auto mb-20 relative z-10">
              <ProcessCard
                icon={Ticket}
                accentColor="border-rose-500"
                className="border-t-4 border-t-rose-500 text-center"
              >
                <div className="mb-2">
                  <RoleBadge role="Race Provider" colorClass="bg-rose-50 text-rose-600 border border-rose-100" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Ticket Purchase</h3>
                <p className="text-slate-600 mt-1">Racer purchases event tickets</p>
              </ProcessCard>
            </div>

            {/* Three Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 relative z-10">

              {/* Column 1: HIQOR (Left) */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <RoleBadge role="HIQOR Platform" colorClass="bg-emerald-100 text-emerald-800" />
                </div>

                <ProcessCard icon={Activity} className="border-l-4 border-l-emerald-500">
                  <h4 className="font-bold text-slate-900 mb-2">Data Ingestion</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Race Provider sends lead packet to HIQOR via API:
                  </p>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <li>• First/Last Name</li>
                    <li>• Email & Phone</li>
                    <li>• City, State, Zip</li>
                    <li>• TCPA Consent</li>
                    <li>• Source URL</li>
                  </ul>
                </ProcessCard>

                <Connector />

                <ProcessCard className="bg-emerald-50/50 border-emerald-100">
                  <p className="text-sm text-center font-medium text-emerald-900">
                    HIQOR distributes revenue share
                  </p>
                </ProcessCard>

                <Connector />

                <ProcessCard className="bg-emerald-50/50 border-emerald-100">
                  <p className="text-sm text-center font-medium text-emerald-900">
                    Insurance Partner pays HIQOR for qualified leads
                  </p>
                </ProcessCard>
              </div>

              {/* Column 2: Racer Flow (Center) */}
              <div className="space-y-3">
                <div className="text-center mb-6">
                  <RoleBadge role="Racer Experience" colorClass="bg-amber-100 text-amber-800" />
                </div>

                <ProcessCard className="border-t-2 border-t-amber-400">
                  <p className="font-medium text-slate-800 text-center">Racer begins ticket claim process</p>
                </ProcessCard>
                <Connector />

                <ProcessCard>
                  <p className="text-sm text-slate-600 text-center">Enters basic info (Name, Email, Address)</p>
                </ProcessCard>
                <Connector />

                <ProcessCard className="bg-slate-50">
                  <p className="text-xs text-slate-500 text-center font-mono uppercase">Validation Check</p>
                  <p className="text-sm text-slate-700 text-center font-medium mt-1">Resident of accepted 47 states?</p>
                </ProcessCard>
                <Connector />

                <ProcessCard className="border-l-4 border-l-teal-500">
                  <p className="text-sm font-bold text-slate-900 text-center">Presented with No-Cost Coverage</p>
                </ProcessCard>
                <Connector />

                <ProcessCard className="bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5" />
                    <p className="text-sm text-slate-700">
                      Racer <strong>opts-in</strong> to coverage & consents to contact
                    </p>
                  </div>
                </ProcessCard>
                <Connector />

                <ProcessCard className="border-b-4 border-b-amber-500">
                  <div className="text-center">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Qualified Lead</span>
                    <p className="font-bold text-slate-900 mt-1">Racer completes claim flow</p>
                  </div>
                </ProcessCard>
              </div>

              {/* Column 3: Tech Partner (Right) */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <RoleBadge role="Tech Partner" colorClass="bg-violet-100 text-violet-800" />
                </div>

                <ProcessCard icon={Server} className="border-r-4 border-r-violet-500">
                  <h4 className="font-bold text-slate-900 text-sm">Payout Site Redirection</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Racer moves to tech partner site to finalize claim
                  </p>
                </ProcessCard>
                <Connector />

                <ProcessCard>
                  <p className="text-sm text-slate-600 text-center">
                    Racer inputs final details for acceptance
                  </p>
                </ProcessCard>
                <Connector />

                <ProcessCard icon={FileCheck} className="bg-violet-50 border-violet-200">
                  <h4 className="font-bold text-violet-900 text-sm">Policy Issuance</h4>
                  <p className="text-sm text-violet-700 mt-1">
                    Policy Writer instantly emails coverage docs to racer
                  </p>
                </ProcessCard>
                <Connector />

                <ProcessCard className="border-violet-200 bg-slate-900 text-white">
                  <p className="text-sm text-center font-medium">
                    24hrs Coverage Active <br />
                    <span className="text-violet-300 text-xs">Starts 12:01am Race Day</span>
                  </p>
                </ProcessCard>
              </div>
            </div>

            {/* Bottom Section: Insurance Partner */}
            <div className="max-w-4xl mx-auto mt-20">
              <div className="text-center mb-8">
                <RoleBadge role="Insurance Partner" colorClass="bg-blue-100 text-blue-800" />
                <h2 className="text-2xl font-bold text-slate-900 mt-3">Downstream Actions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProcessCard className="border-t-4 border-t-blue-500 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Marketing Division
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded border border-slate-100 text-sm text-slate-600">
                        Updates via API from HIQOR
                      </div>
                      <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-300" /></div>
                      <div className="p-3 bg-blue-50 rounded border border-blue-100 text-sm text-blue-800 font-medium">
                        Markets to new qualified leads
                      </div>
                    </div>
                  </div>
                </ProcessCard>

                <ProcessCard className="border-t-4 border-t-indigo-500 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      Special Risk Division
                    </h4>
                    <div className="h-full flex items-center justify-center p-6 bg-slate-50 rounded border border-slate-100">
                      <p className="text-center text-slate-700 font-medium">
                        Underwrites the 1-Day Event Insurance Policy
                      </p>
                    </div>
                  </div>
                </ProcessCard>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Optimized Lead Flow Matters
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our architecture ensures compliance, speed, and maximum conversion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessCard className="hover:shadow-xl hover:-translate-y-1 transition-all h-full icon-teal">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Integration</h3>
              <p className="text-slate-600 leading-relaxed">
                Embedded directly into the ticket claim path. Zero friction adoption leads to significantly higher opt-in rates.
              </p>
            </ProcessCard>

            <ProcessCard className="hover:shadow-xl hover:-translate-y-1 transition-all h-full">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Fulfillment</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time policy generation means racers receive their proof of coverage documents seconds after opting in.
              </p>
            </ProcessCard>

            <ProcessCard className="hover:shadow-xl hover:-translate-y-1 transition-all h-full">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated RevShare</h3>
              <p className="text-slate-600 leading-relaxed">
                Our ledger automatically calculates and distributes revenue share between the Race Provider, HIQOR, and Partners.
              </p>
            </ProcessCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to deploy this flow?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Integrate the HIQOR insurance engine into your event workflow today.
            </p>

            <motion.a
              href="/#apply"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25"
            >
              Partner with HIQOR
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
