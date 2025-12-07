/**
 * User related types
 */

import type { UserRole } from '../common'

export interface User {
  id: number
  email: string
  first_name?: string | null
  last_name?: string | null

  // Computed fields (from serializer)
  name?: string
  full_name?: string

  // Authentication fields (usually not sent to frontend)
  // password_digest, password_reset_token, confirmation_token omitted

  // Profile
  avatar_url?: string | null

  // Timestamps
  confirmed_at?: string | null
  confirmation_sent_at?: string | null
  password_reset_sent_at?: string | null
  last_login_at?: string | null
  onboarding_completed_at?: string | null
  tokens_valid_after?: string | null

  // Admin flag
  is_super_admin?: boolean

  // Push notifications
  push_tokens?: string[] // jsonb array

  // Role (from membership/context)
  role?: UserRole

  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  bio?: string
  phone?: string
  location?: string
  website?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface Creator {
  id: number
  email: string
  first_name?: string | null
  last_name?: string | null
  name?: string
  avatar_url?: string | null
}

// ============================================
// Auth-specific user types
// ============================================

// Authenticated user (from auth controller user_response)
export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  full_name: string
  initials: string
  avatar_url: string | null
  confirmed: boolean
  is_super_admin: boolean
  onboarding_completed_at: string | null
  created_at: string
  last_login_at: string | null
}

// Academy membership for authenticated user
export interface AcademyMembership {
  id: number
  name: string
  slug: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
  last_accessed_at?: string | null
}

// Academy data structure returned in auth responses
export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}
