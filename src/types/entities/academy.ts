/**
 * Academy related types
 * Matches backend AcademySerializer views
 *
 * Active Storage Attachments:
 * - Backend: has_one_attached :logo, has_one_attached :banner
 * - Upload: Send File objects with keys 'logo' and 'banner' in FormData
 * - Response: logo_url and banner_url are generated URLs from Active Storage
 */
import type { BaseFilters } from '../common'
import type { AcademyCategory } from './category'
import type { Course } from './course'
import type { Creator } from './user'

export type AcademyStatus = 'draft' | 'active' | 'archived'

// Base fields present in ALL views
export interface AcademyBase {
  id: number
  name: string
  slug: string
}

// Minimal view - Only essential fields for dropdowns/selects
// Backend: minimal_hash
export interface AcademyMinimal extends AcademyBase {
  monthly_price: string
}

// Search view - For search results display
// Backend: search_hash
export interface AcademySearch extends AcademyBase {
  description: string
  logo_url: string | null
  course_count: number
  student_count: number
  is_public: boolean
}

// Summary Light view - Key information without courses array
// Backend: summary_light_hash
export interface AcademySummaryLight extends AcademyBase {
  description: string
  logo_url: string | null
  banner_url: string | null
  monthly_price: string
  subscription_required: boolean
  creator: Creator | null
  academy_category: AcademyCategory | null
  academy_configuration: {
    enable_gamification: boolean
  }
  courses_count: number
  enrolled_users_count: number
  badges_count: number
}

// Summary view - Complete data WITH courses array
// Backend: summary_hash
export interface AcademySummary extends AcademySummaryLight {
  courses: Course[]
}

// Full view - All data including timestamps
// Backend: full_hash
export interface AcademyFull extends AcademyBase {
  description: string
  logo_url: string | null
  banner_url: string | null
  monthly_price: string
  subscription_required: boolean
  is_public: boolean
  status: AcademyStatus
  creator: Creator | null
  courses_count: number
  enrolled_users_count: number
  created_at: string
  updated_at: string
}

// Default export - Full view (backward compatibility)
export type Academy = AcademyFull

export interface AcademyMembership {
  id: number
  role: 'owner' | 'admin' | 'teacher' | 'student'
  joined_at: string
  academy: Academy
}

export interface AcademyFilters extends BaseFilters {
  category?: string
  sort_by?: 'popular' | 'rating' | 'students' | 'newest'
  is_public?: boolean
  subscription_required?: boolean
}

// Legacy type - use FeaturedAcademiesByCategory from academy-service instead
export interface FeaturedAcademyByCategory {
  category: AcademyCategory
  academies: Academy[]
}

// Form types for creating/updating academies
export interface AcademyFormData {
  name: string
  description: string
  slug?: string
  website_url?: string
  mission?: string
  vision?: string
  is_public: boolean
  subscription_required: boolean
  monthly_price: number
  academy_category_id?: number

  // File uploads (File objects, not URLs)
  logo?: File | null
  banner?: File | null
}

export interface AcademyUpdateData extends Partial<AcademyFormData> {
  id: number
}
