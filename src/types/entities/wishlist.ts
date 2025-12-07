/**
 * Wishlist related types
 */

export type WishlistableType = 'Course' | 'Academy'

export interface WishlistResource {
  id: number
  name: string
  slug: string
  description: string
  thumbnail_url?: string
  logo_url?: string
  duration_minutes?: number
  difficulty_level?: string
  academy_name?: string
  academy_slug?: string
  courses_count?: number
}

export interface WishlistItem {
  id: number
  wishlistable_type: WishlistableType
  wishlistable_id: number
  notes?: string
  created_at: string
  resource: WishlistResource
}

export interface WishlistMeta {
  total_count: number
  courses_count: number
  academies_count: number
}
