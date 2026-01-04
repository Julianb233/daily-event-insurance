'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';

interface ExitIntentPopupProps {
  /** Annual loss amount to display */
  annualLoss: number;
  /** CTA button text */
  buttonText?: string;
  /** Callback when CTA is clicked */
  onCTAClick: () => void;
  /** Optional calendar link */
  calendarLink?: string;
}

/**
 * ExitIntentPopup Component
 *
 * Triggers when user moves cursor toward browser close/tab area.
 * Uses loss aversion messaging to capture abandoning visitors.
 *
 * Features:
 * - Mouse movement detection (exit intent)
 * - One-time trigger (won't show again in session)
 * - Dismissible with X button or clicking outside
 * - Mobile-friendly (triggers on back button or scroll up)
 * - Loss-focused messaging
 */
export function ExitIntentPopup({
  annualLoss,
  buttonText = "Show Me The Money",
  onCTAClick,
  calendarLink,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Format loss amounts
  const formattedAnnualLoss = annualLoss.toLocaleString('en-US');
  const dailyLoss = Math.round(annualLoss / 365);
  const formattedDailyLoss = dailyLoss.toLocaleString('en-US');

  // Handle mouse exit intent (desktop)
  useEffect(() => {
    if (hasTriggered) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to top of viewport (toward close button)
      if (e.clientY <= 50 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    // Small delay before enabling to prevent immediate trigger
    const enableTimeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(enableTimeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  // Handle scroll up intent (mobile)
  useEffect(() => {
    if (hasTriggered) return;

    let lastScrollY = window.scrollY;
    let scrollUpDistance = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // User is scrolling up
        scrollUpDistance += lastScrollY - currentScrollY;

        // Trigger after scrolling up 300px quickly (exit behavior)
        if (scrollUpDistance > 300 && currentScrollY < 200 && !hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true);
        }
      } else {
        // Reset if scrolling down
        scrollUpDistance = 0;
      }

      lastScrollY = currentScrollY;
    };

    // Enable after 5 seconds on mobile
    const enableTimeout = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 5000);

    return () => {
      clearTimeout(enableTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleCTAClick = useCallback(() => {
    onCTAClick();
    handleClose();
  }, [onCTAClick, handleClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {/* Warning Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    WAIT! Don&apos;t Leave Money Behind
                  </h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 sm:py-8">
              {/* Loss Statement */}
              <div className="text-center mb-6">
                <p className="text-slate-600 text-sm sm:text-base mb-2">
                  You&apos;re about to leave
                </p>
                <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                  ${formattedAnnualLoss}/year
                </div>
                <p className="text-slate-500 text-sm">
                  on the table (that&apos;s ${formattedDailyLoss} every single day)
                </p>
              </div>

              {/* Quick Value Props */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-600 mb-3 font-medium">
                  Here&apos;s what you&apos;re missing:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>35% commission on every policy (we do all the work)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>5-minute setup, zero ongoing effort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Your competitors are already doing this</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCTAClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] group"
                >
                  {buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {calendarLink && (
                  <a
                    href={calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    Or book a quick 15-min call →
                  </a>
                )}

                <button
                  onClick={handleClose}
                  className="block w-full text-center px-6 py-2 text-slate-400 hover:text-slate-600 text-sm transition-colors"
                >
                  No thanks, I prefer losing money
                </button>
              </div>
            </div>

            {/* Urgency Footer */}
            <div className="bg-amber-50 border-t border-amber-100 px-6 py-3">
              <p className="text-center text-sm text-amber-800">
                <span className="font-semibold">⚡ Limited spots available</span>
                {' '}— Only accepting 5 new partners this month
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
