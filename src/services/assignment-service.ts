import type {
  AssignmentSummary,
  AssignmentFull,
  AssignmentStatistics,
  AssignmentSubmission,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from '@/types'
import apiClient from '@/lib/api-client'

export interface AssignmentFilters {
  section_id?: number
  status?: 'active' | 'past_due' | 'upcoming'
}

/**
 * Assignment Service
 * Handles all assignment-related API calls
 */
class AssignmentService {
  /**
   * Get all assignments for a course
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param params - Optional filters (section_id, status)
   * @returns Promise with assignments array (summary view - without rubric)
   */
  async getAssignments(
    academySlug: string,
    courseSlug: string,
    params?: AssignmentFilters
  ): Promise<AssignmentSummary[]> {
    const queryParams = new URLSearchParams()
    if (params?.section_id)
      queryParams.append('section_id', params.section_id.toString())
    if (params?.status) queryParams.append('status', params.status)

    const url = `/academies/${academySlug}/courses/${courseSlug}/assignments${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`

    const response = await apiClient.get<{ assignments: AssignmentSummary[] }>(
      url
    )
    return response.data?.assignments || []
  }

  /**
   * Get a single assignment with full details
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assignmentId - Assignment ID
   * @returns Promise with assignment details (full view - includes rubric)
   */
  async getAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<AssignmentFull> {
    const response = await apiClient.get<{ assignment: AssignmentFull }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`
    )
    return response.data.assignment
  }

  /**
   * Create a new assignment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param data - Assignment data
   * @returns Promise with created assignment (full view)
   */
  async createAssignment(
    academySlug: string,
    courseSlug: string,
    data: CreateAssignmentRequest
  ): Promise<AssignmentFull> {
    const response = await apiClient.post<{
      assignment: AssignmentFull
      message: string
    }>(`/academies/${academySlug}/courses/${courseSlug}/assignments`, {
      assignment: data,
    })
    return response.data.assignment
  }

  /**
   * Update an assignment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assignmentId - Assignment ID
   * @param data - Updated assignment data
   * @returns Promise with updated assignment (full view)
   */
  async updateAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number,
    data: UpdateAssignmentRequest
  ): Promise<AssignmentFull> {
    const response = await apiClient.patch<{
      assignment: AssignmentFull
      message: string
    }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`,
      { assignment: data }
    )
    return response.data.assignment
  }

  /**
   * Delete an assignment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assignmentId - Assignment ID
   * @returns Promise with success message
   */
  async deleteAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`
    )
    return response.data
  }

  /**
   * Get assignment statistics
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assignmentId - Assignment ID
   * @returns Promise with assignment statistics
   */
  async getStatistics(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<AssignmentStatistics> {
    const response = await apiClient.get<{ statistics: AssignmentStatistics }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}/statistics`
    )
    return response.data.statistics
  }

  /**
   * Get assignment submissions
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assignmentId - Assignment ID
   * @param status - Optional filter by status
   * @returns Promise with submissions array
   */
  async getSubmissions(
    academySlug: string,
    courseSlug: string,
    assignmentId: number,
    status?: string
  ): Promise<AssignmentSubmission[]> {
    const url = `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}/submissions${
      status ? `?status=${status}` : ''
    }`
    const response = await apiClient.get<{
      submissions: AssignmentSubmission[]
    }>(url)
    return response.data?.submissions || []
  }
}

// Export singleton instance
const assignmentService = new AssignmentService()
export default assignmentService

// Also export as named export
export { assignmentService }
