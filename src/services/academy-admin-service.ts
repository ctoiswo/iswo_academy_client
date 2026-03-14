import apiClient from '@/lib/api-client'

export type AcademyUserRole = 'admin' | 'teacher' | 'student'

export interface AcademyUser {
  id: number
  name: string
  email: string
  role: AcademyUserRole
  joined_at: string
  last_accessed_at: string | null
  enrollments: number | null
  courses_teaching: number | null
}

export interface AcademyUsersResponse {
  data: AcademyUser[]
  meta: {
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_count: number
      next_page: number | null
      prev_page: number | null
    }
    role_counts: {
      admin: number
      teacher: number
      student: number
    }
  }
}

export interface AcademyUsersParams {
  role?: AcademyUserRole
  search?: string
  page?: number
  per_page?: number
}

class AcademyAdminService {
  async getUsers(
    academySlug: string,
    params?: AcademyUsersParams
  ): Promise<AcademyUsersResponse> {
    const response = await apiClient.get(
      `/academies/${academySlug}/admin/users`,
      {
        params,
      }
    )
    return response.data
  }

  async updateUserRole(
    academySlug: string,
    userId: number,
    role: AcademyUserRole
  ): Promise<AcademyUser> {
    const response = await apiClient.post(
      `/academies/${academySlug}/admin/users/${userId}/update_role`,
      { role }
    )
    return response.data.data
  }

  async removeUser(academySlug: string, userId: number): Promise<void> {
    await apiClient.delete(`/academies/${academySlug}/admin/users/${userId}`)
  }
}

const academyAdminService = new AcademyAdminService()
export default academyAdminService
export { academyAdminService }
