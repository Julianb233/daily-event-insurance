import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DailyEventWidget, DailyEventWidgetInstance } from '../vanilla/embed'

describe('DailyEventWidget (Vanilla JS)', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    // Mock postMessage
    vi.stubGlobal('postMessage', vi.fn())
  })

  afterEach(() => {
    DailyEventWidget.destroy()
    vi.unstubAllGlobals()
  })

  describe('DailyEventWidget.init', () => {
    it('should initialize widget with required options', () => {
      const instance = DailyEventWidget.init({
        partnerId: 'partner_123',
      })

      expect(instance).toBeInstanceOf(DailyEventWidgetInstance)
      expect(DailyEventWidget.getInstance()).toBe(instance)
    })

    it('should create iframe in DOM', () => {
      DailyEventWidget.init({
        partnerId: 'partner_123',
      })

      const iframe = document.querySelector('iframe')
      expect(iframe).toBeDefined()
      expect(iframe?.title).toBe('Daily Event Insurance Widget')
    })

    it('should apply custom primary color', () => {
      DailyEventWidget.init({
        partnerId: 'partner_123',
        primaryColor: '#FF5733',
      })

      const iframe = document.querySelector('iframe')
      expect(iframe?.src).toContain('primaryColor=%23FF5733')
    })

    it('should set test mode when configured', () => {
      DailyEventWidget.init({
        partnerId: 'partner_123',
        testMode: true,
      })

      const iframe = document.querySelector('iframe')
      expect(iframe?.src).toContain('testMode=true')
    })

    it('should destroy previous instance on re-init', () => {
      const instance1 = DailyEventWidget.init({ partnerId: 'partner_1' })
      const instance2 = DailyEventWidget.init({ partnerId: 'partner_2' })

      expect(DailyEventWidget.getInstance()).toBe(instance2)
      expect(DailyEventWidget.getInstance()).not.toBe(instance1)
    })
  })

  describe('DailyEventWidget.open/close/toggle', () => {
    it('should track open state', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(DailyEventWidget.isOpen()).toBe(false)

      DailyEventWidget.open()
      expect(DailyEventWidget.isOpen()).toBe(true)

      DailyEventWidget.close()
      expect(DailyEventWidget.isOpen()).toBe(false)
    })

    it('should toggle open state', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      DailyEventWidget.toggle()
      expect(DailyEventWidget.isOpen()).toBe(true)

      DailyEventWidget.toggle()
      expect(DailyEventWidget.isOpen()).toBe(false)
    })
  })

  describe('DailyEventWidget.setCustomer', () => {
    it('should not throw when called', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(() => {
        DailyEventWidget.setCustomer({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        })
      }).not.toThrow()
    })
  })

  describe('DailyEventWidget.setEventDetails', () => {
    it('should not throw when called', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(() => {
        DailyEventWidget.setEventDetails({
          name: 'Test Event',
          date: '2024-06-15',
          type: 'fitness_class',
          location: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
          },
          expectedAttendees: 20,
        })
      }).not.toThrow()
    })
  })

  describe('DailyEventWidget.setBulkEvents', () => {
    it('should not throw when called with multiple events', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(() => {
        DailyEventWidget.setBulkEvents([
          {
            name: 'Event 1',
            date: '2024-06-15',
            type: 'fitness_class',
            location: {
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'US',
            },
            expectedAttendees: 20,
          },
          {
            name: 'Event 2',
            date: '2024-06-16',
            type: 'fitness_class',
            location: {
              address: '456 Oak Ave',
              city: 'New York',
              state: 'NY',
              zipCode: '10002',
              country: 'US',
            },
            expectedAttendees: 15,
          },
        ])
      }).not.toThrow()
    })
  })

  describe('DailyEventWidget.destroy', () => {
    it('should remove widget from DOM', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(document.querySelector('iframe')).not.toBeNull()

      DailyEventWidget.destroy()

      expect(DailyEventWidget.getInstance()).toBeNull()
    })

    it('should handle multiple destroy calls', () => {
      DailyEventWidget.init({ partnerId: 'partner_123' })

      expect(() => {
        DailyEventWidget.destroy()
        DailyEventWidget.destroy()
      }).not.toThrow()
    })
  })

  describe('DailyEventWidgetInstance', () => {
    it('should return config', () => {
      const instance = DailyEventWidget.init({
        partnerId: 'partner_123',
        primaryColor: '#14B8A6',
        testMode: true,
      })

      const config = instance.getConfig()

      expect(config.partnerId).toBe('partner_123')
      expect(config.primaryColor).toBe('#14B8A6')
      expect(config.testMode).toBe(true)
    })

    it('should support autoOpen option', () => {
      const instance = DailyEventWidget.init({
        partnerId: 'partner_123',
        autoOpen: true,
      })

      expect(instance.isOpen()).toBe(true)
    })
  })

  describe('Callback handling', () => {
    it('should call onReady callback when widget signals ready', () => {
      const onReady = vi.fn()

      DailyEventWidget.init({
        partnerId: 'partner_123',
        onReady,
      })

      // Simulate message from widget iframe
      const iframe = document.querySelector('iframe')
      const widgetId = iframe?.src.match(/widgetId=([^&]+)/)?.[1]

      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'WIDGET_READY',
            widgetId,
          },
        })
      )

      expect(onReady).toHaveBeenCalledWith({ widgetId })
    })

    it('should call onOpen callback when widget opens', () => {
      const onOpen = vi.fn()

      DailyEventWidget.init({
        partnerId: 'partner_123',
        onOpen,
      })

      const iframe = document.querySelector('iframe')
      const widgetId = iframe?.src.match(/widgetId=([^&]+)/)?.[1]

      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'WIDGET_OPEN',
            widgetId,
          },
        })
      )

      expect(onOpen).toHaveBeenCalled()
    })

    it('should call onClose callback when widget closes', () => {
      const onClose = vi.fn()

      DailyEventWidget.init({
        partnerId: 'partner_123',
        onClose,
      })

      const iframe = document.querySelector('iframe')
      const widgetId = iframe?.src.match(/widgetId=([^&]+)/)?.[1]

      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'WIDGET_CLOSE',
            widgetId,
          },
        })
      )

      expect(onClose).toHaveBeenCalled()
    })

    it('should ignore messages from other widgets', () => {
      const onReady = vi.fn()

      DailyEventWidget.init({
        partnerId: 'partner_123',
        onReady,
      })

      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'WIDGET_READY',
            widgetId: 'other_widget_id',
          },
        })
      )

      expect(onReady).not.toHaveBeenCalled()
    })
  })
})
