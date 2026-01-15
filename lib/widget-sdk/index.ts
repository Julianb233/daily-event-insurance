/**
 * Daily Event Insurance Widget SDK
 *
 * Embeddable widget SDK supporting React, Vue, and Vanilla JavaScript.
 *
 * @packageDocumentation
 */

// ============= Shared Types =============

export type {
  // Core enums/unions
  WidgetPosition,
  WidgetMode,
  CoverageType,
  QuoteStatus,
  PolicyStatus,

  // Data interfaces
  Quote,
  Policy,
  Customer,
  EventDetails,
  CoverageDetails,
  BulkEvent,

  // Configuration
  WidgetConfig,
  WidgetCallbacks,
  WidgetOptions,
  WidgetTheme,
  ProductRules,

  // Widget instance
  WidgetInstance,
  WidgetState,

  // Callback data
  ReadyData,
  QuoteStartData,
  PaymentStartData,
  OpenOptions,
  WidgetError,

  // Internal types
  WidgetMessage,
  WidgetMessageType,
} from './types'

// ============= React Components =============

export {
  // Components
  InsuranceWidget,
  InlineInsuranceWidget,
  InsuranceWidgetProvider,

  // Hook
  useInsuranceWidget,
} from './react'

export type {
  InsuranceWidgetProps,
  InlineInsuranceWidgetProps,
  UseInsuranceWidgetReturn,
} from './react'

// ============= Vue Components =============

export {
  // Components
  InsuranceWidget as VueInsuranceWidget,
  InlineInsuranceWidget as VueInlineInsuranceWidget,

  // Composable
  useInsuranceWidget as useVueInsuranceWidget,

  // Plugin
  DailyEventWidgetPlugin,
} from './vue'

export type {
  PluginOptions as VuePluginOptions,
  UseInsuranceWidgetReturn as VueUseInsuranceWidgetReturn,
} from './vue'

// ============= Vanilla JS =============

export {
  DailyEventWidget,
  DailyEventWidgetInstance,
} from './vanilla/embed'

// ============= Version =============

export const VERSION = '1.0.0'

// ============= Default Export =============

// Default export is the DailyEventWidget for vanilla JS usage
export { DailyEventWidget as default } from './vanilla/embed'
