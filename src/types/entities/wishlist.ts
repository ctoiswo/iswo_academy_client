/**
 * Wishlist related types
 */

import type { Course } from './course'

export interface WishlistItem {
  id: number
  user_id: number
  course_id: number
  course?: Course
  added_at: string
}
