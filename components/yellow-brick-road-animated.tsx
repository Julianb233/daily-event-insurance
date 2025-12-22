"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// Pre-defined brick rows
const BRICK_ROWS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  bricks: Math.max(2, 6 - Math.floor(i / 3)),
  width: 45 - i * 2.5,
  bottom: 5 + i * 5.5,
  opacity: 1 - i * 0.05,
}))

const YELLOW_BRICK_ROAD_IMAGE = "/images/ai-yellow-brick-road.png"

const sparklePositions = [
  { left: "15%", top: "25%", delay: 0, size: "lg" },
  { left: "80%", top: "30%", delay: 0.5, size: "lg" },
  { left: "25%", top: "60%", delay: 1, size: "lg" },
  { left: "70%", top: "55%", delay: 1.5, size: "lg" },
  { left: "45%", top: "20%", delay: 0.8, size: "md" },
  { left: "55%", top: "70%", delay: 1.2, size: "lg" },
  { left: "10%", top: "45%", delay: 0.3, size: "lg" },
  { left: "90%", top: "65%", delay: 1.8, size: "md" },
  { left: "35%", top: "35%", delay: 0.6, size: "lg" },
  { left: "65%", top: "80%", delay: 1.4, size: "lg" },
  { left: "5%", top: "15%", delay: 0.2, size: "md" },
  { left: "95%", top: "40%", delay: 0.9, size: "lg" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-5 h-5 md:w-7 md:h-7"
    case "md":
      return "w-4 h-4 md:w-5 md:h-5"
    default:
      return "w-3 h-3 md:w-4 md:h-4"
  }
}

export function YellowBrickRoadAnimated() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax effects for immersive experience
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.1, 0.1, 0.4])
  // Text appears immediately - no delay
  const textY = useTransform(scrollYProgress, [0, 0.15], [30, 0])
  const textOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1])

  if (!isMounted) {
    return (
      <section ref={sectionRef} className="relative h-screen bg-[#0A4D3C]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-[150vh] md:h-[180vh] overflow-hidden bg-[#0A4D3C]">
      {/* Main image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: imageScale, y: imageY }}>
        <img
          src={YELLOW_BRICK_ROAD_IMAGE}
          alt="Yellow Brick Road to Emerald City"
          className="w-full h-full object-cover"
        />

        {/* Dynamic overlay for depth */}
        <motion.div className="absolute inset-0 bg-[#0A4D3C]" style={{ opacity: overlayOpacity }} />

        {/* Vignette for cinematic effect */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 80%, transparent 30%, rgba(10, 77, 60, 0.5) 100%)",
          }}
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-10">
        {sparklePositions.map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${getSparkleSize(pos.size)}`}
            style={{ left: pos.left, top: pos.top }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 1, 0],
              scale: [0, 1.3, 0.9, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              delay: pos.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.2,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#FFD700"
                style={{ filter: "drop-shadow(0 0 10px rgba(255,215,0,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-32 z-20 px-4">
        <motion.div className="text-center" style={{ y: textY, opacity: textOpacity }}>
          <motion.p
            className="text-[#FFD700]/90 text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4 font-medium"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            Your Journey Begins
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 md:mb-6"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
          >
            Follow The
            <br />
            <span
              className="text-[#FFD700] inline-block mt-1"
              style={{
                textShadow:
                  "0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4), 0 4px 20px rgba(0,0,0,0.8)",
              }}
            >
              Yellow Brick Road
            </span>
          </motion.h2>

          <motion.p
            className="text-white/80 text-sm md:text-lg max-w-sm md:max-w-lg mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            Discover how AI can transform your business and unlock unlimited potential
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="mt-6 md:mt-8 px-8 py-3 md:px-10 md:py-4 bg-[#FFD700] text-[#0A4D3C] font-bold text-sm md:text-base uppercase tracking-wider rounded-full"
            style={{
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.5), 0 10px 40px rgba(0,0,0,0.4)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 50px rgba(255, 215, 0, 0.7), 0 15px 50px rgba(0,0,0,0.5)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A4D3C] via-[#0A4D3C]/80 to-transparent pointer-events-none z-30" />

      {/* Top gradient for smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A4D3C] to-transparent pointer-events-none z-30" />
    </section>
  )
}
