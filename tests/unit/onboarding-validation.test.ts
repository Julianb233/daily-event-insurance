import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateUrl,
  validateBusinessName,
  validateContactName,
  validateBusinessType,
  validateIntegrationType,
  validateHexColor,
  validateParticipants,
  validateOnboardingForm,
  hasValidationErrors,
  getErrorMessages,
  type OnboardingFormData,
} from '@/lib/validation/onboarding'

describe('Onboarding Form Validation', () => {
  // ============================================
  // Email Validation Tests
  // ============================================
  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required')
    })

    it('should return error for email without @', () => {
      expect(validateEmail('test.email.com')).toBe('Please enter a valid email address')
    })

    it('should return error for email without domain', () => {
      expect(validateEmail('test@')).toBe('Please enter a valid email address')
    })

    it('should return error for email without TLD', () => {
      expect(validateEmail('test@domain')).toBe('Please enter a valid email address')
    })

    it('should return error for email with spaces', () => {
      expect(validateEmail('test @email.com')).toBe('Please enter a valid email address')
    })

    it('should return null for valid email', () => {
      expect(validateEmail('test@email.com')).toBeNull()
    })

    it('should return null for valid email with subdomain', () => {
      expect(validateEmail('test@sub.domain.com')).toBeNull()
    })

    it('should return null for valid email with plus sign', () => {
      expect(validateEmail('test+alias@email.com')).toBeNull()
    })

    it('should return null for valid email with dots', () => {
      expect(validateEmail('first.last@email.com')).toBeNull()
    })
  })

  // ============================================
  // Phone Validation Tests
  // ============================================
  describe('validatePhone', () => {
    it('should return error for empty phone', () => {
      expect(validatePhone('')).toBe('Phone number is required')
    })

    it('should return error for phone with less than 10 digits', () => {
      expect(validatePhone('123456789')).toBe('Please enter a valid phone number')
    })

    it('should return error for phone with only letters', () => {
      expect(validatePhone('abcdefghij')).toBe('Please enter a valid phone number')
    })

    it('should return null for valid 10-digit phone', () => {
      expect(validatePhone('1234567890')).toBeNull()
    })

    it('should return null for formatted phone number', () => {
      expect(validatePhone('(123) 456-7890')).toBeNull()
    })

    it('should return null for phone with country code', () => {
      expect(validatePhone('+1 (123) 456-7890')).toBeNull()
    })

    it('should return null for phone with dashes', () => {
      expect(validatePhone('123-456-7890')).toBeNull()
    })

    it('should return null for phone with dots', () => {
      expect(validatePhone('123.456.7890')).toBeNull()
    })

    it('should return null for international format', () => {
      expect(validatePhone('+44 20 7123 4567')).toBeNull()
    })
  })

  // ============================================
  // URL Validation Tests
  // ============================================
  describe('validateUrl', () => {
    it('should return null for empty URL (optional field)', () => {
      expect(validateUrl('')).toBeNull()
    })

    it('should return null for valid URL with https', () => {
      expect(validateUrl('https://example.com')).toBeNull()
    })

    it('should return null for valid URL with http', () => {
      expect(validateUrl('http://example.com')).toBeNull()
    })

    it('should return null for URL without protocol (auto-adds https)', () => {
      expect(validateUrl('example.com')).toBeNull()
    })

    it('should return null for URL with subdomain', () => {
      expect(validateUrl('https://www.example.com')).toBeNull()
    })

    it('should return null for URL with path', () => {
      expect(validateUrl('https://example.com/path/to/page')).toBeNull()
    })

    it('should return null for URL with query params', () => {
      expect(validateUrl('https://example.com?param=value')).toBeNull()
    })

    it('should return error for invalid URL format', () => {
      expect(validateUrl('not a valid url at all')).toBe('Please enter a valid website URL')
    })

    it('should return error for URL with spaces', () => {
      expect(validateUrl('https://example .com')).toBe('Please enter a valid website URL')
    })
  })

  // ============================================
  // Business Name Validation Tests
  // ============================================
  describe('validateBusinessName', () => {
    it('should return error for empty business name', () => {
      expect(validateBusinessName('')).toBe('Business name is required')
    })

    it('should return error for single character', () => {
      expect(validateBusinessName('A')).toBe('Business name must be at least 2 characters')
    })

    it('should return error for whitespace only', () => {
      expect(validateBusinessName('   ')).toBe('Business name must be at least 2 characters')
    })

    it('should return error for name over 200 characters', () => {
      const longName = 'A'.repeat(201)
      expect(validateBusinessName(longName)).toBe('Business name must be less than 200 characters')
    })

    it('should return null for valid business name', () => {
      expect(validateBusinessName('Peak Performance Gym')).toBeNull()
    })

    it('should return null for 2-character name', () => {
      expect(validateBusinessName('AB')).toBeNull()
    })

    it('should return null for 200-character name', () => {
      const validName = 'A'.repeat(200)
      expect(validateBusinessName(validName)).toBeNull()
    })

    it('should return null for name with special characters', () => {
      expect(validateBusinessName("Mike's Fitness & Gym")).toBeNull()
    })
  })

  // ============================================
  // Contact Name Validation Tests
  // ============================================
  describe('validateContactName', () => {
    it('should return error for empty contact name', () => {
      expect(validateContactName('')).toBe('Contact name is required')
    })

    it('should return error for single character', () => {
      expect(validateContactName('J')).toBe('Contact name must be at least 2 characters')
    })

    it('should return error for whitespace only', () => {
      expect(validateContactName('  ')).toBe('Contact name must be at least 2 characters')
    })

    it('should return null for valid contact name', () => {
      expect(validateContactName('John Smith')).toBeNull()
    })

    it('should return null for 2-character name', () => {
      expect(validateContactName('Jo')).toBeNull()
    })
  })

  // ============================================
  // Business Type Validation Tests
  // ============================================
  describe('validateBusinessType', () => {
    it('should return error for empty business type', () => {
      expect(validateBusinessType('')).toBe('Please select a business type')
    })

    it('should return error for invalid business type', () => {
      expect(validateBusinessType('invalid')).toBe('Please select a valid business type')
    })

    it('should return null for "gym"', () => {
      expect(validateBusinessType('gym')).toBeNull()
    })

    it('should return null for "climbing"', () => {
      expect(validateBusinessType('climbing')).toBeNull()
    })

    it('should return null for "yoga"', () => {
      expect(validateBusinessType('yoga')).toBeNull()
    })

    it('should return null for "rental"', () => {
      expect(validateBusinessType('rental')).toBeNull()
    })

    it('should return null for "other"', () => {
      expect(validateBusinessType('other')).toBeNull()
    })
  })

  // ============================================
  // Integration Type Validation Tests
  // ============================================
  describe('validateIntegrationType', () => {
    it('should return error for empty integration type', () => {
      expect(validateIntegrationType('')).toBe('Please select an integration type')
    })

    it('should return error for invalid integration type', () => {
      expect(validateIntegrationType('invalid')).toBe('Please select a valid integration type')
    })

    it('should return null for "widget"', () => {
      expect(validateIntegrationType('widget')).toBeNull()
    })

    it('should return null for "api"', () => {
      expect(validateIntegrationType('api')).toBeNull()
    })

    it('should return null for "manual"', () => {
      expect(validateIntegrationType('manual')).toBeNull()
    })
  })

  // ============================================
  // Hex Color Validation Tests
  // ============================================
  describe('validateHexColor', () => {
    it('should return null for empty color (optional)', () => {
      expect(validateHexColor('')).toBeNull()
    })

    it('should return null for valid 6-digit hex with #', () => {
      expect(validateHexColor('#14B8A6')).toBeNull()
    })

    it('should return null for valid 3-digit hex with #', () => {
      expect(validateHexColor('#FFF')).toBeNull()
    })

    it('should return null for lowercase hex', () => {
      expect(validateHexColor('#14b8a6')).toBeNull()
    })

    it('should return error for hex without #', () => {
      expect(validateHexColor('14B8A6')).toBe('Please enter a valid hex color (e.g., #14B8A6)')
    })

    it('should return error for invalid hex characters', () => {
      expect(validateHexColor('#GGGGGG')).toBe('Please enter a valid hex color (e.g., #14B8A6)')
    })

    it('should return error for wrong length', () => {
      expect(validateHexColor('#12345')).toBe('Please enter a valid hex color (e.g., #14B8A6)')
    })

    it('should return error for color name', () => {
      expect(validateHexColor('red')).toBe('Please enter a valid hex color (e.g., #14B8A6)')
    })
  })

  // ============================================
  // Participants Validation Tests
  // ============================================
  describe('validateParticipants', () => {
    it('should return null for empty value (optional)', () => {
      expect(validateParticipants('')).toBeNull()
    })

    it('should return null for valid number', () => {
      expect(validateParticipants('500')).toBeNull()
    })

    it('should return null for zero', () => {
      expect(validateParticipants('0')).toBeNull()
    })

    it('should return null for large valid number', () => {
      expect(validateParticipants('999999')).toBeNull()
    })

    it('should return error for non-numeric value', () => {
      expect(validateParticipants('abc')).toBe('Please enter a valid number')
    })

    it('should return error for negative number', () => {
      expect(validateParticipants('-100')).toBe('Number of participants cannot be negative')
    })

    it('should return error for unrealistically large number', () => {
      expect(validateParticipants('10000000')).toBe('Please enter a realistic estimate')
    })
  })

  // ============================================
  // Complete Form Validation Tests
  // ============================================
  describe('validateOnboardingForm', () => {
    const validFormData: OnboardingFormData = {
      businessName: 'Peak Performance Gym',
      businessType: 'gym',
      contactName: 'John Smith',
      email: 'john@gym.com',
      phone: '(555) 123-4567',
      websiteUrl: 'https://peakgym.com',
      integrationType: 'widget',
      primaryColor: '#14B8A6',
      estimatedMonthlyParticipants: '500',
    }

    it('should return all null errors for valid form data', () => {
      const errors = validateOnboardingForm(validFormData)
      expect(errors.businessName).toBeNull()
      expect(errors.businessType).toBeNull()
      expect(errors.contactName).toBeNull()
      expect(errors.email).toBeNull()
      expect(errors.phone).toBeNull()
      expect(errors.websiteUrl).toBeNull()
      expect(errors.integrationType).toBeNull()
      expect(errors.primaryColor).toBeNull()
      expect(errors.estimatedMonthlyParticipants).toBeNull()
    })

    it('should return errors for empty required fields', () => {
      const emptyFormData: OnboardingFormData = {
        businessName: '',
        businessType: '',
        contactName: '',
        email: '',
        phone: '',
      }
      const errors = validateOnboardingForm(emptyFormData)
      expect(errors.businessName).toBe('Business name is required')
      expect(errors.businessType).toBe('Please select a business type')
      expect(errors.contactName).toBe('Contact name is required')
      expect(errors.email).toBe('Email is required')
      expect(errors.phone).toBe('Phone number is required')
    })

    it('should handle missing optional fields gracefully', () => {
      const minimalFormData: OnboardingFormData = {
        businessName: 'Test Gym',
        businessType: 'gym',
        contactName: 'John',
        email: 'john@test.com',
        phone: '1234567890',
      }
      const errors = validateOnboardingForm(minimalFormData)
      expect(errors.websiteUrl).toBeNull()
      expect(errors.integrationType).toBeNull()
      expect(errors.primaryColor).toBeNull()
      expect(errors.estimatedMonthlyParticipants).toBeNull()
    })

    it('should validate optional fields when provided', () => {
      const formWithInvalidOptionals: OnboardingFormData = {
        businessName: 'Test Gym',
        businessType: 'gym',
        contactName: 'John',
        email: 'john@test.com',
        phone: '1234567890',
        websiteUrl: 'not a url',
        primaryColor: 'red',
      }
      const errors = validateOnboardingForm(formWithInvalidOptionals)
      expect(errors.websiteUrl).toBe('Please enter a valid website URL')
      expect(errors.primaryColor).toBe('Please enter a valid hex color (e.g., #14B8A6)')
    })
  })

  // ============================================
  // Helper Function Tests
  // ============================================
  describe('hasValidationErrors', () => {
    it('should return false when all errors are null', () => {
      const errors = {
        businessName: null,
        email: null,
        phone: null,
      }
      expect(hasValidationErrors(errors)).toBe(false)
    })

    it('should return true when any error exists', () => {
      const errors = {
        businessName: 'Business name is required',
        email: null,
        phone: null,
      }
      expect(hasValidationErrors(errors)).toBe(true)
    })

    it('should return true when multiple errors exist', () => {
      const errors = {
        businessName: 'Business name is required',
        email: 'Email is required',
        phone: 'Phone is required',
      }
      expect(hasValidationErrors(errors)).toBe(true)
    })
  })

  describe('getErrorMessages', () => {
    it('should return empty array when no errors', () => {
      const errors = {
        businessName: null,
        email: null,
        phone: null,
      }
      expect(getErrorMessages(errors)).toEqual([])
    })

    it('should return array of error messages', () => {
      const errors = {
        businessName: 'Business name is required',
        email: null,
        phone: 'Phone is required',
      }
      const messages = getErrorMessages(errors)
      expect(messages).toContain('Business name is required')
      expect(messages).toContain('Phone is required')
      expect(messages).toHaveLength(2)
    })

    it('should filter out null values', () => {
      const errors = {
        businessName: 'Error 1',
        email: null,
        phone: 'Error 2',
        websiteUrl: null,
      }
      const messages = getErrorMessages(errors)
      expect(messages).toEqual(['Error 1', 'Error 2'])
    })
  })
})
