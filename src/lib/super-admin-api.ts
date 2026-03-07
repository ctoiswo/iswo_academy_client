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
    const body = response.data?.data !== undefined ? response.data : { data: response.data?.academies ?? [], meta: response.data?.meta }
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
    const response = await apiClient.patch(
      `/super_admin/academies/${id}`,
      { status }
    )
    return response.data
  },
}
