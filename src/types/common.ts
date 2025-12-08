/**
 * Common types used across the application
 */

// Pagination metadata (matches backend structure)
export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
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

// API View modes (matches backend serializer views)
export type ApiViewMode = 'minimal' | 'summary' | 'full'

// Helper type to map view modes to their corresponding types
// Usage: ViewResponse<AcademyCategoryMinimal, AcademyCategorySummary, AcademyCategoryFull, 'minimal'>
export type ViewResponse<
  TMinimal,
  TSummary,
  TFull,
  TView extends ApiViewMode,
> = TView extends 'minimal'
  ? TMinimal
  : TView extends 'summary'
    ? TSummary
    : TFull
