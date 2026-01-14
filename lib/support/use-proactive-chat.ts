"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import type { FormErrorContext, PageContext, ProactiveTrigger } from "./types"

// Page-specific context for greetings and help suggestions
const PAGE_CONTEXTS: Record<string, PageContext> = {
  "/onboarding": {
    greeting: "Need help getting started with your integration?",
    helpPrompts: [
      "How do I install the widget?",
      "What API credentials do I need?",
      "How long does setup take?"
    ],
    idleMessage: "Taking your time? I can walk you through the setup step-by-step.",
    exitMessage: "Before you go - want me to save your progress or send setup instructions to your email?"
  },
  "/onboarding/widget": {
    greeting: "Ready to add the insurance widget to your site?",
    helpPrompts: [
      "Show me the embed code",
      "How do I customize colors?",
      "Can I preview it first?"
    ],
    idleMessage: "Need help with the widget code? I can generate it for your specific setup.",
    exitMessage: "Widget not working as expected? Let me help troubleshoot before you leave."
  },
  "/onboarding/api": {
    greeting: "Setting up API integration? I can help with authentication.",
    helpPrompts: [
      "How do I get API keys?",
      "Show me the endpoints",
      "What about webhooks?"
    ],
    idleMessage: "API setup can be tricky. Want me to explain the authentication flow?",
    exitMessage: "Still have questions about the API? I can send you documentation."
  },
  "/onboarding/pos": {
    greeting: "Connecting your POS system? Let me guide you.",
    helpPrompts: [
      "Which POS systems work?",
      "How to connect Mindbody?",
      "What data syncs?"
    ],
    idleMessage: "POS integrations have specific requirements. Shall I check your system compatibility?",
    exitMessage: "POS connection not complete? I can help you finish the setup."
  },
  "/partner": {
    greeting: "Welcome to your partner dashboard!",
    helpPrompts: [
      "How do I view my earnings?",
      "Where are my policies?",
      "How to get support?"
    ],
    idleMessage: "Looking for something specific? I can help you navigate the dashboard.",
    exitMessage: "Have questions about your partnership? Let me know before you go."
  },
  "/quote": {
    greeting: "Getting a quote? I can explain coverage options.",
    helpPrompts: [
      "What's covered?",
      "How is pricing calculated?",
      "Can I customize coverage?"
    ],
    idleMessage: "Not sure about coverage options? I can break down what each plan includes.",
    exitMessage: "Need help deciding? I can compare options for your specific event."
  }
}

// Default context for pages without specific configuration
const DEFAULT_CONTEXT: PageContext = {
  greeting: "Hi! Need help with anything?",
  helpPrompts: [
    "How does this work?",
    "What coverage options exist?",
    "How do I get started?"
  ],
  idleMessage: "Looking for something? I'm here to help!",
  exitMessage: "Have questions? I'm just a click away."
}

export interface UseProactiveChatOptions {
  enabled?: boolean
  idleTimeout?: number // ms before showing idle prompt
  exitIntentEnabled?: boolean
  scrollDepthThreshold?: number // 0-100
  onTrigger?: (trigger: ProactiveTrigger) => void
  onFormError?: (error: FormErrorContext) => void
}

export interface UseProactiveChatReturn {
  currentContext: PageContext
  activeTrigger: ProactiveTrigger | null
  triggers: ProactiveTrigger[]
  isIdle: boolean
  hasExitIntent: boolean
  reportFormError: (error: FormErrorContext) => void
  reportCustomError: (message: string, details?: Record<string, unknown>) => void
  dismissTrigger: () => void
  clearTriggers: () => void
  getContextualGreeting: () => string
  getSuggestedPrompts: () => string[]
}

