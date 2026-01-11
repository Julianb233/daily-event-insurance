/**
 * Onboarding Form Validation Functions
 * Extracted for testability and reuse
 */

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns Error message if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return null
}

/**
 * Validates a phone number
 * @param phone - Phone string to validate
 * @returns Error message if invalid, null if valid
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required"
  const digitsOnly = phone.replace(/\D/g, "")
  if (digitsOnly.length < 10) return "Please enter a valid phone number"
  return null
}

/**
 * Validates a URL
 * @param url - URL string to validate
 * @returns Error message if invalid, null if valid (empty is valid as optional)
 */
export const validateUrl = (url: string): string | null => {
  if (!url) return null // Optional field
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`)
    return null
  } catch {
    return "Please enter a valid website URL"
  }
}

/**
 * Validates a business name
 * @param name - Business name to validate
 * @returns Error message if invalid, null if valid
 */
export const validateBusinessName = (name: string): string | null => {
  if (!name) return "Business name is required"
  if (name.trim().length < 2) return "Business name must be at least 2 characters"
  if (name.length > 200) return "Business name must be less than 200 characters"
  return null
}

/**
 * Validates a contact name
 * @param name - Contact name to validate
 * @returns Error message if invalid, null if valid
 */
export const validateContactName = (name: string): string | null => {
  if (!name) return "Contact name is required"
  if (name.trim().length < 2) return "Contact name must be at least 2 characters"
  return null
}

/**
 * Validates business type selection
 * @param type - Business type value
 * @returns Error message if invalid, null if valid
 */
export const validateBusinessType = (type: string): string | null => {
  if (!type) return "Please select a business type"
  const validTypes = ["gym", "climbing", "yoga", "rental", "other"]
  if (!validTypes.includes(type)) return "Please select a valid business type"
  return null
}

/**
 * Validates integration type selection
 * @param type - Integration type value
 * @returns Error message if invalid, null if valid
 */
export const validateIntegrationType = (type: string): string | null => {
  if (!type) return "Please select an integration type"
  const validTypes = ["widget", "api", "manual"]
  if (!validTypes.includes(type)) return "Please select a valid integration type"
  return null
}

/**
 * Validates a hex color code
 * @param color - Hex color string to validate
 * @returns Error message if invalid, null if valid
 */
export const validateHexColor = (color: string): string | null => {
  if (!color) return null // Optional field
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!hexRegex.test(color)) return "Please enter a valid hex color (e.g., #14B8A6)"
  return null
}

/**
 * Validates monthly participants estimate
 * @param value - Participants estimate string
 * @returns Error message if invalid, null if valid
 */
export const validateParticipants = (value: string): string | null => {
  if (!value) return null // Optional field
  const num = parseInt(value, 10)
  if (isNaN(num)) return "Please enter a valid number"
  if (num < 0) return "Number of participants cannot be negative"
  if (num > 1000000) return "Please enter a realistic estimate"
  return null
}

/**
 * Validates the complete onboarding form data
 * @param formData - Complete form data object
 * @returns Object with field-specific errors, empty if all valid
 */
export interface OnboardingFormData {
  businessName: string
  businessType: string
  contactName: string
  email: string
  phone: string
  websiteUrl?: string
  integrationType?: string
  primaryColor?: string
  estimatedMonthlyParticipants?: string
}

export interface ValidationErrors {
  businessName?: string | null
  businessType?: string | null
  contactName?: string | null
  email?: string | null
  phone?: string | null
  websiteUrl?: string | null
  integrationType?: string | null
  primaryColor?: string | null
  estimatedMonthlyParticipants?: string | null
}

export const validateOnboardingForm = (formData: OnboardingFormData): ValidationErrors => {
  return {
    businessName: validateBusinessName(formData.businessName),
    businessType: validateBusinessType(formData.businessType),
    contactName: validateContactName(formData.contactName),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
    websiteUrl: formData.websiteUrl ? validateUrl(formData.websiteUrl) : null,
    integrationType: formData.integrationType ? validateIntegrationType(formData.integrationType) : null,
    primaryColor: formData.primaryColor ? validateHexColor(formData.primaryColor) : null,
    estimatedMonthlyParticipants: formData.estimatedMonthlyParticipants
      ? validateParticipants(formData.estimatedMonthlyParticipants)
      : null,
  }
}

/**
 * Checks if form has any validation errors
 * @param errors - Validation errors object
 * @returns true if any errors exist
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== null)
}

/**
 * Gets all error messages as an array
 * @param errors - Validation errors object
 * @returns Array of non-null error messages
 */
export const getErrorMessages = (errors: ValidationErrors): string[] => {
  return Object.values(errors).filter((error): error is string => error !== null)
}
