import { apiClient } from '@/lib/api-client'

export interface AccessCode {
  id: number
  code: string
  usage_limit: number
  usage_count: number
  remaining_uses: number
  usage_percentage: number
  expires_at: string
  days_until_expiry: number
  status: 'active' | 'inactive' | 'expired' | 'exhausted'
  description?: string
  expired: boolean
  created_at: string
  updated_at: string
  course: {
    id: number
    title: string
    slug: string
  }
  created_by: {
    id: number
    full_name: string
    email: string
  }
  statistics: {
    total_enrollments: number
    active_enrollments: number
  }
}

export interface CreateAccessCodeData {
  usage_limit: number
  expires_at: string
  description?: string
}

export interface UpdateAccessCodeData {
  usage_limit?: number
  expires_at?: string
  description?: string
  status?: 'active' | 'inactive'
}

export interface AccessCodeFilters {
  status?: 'active' | 'inactive' | 'expired' | 'exhausted'
  page?: number
  per_page?: number
}

export interface RedeemAccessCodeData {
  code: string
}

export interface RedemptionResponse {
  message: string
  enrollment: {
    id: number
    status: string
    enrolled_at: string
    progress_percentage: number
  }
  course: {
    id: number
    title: string
    slug: string
    description: string
    thumbnail_url?: string
    difficulty_level: string
    total_lessons: number
    academy: {
      name: string
      slug: string
    }
  }
  access_code: {
    remaining_uses: number
    days_until_expiry: number
  }
}

export interface ValidationResponse {
  valid: boolean
  already_enrolled: boolean
  message: string
  course?: {
    id: number
    title: string
    slug: string
    description: string
    thumbnail_url?: string
    difficulty_level: string
    total_lessons: number
    academy: {
      name: string
      slug: string
    }
  }
  access_code: {
    remaining_uses: number
    days_until_expiry: number
    usage_percentage: number
  }
}

class AccessCodeService {
  async getAccessCodes(courseId: number, filters?: AccessCodeFilters) {
    const params = new URLSearchParams()

    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/courses/${courseId}/access_codes?${params}`)
    return response.data
  }

  async getAccessCode(courseId: number, accessCodeId: number) {
    const response = await apiClient.get(`/courses/${courseId}/access_codes/${accessCodeId}`)
    return response.data.data as AccessCode
  }

  async createAccessCode(courseId: number, data: CreateAccessCodeData) {
    const response = await apiClient.post(`/courses/${courseId}/access_codes`, {
      access_code: data
    })
    return response.data.data as AccessCode
  }

  async updateAccessCode(courseId: number, accessCodeId: number, data: UpdateAccessCodeData) {
    const response = await apiClient.patch(`/courses/${courseId}/access_codes/${accessCodeId}`, {
      access_code: data
    })
    return response.data.data as AccessCode
  }

  async deleteAccessCode(courseId: number, accessCodeId: number) {
    await apiClient.delete(`/courses/${courseId}/access_codes/${accessCodeId}`)
  }

  async toggleAccessCodeStatus(courseId: number, accessCodeId: number) {
    const response = await apiClient.post(`/courses/${courseId}/access_codes/${accessCodeId}/toggle_status`)
    return response.data.data as AccessCode
  }

  async redeemAccessCode(data: RedeemAccessCodeData) {
    const response = await apiClient.post('/courses/redeem_access_code', data)
    return response.data as RedemptionResponse
  }

  async validateAccessCode(code: string) {
    const response = await apiClient.get(`/courses/validate_access_code/${code}`)
    return response.data as ValidationResponse
  }
}

export const accessCodeService = new AccessCodeService()