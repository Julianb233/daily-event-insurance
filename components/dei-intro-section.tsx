"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Shield, ChevronDown } from "lucide-react"

export function DEIIntroSection() {
  const [showContent, setShowContent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Logo stays fixed during scroll
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.9])

  useEffect(() => {
    setShowContent(true)
  }, [])

  // Teal sparkles positioned around the screen
  const sparkles = [
    { left: "8%", top: "12%", delay: 0, size: "lg" },
    { left: "88%", top: "18%", delay: 0.3, size: "md" },
    { left: "12%", top: "78%", delay: 0.6, size: "lg" },
    { left: "82%", top: "72%", delay: 0.9, size: "md" },
    { left: "50%", top: "8%", delay: 0.4, size: "sm" },
    { left: "92%", top: "48%", delay: 0.8, size: "lg" },
    { left: "6%", top: "42%", delay: 0.2, size: "md" },
    { left: "94%", top: "32%", delay: 1.1, size: "sm" },
    { left: "25%", top: "22%", delay: 0.5, size: "sm" },
    { left: "75%", top: "85%", delay: 0.7, size: "md" },
    { left: "35%", top: "88%", delay: 1.0, size: "lg" },
    { left: "65%", top: "15%", delay: 1.3, size: "sm" },
  ]

  const getSparkleSize = (size: string) => {
    switch (size) {
      case "lg":
        return "w-4 h-4 md:w-6 md:h-6"
      case "md":
        return "w-3 h-3 md:w-4 md:h-4"
      default:
        return "w-2 h-2 md:w-3 md:h-3"
    }
  }

  const HeroContent = () => (
    <>
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            "radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
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
        className="absolute inset-0 z-[5] flex flex-col items-center justify-center pointer-events-none px-6 md:px-8"
        style={{ scale: logoScale, opacity: logoOpacity }}
      >
        {/* Shield icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <div className="relative">
            <Shield className="w-16 h-16 md:w-24 md:h-24 text-teal-400" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(20,184,166,0.3)",
                  "0 0 40px rgba(20,184,166,0.5)",
                  "0 0 20px rgba(20,184,166,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-8xl font-black uppercase text-white text-center tracking-tight mb-4 md:mb-6"
          style={{
            textShadow: "0 0 60px rgba(20,184,166,0.4), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          Daily Event
          <br />
          <span className="text-teal-400" style={{ textShadow: "0 0 40px rgba(20,184,166,0.6)" }}>
            Insurance
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl lg:text-3xl text-slate-300 text-center max-w-3xl font-medium"
        >
          Same-Day Coverage for Your Members
        </motion.p>

        {/* Subtagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm md:text-lg text-teal-400/80 text-center max-w-2xl mt-4"
        >
          Embedded insurance for gyms, climbing facilities & adventure sports
        </motion.p>
      </motion.div>

      {/* Teal sparkles */}
      <AnimatePresence>
        {showContent &&
          sparkles.map((sparkle, i) => (
            <motion.div
              key={i}
              className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
              style={{ left: sparkle.left, top: sparkle.top }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0],
                scale: [0, 1.3, 0.9, 1.3, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3.5,
                delay: sparkle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1.2,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill="#14B8A6"
                  style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.95))" }}
                />
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Glow effect behind content */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-[3]"
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(13,148,136,0.1) 40%, transparent 70%)",
        }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 z-20 pb-safe"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-teal-400 text-[10px] md:text-xs font-medium tracking-[0.25em] uppercase drop-shadow-lg">
          Scroll to Explore
        </span>
        <motion.div
          className="w-5 h-8 md:w-6 md:h-10 border-2 border-teal-400/70 rounded-full flex justify-center pt-1.5 md:pt-2"
          animate={{ borderColor: ["rgba(20,184,166,0.5)", "rgba(20,184,166,0.9)", "rgba(20,184,166,0.5)"] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="w-1 h-2 md:w-1.5 md:h-2.5 bg-teal-400 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
    </>
  )

  return (
    <section id="home" ref={sectionRef} className="relative w-full min-h-screen h-[100dvh] overflow-hidden bg-slate-900">
      <HeroContent />
    </section>
  )
}
