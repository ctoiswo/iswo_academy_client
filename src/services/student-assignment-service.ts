import type {
  StudentAssignmentsResponse,
  StudentAssignmentFilters,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Student Assignment Service
 * Handles all student-facing assignment API calls
 */
class StudentAssignmentService {
  /**
   * Get all assignments for a student across all enrolled courses
   * @param academySlug - Academy slug
   * @param studentId - Student ID
   * @param params - Optional filters (status)
   * @returns Promise with student assignments grouped by course
   */
  async getMyAssignments(
    academySlug: string,
    studentId: number,
    params?: StudentAssignmentFilters
  ): Promise<StudentAssignmentsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)

    const url = `/academies/${academySlug}/students/${studentId}/assignments${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`

    const response = await apiClient.get<StudentAssignmentsResponse>(url)
    return response.data
  }
}

// Export singleton instance
const studentAssignmentService = new StudentAssignmentService()
export default studentAssignmentService

// Also export as named export
export { studentAssignmentService }
