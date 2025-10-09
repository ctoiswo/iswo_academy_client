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
  status?: 'draft' | 'published'
}

export interface UpdateLearningPathData extends Partial<CreateLearningPathData> {
  position?: number
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

/**
 * Learning Path Service
 * Handles all learning path-related API calls
 */
class LearningPathService {
  /**
   * Get learning paths for a specific academy with optional filters (admin endpoint)
   * @param academyId - Academy ID
   * @param filters - Optional filters
   * @returns Promise with paginated learning paths
   */
  async getLearningPaths(academyId: number, filters?: LearningPathFilters): Promise<LearningPathsResponse> {
    const params = {
      academy_id: academyId,
      ...filters
    }
    console.log('Fetching learning paths for academy:', academyId, 'with filters:', filters)
    const response = await apiClient.get('/admin/learning_paths', { params })
    console.log('Learning paths response:', response.data)
    return response.data
  }

  /**
   * Get all learning paths (public endpoint)
   * @param filters - Optional filters
   * @returns Promise with paginated learning paths
   */
  async getAllLearningPaths(filters?: LearningPathFilters): Promise<LearningPathsResponse> {
    console.log('Fetching all learning paths with filters:', filters)
    const response = await apiClient.get('/learning_paths', { params: filters })
    console.log('All learning paths response:', response.data)
    return response.data
  }

  /**
   * Get a single learning path by slug or ID
   * @param slugOrId - Learning path slug or ID
   * @returns Promise with learning path details
   */
  async getLearningPathBySlug(slugOrId: string | number): Promise<LearningPath> {
    console.log('LearningPathService.getLearningPathBySlug called with:', slugOrId)
    const response = await apiClient.get(`/learning_paths/${slugOrId}`)
    console.log('LearningPathService.getLearningPathBySlug response:', response.data)
    return response.data
  }

  /**
   * Create a new learning path (admin endpoint)
   * @param academyId - Academy ID
   * @param data - Learning path data
   * @returns Promise with created learning path
   */
  async createLearningPath(academyId: number, data: CreateLearningPathData): Promise<LearningPath> {
    console.log('Creating learning path for academy:', academyId, 'with data:', data)
    const response = await apiClient.post(`/admin/learning_paths`, {
      learning_path: {
        ...data,
        academy_id: academyId
      }
    })
    console.log('Created learning path response:', response.data)
    return response.data
  }

  /**
   * Update an existing learning path (admin endpoint)
   * @param academyId - Academy ID
   * @param learningPathId - Learning path ID
   * @param data - Updated learning path data
   * @returns Promise with updated learning path
   */
  async updateLearningPath(
    academyId: number,
    learningPathId: number,
    data: UpdateLearningPathData
  ): Promise<LearningPath> {
    console.log('Updating learning path:', learningPathId, 'for academy:', academyId, 'with data:', data)
    const response = await apiClient.put(`/admin/learning_paths/${learningPathId}`, {
      learning_path: {
        ...data,
        academy_id: academyId
      }
    })
    console.log('Updated learning path response:', response.data)
    return response.data
  }

  /**
   * Delete a learning path (admin endpoint)
   * @param academyId - Academy ID
   * @param learningPathId - Learning path ID
   * @returns Promise with success message
   */
  async deleteLearningPath(academyId: number, learningPathId: number): Promise<void> {
    console.log('Deleting learning path:', learningPathId, 'from academy:', academyId)
    const response = await apiClient.delete(`/admin/learning_paths/${learningPathId}`, {
      params: { academy_id: academyId }
    })
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
    console.log('Reordering learning paths for academy:', academyId, 'with order:', orderedIds)
    const response = await apiClient.patch(`/academies/${academyId}/learning_paths/reorder`, {
      ordered_ids: orderedIds
    })
    console.log('Reorder learning paths response:', response.data)
    return response.data
  }
}

// Export singleton instance
const learningPathService = new LearningPathService()
export default learningPathService

// Also export as named export
export { learningPathService }