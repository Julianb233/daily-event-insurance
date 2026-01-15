/**
 * Daily Event Insurance Widget - Vanilla JavaScript
 *
 * Self-contained embeddable widget for vanilla JavaScript usage.
 */

import type {
  WidgetConfig,
  WidgetCallbacks,
  WidgetOptions,
  WidgetInstance,
  WidgetMessage,
  Quote,
  Policy,
  Customer,
  EventDetails,
  BulkEvent,
  OpenOptions,
  WidgetError,
} from '../types'

// ============= Constants =============

// Widget iframe URL - uses Next.js app route
const WIDGET_URL = typeof window !== 'undefined' && (window as Record<string, string>).__DEI_WIDGET_URL__
  ? (window as Record<string, string>).__DEI_WIDGET_URL__
  : 'https://app.dailyevent.com/embed/widget'
const WIDGET_NAMESPACE = 'DailyEventWidget'

// ============= Styles =============

const WIDGET_STYLES = `
  .dei-widget-container {
    position: fixed;
    z-index: 9999;
    transition: all 0.3s ease;
  }
  .dei-widget-container.bottom-right {
    right: 20px;
    bottom: 20px;
  }
  .dei-widget-container.bottom-left {
    left: 20px;
    bottom: 20px;
  }
  .dei-widget-iframe {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    width: 60px;
    height: 60px;
  }
  .dei-widget-iframe.open {
    width: 400px;
    height: 600px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
  }
  .dei-widget-button {
    position: fixed;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  }
  .dei-widget-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .dei-widget-button svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
`

// ============= Widget Instance Class =============

export class DailyEventWidgetInstance implements WidgetInstance {
  private config: WidgetConfig
  private callbacks: WidgetCallbacks
  private widgetId: string
  private container: HTMLDivElement | null = null
  private iframe: HTMLIFrameElement | null = null
  private button: HTMLButtonElement | null = null
  private isOpenState: boolean = false
  private messageHandler: ((event: MessageEvent) => void) | null = null

  constructor(options: WidgetOptions) {
    const { partnerId, ...rest } = options
    this.config = {
      partnerId,
      primaryColor: rest.primaryColor ?? '#14B8A6',
      position: rest.position ?? 'bottom-right',
      mode: rest.mode ?? 'floating',
      autoOpen: rest.autoOpen ?? false,
      container: rest.container ?? null,
      products: rest.products,
      productRules: rest.productRules,
      locale: rest.locale ?? 'en',
      testMode: rest.testMode ?? false,
      testCards: rest.testCards ?? false,
      zIndex: rest.zIndex ?? 9999,
      customButton: rest.customButton ?? false,
      theme: rest.theme,
    }

    this.callbacks = {
      onReady: rest.onReady,
      onOpen: rest.onOpen,
      onClose: rest.onClose,
      onQuoteStart: rest.onQuoteStart,
      onQuoteComplete: rest.onQuoteComplete,
      onQuoteError: rest.onQuoteError,
      onPaymentStart: rest.onPaymentStart,
      onPolicyPurchased: rest.onPolicyPurchased,
      onPaymentError: rest.onPaymentError,
      onError: rest.onError,
    }

    this.widgetId = this.generateWidgetId()
    this.isOpenState = this.config.autoOpen ?? false

    this.init()
  }

  private generateWidgetId(): string {
    return `dei_${Math.random().toString(36).substring(2, 11)}`
  }

  private init(): void {
    // Inject styles
    this.injectStyles()

    // Create container
    this.createContainer()

    // Setup message listener
    this.setupMessageListener()
  }

  private injectStyles(): void {
    if (document.getElementById('dei-widget-styles')) return

    const style = document.createElement('style')
    style.id = 'dei-widget-styles'
    style.textContent = WIDGET_STYLES
    document.head.appendChild(style)
  }

