/**
 * Super Admin Gamification types
 * Used for managing gamification settings and badges across all academies
 */

export interface GamificationOverview {
  total_badges: number
  total_user_badges: number
  academies_with_gamification: number
  total_points_awarded: number
  top_academies: Array<{
    id: number
    name: string
    badge_count: number
  }>
  recent_badges: Array<{
    user_name: string
    badge_name: string
    academy_name: string
    earned_at: string
  }>
}

export interface BadgeTemplate {
  name: string
  slug: string
  description: string
  category: string
  tier: string
  rarity: string
  points_reward: number
  trigger: {
    trigger_type: string
    trigger_conditions: Record<string, any>
  }
}

export interface BadgeTrigger {
  id: number
  trigger_type: string
  trigger_conditions: Record<string, any>
  is_active: boolean
}

export interface BadgeDetail {
  id: number
  name: string
  slug: string
  description: string
  category: string
  tier: string
  rarity: string
  points_reward: number
  icon_url: string | null
  is_secret: boolean
  is_active: boolean
  display_order: number
  earned_count: number
  earn_rate: number
  triggers: BadgeTrigger[]
  created_at: string
  updated_at: string
}

export interface AcademyGamificationStatus {
  academy_id: number
  academy_name: string
  gamification_enabled: boolean
}
