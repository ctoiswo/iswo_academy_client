/**
 * Learning Path Entity Types
 * Based on Rails LearningPath model structure
 */
import type { Course } from './course'

export type LearningPathStatus = 'draft' | 'published' | 'archived'
export type UnlockMode = 'all_unlocked' | 'sequential' | 'milestone_based'

export interface LearningPath {
  id: number
  title: string
  slug: string
  description: string
  estimated_duration_hours: number
  difficulty_level: string
  status: LearningPathStatus
  position: number
  courses_count: number
  estimated_completion_score: number
  total_duration_minutes: number
  unlock_mode: UnlockMode
  milestone_size?: number
  creator: {
    id: number
    name: string
  }
  academy: {
    id: number
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
  progress?: {
    completion_percentage: number
    completed_courses: number
    total_courses: number
    is_completed: boolean
  }
  pricing?: {
    is_free: boolean
    price: string
    discount_percentage: number
    bundle_price: string
    savings: string
    calculated_price: string
    requires_payment: boolean
  }
  courses?: Course[]
}

export interface CourseProgress {
  course_id: number
  course_title: string
  completion_percentage: number
}

export interface EnrollmentTrend {
  month: string
  enrollments: number
}

export interface EngagementLevels {
  very_active: number
  moderately_active: number
  low_activity: number
}

export interface HighestDropoutCourse {
  course_id: number
  course_title: string
  dropout_rate: number
}

export interface LearningPathAnalytics {
  total_enrollments: number
  active_students: number
  completed_students: number
  completion_rate: number
  avg_completion_time_days: number
  dropout_rate: number
  course_progress: CourseProgress[]
  enrollment_trend: EnrollmentTrend[]
  engagement_levels: EngagementLevels
  highest_dropout_course: HighestDropoutCourse | null
}
