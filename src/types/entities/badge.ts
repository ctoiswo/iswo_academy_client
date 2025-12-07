/**
 * Badge and Gamification related types
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface Badge {
  id: number
  name: string
  slug: string
  description: string
  icon_url: string
  category: string
  tier: BadgeTier
  rarity: string
  points_reward: number
  is_secret: boolean
  earned?: boolean
  earned_count?: number
  earn_rate?: number
}

export interface UserBadge {
  id: number
  badge: Badge
  earned_at: string
  viewed: boolean
  trigger_context?: Record<string, any>
  triggered_by?: {
    type: string
    id: number
    name: string
  }
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
