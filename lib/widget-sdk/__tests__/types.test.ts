import { describe, it, expect } from 'vitest'
import type {
  WidgetConfig,
  WidgetCallbacks,
  WidgetState,
  Quote,
  Policy,
  Customer,
  EventDetails,
  WidgetPosition,
  WidgetMode,
  CoverageType,
} from '../types'

describe('Widget SDK Types', () => {
  describe('WidgetConfig', () => {
    it('should accept valid widget configuration', () => {
      const config: WidgetConfig = {
        partnerId: 'partner_123',
        primaryColor: '#14B8A6',
        position: 'bottom-right',
        mode: 'floating',
        autoOpen: false,
        locale: 'en',
        testMode: true,
        zIndex: 9999,
      }

      expect(config.partnerId).toBe('partner_123')
      expect(config.position).toBe('bottom-right')
      expect(config.mode).toBe('floating')
    })

    it('should support inline mode with container', () => {
      const config: WidgetConfig = {
        partnerId: 'partner_123',
        mode: 'inline',
        container: '#insurance-widget',
      }

      expect(config.mode).toBe('inline')
      expect(config.container).toBe('#insurance-widget')
    })

    it('should support product filtering', () => {
      const config: WidgetConfig = {
        partnerId: 'partner_123',
        products: ['general_liability', 'participant_accident'],
      }

      expect(config.products).toHaveLength(2)
      expect(config.products).toContain('general_liability')
    })
  })

  describe('WidgetCallbacks', () => {
    it('should define all callback types', () => {
      const callbacks: WidgetCallbacks = {
        onReady: ({ widgetId }) => console.log('Ready:', widgetId),
        onOpen: () => console.log('Opened'),
        onClose: () => console.log('Closed'),
        onQuoteStart: ({ eventDetails }) => console.log('Quote started:', eventDetails),
        onQuoteComplete: (quote) => console.log('Quote complete:', quote),
        onQuoteError: (error) => console.log('Quote error:', error),
        onPaymentStart: ({ quoteId }) => console.log('Payment started:', quoteId),
        onPolicyPurchased: (policy) => console.log('Policy purchased:', policy),
        onPaymentError: (error) => console.log('Payment error:', error),
        onError: (error) => console.log('Error:', error),
      }

      expect(typeof callbacks.onReady).toBe('function')
      expect(typeof callbacks.onQuoteComplete).toBe('function')
      expect(typeof callbacks.onPolicyPurchased).toBe('function')
    })
  })

  describe('WidgetState', () => {
    it('should have correct initial state structure', () => {
      const state: WidgetState = {
        isInitialized: false,
        isOpen: false,
        isLoading: false,
        customer: null,
        eventDetails: null,
        bulkEvents: [],
        currentQuote: null,
        currentPolicy: null,
        error: null,
      }

      expect(state.isInitialized).toBe(false)
      expect(state.bulkEvents).toEqual([])
      expect(state.currentQuote).toBeNull()
    })
  })

  describe('Customer', () => {
    it('should accept valid customer data', () => {
      const customer: Customer = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        company: 'Test Corp',
      }

      expect(customer.email).toBe('test@example.com')
      expect(customer.firstName).toBe('John')
    })
  })

  describe('EventDetails', () => {
    it('should accept valid event details', () => {
      const event: EventDetails = {
        name: 'Yoga Class',
        date: '2024-06-15',
        startTime: '10:00',
        endTime: '11:00',
        type: 'fitness_class',
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        expectedAttendees: 20,
        description: 'Morning yoga session',
      }

      expect(event.name).toBe('Yoga Class')
      expect(event.type).toBe('fitness_class')
      expect(event.location.city).toBe('New York')
    })
  })

  describe('WidgetPosition', () => {
    it('should support all position values', () => {
      const positions: WidgetPosition[] = ['bottom-right', 'bottom-left']

      expect(positions).toContain('bottom-right')
      expect(positions).toContain('bottom-left')
    })
  })

  describe('WidgetMode', () => {
    it('should support all mode values', () => {
      const modes: WidgetMode[] = ['floating', 'inline']

      expect(modes).toContain('floating')
      expect(modes).toContain('inline')
    })
  })

  describe('CoverageType', () => {
    it('should support all coverage types', () => {
      const coverages: CoverageType[] = [
        'general_liability',
        'participant_accident',
        'equipment',
        'event_cancellation',
      ]

      expect(coverages).toHaveLength(4)
      expect(coverages).toContain('general_liability')
    })
  })
})
