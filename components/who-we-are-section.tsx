'use client';

import { motion } from 'framer-motion';
import { Building2, Briefcase, Users, ArrowRight, Layers } from 'lucide-react';
import { useState } from 'react';

const notCards = [
  {
    icon: Building2,
    title: 'Not a Carrier',
    description: "We don't underwrite policies or hold insurance risk.",
  },
  {
    icon: Briefcase,
    title: 'Not a Broker',
    description: "We don't sell traditional insurance products to end consumers.",
  },
  {
    icon: Users,
    title: 'Not Lead-Gen',
    description: "We don't just capture names and sell lists to carriers.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

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
};

function NotCard({ item, index }: { item: typeof notCards[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-red-300/20 via-red-200/30 to-red-300/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card */}
        <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 border-red-200/60 hover:border-red-300/80 hover:shadow-xl transition-all duration-500 overflow-hidden">
          {/* X mark overlay */}
          <div className="absolute top-4 right-4">
            <motion.div
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          </div>

          {/* Icon */}
          <div className="mb-6 relative">
            <motion.div
              className="relative inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <item.icon className="w-8 h-8 text-slate-500" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Content */}
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
            {item.title}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: '40px 40px',
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Our Identity</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            We&apos;re the Infrastructure Behind{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Events-Based Insurance
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            HIQOR is not an insurance carrier, broker, or lead-gen company. We are something entirely different.
          </p>
        </motion.div>

        {/* "Not" Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16"
        >
          {notCards.map((item, index) => (
            <NotCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* Central Identity Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-400/5 to-teal-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-sm font-medium text-teal-300">What We Actually Are</span>
              </motion.div>

              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
                The Activation, Data, and Monetization Layer
              </h3>
              <p className="text-lg text-slate-300 mb-8 max-w-3xl">
                We&apos;re the infrastructure that allows insurance to turn on during real-world events—workouts,
                races, games, adventures, and experiences—and turn off automatically when those events end.
              </p>

              {/* Platform Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Event Platforms */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex-1 max-w-xs"
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
                    <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-sky-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">Event & Activity Platforms</h4>
                    <p className="text-sm text-slate-400">Gyms, races, rentals, adventures</p>
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="hidden md:flex items-center"
                >
                  <ArrowRight className="w-8 h-8 text-teal-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="md:hidden"
                >
                  <svg className="w-8 h-8 text-teal-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>

                {/* HIQOR Platform */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex-1 max-w-xs"
                >
                  <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-sm rounded-xl p-6 border border-teal-500/50 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">HIQOR Platform</h4>
                      <p className="text-sm text-teal-300">Activation • Data • Monetization</p>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="hidden md:flex items-center"
                >
                  <ArrowRight className="w-8 h-8 text-teal-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="md:hidden"
                >
                  <svg className="w-8 h-8 text-teal-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>

                {/* Insurance Carriers */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex-1 max-w-xs"
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">Insurance Carriers</h4>
                    <p className="text-sm text-slate-400">Coverage & balance sheet</p>
                  </div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="text-center text-slate-400 mt-8"
              >
                HIQOR aligns both sides through technology, data, and unified economics.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
