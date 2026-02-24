import type { PlatformStats } from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Stats Service
 * Handles public platform-level statistics used for
 * landing pages, hero sections, and marketing displays.
 */
class StatsService {
  /**
   * Get platform summary stats (public endpoint, no auth required)
   * @returns Promise with total_students, total_courses, total_academies
   */
  async getStats(): Promise<PlatformStats> {
    const response = await apiClient.get('/home_stats')
    return response.data
  }
}

export const statsService = new StatsService()
export default statsService
