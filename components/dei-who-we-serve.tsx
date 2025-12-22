"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Building2, Mountain, Bike, Waves, ArrowRight } from "lucide-react"

const sparkles = [
  { left: "6%", top: "10%", delay: 0, size: "lg" },
  { left: "92%", top: "15%", delay: 0.4, size: "lg" },
  { left: "10%", top: "80%", delay: 0.7, size: "lg" },
  { left: "88%", top: "75%", delay: 1.0, size: "lg" },
  { left: "45%", top: "5%", delay: 0.2, size: "md" },
  { left: "95%", top: "50%", delay: 0.6, size: "lg" },
  { left: "3%", top: "45%", delay: 0.3, size: "lg" },
  { left: "70%", top: "88%", delay: 0.9, size: "md" },
  { left: "25%", top: "92%", delay: 0.5, size: "lg" },
  { left: "55%", top: "25%", delay: 0.8, size: "lg" },
  { left: "80%", top: "40%", delay: 1.1, size: "md" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-5 h-5 md:w-7 md:h-7"
    case "md":
      return "w-4 h-4 md:w-5 md:h-5"
    default:
      return "w-3 h-3 md:w-4 md:h-4"
  }
}

const markets = [
  {
    icon: Building2,
    title: "Gyms & Fitness Centers",
    description: "Offer instant coverage for personal training, group classes, and specialized fitness activities. Protect your members while earning commission.",
    features: ["Day pass coverage", "Equipment liability", "Personal training protection"],
    gradient: "from-teal-600 to-teal-500",
  },
  {
    icon: Mountain,
    title: "Rock Climbing Facilities",
    description: "Same-day insurance for climbing sessions, belay certifications, and courses. Give your climbers peace of mind before they hit the wall.",
    features: ["Climbing session insurance", "Course coverage", "Membership add-on"],
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Bike,
    title: "Equipment Rentals",
    description: "Coverage for bike rentals, water sports equipment, and adventure gear. Protect both your inventory and your customers.",
    features: ["Rental protection", "Damage coverage", "Theft insurance"],
    gradient: "from-cyan-500 to-sky-500",
  },
  {
    icon: Waves,
    title: "Adventure Sports",
    description: "Comprehensive protection for kayaking, surfing, zip lines, obstacle courses, and outdoor activities. Adventure awaits—safely.",
    features: ["Activity-specific coverage", "Group packages", "Event insurance"],
    gradient: "from-sky-500 to-blue-500",
  },
]

export function DEIWhoWeServe() {
  return (
    <section className="relative bg-slate-900 py-20 md:py-32 overflow-hidden">
      {/* Teal sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle, i) => (
          <motion.div
            key={i}
            className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
            style={{ left: sparkle.left, top: sparkle.top }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 1, 0],
              scale: [0, 1.3, 0.9, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.2,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#14B8A6"
                style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative swirl */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="swirl-gradient-serve" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100,10 Q150,50 140,100 T100,190 Q50,150 60,100 T100,10"
            fill="none"
            stroke="url(#swirl-gradient-serve)"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight">
            Who We <span className="text-teal-400">Serve</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Daily Event Insurance is built for active lifestyle businesses that want to protect their members
            while creating a new revenue stream.
          </p>
        </motion.div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {markets.map((market, index) => (
            <motion.div
              key={market.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`group relative bg-gradient-to-br ${market.gradient} rounded-2xl p-6 md:p-8 overflow-hidden cursor-pointer`}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <market.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-3">{market.title}</h3>

                {/* Description */}
                <p className="text-white/80 text-base leading-relaxed mb-4">{market.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {market.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Arrow - Appears on Hover */}
                <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 mb-6">Don't see your industry? We're always expanding our coverage options.</p>
          <motion.a
            href="#get-started"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
