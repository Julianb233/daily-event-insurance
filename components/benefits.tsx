"use client"

import { motion } from "framer-motion"
import { DollarSign, ShieldCheck, Zap, Settings } from "lucide-react"

interface Benefit {
  icon: React.ElementType
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: DollarSign,
    title: "New Revenue Stream",
    description: "Earn commission on every policy sold. Turn liability into profit.",
  },
  {
    icon: ShieldCheck,
    title: "Reduced Liability",
    description: "Transfer risk to our insurance carriers. Protect your business from claims.",
  },
  {
    icon: Zap,
    title: "Member Convenience",
    description: "Instant coverage, no paperwork. Delight members with seamless protection.",
  },
  {
    icon: Settings,
    title: "Simple Integration",
    description: "Works with your existing POS and booking systems. API or portal access.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function Benefits() {
  return (
    <section id="benefits" className="relative w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Why Partner With Us
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Benefits that boost your bottom line
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-teal-500/10 transition-shadow duration-300">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className="relative inline-flex">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-xl group-hover:bg-teal-500/30 transition-colors duration-300" />

                    {/* Icon Circle */}
                    <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-teal-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Optional CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Ready to transform your business with daily event insurance?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-shadow duration-300"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
