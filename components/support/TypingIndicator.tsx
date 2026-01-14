"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  userName?: string
  className?: string
  variant?: "dots" | "wave" | "pulse"
  size?: "sm" | "md" | "lg"
}

export function TypingIndicator({
  userName,
  className,
  variant = "wave",
  size = "md"
}: TypingIndicatorProps) {
  const sizeClasses = {
    sm: { dot: "w-1.5 h-1.5", gap: "gap-0.5", text: "text-[10px]" },
    md: { dot: "w-2 h-2", gap: "gap-1", text: "text-xs" },
    lg: { dot: "w-2.5 h-2.5", gap: "gap-1.5", text: "text-sm" }
  }

  const sizes = sizeClasses[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-center", sizes.gap, className)}
    >
      <div className={cn("flex items-center bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-zinc-200 dark:border-zinc-700", sizes.gap)}>
        <TypingDots variant={variant} dotClass={sizes.dot} />
        {userName && (
          <span className={cn("ml-2 text-zinc-500 dark:text-zinc-400", sizes.text)}>
            {userName} is typing...
          </span>
        )}
        {!userName && (
          <span className={cn("ml-2 text-zinc-500 dark:text-zinc-400", sizes.text)}>
            Typing...
          </span>
        )}
      </div>
    </motion.div>
  )
}

function TypingDots({
  variant,
  dotClass
}: {
  variant: "dots" | "wave" | "pulse"
  dotClass: string
}) {
  if (variant === "wave") {
    return <WaveTypingDots dotClass={dotClass} />
  }
  if (variant === "pulse") {
    return <PulseTypingDots dotClass={dotClass} />
  }
  return <BounceTypingDots dotClass={dotClass} />
}

function BounceTypingDots({ dotClass }: { dotClass: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("rounded-full bg-zinc-400 dark:bg-zinc-500", dotClass)}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

function WaveTypingDots({ dotClass }: { dotClass: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("rounded-full bg-teal-500 dark:bg-teal-400", dotClass)}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

function PulseTypingDots({ dotClass }: { dotClass: string }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("rounded-full", dotClass)}
          animate={{
            backgroundColor: ["#a1a1aa", "#14b8a6", "#a1a1aa"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Minimal typing indicator for inline use
export function TypingIndicatorMinimal({
  className,
}: {
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn("flex items-center gap-1", className)}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-zinc-400"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

// Agent avatar with typing animation
export function AgentTypingIndicator({
  agentName = "Support Agent",
  agentAvatar,
  className
}: {
  agentName?: string
  agentAvatar?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn("flex items-start gap-2", className)}
    >
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden">
          {agentAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agentAvatar} alt={agentName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {agentName.charAt(0)}
            </span>
          )}
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <WaveTypingDots dotClass="w-2 h-2" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {agentName} is typing...
          </span>
        </div>
      </div>
    </motion.div>
  )
}
