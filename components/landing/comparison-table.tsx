"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

type Vertical = "gym" | "wellness" | "ski-resort" | "fitness"

interface ComparisonTableProps {
  vertical: Vertical
  estimatedRevenue: number
}

interface ComparisonItem {
  without: string
  with: string
}

const verticalData: Record<Vertical, ComparisonItem[]> = {
  gym: [
    {
      without: "Make: $0",
      with: "Make: $3,200/mo",
    },
    {
      without: "Members unprotected",
      with: "$1M coverage each",
    },
    {
      without: "Full liability exposure",
      with: "Shared risk",
    },
    {
      without: "No revenue from insurance",
      with: "Commission on every policy",
    },
    {
      without: "Members sue your gym",
      with: "Insurance covers claims",
    },
    {
      without: "Risk of bankruptcy",
      with: "Business protected",
    },
  ],
  wellness: [
    {
      without: "Make: $0",
      with: "Make: $2,100/mo",
    },
    {
      without: "Practitioners uninsured",
      with: "$2M professional coverage",
    },
    {
      without: "Clients unprotected",
      with: "Full medical coverage",
    },
    {
      without: "Liable for all accidents",
      with: "Risk transferred",
    },
    {
      without: "Expensive lawsuits possible",
      with: "Legal defense covered",
    },
    {
      without: "Reputation at risk",
      with: "Trust & credibility",
    },
  ],
  "ski-resort": [
    {
      without: "Make: $0",
      with: "Make: $8,500/mo",
    },
    {
      without: "Guests uninsured",
      with: "$3M coverage per guest",
    },
    {
      without: "Resort fully liable",
      with: "Liability distributed",
    },
    {
      without: "Season-ending injuries drain budget",
      with: "Insurance handles costs",
    },
    {
      without: "Season closures hurt reputation",
      with: "Operations continue smoothly",
    },
    {
      without: "Massive lawsuit risk",
      with: "Protected from catastrophic claims",
    },
  ],
  fitness: [
    {
      without: "Make: $0",
      with: "Make: $4,500/mo",
    },
    {
      without: "Members unprotected",
      with: "$1.5M coverage each",
    },
    {
      without: "Your gym is liable",
      with: "Shared liability",
    },
    {
      without: "Trainer injuries uninsured",
      with: "Staff covered",
    },
    {
      without: "Equipment damage claims",
      with: "Damage coverage included",
    },
    {
      without: "Member retention drops",
      with: "Peace of mind increases loyalty",
    },
  ],
}

export default function ComparisonTable({
  vertical,
  estimatedRevenue,
}: ComparisonTableProps) {
  const data = verticalData[vertical]
  const annualLoss = estimatedRevenue * 12

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Responsive Comparison Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        {/* Desktop View */}
        <div className="hidden md:block rounded-xl overflow-hidden shadow-lg border border-slate-200">
          <div className="grid grid-cols-2 bg-slate-50">
            {/* Headers */}
            <motion.div
              variants={headerVariants}
              className="bg-red-50 border-r border-slate-200 p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-bold text-red-900">
                WITHOUT Us
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Status quo risk & zero revenue
              </p>
            </motion.div>

            <motion.div
              variants={headerVariants}
              className="bg-green-50 p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-bold text-green-900">
                WITH Us
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Protected & generating revenue
              </p>
            </motion.div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-200">
            {data.map((item, index) => (
              <motion.div
                key={index}
                variants={rowVariants}
                className="grid grid-cols-2"
              >
                {/* Without Column */}
                <div className="bg-white border-r border-slate-200 p-6 sm:p-8 flex items-start gap-3 sm:gap-4">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-700">
                    {item.without}
                  </p>
                </div>

                {/* With Column */}
                <div className="bg-white p-6 sm:p-8 flex items-start gap-3 sm:gap-4">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-700">
                    {item.with}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            variants={rowVariants}
            className="grid grid-cols-2 border-t-2 border-red-200 bg-gradient-to-r from-red-50 to-red-50"
          >
            <div className="border-r border-slate-200 p-6 sm:p-8">
              <p className="text-sm text-slate-600">Annual Impact</p>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-lg sm:text-xl font-bold text-red-600">
                You&apos;re losing ${annualLoss.toLocaleString()}/year
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={rowVariants}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-slate-200"
            >
              {/* Without Card */}
              <div className="bg-red-50 border-b border-slate-200 p-4 flex gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-900 uppercase tracking-wide">
                    Without
                  </p>
                  <p className="text-sm text-slate-700 mt-1">{item.without}</p>
                </div>
              </div>

              {/* With Card */}
              <div className="bg-green-50 p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-900 uppercase tracking-wide">
                    With Us
                  </p>
                  <p className="text-sm text-slate-700 mt-1">{item.with}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Mobile Footer */}
          <motion.div
            variants={rowVariants}
            className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-6 border-2 border-red-300 mt-6"
          >
            <p className="text-xs text-red-900 font-semibold uppercase tracking-wide">
              Annual Impact
            </p>
            <p className="text-xl font-bold text-red-600 mt-2">
              Losing ${annualLoss.toLocaleString()}/year
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
