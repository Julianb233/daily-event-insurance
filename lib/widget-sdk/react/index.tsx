'use client'

/**
 * Daily Event Insurance Widget - React Components
 *
 * React components and hooks for the embeddable insurance widget.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  WidgetConfig,
  WidgetCallbacks,
  WidgetInstance,
  WidgetState,
  WidgetMessage,
  Quote,
  Policy,
  Customer,
  EventDetails,
  BulkEvent,
  OpenOptions,
  WidgetError,
  WidgetPosition,
  WidgetMode,
  CoverageType,
} from '../types'

// ============= Constants =============

const WIDGET_URL = 'https://widget.dailyevent.com/v1/widget.html'
const WIDGET_NAMESPACE = 'DailyEventWidget'

// ============= Props Interfaces =============

export interface InsuranceWidgetProps extends WidgetConfig, WidgetCallbacks {
  /** Additional CSS class names */
  className?: string
  /** Custom inline styles */
  style?: React.CSSProperties
}

export interface InlineInsuranceWidgetProps extends InsuranceWidgetProps {
  /** Width of inline widget */
  width?: string | number
  /** Height of inline widget */
  height?: string | number
}

export interface UseInsuranceWidgetReturn {
  /** Open the widget */
  open: (options?: OpenOptions) => void
  /** Close the widget */
  close: () => void
  /** Toggle widget visibility */
  toggle: () => void
  /** Set customer data */
  setCustomer: (customer: Customer) => void
  /** Set event details */
  setEventDetails: (details: EventDetails) => void
  /** Set bulk events */
  setBulkEvents: (events: BulkEvent[]) => void
  /** Check if widget is open */
  isOpen: boolean
  /** Check if widget is ready */
  isReady: boolean
  /** Current quote */
  currentQuote: Quote | null
  /** Current policy */
  currentPolicy: Policy | null
  /** Current error */
  error: WidgetError | null
}

// ============= Context =============

interface WidgetContextValue {
  widgetRef: React.RefObject<HTMLIFrameElement | null>
  state: WidgetState
  sendMessage: (message: Omit<WidgetMessage, 'widgetId'>) => void
}

const WidgetContext = createContext<WidgetContextValue | null>(null)

// ============= Provider Component =============

interface InsuranceWidgetProviderProps {
  children: ReactNode
  config: WidgetConfig
  callbacks?: WidgetCallbacks
}

export function InsuranceWidgetProvider({
  children,
  config,
  callbacks,
}: InsuranceWidgetProviderProps) {
  const widgetRef = useRef<HTMLIFrameElement | null>(null)
  const widgetIdRef = useRef<string>(generateWidgetId())

  const [state, setState] = useState<WidgetState>({
    isInitialized: false,
    isOpen: false,
    isLoading: false,
    customer: null,
    eventDetails: null,
    bulkEvents: [],
    currentQuote: null,
    currentPolicy: null,
    error: null,
  })

  const sendMessage = useCallback(
    (message: Omit<WidgetMessage, 'widgetId'>) => {
      widgetRef.current?.contentWindow?.postMessage(
        { ...message, widgetId: widgetIdRef.current },
        '*'
      )
    },
    []
  )

  // Handle messages from widget
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.widgetId || event.data.widgetId !== widgetIdRef.current) {
        return
      }

      const message = event.data as WidgetMessage

      switch (message.type) {
        case 'WIDGET_READY':
          setState(s => ({ ...s, isInitialized: true }))
          callbacks?.onReady?.({ widgetId: widgetIdRef.current })
          break
        case 'WIDGET_OPEN':
          setState(s => ({ ...s, isOpen: true }))
          callbacks?.onOpen?.()
          break
        case 'WIDGET_CLOSE':
          setState(s => ({ ...s, isOpen: false }))
          callbacks?.onClose?.()
          break
        case 'QUOTE_START':
          setState(s => ({ ...s, isLoading: true }))
          callbacks?.onQuoteStart?.(message.payload as { eventDetails: EventDetails })
          break
        case 'QUOTE_COMPLETE':
          setState(s => ({
            ...s,
            isLoading: false,
            currentQuote: message.payload as Quote,
          }))
          callbacks?.onQuoteComplete?.(message.payload as Quote)
          break
        case 'QUOTE_ERROR':
          setState(s => ({
            ...s,
            isLoading: false,
            error: message.payload as WidgetError,
          }))
          callbacks?.onQuoteError?.(message.payload as WidgetError)
          break
        case 'PAYMENT_START':
          setState(s => ({ ...s, isLoading: true }))
          callbacks?.onPaymentStart?.(message.payload as { quoteId: string })
          break
        case 'POLICY_PURCHASED':
          setState(s => ({
            ...s,
            isLoading: false,
            currentPolicy: message.payload as Policy,
          }))
          callbacks?.onPolicyPurchased?.(message.payload as Policy)
          break
        case 'PAYMENT_ERROR':
          setState(s => ({
            ...s,
            isLoading: false,
            error: message.payload as WidgetError,
          }))
          callbacks?.onPaymentError?.(message.payload as WidgetError)
          break
        case 'ERROR':
          setState(s => ({ ...s, error: message.payload as WidgetError }))
          callbacks?.onError?.(message.payload as WidgetError)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [callbacks])

  return (
    <WidgetContext.Provider value={{ widgetRef, state, sendMessage }}>
      {children}
    </WidgetContext.Provider>
  )
}

