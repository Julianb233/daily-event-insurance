"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Does this cost me anything?",
    answer: "Absolutely not. There is zero cost to you as a partner. We pay for the insurance coverage AND we pay you. You get paid for every participant who purchases coverage - it's pure revenue with zero expense on your end.",
  },
  {
    question: "Do I need to raise my prices?",
    answer: "No. Your pricing stays exactly the same. Insurance is an optional add-on that participants can choose when they check in or register. You earn money without changing anything about your current business model or pricing structure.",
  },
  {
    question: "How do partners get paid?",
    answer: "You earn money for every person that walks through your door and purchases coverage. We handle all the costs - the insurance, the technology, the claims - you just collect revenue. Payments are made monthly directly to your account.",
  },
  {
    question: "How quickly can members get coverage?",
    answer: "Members can purchase and activate coverage instantly - same day, same moment. No waiting periods. They receive digital proof of coverage immediately via email.",
  },
  {
    question: "What types of businesses can partner with you?",
    answer: "We work with Gyms & Fitness Centers, Climbing Facilities, Equipment Rental businesses, Adventure Sports operators, and more. Our platform supports virtually any active experience type.",
  },
  {
    question: "How do I integrate with my existing systems?",
    answer: "We offer seamless integration with major platforms like MindBody, Zen Planner, and others. Most partners are live within 24 hours with zero technical work required on your end.",
  },
  {
    question: "What specifically does the insurance cover?",
    answer: "Policies are sector-specific but generally cover medical expenses, emergency transport, and activity-related injuries. We fill the gaps that general liability misses - protecting your members when they need it most.",
  },
  {
    question: "Is there any commitment or contract?",
    answer: "No minimums, no long-term contracts, no setup fees. You can start earning immediately with zero risk. If it's not working for you, you can stop anytime - but partners typically see it as free money.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  index: number
  isOpen: boolean
  onClick: () => void
}

function FAQItem({ question, answer, index, isOpen, onClick }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group hover:bg-teal-50 transition-colors duration-300 px-4 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-teal-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative bg-gray-50 py-20 md:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Frequently Asked <span className="text-teal-500">Questions</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about partnering with Daily Event Insurance
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-lg">
            Still have questions? Contact us to learn more about our partnership program.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
