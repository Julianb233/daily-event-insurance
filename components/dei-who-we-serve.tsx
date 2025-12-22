"use client"

import { motion } from "framer-motion"
import { Building2, Mountain, Bike, Waves, ArrowRight } from "lucide-react"
import Image from "next/image"

const markets = [
  {
    icon: Building2,
    title: "Gyms & Fitness Centers",
    description: "Offer instant coverage for personal training, group classes, and specialized fitness activities. Protect your members while earning commission.",
    features: ["Day pass coverage", "Equipment liability", "Personal training protection"],
    gradient: "from-teal-600 to-teal-500",
    image: "/images/partner-gym.png",
    imageAlt: "Modern gym facility with state-of-the-art fitness equipment",
  },
  {
    icon: Mountain,
    title: "Rock Climbing Facilities",
    description: "Same-day insurance for climbing sessions, belay certifications, and courses. Give your climbers peace of mind before they hit the wall.",
    features: ["Climbing session insurance", "Course coverage", "Membership add-on"],
    gradient: "from-teal-500 to-cyan-500",
    image: "/images/partner-climbing.png",
    imageAlt: "Indoor rock climbing wall with safety equipment and climbers",
  },
  {
    icon: Bike,
    title: "Equipment Rentals",
    description: "Coverage for bike rentals, water sports equipment, and adventure gear. Protect both your inventory and your customers.",
    features: ["Rental protection", "Damage coverage", "Theft insurance"],
    gradient: "from-cyan-500 to-sky-500",
    image: "/images/partner-rentals.png",
    imageAlt: "Premium outdoor adventure equipment and bike rentals",
  },
  {
    icon: Waves,
    title: "Adventure Sports",
    description: "Comprehensive protection for kayaking, surfing, zip lines, obstacle courses, and outdoor activities. Adventure awaits—safely.",
    features: ["Activity-specific coverage", "Group packages", "Event insurance"],
    gradient: "from-sky-500 to-blue-500",
    image: "/images/partner-adventure.png",
    imageAlt: "Thrilling adventure sports activities including kayaking and water sports",
  },
]

export function DEIWhoWeServe() {
  return (
    <section id="who-we-serve" className="relative bg-slate-50 py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            Who We <span className="text-teal-600">Serve</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
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
              className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[300px] md:min-h-[400px]"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={market.image}
                  alt={market.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 2}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Dark Overlay - lightens on hover to reveal more image */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/70 to-black/60 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/40 transition-all duration-300" />

              {/* Gradient Accent - preserves brand colors with subtle overlay */}
              <div className={`absolute inset-0 z-[2] bg-gradient-to-br ${market.gradient} opacity-30 group-hover:opacity-20 transition-opacity duration-300`} />

              {/* Content Layer */}
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <market.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-3">{market.title}</h3>

                  {/* Description */}
                  <p className="text-white/90 text-base leading-relaxed mb-4">{market.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {market.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

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
          <p className="text-slate-600 mb-6">Don't see your industry? We're always expanding our coverage options.</p>
          <motion.a
            href="#get-started"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold text-lg rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