// ============= Hook =============

export function useInsuranceWidget(): UseInsuranceWidgetReturn {
  const context = useContext(WidgetContext)

  if (!context) {
    // Standalone usage without provider
    const [state, setState] = useState<WidgetState>({
      isInitialized: false,
      isOpen: false,
      isLoading: false,
      customer: null,
      eventDetails: null,
      bulkEvents: [],
      currentQuote: null,
      currentPolicy: null,
      error: null,
    })

    return {
      open: () => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.open()
        setState(s => ({ ...s, isOpen: true }))
      },
      close: () => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.close()
        setState(s => ({ ...s, isOpen: false }))
      },
      toggle: () => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.toggle()
        setState(s => ({ ...s, isOpen: !s.isOpen }))
      },
      setCustomer: (customer) => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.setCustomer(customer)
        setState(s => ({ ...s, customer }))
      },
      setEventDetails: (details) => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.setEventDetails(details)
        setState(s => ({ ...s, eventDetails: details }))
      },
      setBulkEvents: (events) => {
        const widget = (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]
        widget?.setBulkEvents(events)
        setState(s => ({ ...s, bulkEvents: events }))
      },
      isOpen: state.isOpen,
      isReady: state.isInitialized,
      currentQuote: state.currentQuote,
      currentPolicy: state.currentPolicy,
      error: state.error,
    }
  }

  const { state, sendMessage } = context

  return {
    open: (options) => sendMessage({ type: 'WIDGET_OPEN', payload: options }),
    close: () => sendMessage({ type: 'WIDGET_CLOSE', payload: null }),
    toggle: () =>
      sendMessage({ type: state.isOpen ? 'WIDGET_CLOSE' : 'WIDGET_OPEN', payload: null }),
    setCustomer: (customer) => sendMessage({ type: 'SET_CUSTOMER', payload: customer }),
    setEventDetails: (details) => sendMessage({ type: 'SET_EVENT_DETAILS', payload: details }),
    setBulkEvents: (events) => sendMessage({ type: 'SET_BULK_EVENTS', payload: events }),
    isOpen: state.isOpen,
    isReady: state.isInitialized,
    currentQuote: state.currentQuote,
    currentPolicy: state.currentPolicy,
    error: state.error,
  }
}

// ============= Main Widget Component =============

