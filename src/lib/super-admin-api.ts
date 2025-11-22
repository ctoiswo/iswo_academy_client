/**
 * Super Admin API
 * API client específico para operaciones de super administrador
 */

import { apiClient } from './api-client-base'

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
  status?: 'active' | 'inactive'
}

export const superAdminApi = {
  /**
   * Get global statistics for all academies
   */
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await apiClient.get('/api/v1/super_admin/stats')
    return response.data
  },

  /**
   * Get list of academies with pagination and filters
   */
  async getAcademies(params?: GetAcademiesParams): Promise<AcademiesResponse> {
    const response = await apiClient.get('/api/v1/super_admin/academies', { params })
    return response.data
  },

  /**
   * Get single academy details
   */
  async getAcademy(id: number): Promise<AcademyOverview> {
    const response = await apiClient.get(`/api/v1/super_admin/academies/${id}`)
    return response.data
  },

  /**
   * Update academy status
   */
  async updateAcademyStatus(id: number, status: 'active' | 'inactive'): Promise<AcademyOverview> {
    const response = await apiClient.patch(`/api/v1/super_admin/academies/${id}`, { status })
    return response.data
  }
}