export function useProactiveChat(options: UseProactiveChatOptions = {}): UseProactiveChatReturn {
  const {
    enabled = true,
    idleTimeout = 30000, // 30 seconds default
    exitIntentEnabled = true,
    scrollDepthThreshold = 75,
    onTrigger,
    onFormError,
  } = options

  const pathname = usePathname()
  const [triggers, setTriggers] = useState<ProactiveTrigger[]>([])
  const [activeTrigger, setActiveTrigger] = useState<ProactiveTrigger | null>(null)
  const [isIdle, setIsIdle] = useState(false)
  const [hasExitIntent, setHasExitIntent] = useState(false)
  const [scrollDepth, setScrollDepth] = useState(0)

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const hasShownIdlePromptRef = useRef(false)
  const hasShownExitPromptRef = useRef(false)
  const hasShownScrollPromptRef = useRef(false)

  // Get current page context
  const currentContext = PAGE_CONTEXTS[pathname || ""] || DEFAULT_CONTEXT

  // Reset prompts when page changes
  useEffect(() => {
    hasShownIdlePromptRef.current = false
    hasShownExitPromptRef.current = false
    hasShownScrollPromptRef.current = false
    setIsIdle(false)
    setHasExitIntent(false)
    setScrollDepth(0)
  }, [pathname])

  // Add a new trigger
  const addTrigger = useCallback((trigger: Omit<ProactiveTrigger, "timestamp">) => {
    const fullTrigger: ProactiveTrigger = {
      ...trigger,
      timestamp: Date.now(),
    }
    setTriggers((prev) => [...prev, fullTrigger])
    setActiveTrigger(fullTrigger)
    onTrigger?.(fullTrigger)
  }, [onTrigger])

  // Idle detection
  useEffect(() => {
    if (!enabled) return

    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now()
      setIsIdle(false)

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      idleTimerRef.current = setTimeout(() => {
        if (!hasShownIdlePromptRef.current) {
          setIsIdle(true)
          hasShownIdlePromptRef.current = true
          addTrigger({
            type: "idle",
            message: currentContext.idleMessage,
            suggestedActions: currentContext.helpPrompts,
            priority: "medium",
          })
        }
      }, idleTimeout)
    }

    // Activity events
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"]
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }))

    // Initial timer
    resetIdleTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer))
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [enabled, idleTimeout, currentContext, addTrigger])

  // Exit intent detection
  useEffect(() => {
    if (!enabled || !exitIntentEnabled) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through top of viewport
      if (e.clientY <= 0 && !hasShownExitPromptRef.current) {
        setHasExitIntent(true)
        hasShownExitPromptRef.current = true
        addTrigger({
          type: "exit_intent",
          message: currentContext.exitMessage,
          suggestedActions: ["Save my progress", "Email me instructions", "I'll be back later"],
          priority: "high",
        })
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [enabled, exitIntentEnabled, currentContext, addTrigger])

  // Scroll depth detection
  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollDepth(depth)

      if (depth >= scrollDepthThreshold && !hasShownScrollPromptRef.current) {
        hasShownScrollPromptRef.current = true
        addTrigger({
          type: "scroll_depth",
          message: "You've scrolled quite a bit! Need help finding something specific?",
          suggestedActions: ["Yes, help me find...", "Just browsing"],
          priority: "low",
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [enabled, scrollDepthThreshold, addTrigger])

  // Form error monitoring
  useEffect(() => {
    if (!enabled) return

    const handleFormError = (event: Event) => {
      const target = event.target as HTMLElement

      // Check if it's a form submission error
      if (target.tagName === "FORM") {
        const form = target as HTMLFormElement
        const invalidElements = form.querySelectorAll(":invalid")

        if (invalidElements.length > 0) {
          const firstInvalid = invalidElements[0] as HTMLInputElement
          const errorContext: FormErrorContext = {
            formId: form.id || form.name,
            fieldName: firstInvalid.name || firstInvalid.id,
            errorMessage: firstInvalid.validationMessage || "Form validation failed",
          }

          onFormError?.(errorContext)

          addTrigger({
            type: "form_error",
            message: `Having trouble with the form? I can help with: ${errorContext.errorMessage}`,
            suggestedActions: ["Help me fix this", "What info do you need?"],
            priority: "high",
          })
        }
      }
    }

    document.addEventListener("invalid", handleFormError, true)
    document.addEventListener("submit", handleFormError, true)

    return () => {
      document.removeEventListener("invalid", handleFormError, true)
      document.removeEventListener("submit", handleFormError, true)
    }
  }, [enabled, addTrigger, onFormError])

  // Global error monitoring
  useEffect(() => {
    if (!enabled) return

    const handleError = (event: ErrorEvent) => {
      addTrigger({
        type: "error",
        message: "Something went wrong. Need help troubleshooting?",
        suggestedActions: ["Yes, help me fix this", "Report this issue"],
        priority: "high",
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addTrigger({
        type: "error",
        message: "An unexpected error occurred. I can help diagnose the issue.",
        suggestedActions: ["Diagnose the problem", "Contact support"],
        priority: "high",
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [enabled, addTrigger])

  // Report form error manually
  const reportFormError = useCallback((error: FormErrorContext) => {
    onFormError?.(error)
    addTrigger({
      type: "form_error",
      message: `Form error: ${error.errorMessage}`,
      suggestedActions: ["Help me fix this", "Skip this step"],
      priority: "high",
    })
  }, [addTrigger, onFormError])

  // Report custom error
  const reportCustomError = useCallback((message: string, details?: Record<string, unknown>) => {
    addTrigger({
      type: "error",
      message,
      suggestedActions: details?.suggestedActions as string[] || ["Get help"],
      priority: (details?.priority as ProactiveTrigger["priority"]) || "medium",
    })
  }, [addTrigger])

  // Dismiss current trigger
  const dismissTrigger = useCallback(() => {
    setActiveTrigger(null)
  }, [])

  // Clear all triggers
  const clearTriggers = useCallback(() => {
    setTriggers([])
    setActiveTrigger(null)
  }, [])

  // Get contextual greeting based on page and time
  const getContextualGreeting = useCallback(() => {
    const hour = new Date().getHours()
    let timeGreeting = ""

    if (hour < 12) {
      timeGreeting = "Good morning! "
    } else if (hour < 17) {
      timeGreeting = "Good afternoon! "
    } else {
      timeGreeting = "Good evening! "
    }

    return timeGreeting + currentContext.greeting
  }, [currentContext])

  // Get suggested prompts based on context
  const getSuggestedPrompts = useCallback(() => {
    return currentContext.helpPrompts
  }, [currentContext])

  return {
    currentContext,
    activeTrigger,
    triggers,
    isIdle,
    hasExitIntent,
    reportFormError,
    reportCustomError,
    dismissTrigger,
    clearTriggers,
    getContextualGreeting,
    getSuggestedPrompts,
  }
}

// Hook for monitoring specific form submissions
export function useFormErrorMonitor(formRef: React.RefObject<HTMLFormElement | null>) {
  const [errors, setErrors] = useState<FormErrorContext[]>([])

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const handleInvalid = (e: Event) => {
      const target = e.target as HTMLInputElement
      setErrors((prev) => [
        ...prev,
        {
          formId: form.id || form.name,
          fieldName: target.name || target.id,
          errorMessage: target.validationMessage,
        },
      ])
    }

    const handleSubmit = () => {
      setErrors([]) // Clear on successful submit attempt
    }

    form.addEventListener("invalid", handleInvalid, true)
    form.addEventListener("submit", handleSubmit)

    return () => {
      form.removeEventListener("invalid", handleInvalid, true)
      form.removeEventListener("submit", handleSubmit)
    }
  }, [formRef])

  return { errors, clearErrors: () => setErrors([]) }
}
