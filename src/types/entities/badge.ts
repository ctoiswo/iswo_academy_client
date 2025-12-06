/**
 * Badge and Gamification related types
 */

export interface Badge {
  id: number
  name: string
  description: string
  icon_url?: string
  points: number
  academy_id?: number
  criteria?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface BadgeProgress {
  id: number
  badge_id: number
  user_id: number
  progress_percentage: number
  earned: boolean
  earned_at?: string
  badge?: Badge
}

export interface UserBadge {
  id: number
  user_id: number
  badge_id: number
  earned_at: string
  badge: Badge
}
