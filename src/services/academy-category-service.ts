import type {
  AcademyCategory,
  AcademyCategoryMinimal,
  AcademyCategorySummary,
  AcademyCategoryFull,
  PaginationMeta,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiViewMode,
  ViewResponse,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Academy Category Service
 * Handles all academy category related API calls with view mode support
 */
class AcademyCategoryService {
  /**
   * Get all academy categories
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'summary')
   * @returns Promise with array of categories typed according to view
   *
   * @example
   * // Get minimal data (id, name, slug)
   * const categories = await getCategories('minimal')
   *
   * // Get summary data (includes academies_count)
   * const categories = await getCategories('summary')
   *
   * // Get full data (includes academies array)
   * const categories = await getCategories('full')
   */
  async getCategories<TView extends ApiViewMode = 'summary'>(
    view?: TView
  ): Promise<
    ViewResponse<
      AcademyCategoryMinimal,
      AcademyCategorySummary,
      AcademyCategoryFull,
      TView
    >[]
  > {
    const params = view ? { view } : {}
    const response = await apiClient.get('/academy_categories', { params })
    return response.data.data || response.data
  }

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
   * @returns Promise with category details typed according to view
   */
  async getCategoryById<TView extends ApiViewMode = 'full'>(
    id: string | number,
    view?: TView
  ): Promise<
    ViewResponse<
      AcademyCategoryMinimal,
      AcademyCategorySummary,
      AcademyCategoryFull,
      TView
    >
  > {
    const params = view ? { view } : {}
    const response = await apiClient.get(`/academy_categories/${id}`, {
      params,
    })
    return response.data
  }

  /**
   * Get a single category by slug
   * @param slug - Category slug
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
   * @returns Promise with category details typed according to view
   */
  async getCategoryBySlug<TView extends ApiViewMode = 'full'>(
    slug: string,
    view?: TView
  ): Promise<
    ViewResponse<
      AcademyCategoryMinimal,
      AcademyCategorySummary,
      AcademyCategoryFull,
      TView
    >
  > {
    const params = view ? { view } : {}
    const response = await apiClient.get(`/academy_categories/slug/${slug}`, {
      params,
    })
    return response.data
  }

  /**
   * Get all categories with pagination and search
   * @param params - Search and pagination parameters
   * @returns Promise with paginated categories
   */
  async getAllCategories(params?: {
    search?: string
    page?: number
    per_page?: number
  }): Promise<{
    data: AcademyCategory[]
    meta: PaginationMeta
  }> {
    const response = await apiClient.get('/academy_categories', { params })
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
   * Create a new category (requires super admin)
   * @param data - Category data
   * @returns Promise with created category
   */
  async createCategory(data: CreateCategoryRequest): Promise<AcademyCategory> {
    const response = await apiClient.post('/academy_categories', {
      academy_category: data,
    })
    return response.data
  }

  /**
   * Update a category (requires super admin)
   * @param id - Category ID
   * @param data - Updated category data
   * @returns Promise with updated category
   */
  async updateCategory(
    id: number,
    data: UpdateCategoryRequest
  ): Promise<AcademyCategory> {
    const response = await apiClient.patch(`/academy_categories/${id}`, {
      academy_category: data,
    })
    return response.data
  }

  /**
   * Delete a category (requires super admin)
   * @param id - Category ID
   * @returns Promise with success message
   */
  async deleteCategory(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/academy_categories/${id}`)
    return response.data
  }
}

// Export singleton instance
const academyCategoryService = new AcademyCategoryService()
export default academyCategoryService

// Also export as named export
export { academyCategoryService }
