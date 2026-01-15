"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Step {
  title: string
  description: string
  icon?: LucideIcon
}

interface StepByStepProps {
  steps: Step[]
  variant?: "vertical" | "horizontal"
}

export function StepByStep({ steps, variant = "vertical" }: StepByStepProps) {
  if (variant === "horizontal") {
    return (
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
              )}

              <div className="
                p-6 bg-white/70 backdrop-blur-xl
                border border-white/20 rounded-2xl
                shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
              ">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                  {index + 1}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500" />

      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon || Check
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              {/* Step number/icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="
                  p-6 bg-white/70 backdrop-blur-xl
                  border border-white/20 rounded-2xl
                  shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
                ">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
