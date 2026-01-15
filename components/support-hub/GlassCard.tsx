"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "variant"> {
  variant?: "default" | "elevated" | "featured"
  enable3D?: boolean
  hoverEffect?: boolean
  gradientBorder?: boolean
  children: React.ReactNode
  className?: string
}

export function GlassCard({
  variant = "default",
  enable3D = true,
  hoverEffect = true,
  gradientBorder = false,
  children,
  className,
  ...props
}: GlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 20
    const y = (e.clientY - rect.top - rect.height / 2) / 20

    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const variantStyles = {
    default: "bg-white/70 backdrop-blur-xl border border-white/30",
    elevated: "bg-white/80 backdrop-blur-2xl border border-white/40 shadow-premium",
    featured: "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-2xl border border-white/50 shadow-premium-teal",
  }

  return (
    <div className="perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: enable3D ? -mousePosition.y : 0,
          rotateY: enable3D ? mousePosition.x : 0,
          scale: hoverEffect && isHovered ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
        className={cn(
          "relative rounded-2xl overflow-hidden transform-style-3d backface-hidden",
          variantStyles[variant],
          "transition-all duration-300",
          hoverEffect && "hover:shadow-premium-hover",
          gradientBorder && "gradient-border",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
        {...props}
      >
        {/* Shimmer effect on hover */}
        {hoverEffect && (
          <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
          </motion.div>
        )}

        {/* Gradient border glow on hover */}
        {gradientBorder && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none -z-10"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(14, 165, 233, 0.3))",
              filter: "blur(20px)",
            }}
          />
        )}

        {/* Content with 3D transform */}
        <div
          className="relative z-10"
          style={{
            transform: enable3D ? "translateZ(20px)" : undefined,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
