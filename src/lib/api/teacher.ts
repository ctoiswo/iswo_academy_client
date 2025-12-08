import type {
  TeacherStats,
  TeacherCourse,
  StudentProgress,
  LessonContent,
  Assignment,
  TeacherDashboardData,
} from '@/features/dashboard/teacher/types'
import { apiClient } from '../api-client'

export interface TeacherApiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      current_page: number
      total_pages: number
      total_count: number
      per_page: number
    }
    course_counts?: {
      published: number
      draft: number
      archived: number
    }
    student_counts?: {
      active: number
      completed: number
      dropped: number
    }
  }
  teacher?: {
    id: number
    name: string
    email: string
  }
  academy?: {
    id: number
    name: string
  }
}

export interface CreateLessonRequest {
  title: string
  description: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  content: string
  duration?: number
  order: number
  course_id: number
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

export interface CreateAssignmentRequest {
  title: string
  description: string
  due_date: string
  course_id: number
}

export interface UpdateAssignmentRequest
  extends Partial<CreateAssignmentRequest> {}

export interface CoursesFilters {
  status?: 'draft' | 'published' | 'archived'
  academy_id?: number
  search?: string
  page?: number
  per_page?: number
}

export interface StudentsFilters {
  course_id?: number
  status?: 'active' | 'completed' | 'dropped'
  search?: string
  page?: number
  per_page?: number
}

export interface LessonsFilters {
  course_id?: number
  type?: 'video' | 'text' | 'quiz' | 'assignment'
  is_published?: boolean
  page?: number
  per_page?: number
}

export interface AssignmentsFilters {
  course_id?: number
  status?: 'active' | 'closed' | 'draft'
  overdue?: boolean
  page?: number
  per_page?: number
}

/**
 * Teacher API client for dashboard functionality
 */
export class TeacherApi {
  /**
   * Get teacher dashboard data including stats, courses, and recent activity
   */
  static async getDashboardData(
    teacherId: number,
    academyId: number
  ): Promise<TeacherDashboardData> {
    const response = await apiClient.get<
      TeacherApiResponse<TeacherDashboardData>
    >(`/academies/${academyId}/teachers/${teacherId}/dashboard`)
    return response.data.data
  }

  /**
   * Get teacher statistics for dashboard
   */
  static async getStats(
    teacherId: number,
    academyId: number
  ): Promise<TeacherStats> {
    const response = await apiClient.get<TeacherApiResponse<TeacherStats>>(
      `/academies/${academyId}/teachers/${teacherId}/stats`
    )
    return response.data.data
  }

  /**
   * Get courses assigned to the teacher
   */
  static async getCourses(
    teacherId: number,
    academyId: number,
    filters: CoursesFilters = {}
  ): Promise<TeacherApiResponse<TeacherCourse[]>> {
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/teachers/${teacherId}/courses${queryString ? `?${queryString}` : ''}`

    const response =
      await apiClient.get<TeacherApiResponse<TeacherCourse[]>>(url)
    return response.data
  }

  /**
   * Get students enrolled in teacher's courses
   */
  static async getStudentProgress(
    teacherId: number,
    academyId: number,
    filters: StudentsFilters = {}
  ): Promise<TeacherApiResponse<StudentProgress[]>> {
    const params = new URLSearchParams()

    if (filters.course_id)
      params.append('course_id', filters.course_id.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/teachers/${teacherId}/students${queryString ? `?${queryString}` : ''}`

    const response =
      await apiClient.get<TeacherApiResponse<StudentProgress[]>>(url)
    return response.data
  }

