/**
 * Enrollment Entity Types
 * Based on Rails Enrollment model structure
 */
import type { Course } from './course'

export type EnrollmentStatus = 'active' | 'completed' | 'suspended'

/**
 * Enrollment interface
 * Represents a user's enrollment in a course
 */
export interface Enrollment {
  id: number
  user: {
    id: number
    name: string
    email: string
  }
  course: Course
  status: EnrollmentStatus
  progress_percentage?: number
  enrolled_at: string
  completed_at?: string
  created_at: string
  updated_at: string
  payment?: {
    id: number
    status: string
    amount: number
  }
}
