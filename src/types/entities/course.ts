/**
 * Course related types
 */

import type { BaseFilters, DifficultyLevel } from '../common'
import type { Creator } from './user'
import type { AcademyCategory } from './category'

// Enums matching DB integers
export type CourseStatus = 0 | 1 | 2 // 0: draft, 1: published, 2: archived
export type CourseDifficultyLevel = 0 | 1 | 2 // 0: beginner, 1: intermediate, 2: advanced
export type PricingType = 'free' | 'one_time' | 'subscription'

export interface Course {
  id: number
  title: string
  slug: string
  description?: string | null
  
  // Pricing
  is_free: boolean
  price: number // decimal(10,2) in DB
  currency: string // default 'COP'
  pricing_type: string // default 'free'
  sale_price?: number | null // decimal(10,2)
  sale_ends_at?: string | null
  subscription_price_monthly?: number | null // decimal(10,2)
  subscription_price_annual?: number | null // decimal(10,2)
  trial_period_days: number // default 0
  
  // Course settings
  difficulty_level: CourseDifficultyLevel // integer enum, default 0
  status: CourseStatus // integer enum, default 0
  duration_minutes: number // default 0
  category?: string | null // varchar(50)
  tags?: string | null // text field
  prerequisites?: string | null
  position?: number | null
  
  // Features
  allow_comments: boolean // default true
  certificate_enabled: boolean // default true
  progress_tracking: boolean // default true
  featured: boolean // default false
  
  // Metadata (SEO)
  meta_title?: string | null
  meta_description?: string | null
  
  // Relations
  academy_id: number
  creator_id: number
  learning_path_id?: number | null
  
  // Computed/Stats (from serializer)
  enrollment_count?: number
  sections_count?: number
  lessons_count?: number
  rating?: number
  reviews_count?: number
  thumbnail_url?: string // Active Storage attachment
  
  // Relations data
  creator?: Creator
  academy?: {
    id: number
    name: string
    slug: string
  }
  
  // Progress (for enrolled users)
  progress?: {
    completion_percentage: number
    completed_lessons: number
    total_lessons: number
    is_completed: boolean
  }
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CourseFilters extends BaseFilters {
  category?: string
  difficulty?: DifficultyLevel
  is_free?: boolean
  academy_id?: number
  sort_by?: 'popular' | 'rating' | 'newest' | 'price'
}

export interface FeaturedCourseByCategory {
  category: AcademyCategory
  courses: Course[]
}

export interface CourseEnrollment {
  id: number
  course_id: number
  user_id: number
  enrolled_at: string
  progress_percentage: number
  completed_at?: string
  last_accessed_at?: string
}
