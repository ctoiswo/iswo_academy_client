import apiClient from '@/lib/api-client'

// TypeScript interfaces for Gamification
export interface Badge {
  id: number
  name: string
  slug: string
  description: string
  icon_url: string
  category: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
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

export interface BadgeFilters {
  category?: string
  tier?: string
  page?: number
  per_page?: number
}

/**
 * Gamification Service
 * Handles all gamification-related API calls (badges, points, achievements)
 */
class GamificationService {
  /**
   * Get all badges for an academy
   * @param filters - Optional filters
   * @returns Promise with badges array
   */
  async getBadges(filters?: BadgeFilters): Promise<Badge[]> {
    console.log('Fetching badges with filters:', filters)
    const response = await apiClient.get('/badges', { params: filters })
    console.log('Badges response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

  /**
   * Get a single badge by slug or ID
   * @param slugOrId - Badge slug or ID
   * @returns Promise with badge details
   */
  async getBadgeBySlug(slugOrId: string | number): Promise<Badge> {
    console.log('Fetching badge by slug:', slugOrId)
    const response = await apiClient.get(`/badges/${slugOrId}`)
    console.log('Badge response:', response.data)
    return response.data
  }

  /**
   * Get user's earned badges
   * @param filters - Optional filters
   * @returns Promise with user badges array
   */
  async getEarnedBadges(filters?: BadgeFilters): Promise<UserBadge[]> {
    console.log('Fetching earned badges with filters:', filters)
    const response = await apiClient.get('/badges/earned', { params: filters })
    console.log('Earned badges response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

  /**
   * Get user's available (unearned) badges
   * @param filters - Optional filters
   * @returns Promise with available badges array
   */
  async getAvailableBadges(filters?: BadgeFilters): Promise<Badge[]> {
    console.log('Fetching available badges with filters:', filters)
    const response = await apiClient.get('/badges/available', { params: filters })
    console.log('Available badges response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

  /**
   * Get badge progress and statistics
   * @returns Promise with badge progress data
   */
  async getBadgeProgress(): Promise<any> {
    console.log('Fetching badge progress')
    const response = await apiClient.get('/badges/progress')
    console.log('Badge progress response:', response.data)
    return response.data
  }

  /**
   * Get user's gamification profile
   * @param userId - User ID (optional, defaults to current user)
   * @returns Promise with gamification profile
   */
  async getGamificationProfile(userId?: number): Promise<GamificationProfile> {
    const endpoint = userId
      ? `/gamification_profiles/${userId}`
      : '/gamification_profiles/me'
    console.log('Fetching gamification profile for user:', userId || 'current')
    const response = await apiClient.get(endpoint)
    console.log('Gamification profile response:', response.data)
    return response.data
  }

  /**
   * Get leaderboard
   * @param type - Leaderboard type (points, level, streak, achievements)
   * @param period - Time period (all_time, month, week)
   * @returns Promise with leaderboard entries
   */
  async getLeaderboard(
    type: 'points' | 'level' | 'streak' | 'achievements' = 'points',
    period: 'all_time' | 'month' | 'week' = 'all_time'
  ): Promise<LeaderboardEntry[]> {
    console.log('Fetching leaderboard:', type, period)
    const response = await apiClient.get('/gamification_profiles/leaderboard', {
      params: { type, period }
    })
    console.log('Leaderboard response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

  /**
   * Get gamification statistics
   * @returns Promise with gamification statistics
   */
  async getStatistics(): Promise<any> {
    console.log('Fetching gamification statistics')
    const response = await apiClient.get('/gamification_profiles/statistics')
    console.log('Gamification statistics response:', response.data)
    return response.data
  }

  /**
   * Check for new badges (unviewed earned badges)
   * @returns Promise with unviewed badges
   */
  async checkNewBadges(): Promise<UserBadge[]> {
    console.log('Checking for new badges')
    try {
      const earnedBadges = await this.getEarnedBadges()
      const newBadges = earnedBadges.filter(ub => !ub.viewed)
      console.log('New unviewed badges:', newBadges)
      return newBadges
    } catch (error) {
      console.error('Error checking new badges:', error)
      return []
    }
  }

  /**
   * Mark badges as viewed
   * @param badgeIds - Array of badge IDs to mark as viewed
   * @returns Promise with update confirmation
   */
  async markBadgesAsViewed(badgeIds: number[]): Promise<void> {
    console.log('Marking badges as viewed:', badgeIds)
    try {
      // This endpoint might need to be implemented in the backend
      // For now, we'll just log the action
      console.log('Badges marked as viewed (implement backend endpoint if needed)')
    } catch (error) {
      console.error('Error marking badges as viewed:', error)
    }
  }
}

// Export singleton instance
const gamificationService = new GamificationService()
export default gamificationService

// Also export as named export
export { gamificationService }