  /**
   * Get lessons for teacher's courses
   */
  static async getLessons(
    teacherId: number,
    academyId: number,
    filters: LessonsFilters = {}
  ): Promise<TeacherApiResponse<LessonContent[]>> {
    const params = new URLSearchParams()

    if (filters.course_id)
      params.append('course_id', filters.course_id.toString())
    if (filters.type) params.append('type', filters.type)
    if (filters.is_published !== undefined)
      params.append('is_published', filters.is_published.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/teachers/${teacherId}/lessons${queryString ? `?${queryString}` : ''}`

    const response =
      await apiClient.get<TeacherApiResponse<LessonContent[]>>(url)
    return response.data
  }

  /**
   * Get assignments for teacher's courses
   */
  static async getAssignments(
    teacherId: number,
    academyId: number,
    filters: AssignmentsFilters = {}
  ): Promise<TeacherApiResponse<Assignment[]>> {
    const params = new URLSearchParams()

    if (filters.course_id)
      params.append('course_id', filters.course_id.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.overdue !== undefined)
      params.append('overdue', filters.overdue.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const queryString = params.toString()
    const url = `/academies/${academyId}/teachers/${teacherId}/assignments${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get<TeacherApiResponse<Assignment[]>>(url)
    return response.data
  }

  /**
   * Create a new lesson
   */
  static async createLesson(
    teacherId: number,
    academyId: number,
    lessonData: CreateLessonRequest
  ): Promise<LessonContent> {
    const response = await apiClient.post<TeacherApiResponse<LessonContent>>(
      `/academies/${academyId}/teachers/${teacherId}/lessons`,
      { lesson: lessonData }
    )
    return response.data.data
  }

  /**
   * Update an existing lesson
   */
  static async updateLesson(
    teacherId: number,
    academyId: number,
    lessonId: number,
    lessonData: UpdateLessonRequest
  ): Promise<LessonContent> {
    const response = await apiClient.patch<TeacherApiResponse<LessonContent>>(
      `/academies/${academyId}/teachers/${teacherId}/lessons/${lessonId}`,
      { lesson: lessonData }
    )
    return response.data.data
  }

  /**
   * Delete a lesson
   */
  static async deleteLesson(
    teacherId: number,
    academyId: number,
    lessonId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academyId}/teachers/${teacherId}/lessons/${lessonId}`
    )
  }

  /**
   * Publish/unpublish a lesson
   */
  static async toggleLessonPublication(
    teacherId: number,
    academyId: number,
    lessonId: number,
    isPublished: boolean
  ): Promise<LessonContent> {
    const response = await apiClient.patch<TeacherApiResponse<LessonContent>>(
      `/academies/${academyId}/teachers/${teacherId}/lessons/${lessonId}/toggle_publication`,
      { is_published: isPublished }
    )
    return response.data.data
  }

  /**
   * Create a new assignment
   */
  static async createAssignment(
    teacherId: number,
    academyId: number,
    assignmentData: CreateAssignmentRequest
  ): Promise<Assignment> {
    const response = await apiClient.post<TeacherApiResponse<Assignment>>(
      `/academies/${academyId}/teachers/${teacherId}/assignments`,
      { assignment: assignmentData }
    )
    return response.data.data
  }

  /**
   * Update an existing assignment
   */
  static async updateAssignment(
    teacherId: number,
    academyId: number,
    assignmentId: number,
    assignmentData: UpdateAssignmentRequest
  ): Promise<Assignment> {
    const response = await apiClient.patch<TeacherApiResponse<Assignment>>(
      `/academies/${academyId}/teachers/${teacherId}/assignments/${assignmentId}`,
      { assignment: assignmentData }
    )
    return response.data.data
  }

  /**
   * Delete an assignment
   */
  static async deleteAssignment(
    teacherId: number,
    academyId: number,
    assignmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academyId}/teachers/${teacherId}/assignments/${assignmentId}`
    )
  }

