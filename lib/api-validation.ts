import { z } from "zod"

/**
 * Validation schemas for partner API endpoints
 */

// ============= Common Schemas =============

export const uuidSchema = z.string().uuid("Invalid UUID format")

export const emailSchema = z.string().email("Invalid email address")

export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  "Invalid phone number format"
).optional()

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate
    }
    return true
  },
  { message: "Start date must be before or equal to end date" }
)

// ============= Profile Schemas =============

export const updateProfileSchema = z.object({
  businessName: z.string().min(2).max(200).optional(),
  businessType: z.string().min(2).max(100).optional(),
  contactName: z.string().min(2).max(100).optional(),
  contactEmail: emailSchema.optional(),
  contactPhone: phoneSchema,
  integrationType: z.enum(["widget", "api", "manual"]).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
})

// ============= Product Schemas =============

export const productTypeSchema = z.enum(["liability", "equipment", "cancellation"])

export const updateProductSchema = z.object({
  productType: productTypeSchema,
  isEnabled: z.boolean().optional(),
  customerPrice: z.number().positive().min(0.01).max(9999.99).optional(),
})

export const productsListSchema = z.object({
  enabled: z.coerce.boolean().optional(),
})

// ============= Quote Schemas =============

export const createQuoteSchema = z.object({
  eventType: z.string().min(2).max(100),
  eventDate: z.coerce.date(),
  participants: z.number().int().positive().min(1).max(10000),
  coverageType: productTypeSchema,
  eventDetails: z.object({
    location: z.string().min(2).max(200).optional(),
    duration: z.number().positive().optional(), // hours
    description: z.string().max(1000).optional(),
  }).optional(),
  customerEmail: emailSchema.optional(),
  customerName: z.string().min(2).max(100).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export const quotesListSchema = paginationSchema.extend({
  status: z.enum(["pending", "accepted", "declined", "expired"]).optional(),
  coverageType: productTypeSchema.optional(),
  ...dateRangeSchema.shape,
})

// ============= Policy Schemas =============

export const policiesListSchema = paginationSchema.extend({
  status: z.enum(["active", "expired", "cancelled", "pending"]).optional(),
  coverageType: productTypeSchema.optional(),
  ...dateRangeSchema.shape,
})

export const policyDetailsSchema = z.object({
  policyId: uuidSchema,
})

// ============= Analytics Schemas =============

export const analyticsSchema = z.object({
  period: z.enum(["7d", "30d", "90d", "12m", "ytd", "all"]).default("30d"),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
  metrics: z.array(
    z.enum([
      "quotes",
      "policies",
      "revenue",
      "conversion",
      "participants",
      "opt_in_rate"
    ])
  ).default(["quotes", "policies", "revenue"]),
})

// ============= Earnings Schemas =============

export const earningsReportSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM format"),
  totalParticipants: z.number().int().nonnegative(),
  locationBonus: z.number().nonnegative().default(0),
})

export const earningsListSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100).optional(),
})

// ============= Validation Helpers =============

/**
 * Validates request body against a schema
 * @returns Parsed data or throws with validation errors
 */
export function validateBody<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.parse(data)
}

/**
 * Validates query parameters against a schema
 * @returns Parsed data or throws with validation errors
 */
export function validateQuery<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  const params: Record<string, any> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return schema.parse(params)
}

/**
 * Safe validation that returns success/error object instead of throwing
 */
export function safeValidate<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Format Zod validation errors for API response
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(err.message)
  })

  return formatted
}
