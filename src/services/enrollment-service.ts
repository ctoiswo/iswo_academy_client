import type {
  Enrollment,
  EnrollmentFilters,
  UpdateEnrollmentProgressRequest,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Enrollment Service
 * Handles all enrollment-related API calls
 */
class EnrollmentService {
  /**
   * Get user enrollments with optional filters
   * @param filters - Optional filters for status, pagination
   * @returns Promise with enrollments data
   */
  async getUserEnrollments(filters?: EnrollmentFilters) {
    const params = new URLSearchParams()

    if (filters?.status) params.append('status', filters.status)
    if (filters?.academy_slug)
      params.append('academy_slug', filters.academy_slug)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page)
      params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/enrollments?${params}`)
    const payload = response.data

    // Normalize API payload for legacy consumers that expect `enrollments`.
    if (payload && Array.isArray(payload.data)) {
      return {
        ...payload,
        enrollments: payload.data,
      }
    }

    return payload
  }

  /**
   * Get a single enrollment by ID
   * @param enrollmentId - Enrollment ID
   * @returns Promise with enrollment details
   */
  async getEnrollment(enrollmentId: number): Promise<Enrollment> {
    const response = await apiClient.get(`/enrollments/${enrollmentId}`)
    return response.data.data
  }

  /**
   * Update enrollment progress
   * @param enrollmentId - Enrollment ID
   * @param progressData - Progress update data (percentage, completed lessons)
   * @returns Promise with updated enrollment
   */
  async updateEnrollmentProgress(
    enrollmentId: number,
    progressData: UpdateEnrollmentProgressRequest
  ): Promise<Enrollment> {
    const response = await apiClient.patch(
      `/enrollments/${enrollmentId}/progress`,
      progressData
    )
    return response.data.data
  }

  /**
   * Get all enrollments for a specific course
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @returns Promise with array of enrollments
   */
  async getCourseEnrollments(
    academySlug: string,
    courseSlug: string
  ): Promise<Enrollment[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/enrollments`
    )
    return response.data.data
  }

  /**
   * Enroll in a free course
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @returns Promise with created enrollment
   */
  async createEnrollment(
    academySlug: string,
    courseSlug: string
  ): Promise<Enrollment> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/enrollments`
    )
    return response.data.data
  }

  /**
   * Delete an enrollment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param enrollmentId - Enrollment ID
   * @returns Promise that resolves when enrollment is deleted
   */
  async deleteEnrollment(
    academySlug: string,
    courseSlug: string,
    enrollmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/enrollments/${enrollmentId}`
    )
  }
}

// Export singleton instance
const enrollmentService = new EnrollmentService()
export default enrollmentService

// Also export as named export
export { enrollmentService }
