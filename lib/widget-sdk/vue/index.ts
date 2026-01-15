/**
 * Daily Event Insurance Widget - Vue 3 Components
 *
 * Vue 3 Composition API components and composables for the embeddable widget.
 */

import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  provide,
  inject,
  h,
  type PropType,
  type Ref,
  type InjectionKey,
  type App,
  type ExtractPropTypes,
} from 'vue'
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

// ============= Types =============

export interface PluginOptions {
  partnerId: string
  primaryColor?: string
  testMode?: boolean
}

export interface UseInsuranceWidgetReturn {
  open: (options?: OpenOptions) => void
  close: () => void
  toggle: () => void
  setCustomer: (customer: Customer) => void
  setEventDetails: (details: EventDetails) => void
  setBulkEvents: (events: BulkEvent[]) => void
  isOpen: Ref<boolean>
  isReady: Ref<boolean>
  currentQuote: Ref<Quote | null>
  currentPolicy: Ref<Policy | null>
  error: Ref<WidgetError | null>
}

// ============= Injection Keys =============

const WIDGET_KEY: InjectionKey<{
  iframeRef: Ref<HTMLIFrameElement | null>
  state: Ref<WidgetState>
  sendMessage: (message: Omit<WidgetMessage, 'widgetId'>) => void
}> = Symbol('daily-event-widget')

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

// ============= Composable =============

export function useInsuranceWidget(
  widgetRef?: Ref<WidgetInstance | null>
): UseInsuranceWidgetReturn {
  const context = inject(WIDGET_KEY, null)

  // Standalone state (when not using provider)
  const isOpen = ref(false)
  const isReady = ref(false)
  const currentQuote = ref<Quote | null>(null)
  const currentPolicy = ref<Policy | null>(null)
  const error = ref<WidgetError | null>(null)

  if (context) {
    // Using provided context
    return {
      open: (options) => context.sendMessage({ type: 'WIDGET_OPEN', payload: options }),
      close: () => context.sendMessage({ type: 'WIDGET_CLOSE', payload: null }),
      toggle: () =>
        context.sendMessage({
          type: context.state.value.isOpen ? 'WIDGET_CLOSE' : 'WIDGET_OPEN',
          payload: null,
        }),
      setCustomer: (customer) =>
        context.sendMessage({ type: 'SET_CUSTOMER', payload: customer }),
      setEventDetails: (details) =>
        context.sendMessage({ type: 'SET_EVENT_DETAILS', payload: details }),
      setBulkEvents: (events) =>
        context.sendMessage({ type: 'SET_BULK_EVENTS', payload: events }),
      isOpen: computed(() => context.state.value.isOpen),
      isReady: computed(() => context.state.value.isInitialized),
      currentQuote: computed(() => context.state.value.currentQuote),
      currentPolicy: computed(() => context.state.value.currentPolicy),
      error: computed(() => context.state.value.error),
    }
  }

  // Standalone usage without provider - use global widget
  const getWidget = () =>
    (window as unknown as Record<string, WidgetInstance>)[WIDGET_NAMESPACE]

  return {
    open: (options) => {
      getWidget()?.open(options)
      isOpen.value = true
    },
    close: () => {
      getWidget()?.close()
      isOpen.value = false
    },
    toggle: () => {
      getWidget()?.toggle()
      isOpen.value = !isOpen.value
    },
    setCustomer: (customer) => getWidget()?.setCustomer(customer),
    setEventDetails: (details) => getWidget()?.setEventDetails(details),
    setBulkEvents: (events) => getWidget()?.setBulkEvents(events),
    isOpen,
    isReady,
    currentQuote,
    currentPolicy,
    error,
  }
}

// ============= Props Definitions =============

const insuranceWidgetProps = {
  partnerId: { type: String, required: true as const },
  primaryColor: { type: String, default: '#14B8A6' },
  position: { type: String as PropType<WidgetPosition>, default: 'bottom-right' as WidgetPosition },
  mode: { type: String as PropType<WidgetMode>, default: 'floating' as WidgetMode },
  autoOpen: { type: Boolean, default: false },
  container: { type: String, default: null as string | null },
  products: { type: Array as PropType<CoverageType[]>, default: undefined },
  locale: { type: String, default: 'en' },
  testMode: { type: Boolean, default: false },
  testCards: { type: Boolean, default: false },
  zIndex: { type: Number, default: 9999 },
  customButton: { type: Boolean, default: false },
  theme: { type: Object, default: undefined },
}

type InsuranceWidgetProps = ExtractPropTypes<typeof insuranceWidgetProps>

const insuranceWidgetEmits = [
  'ready',
  'open',
  'close',
  'quote-start',
  'quote-complete',
  'quote-error',
  'payment-start',
  'policy-purchased',
  'payment-error',
  'error',
] as const

// ============= Main Widget Component =============

