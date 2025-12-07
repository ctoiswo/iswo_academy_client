/**
 * AccessCode Entity Types
 * Defines type hierarchy matching backend AccessCodeSerializer views
 */

export type AccessCodeStatus = 'active' | 'inactive' | 'expired' | 'exhausted'

// Base interface - minimal fields for basic view (:basic)
export interface AccessCodeBase {
  id: number
  code: string
  status: AccessCodeStatus
  remaining_uses: number
  days_until_expiry: number
}

// Public view - extends basic with public-facing info (:public)
export interface AccessCodePublic extends AccessCodeBase {
  course_title: string
  usage_percentage: number
  expired: boolean
}

// Admin view - complete info for management (:admin)
export interface AccessCodeAdmin {
  id: number
  code: string
  usage_limit: number
  usage_count: number
  remaining_uses: number
  usage_percentage: number
  expires_at: string
  days_until_expiry: number
  status: AccessCodeStatus
  description?: string
  expired: boolean
  created_at: string
  updated_at: string
  course: {
    id: number
    title: string
    slug: string
  }
  created_by: {
    id: number
    full_name: string
    email: string
  }
  statistics: {
    total_enrollments: number
    active_enrollments: number
  }
}

// Default type (most complete)
export type AccessCode = AccessCodeAdmin

// Filter params type
export interface AccessCodeFilters {
  status?: AccessCodeStatus
  page?: number
  per_page?: number
}
