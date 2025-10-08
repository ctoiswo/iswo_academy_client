import apiClient from '@/lib/api-client'

// TypeScript interfaces for Courses
export interface FeaturedCourse {
  id: number
  title: string
  thumbnail_url: string | null
  is_free: boolean
  description: string
  price: string
  difficulty_level: string
  duration_minutes: number
  is_published: boolean
  enrollment_count: number
  slug: string
  creator: {
    id: number
    name: string
  }
  academy: {
    id: number
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
}

export interface CategoryWithCourses {
  category: {
    id: number
    name: string
    description: string
    slug: string
  }
  courses: FeaturedCourse[]
}

/**
 * Course Service
 * Handles all course-related API calls
 */
class CourseService {
  /**
   * Get featured courses organized by categories
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of categories containing courses
   */
  async getFeaturedCourses(categoryId?: number): Promise<CategoryWithCourses[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    console.log(`Fetching featured courses for category: ${categoryId}`, params)
    const response = await apiClient.get('/courses/featured', { params })
    console.log(`Featured courses response for category ${categoryId}:`, response.data)
    return response.data
  }

  /**
   * Get a single course by slug
   * @param slug - Course slug
   * @returns Promise with course details
   */
  async getCourseBySlug(slug: string): Promise<FeaturedCourse> {
    console.log('CourseService.getCourseBySlug called with:', slug)
    const response = await apiClient.get(`/courses/${slug}`)
    console.log('CourseService.getCourseBySlug response:', response.data)
    return response.data
  }
}

// Export singleton instance
const courseService = new CourseService()
export default courseService

// Also export as named export
export { courseService }