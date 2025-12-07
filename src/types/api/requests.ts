/**
 * API Request types
 * Types for data sent to the API (POST, PATCH, PUT)
 */

// ============================================
// Auth Requests
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  password_confirmation: string
}

// ============================================
// Academy Category Requests
// ============================================

export interface CreateCategoryRequest {
  name: string
  description: string
  slug?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  slug?: string
}

// ============================================
// Course Requests
// ============================================

import type { DifficultyLevel, CourseStatus, PricingType } from '@/types/entities/course'

export interface CreateCourseRequest {
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

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  is_published?: boolean
  sale_price?: number
  sale_ends_at?: string
  subscription_price_monthly?: number
  subscription_price_annual?: number
}

// ============================================
// Academy Requests
// ============================================

export interface CreateAcademyRequest {
  name: string
  description: string
  slug?: string
  logo_url?: string
  banner_url?: string
  monthly_price?: number
  subscription_required?: boolean
  is_public?: boolean
  academy_category_id?: number
}

export interface UpdateAcademyRequest extends Partial<CreateAcademyRequest> {}

// ============================================
// Section Requests
// ============================================

export interface CreateSectionRequest {
  title: string
  description?: string
  position?: number
}

export interface UpdateSectionRequest extends Partial<CreateSectionRequest> {}

// ============================================
// Lesson Requests
// ============================================

import type { LessonType, VideoProvider } from '../entities/lesson'

export interface CreateLessonRequest {
  title: string
  lesson_type: LessonType
  content?: string
  content_json?: {
    type: string
    content: Array<{
      type: string
      content?: Array<{
        type: string
        text?: string
      }>
    }>
  }
  video_provider?: VideoProvider
  video_identifier?: string
  video_url?: string
  duration_minutes?: number
  is_free?: boolean
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  position?: number
}

// ============================================
// Assessment Requests
// ============================================

export interface CreateAssessmentRequest {
  type: 'Quiz' | 'Exam'
  title: string
  description?: string
  section_id?: number
  passing_score?: number
  attempts_allowed?: number
  time_limit_minutes?: number
  weight_percentage?: number
  retake_waiting_hours?: number
  question_pool_size?: number
  published?: boolean
  randomize_questions?: boolean
  randomize_answers?: boolean
  show_correct_answers?: boolean
  require_all_sections_complete?: boolean
}

export interface UpdateAssessmentRequest extends Partial<CreateAssessmentRequest> {}

// ============================================
// Question Requests
// ============================================

import type { QuestionType } from '../entities/assessment'

export interface CreateQuestionRequest {
  question_text: string
  question_type: QuestionType
  points: number
  explanation?: string
  answers: Array<{
    answer_text: string
    is_correct: boolean
  }>
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

// ============================================
// Assignment Requests
// ============================================

export interface CreateAssignmentRequest {
  title: string
  description?: string
  instructions?: string
  lesson_id: number
  section_id?: number
  max_points?: number
  passing_score?: number
  max_attempts?: number
  require_file_upload?: boolean
  require_text_submission?: boolean
  max_file_uploads?: number
  max_file_size_mb?: number
  allowed_file_types?: string[]
  available_from?: string
  due_at?: string
  late_submission_until?: string
  late_penalty_percent?: number
  allow_resubmission?: boolean
  auto_accept_on_time?: boolean
  peer_review_enabled?: boolean
  peer_review_count?: number
  rubric?: Array<{
    id: string
    name: string
    description: string
    max_points: number
  }>
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {}

// ============================================
// Learning Path Requests (Basic)
// ============================================

export interface CreateLearningPathRequestBasic {
  title: string
  description: string
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration_hours?: number
}

export interface UpdateLearningPathRequestBasic extends Partial<CreateLearningPathRequestBasic> {}

// ============================================
// Access Code Requests
// ============================================

export interface CreateAccessCodeRequest {
  usage_limit: number
  expires_at: string
  description?: string
}

export interface UpdateAccessCodeRequest {
  usage_limit?: number
  expires_at?: string
  description?: string
  status?: 'active' | 'inactive'
}

export interface RedeemAccessCodeRequest {
  code: string
}

// ============================================
// Badge Requests (Gamification)
// ============================================

export interface CreateBadgeRequest {
  name: string
  description: string
  icon_url?: string
  criteria_type: string
  criteria_value: number
  points?: number
}

export interface UpdateBadgeRequest extends Partial<CreateBadgeRequest> {}

// ============================================
// Super Admin Badge Requests
// ============================================

export interface CreateSuperAdminBadgeRequest {
  name: string
  slug: string
  description: string
  category: string
  tier: string
  rarity: string
  points_reward: number
  icon_url?: string
  is_secret?: boolean
  is_active?: boolean
  display_order?: number
  trigger?: {
    trigger_type: string
    trigger_conditions: Record<string, any>
    is_active?: boolean
  }
}

export interface UpdateSuperAdminBadgeRequest extends Partial<CreateSuperAdminBadgeRequest> {}

export interface ToggleGamificationRequest {
  enabled?: boolean
}

// ============================================
// Certificate Template Requests
// ============================================

export interface CreateCertificateTemplateRequest {
  name: string
  description?: string
  is_default?: boolean
  design: {
    layout: 'portrait' | 'landscape'
    background_color: string
    border_style: string
    font_family: string
    logo_position: string
    signature_count: number
  }
  content: {
    title: string
    subtitle: string
    body: string
    footer: string
    signatures: Array<{
      title: string
      name_placeholder: string
    }>
  }
  requirements?: {
    lessons_completion?: number
    minimum_score?: number
  }
  background_image?: File
  logo?: File
}

export interface UpdateCertificateTemplateRequest extends Partial<CreateCertificateTemplateRequest> {}

// ============================================
// Enrollment Requests
// ============================================

export interface UpdateEnrollmentProgressRequest {
  progress_percentage?: number
  completed_lesson_ids?: number[]
}

// ============================================
// Learning Path Courses Requests
// ============================================

export interface AddCourseToPathRequest {
  course_id: number
}

export interface ReorderCoursesRequest {
  ordered_ids: number[]
}

// ============================================
// Learning Path Requests (Extended)
// ============================================

import type { LearningPathStatus, UnlockMode } from '../entities/learning-path'

export interface CreateLearningPathRequest {
  title: string
  description: string
  estimated_duration_hours?: number
  difficulty_level?: string
  status?: LearningPathStatus
}

export interface UpdateLearningPathRequest extends Partial<CreateLearningPathRequest> {
  position?: number
  unlock_mode?: UnlockMode
  milestone_size?: number
  is_free?: boolean
  price?: string
  discount_percentage?: number
}

// ============================================
// User Profile Requests
// ============================================

import type { AddressType, SocialPlatform } from '../entities/user-profile'

export interface UserDetailRequest {
  birth_date?: string | null
  gender?: string | null
  phone?: string | null
  bio?: string | null
  occupation?: string | null
  website_url?: string | null
}

export interface UserAddressRequest {
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  address_type?: AddressType
  is_primary?: boolean
}

export interface SocialNetworkRequest {
  platform: SocialPlatform
  username?: string | null
  profile_url: string
  is_public?: boolean
  order_index?: number | null
}
