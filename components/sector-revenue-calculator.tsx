"use client"

import { useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"
import { Calculator, TrendingUp, DollarSign, Users, Building2, ArrowRight } from "lucide-react"

// Tiered commission structure
const commissionTiers = [
  { minVolume: 0, maxVolume: 999, percentage: 25, perParticipant: 10 },
  { minVolume: 1000, maxVolume: 2499, percentage: 27.5, perParticipant: 11 },
  { minVolume: 2500, maxVolume: 4999, percentage: 30, perParticipant: 12 },
  { minVolume: 5000, maxVolume: 9999, percentage: 32.5, perParticipant: 13 },
  { minVolume: 10000, maxVolume: 24999, percentage: 35, perParticipant: 14 },
  { minVolume: 25000, maxVolume: Infinity, percentage: 37.5, perParticipant: 15 },
]

const volumeTiers = [
  { label: "1,000", value: 1000 },
  { label: "2,500", value: 2500 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "25,000", value: 25000 },
  { label: "50,000+", value: 50000 },
]

const locationOptions = [
  { label: "1 Location", value: 1, bonus: 0 },
  { label: "2-5 Locations", value: 3, bonus: 0.5 },
  { label: "6-10 Locations", value: 8, bonus: 1 },
  { label: "11-25 Locations", value: 18, bonus: 1.5 },
  { label: "25+ Locations", value: 30, bonus: 2 },
]

function getCommissionTier(totalVolume: number) {
  return commissionTiers.find(tier => totalVolume >= tier.minVolume && totalVolume <= tier.maxVolume) || commissionTiers[0]
}

interface SectorRevenueCalculatorProps {
  sectorTitle: string
  sectorSlug: string
}

export function SectorRevenueCalculator({ sectorTitle, sectorSlug }: SectorRevenueCalculatorProps) {
  const [monthlyVolume, setMonthlyVolume] = useState(2500)
  const [locations, setLocations] = useState(1)

  // Calculate revenue (100% coverage required)
  const totalParticipants = monthlyVolume * locations
  const coveredParticipants = totalParticipants
  const commissionTier = getCommissionTier(totalParticipants)
  const locationOption = locationOptions.find(o => o.value === locations) || locationOptions[0]
  const effectivePerParticipant = commissionTier.perParticipant + locationOption.bonus
  const monthlyRevenue = coveredParticipants * effectivePerParticipant
  const annualRevenue = monthlyRevenue * 12

  // Animated values
  const animatedMonthly = useSpring(monthlyRevenue, { stiffness: 100, damping: 20 })
  const animatedAnnual = useSpring(annualRevenue, { stiffness: 100, damping: 20 })
  const [displayMonthly, setDisplayMonthly] = useState(monthlyRevenue)
  const [displayAnnual, setDisplayAnnual] = useState(annualRevenue)

  useEffect(() => {
    const unsubMonthly = animatedMonthly.on("change", (v) => setDisplayMonthly(Math.round(v)))
    const unsubAnnual = animatedAnnual.on("change", (v) => setDisplayAnnual(Math.round(v)))
    return () => {
      unsubMonthly()
      unsubAnnual()
    }
  }, [animatedMonthly, animatedAnnual])

  useEffect(() => {
    animatedMonthly.set(monthlyRevenue)
    animatedAnnual.set(annualRevenue)
  }, [monthlyRevenue, annualRevenue, animatedMonthly, animatedAnnual])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section id="calculator" className="relative bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 -left-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <Calculator className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">{sectorTitle} Revenue Calculator</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            See What Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">{sectorTitle}</span> Could Earn
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Calculate your potential monthly recurring revenue. Earn <strong className="text-teal-600">$10-15 per participant</strong> with
            <strong className="text-teal-600"> bonus incentives for multi-location partners</strong>.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-white rounded-3xl border border-teal-100 p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left side - Inputs */}
              <div className="space-y-8">
                {/* Monthly Volume Selector */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
                    <Users className="w-5 h-5 text-teal-600" />
                    Monthly Participants (per location)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {volumeTiers.map((tier) => {
                      const tierParticipants = tier.value * locations
                      const tierCommission = getCommissionTier(tierParticipants)
                      const tierLocationOption = locationOptions.find(o => o.value === locations) || locationOptions[0]
                      const tierEarnings = tierParticipants * (tierCommission.perParticipant + tierLocationOption.bonus)

                      return (
                        <motion.button
                          key={tier.value}
                          onClick={() => setMonthlyVolume(tier.value)}
                          className={`px-4 py-4 rounded-xl transition-all duration-200 ${
                            monthlyVolume === tier.value
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-lg font-bold">{tier.label}</div>
                          <div className={`text-xs mt-1 ${monthlyVolume === tier.value ? "text-teal-100" : "text-teal-600"}`}>
                            Earn ~${tierEarnings.toLocaleString()}/mo
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Location Selector */}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    Number of Locations
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {locationOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setLocations(option.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          locations === option.value
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total monthly participants</span>
                    <span className="font-semibold text-slate-700">{totalParticipants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Covered participants</span>
                    <span className="font-semibold text-teal-600">{coveredParticipants.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Your commission tier</span>
                      <span className="font-bold text-teal-600">{commissionTier.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-slate-500">Per participant</span>
                      <span className="font-semibold text-teal-600">${effectivePerParticipant.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Results */}
              <div className="flex flex-col justify-center">
                <div className="relative">
                  {/* Monthly Revenue */}
                  <div className="mb-10">
                    <div className="text-slate-500 text-base font-semibold mb-3 uppercase tracking-wide">
                      Start Earning Today
                    </div>
                    <motion.div
                      className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600 ${
                        displayMonthly >= 1000000
                          ? "text-3xl md:text-4xl lg:text-5xl"
                          : displayMonthly >= 100000
                            ? "text-4xl md:text-5xl lg:text-6xl"
                            : "text-5xl md:text-6xl lg:text-7xl"
                      }`}
                      key={displayMonthly}
                    >
                      {formatCurrency(displayMonthly)}
                    </motion.div>
                    <div className="text-slate-700 text-xl md:text-2xl font-bold mt-4">
                      per month in recurring commission
                    </div>
                  </div>

                  {/* Annual Revenue */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100 mb-8">
                    <div className="flex items-center gap-2 text-slate-700 text-lg font-bold mb-3">
                      <TrendingUp className="w-6 h-6 text-teal-600" />
                      Annual Revenue Potential
                    </div>
                    <div className={`font-black text-teal-600 ${
                      displayAnnual >= 10000000
                        ? "text-2xl md:text-3xl lg:text-4xl"
                        : displayAnnual >= 1000000
                          ? "text-3xl md:text-4xl lg:text-5xl"
                          : "text-4xl md:text-5xl lg:text-6xl"
                    }`}>
                      {formatCurrency(displayAnnual)}
                    </div>
                    <div className="text-slate-700 text-lg md:text-xl font-bold mt-4">
                      added to your bottom line every year
                    </div>
                  </div>

                  {/* Apply CTA - Specific to this sector */}
                  <motion.a
                    href="#apply"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-xl rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply for {sectorTitle} Partnership
                    <ArrowRight className="w-6 h-6" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Get paid monthly
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              48 hours to go live
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Zero overhead
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