export const InsuranceWidget = defineComponent({
  name: 'InsuranceWidget',
  props: insuranceWidgetProps,
  emits: [...insuranceWidgetEmits],
  setup(props: InsuranceWidgetProps, { emit, expose }) {
    const iframeRef = ref<HTMLIFrameElement | null>(null)
    const widgetId = ref(generateWidgetId())
    const isOpen = ref(props.autoOpen)
    const isReady = ref(false)

    const state = ref<WidgetState>({
      isInitialized: false,
      isOpen: props.autoOpen,
      isLoading: false,
      customer: null,
      eventDetails: null,
      bulkEvents: [],
      currentQuote: null,
      currentPolicy: null,
      error: null,
    })

    const sendMessage = (message: Omit<WidgetMessage, 'widgetId'>) => {
      iframeRef.value?.contentWindow?.postMessage(
        { ...message, widgetId: widgetId.value },
        '*'
      )
    }

    // Provide context for child components
    provide(WIDGET_KEY, { iframeRef, state, sendMessage })

    // Build iframe URL
    const iframeSrc = computed(() =>
      buildWidgetUrl({
        partnerId: props.partnerId,
        primaryColor: props.primaryColor,
        position: props.position,
        mode: props.mode,
        autoOpen: props.autoOpen,
        products: props.products,
        locale: props.locale,
        testMode: props.testMode,
        testCards: props.testCards,
        zIndex: props.zIndex,
        customButton: props.customButton,
        theme: props.theme,
        widgetId: widgetId.value,
      })
    )

    // Message handler
    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.widgetId || event.data.widgetId !== widgetId.value) {
        return
      }

      const message = event.data as WidgetMessage

      switch (message.type) {
        case 'WIDGET_READY':
          isReady.value = true
          state.value.isInitialized = true
          emit('ready', { widgetId: widgetId.value })
          break
        case 'WIDGET_OPEN':
          isOpen.value = true
          state.value.isOpen = true
          emit('open')
          break
        case 'WIDGET_CLOSE':
          isOpen.value = false
          state.value.isOpen = false
          emit('close')
          break
        case 'QUOTE_START':
          state.value.isLoading = true
          emit('quote-start', message.payload)
          break
        case 'QUOTE_COMPLETE':
          state.value.isLoading = false
          state.value.currentQuote = message.payload as Quote
          emit('quote-complete', message.payload)
          break
        case 'QUOTE_ERROR':
          state.value.isLoading = false
          state.value.error = message.payload as WidgetError
          emit('quote-error', message.payload)
          break
        case 'PAYMENT_START':
          state.value.isLoading = true
          emit('payment-start', message.payload)
          break
        case 'POLICY_PURCHASED':
          state.value.isLoading = false
          state.value.currentPolicy = message.payload as Policy
          emit('policy-purchased', message.payload)
          break
        case 'PAYMENT_ERROR':
          state.value.isLoading = false
          state.value.error = message.payload as WidgetError
          emit('payment-error', message.payload)
          break
        case 'ERROR':
          state.value.error = message.payload as WidgetError
          emit('error', message.payload)
          break
      }
    }

    onMounted(() => {
      window.addEventListener('message', handleMessage)
    })

    onUnmounted(() => {
      window.removeEventListener('message', handleMessage)
    })

    // Expose widget methods
    const widgetInstance: WidgetInstance = {
      open: (options) => {
        sendMessage({ type: 'WIDGET_OPEN', payload: options })
        isOpen.value = true
      },
      close: () => {
        sendMessage({ type: 'WIDGET_CLOSE', payload: null })
        isOpen.value = false
      },
      toggle: () => {
        const newState = !isOpen.value
        sendMessage({ type: newState ? 'WIDGET_OPEN' : 'WIDGET_CLOSE', payload: null })
        isOpen.value = newState
      },
      setCustomer: (customer) => {
        sendMessage({ type: 'SET_CUSTOMER', payload: customer })
        state.value.customer = customer
      },
      setEventDetails: (details) => {
        sendMessage({ type: 'SET_EVENT_DETAILS', payload: details })
        state.value.eventDetails = details
      },
      setBulkEvents: (events) => {
        sendMessage({ type: 'SET_BULK_EVENTS', payload: events })
        state.value.bulkEvents = events
      },
      destroy: () => {
        // Cleanup handled by Vue lifecycle
      },
      isOpen: () => isOpen.value,
      getConfig: () => ({
        partnerId: props.partnerId,
        primaryColor: props.primaryColor,
        position: props.position,
        mode: props.mode,
        autoOpen: props.autoOpen,
        locale: props.locale,
        testMode: props.testMode,
        zIndex: props.zIndex,
      }),
    }

    expose(widgetInstance)

    // Compute styles
    const iframeStyle = computed(() => {
      if (props.mode !== 'floating') {
        return {}
      }

      return {
        position: 'fixed' as const,
        [props.position.includes('right') ? 'right' : 'left']: '20px',
        bottom: '20px',
        zIndex: props.zIndex,
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        width: isOpen.value ? '400px' : '60px',
        height: isOpen.value ? '600px' : '60px',
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
      }
    })

    return () =>
      h('iframe', {
        ref: iframeRef,
        src: iframeSrc.value,
        title: 'Daily Event Insurance Widget',
        style: iframeStyle.value,
        allow: 'payment',
        sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
      })
  },
})

// ============= Inline Widget Component =============

const inlineInsuranceWidgetProps = {
  ...insuranceWidgetProps,
  width: { type: [String, Number] as PropType<string | number>, default: '100%' },
  height: { type: [String, Number] as PropType<string | number>, default: '600px' },
}

type InlineInsuranceWidgetProps = ExtractPropTypes<typeof inlineInsuranceWidgetProps>

export const InlineInsuranceWidget = defineComponent({
  name: 'InlineInsuranceWidget',
  props: inlineInsuranceWidgetProps,
  setup(props: InlineInsuranceWidgetProps, ctx) {
    const style = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      border: 'none',
      borderRadius: '8px',
    }))

    return () =>
      h(InsuranceWidget, {
        ...props,
        mode: 'inline' as WidgetMode,
        style: style.value,
        ...ctx.attrs,
      })
  },
})

// ============= Vue Plugin =============

export const DailyEventWidgetPlugin = {
  install(app: App, options: PluginOptions) {
    // Register components globally
    app.component('InsuranceWidget', InsuranceWidget)
    app.component('InlineInsuranceWidget', InlineInsuranceWidget)

    // Provide default configuration
    app.provide('daily-event-config', options)
  },
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
