import apiClient from '@/lib/api-client'

// TypeScript interfaces for Academies
export interface FeaturedAcademy {
  id: number
  name: string
  description: string
  slug: string
  logo_url: string | null
  is_public: boolean
  monthly_price: string
  subscription_required: boolean
  status: string
  creator: {
    id: number
    name: string
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
    console.log('AcademyService.getFeaturedAcademies called with:', { categoryId, params })
    const response = await apiClient.get('/academies/featured', { params })
    console.log('AcademyService.getFeaturedAcademies response:', response.data)
    return response.data
  }
}

// Export singleton instance
const academyService = new AcademyService()
export default academyService

// Also export as named export
export { academyService }