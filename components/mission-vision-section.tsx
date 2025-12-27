'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, Quote } from 'lucide-react';
import { useState } from 'react';

export function MissionVisionSection() {
  const [missionHovered, setMissionHovered] = useState(false);
  const [visionHovered, setVisionHovered] = useState(false);

  return (
    <section id="mission-vision" className="relative py-20 md:py-28 bg-gradient-to-b from-teal-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle pattern */}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full border border-teal-200 mb-6"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Our Purpose</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
            What Drives{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Us
            </span>
          </h2>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setMissionHovered(true)}
            onMouseLeave={() => setMissionHovered(false)}
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative h-full"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-teal-500/20 via-teal-400/30 to-teal-500/20 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: missionHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative h-full bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-teal-200 overflow-hidden">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-400" />

                <div className="mb-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/25"
                    animate={{ scale: missionHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Target className="w-8 h-8 text-white" strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Our Mission
                  </h3>
                </div>

                <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                  To power events-based insurance that activates only when real-world risk exists—aligning
                  participants, partners, and insurers through a single InsurTech SaaS platform.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setVisionHovered(true)}
            onMouseLeave={() => setVisionHovered(false)}
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative h-full"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-sky-500/20 via-sky-400/30 to-sky-500/20 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: visionHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative h-full bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-sky-200 overflow-hidden">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-sky-400" />

                <div className="mb-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/25"
                    animate={{ scale: visionHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Eye className="w-8 h-8 text-white" strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Our Vision
                  </h3>
                </div>

                <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                  A world where insurance adapts to human behavior—turning on when people live, move, and
                  participate, and turning off when risk ends.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Founder Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-teal-400/10 to-teal-500/5 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-teal-100 shadow-lg">
              <Quote className="w-10 h-10 text-teal-500/30 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-slate-700 italic leading-relaxed mb-6">
                "We believe the future of insurance isn't about selling policies—it's about enabling moments.
                When you align coverage to behavior, everyone wins."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  H
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">HIQOR Leadership</p>
                  <p className="text-xs text-slate-500">Building the future of events-based insurance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Taglines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {[
            'Insurance for moments, not time.',
            'The infrastructure layer for events-based insurance.',
            'Where participation becomes protection, data, and revenue.',
          ].map((tagline, i) => (
            <motion.span
              key={tagline}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 font-medium"
            >
              {tagline}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
