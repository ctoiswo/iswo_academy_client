import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
const API_TIMEOUT = 10000

// TypeScript interfaces for API responses
export interface ApiError {
  type: string
  message: string
  code: string
  details?: string[]
}

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: ApiError
}

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  full_name: string
  initials: string
  confirmed: boolean
  is_super_admin: boolean
  created_at: string
  last_login_at: string | null
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser
  message: string
  academies?: AcademyData
}

// Token management utilities
import { tokenStorage } from '@/lib/token-storage'

let authStore: any = null

export const setAuthStore = (store: any) => {
  authStore = store
}

const getAccessToken = (): string | null => {
  return tokenStorage.getAccessToken()
}

const getRefreshToken = (): string | null => {
  return tokenStorage.getRefreshToken()
}

const updateTokens = (tokens: AuthTokens) => {
  tokenStorage.setTokens(tokens)
  if (authStore) {
    const state = authStore.getState()
    if (state.setTokens) {
      state.setTokens(tokens)
    }
  }
  // Schedule proactive refresh for new tokens
  scheduleTokenRefresh(tokens.expires_in)
}

const clearTokens = () => {
  clearRefreshTimer()
  tokenStorage.clearTokens()
  if (authStore) {
    const state = authStore.getState()
    if (state.reset) {
      state.reset()
    }
  }
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
})

// Token refresh management
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

// Proactive refresh timer
let refreshTimer: NodeJS.Timeout | null = null

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Clear any existing refresh timer
const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

// Schedule proactive token refresh
const scheduleTokenRefresh = (expiresIn: number) => {
  clearRefreshTimer()

  // Schedule refresh 5 minutes before expiration (or halfway through if less than 10 minutes)
  const refreshBuffer = Math.min(5 * 60 * 1000, (expiresIn * 1000) / 2)
  const refreshDelay = Math.max(0, (expiresIn * 1000) - refreshBuffer)

  if (refreshDelay > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        await performTokenRefresh()
      } catch (error) {
        console.warn('Proactive token refresh failed:', error)
        // Don't redirect here, let the next API call handle it
      }
    }, refreshDelay)
  }
}

// Centralized token refresh logic
const performTokenRefresh = async (): Promise<AuthTokens> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken
  })

  const tokens: AuthTokens = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_in: response.data.expires_in
  }

  updateTokens(tokens)
  scheduleTokenRefresh(tokens.expires_in)

  return tokens
}

