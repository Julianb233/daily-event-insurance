import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import {
  uuidSchema,
  emailSchema,
  phoneSchema,
  paginationSchema,
  dateRangeSchema,
  updateProfileSchema,
  productTypeSchema,
  updateProductSchema,
  createQuoteSchema,
  quotesListSchema,
  policiesListSchema,
  analyticsSchema,
  earningsReportSchema,
  earningsListSchema,
  validateBody,
  validateQuery,
  safeValidate,
  formatZodErrors,
  getGenericValidationError,
} from '@/lib/api-validation'

describe('API Validation Schemas', () => {
  describe('uuidSchema', () => {
    it('should accept valid UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '550e8400-e29b-41d4-a716-446655440000',
      ]

      validUUIDs.forEach((uuid) => {
        expect(uuidSchema.parse(uuid)).toBe(uuid)
      })
    })

    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        '123e4567-e89b-12d3-a456', // too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // too long
        '',
      ]

      invalidUUIDs.forEach((uuid) => {
        expect(() => uuidSchema.parse(uuid)).toThrow()
      })
    })
  })

  describe('emailSchema', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ]

      validEmails.forEach((email) => {
        expect(emailSchema.parse(email)).toBe(email)
      })
    })

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'not-an-email',
        '@domain.com',
        'user@',
        'user@.com',
        '',
      ]

      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow()
      })
    })
  })

  describe('phoneSchema', () => {
    it('should accept valid phone numbers', () => {
      const validPhones = [
        '+12025551234',
        '12025551234',
        '+442071234567',
      ]

      validPhones.forEach((phone) => {
        expect(phoneSchema.parse(phone)).toBe(phone)
      })
    })

    it('should accept undefined (optional)', () => {
      expect(phoneSchema.parse(undefined)).toBeUndefined()
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        'abc123',
        '+0123456789', // starts with 0 after +
      ]

      invalidPhones.forEach((phone) => {
        expect(() => phoneSchema.parse(phone)).toThrow()
      })
    })
  })

  describe('paginationSchema', () => {
    it('should accept valid pagination params', () => {
      const result = paginationSchema.parse({ page: 1, pageSize: 20 })
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
    })

    it('should use defaults when not provided', () => {
      const result = paginationSchema.parse({})
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
    })

    it('should coerce string numbers', () => {
      const result = paginationSchema.parse({ page: '5', pageSize: '50' })
      expect(result.page).toBe(5)
      expect(result.pageSize).toBe(50)
    })

    it('should reject page less than 1', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow()
      expect(() => paginationSchema.parse({ page: -1 })).toThrow()
    })

    it('should reject pageSize greater than 100', () => {
      expect(() => paginationSchema.parse({ pageSize: 101 })).toThrow()
    })

    it('should reject non-integer values', () => {
      expect(() => paginationSchema.parse({ page: 1.5 })).toThrow()
    })
  })

  describe('dateRangeSchema', () => {
    it('should accept valid date range', () => {
      const result = dateRangeSchema.parse({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      })
      expect(result.startDate).toBeInstanceOf(Date)
      expect(result.endDate).toBeInstanceOf(Date)
    })

    it('should accept only startDate', () => {
      const result = dateRangeSchema.parse({ startDate: '2024-01-01' })
      expect(result.startDate).toBeInstanceOf(Date)
      expect(result.endDate).toBeUndefined()
    })

    it('should accept only endDate', () => {
      const result = dateRangeSchema.parse({ endDate: '2024-12-31' })
      expect(result.startDate).toBeUndefined()
      expect(result.endDate).toBeInstanceOf(Date)
    })

    it('should accept empty object', () => {
      const result = dateRangeSchema.parse({})
      expect(result.startDate).toBeUndefined()
      expect(result.endDate).toBeUndefined()
    })

    it('should reject when startDate is after endDate', () => {
      expect(() =>
        dateRangeSchema.parse({
          startDate: '2024-12-31',
          endDate: '2024-01-01',
        })
      ).toThrow()
    })
  })

  describe('updateProfileSchema', () => {
    it('should accept valid profile updates', () => {
      const result = updateProfileSchema.parse({
        businessName: 'Test Business',
        businessType: 'Fitness Center',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+12025551234',
        integrationType: 'widget',
        primaryColor: '#FF5500',
        logoUrl: 'https://example.com/logo.png',
      })
      expect(result.businessName).toBe('Test Business')
    })

    it('should accept partial updates', () => {
      const result = updateProfileSchema.parse({
        businessName: 'Updated Name',
      })
      expect(result.businessName).toBe('Updated Name')
      expect(result.contactEmail).toBeUndefined()
    })

    it('should reject invalid hex color', () => {
      expect(() =>
        updateProfileSchema.parse({
          primaryColor: 'not-a-color',
        })
      ).toThrow()
    })

    it('should reject invalid integration type', () => {
      expect(() =>
        updateProfileSchema.parse({
          integrationType: 'invalid',
        })
      ).toThrow()
    })

    it('should accept valid integration types', () => {
      const types = ['widget', 'api', 'manual']
      types.forEach((type) => {
        const result = updateProfileSchema.parse({ integrationType: type })
        expect(result.integrationType).toBe(type)
      })
    })

    it('should reject business name too short', () => {
      expect(() =>
        updateProfileSchema.parse({ businessName: 'A' })
      ).toThrow()
    })
  })

  describe('productTypeSchema', () => {
    it('should accept valid product types', () => {
      const types = ['liability', 'equipment', 'cancellation']
      types.forEach((type) => {
        expect(productTypeSchema.parse(type)).toBe(type)
      })
    })

    it('should reject invalid product types', () => {
      expect(() => productTypeSchema.parse('invalid')).toThrow()
    })
  })

  describe('updateProductSchema', () => {
    it('should accept valid product update', () => {
      const result = updateProductSchema.parse({
        productType: 'liability',
        isEnabled: true,
        customerPrice: 99.99,
      })
      expect(result.productType).toBe('liability')
      expect(result.isEnabled).toBe(true)
      expect(result.customerPrice).toBe(99.99)
    })

    it('should reject price below minimum', () => {
      expect(() =>
        updateProductSchema.parse({
          productType: 'liability',
          customerPrice: 0.001,
        })
      ).toThrow()
    })

    it('should reject price above maximum', () => {
      expect(() =>
        updateProductSchema.parse({
          productType: 'liability',
          customerPrice: 10000,
        })
      ).toThrow()
    })
  })

  describe('createQuoteSchema', () => {
    it('should accept valid quote data', () => {
      const result = createQuoteSchema.parse({
        eventType: 'Yoga Class',
        eventDate: '2024-06-15',
        participants: 25,
        coverageType: 'liability',
      })
      expect(result.eventType).toBe('Yoga Class')
      expect(result.participants).toBe(25)
    })

    it('should accept quote with all optional fields', () => {
      const result = createQuoteSchema.parse({
        eventType: 'Marathon',
        eventDate: '2024-09-01',
        participants: 500,
        coverageType: 'liability',
        eventDetails: {
          location: 'Central Park',
          duration: 6,
          description: 'Annual charity marathon',
        },
        customerEmail: 'customer@example.com',
        customerName: 'Jane Smith',
        metadata: { source: 'website' },
      })
      expect(result.eventDetails?.location).toBe('Central Park')
    })

    it('should reject participants below 1', () => {
      expect(() =>
        createQuoteSchema.parse({
          eventType: 'Test',
          eventDate: '2024-06-15',
          participants: 0,
          coverageType: 'liability',
        })
      ).toThrow()
    })

    it('should reject participants above 10000', () => {
      expect(() =>
        createQuoteSchema.parse({
          eventType: 'Test',
          eventDate: '2024-06-15',
          participants: 10001,
          coverageType: 'liability',
        })
      ).toThrow()
    })

    it('should reject event type too short', () => {
      expect(() =>
        createQuoteSchema.parse({
          eventType: 'X',
          eventDate: '2024-06-15',
          participants: 10,
          coverageType: 'liability',
        })
      ).toThrow()
    })
  })

  describe('analyticsSchema', () => {
    it('should accept valid analytics params', () => {
      const result = analyticsSchema.parse({
        period: '30d',
        groupBy: 'day',
        metrics: ['quotes', 'revenue'],
      })
      expect(result.period).toBe('30d')
      expect(result.metrics).toContain('quotes')
    })

    it('should use defaults', () => {
      const result = analyticsSchema.parse({})
      expect(result.period).toBe('30d')
      expect(result.groupBy).toBe('day')
      expect(result.metrics).toEqual(['quotes', 'policies', 'revenue'])
    })

    it('should accept all valid periods', () => {
      const periods = ['7d', '30d', '90d', '12m', 'ytd', 'all']
      periods.forEach((period) => {
        const result = analyticsSchema.parse({ period })
        expect(result.period).toBe(period)
      })
    })

    it('should reject invalid period', () => {
      expect(() => analyticsSchema.parse({ period: '5d' })).toThrow()
    })
  })

  describe('earningsReportSchema', () => {
    it('should accept valid earnings report', () => {
      const result = earningsReportSchema.parse({
        yearMonth: '2024-06',
        totalParticipants: 1500,
        locationBonus: 250.00,
      })
      expect(result.yearMonth).toBe('2024-06')
    })

    it('should use default for locationBonus', () => {
      const result = earningsReportSchema.parse({
        yearMonth: '2024-06',
        totalParticipants: 1000,
      })
      expect(result.locationBonus).toBe(0)
    })

    it('should reject invalid yearMonth format', () => {
      expect(() =>
        earningsReportSchema.parse({
          yearMonth: '2024/06',
          totalParticipants: 100,
        })
      ).toThrow()
    })

    it('should reject negative participants', () => {
      expect(() =>
        earningsReportSchema.parse({
          yearMonth: '2024-06',
          totalParticipants: -1,
        })
      ).toThrow()
    })
  })
})

