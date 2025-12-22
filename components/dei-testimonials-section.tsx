"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "Owner & Head Coach",
    company: "PowerHouse CrossFit",
    location: "Austin, TX",
    quote: "I was skeptical at first, but adding Daily Event Insurance to our membership packages has been absolutely incredible. We're making an extra $2,400 every single month in commission, and our members actually thank us for offering it. It's the easiest revenue stream we've ever added—literally zero overhead, just pure profit.",
    results: {
      percentage: "$2,400",
      metric: "extra monthly revenue",
      additional: "91% member opt-in rate"
    },
    rating: 5,
  },
  {
    name: "Marcus Chen",
    title: "Facility Director",
    company: "Summit Rock Climbing & Bouldering",
    location: "Denver, CO",
    quote: "Before Daily Event Insurance, I spent sleepless nights worrying about liability. What if someone gets seriously hurt? What if we get sued? Now our climbers have real protection, and honestly, it's taken this massive weight off my shoulders. We haven't had a single claim issue, and our members feel safer pushing their limits. It's peace of mind you can't put a price on.",
    results: {
      percentage: "Zero",
      metric: "claims disputes in 18 months",
      additional: "73% reduction in liability stress"
    },
    rating: 5,
  },
  {
    name: "Jamie Rodriguez",
    title: "Owner",
    company: "Alpine Adventure Rentals",
    location: "Lake Tahoe, CA",
    quote: "Our customers love it. Seriously, they're adding insurance at checkout without us even having to mention it. We integrated it in about 20 minutes, and now 68% of our rentals include coverage. That's translated to a 43% jump in our average transaction value. Best part? It runs itself—we literally don't do anything except watch the commission checks roll in every month.",
    results: {
      percentage: "43%",
      metric: "increase in transaction value",
      additional: "68% customer opt-in rate"
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
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            Success <span className="text-teal-500">Stories</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
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
                <div className="bg-white rounded-3xl border-2 border-teal-500/30 p-8 md:p-12 h-full flex flex-col relative overflow-hidden shadow-xl">
                  {/* Teal corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-[100px]" />

                  {/* Quote Icon */}
                  <div className="absolute top-8 left-8 opacity-10">
                    <Quote className="w-16 h-16 md:w-20 md:h-20 text-teal-500" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-teal-500 text-teal-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 flex-grow relative z-10">
                    <span className="text-teal-500 text-5xl leading-none font-serif">"</span>
                    {testimonials[currentIndex].quote}
                    <span className="text-teal-500 text-5xl leading-none font-serif">"</span>
                  </blockquote>

                  {/* Results Box */}
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-4xl md:text-5xl font-black text-teal-600 mb-2">
                          {testimonials[currentIndex].results.percentage}
                        </div>
                        <div className="text-slate-600 text-sm md:text-base">
                          {testimonials[currentIndex].results.metric}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-slate-500 text-sm md:text-base">
                          {testimonials[currentIndex].results.additional}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-lg">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-teal-600 text-sm font-medium">
                        {testimonials[currentIndex].title}
                      </div>
                      <div className="text-slate-500 text-sm">
                        {testimonials[currentIndex].company} • {testimonials[currentIndex].location}
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
              className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300"
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
                      ? "w-8 bg-teal-500"
                      : "w-2 bg-teal-300 hover:bg-teal-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300"
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
          <p className="text-slate-600 mb-6 text-lg">
            Ready to become a partner and earn commission?
          </p>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
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
