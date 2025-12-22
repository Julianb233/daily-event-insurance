"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import Image from "next/image"

// Pre-defined brick rows for the 3D road effect
const BRICK_ROWS = [
  { id: 1, z: 0, scale: 1 },
  { id: 2, z: 50, scale: 0.95 },
  { id: 3, z: 100, scale: 0.9 },
  { id: 4, z: 150, scale: 0.85 },
  { id: 5, z: 200, scale: 0.8 },
  { id: 6, z: 250, scale: 0.75 },
  { id: 7, z: 300, scale: 0.7 },
  { id: 8, z: 350, scale: 0.65 },
  { id: 9, z: 400, scale: 0.6 },
  { id: 10, z: 450, scale: 0.55 },
  { id: 11, z: 500, scale: 0.5 },
  { id: 12, z: 550, scale: 0.45 },
]

// Sparkle positions - static to avoid hydration issues
const SPARKLES = [
  { id: 1, left: 10, bottom: 20, size: 4, delay: 0 },
  { id: 2, left: 25, bottom: 35, size: 3, delay: 0.3 },
  { id: 3, left: 40, bottom: 15, size: 5, delay: 0.6 },
  { id: 4, left: 55, bottom: 40, size: 3, delay: 0.9 },
  { id: 5, left: 70, bottom: 25, size: 4, delay: 1.2 },
  { id: 6, left: 85, bottom: 30, size: 3, delay: 1.5 },
  { id: 7, left: 15, bottom: 45, size: 4, delay: 0.2 },
  { id: 8, left: 60, bottom: 50, size: 5, delay: 0.8 },
  { id: 9, left: 80, bottom: 15, size: 3, delay: 1.1 },
  { id: 10, left: 35, bottom: 55, size: 4, delay: 0.5 },
]

export function YellowBrickRoadHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const roadY = scrollYProgress
  const textY = scrollYProgress
  const textOpacity = scrollYProgress

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <section ref={sectionRef} className="relative h-screen bg-[#041f1a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#041f1a]">
      {/* Yellow Brick Road Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/yellow-brick-road.png"
          alt="Yellow Brick Road to Emerald City"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041f1a]/80 via-transparent to-[#041f1a]/30" />
      </div>

      {/* Animated clouds/swirls */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-0 w-48 h-48 md:w-72 md:h-72 rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Rolling green hills - layered for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] overflow-hidden">
        {/* Far hill */}
        <motion.div className="absolute bottom-[35%] left-0 right-0 h-[40%]" style={{ y: roadY }}>
          <div
            className="w-[150%] h-full -ml-[25%] rounded-t-[100%]"
            style={{
              background: "linear-gradient(180deg, #2d8d5a 0%, #1a6d44 100%)",
            }}
          />
        </motion.div>

        {/* Mid hill */}
        <motion.div className="absolute bottom-[20%] left-0 right-0 h-[35%]" style={{ y: textY }}>
          <div
            className="w-[120%] h-full -ml-[10%] rounded-t-[80%]"
            style={{
              background: "linear-gradient(180deg, #3a9d6a 0%, #2d8d5a 100%)",
            }}
          />
        </motion.div>

        {/* Near hill with grass texture */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%]">
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(180deg, #4aad7a 0%, #3a9d6a 50%, #2d8d5a 100%)",
            }}
          />
        </div>
      </div>

      {/* 3D Yellow Brick Road */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[70%]"
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 30%",
          y: roadY,
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Road path - vanishing into distance */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom"
            style={{
              width: "40%",
              height: "100%",
              background: "linear-gradient(to top, #FFD700 0%, #DAA520 50%, #B8860B 80%, transparent 100%)",
              clipPath: "polygon(30% 100%, 70% 100%, 52% 0%, 48% 0%)",
              transform: "rotateX(60deg)",
              boxShadow: "0 0 60px rgba(255, 215, 0, 0.4)",
            }}
          />

          {/* Animated brick rows */}
          {BRICK_ROWS.map((row, index) => (
            <motion.div
              key={row.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: `${5 + index * 5}%`,
                width: `${35 - index * 2}%`,
                height: "3%",
                minHeight: "12px",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              {/* Brick row */}
              <div className="flex justify-center gap-1 h-full">
                {[0, 1, 2, 3, 4].slice(0, Math.max(2, 5 - Math.floor(index / 3))).map((brick) => (
                  <motion.div
                    key={brick}
                    className="h-full rounded-sm"
                    style={{
                      width: `${18 + index}%`,
                      background: `linear-gradient(135deg, #FFD700 0%, #FFC800 50%, #DAA520 100%)`,
                      boxShadow:
                        index < 6
                          ? "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)"
                          : "inset 0 1px 2px rgba(184, 134, 11, 0.5)",
                      border: "1px solid rgba(184, 134, 11, 0.5)",
                    }}
                    animate={{
                      boxShadow: [
                        "inset 0 2px 4px rgba(255,255,255,0.3), 0 0 10px rgba(255, 215, 0, 0.3)",
                        "inset 0 2px 4px rgba(255,255,255,0.5), 0 0 20px rgba(255, 215, 0, 0.5)",
                        "inset 0 2px 4px rgba(255,255,255,0.3), 0 0 10px rgba(255, 215, 0, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.1 + brick * 0.05,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Golden sparkles along the road */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {SPARKLES.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute rounded-full"
            style={{
              left: `${sparkle.left}%`,
              bottom: `${sparkle.bottom}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              boxShadow: "0 0 12px rgba(255, 215, 0, 0.9)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.p
            className="text-yellow-300 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 font-medium"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            Begin Your Journey
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 md:mb-6"
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255, 215, 0, 0.3)",
            }}
          >
            Follow The
            <br />
            <span
              className="text-yellow-400"
              style={{ textShadow: "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)" }}
            >
              Yellow Brick Road
            </span>
          </motion.h2>

          <motion.p
            className="text-white/90 text-sm md:text-lg max-w-xs md:max-w-lg mx-auto mb-6 md:mb-8 px-4"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            Your path to AI mastery and business transformation awaits
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-emerald-950 font-bold text-sm md:text-base uppercase tracking-wider rounded-full"
            style={{
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.6), 0 8px 30px rgba(0, 0, 0, 0.4)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255, 215, 0, 0.8)" }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 md:gap-2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        <span className="text-yellow-400/80 text-[10px] md:text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 md:h-32 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to bottom, transparent, #041f1a)",
        }}
      />
    </section>
  )
}
