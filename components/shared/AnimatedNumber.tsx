"use client";

import React, { useEffect } from 'react';
import { useSpring, useMotionValue, motion, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: 'currency' | 'percentage' | 'number';
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = 'number',
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: duration,
  });

  const [prevValue, setPrevValue] = React.useState(value);
  const [flashColor, setFlashColor] = React.useState('transparent');

  useEffect(() => {
    // Animate to new value
    motionValue.set(value);

    // Trigger color flash based on direction
    if (value > prevValue) {
      setFlashColor('rgba(34, 197, 94, 0.2)'); // green flash
    } else if (value < prevValue) {
      setFlashColor('rgba(239, 68, 68, 0.2)'); // red flash
    }

    // Reset color after animation
    const flashTimeout = setTimeout(() => {
      setFlashColor('transparent');
    }, 300);

    setPrevValue(value);

    return () => clearTimeout(flashTimeout);
  }, [value, motionValue, prevValue]);

  const displayValue = useTransform(springValue, (latest) => {
    const formatted = formatNumber(latest, format, decimals);
    return `${prefix}${formatted}${suffix}`;
  });

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundColor: flashColor,
      }}
      animate={{
        backgroundColor: flashColor,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{displayValue}</motion.span>
    </motion.span>
  );
};

const formatNumber = (
  value: number,
  format: 'currency' | 'percentage' | 'number',
  decimals: number
): string => {
  const num = Number(value);

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);

    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 100);

    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);
  }
};

const MemoizedAnimatedNumber = React.memo(AnimatedNumber);
export { MemoizedAnimatedNumber as AnimatedNumber };
export default MemoizedAnimatedNumber;
