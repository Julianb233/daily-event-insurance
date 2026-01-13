"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme/theme-provider";
import { useState } from "react";

type Size = "sm" | "md" | "lg";

interface ThemeToggleProps {
  size?: Size;
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

const labelSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function ThemeToggle({
  size = "md",
  showLabel = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const cycleTheme = () => {
    const themeOrder: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getThemeLabel = () => {
    if (theme === "system") {
      return `System (${resolvedTheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const getIcon = () => {
    const iconSize = iconSizes[size];

    if (theme === "system") {
      return <Monitor size={iconSize} />;
    }

    return resolvedTheme === "dark" ? (
      <Moon size={iconSize} />
    ) : (
      <Sun size={iconSize} />
    );
  };

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={cycleTheme}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]}
          inline-flex items-center justify-center
          rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          active:bg-gray-100 dark:active:bg-gray-600
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900
        `}
        aria-label={`Switch to next theme (current: ${getThemeLabel()})`}
        type="button"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme + resolvedTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </button>

      {showLabel && (
        <span
          className={`
            ${labelSizes[size]}
            font-medium text-gray-700 dark:text-gray-200
          `}
        >
          {getThemeLabel()}
        </span>
      )}

      <AnimatePresence>
        {showTooltip && !showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-1/2 -translate-x-1/2 mt-2
              px-2 py-1 rounded-md
              bg-gray-900 dark:bg-gray-700
              text-white text-xs font-medium
              whitespace-nowrap
              pointer-events-none
              z-50
            "
          >
            {getThemeLabel()}
            <div
              className="
                absolute bottom-full left-1/2 -translate-x-1/2
                border-4 border-transparent border-b-gray-900 dark:border-b-gray-700
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
