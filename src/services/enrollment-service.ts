import { apiClient } from '@/lib/api-client'

export interface Course {
  id: number
  title: string
  slug: string
  description: string
  price: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  thumbnail_url?: string
  duration_minutes: number
  enrollment_count: number
  academy_id: number
  academy_name: string
  academy_slug?: string
  created_at?: string
  updated_at?: string
}

export interface Enrollment {
  id: number
  user: {
    id: number
    name: string
    email: string
  }
  course: Course
  status: 'active' | 'completed' | 'suspended'
  progress_percentage?: number
  enrolled_at: string
  completed_at?: string
  created_at: string
  updated_at: string
  payment?: {
    id: number
    status: string
    amount: number
  }
}

export interface EnrollmentFilters {
  status?: 'active' | 'completed' | 'suspended'
  page?: number
  per_page?: number
}

class EnrollmentService {
  async getUserEnrollments(filters?: EnrollmentFilters) {
    const params = new URLSearchParams()

    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/enrollments?${params}`)
    return response.data
  }

  async getEnrollment(enrollmentId: number) {
    const response = await apiClient.get(`/enrollments/${enrollmentId}`)
    return response.data.data as Enrollment
  }

  async updateEnrollmentProgress(enrollmentId: number, progressData: {
    progress_percentage?: number
    completed_lesson_ids?: number[]
  }) {
    const response = await apiClient.patch(`/enrollments/${enrollmentId}/progress`, progressData)
    return response.data.data as Enrollment
  }

  async getCourseEnrollments(academySlug: string, courseSlug: string) {
    const response = await apiClient.get(`/academies/${academySlug}/courses/${courseSlug}/enrollments`)
    return response.data.data as Enrollment[]
  }

  async deleteEnrollment(academySlug: string, courseSlug: string, enrollmentId: number) {
    const response = await apiClient.delete(`/academies/${academySlug}/courses/${courseSlug}/enrollments/${enrollmentId}`)
    return response.data
  }
}

export const enrollmentService = new EnrollmentService()