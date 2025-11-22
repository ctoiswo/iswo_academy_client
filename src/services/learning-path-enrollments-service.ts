import apiClient from '@/lib/api-client'

export interface LearningPathEnrollment {
  id: number
  user_id: number
  learning_path_id: number
  status: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
  user: {
    id: number
    name: string
    email: string
    avatar_url: string | null
  }
  completed_courses: number
  total_courses: number
  remaining_courses: number
  next_course: {
    id: number
    title: string
    slug: string
    difficulty_level: string
  } | null
}

export interface LearningPathEnrollmentsResponse {
  data: LearningPathEnrollment[]
  meta?: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

export interface EnrollmentFilters {
  status?: string
  min_progress?: number
  page?: number
  per_page?: number
}

class LearningPathEnrollmentsService {
  /**
   * Get enrollments for a learning path
   */
  async getEnrollments(
    academySlug: string,
    learningPathSlug: string,
    filters?: EnrollmentFilters
  ): Promise<LearningPathEnrollmentsResponse> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/enrollments`,
      { params: filters }
    )
    return response.data
  }

  /**
   * Get a single enrollment by ID
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

export const learningPathEnrollmentsService = new LearningPathEnrollmentsService()
export default learningPathEnrollmentsService
