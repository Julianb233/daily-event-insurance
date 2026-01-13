'use client';

import { motion } from 'framer-motion';
import { Database, Activity, Shield, CheckCircle2, Clock, Users, BarChart3, Lock } from 'lucide-react';
import { useState } from 'react';

const pillars = [
  {
    icon: Database,
    title: 'Experience Intelligence',
    description: 'We capture what ticketing and registration systems can\'t see.',
    color: 'teal',
    features: [
      { icon: CheckCircle2, text: 'Confirmed attendance' },
      { icon: Clock, text: 'Start and end times' },
      { icon: BarChart3, text: 'Duration of participation' },
      { icon: Users, text: 'Frequency across events' },
      { icon: Activity, text: 'Cross-activity behavior' },
    ],
  },
  {
    icon: Activity,
    title: 'Digital Health Signals',
    description: 'Biometric face scan for engagement and intent—not medical data.',
    color: 'sky',
    features: [
      { icon: CheckCircle2, text: 'Real-time participant validation' },
      { icon: CheckCircle2, text: 'Intent confirmation signals' },
      { icon: CheckCircle2, text: 'Engagement verification' },
    ],
    disclaimer: 'We do NOT diagnose, underwrite off medical data, or store medical records.',
  },
  {
    icon: Lock,
    title: 'Privacy-First Architecture',
    description: 'Built for carriers, compliant for everyone.',
    color: 'emerald',
    features: [
      { icon: Shield, text: 'Carrier-safe data handling' },
      { icon: Shield, text: 'IPO-grade compliance' },
      { icon: Shield, text: 'No PII sold or shared' },
    ],
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

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    teal: {
      bg: 'bg-teal-500',
      bgLight: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-600',
      glow: 'from-teal-500/20 via-teal-400/30 to-teal-500/20',
    },
    sky: {
      bg: 'bg-sky-500',
      bgLight: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-600',
      glow: 'from-sky-500/20 via-sky-400/30 to-sky-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      glow: 'from-emerald-500/20 via-emerald-400/30 to-emerald-500/20',
    },
  };

  const colors = colorClasses[pillar.color as keyof typeof colorClasses];

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
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${colors.glow} blur-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card */}
        <div className={`relative h-full bg-white rounded-2xl p-6 md:p-8 shadow-lg border ${colors.border} hover:shadow-xl transition-shadow duration-500 overflow-hidden`}>
          {/* Header */}
          <div className="mb-6">
            <motion.div
              className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
              animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? [0, -5, 5, 0] : 0 }}
              transition={{ duration: 0.4 }}
            >
              <pillar.icon className="w-7 h-7 text-white" strokeWidth={2} />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              {pillar.title}
            </h3>
            <p className="text-slate-600">
              {pillar.description}
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {pillar.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-slate-700"
              >
                <feature.icon className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                <span className="text-sm">{feature.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* Disclaimer if present */}
          {pillar.disclaimer && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className={`mt-6 p-3 ${colors.bgLight} rounded-lg border ${colors.border}`}
            >
              <p className="text-xs text-slate-600 italic">
                {pillar.disclaimer}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DataAdvantageSection() {
  return (
    <section id="data-advantage" className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-40 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.7, 0.5, 0.7],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle grid pattern */}
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
            <Database className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Our Data Advantage</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Capture{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Participation
            </span>
            , Not Just Transactions
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Because HIQOR activates during participation, we see what ticketing and registration systems can&apos;t.
            This is experience intelligence, not marketing data.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16"
        >
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </motion.div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-sky-400/5 to-emerald-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 shadow-xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Data That Powers Acquisition
                  </h3>
                  <p className="text-slate-400">
                    Without compromising privacy. Carrier-safe. IPO-grade.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {['Carrier-Safe', 'Privacy-First', 'IPO-Grade'].map((badge, i) => (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-medium text-teal-300">{badge}</span>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
