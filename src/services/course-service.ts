import apiClient from '@/lib/api-client'

// TypeScript interfaces for Courses
export interface Course {
  id: number
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  is_free: boolean
  price: string
  difficulty_level: string
  duration_minutes: number
  is_published: boolean
  enrollment_count: number
  sections_count: number
  lessons_count: number
  status: 'draft' | 'published' | 'archived'
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
  progress?: {
    completion_percentage: number
    completed_lessons: number
    total_lessons: number
    is_completed: boolean
  }
}

export interface FeaturedCourse extends Course { }

export interface CategoryWithCourses {
  category: {
    id: number
    name: string
    description: string
    slug: string
  }
  courses: FeaturedCourse[]
}

export interface CreateCourseData {
  title: string
  description: string
  difficulty_level?: string
  duration_minutes?: number
  is_free?: boolean
  price?: string
  status?: 'draft' | 'published'
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  is_published?: boolean
}

export interface CourseFilters {
  status?: string
  difficulty_level?: string
  is_free?: boolean
  is_published?: boolean
  search?: string
  page?: number
  per_page?: number
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total_pages: number
  total_count: number
}

export interface CoursesResponse {
  data: Course[]
  meta: PaginationMeta
}

/**
 * Course Service
 * Handles all course-related API calls
 */
class CourseService {
  /**
   * Get courses for a specific academy with optional filters (admin endpoint)
   * @param academyId - Academy ID
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getCourses(academyId: number, filters?: CourseFilters): Promise<Course[]> {
    const params = {
      academy_id: academyId,
      ...filters
    }
    console.log('Fetching courses for academy:', academyId, 'with filters:', filters)
    const response = await apiClient.get('/admin/courses', { params })
    console.log('Courses response:', response.data)

    // Handle both array response and object with data property (same as learning paths)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

  /**
   * Get all courses (public endpoint)
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getAllCourses(filters?: CourseFilters): Promise<Course[]> {
    console.log('Fetching all courses with filters:', filters)
    const response = await apiClient.get('/courses', { params: filters })
    console.log('All courses response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }

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
   * Get a single course by slug or ID (admin endpoint)
   * @param slugOrId - Course slug or ID
   * @returns Promise with course details
   */
  async getCourseBySlug(slugOrId: string | number): Promise<Course> {
    console.log('CourseService.getCourseBySlug called with:', slugOrId)
    const response = await apiClient.get(`/admin/courses/${slugOrId}`)
    console.log('CourseService.getCourseBySlug response:', response.data)
    return response.data
  }

  /**
   * Create a new course (admin endpoint)
   * @param academyId - Academy ID
   * @param data - Course creation data
   * @returns Promise with created course
   */
  async createCourse(academyId: number, data: CreateCourseData): Promise<Course> {
    console.log('Creating course for academy:', academyId, 'with data:', data)
    const response = await apiClient.post('/admin/courses', {
      course: {
        ...data,
        academy_id: academyId
      }
    })
    console.log('Create course response:', response.data)
    return response.data
  }

  /**
   * Update an existing course (admin endpoint)
   * @param academyId - Academy ID
   * @param courseId - Course ID
   * @param data - Course update data
   * @returns Promise with updated course
   */
  async updateCourse(academyId: number, courseId: number, data: UpdateCourseData): Promise<Course> {
    console.log('Updating course:', courseId, 'for academy:', academyId, 'with data:', data)
    const response = await apiClient.put(`/admin/courses/${courseId}`, {
      course: {
        ...data,
        academy_id: academyId
      }
    })
    console.log('Update course response:', response.data)
    return response.data
  }

  /**
   * Delete a course (admin endpoint)
   * @param academyId - Academy ID
   * @param courseId - Course ID
   * @returns Promise with deletion confirmation
   */
  async deleteCourse(academyId: number, courseId: number): Promise<void> {
    console.log('Deleting course:', courseId, 'for academy:', academyId)
    const response = await apiClient.delete(`/admin/courses/${courseId}`, {
      params: { academy_id: academyId }
    })
    console.log('Delete course response:', response.data)
  }

  /**
   * Get courses by academy slug (public endpoint)
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with paginated courses
   */
  async getCoursesByAcademy(academySlug: string, filters?: CourseFilters): Promise<Course[]> {
    console.log('Fetching courses by academy slug:', academySlug, 'with filters:', filters)
    const response = await apiClient.get(`/academies/${academySlug}/courses`, { params: filters })
    console.log('Courses by academy response:', response.data)
    return Array.isArray(response.data) ? response.data : (response.data?.data || [])
  }
}

// Export singleton instance
const courseService = new CourseService()
export default courseService

// Also export as named export
export { courseService }