  /**
   * Get detailed student progress for a specific course
   */
  static async getStudentProgressDetail(
    teacherId: number,
    academyId: number,
    studentId: number,
    courseId: number
  ): Promise<StudentProgress> {
    const response = await apiClient.get<TeacherApiResponse<StudentProgress>>(
      `/academies/${academyId}/teachers/${teacherId}/courses/${courseId}/students/${studentId}/progress`
    )
    return response.data.data
  }
}

/**
 * React Query hooks for Teacher API
 */
export const teacherQueries = {
  dashboardData: (teacherId: number, academyId: number) => ({
    queryKey: ['teacher', 'dashboard', teacherId, academyId],
    queryFn: () => TeacherApi.getDashboardData(teacherId, academyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),

  stats: (teacherId: number, academyId: number) => ({
    queryKey: ['teacher', 'stats', teacherId, academyId],
    queryFn: () => TeacherApi.getStats(teacherId, academyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),

  courses: (
    teacherId: number,
    academyId: number,
    filters: CoursesFilters = {}
  ) => ({
    queryKey: ['teacher', 'courses', teacherId, academyId, filters],
    queryFn: () => TeacherApi.getCourses(teacherId, academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  studentProgress: (
    teacherId: number,
    academyId: number,
    filters: StudentsFilters = {}
  ) => ({
    queryKey: ['teacher', 'students', teacherId, academyId, filters],
    queryFn: () => TeacherApi.getStudentProgress(teacherId, academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  lessons: (
    teacherId: number,
    academyId: number,
    filters: LessonsFilters = {}
  ) => ({
    queryKey: ['teacher', 'lessons', teacherId, academyId, filters],
    queryFn: () => TeacherApi.getLessons(teacherId, academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  assignments: (
    teacherId: number,
    academyId: number,
    filters: AssignmentsFilters = {}
  ) => ({
    queryKey: ['teacher', 'assignments', teacherId, academyId, filters],
    queryFn: () => TeacherApi.getAssignments(teacherId, academyId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),

  studentProgressDetail: (
    teacherId: number,
    academyId: number,
    studentId: number,
    courseId: number
  ) => ({
    queryKey: [
      'teacher',
      'student-progress',
      teacherId,
      academyId,
      studentId,
      courseId,
    ],
    queryFn: () =>
      TeacherApi.getStudentProgressDetail(
        teacherId,
        academyId,
        studentId,
        courseId
      ),
    staleTime: 1 * 60 * 1000, // 1 minute
  }),
}

/**
 * React Query mutations for Teacher API
 */
export const teacherMutations = {
  createLesson: {
    mutationFn: ({
      teacherId,
      academyId,
      lessonData,
    }: {
      teacherId: number
      academyId: number
      lessonData: CreateLessonRequest
    }) => TeacherApi.createLesson(teacherId, academyId, lessonData),
  },

  updateLesson: {
    mutationFn: ({
      teacherId,
      academyId,
      lessonId,
      lessonData,
    }: {
      teacherId: number
      academyId: number
      lessonId: number
      lessonData: UpdateLessonRequest
    }) => TeacherApi.updateLesson(teacherId, academyId, lessonId, lessonData),
  },

  deleteLesson: {
    mutationFn: ({
      teacherId,
      academyId,
      lessonId,
    }: {
      teacherId: number
      academyId: number
      lessonId: number
    }) => TeacherApi.deleteLesson(teacherId, academyId, lessonId),
  },

  toggleLessonPublication: {
    mutationFn: ({
      teacherId,
      academyId,
      lessonId,
      isPublished,
    }: {
      teacherId: number
      academyId: number
      lessonId: number
      isPublished: boolean
    }) =>
      TeacherApi.toggleLessonPublication(
        teacherId,
        academyId,
        lessonId,
        isPublished
      ),
  },

  createAssignment: {
    mutationFn: ({
      teacherId,
      academyId,
      assignmentData,
    }: {
      teacherId: number
      academyId: number
      assignmentData: CreateAssignmentRequest
    }) => TeacherApi.createAssignment(teacherId, academyId, assignmentData),
  },

  updateAssignment: {
    mutationFn: ({
      teacherId,
      academyId,
      assignmentId,
      assignmentData,
    }: {
      teacherId: number
      academyId: number
      assignmentId: number
      assignmentData: UpdateAssignmentRequest
    }) =>
      TeacherApi.updateAssignment(
        teacherId,
        academyId,
        assignmentId,
        assignmentData
      ),
  },

  deleteAssignment: {
    mutationFn: ({
      teacherId,
      academyId,
      assignmentId,
    }: {
      teacherId: number
      academyId: number
      assignmentId: number
    }) => TeacherApi.deleteAssignment(teacherId, academyId, assignmentId),
  },
}
