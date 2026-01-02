import { NextResponse } from 'next/server';

// Standard API response types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Returns a successful JSON response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  );
}

/**
 * Returns a paginated JSON response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

/**
 * Returns a 404 not found error response
 */
export function notFoundError(message: string = 'Resource not found'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 404 }
  );
}

/**
 * Returns a 500 server error response
 */
export function serverError(message: string = 'Internal server error'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 500 }
  );
}

/**
 * Returns a 400 validation error response
 */
export function validationError(
  errors: Array<{ message: string; path?: (string | number)[] }> | string
): NextResponse<ApiResponse> {
  const errorMessage = typeof errors === 'string'
    ? errors
    : errors.map(e => e.message).join(', ');

  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      message: errorMessage
    },
    { status: 400 }
  );
}

/**
 * Returns a 401 unauthorized error response
 */
export function unauthorizedError(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 401 }
  );
}

/**
 * Returns a 403 forbidden error response
 */
export function forbiddenError(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 403 }
  );
}

// Re-export download helpers
export * from './download-helpers';
