/**
 * Gamification Entity Types
 * Based on Rails Gamification system
 */
import type { Badge } from './badge'

export interface GamificationProfile {
  id: number
  user_id: number
  points: {
    total: number
    available: number
    spent: number
  }
  level: {
    current: number
    experience_points: number
    progress_percentage: number
    xp_for_next_level: number
    xp_current_level: number
  }
  streaks: {
    current: number
    longest: number
    last_activity: string
  }
  rankings: {
    rank_in_academy: number
    percentile: number
  }
  counts: {
    badges: number
    achievements: number
  }
  recent_badges?: Array<{
    badge: Badge
    earned_at: string
  }>
  recent_transactions?: Array<{
    id: number
    amount: number
    transaction_type: string
    source: string
    balance_after: number
    created_at: string
  }>
}

export interface LeaderboardEntry {
  id: number
  user: {
    id: number
    username: string
    full_name: string
    avatar_url: string
  }
  total_points: number
  level: number
  rank: number
  badges_count: number
  achievements_count: number
  current_streak: number
}

export type LeaderboardType = 'points' | 'level' | 'streak' | 'achievements'
export type LeaderboardPeriod = 'all_time' | 'month' | 'week'
