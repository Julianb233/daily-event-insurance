import { z } from 'zod'

// Password requirements - centralized configuration
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const

// Zod schema for password validation with detailed error messages
export const passwordSchema = z
  .string()
  .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
  )

// Email schema with detailed validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')
  .transform((email) => email.toLowerCase().trim())

// Name schema with optional validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .optional()

// Complete registration schema combining all fields
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

// Type inference for registration data
export type RegistrationInput = z.infer<typeof registrationSchema>

/**
 * Validate password and return all errors
 * @param password - The password string to validate
 * @returns Object containing valid status and array of error messages
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const result = passwordSchema.safeParse(password)
  if (result.success) {
    return { valid: true, errors: [] }
  }
  return {
    valid: false,
    errors: result.error.errors.map((e) => e.message),
  }
}

/**
 * Validate complete registration data
 * @param data - Registration input data
 * @returns Object containing valid status and array of field errors
 */
export function validateRegistration(data: unknown): {
  valid: boolean
  data?: RegistrationInput
  errors: { field: string; message: string }[]
} {
  const result = registrationSchema.safeParse(data)
  if (result.success) {
    return { valid: true, data: result.data, errors: [] }
  }
  return {
    valid: false,
    errors: result.error.errors.map((e) => ({
      field: e.path.join('.') || 'unknown',
      message: e.message,
    })),
  }
}

// Common weak passwords to block - expanded list for security
const COMMON_PASSWORDS = [
  // Basic weak passwords with numbers to meet length
  'password123!',
  'password1234!',
  '123456789012!',
  'qwerty123456!',
  'admin1234567!',
  'letmein12345!',
  'welcome12345!',
  'monkey1234567',
  'dragon1234567',
  'master1234567',
  'sunshine12345',
  'princess12345',
  'football12345',
  'baseball12345',
  'iloveyou12345',
  'trustno112345',
  'superman12345',
  'starwars12345',
  'password!@#12',
  'qwertyuiop123',
  'asdfghjkl1234',
  'zxcvbnm123456',
  // Common patterns
  'abcd1234!@#$',
  '1234567890ab!',
  'aabbccdd1234!',
  // Company/product related
  'insurance1234',
  'dailyevent123',
]

/**
 * Check if password contains common weak patterns
 * @param password - The password to check
 * @returns true if password matches a common weak pattern
 */
export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  return COMMON_PASSWORDS.some((common) =>
    lowerPassword.includes(common.toLowerCase())
  )
}

/**
 * Check for sequential characters (e.g., abc, 123)
 * @param password - The password to check
 * @returns true if password contains sequential patterns
 */
export function hasSequentialChars(password: string, length: number = 4): boolean {
  const lower = password.toLowerCase()

  for (let i = 0; i <= lower.length - length; i++) {
    let isAscSequential = true
    let isDescSequential = true

    for (let j = 0; j < length - 1; j++) {
      const currentCode = lower.charCodeAt(i + j)
      const nextCode = lower.charCodeAt(i + j + 1)

      if (nextCode !== currentCode + 1) isAscSequential = false
      if (nextCode !== currentCode - 1) isDescSequential = false
    }

    if (isAscSequential || isDescSequential) return true
  }

  return false
}

/**
 * Check for repeated characters (e.g., aaaa, 1111)
 * @param password - The password to check
 * @param maxRepeats - Maximum allowed consecutive repeats
 * @returns true if password has too many repeated characters
 */
export function hasRepeatedChars(password: string, maxRepeats: number = 3): boolean {
  const regex = new RegExp(`(.)\\1{${maxRepeats},}`)
  return regex.test(password)
}

/**
 * Comprehensive password strength validation including common patterns
 * @param password - The password to validate
 * @returns Object with valid status and all error messages
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const baseValidation = validatePassword(password)
  const errors = [...baseValidation.errors]
  const warnings: string[] = []

  // Check for common passwords
  if (isCommonPassword(password)) {
    errors.push('Password is too common. Please choose a more unique password.')
  }

  // Check for sequential characters
  if (hasSequentialChars(password, 4)) {
    warnings.push('Password contains sequential characters which may be easier to guess')
  }

  // Check for repeated characters
  if (hasRepeatedChars(password, 3)) {
    warnings.push('Password contains repeated characters which may be easier to guess')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get human-readable password requirements for UI display
 */
export function getPasswordRequirements(): string[] {
  return [
    `At least ${PASSWORD_REQUIREMENTS.minLength} characters`,
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one number (0-9)',
    'At least one special character (!@#$%^&*...)',
  ]
}
