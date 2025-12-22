"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const WIZARD_LOGO_URL = "/images/cc6738e0-41db-4759-93ad.jpg"
const GOLDEN_TICKET_URL = "/images/d344cd36-7178-4ad5-8fb1.jpeg"
const PORTRAIT_URL = "/images/e52f0172-aad3-4ca1-ad35.jpeg"
const YELLOW_BRICK_ROAD_BG = "/images/wizard-hero.png"

const SPARKLES = [
  { left: 5, top: 80, delay: 0 },
  { left: 15, top: 85, delay: 0.3 },
  { left: 25, top: 82, delay: 0.6 },
  { left: 45, top: 78, delay: 0.9 },
  { left: 55, top: 84, delay: 1.2 },
  { left: 75, top: 80, delay: 1.5 },
  { left: 85, top: 86, delay: 1.8 },
  { left: 95, top: 82, delay: 2.1 },
]

export default function YellowBrickRoad() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [portraitFlipped, setPortraitFlipped] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const logoOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.25], [0, 1, 1, 0])
  const logoScale = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.25], [0.9, 1, 1, 0.95])

  const roadOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0])
  const roadScale = useTransform(scrollYProgress, [0.2, 0.3, 0.45], [1.1, 1, 0.95])

  const portraitOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.72, 0.8], [0, 1, 1, 0])
  const portraitScale = useTransform(scrollYProgress, [0.5, 0.6], [0.8, 1])

  const ticketOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1])
  const ticketScale = useTransform(scrollYProgress, [0.75, 0.85], [0.85, 1])

  if (!isMounted) {
    return (
      <section
        ref={containerRef}
        className="relative h-[280vh] md:h-[320vh]"
        style={{
          background: "linear-gradient(180deg, #041f1a 0%, #0a3d2e 50%, #041f1a 100%)",
        }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[280vh] md:h-[320vh] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #041f1a 0%, #0a3d2e 30%, #156b4a 50%, #0a3d2e 70%, #041f1a 100%)",
      }}
    >
      {/* Emerald glow overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Gold sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {SPARKLES.map((sparkle, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: isMobile ? "3px" : "4px",
              height: isMobile ? "3px" : "4px",
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Phase 1: Logo */}
        <motion.div
          className="absolute z-30 flex flex-col items-center px-4"
          style={{ opacity: logoOpacity, scale: logoScale }}
        >
          <div className="relative w-[240px] h-[140px] md:w-[450px] md:h-[260px] lg:w-[550px] lg:h-[320px]">
            <img
              src={WIZARD_LOGO_URL || "/placeholder.svg"}
              alt="The Wizard of AI"
              className="w-full h-full object-contain drop-shadow-2xl"
              crossOrigin="anonymous"
            />
            <div
              className="absolute inset-0 blur-3xl -z-10 scale-125"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.25) 0%, transparent 70%)",
              }}
            />
          </div>
          <p className="text-white/80 text-xs md:text-base mt-3 md:mt-6 text-center max-w-xs md:max-w-sm">
            Your journey to AI mastery begins here
          </p>
          <motion.div
            className="mt-3 md:mt-5"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Phase 2: Yellow Brick Road landscape */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{
            opacity: roadOpacity,
            scale: roadScale,
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={YELLOW_BRICK_ROAD_BG || "/placeholder.svg"}
              alt="Yellow Brick Road"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            {/* Gradient overlays */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(4, 31, 26, 0.3) 0%, transparent 30%, transparent 70%, rgba(4, 31, 26, 0.5) 100%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 50%, rgba(4, 31, 26, 0.4) 100%)",
              }}
            />
          </div>

          {/* Floating text */}
          <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-20">
            <motion.p
              className="text-yellow-400 text-sm md:text-lg font-bold tracking-widest uppercase px-4 py-2 md:px-6 md:py-3 rounded-full"
              style={{
                textShadow: "0 0 20px rgba(255, 215, 0, 1), 0 2px 8px rgba(0,0,0,0.8)",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(4px)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Follow the Yellow Brick Road
            </motion.p>
          </div>
        </motion.div>

        {/* Phase 3: Portrait */}
        <motion.div
          className="absolute z-25 flex flex-col items-center"
          style={{
            opacity: portraitOpacity,
            scale: portraitScale,
          }}
        >
          <motion.div
            className="relative cursor-pointer"
            onClick={() => setPortraitFlipped(!portraitFlipped)}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <motion.div
              className="relative w-[180px] h-[180px] md:w-[280px] md:h-[280px]"
              animate={{ rotateY: portraitFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front - Portrait */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  border: "4px solid #FFD700",
                  boxShadow: "0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)",
                }}
              >
                <img
                  src={PORTRAIT_URL || "/placeholder.svg"}
                  alt="The Wizard of AI"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                />
              </div>

              {/* Back - Message */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center p-5"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(135deg, #0a3d2e 0%, #156b4a 50%, #0a3d2e 100%)",
                  border: "4px solid #FFD700",
                  boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
                }}
              >
                <div className="text-center">
                  <p className="text-yellow-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-2">
                    Meet Your Guide
                  </p>
                  <p className="text-white text-sm md:text-base leading-relaxed">Transform your business with AI</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-3 text-yellow-400/80 text-xs font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            {isMobile ? "Tap" : "Click"} to flip
          </motion.p>
        </motion.div>

        {/* Phase 4: Golden Ticket - MASSIVE */}
        <motion.div
          className="absolute z-30 flex flex-col items-center px-4"
          style={{
            opacity: ticketOpacity,
            scale: ticketScale,
          }}
        >
          <div
            className="relative w-[340px] h-[220px] md:w-[650px] md:h-[420px] lg:w-[850px] lg:h-[550px] xl:w-[1000px] xl:h-[650px] rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 100px rgba(255, 215, 0, 0.5)",
            }}
          >
            <img
              src={GOLDEN_TICKET_URL || "/placeholder.svg"}
              alt="Golden Ticket"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            />
          </div>

          <div className="text-center mt-6 md:mt-10">
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-yellow-400 uppercase tracking-tight"
              style={{
                textShadow: "0 0 50px rgba(255, 215, 0, 0.9), 0 0 100px rgba(255, 215, 0, 0.5)",
              }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              This Is Your Golden Ticket
            </motion.h2>
            <p className="text-white/90 text-base md:text-xl lg:text-2xl mt-4 max-w-lg md:max-w-2xl mx-auto font-medium">
              Unlock AI to transform your business
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
