/**
 * API Response types
 */

import type { PaginationMeta } from '../common'
import type { AuthUser, AcademyData } from '../entities/user'

// Generic paginated response
export interface PaginatedApiResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Single item response
export interface SingleApiResponse<T> {
  data: T
  message?: string
}

// Success response
export interface SuccessResponse {
  success: boolean
  message: string
  data?: unknown
}

// Error response
export interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// ============================================
// Auth Specific Responses
// ============================================

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser
  message: string
  academies: AcademyData
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export interface MessageResponse {
  message: string
}

// ============================================
// Access Code Specific Responses
// ============================================

export interface AccessCodeRedemptionResponse {
  message: string
  enrollment: {
    id: number
    status: string
    enrolled_at: string
    progress_percentage: number
  }
  course: {
    id: number
    title: string
    slug: string
    description: string
    thumbnail_url?: string
    difficulty_level: string
    total_lessons: number
    academy: {
      name: string
      slug: string
    }
  }
  access_code: {
    remaining_uses: number
    days_until_expiry: number
  }
}

export interface AccessCodeValidationResponse {
  valid: boolean
  already_enrolled: boolean
  message: string
  course?: {
    id: number
    title: string
    slug: string
    description: string
    thumbnail_url?: string
    difficulty_level: string
    total_lessons: number
    academy: {
      name: string
      slug: string
    }
  }
  access_code: {
    remaining_uses: number
    days_until_expiry: number
    usage_percentage: number
  }
}

// ============================================
// Course Specific Responses
// ============================================

export interface CoursesResponse<T = unknown> {
  data: T[]
  meta: PaginationMeta
}

// ============================================
// Learning Path Enrollment Specific Responses
// ============================================

import type { LearningPathEnrollment } from '../entities/learning-path-enrollment'
import type { LearningPath } from '../entities/learning-path'

export interface LearningPathEnrollmentsResponse {
  data: LearningPathEnrollment[]
  meta?: PaginationMeta
}

// ============================================
// Learning Path Specific Responses
// ============================================

export interface LearningPathsResponse {
  data: LearningPath[]
  meta: PaginationMeta
}

// ============================================
// Lesson Specific Responses
// ============================================

export interface VideoUrlResponse {
  video_url: string
  provider: string
  expires_at: string
}

// ============================================
// User Profile Specific Responses
// ============================================

import type { UserDetail, UserAddress, SocialNetwork } from '../entities/user-profile'

export interface UserDetailResponse {
  user_detail: UserDetail
}

export interface UserAddressResponse {
  user_address: UserAddress
}

export interface UserAddressesResponse {
  user_addresses: UserAddress[]
}

export interface SocialNetworkResponse {
  social_network: SocialNetwork
}

export interface SocialNetworksResponse {
  social_networks: SocialNetwork[]
}

// ============================================
// Student Assignment Responses
// ============================================

import type { CourseAssignments, StudentAssignmentsSummary } from '../entities/student-assignment'

export interface StudentAssignmentsResponse {
  data: {
    student: {
      id: number
      name: string
      email: string
      avatar_url: string | null
    }
    academy: {
      id: number
      name: string
      description: string | null
    }
    assignments_by_course: CourseAssignments[]
    summary: StudentAssignmentsSummary
  }
}

// ============================================
// Super Admin Gamification Responses
// ============================================

import type {
  GamificationOverview,
  BadgeTemplate,
  BadgeDetail,
  AcademyGamificationStatus
} from '../entities/super-admin-gamification'

export interface GamificationOverviewResponse {
  data: GamificationOverview
}

export interface BadgeTemplatesResponse {
  data: BadgeTemplate[]
}

export interface BadgeDetailsResponse {
  data: BadgeDetail[]
}

export interface BadgeDetailResponse {
  data: BadgeDetail
}

export interface AcademyGamificationStatusResponse {
  data: AcademyGamificationStatus
}

// ============================================
// Wishlist Responses
// ============================================

import type { WishlistItem, WishlistMeta } from '../entities/wishlist'

export interface WishlistResponse {
  data: WishlistItem[]
  meta: WishlistMeta
}

export interface ToggleWishlistResponse {
  in_wishlist: boolean
  action: 'added' | 'removed'
  message: string
  data?: WishlistItem
}

export interface AddToWishlistResponse {
  data: WishlistItem
  message: string
}

export interface RemoveFromWishlistResponse {
  message: string
}
