/**
 * Quote Validation Rules
 *
 * Business logic and validation rules for insurance quotes
 */

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}

export interface QuoteInput {
  eventType: string
  eventDate: Date
  participants: number
  coverageType: "liability" | "equipment" | "cancellation"
  duration?: number
  location?: string
  customerEmail?: string
  customerName?: string
  eventDetails?: Record<string, any>
  metadata?: Record<string, any>
}

// ============= Validation Rules =============

const MIN_PARTICIPANTS = 1
const MAX_PARTICIPANTS = 10000
const MIN_DURATION_HOURS = 0.5
const MAX_DURATION_HOURS = 24
const MIN_ADVANCE_HOURS = 4 // Minimum hours before event
const MAX_ADVANCE_DAYS = 365 // Maximum days in advance
const MIN_EVENT_TYPE_LENGTH = 2
const MAX_EVENT_TYPE_LENGTH = 100

/**
 * Validate quote input with business rules
 */
export function validateQuote(input: QuoteInput): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Validate event type
  validateEventType(input.eventType, errors, warnings)

  // Validate event date
  validateEventDate(input.eventDate, errors, warnings)

  // Validate participants
  validateParticipants(input.participants, errors, warnings)

  // Validate coverage type
  validateCoverageType(input.coverageType, errors)

  // Validate duration if provided
  if (input.duration !== undefined) {
    validateDuration(input.duration, errors, warnings)
  }

  // Validate location if provided
  if (input.location !== undefined) {
    validateLocation(input.location, errors, warnings)
  }

  // Validate customer info if provided
  if (input.customerEmail !== undefined) {
    validateEmail(input.customerEmail, errors)
  }

  if (input.customerName !== undefined) {
    validateCustomerName(input.customerName, errors)
  }

  // Cross-field validations
  validateCombinations(input, errors, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate event type
 */
function validateEventType(
  eventType: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!eventType || typeof eventType !== "string") {
    errors.push({
      field: "eventType",
      message: "Event type is required",
      code: "EVENT_TYPE_REQUIRED",
    })
    return
  }

  const trimmed = eventType.trim()

  if (trimmed.length < MIN_EVENT_TYPE_LENGTH) {
    errors.push({
      field: "eventType",
      message: `Event type must be at least ${MIN_EVENT_TYPE_LENGTH} characters`,
      code: "EVENT_TYPE_TOO_SHORT",
    })
  }

  if (trimmed.length > MAX_EVENT_TYPE_LENGTH) {
    errors.push({
      field: "eventType",
      message: `Event type must not exceed ${MAX_EVENT_TYPE_LENGTH} characters`,
      code: "EVENT_TYPE_TOO_LONG",
    })
  }

  // Check for suspicious patterns
  if (/^test|demo|sample/i.test(trimmed)) {
    warnings.push({
      field: "eventType",
      message: "Event type appears to be a test entry",
      code: "EVENT_TYPE_TEST",
    })
  }
}

/**
 * Validate event date
 */
function validateEventDate(
  eventDate: Date,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!eventDate || !(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
    errors.push({
      field: "eventDate",
      message: "Valid event date is required",
      code: "EVENT_DATE_INVALID",
    })
    return
  }

  const now = new Date()
  const minDate = new Date(now.getTime() + MIN_ADVANCE_HOURS * 60 * 60 * 1000)
  const maxDate = new Date(now.getTime() + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000)

  // Date in the past
  if (eventDate < now) {
    errors.push({
      field: "eventDate",
      message: "Event date cannot be in the past",
      code: "EVENT_DATE_PAST",
    })
    return
  }

  // Too soon
  if (eventDate < minDate) {
    errors.push({
      field: "eventDate",
      message: `Event must be at least ${MIN_ADVANCE_HOURS} hours in advance`,
      code: "EVENT_DATE_TOO_SOON",
    })
  }

  // Too far in future
  if (eventDate > maxDate) {
    errors.push({
      field: "eventDate",
      message: `Event date cannot be more than ${MAX_ADVANCE_DAYS} days in advance`,
      code: "EVENT_DATE_TOO_FAR",
    })
  }

  // Warning for events within 24 hours
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  if (eventDate < twentyFourHoursFromNow) {
    warnings.push({
      field: "eventDate",
      message: "Event is within 24 hours - expedited processing required",
      code: "EVENT_DATE_SHORT_NOTICE",
    })
  }

  // Warning for weekend events
  const dayOfWeek = eventDate.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    warnings.push({
      field: "eventDate",
      message: "Weekend event - may have higher participation",
      code: "EVENT_DATE_WEEKEND",
    })
  }
}

/**
 * Validate participants
 */
