import apiClient from '@/lib/api-client'
import type { ViewMode } from '@/lib/api-view-modes'
import { withView } from '@/lib/api-view-modes'

// TypeScript interfaces for Academies
export interface FeaturedAcademy {
  id: number
  name: string
  description: string
  slug: string
  logo_url: string | null
  is_public: boolean
  monthly_price: string
  yearly_price: string
  creator: {
    id: number
    name: string
    email: string
  } | null
  student_count: number
  course_count: number
  created_at: string
  updated_at: string
}

/**
 * Academy Service
 * Handles all academy-related API calls
 */
class AcademyService {
  /**
   * Get featured academies
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of featured academies
   */
  async getFeaturedAcademies(categoryId?: number): Promise<FeaturedAcademy[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/academies/featured', { params })
    return response.data.data
  }
}

// Export singleton instance
const academyService = new AcademyService()
export default academyService

// Also export as named export
export { academyService }