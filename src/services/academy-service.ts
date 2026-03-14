import type {
  Academy,
  AcademyMinimal,
  AcademySummaryLight,
  AcademySummary,
  AcademyFull,
  AcademyCategory,
  PaginationMeta,
  CreateAcademyRequest,
  UpdateAcademyRequest,
  ApiViewMode,
} from '@/types'
import apiClient from '@/lib/api-client'

// Response types for specific endpoints
export interface FeaturedAcademiesByCategory {
  category: AcademyCategory
  academies: AcademySummary[] // Featured academies use summary view (with courses)
}

export interface UserAcademiesResponse {
  count: number
  academies: AcademySummaryLight[] // User academies use summary_light (without courses array)
}

/**
 * Academy Service
 * Handles all academy-related API calls with view mode support
 */
class AcademyService {
  /**
   * Get featured academies grouped by category
   * @param categoryId - Optional category ID to filter by
   * @returns Promise with array of featured academies grouped by category
   */
  async getFeaturedAcademies(
    categoryId?: number
  ): Promise<FeaturedAcademiesByCategory[]> {
    const params = categoryId ? { academy_category_id: categoryId } : {}
    const response = await apiClient.get('/academies/featured', { params })
    return response.data
  }

  /**
   * Get a single academy by slug
   * @param slug - Academy slug
   * @param view - View mode: 'minimal' | 'summary' | 'summary_light' | 'full' (default: 'summary')
   * @returns Promise with academy details typed according to view
   */
  async getAcademyBySlug<
    TView extends ApiViewMode | 'summary_light' = 'summary',
  >(
    slug: string,
    view?: TView
  ): Promise<
    TView extends 'minimal'
    ? AcademyMinimal
    : TView extends 'summary_light'
    ? AcademySummaryLight
    : TView extends 'summary'
    ? AcademySummary
    : TView extends 'full'
    ? AcademyFull
    : AcademySummary
  > {
    const params = view ? { view } : {}
    const response = await apiClient.get(`/academies/${slug}`, { params })
    return response.data
  }

  /**
   * Get current user's academies (requires authentication)
   * @returns Promise with user's academy memberships
   */
  async getUserAcademies(): Promise<UserAcademiesResponse> {
    const response = await apiClient.get('/users/me/academies')
    return response.data
  }

  /**
   * Get all academies
   * @param params - Query parameters (search, category, sort_by, page, per_page, gamification, view)
   * @param view - View mode: 'minimal' | 'summary_light' | 'summary' | 'full' (default: 'summary_light')
   * @returns Promise with paginated academies data typed according to view
   */
  async getAcademies<
    TView extends ApiViewMode | 'summary_light' = 'summary_light',
  >(
    params?: {
      search?: string
      category?: string
      sort_by?: string
      page?: number
      per_page?: number
      gamification?: string
    },
    view?: TView
  ): Promise<{
    data: (TView extends 'minimal'
      ? AcademyMinimal
      : TView extends 'summary_light'
      ? AcademySummaryLight
      : TView extends 'summary'
      ? AcademySummary
      : TView extends 'full'
      ? AcademyFull
      : AcademySummaryLight)[]
    meta: PaginationMeta
  }> {
    const queryParams = {
      ...params,
      ...(view && { view }),
    }
    const response = await apiClient.get('/academies', { params: queryParams })
    return {
      data: Array.isArray(response.data)
        ? response.data
        : response.data.data || [],
      meta: response.data.meta || {
        current_page: 1,
        total_pages: 1,
        total_count: Array.isArray(response.data) ? response.data.length : 0,
        per_page: params?.per_page || 15,
      },
    }
  }

  /**
   * Create a new academy (requires admin)
   * @param data - Academy data
   * @returns Promise with created academy
   */
  async createAcademy(data: CreateAcademyRequest): Promise<Academy> {
    const response = await apiClient.post('/academies', {
      academy: data,
    })
    return response.data
  }

  /**
   * Update an academy (requires admin) — JSON fields only
   * @param id - Academy ID or slug
   * @param data - Updated academy data
   * @returns Promise with updated academy
   */
  async updateAcademy(
    id: number | string,
    data: UpdateAcademyRequest
  ): Promise<Academy> {
    const response = await apiClient.patch(`/academies/${id}`, {
      academy: data,
    })
    return response.data
  }

  /**
   * Update an academy with file uploads (logo / banner)
   * Sends a multipart/form-data request.
   * @param slug - Academy slug
   * @param data - FormData containing academy fields + optional File objects
   * @returns Promise with updated academy
   */
  async updateAcademyWithFiles(slug: string, data: FormData): Promise<Academy> {
    const response = await apiClient.patch(`/academies/${slug}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  /**
   * Upload a logo or banner attachment for an academy
   * @param academySlug - Academy slug
   * @param file - File to upload
   * @param type - 'logo' | 'banner'
   * @param title - Optional title for the attachment
   */
  async uploadAttachment(
    academySlug: string,
    file: File,
    type: 'logo' | 'banner',
    title?: string
  ): Promise<{ id: number; attachment_type: string; file_url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('attachment_type', type)
    if (title) formData.append('title', title)
    const response = await apiClient.post(
      `/academies/${academySlug}/attachments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  }

  /**
   * Delete an attachment from an academy
   * @param academySlug - Academy slug
   * @param attachmentId - Attachment ID
   */
  async deleteAttachment(academySlug: string, attachmentId: number): Promise<void> {
    await apiClient.delete(`/academies/${academySlug}/attachments/${attachmentId}`)
  }

  /**
   * Delete an academy (requires admin)
   * @param id - Academy ID
   * @returns Promise with success message
   */
  async deleteAcademy(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/academies/${id}`)
    return response.data
  }
}

// Export singleton instance
const academyService = new AcademyService()
export default academyService

// Also export as named export
export { academyService }
