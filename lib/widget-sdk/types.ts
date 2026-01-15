/**
 * Widget SDK Types
 *
 * Shared type definitions for the Daily Event Insurance embeddable widget.
 * Used across React, Vue, and Vanilla JS implementations.
 */

// ============= Enums =============

/**
 * Widget display position options
 */
export type WidgetPosition = 'bottom-right' | 'bottom-left'

/**
 * Widget display mode options
 */
export type WidgetMode = 'floating' | 'inline' | 'modal'

/**
 * Coverage/product types available
 */
export type CoverageType = 'liability' | 'equipment' | 'cancellation'

/**
 * Quote status options
 */
export type QuoteStatus = 'pending' | 'accepted' | 'declined' | 'expired'

/**
 * Policy status options
 */
export type PolicyStatus = 'active' | 'pending' | 'expired' | 'cancelled'

// ============= Core Data Interfaces =============

/**
 * Coverage details within a quote
 */
export interface CoverageDetails {
  limit: string
  deductible: string
  description: string
}

/**
 * Quote object returned from the API
 */
export interface Quote {
  id: string
  quoteNumber: string
  eventType: string
  eventDate: string
  participants: number
  coverageType: CoverageType
  premium: string
  currency: string
  expiresAt: string
  coverageDetails: CoverageDetails
  status: QuoteStatus
}

/**
 * Policy object returned after purchase
 */
export interface Policy {
  id: string
  policyNumber: string
  quoteId: string
  eventType: string
  eventDate: string
  effectiveDate: string
  expirationDate: string
  coverageType: CoverageType
  premium: string
  status: PolicyStatus
  certificateUrl: string
  customerEmail: string
  customerName: string
}

/**
 * Customer information for pre-population
 */
export interface Customer {
  email?: string
  name?: string
  phone?: string
}

/**
 * Event details for pre-population
 */
export interface EventDetails {
  eventType?: string
  eventDate?: string
  participants?: number
  location?: string
  duration?: number
  metadata?: Record<string, unknown>
}

// ============= Widget Configuration =============

export interface WidgetTheme {
  primaryColor?: string
  primaryHover?: string
  textColor?: string
  secondaryText?: string
  backgroundColor?: string
  borderColor?: string
  successColor?: string
  errorColor?: string
  borderRadius?: string
  fontFamily?: string
}

export interface ProductRules {
  [eventType: string]: CoverageType[]
}

export interface WidgetConfig {
  partnerId: string
  primaryColor?: string
  position?: WidgetPosition
  mode?: WidgetMode
  autoOpen?: boolean
  container?: string | null
  products?: CoverageType[]
  productRules?: ProductRules
  locale?: string
  testMode?: boolean
  testCards?: boolean
  zIndex?: number
  customButton?: boolean
  theme?: WidgetTheme
}

// ============= Widget Callbacks =============

export interface ReadyData {
  widgetId: string
}

export interface QuoteStartData {
  eventDetails: EventDetails
}

export interface PaymentStartData {
  quoteId: string
}

export interface WidgetError {
  code: string
  message: string
  details?: unknown
}

export interface WidgetCallbacks {
  onReady?: (data: ReadyData) => void
  onOpen?: () => void
  onClose?: () => void
  onQuoteStart?: (data: QuoteStartData) => void
  onQuoteComplete?: (quote: Quote) => void
  onQuoteError?: (error: WidgetError) => void
  onPaymentStart?: (data: PaymentStartData) => void
  onPolicyPurchased?: (policy: Policy) => void
  onPaymentError?: (error: WidgetError) => void
  onError?: (error: WidgetError) => void
}

// ============= Combined Types =============

export interface WidgetOptions extends WidgetConfig, WidgetCallbacks {}

export interface OpenOptions {
  customer?: Customer
  event?: EventDetails
}

export interface BulkEvent {
  type: string
  date: string
  participants: number
}

// ============= Widget Instance Interface =============

export interface WidgetInstance {
  open(options?: OpenOptions): void
  close(): void
  toggle(): void
  setCustomer(customer: Customer): void
  setEventDetails(details: EventDetails): void
  setBulkEvents(events: BulkEvent[]): void
  destroy(): void
  isOpen(): boolean
  getConfig(): WidgetConfig
}

// ============= Internal Types =============

export interface WidgetState {
  isInitialized: boolean
  isOpen: boolean
  isLoading: boolean
  customer: Customer | null
  eventDetails: EventDetails | null
  bulkEvents: BulkEvent[]
  currentQuote: Quote | null
  currentPolicy: Policy | null
  error: WidgetError | null
}

export type WidgetMessageType =
  | 'WIDGET_READY'
  | 'WIDGET_OPEN'
  | 'WIDGET_CLOSE'
  | 'SET_CUSTOMER'
  | 'SET_EVENT_DETAILS'
  | 'SET_BULK_EVENTS'
  | 'QUOTE_START'
  | 'QUOTE_COMPLETE'
  | 'QUOTE_ERROR'
  | 'PAYMENT_START'
  | 'POLICY_PURCHASED'
  | 'PAYMENT_ERROR'
  | 'ERROR'

export interface WidgetMessage<T = unknown> {
  type: WidgetMessageType
  payload: T
  widgetId: string
}
