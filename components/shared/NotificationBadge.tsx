"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationBadgeProps {
  count: number
  maxCount?: number
  onClick?: () => void
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
  showZero?: boolean
}

const variantStyles = {
  default: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-500 text-white',
}

const sizeStyles = {
  sm: 'min-w-[16px] h-[16px] text-[10px] px-1',
  md: 'min-w-[20px] h-[20px] text-xs px-1.5',
  lg: 'min-w-[24px] h-[24px] text-sm px-2',
}

export function NotificationBadge({
  count,
  maxCount = 99,
  onClick,
  label,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
  showZero = false,
}: NotificationBadgeProps) {
  const [prevCount, setPrevCount] = useState(count)
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger animation when count changes
  useEffect(() => {
    if (count !== prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setPrevCount(count)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [count, prevCount])

  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  const badgeContent = (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isAnimating ? [1, 1.2, 1] : 1,
        opacity: 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 25,
      }}
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {displayCount}
    </motion.span>
  )

  // If label is provided, render as a badge with label
  if (label) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <AnimatePresence mode="wait">
          {badgeContent}
        </AnimatePresence>
      </button>
    )
  }

  // Standalone badge
  if (onClick) {
    return (
      <button onClick={onClick} className="relative">
        <AnimatePresence mode="wait">
          {badgeContent}
        </AnimatePresence>
      </button>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {badgeContent}
    </AnimatePresence>
  )
}

// Compound component for positioning badges relative to children
interface BadgeContainerProps {
  children: React.ReactNode
  count: number
  maxCount?: number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset?: { x?: number; y?: number }
  pulse?: boolean
  showZero?: boolean
  onClick?: () => void
}

const positionStyles = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
}

export function BadgeContainer({
  children,
  count,
  maxCount = 99,
  variant = 'default',
  size = 'sm',
  position = 'top-right',
  offset,
  pulse = false,
  showZero = false,
  onClick,
}: BadgeContainerProps) {
  const [prevCount, setPrevCount] = useState(count)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (count !== prevCount && count > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setPrevCount(count)
      }, 300)
      return () => clearTimeout(timer)
    }
    setPrevCount(count)
  }, [count, prevCount])

  if (count === 0 && !showZero) {
    return <div className="relative inline-block">{children}</div>
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  const offsetStyle = offset
    ? { transform: `translate(${offset.x || 0}px, ${offset.y || 0}px)` }
    : {}

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isAnimating ? [1, 1.3, 1] : 1,
            opacity: 1
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          style={offsetStyle}
          className={`
            absolute ${positionStyles[position]}
            inline-flex items-center justify-center rounded-full font-semibold
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${pulse ? 'animate-pulse' : ''}
            ${onClick ? 'cursor-pointer hover:opacity-90' : ''}
          `}
          onClick={onClick}
        >
          {displayCount}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default NotificationBadge
