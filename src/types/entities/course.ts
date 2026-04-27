/**
 * Course Entity Types
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
  certificate_template?: {
    id: number
    name: string
    description: string | null
    is_default: boolean
    is_active: boolean
  } | null
  progress_tracking: boolean
  featured: boolean
  trial_period_days: number

  // Metadata
  meta_title: string | null
  meta_description: string | null
  thumbnail_url?: string | null

  // Promotional materials
  promotional_image_url?: string | null
  promotional_video_url?: string | null
  promotional_video_embedded_url?: string | null

  // Course objectives
  course_objectives?: Array<{
    id: number
    title: string
    objective_type: 'learning' | 'skill' | 'knowledge' | 'competency'
    is_measurable: boolean
    formatted_title: string
  }>

  // Sections summary (for public landing page)
  sections_summary?: Array<{
    id: number
    title: string
    description: string | null
    position: number
    lessons_count: number
    duration_minutes: number
  }>

  // Full sections with lessons (only present in :full view for enrolled users / teachers)
  sections?: Array<{
    id: number
    title: string
    description: string | null
    position: number
    lessons: Array<{
      id: number
      title: string
      duration_minutes: number
      position: number
      lesson_type: string
    }>
  }>

  // Relations
  creator_id: number
  learning_path_id: number | null
  position: number

  // Computed/Stats
  enrollment_count?: number
  average_rating?: number
  total_lessons?: number
  sections_count?: number
  lessons_count?: number
  is_published?: boolean

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

  // Enrollment context — present in :summary and :full views for authenticated users.
  // null  → user is authenticated but not enrolled
  // true  → user is enrolled
  // undefined → guest (not included in :minimal response)
  enrolled?: boolean | null
  progress_percentage?: number | null

  // Timestamps
  created_at: string
  updated_at: string
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

export interface CourseEnrollment {
  id: number
  course_id: number
  user_id: number
  enrolled_at: string
  progress_percentage: number
  completed_at?: string
  last_accessed_at?: string
}
