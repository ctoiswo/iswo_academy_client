import apiClient from '@/lib/api-client'

// TypeScript interfaces for Learning Paths
export interface LearningPath {
  id: number
  title: string
  slug: string
  description: string
  estimated_duration_hours: number
  difficulty_level: string
  status: 'draft' | 'published' | 'archived'
  position: number
  courses_count: number
  estimated_completion_score: number
  total_duration_minutes: number
  unlock_mode: 'all_unlocked' | 'sequential' | 'milestone_based'
  milestone_size?: number
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
    completed_courses: number
    total_courses: number
    is_completed: boolean
  }
  pricing?: {
    is_free: boolean
    price: string
    discount_percentage: number
    bundle_price: string
    savings: string
    calculated_price: string
    requires_payment: boolean
  }
  courses?: Course[]
}

export interface Course {
  id: number
  title: string
  slug: string
  description: string
  difficulty_level: string
  duration_minutes: number
  is_free: boolean
  price: string
  thumbnail_url: string | null
  is_published: boolean
  enrollment_count: number
  sections_count: number
  lessons_count: number
  creator: {
    id: number
    name: string
  }
  user_enrollment?: {
    id: number
    enrolled_at: string
    completed: boolean
    completed_at: string | null
    progress_percentage: number
  }
}

export interface CreateLearningPathData {
  title: string
  description: string
  estimated_duration_hours: number
  difficulty_level?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface UpdateLearningPathData extends Partial<CreateLearningPathData> {
  position?: number
  unlock_mode?: 'all_unlocked' | 'sequential' | 'milestone_based'
  milestone_size?: number
  is_free?: boolean
  price?: string
  discount_percentage?: number
}

export interface LearningPathFilters {
  academy_id?: number
  published?: boolean
  difficulty?: string
  page?: number
  per_page?: number
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total_pages: number
  total_count: number
}

export interface LearningPathsResponse {
  data: LearningPath[]
  meta: PaginationMeta
}

export interface CourseProgress {
  course_id: number
  course_title: string
  completion_percentage: number
}

export interface EnrollmentTrend {
  month: string
  enrollments: number
}

export interface EngagementLevels {
  very_active: number
  moderately_active: number
  low_activity: number
}

export interface HighestDropoutCourse {
  course_id: number
  course_title: string
  dropout_rate: number
}

export interface LearningPathAnalytics {
  total_enrollments: number
  active_students: number
  completed_students: number
  completion_rate: number
  avg_completion_time_days: number
  dropout_rate: number
  course_progress: CourseProgress[]
  enrollment_trend: EnrollmentTrend[]
  engagement_levels: EngagementLevels
  highest_dropout_course: HighestDropoutCourse | null
}

/**
 * Learning Path Service
 * Handles all learning path-related API calls
 */
class LearningPathService {
  /**
   * Get learning paths for a specific academy with optional filters (admin endpoint)
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with paginated learning paths
   */
  async getLearningPaths(academySlug: string, filters?: LearningPathFilters): Promise<LearningPathsResponse> {
    const params = {
      ...filters
    }
    const response = await apiClient.get(`/academies/${academySlug}/learning_paths`, { params })
    return response.data
  }

  /**
   * Get all learning paths (public endpoint)
   * @param filters - Optional filters
   * @returns Promise with paginated learning paths
   */
  async getAllLearningPaths(filters?: LearningPathFilters): Promise<LearningPathsResponse> {
    const response = await apiClient.get('/learning_paths', { params: filters })
    return response.data
  }

  /**
   * Get a single learning path by slug or ID
   * @param academySlug - Academy slug
   * @param slugOrId - Learning path slug or ID
   * @returns Promise with learning path details
   */
  async getLearningPathBySlug(academySlug: string, slugOrId: string | number): Promise<LearningPath> {
    const response = await apiClient.get(`/academies/${academySlug}/learning_paths/${slugOrId}`)
    return response.data
  }

  /**
   * Create a new learning path (admin endpoint)
   * @param academySlug - Academy slug
   * @param data - Learning path data
   * @returns Promise with created learning path
   */
  async createLearningPath(academySlug: string, data: CreateLearningPathData): Promise<LearningPath> {
    const response = await apiClient.post(`/academies/${academySlug}/learning_paths`, {
      learning_path: data
    })
    return response.data
  }

  /**
   * Update an existing learning path (admin endpoint)
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param data - Updated learning path data
   * @returns Promise with updated learning path
   */
  async updateLearningPath(
    academySlug: string,
    learningPathSlug: string,
    data: UpdateLearningPathData
  ): Promise<LearningPath> {
    const response = await apiClient.patch(`/academies/${academySlug}/learning_paths/${learningPathSlug}`, {
      learning_path: data
    })
    return response.data
  }

  /**
   * Delete a learning path (admin endpoint)
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @returns Promise with success message
   */
  async deleteLearningPath(academySlug: string, learningPathSlug: string): Promise<void> {
    console.log('Deleting learning path:', learningPathSlug, 'from academy:', academySlug)
    const response = await apiClient.delete(`/academies/${academySlug}/learning_paths/${learningPathSlug}`)
    console.log('Deleted learning path response:', response.data)
  }

  /**
   * Get learning paths for a specific academy (by slug)
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with learning paths
   */
  async getLearningPathsByAcademy(academySlug: string, filters?: LearningPathFilters): Promise<LearningPathsResponse> {
    const params = filters || {}
    console.log('Fetching learning paths for academy slug:', academySlug, 'with filters:', filters)
    const response = await apiClient.get(`/academies/${academySlug}/learning_paths`, { params })
    console.log('Academy learning paths response:', response.data)
    return response.data
  }

  /**
   * Reorder learning paths positions
   * @param academyId - Academy ID
   * @param orderedIds - Array of learning path IDs in new order
   * @returns Promise with success response
   */
  async reorderLearningPaths(academyId: number, orderedIds: number[]): Promise<void> {
    const response = await apiClient.post(`/admin/academies/${academyId}/learning_paths/reorder`, {
      ordered_ids: orderedIds
    })
    return response.data
  }

  /**
   * Get analytics for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @returns Promise with learning path analytics data
   */
  async getLearningPathAnalytics(academySlug: string, learningPathSlug: string): Promise<LearningPathAnalytics> {
    const response = await apiClient.get(`/academies/${academySlug}/learning_paths/${learningPathSlug}/analytics`)
    return response.data.data
  }
}

// Export singleton instance
const learningPathService = new LearningPathService()
export default learningPathService

// Also export as named export
export { learningPathService }