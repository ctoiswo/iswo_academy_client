import type {
  Course,
  CategoryWithCourses,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseFilters,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Course Service
 * Handles all course-related API calls
 */
class CourseService {
  /**
   * Get courses for a specific academy with optional filters
   * Uses the main courses endpoint with academy_slug filter
   * Authorization handled by Pundit in backend
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getCourses(
    academySlug: string | number,
    filters?: CourseFilters
  ): Promise<Course[]> {
    const params = {
      academy_slug: academySlug,
      ...filters,
    }
    const response = await apiClient.get('/courses', { params })

    // Handle both array response and object with data property
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get all courses (public endpoint)
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getAllCourses(filters?: CourseFilters): Promise<Course[]> {
    const response = await apiClient.get('/courses', { params: filters })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }

  /**
   * Get featured courses organized by categories
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of categories containing courses
   */
  async getFeaturedCourses(
    categoryId?: number
  ): Promise<CategoryWithCourses[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/courses/featured', { params })
    return response.data
  }

  /**
   * Get a single course by slug or ID
   * Authorization handled by Pundit in backend
   * Returns public preview if not authenticated, full details if admin/teacher
   * @param slugOrId - Course slug or ID
   * @returns Promise with course details
   */
  async getCourseBySlug(slugOrId: string | number): Promise<Course> {
    const response = await apiClient.get(`/courses/${slugOrId}`)
    return response.data
  }

  /**
   * Get a single course by slug (public endpoint)
   * Returns minimal view with all landing page data (objectives, promotional media, etc.)
   * @param slug - Course slug
   * @returns Promise with course details
   */
  async getPublicCourseBySlug(slug: string): Promise<Course> {
    const response = await apiClient.get(`/courses/${slug}`)
    return response.data
  }

  /**
   * Create a new course
   * Authorization handled by Pundit in backend
   * @param academySlug - Academy slug
   * @param data - Course creation data (can be FormData or object)
   * @returns Promise with created course
   */
  async createCourse(academySlug: string | number, data: CreateCourseRequest | FormData): Promise<Course> {
    // Si es FormData, enviarlo directamente (ya tiene la estructura course[field])
    // Si es objeto, envolverlo en { course: data }
    const payload = data instanceof FormData ? data : { course: data }
    
    const response = await apiClient.post(`/academies/${academySlug}/courses`, payload, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data'
      } : undefined
    })
    return response.data
  }

  /**
   * Update an existing course
   * Authorization handled by Pundit in backend
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug or ID
   * @param data - Course update data (can be FormData or object)
   * @returns Promise with updated course
   */
  async updateCourse(academySlug: string | number, courseSlug: string | number, data: UpdateCourseRequest | FormData): Promise<Course> {
    // Si es FormData, enviarlo directamente (ya tiene la estructura course[field])
    // Si es objeto, envolverlo en { course: data }
    const payload = data instanceof FormData ? data : { course: data }
    
    const response = await apiClient.put(`/academies/${academySlug}/courses/${courseSlug}`, payload, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data'
      } : undefined
    })
    return response.data
  }

  /**
   * Delete a course
   * Authorization handled by Pundit in backend
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug or ID
   * @returns Promise with deletion confirmation
   */
  async deleteCourse(
    academySlug: string | number,
    courseSlug: string | number
  ): Promise<void> {
    const response = await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}`
    )
    return response.data
  }

  /**
   * Get courses by academy slug (public endpoint)
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getCoursesByAcademy(
    academySlug: string,
    filters?: CourseFilters
  ): Promise<Course[]> {
    const response = await apiClient.get(`/academies/${academySlug}/courses`, {
      params: filters,
    })
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || []
  }
}

// Export singleton instance
const courseService = new CourseService()
export default courseService

// Also export as named export
export { courseService }
