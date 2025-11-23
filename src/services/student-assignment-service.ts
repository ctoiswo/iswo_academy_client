import apiClient from '@/lib/api-client'

export interface StudentAssignment {
  id: number
  title: string
  description: string | null
  instructions: string | null
  max_points: number
  passing_score: number
  due_at: string | null
  available_from: string | null
  late_submission_until: string | null
  late_penalty_percent: number
  require_file_upload: boolean
  require_text_submission: boolean
  max_file_uploads: number
  lesson: {
    id: number
    title: string
  } | null
  section: {
    id: number
    title: string
  } | null
  is_past_due: boolean
  days_until_due: number | null
  status: 'upcoming' | 'active' | 'past_due'
}

export interface CourseAssignments {
  course: {
    id: number
    title: string
    slug: string
    image_url: string | null
  }
  assignments: StudentAssignment[]
}

export interface StudentAssignmentsResponse {
  data: {
    student: {
      id: number
      name: string
      email: string
      avatar_url: string | null
    }
    academy: {
      id: number
      name: string
      description: string | null
    }
    assignments_by_course: CourseAssignments[]
    summary: {
      total_assignments: number
      courses_with_assignments: number
      past_due: number
      upcoming: number
    }
  }
}

export const studentAssignmentService = {
  /**
   * Get all assignments for a student across all enrolled courses
   */
  async getMyAssignments(
    academySlug: string,
    studentId: number,
    params?: {
      status?: 'pending' | 'past_due' | 'upcoming'
    }
  ): Promise<StudentAssignmentsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)

    const url = `/academies/${academySlug}/students/${studentId}/assignments${queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`

    const response = await apiClient.get<StudentAssignmentsResponse>(url)
    return response.data
  },
}
