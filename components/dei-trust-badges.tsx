"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Shield, Users, Timer } from "lucide-react"
import { useEffect, useRef } from "react"

interface StatItem {
  value: string
  animatedValue?: number
  label: string
  description: string
  icon: typeof Users
}

const stats: StatItem[] = [
  { value: "247", animatedValue: 247, label: "Partner Facilities", description: "Active partnerships", icon: Users },
  { value: "127K+", animatedValue: 127, label: "Members Protected", description: "And growing daily", icon: Shield },
  { value: "47s", animatedValue: 47, label: "Average Coverage Time", description: "Lightning fast", icon: Timer },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
      }
    })
    return () => unsubscribe()
  }, [springValue, suffix])

  return <div ref={ref}>0{suffix}</div>
}

const partnerTypes = [
  { name: "Gyms", icon: "GYM" },
  { name: "Climbing", icon: "CLB" },
  { name: "Rentals", icon: "RNT" },
  { name: "Adventure", icon: "ADV" },
]


export function DEITrustBadges() {
  return (
    <section data-section="trust-badges" className="relative bg-slate-50 py-12 md:py-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-teal-400 mb-1">
                {stat.animatedValue !== undefined ? (
                  <AnimatedCounter
                    value={stat.animatedValue}
                    suffix={stat.value.replace(/[0-9]/g, '')}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 mt-1 hidden md:block">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mb-10" />

        {/* Partner Types Section */}
        <div className="text-center">
          <p className="text-teal-400/70 text-xs uppercase tracking-[0.3em] mb-6">
            Serving Active Lifestyle Businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partnerTypes.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-xs md:text-sm text-teal-400">
                  {partner.icon}
                </div>
                <span className="font-semibold text-sm md:text-base hidden md:inline">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Response Time Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-teal-500/10 border border-teal-500/30">
            <Shield className="w-5 h-5 text-teal-400" />
            <span className="text-slate-700 font-medium text-sm">
              <span className="text-teal-400 font-bold">Licensed & Insured</span> — A-rated carriers with nationwide coverage
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
