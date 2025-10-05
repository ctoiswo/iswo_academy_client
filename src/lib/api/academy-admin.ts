import { apiClient } from '../api-client'
import type { AcademyStats } from '@/features/dashboard/academy-admin/components/academy-stats-overview'
import type { Course } from '@/features/dashboard/academy-admin/components/course-management-panel'
import type { AcademyUser } from '@/features/dashboard/academy-admin/components/user-management-panel'

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

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

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
  static async getStats(academyId: number): Promise<AcademyStats> {
    const response = await apiClient.get<AcademyAdminApiResponse<AcademyStats>>(
      `/academies/${academyId}/admin/stats`
    )
    return response.data.data
  }

  /**
   * Get courses for academy admin management
   */
  static async getCourses(
    academyId: number, 
    filters: CoursesFilters = {}
  ): Promise<AcademyAdminApiResponse<Course[]>> {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.teacher_id) params.append('teacher_id', filters.teacher_id.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/admin/courses${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<AcademyAdminApiResponse<Course[]>>(url)
    return response.data
  }

  /**
   * Get users for academy admin management
   */
  static async getUsers(
    academyId: number, 
    filters: UsersFilters = {}
  ): Promise<AcademyAdminApiResponse<AcademyUser[]>> {
    const params = new URLSearchParams()
    
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/admin/users${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<AcademyAdminApiResponse<AcademyUser[]>>(url)
    return response.data
  }

  /**
   * Create a new course in the academy
   */
  static async createCourse(
    academyId: number, 
    courseData: CreateCourseRequest
  ): Promise<Course> {
    const response = await apiClient.post<AcademyAdminApiResponse<Course>>(
      `/academies/${academyId}/admin/courses`,
      { course: courseData }
    )
    return response.data.data
  }

  /**
   * Update an existing course
   */
  static async updateCourse(
    academyId: number, 
    courseId: number, 
    courseData: UpdateCourseRequest
  ): Promise<Course> {
    const response = await apiClient.patch<AcademyAdminApiResponse<Course>>(
      `/academies/${academyId}/admin/courses/${courseId}`,
      { course: courseData }
    )
    return response.data.data
  }

  /**
   * Delete a course
   */
  static async deleteCourse(academyId: number, courseId: number): Promise<void> {
    await apiClient.delete(`/academies/${academyId}/admin/courses/${courseId}`)
  }

  /**
   * Update user role within the academy
   */
  static async updateUserRole(
    academyId: number, 
    userId: number, 
    roleData: UpdateUserRoleRequest
  ): Promise<AcademyUser> {
    const response = await apiClient.post<AcademyAdminApiResponse<AcademyUser>>(
      `/academies/${academyId}/admin/users/${userId}/update_role`,
      roleData
    )
    return response.data.data
  }

  /**
   * Remove user from academy
   */
  static async removeUser(academyId: number, userId: number): Promise<void> {
    await apiClient.delete(`/academies/${academyId}/admin/users/${userId}`)
  }
}

/**
 * React Query hooks for Academy Admin API
 */
export const academyAdminQueries = {
  stats: (academyId: number) => ({
    queryKey: ['academy-admin', 'stats', academyId],
    queryFn: () => AcademyAdminApi.getStats(academyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),

  courses: (academyId: number, filters: CoursesFilters = {}) => ({
    queryKey: ['academy-admin', 'courses', academyId, filters],
    queryFn: () => AcademyAdminApi.getCourses(academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  users: (academyId: number, filters: UsersFilters = {}) => ({
    queryKey: ['academy-admin', 'users', academyId, filters],
    queryFn: () => AcademyAdminApi.getUsers(academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),
}

/**
 * React Query mutations for Academy Admin API
 */
export const academyAdminMutations = {
  createCourse: {
    mutationFn: ({ academyId, courseData }: { 
      academyId: number
      courseData: CreateCourseRequest 
    }) => AcademyAdminApi.createCourse(academyId, courseData),
  },

  updateCourse: {
    mutationFn: ({ academyId, courseId, courseData }: { 
      academyId: number
      courseId: number
      courseData: UpdateCourseRequest 
    }) => AcademyAdminApi.updateCourse(academyId, courseId, courseData),
  },

  deleteCourse: {
    mutationFn: ({ academyId, courseId }: { 
      academyId: number
      courseId: number 
    }) => AcademyAdminApi.deleteCourse(academyId, courseId),
  },

  updateUserRole: {
    mutationFn: ({ academyId, userId, roleData }: { 
      academyId: number
      userId: number
      roleData: UpdateUserRoleRequest 
    }) => AcademyAdminApi.updateUserRole(academyId, userId, roleData),
  },

  removeUser: {
    mutationFn: ({ academyId, userId }: { 
      academyId: number
      userId: number 
    }) => AcademyAdminApi.removeUser(academyId, userId),
  },
}