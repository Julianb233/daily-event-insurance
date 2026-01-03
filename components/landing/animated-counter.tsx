'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  /** Target number to count up to */
  end: number;
  /** Animation duration in milliseconds (default: 2000) */
  duration?: number;
  /** Optional prefix (e.g., "$") */
  prefix?: string;
  /** Optional suffix (e.g., "/year") */
  suffix?: string;
}

/**
 * AnimatedCounter Component
 *
 * Animates a number count-up from 0 to a target value with smooth motion.
 * Formats numbers with commas for better readability.
 *
 * @example
 * <AnimatedCounter end={38400} prefix="$" suffix="/year" duration={2000} />
 * // Displays: $0 → $38,400/year over 2 seconds
 */
export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animation timeline: 0 to duration milliseconds
    const startTime = Date.now();

    const animateCounter = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOut for smooth deceleration
      const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
      const easedProgress = easeOutQuad(progress);

      // Calculate current value
      const currentValue = Math.floor(end * easedProgress);
      setDisplayValue(currentValue);

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    const animationId = requestAnimationFrame(animateCounter);

    return () => cancelAnimationFrame(animationId);
  }, [end, duration]);

  /**
   * Format number with commas
   * 38400 → "38,400"
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-block font-semibold"
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </motion.span>
  );
}
