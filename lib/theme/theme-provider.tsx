"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "dei-theme";
const THEME_ATTRIBUTE = "data-theme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Resolve theme to actual light/dark value
  const resolveTheme = useCallback(
    (themeValue: Theme): ResolvedTheme => {
      return themeValue === "system" ? getSystemTheme() : themeValue;
    },
    [getSystemTheme]
  );

  // Apply theme to DOM
  const applyTheme = useCallback((resolvedThemeValue: ResolvedTheme) => {
    const root = document.documentElement;
    const isDark = resolvedThemeValue === "dark";

    // Apply class for Tailwind
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply data attribute for additional styling if needed
    root.setAttribute(THEME_ATTRIBUTE, resolvedThemeValue);

    // Update color-scheme for native browser features
    root.style.colorScheme = resolvedThemeValue;
  }, []);

  // Set theme with persistence
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      // Persist to localStorage
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }

      // Resolve and apply immediately
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [storageKey, resolveTheme, applyTheme]
  );

  // Initialize theme on mount
  useEffect(() => {
    // Get stored theme or use default
    let storedTheme = defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        storedTheme = stored as Theme;
      }
    } catch (error) {
      console.error("Failed to read theme preference:", error);
    }

    setThemeState(storedTheme);
    const resolved = resolveTheme(storedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, [defaultTheme, storageKey, resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newResolvedTheme: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, applyTheme]);

  // Provide a stable context value during SSR and before mount
  // This ensures useTheme() doesn't throw during static generation
  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  // Return defaults during static generation or when provider is missing
  // This allows pages to be pre-rendered without the layout context
  if (context === undefined) {
    return {
      theme: 'system',
      setTheme: () => {},
      resolvedTheme: 'light',
    };
  }
  return context;
}
