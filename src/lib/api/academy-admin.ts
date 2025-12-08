import { apiClient } from '../api-client'
import type { AcademyStats } from '@/features/dashboard/admin/components/academy-stats-overview'
import type { AcademyUser } from '@/features/dashboard/admin/components/user-management-panel'
import { type Course } from '../models/course'

export interface AcademyAdminApiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      current_page: number
      total_pages: number
      total_count: number
      per_page: number
    }
    role_counts?: {
      admin: number
      teacher: number
      student: number
    }
  }
  academy?: {
    id: number
    name: string
  }
}

export interface CreateCourseRequest {
  title: string
  description: string
  price?: number
  duration_minutes?: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  teacher_id?: number
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> { }

export interface UpdateUserRoleRequest {
  role: 'admin' | 'teacher' | 'student'
}

export interface CoursesFilters {
  status?: 'draft' | 'published' | 'archived'
  teacher_id?: number
  search?: string
  page?: number
  per_page?: number
}

export interface UsersFilters {
  role?: 'admin' | 'teacher' | 'student'
  status?: 'active' | 'inactive' | 'pending'
  search?: string
  page?: number
  per_page?: number
}

/**
 * Academy Admin API client for dashboard functionality
 */
export class AcademyAdminApi {
  /**
   * Get academy statistics for admin dashboard
   */
  static async getStats(academyIdentifier: number | string): Promise<AcademyStats> {
    const response = await apiClient.get<AcademyAdminApiResponse<AcademyStats>>(
      `/academies/${academyIdentifier}/admin/stats`
    )
    return response.data.data
  }

  /**
   * Get courses for academy admin management
   */
  static async getCourses(
    academyIdentifier: number | string,
    filters: CoursesFilters = {}
  ): Promise<AcademyAdminApiResponse<Course[]>> {
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.teacher_id) params.append('teacher_id', filters.teacher_id.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyIdentifier}/admin/courses${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get<AcademyAdminApiResponse<Course[]>>(url)
    return response.data
  }

  /**
   * Get users for academy admin management
   */
  static async getUsers(
    academyIdentifier: number | string,
    filters: UsersFilters = {}
  ): Promise<AcademyAdminApiResponse<AcademyUser[]>> {
    const params = new URLSearchParams()

    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyIdentifier}/admin/users${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get<AcademyAdminApiResponse<AcademyUser[]>>(url)
    return response.data
  }

  /**
   * Create a new course in the academy
   */
  static async createCourse(
    academyIdentifier: number | string,
    courseData: CreateCourseRequest
  ): Promise<Course> {
    const response = await apiClient.post<AcademyAdminApiResponse<Course>>(
      `/academies/${academyIdentifier}/admin/courses`,
      { course: courseData }
    )
    return response.data.data
  }

  /**
   * Update an existing course
   */
  static async updateCourse(
    academyIdentifier: number | string,
    courseId: number,
    courseData: UpdateCourseRequest
  ): Promise<Course> {
    const response = await apiClient.patch<AcademyAdminApiResponse<Course>>(
      `/academies/${academyIdentifier}/admin/courses/${courseId}`,
      { course: courseData }
    )
    return response.data.data
  }

  /**
   * Delete a course
   */
  static async deleteCourse(academyIdentifier: number | string, courseId: number): Promise<void> {
    await apiClient.delete(`/academies/${academyIdentifier}/admin/courses/${courseId}`)
  }

  /**
   * Update user role within the academy
   */
  static async updateUserRole(
    academyIdentifier: number | string,
    userId: number,
    roleData: UpdateUserRoleRequest
  ): Promise<AcademyUser> {
    const response = await apiClient.post<AcademyAdminApiResponse<AcademyUser>>(
      `/academies/${academyIdentifier}/admin/users/${userId}/update_role`,
      roleData
    )
    return response.data.data
  }

  /**
   * Remove user from academy
   */
  static async removeUser(academyIdentifier: number | string, userId: number): Promise<void> {
    await apiClient.delete(`/academies/${academyIdentifier}/admin/users/${userId}`)
  }
}

/**
 * React Query hooks for Academy Admin API
 */
export const academyAdminQueries = {
  stats: (academyIdentifier: number | string) => ({
    queryKey: ['academy-admin', 'stats', academyIdentifier],
    queryFn: () => AcademyAdminApi.getStats(academyIdentifier),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),

  courses: (academyIdentifier: number | string, filters: CoursesFilters = {}) => ({
    queryKey: ['academy-admin', 'courses', academyIdentifier, filters],
    queryFn: () => AcademyAdminApi.getCourses(academyIdentifier, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  users: (academyIdentifier: number | string, filters: UsersFilters = {}) => ({
    queryKey: ['academy-admin', 'users', academyIdentifier, filters],
    queryFn: () => AcademyAdminApi.getUsers(academyIdentifier, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),
}

/**
 * React Query mutations for Academy Admin API
 */
export const academyAdminMutations = {
  createCourse: {
    mutationFn: ({ academyIdentifier, courseData }: {
      academyIdentifier: number | string
      courseData: CreateCourseRequest
    }) => AcademyAdminApi.createCourse(academyIdentifier, courseData),
  },

  updateCourse: {
    mutationFn: ({ academyIdentifier, courseId, courseData }: {
      academyIdentifier: number | string
      courseId: number
      courseData: UpdateCourseRequest
    }) => AcademyAdminApi.updateCourse(academyIdentifier, courseId, courseData),
  },

  deleteCourse: {
    mutationFn: ({ academyIdentifier, courseId }: {
      academyIdentifier: number | string
      courseId: number
    }) => AcademyAdminApi.deleteCourse(academyIdentifier, courseId),
  },

  updateUserRole: {
    mutationFn: ({ academyIdentifier, userId, roleData }: {
      academyIdentifier: number | string
      userId: number
      roleData: UpdateUserRoleRequest
    }) => AcademyAdminApi.updateUserRole(academyIdentifier, userId, roleData),
  },

  removeUser: {
    mutationFn: ({ academyIdentifier, userId }: {
      academyIdentifier: number | string
      userId: number
    }) => AcademyAdminApi.removeUser(academyIdentifier, userId),
  },
}