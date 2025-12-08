import type {
  LearningPath,
  LearningPathsResponse,
  LearningPathAnalytics,
  CreateLearningPathRequest,
  UpdateLearningPathRequest,
  LearningPathFilters,
} from '@/types'
import apiClient from '@/lib/api-client'

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
  async getLearningPaths(
    academySlug: string,
    filters?: LearningPathFilters
  ): Promise<LearningPathsResponse> {
    const params = {
      ...filters,
    }
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths`,
      { params }
    )
    return response.data
  }

  /**
   * Get all learning paths (public endpoint)
   * @param filters - Optional filters
   * @returns Promise with paginated learning paths
   */
  async getAllLearningPaths(
    filters?: LearningPathFilters
  ): Promise<LearningPathsResponse> {
    const response = await apiClient.get('/learning_paths', { params: filters })
    return response.data
  }

  /**
   * Get a single learning path by slug or ID
   * @param academySlug - Academy slug
   * @param slugOrId - Learning path slug or ID
   * @returns Promise with learning path details
   */
  async getLearningPathBySlug(
    academySlug: string,
    slugOrId: string | number
  ): Promise<LearningPath> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${slugOrId}`
    )
    return response.data
  }

  /**
   * Create a new learning path (admin endpoint)
   * @param academySlug - Academy slug
   * @param data - Learning path data
   * @returns Promise with created learning path
   */
  async createLearningPath(
    academySlug: string,
    data: CreateLearningPathRequest
  ): Promise<LearningPath> {
    const response = await apiClient.post(
      `/academies/${academySlug}/learning_paths`,
      {
        learning_path: data,
      }
    )
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
    data: UpdateLearningPathRequest
  ): Promise<LearningPath> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}`,
      {
        learning_path: data,
      }
    )
    return response.data
  }

  /**
   * Delete a learning path (admin endpoint)
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @returns Promise with success message
   */
  async deleteLearningPath(
    academySlug: string,
    learningPathSlug: string
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}`
    )
  }

  /**
   * Get learning paths for a specific academy (by slug)
   * @param academySlug - Academy slug
   * @param filters - Optional filters
   * @returns Promise with learning paths
   */
  async getLearningPathsByAcademy(
    academySlug: string,
    filters?: LearningPathFilters
  ): Promise<LearningPathsResponse> {
    const params = filters || {}
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths`,
      { params }
    )
    return response.data
  }

  /**
   * Reorder learning paths positions
   * @param academyId - Academy ID
   * @param orderedIds - Array of learning path IDs in new order
   * @returns Promise with success response
   */
  async reorderLearningPaths(
    academyId: number,
    orderedIds: number[]
  ): Promise<void> {
    const response = await apiClient.post(
      `/admin/academies/${academyId}/learning_paths/reorder`,
      {
        ordered_ids: orderedIds,
      }
    )
    return response.data
  }

  /**
   * Get analytics for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @returns Promise with learning path analytics data
   */
  async getLearningPathAnalytics(
    academySlug: string,
    learningPathSlug: string
  ): Promise<LearningPathAnalytics> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/analytics`
    )
    return response.data.data
  }
}

// Export singleton instance
const learningPathService = new LearningPathService()
export default learningPathService

// Also export as named export
export { learningPathService }
