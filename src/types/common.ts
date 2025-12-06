/**
 * Common types used across the application
 */

// Pagination metadata
export interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages?: number
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  errors?: Record<string, string[]>
}

// User roles
export type UserRole = 'guest' | 'student' | 'teacher' | 'admin' | 'super_admin'

// View modes for lists
export type ViewMode = 'grid' | 'list'

// Status types
export type PublishStatus = 'draft' | 'published' | 'archived'

// Difficulty levels - both string and numeric representations
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type DifficultyLevelNumeric = 0 | 1 | 2 // 0: beginner, 1: intermediate, 2: advanced

// Common filter base
export interface BaseFilters {
  search?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}
