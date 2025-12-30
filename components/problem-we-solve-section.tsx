'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown, Users, Zap, Target, DollarSign, UserX } from 'lucide-react';
import { useState } from 'react';

const problems = [
  {
    icon: DollarSign,
    title: 'Wasted Spend',
    description: 'Carriers pay for coverage when no risk exists. Customers pay for time, not protection.',
  },
  {
    icon: Target,
    title: 'Poor Acquisition',
    description: 'Generic ads and low-intent leads. No context about actual customer behavior.',
  },
  {
    icon: UserX,
    title: 'Limited Relevance',
    description: 'One-size-fits-all policies that dont align with how people actually live and participate.',
  },
  {
    icon: TrendingDown,
    title: 'Under-Monetized Participation',
    description: 'Platforms miss revenue from real engagement. Insurance happens elsewhere.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function ProblemCard({ item, index }: { item: typeof problems[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        <div className="relative h-full bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          {/* Red accent on hover */}
          <motion.div
            className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-400 to-red-500"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ originY: 0 }}
          />

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <motion.div
                className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <item.icon className="w-6 h-6 text-red-500" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProblemWeSolveSection() {
  return (
    <section id="problem-we-solve" className="relative py-20 md:py-28 bg-slate-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200 mb-6"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">The Problem</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Insurance Is Static.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              Risk Is Not.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Traditional insurance is always on—even when no risk exists. But real risk happens in moments.
          </p>
        </motion.div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Traditional Insurance */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Traditional Insurance</h3>
              </div>

              <div className="space-y-4">
                {/* Timeline visual */}
                <div className="relative">
                  <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">Always On (365 days)</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                <ul className="space-y-3 mt-6">
                  {[
                    'Paying for coverage 24/7/365',
                    'Coverage exists when you sleep',
                    'Same price whether active or not',
                    'No connection to actual behavior',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Events-Based Insurance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 shadow-lg border border-teal-200 h-full relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Events-Based Insurance</h3>
                </div>

                <div className="space-y-4">
                  {/* Timeline visual */}
                  <div className="relative">
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden flex items-center px-2">
                      {[15, 35, 55, 75].map((pos, i) => (
                        <motion.div
                          key={i}
                          className="absolute h-6 w-8 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
                          style={{ left: `${pos}%` }}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.15 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Events Only</span>
                      <span>Protected moments</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mt-6">
                    {[
                      'Coverage only during participation',
                      'Activates when the event starts',
                      'Turns off when the event ends',
                      'Aligned to actual risk windows',
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 text-slate-700"
                      >
                        <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Problem Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
            This mismatch creates serious problems:
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {problems.map((item, index) => (
            <ProblemCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* Solution teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-slate-600 mb-4">
            <span className="font-semibold text-teal-600">HIQOR fixes this</span> by aligning insurance to actual risk windows.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