export function InsuranceWidget({
  partnerId,
  primaryColor = '#14B8A6',
  position = 'bottom-right',
  mode = 'floating',
  autoOpen = false,
  container,
  products,
  productRules,
  locale = 'en',
  testMode = false,
  testCards = false,
  zIndex = 9999,
  customButton = false,
  theme,
  onReady,
  onOpen,
  onClose,
  onQuoteStart,
  onQuoteComplete,
  onQuoteError,
  onPaymentStart,
  onPolicyPurchased,
  onPaymentError,
  onError,
  className,
  style,
}: InsuranceWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetId = useRef(generateWidgetId())
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [isReady, setIsReady] = useState(false)

  // Build iframe URL with config
  const iframeSrc = buildWidgetUrl({
    partnerId,
    primaryColor,
    position,
    mode,
    autoOpen,
    products,
    productRules,
    locale,
    testMode,
    testCards,
    zIndex,
    customButton,
    theme,
    widgetId: widgetId.current,
  })

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.widgetId || event.data.widgetId !== widgetId.current) {
        return
      }

      const message = event.data as WidgetMessage

      switch (message.type) {
        case 'WIDGET_READY':
          setIsReady(true)
          onReady?.({ widgetId: widgetId.current })
          break
        case 'WIDGET_OPEN':
          setIsOpen(true)
          onOpen?.()
          break
        case 'WIDGET_CLOSE':
          setIsOpen(false)
          onClose?.()
          break
        case 'QUOTE_START':
          onQuoteStart?.(message.payload as { eventDetails: EventDetails })
          break
        case 'QUOTE_COMPLETE':
          onQuoteComplete?.(message.payload as Quote)
          break
        case 'QUOTE_ERROR':
          onQuoteError?.(message.payload as WidgetError)
          break
        case 'PAYMENT_START':
          onPaymentStart?.(message.payload as { quoteId: string })
          break
        case 'POLICY_PURCHASED':
          onPolicyPurchased?.(message.payload as Policy)
          break
        case 'PAYMENT_ERROR':
          onPaymentError?.(message.payload as WidgetError)
          break
        case 'ERROR':
          onError?.(message.payload as WidgetError)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [
    onReady,
    onOpen,
    onClose,
    onQuoteStart,
    onQuoteComplete,
    onQuoteError,
    onPaymentStart,
    onPolicyPurchased,
    onPaymentError,
    onError,
  ])

  // Floating widget styles
  const floatingStyles: React.CSSProperties =
    mode === 'floating'
      ? {
          position: 'fixed',
          [position.includes('right') ? 'right' : 'left']: '20px',
          bottom: '20px',
          zIndex,
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          width: isOpen ? '400px' : '60px',
          height: isOpen ? '600px' : '60px',
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 40px)',
        }
      : {}

  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      title="Daily Event Insurance Widget"
      className={className}
      style={{
        ...floatingStyles,
        ...style,
      }}
      allow="payment"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  )
}

// ============= Inline Widget Component =============

export function InlineInsuranceWidget({
  width = '100%',
  height = '600px',
  ...props
}: InlineInsuranceWidgetProps) {
  return (
    <InsuranceWidget
      {...props}
      mode="inline"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        border: 'none',
        borderRadius: '8px',
        ...props.style,
      }}
    />
  )
}

// ============= Utility Functions =============

function generateWidgetId(): string {
  return `dei_${Math.random().toString(36).substring(2, 11)}`
}

function buildWidgetUrl(config: WidgetConfig & { widgetId: string }): string {
  const params = new URLSearchParams()
  params.set('partnerId', config.partnerId)
  params.set('widgetId', config.widgetId)

  if (config.primaryColor) params.set('primaryColor', config.primaryColor)
  if (config.position) params.set('position', config.position)
  if (config.mode) params.set('mode', config.mode)
  if (config.autoOpen) params.set('autoOpen', 'true')
  if (config.locale) params.set('locale', config.locale)
  if (config.testMode) params.set('testMode', 'true')
  if (config.testCards) params.set('testCards', 'true')
  if (config.customButton) params.set('customButton', 'true')
  if (config.products) params.set('products', config.products.join(','))

  if (config.theme) {
    params.set('theme', JSON.stringify(config.theme))
  }

  return `${WIDGET_URL}?${params.toString()}`
}

// ============= Exports =============

export type {
  WidgetConfig,
  WidgetCallbacks,
  WidgetInstance,
  Quote,
  Policy,
  Customer,
  EventDetails,
  BulkEvent,
  OpenOptions,
  WidgetError,
  WidgetPosition,
  WidgetMode,
  CoverageType,
}
