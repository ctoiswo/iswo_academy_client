import type {
  Badge,
  UserBadge,
  GamificationProfile,
  LeaderboardEntry,
  LeaderboardType,
  LeaderboardPeriod,
  BadgeFilters,
} from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'

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
    const response = await apiClient.get('/badges', { params: filters })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get a single badge by slug or ID
   * @param slugOrId - Badge slug or ID
   * @returns Promise with badge details
   */
  async getBadgeBySlug(slugOrId: string | number): Promise<Badge> {
    const response = await apiClient.get(`/badges/${slugOrId}`)
    return response.data
  }

  /**
   * Get user's earned badges
   * @param filters - Optional filters
   * @returns Promise with user badges array
   */
  async getEarnedBadges(filters?: BadgeFilters): Promise<UserBadge[]> {
    const response = await apiClient.get('/badges/earned', { params: filters })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get user's available (unearned) badges
   * @param filters - Optional filters
   * @returns Promise with available badges array
   */
  async getAvailableBadges(filters?: BadgeFilters): Promise<Badge[]> {
    const response = await apiClient.get('/badges/available', {
      params: filters,
    })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get badge progress and statistics
   * @returns Promise with badge progress data
   */
  async getBadgeProgress(): Promise<any> {
    const response = await apiClient.get('/badges/progress')
    return response.data
  }

  /**
   * Get user's gamification profile
   * @param userId - User ID (optional, defaults to current user)
   * @param academySlug - Academy slug to scope the request (sends X-Academy-Slug header)
   * @returns Promise with gamification profile
   */
  async getGamificationProfile(userId?: number, academySlug?: string): Promise<GamificationProfile> {
    const endpoint = userId
      ? `/gamification_profiles/${userId}`
      : '/gamification_profiles/me'
    const headers = academySlug ? { 'X-Academy-Slug': academySlug } : undefined
    const response = await apiClient.get(endpoint, { headers })
    return response.data.data || response.data
  }

  /**
   * Get leaderboard
   * @param type - Leaderboard type (points, level, streak, achievements)
   * @param period - Time period (all_time, month, week)
   * @returns Promise with leaderboard entries
   */
  async getLeaderboard(
    type: LeaderboardType = 'points',
    period: LeaderboardPeriod = 'all_time'
  ): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get('/gamification_profiles/leaderboard', {
      params: { type, period },
    })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get gamification statistics
   * @returns Promise with gamification statistics
   */
  async getStatistics(): Promise<any> {
    const response = await apiClient.get('/gamification_profiles/statistics')
    return response.data
  }

  /**
   * Check for new badges (unviewed earned badges)
   * @returns Promise with unviewed badges
   */
  async checkNewBadges(): Promise<UserBadge[]> {
    try {
      const earnedBadges = await this.getEarnedBadges()
      const newBadges = earnedBadges.filter((ub) => !ub.viewed)
      return newBadges
    } catch (_error) {
      // console.error('Error checking new badges:', error)
      return []
    }
  }

  /**
   * Mark badges as viewed
   * @param badgeIds - Array of badge IDs to mark as viewed
   * @returns Promise with update confirmation
   */
  async markBadgesAsViewed(badgeIds: number[]): Promise<void> {
    toast.info(`Marked ${badgeIds.length} badges as viewed`)
    try {
      // This endpoint might need to be implemented in the backend
      // For now, we'll just log the action
    } catch (_error) {
      // console.error('Error marking badges as viewed:', error)
    }
  }
}

// Export singleton instance
const gamificationService = new GamificationService()
export default gamificationService

// Also export as named export
export { gamificationService }
