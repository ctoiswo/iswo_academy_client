/**
 * Course Model Types
 * Based on Rails Course model structure
 */

export type CourseStatus = 'draft' | 'published' | 'archived'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type PricingType = 'free' | 'one_time' | 'subscription'

/**
 * Main Course interface
 * Represents a course in the academy system
 */
export interface Course {
  id: number
  academy_id: number
  title: string
  slug: string
  description: string

  // Pricing
  is_free: boolean
  price: number
  currency: string
  pricing_type: PricingType
  sale_price: number | null
  sale_ends_at: string | null
  subscription_price_monthly: number | null
  subscription_price_annual: number | null

  // Course settings
  difficulty_level: DifficultyLevel
  status: CourseStatus
  duration_minutes: number
  category: string | null
  tags: string[] | null
  prerequisites: string | null

  // Features
  allow_comments: boolean
  certificate_enabled: boolean
  progress_tracking: boolean
  featured: boolean
  trial_period_days: number

  // Metadata
  meta_title: string | null
  meta_description: string | null
  thumbnail_url?: string | null

  // Relations
  creator_id: number
  learning_path_id: number | null
  position: number

  // Computed/Stats
  enrollment_count?: number
  sections_count?: number
  lessons_count?: number

  // Relations data
  creator?: {
    id: number
    name: string
  }
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

/**
 * Course creation data
 */
export interface CreateCourseData {
  title: string
  description: string
  difficulty_level?: DifficultyLevel
  duration_minutes?: number
  is_free?: boolean
  price?: number
  currency?: string
  pricing_type?: PricingType
  status?: CourseStatus
  category?: string
  tags?: string[]
  prerequisites?: string
  allow_comments?: boolean
  certificate_enabled?: boolean
  progress_tracking?: boolean
  featured?: boolean
  trial_period_days?: number
  meta_title?: string
  meta_description?: string
}

/**
 * Course update data
 */
export interface UpdateCourseData extends Partial<CreateCourseData> {
  is_published?: boolean
  sale_price?: number
  sale_ends_at?: string
  subscription_price_monthly?: number
  subscription_price_annual?: number
}

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
 * Featured course (extends base Course)
 */
export interface FeaturedCourse extends Course {
  featured: true
}

/**
 * Category with courses
 */
export interface CategoryWithCourses {
  category: {
    id: number
    name: string
    description: string
    slug: string
  }
  courses: FeaturedCourse[]
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number
  per_page: number
  total_pages: number
  total_count: number
}

/**
 * Paginated courses response
 */
export interface CoursesResponse {
  data: Course[]
  meta: PaginationMeta
}
