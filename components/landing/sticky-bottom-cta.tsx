'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface StickyBottomCTAProps {
  text: string;
  buttonText: string;
  onClick: () => void;
  lossPerDay: number;
}

export function StickyBottomCTA({
  text,
  buttonText,
  onClick,
  lossPerDay,
}: StickyBottomCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const scrollThreshold = 200;
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Format the loss amount with commas
  const formattedLoss = Math.round(lossPerDay).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a timeout to update visibility state
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollDistance = window.scrollY;
        setIsHidden(scrollDistance > scrollThreshold);
      }, 100); // Debounce scroll events
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 400,
            mass: 0.8,
          }}
          className="fixed bottom-0 left-0 right-0 z-40 w-full bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90 border-t border-slate-700/50 shadow-2xl backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 sm:gap-6">
              {/* Left Section: Text and Loss Counter */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm sm:text-base font-medium mb-2">
                  {text}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-xs sm:text-sm font-semibold">
                    Losing ${formattedLoss}/day
                  </span>
                </div>
              </div>

              {/* Right Section: Button and Close */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={onClick}
                  className="relative inline-flex items-center justify-center px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 whitespace-nowrap group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonText}
                    <span className="inline-block w-1.5 h-1.5 bg-white rounded-full group-hover:animate-pulse" />
                  </span>
                </button>

                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors duration-200 hover:bg-slate-800/50"
                  aria-label="Close notification"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mobile-optimized spacing */}
            <div className="h-1 sm:h-0" />
          </div>

          {/* Animated bottom accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              delay: 0.2,
            }}
            className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
