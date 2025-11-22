import apiClient from '@/lib/api-client'

// TypeScript interfaces for Super Admin Gamification
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
  triggers: Array<{
    id: number
    trigger_type: string
    trigger_conditions: Record<string, any>
    is_active: boolean
  }>
  created_at: string
  updated_at: string
}

export interface CreateBadgeData {
  name: string
  slug: string
  description: string
  category: string
  tier: string
  rarity: string
  points_reward: number
  icon_url?: string
  is_secret?: boolean
  is_active?: boolean
  display_order?: number
  trigger?: {
    trigger_type: string
    trigger_conditions: Record<string, any>
    is_active?: boolean
  }
}

export interface UpdateBadgeData extends Partial<CreateBadgeData> { }

export interface AcademyGamificationStatus {
  academy_id: number
  academy_name: string
  gamification_enabled: boolean
}

/**
 * Super Admin Gamification Service
 * Manages gamification settings and badges across all academies
 */
class SuperAdminGamificationService {
  /**
   * Get global gamification overview
   */
  async getOverview(): Promise<GamificationOverview> {
    console.log('Fetching gamification overview')
    const response = await apiClient.get('/super_admin/gamification/overview')
    console.log('Gamification overview response:', response.data)
    return response.data.data || response.data
  }

  /**
   * Toggle gamification for an academy
   */
  async toggleGamification(
    academySlug: string,
    enabled?: boolean
  ): Promise<AcademyGamificationStatus> {
    console.log('Toggling gamification for academy:', academySlug, enabled)
    const response = await apiClient.patch(
      `/super_admin/gamification/academies/${academySlug}/toggle`,
      { enabled }
    )
    console.log('Toggle gamification response:', response.data)
    return response.data.data
  }

  /**
   * Get all badges for an academy
   */
  async getAcademyBadges(
    academySlug: string,
    filters?: {
      category?: string
      tier?: string
      is_active?: boolean
    }
  ): Promise<BadgeDetail[]> {
    console.log('Fetching badges for academy:', academySlug, filters)
    const response = await apiClient.get(
      `/super_admin/gamification/academies/${academySlug}/badges`,
      { params: filters }
    )
    console.log('Academy badges response:', response.data)
    return response.data.data || response.data
  }

  /**
   * Create a new badge for an academy
   */
  async createBadge(
    academySlug: string,
    data: CreateBadgeData
  ): Promise<BadgeDetail> {
    console.log('Creating badge for academy:', academySlug, data)
    const response = await apiClient.post(
      `/super_admin/gamification/academies/${academySlug}/badges`,
      { badge: data }
    )
    console.log('Create badge response:', response.data)
    return response.data.data
  }

  /**
   * Update an existing badge
   */
  async updateBadge(badgeId: number, data: UpdateBadgeData): Promise<BadgeDetail> {
    console.log('Updating badge:', badgeId, data)
    const response = await apiClient.patch(
      `/super_admin/gamification/badges/${badgeId}`,
      { badge: data }
    )
    console.log('Update badge response:', response.data)
    return response.data.data
  }

  /**
   * Delete a badge
   */
  async deleteBadge(badgeId: number): Promise<void> {
    console.log('Deleting badge:', badgeId)
    const response = await apiClient.delete(
      `/super_admin/gamification/badges/${badgeId}`
    )
    console.log('Delete badge response:', response.data)
  }

  /**
   * Get badge templates for quick creation
   */
  async getBadgeTemplates(): Promise<BadgeTemplate[]> {
    console.log('Fetching badge templates')
    const response = await apiClient.get('/super_admin/gamification/templates')
    console.log('Badge templates response:', response.data)
    return response.data.data || response.data
  }
}

// Export singleton instance
const superAdminGamificationService = new SuperAdminGamificationService()
export default superAdminGamificationService

// Also export as named export
export { superAdminGamificationService }
