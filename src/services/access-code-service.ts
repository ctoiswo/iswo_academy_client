import type {
  AccessCode,
  AccessCodeBase,
  AccessCodePublic,
  AccessCodeAdmin,
  AccessCodeFilters,
  CreateAccessCodeRequest,
  UpdateAccessCodeRequest,
  RedeemAccessCodeRequest,
  AccessCodeRedemptionResponse,
  AccessCodeValidationResponse,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Access Code Service
 * Handles all access code-related API calls with view mode support
 */
class AccessCodeService {
  /**
   * Get all access codes for a course
   * @param courseId - Course ID or slug
   * @param filters - Optional filters (status, pagination)
   * @param view - View mode: 'basic' | 'public' | 'admin' (default: 'admin')
   * @returns Promise with access codes array typed according to view
   */
  async getAccessCodes<TView extends 'basic' | 'public' | 'admin' = 'admin'>(
    courseId: number | string,
    filters?: AccessCodeFilters,
    view?: TView
  ): Promise<
    (TView extends 'basic'
      ? AccessCodeBase
      : TView extends 'public'
        ? AccessCodePublic
        : AccessCodeAdmin)[]
  > {
    const params = {
      ...filters,
      ...(view && { view }),
    }
    const response = await apiClient.get(`/courses/${courseId}/access_codes`, {
      params,
    })
    return response.data.data || []
  }

  /**
   * Get a single access code
   * @param courseId - Course ID or slug
   * @param accessCodeId - Access code ID
   * @param view - View mode: 'basic' | 'public' | 'admin' (default: 'admin')
   * @returns Promise with access code details typed according to view
   */
  async getAccessCode<TView extends 'basic' | 'public' | 'admin' = 'admin'>(
    courseId: number | string,
    accessCodeId: number,
    view?: TView
  ): Promise<
    TView extends 'basic'
      ? AccessCodeBase
      : TView extends 'public'
        ? AccessCodePublic
        : AccessCodeAdmin
  > {
    const params = view ? { view } : {}
    const response = await apiClient.get(
      `/courses/${courseId}/access_codes/${accessCodeId}`,
      { params }
    )
    return response.data.data
  }

  /**
   * Create a new access code
   * @param courseId - Course ID or slug
   * @param data - Access code data
   * @returns Promise with created access code
   */
  async createAccessCode(
    courseId: number | string,
    data: CreateAccessCodeRequest
  ): Promise<AccessCode> {
    const response = await apiClient.post(`/courses/${courseId}/access_codes`, {
      access_code: data,
    })
    return response.data.data
  }

  /**
   * Update an access code
   * @param courseId - Course ID or slug
   * @param accessCodeId - Access code ID
   * @param data - Updated access code data
   * @returns Promise with updated access code
   */
  async updateAccessCode(
    courseId: number | string,
    accessCodeId: number,
    data: UpdateAccessCodeRequest
  ): Promise<AccessCode> {
    const response = await apiClient.patch(
      `/courses/${courseId}/access_codes/${accessCodeId}`,
      {
        access_code: data,
      }
    )
    return response.data.data
  }

  /**
   * Delete an access code
   * @param courseId - Course ID or slug
   * @param accessCodeId - Access code ID
   * @returns Promise with success message
   */
  async deleteAccessCode(
    courseId: number | string,
    accessCodeId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `/courses/${courseId}/access_codes/${accessCodeId}`
    )
    return response.data
  }

  /**
   * Toggle access code status (active/inactive)
   * @param courseId - Course ID or slug
   * @param accessCodeId - Access code ID
   * @returns Promise with updated access code
   */
  async toggleAccessCodeStatus(
    courseId: number | string,
    accessCodeId: number
  ): Promise<AccessCode> {
    const response = await apiClient.post(
      `/courses/${courseId}/access_codes/${accessCodeId}/toggle_status`
    )
    return response.data.data
  }

  /**
   * Redeem an access code (enroll in course)
   * @param data - Redemption request with code
   * @returns Promise with redemption response (enrollment + course info)
   */
  async redeemAccessCode(
    data: RedeemAccessCodeRequest
  ): Promise<AccessCodeRedemptionResponse> {
    const response = await apiClient.post('/courses/redeem_access_code', data)
    return response.data
  }

  /**
   * Validate an access code before redeeming
   * @param code - Access code to validate
   * @returns Promise with validation response
   */
  async validateAccessCode(
    code: string
  ): Promise<AccessCodeValidationResponse> {
    const response = await apiClient.get(
      `/courses/validate_access_code/${code}`
    )
    return response.data
  }
}

// Export singleton instance
const accessCodeService = new AccessCodeService()
export default accessCodeService

// Also export as named export
export { accessCodeService }
