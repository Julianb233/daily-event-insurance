import { NextResponse } from "next/server"

/**
 * Standard API response formats for consistency
 */

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

export interface ErrorResponse {
  success: false
  error: string
  message: string
  code?: string
  details?: any
}

export interface PaginatedResponse<T = any> {
  success: true
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  }
  return NextResponse.json(response, { status })
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse {
  const response: ErrorResponse = {
    success: false,
    error,
    message,
    ...(code && { code }),
    ...(details && { details }),
  }
  return NextResponse.json(response, { status })
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
  status: number = 200
): NextResponse {
  const totalPages = Math.ceil(total / pageSize)
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
  return NextResponse.json(response, { status })
}

/**
 * Validation error response
 */
export function validationError(
  message: string,
  details?: any
): NextResponse {
  return errorResponse("Validation Error", message, 400, "VALIDATION_ERROR", details)
}

/**
 * Not found error response
 */
export function notFoundError(resource: string = "Resource"): NextResponse {
  return errorResponse("Not Found", `${resource} not found`, 404, "NOT_FOUND")
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message: string = "Authentication required"): NextResponse {
  return errorResponse("Unauthorized", message, 401, "UNAUTHORIZED")
}

/**
 * Forbidden error response
 */
export function forbiddenError(message: string = "Access forbidden"): NextResponse {
  return errorResponse("Forbidden", message, 403, "FORBIDDEN")
}

/**
 * Conflict error response
 */
export function conflictError(message: string): NextResponse {
  return errorResponse("Conflict", message, 409, "CONFLICT")
}

/**
 * Internal server error response
 */
export function serverError(message: string = "Internal server error"): NextResponse {
  return errorResponse("Server Error", message, 500, "INTERNAL_ERROR")
}

/**
 * Service unavailable error response
 */
export function serviceUnavailableError(message: string = "Service temporarily unavailable"): NextResponse {
  return errorResponse("Service Unavailable", message, 503, "SERVICE_UNAVAILABLE")
}