// Request interceptor for adding auth tokens and proactive refresh
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token checks for auth endpoints
    if (config.url?.includes('/auth/')) {
      return config
    }

    const token = getAccessToken()
    if (token && config.headers) {
      // Check if token will expire soon and refresh proactively
      if (tokenStorage.willExpireSoon(2 * 60 * 1000) && !isRefreshing) { // 2 minutes buffer
        try {
          const newTokens = await performTokenRefresh()
          config.headers.Authorization = `Bearer ${newTokens.access_token}`
        } catch (error) {
          // If proactive refresh fails, continue with current token
          // The response interceptor will handle it if the token is actually expired
          console.warn('Proactive token refresh failed:', error)
          config.headers.Authorization = `Bearer ${token}`
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling authentication and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to prevent infinite loops
      if (originalRequest.url?.includes('/auth/')) {
        const apiError = createApiError(error)
        return Promise.reject(apiError)
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return apiClient(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const tokens = await performTokenRefresh()
        processQueue(null, tokens.access_token)

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
        }
        return apiClient(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()

        // Redirect to login page only if we're in a browser environment
        if (typeof window !== 'undefined' && window.location) {
          // Use router navigation if available, otherwise fallback to location
          const currentPath = window.location.pathname
          if (currentPath !== '/auth/sign-in' && currentPath !== '/') {
            window.location.href = '/auth/sign-in'
          }
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other error scenarios
    const apiError = createApiError(error)
    return Promise.reject(apiError)
  }
)

// Error handling utilities
export const createApiError = (error: AxiosError): ApiError & { status?: number } => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const responseData = error.response.data as any
    if (responseData.error) {
      return {
        ...responseData.error,
        status: error.response.status
      }
    }
  }

  // Handle different error scenarios
  if (error.response?.status === 401) {
    return {
      type: 'AuthenticationError',
      message: 'Authentication required',
      code: 'AUTHENTICATION_REQUIRED',
      status: 401
    }
  } else if (error.response?.status === 403) {
    return {
      type: 'AuthorizationError',
      message: 'Access forbidden',
      code: 'ACCESS_FORBIDDEN',
      status: 403
    }
  } else if (error.response?.status === 404) {
    return {
      type: 'NotFoundError',
      message: 'Resource not found',
      code: 'RESOURCE_NOT_FOUND',
      status: 404
    }
  } else if (error.response?.status === 422) {
    return {
      type: 'ValidationError',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      status: 422
    }
  } else if (error.response?.status === 429) {
    return {
      type: 'RateLimitError',
      message: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429
    }
  } else if (error.response?.status && error.response.status >= 500) {
    return {
      type: 'ServerError',
      message: 'Internal server error',
      code: 'SERVER_ERROR',
      status: error.response.status
    }
  } else if (error.code === 'ECONNABORTED') {
    return {
      type: 'TimeoutError',
      message: 'Request timeout',
      code: 'REQUEST_TIMEOUT'
    }
  } else if (!error.response) {
    return {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR'
    }
  }

  return {
    type: 'UnknownError',
    message: error.message || 'An unknown error occurred',
    code: 'UNKNOWN_ERROR'
  }
}

export const isApiError = (error: any): error is ApiError => {
  return !!(error && typeof error === 'object' && 'type' in error && 'message' in error && 'code' in error)
}

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    if (error.details && error.details.length > 0) {
      return error.details.join(', ')
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// API Client Error class
export class ApiClientError extends Error {
  public readonly type: string
  public readonly code: string
  public readonly details?: string[]

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'ApiClientError'
    this.type = apiError.type
    this.code = apiError.code
    this.details = apiError.details
  }
}

// HTTP status code utilities
export const isSuccessStatus = (status: number): boolean => status >= 200 && status < 300
export const isClientError = (status: number): boolean => status >= 400 && status < 500
export const isServerError = (status: number): boolean => status >= 500
export const isAuthError = (status: number): boolean => status === 401 || status === 403

// API request helpers
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  if (!isSuccessStatus(response.status)) {
    throw createApiError({
      response,
      message: `HTTP ${response.status}`,
      code: 'HTTP_ERROR'
    } as AxiosError)
  }
  return response.data
}

// Test function to verify API connectivity
export const testApiConnection = async () => {
  try {
    // Test the health endpoint
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/up`, {
      timeout: 5000,
    })
    return {
      success: true,
      status: response.status,
      message: 'API connection successful'
    }
  } catch (error) {
    console.error('API connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'API connection failed'
    }
  }
}

// Authentication API methods
export const authApi = {
  register: async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<{ message: string; user: AuthUser }> => {
    const response = await apiClient.post('/auth/register', { user: userData })
    return handleApiResponse(response)
  },

  login: async (credentials: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { user: credentials })
    return handleApiResponse(response)
  },

  logout: async (refreshToken: string): Promise<{ message: string }> => {
    const response = await apiClient.delete('/auth/logout', {
      data: { refresh_token: refreshToken }
    })
    return handleApiResponse(response)
  },

  refreshTokens: async (refreshToken: string): Promise<AuthTokens & { message: string }> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken })
    return handleApiResponse(response)
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot_password', { email })
    return handleApiResponse(response)
  },

  resetPassword: async (token: string, password: string, passwordConfirmation: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset_password', {
      token,
      password,
      password_confirmation: passwordConfirmation
    })
    return handleApiResponse(response)
  }
}

// User API methods
export const userApi = {
  getProfile: async (): Promise<AuthUser> => {
    const response = await apiClient.get('/users/profile')
    return handleApiResponse(response)
  },

  updateProfile: async (userData: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await apiClient.patch('/users/profile', { user: userData })
    return handleApiResponse(response)
  }
}

// Academy category interfaces
export interface AcademyCategory {
  id: number
  name: string
  description: string
  slug: string
  icon: string
  color: string
  academies_count: number
  academies?: FeaturedAcademy[]
}

export interface AcademyCategoriesResponse {
  categories: AcademyCategory[]
}

// Featured content interfaces
export interface FeaturedAcademy {
  id: number
  name: string
  description: string
  slug: string
  logo_url: string | null
  is_public: boolean
  subscription_required: boolean
  monthly_price: string
  creator: {
    id: number
    name: string
  }
  course_count: number
  student_count: number
  created_at: string
  has_active_subscription: boolean
}

export interface FeaturedCourse {
  id: number
  title: string
  description: string
  thumbnail_url: string | null
  price: string
  is_free: boolean
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  is_published: boolean
  section_count: number
  lesson_count: number
  enrollment_count: number
  creator: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

// Academy-related interfaces for API
export interface AcademyMembership {
  id: number
  name: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
}

export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}

// Academy API methods
export const academyApi = {
  getUserAcademies: async (): Promise<AcademyData> => {
    const response = await apiClient.get('/academies/user_academies')
    return handleApiResponse(response)
  },

  getFeaturedAcademies: async (categoryId?: number): Promise<FeaturedAcademy[]> => {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/academies/featured', { params })
    return handleApiResponse(response).data
  },

  getCategories: async (): Promise<AcademyCategory[]> => {
    const response = await apiClient.get('/academy_categories')
    return handleApiResponse(response).categories
  }
}

// Course API methods
export const courseApi = {
  getFeaturedCourses: async (categoryId?: number): Promise<FeaturedCourse[]> => {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/courses/featured', { params })
    return handleApiResponse(response).data
  }
}

// Super Admin API interfaces
export interface GlobalStats {
  totalAcademies: number
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  monthlyGrowth: {
    academies: number
    users: number
    revenue: number
  }
}

export interface AcademyOverview {
  id: number
  name: string
  description: string
  logo_url: string | null
  total_users: number
  total_courses: number
  total_revenue: number
  created_at: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  creator: {
    id: number
    name: string
    email: string
  }
}

export interface SystemHealth {
  database_status: {
    status: 'healthy' | 'unhealthy' | 'not_configured'
    response_time?: number
    error?: string
  }
  redis_status: {
    status: 'healthy' | 'unhealthy' | 'not_configured'
    error?: string
  }
  storage_status: {
    status: 'healthy' | 'unhealthy' | 'not_configured'
    service?: string
    error?: string
  }
  active_users_24h: number
  recent_errors: any[]
  system_load: {
    memory_usage: number
    cpu_usage: number
    disk_usage: number
  }
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    pagination: PaginationMeta
  }
}

// Super Admin API methods
export const superAdminApi = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    const response = await apiClient.get('/super_admin/global_stats')
    return handleApiResponse(response).data
  },

  getAcademies: async (params?: {
    page?: number
    per_page?: number
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<AcademyOverview>> => {
    const response = await apiClient.get('/super_admin/academies', { params })
    return handleApiResponse(response)
  },

  getAcademyDetails: async (academyId: number): Promise<AcademyOverview> => {
    const response = await apiClient.get(`/super_admin/academies/${academyId}`)
    return handleApiResponse(response).data
  },

  updateAcademyStatus: async (
    academyId: number,
    status: 'active' | 'inactive' | 'suspended' | 'pending'
  ): Promise<{ data: AcademyOverview; message: string }> => {
    const response = await apiClient.patch(`/super_admin/academies/${academyId}/status`, { status })
    return handleApiResponse(response)
  },

  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await apiClient.get('/super_admin/system_health')
    return handleApiResponse(response).data
  }
}

// Token management utilities
export const tokenManager = {
  /**
   * Initialize token refresh scheduling for existing tokens
   */
  initialize: () => {
    const tokens = tokenStorage.getTokens()
    if (tokens && !tokenStorage.isTokenExpired(tokens)) {
      const timeUntilExpiration = Math.floor((tokens.expires_at - Date.now()) / 1000)
      scheduleTokenRefresh(timeUntilExpiration)
    }
  },

  /**
   * Manually trigger token refresh
   */
  refreshTokens: async (): Promise<boolean> => {
    try {
      await performTokenRefresh()
      return true
    } catch (error) {
      console.error('Manual token refresh failed:', error)
      clearTokens()
      return false
    }
  },

  /**
   * Check if tokens are valid and not expired
   */
  hasValidTokens: (): boolean => {
    return tokenStorage.hasValidTokens()
  },

  /**
   * Get token expiration info
   */
  getTokenInfo: () => {
    return tokenStorage.getTokenInfo()
  },

  /**
   * Clear all tokens and timers
   */
  clearTokens: () => {
    clearTokens()
  }
}

// ============================================================================
// STUDENT API INTERFACES AND TYPES
// ============================================================================

// Student Dashboard Types
export interface StudentDashboardStats {
  enrolled_courses: number
  completed_courses: number
  certificates_earned: number
  learning_hours: number
  current_streak: number
  overall_progress: number
}

export interface LearningActivity {
  id: number
  type: 'lesson_completed' | 'course_enrolled' | 'certificate_earned' | 'quiz_passed'
  title: string
  course_title: string
  timestamp: string
  progress_percentage?: number
}

export interface UpcomingLesson {
  id: number
  title: string
  course_title: string
  course_id: number
  section_title: string
  scheduled_date?: string
  duration_minutes?: number
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
}

export interface CourseRecommendation {
  id: number
  title: string
  description: string
  thumbnail_url?: string
  instructor_name: string
  rating: number
  price: number
  enrollment_count: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_hours: number
}

export interface StudentDashboardData {
  student: {
    id: number
    first_name: string
    last_name: string
    email: string
    avatar_url?: string
  }
  academy: {
    id: number
    name: string
    logo_url?: string
  }
  stats: StudentDashboardStats
  recent_activity: LearningActivity[]
  upcoming_lessons: UpcomingLesson[]
  recommendations: CourseRecommendation[]
}

// Enrollment Types
export interface StudentEnrollment {
  id: number
  course_id: number
  course_title: string
  course_description: string
  course_thumbnail?: string
  instructor_name: string
  enrolled_at: string
  progress_percentage: number
  completed_at?: string
  status: 'active' | 'completed' | 'paused' | 'expired'
  payment_status: 'free' | 'paid' | 'pending'
  last_accessed?: string
  next_lesson?: {
    id: number
    title: string
    section_title: string
  }
  course_stats: {
    total_lessons: number
    completed_lessons: number
    total_duration_minutes: number
    completed_duration_minutes: number
  }
}

export interface EnrollmentFilters {
  status?: string[]
  payment_status?: string[]
  search?: string
  sort?: 'enrolled_at' | 'progress' | 'last_accessed'
  order?: 'asc' | 'desc'
}

// Progress Types
export interface LessonProgress {
  id: number
  title: string
  completed: boolean
  completed_at?: string
  duration_minutes?: number
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
  quiz_score?: number
  assignment_grade?: number
}

export interface SectionProgress {
  id: number
  title: string
  lessons: LessonProgress[]
  progress_percentage: number
  completed_lessons: number
  total_lessons: number
}

export interface CourseProgress {
  enrollment_id: number
  course_id: number
  course_title: string
  progress_percentage: number
  sections: SectionProgress[]
  overall_stats: {
    total_lessons: number
    completed_lessons: number
    total_duration_minutes: number
    completed_duration_minutes: number
    estimated_completion_date?: string
  }
  last_accessed: string
  started_at: string
  completed_at?: string
}

export interface OverallProgress {
  total_enrollments: number
  completed_courses: number
  in_progress_courses: number
  total_learning_minutes: number
  average_progress: number
  completion_rate: number
}

export interface LearningStreak {
  current_streak: number
  longest_streak: number
  last_activity_date: string
  streak_goal: number
  weekly_goal_progress: number
}

export interface StudentAchievement {
  id: number
  title: string
  description: string
  icon: string
  earned_at: string
  category: 'course_completion' | 'learning_streak' | 'quiz_mastery' | 'participation'
  badge_color: string
}

export interface ProgressData {
  student: {
    id: number
    first_name: string
    last_name: string
  }
  academy: {
    id: number
    name: string
  }
  overall_progress: OverallProgress
  courses: CourseProgress[]
  learning_streak: LearningStreak
  achievements: StudentAchievement[]
}

// Certificate Types
export interface StudentCertificate {
  id: number
  certificate_number: string
  course_id: number
  course_title: string
  instructor_name: string
  completion_date: string
  issued_at: string
  grade?: number
  status: 'active' | 'revoked'
  verification_url: string
  download_url: string
  academy_name: string
  academy_logo?: string
}

// Progress Update Types
export interface ProgressUpdateData {
  completed_lesson_ids?: number[]
  progress_percentage?: number
  quiz_score?: number
  assignment_grade?: number
  notes?: string
}

// ============================================================================
// STUDENT API FUNCTIONS
// ============================================================================

/**
 * Student API endpoints
 */
export const studentApi = {
  /**
   * Get student dashboard data
   */
  getDashboard: async (academyId: number, studentId: number): Promise<StudentDashboardData> => {
    const response = await apiClient.get<ApiResponse<StudentDashboardData>>(
      `/academies/${academyId}/students/${studentId}/dashboard`
    )
    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return response.data.data!
  },

  /**
   * Get student enrollments with filters and pagination
   */
  getEnrollments: async (
    academyId: number,
    studentId: number,
    filters?: EnrollmentFilters,
    page = 1,
    perPage = 20
  ): Promise<{
    data: StudentEnrollment[]
    meta: {
      pagination: PaginationMeta
      academy: { id: number; name: string }
      student: { id: number; first_name: string; last_name: string }
    }
  }> => {
    const params: Record<string, string> = {
      page: page.toString(),
      per_page: perPage.toString(),
    }

    // Add filter parameters if they exist
    if (filters) {
      if (filters.status) params.status = filters.status.join(',')
      if (filters.payment_status) params.payment_status = filters.payment_status.join(',')
      if (filters.search) params.search = filters.search
      if (filters.sort) params.sort = filters.sort
      if (filters.order) params.order = filters.order
    }

    const searchParams = new URLSearchParams(params)

    const response = await apiClient.get<ApiResponse<{
      data: StudentEnrollment[]
      meta: any
    }>>(`/academies/${academyId}/students/${studentId}/enrollments?${searchParams}`)

    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return response.data.data!
  },

  /**
   * Get detailed progress for all courses
   */
  getProgress: async (academyId: number, studentId: number): Promise<ProgressData> => {
    const response = await apiClient.get<ApiResponse<ProgressData>>(
      `/academies/${academyId}/students/${studentId}/progress`
    )
    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return response.data.data!
  },

  /**
   * Get student certificates
   */
  getCertificates: async (
    academyId: number,
    studentId: number,
    page = 1,
    perPage = 20
  ): Promise<{
    data: StudentCertificate[]
    meta: {
      pagination: PaginationMeta
      academy: { id: number; name: string }
      student: { id: number; first_name: string; last_name: string }
      total_certificates: number
    }
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    const response = await apiClient.get<ApiResponse<{
      data: StudentCertificate[]
      meta: any
    }>>(`/academies/${academyId}/students/${studentId}/certificates?${params}`)

    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return response.data.data!
  },

  /**
   * Enroll in a course
   */
  enrollInCourse: async (academyId: number, courseId: number): Promise<{
    message: string
    data: {
      enrollment: StudentEnrollment
      course: {
        id: number
        title: string
      }
      next_steps: {
        first_lesson_url?: string
        payment_required?: boolean
        welcome_message?: string
      }
    }
  }> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/academies/${academyId}/courses/${courseId}/enroll`
    )
    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return {
      message: response.data.message || 'Successfully enrolled in course',
      data: response.data.data!
    }
  },

  /**
   * Update learning progress
   */
  updateProgress: async (
    enrollmentId: number,
    progressData: ProgressUpdateData
  ): Promise<{
    message: string
    data: {
      enrollment: StudentEnrollment
      progress: CourseProgress
      certificate_generated: boolean
    }
  }> => {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/enrollments/${enrollmentId}/student_progress`,
      progressData
    )
    if (response.data.error) {
      throw new ApiClientError(response.data.error)
    }
    return {
      message: response.data.message || 'Progress updated successfully',
      data: response.data.data!
    }
  },
}

// Export API configuration for use in other modules
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
}

// Export both named and default exports for compatibility
export { apiClient }
export default apiClient