"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"

const sparkles = [
  { left: "8%", top: "12%", delay: 0, size: "lg" },
  { left: "90%", top: "18%", delay: 0.3, size: "md" },
  { left: "12%", top: "78%", delay: 0.6, size: "lg" },
  { left: "85%", top: "72%", delay: 0.9, size: "md" },
  { left: "50%", top: "8%", delay: 0.4, size: "sm" },
  { left: "92%", top: "48%", delay: 0.8, size: "lg" },
  { left: "6%", top: "42%", delay: 0.2, size: "md" },
  { left: "75%", top: "85%", delay: 0.7, size: "md" },
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

const words = [
  { text: "OPTIMIZE", highlight: true },
  { text: "YOUR", highlight: false },
  { text: "BUSINESS,", highlight: false },
  { text: "AUTOMATE", highlight: true },
  { text: "YOUR", highlight: false },
  { text: "LIFE.", highlight: false },
  { text: "SAVE", highlight: false },
  { text: "TIME", highlight: true },
  { text: "&", highlight: false },
  { text: "MONEY", highlight: true },
  { text: "WITH", highlight: false },
  { text: "THE", highlight: false },
  { text: "POWER", highlight: true },
  { text: "OF", highlight: false },
  { text: "AI.", highlight: true },
  { text: "CREATE", highlight: false },
  { text: "MORE", highlight: false },
  { text: "OPPORTUNITIES", highlight: true },
  { text: "THAN", highlight: false },
  { text: "EVER", highlight: false },
  { text: "BEFORE.", highlight: false },
]

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  return (
    <section id="vision" ref={sectionRef} className="relative min-h-[200vh] bg-[#0A4D3C] text-white">
      <AnimatePresence>
        {sparkles.map((sparkle, i) => (
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
                fill="#D4A84B"
                style={{ filter: "drop-shadow(0 0 10px rgba(212,168,75,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="sticky top-0 min-h-screen flex items-center justify-center py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            className="relative w-64 h-40 md:w-[450px] md:h-[280px] lg:w-[600px] lg:h-[380px] xl:w-[750px] xl:h-[480px] mx-auto mb-12"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.01], [0, 1]),
              scale: useTransform(scrollYProgress, [0, 0.02], [0.9, 1]),
            }}
          >
            <Image
              src="/images/golden-ticket.jpg"
              alt="The Wizard of AI Golden Ticket"
              fill
              className="object-contain"
            />
            {/* Gold glow effect - larger */}
            <div className="absolute inset-[-20%] blur-3xl bg-[#D4A84B]/40 -z-10" />
          </motion.div>

          <motion.p
            className="text-center text-[#D4A84B] font-black tracking-[0.3em] uppercase text-2xl md:text-4xl lg:text-5xl xl:text-6xl mb-12"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.015], [0, 1]),
              textShadow: "0 0 40px rgba(212, 168, 75, 0.8), 0 0 80px rgba(212, 168, 75, 0.4)",
            }}
          >
            This is your golden ticket
          </motion.p>

          <div className="text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight leading-[1.2] flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2">
              {words.map((word, index) => {
                // Start animation very early (at 2% scroll) and complete faster
                const startProgress = 0.02 + (index / words.length) * 0.35
                const endProgress = startProgress + 0.08

                return (
                  <WordHighlight
                    key={index}
                    word={word.text}
                    isHighlightWord={word.highlight}
                    scrollYProgress={scrollYProgress}
                    startProgress={startProgress}
                    endProgress={endProgress}
                  />
                )
              })}
            </h2>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]),
            }}
          >
            <span className="text-white/50 text-xs tracking-widest uppercase">Keep scrolling</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <svg className="w-5 h-5 text-[#D4A84B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WordHighlight({
  word,
  isHighlightWord,
  scrollYProgress,
  startProgress,
  endProgress,
}: {
  word: string
  isHighlightWord: boolean
  scrollYProgress: any
  startProgress: number
  endProgress: number
}) {
  const opacity = useTransform(
    scrollYProgress,
    [startProgress - 0.08, startProgress, endProgress, endProgress + 0.15],
    [0.2, 1, 1, isHighlightWord ? 1 : 0.7],
  )

  const scale = useTransform(scrollYProgress, [startProgress - 0.03, startProgress, startProgress + 0.03], [1, 1.08, 1])

  const y = useTransform(scrollYProgress, [startProgress - 0.08, startProgress], [15, 0])

  const textColor = isHighlightWord ? "text-[#D4A84B]" : "text-white"
  const glowClass = isHighlightWord ? "text-glow-gold" : ""

  return (
    <motion.span
      className={`inline-block ${textColor} ${glowClass} ${isHighlightWord ? "font-brier" : ""}`}
      style={{
        opacity,
        scale,
        y,
      }}
    >
      {word}
    </motion.span>
  )
}