function validateParticipants(
  participants: number,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (typeof participants !== "number" || isNaN(participants)) {
    errors.push({
      field: "participants",
      message: "Valid participant count is required",
      code: "PARTICIPANTS_INVALID",
    })
    return
  }

  if (!Number.isInteger(participants)) {
    errors.push({
      field: "participants",
      message: "Participant count must be a whole number",
      code: "PARTICIPANTS_NOT_INTEGER",
    })
  }

  if (participants < MIN_PARTICIPANTS) {
    errors.push({
      field: "participants",
      message: `Minimum ${MIN_PARTICIPANTS} participant required`,
      code: "PARTICIPANTS_TOO_FEW",
    })
  }

  if (participants > MAX_PARTICIPANTS) {
    errors.push({
      field: "participants",
      message: `Maximum ${MAX_PARTICIPANTS} participants allowed`,
      code: "PARTICIPANTS_TOO_MANY",
    })
  }

  // Warnings for unusual counts
  if (participants > 1000) {
    warnings.push({
      field: "participants",
      message: "Large event - may require additional underwriting review",
      code: "PARTICIPANTS_LARGE_EVENT",
    })
  }

  if (participants === 1) {
    warnings.push({
      field: "participants",
      message: "Single participant event - verify this is correct",
      code: "PARTICIPANTS_SINGLE",
    })
  }
}

/**
 * Validate coverage type
 */
function validateCoverageType(
  coverageType: string,
  errors: ValidationError[]
): void {
  const validTypes = ["liability", "equipment", "cancellation"]

  if (!coverageType) {
    errors.push({
      field: "coverageType",
      message: "Coverage type is required",
      code: "COVERAGE_TYPE_REQUIRED",
    })
    return
  }

  if (!validTypes.includes(coverageType)) {
    errors.push({
      field: "coverageType",
      message: `Coverage type must be one of: ${validTypes.join(", ")}`,
      code: "COVERAGE_TYPE_INVALID",
    })
  }
}

/**
 * Validate duration
 */
function validateDuration(
  duration: number,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (typeof duration !== "number" || isNaN(duration)) {
    errors.push({
      field: "duration",
      message: "Duration must be a valid number",
      code: "DURATION_INVALID",
    })
    return
  }

  if (duration < MIN_DURATION_HOURS) {
    errors.push({
      field: "duration",
      message: `Duration must be at least ${MIN_DURATION_HOURS} hours`,
      code: "DURATION_TOO_SHORT",
    })
  }

  if (duration > MAX_DURATION_HOURS) {
    errors.push({
      field: "duration",
      message: `Duration cannot exceed ${MAX_DURATION_HOURS} hours`,
      code: "DURATION_TOO_LONG",
    })
  }

  // Warning for very short durations
  if (duration < 1) {
    warnings.push({
      field: "duration",
      message: "Very short duration - verify this is correct",
      code: "DURATION_VERY_SHORT",
    })
  }

  // Warning for full-day events
  if (duration >= 8) {
    warnings.push({
      field: "duration",
      message: "Full-day or multi-day event - extended coverage",
      code: "DURATION_EXTENDED",
    })
  }
}

/**
 * Validate location
 */
function validateLocation(
  location: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!location || typeof location !== "string") {
    return // Location is optional
  }

  const trimmed = location.trim()

  if (trimmed.length < 2) {
    errors.push({
      field: "location",
      message: "Location must be at least 2 characters",
      code: "LOCATION_TOO_SHORT",
    })
  }

  if (trimmed.length > 200) {
    errors.push({
      field: "location",
      message: "Location must not exceed 200 characters",
      code: "LOCATION_TOO_LONG",
    })
  }

  // Warning for remote locations
  const remotekeywords = ["remote", "wilderness", "backcountry", "offshore"]
  const normalized = trimmed.toLowerCase()
  if (remotekeywords.some(keyword => normalized.includes(keyword))) {
    warnings.push({
      field: "location",
      message: "Remote location - may require additional safety measures",
      code: "LOCATION_REMOTE",
    })
  }
}

/**
 * Validate email
 */
function validateEmail(email: string, errors: ValidationError[]): void {
  if (!email || typeof email !== "string") {
    return // Email is optional
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push({
      field: "customerEmail",
      message: "Invalid email address format",
      code: "EMAIL_INVALID",
    })
  }

  if (email.length > 255) {
    errors.push({
      field: "customerEmail",
      message: "Email address is too long",
      code: "EMAIL_TOO_LONG",
    })
  }
}

/**
 * Validate customer name
 */