  private createContainer(): void {
    // Create container
    this.container = document.createElement('div')
    this.container.id = `dei-widget-${this.widgetId}`
    this.container.className = `dei-widget-container ${this.config.position}`
    this.container.style.zIndex = String(this.config.zIndex)

    // Create iframe
    this.iframe = document.createElement('iframe')
    this.iframe.src = this.buildWidgetUrl()
    this.iframe.className = `dei-widget-iframe ${this.isOpenState ? 'open' : ''}`
    this.iframe.title = 'Daily Event Insurance Widget'
    this.iframe.allow = 'payment'
    this.iframe.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-popups')

    // Add to container
    this.container.appendChild(this.iframe)

    // Create custom button if needed
    if (!this.config.customButton) {
      this.createButton()
    }

    // Append to DOM
    if (this.config.mode === 'inline' && this.config.container) {
      const targetContainer = document.querySelector(this.config.container)
      if (targetContainer) {
        this.container.style.position = 'relative'
        this.container.style.right = 'auto'
        this.container.style.bottom = 'auto'
        targetContainer.appendChild(this.container)
      } else {
        document.body.appendChild(this.container)
      }
    } else {
      document.body.appendChild(this.container)
    }
  }

  private createButton(): void {
    if (this.config.mode !== 'floating') return

    this.button = document.createElement('button')
    this.button.className = 'dei-widget-button'
    this.button.style.backgroundColor = this.config.primaryColor ?? '#14B8A6'
    this.button.style.position = 'fixed'
    this.button.style[this.config.position?.includes('right') ? 'right' : 'left'] = '20px'
    this.button.style.bottom = '20px'
    this.button.style.zIndex = String((this.config.zIndex ?? 9999) + 1)
    this.button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    `
    this.button.onclick = () => this.toggle()

    // Hide button when widget is open
    if (this.isOpenState) {
      this.button.style.display = 'none'
    }
  }

  private buildWidgetUrl(): string {
    const params = new URLSearchParams()
    params.set('partnerId', this.config.partnerId)
    params.set('widgetId', this.widgetId)

    if (this.config.primaryColor) params.set('primaryColor', this.config.primaryColor)
    if (this.config.position) params.set('position', this.config.position)
    if (this.config.mode) params.set('mode', this.config.mode)
    if (this.config.autoOpen) params.set('autoOpen', 'true')
    if (this.config.locale) params.set('locale', this.config.locale)
    if (this.config.testMode) params.set('testMode', 'true')
    if (this.config.testCards) params.set('testCards', 'true')
    if (this.config.customButton) params.set('customButton', 'true')
    if (this.config.products) params.set('products', this.config.products.join(','))

    if (this.config.theme) {
      params.set('theme', JSON.stringify(this.config.theme))
    }

    return `${WIDGET_URL}?${params.toString()}`
  }

  private setupMessageListener(): void {
    this.messageHandler = (event: MessageEvent) => {
      if (!event.data?.widgetId || event.data.widgetId !== this.widgetId) {
        return
      }

      const message = event.data as WidgetMessage

      switch (message.type) {
        case 'WIDGET_READY':
          this.callbacks.onReady?.({ widgetId: this.widgetId })
          break
        case 'WIDGET_OPEN':
          this.isOpenState = true
          this.updateOpenState()
          this.callbacks.onOpen?.()
          break
        case 'WIDGET_CLOSE':
          this.isOpenState = false
          this.updateOpenState()
          this.callbacks.onClose?.()
          break
        case 'QUOTE_START':
          this.callbacks.onQuoteStart?.(message.payload as { eventDetails: EventDetails })
          break
        case 'QUOTE_COMPLETE':
          this.callbacks.onQuoteComplete?.(message.payload as Quote)
          break
        case 'QUOTE_ERROR':
          this.callbacks.onQuoteError?.(message.payload as WidgetError)
          break
        case 'PAYMENT_START':
          this.callbacks.onPaymentStart?.(message.payload as { quoteId: string })
          break
        case 'POLICY_PURCHASED':
          this.callbacks.onPolicyPurchased?.(message.payload as Policy)
          break
        case 'PAYMENT_ERROR':
          this.callbacks.onPaymentError?.(message.payload as WidgetError)
          break
        case 'ERROR':
          this.callbacks.onError?.(message.payload as WidgetError)
          break
      }
    }

    window.addEventListener('message', this.messageHandler)
  }

  private updateOpenState(): void {
    if (this.iframe) {
      if (this.isOpenState) {
        this.iframe.classList.add('open')
      } else {
        this.iframe.classList.remove('open')
      }
    }
    if (this.button) {
      this.button.style.display = this.isOpenState ? 'none' : 'flex'
    }
  }

  private sendMessage(message: Omit<WidgetMessage, 'widgetId'>): void {
    this.iframe?.contentWindow?.postMessage(
      { ...message, widgetId: this.widgetId },
      '*'
    )
  }

  // Public methods
  open(options?: OpenOptions): void {
    this.sendMessage({ type: 'WIDGET_OPEN', payload: options ?? null })
    this.isOpenState = true
    this.updateOpenState()
  }

  close(): void {
    this.sendMessage({ type: 'WIDGET_CLOSE', payload: null })
    this.isOpenState = false
    this.updateOpenState()
  }

  toggle(): void {
    if (this.isOpenState) {
      this.close()
    } else {
      this.open()
    }
  }

  setCustomer(customer: Customer): void {
    this.sendMessage({ type: 'SET_CUSTOMER', payload: customer })
  }

  setEventDetails(details: EventDetails): void {
    this.sendMessage({ type: 'SET_EVENT_DETAILS', payload: details })
  }

  setBulkEvents(events: BulkEvent[]): void {
    this.sendMessage({ type: 'SET_BULK_EVENTS', payload: events })
  }

  destroy(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler)
    }
    this.container?.remove()
    this.button?.remove()
  }

  isOpen(): boolean {
    return this.isOpenState
  }

  getConfig(): WidgetConfig {
    return { ...this.config }
  }
}

// ============= Global Widget Object =============

let globalInstance: DailyEventWidgetInstance | null = null

export const DailyEventWidget = {
  /**
   * Initialize the widget
   */
  init(options: WidgetOptions): DailyEventWidgetInstance {
    if (globalInstance) {
      globalInstance.destroy()
    }
    globalInstance = new DailyEventWidgetInstance(options)
    return globalInstance
  },

  /**
   * Open the widget
   */
  open(options?: OpenOptions): void {
    globalInstance?.open(options)
  },

  /**
   * Close the widget
   */
  close(): void {
    globalInstance?.close()
  },

  /**
   * Toggle widget visibility
   */
  toggle(): void {
    globalInstance?.toggle()
  },

  /**
   * Set customer data
   */
  setCustomer(customer: Customer): void {
    globalInstance?.setCustomer(customer)
  },

  /**
   * Set event details
   */
  setEventDetails(details: EventDetails): void {
    globalInstance?.setEventDetails(details)
  },

  /**
   * Set bulk events
   */
  setBulkEvents(events: BulkEvent[]): void {
    globalInstance?.setBulkEvents(events)
  },

  /**
   * Destroy the widget
   */
  destroy(): void {
    globalInstance?.destroy()
    globalInstance = null
  },

  /**
   * Check if widget is open
   */
  isOpen(): boolean {
    return globalInstance?.isOpen() ?? false
  },

  /**
   * Get current instance
   */
  getInstance(): DailyEventWidgetInstance | null {
    return globalInstance
  },
}

// Auto-attach to window for script tag usage
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)[WIDGET_NAMESPACE] = DailyEventWidget
}

export default DailyEventWidget

export type {
  WidgetConfig,
  WidgetCallbacks,
  WidgetOptions,
  WidgetInstance,
  Quote,
  Policy,
  Customer,
  EventDetails,
  BulkEvent,
  OpenOptions,
  WidgetError,
}
