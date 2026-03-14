import apiClient from '@/lib/api-client'

export interface AdminBadgeTrigger {
  id: number
  trigger_type: string
  trigger_conditions: Record<string, unknown>
  is_active: boolean
}

export interface AdminBadge {
  id: number
  name: string
  slug: string
  description: string
  category: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  points_reward: number
  icon_url: string | null
  is_secret: boolean
  is_active: boolean
  display_order: number
  earned_count: number
  earn_rate: number
  triggers: AdminBadgeTrigger[]
  created_at: string
  updated_at: string
}

export interface BadgeFormData {
  name: string
  slug: string
  description: string
  category: string
  tier: string
  rarity: string
  points_reward: number
  icon_url?: string
  is_secret: boolean
  is_active: boolean
  display_order: number
  trigger?: {
    trigger_type: string
    is_active: boolean
    trigger_conditions: Record<string, unknown>
  }
}

export interface AdminBadgesParams {
  search?: string
  category?: string
  tier?: string
  status?: 'active' | 'inactive'
}

const academyBadgesService = {
  async getBadges(
    academySlug: string,
    params?: AdminBadgesParams
  ): Promise<AdminBadge[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/admin/badges`,
      { params }
    )
    return response.data.data
  },

  async createBadge(
    academySlug: string,
    data: BadgeFormData
  ): Promise<AdminBadge> {
    const response = await apiClient.post(
      `/academies/${academySlug}/admin/badges`,
      { badge: data }
    )
    return response.data.data
  },

  async updateBadge(
    academySlug: string,
    badgeId: number,
    data: Partial<BadgeFormData>
  ): Promise<AdminBadge> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/admin/badges/${badgeId}`,
      { badge: data }
    )
    return response.data.data
  },

  async deleteBadge(academySlug: string, badgeId: number): Promise<void> {
    await apiClient.delete(`/academies/${academySlug}/admin/badges/${badgeId}`)
  },
}

export default academyBadgesService
