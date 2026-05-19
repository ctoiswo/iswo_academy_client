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
  static async getDashboardData(
    teacherId: number,
    academySlug: string
  ): Promise<TeacherDashboardData> {
    const response = await apiClient.get<
      TeacherApiResponse<TeacherDashboardData>
    >(`/academies/${academySlug}/teachers/${teacherId}/dashboard`)
    return response.data.data
  }

  static async getStats(
    teacherId: number,
    academySlug: string
  ): Promise<TeacherStats> {
    const response = await apiClient.get<TeacherApiResponse<TeacherStats>>(
      `/academies/${academySlug}/teachers/${teacherId}/stats`
    )
    return response.data.data
  }

  static async getCourses(
    teacherId: number,
    academySlug: string,
    filters: CoursesFilters = {}
  ): Promise<TeacherApiResponse<TeacherCourse[]>> {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())
    const queryString = params.toString()
    const url = `/academies/${academySlug}/teachers/${teacherId}/courses${queryString ? `?${queryString}` : ''}`
    const response =
      await apiClient.get<TeacherApiResponse<TeacherCourse[]>>(url)
    return response.data
  }

  static async getStudentProgress(
    teacherId: number,
    academySlug: string,
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
    const url = `/academies/${academySlug}/teachers/${teacherId}/students${queryString ? `?${queryString}` : ''}`
    const response =
      await apiClient.get<TeacherApiResponse<StudentProgress[]>>(url)
    return response.data
  }

  static async getLessons(
    teacherId: number,
    academySlug: string,
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
    const url = `/academies/${academySlug}/teachers/${teacherId}/lessons${queryString ? `?${queryString}` : ''}`
    const response =
      await apiClient.get<TeacherApiResponse<LessonContent[]>>(url)
    return response.data
  }

  static async getAssignments(
    teacherId: number,
    academySlug: string,
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
    const url = `/academies/${academySlug}/teachers/${teacherId}/assignments${queryString ? `?${queryString}` : ''}`
    const response = await apiClient.get<TeacherApiResponse<Assignment[]>>(url)
    return response.data
  }

  static async createLesson(
    teacherId: number,
    academySlug: string,
    lessonData: CreateLessonRequest
  ): Promise<LessonContent> {
    const response = await apiClient.post<TeacherApiResponse<LessonContent>>(
      `/academies/${academySlug}/teachers/${teacherId}/lessons`,
      { lesson: lessonData }
    )
    return response.data.data
  }

  static async updateLesson(
    teacherId: number,
    academySlug: string,
    lessonId: number,
    lessonData: UpdateLessonRequest
  ): Promise<LessonContent> {
    const response = await apiClient.patch<TeacherApiResponse<LessonContent>>(
      `/academies/${academySlug}/teachers/${teacherId}/lessons/${lessonId}`,
      { lesson: lessonData }
    )
    return response.data.data
  }

  static async deleteLesson(
    teacherId: number,
    academySlug: string,
    lessonId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/teachers/${teacherId}/lessons/${lessonId}`
    )
  }

  static async toggleLessonPublication(
    teacherId: number,
    academySlug: string,
    lessonId: number,
    isPublished: boolean
  ): Promise<LessonContent> {
    const response = await apiClient.patch<TeacherApiResponse<LessonContent>>(
      `/academies/${academySlug}/teachers/${teacherId}/lessons/${lessonId}/toggle_publication`,
      { is_published: isPublished }
    )
    return response.data.data
  }

  static async createAssignment(
    teacherId: number,
    academySlug: string,
    assignmentData: CreateAssignmentRequest
  ): Promise<Assignment> {
    const response = await apiClient.post<TeacherApiResponse<Assignment>>(
      `/academies/${academySlug}/teachers/${teacherId}/assignments`,
      { assignment: assignmentData }
    )
    return response.data.data
  }

  static async updateAssignment(
    teacherId: number,
    academySlug: string,
    assignmentId: number,
    assignmentData: UpdateAssignmentRequest
  ): Promise<Assignment> {
    const response = await apiClient.patch<TeacherApiResponse<Assignment>>(
      `/academies/${academySlug}/teachers/${teacherId}/assignments/${assignmentId}`,
      { assignment: assignmentData }
    )
    return response.data.data
  }

  static async deleteAssignment(
    teacherId: number,
    academySlug: string,
    assignmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/teachers/${teacherId}/assignments/${assignmentId}`
    )
  }

  static async getStudentProgressDetail(
    teacherId: number,
    academySlug: string,
    studentId: number,
    courseId: number
  ): Promise<StudentProgress> {
    const response = await apiClient.get<TeacherApiResponse<StudentProgress>>(
      `/academies/${academySlug}/teachers/${teacherId}/courses/${courseId}/students/${studentId}/progress`
    )
    return response.data.data
  }
}