function validateCustomerName(name: string, errors: ValidationError[]): void {
  if (!name || typeof name !== "string") {
    return // Name is optional
  }

  const trimmed = name.trim()

  if (trimmed.length < 2) {
    errors.push({
      field: "customerName",
      message: "Customer name must be at least 2 characters",
      code: "NAME_TOO_SHORT",
    })
  }

  if (trimmed.length > 100) {
    errors.push({
      field: "customerName",
      message: "Customer name must not exceed 100 characters",
      code: "NAME_TOO_LONG",
    })
  }
}

/**
 * Validate field combinations
 */
function validateCombinations(
  input: QuoteInput,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // High-risk activities with many participants
  const highRiskActivities = [
    "skydiving", "paragliding", "bungee", "white water",
    "cliff diving", "base jumping"
  ]

  const eventTypeLower = input.eventType.toLowerCase()
  const isHighRisk = highRiskActivities.some(activity =>
    eventTypeLower.includes(activity)
  )

  if (isHighRisk && input.participants > 50) {
    warnings.push({
      field: "eventType",
      message: "High-risk activity with large group - may require manual underwriting",
      code: "COMBINATION_HIGH_RISK_LARGE_GROUP",
    })
  }

  // Equipment coverage without equipment details
  if (input.coverageType === "equipment" && input.eventDetails) {
    const hasEquipmentDetails = input.eventDetails.equipmentType ||
                                input.eventDetails.equipmentValue
    if (!hasEquipmentDetails) {
      warnings.push({
        field: "eventDetails",
        message: "Equipment coverage selected but no equipment details provided",
        code: "COMBINATION_EQUIPMENT_NO_DETAILS",
      })
    }
  }

  // Cancellation coverage for past events (should be caught earlier but double-check)
  if (input.coverageType === "cancellation") {
    const now = new Date()
    const hoursUntilEvent = (input.eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilEvent < 48) {
      warnings.push({
        field: "coverageType",
        message: "Cancellation coverage less than 48 hours before event",
        code: "COMBINATION_CANCELLATION_SHORT_NOTICE",
      })
    }
  }

  // Very long duration with single participant
  if (input.duration && input.duration > 8 && input.participants < 5) {
    warnings.push({
      field: "duration",
      message: "Extended duration for small group - verify event details",
      code: "COMBINATION_LONG_DURATION_SMALL_GROUP",
    })
  }
}

/**
 * Validate quote can be converted to policy
 */
export function validateQuoteForPolicy(quote: {
  status: string
  expiresAt: Date
  customerEmail?: string | null
  customerName?: string | null
}): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check status
  if (quote.status !== "pending") {
    errors.push({
      field: "status",
      message: "Only pending quotes can be converted to policies",
      code: "QUOTE_INVALID_STATUS",
    })
  }

  // Check expiration
  if (quote.expiresAt < new Date()) {
    errors.push({
      field: "expiresAt",
      message: "Quote has expired",
      code: "QUOTE_EXPIRED",
    })
  }

  // Check customer information
  if (!quote.customerEmail) {
    errors.push({
      field: "customerEmail",
      message: "Customer email is required to convert to policy",
      code: "CUSTOMER_EMAIL_REQUIRED",
    })
  }

  if (!quote.customerName) {
    errors.push({
      field: "customerName",
      message: "Customer name is required to convert to policy",
      code: "CUSTOMER_NAME_REQUIRED",
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Check if quote needs manual review
 */
export function requiresManualReview(input: QuoteInput): {
  required: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // Very large events
  if (input.participants > 2000) {
    reasons.push("Event exceeds 2,000 participants")
  }

  // High-risk activities
  const highRiskActivities = [
    "skydiving", "paragliding", "bungee", "base jumping"
  ]
  const eventTypeLower = input.eventType.toLowerCase()
  if (highRiskActivities.some(activity => eventTypeLower.includes(activity))) {
    reasons.push("High-risk activity classification")
  }

  // Very short notice
  const hoursUntilEvent = (input.eventDate.getTime() - Date.now()) / (1000 * 60 * 60)
  if (hoursUntilEvent < 12) {
    reasons.push("Event within 12 hours - expedited review needed")
  }

  // Remote locations
  if (input.location) {
    const remotekeywords = ["remote", "wilderness", "backcountry"]
    const normalized = input.location.toLowerCase()
    if (remotekeywords.some(keyword => normalized.includes(keyword))) {
      reasons.push("Remote location requires safety verification")
    }
  }

  return {
    required: reasons.length > 0,
    reasons,
  }
}

/**
 * Generate validation summary for display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return "All validations passed"
  }

  const parts: string[] = []

  if (result.errors.length > 0) {
    parts.push(`${result.errors.length} error(s)`)
  }

  if (result.warnings.length > 0) {
    parts.push(`${result.warnings.length} warning(s)`)
  }

  return parts.join(", ")
}
