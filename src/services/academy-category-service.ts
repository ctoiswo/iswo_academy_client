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
  academies: Array<{
    id: number
    name: string
    slug: string
    monthly_price: string
  }>
  created_at: string
  updated_at: string
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
}

// Export singleton instance
const academyCategoryService = new AcademyCategoryService()
export default academyCategoryService

// Also export as named export
export { academyCategoryService }
