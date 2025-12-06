/**
 * API Response types
 */

import type { PaginationMeta } from '../common'

// Generic paginated response
export interface PaginatedApiResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Single item response
export interface SingleApiResponse<T> {
  data: T
  message?: string
}

// Success response
export interface SuccessResponse {
  success: boolean
  message: string
  data?: unknown
}

// Error response
export interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  status?: number
}
