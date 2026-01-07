"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export function DEIIntroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Logo stays fixed during scroll
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.9])


  const HeroContent = () => (
    <>
      {/* Animated background gradient - subtle professional movement */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.05) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
            "radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(13,148,136,0.05) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
            "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.05) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.3) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main content - centered */}
      <motion.div
        className="relative z-[5] pointer-events-none mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-6 pt-16 pb-10 md:px-8 md:pt-20 md:pb-12"
        style={{ scale: logoScale, opacity: logoOpacity }}
      >
        {/* Company Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 md:mb-10"
        >
          <div className="relative w-64 h-28 md:w-96 md:h-40 lg:w-[480px] lg:h-48">
            <Image
              src="/images/logo-color.png"
              alt="Daily Event Insurance - Events-based insurance platform"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]"
              priority
            />
          </div>
        </motion.div>

        {/* High Core Events Badge - Moved to top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full mb-4 md:mb-6 shadow-sm"
        >
          <span className="text-teal-700 font-bold text-base md:text-lg tracking-wide">
            High Core Events InsureTech Platform
          </span>
        </motion.div>

        {/* Primary Tagline - Insurance for Moments */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-teal-500/15 to-teal-400/10 border border-teal-500/40 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <span className="text-teal-700 font-bold text-sm md:text-base tracking-wide">
              Insurance for Moments, Not Time
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 text-center tracking-tight mb-4 md:mb-6 max-w-5xl"
          style={{
            textShadow: "0 0 60px rgba(20,184,166,0.4), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          Get Paid to{" "}
          <span className="text-teal-500">
            Protect Your Business
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-2xl lg:text-3xl text-slate-600 text-center max-w-4xl font-medium px-4"
        >
          Coverage turns on when your event starts. Turns off when it ends. Earn revenue while protecting participants.
        </motion.p>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base md:text-xl text-teal-600 text-center max-w-3xl mt-4 font-semibold"
        >
          247 facilities already partnered
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-10 w-full max-w-2xl px-4 pointer-events-auto z-30"
        >
          {/* Primary CTA */}
          <motion.a
            href="#get-started"
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg shadow-teal-500/50 hover:shadow-teal-400/60 transition-all duration-300 text-center text-base md:text-lg pointer-events-auto"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20,184,166,0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Earning Today
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#how-it-works"
            className="flex-1 border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-600 font-bold px-6 md:px-8 py-3 md:py-4 rounded-full transition-all duration-300 text-center text-base md:text-lg pointer-events-auto hover:bg-teal-50"
            whileHover={{ scale: 1.02, borderColor: "rgba(94,234,212,1)" }}
            whileTap={{ scale: 0.98 }}
          >
            See How It Works
          </motion.a>
        </motion.div>

        {/* Infrastructure statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-sm md:text-base text-slate-500 text-center max-w-3xl mt-6 md:mt-8 px-4"
        >
          We power the infrastructure that connects live experiences, digital health signals, and insurance economics into a single, scalable system.
        </motion.p>
      </motion.div>

      {/* Subtle glow effect behind content */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-[3]"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(13,148,136,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Scroll indicator - hidden since section is now in middle of page */}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </>
  )

  return (
    <section id="home" ref={sectionRef} className="relative w-full overflow-hidden bg-white">
      <HeroContent />
    </section>
  )
}
