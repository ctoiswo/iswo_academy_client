import type {
  AssessmentType,
  AssessmentSummary,
  AssessmentFull,
  AssessmentStatistics,
  AssessmentAttempt,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  QuizAttemptSession,
  QuizAttemptResult,
  MyAttemptsResponse,
  SubmitAnswer,
} from '@/types'
import apiClient from '@/lib/api-client'

export interface AssessmentFilters {
  type?: AssessmentType
  section_id?: number
  status?: 'published' | 'draft'
}

/**
 * Assessment Service
 * Handles all assessment-related API calls with view mode support
 */
class AssessmentService {
  /**
   * Get all assessments for a course
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param params - Optional filters (type, section_id, status)
   * @returns Promise with assessments array (summary view - without questions)
   */
  async getAssessments(
    academySlug: string,
    courseSlug: string,
    params?: AssessmentFilters
  ): Promise<AssessmentSummary[]> {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.append('type', params.type)
    if (params?.section_id)
      queryParams.append('section_id', params.section_id.toString())
    if (params?.status) queryParams.append('status', params.status)

    const url = `/academies/${academySlug}/courses/${courseSlug}/assessments${queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`

    const response = await apiClient.get<{ data: AssessmentSummary[] }>(
      url
    )
    return response.data?.data || []
  }

  /**
   * Get a single assessment with full details
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @returns Promise with assessment details (full view - includes questions)
   */
  async getAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<AssessmentFull> {
    const response = await apiClient.get<{ assessment: AssessmentFull }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`
    )
    return response.data.assessment
  }

  /**
   * Create a new assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param data - Assessment data
   * @returns Promise with created assessment (full view)
   */
  async createAssessment(
    academySlug: string,
    courseSlug: string,
    data: CreateAssessmentRequest
  ): Promise<AssessmentFull> {
    const response = await apiClient.post<{
      assessment: AssessmentFull
      message: string
    }>(`/academies/${academySlug}/courses/${courseSlug}/assessments`, {
      assessment: data,
    })
    return response.data.assessment
  }

  /**
   * Update an assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param data - Updated assessment data
   * @returns Promise with updated assessment (full view)
   */
  async updateAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    data: UpdateAssessmentRequest
  ): Promise<AssessmentFull> {
    const response = await apiClient.patch<{
      assessment: AssessmentFull
      message: string
    }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`,
      { assessment: data }
    )
    return response.data.assessment
  }

  /**
   * Delete an assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @returns Promise with success message
   */
  async deleteAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`
    )
    return response.data
  }

  /**
   * Get assessment statistics
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @returns Promise with assessment statistics
   */
  async getStatistics(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<AssessmentStatistics> {
    const response = await apiClient.get<{ statistics: AssessmentStatistics }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/statistics`
    )
    return response.data.statistics
  }

  /**
   * Get assessment attempts
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param status - Optional filter by status ('completed' | 'in_progress')
   * @returns Promise with attempts array
   */
  async getAttempts(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    status?: 'completed' | 'in_progress'
  ): Promise<AssessmentAttempt[]> {
    const url = `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/attempts${status ? `?status=${status}` : ''
      }`
    const response = await apiClient.get<{ attempts: AssessmentAttempt[] }>(url)
    return response.data?.attempts || []
  }

  /**
   * Get the current user's own attempts for an assessment
   */
  async getMyAttempts(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<MyAttemptsResponse> {
    const response = await apiClient.get<MyAttemptsResponse>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/my_attempts`
    )
    return response.data
  }

  /**
   * Start a new quiz attempt (student)
   */
  async startAttempt(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<QuizAttemptSession> {
    const response = await apiClient.post<QuizAttemptSession>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/start`
    )
    return response.data
  }

  /**
   * Submit answers and complete an attempt (student)
   */
  async submitAttempt(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    attemptId: number,
    answers: SubmitAnswer[]
  ): Promise<QuizAttemptResult> {
    const response = await apiClient.post<QuizAttemptResult>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/submit`,
      { attempt_id: attemptId, answers }
    )
    return response.data
  }
}

// Export singleton instance
const assessmentService = new AssessmentService()
export default assessmentService

// Also export as named export
export { assessmentService }
