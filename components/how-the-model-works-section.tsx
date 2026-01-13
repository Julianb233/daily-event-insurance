'use client';

import { motion } from 'framer-motion';
import { Zap, Calendar, RefreshCw, Users, Activity, Target, ArrowRight, DollarSign, TrendingUp, Building2, Shield } from 'lucide-react';
import { useState } from 'react';

const whyCarriersPay = [
  {
    icon: Users,
    title: 'Real People',
    description: 'Not scraped lists or purchased leads. Actual participants showing up to events.',
  },
  {
    icon: Activity,
    title: 'Real Participation',
    description: 'Verified attendance, confirmed activity. They were there, they were active.',
  },
  {
    icon: Target,
    title: 'High Intent',
    description: 'They already bought coverage. These are pre-qualified, insurance-aware customers.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

function WhyCarrierCard({ item, index }: { item: typeof whyCarriersPay[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -8, translateY: -4 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-teal-500/30 via-teal-400/40 to-teal-500/30 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card */}
        <div className="relative h-full bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 hover:border-teal-500/50 shadow-lg shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-500 overflow-hidden">
          {/* Icon */}
          <motion.div
            className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <item.icon className="w-7 h-7 text-teal-400" strokeWidth={2} />
          </motion.div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
            {item.title}
          </h3>
          <p className="text-slate-400 leading-relaxed text-center">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HowTheModelWorksSection() {
  return (
    <section id="how-the-model-works" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6"
          >
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-300">The Engine</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-center">
            How The Model{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500">
              Works
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-teal-300 font-semibold mb-4">
            Carrier-Funded Acquisition Engine
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Insurance carriers fund customer acquisition through event-based coverage.
            HIQOR converts participation into verified leads and recurring relationships.
          </p>
        </motion.div>

        {/* Two-Part Flow */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Daily = Lead Generation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50 h-full overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-teal-400 font-medium">Daily Coverage</span>
                    <h3 className="text-xl font-bold text-white">Lead Generation</h3>
                  </div>
                </div>

                <p className="text-slate-400 mb-6">
                  Single-use coverage creates verified, time-stamped participation data.
                  Each protected participant becomes a qualified lead.
                </p>

                <ul className="space-y-3">
                  {[
                    'Verified, time-stamped participation',
                    'Single-use coverage moments',
                    'High-intent insurance exposure',
                    'Partners earn revenue on every activation',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Monthly = Ongoing Acquisition */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-teal-500/30 h-full overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-teal-400 font-medium">Monthly ActiveGuard™</span>
                    <h3 className="text-xl font-bold text-white">Ongoing Acquisition</h3>
                  </div>
                </div>

                <p className="text-slate-400 mb-6">
                  ActiveGuard™ extends the relationship. Customers stay protected,
                  carriers gain longer-term engagement, you earn recurring revenue.
                </p>

                <ul className="space-y-3">
                  {[
                    'Protected during ongoing participation',
                    'Carriers gain longer-term engagement',
                    'Monthly participation = recurring acquisition value',
                    'Partners earn recurring revenue tied to activity',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Carriers Pay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Why Carriers Pay For This
          </h3>
          <p className="text-slate-400">
            Traditional acquisition relies on paid search and low-intent clicks. HIQOR delivers something different.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16"
        >
          {whyCarriersPay.map((item, index) => (
            <WhyCarrierCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* Revenue Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mb-16"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-white text-center mb-8">Revenue Flow</h4>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {/* Platform */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-slate-700/50 rounded-xl p-4 text-center min-w-[140px]"
              >
                <Building2 className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-white">Your Platform</span>
                <p className="text-xs text-slate-400 mt-1">Hosts participation</p>
              </motion.div>

              <ArrowRight className="w-6 h-6 text-teal-500 rotate-90 md:rotate-0" />

              {/* HIQOR */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-xl p-4 text-center min-w-[140px] border border-teal-500/30"
              >
                <Zap className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-white">HIQOR</span>
                <p className="text-xs text-teal-300 mt-1">Monetizes activation</p>
              </motion.div>

              <ArrowRight className="w-6 h-6 text-teal-500 rotate-90 md:rotate-0" />

              {/* Carrier */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-slate-700/50 rounded-xl p-4 text-center min-w-[140px]"
              >
                <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-white">Carriers</span>
                <p className="text-xs text-slate-400 mt-1">Fund acquisition</p>
              </motion.div>

              <ArrowRight className="w-6 h-6 text-teal-500 rotate-90 md:rotate-0" />

              {/* Revenue */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 text-center min-w-[140px] border border-emerald-500/30"
              >
                <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-white">Partner Revenue</span>
                <p className="text-xs text-emerald-300 mt-1">Share per activation</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-teal-400/30 to-teal-500/20 blur-2xl" />
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-2xl p-8 md:p-12 border border-teal-500/30">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-2xl md:text-4xl font-bold text-white mb-4"
              >
                Participation Becomes Acquisition.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500"
              >
                Acquisition Becomes Revenue.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="text-slate-400 mt-6 max-w-2xl mx-auto"
              >
                You don&apos;t sell insurance. You enable participation. HIQOR monetizes the rest.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
