/**
 * Academy related types
 * 
 * Active Storage Attachments:
 * - Backend: has_one_attached :logo, has_one_attached :banner
 * - Upload: Send File objects with keys 'logo' and 'banner' in FormData
 * - Response: logo_url and banner_url are generated URLs from Active Storage
 * 
 * Example creating academy with banner:
 * ```typescript
 * const formData = new FormData()
 * formData.append('academy[name]', 'My Academy')
 * formData.append('academy[description]', 'Description')
 * formData.append('academy[banner]', bannerFile) // File object
 * formData.append('academy[logo]', logoFile) // File object
 * 
 * await fetch('/api/v1/academies', {
 *   method: 'POST',
 *   body: formData
 * })
 * ```
 */

import type { BaseFilters } from '../common'
import type { AcademyCategory } from './category'
import type { Creator } from './user'

export type AcademyStatus = 0 | 1 | 2 // 0: draft, 1: active, 2: archived

export interface Academy {
  id: number
  name: string
  slug: string
  description?: string | null
  
  // Active Storage URLs (generated from attachments)
  logo_url?: string | null // Generated from has_one_attached :logo
  banner_url?: string | null // Generated from has_one_attached :banner
  
  // Visibility and access
  is_public: boolean
  subscription_required: boolean
  featured: boolean
  
  // Pricing
  monthly_price: number // decimal in DB
  
  // About
  mission?: string | null
  vision?: string | null
  website_url?: string | null
  
  // Status
  status?: AcademyStatus
  
  // Subscription info
  subscription_expires_at?: string | null
  
  // Relations
  academy_category_id?: number | null
  creator_id: number
  
  // Computed/Stats fields (from serializer)
  enrolled_users_count?: number
  courses_count?: number
  
  // Relations data
  creator?: Creator
  academy_category?: AcademyCategory
  courses?: Array<{
    id: number
    title: string
    slug: string
    duration_minutes: number
    [key: string]: any
  }>
  
  // Timestamps
  created_at: string
  updated_at: string
}

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
