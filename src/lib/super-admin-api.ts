/**
 * Super Admin API
 * API client específico para operaciones de super administrador
 */
import { apiClient } from './api-client-base'

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface MonthlyUsers {
  month: string
  users: number
}

export interface GlobalStats {
  // Totals
  total_academies: number
  total_users: number
  total_courses: number
  total_revenue: string | number
  // This-month counters
  new_academies_this_month: number
  new_users_this_month: number
  // Revenue trend
  revenue_this_month: number
  revenue_prev_month: number
  revenue_growth_pct: number
  // Academy health
  active_academies: number
  inactive_academies: number
  // Course health
  published_courses: number
  draft_courses: number
  // Top academy
  top_academy_name: string | null
  top_academy_revenue: number
  // Chart series
  monthly_revenue: MonthlyRevenue[]
  monthly_new_users: MonthlyUsers[]
}

export interface AcademyCreator {
  id: number
  name: string
  email: string
}

export interface AcademyOverview {
  id: number
  name: string
  description: string | null
  logo_url: string | null
  total_users: number
  total_courses: number
  total_revenue: number
  created_at: string
  status: 'active' | 'inactive'
  creator: AcademyCreator
}

export interface AcademiesResponse {
  data: AcademyOverview[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

export interface GetAcademiesParams {
  page?: number
  per_page?: number
  search?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface SuperAdminUserAcademy {
  id: number
  name: string
  role: string
}

export interface SuperAdminUser {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  avatar_url: string | null
  confirmed: boolean
  is_super_admin: boolean
  onboarding_completed_at: string | null
  last_login_at: string | null
  created_at: string
  academies_count: number
  academies: SuperAdminUserAcademy[]
}

export interface UsersMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  confirmed_count: number
  unconfirmed_count: number
  super_admin_count: number
  new_this_month: number
}

export interface UsersResponse {
  data: SuperAdminUser[]
  meta: UsersMeta
}

export interface GetUsersParams {
  page?: number
  per_page?: number
  search?: string
  confirmed?: 'true' | 'false'
  super_admin?: 'true'
  sort?: 'created_at' | 'last_login_at' | 'email' | 'first_name'
  dir?: 'asc' | 'desc'
}

export interface UpdateUserRequest {
  is_super_admin?: boolean
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface SuperAdminPaymentPayable {
  id: number
  name: string
  type: string
}

export interface SuperAdminPaymentUser {
  id: number
  full_name: string
  email: string
  avatar_url: string | null
}

export interface SuperAdminPayment {
  id: number
  amount: number
  currency: string | null
  status: PaymentStatus
  provider: string | null
  transaction_id: string | null
  provider_payment_id: string | null
  payable_type: 'Course' | 'Academy' | string
  payable: SuperAdminPaymentPayable | null
  user: SuperAdminPaymentUser | null
  failure_reason: string | null
  refunded_at: string | null
  created_at: string
  updated_at: string
}

export interface PaymentsMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  completed_count: number
  pending_count: number
  failed_count: number
  refunded_count: number
  total_revenue: number
  this_month_revenue: number
}

export interface PaymentsResponse {
  data: SuperAdminPayment[]
  meta: PaymentsMeta
}

export interface GetPaymentsParams {
  page?: number
  per_page?: number
  search?: string
  status?: PaymentStatus
  payable_type?: 'Course' | 'Academy'
  sort?: 'created_at' | 'amount'
  dir?: 'asc' | 'desc'
}

export type ServiceHealthStatus = 'healthy' | 'unhealthy' | 'not_configured'

export interface ServiceHealth {
  status: ServiceHealthStatus
  response_time?: number
  type?: string
  service?: string
  error?: string
}

export interface SystemLoad {
  memory_usage: number
  cpu_usage: number
  disk_usage: number
}

export interface SystemHealth {
  database_status: ServiceHealth
  cache_status: ServiceHealth
  storage_status: ServiceHealth
  active_users_1h: number
  active_users_24h: number
  active_users_7d: number
  new_users_today: number
  new_users_this_week: number
  payments_today: number
  revenue_today: number
  total_users: number
  total_academies: number
  total_courses: number
  total_payments: number
  system_load: SystemLoad
  app_version: string
  rails_version: string
  ruby_version: string
  environment: string
  checked_at: string
}

export const superAdminApi = {
  /**
   * Get global statistics for all academies
   */
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await apiClient.get('/super_admin/global_stats')
    return response.data?.data ?? response.data
  },

  /**
   * Get list of academies with pagination and filters
   */
  async getAcademies(params?: GetAcademiesParams): Promise<AcademiesResponse> {
    const response = await apiClient.get('/super_admin/academies', { params })
    const body =
      response.data?.data !== undefined
        ? response.data
        : { data: response.data?.academies ?? [], meta: response.data?.meta }
    return body
  },

  /**
   * Get single academy details
   */
  async getAcademy(id: number): Promise<AcademyOverview> {
    const response = await apiClient.get(`/super_admin/academies/${id}`)
    return response.data
  },

  /**
   * Update academy status
   */
  async updateAcademyStatus(
    id: number,
    status: 'active' | 'inactive'
  ): Promise<AcademyOverview> {
    const response = await apiClient.patch(`/super_admin/academies/${id}`, {
      status,
    })
    return response.data
  },

  /**
   * Get list of users with pagination and filters
   */
  async getUsers(params?: GetUsersParams): Promise<UsersResponse> {
    const response = await apiClient.get('/super_admin/users', { params })
    return response.data
  },

  /**
   * Update a user (toggle super_admin, etc.)
   */
  async updateUser(
    id: number,
    data: UpdateUserRequest
  ): Promise<SuperAdminUser> {
    const response = await apiClient.patch(`/super_admin/users/${id}`, data)
    return response.data.data
  },

  /**
   * Get list of payments with pagination and filters
   */
  async getPayments(params?: GetPaymentsParams): Promise<PaymentsResponse> {
    const response = await apiClient.get('/super_admin/payments', { params })
    return response.data
  },

  /**
   * Refund a payment
   */
  async refundPayment(id: number): Promise<SuperAdminPayment> {
    const response = await apiClient.post(`/super_admin/payments/${id}/refund`)
    return response.data.data
  },

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get('/super_admin/system_health')
    return response.data?.data ?? response.data
  },
}