/**
 * React Query hooks for Teacher API
 */
export const teacherQueries = {
  dashboardData: (teacherId: number, academySlug: string) => ({
    queryKey: ['teacher', 'dashboard', teacherId, academySlug],
    queryFn: () => TeacherApi.getDashboardData(teacherId, academySlug),
    staleTime: 5 * 60 * 1000,
  }),

  stats: (teacherId: number, academySlug: string) => ({
    queryKey: ['teacher', 'stats', teacherId, academySlug],
    queryFn: () => TeacherApi.getStats(teacherId, academySlug),
    staleTime: 5 * 60 * 1000,
  }),

  courses: (
    teacherId: number,
    academySlug: string,
    filters: CoursesFilters = {}
  ) => ({
    queryKey: ['teacher', 'courses', teacherId, academySlug, filters],
    queryFn: () => TeacherApi.getCourses(teacherId, academySlug, filters),
    staleTime: 2 * 60 * 1000,
  }),

  studentProgress: (
    teacherId: number,
    academySlug: string,
    filters: StudentsFilters = {}
  ) => ({
    queryKey: ['teacher', 'students', teacherId, academySlug, filters],
    queryFn: () =>
      TeacherApi.getStudentProgress(teacherId, academySlug, filters),
    staleTime: 2 * 60 * 1000,
  }),

  lessons: (
    teacherId: number,
    academySlug: string,
    filters: LessonsFilters = {}
  ) => ({
    queryKey: ['teacher', 'lessons', teacherId, academySlug, filters],
    queryFn: () => TeacherApi.getLessons(teacherId, academySlug, filters),
    staleTime: 2 * 60 * 1000,
  }),

  assignments: (
    teacherId: number,
    academySlug: string,
    filters: AssignmentsFilters = {}
  ) => ({
    queryKey: ['teacher', 'assignments', teacherId, academySlug, filters],
    queryFn: () => TeacherApi.getAssignments(teacherId, academySlug, filters),
    staleTime: 2 * 60 * 1000,
  }),

  studentProgressDetail: (
    teacherId: number,
    academySlug: string,
    studentId: number,
    courseId: number
  ) => ({
    queryKey: [
      'teacher',
      'student-progress',
      teacherId,
      academySlug,
      studentId,
      courseId,
    ],
    queryFn: () =>
      TeacherApi.getStudentProgressDetail(
        teacherId,
        academySlug,
        studentId,
        courseId
      ),
    staleTime: 1 * 60 * 1000,
  }),
}

/**
 * React Query mutations for Teacher API
 */
export const teacherMutations = {
  createLesson: {
    mutationFn: ({
      teacherId,
      academySlug,
      lessonData,
    }: {
      teacherId: number
      academySlug: string
      lessonData: CreateLessonRequest
    }) => TeacherApi.createLesson(teacherId, academySlug, lessonData),
  },

  updateLesson: {
    mutationFn: ({
      teacherId,
      academySlug,
      lessonId,
      lessonData,
    }: {
      teacherId: number
      academySlug: string
      lessonId: number
      lessonData: UpdateLessonRequest
    }) => TeacherApi.updateLesson(teacherId, academySlug, lessonId, lessonData),
  },

  deleteLesson: {
    mutationFn: ({
      teacherId,
      academySlug,
      lessonId,
    }: {
      teacherId: number
      academySlug: string
      lessonId: number
    }) => TeacherApi.deleteLesson(teacherId, academySlug, lessonId),
  },

  toggleLessonPublication: {
    mutationFn: ({
      teacherId,
      academySlug,
      lessonId,
      isPublished,
    }: {
      teacherId: number
      academySlug: string
      lessonId: number
      isPublished: boolean
    }) =>
      TeacherApi.toggleLessonPublication(
        teacherId,
        academySlug,
        lessonId,
        isPublished
      ),
  },

  createAssignment: {
    mutationFn: ({
      teacherId,
      academySlug,
      assignmentData,
    }: {
      teacherId: number
      academySlug: string
      assignmentData: CreateAssignmentRequest
    }) => TeacherApi.createAssignment(teacherId, academySlug, assignmentData),
  },

  updateAssignment: {
    mutationFn: ({
      teacherId,
      academySlug,
      assignmentId,
      assignmentData,
    }: {
      teacherId: number
      academySlug: string
      assignmentId: number
      assignmentData: UpdateAssignmentRequest
    }) =>
      TeacherApi.updateAssignment(
        teacherId,
        academySlug,
        assignmentId,
        assignmentData
      ),
  },

  deleteAssignment: {
    mutationFn: ({
      teacherId,
      academySlug,
      assignmentId,
    }: {
      teacherId: number
      academySlug: string
      assignmentId: number
    }) => TeacherApi.deleteAssignment(teacherId, academySlug, assignmentId),
  },
}
