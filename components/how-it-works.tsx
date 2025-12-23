'use client';

import { Building2, Puzzle, ShieldCheck, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  highlight?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Sign Up in Minutes',
    description: 'Quick registration with no upfront costs or contracts.',
    details: [
      'Fill out a simple online form',
      'No credit card required',
      'Approved within 24 hours',
      'Free setup and integration support'
    ],
    icon: <Building2 className="w-8 h-8" />,
    highlight: 'Free to join'
  },
  {
    number: 2,
    title: 'Add to Your Checkout',
    description: 'Seamlessly embed insurance into your existing flow.',
    details: [
      'Simple API or no-code widget',
      'Works with any booking system',
      'Branded to match your site',
      'Mobile-optimized experience'
    ],
    icon: <Puzzle className="w-8 h-8" />,
    highlight: '20 min setup'
  },
  {
    number: 3,
    title: 'Earn on Every Sale',
    description: 'Get paid commission for each policy your customers purchase.',
    details: [
      'Earn $2-5 per policy sold',
      'Automatic monthly payouts',
      'Real-time dashboard tracking',
      'No caps on earnings'
    ],
    icon: <DollarSign className="w-8 h-8" />,
    highlight: 'Avg. $2,400/mo'
  },
];

// Floating particle component for Web 3.0 effect
function FloatingParticle({ delay, duration, size, x, y }: { delay: number; duration: number; size: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-r from-teal-400/20 to-teal-600/20 blur-sm"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Animated connection line between steps
function ConnectionLine({ isActive }: { isActive: boolean }) {
  return (
    <div className="hidden lg:block absolute top-1/2 left-full w-full h-px z-0">
      <motion.div
        className="h-full bg-gradient-to-r from-teal-500 to-teal-300"
        initial={{ scaleX: 0, originX: 0 }}
        animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500"
        initial={{ scale: 0, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
    </div>
  );
}

// Step card with glassmorphism effect
function StepCard({ step, index, isInView }: { step: Step; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line to next step */}
      {index < steps.length - 1 && (
        <ConnectionLine isActive={isInView} />
      )}

      {/* Main card */}
      <motion.div
        className="relative h-full"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-teal-400/20 to-teal-500/20 rounded-3xl blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card content */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-200/50 h-full overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Step number badge with pulse effect */}
          <div className="absolute -top-3 -left-3">
            <motion.div
              className="relative"
              animate={isInView ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              <div className="absolute inset-0 bg-teal-500 rounded-full blur-md opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{step.number}</span>
              </div>
            </motion.div>
          </div>

          {/* Highlight badge */}
          {step.highlight && (
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
                <Zap className="w-3 h-3" />
                {step.highlight}
              </span>
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            className="mb-6 mt-4"
            animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 shadow-inner">
              {step.icon}
            </div>
          </motion.div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {step.title}
          </h3>
          <p className="text-slate-600 mb-6">
            {step.description}
          </p>

          {/* Details list with staggered animation */}
          <ul className="space-y-2">
            {step.details.map((detail, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-600"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.2 + i * 0.1 }}
              >
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {detail}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingParticle delay={0} duration={8} size={60} x={10} y={20} />
        <FloatingParticle delay={1} duration={10} size={40} x={85} y={15} />
        <FloatingParticle delay={2} duration={9} size={50} x={70} y={70} />
        <FloatingParticle delay={3} duration={7} size={30} x={20} y={80} />
        <FloatingParticle delay={1.5} duration={11} size={45} x={50} y={10} />
        <FloatingParticle delay={2.5} duration={8} size={35} x={90} y={60} />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Start earning in 3 simple steps</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Works</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join hundreds of partners earning passive income by offering instant insurance coverage at checkout
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Compensation highlight box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-400/5 to-teal-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-teal-200/50 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Your Revenue, <span className="text-teal-600">Your Way</span>
                </h3>
                <p className="text-slate-600 mb-6">
                  Every time a customer adds insurance at checkout, you earn commission.
                  No inventory, no overhead, no customer service—just passive income that grows with your business.
                </p>
                <ul className="space-y-3">
                  {[
                    'Monthly payouts via ACH or check',
                    'Real-time earnings dashboard',
                    'Dedicated partner success manager',
                    'Marketing materials included'
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '$2-5', label: 'Per Policy Sold' },
                  { value: '68%', label: 'Avg. Opt-in Rate' },
                  { value: '$2,400', label: 'Avg. Monthly Revenue' },
                  { value: '24hrs', label: 'To Go Live' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
          <p className="mt-4 text-slate-500 text-sm">
            No contracts. No setup fees. Start earning in 24 hours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