describe('Validation Helpers', () => {
  describe('validateBody', () => {
    it('should return parsed data for valid input', () => {
      const schema = z.object({ name: z.string() })
      const result = validateBody(schema, { name: 'Test' })
      expect(result.name).toBe('Test')
    })

    it('should throw for invalid input', () => {
      const schema = z.object({ name: z.string() })
      expect(() => validateBody(schema, { name: 123 })).toThrow()
    })
  })

  describe('validateQuery', () => {
    it('should parse query params correctly', () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
        search: z.string().optional(),
      })

      const params = new URLSearchParams('page=5&search=test')
      const result = validateQuery(schema, params)

      expect(result.page).toBe(5)
      expect(result.search).toBe('test')
    })

    it('should use defaults for missing params', () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
      })

      const params = new URLSearchParams('')
      const result = validateQuery(schema, params)

      expect(result.page).toBe(1)
    })
  })

  describe('safeValidate', () => {
    it('should return success true for valid data', () => {
      const schema = z.object({ email: z.string().email() })
      const result = safeValidate(schema, { email: 'test@example.com' })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should return success false for invalid data', () => {
      const schema = z.object({ email: z.string().email() })
      const result = safeValidate(schema, { email: 'not-an-email' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(z.ZodError)
      }
    })
  })

  describe('formatZodErrors', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development')
    })

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('should format errors by field path in development', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      })

      try {
        schema.parse({ email: 'invalid', age: 10 })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodErrors(error)
          expect(formatted.email).toBeDefined()
          expect(formatted.age).toBeDefined()
        }
      }
    })

    it('should return generic error in production', () => {
      vi.stubEnv('NODE_ENV', 'production')

      const schema = z.object({
        email: z.string().email(),
      })

      try {
        schema.parse({ email: 'invalid' })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodErrors(error)
          expect(formatted._error).toBeDefined()
          expect(formatted.email).toBeUndefined()
        }
      }
    })

    it('should handle nested paths', () => {
      const schema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(2),
          }),
        }),
      })

      try {
        schema.parse({ user: { profile: { name: 'X' } } })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodErrors(error)
          expect(formatted['user.profile.name']).toBeDefined()
        }
      }
    })
  })

  describe('getGenericValidationError', () => {
    it('should return generic error message', () => {
      const message = getGenericValidationError()
      expect(message).toBe('Invalid request data. Please verify your input.')
    })
  })
})

