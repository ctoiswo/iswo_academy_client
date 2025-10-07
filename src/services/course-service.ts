import apiClient from '@/lib/api-client'

// TypeScript interfaces for Courses
export interface FeaturedCourse {
  id: number
  title: string
  description: string
  slug: string
  difficulty_level: string
  duration_hours: number
  is_published: boolean
  enrollment_count: number
  academy: {
    id: number
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
}

/**
 * Course Service
 * Handles all course-related API calls
 */
class CourseService {
  /**
   * Get featured courses
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of featured courses
   */
  async getFeaturedCourses(categoryId?: number): Promise<FeaturedCourse[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/courses/featured', { params })
    return response.data.data
  }
}

// Export singleton instance
const courseService = new CourseService()
export default courseService

// Also export as named export
export { courseService }