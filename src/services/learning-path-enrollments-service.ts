import type {
  LearningPathEnrollment,
  LearningPathEnrollmentsResponse,
  LearningPathEnrollmentFilters,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Learning Path Enrollments Service
 * Handles enrollment management for learning paths
 */
class LearningPathEnrollmentsService {
  /**
   * Get enrollments for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param filters - Optional filters for status, progress, pagination
   * @returns Promise with enrollments response
   */
  async getEnrollments(
    academySlug: string,
    learningPathSlug: string,
    filters?: LearningPathEnrollmentFilters
  ): Promise<LearningPathEnrollmentsResponse> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/enrollments`,
      { params: filters }
    )
    return response.data
  }

  /**
   * Get a single enrollment by ID
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param enrollmentId - Enrollment ID
   * @returns Promise with enrollment details
   */
  async getEnrollment(
    academySlug: string,
    learningPathSlug: string,
    enrollmentId: number
  ): Promise<LearningPathEnrollment> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/enrollments/${enrollmentId}`
    )
    return response.data
  }

  /**
   * Delete an enrollment
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param enrollmentId - Enrollment ID
   * @returns Promise that resolves when enrollment is deleted
   */
  async deleteEnrollment(
    academySlug: string,
    learningPathSlug: string,
    enrollmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/enrollments/${enrollmentId}`
    )
  }
}

// Export singleton instance
const learningPathEnrollmentsService = new LearningPathEnrollmentsService()
export default learningPathEnrollmentsService

// Also export as named export
export { learningPathEnrollmentsService }
