import apiClient from '@/lib/api-client'
import type { ViewMode } from '@/lib/api-view-modes'
import { withView } from '@/lib/api-view-modes'

// TypeScript interfaces for Academy Categories

// Minimal view - only essential fields
export interface AcademyCategoryMinimal {
  id: number
  name: string
  slug: string
}

// Summary view - key fields without full relations
export interface AcademyCategorySummary extends AcademyCategoryMinimal {
  description: string
}

// Full view - all fields including relations
export interface AcademyCategory extends AcademyCategorySummary {
  academies_count: number
  academies?: Array<{
    id: number
    name: string
    slug: string
    monthly_price: string
  }>
  created_at: string
  updated_at: string
}

export interface CreateAcademyCategoryData {
  name: string
  description: string
  slug?: string
}

export interface UpdateAcademyCategoryData {
  name?: string
  description?: string
  slug?: string
}

interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

/**
 * Academy Category Service
 * Handles all academy category related API calls
 */
class AcademyCategoryService {
  /**
   * Get all academy categories
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
   * @returns Promise with array of categories
   */
  async getCategories<T extends ViewMode = 'full'>(
    view?: T
  ): Promise<T extends 'minimal' ? AcademyCategoryMinimal[] : T extends 'summary' ? AcademyCategorySummary[] : AcademyCategory[]> {
    const params = withView({}, view)
    const response = await apiClient.get('/academy_categories', { params })
    return response.data.categories || response.data
  }

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
   * @returns Promise with category details
   */
  async getCategoryById<T extends ViewMode = 'full'>(
    id: string | number,
    view?: T
  ): Promise<T extends 'minimal' ? AcademyCategoryMinimal : T extends 'summary' ? AcademyCategorySummary : AcademyCategory> {
    const params = withView({}, view)
    const response = await apiClient.get(`/academy_categories/${id}`, { params })
    return response.data
  }

  /**
   * Get a single category by slug
   * @param slug - Category slug
   * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
   * @returns Promise with category details
   */
  async getCategoryBySlug<T extends ViewMode = 'full'>(
    slug: string,
    view?: T
  ): Promise<T extends 'minimal' ? AcademyCategoryMinimal : T extends 'summary' ? AcademyCategorySummary : AcademyCategory> {
    const params = withView({}, view)
    const response = await apiClient.get(`/academy_categories/slug/${slug}`, { params })
    return response.data
  }

  // Admin Methods (requires authentication, Pundit handles authorization)

  /**
   * Get all categories with pagination and search (authenticated users get more features)
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
      data: Array.isArray(response.data) ? response.data : response.data.data || [],
      meta: response.data.meta || {
        current_page: 1,
        total_pages: 1,
        total_count: Array.isArray(response.data) ? response.data.length : 0,
        per_page: params?.per_page || 15
      }
    }
  }

  /**
   * Get a category by ID (requires authentication)
   */
  async getCategoryByIdAdmin(id: number): Promise<AcademyCategory> {
    const response = await apiClient.get(`/academy_categories/${id}`)
    return response.data
  }

  /**
   * Create a new category (requires super admin)
   */
  async createCategory(data: CreateAcademyCategoryData): Promise<AcademyCategory> {
    const response = await apiClient.post('/academy_categories', {
      academy_category: data
    })
    return response.data
  }

  /**
   * Update a category (requires super admin)
   */
  async updateCategory(id: number, data: UpdateAcademyCategoryData): Promise<AcademyCategory> {
    const response = await apiClient.patch(`/academy_categories/${id}`, {
      academy_category: data
    })
    return response.data
  }

  /**
   * Delete a category (requires super admin)
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
