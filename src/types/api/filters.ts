/**
 * API Filter Types
 * Filters for API queries across different resources
 */
import type { CourseStatus, DifficultyLevel } from '../entities/course'
import type { EnrollmentStatus } from '../entities/enrollment'

/**
 * Course filters for queries
 */
export interface CourseFilters {
  status?: CourseStatus | 'all'
  difficulty_level?: DifficultyLevel | 'all'
  is_free?: boolean
  is_published?: boolean
  featured?: boolean
  category?: string
  tags?: string[]
  search?: string
  page?: number
  per_page?: number
}

/**
 * Enrollment filters for queries
 */
export interface EnrollmentFilters {
  status?: EnrollmentStatus
  page?: number
  per_page?: number
}

/**
 * Badge filters for queries
 */
export interface BadgeFilters {
  category?: string
  tier?: string
  page?: number
  per_page?: number
}

/**
 * Learning path enrollment filters for queries
 */
export interface LearningPathEnrollmentFilters {
  status?: string
  min_progress?: number
  page?: number
  per_page?: number
}

/**
 * Learning path filters for queries
 */
export interface LearningPathFilters {
  academy_id?: number
  published?: boolean
  difficulty?: string
  page?: number
  per_page?: number
}

/**
 * Student assignment filters for queries
 */
export interface StudentAssignmentFilters {
  status?: 'pending' | 'past_due' | 'upcoming'
}

/**
 * Super admin badge filters for queries
 */
export interface SuperAdminBadgeFilters {
  search?: string
  category?: string
  tier?: string
  rarity?: string
  status?: string
}