describe('Complex Validation Scenarios', () => {
  describe('quotesListSchema with pagination and filters', () => {
    it('should handle combined pagination and date range', () => {
      const result = quotesListSchema.parse({
        page: '2',
        pageSize: '50',
        status: 'pending',
        coverageType: 'liability',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
      })

      expect(result.page).toBe(2)
      expect(result.pageSize).toBe(50)
      expect(result.status).toBe('pending')
      expect(result.coverageType).toBe('liability')
      expect(result.startDate).toBeInstanceOf(Date)
    })

    it('should accept all quote statuses', () => {
      const statuses = ['pending', 'accepted', 'declined', 'expired']
      statuses.forEach((status) => {
        const result = quotesListSchema.parse({ status })
        expect(result.status).toBe(status)
      })
    })
  })

  describe('policiesListSchema', () => {
    it('should accept all policy statuses', () => {
      const statuses = ['active', 'expired', 'cancelled', 'pending']
      statuses.forEach((status) => {
        const result = policiesListSchema.parse({ status })
        expect(result.status).toBe(status)
      })
    })
  })

  describe('earningsListSchema', () => {
    it('should accept year within valid range', () => {
      const result = earningsListSchema.parse({ year: '2024' })
      expect(result.year).toBe(2024)
    })

    it('should reject year below 2020', () => {
      expect(() => earningsListSchema.parse({ year: '2019' })).toThrow()
    })

    it('should reject year above 2100', () => {
      expect(() => earningsListSchema.parse({ year: '2101' })).toThrow()
    })
  })
})
