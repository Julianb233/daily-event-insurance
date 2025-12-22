"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const sparkles = [
  { left: "7%", top: "12%", delay: 0, size: "lg" },
  { left: "91%", top: "18%", delay: 0.4, size: "lg" },
  { left: "12%", top: "82%", delay: 0.7, size: "lg" },
  { left: "87%", top: "78%", delay: 1.0, size: "lg" },
  { left: "50%", top: "8%", delay: 0.2, size: "md" },
  { left: "94%", top: "48%", delay: 0.6, size: "lg" },
  { left: "5%", top: "52%", delay: 0.3, size: "lg" },
  { left: "68%", top: "90%", delay: 0.9, size: "md" },
  { left: "32%", top: "95%", delay: 0.5, size: "lg" },
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

const testimonials = [
  {
    name: "Mike Patterson",
    title: "Owner",
    company: "FitCore Gym & Fitness",
    quote: "Partnering with Daily Event Insurance has been a game-changer for our business. Not only do we provide valuable protection to our members, but we're also earning steady commission on every policy sold. It's genuinely a win-win.",
    results: {
      percentage: "$2.8K",
      metric: "monthly commission revenue",
      additional: "87% member enrollment rate"
    },
    rating: 5,
  },
  {
    name: "Lisa Chen",
    title: "Facility Manager",
    company: "Summit Climbing Center",
    quote: "The liability protection that Daily Event Insurance provides gives us incredible peace of mind. Our members feel safer, we've reduced our exposure, and the enrollment process is completely seamless. It's become an essential part of our member onboarding.",
    results: {
      percentage: "64%",
      metric: "reduction in liability concerns",
      additional: "Zero claims disputes since launch"
    },
    rating: 5,
  },
  {
    name: "Carlos Rodriguez",
    title: "Owner",
    company: "Adventure Gear Rentals",
    quote: "The integration with our booking system was effortless. Customers add insurance during checkout in seconds, and we've seen our revenue increase without any additional work. The HiQor team made implementation incredibly simple.",
    results: {
      percentage: "42%",
      metric: "increase in transaction value",
      additional: "98% customer satisfaction score"
    },
    rating: 5,
  },
  {
    name: "Jennifer Brooks",
    title: "Operations Director",
    company: "Extreme Sports Collective",
    quote: "Our members love having the option for daily event insurance. It's flexible, affordable, and gives them confidence to push their limits. Since partnering with Daily Event Insurance, member retention has improved and we're seeing higher engagement across all our programs.",
    results: {
      percentage: "31%",
      metric: "improvement in member retention",
      additional: "3,200+ policies sold in 6 months"
    },
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial()
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <section className="relative bg-slate-900 py-20 md:py-32 overflow-hidden">
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
                fill="#14B8A6"
                style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative swirls */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="swirl-gradient-testimonials" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100,10 Q150,50 140,100 T100,190 Q50,150 60,100 T100,10"
            fill="none"
            stroke="url(#swirl-gradient-testimonials)"
            strokeWidth="2"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight">
            Success <span className="text-teal-400">Stories</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-teal-100/90 max-w-2xl mx-auto">
            Real results from real partners who transformed their business with Daily Event Insurance
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="relative h-[550px] md:h-[500px] mb-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl border-2 border-teal-500/30 p-8 md:p-12 h-full flex flex-col relative overflow-hidden">
                  {/* Teal corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-transparent rounded-bl-[100px]" />

                  {/* Quote Icon */}
                  <div className="absolute top-8 left-8 opacity-10">
                    <Quote className="w-16 h-16 md:w-20 md:h-20 text-teal-400" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-teal-400 text-teal-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 flex-grow relative z-10">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Results Box */}
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6 mb-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-4xl md:text-5xl font-black text-teal-400 mb-2">
                          {testimonials[currentIndex].results.percentage}
                        </div>
                        <div className="text-white/80 text-sm md:text-base">
                          {testimonials[currentIndex].results.metric}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-white/70 text-sm md:text-base">
                          {testimonials[currentIndex].results.additional}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-slate-900 font-black text-2xl">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-teal-400 text-sm">
                        {testimonials[currentIndex].title}, {testimonials[currentIndex].company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-teal-500/20 border-2 border-teal-500 text-teal-400 flex items-center justify-center hover:bg-teal-500 hover:text-slate-900 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Dot Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-teal-400"
                      : "w-2 bg-teal-400/30 hover:bg-teal-400/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-teal-500/20 border-2 border-teal-500 text-teal-400 flex items-center justify-center hover:bg-teal-500 hover:text-slate-900 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/70 mb-6 text-lg">
            Ready to become a partner and earn commission?
          </p>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-slate-900 font-bold text-lg rounded-xl hover:bg-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Our Partner Network
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
