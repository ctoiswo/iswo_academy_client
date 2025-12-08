import type {
  GamificationOverview,
  BadgeTemplate,
  BadgeDetail,
  AcademyGamificationStatus,
  CreateSuperAdminBadgeRequest,
  UpdateSuperAdminBadgeRequest,
  SuperAdminBadgeFilters,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Super Admin Gamification Service
 * Manages gamification settings and badges across all academies
 */
class SuperAdminGamificationService {
  /**
   * Get global gamification overview
   * @returns Promise with global gamification statistics and recent activity
   */
  async getOverview(): Promise<GamificationOverview> {
    const response = await apiClient.get('/super_admin/gamification/overview')
    return response.data.data || response.data
  }

  /**
   * Toggle gamification for an academy
   * @param academySlug - Academy slug
   * @param enabled - Optional boolean to explicitly enable/disable
   * @returns Promise with updated gamification status
   */
  async toggleGamification(
    academySlug: string,
    enabled?: boolean
  ): Promise<AcademyGamificationStatus> {
    const response = await apiClient.patch(
      `/super_admin/gamification/academies/${academySlug}/toggle`,
      { enabled }
    )
    return response.data.data
  }

  /**
   * Get all badges for an academy
   * @param academySlug - Academy slug
   * @param filters - Optional filters for search, category, tier, rarity, status
   * @returns Promise with array of badge details
   */
  async getAcademyBadges(
    academySlug: string,
    filters?: SuperAdminBadgeFilters
  ): Promise<BadgeDetail[]> {
    const response = await apiClient.get(
      `/super_admin/gamification/academies/${academySlug}/badges`,
      { params: filters }
    )
    return response.data.data || response.data
  }

  /**
   * Create a new badge for an academy
   * @param academySlug - Academy slug
   * @param data - Badge creation data
   * @returns Promise with created badge details
   */
  async createBadge(
    academySlug: string,
    data: CreateSuperAdminBadgeRequest
  ): Promise<BadgeDetail> {
    const response = await apiClient.post(
      `/super_admin/gamification/academies/${academySlug}/badges`,
      { badge: data }
    )
    return response.data.data
  }

  /**
   * Update an existing badge
   * @param academySlug - Academy slug
   * @param badgeId - Badge ID
   * @param data - Badge update data
   * @returns Promise with updated badge details
   */
  async updateBadge(
    academySlug: string,
    badgeId: number,
    data: UpdateSuperAdminBadgeRequest
  ): Promise<BadgeDetail> {
    const response = await apiClient.patch(
      `/super_admin/gamification/academies/${academySlug}/badges/${badgeId}`,
      { badge: data }
    )
    return response.data.data
  }

  /**
   * Delete a badge
   * @param academySlug - Academy slug
   * @param badgeId - Badge ID
   * @returns Promise that resolves when badge is deleted
   */
  async deleteBadge(academySlug: string, badgeId: number): Promise<void> {
    await apiClient.delete(
      `/super_admin/gamification/academies/${academySlug}/badges/${badgeId}`
    )
  }

  /**
   * Get badge templates for quick creation
   * @returns Promise with array of badge templates
   */
  async getBadgeTemplates(): Promise<BadgeTemplate[]> {
    const response = await apiClient.get('/super_admin/gamification/templates')
    return response.data.data || response.data
  }
}

// Export singleton instance
const superAdminGamificationService = new SuperAdminGamificationService()
export default superAdminGamificationService

// Also export as named export
export { superAdminGamificationService }
