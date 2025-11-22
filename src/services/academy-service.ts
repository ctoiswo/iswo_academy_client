import apiClient from '@/lib/api-client'
import type { FeaturedCourse } from './course-service'

// TypeScript interfaces for Academies
export interface FeaturedAcademy {
  id: number
  name: string
  description: string
  slug: string
  logo_url: string | null
  banner_url?: string | null
  monthly_price: string
  subscription_required: boolean
  creator: {
    id: number
    name: string
    email?: string
  } | null
  academy_category?: {
    id: number
    name: string
    slug: string
  } | null
  enrolled_users_count: number
  courses_count: number
  courses?: FeaturedCourse[]
  // Legacy fields for backwards compatibility
  student_count?: number
  course_count?: number
}

export interface AcademyCategory {
  id: number
  name: string
  description: string
  slug: string
}

export interface FeaturedAcademiesByCategory {
  category: AcademyCategory
  academies: FeaturedAcademy[]
}

/**
 * Academy Service
 * Handles all academy-related API calls
 */
class AcademyService {
  /**
   * Get featured academies grouped by category
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of featured academies grouped by category
   */
  async getFeaturedAcademies(categoryId?: number): Promise<FeaturedAcademiesByCategory[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    console.log('AcademyService.getFeaturedAcademies called with:', { categoryId, params })
    const response = await apiClient.get('/academies/featured', { params })
    console.log('AcademyService.getFeaturedAcademies response:', response.data)
    return response.data
  }

  /**
   * Get a single academy by slug
   * @param slug - Academy slug
   * @returns Promise with academy details
   */
  async getAcademyBySlug(slug: string): Promise<FeaturedAcademy> {
    console.log('AcademyService.getAcademyBySlug called with:', slug)
    const response = await apiClient.get(`/academies/${slug}`)
    console.log('AcademyService.getAcademyBySlug response:', response.data)
    return response.data
  }

  /**
   * Get current user's academies (requires authentication)
   * @returns Promise with user's academy memberships
   */
  async getUserAcademies(): Promise<{ count: number; academies: any[] }> {
    console.log('AcademyService.getUserAcademies called')
    const response = await apiClient.get('/users/me/academies')
    console.log('AcademyService.getUserAcademies response:', response.data)
    return response.data
  }

  /**
   * Get all academies (Super Admin only)
   * @param params - Optional query parameters (search, page, per_page, gamification)
   * @returns Promise with paginated academies data
   */
  async getAcademies(params?: { search?: string; page?: number; per_page?: number; gamification?: string }): Promise<{
    data: FeaturedAcademy[]
    meta: {
      current_page: number
      total_pages: number
      total_count: number
      per_page: number
    }
  }> {
    const response = await apiClient.get('/academies', { params })
    return {
      data: Array.isArray(response.data) ? response.data : response.data.data || [],
      meta: response.data.meta || {
        current_page: 1,
        total_pages: 1,
        total_count: Array.isArray(response.data) ? response.data.length : 0,
        per_page: params?.per_page || 15
      }
    }
  }
}

// Export singleton instance
const academyService = new AcademyService()
export default academyService

// Also export as named export
export { academyService }