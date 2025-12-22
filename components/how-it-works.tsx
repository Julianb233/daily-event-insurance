'use client';

import { Building2, Puzzle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Sign Up Your Business',
    description: 'Quick onboarding process for facility owners. Get set up in minutes.',
    icon: <Building2 className="w-10 h-10" />,
  },
  {
    number: 2,
    title: 'Integrate With Your System',
    description: 'Simple API or portal access. Works with your existing POS and booking systems.',
    icon: <Puzzle className="w-10 h-10" />,
  },
  {
    number: 3,
    title: 'Members Get Instant Coverage',
    description: 'Same-day protection for activities. No paperwork, instant peace of mind.',
    icon: <ShieldCheck className="w-10 h-10" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

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
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
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
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative group"
            >
              {/* Connector line - hidden on mobile, shown between cards on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[calc(50%+2.5rem)] w-[calc(100%-2.5rem)] h-0.5 bg-gradient-to-r from-teal-500/40 to-teal-500/20 z-0" />
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-slate-200 group-hover:border-teal-500/30">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>

                {/* Icon container */}
                <div className="mb-6 pt-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover accent border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/0 group-hover:border-teal-500/20 transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 text-lg">
            Ready to protect your members?{' '}
            <a
              href="#contact"
              className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-500/30 hover:decoration-teal-500 transition-colors"
            >
              Get started today
            </a>
          </p>
        </motion.div>
      </div>

      {/* CSS for grid background pattern */}
      <style jsx>{`
        .bg-grid-slate-200\/50 {
          background-image: linear-gradient(to right, rgb(226 232 240 / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(226 232 240 / 0.5) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  );
}
